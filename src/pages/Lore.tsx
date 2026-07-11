import { Link } from 'react-router-dom';
import { LORE_ERAS, LORE_DEITIES, LORE_FIGURES, RACE_LORE } from '../data/lore';
import { ZONE_BY_ID } from '../data/zones';
import { RACE_BY_ID } from '../data/races';
import { useCharacters } from '../context/CharacterContext';
import { asset } from '../lib/assets';
import { RacePortrait } from '../components/ClassPortrait';
import type { Alignment } from '../data/types';

const ALIGN_BADGE: Record<Alignment, string> = {
  good: 'good',
  neutral: '',
  evil: 'danger'
};

export default function Lore() {
  const { active } = useCharacters();
  const race = active ? RACE_BY_ID[active.raceId] : undefined;
  const raceLore = race ? RACE_LORE[race.id] : undefined;

  return (
    <div>
      <h1>Lore of Norrath</h1>
      <p className="muted">
        Whose ruins are you looting? Who cursed the ogres, who burned the elven homeland into the
        Desert of Ro, and why does everyone in Freeport look over their shoulder? The story so far
        — as classic EverQuest tells it, and EQL retells it.
      </p>

      <section>
        <h2>Your place in the world</h2>
        {race && raceLore ? (
          <div className="advice-callout" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: 'clamp(72px, 9vw, 100px)', flex: 'none' }}>
              <RacePortrait raceId={race.id} />
            </div>
            <div>
            <p style={{ margin: 0 }}>
              <strong>
                {active!.name}, {race.name} of {race.startingCity}:
              </strong>{' '}
              {raceLore}
            </p>
            <p className="small muted" style={{ margin: '0.5rem 0 0' }}>
              It is the <strong>Age of Turmoil</strong> — roughly five centuries after the Combine
              Empire vanished. You are one of the first generation bold (or broke) enough to make
              a living from the ruins it left behind. Your story starts in{' '}
              <Link to={`/atlas/${race.startingZoneId}`}>{race.startingCity}</Link>; where it ends
              is up to you.
            </p>
            </div>
          </div>
        ) : (
          <div className="advice-callout small">
            It is the <strong>Age of Turmoil</strong> — five centuries after the Combine Empire
            vanished, in a world of young kingdoms, corrupt guards, and stirring dragons.
            Adventurers are Norrath’s newest profession and you are one of them.{' '}
            <Link to="/character">Set up your character</Link> to see your race’s place in the
            story.
          </div>
        )}
      </section>

      <section>
        <h2>A history of Norrath</h2>
        <div>
          {LORE_ERAS.map((era, i) => (
            <div className="level-band" key={era.id} data-era={era.id}>
              <h3 style={{ margin: '0 0 0.1rem', color: 'var(--gold)' }}>
                {i + 1}. {era.name}{' '}
                <span className="muted small" style={{ fontWeight: 'normal' }}>
                  — {era.period}
                </span>
              </h3>
              <p className="small" style={{ margin: '0.2rem 0 0.4rem' }}>{era.summary}</p>
              <ul className="tight small muted" style={{ margin: 0 }}>
                {era.events.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>The gods</h2>
        <p className="small muted">
          Sixteen powers shaped Norrath and still take sides in it. Your deity choice at creation
          colors factions, usable relics, and a few quest lines — the truly stubborn stay
          agnostic. See the <Link to="/handbook">Handbook</Link> for the mechanical side; artwork
          from the{' '}
          <a href="https://wiki.project1999.com/Deity" target="_blank" rel="noreferrer">Project 1999 wiki</a>.
        </p>
        <div className="card-grid">
          {LORE_DEITIES.map((d) => (
            <div className="card" key={d.id} data-deity={d.id}>
              {d.image && (
                <div className="art-plate art-plate--relic">
                  <img src={asset(d.image)} alt={`${d.name} — ${d.epithet}`} loading="lazy" />
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                <strong style={{ color: 'var(--gold)' }}>{d.name}</strong>
                <span className={`badge ${ALIGN_BADGE[d.alignment]}`}>{d.alignment}</span>
              </div>
              <p className="small muted" style={{ margin: '0.1rem 0 0.3rem', fontStyle: 'italic' }}>
                {d.epithet} · {d.domain}
              </p>
              <p className="small" style={{ margin: '0.2rem 0' }}>{d.blurb}</p>
              {d.lore && <p className="small muted" style={{ margin: '0.3rem 0' }}>{d.lore}</p>}
              <p className="small muted" style={{ margin: '0.3rem 0 0' }}>
                <strong>Followers:</strong> {d.followers}
              </p>
              {d.planeZoneId && ZONE_BY_ID[d.planeZoneId] && (
                <p className="small" style={{ margin: '0.3rem 0 0' }}>
                  ✦ Visitable: <Link to={`/atlas/${d.planeZoneId}`}>{ZONE_BY_ID[d.planeZoneId].name}</Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Figures of note</h2>
        <p className="small muted">
          The names behind the zones — kings, tyrants, dragons, vampires, and one very determined
          gnoll. Several are hunt targets in the <Link to="/bestiary">Bestiary</Link>; portraits are
          in-game renders from the <a href="https://eqlwiki.com" target="_blank" rel="noreferrer">EQL Wiki</a>{' '}
          and <a href="https://everquest.allakhazam.com" target="_blank" rel="noreferrer">Allakhazam</a>.
        </p>
        <div className="card-grid">
          {LORE_FIGURES.map((f) => (
            <div className="card" key={f.id} data-figure={f.id}>
              {f.image && (
                <div className="art-plate art-plate--relic">
                  <img src={asset(f.image)} alt={`${f.name} — in-game portrait`} loading="lazy" />
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                <strong style={{ color: 'var(--gold)' }}>{f.name}</strong>
                {f.zoneId && ZONE_BY_ID[f.zoneId] && (
                  <Link to={`/atlas/${f.zoneId}`} className="badge">
                    {ZONE_BY_ID[f.zoneId].name}
                  </Link>
                )}
              </div>
              <p className="small muted" style={{ margin: '0.1rem 0 0.3rem', fontStyle: 'italic' }}>
                {f.title}
              </p>
              <p className="small" style={{ margin: 0 }}>{f.blurb}</p>
              {f.lore && (
                <p className="small muted" style={{ margin: '0.4rem 0 0' }}>{f.lore}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
