import type { Zone } from '../types';

export const PLANES_ZONES: Zone[] = [
  {
    id: 'plane-of-fear',
    name: 'Plane of Fear',
    continent: 'planes',
    type: 'plane',
    levelMin: 46,
    levelMax: 50,
    connections: ['feerrott'],
    hotspots: [
      { name: 'The broken maze & portal area', levels: '46-50', note: 'Break-in is the hardest part' },
      { name: 'Cazic-Thule’s temple', levels: '50 raid' }
    ],
    dangers: [
      'Fear itself — everything casts it',
      'A failed break-in litters the plane with corpses; go with a full raid'
    ],
    notes:
      'Cazic-Thule’s domain, entered through the portal stone in the Feerrott. Classic endgame raid plane.',
    mapX: 30, mapY: 60
  },
  {
    id: 'plane-of-hate',
    name: 'Plane of Hate',
    continent: 'planes',
    type: 'plane',
    levelMin: 46,
    levelMax: 50,
    connections: [],
    hotspots: [
      { name: 'Lower city', levels: '46-50' },
      { name: 'Innoruuk’s keep', levels: '50 raid' }
    ],
    dangers: ['Reached only by teleport — a bad port drop means instant death', 'Everything is undead or worse'],
    notes:
      'Innoruuk’s twisted city, reached via wizard portals or special items rather than a zone line.',
    mapX: 50, mapY: 30
  },
  {
    id: 'plane-of-sky',
    name: 'Plane of Sky',
    continent: 'planes',
    type: 'plane',
    levelMin: 46,
    levelMax: 50,
    connections: [],
    hotspots: [
      { name: 'Island progression', levels: '46-50 raid', note: 'Keyed island-by-island ascent' }
    ],
    dangers: ['Falling off an island drops you out of the plane', 'Strict progression — islands unlock in order'],
    notes:
      'Floating islands above Norrath, reached by teleport. The most structured raid content of the classic era.',
    mapX: 70, mapY: 15
  }
];
