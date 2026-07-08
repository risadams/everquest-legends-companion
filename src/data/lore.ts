import type { Deity, LoreEra, LoreFigure } from './types';

// The history of Norrath as classic EverQuest tells it (which EQL recreates),
// condensed for adventurers who want to know whose ruins they're looting.

export const LORE_ERAS: LoreEra[] = [
  {
    id: 'age-of-scale',
    name: 'The Age of Scale',
    period: 'the dawn of Norrath',
    summary:
      'Before mortals, there was Veeshan. The Wurmqueen descended on the frozen south, raked her claws across the land to mark it as her own, and seeded Norrath with her brood.',
    events: [
      'Veeshan’s claws carve the great scars of the southern continent',
      'Dragonkind rules a young, empty world',
      'The other gods take notice of the Wurmqueen’s prize'
    ]
  },
  {
    id: 'elder-age',
    name: 'The Elder Age',
    period: 'the seeding of the races',
    summary:
      'The gods answered Veeshan’s claim by filling Norrath with children of their own — and then nearly destroyed it fighting over them.',
    events: [
      'Brell Serilis tunnels up from the Underfoot, hiding dwarves and gnomes beneath the mountains',
      'Tunare grows the elves; Innoruuk steals the first elven king and queen and twists them into the Teir`Dal',
      'Rallos Zek forges giants, ogres, orcs, and goblins for war',
      'Cazic-Thule shapes trolls and lizardmen in fear’s image; Prexus fills the seas; the Marr twins breathe honor and love into the barbarians of the north',
      'Rallos Zek’s ogre legions assault the very planes — the gods shatter their empire, curse their minds, and withdraw behind sealed planar gates'
    ]
  },
  {
    id: 'age-of-monuments',
    name: 'The Age of Monuments',
    period: 'empires of elf and man',
    summary:
      'Great civilizations rose, overreached, and fell — leaving the ruins and deserts your generation now hunts through.',
    events: [
      'The elven empire of Takish-Hiz blooms amid green fields where the Desert of Ro now burns — until Solusek Ro dries it to sand',
      'Humanity, descended from northern barbarians, spreads across Antonica',
      'The Combine Empire unites the known world under human banners — then vanishes almost overnight, its survivors scattered beyond the seas',
      'Guk, the great froglok city, begins its long slide into the swamp and the grip of the dead'
    ]
  },
  {
    id: 'age-of-enlightenment',
    name: 'The Age of Enlightenment',
    period: 'the flowering of magic',
    summary:
      'Erud led the brightest of humanity away from the "barbarism" of Antonica to found a city of pure intellect — which promptly had a civil war about it.',
    events: [
      'Erud’s exodus sails from Qeynos to Odus and raises the marble city of Erudin',
      'A generation of Erudites turns to necromancy; the Heretics’ war of magic blasts a crater into the world — The Hole',
      'The Heretics withdraw into Paineel; Erudin and Paineel wage a cold war across Toxxulia Forest to this day'
    ]
  },
  {
    id: 'age-of-turmoil',
    name: 'The Age of Turmoil',
    period: 'now — your age',
    summary:
      'This is the Norrath you were born into: young kingdoms, corrupt guards, stirring dragons, and planar gates creaking open. Nobody sensible calls it a golden age. It is a very good time to be an adventurer.',
    events: [
      'Antonius Bayle IV rules Qeynos while his brother Kane sells its underbelly to the Bloodsabers',
      'In Freeport, the Knights of Truth lose the city street by street to Sir Lucan’s Militia',
      'The dark elves’ great war ends at Bloody Kithicor — a forest so soaked in death that it belongs to the undead after sundown',
      'Lady Vox and Lord Nagafen, last great dragons of Antonica, stir beneath ice and fire',
      'Mortals breach the Planes of Fear and Hate, and eye the islands of Sky',
      'EverQuest Legends begins here — later eras (Sky, the Temple of Solusek Ro, and beyond toward Kunark and Velious) unlock as the world advances'
    ]
  }
];

