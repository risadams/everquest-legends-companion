import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Continent, Zone } from '../data/types';
import { ZONES, ZONE_BY_ID, CONTINENT_LABELS } from '../data/zones';
import { levelColor } from './mapUtils';
import MapDecor from './MapDecor';
const W = 720;
const H = 540;
const PAD_X = 70;
const PAD_TOP = 40;
const PAD_BOTTOM = 40;

// Stylized vector coastlines drawn in the same 0–100 coordinate space as the
// zone nodes, so land and markers scale together and can never drift apart.
// Shapes follow classic Norrath geography; the Planes have no earthly coast.
interface Coast {
  land: string[];
  /** decorative sea squiggles: [x, y] midpoints in 0–100 space */
  waves?: Array<[number, number]>;
}

const COASTLINES: Partial<Record<Continent, Coast>> = {
  antonica: {
    land: [
      // mainland, clockwise from the northwest
      `M 20 16
       Q 22 8 30 5 Q 36 2 40 6 Q 43 10 48 10
       Q 55 8 62 10 Q 70 10 73 15 Q 76 20 73 26
       Q 70 30 72 35 Q 74 42 71 47 Q 69 52 64 55
       Q 62 60 63 66 Q 66 74 71 82 Q 74 91 67 95
       Q 59 99 52 96 Q 45 98 41 93 Q 36 95 33 89
       Q 27 84 25 77 Q 20 72 20 65 Q 15 60 14 52
       Q 9 47 10 40 Q 10 33 13 28 Q 14 20 20 16 Z`
    ],
    waves: [
      [82, 30], [86, 60], [79, 75], [10, 70], [6, 25], [42, 3], [88, 12]
    ]
  },
  faydwer: {
    land: [
      // west lobe (Butcherblock) joined to the greater eastern mass
      `M 10 40
       Q 8 30 15 25 Q 22 20 30 21 Q 36 15 44 14
       Q 50 8 57 11 Q 64 10 70 15 Q 80 17 85 25
       Q 89 32 85 40 Q 87 48 82 54 Q 82 62 77 68
       Q 74 76 68 73 Q 60 72 55 66 Q 46 68 40 66
       Q 32 72 27 68 Q 20 72 16 64 Q 10 58 12 50
       Q 9 46 10 40 Z`
    ],
    waves: [[8, 78], [30, 85], [60, 86], [90, 65], [92, 12], [12, 10]]
  },
  odus: {
    land: [
      // Odus mainland
      `M 37 24
       Q 43 18 51 21 Q 58 22 59 30 Q 57 36 58 42
       Q 62 50 62 58 Q 66 64 64 72 Q 62 82 53 86
       Q 45 90 39 84 Q 32 82 30 74 Q 26 66 29 56
       Q 28 44 31 36 Q 32 28 37 24 Z`,
      // Kerra Isle
      `M 14 56 Q 18 51 23 54 Q 27 58 24 63 Q 20 68 15 65 Q 11 61 14 56 Z`
    ],
    waves: [[76, 24], [84, 56], [70, 84], [10, 30], [8, 80], [44, 8]]
  }
};

