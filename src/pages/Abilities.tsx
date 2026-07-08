import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CLASSES, CLASS_BY_ID } from '../data/classes';
import { STANCES, INVOCATIONS } from '../data/abilities';
import { abilityUnlocked, scalingNote } from '../lib/abilities';
import { useCharacters } from '../context/CharacterContext';
import type { CombatAbility } from '../data/types';

function AbilityCard({ ability, combo }: { ability: CombatAbility; combo: string[] }) {
  const unlocked = combo.length === 0 || abilityUnlocked(ability, combo);
  const classTags = ability.forClasses.map((c) => CLASS_BY_ID[c]?.name ?? c);

  return (
    <div className="card" data-ability={ability.id} style={unlocked ? undefined : { opacity: 0.45 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}
      >
        <strong style={{ color: 'var(--gold)' }}>{ability.name}</strong>
        {combo.length > 0 && (
          <span className={`badge ${unlocked ? 'good' : ''}`} style={{ flexShrink: 0 }}>
            {unlocked ? 'In your combo' : 'Not in combo'}
          </span>
        )}
      </div>
      <div className="chip-row" style={{ margin: '0.3rem 0' }}>
        <span className="badge" style={{ whiteSpace: 'normal' }}>
          {classTags.length === 16 ? 'All classes' : classTags.join(' / ')}
        </span>
      </div>
      <p className="small" style={{ margin: '0.2rem 0' }}>{ability.effect}</p>
      <p className="small muted" style={{ margin: '0.2rem 0' }}>
        <strong>Cost:</strong> {ability.cost}
      </p>
      {unlocked && combo.length > 0 && ability.scaling && (
        <ul className="small" style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
          {ability.scaling.map((s, i) => (
            <li key={i} style={{ color: 'var(--good)' }}>{scalingNote(s, combo)}</li>
          ))}
        </ul>
      )}
      {ability.tips && (
        <p className="small muted" style={{ margin: '0.3rem 0 0' }}>💡 {ability.tips}</p>
      )}
    </div>
  );
}

export default function Abilities() {
  const { active } = useCharacters();
  const [selected, setSelected] = useState<string[]>(active?.classIds ?? []);

  function toggleClass(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  }

  const stanceCount = useMemo(
    () => STANCES.filter((s) => abilityUnlocked(s, selected)).length,
    [selected]
  );
  const invCount = useMemo(
    () => INVOCATIONS.filter((s) => abilityUnlocked(s, selected)).length,
    [selected]
  );

  return (
    <div>
      <h1>Stances &amp; Invocations</h1>
      <p className="muted">
        EQL replaces classic disciplines with <strong>Stances</strong> (melee) and{' '}
        <strong>Invocations</strong> (magic) — always-on modes you get at level 1 and swap
        mid-fight. You run exactly one of each; both default to a free regen mode. Several scale
        with the <em>other</em> classes in your trio, which is where multiclass builds get spicy.
      </p>

      <div className="advice-callout small">
        <strong>How swapping works:</strong> stances and invocations each have their own 6-second
        swap timer, so you can flip both in the same pull. Most powered modes drain endurance (or
        mana) per point of damage dealt or prevented — your <em>Strategy</em> skill reduces the
        bill. Add them to macros with <code>/doability Divine Invocation</code> — see the{' '}
        <Link to="/macros">Macro Guide</Link>.
      </div>

      <h2>Your combo</h2>
      <p className="small muted">
        {active ? `Preloaded from ${active.name} — adjust freely:` : 'Pick up to three classes:'}
      </p>
      <div className="chip-row">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            className={selected.includes(c.id) ? 'active' : ''}
            onClick={() => toggleClass(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      {selected.length === 0 ? (
        <p className="muted small">
          No classes selected — showing the full reference. Pick your combo above, or{' '}
          <Link to="/character">set up your character</Link> to see what your trio unlocks and how
          the multiclass scaling works out.
        </p>
      ) : (
        <p className="small">
          <span className="badge gold">{stanceCount} of {STANCES.length} stances</span>{' '}
          <span className="badge gold">{invCount} of {INVOCATIONS.length} invocations</span>{' '}
          unlocked by this combination.
        </p>
      )}

      <section>
        <h3 style={{ color: 'var(--gold-dim)' }}>Melee Stances</h3>
        <div className="card-grid">
          {STANCES.map((a) => (
            <AbilityCard key={a.id} ability={a} combo={selected} />
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ color: 'var(--gold-dim)' }}>Invocations</h3>
        <div className="card-grid">
          {INVOCATIONS.map((a) => (
            <AbilityCard key={a.id} ability={a} combo={selected} />
          ))}
        </div>
      </section>
    </div>
  );
}
