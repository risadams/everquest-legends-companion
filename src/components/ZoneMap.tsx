import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { Zone } from '../data/types';
import { ZONE_BY_ID } from '../data/zones';
import SchematicZoneMap from './SchematicZoneMap';
import MapDecor from './MapDecor';

// ── Imported Brewall map data (eqmaps.info) ─────────────────

interface MapPoint {
  x: number;
  y: number;
  c: [number, number, number];
  s: number;
  t: string;
}
interface MapPath {
  c: number;
  pts: number[];
}
interface MapVariant {
  label: string;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  colors: number[][];
  paths: MapPath[];
  points: MapPoint[];
}
interface ZoneMapData {
  variants: MapVariant[];
}

const mapModules = import.meta.glob('../data/maps/*.json');

// ── Ink palette for the parchment sheet ─────────────────────
// Brewall maps are authored for light in-game backgrounds, which suits the
// parchment: near-black walls become sepia ink, and colors too pale to read
// on paper are darkened preserving hue.

const INK = '#3f3120';
const PARCHMENT = '#f0e4c8';
const EXIT_BLUE = '#245c8f';

function displayColor([r, g, b]: number[] | [number, number, number]): string {
  const max = Math.max(r, g, b);
  if (max < 70) return INK;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum > 150) {
    const k = 150 / lum;
    r = Math.round(r * k);
    g = Math.round(g * k);
    b = Math.round(b * k);
  }
  return `rgb(${r},${g},${b})`;
}

// ── Exit detection: "to Somewhere" labels → connection links ─

const STOP_WORDS = new Set(['the', 'of', 'to', 'a']);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function exitTarget(label: string, zone: Zone): string | null {
  if (!/^to\s/i.test(label)) return null;
  const labelToks = tokens(label.replace(/^to\s+/i, ''));
  let best: string | null = null;
  let bestScore = 0;
  for (const cid of zone.connections) {
    const c = ZONE_BY_ID[cid];
    if (!c) continue;
    const zoneToks = tokens(c.name);
    if (zoneToks.length === 0) continue;
    const hits = zoneToks.filter((zt) =>
      labelToks.some((lt) => lt.startsWith(zt) || zt.startsWith(lt))
    ).length;
    const score = hits / zoneToks.length;
    if (hits > 0 && score > bestScore) {
      bestScore = score;
      best = cid;
    }
  }
  return bestScore >= 0.5 ? best : null;
}

// ── Interactive renderer ────────────────────────────────────

type LabelMode = 'key' | 'all' | 'none';

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

function fitBounds(v: MapVariant): ViewBox {
  const pad = 0.05;
  const w = Math.max(1, v.bounds.maxX - v.bounds.minX);
  const h = Math.max(1, v.bounds.maxY - v.bounds.minY);
  return {
    x: v.bounds.minX - w * pad,
    y: v.bounds.minY - h * pad,
    w: w * (1 + pad * 2),
    h: h * (1 + pad * 2)
  };
}

