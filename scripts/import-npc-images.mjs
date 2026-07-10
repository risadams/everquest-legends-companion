// Downloads NPC portrait images for the lore figures in src/data/lore.ts and packs them
// as small webp thumbnails into public/npcs/<id>.webp.
//
//   node scripts/import-npc-images.mjs
//
// Two sources, tried in order per figure:
//   1. EQL Wiki (eqlwiki.com) — the game's own fan wiki. We only accept genuine `npc_*`
//      model renders (not the maps / class-icons some pages also carry).
//   2. Allakhazam (everquest.allakhazam.com) — its bestiary carries a model screenshot for
//      most classic NPCs. We resolve the classic entry by search, then take the page's
//      primary render (`<div id="ssMain"><img id="ssMainPic">`), hosted on the zamimg CDN.
//
// Portraits are downscaled to <=220x300 webp with ImageMagick (`magick`, build-time only).
// Credit both sources in the UI, as the Brewall maps are credited. API base overridable via argv[2].

import { writeFileSync, mkdirSync, existsSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'npcs');
const TMP = join(ROOT, 'node_modules', '.cache', 'npc-images');
const API = process.argv[2] ?? 'https://eqlwiki.com/api.php';
const ALLA = 'https://everquest.allakhazam.com';
const UA = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) eql-companion-importer' };

// figure id (matches src/data/lore.ts) → sources.
//   wiki   : EQL Wiki page to look for an `npc_` render on (omit if the wiki has none)
//   alla   : Allakhazam search term (omit to skip Allakhazam)
//   allaId : pin a specific Allakhazam NPC id (skips search — use for the classic entry)
const FIGURES = {
  // EQL Wiki has genuine renders for these
  'lord-nagafen': { wiki: 'Lord Nagafen', alla: 'Lord Nagafen' },
  'najena': { wiki: 'Najena (NPC)', alla: 'Najena' },
  'drelzna': { wiki: 'Drelzna', alla: 'Drelzna' },
  'master-yael': { wiki: 'Master Yael', alla: 'Master Yael' },
  'grimfeather': { wiki: 'GrimFeather', alla: 'Grimfeather' },
  // EQL Wiki has no upload → Allakhazam (classic ids pinned where known)
  'lady-vox': { alla: 'Lady Vox', allaId: 2620 },
  'quillmane': { alla: 'Quillmane', allaId: 3677 },
  'mayong-mistmoore': { alla: 'Mayong Mistmoore', allaId: 3534 },
  'fippy-darkpaw': { alla: 'Fippy Darkpaw', allaId: 3579 },
  'phinigel-autropos': { alla: 'Phinigel Autropos' },
  'emperor-crush': { alla: 'Emperor Crush' },
  'lucan-dlere': { alla: "Sir Lucan D'Lere" },
  'king-tranix': { alla: 'King Tranix' },
  'cazel': { alla: 'Cazel' },
  'ambassador-dvinn': { alla: "Ambassador D'Vinn" },
  'garanel-rucksif': { alla: 'Garanel Rucksif' },
  'antonius-bayle': { alla: 'Lord Antonius Bayle', allaId: 31101 },
  'kane-bayle': { alla: 'Kane Bayle' },
  'kazon-stormhammer': { alla: 'King Kazon Stormhammer' },
  // thex-monarchs deliberately omitted: Allakhazam only has modern *undead* forms of
  // Cristanos Thex (a skeleton), which misrepresents the classic dark-elf queen — kept text-only.
  'ak-anon-xv': { alla: "King Ak'Anon" }
};

function magick(args) { return execFileSync('magick', args, { stdio: ['ignore', 'pipe', 'pipe'] }); }
try { magick(['-version']); } catch {
  console.error('ImageMagick (`magick`) not found on PATH. Install: https://imagemagick.org/script/download.php');
  process.exit(1);
}
let hasFfmpeg = false;
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); hasFfmpeg = true; } catch { /* optional */ }

// Downscale to a portrait webp. Some Allakhazam model renders (id<ID>.png) ship a slightly
// corrupt zlib tail that browsers tolerate but libpng rejects — sanitize those via ffmpeg.
function toWebp(src, out) {
  try { magick([src, '-resize', '220x300>', '-strip', '-quality', '82', out]); return true; }
  catch (e) {
    if (!hasFfmpeg) throw e;
    const fixed = src + '.fixed.png';
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, fixed], { stdio: ['ignore', 'pipe', 'pipe'] });
    magick([fixed, '-resize', '220x300>', '-strip', '-quality', '82', out]);
    return true;
  }
}

const json = async (url) => (await fetch(url, { headers: UA })).json();
const text = async (url) => (await fetch(url, { headers: UA })).text();
const buf = async (url) => Buffer.from(await (await fetch(url, { headers: UA })).arrayBuffer());

