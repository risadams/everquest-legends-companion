import { describe, it, expect } from 'vitest';
import { BUILD_NAMES, buildKey, buildName } from '../data/buildNames';
import { CLASSES } from '../data/classes';

describe('build names', () => {
  it('names every unordered trio of the 16 classes exactly once', () => {
    const ids = CLASSES.map((c) => c.id);
    expect(ids).toHaveLength(16);
    const expected: string[] = [];
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++)
        for (let k = j + 1; k < ids.length; k++)
          expected.push(buildKey([ids[i], ids[j], ids[k]]));
    expect(expected).toHaveLength(560);
    for (const key of expected) {
      expect(BUILD_NAMES[key], `missing build name for ${key}`).toBeTruthy();
    }
    expect(Object.keys(BUILD_NAMES)).toHaveLength(560);
  });

  it('gives every trio a distinct name', () => {
    const names = Object.values(BUILD_NAMES);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keys only reference real class ids', () => {
    const ids = new Set(CLASSES.map((c) => c.id));
    for (const key of Object.keys(BUILD_NAMES)) {
      const parts = key.split('+');
      expect(parts, key).toHaveLength(3);
      for (const p of parts) expect(ids.has(p), `${key}: unknown class ${p}`).toBe(true);
    }
  });

  it('is order-insensitive and ignores duplicate picks', () => {
    // Pinned to the table rather than a literal: build names are editorial and
    // get rewritten, but every permutation must always resolve to the same one.
    const expected = BUILD_NAMES['berserker+shadow-knight+warrior'];
    expect(expected).toBeTruthy();
    expect(buildName(['warrior', 'berserker', 'shadow-knight'])).toBe(expected);
    expect(buildName(['shadow-knight', 'warrior', 'berserker'])).toBe(expected);
    expect(buildName(['berserker', 'warrior', 'warrior', 'shadow-knight'])).toBe(expected);

    expect(buildName(['shaman', 'cleric', 'druid'])).toBe(BUILD_NAMES['cleric+druid+shaman']);
  });

  it('has no name for partial builds', () => {
    expect(buildName([])).toBeNull();
    expect(buildName(['warrior'])).toBeNull();
    expect(buildName(['warrior', 'cleric'])).toBeNull();
    expect(buildName(['warrior', 'warrior', 'cleric'])).toBeNull();
  });
});
