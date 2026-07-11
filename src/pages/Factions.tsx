import { Link } from 'react-router-dom';
import { FACTIONS, FACTION_BY_ID } from '../data/factions';
import { ZONE_BY_ID } from '../data/zones';
import { RACE_BY_ID } from '../data/races';
import { useCharacters } from '../context/CharacterContext';
import { deityAdvice } from '../lib/advisor';
import type { Alignment, Faction } from '../data/types';

function opposed(a: Alignment, b: Alignment): boolean {
  return (a === 'good' && b === 'evil') || (a === 'evil' && b === 'good');
}

function FactionCard({
  faction,
  raceAlignment,
  homeZoneId
}: {
  faction: Faction;
  raceAlignment?: Alignment;
  homeZoneId?: string;
}) {
  const cityAlignment = faction.homeZoneIds
    .map((z) => ZONE_BY_ID[z]?.cityAlignment)
    .find((a) => a !== undefined);
  const isHome = homeZoneId !== undefined && faction.homeZoneIds.includes(homeZoneId);
  const kosRisk =
    !isHome && raceAlignment !== undefined && cityAlignment !== undefined
      ? opposed(raceAlignment, cityAlignment)
      : false;

  return (
    <div className="card" data-faction={faction.id}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}
      >
        <strong style={{ color: 'var(--gold)' }}>{faction.name}</strong>
        {isHome && <span className="badge good" style={{ flexShrink: 0 }}>Your home turf</span>}
        {kosRisk && <span className="badge danger" style={{ flexShrink: 0 }}>KOS risk</span>}
      </div>
      <div className="chip-row" style={{ margin: '0.3rem 0' }}>
        {faction.homeZoneIds.map(
          (z) =>
            ZONE_BY_ID[z] && (
              <Link key={z} to={`/atlas/${z}`} className="badge">
                {ZONE_BY_ID[z].name}
              </Link>
            )
        )}
      </div>
      <p className="small" style={{ margin: '0.2rem 0' }}>{faction.description}</p>
      <p className="small muted" style={{ margin: '0.3rem 0 0' }}>
        <strong>Raise it:</strong> {faction.raise.join(' · ')}
      </p>
      {faction.rivals && faction.rivals.length > 0 && (
        <p className="small muted" style={{ margin: '0.2rem 0 0' }}>
          <strong>Rivals:</strong>{' '}
          {faction.rivals.map((r) => FACTION_BY_ID[r]?.name ?? r).join(', ')} — helping one side
          costs you the other.
        </p>
      )}
      {faction.warning && (
        <p className="small" style={{ margin: '0.3rem 0 0', color: 'var(--warn)' }}>
          ⚠ {faction.warning}
        </p>
      )}
    </div>
  );
}

export default function Factions() {
  const { active } = useCharacters();
  const race = active ? RACE_BY_ID[active.raceId] : undefined;

  return (
    <div>
      <h1>Faction Guide</h1>
      <p className="muted">
        Faction is Norrath’s real endgame currency: it decides which cities bank for you, which
        guards ignore you, and which merchants take your coin. These are the significant
        classic-era factions — Kunark and Velious factions wait for their eras.
      </p>

      <div className="advice-callout small">
        <strong>EQL faction changes:</strong> the minimum faction hit per kill is now 5 (no more
        farming your way around consequences one point at a time), and there are{' '}
        <strong>faction achievements</strong> for each major playable-race faction. Race Unlock
        achievements check against those achievements — grinding a city’s faction is now how you
        unlock things account-wide, and standing survives loadout swaps. Deity choice colors
        several of these standings from character creation.
      </div>

      {race ? (
        <p className="small">
          Personalized for <strong>{active!.name}</strong> ({race.name}, {race.alignment}) —
          home-turf factions are highlighted, and factions centered on cities hostile to{' '}
          {race.alignment} races are flagged.
          {deityAdvice(active!) && <> ✦ {deityAdvice(active!)}</>}
        </p>
      ) : (
        <p className="small muted">
          <Link to="/character">Set up your character</Link> to highlight your home factions and
          flag the cities where your race is kill-on-sight.
        </p>
      )}

      <div className="card-grid" style={{ marginTop: '0.8rem' }}>
        {FACTIONS.map((f) => (
          <FactionCard
            key={f.id}
            faction={f}
            raceAlignment={race?.alignment}
            homeZoneId={race?.startingZoneId}
          />
        ))}
      </div>
    </div>
  );
}
