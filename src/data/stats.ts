import type { CharacterProfile } from './types';

// Classic-EverQuest character-creation attribute values, which EQL's character
// system recreates. Race bases and class bonuses follow the classic tables
// (P99 wiki); expect small differences while the beta settles.

export type StatKey = 'str' | 'sta' | 'agi' | 'dex' | 'wis' | 'int' | 'cha';

export const STAT_KEYS: StatKey[] = ['str', 'sta', 'agi', 'dex', 'wis', 'int', 'cha'];

export const STAT_LABELS: Record<StatKey, string> = {
  str: 'STR',
  sta: 'STA',
  agi: 'AGI',
  dex: 'DEX',
  wis: 'WIS',
  int: 'INT',
  cha: 'CHA'
};

export const STAT_NAMES: Record<StatKey, string> = {
  str: 'Strength',
  sta: 'Stamina',
  agi: 'Agility',
  dex: 'Dexterity',
  wis: 'Wisdom',
  int: 'Intelligence',
  cha: 'Charisma'
};

export type StatBlock = Record<StatKey, number>;

const block = (
  str: number, sta: number, agi: number, dex: number,
  wis: number, int: number, cha: number
): StatBlock => ({ str, sta, agi, dex, wis, int, cha });

/** Racial creation bases. Kerran has no classic analogue — curated from the Vah Shir. */
export const RACE_BASE_STATS: Record<string, StatBlock> = {
  barbarian: block(103, 95, 82, 70, 70, 60, 55),
  'dark-elf': block(60, 65, 90, 75, 83, 99, 60),
  dwarf: block(90, 90, 70, 90, 83, 60, 45),
  erudite: block(60, 70, 70, 70, 83, 107, 70),
  froglok: block(70, 80, 100, 100, 75, 75, 50),
  gnome: block(60, 70, 85, 85, 67, 98, 60),
  'half-elf': block(70, 70, 90, 85, 60, 75, 75),
  halfling: block(70, 75, 95, 90, 80, 67, 50),
  'high-elf': block(55, 65, 85, 70, 95, 92, 80),
  human: block(75, 75, 75, 75, 75, 75, 75),
  iksar: block(70, 70, 90, 85, 80, 75, 55),
  kerran: block(90, 75, 90, 70, 70, 65, 65), // curated (Vah Shir-derived)
  ogre: block(130, 122, 70, 70, 67, 60, 37),
  troll: block(108, 109, 83, 75, 60, 52, 40),
  'wood-elf': block(65, 65, 95, 80, 80, 75, 75)
};

/**
 * Class creation bonuses, applied for the PRIMARY class only (classic grants
 * the bonus once at creation). Berserker and beastlord are curated — their
 * classic-era tables post-date the era EQL draws from.
 */
export const CLASS_STAT_BONUS: Record<string, Partial<StatBlock>> = {
  warrior: { str: 10, sta: 10, agi: 5 },
  cleric: { str: 5, sta: 5, wis: 10 },
  paladin: { str: 10, sta: 5, wis: 5, cha: 10 },
  ranger: { str: 5, sta: 10, agi: 10, wis: 5 },
  'shadow-knight': { str: 10, sta: 5, int: 10, cha: 5 },
  druid: { sta: 10, wis: 10 },
  monk: { str: 5, sta: 5, agi: 10, dex: 10 },
  bard: { str: 5, dex: 10, cha: 10 },
  rogue: { agi: 10, dex: 10 },
  shaman: { sta: 5, wis: 10, cha: 5 },
  necromancer: { dex: 10, int: 10 },
  wizard: { sta: 10, int: 10 },
  magician: { sta: 10, int: 10 },
  enchanter: { int: 10, cha: 10 },
  berserker: { str: 10, sta: 5, dex: 10 }, // curated
  beastlord: { sta: 10, agi: 5, wis: 10 } // curated
};

/** The stats each class lives on — drives the gold highlight on the character sheet. */
export const CLASS_PRIME_STATS: Record<string, StatKey[]> = {
  warrior: ['str', 'sta'],
  cleric: ['wis'],
  paladin: ['str', 'wis'],
  ranger: ['str', 'wis'],
  'shadow-knight': ['str', 'int'],
  druid: ['wis'],
  monk: ['agi', 'dex'],
  bard: ['cha', 'dex'],
  rogue: ['dex', 'agi'],
  shaman: ['wis'],
  necromancer: ['int'],
  wizard: ['int'],
  magician: ['int'],
  enchanter: ['int', 'cha'],
  berserker: ['str', 'dex'],
  beastlord: ['wis', 'sta']
};

/**
 * Creation stats for a race + primary class. Unknown ids fall back to a flat
 * 75 base / no bonus rather than throwing (imported profiles may carry ids
 * from newer data).
 */
export function statsFor(raceId: string, primaryClassId: string): StatBlock {
  const base = RACE_BASE_STATS[raceId];
  const bonus = CLASS_STAT_BONUS[primaryClassId] ?? {};
  return Object.fromEntries(
    STAT_KEYS.map((k) => [k, (base?.[k] ?? 75) + (bonus[k] ?? 0)])
  ) as StatBlock;
}

/** Convenience wrapper for a character profile. */
export function statsForCharacter(c: CharacterProfile): StatBlock {
  return statsFor(c.raceId, c.classIds[0]);
}
