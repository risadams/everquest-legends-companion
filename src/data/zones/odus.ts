import type { Zone } from '../types';

export const ODUS_ZONES: Zone[] = [
  {
    id: 'erudin',
    name: 'Erudin',
    continent: 'odus',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'good',
    connections: ['toxxulia', 'eruds-crossing'],
    hotspots: [{ name: 'Docks & city library', levels: '1-5' }],
    notes: 'Gleaming city of the Erudites; boats sail to Qeynos across Erud’s Crossing.',
    mapX: 52, mapY: 31
  },
  {
    id: 'paineel',
    name: 'Paineel',
    continent: 'odus',
    type: 'city',
    levelMin: 1,
    levelMax: 5,
    cityAlignment: 'evil',
    connections: ['toxxulia', 'the-hole', 'the-warrens'],
    hotspots: [{ name: 'Heretic newbie grounds', levels: '1-6' }],
    notes: 'City of the heretic Erudites, built above the yawning pit of The Hole.',
    mapX: 45, mapY: 72
  },
  {
    id: 'toxxulia',
    name: 'Toxxulia Forest',
    continent: 'odus',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 10,
    connections: ['erudin', 'paineel', 'kerra-isle'],
    hotspots: [
      { name: 'Kobold camps', levels: '1-8' },
      { name: 'Riverbank snakes & fungoids', levels: '3-10' }
    ],
    dangers: ['Dense fog and winding paths — easy to get lost'],
    notes: 'Murky forest covering southern Odus between the two Erudite cities.',
    mapX: 45, mapY: 52
  },
  {
    id: 'kerra-isle',
    name: 'Kerra Isle',
    continent: 'odus',
    type: 'outdoor',
    levelMin: 1,
    levelMax: 15,
    connections: ['toxxulia'],
    hotspots: [
      { name: 'Kerran village', levels: '1-6', note: 'EQL: Kerran starting grounds' },
      { name: 'Wild shores & caves', levels: '5-15' }
    ],
    notes:
      'Island home of the cat-folk off the Odus coast. In EverQuest Legends this is the Kerran starting zone.',
    mapX: 20, mapY: 60
  },
  {
    id: 'eruds-crossing',
    name: 'Erud’s Crossing',
    continent: 'odus',
    type: 'outdoor',
    levelMin: 10,
    levelMax: 20,
    connections: ['erudin', 'qeynos'],
    hotspots: [
      { name: 'Kerran island (mid-ocean)', levels: '10-18' },
      { name: 'Shipwreck shallows', levels: '12-20' }
    ],
    dangers: ['Jumping ship mid-crossing strands you with the sharks'],
    notes: 'The sea lane between Odus and Antonica, broken by a volcanic kerran isle.',
    mapX: 82, mapY: 36
  },
  {
    id: 'the-warrens',
    name: 'The Warrens',
    continent: 'odus',
    type: 'dungeon',
    levelMin: 5,
    levelMax: 15,
    connections: ['paineel', 'stonebrunt'],
    hotspots: [
      { name: 'Kobold tunnels', levels: '5-12' },
      { name: 'Deep chambers & the king', levels: '10-16' }
    ],
    dangers: ['Fast respawns — do not overextend'],
    notes: 'Kobold warren linking Paineel to the Stonebrunt Mountains.',
    mapX: 53, mapY: 80
  },
  {
    id: 'stonebrunt',
    name: 'Stonebrunt Mountains',
    continent: 'odus',
    type: 'outdoor',
    levelMin: 15,
    levelMax: 30,
    connections: ['the-warrens'],
    hotspots: [
      { name: 'Panther slopes & apes', levels: '15-24' },
      { name: 'Highland gorillas & kobold camps', levels: '20-30' }
    ],
    dangers: ['Steep cliffs; the peaks hold far older things'],
    notes: 'Misty green mountains of eastern Odus, reached through the Warrens.',
    mapX: 63, mapY: 73
  },
  {
    id: 'the-hole',
    name: 'The Hole',
    continent: 'odus',
    type: 'dungeon',
    levelMin: 40,
    levelMax: 50,
    connections: ['paineel'],
    hotspots: [
      { name: 'Upper ruins of Old Paineel', levels: '40-46' },
      { name: 'The depths & Master Yael', levels: '46-50', note: 'Raid-caliber named' }
    ],
    dangers: ['The initial drop — plan your entry and your exit', 'Everything sees invis'],
    notes: 'The ruins of Old Paineel, sunk into a pit that reaches toward the Underfoot. Endgame dungeon.',
    mapX: 32, mapY: 79
  }
];
