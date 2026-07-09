// Builds a lazy-loaded 3D wireframe dataset (public/maps3d/<zone>.json) from the same
// Brewall map sources as the 2D atlas, but KEEPING the z coordinate the 2D importer
// discards. Rendered by src/components/ZoneMap3D.tsx as an orbitable WebGL wireframe,
// in sync with the flat map (same zones, variants, colors, and labeled points).
//
//   node scripts/import-maps-3d.mjs <path-to-extracted-brewall-folder>
//
// Output per zone: { variants: [{ b:[minX,minY,minZ,maxX,maxY,maxZ], colors:[[r,g,b]],
//   paths:[{c, pts:[x,y,z,...]}], points:[{x,y,z,c:[r,g,b],s,t}] }] }
// These JSON files live in public/ so the PWA does NOT precache them (the workbox glob
// omits .json); the 3D view fetches a zone's file on demand.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAPPING } from './zone-mapping.mjs';

const SRC = process.argv[2];
if (!SRC || !existsSync(SRC)) {
  console.error('Usage: node scripts/import-maps-3d.mjs <brewall-folder>');
  process.exit(1);
}
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'maps3d');
mkdirSync(OUT, { recursive: true });

/** parse an L/P map file, keeping z on both segments and points */
function parseFile(path) {
  const lines = [];
  const points = [];
  const text = readFileSync(path, 'latin1');
  for (const row of text.split('\n')) {
    const t = row.trim();
    if (t.startsWith('L')) {
      const p = t.slice(1).split(',').map((s) => parseFloat(s));
      if (p.length >= 9 && p.slice(0, 9).every((n) => Number.isFinite(n))) {
        lines.push({
          x1: p[0], y1: p[1], z1: p[2],
          x2: p[3], y2: p[4], z2: p[5],
          r: p[6], g: p[7], b: p[8]
        });
      }
    } else if (t.startsWith('P')) {
      const parts = t.slice(1).split(',');
      if (parts.length >= 8) {
        const [x, y, z, r, g, b, size] = parts.slice(0, 7).map((s) => parseFloat(s));
        const label = parts.slice(7).join(',').trim();
        if ([x, y, z, r, g, b, size].every((n) => Number.isFinite(n)) && label) {
          points.push({ x, y, z, r, g, b, size, label });
        }
      }
    }
  }
  return { lines, points };
}

const R = (n) => Math.round(n);

/** chain consecutive same-color 3D segments into polylines and index colors */
function toPaths(lines) {
  const paths = [];
  const colorIndex = new Map();
  const colors = [];
  let cur = null;
  for (const seg of lines) {
    const key = `${seg.r},${seg.g},${seg.b}`;
    let ci = colorIndex.get(key);
    if (ci === undefined) {
      ci = colors.length;
      colors.push([seg.r, seg.g, seg.b]);
      colorIndex.set(key, ci);
    }
    const x1 = R(seg.x1), y1 = R(seg.y1), z1 = R(seg.z1);
    const x2 = R(seg.x2), y2 = R(seg.y2), z2 = R(seg.z2);
    if (x1 === x2 && y1 === y2 && z1 === z2) continue;
    const n = cur?.pts.length ?? 0;
    if (
      cur &&
      cur.c === ci &&
      cur.pts[n - 3] === x1 &&
      cur.pts[n - 2] === y1 &&
      cur.pts[n - 1] === z1
    ) {
      cur.pts.push(x2, y2, z2);
    } else {
      cur = { c: ci, pts: [x1, y1, z1, x2, y2, z2] };
      paths.push(cur);
    }
  }
  return { colors, paths };
}

/**
 * Brewall maps embed a text legend, attribution, and coordinate grid labels as tiny
 * disconnected line-art clusters sitting outside the playable area. The actual map is a
 * handful of LARGE connected components (rooms + tunnels share endpoints). So: union-find
 * segments by shared endpoints, take the bounding region of the big components, and keep
 * only geometry inside it — dropping the annotations while preserving interior features.
 * Returns the kept lines and that region [x0,y0,x1,y1] (for culling points too).
 */
