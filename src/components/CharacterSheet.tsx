import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { CharacterProfile } from '../data/types';
import { RACE_BY_ID } from '../data/races';
import { CLASS_BY_ID, ROLE_LABELS } from '../data/classes';
import { STAT_KEYS, STAT_LABELS, STAT_NAMES, CLASS_PRIME_STATS, statsFor } from '../data/stats';
import { ABILITIES } from '../data/abilities';
import { roleCoverage } from '../lib/advisor';
import { bandForLevel } from '../data/progression';
import { ClassPortrait } from './ClassPortrait';

const ALIGNMENT_LABELS: Record<string, string> = {
  good: 'Good',
  neutral: 'Neutral',
  evil: 'Evil'
};

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
        <div className="char-portrait">
          <ClassPortrait classId={character.classIds[0]} parchment />
          <div className="char-portrait-caption">{primary?.name ?? character.classIds[0]}</div>
        </div>

        <header className="char-nameplate">
          <h2 className="char-name">{character.name}</h2>
          <p className="char-subtitle">
            Level {character.level} {race?.name ?? character.raceId} {primary?.name ?? ''}
            {secondaries.length > 0 && <> · {secondaries.join(' · ')}</>}
          </p>
          <p className="char-meta">
            {race && ALIGNMENT_LABELS[race.alignment]}
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
                {(character.ownedAas ?? []).length} AAs owned
              </li>
            </ul>
          </div>
        </div>
      </div>

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
