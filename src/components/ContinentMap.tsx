import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Continent, Zone } from '../data/types';
import { ZONES, ZONE_BY_ID } from '../data/zones';
import { levelColor } from './mapUtils';

const W = 720;
const H = 540;
const PAD_X = 70;
const PAD_TOP = 40;
const PAD_BOTTOM = 40;

export default function ContinentMap({
  continent,
  highlightIds
}: {
  continent: Continent;
  highlightIds?: Set<string>;
}) {
  const { zones, edges, sx, sy } = useMemo(() => {
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
    for (const z of zones) {
      for (const cid of z.connections) {
        if (!onCont.has(cid)) continue;
        const key = [z.id, cid].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([z, ZONE_BY_ID[cid]]);
      }
    }
    return { zones, edges, sx, sy };
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
            stroke="#4a4030"
            strokeWidth={1.6}
          />
        ))}
        {zones.map((z) => {
          const x = sx(z.mapX);
          const y = sy(z.mapY);
          const color = levelColor(z);
          const hl = highlightIds?.has(z.id);
          return (
            <Link key={z.id} to={`/atlas/${z.id}`}>
              <g style={{ cursor: 'pointer' }}>
                {hl && <circle cx={x} cy={y} r={13} fill="none" stroke="#d4a94e" strokeWidth={2} />}
                {z.type === 'dungeon' || z.type === 'plane' ? (
                  <rect x={x - 6} y={y - 6} width={12} height={12} fill={color} stroke="#161310" strokeWidth={1} transform={`rotate(45 ${x} ${y})`} />
                ) : z.type === 'city' ? (
                  <rect x={x - 6} y={y - 6} width={12} height={12} fill={color} stroke="#161310" strokeWidth={1} />
                ) : (
                  <circle cx={x} cy={y} r={7} fill={color} stroke="#161310" strokeWidth={1} />
                )}
                <text x={x} y={y - 11} textAnchor="middle" fill="#e8ded0" fontSize={11.5} fontFamily="Georgia, serif">
                  {z.name}
                </text>
                <text x={x} y={y + 20} textAnchor="middle" fill="#a8988a" fontSize={9}>
                  {z.type === 'city' ? 'city' : `${z.levelMin}–${z.levelMax}`}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
