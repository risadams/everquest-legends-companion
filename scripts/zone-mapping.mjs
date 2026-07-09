// Shared app-zone-id -> ordered list of Brewall source {file, label} variants.
// Used by both import-maps.mjs (2D SVG) and import-maps-3d.mjs (WebGL wireframe).
// Per-zone entries pick the CLASSIC layout by hand (e.g. freportw/n/e, qeynos2/qeynos)
// to match what the Legends client ships — do not bulk-glob the folder.

export const MAPPING = {
  qeynos: [
    { file: 'qeynos2', label: 'North Qeynos' },
    { file: 'qeynos', label: 'South Qeynos' }
  ],
  'surefall-glade': [{ file: 'qrg', label: 'Surefall Glade' }],
  halas: [{ file: 'halas', label: 'Halas' }],
  rivervale: [{ file: 'rivervale', label: 'Rivervale' }],
  freeport: [
    { file: 'freportw', label: 'West Freeport' },
    { file: 'freportn', label: 'North Freeport' },
    { file: 'freporte', label: 'East Freeport' }
  ],
  neriak: [
    { file: 'neriaka', label: 'Foreign Quarter' },
    { file: 'neriakb', label: 'Commons' },
    { file: 'neriakc', label: 'Third Gate' }
  ],
  grobb: [{ file: 'grobb', label: 'Grobb' }],
  oggok: [{ file: 'oggok', label: 'Oggok' }],
  'qeynos-hills': [{ file: 'qeytoqrg', label: 'Qeynos Hills' }],
  blackburrow: [{ file: 'blackburrow', label: 'Blackburrow' }],
  everfrost: [{ file: 'everfrost', label: 'Everfrost Peaks' }],
  permafrost: [{ file: 'permafrost', label: 'Permafrost Keep' }],
  'west-karana': [{ file: 'qey2hh1', label: 'West Karana' }],
  'north-karana': [{ file: 'northkarana', label: 'North Karana' }],
  'east-karana': [{ file: 'eastkarana', label: 'East Karana' }],
  'south-karana': [{ file: 'southkarana', label: 'South Karana' }],
  splitpaw: [{ file: 'paw', label: 'Splitpaw Lair' }],
  highpass: [{ file: 'highpass', label: 'Highpass Hold' }],
  highkeep: [{ file: 'highkeep', label: 'HighKeep' }],
  kithicor: [{ file: 'kithicor', label: 'Kithicor Forest' }],
  'misty-thicket': [{ file: 'misty', label: 'Misty Thicket' }],
  runnyeye: [{ file: 'runnyeye', label: 'Runnyeye Citadel' }],
  'gorge-of-king-xorbb': [{ file: 'beholder', label: 'Gorge of King Xorbb' }],
  'west-commonlands': [{ file: 'commons', label: 'West Commonlands' }],
  'east-commonlands': [{ file: 'ecommons', label: 'East Commonlands' }],
  befallen: [{ file: 'befallen', label: 'Befallen' }],
  nektulos: [{ file: 'nektulos', label: 'Nektulos Forest' }],
  lavastorm: [{ file: 'lavastorm', label: 'Lavastorm Mountains' }],
  najena: [{ file: 'najena', label: 'Najena' }],
  'soluseks-eye': [{ file: 'soldunga', label: 'Solusek’s Eye' }],
  'nagafens-lair': [{ file: 'soldungb', label: 'Nagafen’s Lair' }],
  'north-ro': [{ file: 'nro', label: 'North Ro' }],
  oasis: [{ file: 'oasis', label: 'Oasis of Marr' }],
  'south-ro': [{ file: 'sro', label: 'South Ro' }],
  innothule: [{ file: 'innothule', label: 'Innothule Swamp' }],
  'upper-guk': [{ file: 'guktop', label: 'Upper Guk' }],
  'lower-guk': [{ file: 'gukbottom', label: 'Lower Guk' }],
  feerrott: [{ file: 'feerrott', label: 'The Feerrott' }],
  'cazic-thule': [{ file: 'cazicthule', label: 'Cazic-Thule' }],
  'rathe-mountains': [{ file: 'rathemtn', label: 'Rathe Mountains' }],
  'lake-rathetear': [{ file: 'lakerathe', label: 'Lake Rathetear' }],
  arena: [{ file: 'arena', label: 'The Arena' }],
  'ocean-of-tears': [{ file: 'oot', label: 'Ocean of Tears' }],
  kelethin: [{ file: 'gfaydark', label: 'Greater Faydark (Kelethin platforms)' }],
  felwithe: [
    { file: 'felwithea', label: 'North Felwithe' },
    { file: 'felwitheb', label: 'South Felwithe' }
  ],
  kaladim: [
    { file: 'kaladima', label: 'South Kaladim' },
    { file: 'kaladimb', label: 'North Kaladim' }
  ],
  'ak-anon': [{ file: 'akanon', label: 'Ak’Anon' }],
  'greater-faydark': [{ file: 'gfaydark', label: 'Greater Faydark' }],
  crushbone: [{ file: 'crushbone', label: 'Crushbone' }],
  'lesser-faydark': [{ file: 'lfaydark', label: 'Lesser Faydark' }],
  steamfont: [{ file: 'steamfont', label: 'Steamfont Mountains' }],
  butcherblock: [{ file: 'butcher', label: 'Butcherblock Mountains' }],
  'dagnors-cauldron': [{ file: 'cauldron', label: 'Dagnor’s Cauldron' }],
  unrest: [{ file: 'unrest', label: 'Estate of Unrest' }],
  'kedge-keep': [{ file: 'kedge', label: 'Kedge Keep' }],
  mistmoore: [{ file: 'mistmoore', label: 'Castle Mistmoore' }],
  erudin: [
    { file: 'erudnext', label: 'Erudin' },
    { file: 'erudnint', label: 'Erudin Palace' }
  ],
  paineel: [{ file: 'paineel', label: 'Paineel' }],
  toxxulia: [{ file: 'tox', label: 'Toxxulia Forest' }],
  'kerra-isle': [{ file: 'kerraridge', label: 'Kerra Isle' }],
  'eruds-crossing': [{ file: 'erudsxing', label: 'Erud’s Crossing' }],
  'the-warrens': [{ file: 'warrens', label: 'The Warrens' }],
  stonebrunt: [{ file: 'stonebrunt', label: 'Stonebrunt Mountains' }],
  'the-hole': [{ file: 'hole', label: 'The Hole' }],
  'plane-of-fear': [{ file: 'fearplane', label: 'Plane of Fear' }],
  'plane-of-hate': [
    { file: 'hateplane', label: 'Plane of Hate (classic)' },
    { file: 'hateplaneb', label: 'Plane of Hate (revamp)' }
  ],
  'plane-of-sky': [{ file: 'airplane', label: 'Plane of Sky' }]
};
