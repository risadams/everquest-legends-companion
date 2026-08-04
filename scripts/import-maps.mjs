// Converts EverQuest map files into the compact per-zone JSON consumed by the
// ZoneMap component.
//
// PRIMARY SOURCE: the EQ Legends client's own `maps/` folder. Those files ship
// with the game and are refreshed every patch, so they are authoritative for a
// custom ruleset in a way that community packs drawn for Live EQ are not — and
// they are the only source that covers Legends-original zones such as the New
// Sebilisian Expedition.
//
// Usage: node scripts/import-maps.mjs [<maps-folder>] [--epsilon <n>]
//   default folder: D:\EverQuest Legends\maps
//
// Zones the source has no file for are LEFT UNTOUCHED, which is how the handful
// of dungeons the client ships no map for (Blackburrow, Runnyeye, Sol A/B,
// Unrest, The Warrens, The Hole, Plane of Hate) keep their existing
// Brewall-derived JSON. Those are listed at the end of every run.
//
// Map file format:
//   L x1, y1, z1, x2, y2, z2, r, g, b        line segment
//   P x, y, z, r, g, b, size, label          labeled point
// Layers: <zone>.txt (geometry) plus <zone>_1/_2/_3.txt (labels & extras).
//
// The client's maps carry far more geometry than hand-drawn packs (whole zones
// are traced at wall resolution), so raw segments are stitched into polylines
// and simplified before they are written — see chainPaths/simplify below.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAPPING } from './zone-mapping.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_SRC = 'D:\\EverQuest Legends\\maps';

const argv = process.argv.slice(2);
let EPSILON = 1.5;
const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--epsilon') EPSILON = Number(argv[++i]);
  else if (!argv[i].startsWith('--')) positional.push(argv[i]);
}
if (!Number.isFinite(EPSILON) || EPSILON < 0) {
  console.error('--epsilon must be a non-negative number');
  process.exit(1);
}
const SRC = positional[0] ?? DEFAULT_SRC;

if (!existsSync(SRC)) {
  console.error(`Maps folder not found: ${SRC}`);
  console.error('Usage: node scripts/import-maps.mjs [<maps-folder>] [--epsilon <n>]');
  process.exit(1);
}
const OUT = join(HERE, '..', 'src', 'data', 'maps');
mkdirSync(OUT, { recursive: true });

const files = new Set(readdirSync(SRC));

// The client's maps are traced geometry with barely any labels — Kerra Isle ships
// exactly one. The community packs the atlas used before carried thousands of POI
// names (merchants, zone lines, camps), and those are worth keeping even though the
// client wins on layout. This snapshot is checked in so runs stay reproducible.
const FALLBACK_LABELS = JSON.parse(
  readFileSync(join(HERE, 'map-labels-fallback.json'), 'utf8')
);

/** merge archived labels into the client's, skipping ones the client already names */
function mergeLabels(zoneId, variantLabel, clientPoints) {
  const archived = FALLBACK_LABELS[zoneId]?.[variantLabel];
  if (!archived) return clientPoints;
  const have = new Set(clientPoints.map((p) => p.t.toLowerCase()));
  const merged = [...clientPoints];
  for (const p of archived) {
    if (have.has(p.t.toLowerCase())) continue;
    have.add(p.t.toLowerCase());
    merged.push(p);
  }
  return merged;
}

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

/** Perpendicular-distance polyline simplification (Douglas–Peucker), in place. */
function simplify(pts, eps) {
  if (pts.length <= 4) return pts;
  const n = pts.length / 2;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    if (hi - lo < 2) continue;
    const ax = pts[lo * 2], ay = pts[lo * 2 + 1];
    const bx = pts[hi * 2], by = pts[hi * 2 + 1];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let far = -1;
    let best = eps;
    for (let i = lo + 1; i < hi; i++) {
      const px = pts[i * 2], py = pts[i * 2 + 1];
      // distance from p to segment a→b (point distance when a === b)
      let d;
      if (len2 === 0) {
        d = Math.hypot(px - ax, py - ay);
      } else {
        let t = ((px - ax) * dx + (py - ay) * dy) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > best) {
        best = d;
        far = i;
      }
    }
    if (far !== -1) {
      keep[far] = 1;
      stack.push([lo, far], [far, hi]);
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    if (keep[i]) out.push(pts[i * 2], pts[i * 2 + 1]);
  }
  return out;
}

/**
 * Stitch same-colored segments into the longest polylines they can form.
 *
 * The old importer only merged segments that happened to be adjacent in file
 * order, which leaves the client's maps as tens of thousands of two-point
 * stubs. Walking an endpoint adjacency map instead collapses each traced wall
 * into a single path, which is both smaller on disk and cheaper to render.
 */
