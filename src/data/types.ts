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

export interface CharacterProfile {
  id: string;
  name: string;
  raceId: string;
  /** 1-3 class ids; first entry is the primary class */
  classIds: string[];
  level: number;
}