function RealZoneMap({ zone, data }: { zone: Zone; data: ZoneMapData }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [labelMode, setLabelMode] = useState<LabelMode>('key');
  const variant = data.variants[Math.min(variantIdx, data.variants.length - 1)];
  const [view, setView] = useState<ViewBox>(() => fitBounds(variant));
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ px: number; py: number; view: ViewBox } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setView(fitBounds(variant));
  }, [variant]);

  const clientToMap = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return {
        x: view.x + ((clientX - rect.left) / rect.width) * view.w,
        y: view.y + ((clientY - rect.top) / rect.height) * view.h
      };
    },
    [view]
  );

  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      setView((v) => {
        const px = cx ?? v.x + v.w / 2;
        const py = cy ?? v.y + v.h / 2;
        const w = v.w * factor;
        const h = v.h * factor;
        return {
          x: px - ((px - v.x) / v.w) * w,
          y: py - ((py - v.y) / v.h) * h,
          w,
          h
        };
      });
    },
    []
  );

  function onWheel(e: ReactWheelEvent<SVGSVGElement>) {
    const { x, y } = clientToMap(e.clientX, e.clientY);
    zoomAt(e.deltaY > 0 ? 1.25 : 0.8, x, y);
  }

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, view };
  }
  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    const svg = svgRef.current;
    if (!d || !svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = ((e.clientX - d.px) / rect.width) * d.view.w;
    const dy = ((e.clientY - d.py) / rect.height) * d.view.h;
    setView({ ...d.view, x: d.view.x - dx, y: d.view.y - dy });
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  const strokes = useMemo(() => variant.colors.map(displayColor), [variant]);

  // Font/dot sizes track the current zoom so labels stay screen-readable.
  const fs = view.w / 62;
  const dot = view.w / 240;

  const visiblePoints = useMemo(() => {
    if (labelMode === 'none') return [];
    return variant.points
      .map((p) => ({ ...p, target: exitTarget(p.t, zone) }))
      .filter((p) => {
        if (p.target) return true; // always show clickable exits
        if (labelMode === 'all') return true;
        return p.s >= 3; // key labels only
      });
  }, [variant, labelMode, zone]);

  return (
    <div>
      <div className="filter-bar" style={{ margin: '0 0 0.5rem' }}>
        {data.variants.length > 1 &&
          data.variants.map((v, i) => (
            <button key={v.label} className={i === variantIdx ? 'active' : ''} onClick={() => setVariantIdx(i)}>
              {v.label}
            </button>
          ))}
        <span className="header-spacer" />
        <button onClick={() => zoomAt(0.7)} aria-label="Zoom in">＋</button>
        <button onClick={() => zoomAt(1.45)} aria-label="Zoom out">－</button>
        <button onClick={() => setView(fitBounds(variant))}>Fit</button>
        <select
          aria-label="Label detail"
          value={labelMode}
          onChange={(e) => setLabelMode(e.target.value as LabelMode)}
        >
          <option value="key">Key labels</option>
          <option value="all">All labels</option>
          <option value="none">No labels</option>
        </select>
      </div>
      <div className="zone-map-wrap">
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          role="img"
          aria-label={`Map of ${zone.name}`}
          style={{ touchAction: 'none', cursor: 'grab', aspectRatio: '4 / 3' }}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {variant.paths.map((p, i) => (
            <polyline
              key={i}
              points={p.pts.join(' ')}
              fill="none"
              stroke={strokes[p.c]}
              strokeWidth={1.1}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {visiblePoints.map((p, i) => {
            const color = p.target ? EXIT_BLUE : displayColor(p.c);
            const text = p.target ? p.t.replace(/^to\s+/i, '→ ') : p.t;
            return (
              <g
                key={`${p.x},${p.y},${i}`}
                style={p.target ? { cursor: 'pointer' } : undefined}
                onClick={p.target ? () => navigate(`/atlas/${p.target}`) : undefined}
              >
                <circle cx={p.x} cy={p.y} r={p.target ? dot * 2 : dot * 1.2} fill={color} />
                <text
                  x={p.x + fs * 0.35}
                  y={p.y - fs * 0.3}
                  fill={color}
                  fontSize={fs * (p.s >= 3 ? 1 : 0.8)}
                  fontFamily="Georgia, serif"
                  paintOrder="stroke"
                  stroke={PARCHMENT}
                  strokeWidth={fs * 0.18}
                  style={p.target ? { textDecoration: 'underline' } : undefined}
                >
                  {text}
                </text>
              </g>
            );
          })}
        </svg>
        <MapDecor
          title={zone.name}
          subtitle={zone.type === 'city' ? 'City' : `Levels ${zone.levelMin}–${zone.levelMax}`}
        />
      </div>
      <p className="small muted" style={{ marginTop: '0.35rem' }}>
        Drag to pan · scroll to zoom · blue underlined markers jump to the connected zone. Map data
        by Brewall (<a href="https://www.eqmaps.info/" target="_blank" rel="noreferrer">eqmaps.info</a>).
      </p>
    </div>
  );
}

// ── Public component: real geometry when available ──────────

export default function ZoneMap({ zone }: { zone: Zone }) {
  const [data, setData] = useState<ZoneMapData | 'missing' | null>(null);

  useEffect(() => {
    const loader = mapModules[`../data/maps/${zone.id}.json`];
    if (!loader) {
      setData('missing');
      return;
    }
    let live = true;
    setData(null);
    loader().then((m) => {
      if (live) setData((m as { default: ZoneMapData }).default);
    });
    return () => {
      live = false;
    };
  }, [zone.id]);

  if (data === 'missing') return <SchematicZoneMap zone={zone} />;
  if (!data)
    return (
      <div className="zone-map-wrap" style={{ aspectRatio: '4 / 3', display: 'grid', placeItems: 'center' }}>
        <span style={{ color: '#6a563b', fontFamily: 'Georgia, serif' }}>Unrolling the map…</span>
      </div>
    );
  return <RealZoneMap key={zone.id} zone={zone} data={data} />;
}