function cullLines(lines) {
  if (lines.length === 0) return { lines, region: null };
  const parent = new Map();
  const key = (x, y) => x + ',' + y;
  const mk = (k) => { if (!parent.has(k)) parent.set(k, k); return k; };
  const find = (k) => {
    let r = k;
    while (parent.get(r) !== r) r = parent.get(r);
    while (parent.get(k) !== r) { const n = parent.get(k); parent.set(k, r); k = n; }
    return r;
  };
  const seg = lines.map((l) => [R(l.x1), R(l.y1), R(l.x2), R(l.y2)]);
  for (const [x1, y1, x2, y2] of seg) parent.set(find(mk(key(x1, y1))), find(mk(key(x2, y2))));

  const comp = new Map();
  for (const [x1, y1, x2, y2] of seg) {
    const r = find(key(x1, y1));
    let c = comp.get(r);
    if (!c) { c = { n: 0, minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }; comp.set(r, c); }
    c.n++;
    c.minX = Math.min(c.minX, x1, x2); c.maxX = Math.max(c.maxX, x1, x2);
    c.minY = Math.min(c.minY, y1, y2); c.maxY = Math.max(c.maxY, y1, y2);
  }
  const big = [...comp.values()].filter((c) => c.n >= 30);
  if (big.length === 0) return { lines, region: null };
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of big) { x0 = Math.min(x0, c.minX); y0 = Math.min(y0, c.minY); x1 = Math.max(x1, c.maxX); y1 = Math.max(y1, c.maxY); }
  const mX = (x1 - x0) * 0.1, mY = (y1 - y0) * 0.1;
  const region = [x0 - mX, y0 - mY, x1 + mX, y1 + mY];
  const inR = (x, y) => x >= region[0] && x <= region[2] && y >= region[1] && y <= region[3];
  const kept = lines.filter((l) => inR(R(l.x1), R(l.y1)) && inR(R(l.x2), R(l.y2)));
  return { lines: kept, region };
}

const pct = (sorted, q) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(q * (sorted.length - 1))))];

/** drop the sparse far extremes (grid axes/labels) from already legend-free geometry */
function percentileTrim(paths, points) {
  const xs = [], ys = [];
  for (const p of paths) for (let i = 0; i < p.pts.length; i += 3) { xs.push(p.pts[i]); ys.push(p.pts[i + 1]); }
  if (xs.length === 0) return { paths, points };
  const sx = [...xs].sort((a, b) => a - b), sy = [...ys].sort((a, b) => a - b);
  const mX = (pct(sx, 0.98) - pct(sx, 0.02)) * 0.08, mY = (pct(sy, 0.98) - pct(sy, 0.02)) * 0.08;
  const x0 = pct(sx, 0.02) - mX, x1 = pct(sx, 0.98) + mX;
  const y0 = pct(sy, 0.02) - mY, y1 = pct(sy, 0.98) + mY;
  const inBox = (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
  const keptPaths = paths.filter((p) => {
    for (let i = 0; i < p.pts.length; i += 3) if (inBox(p.pts[i], p.pts[i + 1])) return true;
    return false;
  });
  return { paths: keptPaths, points: points.filter((p) => inBox(p.x, p.y)) };
}

let written = 0;
let total = 0;
const missing = [];
for (const [zoneId, variants] of Object.entries(MAPPING)) {
  const outVariants = [];
  for (const v of variants) {
    if (!existsSync(join(SRC, `${v.file}.txt`))) {
      missing.push(`${zoneId}: ${v.file}`);
      continue;
    }
    const allLines = [];
    const allPoints = [];
    for (const suffix of ['', '_1', '_2', '_3']) {
      const f = join(SRC, `${v.file}${suffix}.txt`);
      if (!existsSync(f)) continue;
      const { lines, points } = parseFile(f);
      allLines.push(...lines);
      allPoints.push(...points);
    }
    // strip the embedded legend/attribution as disconnected components…
    const { lines: keptLines, region } = cullLines(allLines);
    const { colors, paths: paths0 } = toPaths(keptLines);
    if (paths0.length === 0) continue;
    const points0 = region
      ? allPoints.filter((p) => p.x >= region[0] && p.x <= region[2] && p.y >= region[1] && p.y <= region[3])
      : allPoints;
    // …then trim any sparse far extension left over (coordinate grid axes/labels)
    const { paths, points: keptRawPoints } = percentileTrim(paths0, points0);

    // dedupe labels at identical rounded positions
    const seen = new Set();
    const points = [];
    for (const p of keptRawPoints) {
      const key = `${R(p.x)},${R(p.y)},${R(p.z)},${p.label}`;
      if (seen.has(key)) continue;
      seen.add(key);
      points.push({
        x: R(p.x), y: R(p.y), z: R(p.z),
        c: [p.r, p.g, p.b],
        s: p.size,
        t: p.label.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
      });
    }

    const xs = [], ys = [], zs = [];
    for (const p of paths) {
      for (let i = 0; i < p.pts.length; i += 3) {
        xs.push(p.pts[i]); ys.push(p.pts[i + 1]); zs.push(p.pts[i + 2]);
      }
    }
    outVariants.push({
      label: v.label,
      b: [Math.min(...xs), Math.min(...ys), Math.min(...zs), Math.max(...xs), Math.max(...ys), Math.max(...zs)],
      colors,
      paths,
      points
    });
  }
  if (outVariants.length === 0) continue;
  const json = JSON.stringify({ variants: outVariants });
  writeFileSync(join(OUT, `${zoneId}.json`), json);
  total += json.length;
  written++;
}

console.log(`Wrote ${written} 3D map files, ${(total / 1024 / 1024).toFixed(2)} MB total (public/maps3d, not precached)`);
if (missing.length) console.log('Missing source files:', missing.join('; '));
