import type { TravelSpell } from './types';

// Port network and travel utilities as documented on eqlwiki.com/Rituals
// (June 2026 beta). Levels are the class level required to scribe the spell.

const c = (classId: string, level: number) => ({ classId, level });

export const TRAVEL_SPELLS: TravelSpell[] = [
  // ── Bind & gate ────────────────────────────────────────────
  {
    id: 'gate',
    name: 'Gate',
    kind: 'gate',
    targets: 'self',
    classes: [
      c('wizard', 4),
      c('enchanter', 4),
      c('magician', 4),
      c('necromancer', 4),
      c('cleric', 5),
      c('druid', 5),
      c('shaman', 5)
    ],
    note: 'Returns you to your bind point.'
  },
  {
    id: 'bind-affinity',
    name: 'Bind Affinity',
    kind: 'utility',
    targets: 'ally',
    classes: [
      c('enchanter', 12),
      c('magician', 12),
      c('necromancer', 12),
      c('wizard', 12),
      c('cleric', 14),
      c('druid', 14),
      c('shaman', 14)
    ],
    note: 'Binds the target’s soul to the current location. Often limited to towns and cities.'
  },
  {
    id: 'shrink',
    name: 'Shrink',
    kind: 'utility',
    targets: 'ally',
    classes: [c('shaman', 15), c('beastlord', 23)],
    note: 'Shrinks the target for mobility in tight dungeon quarters.'
  },

  // ── Druid rings (self) ─────────────────────────────────────
  { id: 'ring-north-karana', name: 'Ring of North Karana', kind: 'port', targets: 'self', classes: [c('druid', 15)], destZoneId: 'north-karana' },
  { id: 'ring-surefall-glade', name: 'Ring of Surefall Glade', kind: 'port', targets: 'self', classes: [c('druid', 15)], destZoneId: 'surefall-glade' },
  { id: 'ring-butcherblock', name: 'Ring of Butcherblock', kind: 'port', targets: 'self', classes: [c('druid', 16)], destZoneId: 'butcherblock' },
  { id: 'ring-toxxulia', name: 'Ring of Toxxulia', kind: 'port', targets: 'self', classes: [c('druid', 17)], destZoneId: 'toxxulia' },
  { id: 'ring-west-commons', name: 'Ring of West Commons', kind: 'port', targets: 'self', classes: [c('druid', 17)], destZoneId: 'west-commonlands' },
  { id: 'ring-south-ro', name: 'Ring of South Ro', kind: 'port', targets: 'self', classes: [c('druid', 20)], destZoneId: 'south-ro' },
  { id: 'ring-stonebrunt', name: 'Ring of Stonebrunt', kind: 'port', targets: 'self', classes: [c('druid', 20)], destZoneId: 'stonebrunt' },
  { id: 'ring-steamfont', name: 'Ring of Steamfont', kind: 'port', targets: 'self', classes: [c('druid', 21)], destZoneId: 'steamfont' },
  { id: 'ring-feerrott', name: 'Ring of Feerrott', kind: 'port', targets: 'self', classes: [c('druid', 22)], destZoneId: 'feerrott' },
  { id: 'ring-lavastorm', name: 'Ring of Lavastorm', kind: 'port', targets: 'self', classes: [c('druid', 22)], destZoneId: 'lavastorm' },
  { id: 'ring-misty-thicket', name: 'Ring of Misty Thicket', kind: 'port', targets: 'self', classes: [c('druid', 25)], destZoneId: 'misty-thicket' },

  // ── Druid circles (group) ──────────────────────────────────
  { id: 'circle-north-karana', name: 'Circle of North Karana', kind: 'port', targets: 'group', classes: [c('druid', 25)], destZoneId: 'north-karana' },
  { id: 'circle-butcherblock', name: 'Circle of Butcherblock', kind: 'port', targets: 'group', classes: [c('druid', 25)], destZoneId: 'butcherblock' },
  { id: 'circle-toxxulia', name: 'Circle of Toxxulia', kind: 'port', targets: 'group', classes: [c('druid', 25)], destZoneId: 'toxxulia' },
  { id: 'circle-surefall-glade', name: 'Circle of Surefall Glade', kind: 'port', targets: 'group', classes: [c('druid', 26)], destZoneId: 'surefall-glade' },
  { id: 'circle-west-commons', name: 'Circle of West Commons', kind: 'port', targets: 'group', classes: [c('druid', 27)], destZoneId: 'west-commonlands' },
  { id: 'circle-stonebrunt', name: 'Circle of Stonebrunt', kind: 'port', targets: 'group', classes: [c('druid', 28)], destZoneId: 'stonebrunt' },
  { id: 'circle-lavastorm', name: 'Circle of Lavastorm', kind: 'port', targets: 'group', classes: [c('druid', 30)], destZoneId: 'lavastorm' },
  { id: 'circle-steamfont', name: 'Circle of Steamfont', kind: 'port', targets: 'group', classes: [c('druid', 31)], destZoneId: 'steamfont' },
  { id: 'circle-feerrott', name: 'Circle of Feerrott', kind: 'port', targets: 'group', classes: [c('druid', 32)], destZoneId: 'feerrott' },
  { id: 'circle-south-ro', name: 'Circle of South Ro', kind: 'port', targets: 'group', classes: [c('druid', 32)], destZoneId: 'south-ro' },
  { id: 'circle-misty-thicket', name: 'Circle of Misty Thicket', kind: 'port', targets: 'group', classes: [c('druid', 36)], destZoneId: 'misty-thicket' },

  // ── Druid succors (evac) ───────────────────────────────────
  { id: 'succor-east-karana', name: 'Succor: East Karana', kind: 'evac', targets: 'group', classes: [c('druid', 26)], destZoneId: 'east-karana' },
  { id: 'succor-butcherblock', name: 'Succor: Butcherblock', kind: 'evac', targets: 'group', classes: [c('druid', 32)], destZoneId: 'butcherblock' },
  { id: 'succor-south-ro', name: 'Succor: South Ro', kind: 'evac', targets: 'group', classes: [c('druid', 38)], destZoneId: 'south-ro' },
  { id: 'succor-lavastorm', name: 'Succor: Lavastorm', kind: 'evac', targets: 'group', classes: [c('druid', 41)], destZoneId: 'lavastorm' },
  { id: 'succor-north-karana', name: 'Succor: North Karana', kind: 'evac', targets: 'group', classes: [c('druid', 46)], destZoneId: 'north-karana' },

  // ── Wizard gates (self) ────────────────────────────────────
  { id: 'wgate-north-karana', name: 'North Karana Gate', kind: 'port', targets: 'self', classes: [c('wizard', 18)], destZoneId: 'north-karana' },
  { id: 'wgate-toxxulia', name: 'Toxxulia Gate', kind: 'port', targets: 'self', classes: [c('wizard', 19)], destZoneId: 'toxxulia' },
  { id: 'wgate-greater-faydark', name: 'Greater Faydark Gate', kind: 'port', targets: 'self', classes: [c('wizard', 20)], destZoneId: 'greater-faydark' },
  { id: 'wgate-stonebrunt', name: 'Stonebrunt Gate', kind: 'port', targets: 'self', classes: [c('wizard', 21)], destZoneId: 'stonebrunt' },
  { id: 'wgate-west-commons', name: 'West Commons Gate', kind: 'port', targets: 'self', classes: [c('wizard', 21)], destZoneId: 'west-commonlands' },
  { id: 'wgate-nektulos', name: 'Nektulos Gate', kind: 'port', targets: 'self', classes: [c('wizard', 22)], destZoneId: 'nektulos' },
  { id: 'wgate-north-ro', name: 'North Ro Gate', kind: 'port', targets: 'self', classes: [c('wizard', 22)], destZoneId: 'north-ro' },
  { id: 'wgate-cazic-thule', name: 'Cazic Temple Gate', kind: 'port', targets: 'self', classes: [c('wizard', 23)], destZoneId: 'cazic-thule' },
  { id: 'wgate-west-karana', name: 'West Karana Gate', kind: 'port', targets: 'self', classes: [c('wizard', 23)], destZoneId: 'west-karana' },

  // ── Wizard portals (group) ─────────────────────────────────
  { id: 'wport-north-karana', name: 'North Karana Portal', kind: 'port', targets: 'group', classes: [c('wizard', 25)], destZoneId: 'north-karana' },
  { id: 'wport-greater-faydark', name: 'Greater Faydark Portal', kind: 'port', targets: 'group', classes: [c('wizard', 27)], destZoneId: 'greater-faydark' },
  { id: 'wport-stonebrunt', name: 'Stonebrunt Portal', kind: 'port', targets: 'group', classes: [c('wizard', 27)], destZoneId: 'stonebrunt' },
  { id: 'wport-toxxulia', name: 'Toxxulia Portal', kind: 'port', targets: 'group', classes: [c('wizard', 28)], destZoneId: 'toxxulia' },
  { id: 'wport-nektulos', name: 'Nektulos Portal', kind: 'port', targets: 'group', classes: [c('wizard', 32)], destZoneId: 'nektulos' },
  { id: 'wport-cazic-thule', name: 'Cazic Temple Portal', kind: 'port', targets: 'group', classes: [c('wizard', 33)], destZoneId: 'cazic-thule' },
  { id: 'wport-west-commons', name: 'West Commons Portal', kind: 'port', targets: 'group', classes: [c('wizard', 35)], destZoneId: 'west-commonlands' },
  { id: 'wport-north-ro', name: 'North Ro Portal', kind: 'port', targets: 'group', classes: [c('wizard', 36)], destZoneId: 'north-ro' },
  { id: 'wport-west-karana', name: 'West Karana Portal', kind: 'port', targets: 'group', classes: [c('wizard', 37)], destZoneId: 'west-karana' },

  // ── Wizard evacuates ───────────────────────────────────────
  { id: 'evac-north-karana', name: 'Evacuate: North Karana', kind: 'evac', targets: 'group', classes: [c('wizard', 26)], destZoneId: 'north-karana' },
  { id: 'evac-greater-faydark', name: 'Evacuate: Greater Faydark', kind: 'evac', targets: 'group', classes: [c('wizard', 32)], destZoneId: 'greater-faydark' },
  { id: 'evac-south-ro', name: 'Evacuate: South Ro', kind: 'evac', targets: 'group', classes: [c('wizard', 38)], destZoneId: 'south-ro' },
  { id: 'evac-nektulos', name: 'Evacuate: Nektulos', kind: 'evac', targets: 'group', classes: [c('wizard', 42)], destZoneId: 'nektulos' },
  { id: 'evac-west-karana', name: 'Evacuate: West Karana', kind: 'evac', targets: 'group', classes: [c('wizard', 47)], destZoneId: 'west-karana' },

  // ── Planar ports ───────────────────────────────────────────
  {
    id: 'alter-plane-hate',
    name: 'Alter Plane: Hate',
    kind: 'port',
    targets: 'group',
    classes: [c('wizard', 46)],
    destZoneId: 'plane-of-hate',
    reagent: 'Fuligan Soulstone of Innoruuk'
  },
  {
    id: 'alter-plane-sky',
    name: 'Alter Plane: Sky',
    kind: 'port',
    targets: 'group',
    classes: [c('wizard', 46)],
    destZoneId: 'plane-of-sky',
    reagent: 'Cloudy Stone of Veeshan'
  }
];
