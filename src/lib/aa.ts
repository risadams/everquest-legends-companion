import type { CharacterProfile } from '../data/types';
import type { AaRow, SharedAa } from './classdata';

// AA spending advisor: ranks harvested AA rows for a character's combo,
// level, and banked points. Costs like "2/4/6" are per-rank; we advise on
// the first rank. Level gates are parsed from the wiki description text.

export interface AaSuggestion {
  aa: AaRow;
  /** where it comes from: a class name, 'Archetype', or 'General' */
  source: string;
  firstCost: number | null;
  minLevel: number | null;
  /** level requirement met */
  eligible: boolean;
  /** eligible AND banked points cover the first rank */
  affordable: boolean;
  why: string;
}

/** "2/4/6" → 2 · "0" → 0 · "?" / junk → null */
export function parseFirstCost(cost: string): number | null {
  const first = cost.split('/')[0].trim();
  if (!/^\d+$/.test(first)) return null;
  return Number(first);
}

/** "… Requirements: level 25." → 25 (defaults to 1 when unstated) */
export function parseMinLevel(description: string): number | null {
  const m = description.match(/requirements?:\s*level\s*(\d+)/i);
  return m ? Number(m[1]) : null;
}

// role groups used to decide which shared AAs matter to this combo
const DUAL_WIELDERS = new Set(['monk', 'rogue', 'ranger', 'warrior', 'bard', 'beastlord', 'berserker']);
const MELEE = new Set(['warrior', 'monk', 'rogue', 'berserker', 'paladin', 'ranger', 'shadow-knight', 'bard', 'beastlord']);
const TANKS = new Set(['warrior', 'paladin', 'shadow-knight']);
const DOT_CASTERS = new Set(['necromancer', 'shaman', 'druid']);
const NUKERS = new Set(['wizard', 'magician', 'druid', 'cleric', 'shaman', 'enchanter', 'necromancer']);
const PET_CLASSES = new Set(['magician', 'necromancer', 'beastlord', 'enchanter']);
const CASTERS = new Set(['cleric', 'druid', 'shaman', 'enchanter', 'magician', 'necromancer', 'wizard']);

const hasAny = (ids: string[], group: Set<string>) => ids.some((id) => group.has(id));

/** shared (archetype + general) AAs worth calling out, when the combo fits */
const SHARED_PICKS: Array<{ name: string; fits: (ids: string[]) => boolean; why: string }> = [
  { name: 'Origin', fits: () => true, why: 'Free teleport home every 18 minutes — costs nothing' },
  { name: 'Gather Party', fits: () => true, why: 'Free — summons your group to you on a 6-hour timer' },
  { name: 'Quick Buff', fits: (ids) => hasAny(ids, CASTERS) || hasAny(ids, new Set(['paladin', 'ranger', 'beastlord', 'bard'])), why: 'One click rebuffs the whole group' },
  { name: 'Combat Fury', fits: (ids) => hasAny(ids, MELEE), why: 'Melee crit chance — cheap, always working' },
  { name: 'Combat Agility', fits: (ids) => hasAny(ids, MELEE), why: 'Avoidance for anyone taking hits' },
  { name: 'Combat Stability', fits: (ids) => hasAny(ids, TANKS), why: 'Raises your AC soft cap — tank fundamentals' },
  { name: 'Natural Durability', fits: (ids) => hasAny(ids, TANKS), why: 'More max HP for the one eating the hits' },
  { name: 'First Aid', fits: (ids) => hasAny(ids, MELEE) && !hasAny(ids, CASTERS), why: 'Bind wound to full — real sustain for melee trios' },
  { name: 'Ambidexterity', fits: (ids) => hasAny(ids, DUAL_WIELDERS), why: 'You dual wield — more successful off-hand swings' },
  { name: 'Burst of Power', fits: (ids) => hasAny(ids, DUAL_WIELDERS), why: 'Flurry chance for heavy melee' },
  { name: 'Double Riposte', fits: (ids) => hasAny(ids, MELEE), why: 'Free counterattacks while tanking' },
  { name: 'Critical Affliction', fits: (ids) => hasAny(ids, DOT_CASTERS), why: 'Your DoTs can crit every tick' },
  { name: 'Destructive Cascade', fits: (ids) => hasAny(ids, DOT_CASTERS), why: 'Bigger DoT crits — pairs with Critical Affliction' },
  { name: 'Destructive Fury', fits: (ids) => hasAny(ids, NUKERS), why: 'Bigger nuke crits' },
  { name: 'Companion’s Discipline', fits: (ids) => hasAny(ids, PET_CLASSES), why: 'Pet hold/greater-hold — pet control that prevents wipes' },
  { name: "Companion's Discipline", fits: (ids) => hasAny(ids, PET_CLASSES), why: 'Pet hold/greater-hold — pet control that prevents wipes' }
];

function statusScore(eligible: boolean, affordable: boolean): number {
  if (affordable) return 20;
  if (eligible) return 10;
  return 0;
}

export function suggestAAs(
  character: CharacterProfile,
  classAas: Array<{ className: string; aas: AaRow[] }>,
  shared: SharedAa,
  limit = 10
): AaSuggestion[] {
  const points = character.aaPoints ?? 0;
  const scored: Array<{ s: AaSuggestion; score: number }> = [];
  const seen = new Set<string>();

  const push = (aa: AaRow, source: string, why: string, tier: number) => {
    if (seen.has(aa.name)) return;
    seen.add(aa.name);
    const firstCost = parseFirstCost(aa.cost);
    const minLevel = parseMinLevel(aa.description);
    const eligible = minLevel === null || character.level >= minLevel;
    const affordable = eligible && firstCost !== null && firstCost <= points;
    const free = firstCost === 0 && eligible;
    scored.push({
      s: { aa, source, firstCost, minLevel, eligible, affordable, why },
      score: tier + statusScore(eligible, affordable) + (free ? 25 : 0)
    });
  };

  // class AAs: the combo's signature lines
  for (const { className, aas } of classAas) {
    for (const aa of aas) {
      push(aa, className, `Signature ${className} line`, 50);
    }
  }

  // curated shared picks that fit the combo
  for (const pick of SHARED_PICKS) {
    if (!pick.fits(character.classIds)) continue;
    const general = shared.general.find((r) => r.name === pick.name);
    const archetype = general ? undefined : shared.archetype.find((r) => r.name === pick.name);
    const row = general ?? archetype;
    if (!row) continue;
    push(row, general ? 'General' : 'Archetype', pick.why, 40);
  }

  scored.sort(
    (a, b) => b.score - a.score || (a.s.firstCost ?? 99) - (b.s.firstCost ?? 99)
  );
  return scored.slice(0, limit).map((x) => x.s);
}
