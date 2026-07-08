import type { Zone } from '../data/types';

/** Deterministic PRNG seeded from a string, for stable procedural maps. */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Color for a zone by the low end of its level range. */
export function levelColor(zone: Zone): string {
  if (zone.type === 'city') return '#b09a6a';
  const lo = zone.levelMin;
  if (lo >= 40) return '#d9705e';
  if (lo >= 30) return '#dd8f55';
  if (lo >= 20) return '#e0b050';
  if (lo >= 10) return '#8fb7cf';
  return '#7fbf7f';
}

export const TYPE_LABELS: Record<Zone['type'], string> = {
  city: 'City',
  outdoor: 'Outdoor',
  dungeon: 'Dungeon',
  plane: 'Plane'
};

/** Fill tint for the schematic zone interior by type (on parchment). */
export function typeFill(type: Zone['type']): string {
  switch (type) {
    case 'city':
      return '#e9dcb6';
    case 'dungeon':
      return '#ddc9a2';
    case 'plane':
      return '#e5d2bc';
    default:
      return '#e4d8ac';
  }
}
