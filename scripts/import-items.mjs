// Harvests item stats from eqlwiki.com and cross-checks them against the curated
// notable-gear list in src/data/gear.ts.
//
//   node scripts/import-items.mjs
//
// The EQL Wiki's {{Itempage}} template is authoritative for Legends itemization
// (slot, damage/delay, AC, attributes, resists, haste, click/worn effect, class &
// race masks, and where the item drops). This importer:
//   1. reads the curated GEAR entries (id/name/slot/zoneId/monsterId) from gear.ts,
//   2. fetches each item's wikitext and parses the statsblock + dropsfrom,
//   3. writes structured stats to  src/data/items-harvested.json  (keyed by id), and
//   4. writes a review diff to     docs/reports/item-import.md.
//
// It never rewrites gear.ts: curated prose (notable/farm) and editorial choices stay
// authoritative until a human folds the harvested numbers in. Following the spec's
// governing principle — harvest values, emit a diff, let a human commit.
//
// No new npm deps (Node global fetch, node: builtins only). Source API overridable
// via argv[2] (default https://eqlwiki.com/api.php) for a mirror/offline snapshot.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GEAR_TS = join(ROOT, 'src', 'data', 'gear.ts');
const ZONES_DIR = join(ROOT, 'src', 'data', 'zones');
const OUT_JSON = join(ROOT, 'src', 'data', 'items-harvested.json');
const OUT_REPORT = join(ROOT, 'docs', 'reports', 'item-import.md');
const API = process.argv[2] ?? 'https://eqlwiki.com/api.php';

// Known item-flag tokens that share the statsblock's first line(s).
const FLAGS = [
  'MAGIC ITEM', 'LORE ITEM', 'NO DROP', 'NO TRADE', 'TEMPORARY', 'QUEST ITEM',
  'ARTIFACT', 'ATTUNEABLE', 'PRESTIGE', 'EXPENDABLE', 'NO RENT', 'AUGMENTATION'
];
const ATTRS = ['STR', 'STA', 'AGI', 'DEX', 'WIS', 'INT', 'CHA', 'HP', 'MANA', 'ENDUR', 'ATK'];
const RESISTS = ['MAGIC', 'FIRE', 'COLD', 'DISEASE', 'POISON', 'CORRUPTION'];

// ── fetch ────────────────────────────────────────────────────

async function fetchWikitext(page) {
  const url = `${API}?action=parse&page=${encodeURIComponent(page)}&format=json&prop=wikitext|categories&redirects=1`;
  const res = await fetch(url, { headers: { 'user-agent': 'eql-companion-importer' } });
  const json = await res.json();
  if (json.error) return { error: `${json.error.code}: ${json.error.info}` };
  const cats = (json.parse.categories ?? []).map((c) => (c['*'] ?? '').replace(/_/g, ' '));
  const era = cats.filter((c) => /\bEra$/.test(c)).map((c) => c.replace(/ Era$/, ''));
  return { wikitext: json.parse.wikitext['*'], title: json.parse.title, era };
}

/** The Atlas's live classic zones — the only places a player can currently farm. */
function readLiveZones() {
  const ids = new Set();
  const names = new Set();
  for (const f of readdirSync(ZONES_DIR)) {
    if (!f.endsWith('.ts') || f === 'index.ts') continue;
    const src = readFileSync(join(ZONES_DIR, f), 'utf8');
    for (const m of src.matchAll(/id:\s*'([^']+)'/g)) ids.add(m[1]);
    for (const m of src.matchAll(/name:\s*'([^']+)'/g)) names.add(norm(m[1]));
  }
  return { ids, names };
}

// ── read curated gear.ts (id/name/slot/zoneId/monsterId/levelMin) ──

