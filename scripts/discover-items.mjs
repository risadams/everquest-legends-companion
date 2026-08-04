// Finds classic-era items on eqlwiki.com that the curated catalog in
// src/data/gear.ts does not cover yet, and ranks them per equipment slot.
//
//   node scripts/discover-items.mjs [--slot NECK] [--limit 12] [<api>]
//
// Report-only by design: it writes docs/reports/item-candidates.md and prints a
// summary, and never touches gear.ts. Following the spec's governing principle,
// a human decides which candidates are worth curating prose for.
//
// The wiki has CirrusSearch disabled, so this walks Category:Items ∩
// Category:Classic Era and parses each {{Itempage}} statsblock directly. Only
// items that drop in a zone the Atlas actually ships are proposed — an item
// gated behind an unreleased era is noise, not a gap.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GEAR_TS = join(ROOT, 'src', 'data', 'gear.ts');
const ZONES_DIR = join(ROOT, 'src', 'data', 'zones');
const OUT = join(ROOT, 'docs', 'reports', 'item-candidates.md');

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const ONLY_SLOT = arg('--slot', null)?.toUpperCase() ?? null;
const PER_SLOT = Number(arg('--limit', '12'));
const API = argv.find((a) => a.startsWith('http')) ?? 'https://eqlwiki.com/api.php';

async function api(params) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json' })}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'eql-companion item discovery' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/** every page in a category, following continuation */
async function categoryMembers(category) {
  const out = new Set();
  let cont;
  do {
    const j = await api({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: '500',
      cmnamespace: '0',
      ...(cont ? { cmcontinue: cont } : {})
    });
    for (const m of j.query?.categorymembers ?? []) out.add(m.title);
    cont = j.continue?.cmcontinue;
  } while (cont);
  return out;
}

/** wikitext for up to 50 titles at a time */
async function fetchWikitext(titles) {
  const out = new Map();
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const j = await api({
      action: 'query',
      prop: 'revisions',
      rvprop: 'content',
      rvslots: 'main',
      titles: batch.join('|')
    });
    for (const page of Object.values(j.query?.pages ?? {})) {
      const text = page.revisions?.[0]?.slots?.main?.['*'];
      if (text) out.set(page.title, text);
    }
    process.stdout.write(`\r  fetched ${Math.min(i + 50, titles.length)}/${titles.length}`);
  }
  process.stdout.write('\n');
  return out;
}

const FLAGS = [
  'MAGIC ITEM', 'LORE ITEM', 'NO DROP', 'NO TRADE', 'TEMPORARY', 'QUEST ITEM',
  'ARTIFACT', 'ATTUNEABLE', 'PRESTIGE', 'EXPENDABLE', 'NO RENT', 'AUGMENTATION'
];

function parseItem(text) {
  const block = /\|\s*statsblock\s*=([\s\S]*?)\n\|/.exec(text)?.[1] ?? '';
  const clean = block
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const line = (re) => clean.map((l) => re.exec(l)?.[1]).find(Boolean);
  const drops = /\|\s*dropsfrom\s*=([\s\S]*?)\n\}\}/.exec(text)?.[1] ?? '';
  const zone = /\[\[([^\]|]+)\]\]/.exec(drops)?.[1];
  const mobs = [...drops.matchAll(/^\s*\*\s*\[\[([^\]|]+)/gm)].map((m) => m[1]);
  return {
    slot: line(/^Slot:\s*(.+)$/i) ?? null,
    ac: line(/^AC:\s*(\d+)/i) ?? null,
    effect: line(/^Effect:\s*(.+?)\s*$/i) ?? null,
    haste: line(/^Haste:\s*\+?(\d+)/i) ?? null,
    classes: line(/^Class:\s*(.+)$/i) ?? null,
    damage: line(/^(?:Skill|DMG):?\s*(.+)$/i) ?? null,
    stats: clean.filter((l) => /^(STR|STA|AGI|DEX|WIS|INT|CHA|HP|MANA|SV)/i.test(l)).join(' '),
    flags: FLAGS.filter((f) => clean[0]?.includes(f)),
    zone,
    mobs
  };
}

