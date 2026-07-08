import { describe, it, expect } from 'vitest';
import { ABILITIES, STANCES, INVOCATIONS, CASTER_GROUPS } from '../data/abilities';
import { TRAVEL_SPELLS } from '../data/travel';
import { FACTIONS, FACTION_BY_ID } from '../data/factions';
import { RACES } from '../data/races';
import { ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { abilityUnlocked, scalingCount, scalingNote } from './abilities';
import { castability, portsByDestination, unlockLevel } from './travel';

describe('stance & invocation data integrity', () => {
  it('has the full wiki set: 9 stances and 9 invocations', () => {
    expect(STANCES.length).toBe(9);
    expect(INVOCATIONS.length).toBe(9);
  });

  it('every ability references real classes and has no duplicate ids', () => {
    const ids = new Set<string>();
    for (const a of ABILITIES) {
      expect(ids.has(a.id), `duplicate ability id ${a.id}`).toBe(false);
      ids.add(a.id);
      expect(a.forClasses.length).toBeGreaterThan(0);
      for (const c of a.forClasses) {
        expect(CLASS_BY_ID[c], `${a.id} class ${c}`).toBeDefined();
      }
    }
  });

  it('caster scaling groups reference real classes', () => {
    for (const group of Object.values(CASTER_GROUPS)) {
      for (const c of group) {
        expect(CLASS_BY_ID[c], `group class ${c}`).toBeDefined();
      }
    }
  });

  it('every class has at least one stance or invocation', () => {
    for (const id of Object.keys(CLASS_BY_ID)) {
      expect(
        ABILITIES.some((a) => a.forClasses.includes(id)),
        `no abilities for ${id}`
      ).toBe(true);
    }
  });
});

describe('ability combo logic', () => {
  it('a pure caster trio never unlocks melee-only stances', () => {
    const combo = ['wizard', 'magician', 'enchanter'];
    expect(abilityUnlocked(STANCES.find((s) => s.id === 'stance-defensive')!, combo)).toBe(false);
    expect(abilityUnlocked(STANCES.find((s) => s.id === 'stance-channeler')!, combo)).toBe(true);
  });

  it('arcane mastery scales with additional INT classes', () => {
    const arcane = INVOCATIONS.find((i) => i.id === 'inv-arcane-mastery')!;
    const scaling = arcane.scaling![0];
    expect(scalingCount(scaling, ['wizard'])).toBe(0);
    expect(scalingCount(scaling, ['wizard', 'necromancer', 'enchanter'])).toBe(2);
    expect(scalingNote(scaling, ['wizard', 'necromancer', 'enchanter'])).toContain('40%');
  });

  it('over channel counts every non-hybrid caster', () => {
    const oc = INVOCATIONS.find((i) => i.id === 'inv-over-channel')!;
    const scaling = oc.scaling![0];
    expect(scalingCount(scaling, ['paladin', 'warrior', 'bard'])).toBe(0);
    expect(scalingCount(scaling, ['wizard', 'cleric', 'monk'])).toBe(2);
    expect(scalingNote(scaling, ['wizard', 'cleric', 'monk'])).toContain('-180');
  });

  it('divine renders the prose template', () => {
    const divine = INVOCATIONS.find((i) => i.id === 'inv-divine')!;
    expect(scalingNote(divine.scaling![0], ['cleric', 'druid', 'warrior'])).toContain(
      '1 extra time(s)'
    );
  });
});

describe('travel data integrity', () => {
  it('every port references a real zone and real classes', () => {
    const ids = new Set<string>();
    for (const s of TRAVEL_SPELLS) {
      expect(ids.has(s.id), `duplicate travel id ${s.id}`).toBe(false);
      ids.add(s.id);
      if (s.destZoneId) {
        expect(ZONE_BY_ID[s.destZoneId], `${s.id} zone ${s.destZoneId}`).toBeDefined();
      }
      expect(s.classes.length).toBeGreaterThan(0);
      for (const cl of s.classes) {
        expect(CLASS_BY_ID[cl.classId], `${s.id} class ${cl.classId}`).toBeDefined();
        expect(cl.level).toBeGreaterThan(0);
        expect(cl.level).toBeLessThanOrEqual(50);
      }
    }
  });

  it('the network covers druid and wizard destinations', () => {
    const dests = portsByDestination();
    expect(dests.size).toBeGreaterThanOrEqual(15);
    expect(dests.has('greater-faydark')).toBe(true);
    expect(dests.has('plane-of-hate')).toBe(true);
  });
});

describe('faction data integrity', () => {
  it('every faction references real zones and rivals, with no duplicate ids', () => {
    const ids = new Set<string>();
    for (const f of FACTIONS) {
      expect(ids.has(f.id), `duplicate faction id ${f.id}`).toBe(false);
      ids.add(f.id);
      expect(f.homeZoneIds.length).toBeGreaterThan(0);
      for (const z of f.homeZoneIds) {
        expect(ZONE_BY_ID[z], `${f.id} zone ${z}`).toBeDefined();
      }
      for (const r of f.rivals ?? []) {
        expect(FACTION_BY_ID[r], `${f.id} rival ${r}`).toBeDefined();
      }
      expect(f.raise.length).toBeGreaterThan(0);
    }
  });

  it('rivalries are mutual', () => {
    for (const f of FACTIONS) {
      for (const r of f.rivals ?? []) {
        expect(
          FACTION_BY_ID[r].rivals?.includes(f.id),
          `${r} should list ${f.id} back`
        ).toBe(true);
      }
    }
  });

  it('most playable races have a home-turf faction', () => {
    const covered = RACES.filter((race) =>
      FACTIONS.some((f) => f.homeZoneIds.includes(race.startingZoneId))
    );
    expect(covered.length).toBeGreaterThanOrEqual(11);
  });
});

describe('travel castability', () => {
  const gfayPortal = TRAVEL_SPELLS.find((s) => s.id === 'wport-greater-faydark')!;

  it('classifies now / later / ritual correctly', () => {
    expect(castability(gfayPortal, ['wizard', 'cleric', 'warrior'], 30)).toBe('now');
    expect(castability(gfayPortal, ['wizard', 'cleric', 'warrior'], 20)).toBe('later');
    expect(castability(gfayPortal, ['druid', 'cleric', 'warrior'], 50)).toBe('ritual');
  });

  it('unlockLevel picks the cheapest combo class', () => {
    const gate = TRAVEL_SPELLS.find((s) => s.id === 'gate')!;
    expect(unlockLevel(gate, ['wizard', 'cleric'])).toBe(4);
    expect(unlockLevel(gate, ['cleric'])).toBe(5);
    expect(unlockLevel(gate, ['warrior'])).toBe(Infinity);
  });
});
