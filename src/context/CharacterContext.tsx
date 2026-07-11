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
  /** set purchased ranks for an AA on the active character (0 removes it) */
  setAaRank: (key: string, ranks: number) => void;
  /** record the active character's current skill in a tradeskill (0 removes it) */
  setTradeskill: (tradeskillId: string, skill: number) => void;
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

  /** aaRanks is authoritative; ownedAas mirrors its nonzero keys for older consumers */
  const applyAaRanks = useCallback(
    (c: CharacterProfile, key: string, ranks: number): CharacterProfile => {
      const aaRanks = { ...(c.aaRanks ?? {}) };
      if (ranks > 0) aaRanks[key] = ranks;
      else delete aaRanks[key];
      return { ...c, aaRanks, ownedAas: Object.keys(aaRanks) };
    },
    []
  );

  const toggleOwned = useCallback(
    (kind: 'spell' | 'aa', key: string) => {
      setCharacters((prev) => {
        const i = prev.findIndex((p) => p.id === activeId);
        if (i === -1) return prev;
        const next = [...prev];
        if (kind === 'aa') {
          const has = (prev[i].aaRanks?.[key] ?? 0) > 0;
          next[i] = applyAaRanks(prev[i], key, has ? 0 : 1);
        } else {
          const cur = prev[i].ownedSpells ?? [];
          const has = cur.includes(key);
          next[i] = {
            ...prev[i],
            ownedSpells: has ? cur.filter((k) => k !== key) : [...cur, key]
          };
        }
        return next;
      });
    },
    [activeId, applyAaRanks]
  );

  const setAaRank = useCallback(
    (key: string, ranks: number) => {
      setCharacters((prev) => {
        const i = prev.findIndex((p) => p.id === activeId);
        if (i === -1) return prev;
        const next = [...prev];
        next[i] = applyAaRanks(prev[i], key, Math.max(0, Math.min(99, Math.floor(ranks))));
        return next;
      });
    },
    [activeId, applyAaRanks]
  );

  const setTradeskill = useCallback(
    (tradeskillId: string, skill: number) => {
      setCharacters((prev) => {
        const i = prev.findIndex((p) => p.id === activeId);
        if (i === -1) return prev;
        const clamped = Math.max(0, Math.min(300, Math.floor(skill)));
        const tradeskills = { ...(prev[i].tradeskills ?? {}) };
        if (clamped > 0) tradeskills[tradeskillId] = clamped;
        else delete tradeskills[tradeskillId];
        const next = [...prev];
        next[i] = { ...prev[i], tradeskills };
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
    () => ({ characters, active, setActiveId, upsert, remove, toggleOwned, setAaRank, setTradeskill }),
    [characters, active, setActiveId, upsert, remove, toggleOwned, setAaRank, setTradeskill]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacters(): CharacterContextValue {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacters must be used within CharacterProvider');
  return ctx;
}
