import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ZONES } from '../data/zones';

const MAPS_DIR = join(__dirname, '..', 'data', 'maps');

describe('imported map data', () => {
  const files = new Set(readdirSync(MAPS_DIR));

  it('every zone has imported Brewall geometry', () => {
    for (const z of ZONES) {
      expect(files.has(`${z.id}.json`), `missing map for ${z.id}`).toBe(true);
    }
  });

  it('map files have valid structure and non-trivial geometry', () => {
    for (const z of ZONES) {
      const data = JSON.parse(readFileSync(join(MAPS_DIR, `${z.id}.json`), 'utf8'));
      expect(Array.isArray(data.variants) && data.variants.length > 0, z.id).toBe(true);
      for (const v of data.variants) {
        expect(v.paths.length, `${z.id}/${v.label} paths`).toBeGreaterThan(10);
        expect(v.bounds.maxX, `${z.id}/${v.label} bounds`).toBeGreaterThan(v.bounds.minX);
        for (const p of v.paths) {
          expect(p.pts.length % 2, `${z.id}/${v.label} odd coords`).toBe(0);
          expect(v.colors[p.c], `${z.id}/${v.label} color index`).toBeDefined();
        }
      }
    }
  });
});
