// Parses the actual zone geometry out of the game's .s3d archives into a lazy-loaded
// solid-mesh dataset (public/zonemesh/<zone>.json) for a true 3D zone render, alongside
// the wireframe atlas map. Each zone's <file>.s3d is a PFS archive containing a WLD with
// the zone mesh in 0x36 (Mesh) fragments; we combine them into one indexed triangle mesh.
//
//   node scripts/import-zone-mesh.mjs <path-to-EverQuest-Legends-dir>
//
// Output per zone: { variants: [{ label, b:[minx,miny,minz,maxx,maxy,maxz], pos:[...], idx:[...] }] }
// Coordinates are EQ world units (x,y,z with z up). Not precached (public/, .json glob-excluded).

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAPPING } from './zone-mapping.mjs';

const GAME = process.argv[2] || 'D:/EverQuest Legends';
if (!existsSync(GAME)) {
  console.error(`Game dir not found: ${GAME}`);
  process.exit(1);
}
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'zonemesh');
const TMP = join(dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', '.cache', 'zone-tex');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

// magick decodes the .dds/.bmp textures so we can sample each material's average colour.
function haveMagick() { try { execFileSync('magick', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } }
const MAGICK = haveMagick();
if (!MAGICK) console.warn('ImageMagick (`magick`) not found — meshes will export without material colours (flat).');

// EQ WLD string cipher (used to decode inline 0x03 texture filenames)
const XKEY = [0x95, 0x3A, 0xC5, 0x2A, 0x95, 0x7A, 0x95, 0x6A];

// ── PFS archive ──────────────────────────────────────────────
function readPFS(path) {
  const buf = readFileSync(path);
  if (buf.toString('latin1', 4, 8) !== 'PFS ') throw new Error('not PFS');
  const dirOff = buf.readUInt32LE(0);
  let p = dirOff;
  const count = buf.readUInt32LE(p); p += 4;
  const ents = [];
  for (let i = 0; i < count; i++) {
    ents.push({ crc: buf.readUInt32LE(p), off: buf.readUInt32LE(p + 4), size: buf.readUInt32LE(p + 8) });
    p += 12;
  }
  const inflate = (off, size) => {
    const out = []; let o = off, g = 0;
    while (g < size) {
      const dl = buf.readUInt32LE(o), il = buf.readUInt32LE(o + 4); o += 8;
      out.push(inflateSync(buf.subarray(o, o + dl))); o += dl; g += il;
    }
    return Buffer.concat(out);
  };
  const fn = ents.find((e) => e.crc === 0x61580ac9);
  const fdata = inflate(fn.off, fn.size);
  let q = 0; const nc = fdata.readUInt32LE(q); q += 4;
  const names = [];
  for (let i = 0; i < nc; i++) { const l = fdata.readUInt32LE(q); q += 4; names.push(fdata.toString('latin1', q, q + l - 1)); q += l; }
  const de = ents.filter((e) => e.crc !== 0x61580ac9).sort((a, b) => a.off - b.off);
  const files = {};
  names.forEach((n, i) => { if (de[i]) files[n.toLowerCase()] = inflate(de[i].off, de[i].size); });
  return files;
}

// ── WLD fragment table + material → texture resolution ───────
function fragTable(wld) {
  const fragCount = wld.readUInt32LE(8);
  const strHashSize = wld.readUInt32LE(20);
  let pos = 28 + strHashSize;
  const T = [null];
  for (let n = 0; n < fragCount && pos + 8 <= wld.length; n++) {
    const size = wld.readUInt32LE(pos);
    const type = wld.readUInt32LE(pos + 4);
    T.push({ type, body: pos + 8, size });
    pos = pos + 8 + size;
  }
  return T;
}
/** decode an inline 0x03 BitmapName (len at body+8, cipher name at body+10) */
function name03(wld, t) {
  const len = wld.readInt16LE(t.body + 8);
  let s = '';
  for (let k = 0; k < len; k++) s += String.fromCharCode(wld[t.body + 10 + k] ^ XKEY[k % 8]);
  return s.replace(/\0+$/, '').toLowerCase();
}
/** follow a 0x30 material → 0x05 → 0x04 → 0x03 to its texture filename */
function materialTexture(wld, T, matIdx) {
  const m = T[matIdx];
  if (!m || m.type !== 0x30) return null;
  const findRef = (t, wantType) => {
    for (let q = t.body; q < t.body + t.size - 3; q += 4) {
      const r = wld.readInt32LE(q);
      if (r > 0 && r < T.length && T[r] && T[r].type === wantType) return r;
    }
    return null;
  };
  const r05 = findRef(m, 0x05); if (!r05) return null;
  const r04 = findRef(T[r05], 0x04); if (!r04) return null;
  const r03 = findRef(T[r04], 0x03); if (!r03) return null;
  return name03(wld, T[r03]);
}
/** resolve the ordered material palette (index → texture filename) from a 0x31 list */
function materialPalette(wld, T, listIdx) {
  const ml = T[listIdx];
  if (!ml || ml.type !== 0x31) return [];
  let o = ml.body + 8;                       // nameRef, flags
  const count = wld.readInt32LE(o); o += 4;
  const pal = [];
  for (let i = 0; i < count; i++) {
    const ref = wld.readInt32LE(o); o += 4;
    pal.push(materialTexture(wld, T, ref));
  }
  return pal;
}

// ── WLD 0x36 mesh extraction ─────────────────────────────────
function parseZoneMeshes(wld) {
  if (wld.readUInt32LE(0) !== 0x54503d02) throw new Error('bad WLD magic');
  const T = fragTable(wld);
  const strHashSize = wld.readUInt32LE(20);
  let pos = 28 + strHashSize;
  const fragCount = wld.readUInt32LE(8);
  const meshes = [];
  for (let n = 0; n < fragCount && pos + 8 <= wld.length; n++) {
    const size = wld.readUInt32LE(pos);
    const type = wld.readUInt32LE(pos + 4);
    const body = pos + 8;
    if (type === 0x36) {
      try {
        const m = readMesh(wld, body, T);
        if (m) meshes.push(m);
      } catch { /* skip malformed */ }
    }
    pos = body + size;
  }
  return meshes;
}

function readMesh(b, o, T) {
  // header (old WLD 0x00015500 layout)
  o += 4;                    // nameRef
  o += 4;                    // flags
  const matListRef = b.readInt32LE(o);       // fragment1 = material list (0x31)
  o += 4 * 4;                // 4 fragment refs
  const cx = b.readFloatLE(o), cy = b.readFloatLE(o + 4), cz = b.readFloatLE(o + 8); o += 12;
  o += 12;                   // params2[3]
  o += 4;                    // maxDistance
  o += 24;                   // min xyz, max xyz (bounding)
  const vertexCount = b.readInt16LE(o); o += 2;
  const texCoordCount = b.readInt16LE(o); o += 2;
  const normalCount = b.readInt16LE(o); o += 2;
  const colorCount = b.readInt16LE(o); o += 2;
  const polygonCount = b.readInt16LE(o); o += 2;
  const vertexPieceCount = b.readInt16LE(o); o += 2;
  const polygonTexCount = b.readInt16LE(o); o += 2;
  o += 2;                    // vertexTexCount
  o += 2;                    // size9
  const scale = b.readInt16LE(o); o += 2;
  const inv = 1 / (1 << scale);

  const verts = new Array(vertexCount);
  for (let i = 0; i < vertexCount; i++) {
    const x = b.readInt16LE(o), y = b.readInt16LE(o + 2), z = b.readInt16LE(o + 4); o += 6;
    verts[i] = [cx + x * inv, cy + y * inv, cz + z * inv];
  }
  o += texCoordCount * 4;    // old format: int16 u,v
  o += normalCount * 3;      // int8 xyz
  o += colorCount * 4;       // rgba
  const polys = new Array(polygonCount);
  for (let i = 0; i < polygonCount; i++) {
    o += 2;                  // flags
    const a = b.readInt16LE(o), c = b.readInt16LE(o + 2), d = b.readInt16LE(o + 4); o += 6;
    polys[i] = [a, c, d];
  }
  // polygon-texture groups: each [int16 polyCount, int16 materialIndex] over consecutive
  // polys. Bounds-guarded so a colour-parse miss never drops the mesh's geometry.
  const polyMat = new Array(polygonCount).fill(-1);
  try {
    let o2 = o + vertexPieceCount * 4; // skip bone/vertex pieces
    let pi = 0;
    for (let g = 0; g < polygonTexCount && o2 + 4 <= b.length; g++) {
      const cnt = b.readInt16LE(o2), mat = b.readInt16LE(o2 + 2); o2 += 4;
      for (let k = 0; k < cnt && pi < polygonCount; k++) polyMat[pi++] = mat;
    }
  } catch { /* leave polyMat as -1 → fallback colour */ }
  return { verts, polys, polyMat, matListRef };
}

/** average colour of a texture bitmap (via magick), cached per zone. [r,g,b] 0-255 or null */
function texColor(files, name, cache) {
  if (!name || !MAGICK) return null;
  if (cache.has(name)) return cache.get(name);
  let c = null;
  const data = files[name];
  if (data) {
    const ext = (name.match(/\.[a-z0-9]+$/) ?? ['.img'])[0];
    const tmp = join(TMP, 'tex' + ext);
    writeFileSync(tmp, data);
    try {
      const out = execFileSync('magick', [tmp, '-alpha', 'off', '-resize', '1x1!',
        '-format', '%[fx:round(255*p{0,0}.r)] %[fx:round(255*p{0,0}.g)] %[fx:round(255*p{0,0}.b)]', 'info:'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const rgb = out.trim().split(/\s+/).map(Number);
      if (rgb.length === 3 && rgb.every((v) => Number.isFinite(v))) c = rgb;
    } catch { /* undecodable texture → fallback */ }
  }
  cache.set(name, c);
  return c;
}

const FALLBACK = [150, 140, 120];

// ── build per-variant combined mesh (positions, indices, per-vertex colour) ──
function buildVariant(files, wldName) {
  const wld = files[wldName.toLowerCase()];
  if (!wld) return null;
  const meshes = parseZoneMeshes(wld);
  if (meshes.length === 0) return null;
  const T = fragTable(wld);
  const colorCache = new Map();      // texture filename -> [r,g,b] (per zone)
  const palCache = new Map();        // matListRef -> [texName per material index]

  const pos = [], idx = [], ci = [];  // ci = per-vertex palette index (compact)
  const pal = [];                     // unique [r,g,b] colours
  const palMap = new Map();
  const palIdx = (rgb) => { const k = rgb[0] + ',' + rgb[1] + ',' + rgb[2]; let i = palMap.get(k); if (i === undefined) { i = pal.length; palMap.set(k, i); pal.push(rgb); } return i; };
  const lookup = new Map();          // "x,y,z" -> shared vertex index
  let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
  const vid = (v, pIdx) => {
    const x = Math.round(v[0]), y = Math.round(v[1]), z = Math.round(v[2]);
    const k = x + ',' + y + ',' + z;
    let i = lookup.get(k);
    if (i === undefined) {
      i = pos.length / 3;
      lookup.set(k, i);
      pos.push(x, y, z);
      ci.push(pIdx);
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
      if (z < minz) minz = z; if (z > maxz) maxz = z;
    }
    return i;
  };
  for (const m of meshes) {
    let mpal = palCache.get(m.matListRef);
    if (!mpal) { mpal = materialPalette(wld, T, m.matListRef); palCache.set(m.matListRef, mpal); }
    for (let p = 0; p < m.polys.length; p++) {
      const poly = m.polys[p];
      const rgb = texColor(files, mpal[m.polyMat[p]], colorCache) ?? FALLBACK;
      const pIdx = palIdx(rgb);
      const a = vid(m.verts[poly[0]], pIdx), b = vid(m.verts[poly[1]], pIdx), c = vid(m.verts[poly[2]], pIdx);
      if (a !== b && b !== c && a !== c) idx.push(a, b, c); // drop degenerate tris
    }
  }
  return { b: [minx, miny, minz, maxx, maxy, maxz], pos, idx, pal, ci };
}

// ── main ─────────────────────────────────────────────────────
let written = 0, totalBytes = 0;
const missing = [];
for (const [zoneId, variants] of Object.entries(MAPPING)) {
  const out = [];
  for (const v of variants) {
    const s3d = join(GAME, `${v.file}.s3d`);
    if (!existsSync(s3d)) { missing.push(`${zoneId}:${v.file}`); continue; }
    try {
      const files = readPFS(s3d);
      const built = buildVariant(files, `${v.file}.wld`);
      if (built) out.push({ label: v.label, ...built });
    } catch (e) {
      missing.push(`${zoneId}:${v.file}(${e.message})`);
    }
  }
  if (out.length === 0) continue;
  const json = JSON.stringify({ variants: out });
  writeFileSync(join(OUT, `${zoneId}.json`), json);
  written++; totalBytes += json.length;
}
rmSync(TMP, { recursive: true, force: true });
console.log(`Wrote ${written} zone-mesh files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total (public/zonemesh, not precached)`);
if (missing.length) console.log('Skipped:', missing.slice(0, 20).join(', ') + (missing.length > 20 ? ` …(+${missing.length - 20})` : ''));
