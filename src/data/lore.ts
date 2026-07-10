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
    domain: 'Disease, decay, and the beauty of rot',
    image: '/deities/bertoxxulous.webp',
    blurb:
      'The patron of rot regards every plague as a masterpiece. His Bloodsaber cult festers beneath Qeynos — the good city’s worst secret.',
    lore:
      'To the faithful of the Plaguebringer, the only truth on Norrath is that everything dies, and the slow corruption of flesh is the highest beauty — the purple of a fresh bruise, the yellow-green sheen of infection, the patient work of the grave. They do not seek death, their own least of all: they mean to live long, painful lives spreading pestilence in his name, and many take up necromancy to surround themselves with things that rot even in undeath. His Bloodsabers burrow beneath Qeynos in direct spite of Rodcet Nife’s Temple of Life, making the "safe" good city one of Norrath’s quiet horrors.',
    followers: 'Necromancers, shadow knights, and the Bloodsabers who plot beneath Qeynos'
  },
  {
    id: 'brell-serilis',
    name: 'Brell Serilis',
    epithet: 'The Duke of Below',
    alignment: 'neutral',
    domain: 'The Underfoot — caves, mines, and all that lies beneath',
    image: '/deities/brell-serilis.webp',
    blurb:
      'The first god to sneak children onto Norrath, planting them safely underground. Every tunnel is his temple.',
    lore:
      'Brell holds that the surface is a waste of open space and that true contentment is found in the caves and tunnels that riddle Norrath’s belly — the one thing all his squabbling children agree on. And they do squabble: the dwarves of Kaladim know themselves his true heirs, yet the Runnyeye goblins claim him as father, and the gnolls of Paw insist he sculpted them from the sacred Clay of Cosgrove. He was the god who first slipped mortal races onto the world hidden beneath the mountains, out of reach of the gods who would have warred over them, and his hand shows in half the underground peoples of Norrath.',
    followers: 'Dwarves of Kaladim, gnomes of Ak`Anon, and honest miners everywhere'
  },
  {
    id: 'bristlebane',
    name: 'Bristlebane Fizzlethrope',
    epithet: 'The King of Thieves',
    alignment: 'neutral',
    domain: 'Mischief, luck, and the perfect prank',
    image: '/deities/bristlebane.webp',
    blurb:
      'The trickster god plays jokes on mortals and deities alike. His faithful consider a well-picked pocket an act of worship.',
    lore:
      'The King of Thieves preaches fun at nearly all else’s expense, and his flock — bards, rogues, jesters, gamblers, and gypsies — strive to be charming, clever, and quick-fingered. A practical joke, to them, is the highest ritual; mischief in every form is devotion. Few are truly wicked, but keep one eye on your purse when they are near, and never sit down to a hand of King’s Court against one. His home is the enigmatic Plane of Mischief, where the god himself can occasionally be heard laughing at a joke only he understands.',
    followers: 'Halflings of Rivervale, and rogues and gamblers of every flag'
  },
  {
    id: 'cazic-thule',
    name: 'Cazic-Thule',
    epithet: 'The Faceless',
    alignment: 'evil',
    domain: 'Fear',
    image: '/deities/cazic-thule.webp',
    blurb:
      'Terror given form. His lizardman fanatics hold his ziggurat in the Feerrott, and his actual home — the Plane of Fear — is the most dreaded raid target of the age.',
    lore:
      'Cazicites do not love the Faceless — they fear him, and believe that only by sowing terror in others can they be spared his wrath. Their faith is a machine for suppressing hope: pain, misery, torture, and living sacrifice are its sacraments. The lizardman tribes of the Feerrott are his oldest devout, holding the great ziggurat that bears his name, but his humanoid patrons multiply, a cold shadow spreading over the bright places of Norrath. His true seat is the Plane of Fear, the "Feared Lands" that a raid enters knowing the god of terror set every trap personally.',
    followers: 'Trolls, ogres, lizardmen, and shadow knights who understand terror',
    planeZoneId: 'plane-of-fear'
  },
  {
    id: 'erollisi-marr',
    name: 'Erollisi Marr',
    epithet: 'The Queen of Love',
    alignment: 'good',
    domain: 'Love and passion',
    image: '/deities/erollisi-marr.webp',
    blurb:
      'Twin sister of Mithaniel. Her faithful hold that anything worth doing is done for love — including a well-aimed hammer.',
    lore:
      'The Queen of Love teaches that love conquers all — but her worshippers are no pacifists. They would have a world without violence, yet are not naive about the one they live in, and hold passionate love for people, places, and ideals they will fight and die to protect. The dream of every follower is to fall in selfless defense of something they cherish. Many paladins hear her calling beneath the clang of battle, and with her twin brother Mithaniel she anchors the honorable half of the house of Marr against the darkness their era keeps producing.',
    followers: 'Paladins, priests of Marr, barbarians, and those who love fiercely'
  },
  {
    id: 'innoruuk',
    name: 'Innoruuk',
    epithet: 'The Prince of Hate',
    alignment: 'evil',
    domain: 'Hate',
    image: '/deities/innoruuk.webp',
    blurb:
      'He stole the first elven monarchs and spent three centuries remaking them into the Teir`Dal. Dark elf society is his cathedral; the Plane of Hate is his throne.',
    lore:
      'The Prince of Hate is father to nearly the entire dark elf race, and his doctrine names hatred not as a vice but as the creative force of the universe — for creation is born of destruction. Love and mercy are, to his faithful, the crutches of the ignorant and the cowardly; only through utter contempt for one’s enemies can one gain true power over them. They believe, in complete earnest, that if they could only hate hard enough they would unmake all of Norrath. He forged his people by stealing the first elven king and queen and torturing their spirits for three centuries into the Teir`Dal, and he rules still from the Plane of Hate.',
    followers: 'The dark elves of Neriak, and clerics who preach spite as scripture',
    planeZoneId: 'plane-of-hate'
  },
  {
    id: 'karana',
    name: 'Karana',
    epithet: 'The Rainkeeper',
    alignment: 'neutral',
    domain: 'Storms and the harvest',
    image: '/deities/karana.webp',
    blurb:
      'The plains that bear his name feed half of Antonica. Farmers bless him for the rain; travelers curse him for the lightning.',
    lore:
      'The Rainkeeper’s faithful worship the absolute power of the storm — the life-giving rain and the destroying force of the hurricane alike. They are rural folk, farmers and ranchers and hunters, humble and generous, quick to offer a stranger shelter from the weather and slow to forgive any disrespect toward Karana or his work. Many live as nomads, going where the winds carry them, secure in the belief that it is only through his wisdom and restraint that all Norrath is not swept away in one eternal tempest. The great plains of Antonica bear his name because they are, in a real sense, his congregation.',
    followers: 'Plainsfolk, druids, rangers, and the farmers of the Karanas'
  },
  {
    id: 'mithaniel-marr',
    name: 'Mithaniel Marr',
    epithet: 'The Lightbearer',
    alignment: 'good',
    domain: 'Valor and honor',
    image: '/deities/mithaniel-marr.webp',
    blurb:
      'Twin brother of Erollisi and patron of the Knights of Truth. The frogloks are his chosen people — their courage moved even the gods.',
    lore:
      'The Lightbearer holds that valor is the line between the civilized and the beast, and his followers keep a strict code of truth, honor, and charity — champions of the downtrodden and the most noble of warriors, forever sacrificing themselves to scour Norrath of the dark and evil. They take their duty gravely and have little patience for mischief. Many paladins are his sworn servants, the Knights of Truth of Freeport chief among them; and the frogloks are his chosen people, lifted up for the courage they showed even as Guk fell around them.',
    followers: 'Paladins, the Knights of Truth of Freeport, and the froglok faithful'
  },
  {
    id: 'prexus',
    name: 'Prexus',
    epithet: 'The Oceanlord',
    alignment: 'neutral',
    domain: 'The seas and the deep',
    image: '/deities/prexus.webp',
    blurb:
      'Master of everything below the waterline. Sailors tithe before every crossing of the Ocean of Tears, just in case.',
    lore:
      'The Oceanlord’s faithful believe true power sleeps in the black depths of Norrath’s seas — that life first stirred in the murk and that one day the oceans will rise again to embrace the worthy and drown the rest. They live and work on or beneath the water, spreading his word and defending the seas from any who would foul them. Sailors and fishermen make up much of his flock. His oldest servants are the kedge — the ancient aquatic people of Kedge Keep, of whom Phinigel Autropos is the last — remnants of a drowned civilization that keeps his faith to this day.',
    followers: 'Erudite Deepwater Knights, the kedge, and every sailor with sense'
  },
  {
    id: 'quellious',
    name: 'Quellious',
    epithet: 'The Tranquil',
    alignment: 'good',
    domain: 'Peace and self-perfection',
    image: '/deities/quellious.webp',
    blurb:
      'A serene child-god of perfect stillness. Her monks pursue enlightenment one flying kick at a time.',
    lore:
      'The peace the Tranquil offers is an inner one. Her followers are not strict pacifists — they will fight to defend themselves and those they love — but the war they truly wage is against their own ignorance. They thirst to know themselves and the world completely, and to help others reach the same understanding, certain that if every creature fully understood itself and its neighbors there would be no cause left for conflict. Many live as wandering seekers, and her monastic orders pursue that self-mastery through a discipline of body and mind that just happens to break boards and jaws along the way.',
    followers: 'Monks of the Silent Fist and Erudite scholars'
  },
  {
    id: 'rallos-zek',
    name: 'Rallos Zek',
    epithet: 'The Warlord',
    alignment: 'evil',
    domain: 'War and conquest',
    image: '/deities/rallos-zek.webp',
    blurb:
      'Forged the ogres, giants, orcs, and goblins as weapons — and lost them all when his legions stormed the planes and the gods struck back.',
    lore:
      'The Warlord’s creed is the survival of the strong and the extinction of the weak: the universe was forged in conflict and in conflict it will end, and the victors will feast on the fallen. No honor is paid the dead, for had they been worthy their hearts would still be beating. His followers are almost all warriors, and his firstborn are the ogres, orcs, goblins, and giants he forged as an army — the Shamen of War in Oggok his most loyal. When those legions marched on the planes themselves, the gods shattered the empire, cursed the giants’ and ogres’ minds to dullness, and taught the god of war his one lesson in losing.',
    followers: 'Ogres, giants, warriors, berserkers, and anyone who settles things with an axe'
  },
  {
    id: 'rodcet-nife',
    name: 'Rodcet Nife',
    epithet: 'The Prime Healer',
    alignment: 'good',
    domain: 'Health and healing',
    image: '/deities/rodcet-nife.webp',
    blurb:
      'Patron of Qeynos, whose Temple of Life turns no wounded soul away. The Bloodsabers beneath the city exist specifically to spite him.',
    lore:
      'Those who take the Nife Oath swear to fight disease and death until one or the other finally takes them. They are humble and generous, asking little of those they save but that the kindness be passed on, and they refuse to merely treat suffering after the fact — they hunt its sources, striking at plague and undeath where they breed. Healers and mystics fill his temples, but noble rangers and paladins take the Oath too. They believe that through faith in the Prime Healer the wounded heart of the universe will one day be mended and death’s shadow lifted for good — which is exactly why Bertoxxulous plants his Bloodsabers directly beneath Rodcet’s Temple of Life in Qeynos.',
    followers: 'The Priests of Life of Qeynos and healers of every stripe'
  },
  {
    id: 'solusek-ro',
    name: 'Solusek Ro',
    epithet: 'The Burning Prince',
    alignment: 'neutral',
    domain: 'Sun, fire, and elemental flame',
    image: '/deities/solusek-ro.webp',
    blurb:
      'He dried the elven homeland into the Desert of Ro on a whim. Wizards court his favor; the volcanic halls of Lavastorm burn in his name.',
    lore:
      'The Burning Prince’s faithful believe in the raw, unbridled power of fire: fire birthed the world and in fire it will end, and aggressive action is the only honest way to get what you want. They fear little, say what they mean and do what they say, and neither possess nor desire social grace — they demand the respect of their peers and, often enough, earn it. Those who chase true elemental power turn to his burning embrace, which is why so many wizards are his, and his volcanic Temple in the halls of Lavastorm burns as testament to a god who once dried the green elven homeland into the Desert of Ro to prove a point.',
    followers: 'Wizards, and the flame-tenders of the Temple of Solusek Ro'
  },
  {
    id: 'the-tribunal',
    name: 'The Tribunal',
    epithet: 'The Six Hammers',
    alignment: 'neutral',
    domain: 'Justice — as written, not as wished',
    image: '/deities/the-tribunal.webp',
    blurb:
      'Six masked judges who care nothing for good or evil, only for the law and the oath. Their verdicts are final in every sense.',
    lore:
      'Above all the faithful of the Tribunal want justice — but true believers recognize no earthly court, enforcing the Tribunal’s absolute judgment on the world themselves. Retribution, vengeance, and punishment are sacred duties, carried out with cold method and patience. And they must be careful, for their own creed damns them: should they punish an innocent, the Six Hammers will pass sentence in turn and doom them to an eternity of torment. It is a faith with no mercy and no appeal, popular among the hard barbarian shamans of Halas and any magistrate who has stopped believing in second chances.',
    followers: 'Barbarian shamans of Halas and magistrates across Norrath'
  },
  {
    id: 'tunare',
    name: 'Tunare',
    epithet: 'The Mother of All',
    alignment: 'good',
    domain: 'Nature, growth, and the living world',
    image: '/deities/tunare.webp',
    blurb:
      'Mother of the elves and patron of the living wild. The Faydark itself is counted among her children.',
    lore:
      'The children of Tunare believe that Norrath is itself a living, breathing being — and that the world gave birth to Tunare, from whom in turn all life sprang. So to tend and protect the land is to honor the Mother of their Mother, who protects and provides for them in return. They will fight to the death for nature in any of its forms, and count the great forests among their kin — the Faydark most of all. Many druids and rangers walk her paths, and a great many elves, for she is mother to their whole line, the light half of the elven story that Innoruuk’s theft could not erase.',
    followers: 'High elves of Felwithe, wood elves of Kelethin, rangers, and druids'
  },
  {
    id: 'veeshan',
    name: 'Veeshan',
    epithet: 'The Wurmqueen',
    alignment: 'neutral',
    domain: 'Dragonkind and the sky',
    image: '/deities/veeshan.webp',
    blurb:
      'The first claimant of Norrath, mother of dragons, utterly indifferent to lesser races. Her brood’s eye watches over the floating islands of Sky.',
    lore:
      'The Wurmqueen came first, before the other gods took interest in the young world, and raked her claws across the frozen south to brand Norrath as hers and seed it with her brood. Her non-dragon faithful hold dragonkind supreme over all other life and swear themselves — sometimes their loved ones — to her children, and are rewarded with riches and ancient knowledge at a steep price: the certain knowledge that they are less than cattle to the wurms, spared only as long as it amuses them. Most serve anyway, counting the service its own reward, while the great dragons of Norrath remember that they were here first.',
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
    image: '/npcs/antonius-bayle.webp',
    blurb:
      'Fourth of his name and the closest thing Antonica has to a just king. His guards keep the west honest — most of them, anyway.',
    lore:
      'The Bayle line has held Qeynos since the city was raised on the ruins the Combine left behind, and Antonius IV rules it as a genuine believer in the old ideal of a free, orderly city. He keeps faith with Rodcet Nife’s Temple of Life, tolerates every good-aligned race at his gates, and is beloved enough that his people mostly don’t notice how much of the city his brother Kane already owns. His reign is the calm surface of the Age of Turmoil — and the crack running through it has his own family name on it.'
  },
  {
    id: 'kane-bayle',
    name: 'Kane Bayle',
    title: 'The corrupt brother',
    zoneId: 'qeynos',
    image: '/npcs/kane-bayle.webp',
    blurb:
      'Antonius’s brother sold the city’s underbelly to the Bloodsabers. Half the Qeynos guard answers to him, and the other half doesn’t know it yet.',
    lore:
      'Passed over for the throne, Kane made his own kingdom in the aqueducts and back rooms of Qeynos, throwing in with the Bloodsabers — the plague-cult of Bertoxxulous that festers directly beneath his brother’s Temple of Life. His network of bribed guards and paid informants makes the "safe" good city quietly one of the most treacherous starts in Norrath, and the tangle of quests around his conspiracy is many a Qeynos rogue’s first taste of real intrigue.'
  },
  {
    id: 'lucan-dlere',
    name: 'Sir Lucan D`Lere',
    title: 'Lord of the Freeport Militia',
    zoneId: 'freeport',
    image: '/npcs/lucan-dlere.webp',
    blurb:
      'Once a Knight of Truth, now the strongman of Freeport. He killed the paladin who raised him and took the city street by street. The Knights want it back.',
    lore:
      'Lucan was raised a paladin of Mithaniel Marr in the Knights of Truth, then broke his oath, cut down the mentor who trained him, and forged the Freeport Militia into a private army. Where Qeynos hides its rot, Freeport wears it openly: Lucan’s Militia runs the streets, taxes the docks, and hunts the surviving Knights of Truth block by block. To the ambitious he is opportunity and to the honorable he is the enemy — either way he is the reason the eastern city is the go-to home for players who’d rather be feared than trusted.'
  },
  {
    id: 'lady-vox',
    name: 'Lady Vox',
    title: 'The White Dragon',
    zoneId: 'permafrost',
    image: '/npcs/lady-vox.webp',
    blurb:
      'Ancient ice dragon frozen into the heart of Permafrost, hoarding the north’s treasures. The first true test of any raid force — see the Bestiary for the fight.',
    lore:
      'Vox was cast out of the Claws of Veeshan — the great dragon nation — for conspiring with Lord Nagafen to breed a second prismatic dragon like the legendary Kerafyrm, a union the wurmkind feared could unmake the world. The gods answered by imprisoning the two lovers at opposite poles of Antonica, she in the ice of Permafrost and he in the fire beneath Solusek’s mountain, so their broods could never meet. Alongside Nagafen and Phinigel she is one of EverQuest’s three original raid dragons, and defeating her behind the ice-giant halls remains the classic benchmark for a guild coming of age.'
  },
  {
    id: 'lord-nagafen',
    name: 'Lord Nagafen',
    title: 'The Red Dragon',
    zoneId: 'nagafens-lair',
    image: '/npcs/lord-nagafen.webp',
    blurb:
      'The fire beneath Solusek’s mountains. Legend says he and Vox were lovers once, imprisoned apart by the gods to prevent a brood that could end the world.',
    lore:
      'The fire-breathing lord of the lava tunnels below Lavastorm is the single most iconic monster in EverQuest — he glowered from the original box art and defined what a raid dragon was. Like Lady Vox he was exiled by dragonkind for the plot to breed another Kerafyrm, and sealed away from her in the deepest halls of Sol B. He guards a hoard that includes the Cloak of Flames and the dragonscale a whole server covets, and a careless pull of his lair still teaches new raiders exactly what an enrage and a point-blank Lava Breath do to an unprepared force.'
  },
  {
    id: 'mayong-mistmoore',
    name: 'Mayong Mistmoore',
    title: 'Master of the castle',
    zoneId: 'mistmoore',
    image: '/npcs/mayong-mistmoore.webp',
    blurb:
      'The vampire lord of Faydwer’s haunted castle. Elven parents use his name to frighten children; the children grow up and raid his home for gear.',
    lore:
      'Mayong was an ancient elf who, by means no one living remembers, was cursed to become the first vampire — making him one of the two oldest non-dragon beings on Norrath, matched in age only by the last Kedge, Phinigel Autropos. From his castle on the edge of Lesser Faydark he has spun a web of spies and thralls that reaches across nearly every continent, patient in the way only the deathless can be. Adventurers know him as the prize at the bottom of a beautiful, deadly dungeon; Norrath’s powers should probably know him as one of its quietest long-game schemers.'
  },
  {
    id: 'phinigel-autropos',
    name: 'Phinigel Autropos',
    title: 'The last kedge',
    zoneId: 'kedge-keep',
    image: '/npcs/phinigel-autropos.webp',
    blurb:
      'Sole survivor of Prexus’s ancient aquatic race, brooding at the bottom of his sunken keep. His magic — and his loot — draw raiders who can hold their breath.',
    lore:
      'The kedge were an ancient aquatic people devoted to Prexus the Oceanlord; Phinigel is the last of them, a knight who outlived his entire race and now broods in the flooded halls of Kedge Keep beneath the sea off Faydwer. He is the third of EverQuest’s original raid trinity alongside Vox and Nagafen, and the fight is as much against the zone as the mob — everything happens underwater, where a broken enchant-breath or a bad pull of his Swirlspine Guardians drowns the raid as surely as his spells do.'
  },
  {
    id: 'emperor-crush',
    name: 'Emperor Crush',
    title: 'Warlord of Crushbone',
    zoneId: 'crushbone',
    image: '/npcs/emperor-crush.webp',
    blurb:
      'The orc emperor whose belts every Faydwer soldier collects bounties on. Not a deep thinker; extremely effective at his one job.',
    lore:
      'Crush rules the orc legions that hammer at the elf and dwarf realms of Faydwer from their fortress of Crushbone, throned in an alcove behind his castle’s great hall. His warband is the whetstone the young races of the forest sharpen themselves on — Kelethin, Felwithe and Kaladim all pay bounties for the belts and insignias his orcs carry, making the Emperor the first "boss" a whole generation of Faydwer adventurers learns to bring a group against. He is no strategist, but he does not need to be: there are always more orcs.'
  },
  {
    id: 'najena',
    name: 'Najena',
    title: 'The elementalist',
    zoneId: 'najena',
    image: '/npcs/najena.webp',
    blurb:
      'A dark elf wizard who carved her own dungeon into Lavastorm and staffed it with bound elementals. Her magic-sealed doors made "bring a lockpicker" a proverb.',
    lore:
      'Najena is a Teir`Dal enchantress-wizard who hollowed a private fortress-dungeon into the black rock of Lavastorm and packed it with bound elementals, golems and beasts to guard her experiments. The complex that bears her name is famous for its arcane-locked doors — the reason a generation of players learned to keep a rogue or the right key on hand — and for the daughter she left waiting in its depths. She embodies the dark elf ideal: brilliant, self-sufficient, and utterly unwilling to answer to anyone.'
  },
  {
    id: 'kazon-stormhammer',
    name: 'King Kazon Stormhammer',
    title: 'King under Kaladim',
    zoneId: 'kaladim',
    image: '/npcs/kazon-stormhammer.webp',
    blurb:
      'The dwarven king whose Stormguard holds the mountains against Crushbone. Pays good coin for orc belts and better coin for loyalty.',
    lore:
      'Kazon rules the dwarves of Kaladim under Brell Serilis’s mountains, and his Stormguard is the wall that keeps Emperor Crush’s orcs out of the deep halls of Butcherblock and the Faydark. His court runs on the oldest dwarven virtues — craft, coin, and grudges kept in good order — and the bounties his kingdom pays for orc insignias fund half the young adventurers grinding Crushbone. To be sworn to the Stormhammer throne is to have picked a side in the oldest feud on the continent.'
  },
  {
    id: 'thex-monarchs',
    name: 'Tearis & Cristanos Thex',
    title: 'The sundered crowns',
    zoneId: 'felwithe',
    blurb:
      'King Tearis Thex rules high elf Felwithe; Queen Cristanos Thex rules dark elf Neriak. The same royal line — one branch kept by Tunare, one remade by Innoruuk. Family reunions are wars.',
    lore:
      'The Thex name sits on two thrones that hate each other. When Innoruuk stole the first elven king and queen and twisted their line into the Teir`Dal, he split a single royal house in two: King Tearis Thex now rules the Koada`Dal high elves of Felwithe under Tunare’s grace, while Queen Cristanos Thex rules the dark elves of Neriak in Innoruuk’s spite. The war between light and dark elf is, at its root, a family estrangement three centuries deep — and every player who picks a high or dark elf is enlisting in it.'
  },
  {
    id: 'ak-anon-xv',
    name: 'King Ak`Anon XV',
    title: 'The clockwork throne',
    zoneId: 'ak-anon',
    image: '/npcs/ak-anon-xv.webp',
    blurb:
      'The gnome king who long ago transferred his mind into a clockwork body. Whether the machine still holds the king, or only remembers him, is Ak`Anon’s politest argument.',
    lore:
      'The gnome king of Ak`Anon had his consciousness transferred into a clockwork body generations ago, an experiment as gnomish as it is unsettling. He still sits the throne of the mechanized city Brell’s tinkers built beneath Faydwer, presiding over a people who answer hard problems with more gears — but whether the ticking king is truly Ak`Anon XV or only a very good record of him is the question polite gnomes agree never to settle at dinner. It is the perfect emblem of a race that will absolutely build the thing before deciding whether it should.'
  },
  {
    id: 'fippy-darkpaw',
    name: 'Fippy Darkpaw',
    title: 'The most persistent gnoll alive',
    zoneId: 'qeynos-hills',
    image: '/npcs/fippy-darkpaw.webp',
    blurb:
      'Charges the Qeynos gate, dies, and comes back to do it again. Nobody knows if it’s always the same gnoll. Killing him is every Qeynos newbie’s rite of passage.',
    lore:
      'Fippy is a Darkpaw gnoll of Blackburrow with a personal grudge against the whole city of Qeynos: on a timer, he sprints from the hills to the gates, gets cut down by the guards, and does it again forever. He is a joke, a mascot, and a genuine institution — the first name most Antonican adventurers ever learn, and a running gag old enough to have outlived kingdoms. Whether it is truly one immortal gnoll or an unbroken relay of furious sons, no one in Qeynos has ever cared enough to check.'
  },

  // ── Dungeon lords & wilds (added, mined from the EQL Wiki) ──
  {
    id: 'drelzna',
    name: 'Drelzna',
    title: 'Daughter of Najena',
    zoneId: 'najena',
    image: '/npcs/drelzna.webp',
    blurb:
      'The dark elf heir waiting at the heart of Najena’s dungeon — a necromancer guarding her mother’s sanctum, and once the keeper of the boots half of Norrath wanted.',
    lore:
      'Drelzna is the daughter and enforcer of Najena, holding the inner sanctum of her mother’s Lavastorm fortress. A necromancer who trades places on her spawn with a stand-in mage, she was for years the most sought-after target in the zone as the source of the Journeyman’s Boots — the run-speed boots every class coveted — until that reward was moved to a quest. She remains the definitive prize of the dungeon and a fitting heir to Najena’s cold, self-made legacy.'
  },
  {
    id: 'king-tranix',
    name: 'King Tranix',
    title: 'Goblin king of Sol B',
    zoneId: 'nagafens-lair',
    image: '/npcs/king-tranix.webp',
    blurb:
      'The goblin monarch who rules the upper halls of Nagafen’s Lair, squatting in a dragon’s basement and daring adventurers to evict him.',
    lore:
      'Long before a group reaches the red dragon, they have to get past Tranix — the goblin king whose warren fills the upper reaches of Sol B. He hits back with a Harm Touch that can strip hundreds of hit points in an instant and is rumored to carry heavy resistance to every school of magic, making him a real wall for groups pushing into the volcano. His court is the classic mid-level farm of the zone and the last real gate between the entrance and Nagafen’s deep halls.'
  },
  {
    id: 'cazel',
    name: 'Cazel',
    title: 'The roaming sand giant',
    zoneId: 'oasis',
    image: '/npcs/cazel.webp',
    blurb:
      'A wandering giant of the Desert of Ro who’s killed more overconfident travelers than most dungeons — often mistaken for a mere cyclops until it’s too late.',
    lore:
      'Cazel prowls a long circuit through the Oasis of Marr and the deserts of Ro, from the orc highway down to the docks and along the water toward North Ro. Powerful enough to flatten the groups that farm the trade route yet roaming right through their hunting grounds, he is the desert’s great ambush — snareable and slowable by a prepared party, lethal to anyone who mistakes his silhouette for a common cyclops. Travelers crossing Ro on foot learn to watch the dunes for him.'
  },
  {
    id: 'master-yael',
    name: 'Master Yael',
    title: 'Guardian of The Hole',
    zoneId: 'paineel',
    image: '/npcs/master-yael.webp',
    blurb:
      'The thing waiting at the bottom of The Hole beneath Paineel — a guardian whose touch simply ends you, no saving throw.',
    lore:
      'When the Heretics’ war of magic blasted a crater through Odus, it left The Hole — a vast pit descending beneath the Erudite city of Paineel. Master Yael waits at the very bottom, and his defining weapon is a Death Touch that recycles every half-minute and kills whatever it lands on outright, forcing raids to fight on a merciless clock. He is the warden of one of the most storied and punishing dungeons of the age, hostile to all comers and a fitting monument to the hubris that dug the place.'
  },
  {
    id: 'ambassador-dvinn',
    name: 'Ambassador D`Vinn',
    title: 'Dark elf envoy to Crushbone',
    zoneId: 'crushbone',
    image: '/npcs/ambassador-dvinn.webp',
    blurb:
      'The Teir`Dal ambassador embedded with Emperor Crush’s orcs — proof that the dark elves would rather sponsor Faydwer’s chaos than fight in it themselves.',
    lore:
      'D`Vinn is Neriak’s envoy to the orcs of Crushbone, a dark elf working quietly to keep Emperor Crush’s war against the elves and dwarves well-armed and well-aimed — the Teir`Dal preferring to fund a proxy rather than march. To generations of low-level adventurers he became something more infamous: a notorious, near-mythic terror of the newbie zone, remembered in campfire whispers and a trail of looted corpses. Killing the ambassador is both a strike against Neriak’s meddling and a personal milestone for anyone who spent their early levels dreading him.'
  },
  {
    id: 'quillmane',
    name: 'Quillmane',
    title: 'The white pegasus of the Karanas',
    zoneId: 'south-karana',
    image: '/npcs/quillmane.webp',
    blurb:
      'The beautiful white wonder of the plains — a near-mythical pegasus most adventurers hunt for days and never even see.',
    lore:
      'Quillmane is the legend of the Karanas made flesh: a magnificent white pegasus said to grace the southern plains, wrapped in so many tall tales that most who chase it can’t say where truth ends and boast begins. It is one of Norrath’s most elusive rare spawns, appearing on an uncertain cycle and gone before most trackers reach it, and the Pegasus Feather Cloak it carries has launched countless days-long hunts across the grass. To glimpse it is a story; to loot it is a boast you get to keep.'
  },
  {
    id: 'grimfeather',
    name: 'Grimfeather',
    title: 'Griffon of the northern plains',
    zoneId: 'north-karana',
    image: '/npcs/grimfeather.webp',
    blurb:
      'A rare, magic-resistant griffon that runs down anything foolish enough to flee it across North Karana — the plains’ apex predator with a name.',
    lore:
      'The griffons of the Karanas are already the terror of low-level travelers crossing the open grass; Grimfeather is the rare, named worst of them, spawning in place of an ordinary griffon in the north. It runs at roughly the speed of a hasted adventurer and shrugs off much of what casters throw at it, so there is no simply outrunning or nuking it down — a hunt for Grimfeather is a deliberate, prepared fight, not a lucky roadside kill. For plains hunters it’s a coveted trophy and a rite of passage in equal measure.'
  },
  {
    id: 'garanel-rucksif',
    name: 'Garanel Rucksif',
    title: 'The rare name of Befallen',
    zoneId: 'befallen',
    image: '/npcs/garanel-rucksif.webp',
    blurb:
      'A rare named who prowls the sunken temple of Befallen — armed, unwelcoming, and a coveted find for anyone camping the crypt for coin.',
    lore:
      'Befallen is a temple that sank into the earth and was long ago given over to the undead, and Garanel Rucksif — "Fatty" to the campers who hunt him — is one of the rare names who stalk its halls. He surfaces only occasionally out of the crypt’s churn of placeholders, and the axe and shield he carries make him worth the wait for a group grinding the dungeon. He is a small legend of Befallen: not a story of great evil, just the reliable, elusive payday at the bottom of a very dangerous staircase.'
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
