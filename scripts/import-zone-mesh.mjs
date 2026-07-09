// Parses the actual zone geometry out of the game's .s3d archives into a lazy-loaded
// solid-mesh dataset (public/zonemesh/<zone>.json) for a true 3D zone render, alongside
// the wireframe atlas map. Each zone's <file>.s3d is a PFS archive containing a WLD with
// the zone mesh in 0x36 (Mesh) fragments; we combine them into one indexed triangle mesh.
//
//   node scripts/import-zone-mesh.mjs <path-to-EverQuest-Legends-dir>
//
// Output per zone: { variants: [{ label, b:[minx,miny,minz,maxx,maxy,maxz], pos:[...], idx:[...] }] }
// Coordinates are EQ world units (x,y,z with z up). Not precached (public/, .json glob-excluded).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAPPING } from './zone-mapping.mjs';

const GAME = process.argv[2] || 'D:/EverQuest Legends';
if (!existsSync(GAME)) {
  console.error(`Game dir not found: ${GAME}`);
  process.exit(1);
}
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'zonemesh');
mkdirSync(OUT, { recursive: true });

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

// ── WLD 0x36 mesh extraction ─────────────────────────────────
function parseZoneMeshes(wld) {
  if (wld.readUInt32LE(0) !== 0x54503d02) throw new Error('bad WLD magic');
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
        const m = readMesh(wld, body);
        if (m) meshes.push(m);
      } catch { /* skip malformed */ }
    }
    pos = body + size;
  }
  return meshes;
}

function readMesh(b, o) {
  // header (old WLD 0x00015500 layout)
  o += 4;                    // nameRef
  o += 4;                    // flags
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
  o += 2;                    // vertexPieceCount
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
  return { verts, polys };
}

// ── build per-variant combined mesh ──────────────────────────
function buildVariant(files, wldName) {
  const wld = files[wldName.toLowerCase()];
  if (!wld) return null;
  const meshes = parseZoneMeshes(wld);
  if (meshes.length === 0) return null;
  const pos = [], idx = [];
  const lookup = new Map(); // "x,y,z" -> shared vertex index (dedupe across all meshes)
  let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
  const vid = (v) => {
    const x = Math.round(v[0]), y = Math.round(v[1]), z = Math.round(v[2]);
    const k = x + ',' + y + ',' + z;
    let i = lookup.get(k);
    if (i === undefined) {
      i = pos.length / 3;
      lookup.set(k, i);
      pos.push(x, y, z);
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
      if (z < minz) minz = z; if (z > maxz) maxz = z;
    }
    return i;
  };
  for (const m of meshes) {
    const map = m.verts.map(vid);
    for (const p of m.polys) {
      const a = map[p[0]], b = map[p[1]], c = map[p[2]];
      if (a !== b && b !== c && a !== c) idx.push(a, b, c); // drop degenerate tris
    }
  }
  return { b: [minx, miny, minz, maxx, maxy, maxz], pos, idx };
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
console.log(`Wrote ${written} zone-mesh files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total (public/zonemesh, not precached)`);
if (missing.length) console.log('Skipped:', missing.slice(0, 20).join(', ') + (missing.length > 20 ? ` …(+${missing.length - 20})` : ''));