/** what a curated entry is worth: effects and raw stats beat plain vendor junk */
function score(item) {
  let s = 0;
  if (item.effect) s += 40;
  if (item.haste) s += 30 + Number(item.haste);
  if (item.ac) s += Math.min(30, Number(item.ac));
  s += Math.min(40, (item.stats.match(/[+-]\d+/g) ?? []).length * 6);
  if (item.flags.includes('NO DROP')) s -= 5;
  if (item.mobs.length) s += 10;
  return s;
}

// ── existing coverage ──────────────────────────────────────
const gearSrc = readFileSync(GEAR_TS, 'utf8');
const curated = new Set(
  [...gearSrc.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1].toLowerCase())
);
const zoneNames = new Map(); // lowercase wiki zone name -> app zone id
for (const f of readdirSync(ZONES_DIR)) {
  if (!f.endsWith('.ts') || f === 'index.ts') continue;
  const src = readFileSync(join(ZONES_DIR, f), 'utf8');
  const ids = [...src.matchAll(/id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/g)];
  for (const [, id, name] of ids) zoneNames.set(name.replace(/’/g, "'").toLowerCase(), id);
}

console.log(`Curated: ${curated.size} items · Atlas: ${zoneNames.size} zones`);
console.log('Listing Category:Items ∩ Category:Classic Era …');
const [items, classic] = await Promise.all([
  categoryMembers('Items'),
  categoryMembers('Classic Era')
]);
const candidates = [...items].filter((t) => classic.has(t) && !curated.has(t.toLowerCase()));
console.log(`  ${items.size} items, ${classic.size} classic-era pages, ${candidates.length} to check`);

const texts = await fetchWikitext(candidates);

const bySlot = new Map();
let inAtlas = 0;
for (const [title, text] of texts) {
  const item = parseItem(text);
  if (!item.slot) continue;
  const zoneId = item.zone ? zoneNames.get(item.zone.replace(/’/g, "'").toLowerCase()) : undefined;
  if (!zoneId) continue; // drops somewhere the Atlas does not ship
  inAtlas++;
  for (const slot of item.slot.split(/\s+/).filter(Boolean)) {
    if (ONLY_SLOT && slot !== ONLY_SLOT) continue;
    if (!bySlot.has(slot)) bySlot.set(slot, []);
    bySlot.get(slot).push({ title, zoneId, ...item, score: score(item) });
  }
}

const slots = [...bySlot.keys()].sort();
let md = `# Item candidates — classic-era wiki items not in gear.ts\n\n`;
md += `Generated ${new Date().toISOString().slice(0, 10)} from ${API}.\n\n`;
md += `${candidates.length} uncurated classic items checked; ${inAtlas} drop in a live Atlas zone.\n`;
md += `Ranked by how much a curated entry would add (effects, haste, AC, stat lines).\n\n`;
for (const slot of slots) {
  const rows = bySlot.get(slot).sort((a, b) => b.score - a.score).slice(0, PER_SLOT);
  md += `## ${slot}\n\n| item | zone | drops from | stats | flags |\n|---|---|---|---|---|\n`;
  for (const r of rows) {
    const stats = [
      r.damage && `${r.damage}`,
      r.ac && `AC ${r.ac}`,
      r.haste && `Haste ${r.haste}%`,
      r.effect && `Effect: ${r.effect}`,
      r.stats
    ]
      .filter(Boolean)
      .join('; ');
    md += `| [${r.title}](https://eqlwiki.com/${encodeURIComponent(r.title.replace(/ /g, '_'))}) `;
    md += `| ${r.zoneId} | ${r.mobs.join(', ') || '—'} | ${stats || '—'} | ${r.flags.join(' ')} |\n`;
  }
  md += '\n';
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md);
console.log(`\nWrote ${OUT}`);
for (const slot of slots) console.log(`  ${slot.padEnd(12)} ${bySlot.get(slot).length} candidates`);
