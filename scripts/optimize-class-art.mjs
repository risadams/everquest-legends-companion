// Optimizes raw generated sketch portraits into the app's uniform webp plates.
//
//   node scripts/optimize-class-art.mjs [classes|races] [raw-dir]
//
// Reads art/<set>-raw/<id>.(png|jpg|jpeg|webp), normalizes each to a 480x640
// (3:4) grayscale webp in public/<set>/<id>.webp. The grayscale + level pass
// pushes the sketch paper toward true white so the CSS `mix-blend-mode:
// multiply` on the character sheet melts it into the parchment.

import { mkdirSync, existsSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ids must match src/data/classes.ts and src/data/races.ts
const SETS = {
  classes: {
    rawDir: join(ROOT, 'art', 'class-raw'),
    outDir: join(ROOT, 'public', 'classes'),
    ids: [
      'bard', 'beastlord', 'berserker', 'cleric', 'druid', 'enchanter',
      'magician', 'monk', 'necromancer', 'paladin', 'ranger', 'rogue',
      'shadow-knight', 'shaman', 'warrior', 'wizard'
    ]
  },
  races: {
    rawDir: join(ROOT, 'art', 'race-raw'),
    outDir: join(ROOT, 'public', 'races'),
    ids: [
      'barbarian', 'dark-elf', 'dwarf', 'erudite', 'froglok', 'gnome',
      'half-elf', 'halfling', 'high-elf', 'human', 'iksar', 'kerran',
      'ogre', 'troll', 'wood-elf'
    ]
  }
};

const setName = process.argv[2] ?? 'classes';
const set = SETS[setName];
if (!set) {
  console.error(`Unknown set "${setName}" — use: classes | races`);
  process.exit(1);
}
const RAW_DIR = process.argv[3] ?? set.rawDir;
const OUT_DIR = set.outDir;

function magick(args) { return execFileSync('magick', args, { stdio: ['ignore', 'pipe', 'pipe'] }); }
try { magick(['-version']); } catch {
  console.error('ImageMagick (`magick`) not found on PATH. Install: https://imagemagick.org/script/download.php');
  process.exit(1);
}

if (!existsSync(RAW_DIR)) {
  console.error(`Raw art directory not found: ${RAW_DIR}`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const rawFiles = readdirSync(RAW_DIR);
function findRaw(id) {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const name = `${id}.${ext}`;
    if (rawFiles.includes(name)) return join(RAW_DIR, name);
  }
  return null;
}

let done = 0;
let bytes = 0;
const missing = [];
for (const id of set.ids) {
  const src = findRaw(id);
  if (!src) {
    missing.push(id);
    continue;
  }
  const out = join(OUT_DIR, `${id}.webp`);
  magick([
    src,
    '-resize', '480x640^',
    '-gravity', 'center',
    '-extent', '480x640',
    '-colorspace', 'Gray',
    '-level', '2%,98%',
    '-strip',
    '-quality', '84',
    out
  ]);
  const kb = statSync(out).size / 1024;
  bytes += statSync(out).size;
  console.log(`  ${id}.webp — ${kb.toFixed(0)} KB`);
  done++;
}

console.log(`\nWrote ${done} portraits, ${(bytes / 1024).toFixed(0)} KB total → public/${setName}/`);
if (missing.length > 0) {
  console.log(`Missing raw art (${missing.length}): ${missing.join(', ')}`);
  console.log('(The app shows a monogram fallback for these until art lands.)');
}
