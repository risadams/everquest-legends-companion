// Legend for the continent map: marker shapes, level-band colors, and routes.
// Color thresholds mirror levelColor() in mapUtils.ts.

const LEVEL_BANDS: Array<{ label: string; color: string }> = [
  { label: 'Levels 1–9', color: '#7fbf7f' },
  { label: '10–19', color: '#8fb7cf' },
  { label: '20–29', color: '#e0b050' },
  { label: '30–39', color: '#dd8f55' },
  { label: '40+', color: '#d9705e' }
];

function Swatch({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 18 18" width={16} height={16} aria-hidden="true">
      {children}
    </svg>
  );
}

export default function MapLegend() {
  return (
    <div className="map-legend" data-map-legend>
      <span className="map-legend-group">
        <span className="map-legend-item">
          <Swatch>
            <circle cx={9} cy={9} r={6} fill="#b6a593" stroke="#3f3120" strokeWidth={1.2} />
          </Swatch>
          outdoor
        </span>
        <span className="map-legend-item">
          <Swatch>
            <rect x={3.5} y={3.5} width={11} height={11} fill="#b6a593" stroke="#3f3120" strokeWidth={1.2} />
          </Swatch>
          city
        </span>
        <span className="map-legend-item">
          <Swatch>
            <rect x={4} y={4} width={10} height={10} fill="#b6a593" stroke="#3f3120" strokeWidth={1.2} transform="rotate(45 9 9)" />
          </Swatch>
          dungeon / plane
        </span>
      </span>
      <span className="map-legend-group">
        {LEVEL_BANDS.map((b) => (
          <span className="map-legend-item" key={b.label}>
            <Swatch>
              <circle cx={9} cy={9} r={6} fill={b.color} stroke="#3f3120" strokeWidth={1.2} />
            </Swatch>
            {b.label}
          </span>
        ))}
      </span>
      <span className="map-legend-group">
        <span className="map-legend-item">
          <Swatch>
            <line x1={1} y1={9} x2={17} y2={9} stroke="#8a6d3f" strokeWidth={2} strokeDasharray="4 3" />
          </Swatch>
          zone line
        </span>
        <span className="map-legend-item">
          <Swatch>
            <line x1={1} y1={9} x2={17} y2={9} stroke="#245c8f" strokeWidth={2} strokeDasharray="2 3" />
          </Swatch>
          ⚓/✦ to another continent or plane
        </span>
        <span className="map-legend-item">
          <Swatch>
            <circle cx={9} cy={9} r={6.5} fill="none" stroke="#8a5c1e" strokeWidth={2} />
          </Swatch>
          advisor pick
        </span>
      </span>
    </div>
  );
}