function chainPaths(segs) {
  const nodeKey = (x, y) => `${x},${y}`;
  const adj = new Map();
  const used = new Uint8Array(segs.length);
  segs.forEach((s, i) => {
    for (const k of [nodeKey(s.x1, s.y1), nodeKey(s.x2, s.y2)]) {
      let list = adj.get(k);
      if (!list) adj.set(k, (list = []));
      list.push(i);
    }
  });

  /** next unused segment touching (x,y); returns its far endpoint */
  function step(x, y) {
    for (const i of adj.get(nodeKey(x, y)) ?? []) {
      if (used[i]) continue;
      const s = segs[i];
      used[i] = 1;
      return s.x1 === x && s.y1 === y ? [s.x2, s.y2] : [s.x1, s.y1];
    }
    return null;
  }

  // Start from loose ends first so open runs come out as one path rather than
  // two halves; whatever is left is a closed loop and can start anywhere.
  const order = segs
    .map((_, i) => i)
    .sort((a, b) => {
      const da = (adj.get(nodeKey(segs[a].x1, segs[a].y1))?.length ?? 0);
      const db = (adj.get(nodeKey(segs[b].x1, segs[b].y1))?.length ?? 0);
      return da - db;
    });

  const paths = [];
  for (const i of order) {
    if (used[i]) continue;
    used[i] = 1;
    const s = segs[i];
    const pts = [s.x1, s.y1, s.x2, s.y2];
    // extend forward
    let cur = [s.x2, s.y2];
    for (;;) {
      const next = step(cur[0], cur[1]);
      if (!next) break;
      pts.push(next[0], next[1]);
      cur = next;
    }
    // then backward from the original start
    cur = [s.x1, s.y1];
    for (;;) {
      const prev = step(cur[0], cur[1]);
      if (!prev) break;
      pts.unshift(prev[0], prev[1]);
      cur = prev;
    }
    paths.push(pts);
  }
  return paths;
}

/** Group by color, chain into polylines, simplify, and round coords. */
function toPaths(lines) {
  const colorIndex = new Map();
  const colors = [];
  const byColor = new Map();
  const R = Math.round;
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
    let list = byColor.get(ci);
    if (!list) byColor.set(ci, (list = []));
    list.push({ x1, y1, x2, y2 });
  }
  const paths = [];
  for (const [c, segs] of byColor) {
    // drop exact duplicate segments — the client's maps trace some walls twice
    const seen = new Set();
    const uniq = [];
    for (const s of segs) {
      const a = `${s.x1},${s.y1},${s.x2},${s.y2}`;
      const b = `${s.x2},${s.y2},${s.x1},${s.y1}`;
      if (seen.has(a) || seen.has(b)) continue;
      seen.add(a);
      uniq.push(s);
    }
    for (const pts of chainPaths(uniq)) {
      const simplified = EPSILON > 0 ? simplify(pts, EPSILON) : pts;
      if (simplified.length >= 4) paths.push({ c, pts: simplified });
    }
  }
  return { colors, paths };
}

let total = 0;
let written = 0;
let rawSegments = 0;
let keptLabels = 0;
let outSegments = 0;
const missing = [];
for (const [zoneId, variants] of Object.entries(MAPPING)) {
  const outVariants = [];
  for (const v of variants) {
    if (!files.has(`${v.file}.txt`)) {
      missing.push(`${zoneId} (${v.file})`);
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
    rawSegments += allLines.length;
    for (const p of paths) outSegments += p.pts.length / 2 - 1;
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
    if (paths.length === 0) continue;
    // computed with a loop — spreading these into Math.min blows the stack on
    // client maps, which run to hundreds of thousands of coordinates
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of paths) {
      for (let i = 0; i < p.pts.length; i += 2) {
        const x = p.pts[i], y = p.pts[i + 1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const labels = mergeLabels(zoneId, v.label, points);
    keptLabels += labels.length - points.length;
    outVariants.push({
      label: v.label,
      bounds: { minX, maxX, minY, maxY },
      colors,
      paths,
      points: labels
    });
  }
  if (outVariants.length === 0) continue;
  const json = JSON.stringify({ variants: outVariants });
  writeFileSync(join(OUT, `${zoneId}.json`), json);
  total += json.length;
  written++;
}

console.log(`Source: ${SRC}  ·  simplify epsilon ${EPSILON}`);
console.log(`Wrote ${written} zone map files, ${(total / 1024 / 1024).toFixed(2)} MB total`);
console.log(
  `Segments: ${rawSegments.toLocaleString()} in → ${Math.round(outSegments).toLocaleString()} out ` +
    `(${(100 - (outSegments / rawSegments) * 100).toFixed(1)}% reduction)`
);
console.log(`Labels: ${keptLabels.toLocaleString()} carried over from the archived packs`);
if (missing.length) {
  console.log(`\nNo source file — kept existing JSON for ${missing.length} zone variant(s):`);
  console.log('  ' + missing.join(', '));
}
