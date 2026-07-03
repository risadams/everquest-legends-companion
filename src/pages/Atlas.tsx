import { useMemo, useState } from 'react';
import type { Continent, ZoneType } from '../data/types';
import { ZONES, CONTINENTS, CONTINENT_LABELS } from '../data/zones';
import ContinentMap from '../components/ContinentMap';
import ZoneCard from '../components/ZoneCard';
import { useCharacters } from '../context/CharacterContext';
import { levelFit, recommendZones } from '../lib/advisor';

const TYPE_FILTERS: Array<{ id: ZoneType | 'all'; label: string }> = [
  { id: 'all', label: 'All types' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'dungeon', label: 'Dungeons' },
  { id: 'city', label: 'Cities' },
  { id: 'plane', label: 'Planes' }
];

export default function Atlas() {
  const [continent, setContinent] = useState<Continent>('antonica');
  const [type, setType] = useState<ZoneType | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [forMe, setForMe] = useState(false);
  const { active } = useCharacters();

  const highlights = useMemo(() => {
    if (!active) return undefined;
    return new Set(recommendZones(active, 8).map((r) => r.zone.id));
  }, [active]);

  const zones = useMemo(() => {
    const lvl = levelFilter ? parseInt(levelFilter, 10) : null;
    return ZONES.filter((z) => z.continent === continent)
      .filter((z) => type === 'all' || z.type === type)
      .filter((z) => lvl === null || (lvl >= z.levelMin && lvl <= z.levelMax))
      .filter(
        (z) =>
          !forMe ||
          !active ||
          z.type === 'city' ||
          ['perfect', 'good'].includes(levelFit(z, active.level))
      )
      .sort((a, b) => a.levelMin - b.levelMin || a.name.localeCompare(b.name));
  }, [continent, type, levelFilter, forMe, active]);

  return (
    <div>
      <h1>Atlas of Norrath</h1>
      <p className="muted">
        Every launch zone with level ranges, hotspots, and connections. Click a zone on the map or in
        the grid.
      </p>
      <div className="filter-bar">
        {CONTINENTS.map((c) => (
          <button key={c} className={c === continent ? 'active' : ''} onClick={() => setContinent(c)}>
            {CONTINENT_LABELS[c]}
          </button>
        ))}
        <span style={{ width: '1rem' }} />
        {TYPE_FILTERS.map((t) => (
          <button key={t.id} className={t.id === type ? 'active' : ''} onClick={() => setType(t.id)}>
            {t.label}
          </button>
        ))}
        <input
          type="number"
          min={1}
          max={50}
          placeholder="Level…"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          style={{ width: '5.5rem' }}
        />
        {active && (
          <button className={forMe ? 'active' : ''} onClick={() => setForMe(!forMe)}>
            Good for {active.name} (L{active.level})
          </button>
        )}
      </div>

      <ContinentMap continent={continent} highlightIds={highlights} />
      {active && highlights && (
        <p className="small muted">Gold rings mark zones the advisor recommends for {active.name}.</p>
      )}

      <div className="card-grid" style={{ marginTop: '1rem' }}>
        {zones.map((z) => (
          <ZoneCard key={z.id} zone={z} />
        ))}
      </div>
      {zones.length === 0 && <p className="muted">No zones match those filters.</p>}
    </div>
  );
}
