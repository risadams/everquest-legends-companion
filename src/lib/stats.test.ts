import { describe, it, expect } from 'vitest';
import {
  STAT_KEYS,
  RACE_BASE_STATS,
  CLASS_STAT_BONUS,
  CLASS_PRIME_STATS,
  statsFor
} from '../data/stats';
import { RACES, RACE_BY_ID } from '../data/races';
import { CLASSES, CLASS_BY_ID } from '../data/classes';

describe('stat data integrity', () => {
  it('every race has a complete, sane base stat block', () => {
    for (const r of RACES) {
      const base = RACE_BASE_STATS[r.id];
      expect(base, `missing base stats for ${r.id}`).toBeDefined();
      for (const k of STAT_KEYS) {
        expect(base[k], `${r.id}.${k}`).toBeGreaterThanOrEqual(30);
        expect(base[k], `${r.id}.${k}`).toBeLessThanOrEqual(150);
      }
    }
  });

  it('every class has a bonus row and 1-2 prime stats', () => {
    for (const c of CLASSES) {
      const bonus = CLASS_STAT_BONUS[c.id];
      expect(bonus, `missing bonus for ${c.id}`).toBeDefined();
      for (const [k, v] of Object.entries(bonus)) {
        expect(STAT_KEYS, `${c.id} bonus key ${k}`).toContain(k);
        expect(v).toBeGreaterThan(0);
        expect(v).toBeLessThanOrEqual(20);
      }
      const primes = CLASS_PRIME_STATS[c.id];
      expect(primes, `missing primes for ${c.id}`).toBeDefined();
      expect(primes.length).toBeGreaterThanOrEqual(1);
      expect(primes.length).toBeLessThanOrEqual(2);
      for (const p of primes) expect(STAT_KEYS).toContain(p);
    }
  });

  it('has no orphan rows referencing unknown races or classes', () => {
    for (const id of Object.keys(RACE_BASE_STATS)) {
      expect(RACE_BY_ID[id], `RACE_BASE_STATS.${id}`).toBeDefined();
    }
    for (const id of [...Object.keys(CLASS_STAT_BONUS), ...Object.keys(CLASS_PRIME_STATS)]) {
      expect(CLASS_BY_ID[id], `class row ${id}`).toBeDefined();
    }
  });

  it('every prime stat gets a nonzero bonus from its own class', () => {
    for (const c of CLASSES) {
      for (const p of CLASS_PRIME_STATS[c.id]) {
        expect(
          CLASS_STAT_BONUS[c.id][p] ?? 0,
          `${c.id}: prime ${p} has no class bonus`
        ).toBeGreaterThan(0);
      }
    }
  });
});

describe('statsFor', () => {
  it('adds the primary class bonus to the race base', () => {
    const s = statsFor('human', 'warrior');
    expect(s.str).toBe(85); // 75 + 10
    expect(s.sta).toBe(85);
    expect(s.agi).toBe(80);
    expect(s.wis).toBe(75); // untouched
  });

  it('applies only the primary class (no blending)', () => {
    const troll = statsFor('troll', 'shadow-knight');
    expect(troll.str).toBe(118); // 108 + 10
    expect(troll.int).toBe(62); // 52 + 10
  });

  it('never throws on unknown ids', () => {
    const s = statsFor('martian', 'jedi');
    for (const k of STAT_KEYS) expect(s[k]).toBe(75);
  });
});
