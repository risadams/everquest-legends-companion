import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Regenerates src/data/buildNames.ts from Class-Builds.md, the hand-maintained
// list of build names. Rows look like:
//
//   1. Berserker / Monk / Rogue — **Red Lotus**
//
// Anything else in the file (headings, prose, notes) is ignored, so the source
// stays a readable document. Validates that all 560 unordered trios
// (16 choose 3) are present exactly once and that no two share a name.
const here = dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2] ?? join(here, '..', 'Class-Builds.md');
const OUT = process.argv[3] ?? join(here, '..', 'src', 'data', 'buildNames.ts');

const ID_BY_NAME = {
  Enchanter: 'enchanter',
  Magician: 'magician',
  Necromancer: 'necromancer',
  Wizard: 'wizard',
  Cleric: 'cleric',
  Druid: 'druid',
  Shaman: 'shaman',
  Berserker: 'berserker',
  Monk: 'monk',
  Rogue: 'rogue',
  Warrior: 'warrior',
  Bard: 'bard',
  Beastlord: 'beastlord',
  Paladin: 'paladin',
  Ranger: 'ranger',
  'Shadow Knight': 'shadow-knight'
};
const IDS = Object.values(ID_BY_NAME);

// "  3. Bard / Beastlord / Shadow Knight — **Dirge of the Pack**"
const ROW = /^\s*\d+\.\s*(.+?)\s+—\s+\*\*(.+?)\*\*\s*$/;

const raw = readFileSync(SRC, 'utf8');
const rows = [];
const seen = new Map();
let line = 0;
for (const l of raw.split(/\r?\n/)) {
  line++;
  const m = ROW.exec(l);
  if (!m) {
    // a numbered line that does not parse is a typo, not prose — fail loudly
    if (/^\s*\d+\.\s/.test(l)) throw new Error(`line ${line}: malformed row — ${l.trim()}`);
    continue;
  }
  const [, trio, name] = m;
  const ids = trio.split('/').map((s) => {
    const id = ID_BY_NAME[s.trim()];
    if (!id) throw new Error(`line ${line}: unknown class "${s.trim()}"`);
    return id;
  });
  if (ids.length !== 3) throw new Error(`line ${line}: ${ids.length} classes`);
  const key = [...ids].sort().join('+');
  if (seen.has(key)) throw new Error(`line ${line}: duplicate trio ${key} (also line ${seen.get(key)})`);
  seen.set(key, line);
  rows.push({ key, name });
}

// completeness: every C(16,3)
const missing = [];
for (let i = 0; i < IDS.length; i++)
  for (let j = i + 1; j < IDS.length; j++)
    for (let k = j + 1; k < IDS.length; k++) {
      const key = [IDS[i], IDS[j], IDS[k]].sort().join('+');
      if (!seen.has(key)) missing.push(key);
    }
console.log(`rows: ${rows.length}, missing: ${missing.length}`);
if (missing.length) console.log(missing.join('\n'));

// A trio with no name, or a name shared by two trios, is not a build identity —
// refuse to write rather than ship data the app has to paper over.
let fatal = missing.length > 0;

// duplicate names across different trios
const byName = new Map();
for (const r of rows) {
  if (!byName.has(r.name)) byName.set(r.name, []);
  byName.get(r.name).push(r.key);
}
const dupes = [...byName].filter(([, ks]) => ks.length > 1);
console.log(`\nduplicate names: ${dupes.length}`);
for (const [n, ks] of dupes) console.log(`  ${n}: ${ks.join('  |  ')}`);
if (dupes.length) fatal = true;

if (fatal) {
  console.error('\nNothing written — fix Class-Builds.md and re-run.');
  process.exit(1);
}

rows.sort((a, b) => a.key.localeCompare(b.key));
// single quotes to match the codebase; names with an apostrophe fall back to double
const quote = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
const body = rows.map((r) => `  '${r.key}': ${quote(r.name)}`).join(',\n');
const out = `// GENERATED — do not edit by hand.
// Source: Class-Builds.md · regenerate with \`node scripts/gen-build-names.mjs\`.
// One name for each of the 560 unordered class trios (16 choose 3).

/** trio key: the three class ids sorted alphabetically and joined with '+' */
export function buildKey(classIds: string[]): string {
  return [...new Set(classIds)].sort().join('+');
}

export const BUILD_NAMES: Record<string, string> = {
${body}
};

/**
 * The build name for a class trio, or null when the character has fewer than
 * three (distinct) classes — build identity only exists at a full trio.
 */
export function buildName(classIds: string[]): string | null {
  return BUILD_NAMES[buildKey(classIds)] ?? null;
}
`;
writeFileSync(OUT, out);
console.log(`\nwrote ${OUT}`);
