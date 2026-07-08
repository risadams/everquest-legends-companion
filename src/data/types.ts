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

export type AbilityKind = 'stance' | 'invocation';

/** class groups referenced by stance/invocation scaling formulas */
export type CasterGroup = 'int' | 'wis' | 'pure-caster';

export interface AbilityScaling {
  group: CasterGroup;
  /** 'additional' = group count − 1 (min 0); 'every' = full group count */
  counting: 'additional' | 'every';
  /** numeric form: value = base + per × n, rendered with unit */
  label?: string;
  base?: number;
  per?: number;
  unit?: string;
  /** prose form: '{n}' is replaced with the computed count */
  template?: string;
}

export interface CombatAbility {
  id: string;
  name: string;
  kind: AbilityKind;
  /** class ids that unlock this ability (any one in the combo suffices) */
  forClasses: string[];
  effect: string;
  cost: string;
  scaling?: AbilityScaling[];
  tips?: string;
}

export interface LoreEra {
  id: string;
  name: string;
  /** loose in-world period label, e.g. "the dawn of Norrath" */
  period: string;
  summary: string;
  events: string[];
}

export interface Deity {
  id: string;
  name: string;
  epithet: string;
  alignment: Alignment;
  domain: string;
  blurb: string;
  /** who typically kneels at this altar */
  followers: string;
  /** the deity's plane, when it's a visitable zone */
  planeZoneId?: string;
}

export interface LoreFigure {
  id: string;
  name: string;
  title: string;
  zoneId?: string;
  blurb: string;
}

export interface Faction {
  id: string;
  name: string;
  /** zones where this faction's NPCs are centered (first = primary home) */
  homeZoneIds: string[];
  description: string;
  /** notable ways to raise standing */
  raise: string[];
  /** faction ids whose standing suffers when you help this one (and vice versa) */
  rivals?: string[];
  warning?: string;
}

export type TravelKind = 'gate' | 'port' | 'evac' | 'utility';

export interface TravelSpell {
  id: string;
  name: string;
  kind: TravelKind;
  targets: 'self' | 'group' | 'ally';
  /** classes that can scribe it, with the level required */
  classes: { classId: string; level: number }[];
  /** destination zone; omitted for bind-point and utility spells */
  destZoneId?: string;
  reagent?: string;
  note?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  raceId: string;
  /** 1-3 class ids; first entry is the primary class */
  classIds: string[];
  level: number;
  /** banked (unspent) AA points; optional for profiles saved before this existed */
  aaPoints?: number;
}
