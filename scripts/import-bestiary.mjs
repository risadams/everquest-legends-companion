// Harvests named-mob stats from eqlwiki.com and cross-checks them against the curated
// Bestiary in src/data/monsters.ts.
//
//   node scripts/import-bestiary.mjs
//
// The EQL Wiki's {{Namedmobpage}} template is authoritative for Legends mob data (level,
// AC, HP, spawn %, respawn timer, aggro radius, special abilities, and a loot table WITH
// drop rates). This importer:
//   1. reads the curated MONSTERS (id/name/zoneId/lvl/loot) from monsters.ts,
//   2. fetches each mob's wikitext and parses the Namedmobpage fields + known_loot,
//   3. writes structured stats to  src/data/bestiary-harvested.json  (keyed by id), and
//   4. writes a review diff to     docs/reports/bestiary-import.md.
//
// It never rewrites monsters.ts: curated prose (where/notes) and editorial choices stay
// authoritative until a human folds the harvested numbers in. Harvest values, emit a diff,
// let a human commit — same discipline as scripts/import-items.mjs.
//
// No new npm deps (Node global fetch, node: builtins only). API base overridable via argv[2].

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MONSTERS_TS = join(ROOT, 'src', 'data', 'monsters.ts');
const ZONES_DIR = join(ROOT, 'src', 'data', 'zones');
const OUT_JSON = join(ROOT, 'src', 'data', 'bestiary-harvested.json');
const OUT_REPORT = join(ROOT, 'docs', 'reports', 'bestiary-import.md');
const API = process.argv[2] ?? 'https://eqlwiki.com/api.php';

const norm = (s) => (s ?? '').toLowerCase().replace(/^(a|an|the)\s+/, '').replace(/[^a-z0-9]/g, '');

// ── fetch (wikitext + era categories) ────────────────────────

async function fetchPage(page) {
  const url = `${API}?action=parse&page=${encodeURIComponent(page)}&format=json&prop=wikitext|categories&redirects=1`;
  const res = await fetch(url, { headers: { 'user-agent': 'eql-companion-importer' } });
  const json = await res.json();
  if (json.error) return { error: `${json.error.code}: ${json.error.info}` };
  const cats = (json.parse.categories ?? []).map((c) => (c['*'] ?? '').replace(/_/g, ' '));
  const era = cats.filter((c) => /\bEra$/.test(c)).map((c) => c.replace(/ Era$/, ''));
  return { wikitext: json.parse.wikitext['*'], title: json.parse.title, era };
}

function readLiveZoneNames() {
  const names = new Set();
  for (const f of readdirSync(ZONES_DIR)) {
    if (!f.endsWith('.ts') || f === 'index.ts') continue;
    for (const m of readFileSync(join(ZONES_DIR, f), 'utf8').matchAll(/name:\s*'([^']+)'/g)) names.add(norm(m[1]));
  }
  return names;
}

// ── read curated monsters.ts ─────────────────────────────────

function readCuratedMonsters() {
  const src = readFileSync(MONSTERS_TS, 'utf8');
  const from = src.indexOf('export const MONSTERS');
  const body = src.slice(from, src.indexOf('\n];', from));
  const items = [];
  for (const m of body.matchAll(/\{\s*id:\s*'([^']+)'[^\n]*\}/g)) {
    const b = m[0];
    const lootRaw = b.match(/loot:\s*\[([^\]]*)\]/)?.[1];
    items.push({
      id: m[1],
      name: b.match(/name:\s*'([^']*)'/)?.[1],
      zoneId: b.match(/zoneId:\s*'([^']*)'/)?.[1],
      lvlMin: Number(b.match(/lvlMin:\s*(\d+)/)?.[1] ?? 0),
      lvlMax: Number(b.match(/lvlMax:\s*(\d+)/)?.[1] ?? 0),
      kind: b.match(/kind:\s*'([^']*)'/)?.[1],
      loot: lootRaw ? [...lootRaw.matchAll(/'([^']*)'/g)].map((x) => x[1]) : []
    });
  }
  return items;
}

// ── wiki markup + template parsing ───────────────────────────

