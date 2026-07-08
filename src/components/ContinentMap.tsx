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

const nameWidth = (s: string) => s.length * 6.3; // ~Georgia 11.5px
const smallWidth = (s: string) => s.length * 5.6; // ~Georgia 10.5px

export default function ContinentMap({
  continent,
  highlightIds
}: {
  continent: Continent;
  highlightIds?: Set<string>;
}) {
  const { zones, edges, departures, spellOnlyLabels, labels, sx, sy } = useMemo(() => {
    const zones = ZONES.filter((z) => z.continent === continent);
    const onCont = new Set(zones.map((z) => z.id));
    // Auto-fit this continent's coordinate extents to the viewport.
    const xs = zones.map((z) => z.mapX);
    const ys = zones.map((z) => z.mapY);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);
    const sx = (v: number) => PAD_X + ((v - minX) / spanX) * (W - PAD_X * 2);
    const sy = (v: number) => PAD_TOP + ((v - minY) / spanY) * (H - PAD_TOP - PAD_BOTTOM);
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
    // Markers are obstacles from the start; zones are labeled top-to-bottom.
    const placed: Box[] = zones.map((z) => ({
      x1: sx(z.mapX) - 9,
      y1: sy(z.mapY) - 9,
      x2: sx(z.mapX) + 9,
      y2: sy(z.mapY) + 9
    }));

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
      const cand = place(
        [
          { anchor: along, tx: ex, ty: baseY },
          { anchor: along, tx: ex, ty: baseY + 14 },
          { anchor: along, tx: ex, ty: baseY - 14 },
          { anchor: flip, tx: ex, ty: baseY },
          { anchor: flip, tx: ex, ty: baseY + 14 }
        ],
        width,
        9,
        3,
        placed
      );
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
  }, [continent]);

  return (
    <div className="continent-map-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of ${continent}`}>
        {edges.map(([a, b]) => (
          <line
            key={`${a.id}-${b.id}`}
            x1={sx(a.mapX)}
            y1={sy(a.mapY)}
            x2={sx(b.mapX)}
            y2={sy(b.mapY)}
            stroke="#8a6d3f"
            strokeWidth={1.6}
            strokeDasharray="5 4"
            opacity={0.8}
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
                fill="#245c8f"
                fontSize={10.5}
                fontFamily="Georgia, serif"
                paintOrder="stroke"
                stroke="#f0e4c8"
                strokeWidth={2.4}
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
          const subAnchorX =
            label.anchor === 'middle' ? label.tx : label.anchor === 'start' ? label.tx : label.tx;
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
                  fill="#3a2c1c"
                  fontSize={11.5}
                  fontFamily="Georgia, serif"
                  paintOrder="stroke"
                  stroke="#f0e4c8"
                  strokeWidth={2.6}
                >
                  {z.name}
                </text>
                <text
                  x={subAnchorX}
                  y={label.ty + 12}
                  textAnchor={label.anchor}
                  fill="#6a563b"
                  fontSize={9}
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
