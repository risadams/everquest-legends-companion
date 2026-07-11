import { describe, it, expect } from 'vitest';
import {
  serializeCharacters,
  parseCharacterImport,
  exportFilename,
  encodeShare,
  decodeShare
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

  it('round-trips a backstory of any length', () => {
    const storied = { ...vex, backstory: '  Born in the alleys of Neriak.\n\nSwore revenge.  ' };
    const { characters } = parseCharacterImport(serializeCharacters([storied]));
    expect(characters[0].backstory).toBe('Born in the alleys of Neriak.\n\nSwore revenge.');

    const epic = { ...vex, backstory: 'x'.repeat(120_000) };
    const { characters: novel } = parseCharacterImport(JSON.stringify(epic));
    expect(novel[0].backstory).toHaveLength(120_000);

    const blank = { ...vex, backstory: '   ' };
    const { characters: none } = parseCharacterImport(JSON.stringify(blank));
    expect(none[0].backstory).toBeUndefined();
  });

  it('drops non-string entries from owned lists', () => {
    const messy = { ...vex, ownedSpells: ['lifetap', 7, null], ownedAas: 'nope' };
    const { characters } = parseCharacterImport(JSON.stringify(messy));
    expect(characters[0].ownedSpells).toEqual(['lifetap']);
    expect(characters[0].ownedAas).toBeUndefined();
  });

  it('round-trips aaRanks and keeps ownedAas in sync', () => {
    const ranked = { ...vex, aaRanks: { origin: 1, 'combat fury': 3 }, ownedAas: undefined };
    const { characters } = parseCharacterImport(JSON.stringify(ranked));
    expect(characters[0].aaRanks).toEqual({ origin: 1, 'combat fury': 3 });
    expect(characters[0].ownedAas?.sort()).toEqual(['combat fury', 'origin']);
  });

  it('migrates legacy ownedAas-only exports to rank 1', () => {
    const legacy = { ...vex, ownedAas: ['origin', 'first aid'], aaRanks: undefined };
    const { characters } = parseCharacterImport(JSON.stringify(legacy));
    expect(characters[0].aaRanks).toEqual({ origin: 1, 'first aid': 1 });
  });

  it('drops invalid aaRank values and clamps to sane integers', () => {
    const messy = { ...vex, aaRanks: { a: 2.9, b: 0, c: -3, d: 'five', e: 500 } };
    const { characters } = parseCharacterImport(JSON.stringify(messy));
    expect(characters[0].aaRanks).toEqual({ a: 2 });
  });

  it('keeps a valid deity and drops an unknown one', () => {
    const pious = { ...vex, deityId: 'innoruuk' };
    expect(parseCharacterImport(JSON.stringify(pious)).characters[0].deityId).toBe('innoruuk');
    const heretic = { ...vex, deityId: 'cthulhu' };
    expect(parseCharacterImport(JSON.stringify(heretic)).characters[0].deityId).toBeUndefined();
  });

  it('keeps equipment on real slots only, names capped at 80 chars', () => {
    const geared = {
      ...vex,
      equipment: {
        weapon: 'Ghoulbane',
        chest: '  Fine Plate Breastplate ',
        tail: 'Not a slot',
        head: 'x'.repeat(200),
        feet: ''
      }
    };
    const { characters } = parseCharacterImport(JSON.stringify(geared));
    expect(characters[0].equipment).toEqual({
      weapon: 'Ghoulbane',
      chest: 'Fine Plate Breastplate',
      head: 'x'.repeat(80)
    });
  });

  it('keeps tradeskill progress for real crafts only, clamped to 300', () => {
    const crafty = { ...vex, tradeskills: { baking: 76, basketweaving: 50, tailoring: 900 } };
    const { characters } = parseCharacterImport(JSON.stringify(crafty));
    expect(characters[0].tradeskills).toEqual({ baking: 76 });
  });

  it('requires a name', () => {
    expect(() => parseCharacterImport(JSON.stringify({ ...vex, name: '  ' }))).toThrow(
      /character name/
    );
  });
});

describe('share links', () => {
  it('round-trips a build through encode/decode with a fresh id', () => {
    const withDeity = { ...vex, deityId: 'innoruuk', backstory: 'secret diary'.repeat(100) };
    const token = encodeShare(withDeity);
    expect(token).not.toMatch(/[+/=]/); // URL-safe
    const decoded = decodeShare(token);
    expect(decoded.name).toBe('Vex');
    expect(decoded.raceId).toBe('dark-elf');
    expect(decoded.classIds).toEqual(['necromancer', 'rogue']);
    expect(decoded.level).toBe(24);
    expect(decoded.aaPoints).toBe(3);
    expect(decoded.deityId).toBe('innoruuk');
    expect(decoded.id).not.toBe(vex.id);
    // private/bulky fields never travel in a link
    expect(decoded.backstory).toBeUndefined();
    expect(token.length).toBeLessThan(200);
  });

  it('handles unicode names', () => {
    const decoded = decodeShare(encodeShare({ ...vex, name: 'Ægir Ödmjúk' }));
    expect(decoded.name).toBe('Ægir Ödmjúk');
  });

  it('rejects garbage tokens with a friendly error', () => {
    expect(() => decodeShare('not-a-real-token!!!')).toThrow(/share link/);
    expect(() => decodeShare('')).toThrow();
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
