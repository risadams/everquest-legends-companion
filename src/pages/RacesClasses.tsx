import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RACES } from '../data/races';
import { CLASSES, CLASS_BY_ID, ARCHETYPE_LABELS, ROLE_LABELS } from '../data/classes';
import { roleCoverage } from '../lib/advisor';
import { ClassPortrait, RacePortrait } from '../components/ClassPortrait';
import type { Role } from '../data/types';

const ALIGN_BADGE: Record<string, string> = {
  good: 'good',
  neutral: 'blue',
  evil: 'danger'
};

export default function RacesClasses() {
  const [combo, setCombo] = useState<string[]>([]);

  const coverage = useMemo(() => (combo.length ? roleCoverage(combo) : null), [combo]);

  function toggleClass(id: string) {
    setCombo((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  }

  const archetypes = ['melee', 'priest', 'caster', 'hybrid'] as const;

  return (
    <div>
      <h1>Races &amp; Classes</h1>
      <p className="muted">
        EverQuest Legends characters combine up to <strong>three classes</strong>: your primary
        (limited by race) at creation, a second class of any type, and a third unlocked at level 10.
        Use the combo explorer below to check a trio’s role coverage before you commit.
      </p>

      <h2>Combo explorer</h2>
      <p className="small muted">Pick up to three classes:</p>
      <div className="chip-row">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            className={combo.includes(c.id) ? 'active' : ''}
            onClick={() => toggleClass(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      {coverage && (
        <div className="advice-callout">
          <strong>
            {combo.map((id) => CLASS_BY_ID[id].name).join(' / ')}
          </strong>
          <div className="chip-row">
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <span key={r} className={`badge ${coverage.covered.includes(r) ? 'good' : ''}`}>
                {coverage.covered.includes(r) ? '✓ ' : '✗ '}
                {ROLE_LABELS[r]}
              </span>
            ))}
          </div>
          <ul className="tight small">
            {coverage.advice.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="small">
            Races that can start this build (primary = {CLASS_BY_ID[combo[0]]?.name}):{' '}
            {RACES.filter((r) => r.allowedPrimaryClasses.includes(combo[0]))
              .map((r) => r.name)
              .join(', ') || '—'}
          </p>
          <Link to="/character" className="small">
            Build a character with this combo →
          </Link>
        </div>
      )}

      <h2>Classes</h2>
      {archetypes.map((arch) => (
        <section key={arch}>
          <h3 style={{ color: 'var(--gold-dim)' }}>{ARCHETYPE_LABELS[arch]}</h3>
          <div className="card-grid">
            {CLASSES.filter((c) => c.archetype === arch).map((c) => (
              <div className="card" key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.7rem' }}>
                  <div style={{ width: '72px', flex: 'none' }}>
                    <ClassPortrait classId={c.id} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: 'var(--gold)' }}>{c.name}</strong>
                  </div>
                  <button className="small" onClick={() => toggleClass(c.id)}>
                    {combo.includes(c.id) ? '− combo' : '+ combo'}
                  </button>
                </div>
                <div className="chip-row">
                  {c.roles.map((r) => (
                    <span key={r} className="badge">{ROLE_LABELS[r]}</span>
                  ))}
                </div>
                <p className="small">{c.blurb}</p>
                <details className="small">
                  <summary className="muted">Strengths &amp; weaknesses</summary>
                  <ul className="tight">
                    {c.strengths.map((s) => (
                      <li key={s}>＋ {s}</li>
                    ))}
                    {c.weaknesses.map((w) => (
                      <li key={w} className="muted">− {w}</li>
                    ))}
                  </ul>
                </details>
                <p className="small" style={{ margin: '0.4rem 0 0' }}>
                  <Link to={`/classes/${c.id}`}>Spells, skills &amp; AAs →</Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <h2>Races</h2>
      <div className="card-grid">
        {RACES.map((r) => (
          <div className="card" key={r.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.7rem' }}>
              <div style={{ width: '72px', flex: 'none' }}>
                <RacePortrait raceId={r.id} />
              </div>
              <strong style={{ color: 'var(--gold)', flex: 1 }}>{r.name}</strong>
              <span className={`badge ${ALIGN_BADGE[r.alignment]}`}>{r.alignment}</span>
            </div>
            <div className="small muted" style={{ margin: '0.25rem 0' }}>
              Starts: <Link to={`/atlas/${r.startingZoneId}`}>{r.startingCity}</Link>
            </div>
            <p className="small">{r.description}</p>
            <ul className="tight small muted">
              {r.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="small">
              <span className="muted">Primary classes: </span>
              {r.allowedPrimaryClasses.map((c) => CLASS_BY_ID[c]?.name).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