function WaveMark({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x - 2.2} ${y} q 1.1 -1 2.2 0 q 1.1 1 2.2 0`}
      fill="none"
      stroke="#a98f5f"
      strokeWidth={1.4}
      opacity={0.55}
      vectorEffect="non-scaling-stroke"
    />
  );
}

// ── Label collision avoidance ────────────────────────────────
// Every label (zone names, departure links, port captions) claims a box.
// Candidates are tried in preference order; the first free slot wins, and
// if everything collides we take the least-overlapping candidate.

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function overlapArea(a: Box, b: Box): number {
  const w = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
  const h = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
  return w > 0 && h > 0 ? w * h : 0;
}

function totalOverlap(box: Box, placed: Box[]): number {
  let sum = 0;
  for (const p of placed) sum += overlapArea(box, p);
  return sum;
}

/** clamp a box (and its render position) fully onto the sheet */
function clampBox(box: Box): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;
  if (box.x1 < 4) dx = 4 - box.x1;
  if (box.x2 + dx > W - 4) dx = W - 4 - box.x2;
  if (box.y1 < 14) dy = 14 - box.y1;
  if (box.y2 + dy > H - 4) dy = H - 4 - box.y2;
  box.x1 += dx;
  box.x2 += dx;
  box.y1 += dy;
  box.y2 += dy;
  return { dx, dy };
}

interface Candidate {
  anchor: 'start' | 'middle' | 'end';
  tx: number;
  ty: number; // baseline of the first text line
}

/** pick the best candidate, mutating `placed` with the claimed box */
function place(
  cands: Candidate[],
  width: number,
  ascent: number,
  descent: number,
  placed: Box[]
): Candidate {
  let best: { cand: Candidate; overlap: number } | null = null;
  for (const c of cands) {
    const x1 = c.anchor === 'middle' ? c.tx - width / 2 : c.anchor === 'start' ? c.tx : c.tx - width;
    const box: Box = { x1, y1: c.ty - ascent, x2: x1 + width, y2: c.ty + descent };
    const { dx, dy } = clampBox(box);
    const cand = { ...c, tx: c.tx + dx, ty: c.ty + dy };
    const overlap = totalOverlap(box, placed);
    if (overlap === 0) {
      placed.push(box);
      return cand;
    }
    if (!best || overlap < best.overlap) best = { cand, overlap };
  }
  const c = best!.cand;
  const x1 = c.anchor === 'middle' ? c.tx - width / 2 : c.anchor === 'start' ? c.tx : c.tx - width;
  placed.push({ x1, y1: c.ty - ascent, x2: x1 + width, y2: c.ty + descent });
  return c;
}

const nameWidth = (s: string) => s.length * 6.9; // ~Georgia bold 11.5px
const smallWidth = (s: string) => s.length * 6.4; // ~Georgia bold 10.5px

export default function ContinentMap({
  continent,
  highlightIds
}: {
  continent: Continent;
  highlightIds?: Set<string>;
}) {
  const coast = COASTLINES[continent];

  const { zones, edges, departures, spellOnlyLabels, labels, sx, sy } = useMemo(() => {
    const zones = ZONES.filter((z) => z.continent === continent);
    const onCont = new Set(zones.map((z) => z.id));
    let sx: (v: number) => number;
    let sy: (v: number) => number;
    if (coast) {
      // coastline continents: node coords share the coastline's 0–100 space
      sx = (v: number) => (v / 100) * W;
      sy = (v: number) => (v / 100) * H;
    } else {
      // no coast (the Planes): auto-fit the coordinate extents to the viewport
      const xs = zones.map((z) => z.mapX);
      const ys = zones.map((z) => z.mapY);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      sx = (v: number) => PAD_X + ((v - minX) / spanX) * (W - PAD_X * 2);
      sy = (v: number) => PAD_TOP + ((v - minY) / spanY) * (H - PAD_TOP - PAD_BOTTOM);
    }
    const seen = new Set<string>();
    const edges: Array<[Zone, Zone]> = [];
    const rawDepartures: Array<{ from: Zone; to: Zone }> = [];
    for (const z of zones) {
      for (const cid of z.connections) {
        const n = ZONE_BY_ID[cid];
        if (!n) continue;
        if (!onCont.has(cid)) {
          rawDepartures.push({ from: z, to: n });
          continue;
        }
        const key = [z.id, cid].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([z, n]);
      }
    }
    // planes with no zone-line entrance at all — reachable only by spell
    const spellOnly = zones.filter(
      (z) =>
        z.type === 'plane' &&
        z.connections.length === 0 &&
        !ZONES.some((o) => o.connections.includes(z.id))
    );

    // ── place all labels without overlaps ────────────────────
    // Markers are obstacles from the start, as are the corners covered by
    // the compass rose (top-right) and title cartouche (bottom-left).
    const placed: Box[] = [
      { x1: W - 92, y1: 4, x2: W - 4, y2: 88 },
      { x1: 4, y1: H - 44, x2: 190, y2: H - 4 },
      ...zones.map((z) => ({
        x1: sx(z.mapX) - 9,
        y1: sy(z.mapY) - 9,
        x2: sx(z.mapX) + 9,
        y2: sy(z.mapY) + 9
      }))
    ];

    const labels = new Map<string, Candidate & { sub: string }>();
    const ordered = [...zones].sort((a, b) => sy(a.mapY) - sy(b.mapY) || sx(a.mapX) - sx(b.mapX));
    for (const z of ordered) {
      const x = sx(z.mapX);
      const y = sy(z.mapY);
      const sub = z.type === 'city' ? 'city' : `${z.levelMin}–${z.levelMax}`;
      const width = Math.max(nameWidth(z.name), sub.length * 5.2);
      // name baseline + level line beneath it: ascent 11, descent 15
      const cand = place(
        [
          { anchor: 'middle', tx: x, ty: y - 24 }, // above the marker
          { anchor: 'middle', tx: x, ty: y + 22 }, // below
          { anchor: 'start', tx: x + 13, ty: y - 2 }, // right
          { anchor: 'end', tx: x - 13, ty: y - 2 }, // left
          { anchor: 'start', tx: x + 11, ty: y - 16 }, // upper-right
          { anchor: 'end', tx: x - 11, ty: y - 16 }, // upper-left
          { anchor: 'start', tx: x + 11, ty: y + 14 }, // lower-right
          { anchor: 'end', tx: x - 11, ty: y + 14 }, // lower-left
          { anchor: 'middle', tx: x, ty: y - 38 }, // farther above
          { anchor: 'middle', tx: x, ty: y + 36 } // farther below
        ],
        width,
        11,
        15,
        placed
      );
      labels.set(z.id, { ...cand, sub });
    }

    // departures join the same collision field
    const departures = rawDepartures.map(({ from, to }) => {
      const x = sx(from.mapX);
      const y = sy(from.mapY);
      const ang = Math.atan2(y - H / 2, x - W / 2); // stub aims off the map
      const ex = x + Math.cos(ang) * 34;
      const ey = y + Math.sin(ang) * 34;
      const icon = to.type === 'plane' || from.type === 'plane' ? '✦' : '⚓';
      const label = `${icon} ${to.name} · ${CONTINENT_LABELS[to.continent]}`;
      const width = smallWidth(label);
      const along: 'start' | 'middle' | 'end' =
        Math.cos(ang) > 0.3 ? 'start' : Math.cos(ang) < -0.3 ? 'end' : 'middle';
      const flip = along === 'start' ? 'end' : along === 'end' ? 'start' : 'middle';
      const baseY = ey + (Math.sin(ang) > 0.3 ? 12 : Math.sin(ang) < -0.3 ? -6 : 4);
      // fan out along the stub and vertically until a free spot appears
      const cands: Candidate[] = [];
      for (const dist of [0, 22]) {
        const px = ex + Math.cos(ang) * dist;
        const py = baseY + Math.sin(ang) * dist;
        for (const dy of [0, 14, -14, 28]) {
          cands.push({ anchor: along, tx: px, ty: py + dy });
          cands.push({ anchor: flip, tx: px, ty: py + dy });
        }
      }
      const cand = place(cands, width, 9, 3, placed);
      return { from, to, x, y, ex, ey, label, ...cand };
    });

    const spellOnlyLabels = spellOnly.map((z) => {
      const text = '✦ reached by wizard port — see Travel';
      const width = text.length * 5.2;
      const x = sx(z.mapX);
      const y = sy(z.mapY);
      const cand = place(
        [
          { anchor: 'middle' as const, tx: x, ty: y + 34 },
          { anchor: 'middle' as const, tx: x, ty: y + 48 },
          { anchor: 'middle' as const, tx: x, ty: y - 36 }
        ],
        width,
        9,
        3,
        placed
      );
      return { zone: z, text, ...cand };
    });

    return { zones, edges, departures, spellOnlyLabels, labels, sx, sy };
  }, [continent, coast]);

  return (
    <div className="continent-map-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of ${continent}`}>
        {coast && (
          <g transform={`scale(${W / 100} ${H / 100})`}>
            {coast.land.map((d, i) => (
              <g key={i}>
                {/* shoreline glow, then land, then inked coast */}
                <path d={d} fill="none" stroke="#c3ab7c" strokeWidth={9} opacity={0.55} vectorEffect="non-scaling-stroke" />
                <path d={d} fill="#e1d2a2" />
                <path d={d} fill="none" stroke="#6b5334" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                <path d={d} fill="none" stroke="#8a6d3f" strokeWidth={5} opacity={0.25} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
            {coast.waves?.map(([x, y], i) => (
              <WaveMark key={i} x={x} y={y} />
            ))}
          </g>
        )}
        {edges.map(([a, b]) => (
          <line
            key={`${a.id}-${b.id}`}
            x1={sx(a.mapX)}
            y1={sy(a.mapY)}
            x2={sx(b.mapX)}
            y2={sy(b.mapY)}
            stroke="#8a6d3f"
            strokeWidth={1.7}
            strokeDasharray="5 4"
            opacity={0.85}
          />
        ))}
        {departures.map((d) => (
          <Link key={`${d.from.id}→${d.to.id}`} to={`/atlas/${d.to.id}`}>
            <g style={{ cursor: 'pointer' }}>
              <line
                x1={d.x}
                y1={d.y}
                x2={d.ex}
                y2={d.ey}
                stroke="#245c8f"
                strokeWidth={1.6}
                strokeDasharray="2 3"
                opacity={0.85}
              />
              <text
                x={d.tx}
                y={d.ty}
                textAnchor={d.anchor}
                fill="#1d4d7a"
                fontSize={10.5}
                fontFamily="Georgia, serif"
                fontWeight="bold"
                paintOrder="stroke"
                stroke="#f0e4c8"
                strokeWidth={3}
                style={{ textDecoration: 'underline' }}
              >
                {d.label}
              </text>
            </g>
          </Link>
        ))}
        {spellOnlyLabels.map((s) => (
          <Link key={`${s.zone.id}-port`} to="/travel">
            <text
              x={s.tx}
              y={s.ty}
              textAnchor={s.anchor}
              fill="#245c8f"
              fontSize={10}
              fontFamily="Georgia, serif"
              fontStyle="italic"
              paintOrder="stroke"
              stroke="#f0e4c8"
              strokeWidth={2.2}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {s.text}
            </text>
          </Link>
        ))}
        {zones.map((z) => {
          const x = sx(z.mapX);
          const y = sy(z.mapY);
          const color = levelColor(z);
          const hl = highlightIds?.has(z.id);
          const label = labels.get(z.id)!;
          return (
            <Link key={z.id} to={`/atlas/${z.id}`}>
              <g style={{ cursor: 'pointer' }}>
                {hl && <circle cx={x} cy={y} r={13} fill="none" stroke="#8a5c1e" strokeWidth={2} />}
                {z.type === 'dungeon' || z.type === 'plane' ? (
                  <rect x={x - 6} y={y - 6} width={12} height={12} fill={color} stroke="#3f3120" strokeWidth={1} transform={`rotate(45 ${x} ${y})`} />
                ) : z.type === 'city' ? (
                  <rect x={x - 6} y={y - 6} width={12} height={12} fill={color} stroke="#3f3120" strokeWidth={1} />
                ) : (
                  <circle cx={x} cy={y} r={7} fill={color} stroke="#3f3120" strokeWidth={1} />
                )}
                <text
                  x={label.tx}
                  y={label.ty}
                  textAnchor={label.anchor}
                  fill="#2e2113"
                  fontSize={11.5}
                  fontFamily="Georgia, serif"
                  fontWeight="bold"
                  paintOrder="stroke"
                  stroke="#f0e4c8"
                  strokeWidth={3.2}
                >
                  {z.name}
                </text>
                <text
                  x={label.tx}
                  y={label.ty + 12}
                  textAnchor={label.anchor}
                  fill="#59462c"
                  fontSize={9}
                  paintOrder="stroke"
                  stroke="#f0e4c8"
                  strokeWidth={2.4}
                >
                  {label.sub}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
      <MapDecor title={CONTINENT_LABELS[continent]} />
    </div>
  );
}
