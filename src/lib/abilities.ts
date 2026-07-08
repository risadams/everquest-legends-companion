import type { AbilityScaling, CombatAbility } from '../data/types';
import { CASTER_GROUPS, CASTER_GROUP_LABELS } from '../data/abilities';

/** true when any class in the combo unlocks the ability */
export function abilityUnlocked(ability: CombatAbility, classIds: string[]): boolean {
  return ability.forClasses.some((c) => classIds.includes(c));
}

/** number of combo classes counted by a scaling rule */
export function scalingCount(scaling: AbilityScaling, classIds: string[]): number {
  const inGroup = classIds.filter((c) => CASTER_GROUPS[scaling.group].includes(c)).length;
  return scaling.counting === 'additional' ? Math.max(0, inGroup - 1) : inGroup;
}

/** render one scaling rule for a specific combo, e.g. "Damage effect bonus: +40%" */
export function scalingNote(scaling: AbilityScaling, classIds: string[]): string {
  const n = scalingCount(scaling, classIds);
  if (scaling.template) {
    return scaling.template.split('{n}').join(String(n));
  }
  const value = (scaling.base ?? 0) + (scaling.per ?? 0) * n;
  const unit = scaling.unit ?? '';
  const formula = `${scaling.base}${unit} ${scaling.per! >= 0 ? '+' : '−'} ${Math.abs(
    scaling.per!
  )}${unit} per ${scaling.counting === 'additional' ? 'additional ' : ''}${
    CASTER_GROUP_LABELS[scaling.group]
  }`;
  return `${scaling.label}: ${value}${unit} for your combo (${formula})`;
}
