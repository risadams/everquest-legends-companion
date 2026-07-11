import { describe, it, expect } from 'vitest';
import { MONSTERS } from '../data/monsters';
import { QUESTS } from '../data/quests';
import { ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { recommendQuests, huntTargets, monsterFit, questAvailable, deityAdvice } from './advisor';
import type { CharacterProfile } from '../data/types';

describe('monster & quest data integrity', () => {
  it('every monster references a real zone and sane levels', () => {
    const ids = new Set<string>();
    for (const m of MONSTERS) {
      expect(ids.has(m.id), `duplicate monster id ${m.id}`).toBe(false);
      ids.add(m.id);
      expect(ZONE_BY_ID[m.zoneId], `${m.id} zone ${m.zoneId}`).toBeDefined();
      expect(m.lvlMin).toBeLessThanOrEqual(m.lvlMax);
      expect(m.lvlMin).toBeGreaterThan(0);
    }
  });

  it('every quest references real zones and classes', () => {
    for (const q of QUESTS) {
      expect(ZONE_BY_ID[q.startZoneId], `${q.id} zone`).toBeDefined();
      expect(q.levelMin).toBeLessThanOrEqual(q.levelMax);
      expect(q.forAlignments.length).toBeGreaterThan(0);
      for (const c of q.forClasses) {
        expect(CLASS_BY_ID[c], `${q.id} class ${c}`).toBeDefined();
      }
    }
  });

  it('every hunting zone has at least one bestiary entry', () => {
    const covered = new Set(MONSTERS.map((m) => m.zoneId));
    for (const z of Object.values(ZONE_BY_ID)) {
      if (z.type === 'city' || z.excludeFromAdvisor) continue;
      expect(covered.has(z.id), `no monsters for ${z.id}`).toBe(true);
    }
  });
});

describe('quest recommendations', () => {
  const paladin: CharacterProfile = {
    id: 'p',
    name: 'Pal',
    raceId: 'human',
    classIds: ['paladin', 'cleric', 'bard'],
    level: 25
  };
  const troll: CharacterProfile = {
    id: 't',
    name: 'Grukk',
    raceId: 'troll',
    classIds: ['shadow-knight', 'shaman', 'berserker'],
    level: 8
  };

  it('offers SoulFire to a mid-level human paladin', () => {
    const recs = recommendQuests(paladin, 10);
    expect(recs.some((r) => r.quest.id === 'soulfire')).toBe(true);
  });

  it('never offers good-city turn-ins to an evil race', () => {
    const recs = recommendQuests(troll, 20);
    const ids = recs.map((r) => r.quest.id);
    expect(ids).not.toContain('gnoll-fangs');
    expect(ids).not.toContain('crushbone-belts');
    // But the alignment-neutral militia and gypsy turn-ins are fine.
    expect(ids).toContain('deathfist-belts');
  });

  it('questAvailable respects class restrictions', () => {
    expect(
      questAvailable(QUESTS.find((q) => q.id === 'soulfire')!, troll)
    ).toBe(false);
  });

  it('level gating: efreeti boots are not "now" for a level 8', () => {
    const recs = recommendQuests(troll, 20);
    expect(recs.every((r) => r.quest.levelMin <= 8 + 6)).toBe(true);
  });
});

describe('hunt targets', () => {
  it('targets track character level', () => {
    const lvl12 = huntTargets({ id: 'x', name: 'X', raceId: 'human', classIds: ['warrior'], level: 12 }, 8);
    expect(lvl12.length).toBeGreaterThan(0);
    for (const m of lvl12) {
      expect(['target', 'stretch']).toContain(monsterFit(m, 12));
    }
  });

  it('raid dragons are out of reach for level 20 but not level 50', () => {
    const vox = MONSTERS.find((m) => m.id === 'lady-vox')!;
    expect(monsterFit(vox, 20)).toBe('out-of-reach');
    expect(['target', 'stretch']).toContain(monsterFit(vox, 50));
  });
});

describe('deity advice', () => {
  const base: CharacterProfile = {
    id: 'd',
    name: 'Dee',
    raceId: 'human',
    classIds: ['cleric'],
    level: 20
  };

  it('returns null for the agnostic', () => {
    expect(deityAdvice(base)).toBeNull();
  });

  it('warns evil-god followers of non-evil races to keep the faith quiet', () => {
    const advice = deityAdvice({ ...base, deityId: 'innoruuk' });
    expect(advice).toMatch(/keep the faith quiet/i);
    expect(advice).toContain('Innoruuk');
  });

  it('counts down to the god-plane pilgrimage when one exists', () => {
    const advice = deityAdvice({ ...base, raceId: 'dark-elf', deityId: 'innoruuk', classIds: ['necromancer'] });
    expect(advice).toMatch(/26 levels away/);
    const atCap = deityAdvice({ ...base, raceId: 'dark-elf', deityId: 'innoruuk', classIds: ['necromancer'], level: 50 });
    expect(atCap).toMatch(/open to you/i);
  });
});
