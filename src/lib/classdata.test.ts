import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CLASSES } from '../data/classes';

const DATA_DIR = join(__dirname, '..', 'data', 'classdata');

const PURE_MELEE = new Set(['warrior', 'monk', 'rogue', 'berserker']);

describe('harvested class data', () => {
  it('every class has a data file', () => {
    for (const c of CLASSES) {
      expect(existsSync(join(DATA_DIR, `${c.id}.json`)), `missing ${c.id}.json`).toBe(true);
    }
    expect(existsSync(join(DATA_DIR, 'shared-aa.json'))).toBe(true);
  });

  it('spell rows are sane; casters have real spell lists', () => {
    for (const c of CLASSES) {
      const data = JSON.parse(readFileSync(join(DATA_DIR, `${c.id}.json`), 'utf8'));
      for (const s of data.spells) {
        expect(typeof s.name === 'string' && s.name.length > 0, `${c.id} spell name`).toBe(true);
        expect(s.level, `${c.id} ${s.name} level`).toBeGreaterThanOrEqual(1);
        expect(s.level, `${c.id} ${s.name} level`).toBeLessThanOrEqual(60);
      }
      if (PURE_MELEE.has(c.id)) {
        expect(data.spells.length, `${c.id} should have no spells`).toBe(0);
      } else {
        expect(data.spells.length, `${c.id} spell list`).toBeGreaterThan(30);
      }
    }
  });

  it('skill rows are sane where present', () => {
    for (const c of CLASSES) {
      const data = JSON.parse(readFileSync(join(DATA_DIR, `${c.id}.json`), 'utf8'));
      for (const s of data.skills) {
        expect(typeof s.name === 'string' && s.name.length > 0, `${c.id} skill name`).toBe(true);
        expect(typeof s.trained, `${c.id} ${s.name} trained flag`).toBe('boolean');
        expect(s.level).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('AAs harvested for every class plus the shared pools', () => {
    for (const c of CLASSES) {
      const data = JSON.parse(readFileSync(join(DATA_DIR, `${c.id}.json`), 'utf8'));
      expect(data.aas.length, `${c.id} class AAs`).toBeGreaterThan(0);
    }
    const shared = JSON.parse(readFileSync(join(DATA_DIR, 'shared-aa.json'), 'utf8'));
    expect(shared.general.length).toBeGreaterThan(20);
    expect(shared.archetype.length).toBeGreaterThan(20);
    expect(shared.special.length).toBeGreaterThan(0);
  });

  it('cleric fundamentals are present with the right sources', () => {
    const cleric = JSON.parse(readFileSync(join(DATA_DIR, 'cleric.json'), 'utf8'));
    const courage = cleric.spells.find((s: { name: string }) => s.name === 'Courage');
    expect(courage).toBeDefined();
    expect(courage.level).toBe(1);
    expect(courage.source).toContain('Vendor');
    const auto = cleric.spells.filter((s: { source: string }) => s.source.includes('Autogranted'));
    expect(auto.length).toBeGreaterThan(0);
  });
});
