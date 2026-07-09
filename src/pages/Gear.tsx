import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GearSlot, GearTier } from '../data/types';
import { GEAR, SLOT_LABELS, TIER_LABELS } from '../data/gear';
import { ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { useCharacters } from '../context/CharacterContext';
import type { CharacterProfile } from '../data/types';

const TIER_ORDER: GearTier[] = ['starter', 'mid', 'endgame', 'raid'];

function tierBadge(t: GearTier): string {
  return t === 'raid' ? 'danger' : t === 'endgame' ? 'gold' : t === 'mid' ? 'blue' : '';
}

/** does this item suit the active character (class fit + on the level horizon)? */
function suitsCharacter(item: (typeof GEAR)[number], c: CharacterProfile): boolean {
  const classOk = !item.classes?.length || item.classes.some((id) => c.classIds.includes(id));
  const levelOk = c.level >= item.levelMin - 8;
  return classOk && levelOk;
}

export default function Gear() {
  const { active } = useCharacters();
  const [tier, setTier] = useState<GearTier | 'all'>('all');
  const [slot, setSlot] = useState<GearSlot | 'all'>('all');
  const [search, setSearch] = useState('');
  const [forMe, setForMe] = useState(false);

  const slotsPresent = useMemo(() => [...new Set(GEAR.map((g) => g.slot))], []);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GEAR.filter((g) => {
      if (tier !== 'all' && g.tier !== tier) return false;
      if (slot !== 'all' && g.slot !== slot) return false;
      if (forMe && active && !suitsCharacter(g, active)) return false;
      if (q) {
        const zone = ZONE_BY_ID[g.zoneId];
        const hay = `${g.name} ${g.notable} ${g.source} ${g.farm} ${zone?.name ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort(
      (a, b) =>
        TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) ||
        a.levelMin - b.levelMin ||
        a.name.localeCompare(b.name)
    );
  }, [tier, slot, search, forMe, active]);

  return (
    <div>
      <h1>Notable Gear</h1>
      <p className="muted">
        The equipment worth chasing across the classic era — what makes each piece great, where it
        drops, and how to farm it. Camps and drops follow classic EverQuest; verify exact stats
        in-game as the beta settles.
      </p>

      <div className="filter-bar">
        <button className={tier === 'all' ? 'active' : ''} onClick={() => setTier('all')}>
          All tiers
        </button>
        {TIER_ORDER.map((t) => (
          <button key={t} className={t === tier ? 'active' : ''} onClick={() => setTier(t)}>
            {TIER_LABELS[t]}
          </button>
        ))}
        <span style={{ width: '1rem' }} />
        <select value={slot} onChange={(e) => setSlot(e.target.value as GearSlot | 'all')}>
          <option value="all">All slots</option>
          {slotsPresent.map((s) => (
            <option key={s} value={s}>
              {SLOT_LABELS[s]}
            </option>
          ))}
        </select>
        <input
          placeholder="Search item, zone, effect…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: '14rem' }}
        />
        {active && (
          <button className={forMe ? 'active' : ''} onClick={() => setForMe(!forMe)}>
            For {active.name} (L{active.level})
          </button>
        )}
      </div>

      <div className="card-grid">
        {items.map((g) => {
          const zone = ZONE_BY_ID[g.zoneId];
          const usableNow = active && active.level >= g.levelMin;
          const suits = active && suitsCharacter(g, active);
          return (
            <div className="card" key={g.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--gold)' }}>{g.name}</strong>
                <span style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                  <span className="badge">{SLOT_LABELS[g.slot]}</span>
                  <span className={`badge ${tierBadge(g.tier)}`}>{TIER_LABELS[g.tier]}</span>
                </span>
              </div>
              <div className="small muted" style={{ margin: '0.25rem 0' }}>
                Level {g.levelMin}
                {g.levelMax && g.levelMax !== g.levelMin ? `–${g.levelMax}` : '+'} ·{' '}
                {zone ? <Link to={`/atlas/${zone.id}`}>{zone.name}</Link> : g.zoneId}
              </div>
              {active && suits && (
                <span className={`badge ${usableNow ? 'good' : 'warn'}`}>
                  {usableNow ? `Good for ${active.name} now` : 'On your horizon'}
                </span>
              )}
              {g.classes && g.classes.length > 0 && (
                <div className="chip-row" style={{ margin: '0.3rem 0' }}>
                  {g.classes.map((id) => (
                    <span key={id} className="badge">
                      {CLASS_BY_ID[id]?.name ?? id}
                    </span>
                  ))}
                </div>
              )}
              <p className="small" style={{ margin: '0.4rem 0 0.2rem' }}>
                <span className="muted">Why it’s great:</span> {g.notable}
              </p>
              <p className="small" style={{ margin: '0.2rem 0' }}>
                <span className="muted">Where:</span> {g.source}
                {g.monsterId && (
                  <>
                    {' '}
                    (<Link to="/bestiary">Bestiary →</Link>)
                  </>
                )}
              </p>
              <p className="small" style={{ margin: '0.2rem 0 0' }}>
                <span className="muted">How to farm:</span> {g.farm}
              </p>
            </div>
          );
        })}
      </div>
      {items.length === 0 && <p className="muted">Nothing matches those filters.</p>}
    </div>
  );
}