export const LORE_DEITIES: Deity[] = [
  {
    id: 'bertoxxulous',
    name: 'Bertoxxulous',
    epithet: 'The Plaguebringer',
    alignment: 'evil',
    domain: 'Disease and decay',
    blurb:
      'The patron of rot regards every plague as a masterpiece. His Bloodsaber cult festers beneath Qeynos — the good city’s worst secret.',
    followers: 'Necromancers, shadow knights, and the Bloodsabers under Qeynos'
  },
  {
    id: 'brell-serilis',
    name: 'Brell Serilis',
    epithet: 'The Duke of Below',
    alignment: 'neutral',
    domain: 'The Underfoot — caves, mines, and everything beneath',
    blurb:
      'The first god to sneak children onto Norrath, planting them safely underground. Every tunnel is his temple.',
    followers: 'Dwarves of Kaladim, gnomes of Ak`Anon, and honest miners everywhere'
  },
  {
    id: 'bristlebane',
    name: 'Bristlebane Fizzlethrope',
    epithet: 'The King of Thieves',
    alignment: 'neutral',
    domain: 'Mischief, luck, and the perfect prank',
    blurb:
      'The trickster god plays jokes on mortals and deities alike. His faithful consider a well-picked pocket an act of worship.',
    followers: 'Halflings of Rivervale and rogues of every flag'
  },
  {
    id: 'cazic-thule',
    name: 'Cazic-Thule',
    epithet: 'The Faceless',
    alignment: 'evil',
    domain: 'Fear',
    blurb:
      'Terror given form. His lizardman fanatics hold his ziggurat in the Feerrott, and his actual home — the Plane of Fear — is the most dreaded raid target of the age.',
    followers: 'Trolls, ogres, lizardmen, and shadow knights who understand terror',
    planeZoneId: 'plane-of-fear'
  },
  {
    id: 'erollisi-marr',
    name: 'Erollisi Marr',
    epithet: 'The Queen of Love',
    alignment: 'good',
    domain: 'Love and passion',
    blurb:
      'Twin sister of Mithaniel. Her priests of Freeport hold that anything worth doing is done for love — including a well-aimed hammer.',
    followers: 'Priests of Marr in Freeport, barbarians, and hopeless romantics'
  },
  {
    id: 'innoruuk',
    name: 'Innoruuk',
    epithet: 'The Prince of Hate',
    alignment: 'evil',
    domain: 'Hate',
    blurb:
      'He stole the first elven monarchs and spent three centuries remaking them into the Teir`Dal. Dark elf society is his cathedral; the Plane of Hate is his throne.',
    followers: 'The dark elves of Neriak, and clerics who preach spite as scripture',
    planeZoneId: 'plane-of-hate'
  },
  {
    id: 'karana',
    name: 'Karana',
    epithet: 'The Rainkeeper',
    alignment: 'neutral',
    domain: 'Storms and the harvest',
    blurb:
      'The plains that bear his name feed half of Antonica. Farmers bless him for the rain; travelers curse him for the lightning.',
    followers: 'Plainsfolk, druids, rangers, and half the farmers of Karana'
  },
  {
    id: 'mithaniel-marr',
    name: 'Mithaniel Marr',
    epithet: 'The Lightbearer',
    alignment: 'good',
    domain: 'Valor and honor',
    blurb:
      'Twin brother of Erollisi and patron of the Knights of Truth. The frogloks are his chosen people — their courage in Guk’s fall moved even the gods.',
    followers: 'Paladins, the Knights of Truth of Freeport, and the froglok faithful'
  },
  {
    id: 'prexus',
    name: 'Prexus',
    epithet: 'The Oceanlord',
    alignment: 'neutral',
    domain: 'The seas',
    blurb:
      'Master of everything below the waterline. Sailors tithe before every crossing of the Ocean of Tears, just in case.',
    followers: 'Erudite Deepwater Knights, kedge, and every sailor with sense'
  },
  {
    id: 'quellious',
    name: 'Quellious',
    epithet: 'The Tranquil',
    alignment: 'good',
    domain: 'Peace and self-perfection',
    blurb:
      'A child-god of perfect stillness. Her monks pursue enlightenment one flying kick at a time.',
    followers: 'The Silent Fist monks of Freeport and Erudite scholars'
  },
  {
    id: 'rallos-zek',
    name: 'Rallos Zek',
    epithet: 'The Warlord',
    alignment: 'evil',
    domain: 'War',
    blurb:
      'Forged the ogres, giants, orcs, and goblins as weapons — and lost them all when his legions stormed the planes and the gods struck back. He considers the curse a lesson in losing.',
    followers: 'Ogres, warriors, berserkers, and anyone who solves problems with an axe'
  },
  {
    id: 'rodcet-nife',
    name: 'Rodcet Nife',
    epithet: 'The Prime Healer',
    alignment: 'good',
    domain: 'Health and healing',
    blurb:
      'Patron of Qeynos, whose Temple of Life turns no wounded soul away. The Bloodsabers beneath the city exist specifically to spite him.',
    followers: 'The Priests of Life of Qeynos and healers of every stripe'
  },
  {
    id: 'solusek-ro',
    name: 'Solusek Ro',
    epithet: 'The Burning Prince',
    alignment: 'neutral',
    domain: 'Sun and flame',
    blurb:
      'He dried the elven homeland into the Desert of Ro on a whim. Wizards court his favor; the volcanic halls of Lavastorm burn in his name.',
    followers: 'Wizards, and the flame-tenders of the Temple of Solusek Ro'
  },
  {
    id: 'the-tribunal',
    name: 'The Tribunal',
    epithet: 'The Six Hammers',
    alignment: 'neutral',
    domain: 'Justice — as written, not as wished',
    blurb:
      'Six masked judges who care nothing for good or evil, only for the law and the oath. Their verdicts are final in every sense.',
    followers: 'Barbarian shamans of Halas and magistrates across Norrath'
  },
  {
    id: 'tunare',
    name: 'Tunare',
    epithet: 'The Mother of All',
    alignment: 'good',
    domain: 'Nature and growth',
    blurb:
      'Mother of the elves and patron of the living wild. The Faydark itself is counted among her children.',
    followers: 'High elves of Felwithe, wood elves of Kelethin, rangers, and druids'
  },
  {
    id: 'veeshan',
    name: 'Veeshan',
    epithet: 'The Wurmqueen',
    alignment: 'neutral',
    domain: 'Dragonkind and the sky',
    blurb:
      'The first claimant of Norrath, mother of dragons, utterly indifferent to lesser races. Her brood’s eye watches over the floating islands of Sky.',
    followers: 'Dragonkind — mortals worship her only from a very safe distance',
    planeZoneId: 'plane-of-sky'
  }
];

