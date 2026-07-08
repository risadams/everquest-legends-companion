// The EQL Companion mark: a compass rose (borrowed from the atlas maps)
// set in an adventurer's shield. Inline SVG so it inherits crisp scaling
// and needs no asset request.

export default function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* shield */}
      <path
        d="M32 3 L55 10.5 V29 C55 44 45.5 55.5 32 61 C18.5 55.5 9 44 9 29 V10.5 Z"
        fill="#1c1509"
        stroke="var(--gold, #e0b25e)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* inner rule */}
      <path
        d="M32 8.5 L50.5 14.5 V28.7 C50.5 41 42.8 50.6 32 55.6 C21.2 50.6 13.5 41 13.5 28.7 V14.5 Z"
        fill="none"
        stroke="var(--gold-deep, #6d5628)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* compass rose: intercardinal then cardinal */}
      <path
        d="M32 17 L35 28 L46 31 L35 34 L32 45 L29 34 L18 31 L29 28 Z"
        fill="var(--gold-dim, #a9853f)"
        transform="rotate(45 32 31)"
      />
      <path
        d="M32 13 L36 27 L50 31 L36 35 L32 49 L28 35 L14 31 L28 27 Z"
        fill="var(--gold, #e0b25e)"
      />
      <circle cx="32" cy="31" r="2.4" fill="#1c1509" />
    </svg>
  );
}
