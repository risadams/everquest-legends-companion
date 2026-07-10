// Downloads the deity artwork for src/data/lore.ts (LORE_DEITIES) from the Project 1999
// wiki and packs each as a webp into public/deities/<id>.webp.
//
//   node scripts/import-deity-images.mjs
//
// The P99 wiki (wiki.project1999.com, MediaWiki 1.43) hosts the classic EverQuest holy-symbol
// artwork on each deity's page — one image per page. We resolve it, download it, and downscale
// to a <=260px webp with ImageMagick (`magick`, build-time only). Credit P99 in the UI.
// API base overridable via argv[2].

import { writeFileSync, mkdirSync, existsSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'deities');
const TMP = join(ROOT, 'node_modules', '.cache', 'deity-images');
const API = process.argv[2] ?? 'https://wiki.project1999.com/api.php';
const UA = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) eql-companion-importer' };

// deity id (matches src/data/lore.ts) → P99 wiki page
const DEITIES = {
  bertoxxulous: 'Bertoxxulous',
  'brell-serilis': 'Brell Serilis',
  bristlebane: 'Bristlebane Fizzlethrope',
  'cazic-thule': 'Cazic-Thule',
  'erollisi-marr': 'Erollisi Marr',
  innoruuk: 'Innoruuk',
  karana: 'Karana',
  'mithaniel-marr': 'Mithaniel Marr',
  prexus: 'Prexus',
  quellious: 'Quellious',
  'rallos-zek': 'Rallos Zek',
  'rodcet-nife': 'Rodcet Nife',
  'solusek-ro': 'Solusek Ro',
  'the-tribunal': 'The Tribunal',
  tunare: 'Tunare',
  veeshan: 'Veeshan'
};

function magick(args) { return execFileSync('magick', args, { stdio: ['ignore', 'pipe', 'pipe'] }); }
try { magick(['-version']); } catch {
  console.error('ImageMagick (`magick`) not found on PATH. Install: https://imagemagick.org/script/download.php');
  process.exit(1);
}
let hasFfmpeg = false;
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); hasFfmpeg = true; } catch { /* optional */ }

const json = async (url) => (await fetch(url, { headers: UA })).json();
const buf = async (url) => Buffer.from(await (await fetch(url, { headers: UA })).arrayBuffer());

async function artwork(page) {
  const j = await json(`${API}?action=query&titles=${encodeURIComponent(page.replace(/ /g, '_'))}&prop=images&imlimit=50&format=json&redirects=1`);
  const p = Object.values(j.query?.pages ?? {})[0];
  const files = (p?.images ?? []).map((x) => x.title).filter((t) => /\.(png|jpe?g|gif)$/i.test(t) && !/icon|button|coin|map|spell_/i.test(t));
  if (!files.length) return null;
  const info = await json(`${API}?action=query&titles=${files.map(encodeURIComponent).join('|')}&prop=imageinfo&iiprop=url|size&format=json`);
  const cands = Object.values(info.query?.pages ?? {}).map((pg) => pg.imageinfo?.[0]).filter(Boolean)
    .sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));
  return cands[0]?.url ?? null;
}

function toWebp(src, out) {
  try { magick([src, '-resize', '260x300>', '-strip', '-quality', '85', out]); return; }
  catch (e) {
    if (!hasFfmpeg) throw e;
    const fixed = src + '.fixed.png';
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, fixed], { stdio: ['ignore', 'pipe', 'pipe'] });
    magick([fixed, '-resize', '260x300>', '-strip', '-quality', '85', out]);
  }
}

if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const done = [];
const skipped = [];
let bytes = 0;
for (const [id, page] of Object.entries(DEITIES)) {
  try {
    const url = await artwork(page);
    if (!url) { skipped.push(`${id} (no artwork on ${page})`); continue; }
    const src = join(TMP, `${id}.img`);
    writeFileSync(src, await buf(url));
    const out = join(OUT_DIR, `${id}.webp`);
    toWebp(src, out);
    const size = statSync(out).size; bytes += size;
    done.push({ id, kb: (size / 1024).toFixed(1) });
  } catch (e) {
    skipped.push(`${id} (${String(e).split('\n')[0]})`);
  }
}
rmSync(TMP, { recursive: true, force: true });
console.log(`Wrote ${done.length} deity images → public/deities/ (${(bytes / 1024).toFixed(1)} KB total)`);
for (const d of done) console.log(`  ✓ ${d.id.padEnd(15)} ${d.kb}KB`);
if (skipped.length) { console.log('Missing:'); for (const s of skipped) console.log('  ~ ' + s); }
