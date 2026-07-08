import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CLASSES, CLASS_BY_ID } from '../data/classes';
import { ZONE_BY_ID, CONTINENT_LABELS } from '../data/zones';
import { castability, portsByDestination, UTILITY_SPELLS } from '../lib/travel';
import { useCharacters } from '../context/CharacterContext';
import type { TravelSpell } from '../data/types';

const KIND_LABELS: Record<TravelSpell['kind'], string> = {
  gate: 'Gate',
  port: 'Port',
  evac: 'Evac',
  utility: 'Utility'
};

function SpellBadge({
  spell,
  combo,
  level
}: {
  spell: TravelSpell;
  combo: string[];
  level: number;
}) {
  const state = combo.length > 0 ? castability(spell, combo, level) : null;
  const cls = state === 'now' ? 'good' : state === 'later' ? 'warn' : '';
  const who = spell.classes
    .map((cl) => `${CLASS_BY_ID[cl.classId]?.name ?? cl.classId} ${cl.level}`)
    .join(', ');
  return (
    <span className={`badge ${cls}`} style={{ whiteSpace: 'normal' }} title={spell.note ?? spell.name}>
      {spell.name} · {who} · {spell.targets}
      {spell.kind === 'evac' ? ' · evac' : ''}
      {spell.reagent ? ' · reagent' : ''}
    </span>
  );
}

export default function Travel() {
  const { active } = useCharacters();
  const [selected, setSelected] = useState<string[]>(active?.classIds ?? []);
  const level = active?.level ?? 50;

  function toggleClass(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  }

  const destinations = useMemo(() => {
    const entries = [...portsByDestination().entries()]
      .map(([zoneId, spells]) => ({ zone: ZONE_BY_ID[zoneId], spells }))
      .filter((e) => e.zone);
    entries.sort(
      (a, b) =>
        a.zone.continent.localeCompare(b.zone.continent) || a.zone.name.localeCompare(b.zone.name)
    );
    return entries;
  }, []);

  const reachableNow = useMemo(() => {
    if (selected.length === 0) return 0;
    return destinations.filter((d) =>
      d.spells.some((s) => castability(s, selected, level) === 'now')
    ).length;
  }, [destinations, selected, level]);

  return (
    <div>
      <h1>Travel Guide</h1>
      <p className="muted">
        Norrath has no maps app, but it does have a port network: druid rings and circles, wizard
        gates and portals, evacuation spells, and EQL&rsquo;s new <strong>Rituals</strong> system
        that lets <em>any</em> loadout tap ports you have earned on other classes.
      </p>

      <div className="advice-callout small">
        <strong>Rituals in 30 seconds:</strong> once any of your classes scribes a portal-type
        spell, it becomes a Ritual (Actions window, default <code>L</code>) castable{' '}
        <em>even when that class is not in your active loadout</em>. The catch: you must be rested
        and out of combat, every ritual takes 20 seconds to cast, and finishing one drains{' '}
        <strong>all</strong> of your mana. Also in your toolkit: the free <strong>Origin</strong>{' '}
        AA (teleport to your starting city, 18-minute cooldown) and <strong>Gather Party</strong>{' '}
        (summon your group to you, 6-hour cooldown).
      </div>

      <h2>Your combo</h2>
      <p className="small muted">
        {active
          ? `Preloaded from ${active.name} (level ${level}) — adjust freely:`
          : 'Pick up to three classes:'}
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
          No classes selected — showing the full network. Pick your combo above, or{' '}
          <Link to="/character">set up your character</Link> first.
        </p>
      ) : (
        <p className="small">
          <span className="badge gold">
            {reachableNow} of {destinations.length} port destinations
          </span>{' '}
          castable right now by this combo at level {level}.{' '}
          <span className="badge good">green = castable now</span>{' '}
          <span className="badge warn">amber = your class, higher level</span>{' '}
          <span className="badge">plain = another class (Ritual material)</span>
        </p>
      )}

      <section>
        <h3 style={{ color: 'var(--gold-dim)' }}>Bind, gate &amp; utility</h3>
        <div className="chip-row">
          {UTILITY_SPELLS.map((s) => (
            <SpellBadge key={s.id} spell={s} combo={selected} level={level} />
          ))}
        </div>
        <p className="small muted">
          Bind smart: set your bind next to your current hunting camp, and Gate becomes a free
          trip home after every session. Melee-only trios can still bind in cities via a friendly
          caster.
        </p>
      </section>

      <section>
        <h3 style={{ color: 'var(--gold-dim)' }}>The port network</h3>
        <div className="card-grid">
          {destinations.map(({ zone, spells }) => (
            <div className="card" key={zone.id} data-travel-dest={zone.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                <strong>
                  <Link to={`/atlas/${zone.id}`}>{zone.name}</Link>
                </strong>
                <span className="badge" style={{ flexShrink: 0 }}>
                  {CONTINENT_LABELS[zone.continent]}
                </span>
              </div>
              <div className="chip-row" style={{ margin: '0.4rem 0 0' }}>
                {spells.map((s) => (
                  <SpellBadge key={s.id} spell={s} combo={selected} level={level} />
                ))}
              </div>
              {spells.some((s) => s.reagent) && (
                <p className="small muted" style={{ margin: '0.3rem 0 0' }}>
                  Reagent required: {spells.find((s) => s.reagent)!.reagent}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ color: 'var(--gold-dim)' }}>Spell types</h3>
        <table className="data">
          <thead>
            <tr>
              <th>Type</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{KIND_LABELS.gate}</td>
              <td>Returns the caster to their bind point.</td>
            </tr>
            <tr>
              <td>{KIND_LABELS.port}</td>
              <td>
                Teleports to a fixed destination — druid rings/circles and wizard gates/portals.
                Self versions come earlier and cheaper; group versions move the whole trio.
              </td>
            </tr>
            <tr>
              <td>{KIND_LABELS.evac}</td>
              <td>
                Faster-casting escape port (Succor / Evacuate lines) — the panic button when a
                camp goes bad, but it may leave group members behind.
              </td>
            </tr>
            <tr>
              <td>{KIND_LABELS.utility}</td>
              <td>Travel helpers with no destination of their own, like Bind Affinity and Shrink.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
