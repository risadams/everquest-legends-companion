import type { Faction } from './types';

// Significant classic-era factions, curated from eqlwiki.com's faction pages
// (Category:Significant Factions, June 2026). Kunark/Velious factions are
// out of era and omitted until those eras unlock.

export const FACTIONS: Faction[] = [
  // ── Qeynos ─────────────────────────────────────────────────
  {
    id: 'guards-of-qeynos',
    name: 'Guards of Qeynos',
    homeZoneIds: ['qeynos', 'qeynos-hills', 'surefall-glade'],
    description:
      'The good guards of Qeynos, loyal to Antonius Bayle against his corrupt brother Kane, the roguish Circle of Unseen Hands, and the Bloodsaber cult.',
    raise: [
      'Kill Blackburrow gnolls and the bandits of the Qeynos hinterlands',
      'Dozens of city quests: Bone Chips, Bandit Sashes, Blackburrow Stout Shipment'
    ],
    rivals: ['corrupt-qeynos-guards']
  },
  {
    id: 'corrupt-qeynos-guards',
    name: 'Corrupt Qeynos Guards',
    homeZoneIds: ['qeynos'],
    description:
      'Kane Bayle’s crooked half of the Qeynos guard, in bed with the Bloodsabers beneath the aqueducts.',
    raise: ['Bloodsaber and aqueduct quest lines on the wrong side of the law'],
    rivals: ['guards-of-qeynos'],
    warning:
      'Working for the good guards and Priests of Life will sink this faction — expect cold shoulders in the underbelly.'
  },
  {
    id: 'priests-of-life',
    name: 'Priests of Life',
    homeZoneIds: ['qeynos'],
    description:
      'The cleric and paladin guild of Rodcet Nife, keepers of the Temple of Life in Qeynos.',
    raise: ['Aegis of Life, Bear Hide Armor, and other temple quests', 'Crush the undead of the region']
  },

  // ── Halas ──────────────────────────────────────────────────
  {
    id: 'wolves-of-the-north',
    name: 'Wolves of the North',
    homeZoneIds: ['halas', 'everfrost'],
    description:
      'The warriors of Halas under Kylan O’Danos, allied with the Merchants of Halas and the Steel Warriors of Qeynos and Freeport.',
    raise: [
      'Turn in Blackburrow Gnoll Fangs to Lysbith McNaff — no rogue-faction penalty on this one'
    ],
    rivals: ['rogues-of-the-white-rose']
  },
  {
    id: 'rogues-of-the-white-rose',
    name: 'Rogues of the White Rose',
    homeZoneIds: ['halas'],
    description: 'The Halas rogue guild under Dun McDowell, keeping to a quiet neutrality.',
    raise: ['Rogue guild quests in Halas'],
    rivals: ['wolves-of-the-north'],
    warning:
      'The Halas banker is on this faction. Grind enough warrior and merchant guild quests and you will be unable to bank in Halas.'
  },
  {
    id: 'merchants-of-halas',
    name: 'Merchants of Halas',
    homeZoneIds: ['halas'],
    description: 'The shopkeepers of the barbarian capital.',
    raise: ['Merchant errand quests around Halas and Everfrost']
  },

  // ── Freeport ───────────────────────────────────────────────
  {
    id: 'the-freeport-militia',
    name: 'The Freeport Militia',
    homeZoneIds: ['freeport', 'east-commonlands'],
    description:
      'The rather corrupt guard of Freeport — the muscle that makes an evil-aligned visitor feel almost welcome.',
    raise: [
      'Deathfist Slashed Belts (evil version)',
      'Cutthroat Rings and Gnoll Scalp Collecting'
    ],
    rivals: ['knights-of-truth']
  },
  {
    id: 'knights-of-truth',
    name: 'Knights of Truth',
    homeZoneIds: ['freeport'],
    description:
      'Paladins of Mithaniel Marr in the Hall of Truth, keeping North Freeport safe and actively opposing the Militia and their Dismal Rage allies.',
    raise: ['Corrupt Guards, Bard Reports, and other Hall of Truth quests'],
    rivals: ['the-freeport-militia']
  },

  // ── Rivervale & Neriak ─────────────────────────────────────
  {
    id: 'guardians-of-the-vale',
    name: 'Guardians of the Vale',
    homeZoneIds: ['rivervale', 'misty-thicket'],
    description:
      'Sheriff Roglio’s deputy-warriors (the masks are Zorro-esque, but they are warriors, not rogues), defending the Vale from Clan Runnyeye and the Pickclaw goblins.',
    raise: ['Kill Runnyeye and Misty Thicket goblins', 'Errands for Mayor Gubbin’s folk']
  },
  {
    id: 'dreadguard-outer',
    name: 'Dreadguard Outer',
    homeZoneIds: ['neriak', 'nektulos'],
    description:
      'The dark elf guards of Neriak’s Foreign Quarter — the faction that decides whether a non-Teir`Dal may walk the city at all.',
    raise: ['Kill halfling spies and infiltrators (Neriak, Rivervale, Najena)'],
    warning: 'Essential faction for evil-aligned outsiders who want to shop in Neriak.'
  },

  // ── Grobb & Oggok ──────────────────────────────────────────
  {
    id: 'da-bashers',
    name: 'Da Bashers',
    homeZoneIds: ['grobb', 'innothule'],
    description:
      'Grobb’s warrior guild. Bashers strong. Bashers hate the Broken Skull Clan, who not strong like Da Bashers.',
    raise: ['Ranjor’s basher quests in Grobb', 'Bounties on Innothule frogloks']
  },
  {
    id: 'oggok-guards',
    name: 'Oggok Guards',
    homeZoneIds: ['oggok', 'feerrott'],
    description:
      'The ogre bouncers out in the Feerrott (the ones inside Oggok are on the separate Clurg faction).',
    raise: ['Bounty quests on Feerrott lizardmen']
  },

  // ── Odus ───────────────────────────────────────────────────
  {
    id: 'high-guard-of-erudin',
    name: 'High Guard of Erudin',
    homeZoneIds: ['erudin', 'toxxulia'],
    description:
      'Erudin’s guards — all paladins, since Erudites cannot be warriors. They consider Clan Kolbok a grave threat and are hated on Kerra Isle.',
    raise: ['Erudin city quests', 'Kill Heretic agents in Toxxulia Forest'],
    rivals: ['heretics']
  },
  {
    id: 'heretics',
    name: 'Heretics',
    homeZoneIds: ['paineel', 'the-warrens', 'stonebrunt'],
    description:
      'The necromantic exiles of Paineel, at open war with Erudin — Toxxulia Forest is their battleground.',
    raise: ['Kill kobolds in the Warrens and Stonebrunt Mountains'],
    rivals: ['high-guard-of-erudin']
  },

  // ── Faydwer ────────────────────────────────────────────────
  {
    id: 'storm-guard',
    name: 'Storm Guard',
    homeZoneIds: ['kaladim', 'butcherblock'],
    description:
      'The dwarven army of Kaladim, sworn enemies of the Crushbone orcs and allied with the halflings of the Vale.',
    raise: ['Crushbone Belts turn-in in Kaladim', 'Kill Butcherblock and Crushbone orcs']
  },
  {
    id: 'faydarks-champions',
    name: 'Faydark’s Champions',
    homeZoneIds: ['kelethin', 'greater-faydark'],
    description: 'The ranger protectors of Kelethin, watching the treetop platforms and the forest floor below.',
    raise: ['Crushbone Belts turn-in in Kelethin', 'Kill orcs of the Faydarks']
  },
  {
    id: 'king-ak-anon',
    name: 'King Ak`Anon',
    homeZoneIds: ['ak-anon', 'steamfont'],
    description: 'The gnome king’s court and the loyal clockworks of the mechanized city.',
    raise: ['Bounty quests on Steamfont minotaurs and kobolds']
  },
  {
    id: 'keepers-of-the-art',
    name: 'Keepers of the Art',
    homeZoneIds: ['felwithe'],
    description: 'The high elf casters’ guilds of Felwithe, guardians of high magic.',
    raise: ['Errands and turn-ins for the Felwithe mage guilds']
  },

  // ── Highpass ───────────────────────────────────────────────
  {
    id: 'highpass-guards',
    name: 'Highpass Guards',
    homeZoneIds: ['highpass', 'highkeep'],
    description:
      'The guards of Highhold — corrupt like most human guard factions, paid off by the local mob boss Carson McCabe, and friendly with the Militia and Corrupt Qeynos Guards.',
    raise: ['Kill the gnolls infesting Highpass Hold', 'Smuggling errands for McCabe’s people']
  }
];

export const FACTION_BY_ID: Record<string, Faction> = Object.fromEntries(
  FACTIONS.map((f) => [f.id, f])
);
