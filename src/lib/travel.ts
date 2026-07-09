import type { TravelSpell } from '../data/types';
import { TRAVEL_SPELLS } from '../data/travel';

export type Castability = 'now' | 'later' | 'ritual';

/** how a given combo/level relates to one travel spell */
export function castability(
  spell: TravelSpell,
  classIds: string[],
  level: number
): Castability {
  const mine = spell.classes.filter((cl) => classIds.includes(cl.classId));
  if (mine.length === 0) return 'ritual';
  return mine.some((cl) => cl.level <= level) ? 'now' : 'later';
}

/** lowest level at which any combo class casts the spell (Infinity if none can) */
export function unlockLevel(spell: TravelSpell, classIds: string[]): number {
  const levels = spell.classes
    .filter((cl) => classIds.includes(cl.classId))
    .map((cl) => cl.level);
  return levels.length > 0 ? Math.min(...levels) : Infinity;
}

/** destination zone ids covered by the port network, each with its spells */
export function portsByDestination(): Map<string, TravelSpell[]> {
  const map = new Map<string, TravelSpell[]>();
  for (const spell of TRAVEL_SPELLS) {
    if (!spell.destZoneId) continue;
    const list = map.get(spell.destZoneId) ?? [];
    list.push(spell);
    map.set(spell.destZoneId, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => unlockLevelAny(a) - unlockLevelAny(b));
  }
  return map;
}

function unlockLevelAny(spell: TravelSpell): number {
  return Math.min(...spell.classes.map((cl) => cl.level));
}

/** spells without a destination (gate, bind, utility) */
export const UTILITY_SPELLS = TRAVEL_SPELLS.filter((s) => !s.destZoneId);

/**
 * Names (lowercased) of the portal-type spells that become castable Rituals in EQL —
 * once any class scribes one, it is usable from the Actions window even off-loadout.
 * Used to badge these spells on the class spell tables.
 */
export const RITUAL_SPELL_NAMES = new Set(
  TRAVEL_SPELLS.filter((s) => s.kind === 'port' || s.kind === 'gate').map((s) => s.name.toLowerCase())
);
