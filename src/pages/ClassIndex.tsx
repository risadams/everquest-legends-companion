import { Link } from 'react-router-dom';
import { CLASSES, CLASS_BY_ID, ARCHETYPE_LABELS } from '../data/classes';
import { useCharacters } from '../context/CharacterContext';
import type { Archetype } from '../data/types';

const ARCHETYPES: Archetype[] = ['melee', 'priest', 'caster', 'hybrid'];

export default function ClassIndex() {
  const { active } = useCharacters();

  return (
    <div>
      <h1>Spells, Skills &amp; AAs</h1>
      <p className="muted">
        Every class&rsquo;s full spell or song book (~1,500 entries harvested from the EQL Wiki),
        skill tables with caps, and complete AA lists. Each spell shows how you get it —{' '}
        <span className="badge gold">Auto-granted</span> as you level,{' '}
        <span className="badge">Vendor</span> scrolls at the guild, or{' '}
        <span className="badge warn">Drop</span>/<span className="badge blue">Quest</span> scrolls
        you hunt down. Skills are marked trained (buy at your guildmaster) vs. automatic.
      </p>

      {active && active.classIds.length > 0 && (
        <div className="advice-callout small">
          <strong>{active.name}&rsquo;s combo:</strong>{' '}
          {active.classIds.map((id, i) => (
            <span key={id}>
              {i > 0 && ' · '}
              <Link to={`/classes/${id}`}>{CLASS_BY_ID[id]?.name ?? id}</Link>
            </span>
          ))}{' '}
          — spell lists open pre-filtered to level {Math.min(50, active.level + 4)}.
        </div>
      )}

      {ARCHETYPES.map((arch) => (
        <section key={arch}>
          <h3 style={{ color: 'var(--gold-dim)' }}>{ARCHETYPE_LABELS[arch]}</h3>
          <div className="card-grid">
            {CLASSES.filter((c) => c.archetype === arch).map((c) => (
              <Link key={c.id} to={`/classes/${c.id}`} className="card" style={{ color: 'inherit' }}>
                <strong style={{ color: 'var(--gold)' }}>{c.name}</strong>
                <p className="small muted" style={{ margin: '0.3rem 0 0' }}>{c.blurb}</p>
                <p className="small" style={{ margin: '0.4rem 0 0' }}>
                  {c.id === 'bard' ? 'Songs' : c.archetype === 'melee' ? 'Skills' : 'Spells'} ·
                  skill caps · AAs →
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
