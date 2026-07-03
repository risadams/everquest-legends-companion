import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Zone } from '../data/types';
import { ZONE_BY_ID } from '../data/zones';
import { seededRandom, typeFill, levelColor } from './mapUtils';

const W = 460;
const H = 340;
const CX = W / 2;
const CY = H / 2 + 8;
const RX = 172;
const RY = 118;

interface Placed {
  x: number;
  y: number;
}

function boundaryPath(seed: string): string {
  const rand = seededRandom(seed + ':boundary');
  const points: Placed[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const jitter = 0.82 + rand() * 0.3;
    points.push({
      x: CX + Math.cos(angle) * RX * jitter,
      y: CY + Math.sin(angle) * RY * jitter
    });
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const next = points[(i + 1) % n];
    const mx = (p.x + next.x) / 2;
    const my = (p.y + next.y) / 2;
    if (i === 0) d = `M ${mx.toFixed(1)} ${my.toFixed(1)} `;
    const nn = points[(i + 2) % n];
    const mx2 = (next.x + nn.x) / 2;
    const my2 = (next.y + nn.y) / 2;
    d += `Q ${next.x.toFixed(1)} ${next.y.toFixed(1)} ${mx2.toFixed(1)} ${my2.toFixed(1)} `;
  }
  return d + 'Z';
}

function edgePoint(angle: number, scale = 1): Placed {
  return {
    x: CX + Math.cos(angle) * RX * 0.92 * scale,
    y: CY + Math.sin(angle) * RY * 0.92 * scale
  };
}

/** Procedural fallback map for zones without imported geometry. */
export default function SchematicZoneMap({ zone }: { zone: Zone }) {
  const { path, exits, spots, terrain } = useMemo(() => {
    const rand = seededRandom(zone.id + ':content');

    const exits = zone.connections
      .map((cid) => ZONE_BY_ID[cid])
      .filter((z): z is Zone => Boolean(z))
      .map((n, i) => {
        let angle: number;
        if (n.continent === zone.continent) {
          angle = Math.atan2(n.mapY - zone.mapY, n.mapX - zone.mapX);
        } else {
          angle = Math.PI / 2 + (i - zone.connections.length / 2) * 0.5;
        }
        const p = edgePoint(angle);
        return { neighbor: n, ...p, angle };
      });

    const spots = zone.hotspots.map((h, i) => {
      const angle = i * 2.39996 + rand() * 0.8;
      const r = 0.25 + 0.5 * ((i + 1) / (zone.hotspots.length + 1)) + rand() * 0.1;
      return {
        hotspot: h,
        x: CX + Math.cos(angle) * RX * 0.62 * r,
        y: CY + Math.sin(angle) * RY * 0.62 * r
      };
    });

    const terrain = Array.from({ length: 26 }, () => {
      const angle = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.85;
      return {
        x: CX + Math.cos(angle) * RX * r,
        y: CY + Math.sin(angle) * RY * r,
        kind: rand()
      };
    });

    return { path: boundaryPath(zone.id), exits, spots, terrain };
  }, [zone]);

  return (
    <div className="zone-map-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Schematic map of ${zone.name}`}>
        <path d={path} fill={typeFill(zone.type)} stroke="#5a4c34" strokeWidth={2.5} />
        <path d={path} fill="none" stroke="#3b3226" strokeWidth={7} opacity={0.35} />

        {terrain.map((t, i) =>
          t.kind < 0.5 ? (
            <path
              key={i}
              d={`M ${t.x - 5} ${t.y + 3} L ${t.x} ${t.y - 5} L ${t.x + 5} ${t.y + 3}`}
              fill="none"
              stroke="#4a4030"
              strokeWidth={1.2}
              opacity={0.7}
            />
          ) : (
            <circle key={i} cx={t.x} cy={t.y} r={1.4} fill="#4a4030" opacity={0.6} />
          )
        )}

        <text x={CX} y={30} textAnchor="middle" fill="#d4a94e" fontSize={19} fontFamily="Georgia, serif">
          {zone.name}
        </text>
        <text x={CX} y={48} textAnchor="middle" fill="#a8988a" fontSize={11} fontFamily="Georgia, serif">
          {zone.type === 'city' ? 'City' : `Levels ${zone.levelMin}–${zone.levelMax}`}
        </text>

        <g transform={`translate(${W - 34}, 44)`} stroke="#7a6a4c" fill="#7a6a4c">
          <line x1={0} y1={12} x2={0} y2={-12} strokeWidth={1.2} />
          <path d="M 0 -12 L -4 -4 L 4 -4 Z" />
          <text x={0} y={-16} textAnchor="middle" fontSize={10} stroke="none">N</text>
        </g>

        {spots.map(({ hotspot, x, y }, i) => (
          <g key={i}>
            <path
              d={`M ${x} ${y - 6} L ${x + 6} ${y} L ${x} ${y + 6} L ${x - 6} ${y} Z`}
              fill={levelColor(zone)}
              stroke="#161310"
              strokeWidth={1}
            />
            <text x={x} y={y - 10} textAnchor="middle" fill="#e8ded0" fontSize={11} fontFamily="Georgia, serif">
              {hotspot.name}
            </text>
            <text x={x} y={y + 18} textAnchor="middle" fill="#a8988a" fontSize={9.5}>
              {hotspot.levels}
            </text>
          </g>
        ))}

        {exits.map(({ neighbor, x, y, angle }) => {
          const lp = {
            x: CX + Math.cos(angle) * (RX * 0.92 + 4),
            y: CY + Math.sin(angle) * (RY * 0.92 + 4)
          };
          const anchor = Math.cos(angle) > 0.35 ? 'end' : Math.cos(angle) < -0.35 ? 'start' : 'middle';
          const inside = {
            x: CX + Math.cos(angle) * RX * 0.78,
            y: CY + Math.sin(angle) * RY * 0.78
          };
          return (
            <Link key={neighbor.id} to={`/atlas/${neighbor.id}`}>
              <g style={{ cursor: 'pointer' }}>
                <line x1={inside.x} y1={inside.y} x2={x} y2={y} stroke="#7a6a4c" strokeWidth={2} strokeDasharray="3 3" />
                <circle cx={x} cy={y} r={6} fill="#161310" stroke="#d4a94e" strokeWidth={1.8} />
                <text
                  x={lp.x + (anchor === 'end' ? -10 : anchor === 'start' ? 10 : 0)}
                  y={lp.y + (Math.sin(angle) > 0.4 ? 18 : Math.sin(angle) < -0.4 ? -10 : 4)}
                  textAnchor={anchor}
                  fill="#7fa8c9"
                  fontSize={11}
                  fontFamily="Georgia, serif"
                >
                  {neighbor.name}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
