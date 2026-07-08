// Shared decorative overlays for the parchment-styled maps: an aged double
// frame, a compass rose, and a small-caps title cartouche. All overlays are
// screen-space (they don't pan/zoom with the map) and ignore pointer events.

export function CompassRose({ size = 62 }: { size?: number }) {
  return (
    <svg
      className="map-compass"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="33" fill="none" stroke="#5a4426" strokeWidth="1.4" opacity="0.7" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="#5a4426" strokeWidth="0.7" opacity="0.55" />
      <path
        d="M50 26 L55 45 L74 50 L55 55 L50 74 L45 55 L26 50 L45 45 Z"
        fill="#8a6d3f"
        opacity="0.75"
        transform="rotate(45 50 50)"
      />
      <path d="M50 10 L56 44 L90 50 L56 56 L50 90 L44 56 L10 50 L44 44 Z" fill="#5a4426" />
      <path d="M50 10 L50 90 M10 50 L90 50" stroke="#f0e4c8" strokeWidth="0.8" opacity="0.55" />
      <text
        x="50"
        y="8"
        textAnchor="middle"
        fontSize="12"
        fontFamily="Georgia, serif"
        fill="#5a4426"
      >
        N
      </text>
    </svg>
  );
}

export default function MapDecor({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <>
      <div className="map-frame" aria-hidden="true" />
      <CompassRose />
      {title && (
        <div className="map-cartouche">
          {title}
          {subtitle && <span className="map-cartouche-sub"> · {subtitle}</span>}
        </div>
      )}
    </>
  );
}
