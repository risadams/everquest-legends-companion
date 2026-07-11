import { Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { RACE_BY_ID } from '../data/races';
import { CLASS_BY_ID } from '../data/classes';
import { recommendZones, nextMilestones } from '../lib/advisor';
import { bandForLevel } from '../data/progression';
import { FitBadge } from '../components/ZoneCard';
import { ClassPortrait } from '../components/ClassPortrait';
import BrandMark from '../components/BrandMark';

/** the sketches paraded under the hero — a fixed, recognizable lineup */
const HERO_CLASSES = ['warrior', 'cleric', 'wizard', 'rogue', 'shaman', 'enchanter', 'ranger', 'necromancer'];

interface NavCard {
  to: string;
  icon: string;
  title: string;
  blurb: string;
}

const SECTIONS: { label: string; cards: NavCard[] }[] = [
  {
    label: 'The World',
    cards: [
      {
        to: '/atlas',
        icon: '🗺',
        title: 'Atlas',
        blurb:
          'Every launch zone across Antonica, Faydwer, Odus, and the Planes — level ranges, hunting camps, dangers, and connection maps.'
      },
      {
        to: '/bestiary',
        icon: '🐉',
        title: 'Bestiary',
        blurb:
          'Nameds, raid dragons, and famous camps — levels, locations, and the loot that made them legends.'
      },
      {
        to: '/quests',
        icon: '✉',
        title: 'Quest Guide',
        blurb:
          'Repeatable XP turn-ins and the iconic item quests — filtered to what your character can actually do.'
      },
      {
        to: '/factions',
        icon: '⚖',
        title: 'Faction Guide',
        blurb:
          'The significant classic-era factions — who to raise, who it costs you, and which cities are safe for your race.'
      },
      {
        to: '/travel',
        icon: '🌀',
        title: 'Travel Guide',
        blurb:
          'The full port network — druid rings, wizard gates, evacs, and the new Rituals system — colored by what your combo can cast.'
      }
    ]
  },
  {
    label: 'Your Classes',
    cards: [
      {
        to: '/classes',
        icon: '⚔',
        title: 'Races & Classes',
        blurb:
          '15 races, 16 classes, and the 3-class system — with a combo explorer to pressure-test your trio before you commit.'
      },
      {
        to: '/spells',
        icon: '✨',
        title: 'Spells & Skills',
        blurb:
          'Every class’s full spell book, skill caps, and AA tables — with auto-granted vs. vendor vs. drop sources for all ~1,500 spells.'
      },
      {
        to: '/abilities',
        icon: '🛡',
        title: 'Stances & Invocations',
        blurb:
          'EQL’s combat modes decoded — which of the 9 stances and 9 invocations your trio unlocks, with multiclass scaling computed.'
      },
      {
        to: '/macros',
        icon: '⌨',
        title: 'Macro Guide',
        blurb:
          'Ready-to-build social macros for your combo — including one-button cross-class rotations unique to the 3-class system.'
      }
    ]
  },
  {
    label: 'Guides & Lore',
    cards: [
      {
        to: '/progression',
        icon: '📜',
        title: 'Progression Guide',
        blurb:
          'A band-by-band roadmap from level 1 to the planar endgame at 50 — milestones, role tips, and where to hunt at every stage.'
      },
      {
        to: '/tradeskills',
        icon: '⚒️',
        title: 'Tradeskill Guide',
        blurb:
          'Every craft from Alchemy to Tinkering — who can practice it, the cheapest 0-to-cap ladder, and the recipes people pay for.'
      },
      {
        to: '/handbook',
        icon: '📖',
        title: 'Systems Handbook',
        blurb:
          'AAs from level 1, Exaltation gear customization, deities, and loadouts — the systems the manual never shipped for.'
      },
      {
        to: '/lore',
        icon: '🕯',
        title: 'Lore & History',
        blurb:
          'Five ages of Norrath, sixteen gods, and the kings, dragons, and villains behind the zones — plus your race’s place in the story.'
      },
      {
        to: '/character',
        icon: '🧭',
        title: 'Personal Advisor',
        blurb:
          'Your character sheet and advisor: ranked hunting zones, build analysis, AA planning, and your next milestones.'
      }
    ]
  }
];

export default function Home() {
  const { active } = useCharacters();

  return (
    <div>
      <section className="hero">
        <BrandMark size={88} />
        <h1>EQL Companion</h1>
        <p className="hero-tag muted">
          An unofficial atlas, class compendium, and leveling advisor for{' '}
          <strong>EverQuest Legends</strong> — the reimagined classic Norrath.
        </p>
        <p className="hero-sub small muted">
          Launching July 28, 2026 · open source on{' '}
          <a
            href="https://github.com/risadams/everquest-legends-companion"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{' '}
          · issues and data corrections welcome
        </p>
        <div className="hero-cta">
          <Link to="/character" className="btn primary">
            Create your character
          </Link>
          <Link to="/atlas" className="btn">
            Browse the atlas
          </Link>
        </div>
        <div className="hero-band" aria-hidden="true">
          {HERO_CLASSES.map((id) => (
            <Link key={id} to={`/classes/${id}`} tabIndex={-1}>
              <ClassPortrait classId={id} parchment />
            </Link>
          ))}
        </div>
      </section>

      {active ? (
        <ActiveDashboard />
      ) : (
        <div className="advice-callout">
          <strong>Start here:</strong> <Link to="/character">create your character</Link> (race, class
          trio, level) and every page — atlas, maps, progression guide — will tailor itself to you.
        </div>
      )}

      {SECTIONS.map((section) => (
        <section key={section.label} className="home-group">
          <h2 className="home-group-label">{section.label}</h2>
          <div className="card-grid">
            {section.cards.map((c) => (
              <Link key={c.to} to={c.to} className="card card--nav" style={{ color: 'inherit' }}>
                <h3>
                  <span className="glyph-plate" aria-hidden="true">{c.icon}</span>
                  {c.title}
                </h3>
                <p className="small muted">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
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
    <div className="home-dash">
      <div className="home-dash-portrait">
        <ClassPortrait classId={active.classIds[0]} parchment />
      </div>
      <div className="home-dash-body">
        <h2 className="home-dash-name">
          {active.name}
          <span className="home-dash-sub">
            {' '}
            — level {active.level} {race?.name}{' '}
            {active.classIds.map((c) => CLASS_BY_ID[c]?.name).join(' / ')}
          </span>
        </h2>
        <div className="two-col">
          <div>
            <strong className="home-dash-kicker">HUNT NEXT</strong>
            <ul className="tight">
              {recs.map((r) => (
                <li key={r.zone.id}>
                  <Link to={`/atlas/${r.zone.id}`}>{r.zone.name}</Link>{' '}
                  <span className="small" style={{ opacity: 0.75 }}>
                    ({r.zone.levelMin}–{r.zone.levelMax})
                  </span>{' '}
                  <FitBadge fit={r.fit} />
                </li>
              ))}
            </ul>
            <Link to="/character" className="small">
              Full character sheet & advisor →
            </Link>
          </div>
          <div>
            <strong className="home-dash-kicker">
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
    </div>
  );
}