// ── EQL Wiki: only real `npc_` model renders ─────────────────

async function wikiPortrait(page, id) {
  // files linked on the page…
  const j = await json(`${API}?action=query&titles=${encodeURIComponent(page.replace(/ /g, '_'))}&prop=images&imlimit=50&format=json&redirects=1`);
  const p = Object.values(j.query?.pages ?? {})[0];
  let files = (p?.images ?? []).map((x) => x.title);
  // …plus a direct lookup of the conventional Npc_<id> upload (some aren't linked)
  const ai = await json(`${API}?action=query&list=allimages&aiprefix=${encodeURIComponent('Npc_' + id.replace(/-/g, '_'))}&ailimit=10&aiprop=url|size&format=json`);
  const direct = (ai.query?.allimages ?? []).map((i) => 'File:' + i.name);
  files = [...new Set([...files, ...direct])].filter((t) => /npc_/i.test(t) && /\.(png|jpe?g|webp)$/i.test(t));
  if (!files.length) return null;
  const info = await json(`${API}?action=query&titles=${files.map(encodeURIComponent).join('|')}&prop=imageinfo&iiprop=url|size|mime&format=json`);
  const cands = Object.values(info.query?.pages ?? {})
    .map((pg) => pg.imageinfo?.[0]).filter((ii) => ii && Math.max(ii.width ?? 0, ii.height ?? 0) >= 150)
    .sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));
  return cands[0] ? { url: cands[0].url, source: 'EQL Wiki' } : null;
}

// ── Allakhazam: classic bestiary entry → primary render ──────

const VARIANT = /fabled|shade of|jade statue|lives of|phased|illusion|hardcore|- sod|- hh|drachnid|test|gm |a spectre|corpse|\bpet\b|overseer|dethroning|- undead/i;

async function allaResolveId(term) {
  const html = await text(`${ALLA}/search.html?q=${encodeURIComponent(term)}`);
  const rows = [...html.matchAll(/npc\.html\?id=(\d+)"[^>]*>([^<]+)<\/a>/g)]
    .map((m) => ({ id: Number(m[1]), label: m[2].trim() }));
  const want = term.toLowerCase().replace(/[^a-z0-9]/g, '');
  const good = rows.filter((r) => {
    if (VARIANT.test(r.label)) return false;
    const base = r.label.split(' - ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    return base === want || base.startsWith(want) || want.startsWith(base);
  });
  // classic entries carry the lowest ids
  good.sort((a, b) => a.id - b.id);
  return good[0]?.id ?? null;
}

async function allaPortrait(term, pinnedId) {
  const id = pinnedId ?? (await allaResolveId(term));
  if (!id) return null;
  const html = await text(`${ALLA}/db/npc.html?id=${id}`);
  const m = html.match(/id="ssMain"[\s\S]*?<img\s+src="([^"]+)"[^>]*id="ssMainPic"/i)
    ?? html.match(/id="ssMainPic"[^>]*src="([^"]+)"/i);
  if (!m) return null;
  const url = m[1].startsWith('//') ? 'https:' + m[1] : m[1];
  return { url, source: 'Allakhazam', allaId: id };
}

// ── main ─────────────────────────────────────────────────────

if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const done = [];
const skipped = [];
let bytes = 0;

for (const [id, cfg] of Object.entries(FIGURES)) {
  try {
    let hit = cfg.wiki ? await wikiPortrait(cfg.wiki, id) : null;
    if (!hit && cfg.alla) hit = await allaPortrait(cfg.alla, cfg.allaId);
    if (!hit?.url) { skipped.push(`${id} (no portrait found)`); continue; }
    const raw = await buf(hit.url);
    const src = join(TMP, `${id}.img`);
    writeFileSync(src, raw);
    const out = join(OUT_DIR, `${id}.webp`);
    toWebp(src, out);
    const size = statSync(out).size; bytes += size;
    done.push({ id, source: hit.source, allaId: hit.allaId, kb: (size / 1024).toFixed(1) });
  } catch (e) {
    skipped.push(`${id} (${String(e).split('\n')[0]})`);
  }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`Wrote ${done.length} portraits → public/npcs/ (${(bytes / 1024).toFixed(1)} KB total)`);
for (const d of done) console.log(`  ✓ ${d.id.padEnd(20)} ${d.source}${d.allaId ? ` #${d.allaId}` : ''}  ${d.kb}KB`);
if (skipped.length) { console.log('Missing:'); for (const s of skipped) console.log('  ~ ' + s); }
console.log('\n`image` lines for src/data/lore.ts:');
console.log(done.map((d) => `  ${d.id}: '/npcs/${d.id}.webp'  // ${d.source}`).join('\n'));
