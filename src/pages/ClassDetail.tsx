import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CLASS_BY_ID } from '../data/classes';
import {
  loadClassData,
  loadSharedAa,
  spellSource,
  SPELL_SOURCE_LABELS,
  RESIST_LABELS,
  castLabel,
  ownKey,
  isAutoGranted,
  spellOwned,
  type ClassData,
  type SharedAa,
  type SpellRow,
  type AaRow
} from '../lib/classdata';
import { useCharacters } from '../context/CharacterContext';
import { SpellIcon } from '../components/SpellIcon';
import { RITUAL_SPELL_NAMES } from '../lib/travel';

type Tab = 'spells' | 'skills' | 'aas';

function sourceBadgeClass(s: SpellRow): string {
  const kind = spellSource(s);
  return kind === 'auto' ? 'gold' : kind === 'vendor' ? '' : kind === 'drop' ? 'warn' : 'blue';
}

function AaTable({
  rows,
  owned,
  onToggle
}: {
  rows: AaRow[];
  owned?: Set<string>;
  onToggle?: (key: string) => void;
}) {
  if (rows.length === 0) return <p className="small muted">Nothing documented on the wiki yet.</p>;
  const track = !!onToggle;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data">
        <thead>
          <tr>
            {track && <th title="Purchased">✓</th>}
            <th>Name</th>
            <th>Ranks</th>
            <th>Cost</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const key = ownKey(a.name);
            const have = owned?.has(key) ?? false;
            return (
              <tr key={a.name} style={have ? { opacity: 0.5 } : undefined}>
                {track && (
                  <td>
                    <input
                      type="checkbox"
                      checked={have}
                      onChange={() => onToggle!(key)}
                      aria-label={`Owned: ${a.name}`}
                    />
                  </td>
                )}
                <td style={{ color: 'var(--gold)', whiteSpace: 'nowrap' }}>{a.name}</td>
                <td>{a.ranks}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{a.cost}</td>
                <td className="small">{a.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const cls = classId ? CLASS_BY_ID[classId] : undefined;
  const { active, toggleOwned } = useCharacters();
  const [data, setData] = useState<ClassData | 'missing' | null>(null);
  const [shared, setShared] = useState<SharedAa | null>(null);
  const [tab, setTab] = useState<Tab>('spells');
  const [search, setSearch] = useState('');
  const [maxLevel, setMaxLevel] = useState<number>(50);

  const mine = active?.classIds.includes(classId ?? '') ?? false;
  const charLevel = active?.level ?? 0;
  const ownedSpells = useMemo(() => new Set(active?.ownedSpells ?? []), [active]);
  const ownedAas = useMemo(() => new Set(active?.ownedAas ?? []), [active]);
  const aaTrack = mine
    ? { owned: ownedAas, onToggle: (k: string) => toggleOwned('aa', k) }
    : undefined;

  useEffect(() => {
    if (!classId) return;
    const p = loadClassData(classId);
    if (!p) {
      setData('missing');
      return;
    }
    let live = true;
    setData(null);
    p.then((d) => {
      if (live) setData(d);
      if (live && d.spells.length === 0) setTab('skills');
    });
    return () => {
      live = false;
    };
  }, [classId]);

  useEffect(() => {
    if (mine && active) setMaxLevel(Math.min(50, active.level + 4));
  }, [mine, active]);

  useEffect(() => {
    if (tab === 'aas' && !shared) loadSharedAa().then(setShared);
  }, [tab, shared]);

  const spells = useMemo(() => {
    if (!data || data === 'missing') return [];
    const q = search.trim().toLowerCase();
    return data.spells.filter((s) => {
      if (s.level > maxLevel) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.kind.toLowerCase().includes(q)
      );
    });
  }, [data, search, maxLevel]);

  if (!cls) {
    return (
      <div>
        <h1>Unknown class</h1>
        <p>
          <Link to="/classes">Back to Races &amp; Classes</Link>
        </p>
      </div>
    );
  }

  const isBard = cls.id === 'bard';

  return (
    <div>
      <p className="small" style={{ marginBottom: 0 }}>
        <Link to="/classes">← Races &amp; Classes</Link>
      </p>
      <h1 style={{ marginTop: '0.2rem' }}>{cls.name}</h1>
      <p className="muted">{cls.blurb}</p>
      {mine && (
        <p className="small">
          <span className="badge gold">In {active!.name}’s combo</span> — spell list pre-filtered
          to level {maxLevel} (your level + 4). Slide it back up for the full list.
        </p>
      )}

      <div className="filter-bar">
        {data !== 'missing' && data && data.spells.length > 0 && (
          <button className={tab === 'spells' ? 'active' : ''} onClick={() => setTab('spells')}>
            {isBard ? 'Songs' : 'Spells'} ({data.spells.length})
          </button>
        )}
        {data !== 'missing' && data && (
          <button className={tab === 'skills' ? 'active' : ''} onClick={() => setTab('skills')}>
            Skills ({data.skills.length})
          </button>
        )}
        <button className={tab === 'aas' ? 'active' : ''} onClick={() => setTab('aas')}>
          AAs
        </button>
      </div>

      {!data && <p className="muted">Loading class data…</p>}
      {data === 'missing' && <p className="muted">No harvested data for this class yet.</p>}

      {data && data !== 'missing' && tab === 'spells' && (
        <section>
          <div className="filter-bar" style={{ marginTop: '0.6rem' }}>
            <input
              type="search"
              placeholder={`Search ${isBard ? 'songs' : 'spells'}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label className="small muted">
              up to level{' '}
              <input
                type="number"
                min={1}
                max={50}
                value={maxLevel}
                onChange={(e) => setMaxLevel(Number(e.target.value) || 50)}
                style={{ width: '4rem' }}
              />
            </label>
            <span className="small muted">{spells.length} shown</span>
            {mine && (
              <span className="small muted">
                ·{' '}
                <strong style={{ color: 'var(--gold)' }}>
                  {data.spells.filter((s) => spellOwned(s, charLevel, ownedSpells)).length}
                </strong>{' '}
                / {data.spells.length} owned
              </span>
            )}
          </div>
          <p className="small muted">
            <span className="badge gold">Auto-granted</span> spells scribe themselves as you
            level; <span className="badge">Vendor</span> scrolls are bought at guild spell
            vendors; <span className="badge warn">Drop</span> and{' '}
            <span className="badge blue">Quest/Research</span> scrolls you hunt down.{' '}
            A <span className="badge blue">Ritual</span> tag marks portal-type spells that become
            castable from the Actions window even when this class is off your loadout (see the{' '}
            <Link to="/travel">Travel Guide</Link>).
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="data">
              <thead>
                <tr>
                  {mine && <th title="Owned">✓</th>}
                  <th></th>
                  <th>Lv</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Mana</th>
                  <th>Cast</th>
                  <th>Effect</th>
                  <th>Duration</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {spells.map((s, i) => {
                  const key = ownKey(s.name);
                  const auto = isAutoGranted(s);
                  const have = spellOwned(s, charLevel, ownedSpells);
                  return (
                  <tr key={`${s.name}-${i}`} style={have ? { opacity: 0.5 } : undefined}>
                    {mine && (
                      <td>
                        <input
                          type="checkbox"
                          checked={have}
                          disabled={auto}
                          onChange={() => !auto && toggleOwned('spell', key)}
                          title={auto ? `Auto-granted at level ${s.level}` : undefined}
                          aria-label={`Owned: ${s.name}`}
                        />
                      </td>
                    )}
                    <td><SpellIcon index={s.icon} title={s.name} size={28} /></td>
                    <td>{s.level}</td>
                    <td style={{ color: 'var(--gold)' }} title={s.school}>
                      {s.name}
                      {RITUAL_SPELL_NAMES.has(s.name.toLowerCase()) && (
                        <span
                          className="badge blue"
                          style={{ marginLeft: '0.4rem' }}
                          title="Portal-type spell — becomes a castable Ritual (Actions window) even when this class is not in your active loadout"
                        >
                          Ritual
                        </span>
                      )}
                    </td>
                    <td>
                      {s.kind}
                      {s.resist ? <span className="muted"> · {RESIST_LABELS[s.resist]}</span> : ''}
                    </td>
                    <td>{s.mana}</td>
                    <td
                      className="small"
                      title={s.recastMs ? `Recast ${castLabel(s.recastMs)}` : undefined}
                    >
                      {castLabel(s.castMs)}
                      {s.recastMs ? <span className="muted"> ⟳</span> : ''}
                    </td>
                    <td className="small" title={s.maxEffect}>
                      {s.description || s.maxEffect}
                    </td>
                    <td className="small">{s.duration}</td>
                    <td>
                      <span className={`badge ${sourceBadgeClass(s)}`} title={s.source}>
                        {SPELL_SOURCE_LABELS[spellSource(s)]}
                      </span>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data && data !== 'missing' && tab === 'skills' && (
        <section>
          <p className="small muted" style={{ marginTop: '0.6rem' }}>
            <span className="badge gold">Auto</span> skills appear on their own at the listed
            level; <span className="badge">Trained</span> skills must be bought from your guild
            trainer (bring practice points and coin). Caps shown through 50 / beyond 50.
          </p>
          {data.skills.length === 0 && (
            <p className="muted small">The wiki has no skill table for this class yet — re-run{' '}
              <code>node scripts/import-classdata.mjs</code> as it fills in.</p>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table className="data">
              <thead>
                <tr>
                  <th>Lv</th>
                  <th>Skill</th>
                  <th>How you get it</th>
                  <th>Cap ≤50</th>
                  <th>Cap 50+</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {data.skills.map((s, i) => (
                  <tr key={`${s.name}-${i}`}>
                    <td>{s.level}</td>
                    <td style={{ color: 'var(--gold)' }}>{s.name}</td>
                    <td>
                      <span className={`badge ${s.trained ? '' : 'gold'}`}>
                        {s.trained ? 'Trained' : 'Auto'}
                      </span>
                    </td>
                    <td>{s.cap50}</td>
                    <td>{s.capPost}</td>
                    <td className="small muted">{s.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data && data !== 'missing' && tab === 'aas' && (
        <section>
          <h3 style={{ color: 'var(--gold-dim)' }}>{cls.name} class AAs</h3>
          <AaTable rows={data.aas} {...aaTrack} />
          {shared ? (
            <>
              <h3 style={{ color: 'var(--gold-dim)' }}>Archetype AAs</h3>
              <p className="small muted">
                Shared across related classes — the in-game Archetype tab shows the subset your
                combo qualifies for.
              </p>
              <AaTable rows={shared.archetype} {...aaTrack} />
              <h3 style={{ color: 'var(--gold-dim)' }}>General AAs (all classes)</h3>
              <AaTable rows={shared.general} {...aaTrack} />
              <h3 style={{ color: 'var(--gold-dim)' }}>Special AAs</h3>
              <AaTable rows={shared.special} {...aaTrack} />
            </>
          ) : (
            <p className="muted small">Loading shared AAs…</p>
          )}
        </section>
      )}

      <p className="small muted" style={{ marginTop: '1rem' }}>
        Data harvested from the{' '}
        <a href="https://eqlwiki.com/" target="_blank" rel="noreferrer">
          EQL Wiki
        </a>{' '}
        ({cls.name} page + Alternate Advancement) — beta values, refresh with{' '}
        <code>node scripts/import-classdata.mjs</code>.
      </p>
    </div>
  );
}
