import { Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { RACE_BY_ID } from '../data/races';
import { CLASS_BY_ID } from '../data/classes';
import { recommendZones, nextMilestones } from '../lib/advisor';
import { bandForLevel } from '../data/progression';
import { FitBadge } from '../components/ZoneCard';

export default function Home() {
  const { active } = useCharacters();

  return (
    <div>
      <h1>EQL Companion</h1>
      <p className="muted">
        An unofficial atlas, class guide, and leveling advisor for{' '}
        <strong>EverQuest Legends</strong> — the reimagined classic Norrath, launching July 28, 2026.
        Open source on{' '}
        <a
          href="https://github.com/risadams/everquest-legends-companion"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{' '}
        — issues and data corrections welcome.
      </p>

      {active ? (
        <ActiveDashboard />
      ) : (
        <div className="advice-callout">
          <strong>Start here:</strong> <Link to="/character">create your character</Link> (race, class
          trio, level) and every page — atlas, maps, progression guide — will tailor itself to you.
        </div>
      )}

      <div className="card-grid" style={{ marginTop: '1.2rem' }}>
        <Link to="/atlas" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>🗺 Atlas</h3>
          <p className="small muted">
            Every launch zone across Antonica, Faydwer, Odus, and the Planes — level ranges, hunting
            camps, dangers, and connection maps.
          </p>
        </Link>
        <Link to="/classes" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>⚔ Races &amp; Classes</h3>
          <p className="small muted">
            15 races, 16 classes, and the 3-class system. Explore combos and check your trio’s role
            coverage before you commit.
          </p>
        </Link>
        <Link to="/bestiary" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>🐉 Bestiary</h3>
          <p className="small muted">
            Nameds, raid dragons, and famous camps — levels, locations, and the loot that made them
            legends.
          </p>
        </Link>
        <Link to="/quests" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>✉ Quest Guide</h3>
          <p className="small muted">
            Repeatable XP turn-ins and the iconic item quests — filtered to what your character can
            actually do.
          </p>
        </Link>
        <Link to="/macros" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>⌨ Macro Guide</h3>
          <p className="small muted">
            Ready-to-build social macros for your combo — including one-button cross-class rotations
            unique to the 3-class system.
          </p>
        </Link>
        <Link to="/progression" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>📜 Progression Guide</h3>
          <p className="small muted">
            A band-by-band roadmap from level 1 to the planar endgame at 50 — milestones, role tips,
            and where to hunt at every stage.
          </p>
        </Link>
        <Link to="/character" className="card" style={{ color: 'inherit' }}>
          <h3 style={{ marginTop: 0 }}>🧭 Personal Advisor</h3>
          <p className="small muted">
            Tell it your race, classes, and level; get ranked hunting zones, build analysis, and your
            next milestones.
          </p>
        </Link>
      </div>
    </div>
  );
}

function ActiveDashboard() {
  const { active } = useCharacters();
  if (!active) return null;
  const race = RACE_BY_ID[active.raceId];
  const recs = recommendZones(active, 3);
  const band = bandForLevel(active.level);
  const milestones = nextMilestones(active).slice(0, 3);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>
        {active.name} — level {active.level} {race?.name}{' '}
        <span className="muted small">
          {active.classIds.map((c) => CLASS_BY_ID[c]?.name).join(' / ')}
        </span>
      </h2>
      <div className="two-col">
        <div>
          <strong className="small" style={{ color: 'var(--gold-dim)' }}>
            HUNT NEXT
          </strong>
          <ul className="tight">
            {recs.map((r) => (
              <li key={r.zone.id}>
                <Link to={`/atlas/${r.zone.id}`}>{r.zone.name}</Link>{' '}
                <span className="muted small">
                  ({r.zone.levelMin}–{r.zone.levelMax})
                </span>{' '}
                <FitBadge fit={r.fit} />
              </li>
            ))}
          </ul>
          <Link to="/character" className="small">
            Full advisor report →
          </Link>
        </div>
        <div>
          <strong className="small" style={{ color: 'var(--gold-dim)' }}>
            LEVELS {band.label}: {band.title.toUpperCase()}
          </strong>
          <ul className="tight small">
            {milestones.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <Link to="/progression" className="small">
            Progression guide →
          </Link>
        </div>
      </div>
    </div>
  );
}
