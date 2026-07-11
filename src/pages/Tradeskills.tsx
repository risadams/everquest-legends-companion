import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TRADESKILLS, TRADESKILL_BY_ID, tradeskillsFor } from '../data/tradeskills';
import { ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { RACE_BY_ID } from '../data/races';
import { useCharacters } from '../context/CharacterContext';
import type { Tradeskill } from '../data/types';

function whoLabel(t: Tradeskill): string {
  if (t.requiresRaces) return `${t.requiresRaces.map((r) => RACE_BY_ID[r]?.name ?? r).join(', ')}s only`;
  if (t.requiresClasses)
    return `Needs ${t.requiresClasses.map((c) => CLASS_BY_ID[c]?.name ?? c).join(' / ')}`;
  return 'Everyone';
}

function ZoneLinks({ zoneIds }: { zoneIds?: string[] }) {
  if (!zoneIds || zoneIds.length === 0) return null;
  return (
    <span className="muted">
      {' '}(
      {zoneIds.map((z, i) => (
        <span key={z}>
          {i > 0 && ', '}
          {ZONE_BY_ID[z] ? <Link to={`/atlas/${z}`}>{ZONE_BY_ID[z].name}</Link> : z}
        </span>
      ))}
      )
    </span>
  );
}

function TradeskillDetail({ t }: { t: Tradeskill }) {
  return (
    <div>
      <h2>
        {t.icon} {t.name}{' '}
        <span className="small muted">— {t.makes.toLowerCase()}</span>
      </h2>
      <p className="small">{t.summary}</p>
      <p className="small">
        <span className="badge">{whoLabel(t)}</span>{' '}
        <span className="badge blue" title="Where combines happen">{t.container}</span>{' '}
        <span className="badge" title="Governs skill-up chance">Skill-ups: {t.stat}</span>
        {t.synergyNote && (
          <span className="muted" style={{ marginLeft: '0.4rem' }}>
            {t.synergyClasses?.map((c) => CLASS_BY_ID[c]?.name).filter(Boolean).join('/')}{' '}
            synergy: {t.synergyNote}
          </span>
        )}
      </p>

      <h3>How to level it</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="data">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Make</th>
              <th>Trivial</th>
              <th>Components</th>
              <th>Where</th>
            </tr>
          </thead>
          <tbody>
            {t.leveling.map((s) => (
              <tr key={s.skill + s.make}>
                <td style={{ whiteSpace: 'nowrap' }}>{s.skill}</td>
                <td style={{ color: 'var(--gold)' }}>
                  {s.make}
                  {s.note && <div className="small muted">{s.note}</div>}
                </td>
                <td>{s.trivial ?? '—'}</td>
                <td className="small">{s.components}</td>
                <td className="small">
                  {s.where}
                  <ZoneLinks zoneIds={s.zoneIds} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Worth making</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="data">
          <thead>
            <tr>
              <th>Recipe</th>
              <th>Trivial</th>
              <th>Components</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {t.notable.map((r) => (
              <tr key={r.name}>
                <td style={{ color: 'var(--gold)', whiteSpace: 'nowrap' }}>{r.name}</td>
                <td>{r.trivial ?? '—'}</td>
                <td className="small">{r.components}</td>
                <td className="small">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Tips</h3>
      <ul className="tight small">
        {t.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Tradeskills() {
  const { active } = useCharacters();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? TRADESKILL_BY_ID[selectedId] : null;

  const fits = useMemo(() => (active ? tradeskillsFor(active) : null), [active]);
  const gated = fits?.available.filter((f) => f.fit === 'gated') ?? [];
  const synergy = fits?.available.filter((f) => f.fit === 'synergy') ?? [];

  return (
    <div>
      <h1>Tradeskill Guide</h1>
      <p className="muted">
        Every craft in EverQuest Legends: what it makes, who can practice it, the cheapest ladder
        from 0 to the cap, and the recipes worth making once you get there. Trivials follow the
        classic values EQL recreates — expect small shifts while the beta settles.
      </p>

      {active && fits && (
        <div className="advice-callout small">
          <strong>For {active.name}:</strong>{' '}
          {gated.length > 0 && (
            <>
              your loadout unlocks{' '}
              {gated.map((f, i) => (
                <span key={f.tradeskill.id}>
                  {i > 0 && ' and '}
                  <button className="linklike" onClick={() => setSelectedId(f.tradeskill.id)}
                    style={{ padding: '0 0.2rem' }}>
                    {f.tradeskill.icon} {f.tradeskill.name}
                  </button>
                </span>
              ))}
              {' '}— gated crafts most characters can’t touch.{' '}
            </>
          )}
          {synergy.length > 0 && (
            <>
              Strong fits for your classes:{' '}
              {synergy.map((f, i) => (
                <span key={f.tradeskill.id}>
                  {i > 0 && ', '}
                  <button className="linklike" onClick={() => setSelectedId(f.tradeskill.id)}
                    style={{ padding: '0 0.2rem' }}>
                    {f.tradeskill.icon} {f.tradeskill.name}
                  </button>
                </span>
              ))}
              .{' '}
            </>
          )}
          {gated.length === 0 && synergy.length === 0 && (
            <>no class- or race-gated crafts in your loadout — the open crafts below are all yours. </>
          )}
          {fits.locked.length > 0 && (
            <span className="muted">
              Locked for you: {fits.locked.map((t) => `${t.name} (${whoLabel(t).toLowerCase()})`).join(', ')}.
            </span>
          )}
        </div>
      )}

      <div className="chip-row" style={{ margin: '0.8rem 0' }}>
        <button className={selectedId === null ? 'active' : ''} onClick={() => setSelectedId(null)}>
          All crafts
        </button>
        {TRADESKILLS.map((t) => (
          <button
            key={t.id}
            className={selectedId === t.id ? 'active' : ''}
            onClick={() => setSelectedId(t.id)}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {selected ? (
        <TradeskillDetail t={selected} />
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="data">
              <thead>
                <tr>
                  <th>Craft</th>
                  <th>Makes</th>
                  <th>Who</th>
                  <th>Station</th>
                  <th>Skill-up stat</th>
                </tr>
              </thead>
              <tbody>
                {TRADESKILLS.map((t) => (
                  <tr key={t.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="linklike" onClick={() => setSelectedId(t.id)}
                        style={{ color: 'var(--gold)', padding: 0 }}>
                        {t.icon} {t.name}
                      </button>
                    </td>
                    <td className="small">{t.makes}</td>
                    <td className="small">
                      {t.requiresClasses || t.requiresRaces ? (
                        <span className="badge warn">{whoLabel(t)}</span>
                      ) : (
                        <span className="badge good">Everyone</span>
                      )}
                    </td>
                    <td className="small">{t.container}</td>
                    <td className="small">{t.stat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section>
            <h2>How skill-ups actually work</h2>
            <ul className="tight small">
              <li>
                Every recipe has a <strong>trivial</strong> — the skill at which it stops granting
                skill-ups. Your odds of a skill-up (and of a successful combine) rise as your
                skill approaches it. Combine just below trivial, then move up the ladder.
              </li>
              <li>
                <strong>Stats never affect combine success</strong> — only your skill vs. the
                recipe’s trivial. Trivial combines still fail 5% of the time; hard ones still
                succeed 5% of the time. Stats (INT/WIS, plus STR for Smithing and DEX for
                Fletching) only speed up <em>skill-ups</em>.
              </li>
              <li>
                Failed combines usually eat the components. Budget for failure below trivial,
                and stop grinding a recipe within ~5 points of it.
              </li>
              <li>
                Only one skill can pass 200 until you buy the <em>Crafting Mastery</em> AA — each
                rank frees another skill up to 300. Pick your main craft before you cross it.
              </li>
              <li>
                When combining stackables, put each item in its own container slot —{' '}
                <code>CTRL</code>-click takes one off a stack.
              </li>
              <li>
                EQL’s multiclass system applies to crafts too: a Shaman/Rogue loadout can run both
                Alchemy and Poison Making; an Enchanter makes their own Jewelcrafting bars.
              </li>
            </ul>
            <p className="small muted">
              More systems context in the <Link to="/handbook">Systems Handbook</Link> · research
              spells are tagged on your <Link to="/spells">class spell lists</Link> · component
              zones link into the <Link to="/atlas">Atlas</Link>.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
