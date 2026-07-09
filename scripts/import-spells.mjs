// Cross-checks and corrects the per-class spell data in src/data/classdata/*.json
// against the EQ Legends client's own spell file (spells_us.txt). The client is
// authoritative for spell mechanics that it encodes; this tool trusts the client's
// VALUES (level, mana) but only after asserting the field COLUMNS against known anchors.
//
//   node scripts/import-spells.mjs [--game <dir>] [--write] [--class <id>]
//
// Default is REPORT-ONLY: writes docs/reports/spell-import.md and prints a summary,
// changing nothing. Pass --write to apply level/mana corrections into the class JSON,
// preserving every curated-only field (kind, target, maxEffect, duration, description,
// school, source, era) and the skills/aas arrays untouched.
//
// Verified against this client build (2026-07-09): spells_us.txt has 173 caret-fields;
// name = idx 1, mana = idx 14, and a 16-field per-class level run starts at idx 36 in
// the order below (1..254 = level required, 255 = class cannot use).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CD_DIR = join(ROOT, 'src', 'data', 'classdata');
const REPORT = join(ROOT, 'docs', 'reports', 'spell-import.md');
const LEGENDS_CAP = 50;

// ── args ─────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, def) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : def;
};
const GAME = opt('--game', 'D:/EverQuest Legends');
const WRITE = flag('--write');
const ONLY = opt('--class', null);

const SPELLS_FILE = join(GAME, 'spells_us.txt');
if (!existsSync(SPELLS_FILE)) {
  console.error(`Cannot find ${SPELLS_FILE}. Pass --game <EQ Legends dir>.`);
  process.exit(1);
}

// ── field layout ─────────────────────────────────────────────
const IDX_NAME = 1;
const IDX_RANGE = 4;   // cast range
const IDX_CAST = 8;    // cast time (ms)
const IDX_RECAST = 10; // recast/reuse timer (ms)
const IDX_MANA = 14;
const IDX_RESIST = 29; // resist type (1 Magic 2 Fire 3 Cold 4 Poison 5 Disease …); verified: Fire Bolt=2, Blast of Cold=3
const IDX_ICON = 75;   // detailed spellbook icon (verified: Blast of Cold=56 = blue snowflake)
const RUN_START = 36;
// per-class level run order (16 classes)
const CLASS_ORDER = [
  'warrior', 'cleric', 'paladin', 'ranger', 'shadow-knight', 'druid', 'monk',
  'bard', 'rogue', 'shaman', 'necromancer', 'wizard', 'magician', 'enchanter',
  'beastlord', 'berserker'
];
const classLevelIdx = (classId) => RUN_START + CLASS_ORDER.indexOf(classId);
const usable = (v) => Number.isInteger(v) && v >= 1 && v <= 254;

