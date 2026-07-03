import { Link, useParams } from 'react-router-dom';
import { ZONE_BY_ID, CONTINENT_LABELS } from '../data/zones';
import ZoneMap from '../components/ZoneMap';
import { FitBadge } from '../components/ZoneCard';
import { TYPE_LABELS } from '../components/mapUtils';
import { useCharacters } from '../context/CharacterContext';
import { levelFit, roleCoverage } from '../lib/advisor';

export default function ZoneDetail() {
  const { zoneId } = useParams();
  const zone = zoneId ? ZONE_BY_ID[zoneId] : undefined;
  const { active } = useCharacters();

  if (!zone) {
    return (
      <div>
        <h1>Unknown zone</h1>
        <p>
          That zone is not in the atlas. <Link to="/atlas">Back to the Atlas</Link>
        </p>
      </div>
    );
  }

  const fit = active && zone.type !== 'city' ? levelFit(zone, active.level) : null;
  const coverage = active ? roleCoverage(active.classIds) : null;
  const dungeonCaution =
    active &&
    coverage &&
    (zone.type === 'dungeon' || zone.type === 'plane') &&
    (!coverage.hasTank || !coverage.hasHealer);

  return (
    <div>
      <p className="small">
        <Link to="/atlas">← Atlas</Link> · {CONTINENT_LABELS[zone.continent]}
      </p>
      <h1 style={{ marginBottom: 0 }}>{zone.name}</h1>
      <div className="chip-row">
        <span className="badge">{TYPE_LABELS[zone.type]}</span>
        {zone.type !== 'city' && (
          <span className="badge gold">Levels {zone.levelMin}–{zone.levelMax}</span>
        )}
        {fit && <FitBadge fit={fit} />}
      </div>

      <div className="two-col">
        <div>
          <ZoneMap zone={zone} />
          <p className="small muted">
            Schematic map — landmark positions are illustrative, exits point toward their true
            direction of travel.
          </p>
        </div>
        <div>
          {zone.notes && <p>{zone.notes}</p>}

          {active && fit && (
            <div className="advice-callout small">
              <strong>{active.name}’s outlook:</strong>{' '}
              {fit === 'perfect' && 'This zone is squarely in your level range — excellent hunting.'}
              {fit === 'good' && 'Usable at your level; pick your targets and it will serve you well.'}
              {fit === 'risky' && 'Slightly above you. Hunt the lowest camps near the exits only.'}
              {fit === 'deadly' && 'Well above your level — come back later.'}
              {fit === 'trivial' && 'You have outgrown this zone; XP here will be poor.'}
              {dungeonCaution && (
                <>
                  {' '}
                  Your build lacks {!coverage!.hasTank && 'a tank'}
                  {!coverage!.hasTank && !coverage!.hasHealer && ' and '}
                  {!coverage!.hasHealer && 'a healer'} — treat this{' '}
                  {zone.type === 'plane' ? 'plane' : 'dungeon'} with extra respect or bring a group.
                </>
              )}
            </div>
          )}

          <h3>Hunting grounds</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Camp</th>
                <th>Levels</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {zone.hotspots.map((h) => (
                <tr key={h.name}>
                  <td>{h.name}</td>
                  <td>{h.levels}</td>
                  <td className="muted small">{h.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {zone.dangers && zone.dangers.length > 0 && (
            <>
              <h3>Dangers</h3>
              <ul className="tight">
                {zone.dangers.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}

          <h3>Connections</h3>
          <div className="chip-row">
            {zone.connections.map((cid) => {
              const c = ZONE_BY_ID[cid];
              if (!c) return null;
              return (
                <Link key={cid} to={`/atlas/${cid}`} className="badge blue">
                  {c.name}
                </Link>
              );
            })}
            {zone.connections.length === 0 && (
              <span className="muted small">Reached by teleport only.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
