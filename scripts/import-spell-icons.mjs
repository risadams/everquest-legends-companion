// Packs the spell icons referenced by src/data/classdata/*.json into a single
// sprite (public/icons/spells.webp) and writes the index → sprite-cell map
// (src/data/spell-icons.json). Run AFTER import-spells.mjs has assigned `icon`.
//
//   node scripts/import-spell-icons.mjs [--game <dir>]
//
// The client stores 40x40 spell icons in uifiles/default/Spells01..NN.tga, each a
// 256x256 sheet holding a 6x6 grid (36 icons). A spell's global icon index N
// (field 75 of spells_us.txt) maps to sheet floor(N/36)+1, cell N%36 (row-major).
// Requires ImageMagick (`magick`) — build-time only.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CD_DIR = join(ROOT, 'src', 'data', 'classdata');
const OUT_SPRITE = join(ROOT, 'public', 'icons', 'spells.webp');
const OUT_MAP = join(ROOT, 'src', 'data', 'spell-icons.json');
const TMP = join(ROOT, 'node_modules', '.cache', 'spell-icons');

const opt = (name, def) => {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const GAME = opt('--game', 'D:/EverQuest Legends');
const SHEETS = join(GAME, 'uifiles', 'default');

const ICON = 40;      // source icon size
const PER_ROW = 6;    // icons per row in a source sheet
const PACK_COLS = 20; // columns in the packed sprite

function magick(args) {
  return execFileSync('magick', args, { stdio: ['ignore', 'pipe', 'pipe'] });
}
try { magick(['-version']); } catch {
  console.error('ImageMagick (`magick`) not found on PATH. Install it: https://imagemagick.org/script/download.php');
  process.exit(1);
}

// ── collect referenced icon indices from curated data ────────
const icons = new Set();
for (const f of readdirSync(CD_DIR)) {
  if (!f.endsWith('.json') || f === 'shared-aa.json') continue;
  const data = JSON.parse(readFileSync(join(CD_DIR, f), 'utf8'));
  for (const s of data.spells ?? []) if (Number.isInteger(s.icon) && s.icon > 0) icons.add(s.icon);
}
const list = [...icons].sort((a, b) => a - b);
if (list.length === 0) { console.error('No icons found — run import-spells.mjs --write first.'); process.exit(1); }

// ── crop each referenced icon out of its sheet ───────────────
if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const map = {};        // global icon index -> packed cell position
const cropFiles = [];
let missingSheets = new Set();
list.forEach((n, pos) => {
  const sheet = Math.floor(n / 36) + 1;
  const within = n % 36;
  const x = (within % PER_ROW) * ICON;
  const y = Math.floor(within / PER_ROW) * ICON;
  const src = join(SHEETS, `Spells${String(sheet).padStart(2, '0')}.tga`);
  if (!existsSync(src)) { missingSheets.add(sheet); return; }
  const out = join(TMP, `${String(pos).padStart(4, '0')}.png`);
  magick([src, '-crop', `${ICON}x${ICON}+${x}+${y}`, '+repage', out]);
  cropFiles.push(out);
  map[n] = pos;
});

// ── montage crops into one packed sprite ─────────────────────
mkdirSync(dirname(OUT_SPRITE), { recursive: true });
magick([
  'montage', ...cropFiles,
  '-background', 'none',
  '-tile', `${PACK_COLS}x`,
  '-geometry', `${ICON}x${ICON}+0+0`,
  OUT_SPRITE
]);

writeFileSync(OUT_MAP, JSON.stringify({
  icon: ICON,
  cols: PACK_COLS,
  count: cropFiles.length,
  pos: map
}));

const rows = Math.ceil(cropFiles.length / PACK_COLS);
const bytes = readFileSync(OUT_SPRITE).length;
rmSync(TMP, { recursive: true, force: true });
console.log(`Packed ${cropFiles.length} icons into ${PACK_COLS}x${rows} sprite → ${OUT_SPRITE} (${(bytes / 1024).toFixed(1)} KB)`);
console.log(`Map → ${OUT_MAP}`);
if (missingSheets.size) console.log('Missing source sheets:', [...missingSheets].join(', '));
