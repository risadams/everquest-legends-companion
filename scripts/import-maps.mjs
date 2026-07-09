// Converts Brewall's EverQuest map files (eqmaps.info) into compact per-zone
// JSON consumed by the ZoneMap component.
//
// Usage: node scripts/import-maps.mjs <path-to-extracted-brewall-folder>
//
// Map file format:
//   L x1, y1, z1, x2, y2, z2, r, g, b        line segment
//   P x, y, z, r, g, b, size, label          labeled point
// Layers: <zone>.txt (geometry) plus <zone>_1/_2/_3.txt (labels & extras).

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAPPING } from './zone-mapping.mjs';

const SRC = process.argv[2];
if (!SRC || !existsSync(SRC)) {
  console.error('Usage: node scripts/import-maps.mjs <brewall-folder>');
  process.exit(1);
}
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'maps');
mkdirSync(OUT, { recursive: true });

const files = new Set(readdirSync(SRC));

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
          x1: p[0], y1: p[1], x2: p[3], y2: p[4],
          r: p[6], g: p[7], b: p[8]
        });
      }
    } else if (t.startsWith('P')) {
      const parts = t.slice(1).split(',');
      if (parts.length >= 8) {
        const [x, y, , r, g, b, size] = parts.slice(0, 7).map((s) => parseFloat(s));
        const label = parts.slice(7).join(',').trim();
        if ([x, y, r, g, b, size].every((n) => Number.isFinite(n)) && label) {
          points.push({ x, y, r, g, b, size, label });
        }
      }
    }
  }
  return { lines, points };
}

/** Chain consecutive same-color segments into polylines and round coords. */
function toPaths(lines) {
  const paths = [];
  const colorIndex = new Map();
  const colors = [];
  let cur = null;
  const R = (n) => Math.round(n);
  for (const seg of lines) {
    const key = `${seg.r},${seg.g},${seg.b}`;
    let ci = colorIndex.get(key);
    if (ci === undefined) {
      ci = colors.length;
      colors.push([seg.r, seg.g, seg.b]);
      colorIndex.set(key, ci);
    }
    const x1 = R(seg.x1), y1 = R(seg.y1), x2 = R(seg.x2), y2 = R(seg.y2);
    if (x1 === x2 && y1 === y2) continue;
    if (
      cur &&
      cur.c === ci &&
      cur.pts[cur.pts.length - 2] === x1 &&
      cur.pts[cur.pts.length - 1] === y1
    ) {
      cur.pts.push(x2, y2);
    } else {
      cur = { c: ci, pts: [x1, y1, x2, y2] };
      paths.push(cur);
    }
  }
  return { colors, paths };
}

let total = 0;
let written = 0;
const missing = [];
for (const [zoneId, variants] of Object.entries(MAPPING)) {
  const outVariants = [];
  for (const v of variants) {
    if (!files.has(`${v.file}.txt`)) {
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
    const { colors, paths } = toPaths(allLines);
    // Deduplicate labels at identical rounded positions.
    const seen = new Set();
    const points = [];
    for (const p of allPoints) {
      const key = `${Math.round(p.x)},${Math.round(p.y)},${p.label}`;
      if (seen.has(key)) continue;
      seen.add(key);
      points.push({
        x: Math.round(p.x),
        y: Math.round(p.y),
        c: [p.r, p.g, p.b],
        s: p.size,
        t: p.label.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
      });
    }
    const xs = paths.flatMap((p) => p.pts.filter((_, i) => i % 2 === 0));
    const ys = paths.flatMap((p) => p.pts.filter((_, i) => i % 2 === 1));
    if (xs.length === 0) continue;
    outVariants.push({
      label: v.label,
      bounds: {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys)
      },
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

console.log(`Wrote ${written} zone map files, ${(total / 1024 / 1024).toFixed(2)} MB total`);
if (missing.length) console.log('Missing source files:', missing.join('; '));
