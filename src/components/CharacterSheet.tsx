import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CharacterProfile } from '../data/types';
import { useCharacters } from '../context/CharacterContext';
import { RACE_BY_ID } from '../data/races';
import { CLASS_BY_ID, ROLE_LABELS } from '../data/classes';
import { STAT_KEYS, STAT_LABELS, STAT_NAMES, CLASS_PRIME_STATS, statsFor } from '../data/stats';
import { ABILITIES } from '../data/abilities';
import { roleCoverage } from '../lib/advisor';
import { bandForLevel } from '../data/progression';
import { DEITY_BY_ID } from '../data/lore';
import { GEAR, SLOT_LABELS } from '../data/gear';
import type { GearSlot } from '../data/types';
import { Markdown } from '../lib/markdown';
import { ClassPortrait, RacePortrait } from './ClassPortrait';

const ALIGNMENT_LABELS: Record<string, string> = {
  good: 'Good',
  neutral: 'Neutral',
  evil: 'Evil'
};

const SLOT_ORDER = Object.keys(SLOT_LABELS) as GearSlot[];

/** worn gear, edited in place; catalog names get their "notable" line as a tooltip */
function Armory({ character }: { character: CharacterProfile }) {
  const { upsert } = useCharacters();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Record<GearSlot, string>>>({});

  const worn = character.equipment ?? {};
  const filled = SLOT_ORDER.filter((s) => worn[s]);
  const catalog = useMemo(() => {
    const byName = new Map<string, string>();
    for (const g of GEAR) byName.set(g.name.toLowerCase(), g.notable);
    return byName;
  }, []);

  function startEditing() {
    setDraft({ ...worn });
    setEditing(true);
  }
  function save() {
    const cleaned: Partial<Record<GearSlot, string>> = {};
    for (const slot of SLOT_ORDER) {
      const v = draft[slot]?.trim();
      if (v) cleaned[slot] = v.slice(0, 80);
    }
    upsert({
      ...character,
      equipment: Object.keys(cleaned).length > 0 ? cleaned : undefined
    });
    setEditing(false);
  }
  function suggestions(slot: GearSlot) {
    return GEAR.filter(
      (g) =>
        g.slot === slot &&
        g.available !== false &&
        (!g.classes ||
          g.classes.length === 0 ||
          g.classes.some((c) => character.classIds.includes(c)))
    );
  }

  return (
    <div className="char-armory">
      <h4>
        Armory
        {!editing && (
          <button className="sheet-btn" onClick={startEditing}>
            ✎ {filled.length > 0 ? 'Edit' : 'Equip your gear'}
          </button>
        )}
      </h4>
      {editing ? (
        <div>
          <div className="char-armory-form">
            {SLOT_ORDER.map((slot) => (
              <label key={slot}>
                <span>{SLOT_LABELS[slot]}</span>
                <input
                  value={draft[slot] ?? ''}
                  list={`gear-${slot}`}
                  placeholder="—"
                  onChange={(e) => setDraft((d) => ({ ...d, [slot]: e.target.value }))}
                />
                <datalist id={`gear-${slot}`}>
                  {suggestions(slot).map((g) => (
                    <option key={g.id} value={g.name} />
                  ))}
                </datalist>
              </label>
            ))}
          </div>
          <div className="char-chronicle-actions">
            <button className="sheet-btn" onClick={save}>Save</button>
            <button className="sheet-btn" onClick={() => setEditing(false)}>Cancel</button>
            <span className="char-chronicle-count">
              suggestions come from the Notable Gear catalog — free text works too
            </span>
          </div>
        </div>
      ) : filled.length > 0 ? (
        <ul className="char-armory-list">
          {filled.map((slot) => {
            const notable = catalog.get(worn[slot]!.toLowerCase());
            return (
              <li key={slot}>
                <span className="char-armory-slot">{SLOT_LABELS[slot]}</span>{' '}
                <span
                  className={notable ? 'char-armory-notable' : undefined}
                  title={notable}
                >
                  {worn[slot]}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="char-chronicle-empty">
          Nothing recorded — even a rusty sword deserves a line in the ledger.
        </p>
      )}
    </div>
  );
}

/** free-form RP backstory (markdown), written and edited in place on the sheet */
function Chronicle({ character }: { character: CharacterProfile }) {
  const { upsert } = useCharacters();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [expanded, setExpanded] = useState(false);

  const backstory = character.backstory?.trim() ?? '';
  // long chronicles collapse to a preview so the sheet stays a sheet
  const isLong = backstory.length > 700 || backstory.split('\n').length > 12;

  function startEditing() {
    setDraft(backstory);
    setEditing(true);
  }
  function save() {
    const text = draft.trim();
    upsert({ ...character, backstory: text || undefined });
    setEditing(false);
  }

  return (
    <div className="char-chronicle">
      <h4>
        Chronicle
        {!editing && (
          <button className="sheet-btn" onClick={startEditing}>
            ✎ {backstory ? 'Edit' : 'Write your story'}
          </button>
        )}
      </h4>
      {editing ? (
        <div>
          <textarea
            value={draft}
            rows={Math.min(28, Math.max(6, draft.split('\n').length + 2))}
            placeholder={`Who is ${character.name}? Where do they come from, what do they want, and what are they running from?`}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Backstory"
          />
          <div className="char-chronicle-actions">
            <button className="sheet-btn" onClick={save}>Save</button>
            <button className="sheet-btn" onClick={() => setEditing(false)}>Cancel</button>
            <span className="char-chronicle-count">
              {draft.length.toLocaleString()} characters · markdown: **bold**, *italic*, # headings,
              - lists, &gt; quotes
            </span>
          </div>
        </div>
      ) : backstory ? (
        <>
          <div className={`char-chronicle-body${isLong && !expanded ? ' clamped' : ''}`}>
            <Markdown text={backstory} />
          </div>
          {isLong && (
            <button className="sheet-btn" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : 'Read the full chronicle'}
            </button>
          )}
        </>
      ) : (
        <p className="char-chronicle-empty">
          No chronicle recorded yet — every adventurer has a story worth a few lines.
        </p>
      )}
    </div>
  );
}

/**
 * D&D-style character sheet: a parchment document laid on the dark page.
 * Everything here is synchronous — the sheet renders instantly while the
 * advisor panels below lazy-load their class data.
 */
export function CharacterSheet({ character }: { character: CharacterProfile }) {
  const race = RACE_BY_ID[character.raceId];
  const primary = CLASS_BY_ID[character.classIds[0]];
  const stats = useMemo(
    () => statsFor(character.raceId, character.classIds[0]),
    [character.raceId, character.classIds]
  );
  const primes = new Set(CLASS_PRIME_STATS[character.classIds[0]] ?? []);
  const coverage = useMemo(() => roleCoverage(character.classIds), [character.classIds]);
  const band = bandForLevel(character.level);

  const abilities = useMemo(
    () => ABILITIES.filter((a) => a.forClasses.some((c) => character.classIds.includes(c))),
    [character.classIds]
  );
  const stanceCount = abilities.filter((a) => a.kind === 'stance').length;
  const invocationCount = abilities.filter((a) => a.kind === 'invocation').length;

  const secondaries = character.classIds
    .slice(1)
    .map((id) => CLASS_BY_ID[id]?.name ?? id);

  return (
    <section className="char-sheet" aria-label={`Character sheet: ${character.name}`}>
      <div className="map-frame" aria-hidden="true" />
      <div className="char-sheet-grid">
        <div className="char-portrait char-portrait--class">
          <ClassPortrait classId={character.classIds[0]} parchment />
          <div className="char-portrait-caption">{primary?.name ?? character.classIds[0]}</div>
        </div>

        <div className="char-portrait char-portrait--race">
          <RacePortrait raceId={character.raceId} parchment />
          <div className="char-portrait-caption">{race?.name ?? character.raceId}</div>
        </div>

        <header className="char-nameplate">
          <h2 className="char-name">{character.name}</h2>
          <p className="char-subtitle">
            Level {character.level} {race?.name ?? character.raceId} {primary?.name ?? ''}
            {secondaries.length > 0 && <> · {secondaries.join(' · ')}</>}
          </p>
          <p className="char-meta">
            {race && ALIGNMENT_LABELS[race.alignment]}
            {' '}·{' '}
            {character.deityId && DEITY_BY_ID[character.deityId]
              ? `follows ${DEITY_BY_ID[character.deityId].name}, ${DEITY_BY_ID[character.deityId].epithet}`
              : 'agnostic'}
            {race && (
              <>
                {' '}· begins in{' '}
                <Link to={`/atlas/${race.startingZoneId}`}>{race.startingCity}</Link>
              </>
            )}
            {' '}· {character.aaPoints ?? 0} AA banked
          </p>
        </header>

        <ul className="char-attrs" aria-label="Attributes">
          {STAT_KEYS.map((k) => (
            <li
              key={k}
              className={`stat-block${primes.has(k) ? ' prime' : ''}`}
              title={STAT_NAMES[k] + (primes.has(k) ? ` — prime stat for ${primary?.name}` : '')}
            >
              <span className="stat-label">{STAT_LABELS[k]}</span>
              <span className="stat-value">{stats[k]}</span>
            </li>
          ))}
        </ul>

        <div className="char-features">
          {race && (
            <div>
              <h4>Racial traits</h4>
              <ul>
                {race.traits.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4>Party roles</h4>
            <ul>
              {coverage.covered.map((r) => (
                <li key={r}>{ROLE_LABELS[r]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Combat arts</h4>
            <ul>
              <li>
                {stanceCount} stance{stanceCount === 1 ? '' : 's'}
              </li>
              <li>
                {invocationCount} invocation{invocationCount === 1 ? '' : 's'}
              </li>
              <li>
                {(character.ownedSpells ?? []).length} spells ·{' '}
                {Object.values(character.aaRanks ?? {}).reduce((a, b) => a + b, 0)} AA ranks
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Armory character={character} />

      <Chronicle character={character} />

      <footer className="sheet-cartouche">
        {band.title}
        <span className="sheet-cartouche-sub"> — {band.focus}</span>
      </footer>
      <p className="char-caveat">
        Attributes are classic-EverQuest creation values; EQL beta numbers may differ.
      </p>
    </section>
  );
}
