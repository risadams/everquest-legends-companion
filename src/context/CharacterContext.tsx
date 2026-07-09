import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { CharacterProfile } from '../data/types';
import {
  loadCharacters,
  saveCharacters,
  loadActiveCharacterId,
  saveActiveCharacterId
} from '../lib/storage';

interface CharacterContextValue {
  characters: CharacterProfile[];
  active: CharacterProfile | null;
  setActiveId: (id: string | null) => void;
  upsert: (c: CharacterProfile) => void;
  remove: (id: string) => void;
  /** toggle whether the active character owns a spell/AA (checklist) */
  toggleOwned: (kind: 'spell' | 'aa', key: string) => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characters, setCharacters] = useState<CharacterProfile[]>(() => loadCharacters());
  const [activeId, setActiveIdState] = useState<string | null>(() => loadActiveCharacterId());

  useEffect(() => saveCharacters(characters), [characters]);
  useEffect(() => saveActiveCharacterId(activeId), [activeId]);

  const setActiveId = useCallback((id: string | null) => setActiveIdState(id), []);

  const upsert = useCallback((c: CharacterProfile) => {
    setCharacters((prev) => {
      const i = prev.findIndex((p) => p.id === c.id);
      if (i === -1) return [...prev, c];
      const next = [...prev];
      next[i] = c;
      return next;
    });
    setActiveIdState(c.id);
  }, []);

  const remove = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((p) => p.id !== id));
    setActiveIdState((cur) => (cur === id ? null : cur));
  }, []);

  const toggleOwned = useCallback(
    (kind: 'spell' | 'aa', key: string) => {
      setCharacters((prev) => {
        const i = prev.findIndex((p) => p.id === activeId);
        if (i === -1) return prev;
        const field = kind === 'spell' ? 'ownedSpells' : 'ownedAas';
        const cur = prev[i][field] ?? [];
        const has = cur.includes(key);
        const next = [...prev];
        next[i] = { ...prev[i], [field]: has ? cur.filter((k) => k !== key) : [...cur, key] };
        return next;
      });
    },
    [activeId]
  );

  const active = useMemo(
    () => characters.find((c) => c.id === activeId) ?? null,
    [characters, activeId]
  );

  const value = useMemo(
    () => ({ characters, active, setActiveId, upsert, remove, toggleOwned }),
    [characters, active, setActiveId, upsert, remove, toggleOwned]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacters(): CharacterContextValue {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacters must be used within CharacterProvider');
  return ctx;
}
