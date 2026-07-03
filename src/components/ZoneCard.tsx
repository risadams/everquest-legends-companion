import { Link } from 'react-router-dom';
import type { Zone } from '../data/types';
import { TYPE_LABELS } from './mapUtils';
import { levelFit, type Fit } from '../lib/advisor';
import { useCharacters } from '../context/CharacterContext';
import { CONTINENT_LABELS } from '../data/zones';

export function FitBadge({ fit }: { fit: Fit }) {
  switch (fit) {
    case 'perfect':
      return <span className="badge good">Great for you now</span>;
    case 'good':
      return <span className="badge blue">Workable for you</span>;
    case 'risky':
      return <span className="badge warn">Risky — slightly high</span>;
    case 'deadly':
      return <span className="badge danger">Too dangerous</span>;
    default:
      return null;
  }
}

export default function ZoneCard({ zone, showContinent }: { zone: Zone; showContinent?: boolean }) {
  const { active } = useCharacters();
  const fit = active && zone.type !== 'city' ? levelFit(zone, active.level) : null;
  return (
    <Link to={`/atlas/${zone.id}`} className="card" style={{ display: 'block', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <strong style={{ color: 'var(--gold)' }}>{zone.name}</strong>
        <span className="badge">{TYPE_LABELS[zone.type]}</span>
      </div>
      <div className="small muted" style={{ margin: '0.3rem 0' }}>
        {zone.type === 'city' ? 'Safe city' : `Levels ${zone.levelMin}–${zone.levelMax}`}
        {showContinent ? ` · ${CONTINENT_LABELS[zone.continent]}` : ''}
      </div>
      {fit && fit !== 'trivial' && <FitBadge fit={fit} />}
      {zone.notes && (
        <div className="small muted" style={{ marginTop: '0.4rem' }}>
          {zone.notes.length > 110 ? zone.notes.slice(0, 110) + '…' : zone.notes}
        </div>
      )}
    </Link>
  );
}