export const LORE_FIGURES: LoreFigure[] = [
  {
    id: 'antonius-bayle',
    name: 'Antonius Bayle IV',
    title: 'Ruler of Qeynos',
    zoneId: 'qeynos',
    blurb:
      'Fourth of his name and the closest thing Antonica has to a just king. His guards keep the west honest — most of them, anyway.'
  },
  {
    id: 'kane-bayle',
    name: 'Kane Bayle',
    title: 'The corrupt brother',
    zoneId: 'qeynos',
    blurb:
      'Antonius’s brother sold the city’s underbelly to the Bloodsabers. Half the Qeynos guard answers to him, and the other half doesn’t know it yet.'
  },
  {
    id: 'lucan-dlere',
    name: 'Sir Lucan D`Lere',
    title: 'Lord of the Freeport Militia',
    zoneId: 'freeport',
    blurb:
      'Once a Knight of Truth, now the strongman of Freeport. He killed the paladin who raised him and took the city street by street. The Knights want it back.'
  },
  {
    id: 'lady-vox',
    name: 'Lady Vox',
    title: 'The White Dragon',
    zoneId: 'permafrost',
    blurb:
      'Ancient ice dragon frozen into the heart of Permafrost, hoarding the north’s treasures. The first true test of any raid force — see the Bestiary for the fight.'
  },
  {
    id: 'lord-nagafen',
    name: 'Lord Nagafen',
    title: 'The Red Dragon',
    zoneId: 'nagafens-lair',
    blurb:
      'The fire beneath Solusek’s mountains. Legend says he and Vox were lovers once, imprisoned apart by the gods to prevent a brood that could end the world.'
  },
  {
    id: 'mayong-mistmoore',
    name: 'Mayong Mistmoore',
    title: 'Master of the castle',
    zoneId: 'mistmoore',
    blurb:
      'The vampire lord of Faydwer’s haunted castle. Elven parents use his name to frighten children; the children grow up and raid his home for gear.'
  },
  {
    id: 'phinigel-autropos',
    name: 'Phinigel Autropos',
    title: 'The last kedge',
    zoneId: 'kedge-keep',
    blurb:
      'Sole survivor of Prexus’s ancient aquatic race, brooding at the bottom of his sunken keep. His magic — and his loot — draw raiders who can hold their breath.'
  },
  {
    id: 'emperor-crush',
    name: 'Emperor Crush',
    title: 'Warlord of Crushbone',
    zoneId: 'crushbone',
    blurb:
      'The orc emperor whose belts every Faydwer soldier collects bounties on. Not a deep thinker; extremely effective at his one job.'
  },
  {
    id: 'najena',
    name: 'Najena',
    title: 'The elementalist',
    zoneId: 'najena',
    blurb:
      'A dark elf wizard who carved her own dungeon into Lavastorm and staffed it with bound elementals. Her magic-sealed doors made "bring a lockpicker" a proverb.'
  },
  {
    id: 'kazon-stormhammer',
    name: 'King Kazon Stormhammer',
    title: 'King under Kaladim',
    zoneId: 'kaladim',
    blurb:
      'The dwarven king whose Stormguard holds the mountains against Crushbone. Pays good coin for orc belts and better coin for loyalty.'
  },
  {
    id: 'thex-monarchs',
    name: 'Tearis & Cristanos Thex',
    title: 'The sundered crowns',
    zoneId: 'felwithe',
    blurb:
      'King Tearis Thex rules high elf Felwithe; Queen Cristanos Thex rules dark elf Neriak. The same royal line — one branch kept by Tunare, one remade by Innoruuk. Family reunions are wars.'
  },
  {
    id: 'ak-anon-xv',
    name: 'King Ak`Anon XV',
    title: 'The clockwork throne',
    zoneId: 'ak-anon',
    blurb:
      'The gnome king who long ago transferred his mind into a clockwork body. Whether the machine still holds the king, or only remembers him, is Ak`Anon’s politest argument.'
  },
  {
    id: 'fippy-darkpaw',
    name: 'Fippy Darkpaw',
    title: 'The most persistent gnoll alive',
    zoneId: 'qeynos-hills',
    blurb:
      'Charges the Qeynos gate, dies, and comes back to do it again. Nobody knows if it’s always the same gnoll. Killing him is every Qeynos newbie’s rite of passage.'
  }
];

