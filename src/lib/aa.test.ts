import { describe, it, expect } from 'vitest';
import { parseFirstCost, parseMinLevel, suggestAAs } from './aa';
import type { AaRow, SharedAa } from './classdata';
import type { CharacterProfile } from '../data/types';

const row = (name: string, cost: string, description: string, ranks = '1'): AaRow => ({
  name,
  ranks,
  cost,
  description
});

const shared: SharedAa = {
  general: [
    row('Origin', '0', 'Teleports you home. Requirements: level 1.'),
    row('Combat Fury', '1/?/4/6', 'Melee crit chance. Requirements: level 1.', '4'),
    row('Quick Buff', '5', 'Casts all buffs. Requirements: level 1.')
  ],
  archetype: [
    row('Critical Affliction', '3/6/9', 'DoT crit chance. Requirements: level 1.', '3'),
    row('Burst of Power', '3/6/?', 'Flurry chance. Requirements: level 46.', '3')
  ],
  special: []
};

const warriorAas = [
  row('Area Taunt', '5', 'Taunts everything. Requirements: level 25.'),
  row('Heroic Leap', '0', 'Leap to target. Requirements: level 12.')
];

const char = (over: Partial<CharacterProfile>): CharacterProfile => ({
  id: 'x',
  name: 'X',
  raceId: 'human',
  classIds: ['warrior'],
  level: 20,
  aaPoints: 3,
  ...over
});

describe('AA cost/level parsing', () => {
  it('parses first-rank costs', () => {
    expect(parseFirstCost('2/4/6')).toBe(2);
    expect(parseFirstCost('0')).toBe(0);
    expect(parseFirstCost('?')).toBeNull();
    expect(parseFirstCost('3/?/?')).toBe(3);
  });

  it('parses level requirements from descriptions', () => {
    expect(parseMinLevel('Does things. Requirements: level 25.')).toBe(25);
    expect(parseMinLevel('Requirement: level 4.')).toBe(4);
    expect(parseMinLevel('No gate mentioned here.')).toBeNull();
  });
});

describe('AA suggestions', () => {
  it('free eligible abilities rank first', () => {
    const s = suggestAAs(char({}), [{ className: 'Warrior', aas: warriorAas }], shared, 10);
    expect(s[0].aa.name).toBe('Heroic Leap');
    expect(s[0].affordable).toBe(true);
  });

  it('marks affordability against banked points and level gates', () => {
    const s = suggestAAs(char({}), [{ className: 'Warrior', aas: warriorAas }], shared, 10);
    const areaTaunt = s.find((x) => x.aa.name === 'Area Taunt')!;
    expect(areaTaunt.eligible).toBe(false); // level 25 gate at level 20
    const fury = s.find((x) => x.aa.name === 'Combat Fury')!;
    expect(fury.affordable).toBe(true); // 1 pt vs 3 banked
    const quickBuff = s.find((x) => x.aa.name === 'Quick Buff');
    expect(quickBuff?.affordable ?? false).toBe(false); // 5 pts vs 3 banked
  });

  it('shared picks respect the combo (no DoT lines for a pure warrior)', () => {
    const s = suggestAAs(char({}), [{ className: 'Warrior', aas: [] }], shared, 10);
    expect(s.some((x) => x.aa.name === 'Critical Affliction')).toBe(false);
    const nec = suggestAAs(
      char({ classIds: ['necromancer'] }),
      [{ className: 'Necromancer', aas: [] }],
      shared,
      10
    );
    expect(nec.some((x) => x.aa.name === 'Critical Affliction')).toBe(true);
  });
});
