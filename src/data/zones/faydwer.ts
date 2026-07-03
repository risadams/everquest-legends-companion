import type { Zone } from '../types';

export const FAYDWER_ZONES: Zone[] = [
  // ── Cities ─────────────────────────────────────────────────
  {
    id: 'kelethin',
    name: 'Kelethin',
    continent: 'faydwer',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['greater-faydark'],
    hotspots: [{ name: 'Platform city & lifts', levels: '1-5' }],
    dangers: ['The fall from the platforms is famous and fatal'],
    notes: 'Wood elf city built in the canopy of Greater Faydark.',
    mapX: 36, mapY: 40
  },
  {
    id: 'felwithe',
    name: 'Felwithe',
    continent: 'faydwer',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['greater-faydark'],
    hotspots: [{ name: 'Marble gates newbie yard (GFay side)', levels: '1-5' }],
    notes: 'Gleaming high elf capital tucked against the eastern cliffs of Greater Faydark.',
    mapX: 55, mapY: 38
  },
  {
    id: 'kaladim',
    name: 'Kaladim',
    continent: 'faydwer',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['butcherblock'],
    hotspots: [{ name: 'Mine gates newbie yard (Butcherblock side)', levels: '1-5' }],
    notes: 'Dwarven mine-city carved into the Butcherblock Mountains.',
    mapX: 22, mapY: 52
  },
  {
    id: 'ak-anon',
    name: 'Ak’Anon',
    continent: 'faydwer',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'neutral',
    connections: ['steamfont'],
    hotspots: [{ name: 'Clockwork gates (Steamfont side)', levels: '1-5' }],
    notes: 'Gnomish clockwork city beneath the Steamfont Mountains.',
    mapX: 74, mapY: 34
  },
  // ── Forests & mountains ───────────────────────────────────
  {
    id: 'greater-faydark',
    name: 'Greater Faydark',
    continent: 'faydwer',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['kelethin', 'felwithe', 'crushbone', 'lesser-faydark', 'butcherblock'],
    hotspots: [
      { name: 'Kelethin newbie grounds', levels: '1-6' },
      { name: 'Orc camps 1 & 2', levels: '5-10', note: 'Crushbone orcs — belts and pads for turn-ins' }
    ],
    dangers: ['Perpetual twilight under the canopy — bring light if human'],
    notes: 'The great elven forest; the busiest newbie zone on Faydwer.',
    mapX: 40, mapY: 45
  },
  {
    id: 'crushbone',
    name: 'Crushbone',
    continent: 'faydwer',
    type: 'dungeon',
    levelMin: 5,
    levelMax: 15,
    connections: ['greater-faydark'],
    hotspots: [
      { name: 'Outer camps & slaver pens', levels: '5-10' },
      { name: 'The castle: Crush & Darish', levels: '8-14' },
      { name: 'Emperor Crush’s throne', levels: '12-15' }
    ],
    dangers: ['Massive trains to the zone line are a rite of passage'],
    notes: 'The orc keep of Clan Crushbone — Faydwer’s definitive first dungeon.',
    mapX: 42, mapY: 28
  },
  {
    id: 'lesser-faydark',
    name: 'Lesser Faydark',
    continent: 'faydwer',
    type: 'outdoor',
    levelMin: 15,
    levelMax: 30,
    connections: ['greater-faydark', 'mistmoore', 'steamfont'],
    hotspots: [
      { name: 'Brownie & pixie glades', levels: '15-24', note: 'Brownies are far meaner than they look' },
      { name: 'Orc & shadow camps', levels: '18-28' }
    ],
    dangers: ['The equestrielle and brownie scouts slaughter the unwary'],
    notes: 'Twisted fey woodland between the great forest and Mistmoore’s valley.',
    mapX: 55, mapY: 55
  },
  {
    id: 'steamfont',
    name: 'Steamfont Mountains',
    continent: 'faydwer',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 12,
    connections: ['ak-anon', 'lesser-faydark'],
    hotspots: [
      { name: 'Clockwork fields & newbie yard', levels: '1-6' },
      { name: 'Minotaur caves & kobolds', levels: '6-14' },
      { name: 'Harpy ridge', levels: '10-16' }
    ],
    dangers: ['Meldrath’s mad clockworks', 'Harpies near the windmills'],
    notes: 'Windmill-dotted foothills around Ak’Anon; gnome starting grounds.',
    mapX: 68, mapY: 40
  },
  {
    id: 'butcherblock',
    name: 'Butcherblock Mountains',
    continent: 'faydwer',
    type: 'outdoor',
    levelMin: 5,
    levelMax: 15,
    connections: ['kaladim', 'greater-faydark', 'dagnors-cauldron', 'ocean-of-tears'],
    hotspots: [
      { name: 'The chessboard', levels: '5-12' },
      { name: 'Aviak & goblin camps', levels: '8-15' }
    ],
    dangers: ['The docks draw wandering aggro — wait for the boat carefully'],
    notes: 'Mountain passes between Kaladim and the sea; Faydwer’s boat dock to Antonica.',
    mapX: 30, mapY: 58
  },
  // ── Dungeons ──────────────────────────────────────────────
  {
    id: 'dagnors-cauldron',
    name: 'Dagnor’s Cauldron',
    continent: 'faydwer',
    type: 'outdoor',
    levelMin: 15,
    levelMax: 30,
    connections: ['butcherblock', 'kedge-keep', 'unrest'],
    hotspots: [
      { name: 'Goblin shores', levels: '15-24' },
      { name: 'Unrest approach', levels: '18-28' }
    ],
    dangers: ['Deep water hides Kedge Keep’s guardians', 'Steep cliffs ring the crater'],
    notes: 'Flooded volcanic crater whose waters conceal Kedge Keep.',
    mapX: 30, mapY: 72
  },
  {
    id: 'unrest',
    name: 'Estate of Unrest',
    continent: 'faydwer',
    type: 'dungeon',
    levelMin: 15,
    levelMax: 35,
    connections: ['dagnors-cauldron'],
    hotspots: [
      { name: 'Yard & fireplace room', levels: '15-22' },
      { name: 'House main floor', levels: '20-28' },
      { name: 'Basement & hidden crypt', levels: '25-35' }
    ],
    dangers: ['Ghouls paralyze', 'The house floods with adds when a pull goes wrong'],
    notes: 'Haunted manor above Dagnor’s Cauldron — the classic undead XP dungeon of the 20s.',
    mapX: 38, mapY: 74
  },
  {
    id: 'kedge-keep',
    name: 'Kedge Keep',
    continent: 'faydwer',
    type: 'dungeon',
    levelMin: 35,
    levelMax: 50,
    connections: ['dagnors-cauldron'],
    hotspots: [
      { name: 'Outer halls & seahorses', levels: '35-45' },
      { name: 'Phinigel Autropos', levels: '46+ raid', note: 'Classic underwater raid target' }
    ],
    dangers: ['ENTIRELY UNDERWATER — breath gear or magic is mandatory', 'Disorienting 3D tunnels'],
    notes: 'A fully submerged fortress — bring underwater breathing or a froglok’s lungs.',
    mapX: 26, mapY: 80
  },
  {
    id: 'mistmoore',
    name: 'Castle Mistmoore',
    continent: 'faydwer',
    type: 'dungeon',
    levelMin: 20,
    levelMax: 40,
    connections: ['lesser-faydark'],
    hotspots: [
      { name: 'Graveyard & gates', levels: '20-28' },
      { name: 'Castle halls', levels: '25-35' },
      { name: 'Mayong’s inner sanctum', levels: '35-40' }
    ],
    dangers: ['Gargoyles see through invisibility', 'Deep pulls bring the whole castle'],
    notes: 'The vampire lord Mayong Mistmoore’s gothic castle in a hidden valley.',
    mapX: 62, mapY: 62
  }
];
