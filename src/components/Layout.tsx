import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { RACE_BY_ID } from '../data/races';
import { DATA_VERSION, DISCLAIMER, SOURCES } from '../data/meta';
import BrandMark from './BrandMark';

interface NavItem {
  to: string;
  label: string;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    label: 'World',
    items: [
      { to: '/travel', label: 'Travel Guide' },
      { to: '/bestiary', label: 'Bestiary' },
      { to: '/gear', label: 'Notable Gear' },
      { to: '/quests', label: 'Quest Guide' },
      { to: '/factions', label: 'Factions' }
    ]
  },
  {
    label: 'Classes',
    items: [
      { to: '/classes', label: 'Races & Classes' },
      { to: '/spells', label: 'Spells & Skills' },
      { to: '/abilities', label: 'Stances & Invocations' },
      { to: '/macros', label: 'Macro Guide' }
    ]
  },
  {
    label: 'Guides',
    items: [
      { to: '/progression', label: 'Progression' },
      { to: '/tradeskills', label: 'Tradeskills' },
      { to: '/handbook', label: 'Systems Handbook' },
      { to: '/lore', label: 'Lore & History' }
    ]
  }
];

function NavGroupMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);

  const active = group.items.some(
    (i) => location.pathname === i.to || location.pathname.startsWith(`${i.to}/`)
  );

  return (
    <div className="nav-group" onMouseLeave={() => setOpen(false)}>
      <button
        className={active ? 'active' : ''}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
      >
        {group.label} <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="nav-menu" role="menu">
          {group.items.map((i) => (
            <NavLink key={i.to} to={i.to} role="menuitem">
              {i.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { characters, active, setActiveId } = useCharacters();
  const location = useLocation();
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          <BrandMark /> EQL Companion
        </Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/atlas">Atlas</NavLink>
          {GROUPS.map((g) => (
            <NavGroupMenu key={g.label} group={g} />
          ))}
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
      <main className="page" key={location.pathname}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <BrandMark size={22} />
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
