import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RACES, RACE_BY_ID } from '../data/races';
import { CLASSES, CLASS_BY_ID } from '../data/classes';
import { useCharacters } from '../context/CharacterContext';
import { newCharacterId } from '../lib/storage';
import {
  recommendZones,
  roleCoverage,
  nextMilestones,
  recommendQuests,
  huntTargets
} from '../lib/advisor';
import { ZONE_BY_ID } from '../data/zones';
import { bandForLevel } from '../data/progression';
import { FitBadge } from '../components/ZoneCard';
import {
  loadClassData,
  loadSharedAa,
  spellSource,
  SPELL_SOURCE_LABELS,
  castLabel,
  type AaRow,
  type SharedAa,
  type SpellRow
} from '../lib/classdata';
import { suggestAAs } from '../lib/aa';
import { SpellIcon } from '../components/SpellIcon';
import type { CharacterProfile } from '../data/types';

function sourceBadge(s: SpellRow): string {
  const kind = spellSource(s);
  return kind === 'auto' ? 'gold' : kind === 'vendor' ? '' : kind === 'drop' ? 'warn' : 'blue';
}

function SpellsComingUp({ character }: { character: CharacterProfile }) {
  const [byClass, setByClass] = useState<
    Array<{ classId: string; className: string; spells: SpellRow[] }> | null
  >(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all(
      character.classIds.map(async (id) => {
        const data = await loadClassData(id);
        return { classId: id, className: CLASS_BY_ID[id]?.name ?? id, spells: data?.spells ?? [] };
      })
    ).then((rows) => {
      if (live) setByClass(rows);
    });
    return () => {
      live = false;
    };
  }, [character.classIds]);

  const hi = showAll ? 50 : Math.min(50, character.level + 4);
  const upcoming = useMemo(() => {
    if (!byClass) return null;
    const items: Array<{ className: string; spell: SpellRow }> = [];
    for (const c of byClass) {
      for (const s of c.spells) {
        if (s.level > character.level && s.level <= hi) items.push({ className: c.className, spell: s });
      }
    }
    items.sort(
      (a, b) => a.spell.level - b.spell.level || a.spell.name.localeCompare(b.spell.name)
    );
    return items;
  }, [byClass, character.level, hi]);

  const multi = character.classIds.length > 1;

  return (
    <section>
      <h3>
        Spells coming up{' '}
        <span className="small muted">
          {character.level >= 50 ? '(at level cap)' : `(levels ${character.level + 1}–${hi})`}
        </span>
      </h3>
      {!upcoming && <p className="muted small">Loading your spell lines…</p>}
      {upcoming && upcoming.length === 0 && (
        <p className="small muted">
          {character.level >= 50
            ? 'You’re at the cap — every spell in your combo is already available.'
            : 'Nothing new in the next few levels — keep hunting, then check back.'}
        </p>
      )}
      {upcoming && upcoming.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="data">
            <thead>
              <tr>
                <th></th>
                <th>Lv</th>
                <th>Spell</th>
                {multi && <th>Class</th>}
                <th>Cast</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(({ className, spell }, i) => (
                <tr key={`${spell.name}-${className}-${i}`}>
                  <td><SpellIcon index={spell.icon} title={spell.name} size={26} /></td>
                  <td>{spell.level}</td>
                  <td
                    style={{ color: 'var(--gold)', cursor: 'help' }}
                    title={`${spell.description || spell.maxEffect}${spell.school ? ` — ${spell.school}` : ''}`}
                  >
                    {spell.name}
                  </td>
                  {multi && <td className="small">{className}</td>}
                  <td className="small">{castLabel(spell.castMs)}</td>
                  <td>
                    <span className={`badge ${sourceBadge(spell)}`} title={spell.source}>
                      {SPELL_SOURCE_LABELS[spellSource(spell)]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {character.level < 50 && (
        <p className="small">
          <button onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show just the next few levels' : `Show everything to level 50`}
          </button>
        </p>
      )}
    </section>
  );
}

function CharacterForm({
  initial,
  onSave,
  onCancel
}: {
  initial?: CharacterProfile;
  onSave: (c: CharacterProfile) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [raceId, setRaceId] = useState(initial?.raceId ?? 'human');
  const [classIds, setClassIds] = useState<string[]>(initial?.classIds ?? []);
  const [level, setLevel] = useState(initial?.level ?? 1);
  const [aaPoints, setAaPoints] = useState(initial?.aaPoints ?? 0);

  const race = RACE_BY_ID[raceId];
  const primary = classIds[0];

  function toggleClass(id: string) {
    setClassIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      const max = 3;
      if (prev.length >= max) return prev;
      // First pick must be a legal primary for the race.
      if (prev.length === 0 && !race.allowedPrimaryClasses.includes(id)) return prev;
      return [...prev, id];
    });
  }

  const canSave = name.trim().length > 0 && classIds.length >= 1 && level >= 1 && level <= 50;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{initial ? `Edit ${initial.name}` : 'New character'}</h3>
      <div className="filter-bar">
        <input
          placeholder="Character name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={raceId}
          onChange={(e) => {
            setRaceId(e.target.value);
            setClassIds([]);
          }}
        >
          {RACES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <label className="small muted">
          Level{' '}
          <input
            type="number"
            min={1}
            max={50}
            value={level}
            onChange={(e) => setLevel(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            style={{ width: '4.5rem' }}
          />
        </label>
        <label className="small muted">
          Unspent AA{' '}
          <input
            type="number"
            min={0}
            max={999}
            value={aaPoints}
            onChange={(e) => setAaPoints(Math.max(0, Math.min(999, Number(e.target.value) || 0)))}
            style={{ width: '4.5rem' }}
          />
        </label>
      </div>

      <p className="small muted" style={{ marginBottom: '0.2rem' }}>
        Classes (pick 1–3; your <strong>first pick is your primary</strong> and must be legal for{' '}
        {race.name}
        {level < 10 && classIds.length >= 2
          ? ' — note: the third class unlocks in-game at level 10'
          : ''}
        ):
      </p>
      <div className="chip-row">
        {CLASSES.map((c) => {
          const selected = classIds.includes(c.id);
          const isPrimarySlot = classIds.length === 0;
          const disabled =
            !selected &&
            ((isPrimarySlot && !race.allowedPrimaryClasses.includes(c.id)) || classIds.length >= 3);
          return (
            <button
              key={c.id}
              className={selected ? 'active' : ''}
              disabled={disabled}
              style={disabled ? { opacity: 0.35 } : undefined}
              onClick={() => toggleClass(c.id)}
            >
              {selected && classIds[0] === c.id ? '★ ' : ''}
              {c.name}
            </button>
          );
        })}
      </div>
      {primary && (
        <p className="small muted">
          Primary: <strong>{CLASS_BY_ID[primary].name}</strong>
          {classIds.length > 1 &&
            ` · also ${classIds.slice(1).map((c) => CLASS_BY_ID[c].name).join(' and ')}`}
        </p>
      )}
      <div className="filter-bar">
        <button
          className="primary"
          disabled={!canSave}
          onClick={() =>
            onSave({
              id: initial?.id ?? newCharacterId(),
              name: name.trim(),
              raceId,
              classIds,
              level,
              aaPoints
            })
          }
        >
          Save character
        </button>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

function AaAdvisor({ character }: { character: CharacterProfile }) {
  const [classAas, setClassAas] = useState<Array<{ className: string; aas: AaRow[] }> | null>(null);
  const [shared, setShared] = useState<SharedAa | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all(
      character.classIds.map(async (id) => {
        const data = await loadClassData(id);
        return { className: CLASS_BY_ID[id]?.name ?? id, aas: data?.aas ?? [] };
      })
    ).then((rows) => {
      if (live) setClassAas(rows);
    });
    loadSharedAa().then((s) => {
      if (live) setShared(s);
    });
    return () => {
      live = false;
    };
  }, [character.classIds]);

  const suggestions = useMemo(() => {
    if (!classAas || !shared) return null;
    return suggestAAs(character, classAas, shared, 9);
  }, [character, classAas, shared]);

  const points = character.aaPoints ?? 0;

  return (
    <section data-aa-advisor>
      <h3>Spend your AA points</h3>
      <p className="small muted" style={{ margin: '0.2rem 0 0.5rem' }}>
        {points > 0 ? (
          <>
            <span className="badge gold">{points} unspent</span> — the advisor ranks your combo’s
            signature class lines and the shared picks that fit your roles.
          </>
        ) : (
          'No points banked right now — here’s what to save for. AA XP accrues from level 1 in EQL.'
        )}
      </p>
      {!suggestions && <p className="muted small">Weighing the AA lines…</p>}
      {suggestions && (
        <ul className="tight small">
          {suggestions.map(({ aa, source, firstCost, minLevel, eligible, affordable, why }) => (
            <li key={aa.name}>
              <strong style={{ color: 'var(--gold)' }}>{aa.name}</strong>{' '}
              <span className="badge">{source}</span>{' '}
              {affordable ? (
                <span className="badge good">
                  {firstCost === 0 ? 'free — grab it' : `buy now (${firstCost} pt${firstCost === 1 ? '' : 's'})`}
                </span>
              ) : eligible ? (
                <span className="badge warn">
                  {firstCost === null ? 'cost unknown' : `save ${firstCost} pts`}
                </span>
              ) : (
                <span className="badge">at level {minLevel}</span>
              )}{' '}
              — {why}
              {aa.ranks !== '1' && <span className="muted"> · {aa.ranks} ranks ({aa.cost})</span>}
            </li>
          ))}
        </ul>
      )}
      <p className="small">
        Full tables on your class pages:{' '}
        {character.classIds.map((id, i) => (
          <span key={id}>
            {i > 0 && ' · '}
            <Link to={`/classes/${id}`}>{CLASS_BY_ID[id]?.name ?? id} AAs</Link>
          </span>
        ))}
      </p>
    </section>
  );
}

function AdvisorReport({ character }: { character: CharacterProfile }) {
  const race = RACE_BY_ID[character.raceId];
  const coverage = useMemo(() => roleCoverage(character.classIds), [character.classIds]);
  const recs = useMemo(() => recommendZones(character, 8), [character]);
  const milestones = useMemo(() => nextMilestones(character), [character]);
  const quests = useMemo(() => recommendQuests(character, 6), [character]);
  const targets = useMemo(() => huntTargets(character, 5), [character]);
  const band = bandForLevel(character.level);

  return (
    <div>
      <h2>
        Advisor: {character.name}, level {character.level} {race?.name}{' '}
        <span className="muted small">
          ({character.classIds.map((c) => CLASS_BY_ID[c]?.name).join(' / ')})
        </span>
      </h2>

      <div className="advice-callout">
        <strong>Right now ({band.title.toLowerCase()}):</strong> {band.focus}
      </div>

      <div className="two-col">
        <div>
          <h3>Where to hunt</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Levels</th>
                <th>Fit</th>
                <th>Why / watch out</th>
              </tr>
            </thead>
            <tbody>
              {recs.map((r) => (
                <tr key={r.zone.id}>
                  <td>
                    <Link to={`/atlas/${r.zone.id}`}>{r.zone.name}</Link>
                    {r.hops !== null && r.hops <= 2 && (
                      <span className="badge" style={{ marginLeft: '0.4rem' }}>near home</span>
                    )}
                  </td>
                  <td>
                    {r.zone.levelMin}–{r.zone.levelMax}
                  </td>
                  <td>
                    <FitBadge fit={r.fit} />
                  </td>
                  <td className="small">
                    {r.reasons[0]}
                    {r.warnings.length > 0 && (
                      <div className="muted">⚠ {r.warnings.join(' · ')}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <SpellsComingUp character={character} />
        </div>
        <div>
          <h3>Your build</h3>
          <ul className="tight small">
            {coverage.advice.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          {race && (
            <>
              <h3>Home turf</h3>
              <p className="small">
                You began at <Link to={`/atlas/${race.startingZoneId}`}>{race.startingCity}</Link>.{' '}
                {race.alignment === 'evil'
                  ? 'As an evil-aligned race, expect guards in good cities (Qeynos, the Faydwer cities, Erudin, Rivervale, Halas) to attack on sight — trade in Freeport’s tunnels or your own city.'
                  : race.alignment === 'good'
                    ? 'Good cities across Norrath welcome you; steer clear of Neriak, Grobb, Oggok, and Paineel.'
                    : 'Neutral factions open most cities to you — a real luxury for shopping and banking.'}
              </p>
            </>
          )}
          <h3>Next milestones</h3>
          <ul className="tight small">
            {milestones.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>

          <AaAdvisor character={character} />

          {quests.length > 0 && (
            <>
              <h3>Quests worth doing</h3>
              <ul className="tight small">
                {quests.map(({ quest, status }) => (
                  <li key={quest.id}>
                    <strong>{quest.name}</strong>{' '}
                    {status === 'now' ? (
                      <span className="badge good">now</span>
                    ) : (
                      <span className="badge">at {quest.levelMin}+</span>
                    )}{' '}
                    — {quest.reward}
                    {ZONE_BY_ID[quest.startZoneId] && (
                      <span className="muted">
                        {' '}(<Link to={`/atlas/${quest.startZoneId}`}>
                          {ZONE_BY_ID[quest.startZoneId].name}
                        </Link>)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {targets.length > 0 && (
            <>
              <h3>Named mobs to hunt</h3>
              <ul className="tight small">
                {targets.map((m) => (
                  <li key={m.id}>
                    <strong>{m.name}</strong> (L{m.lvlMin}
                    {m.lvlMax !== m.lvlMin ? `–${m.lvlMax}` : ''}
                    {ZONE_BY_ID[m.zoneId] && (
                      <>
                        , <Link to={`/atlas/${m.zoneId}`}>{ZONE_BY_ID[m.zoneId].name}</Link>
                      </>
                    )}
                    ){m.loot && m.loot.length > 0 && <> — {m.loot[0]}</>}
                  </li>
                ))}
              </ul>
              <p className="small">
                <Link to="/bestiary">Full bestiary →</Link> · <Link to="/quests">Quest guide →</Link> ·{' '}
                <Link to="/macros">Macros for your combo →</Link>
              </p>
            </>
          )}

          <p className="small">
            <Link to="/progression">See the full progression guide →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CharacterPage() {
  const { characters, active, setActiveId, upsert, remove } = useCharacters();
  const [editing, setEditing] = useState<CharacterProfile | null>(null);
  const [creating, setCreating] = useState(characters.length === 0);

  return (
    <div>
      <h1>My Character</h1>
      <p className="muted">
        Set up your race, class trio, and level — every page of this app personalizes itself to the
        active character.
      </p>

      <div className="filter-bar">
        {characters.map((c) => (
          <button
            key={c.id}
            className={active?.id === c.id ? 'active' : ''}
            onClick={() => setActiveId(c.id)}
          >
            {c.name} · L{c.level}
          </button>
        ))}
        <button className="primary" onClick={() => { setCreating(true); setEditing(null); }}>
          + New character
        </button>
        {active && (
          <>
            <button
              className="primary"
              disabled={active.level >= 50}
              title={active.level >= 50 ? 'Level cap!' : `Level up to ${active.level + 1}`}
              onClick={() => upsert({ ...active, level: Math.min(50, active.level + 1) })}
            >
              🔔 Ding! {active.level < 50 ? `→ L${active.level + 1}` : 'L50'}
            </button>
            <button
              title="Bank an earned AA point"
              onClick={() => upsert({ ...active, aaPoints: (active.aaPoints ?? 0) + 1 })}
            >
              ✦ +1 AA
            </button>
            {(active.aaPoints ?? 0) > 0 && (
              <button
                title="Spend an AA point"
                onClick={() =>
                  upsert({ ...active, aaPoints: Math.max(0, (active.aaPoints ?? 0) - 1) })
                }
              >
                − spend
              </button>
            )}
            <span className="badge gold">{active.aaPoints ?? 0} AA banked</span>
            <button onClick={() => { setEditing(active); setCreating(false); }}>
              Edit {active.name}
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${active.name}?`)) remove(active.id);
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {(creating || editing) && (
        <CharacterForm
          initial={editing ?? undefined}
          onSave={(c) => {
            upsert(c);
            setCreating(false);
            setEditing(null);
          }}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      {active && !creating && !editing && <AdvisorReport character={active} />}
    </div>
  );
}
