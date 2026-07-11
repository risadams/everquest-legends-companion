import { describe, it, expect } from 'vitest';
import { TRADESKILLS, canPractice, tradeskillsFor } from '../data/tradeskills';
import { ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { RACE_BY_ID } from '../data/races';
import type { CharacterProfile } from '../data/types';

describe('tradeskill data integrity', () => {
  it('has unique ids and complete entries', () => {
    const ids = new Set<string>();
    for (const t of TRADESKILLS) {
      expect(ids.has(t.id), `duplicate tradeskill id ${t.id}`).toBe(false);
      ids.add(t.id);
      expect(t.leveling.length, `${t.id} leveling ladder`).toBeGreaterThanOrEqual(2);
      expect(t.notable.length, `${t.id} notable recipes`).toBeGreaterThanOrEqual(1);
      expect(t.tips.length, `${t.id} tips`).toBeGreaterThanOrEqual(1);
      expect(t.summary.length).toBeGreaterThan(50);
      expect(t.container.length).toBeGreaterThan(0);
    }
  });

  it('references only real zones, classes, and races', () => {
    for (const t of TRADESKILLS) {
      for (const s of t.leveling) {
        for (const z of s.zoneIds ?? []) {
          expect(ZONE_BY_ID[z], `${t.id}: zone ${z}`).toBeDefined();
        }
      }
      for (const c of [...(t.requiresClasses ?? []), ...(t.synergyClasses ?? [])]) {
        expect(CLASS_BY_ID[c], `${t.id}: class ${c}`).toBeDefined();
      }
      for (const r of t.requiresRaces ?? []) {
        expect(RACE_BY_ID[r], `${t.id}: race ${r}`).toBeDefined();
      }
    }
  });

  it('lists leveling steps in ascending trivial order', () => {
    for (const t of TRADESKILLS) {
      const trivials = t.leveling.map((s) => s.trivial).filter((x): x is number => x !== undefined);
      for (let i = 1; i < trivials.length; i++) {
        expect(
          trivials[i],
          `${t.id}: step ${i} trivial ${trivials[i]} not above ${trivials[i - 1]}`
        ).toBeGreaterThan(trivials[i - 1]);
      }
    }
  });

  it('covers the nine crafts the Systems Handbook lists, plus the gated three', () => {
    const ids = TRADESKILLS.map((t) => t.id);
    for (const expected of [
      'alchemy', 'baking', 'blacksmithing', 'brewing', 'fletching', 'jewelcrafting',
      'pottery', 'tailoring', 'tinkering', 'fishing', 'poison-making', 'research'
    ]) {
      expect(ids, `missing ${expected}`).toContain(expected);
    }
  });
});

describe('tradeskill personalization', () => {
  const char = (raceId: string, classIds: string[]): CharacterProfile => ({
    id: 'x',
    name: 'X',
    raceId,
    classIds,
    level: 20
  });

  it('gates alchemy on shaman, poison on rogue, tinkering on gnome, research on INT casters', () => {
    const byId = Object.fromEntries(TRADESKILLS.map((t) => [t.id, t]));
    expect(canPractice(byId['alchemy'], char('barbarian', ['shaman']))).toBe(true);
    expect(canPractice(byId['alchemy'], char('barbarian', ['warrior']))).toBe(false);
    expect(canPractice(byId['poison-making'], char('human', ['rogue', 'bard']))).toBe(true);
    expect(canPractice(byId['poison-making'], char('human', ['bard']))).toBe(false);
    expect(canPractice(byId['tinkering'], char('gnome', ['wizard']))).toBe(true);
    expect(canPractice(byId['tinkering'], char('human', ['wizard']))).toBe(false);
    expect(canPractice(byId['research'], char('gnome', ['wizard']))).toBe(true);
    expect(canPractice(byId['research'], char('gnome', ['warrior', 'cleric']))).toBe(false);
  });

  it('ranks gated crafts first for a shaman/rogue, and locks tinkering for non-gnomes', () => {
    const { available, locked } = tradeskillsFor(char('barbarian', ['shaman', 'rogue']));
    const gated = available.filter((f) => f.fit === 'gated').map((f) => f.tradeskill.id);
    expect(gated).toContain('alchemy');
    expect(gated).toContain('poison-making');
    expect(available[0].fit).toBe('gated');
    expect(locked.map((t) => t.id)).toContain('tinkering');
    expect(locked.map((t) => t.id)).toContain('research');
  });

  it('marks synergy crafts for an enchanter', () => {
    const { available } = tradeskillsFor(char('gnome', ['enchanter']));
    const jc = available.find((f) => f.tradeskill.id === 'jewelcrafting');
    expect(jc?.fit).toBe('synergy');
    const gated = available.filter((f) => f.fit === 'gated').map((f) => f.tradeskill.id);
    expect(gated).toContain('tinkering');
    expect(gated).toContain('research');
  });
});
