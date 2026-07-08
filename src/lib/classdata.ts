// Lazy loader for the per-class spell/skill/AA data harvested from the
// EQL Wiki (scripts/import-classdata.mjs). One JSON chunk per class.

export interface SpellRow {
  name: string;
  level: number;
  kind: string;
  target: string;
  mana: string;
  maxEffect: string;
  duration: string;
  description: string;
  school: string;
  /** where it comes from: "Autogranted; Vendor", "Vendor", "NPC Drop.", a city list, … */
  source: string;
  era: string;
}

export interface SkillRow {
  name: string;
  level: number;
  /** true = must be bought at the guild trainer; false = granted automatically */
  trained: boolean;
  cap50: string;
  capPost: string;
  category: string;
}

export interface AaRow {
  name: string;
  ranks: string;
  cost: string;
  description: string;
}

export interface ClassData {
  spells: SpellRow[];
  skills: SkillRow[];
  aas: AaRow[];
}

export interface SharedAa {
  general: AaRow[];
  archetype: AaRow[];
  special: AaRow[];
}

const modules = import.meta.glob('../data/classdata/*.json');

export function loadClassData(classId: string): Promise<ClassData> | null {
  const loader = modules[`../data/classdata/${classId}.json`];
  if (!loader) return null;
  return loader().then((m) => (m as { default: ClassData }).default);
}

export function loadSharedAa(): Promise<SharedAa> {
  const loader = modules['../data/classdata/shared-aa.json'];
  return loader().then((m) => (m as { default: SharedAa }).default);
}

/** classify a spell's source string for badges/filtering */
export type SpellSource = 'auto' | 'vendor' | 'drop' | 'quest' | 'research' | 'other';

export function spellSource(s: SpellRow): SpellSource {
  const src = s.source.toLowerCase();
  if (src.includes('autogrant')) return 'auto';
  if (src.includes('vendor')) return 'vendor';
  if (src.includes('drop')) return 'drop';
  if (src.includes('quest')) return 'quest';
  if (src.includes('research')) return 'research';
  return 'other';
}

export const SPELL_SOURCE_LABELS: Record<SpellSource, string> = {
  auto: 'Auto-granted',
  vendor: 'Vendor',
  drop: 'Drop',
  quest: 'Quest',
  research: 'Research',
  other: 'Special'
};
