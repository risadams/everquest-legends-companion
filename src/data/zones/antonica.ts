import type { Zone } from '../types';

export const ANTONICA_ZONES: Zone[] = [
  // ── Cities ─────────────────────────────────────────────────
  {
    id: 'qeynos',
    name: 'Qeynos',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['qeynos-hills', 'eruds-crossing'],
    hotspots: [
      { name: 'Newbie yard & gate guards', levels: '1-5' },
      { name: 'Qeynos Catacombs (aqueducts)', levels: '3-10', note: 'Undead sewers beneath the city' }
    ],
    notes:
      'Western human capital. Home to humans and half elves; boat service to Erudin departs from the docks.',
    mapX: 14, mapY: 43
  },
  {
    id: 'surefall-glade',
    name: 'Surefall Glade',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['qeynos-hills'],
    hotspots: [{ name: 'Grove newbie area', levels: '1-5' }],
    notes: 'Hidden ranger and druid enclave behind a waterfall off Qeynos Hills.',
    mapX: 13, mapY: 32
  },
  {
    id: 'halas',
    name: 'Halas',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['everfrost'],
    hotspots: [{ name: 'Icebound newbie yard (Everfrost side)', levels: '1-5' }],
    notes: 'Barbarian city on the frozen shores north of Everfrost Peaks.',
    mapX: 35, mapY: 8
  },
  {
    id: 'rivervale',
    name: 'Rivervale',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['misty-thicket', 'kithicor'],
    hotspots: [{ name: 'Misty Thicket wall yard', levels: '1-8' }],
    notes: 'Halfling burrow-town between the Misty Thicket and haunted Kithicor Forest.',
    mapX: 40, mapY: 37
  },
  {
    id: 'freeport',
    name: 'Freeport',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'neutral',
    connections: ['east-commonlands', 'north-ro', 'ocean-of-tears'],
    hotspots: [
      { name: 'Newbie yard (West gate)', levels: '1-5' },
      { name: 'Freeport sewers', levels: '3-8' }
    ],
    notes:
      'Eastern human port city, tolerant of most races. Boats sail across the Ocean of Tears to Butcherblock on Faydwer.',
    mapX: 66, mapY: 49
  },
  {
    id: 'neriak',
    name: 'Neriak',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'evil',
    connections: ['nektulos'],
    hotspots: [{ name: 'Foreign Quarter & Nektulos yard', levels: '1-5' }],
    notes: 'Subterranean dark elf city carved beneath the Nektulos Forest.',
    mapX: 67, mapY: 30
  },
  {
    id: 'grobb',
    name: 'Grobb',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'evil',
    connections: ['innothule'],
    hotspots: [{ name: 'Swamp newbie grounds (Innothule side)', levels: '1-6' }],
    notes: 'Troll mudhole on the edge of the Innothule Swamp.',
    mapX: 64, mapY: 90
  },
  {
    id: 'oggok',
    name: 'Oggok',
    continent: 'antonica',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'evil',
    connections: ['feerrott'],
    hotspots: [{ name: 'Feerrott newbie grounds', levels: '1-6' }],
    notes: 'Ogre stronghold in a box canyon off the Feerrott.',
    mapX: 42, mapY: 71
  },
  // ── Northwest: Qeynos region ───────────────────────────────
  {
    id: 'qeynos-hills',
    name: 'Qeynos Hills',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['qeynos', 'surefall-glade', 'blackburrow', 'west-karana'],
    hotspots: [
      { name: 'Gnoll spires & bandits', levels: '3-8' },
      { name: 'Blackburrow entrance', levels: '5-10', note: 'Gnolls stream out at night' }
    ],
    dangers: ['Undead and werewolves roam after dark near Fippy’s hill'],
    notes: 'Rolling farmland east of Qeynos; the classic western newbie zone.',
    mapX: 18, mapY: 37
  },
  {
    id: 'blackburrow',
    name: 'Blackburrow',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 5,
    levelMax: 15,
    connections: ['qeynos-hills', 'everfrost'],
    hotspots: [
      { name: 'Upper tunnels', levels: '5-9' },
      { name: 'Central chasm ledges', levels: '8-12' },
      { name: 'Lower den & elite guards', levels: '10-15' }
    ],
    dangers: ['The chasm — falling drops you into deep, angry water', 'Trains up the spiral ramps'],
    notes:
      'Gnoll warren connecting Qeynos Hills to Everfrost. The definitive first dungeon for western starters.',
    mapX: 23, mapY: 30
  },
  {
    id: 'everfrost',
    name: 'Everfrost Peaks',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 12,
    connections: ['halas', 'blackburrow', 'permafrost'],
    hotspots: [
      { name: 'Newbie ice caves & tundra', levels: '1-6' },
      { name: 'Orc & goblin camps', levels: '5-10' },
      { name: 'Ice giant ridge (far east)', levels: '30+', note: 'Do not wander east at low level' }
    ],
    dangers: ['Ice giants patrol the eastern reaches', 'Mammoths hit far harder than they look'],
    notes: 'Frozen tundra south of Halas; barbarian starting grounds.',
    mapX: 33, mapY: 16
  },
  {
    id: 'permafrost',
    name: 'Permafrost Keep',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 15,
    levelMax: 35,
    connections: ['everfrost'],
    hotspots: [
      { name: 'Goblin entrance halls', levels: '15-25' },
      { name: 'Ice giant chambers', levels: '28-35' },
      { name: 'Lady Vox’s lair', levels: '46+ raid', note: 'Dragon raid target' }
    ],
    dangers: ['Vox’s chamber — the dragon sees through everything', 'Tight corridors make trains lethal'],
    notes: 'Frozen goblin citadel and home of the dragon Lady Vox.',
    mapX: 40, mapY: 13
  },
  // ── The Karanas ────────────────────────────────────────────
  {
    id: 'west-karana',
    name: 'West Karana',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 5,
    levelMax: 15,
    connections: ['qeynos-hills', 'north-karana'],
    hotspots: [
      { name: 'Farmlands & bandit camps', levels: '5-10' },
      { name: 'Gnoll and brigand hills (east)', levels: '10-15' }
    ],
    dangers: ['A long, empty run — bind before crossing'],
    notes: 'Vast farmland plain; the western gateway to the Karanas.',
    mapX: 17, mapY: 48
  },
  {
    id: 'north-karana',
    name: 'North Karana',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 10,
    levelMax: 20,
    connections: ['west-karana', 'south-karana', 'east-karana'],
    hotspots: [
      { name: 'Griffin plains & lions', levels: '10-18', note: 'Classic quad-kiting field' },
      { name: 'Hermit’s pond area', levels: '12-18' }
    ],
    dangers: ['Griffins patrol the open plain and hit like bosses'],
    notes: 'Open plains at the crossroads of the Karanas.',
    mapX: 27, mapY: 43
  },
  {
    id: 'east-karana',
    name: 'East Karana',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 12,
    levelMax: 25,
    connections: ['north-karana', 'highpass', 'gorge-of-king-xorbb'],
    hotspots: [
      { name: 'Gorge mouth & lowland bandits', levels: '12-18' },
      { name: 'Highland cyclops & gnoll ravine', levels: '18-25' }
    ],
    dangers: ['The Rathe ridgeline spawns high-level giants'],
    notes: 'Rugged highlands rising toward Highpass Hold.',
    mapX: 38, mapY: 46
  },
  {
    id: 'south-karana',
    name: 'South Karana',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 15,
    levelMax: 30,
    connections: ['north-karana', 'lake-rathetear', 'splitpaw'],
    hotspots: [
      { name: 'Aviak village', levels: '15-24' },
      { name: 'Centaur & treant fields', levels: '18-28', note: 'Premier druid quad-kiting' },
      { name: 'Bandit camps near Splitpaw', levels: '20-28' }
    ],
    dangers: ['Roaming hill giants one-shot mid-level characters'],
    notes: 'Enormous savanna dotted with aviak towers and gnoll dens.',
    mapX: 28, mapY: 56
  },
  {
    id: 'splitpaw',
    name: 'Splitpaw Lair',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 20,
    levelMax: 35,
    connections: ['south-karana'],
    hotspots: [
      { name: 'Entrance tunnels', levels: '20-26' },
      { name: 'Inner den & chieftains', levels: '26-35' }
    ],
    dangers: ['Narrow tunnels, fast respawns'],
    notes: 'Gnoll-held burrow beneath South Karana.',
    mapX: 24, mapY: 61
  },
  // ── Highpass corridor ──────────────────────────────────────
  {
    id: 'highpass',
    name: 'Highpass Hold',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 12,
    levelMax: 25,
    connections: ['east-karana', 'kithicor', 'highkeep'],
    hotspots: [
      { name: 'Gnoll caves', levels: '12-18' },
      { name: 'Orc bandit gulch', levels: '15-22' }
    ],
    dangers: ['Cliff falls along the pass'],
    notes: 'Fortified mountain pass linking the Karanas to the eastern lands.',
    mapX: 50, mapY: 33
  },
  {
    id: 'highkeep',
    name: 'HighKeep',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 20,
    levelMax: 35,
    connections: ['highpass'],
    hotspots: [
      { name: 'Goblin cellars', levels: '20-30', note: 'Famous steady XP camps' },
      { name: 'Guard towers & nobles', levels: '25-35' }
    ],
    dangers: ['Killing guards ruins useful faction'],
    notes: 'Keep-turned-dungeon above Highpass; the goblin basement is legendary XP.',
    mapX: 53, mapY: 28
  },
  {
    id: 'kithicor',
    name: 'Kithicor Forest',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 30,
    levelMax: 45,
    connections: ['rivervale', 'highpass', 'west-commonlands'],
    hotspots: [
      { name: 'Undead woods (night)', levels: '30-45' },
      { name: 'Daytime bandits & wildlife', levels: '5-12', note: 'Only safe in daylight' }
    ],
    dangers: [
      'AT NIGHT THE DEAD RISE — high-level undead slaughter travelers',
      'Cross by day or hug the road at speed'
    ],
    notes: 'A cursed forest: trivial by day, deadly by night.',
    mapX: 54, mapY: 42
  },
  // ── Rivervale region ───────────────────────────────────────
  {
    id: 'misty-thicket',
    name: 'Misty Thicket',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['rivervale', 'runnyeye'],
    hotspots: [
      { name: 'Inside the wall', levels: '1-5' },
      { name: 'Beyond the wall: goblins & bixies', levels: '5-10' }
    ],
    notes: 'Halfling farmland split by a great wall; safe west, wilder east.',
    mapX: 44, mapY: 29
  },
  {
    id: 'runnyeye',
    name: 'Runnyeye Citadel',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 8,
    levelMax: 20,
    connections: ['misty-thicket', 'gorge-of-king-xorbb'],
    hotspots: [
      { name: 'Goblin upper halls', levels: '8-14' },
      { name: 'Pickclaw depths', levels: '12-20' }
    ],
    dangers: ['Evil eyes in the depths', 'Connects two regions — trains flow both ways'],
    notes: 'Goblin citadel bridging Misty Thicket and the Gorge of King Xorbb.',
    mapX: 47, mapY: 39
  },
  {
    id: 'gorge-of-king-xorbb',
    name: 'Gorge of King Xorbb',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 12,
    levelMax: 25,
    connections: ['east-karana', 'runnyeye'],
    hotspots: [
      { name: 'Minotaur caves', levels: '12-20' },
      { name: 'Evil eye ravine', levels: '18-25' }
    ],
    dangers: ['Evil eyes cast harsh spells and see invis'],
    notes: 'Ravine of minotaurs and beholders between East Karana and Runnyeye.',
    mapX: 46, mapY: 22
  },
  // ── The Commonlands & Freeport region ─────────────────────
  {
    id: 'west-commonlands',
    name: 'West Commonlands',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 5,
    levelMax: 15,
    connections: ['east-commonlands', 'kithicor', 'befallen'],
    hotspots: [
      { name: 'Orc camps & wisps', levels: '5-12' },
      { name: 'Befallen surface ruins', levels: '8-15' }
    ],
    dangers: ['Dervish cutthroat camps', 'Griffins wander in from the east'],
    notes: 'Open plains west of Freeport’s trade road.',
    mapX: 55, mapY: 47
  },
  {
    id: 'east-commonlands',
    name: 'East Commonlands',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['freeport', 'west-commonlands', 'nektulos'],
    hotspots: [
      { name: 'Orc camps 1 & 2 along the road', levels: '3-10' },
      { name: 'EC tunnel', levels: 'any', note: 'The traditional player bazaar' }
    ],
    dangers: ['Occasional griffin patrols on the plain'],
    notes: 'Freeport’s front yard and the busiest trade road in Norrath.',
    mapX: 60, mapY: 49
  },
  {
    id: 'befallen',
    name: 'Befallen',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 8,
    levelMax: 28,
    connections: ['west-commonlands'],
    hotspots: [
      { name: 'First floor crypts', levels: '8-12' },
      { name: 'Locked lower floors', levels: '12-20', note: 'Bring a rogue or a key' },
      { name: 'The new deepest halls', levels: '22-28', note: 'EQL: high-level dark elf population added May 2026, ruled by Baron Telyx V`Zher' }
    ],
    dangers: ['Undead see through regular invisibility', 'Locked doors can trap the unprepared', 'The new deep population is far above the classic zone level'],
    notes: 'A plague-ridden crypt beneath West Commonlands. Paladin and cleric heaven. EQL: every door is pickable with lockpicks — but they are not all the doors you may remember.',
    mapX: 52, mapY: 52
  },
  // ── Neriak / Lavastorm region ─────────────────────────────
  {
    id: 'nektulos',
    name: 'Nektulos Forest',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['neriak', 'east-commonlands', 'lavastorm'],
    hotspots: [
      { name: 'Newbie riverbanks', levels: '1-6' },
      { name: 'Shadow men & guards path', levels: '6-12' }
    ],
    dangers: ['Perpetual gloom — humans need light sources'],
    notes: 'Dark pine forest sheltering the entrance to Neriak.',
    mapX: 62, mapY: 35
  },
  {
    id: 'lavastorm',
    name: 'Lavastorm Mountains',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 15,
    levelMax: 25,
    connections: ['nektulos', 'soluseks-eye', 'nagafens-lair', 'najena'],
    hotspots: [
      { name: 'Lava basilisk fields', levels: '15-22' },
      { name: 'Fire goblin slopes', levels: '18-25' }
    ],
    dangers: ['Lava is instantly lethal — watch your footing'],
    notes: 'Volcanic wastes hiding the entrances to Najena and the Solusek dungeons.',
    mapX: 62, mapY: 20
  },
  {
    id: 'najena',
    name: 'Najena',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 15,
    levelMax: 25,
    connections: ['lavastorm'],
    hotspots: [
      { name: 'Entry halls & elementals', levels: '15-20' },
      { name: 'Najena’s inner sanctum', levels: '20-25', note: 'Key-and-door puzzle dungeon' }
    ],
    dangers: ['Locked doors — carry the keys or a lockpicker'],
    notes: 'The wizard Najena’s magma dungeon of elementals and dark elves.',
    mapX: 67, mapY: 24
  },
  {
    id: 'soluseks-eye',
    name: 'Solusek’s Eye (Sol A)',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 20,
    levelMax: 35,
    connections: ['lavastorm', 'nagafens-lair'],
    hotspots: [
      { name: 'Goblin bridges', levels: '20-28' },
      { name: 'Gnome works & deep halls', levels: '25-35' }
    ],
    dangers: ['Lava channels throughout', 'Long, mazelike — easy to get lost'],
    notes: 'Sprawling volcanic tunnels of fire goblins above Nagafen’s domain.',
    mapX: 66, mapY: 15
  },
  {
    id: 'nagafens-lair',
    name: 'Nagafen’s Lair (Sol B)',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 35,
    levelMax: 50,
    connections: ['lavastorm', 'soluseks-eye'],
    hotspots: [
      { name: 'Fire giant halls', levels: '40-50' },
      { name: 'Efreeti & imp chambers', levels: '35-45' },
      { name: 'Lord Nagafen’s lair', levels: '46+ raid', note: 'Dragon raid target' }
    ],
    dangers: ['Lord Nagafen — the definitive classic raid dragon', 'Fire giants patrol wide loops'],
    notes: 'The deep halls beneath Solusek’s Eye, ruled by the great red dragon.',
    mapX: 71, mapY: 19
  },
  // ── The Ro deserts ────────────────────────────────────────
  {
    id: 'north-ro',
    name: 'North Ro',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['freeport', 'oasis'],
    hotspots: [
      { name: 'Iksar encampment', levels: '1-6', note: 'EQL: Iksar starting camp on the shore' },
      { name: 'Orc camps & dunes', levels: '3-10' }
    ],
    dangers: ['Sand giants wander up from the south at times'],
    notes:
      'Northern desert of Ro below Freeport. In EverQuest Legends, the Iksar begin here at a shoreline encampment.',
    mapX: 59, mapY: 58
  },
  {
    id: 'oasis',
    name: 'Oasis of Marr',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 8,
    levelMax: 18,
    connections: ['north-ro', 'south-ro'],
    hotspots: [
      { name: 'Crocodile shores', levels: '8-14', note: 'The classic mid-teens camp' },
      { name: 'Deepwater goblins & specters', levels: '12-18' }
    ],
    dangers: ['Sand giants patrol the dunes', 'Specter isle is deadlier than it looks'],
    notes: 'Lush wetland in the desert’s heart — perpetual hunting party central.',
    mapX: 57, mapY: 69
  },
  {
    id: 'south-ro',
    name: 'South Ro',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 12,
    levelMax: 22,
    connections: ['oasis', 'innothule'],
    hotspots: [
      { name: 'Dervish & mummy camps', levels: '12-18' },
      { name: 'Ancient croc shore', levels: '15-22' }
    ],
    dangers: ['Sand giants and cyclopes roam the deep desert'],
    notes: 'Scorched southern desert running down to the Innothule Swamp.',
    mapX: 53, mapY: 78
  },
  // ── The southern swamps ───────────────────────────────────
  {
    id: 'innothule',
    name: 'Innothule Swamp',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['grobb', 'south-ro', 'feerrott', 'upper-guk'],
    hotspots: [
      { name: 'Troll newbie grounds', levels: '1-6' },
      { name: 'Frogloks & bog mobs near Guk', levels: '5-10' }
    ],
    dangers: ['The froglok king’s patrols near Guk’s mouth'],
    notes: 'Fetid swamp between Grobb and the ruins of Guk.',
    mapX: 58, mapY: 83
  },
  {
    id: 'upper-guk',
    name: 'Upper Guk',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 10,
    levelMax: 25,
    connections: ['innothule', 'lower-guk'],
    hotspots: [
      { name: 'Entrance halls & frog patrols', levels: '10-16' },
      { name: 'Live-side depths', levels: '15-25' }
    ],
    dangers: ['Water passages — know your air supply', 'Trains to the zone line are constant'],
    notes: 'The living half of the sunken froglok city.',
    mapX: 52, mapY: 85
  },
  {
    id: 'lower-guk',
    name: 'Lower Guk',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 30,
    levelMax: 50,
    connections: ['upper-guk', 'innothule'],
    hotspots: [
      { name: 'Dead-side camps', levels: '30-45' },
      { name: 'Frenzied ghoul & ghoul lord', levels: '45-50', note: 'Legendary loot camps' }
    ],
    dangers: ['Undead see invis', 'The deepest camps require a coordinated escape plan'],
    notes:
      'The undead depths of Guk — the most famous XP-and-loot dungeon of the classic era.',
    mapX: 47, mapY: 90
  },
  {
    id: 'feerrott',
    name: 'The Feerrott',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['oggok', 'innothule', 'cazic-thule', 'rathe-mountains', 'plane-of-fear'],
    hotspots: [
      { name: 'Ogre newbie grounds', levels: '1-6' },
      { name: 'Lizardman camps by the temple', levels: '6-12' }
    ],
    dangers: ['Spectres at the broken bridge', 'The Fear portal stone — do not touch it early'],
    notes: 'Overgrown jungle swamp hiding the temple of Cazic-Thule and the portal to Fear.',
    mapX: 28, mapY: 72
  },
  {
    id: 'cazic-thule',
    name: 'Cazic-Thule',
    continent: 'antonica',
    type: 'dungeon',
    levelMin: 20,
    levelMax: 40,
    connections: ['feerrott'],
    hotspots: [
      { name: 'Outer maze lizardmen', levels: '20-30' },
      { name: 'Temple interior & avatars', levels: '30-40' }
    ],
    dangers: ['The maze funnels trains directly onto you', 'Deep temple mobs cast fear'],
    notes: 'Ziggurat temple of the god of fear, held by fanatic lizardmen.',
    mapX: 33, mapY: 78
  },
  // ── The Rathe region ──────────────────────────────────────
  {
    id: 'rathe-mountains',
    name: 'Rathe Mountains',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 25,
    levelMax: 40,
    connections: ['feerrott', 'lake-rathetear'],
    hotspots: [
      { name: 'Froglok encampment', levels: '1-6', note: 'EQL: Froglok starting camp' },
      { name: 'Hill giant valley', levels: '28-38', note: 'Famous platinum farming' },
      { name: 'Cyclops & wurm slopes', levels: '30-40' }
    ],
    dangers: ['Hill giants flatten anyone under ~28 outside the newbie valley'],
    notes:
      'Giant-strewn peaks south of the lake. In EverQuest Legends, Frogloks begin at a protected camp here.',
    mapX: 32, mapY: 60
  },
  {
    id: 'lake-rathetear',
    name: 'Lake Rathetear',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 20,
    levelMax: 35,
    connections: ['rathe-mountains', 'south-karana', 'arena'],
    hotspots: [
      { name: 'Aviak isle & shore camps', levels: '20-28' },
      { name: 'Gnoll & goblin lakeside dens', levels: '25-35' }
    ],
    dangers: ['Deepwater sharks', 'Occasional giant wanders from the Rathes'],
    notes: 'Great mountain lake connecting the southern jungles to the Karana plains.',
    mapX: 33, mapY: 67
  },
  {
    id: 'arena',
    name: 'The Arena',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 50,
    connections: ['lake-rathetear'],
    excludeFromAdvisor: true,
    hotspots: [{ name: 'Dueling grounds', levels: 'any', note: 'Consensual PvP arena' }],
    notes: 'Neutral dueling grounds carved into the mountains by Lake Rathetear.',
    mapX: 32, mapY: 65
  },
  // ── Ocean ─────────────────────────────────────────────────
  {
    id: 'ocean-of-tears',
    name: 'Ocean of Tears',
    continent: 'antonica',
    type: 'outdoor',
    levelMin: 8,
    levelMax: 25,
    connections: ['freeport', 'butcherblock'],
    hotspots: [
      { name: 'Sister Isle & aviaks', levels: '8-18' },
      { name: 'Cyclops isle', levels: '20-28', note: 'Spiroc & cyclops camps' }
    ],
    dangers: ['Falling off the boat mid-ocean', 'Cyclops isle borders the boat route'],
    notes: 'Island-dotted sea crossed by the Freeport–Butcherblock ferry.',
    mapX: 74, mapY: 55
  }
];
