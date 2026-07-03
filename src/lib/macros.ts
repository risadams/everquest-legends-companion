import type { MacroDef } from '../data/types';
import { MACROS } from '../data/macros';

/** Macros applicable to a class combo: generics, any-class matches, and
 *  synergy macros whose full class requirement is met. */
export function macrosForClasses(classIds: string[]): MacroDef[] {
  const selected = new Set(classIds);
  return MACROS.filter((m) => {
    if (m.requiresAll && m.requiresAll.length > 0) {
      return m.requiresAll.every((c) => selected.has(c));
    }
    if (m.forClasses.length === 0) return true;
    return m.forClasses.some((c) => selected.has(c));
  });
}

/** Plain-text export of a macro, ready to paste or transcribe in-game. */
export function macroToText(m: MacroDef): string {
  return `${m.name}\n${m.lines.join('\n')}`;
}
