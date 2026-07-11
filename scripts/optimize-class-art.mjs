// Optimizes raw generated class-portrait art into the app's uniform webp plates.
//
//   node scripts/optimize-class-art.mjs [raw-dir]
//
// Reads art/class-raw/<class-id>.(png|jpg|jpeg|webp) (dir overridable via argv[2]),
// normalizes each to a 480x640 (3:4) grayscale webp in public/classes/<class-id>.webp.
// The grayscale + level pass pushes the sketch paper toward true white so the
// CSS `mix-blend-mode: multiply` on the character sheet melts it into the parchment.

import { mkdirSync, existsSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = process.argv[2] ?? join(ROOT, 'art', 'class-raw');
const OUT_DIR = join(ROOT, 'public', 'classes');

// must match src/data/classes.ts ids
const CLASS_IDS = [
  'bard', 'beastlord', 'berserker', 'cleric', 'druid', 'enchanter',
  'magician', 'monk', 'necromancer', 'paladin', 'ranger', 'rogue',
  'shadow-knight', 'shaman', 'warrior', 'wizard'
];

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
for (const id of CLASS_IDS) {
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

console.log(`\nWrote ${done} portraits, ${(bytes / 1024).toFixed(0)} KB total → public/classes/`);
if (missing.length > 0) {
  console.log(`Missing raw art (${missing.length}): ${missing.join(', ')}`);
  console.log('(The app shows a monogram fallback for these until art lands.)');
}
