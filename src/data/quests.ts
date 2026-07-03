import type { Quest } from './types';

// Curated classic-era quests. Names and details follow classic EverQuest,
// which EQL recreates — expect small differences while the beta settles.

export const QUESTS: Quest[] = [
  // ── Repeatable leveling turn-ins ──────────────────────────
  {
    id: 'crushbone-belts',
    name: 'Crushbone Belts',
    type: 'turn-in',
    startZoneId: 'kaladim',
    giver: 'Storm Guard soldiers, Kaladim',
    levelMin: 5,
    levelMax: 16,
    forAlignments: ['good', 'neutral'],
    forClasses: [],
    summary:
      'Collect belts from Crushbone orcs and turn them in to the dwarven Storm Guard in Kaladim in stacks. The definitive Faydwer leveling loop: hunt Crushbone, bank in Kaladim, repeat.',
    reward: 'Superb experience through the mid-teens, coin, and Storm Guard faction',
    repeatable: true
  },
  {
    id: 'crushbone-pads',
    name: 'Crushbone Shoulderpads',
    type: 'turn-in',
    startZoneId: 'kelethin',
    giver: 'Faydark’s Champions, Kelethin',
    levelMin: 5,
    levelMax: 16,
    forAlignments: ['good', 'neutral'],
    forClasses: [],
    summary:
      'Orc legionnaires and centurions in Crushbone drop shoulderpads; the rangers of Kelethin pay for every set. Runs alongside the belt loop if you hunt deeper in the keep.',
    reward: 'Experience, coin, and Kelethin faction',
    repeatable: true
  },
  {
    id: 'gnoll-fangs',
    name: 'Gnoll Fangs',
    type: 'turn-in',
    startZoneId: 'qeynos',
    giver: 'Captain Tillin, Qeynos militia',
    levelMin: 3,
    levelMax: 12,
    forAlignments: ['good', 'neutral'],
    forClasses: [],
    summary:
      'Blackburrow gnolls drop fangs; the Qeynos militia wants proof of every kill. The classic western leveling loop — Qeynos Hills and Blackburrow feed it endlessly.',
    reward: 'Experience, coin, and Qeynos faction',
    repeatable: true
  },
  {
    id: 'bone-chips',
    name: 'Bone Chips for Kaladim',
    type: 'turn-in',
    startZoneId: 'kaladim',
    giver: 'The clerics of Kaladim',
    levelMin: 1,
    levelMax: 15,
    forAlignments: ['good', 'neutral'],
    forClasses: [],
    summary:
      'Every skeleton in Norrath drops bone chips, and the dwarven clergy buys them four at a time. Save every chip from level 1 — they convert directly into experience.',
    reward: 'Experience and dwarven faction',
    repeatable: true
  },
  {
    id: 'deathfist-belts',
    name: 'Deathfist Slashed Belts',
    type: 'turn-in',
    startZoneId: 'freeport',
    giver: 'The Freeport Militia',
    levelMin: 3,
    levelMax: 12,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'Deathfist orcs in East Commonlands and North Ro carry slashed belts; the corrupt Freeport Militia pays for them no questions asked. One of the few turn-ins evil races can use freely.',
    reward: 'Experience, coin, and Freeport Militia faction',
    repeatable: true
  },
  {
    id: 'lightstones',
    name: 'Lightstones for the Gypsies',
    type: 'turn-in',
    startZoneId: 'north-ro',
    giver: 'The gypsy camp, North Ro dunes',
    levelMin: 5,
    levelMax: 15,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'Wisps across the Commonlands and Karanas drop lightstones. The desert gypsies trade for every one — greater lightstones fetch a premium. Neutral to everyone, even trolls.',
    reward: 'Experience, coin, and useful trinkets',
    repeatable: true
  },
  {
    id: 'highpass-scalps',
    name: 'Gnoll Scalps for Highpass',
    type: 'turn-in',
    startZoneId: 'highpass',
    giver: 'The guards of Highpass Hold',
    levelMin: 12,
    levelMax: 20,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'The gnolls infesting the pass have a bounty on their heads. Hunt the caves below the hold and cash in scalps between pulls.',
    reward: 'Experience, coin, and Highpass faction (useful for everyone)',
    repeatable: true
  },
  // ── Iconic items & quest lines ────────────────────────────
  {
    id: 'journeymans-boots',
    name: 'Journeyman’s Boots',
    type: 'item',
    startZoneId: 'najena',
    giver: 'Drelzna (drop) / Hasten Bootstrutter, Rathe Mountains (quest)',
    levelMin: 18,
    levelMax: 30,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'Permanent run speed on clickable boots — the single biggest quality-of-life item of the era. Drelzna in Najena’s crypt drops them; Hasten Bootstrutter’s quest line in the Rathe Mountains (built around the Ancient Cyclops’ golden idol from South Ro) is the other road.',
    reward: 'Journeyman’s Boots — clickable run speed, forever',
    repeatable: false
  },
  {
    id: 'soulfire',
    name: 'SoulFire',
    type: 'class',
    startZoneId: 'freeport',
    giver: 'The Priests of Marr, Freeport',
    levelMin: 20,
    levelMax: 40,
    forAlignments: ['good', 'neutral'],
    forClasses: ['paladin'],
    summary:
      'The great Freeport paladin quest line: prove your devotion to Mithaniel Marr, uncover the corruption of Sir Lucan D’Lere, and face what the city’s guard has become. A story quest as famous as its sword.',
    reward: 'SoulFire — the classic paladin blade (clickable heals)',
    repeatable: false
  },
  {
    id: 'ghoulbane',
    name: 'Ghoulbane',
    type: 'class',
    startZoneId: 'lower-guk',
    giver: 'The Ghoul Lord (drop)',
    levelMin: 35,
    levelMax: 50,
    forAlignments: ['good', 'neutral'],
    forClasses: ['paladin'],
    summary:
      'The undead-slaying blade of legend, carried by the Ghoul Lord in Lower Guk’s dead side. Assemble a group that can hold the camp and the sword is yours.',
    reward: 'Ghoulbane — massive bonus damage against the undead',
    repeatable: false
  },
  {
    id: 'stein-of-moggok',
    name: 'The Stein of Moggok',
    type: 'item',
    startZoneId: 'oggok',
    giver: 'The ogres of Oggok',
    levelMin: 15,
    levelMax: 30,
    forAlignments: ['evil', 'neutral'],
    forClasses: ['enchanter', 'magician', 'necromancer', 'wizard', 'shaman'],
    summary:
      'An errand chain that starts in the ogre city and winds across Antonica, ending in one of the era’s best caster off-hand items. One of the few famous quests that favors evil-aligned characters.',
    reward: 'Stein of Moggok — top-tier intelligence off-hand',
    repeatable: false
  },
  {
    id: 'robe-of-oracle',
    name: 'Robe of the Oracle',
    type: 'item',
    startZoneId: 'ocean-of-tears',
    giver: 'The Oracle of K`Arnon (drop)',
    levelMin: 25,
    levelMax: 40,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: ['enchanter', 'magician', 'necromancer', 'wizard'],
    summary:
      'A lone seer on an Ocean of Tears island wears the most coveted caster robe of the mid-game. Take the boat, take a friend, take his robe.',
    reward: 'Robe of the Oracle — iconic INT caster robe',
    repeatable: false
  },
  {
    id: 'fbss',
    name: 'Flowing Black Silk Sash',
    type: 'item',
    startZoneId: 'lower-guk',
    giver: 'The Frenzied Ghoul (drop)',
    levelMin: 40,
    levelMax: 50,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: ['warrior', 'monk', 'rogue', 'berserker', 'ranger', 'bard', 'beastlord'],
    summary:
      'The haste belt every melee dreams about, held by the Frenzied Ghoul in Lower Guk. Expect competition for the camp — it defined “contested spawn” for a generation.',
    reward: 'FBSS — attack speed haste, the melee chase item of the era',
    repeatable: false
  },
  {
    id: 'guise',
    name: 'Guise of the Deceiver',
    type: 'item',
    startZoneId: 'lower-guk',
    giver: 'A ghoul assassin (drop)',
    levelMin: 35,
    levelMax: 50,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'A mask that cloaks the wearer in a dark elf illusion — equal parts useful (faction tricks) and legendary (bragging rights). Drops from the ghoul assassin in Lower Guk.',
    reward: 'Guise of the Deceiver — clickable dark elf illusion',
    repeatable: false
  },
  {
    id: 'pegasus-cloak',
    name: 'Pegasus Feather Cloak',
    type: 'item',
    startZoneId: 'south-karana',
    giver: 'Quillmane (drop)',
    levelMin: 28,
    levelMax: 45,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'Quillmane, the rare pegasus of South Karana, drops the game’s signature levitation cloak. Bring tracking or bring patience — mostly patience.',
    reward: 'Pegasus Feather Cloak — clickable levitation',
    repeatable: false
  },
  {
    id: 'efreeti-boots',
    name: 'Golden Efreeti Boots',
    type: 'item',
    startZoneId: 'nagafens-lair',
    giver: 'Efreeti Lord Djarn (drop)',
    levelMin: 44,
    levelMax: 50,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: ['monk', 'warrior', 'rogue', 'berserker', 'beastlord'],
    summary:
      'The efreeti chamber in Nagafen’s Lair holds the endgame melee boot camp. A disciplined group can hold it for hours; monks in particular treat these as a pilgrimage.',
    reward: 'Golden Efreeti Boots — elite AC and stats',
    repeatable: false
  },
  {
    id: 'dwarven-work-boots',
    name: 'Dwarven Work Boots',
    type: 'item',
    startZoneId: 'unrest',
    giver: 'Garanel Rucksif (drop)',
    levelMin: 20,
    levelMax: 32,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'The mad dwarf ghost of the Estate of Unrest walks the halls in boots worth killing him for. A natural bonus while you level through the house.',
    reward: 'Dwarven Work Boots — excellent mid-game footwear',
    repeatable: false
  },
  {
    id: 'dragoon-dirk',
    name: 'Dragoon Dirk',
    type: 'item',
    startZoneId: 'crushbone',
    giver: 'Ambassador DVinn (drop)',
    levelMin: 8,
    levelMax: 18,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: ['rogue', 'warrior', 'ranger', 'bard', 'shadow-knight'],
    summary:
      'The dark elf ambassador in Crushbone carries the best low-level piercer on Faydwer. Camp the castle until he shows.',
    reward: 'Dragoon Dirk — outstanding early piercing weapon',
    repeatable: false
  },
  {
    id: 'guild-armor',
    name: 'Hometown Guild Armor',
    type: 'class',
    startZoneId: 'qeynos',
    giver: 'Your class guildmaster (every starting city)',
    levelMin: 5,
    levelMax: 20,
    forAlignments: ['good', 'neutral', 'evil'],
    forClasses: [],
    summary:
      'Every class guild in every starting city runs an armor quest series — collect materials from your region’s hunting grounds and forge your first real set. Ask your guildmaster and check the combine recipes before you sell anything odd-looking.',
    reward: 'A full set of class-appropriate armor with stats',
    repeatable: false
  }
];

export const QUESTS_BY_ZONE: Record<string, Quest[]> = {};
for (const q of QUESTS) {
  (QUESTS_BY_ZONE[q.startZoneId] ??= []).push(q);
}

export const QUEST_TYPE_LABELS: Record<Quest['type'], string> = {
  'turn-in': 'Repeatable turn-in',
  item: 'Iconic item',
  class: 'Class quest'
};
