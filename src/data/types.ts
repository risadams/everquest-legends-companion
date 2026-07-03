export type Alignment = 'good' | 'neutral' | 'evil';
export type Continent = 'antonica' | 'faydwer' | 'odus' | 'planes';
export type ZoneType = 'city' | 'outdoor' | 'dungeon' | 'plane';
export type Archetype = 'caster' | 'priest' | 'melee' | 'hybrid';

export type Role =
  | 'tank'
  | 'healer'
  | 'melee-dps'
  | 'caster-dps'
  | 'cc'
  | 'pet'
  | 'pull'
  | 'support';

export interface Race {
  id: string;
  name: string;
  alignment: Alignment;
  startingCity: string;
  startingZoneId: string;
  traits: string[];
  description: string;
  /** class ids legal as the primary (creation) class for this race */
  allowedPrimaryClasses: string[];
}

export interface ClassDef {
  id: string;
  name: string;
  archetype: Archetype;
  roles: Role[];
  blurb: string;
  strengths: string[];
  weaknesses: string[];
  /** advice keyed by level band label, e.g. "1-9" */
  levelNotes: Record<string, string>;
}

export interface Hotspot {
  name: string;
  levels: string;
  note?: string;
}

export interface Zone {
  id: string;
  name: string;
  continent: Continent;
  type: ZoneType;
  levelMin: number;
  levelMax: number;
  /** ids of directly connected zones (zone lines, boats, portals) */
  connections: string[];
  hotspots: Hotspot[];
  dangers?: string[];
  notes?: string;
  /** for city zones: dominant alignment, used for faction warnings */
  cityAlignment?: Alignment;
  /** utility zones (e.g. PvP arena) that should never be hunting recommendations */
  excludeFromAdvisor?: boolean;
  /** position on the continent overview map, 0-100 */
  mapX: number;
  mapY: number;
}

export interface ProgressionBand {
  id: string;
  label: string;
  levelMin: number;
  levelMax: number;
  title: string;
  focus: string;
  milestones: string[];
  roleTips: Partial<Record<'tank' | 'healer' | 'dps' | 'support', string>>;
}

export type MonsterKind = 'named' | 'raid' | 'notable';

export interface Monster {
  id: string;
  name: string;
  zoneId: string;
  lvlMin: number;
  lvlMax: number;
  kind: MonsterKind;
  /** where in the zone to find it */
  where: string;
  loot?: string[];
  notes?: string;
}

export type QuestType = 'turn-in' | 'item' | 'class';

export interface Quest {
  id: string;
  name: string;
  type: QuestType;
  startZoneId: string;
  giver: string;
  levelMin: number;
  levelMax: number;
  /** race alignments that can realistically do this quest (faction) */
  forAlignments: Alignment[];
  /** class ids this quest is for; empty = everyone */
  forClasses: string[];
  summary: string;
  reward: string;
  repeatable: boolean;
}

export type MacroCategory =
  | 'combat'
  | 'pulling'
  | 'healing'
  | 'pet'
  | 'control'
  | 'travel'
  | 'safety';

export interface MacroDef {
  id: string;
  name: string;
  category: MacroCategory;
  /** any of these classes unlocks the macro; empty = useful for everyone */
  forClasses: string[];
  /** if set, ALL of these classes must be in the combo (cross-class synergy) */
  requiresAll?: string[];
  /** social window lines, max 5 (the in-game limit) */
  lines: string[];
  description: string;
  tips?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  raceId: string;
  /** 1-3 class ids; first entry is the primary class */
  classIds: string[];
  level: number;
}