function linkText(s) {
  return (s ?? '')
    .replace(/\{\{:?\s*([^}|]+?)\s*\}\}/g, '$1') // {{:Item}} / {{tpl}} → inner
    .replace(/\[\[(?:[^\]|]*\|)?([^\]|]*)\]\]/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/'''?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract a named template's params. Repeated keys (e.g. multiple `zone=`) accumulate. */
function parseTemplate(wikitext, name) {
  const marker = new RegExp(`\\{\\{\\s*${name}`, 'i');
  const mm = wikitext.match(marker);
  if (!mm) return null;
  const idx = mm.index;
  let depth = 0, end = -1;
  for (let i = idx; i < wikitext.length - 1; i++) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') { depth++; i++; }
    else if (wikitext[i] === '}' && wikitext[i + 1] === '}') { depth--; i++; if (depth === 0) { end = i + 1; break; } }
  }
  const inner = wikitext.slice(idx + mm[0].length, end - 2);
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
    const k = p.slice(0, eq).trim();
    const v = p.slice(eq + 1).trim();
    if (k in params) params[k] = [].concat(params[k], v);
    else params[k] = v;
  }
  return params;
}

const arr = (v) => (v == null ? [] : [].concat(v));
// First numeric token only — fields like "20000 10000" (two versions), "2 (?)", "2,200".
const num = (v) => {
  const t = String(v ?? '').match(/\d[\d,]*(?:\.\d+)?/)?.[0];
  if (!t) return undefined;
  const n = Number(t.replace(/,/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

/** Parse the known_loot <ul><li> list into {name, rarity, rate} rows. */
function parseLoot(raw) {
  if (!raw) return [];
  const rows = [];
  for (const li of String(raw).split(/<\/li>|<li>/i)) {
    const nameM = li.match(/\{\{:?\s*([^}|]+?)\s*\}\}/) ?? li.match(/\[\[(?:[^\]|]*\|)?([^\]|]*)\]\]/);
    if (!nameM) continue;
    const name = nameM[1].trim();
    if (!name) continue;
    const rarity = li.match(/class='drare'>\s*\(([^)]+)\)/)?.[1]
      ?? li.match(/\((Rare|Common|Uncommon|Semi-Rare|Ultra-Rare)\)/i)?.[1];
    const rate = li.match(/\((\d+(?:\.\d+)?%)\)\s*<\/span>/)?.[1]
      ?? li.match(/\((\d+(?:\.\d+)?%)\)\s*$/)?.[1];
    rows.push({ name, ...(rarity ? { rarity } : {}), ...(rate ? { rate } : {}) });
  }
  return rows;
}

// ── main ─────────────────────────────────────────────────────

const curated = readCuratedMonsters();
const liveZones = readLiveZoneNames();
console.log(`Read ${curated.length} curated monsters from monsters.ts`);

const harvested = {};
const rows = [];
let ok = 0;

// Curated uses display names ("The Frenzied Ghoul"); the wiki uses the in-game form
// ("a frenzied ghoul"). Try the display name, then common article-prefixed variants.
function nameVariants(name) {
  const v = new Set([name]);
  const stripped = name.replace(/^(The|A|An)\s+/i, '');
  const lc = stripped.charAt(0).toLowerCase() + stripped.slice(1);
  v.add(`a ${lc}`);
  v.add(`an ${lc}`);
  v.add(stripped);
  return [...v];
}

for (const m of curated) {
  let wikitext, error, era;
  for (const variant of nameVariants(m.name)) {
    ({ wikitext, error, era } = await fetchPage(variant.replace(/ /g, '_')));
    if (wikitext) break;
  }
  if (error || !wikitext) { rows.push({ m, missing: error ?? 'no wikitext' }); continue; }
  const p = parseTemplate(wikitext, 'Namedmobpage');
  if (!p) { rows.push({ m, missing: 'no {{Namedmobpage}} (generic/plural camp, not a single named)' }); continue; }
  const zones = arr(p.zone).map(linkText).filter(Boolean);
  const locations = arr(p.location).map((s) => linkText(s));
  const rec = {
    id: m.id,
    name: linkText(p.name) || m.name,
    era: era?.length ? era : undefined,
    race: linkText(p.race) || undefined,
    class: linkText(p.class) || undefined,
    level: num(p.level),
    ac: num(p.AC),
    hp: num(p.HP),
    aggroRadius: num(p.agro_radius),
    attacksPerRound: p.attacks_per_round ? linkText(p.attacks_per_round) : undefined,
    attackSpeed: p.attack_speed ? String(p.attack_speed).trim() : undefined,
    respawn: p.respawn_time ? String(p.respawn_time).trim() : undefined,
    special: p.special ? linkText(p.special).split(/,\s*/).filter((s) => s && !/^none$/i.test(s)) : undefined,
    zones,
    spawns: locations,
    loot: parseLoot(p.known_loot)
  };
  harvested[m.id] = rec;
  rows.push({ m, rec });
  ok++;
}

writeFileSync(OUT_JSON, JSON.stringify(harvested, null, 2));

// ── report ───────────────────────────────────────────────────

const zoneLive = (z) => { const n = norm(z); return n.length > 3 && [...liveZones].some((ln) => ln === n || ln.includes(n) || n.includes(ln)); };
const lines = [];
lines.push('# Bestiary import — EQL Wiki cross-check report', '');
lines.push(`Source: \`${API}\` (\`{{Namedmobpage}}\`)  ·  generated ${new Date().toISOString().slice(0, 10)}`, '');
lines.push(
  'The EQL Wiki is authoritative for Legends mob data. This validates the curated Bestiary and',
  'surfaces stats it does not carry (level, AC, HP, spawn %, respawn, aggro radius, drop rates).',
  'Curated `where`/`notes` prose is never touched — a human folds harvested numbers into',
  'monsters.ts after reviewing the mismatches. Loot links back to the items harvested by',
  '`import-items.mjs`.', ''
);
lines.push('## Summary', '');
lines.push('| monster | era | wiki zone | lvl (curated→wiki) | HP / AC | respawn | loot (rate) | note |',
  '|---|---|---|---|---|---|---|---|');
let flags = 0;
for (const { m, rec, missing } of rows) {
  if (missing) { lines.push(`| ${m.name} | — | — | — | — | — | — | ⚠ ${missing} |`); continue; }
  const zoneBad = rec.zones.length && m.zoneId && !rec.zones.some((z) => norm(z) === norm(m.zoneId) || zoneLive(z) && norm(z).includes(norm(m.zoneId)));
  const lvlBad = rec.level != null && m.lvlMin && (rec.level < m.lvlMin - 1 || rec.level > m.lvlMax + 1);
  const notLive = rec.zones.length && !rec.zones.some(zoneLive);
  if (zoneBad || lvlBad || notLive) flags++;
  const zTxt = rec.zones.join(', ') || '—';
  const loot = rec.loot.slice(0, 4).map((l) => `${l.name}${l.rate ? ` (${l.rate})` : ''}`).join('; ') || '—';
  const note = [notLive ? '**not-yet-live zone**' : '', rec.era?.includes('Kunark') ? 'Kunark' : ''].filter(Boolean).join(' · ');
  lines.push(
    `| ${m.name}` +
    ` | ${rec.era?.join(', ') ?? '—'}` +
    ` | ${zoneBad ? `**${zTxt}** (curated ${m.zoneId})` : zTxt}` +
    ` | ${lvlBad ? `**${m.lvlMin}-${m.lvlMax} → ${rec.level}**` : `${m.lvlMin}-${m.lvlMax} → ${rec.level ?? '?'}`}` +
    ` | ${rec.hp ?? '?'} / ${rec.ac ?? '?'}` +
    ` | ${rec.respawn ?? '—'}` +
    ` | ${loot}` +
    ` | ${note} |`
  );
}
lines.push('', `_${ok}/${curated.length} monsters matched a wiki page; ${flags} with a zone/level flag to reconcile._`, '');

mkdirSync(dirname(OUT_REPORT), { recursive: true });
writeFileSync(OUT_REPORT, lines.join('\n'));

console.log(`\nWrote ${OUT_JSON.replace(ROOT + '\\', '')} — ${ok}/${curated.length} monsters harvested`);
console.log(`Wrote ${OUT_REPORT.replace(ROOT + '\\', '')} — ${flags} monster(s) flagged`);
