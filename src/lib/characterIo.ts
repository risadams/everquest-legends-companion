import type { CharacterProfile } from '../data/types';
import { RACE_BY_ID } from '../data/races';
import { CLASS_BY_ID } from '../data/classes';
import { DEITY_BY_ID } from '../data/lore';
import { TRADESKILL_BY_ID } from '../data/tradeskills';
import { SLOT_LABELS } from '../data/gear';
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

/** keep integer-valued entries within [1, max], validated by an optional key check */
function asIntRecord(
  v: unknown,
  max: number,
  keyOk: (k: string) => boolean = () => true
): Record<string, number> | undefined {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return undefined;
  const out: Record<string, number> = {};
  for (const [k, raw] of Object.entries(v as Record<string, unknown>)) {
    const n = Math.floor(Number(raw));
    if (keyOk(k) && Number.isFinite(n) && n >= 1 && n <= max) out[k] = n;
  }
  return Object.keys(out).length > 0 ? out : undefined;
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
  const backstory =
    typeof r.backstory === 'string' && r.backstory.trim() ? r.backstory.trim() : undefined;

  const ownedAas = asStringArray(r.ownedAas);
  // aaRanks is authoritative; older exports carry only the ownedAas checklist
  const aaRanks =
    asIntRecord(r.aaRanks, 99) ??
    (ownedAas ? Object.fromEntries(ownedAas.map((k) => [k, 1])) : undefined);
  const deityId =
    typeof r.deityId === 'string' && DEITY_BY_ID[r.deityId] ? r.deityId : undefined;
  const tradeskills = asIntRecord(r.tradeskills, 300, (k) => !!TRADESKILL_BY_ID[k]);

  let equipment: CharacterProfile['equipment'];
  if (typeof r.equipment === 'object' && r.equipment !== null && !Array.isArray(r.equipment)) {
    const worn: Record<string, string> = {};
    for (const [slot, item] of Object.entries(r.equipment as Record<string, unknown>)) {
      if (slot in SLOT_LABELS && typeof item === 'string' && item.trim()) {
        worn[slot] = item.trim().slice(0, 80);
      }
    }
    if (Object.keys(worn).length > 0) equipment = worn as CharacterProfile['equipment'];
  }

  return {
    ok: {
      id: typeof r.id === 'string' && r.id ? r.id : newCharacterId(),
      name,
      raceId,
      classIds,
      level,
      aaPoints,
      ownedSpells: asStringArray(r.ownedSpells),
      ownedAas: aaRanks ? Object.keys(aaRanks) : undefined,
      aaRanks,
      deityId,
      tradeskills,
      equipment,
      backstory
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

/**
 * Compact URL-safe encoding of a character's BUILD (name, race, classes,
 * level, AA bank, deity) for share links. Checklists, tradeskill progress,
 * and backstory are deliberately excluded to keep URLs short.
 */
export function encodeShare(c: CharacterProfile): string {
  const build = {
    n: c.name,
    r: c.raceId,
    c: c.classIds,
    l: c.level,
    a: c.aaPoints ?? 0,
    ...(c.deityId ? { d: c.deityId } : {})
  };
  const json = JSON.stringify(build);
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode a share token back into an importable character (fresh id).
 * Throws with a user-facing message when the token is unusable.
 */
export function decodeShare(token: string): CharacterProfile {
  let json: string;
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
    json = new TextDecoder().decode(bytes);
  } catch {
    throw new Error('That share link is damaged or truncated.');
  }
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error('That share link is damaged or truncated.');
  }
  const b = raw as Record<string, unknown>;
  const { characters } = parseCharacterImport(
    JSON.stringify({
      name: b.n,
      raceId: b.r,
      classIds: b.c,
      level: b.l,
      aaPoints: b.a,
      deityId: b.d
    })
  );
  return { ...characters[0], id: newCharacterId() };
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