/** second-person origin notes: how each race fits into the world */
export const RACE_LORE: Record<string, string> = {
  barbarian:
    'You come down from Halas, where the Wolves of the North count wealth in scars and the Tribunal’s law is the only law that survives the cold. The soft southern cities call your people savages — usually from a respectful distance.',
  'dark-elf':
    'You are Teir`Dal, hate-forged royalty of Neriak. Innoruuk remade your ancestors from stolen elven kings, and you carry that grudge as a birthright. The surface races fear you, which is exactly as it should be.',
  dwarf:
    'You were raised in Kaladim under Brell’s mountain, where every tunnel is scripture and every orc at the gate is a tithe waiting to be collected. The Stormguard pays for Crushbone belts; you intend to get rich.',
  erudite:
    'You left the "barbarism" of mainland humanity generations ago when Erud sailed for Odus. Erudin’s marble libraries are your inheritance — along with the cold war against the Heretics of Paineel that split your people.',
  froglok:
    'Your people lost Guk to the undead and never lost their faith. Mithaniel Marr himself honors froglok courage, and EQL begins your story at the camp in the Rathe Mountains — a people in exile, not in defeat.',
  gnome:
    'You tinkered your way out of Ak`Anon with grease on your hands and a design in your head that is definitely, probably, mostly safe. Brell made your people curious; the clockwork king made you ambitious.',
  'half-elf':
    'You belong to two worlds and are trusted by neither — human enough for Freeport, elven enough for Kelethin, at home mostly on the road between them. Adventuring is the one trade that never asks for a pedigree.',
  halfling:
    'You grew up in Rivervale, where the Guardians of the Vale keep the goblins out and Bristlebane keeps everyone humble. The world beyond the Misty Thicket is enormous and full of unattended valuables.',
  'high-elf':
    'You are Koada`Dal of Felwithe, keeper of the oldest grudge on Norrath: what Innoruuk did to your royal line. Tunare’s grace is your birthright; proving worthy of it is your problem.',
  human:
    'You are heir to the Combine Empire — the empire nobody remembers falling. Whether you start in honest Qeynos or Lucan’s Freeport, humanity’s short lives and long ambitions make your people the restless center of the Age of Turmoil.',
  iksar:
    'You are a stranger from a far shore, an exile of a lizardman empire the mainland knows only from sailors’ stories. The North Ro encampment is your foothold; everything west of it distrusts your scales on sight.',
  kerran:
    'You come from Kerra Isle, where your people keep their own counsel and their own ways. Erudin’s High Guard calls your isle primitive; your shamans call Erudin a fancy box full of people who can’t fish.',
  ogre:
    'You are Rallos Zek’s finest work, dulled by the gods’ curse but never weakened. Oggok raised you simple and strong, and the Feerrott’s bouncers taught you the only philosophy you need: guard the door, smash what comes.',
  troll:
    'You crawled out of Grobb hungry, which is the natural state of trolls. Cazic-Thule gets your prayers, Da Bashers get your fists, and everything slower than you in Innothule gets eaten.',
  'wood-elf':
    'You were born in the treetops of Kelethin, Tunare’s child, raised on platform edges that would kill a clumsy race. The Faydark below is your hunting ground and Crushbone’s orcs are your rent collectors.'
};
