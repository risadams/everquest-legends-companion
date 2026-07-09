// Renders a single EQ spell icon from the packed sprite built by
// scripts/import-spell-icons.mjs. `index` is the client icon index stored on a
// SpellRow (spells_us.txt field 75); unknown/absent indices render a blank slot.

import iconMap from '../data/spell-icons.json';

const SPRITE_URL = `${import.meta.env.BASE_URL}icons/spells.webp`;
const SRC = iconMap.icon; // native icon size (px)
const COLS = iconMap.cols;
const ROWS = Math.ceil(iconMap.count / COLS);
const POS = iconMap.pos as Record<string, number>;

export function SpellIcon({
  index,
  size = 30,
  title
}: {
  index?: number;
  size?: number;
  title?: string;
}) {
  const pos = index != null ? POS[String(index)] : undefined;
  const base: React.CSSProperties = {
    display: 'inline-block',
    width: size,
    height: size,
    borderRadius: 3,
    verticalAlign: 'middle',
    flex: 'none'
  };
  if (pos == null) {
    return <span style={{ ...base, background: 'rgba(255,255,255,0.05)' }} title={title} />;
  }
  const scale = size / SRC;
  const x = (pos % COLS) * SRC;
  const y = Math.floor(pos / COLS) * SRC;
  return (
    <span
      title={title}
      style={{
        ...base,
        backgroundImage: `url(${SPRITE_URL})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${x * scale}px -${y * scale}px`,
        backgroundSize: `${COLS * SRC * scale}px ${ROWS * SRC * scale}px`
      }}
    />
  );
}
