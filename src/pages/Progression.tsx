import { PROGRESSION_BANDS, bandForLevel } from '../data/progression';
import { useCharacters } from '../context/CharacterContext';
import { CLASS_BY_ID } from '../data/classes';
import { Link } from 'react-router-dom';
import { ZONES } from '../data/zones';

function zonesForBand(min: number, max: number) {
  return ZONES.filter(
    (z) => z.type !== 'city' && z.levelMin <= max && z.levelMax >= min
  )
    .sort((a, b) => a.levelMin - b.levelMin)
    .slice(0, 8);
}

export default function Progression() {
  const { active } = useCharacters();
  const currentBand = active ? bandForLevel(active.level) : null;

  return (
    <div>
      <h1>Progression Guide: 1 to 50</h1>
      <p className="muted">
        A level-by-level roadmap from your first newbie yard to the Planes.
        {active
          ? ` ${active.name}'s current band is highlighted.`
          : ' Create a character on the My Character page to personalize this guide.'}
      </p>
      {PROGRESSION_BANDS.map((band) => {
        const isCurrent = currentBand?.id === band.id;
        const bandZones = zonesForBand(band.levelMin, band.levelMax);
        return (
          <section key={band.id} className={`level-band ${isCurrent ? 'current' : ''}`}>
            <h2 style={{ marginBottom: 0 }}>
              Levels {band.label}: {band.title}{' '}
              {isCurrent && <span className="badge gold">you are here</span>}
            </h2>
            <p>{band.focus}</p>
            <strong className="small" style={{ color: 'var(--gold-dim)' }}>Milestones</strong>
            <ul className="tight">
              {band.milestones.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {isCurrent && active && (
              <div className="advice-callout small">
                <strong>Your classes this band:</strong>
                <ul className="tight">
                  {active.classIds.map((cid) => {
                    const cls = CLASS_BY_ID[cid];
                    if (!cls) return null;
                    const key =
                      band.levelMin <= 9
                        ? '1-9'
                        : band.levelMin <= 19
                          ? '10-19'
                          : band.levelMin <= 34
                            ? '20-34'
                            : '35-50';
                    return (
                      <li key={cid}>
                        <strong>{cls.name}:</strong> {cls.levelNotes[key]}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <details className="small">
              <summary className="muted">
                Role tips &amp; zones for {band.label}
              </summary>
              <ul className="tight">
                {Object.entries(band.roleTips).map(([role, tip]) => (
                  <li key={role}>
                    <strong style={{ textTransform: 'capitalize' }}>{role}:</strong> {tip}
                  </li>
                ))}
              </ul>
              <div className="chip-row">
                {bandZones.map((z) => (
                  <Link key={z.id} to={`/atlas/${z.id}`} className="badge blue">
                    {z.name} ({z.levelMin}–{z.levelMax})
                  </Link>
                ))}
              </div>
            </details>
          </section>
        );
      })}
    </div>
  );
}
