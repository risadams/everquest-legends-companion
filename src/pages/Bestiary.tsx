import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Continent, MonsterKind } from '../data/types';
import { MONSTERS, KIND_LABELS } from '../data/monsters';
import { ZONE_BY_ID, CONTINENTS, CONTINENT_LABELS } from '../data/zones';
import { useCharacters } from '../context/CharacterContext';
import { monsterFit, type MonsterFit } from '../lib/advisor';

const KIND_FILTERS: Array<{ id: MonsterKind | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'named', label: 'Nameds' },
  { id: 'raid', label: 'Raid targets' },
  { id: 'notable', label: 'Notable camps' }
];

function FitTag({ fit }: { fit: MonsterFit }) {
  switch (fit) {
    case 'target':
      return <span className="badge good">Good target now</span>;
    case 'stretch':
      return <span className="badge warn">A stretch — bring friends</span>;
    case 'trophy':
      return <span className="badge">Outleveled (trophy hunt)</span>;
    default:
      return <span className="badge danger">Out of reach</span>;
  }
}

export default function Bestiary() {
  const [continent, setContinent] = useState<Continent | 'all'>('all');
  const [kind, setKind] = useState<MonsterKind | 'all'>('all');
  const [search, setSearch] = useState('');
  const [forMe, setForMe] = useState(false);
  const { active } = useCharacters();

  const monsters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MONSTERS.filter((m) => {
      const zone = ZONE_BY_ID[m.zoneId];
      if (continent !== 'all' && zone?.continent !== continent) return false;
      if (kind !== 'all' && m.kind !== kind) return false;
      if (
        q &&
        !m.name.toLowerCase().includes(q) &&
        !(zone?.name.toLowerCase().includes(q) ?? false) &&
        !(m.loot ?? []).some((l) => l.toLowerCase().includes(q))
      )
        return false;
      if (forMe && active) {
        const fit = monsterFit(m, active.level);
        if (fit !== 'target' && fit !== 'stretch') return false;
      }
      return true;
    }).sort((a, b) => a.lvlMin - b.lvlMin || a.name.localeCompare(b.name));
  }, [continent, kind, search, forMe, active]);

  return (
    <div>
      <h1>Bestiary</h1>
      <p className="muted">
        The named monsters, raid targets, and camps worth knowing — who they are, where they lurk,
        and what they carry.
      </p>
      <div className="filter-bar">
        <button className={continent === 'all' ? 'active' : ''} onClick={() => setContinent('all')}>
          All continents
        </button>
        {CONTINENTS.map((c) => (
          <button key={c} className={c === continent ? 'active' : ''} onClick={() => setContinent(c)}>
            {CONTINENT_LABELS[c]}
          </button>
        ))}
        <span style={{ width: '1rem' }} />
        {KIND_FILTERS.map((k) => (
          <button key={k.id} className={k.id === kind ? 'active' : ''} onClick={() => setKind(k.id)}>
            {k.label}
          </button>
        ))}
        <input
          placeholder="Search name, zone, loot…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: '14rem' }}
        />
        {active && (
          <button className={forMe ? 'active' : ''} onClick={() => setForMe(!forMe)}>
            Targets for {active.name} (L{active.level})
          </button>
        )}
      </div>

      <div className="card-grid">
        {monsters.map((m) => {
          const zone = ZONE_BY_ID[m.zoneId];
          return (
            <div className="card" key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--gold)' }}>{m.name}</strong>
                <span className={`badge ${m.kind === 'raid' ? 'danger' : m.kind === 'named' ? 'gold' : ''}`}>
                  {KIND_LABELS[m.kind]}
                </span>
              </div>
              <div className="small muted" style={{ margin: '0.25rem 0' }}>
                Level {m.lvlMin}
                {m.lvlMax !== m.lvlMin ? `–${m.lvlMax}` : ''} ·{' '}
                {zone ? <Link to={`/atlas/${zone.id}`}>{zone.name}</Link> : m.zoneId}
              </div>
              {active && <FitTag fit={monsterFit(m, active.level)} />}
              <p className="small" style={{ margin: '0.4rem 0 0.2rem' }}>
                <span className="muted">Where:</span> {m.where}
              </p>
              {m.loot && m.loot.length > 0 && (
                <p className="small" style={{ margin: '0.2rem 0' }}>
                  <span className="muted">Carries:</span> {m.loot.join(' · ')}
                </p>
              )}
              {m.notes && (
                <p className="small muted" style={{ margin: '0.2rem 0 0' }}>
                  {m.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {monsters.length === 0 && <p className="muted">Nothing matches those filters.</p>}
    </div>
  );
}