// EQ spell names use backticks where apostrophes belong (Al`Kabor); the wiki uses
// real/typographic apostrophes. Normalize both so the name-join lines up.
const norm = (s) => s.toLowerCase().replace(/[`´'’]/g, "'").replace(/\s+/g, ' ').trim();

// ── load client spell rows ───────────────────────────────────
// name(lower) -> [{ name, mana, levels:{classId:levelReq} }]
const byName = new Map();
{
  const text = readFileSync(SPELLS_FILE, 'latin1');
  for (const raw of text.split('\n')) {
    if (!raw) continue;
    const f = raw.split('^');
    if (f.length < RUN_START + 16) continue;
    const name = f[IDX_NAME];
    if (!name) continue;
    const num = (i) => { const v = parseInt(f[i], 10); return Number.isFinite(v) ? v : null; };
    const mana = num(IDX_MANA);
    const icon = num(IDX_ICON);
    const levels = {};
    for (const c of CLASS_ORDER) {
      const v = parseInt(f[classLevelIdx(c)], 10);
      if (usable(v)) levels[c] = v;
    }
    const key = norm(name);
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push({
      name,
      mana,
      icon: icon != null && icon > 0 ? icon : null,
      castMs: num(IDX_CAST),
      recastMs: num(IDX_RECAST),
      range: num(IDX_RANGE),
      resist: num(IDX_RESIST),
      levels
    });
  }
}

// ── field-offset anchor assertions (fail loudly if a patch shifted columns) ──
function anchor(name, classId, expectLevel, expectMana) {
  const recs = (byName.get(name.toLowerCase()) ?? []).filter((r) => r.levels[classId] != null);
  const ok = recs.some((r) => r.levels[classId] === expectLevel && r.mana === expectMana);
  if (!ok) {
    console.error(
      `ANCHOR FAILED: ${name} (${classId}) expected level ${expectLevel}, mana ${expectMana}. ` +
      `Field offsets have shifted — do not trust this run. Got: ` +
      JSON.stringify(recs.map((r) => ({ lvl: r.levels[classId], mana: r.mana })))
    );
    process.exit(2);
  }
}
anchor('Blast of Cold', 'wizard', 1, 8);
anchor('Frost Bolt', 'wizard', 1, 6);
anchor('Minor Shielding', 'wizard', 1, 10);

// ── class-aware match: the client row castable by THIS class ──
function matchForClass(spellName, classId) {
  const recs = (byName.get(norm(spellName)) ?? []).filter(
    (r) => r.levels[classId] != null
  );
  if (recs.length === 0) return { status: 'absent' };
  // collapse ranks that share the same class level; collision only if levels differ
  const levels = [...new Set(recs.map((r) => r.levels[classId]))];
  const pick = recs.reduce((a, b) => (b.levels[classId] < a.levels[classId] ? b : a));
  // icon is per-spell, not per-class; fall back to any row for the name that has one
  const icon = pick.icon ?? recs.find((r) => r.icon != null)?.icon ?? null;
  return {
    status: 'found',
    level: pick.levels[classId],
    mana: pick.mana,
    icon,
    castMs: pick.castMs,
    recastMs: pick.recastMs,
    range: pick.range,
    resist: pick.resist,
    collision: levels.length > 1 ? levels.sort((a, b) => a - b) : null
  };
}

// ── walk each class file ─────────────────────────────────────
const CLASS_FILES = CLASS_ORDER.filter((c) => (ONLY ? c === ONLY : true));
const report = [];
const summary = [];
report.push('# Spell import — client cross-check report', '');
report.push(`Source: \`${SPELLS_FILE}\`  ·  generated ${new Date().toISOString().slice(0, 10)}`, '');
report.push(
  'The EQ Legends client is authoritative for the values it encodes (level, mana), so ' +
  'this validates the curated player-spell data against the game\'s own files. Note the ' +
  'client ships the full **Live EQ** spell table — Legends enables a subset, and the ' +
  'curated wiki data already captures exactly that subset. The client can therefore ' +
  'validate and enrich the spells Legends has, but cannot decide which spells Legends ' +
  'has: the curated roster stays authoritative for membership. Curated-only fields ' +
  '(kind/effect/duration/description/school/source/era) are never touched.', ''
);

let totLevelFix = 0, totManaFix = 0, totAbsent = 0, totMissing = 0, totCollision = 0;
let totIcon = 0, totIconMissing = 0;

for (const classId of CLASS_FILES) {
  const file = join(CD_DIR, `${classId}.json`);
  if (!existsSync(file)) continue;
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const curated = data.spells ?? [];
  const curatedNames = new Set(curated.map((s) => norm(s.name)));

  const levelFixes = [], manaFixes = [], absent = [], collisions = [];
  let iconSet = 0, iconMissing = 0;

  for (const s of curated) {
    const m = matchForClass(s.name, classId);
    if (m.status === 'absent') { absent.push(s.name); continue; }
    if (m.collision) collisions.push(`${s.name} (client levels ${m.collision.join('/')})`);
    if (Number(s.level) !== m.level) {
      levelFixes.push({ name: s.name, from: s.level, to: m.level });
      if (WRITE) s.level = m.level;
    }
    const curMana = parseInt(s.mana, 10);
    if (m.mana != null && Number.isFinite(curMana) && curMana !== m.mana) {
      manaFixes.push({ name: s.name, from: s.mana, to: String(m.mana) });
      if (WRITE) s.mana = String(m.mana);
    }
    if (m.icon != null) { iconSet++; if (WRITE) s.icon = m.icon; }
    else iconMissing++;
    if (WRITE) {
      // new client-sourced combat fields; omit zero/self defaults to keep JSON lean.
      // clear-then-set so re-runs stay idempotent (fields may drop below threshold).
      delete s.recastMs; delete s.range; delete s.resist;
      if (m.castMs != null) s.castMs = m.castMs;
      // recast only when it's a genuine long reuse timer (>=6s and longer than the
      // cast) — sub-6s "recasts" are effectively the global cooldown and just noise
      if (m.recastMs && m.recastMs >= 6000 && m.recastMs > (m.castMs ?? 0)) s.recastMs = m.recastMs;
      if (m.range) s.range = m.range;
      if (m.resist) s.resist = m.resist;
    }
  }

  // client spells castable by this class at <=50, missing from curated
  const missing = [];
  for (const [, recs] of byName) {
    for (const r of recs) {
      const lvl = r.levels[classId];
      if (lvl != null && lvl <= LEGENDS_CAP && !curatedNames.has(norm(r.name))) {
        missing.push({ name: r.name, level: lvl, mana: r.mana });
        break;
      }
    }
  }
  missing.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  if (WRITE && (levelFixes.length || manaFixes.length || iconSet)) {
    writeFileSync(file, JSON.stringify(data));
  }

  totLevelFix += levelFixes.length;
  totManaFix += manaFixes.length;
  totAbsent += absent.length;
  totMissing += missing.length;
  totCollision += collisions.length;
  totIcon += iconSet;
  totIconMissing += iconMissing;
  summary.push(
    `| ${classId} | ${curated.length} | ${iconSet}${iconMissing ? `/${iconSet + iconMissing}` : ''} | ` +
    `${levelFixes.length} | ${manaFixes.length} | ` +
    `${absent.length} | ${missing.length} | ${collisions.length} |`
  );

  // per-class report section
  report.push(`## ${classId}`, '');
  if (levelFixes.length) {
    report.push('**Level corrections (client wins):**');
    for (const f of levelFixes) report.push(`- ${f.name}: ${f.from} → ${f.to}`);
    report.push('');
  }
  if (manaFixes.length) {
    report.push('**Mana corrections (client wins — review, some may be curation errors):**');
    for (const f of manaFixes) report.push(`- ${f.name}: ${f.from} → ${f.to}`);
    report.push('');
  }
  if (collisions.length) {
    report.push('**Name collisions (multiple client rows for this class — picked lowest level):**');
    for (const c of collisions) report.push(`- ${c}`);
    report.push('');
  }
  if (absent.length) {
    report.push(`**Curated spells the client has no ${classId} row for (${absent.length}):**`);
    report.push(absent.map((n) => `\`${n}\``).join(', '), '');
  }
  if (missing.length) {
    report.push(`**Client ${classId} rows ≤${LEGENDS_CAP} not in curated (${missing.length}) — Live superset, mostly NOT Legends content; do NOT bulk-add:**`);
    report.push('_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._', '');
    for (const m of missing) report.push(`- L${m.level} ${m.name}${m.mana != null ? ` (${m.mana} mana)` : ''}`);
    report.push('');
  }
  if (!levelFixes.length && !manaFixes.length && !absent.length && !missing.length && !collisions.length) {
    report.push('_Fully in sync with the client._', '');
  }
}

// summary table at top of file
const head = [
  '', '## Summary', '',
  '| class | curated | icons | level fixes | mana fixes | absent-in-client | live-superset | collisions |',
  '|---|--:|--:|--:|--:|--:|--:|--:|',
  ...summary,
  `| **total** | | **${totIcon}${totIconMissing ? `/${totIcon + totIconMissing}` : ''}** | **${totLevelFix}** | **${totManaFix}** | **${totAbsent}** | **${totMissing}** | **${totCollision}** |`,
  ''
];
report.splice(6, 0, ...head);

mkdirSync(dirname(REPORT), { recursive: true });
writeFileSync(REPORT, report.join('\n'));

console.log(WRITE ? 'APPLIED corrections.' : 'REPORT-ONLY (no files changed). Pass --write to apply.');
console.log(`  level fixes: ${totLevelFix}   mana fixes: ${totManaFix}`);
console.log(`  curated absent-in-client: ${totAbsent}   client missing-from-curated: ${totMissing}   collisions: ${totCollision}`);
console.log(`  report: ${REPORT}`);
