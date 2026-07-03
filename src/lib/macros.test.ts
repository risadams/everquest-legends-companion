import { describe, it, expect } from 'vitest';
import { MACROS } from '../data/macros';
import { CLASS_BY_ID } from '../data/classes';
import { macrosForClasses, macroToText } from './macros';

describe('macro data integrity', () => {
  it('unique ids, valid classes, and the 5-line social limit', () => {
    const ids = new Set<string>();
    for (const m of MACROS) {
      expect(ids.has(m.id), `duplicate id ${m.id}`).toBe(false);
      ids.add(m.id);
      expect(m.lines.length, `${m.id} exceeds 5 social lines`).toBeLessThanOrEqual(5);
      expect(m.lines.length).toBeGreaterThan(0);
      for (const c of [...m.forClasses, ...(m.requiresAll ?? [])]) {
        expect(CLASS_BY_ID[c], `${m.id} class ${c}`).toBeDefined();
      }
      for (const line of m.lines) {
        expect(line.startsWith('/'), `${m.id} line "${line}" is not a slash command`).toBe(true);
      }
    }
  });

  it('every class has at least one dedicated macro', () => {
    for (const cid of Object.keys(CLASS_BY_ID)) {
      expect(
        MACROS.some((m) => m.forClasses.includes(cid)),
        `no macro for ${cid}`
      ).toBe(true);
    }
  });
});

describe('macrosForClasses', () => {
  it('empty combo returns only universal macros', () => {
    const ms = macrosForClasses([]);
    expect(ms.length).toBeGreaterThan(0);
    expect(ms.every((m) => m.forClasses.length === 0 && !m.requiresAll)).toBe(true);
  });

  it('single class gets universal + class macros, no synergies', () => {
    const ms = macrosForClasses(['warrior']);
    expect(ms.some((m) => m.id === 'war-taunt-cycle')).toBe(true);
    expect(ms.some((m) => m.id === 'assist-call')).toBe(true);
    expect(ms.some((m) => m.requiresAll)).toBe(false);
  });

  it('synergy macros require the full class set', () => {
    const without = macrosForClasses(['shaman', 'warrior']);
    expect(without.some((m) => m.id === 'combo-slow-tap')).toBe(false);
    const withBoth = macrosForClasses(['shaman', 'shadow-knight', 'berserker']);
    expect(withBoth.some((m) => m.id === 'combo-slow-tap')).toBe(true);
  });

  it('unrelated class macros are excluded', () => {
    const ms = macrosForClasses(['wizard']);
    expect(ms.some((m) => m.id === 'mnk-fd')).toBe(false);
  });
});

describe('macroToText', () => {
  it('produces name + one command per line', () => {
    const fd = MACROS.find((m) => m.id === 'mnk-fd')!;
    expect(macroToText(fd)).toBe('Feign Death\n/doability 1');
  });
});
