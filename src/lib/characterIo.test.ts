import { describe, it, expect } from 'vitest';
import {
  serializeCharacters,
  parseCharacterImport,
  exportFilename
} from './characterIo';
import type { CharacterProfile } from '../data/types';

const vex: CharacterProfile = {
  id: 'char-1',
  name: 'Vex',
  raceId: 'dark-elf',
  classIds: ['necromancer', 'rogue'],
  level: 24,
  aaPoints: 3,
  ownedSpells: ['lifetap'],
  ownedAas: ['Origin']
};

const brom: CharacterProfile = {
  id: 'char-2',
  name: 'Brom',
  raceId: 'barbarian',
  classIds: ['warrior'],
  level: 50,
  aaPoints: 0
};

describe('serializeCharacters / parseCharacterImport round trip', () => {
  it('round-trips a full export unchanged', () => {
    const { characters, warnings } = parseCharacterImport(serializeCharacters([vex, brom]));
    expect(warnings).toEqual([]);
    expect(characters).toHaveLength(2);
    expect(characters[0]).toMatchObject(vex);
    expect(characters[1]).toMatchObject({ id: 'char-2', name: 'Brom', level: 50 });
  });

  it('writes a recognizable envelope', () => {
    const parsed = JSON.parse(serializeCharacters([vex]));
    expect(parsed.app).toBe('eql-companion');
    expect(parsed.kind).toBe('characters');
    expect(parsed.version).toBe(1);
    expect(parsed.characters).toHaveLength(1);
  });
});

describe('parseCharacterImport input shapes', () => {
  it('accepts a bare array of characters', () => {
    const { characters } = parseCharacterImport(JSON.stringify([vex, brom]));
    expect(characters).toHaveLength(2);
  });

  it('accepts a single bare character object', () => {
    const { characters } = parseCharacterImport(JSON.stringify(vex));
    expect(characters).toHaveLength(1);
    expect(characters[0].name).toBe('Vex');
  });

  it('rejects non-JSON text', () => {
    expect(() => parseCharacterImport('not json')).toThrow(/valid JSON/);
  });

  it('rejects an empty character list', () => {
    expect(() => parseCharacterImport('[]')).toThrow(/any characters/);
  });

  it('rejects an envelope of a different kind', () => {
    const other = JSON.stringify({ app: 'eql-companion', kind: 'settings', characters: [vex] });
    expect(() => parseCharacterImport(other)).toThrow(/not a character export/);
  });
});

describe('parseCharacterImport validation and repair', () => {
  it('rejects unknown races and classes but keeps good entries, with warnings', () => {
    const bad = { ...vex, id: 'x', name: 'Zzz', raceId: 'vulcan' };
    const { characters, warnings } = parseCharacterImport(JSON.stringify([vex, bad]));
    expect(characters).toHaveLength(1);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/vulcan/);
  });

  it('rejects an illegal primary class for the race', () => {
    const bad = { ...vex, raceId: 'halfling', classIds: ['necromancer'] };
    expect(() => parseCharacterImport(JSON.stringify(bad))).toThrow(/not a legal primary/);
  });

  it('drops unknown secondary classes and dedupes, keeping at most 3', () => {
    const messy = {
      ...vex,
      classIds: ['necromancer', 'jedi', 'rogue', 'rogue', 'wizard', 'enchanter']
    };
    const { characters } = parseCharacterImport(JSON.stringify(messy));
    expect(characters[0].classIds).toEqual(['necromancer', 'rogue', 'wizard']);
  });

  it('clamps level and aaPoints into range', () => {
    const wild = { ...vex, level: 999, aaPoints: -5 };
    const { characters } = parseCharacterImport(JSON.stringify(wild));
    expect(characters[0].level).toBe(50);
    expect(characters[0].aaPoints).toBe(0);
  });

  it('defaults a missing level to 1', () => {
    const { level, ...noLevel } = vex;
    const { characters } = parseCharacterImport(JSON.stringify(noLevel));
    expect(characters[0].level).toBe(1);
  });

  it('generates an id when the entry has none', () => {
    const { id, ...noId } = vex;
    const { characters } = parseCharacterImport(JSON.stringify(noId));
    expect(characters[0].id).toMatch(/^char-/);
  });

  it('drops non-string entries from owned lists', () => {
    const messy = { ...vex, ownedSpells: ['lifetap', 7, null], ownedAas: 'nope' };
    const { characters } = parseCharacterImport(JSON.stringify(messy));
    expect(characters[0].ownedSpells).toEqual(['lifetap']);
    expect(characters[0].ownedAas).toBeUndefined();
  });

  it('requires a name', () => {
    expect(() => parseCharacterImport(JSON.stringify({ ...vex, name: '  ' }))).toThrow(
      /character name/
    );
  });
});

describe('exportFilename', () => {
  it('slugifies a single character name', () => {
    expect(exportFilename([vex])).toBe('vex.eql-character.json');
    expect(exportFilename([{ ...vex, name: "K'Tarr the Bold" }])).toBe(
      'k-tarr-the-bold.eql-character.json'
    );
  });

  it('uses a dated name for multi-character exports', () => {
    expect(exportFilename([vex, brom])).toMatch(/^eql-characters-\d{4}-\d{2}-\d{2}\.json$/);
  });
});