function readCuratedGear() {
  const src = readFileSync(GEAR_TS, 'utf8');
  const from = src.indexOf('export const GEAR');
  const body = src.slice(from, src.indexOf('\n];', from));
  const field = (block, re) => (block.match(re)?.[1] ?? undefined);
  const items = [];
  for (const m of body.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?\n  \}/g)) {
    const block = m[0];
    items.push({
      id: m[1],
      name: field(block, /name:\s*'([^']*)'/),
      slot: field(block, /slot:\s*'([^']*)'/),
      zoneId: field(block, /zoneId:\s*'([^']*)'/),
      monsterId: field(block, /monsterId:\s*'([^']*)'/),
      source: field(block, /source:\s*'([^']*)'/),
      levelMin: Number(field(block, /levelMin:\s*(\d+)/) ?? 0)
    });
  }
  return items;
}

// ── wiki markup helpers ──────────────────────────────────────

/** replace [[a|b]]→b, [[a]]→a, strip tags and bold ticks (keep line text) */
function linkText(s) {
  return (s ?? '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]|]*)\]\]/g, '$1')
    .replace(/<span[^>]*>|<\/span>/gi, '')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/** Extract the {{Itempage ...}} template's raw named params (values un-cleaned). */
function parseItempage(wikitext) {
  const marker = '{{Itempage';
  const idx = wikitext.indexOf(marker);
  if (idx === -1) return null;
  let depth = 0, end = -1;
  for (let i = idx; i < wikitext.length - 1; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') { depth++; i++; }
    else if (wikitext[i] === '}' && wikitext[i + 1] === '}') { depth--; i++; if (depth === 0) { end = i + 1; break; } }
  }
  const inner = wikitext.slice(idx + marker.length, end - 2);
  // split on top-level pipes (ignore pipes nested in {{ }} or [[ ]])
  const parts = [];
  let d = 0, b = 0, cur = '';
  for (let i = 0; i < inner.length; i++) {
    const two = inner.slice(i, i + 2);
    if (two === '{{') { d++; cur += two; i++; continue; }
    if (two === '}}') { d--; cur += two; i++; continue; }
    if (two === '[[') { b++; cur += two; i++; continue; }
    if (two === ']]') { b--; cur += two; i++; continue; }
    if (inner[i] === '|' && d === 0 && b === 0) { parts.push(cur); cur = ''; continue; }
    cur += inner[i];
  }
  parts.push(cur);
  const params = {};
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    params[p.slice(0, eq).trim()] = p.slice(eq + 1).trim();
  }
  return params;
}

/** Parse the raw statsblock text into structured stats. */
function parseStatsblock(raw) {
  const out = { flags: [], stats: {}, resists: {} };
  const lines = raw
    .split(/<br\s*\/?\s*>|\n/i)
    .map((l) => linkText(l))
    .filter((l) => l !== '');
  for (const line of lines) {
    let m;
    if ((m = line.match(/^Slot:\s*(.+)/i))) { out.slot = m[1].trim(); continue; }
    if ((m = line.match(/^Skill:\s*(.+?)(?:\s{2,}Atk Delay:\s*(\d+))?\s*$/i))) {
      out.skill = m[1].trim();
      if (m[2]) out.atkDelay = Number(m[2]);
      continue;
    }
    if ((m = line.match(/Atk Delay:\s*(\d+)/i))) { out.atkDelay = Number(m[1]); continue; }
    if ((m = line.match(/^DMG:\s*(\d+)/i))) { out.dmg = Number(m[1]); continue; }
    if ((m = line.match(/^AC:\s*(\d+)/i))) { out.ac = Number(m[1]); continue; }
    if ((m = line.match(/Haste:\s*\+?(\d+)\s*%/i))) { out.haste = Number(m[1]); continue; }
    if ((m = line.match(/^Effect:\s*(.+?)\s*\(([^,)]+)(?:,[^)]*)?\)(?:\s*at Level\s*(\d+))?/i))) {
      out.effect = { name: m[1].trim(), type: m[2].trim(), ...(m[3] ? { level: Number(m[3]) } : {}) };
      continue;
    }
    if ((m = line.match(/^Class:\s*(.+)/i))) { out.classesRaw = m[1].trim(); continue; }
    if ((m = line.match(/^Race:\s*(.+)/i))) { out.racesRaw = m[1].trim(); continue; }
    if (/WT:\s*[\d.]+/i.test(line) || /Size:\s*\w+/i.test(line)) {
      const wt = line.match(/WT:\s*([\d.]+)/i);
      const sz = line.match(/Size:\s*(\w+)/i);
      if (wt) out.wt = Number(wt[1]);
      if (sz) out.size = sz[1].toUpperCase();
      continue;
    }
    // flag-only line (no colon): collect any recognised flags
    if (!line.includes(':')) {
      for (const f of FLAGS) if (line.includes(f)) out.flags.push(f);
      continue;
    }
    // attribute / save fallback: STR: +6  STA: +6  HP: +20 / SV FIRE: +5
    for (const a of ATTRS) {
      const r = new RegExp(`\\b${a}\\s*:\\s*([+-]?\\d+)`).exec(line);
      if (r) out.stats[a] = Number(r[1]);
    }
    for (const rz of RESISTS) {
      const r = new RegExp(`SV\\s+${rz}\\s*:\\s*([+-]?\\d+)`, 'i').exec(line);
      if (r) out.resists[rz] = Number(r[1]);
    }
  }
  if (Object.keys(out.stats).length === 0) delete out.stats;
  if (Object.keys(out.resists).length === 0) delete out.resists;
  if (out.flags.length === 0) delete out.flags;
  return out;
}

