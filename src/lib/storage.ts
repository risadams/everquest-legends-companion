import type { CharacterProfile } from '../data/types';

const CHARS_KEY = 'eql-companion.characters';
const ACTIVE_KEY = 'eql-companion.activeCharacter';

export function loadCharacters(): CharacterProfile[] {
  try {
    const raw = localStorage.getItem(CHARS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCharacters(chars: CharacterProfile[]): void {
  localStorage.setItem(CHARS_KEY, JSON.stringify(chars));
}

export function loadActiveCharacterId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveCharacterId(id: string | null): void {
  if (id === null) localStorage.removeItem(ACTIVE_KEY);
  else localStorage.setItem(ACTIVE_KEY, id);
}

export function newCharacterId(): string {
  return `char-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
