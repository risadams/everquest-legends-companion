import { NavLink, Outlet } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { RACE_BY_ID } from '../data/races';
import { DATA_VERSION, DISCLAIMER, SOURCES } from '../data/meta';

export default function Layout() {
  const { characters, active, setActiveId } = useCharacters();
  return (
    <div className="app-shell">
      <header className="site-header">
        <span className="brand">⚔ EQL Companion</span>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/atlas">Atlas</NavLink>
          <NavLink to="/classes">Races &amp; Classes</NavLink>
          <NavLink to="/bestiary">Bestiary</NavLink>
          <NavLink to="/quests">Quests</NavLink>
          <NavLink to="/progression">Progression</NavLink>
          <NavLink to="/character">My Character</NavLink>
        </nav>
        <span className="header-spacer" />
        {characters.length > 0 && (
          <select
            aria-label="Active character"
            value={active?.id ?? ''}
            onChange={(e) => setActiveId(e.target.value || null)}
          >
            <option value="">— no character —</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {RACE_BY_ID[c.raceId]?.name ?? '?'} · L{c.level}
              </option>
            ))}
          </select>
        )}
      </header>
      <Outlet />
      <footer className="site-footer">
        <p>{DISCLAIMER}</p>
        <p>
          Data version: {DATA_VERSION} ·{' '}
          {SOURCES.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </footer>
    </div>
  );
}