/** Parse dropsfrom: leading zone links, then bulleted mob links. */
function parseDropsFrom(raw) {
  if (!raw) return undefined;
  const noLonger = /no longer drops/i.test(raw);
  const bulletMobs = [...raw.matchAll(/^\s*\*\s*(.+)$/gm)].map((m) => linkText(m[1]));
  // zones = wiki-linked lines that are not bullets
  const zones = [];
  for (const line of raw.split('\n')) {
    if (/^\s*\*/.test(line)) continue;
    const t = linkText(line);
    if (t && /\[\[/.test(line)) zones.push(t);
  }
  return { zones, mobs: bulletMobs, noLonger, raw: linkText(raw).replace(/\s+/g, ' ').trim() };
}

// ── diff helpers ─────────────────────────────────────────────

const norm = (s) => (s ?? '').toLowerCase().replace(/^(a|an|the)\s+/, '').replace(/[^a-z0-9]/g, '');

// map a wiki Slot string to the curated GearSlot vocabulary (best-effort, for diffing)
function wikiSlotToGear(slot) {
  if (!slot) return undefined;
  const s = slot.toUpperCase();
  if (/PRIMARY|RANGE/.test(s)) return 'weapon';
  if (/SECONDARY/.test(s)) return 'weapon/shield';
  const map = {
    HEAD: 'head', CHEST: 'chest', ARMS: 'arms', HANDS: 'hands', WRIST: 'wrist',
    LEGS: 'legs', FEET: 'feet', NECK: 'neck', BACK: 'back', WAIST: 'waist',
    FACE: 'face', EAR: 'ears', EARS: 'ears', FINGERS: 'fingers', FINGER: 'fingers'
  };
  for (const k of Object.keys(map)) if (s.includes(k)) return map[k];
  return s.toLowerCase();
}

// ── main ─────────────────────────────────────────────────────

const curated = readCuratedGear();
const live = readLiveZones();
console.log(`Read ${curated.length} curated gear entries; ${live.ids.size} live Atlas zones`);

const harvested = {};
const rows = [];

for (const g of curated) {
  const page = g.name.replace(/ /g, '_');
  const { wikitext, error, title, era } = await fetchWikitext(page);
  if (error || !wikitext) {
    rows.push({ g, missing: error ?? 'no wikitext' });
    console.log(`  ✗ ${g.name} — ${error ?? 'no wikitext'}`);
    continue;
  }
  const params = parseItempage(wikitext);
  if (!params) {
    rows.push({ g, missing: 'no {{Itempage}} (likely a set/category page, not a single item)' });
    console.log(`  ~ ${g.name} — no {{Itempage}} (set/category page?)`);
    continue;
  }
  const stats = parseStatsblock(params.statsblock ?? '');
  const drops = parseDropsFrom(params.dropsfrom);
  const quests = params.relatedquests
    ? [...params.relatedquests.matchAll(/^\s*\*\s*(.+)$/gm)].map((m) => linkText(m[1])).filter(Boolean)
    : undefined;
  // Is the wiki's drop zone a zone the Atlas actually ships (i.e. currently farmable)?
  // Tolerant match: Atlas names carry suffixes (e.g. "Nagafen's Lair (Sol B)"), so accept
  // containment in either direction after normalising.
  const zoneIsLive = (z) => {
    const n = norm(z);
    return n.length > 3 && [...live.names].some((ln) => ln === n || ln.includes(n) || n.includes(ln));
  };
  const dropZonesLive = (drops?.zones ?? []).map((z) => ({ zone: z, live: zoneIsLive(z) }));
  const farmableNow = drops?.noLonger ? false
    : dropZonesLive.length ? dropZonesLive.some((z) => z.live)
    : quests?.length ? true : undefined;
  const rec = {
    id: g.id,
    name: params.itemname ?? g.name,
    wikiTitle: title,
    era: era?.length ? era : undefined,
    lucyId: params.lucy_img_ID ? Number(params.lucy_img_ID) : undefined,
    merchantValue: params.merchant_value,
    ...stats,
    ...(quests?.length ? { quests } : {}),
    drops,
    farmableNow
  };
  harvested[g.id] = rec;
  rows.push({ g, rec });
  console.log(`  ✓ ${g.name}`);
}

writeFileSync(OUT_JSON, JSON.stringify(harvested, null, 2));

// ── build the review report ──────────────────────────────────

const flag = (cond, s) => (cond ? `**${s}**` : s);
const lines = [];
lines.push('# Item import — EQL Wiki cross-check report', '');
lines.push(`Source: \`${API}\` (\`{{Itempage}}\` statsblock + dropsfrom)  ·  generated ${new Date().toISOString().slice(0, 10)}`, '');
lines.push(
  'The EQL Wiki is authoritative for Legends itemization. This validates the curated notable-gear',
  'list against the wiki and surfaces the stats curated data does not yet carry (haste %, AC, damage/delay,',
  'attributes, click/worn effects). Curated prose (notable/farm) is never touched — a human folds the',
  'harvested numbers into gear.ts after reviewing the mismatches below.', ''
);

// summary table
lines.push('## Summary', '');
lines.push(
  '`farmable now?` = does the wiki drop zone (or a quest) exist in the live classic Atlas.',
  '**no** ⇒ Legends currently sources it from a not-yet-live (e.g. Kunark) zone — do NOT relocate',
  'the curated entry into a zone players cannot visit; correct stats only and leave a review flag.', ''
);
lines.push('| item | era | farmable now? | slot | drop zone | drop mob | flags | curated is missing |',
  '|---|---|---|---|---|---|---|---|');
let mismatches = 0;
for (const { g, rec, missing } of rows) {
  if (missing) { lines.push(`| ${g.name} | — | — | — | — | — | — | ⚠ ${missing} |`); continue; }
  const farm = rec.farmableNow === false ? '**no**' : rec.farmableNow === true ? 'yes' : '?';
  const eraCol = rec.era?.join(', ') ?? '—';
  const wSlot = wikiSlotToGear(rec.slot);
  const slotBad = wSlot && g.slot && !wSlot.split('/').includes(g.slot) && wSlot !== g.slot;
  const zones = rec.drops?.zones ?? [];
  const zoneBad = zones.length && g.zoneId && !zones.some((z) => norm(z) === norm(g.zoneId));
  const mobs = rec.drops?.mobs ?? [];
  const mobBad = mobs.length && (g.monsterId || g.source) &&
    !mobs.some((mb) => norm(mb) === norm(g.monsterId) || norm(g.source).includes(norm(mb)));
  if (slotBad || zoneBad || mobBad || rec.drops?.noLonger) mismatches++;
  const missingStats = [];
  if (rec.haste != null) missingStats.push(`Haste ${rec.haste}%`);
  if (rec.ac != null) missingStats.push(`AC ${rec.ac}`);
  if (rec.dmg != null) missingStats.push(`${rec.dmg}/${rec.atkDelay ?? '?'} ${rec.skill ?? ''}`.trim());
  if (rec.effect) missingStats.push(`Effect: ${rec.effect.name}`);
  if (rec.stats) missingStats.push(Object.entries(rec.stats).map(([k, v]) => `${k}${v > 0 ? '+' : ''}${v}`).join(' '));
  lines.push(
    `| ${g.name}` +
    ` | ${eraCol}` +
    ` | ${farm}` +
    ` | ${flag(slotBad, `${g.slot} → ${rec.slot}`)}` +
    ` | ${flag(zoneBad, `${g.zoneId} → ${zones.join(', ') || '—'}`)}` +
    ` | ${flag(mobBad, `${mobs.join(', ') || '—'}`)}` +
    ` | ${rec.drops?.noLonger ? '**NO LONGER DROPS**' : (rec.flags?.join(' ') ?? '')}` +
    ` | ${missingStats.join('; ')} |`
  );
}

lines.push('', `## Mismatches to reconcile (${mismatches})`, '');
for (const { g, rec, missing } of rows) {
  if (missing) continue;
  const zones = rec.drops?.zones ?? [];
  const mobs = rec.drops?.mobs ?? [];
  const notes = [];
  const wSlot = wikiSlotToGear(rec.slot);
  if (wSlot && g.slot && !wSlot.split('/').includes(g.slot) && wSlot !== g.slot)
    notes.push(`- slot: curated \`${g.slot}\` vs wiki \`${rec.slot}\``);
  if (zones.length && g.zoneId && !zones.some((z) => norm(z) === norm(g.zoneId)))
    notes.push(`- drop zone: curated \`${g.zoneId}\` vs wiki **${zones.join(', ')}**`);
  if (mobs.length && (g.monsterId || g.source) &&
    !mobs.some((mb) => norm(mb) === norm(g.monsterId) || norm(g.source).includes(norm(mb))))
    notes.push(`- drop mob: curated \`${g.monsterId ?? g.source}\` vs wiki **${mobs.join(', ')}**`);
  if (rec.drops?.noLonger) notes.push('- wiki says **No Longer Drops** (source may need re-homing)');
  if (rec.quests?.length && !mobs.length && /drop/i.test(g.source ?? ''))
    notes.push(`- source: curated says it drops, but wiki lists it as **quest-obtained** (${rec.quests.join(', ')})`);
  if (rec.classesRaw) notes.push(`- classes (wiki): \`${rec.classesRaw}\``);
  if (notes.length) lines.push(`### ${g.name}`, ...notes, '');
}

mkdirSync(dirname(OUT_REPORT), { recursive: true });
writeFileSync(OUT_REPORT, lines.join('\n'));

const ok = Object.keys(harvested).length;
console.log(`\nWrote ${OUT_JSON.replace(ROOT + '\\', '')} — ${ok}/${curated.length} items harvested`);
console.log(`Wrote ${OUT_REPORT.replace(ROOT + '\\', '')} — ${mismatches} item(s) with mismatches to reconcile`);
