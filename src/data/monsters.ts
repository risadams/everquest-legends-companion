import type { Monster } from './types';

// Curated classic-era notables. Loot and spawns follow classic EverQuest,
// which EQL recreates — verify in-game while the beta shakes out.

export const MONSTERS: Monster[] = [
  // ── Antonica: Qeynos region ────────────────────────────────
  { id: 'fippy-darkpaw', name: 'Fippy Darkpaw', zoneId: 'qeynos-hills', lvlMin: 3, lvlMax: 5, kind: 'named', where: 'Charges the Qeynos gate on a timer', notes: 'The most famous gnoll in Norrath. Killing him is a Qeynos rite of passage.' },
  { id: 'holly-windstalker', name: 'Holly Windstalker', zoneId: 'qeynos-hills', lvlMin: 18, lvlMax: 22, kind: 'named', where: 'Roams near the druid ring and pond', notes: 'Guardian of wildlife — she attacks anyone who slaughters animals. Leave the bears alone or be ready.' },
  { id: 'lord-elgnub', name: 'Lord Elgnub', zoneId: 'blackburrow', lvlMin: 10, lvlMax: 12, kind: 'named', where: 'Bottom of the den, past the spiral', loot: ['Gnoll hide gear', 'Qeynos bounty trophies'], notes: 'Master of Blackburrow.' },
  { id: 'elite-gnoll-guard', name: 'Elite gnoll guardsmen', zoneId: 'blackburrow', lvlMin: 8, lvlMax: 12, kind: 'notable', where: 'Ledges above the central chasm', notes: 'Chain-pull them from the ledges — never fight at the chasm lip.' },
  { id: 'dark-assassin', name: 'Dark Assassin', zoneId: 'everfrost', lvlMin: 48, lvlMax: 52, kind: 'named', where: 'Paths behind the southernmost tundra tower (also stalks the Feerrott, west of the bridge)', notes: 'A level-50 human rogue who backstabs for 420 and runs near SoW speed — the terror of travelers in two zones. Sees hide but not invis. EQL fixed his Feerrott spawn to grant XP (May 2026 hotfix).' },
  { id: 'lich-of-miragul', name: 'The Lich of Miragul', zoneId: 'everfrost', lvlMin: 35, lvlMax: 40, kind: 'named', where: 'Far northern ice fields at night', loot: ['Necromancer treasures'], notes: 'A remnant of the great necromancer. Far beyond the zone’s normal danger.' },
  { id: 'tundra-mammoth', name: 'Tundra mammoths', zoneId: 'everfrost', lvlMin: 10, lvlMax: 15, kind: 'notable', where: 'Open tundra', notes: 'Hit far above their level. Classic newbie graveyard.' },
  { id: 'lady-vox', name: 'Lady Vox', zoneId: 'permafrost', lvlMin: 50, lvlMax: 55, kind: 'raid', where: 'Her lair past the ice giant halls', loot: ['White dragon scales', 'Top-tier raid armor and weapons'], notes: 'The white dragon. Bring a full 8-player raid, cold resist gear, and a plan for her fear and ice breath.' },
  { id: 'ice-giants', name: 'Ice giants', zoneId: 'permafrost', lvlMin: 30, lvlMax: 37, kind: 'notable', where: 'Giant halls before Vox', loot: ['Fat coin drops'], notes: 'Classic platinum farming for groups in their 30s. EQL counts them as valid raid targets inside raid instances (May 2026 patch).' },
  { id: 'goblin-warlords', name: 'Goblin warlords of Permafrost', zoneId: 'permafrost', lvlMin: 18, lvlMax: 25, kind: 'notable', where: 'Entrance halls and throne room', notes: 'The gateway camps before the giants.' },

  // ── Antonica: the Karanas ─────────────────────────────────
  { id: 'grizzleknuckle', name: 'Grizzleknuckle', zoneId: 'west-karana', lvlMin: 12, lvlMax: 16, kind: 'named', where: 'Wanders the central farmland', notes: 'A rare, ornery bear beloved by trophy hunters.' },
  { id: 'wk-bandits', name: 'Bandit camp leaders', zoneId: 'west-karana', lvlMin: 8, lvlMax: 14, kind: 'notable', where: 'Camps along the eastern hills', loot: ['Bandit sashes and coin'] },
  { id: 'nk-griffins', name: 'Griffins of the plains', zoneId: 'north-karana', lvlMin: 22, lvlMax: 30, kind: 'notable', where: 'Roam the open plain between the bridges', notes: 'The reason you never cross North Karana at low level without speed.' },
  { id: 'ek-gnoll-chief', name: 'Ravine gnoll chieftain', zoneId: 'east-karana', lvlMin: 18, lvlMax: 24, kind: 'named', where: 'Gnoll ravine on the north wall' },
  { id: 'ek-hill-giants', name: 'Wandering hill giants', zoneId: 'east-karana', lvlMin: 32, lvlMax: 38, kind: 'notable', where: 'The Rathe ridgeline south of the road', loot: ['Heavy coin'], notes: 'One bad pull at the ridge ends a mid-level group.' },
  { id: 'quillmane', name: 'Quillmane', zoneId: 'south-karana', lvlMin: 30, lvlMax: 34, kind: 'named', where: 'Rare spawn roaming the whole savanna', loot: ['Pegasus Feather Cloak (levitation)'], notes: 'The legendary pegasus. Hours of tracking for one of the era’s most coveted cloaks.' },
  { id: 'grimfeather', name: 'Grimfeather', zoneId: 'south-karana', lvlMin: 24, lvlMax: 28, kind: 'named', where: 'Aviak village towers', notes: 'The aviak village’s champion.' },
  { id: 'sk-hill-giants', name: 'Hill giants', zoneId: 'south-karana', lvlMin: 32, lvlMax: 38, kind: 'notable', where: 'Southern hills toward the lake', loot: ['Heavy coin'] },
  { id: 'splitpaw-chief', name: 'The Splitpaw chieftain', zoneId: 'splitpaw', lvlMin: 28, lvlMax: 33, kind: 'named', where: 'Deepest den chamber', loot: ['Gnoll-forged weapons'] },
  { id: 'splitpaw-tomahawk', name: 'Splitpaw elite guards', zoneId: 'splitpaw', lvlMin: 22, lvlMax: 28, kind: 'notable', where: 'Inner tunnels', loot: ['Polished Granite Tomahawk (classic early 2-hander)'] },

  // ── Antonica: Highpass & Rivervale corridor ───────────────
  { id: 'hp-gnoll-chieftain', name: 'Highpass gnoll chieftain', zoneId: 'highpass', lvlMin: 16, lvlMax: 20, kind: 'named', where: 'Gnoll caves under the west cliffs' },
  { id: 'hk-nobles', name: 'The nobles of HighKeep', zoneId: 'highkeep', lvlMin: 28, lvlMax: 33, kind: 'notable', where: 'Upper floors of the keep', loot: ['Gems and heavy coin'], notes: 'Famous mid-level money camp — but killing them torches your Highpass faction.' },
  { id: 'hk-goblins', name: 'Goblin cellar raiders', zoneId: 'highkeep', lvlMin: 20, lvlMax: 28, kind: 'notable', where: 'The basement', notes: 'The legendary goblin basement — steady XP for hours.' },
  { id: 'kithicor-dead', name: 'The dead of Kithicor', zoneId: 'kithicor', lvlMin: 30, lvlMax: 45, kind: 'notable', where: 'Everywhere, after nightfall', notes: 'Dark elf war dead rise each night. Cross by day; hunt only with a strong group.' },
  { id: 'renux-herkanor', name: 'Renux Herkanor', zoneId: 'kithicor', lvlMin: 35, lvlMax: 40, kind: 'named', where: 'Bandit camps, rare', notes: 'An elusive, deadly bandit with a dark legacy.' },
  { id: 'mt-goblins', name: 'Wall goblin raiders', zoneId: 'misty-thicket', lvlMin: 5, lvlMax: 10, kind: 'notable', where: 'East of the wall', notes: 'The halflings’ eternal enemies. Great early XP with Rivervale a jog away.' },
  { id: 'runnyeye-eye', name: 'The Evil Eye', zoneId: 'runnyeye', lvlMin: 18, lvlMax: 22, kind: 'named', where: 'The deep vaults', notes: 'The power behind the goblin citadel.' },
  { id: 'runnyeye-headmaster', name: 'Goblin headmaster', zoneId: 'runnyeye', lvlMin: 12, lvlMax: 16, kind: 'named', where: 'Mid-level warrens' },
  { id: 'gorge-minotaurs', name: 'Minotaur elders', zoneId: 'gorge-of-king-xorbb', lvlMin: 16, lvlMax: 22, kind: 'notable', where: 'Maze caves', loot: ['Minotaur horns (quest fodder)'] },
  { id: 'gorge-eyes', name: 'Evil eyes of the gorge', zoneId: 'gorge-of-king-xorbb', lvlMin: 20, lvlMax: 25, kind: 'notable', where: 'Eastern ravine', notes: 'They see invisibility and blind their prey.' },

  // ── Antonica: Commonlands & Freeport region ───────────────
  { id: 'wc-griffon', name: 'Wandering griffons', zoneId: 'west-commonlands', lvlMin: 25, lvlMax: 32, kind: 'notable', where: 'Roam the whole plain', notes: 'The Commonlands’ apex predators — the reason the road exists.' },
  { id: 'wc-dervish', name: 'Dervish cutthroat camps', zoneId: 'west-commonlands', lvlMin: 8, lvlMax: 14, kind: 'notable', where: 'Tents in the south fields', loot: ['Sashes and coin'] },
  { id: 'ec-orc-leaders', name: 'Deathfist camp taskmasters', zoneId: 'east-commonlands', lvlMin: 6, lvlMax: 12, kind: 'notable', where: 'Orc camps 1 & 2 along the road', loot: ['Deathfist slashed belts (militia turn-in)'] },
  { id: 'befallen-keepers', name: 'The crypt keepers of Befallen', zoneId: 'befallen', lvlMin: 14, lvlMax: 20, kind: 'notable', where: 'Third floor, behind the locked doors', loot: ['Bone-etched caster gear'], notes: 'Undead see through invisibility down here.' },
  { id: 'baron-telyx', name: 'Baron Telyx V`Zher', zoneId: 'befallen', lvlMin: 26, lvlMax: 30, kind: 'named', where: 'The new deepest halls', loot: ['The Baron’s Blade (1H slasher with an Ornamentation slot)', 'Pristine Studded Leather Tunic'], notes: 'EQL addition: a dark elf paladin lording over the high-level population added to deep Befallen in the May 2026 patch, alongside Korven Nisere, Kahaptra Z`Taj, and other very mean dark elves.' },
  { id: 'nektulos-shadowmen', name: 'Shadowed men', zoneId: 'nektulos', lvlMin: 8, lvlMax: 14, kind: 'notable', where: 'The dark hollows off the river', loot: ['Shadowed rapiers (rare)'], notes: 'Invisible stalkers — see invis or fight blind.' },
  { id: 'lavastorm-drakes', name: 'Fire drakes', zoneId: 'lavastorm', lvlMin: 18, lvlMax: 24, kind: 'notable', where: 'Lava flows on the upper slopes', loot: ['Drake scales'] },
  { id: 'najena-herself', name: 'Najena', zoneId: 'najena', lvlMin: 22, lvlMax: 26, kind: 'named', where: 'Her sanctum behind the locked doors', loot: ['Magician treasures'], notes: 'The dungeon’s mistress, a magician of dark renown.' },
  { id: 'drelzna', name: 'Drelzna', zoneId: 'najena', lvlMin: 24, lvlMax: 27, kind: 'named', where: 'Inner crypt cell', loot: ['Journeyman’s Boots (permanent run speed!)'], notes: 'One of the most farmed nameds of the era — JBoots change your whole game.' },
  { id: 'sola-taskmasters', name: 'Fire goblin taskmasters', zoneId: 'soluseks-eye', lvlMin: 24, lvlMax: 30, kind: 'notable', where: 'The bridge network', notes: 'Watch the lava on every pull.' },
  { id: 'lord-nagafen', name: 'Lord Nagafen', zoneId: 'nagafens-lair', lvlMin: 52, lvlMax: 55, kind: 'raid', where: 'The great lair at the bottom', loot: ['Red dragon scales', 'The era’s defining raid loot'], notes: 'The red dragon himself. Fire resist, a full raid, and discipline required.' },
  { id: 'king-tranix', name: 'King Tranix', zoneId: 'nagafens-lair', lvlMin: 45, lvlMax: 48, kind: 'named', where: 'Fire giant throne room', loot: ['Giant-forged arms'], notes: 'Ruler of the fire giants guarding Nagafen’s door. EQL counts the lair’s giants as valid raid targets inside raid instances (May 2026 patch).' },
  { id: 'efreeti-djarn', name: 'Efreeti Lord Djarn', zoneId: 'nagafens-lair', lvlMin: 46, lvlMax: 49, kind: 'named', where: 'The efreeti chamber', loot: ['Golden Efreeti Boots', 'Djarn’s Amethyst Ring'], notes: 'The most famous single camp in the dungeon.' },

  // ── Antonica: the Ro deserts & southern swamps ────────────
  { id: 'dorn', name: 'Dorn B`Dynn', zoneId: 'north-ro', lvlMin: 32, lvlMax: 36, kind: 'named', where: 'Wanders the dunes', loot: ['Heavy coin'], notes: 'A sand giant who flattens careless newbies on the Freeport road.' },
  { id: 'nro-orc-taskmaster', name: 'Dune orc taskmasters', zoneId: 'north-ro', lvlMin: 5, lvlMax: 10, kind: 'notable', where: 'Orc camps in the central desert' },
  { id: 'lockjaw', name: 'Lockjaw', zoneId: 'oasis', lvlMin: 18, lvlMax: 22, kind: 'named', where: 'Rare spawn among the crocodiles', notes: 'The giant crocodile of legend. Deceptively vicious.' },
  { id: 'oasis-giants', name: 'Sand giants of the Oasis', zoneId: 'oasis', lvlMin: 30, lvlMax: 36, kind: 'notable', where: 'Patrol the dunes between camps', loot: ['Heavy coin'], notes: 'The zone’s great equalizer — keep one eye on the horizon.' },
  { id: 'oasis-spectres', name: 'Spectres of the isle', zoneId: 'oasis', lvlMin: 28, lvlMax: 33, kind: 'notable', where: 'Specter isle offshore', loot: ['Rusty scythes, rare gems'] },
  { id: 'cazel', name: 'Cazel', zoneId: 'south-ro', lvlMin: 34, lvlMax: 38, kind: 'named', where: 'Roams the deep desert', loot: ['Heavy coin'], notes: 'The most famous sand giant in Norrath.' },
  { id: 'ancient-cyclops-sro', name: 'Ancient Cyclops', zoneId: 'south-ro', lvlMin: 30, lvlMax: 35, kind: 'named', where: 'Very rare spawn among the desert cyclopes', loot: ['Golden idol (Journeyman’s Boots quest)'], notes: 'One of the most camped rares of the era — the key to permanent run speed.' },
  { id: 'ograbme', name: 'Ograbme', zoneId: 'innothule', lvlMin: 10, lvlMax: 14, kind: 'named', where: 'The deep bog pools', notes: 'The great alligator of the swamp.' },
  { id: 'innothule-frogs', name: 'Froglok bog raiders', zoneId: 'innothule', lvlMin: 5, lvlMax: 10, kind: 'notable', where: 'Around the mouth of Guk', notes: 'Troll bounty targets and the vanguard of Guk.' },
  { id: 'froglok-king', name: 'The Froglok King', zoneId: 'upper-guk', lvlMin: 24, lvlMax: 28, kind: 'named', where: 'Throne room, live side', loot: ['Froglok crown regalia'] },
  { id: 'guk-croc', name: 'The ancient croc of Guk', zoneId: 'upper-guk', lvlMin: 20, lvlMax: 24, kind: 'named', where: 'Flooded lower tunnels', notes: 'Lurks where the water runs deep.' },
  { id: 'froglok-shin-lord', name: 'The froglok shin lord', zoneId: 'upper-guk', lvlMin: 28, lvlMax: 32, kind: 'named', where: 'Spawns under the torch, live side', loot: ['Ghoulbane (the undead-bane paladin sword)'], notes: 'A froglok paladin who lays hands and heals himself. His tal shaman placeholder blasts for 250 cold — bring frost resist. EQL roughly doubled his spawn chance (May 2026 patch).' },
  { id: 'frenzied-ghoul', name: 'The Frenzied Ghoul', zoneId: 'lower-guk', lvlMin: 42, lvlMax: 46, kind: 'named', where: 'Frenzy room, dead side', loot: ['Flowing Black Silk Sash (haste!)'], notes: 'Possibly the most contested camp of the entire era.' },
  { id: 'ghoul-lord', name: 'The Ghoul Lord', zoneId: 'lower-guk', lvlMin: 44, lvlMax: 48, kind: 'named', where: 'Ghoul lord’s chamber', loot: ['Ghoulbane (the paladin blade)'], notes: 'Undead royalty of the drowned city.' },
  { id: 'ghoul-arch-magus', name: 'The Ghoul Arch Magus', zoneId: 'lower-guk', lvlMin: 44, lvlMax: 48, kind: 'named', where: 'Magus chamber near the water', loot: ['Caster staves and robes'] },
  { id: 'ghoul-assassin', name: 'A ghoul assassin', zoneId: 'lower-guk', lvlMin: 40, lvlMax: 44, kind: 'named', where: 'Assassin’s alcove', loot: ['Guise of the Deceiver (dark elf illusion mask)'], notes: 'The beloved illusion mask drops again in EQL (May 2026 patch). Only bards and rogues can wear it, but anyone can click the illusion from inventory.' },
  { id: 'ghoul-executioner', name: 'The Ghoul Executioner', zoneId: 'lower-guk', lvlMin: 40, lvlMax: 44, kind: 'named', where: 'Execution chamber', loot: ['Executioner’s Axe'] },
  { id: 'feerrott-spectres', name: 'Spectres of the broken bridge', zoneId: 'feerrott', lvlMin: 28, lvlMax: 33, kind: 'notable', where: 'The ruined bridge crossing', notes: 'Do not take the shortcut at low level. Ever.' },
  { id: 'feerrott-oracles', name: 'Tae Ew oracles', zoneId: 'feerrott', lvlMin: 8, lvlMax: 13, kind: 'notable', where: 'Lizardman camps near the temple' },
  { id: 'ct-avatars', name: 'Avatars of Fear', zoneId: 'cazic-thule', lvlMin: 32, lvlMax: 38, kind: 'notable', where: 'The inner temple', notes: 'Fanatic lizardman priests channeling their god — they cast fear, fittingly.' },
  { id: 'ct-hierophants', name: 'Temple hierophants', zoneId: 'cazic-thule', lvlMin: 26, lvlMax: 32, kind: 'notable', where: 'The outer maze', loot: ['Ritual blades and idols'] },
  { id: 'rm-hill-giants', name: 'Hill giants of the Rathes', zoneId: 'rathe-mountains', lvlMin: 30, lvlMax: 36, kind: 'notable', where: 'The giant valley', loot: ['The best platinum farm of the era'], notes: 'Entire fortunes are minted here in the low 30s.' },
  { id: 'rm-cyclops', name: 'Cyclops wanderers', zoneId: 'rathe-mountains', lvlMin: 28, lvlMax: 34, kind: 'notable', where: 'Upper slopes' },
  { id: 'lr-aviak-rooks', name: 'Aviak rooks of the isle', zoneId: 'lake-rathetear', lvlMin: 22, lvlMax: 27, kind: 'notable', where: 'Aviak island towers' },
  { id: 'lr-gnoll-spiritists', name: 'Gnoll spiritists', zoneId: 'lake-rathetear', lvlMin: 26, lvlMax: 32, kind: 'notable', where: 'Lakeside dens', loot: ['Shamanic fetishes'] },
  { id: 'oot-oracle', name: 'The Oracle of K`Arnon', zoneId: 'ocean-of-tears', lvlMin: 28, lvlMax: 32, kind: 'named', where: 'Oracle’s island', loot: ['Robe of the Oracle (iconic caster robe)'], notes: 'A lone seer whose robe every enchanter, magician, necromancer, and wizard covets.' },
  { id: 'oot-allizewsaur', name: 'The Allizewsaur', zoneId: 'ocean-of-tears', lvlMin: 38, lvlMax: 44, kind: 'named', where: 'The big island interior', notes: 'A monster far too large for its island. Swimmers beware.' },
  { id: 'oot-cyclops', name: 'Cyclopes of Sister Isle', zoneId: 'ocean-of-tears', lvlMin: 24, lvlMax: 30, kind: 'notable', where: 'Cyclops island on the boat route', loot: ['Coin and rare rings'] },

  // ── Faydwer ───────────────────────────────────────────────
  { id: 'gfay-taskmasters', name: 'Crushbone taskmasters', zoneId: 'greater-faydark', lvlMin: 6, lvlMax: 10, kind: 'notable', where: 'Orc camps 1 & 2', loot: ['Crushbone belts (Kaladim turn-in)'] },
  { id: 'emperor-crush', name: 'Emperor Crush', zoneId: 'crushbone', lvlMin: 12, lvlMax: 15, kind: 'named', where: 'The throne room', loot: ['Crown of the Emperor'], notes: 'Every Faydwer character’s first boss kill.' },
  { id: 'ambassador-dvinn', name: 'Ambassador DVinn', zoneId: 'crushbone', lvlMin: 13, lvlMax: 16, kind: 'named', where: 'Rare — the castle interior', loot: ['Dragoon Dirk (superb early piercer)'], notes: 'The dark elf envoy, and the best loot in the keep.' },
  { id: 'lord-darish', name: 'Lord Darish', zoneId: 'crushbone', lvlMin: 11, lvlMax: 14, kind: 'named', where: 'The tower' },
  { id: 'equestrielle', name: 'The Equestrielle', zoneId: 'lesser-faydark', lvlMin: 30, lvlMax: 35, kind: 'named', where: 'Roams the fey glades', notes: 'A sacred unicorn — peaceful unless provoked, unforgiving when provoked.' },
  { id: 'lfay-brownies', name: 'Brownie scouts', zoneId: 'lesser-faydark', lvlMin: 22, lvlMax: 28, kind: 'notable', where: 'The southern thickets', notes: 'Tiny, adorable, and they hit like falling trees.' },
  { id: 'meldrath', name: 'Meldrath the Malignant', zoneId: 'steamfont', lvlMin: 12, lvlMax: 16, kind: 'named', where: 'Minotaur caves, inner chamber', loot: ['Mad gnome contraptions'], notes: 'The exiled mad gnome and his mechanical servants.' },
  { id: 'steamfont-minotaurs', name: 'Minotaur elders', zoneId: 'steamfont', lvlMin: 9, lvlMax: 14, kind: 'notable', where: 'The minotaur caves' },
  { id: 'bb-goblin-leaders', name: 'Greenblood goblin leaders', zoneId: 'butcherblock', lvlMin: 8, lvlMax: 14, kind: 'notable', where: 'Camps along the canyons' },
  { id: 'bb-chessboard', name: 'The chessboard wanderers', zoneId: 'butcherblock', lvlMin: 5, lvlMax: 12, kind: 'notable', where: 'The giant chessboard', notes: 'Hunt beside Faydwer’s strangest landmark.' },
  { id: 'cauldron-goblins', name: 'Cauldron goblin skirmishers', zoneId: 'dagnors-cauldron', lvlMin: 16, lvlMax: 22, kind: 'notable', where: 'The crater shores' },
  { id: 'festering-hag', name: 'The Festering Hag', zoneId: 'unrest', lvlMin: 22, lvlMax: 26, kind: 'named', where: 'Upstairs bedroom', notes: 'The house’s mistress of misery.' },
  { id: 'garanel-rucksif', name: 'Garanel Rucksif', zoneId: 'unrest', lvlMin: 24, lvlMax: 28, kind: 'named', where: 'Roams the house interior', loot: ['Dwarven Work Boots'], notes: 'The mad dwarf ghost — quick hands, quicker temper.' },
  { id: 'unrest-ghouls', name: 'Paralyzing ghouls', zoneId: 'unrest', lvlMin: 20, lvlMax: 28, kind: 'notable', where: 'Basement and crypt', notes: 'Their touch roots you in place while friends arrive.' },
  { id: 'phinigel', name: 'Phinigel Autropos', zoneId: 'kedge-keep', lvlMin: 48, lvlMax: 52, kind: 'raid', where: 'The deepest chamber', loot: ['Legendary caster gear'], notes: 'The kedge master of the drowned fortress. A full-raid underwater fight — logistics are the real boss.' },
  { id: 'estrella', name: 'Estrella of Gloomwater', zoneId: 'kedge-keep', lvlMin: 40, lvlMax: 44, kind: 'named', where: 'Gloomwater halls', notes: 'Siren royalty of the keep.' },
  { id: 'mayong', name: 'Mayong Mistmoore', zoneId: 'mistmoore', lvlMin: 50, lvlMax: 55, kind: 'raid', where: 'Rarely seen in his inner sanctum', notes: 'The master vampire himself — seldom present, never survivable when he is.' },
  { id: 'mm-gargoyles', name: 'Gargoyle sentries', zoneId: 'mistmoore', lvlMin: 24, lvlMax: 30, kind: 'notable', where: 'Walls and towers', notes: 'They see through invisibility — the castle’s alarm system.' },
  { id: 'mm-court', name: 'The vampiric court', zoneId: 'mistmoore', lvlMin: 30, lvlMax: 38, kind: 'notable', where: 'Inner castle halls', loot: ['Gothic finery and rare blades'] },

  // ── Odus ──────────────────────────────────────────────────
  { id: 'tox-kobolds', name: 'Kobold shaman packs', zoneId: 'toxxulia', lvlMin: 4, lvlMax: 9, kind: 'notable', where: 'Camps along the river' },
  { id: 'kerra-warleaders', name: 'Rogue kejek war-leaders', zoneId: 'kerra-isle', lvlMin: 8, lvlMax: 14, kind: 'notable', where: 'The wild north shore', notes: 'Outcast kerrans who reject the village’s peace.' },
  { id: 'ec-sharks', name: 'Bull sharks', zoneId: 'eruds-crossing', lvlMin: 12, lvlMax: 18, kind: 'notable', where: 'Open water off the boat route', notes: 'The reason you stay on the boat.' },
  { id: 'ec-kerran-shaman', name: 'The island kerran shaman', zoneId: 'eruds-crossing', lvlMin: 14, lvlMax: 18, kind: 'named', where: 'The mid-ocean isle' },
  { id: 'warrens-king', name: 'The Kobold King', zoneId: 'the-warrens', lvlMin: 12, lvlMax: 16, kind: 'named', where: 'Throne cavern at the deepest point', loot: ['Kobold king regalia'] },
  { id: 'stonebrunt-panthers', name: 'Highland panthers', zoneId: 'stonebrunt', lvlMin: 18, lvlMax: 25, kind: 'notable', where: 'The misty slopes', notes: 'Silent stalkers of the fog line.' },
  { id: 'stonebrunt-gorillas', name: 'Highland gorillas', zoneId: 'stonebrunt', lvlMin: 22, lvlMax: 28, kind: 'notable', where: 'The high plateaus' },
  { id: 'master-yael', name: 'Master Yael', zoneId: 'the-hole', lvlMin: 50, lvlMax: 55, kind: 'raid', where: 'The deepest ruins', loot: ['Raid-tier weapons and armor'], notes: 'The elemental horror at the bottom of Old Paineel. A raid unto itself.' },
  { id: 'hole-caretakers', name: 'Ratmen caretakers', zoneId: 'the-hole', lvlMin: 42, lvlMax: 48, kind: 'notable', where: 'Upper ruins', notes: 'Everything down here sees invisibility.' },

  // ── The Planes ────────────────────────────────────────────
  { id: 'cazic-thule-god', name: 'Cazic-Thule', zoneId: 'plane-of-fear', lvlMin: 55, lvlMax: 60, kind: 'raid', where: 'His temple at the heart of Fear', loot: ['God-tier raid loot'], notes: 'The Faceless. The final test of a classic-era raid force.' },
  { id: 'dracoliche', name: 'The Dracoliche', zoneId: 'plane-of-fear', lvlMin: 52, lvlMax: 56, kind: 'raid', where: 'Roams the plane', loot: ['Planar armor pieces'], notes: 'A skeletal dragon patrolling its master’s garden of horrors.' },
  { id: 'fear-golems', name: 'Fright, Dread, and Terror', zoneId: 'plane-of-fear', lvlMin: 50, lvlMax: 54, kind: 'raid', where: 'The golem grounds', loot: ['Planar armor'], notes: 'The three golems — the backbone of Fear raid nights.' },
  { id: 'innoruuk', name: 'Innoruuk', zoneId: 'plane-of-hate', lvlMin: 55, lvlMax: 60, kind: 'raid', where: 'His cathedral', loot: ['God-tier raid loot'], notes: 'The Prince of Hate in his own house.' },
  { id: 'maestro', name: 'The Maestro of Rancor', zoneId: 'plane-of-hate', lvlMin: 52, lvlMax: 56, kind: 'raid', where: 'The courtyard of the second tier', loot: ['Planar weapons'], notes: 'Conductor of Hate’s eternal symphony of violence.' },
  { id: 'hate-minions', name: 'Minions of Hate', zoneId: 'plane-of-hate', lvlMin: 48, lvlMax: 53, kind: 'notable', where: 'The lower city', loot: ['Planar armor pieces'], notes: 'The trash is a raid; the trash drops raid loot.' },
  { id: 'noble-dojorn', name: 'Noble Dojorn', zoneId: 'plane-of-sky', lvlMin: 52, lvlMax: 56, kind: 'raid', where: 'The efreeti island', notes: 'Gatekeeper of the early islands.' },
  { id: 'spiroc-lord', name: 'The Spiroc Lord', zoneId: 'plane-of-sky', lvlMin: 52, lvlMax: 56, kind: 'raid', where: 'The spiroc aviary island', loot: ['Planar weapons'] },
  { id: 'eye-of-veeshan', name: 'The Eye of Veeshan', zoneId: 'plane-of-sky', lvlMin: 58, lvlMax: 60, kind: 'raid', where: 'The final island', loot: ['The best loot of the classic era'], notes: 'The summit of classic raid progression.' }
];

export const MONSTERS_BY_ZONE: Record<string, Monster[]> = {};
for (const m of MONSTERS) {
  (MONSTERS_BY_ZONE[m.zoneId] ??= []).push(m);
}

export const KIND_LABELS: Record<Monster['kind'], string> = {
  named: 'Named (rare)',
  raid: 'Raid target',
  notable: 'Notable camp'
};
