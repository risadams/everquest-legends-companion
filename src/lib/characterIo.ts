import type { CharacterProfile } from '../data/types';
import { RACE_BY_ID } from '../data/races';
import { CLASS_BY_ID } from '../data/classes';
import { newCharacterId } from './storage';

/** Envelope written by "Export" so imports can be recognized and versioned. */
export interface CharacterExportFile {
  app: 'eql-companion';
  kind: 'characters';
  version: 1;
  exportedAt: string;
  characters: CharacterProfile[];
}

export interface ImportResult {
  characters: CharacterProfile[];
  /** per-entry problems that were skipped or repaired (empty on a clean import) */
  warnings: string[];
}

export function serializeCharacters(chars: CharacterProfile[]): string {
  const file: CharacterExportFile = {
    app: 'eql-companion',
    kind: 'characters',
    version: 1,
    exportedAt: new Date().toISOString(),
    characters: chars
  };
  return JSON.stringify(file, null, 2);
}

export function exportFilename(chars: CharacterProfile[]): string {
  if (chars.length === 1) {
    const slug = chars[0].name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${slug || 'character'}.eql-character.json`;
  }
  return `eql-characters-${new Date().toISOString().slice(0, 10)}.json`;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const strings = v.filter((x): x is string => typeof x === 'string');
  return strings.length > 0 ? strings : undefined;
}

/**
 * Validate one raw entry into a CharacterProfile, or explain why it can't be.
 * Repairs what it safely can (clamps level/AA, drops unknown extra classes);
 * rejects what it can't (bad name/race/primary class).
 */
function parseOne(raw: unknown, index: number): { ok: CharacterProfile } | { err: string } {
  const label = `Entry ${index + 1}`;
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { err: `${label}: not a character object.` };
  }
  const r = raw as Record<string, unknown>;

  const name = typeof r.name === 'string' ? r.name.trim() : '';
  if (!name) return { err: `${label}: missing a character name.` };

  const raceId = typeof r.raceId === 'string' ? r.raceId : '';
  const race = RACE_BY_ID[raceId];
  if (!race) return { err: `${label} (${name}): unknown race "${raceId || '?'}".` };

  const rawClassIds = Array.isArray(r.classIds)
    ? r.classIds.filter((c): c is string => typeof c === 'string')
    : [];
  const classIds = [...new Set(rawClassIds)].filter((c) => CLASS_BY_ID[c]).slice(0, 3);
  if (classIds.length === 0) {
    return { err: `${label} (${name}): no valid classes.` };
  }
  if (!race.allowedPrimaryClasses.includes(classIds[0])) {
    return {
      err: `${label} (${name}): ${CLASS_BY_ID[classIds[0]].name} is not a legal primary class for ${race.name}.`
    };
  }

  const level = Math.max(1, Math.min(50, Math.floor(Number(r.level)) || 1));
  const aaPoints = Math.max(0, Math.min(999, Math.floor(Number(r.aaPoints)) || 0));

  return {
    ok: {
      id: typeof r.id === 'string' && r.id ? r.id : newCharacterId(),
      name,
      raceId,
      classIds,
      level,
      aaPoints,
      ownedSpells: asStringArray(r.ownedSpells),
      ownedAas: asStringArray(r.ownedAas)
    }
  };
}

/**
 * Parse exported JSON back into character profiles. Accepts the export
 * envelope, a bare array of characters, or a single bare character object.
 * Throws with a user-facing message when the text isn't usable at all.
 */
export function parseCharacterImport(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('That file isn’t valid JSON.');
  }

  let entries: unknown[];
  if (Array.isArray(data)) {
    entries = data;
  } else if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.characters)) {
      if (obj.kind !== undefined && obj.kind !== 'characters') {
        throw new Error('That file is an eql-companion export, but not a character export.');
      }
      entries = obj.characters;
    } else {
      entries = [data]; // single bare character
    }
  } else {
    throw new Error('That file doesn’t contain any characters.');
  }

  if (entries.length === 0) throw new Error('That file doesn’t contain any characters.');

  const characters: CharacterProfile[] = [];
  const warnings: string[] = [];
  entries.forEach((raw, i) => {
    const result = parseOne(raw, i);
    if ('ok' in result) characters.push(result.ok);
    else warnings.push(result.err);
  });

  if (characters.length === 0) {
    throw new Error(`No usable characters found. ${warnings.join(' ')}`);
  }
  return { characters, warnings };
}

/** Trigger a browser download of the given characters as a JSON file. */
export function downloadCharacters(chars: CharacterProfile[]): void {
  const blob = new Blob([serializeCharacters(chars)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFilename(chars);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
