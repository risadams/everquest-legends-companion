import type { Race } from './types';

export const RACES: Race[] = [
  {
    id: 'barbarian',
    name: 'Barbarian',
    alignment: 'good',
    startingCity: 'Halas',
    startingZoneId: 'halas',
    traits: ['Slam (bash without a shield)', '+10 Cold Resist', 'Large size'],
    description:
      'Hardy northmen of Halas. Big health pools and Slam make them natural front-liners, and the Everfrost → Blackburrow corridor is a classic first ten levels.',
    allowedPrimaryClasses: ['warrior', 'rogue', 'shaman', 'berserker', 'beastlord']
  },
  {
    id: 'dark-elf',
    name: 'Dark Elf',
    alignment: 'evil',
    startingCity: 'Neriak',
    startingZoneId: 'neriak',
    traits: ['Hide', 'Ultravision', 'Broad caster class selection'],
    description:
      'The Teir’Dal of Neriak. The widest evil-race class list, innate Hide, and perfect darkness vision. Expect cold welcomes in good cities.',
    allowedPrimaryClasses: [
      'warrior', 'cleric', 'shadow-knight', 'rogue',
      'necromancer', 'wizard', 'magician', 'enchanter'
    ]
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    alignment: 'good',
    startingCity: 'Kaladim',
    startingZoneId: 'kaladim',
    traits: ['Infravision', '+5 Magic & Poison Resist', 'Stout stats for melee'],
    description:
      'Stoutfolk of Kaladim in the Butcherblock Mountains. Excellent resists and strength make dwarves durable melee of every stripe.',
    allowedPrimaryClasses: ['warrior', 'cleric', 'paladin', 'rogue', 'berserker']
  },
  {
    id: 'erudite',
    name: 'Erudite',
    alignment: 'neutral',
    startingCity: 'Erudin (or Paineel)',
    startingZoneId: 'erudin',
    traits: ['+5 Magic Resist', '-5 Disease Resist', 'Highest intelligence'],
    description:
      'Scholars of Odus with the highest intelligence in Norrath. Heretic Erudites (Shadow Knights, Necromancers) begin in Paineel instead of Erudin.',
    allowedPrimaryClasses: [
      'cleric', 'paladin', 'shadow-knight',
      'necromancer', 'wizard', 'magician', 'enchanter'
    ]
  },
  {
    id: 'froglok',
    name: 'Froglok',
    alignment: 'good',
    startingCity: 'Rathe Mountains camp',
    startingZoneId: 'rathe-mountains',
    traits: ['Superb swimming', 'Underwater breathing endurance', 'Nimble jumps'],
    description:
      'In EverQuest Legends, Frogloks begin at a camp in the Rathe Mountains. Unmatched swimmers — water zones like Kedge Keep hold no fear for them.',
    allowedPrimaryClasses: [
      'warrior', 'cleric', 'paladin', 'shadow-knight',
      'rogue', 'necromancer', 'wizard', 'shaman'
    ]
  },
  {
    id: 'gnome',
    name: 'Gnome',
    alignment: 'neutral',
    startingCity: 'Ak’Anon',
    startingZoneId: 'ak-anon',
    traits: ['Tinkering', 'Infravision', 'Small size (fits tight spots)'],
    description:
      'Clockwork-obsessed inventors of Ak’Anon. Tinkering is unique to gnomes, and their caster selection is nearly as broad as the dark elves’.',
    allowedPrimaryClasses: [
      'warrior', 'cleric', 'rogue',
      'necromancer', 'wizard', 'magician', 'enchanter'
    ]
  },
  {
    id: 'half-elf',
    name: 'Half Elf',
    alignment: 'neutral',
    startingCity: 'Freeport, Qeynos, Surefall Glade, or Kelethin',
    startingZoneId: 'freeport',
    traits: ['Infravision', 'Multiple starting cities', 'Balanced stats'],
    description:
      'Caught between worlds, half elves choose from several starting cities and take well to the wilderness classes.',
    allowedPrimaryClasses: ['warrior', 'paladin', 'ranger', 'druid', 'bard', 'rogue']
  },
  {
    id: 'halfling',
    name: 'Halfling',
    alignment: 'good',
    startingCity: 'Rivervale',
    startingZoneId: 'rivervale',
    traits: ['Hide & Sneak', 'Enhanced Forage', '+5 Disease & Poison Resist'],
    description:
      'Cheerful folk of Rivervale with rogue skills baked in at birth. The Misty Thicket wall is one of the safest starts in the game.',
    allowedPrimaryClasses: ['warrior', 'cleric', 'druid', 'rogue']
  },
  {
    id: 'high-elf',
    name: 'High Elf',
    alignment: 'good',
    startingCity: 'Felwithe',
    startingZoneId: 'felwithe',
    traits: ['Infravision', 'Highest wisdom/charisma blend', 'Prestigious faction'],
    description:
      'The Koada’Dal of Felwithe. A short but elite class list — the classic choice for clerics, paladins, and refined casters.',
    allowedPrimaryClasses: ['cleric', 'paladin', 'enchanter', 'magician', 'wizard']
  },
  {
    id: 'human',
    name: 'Human',
    alignment: 'neutral',
    startingCity: 'Freeport or Qeynos',
    startingZoneId: 'freeport',
    traits: ['Widest class selection (13)', 'No vision bonus — carry a light', 'Neutral factions'],
    description:
      'Norrath’s everymen, starting in Freeport or Qeynos. The widest class selection of any race and friendly factions nearly everywhere — the ideal beginner pick.',
    allowedPrimaryClasses: [
      'warrior', 'cleric', 'paladin', 'ranger', 'shadow-knight', 'druid',
      'monk', 'bard', 'rogue', 'necromancer', 'wizard', 'magician', 'enchanter'
    ]
  },
  {
    id: 'iksar',
    name: 'Iksar',
    alignment: 'evil',
    startingCity: 'North Ro encampment',
    startingZoneId: 'north-ro',
    traits: ['Enhanced HP regeneration', 'Superior natural AC', 'Forage & strong swimming'],
    description:
      'In EverQuest Legends the lizardfolk begin at a new encampment on the shores of North Ro. Hated nearly everywhere — even other evil races distrust them — but their regeneration is unmatched.',
    allowedPrimaryClasses: ['warrior', 'shadow-knight', 'shaman', 'monk', 'necromancer', 'beastlord']
  },
  {
    id: 'kerran',
    name: 'Kerran',
    alignment: 'neutral',
    startingCity: 'Kerra Isle',
    startingZoneId: 'kerra-isle',
    traits: ['Safe fall & feline agility', 'Infravision', 'Island start'],
    description:
      'Cat-folk beginning on Kerra Isle off the coast of Odus. Agile, spiritual, and at home with claw, drum, and totem alike.',
    allowedPrimaryClasses: ['warrior', 'rogue', 'shaman', 'bard', 'berserker', 'beastlord']
  },
  {
    id: 'ogre',
    name: 'Ogre',
    alignment: 'evil',
    startingCity: 'Oggok',
    startingZoneId: 'oggok',
    traits: ['Immune to frontal stuns', 'Slam', 'Largest size & highest strength'],
    description:
      'Hulking brutes of Oggok. Frontal stun immunity is the best tanking trait in the game — an ogre warrior never loses a swing to a bash.',
    allowedPrimaryClasses: ['warrior', 'shadow-knight', 'shaman', 'berserker', 'beastlord']
  },
  {
    id: 'troll',
    name: 'Troll',
    alignment: 'evil',
    startingCity: 'Grobb',
    startingZoneId: 'grobb',
    traits: ['Enhanced HP regeneration', 'Slam', 'Huge health pools'],
    description:
      'Swamp dwellers of Grobb whose regeneration keeps them swinging long after others sit. Feared and unwelcome in the good cities of Norrath.',
    allowedPrimaryClasses: ['warrior', 'shadow-knight', 'shaman', 'berserker', 'beastlord']
  },
  {
    id: 'wood-elf',
    name: 'Wood Elf',
    alignment: 'good',
    startingCity: 'Kelethin',
    startingZoneId: 'kelethin',
    traits: ['Forage', 'Hide', 'Infravision'],
    description:
      'The Feir’Dal of the treetop city of Kelethin in Greater Faydark. Natural scouts, archers, and songweavers — mind the drop from the platforms.',
    allowedPrimaryClasses: ['warrior', 'ranger', 'druid', 'bard', 'rogue']
  }
];

export const RACE_BY_ID: Record<string, Race> = Object.fromEntries(
  RACES.map((r) => [r.id, r])
);
