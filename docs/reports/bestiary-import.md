# Bestiary import — EQL Wiki cross-check report

Source: `https://eqlwiki.com/api.php` (`{{Namedmobpage}}`)  ·  generated 2026-07-10

The EQL Wiki is authoritative for Legends mob data. This validates the curated Bestiary and
surfaces stats it does not carry (level, AC, HP, spawn %, respawn, aggro radius, drop rates).
Curated `where`/`notes` prose is never touched — a human folds harvested numbers into
monsters.ts after reviewing the mismatches. Loot links back to the items harvested by
`import-items.mjs`.

## Summary

| monster | era | wiki zone | lvl (curated→wiki) | HP / AC | respawn | loot (rate) | note |
|---|---|---|---|---|---|---|---|
| Fippy Darkpaw | Classic | **North Qeynos** (curated qeynos-hills) | 3-5 → 4 | 39 / 38 | — | Rusty Weapons (34%); Patch of Gnoll Fur (100%); Gnoll Fang (20%); High Quality Gnoll Fur (20%) |  |
| Holly Windstalker | — | Qeynos Hills | **18-22 → 27** | 999 / 194 | — | Bronze Short Sword (100%) |  |
| Lord Elgnub | Classic | Blackburrow | **10-12 → 22** | 850 / ? | — | Baby Joseph Sayer; Dark Runed Leggings; Wicked Sallet |  |
| Elite gnoll guardsmen | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Dark Assassin | Paineel | Everfrost Peaks, The Feerrott | 48-52 → 50 | 14500 / 344 | — | Bloody Mantle; Bloody Dirk; Fading Shadow Dagger |  |
| The Lich of Miragul | Paineel | Everfrost Peaks | **35-40 → 45** | 10 / 311 | 1 week? | — |  |
| Tundra mammoths | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Lady Vox | Classic | Permafrost | 50-55 → 55 | 32000 / 470 | 7 Days (+/- 8 Hours Variance) | Block of Permafrost; Crystalline Spear; Dragon Bone Bracelet; Kavruul`s Mystic Pouch |  |
| Ice giants | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Goblin warlords of Permafrost | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Grizzleknuckle | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Bandit camp leaders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Griffins of the plains | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Ravine gnoll chieftain | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Wandering hill giants | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Quillmane | Classic | **Southern Karana** (curated south-karana) | 30-34 → 30 | 1200 / 235 | — | Feathered Leggings; Pegasus Feather Cloak | **not-yet-live zone** |
| Grimfeather | — | **Northern Karana** (curated south-karana) | **24-28 → 37** | 2.2 / 259 | — | Jade Ring (50%); Griffon Eye (50%); Salil's Writ Pg. 60 (Left); Salil's Writ Pg. 90 (Left) (50%) | **not-yet-live zone** |
| Hill giants | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The Splitpaw chieftain | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Splitpaw elite guards | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Highpass gnoll chieftain | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The nobles of HighKeep | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Goblin cellar raiders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The dead of Kithicor | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Renux Herkanor | Epic Quests | **North Qeynos, Steamfont Mountains** (curated kithicor) | **35-40 → 43** | 20000 / 415 | — | Jagged Diamond Dagger; Trochilic's Skean; Ravenscale Belt; Ravenscale Cloak |  |
| Wall goblin raiders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The Evil Eye | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Goblin headmaster | Classic | **Ocean of Tears** (curated runnyeye) | **12-16 → 24** | 875 / 181 | 6 mins | Bonechipped Mask; Shadowed Knife; Rune of Clay |  |
| Minotaur elders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Evil eyes of the gorge | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Wandering griffons | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Dervish cutthroat camps | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Deathfist camp taskmasters | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The crypt keepers of Befallen | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Baron Telyx V`Zher | Classic | Befallen | 26-30 → 28 | 2234 / ? | 4:27 | Pristine Studded Leather Tunic; The Baron's Blade |  |
| Shadowed men | — | — | — | — | — | — | ⚠ no {{Namedmobpage}} (generic/plural camp, not a single named) |
| Fire drakes | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Najena | — | — | — | — | — | — | ⚠ no {{Namedmobpage}} (generic/plural camp, not a single named) |
| Drelzna | Classic | Najena | 24-27 → 25 | 875 / 226 | — | Journeyman's Boots (20%); Tentacle Whip (20%); Ashenwood Short Spear (20%); Stiletto of the Bloodclaw (20%) |  |
| Fire goblin taskmasters | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Lord Nagafen | Classic | Nagafen's Lair | 52-55 → 55 | 32000 / 470 | — | Bladestopper; Blight, Hammer of the Scourge; Cloak of Flames; Gauntlets of Fiery Might |  |
| King Tranix | Classic | Nagafen's Lair | **45-48 → 52** | 15550 / 446 | 8 Hours | Polished Mithril Torque; Crown of King Tranix; Throwing Boulder; Fire Giant Toes |  |
| Efreeti Lord Djarn | Classic | Nagafen's Lair | 46-49 → 50 | 9550 / 429 | 22 min | Djarn's Amethyst Ring (25%); Golden Efreeti Boots (75%) |  |
| Dorn B`Dynn | — | **Northern Desert of Ro** (curated north-ro) | **32-36 → 14** | 336 / 110 | 6:40 | Dragoon Dirk | **not-yet-live zone** |
| Dune orc taskmasters | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Lockjaw | Classic | Oasis of Marr | **18-22 → 25** | 875 / 181 | — | Lockjaw Hide Vest (50%); Glowing Wooden Crook (50%); Gator Meat (12%); Dark Elf Parts |  |
| Sand giants of the Oasis | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Spectres of the isle | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Cazel | — | **Oasis of Marr** (curated south-ro) | **34-38 → 51** | 9750 / 350 | — | Fine Steel Long Sword (50%); Golden Earring (50%); Words of Duress (33%); Sand of Ro (33%) |  |
| Ancient Cyclops | — | — | — | — | — | — | ⚠ no {{Namedmobpage}} (generic/plural camp, not a single named) |
| Ograbme | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Froglok bog raiders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The Froglok King | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The ancient croc of Guk | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The froglok shin lord | Classic | Upper Guk | 28-32 → 30 | 1200 / 267 | — | Silver-Plated Bracer; Ghoulbane; Mesh Armor; Rusty Short Sword |  |
| The Frenzied Ghoul | Classic | Lower Guk | 42-46 → 42 | 6261 / 364 | 28 min | Flowing Black Silk Sash (10%); Moonstone Ring (90%) |  |
| The Ghoul Lord | Classic | Lower Guk | 44-48 → 47 | 10863 / 405 | 9 min | Scalp of the Ghoul Lord; Skull-shaped Barbute (75%); Short Sword of the Ykesha (25%) |  |
| The Ghoul Arch Magus | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| A ghoul assassin | Classic | Lower Guk | **40-44 → 35** | 1656 / 308 | — | Mask of Deception (80%); Serrated Bone Dirk (20%) |  |
| The Ghoul Executioner | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Spectres of the broken bridge | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Tae Ew oracles | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Avatars of Fear | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Temple hierophants | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Hill giants of the Rathes | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Cyclops wanderers | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Aviak rooks of the isle | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Gnoll spiritists | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The Oracle of K`Arnon | Classic | Ocean of Tears | **28-32 → 36** | 1656 / 253 | ~6 hours | Robe of the Oracle (100%) |  |
| The Allizewsaur | Classic | Ocean of Tears | **38-44 → 50** | 15000 / 344 | 6.0 min | Emerald Ring (25%); Fire Emerald Ring (25%); Sapphire Necklace (25%); Star Ruby Earring (25%) |  |
| Cyclopes of Sister Isle | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Crushbone taskmasters | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Emperor Crush | Classic | Crushbone | **12-15 → 18** | 504 / 136 | 9 minutes | Dwarven Ringmail Tunic; Raw Hide Armor; Rusty Weapons; Bronze Weapons |  |
| Ambassador DVinn | Classic | Crushbone | **13-16 → 20** | 600 / 150 | 9 mins; orc pawn as PH. | Dragoon Dirk; Black Heart; Dark Elf Parts; Elven Blood |  |
| Lord Darish | Classic | Crushbone | 11-14 → 14 | 336 / 110 | — | Dwarven Axe (50%); Dwarven Two-Handed Axe |  |
| The Equestrielle | Classic | Lesser Faydark | **30-35 → 40** | 3250 / 279 | — | Unicorn Horn; Equestrielle's Eye; Unicorn Horn Fragments |  |
| Brownie scouts | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Meldrath the Malignant | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Minotaur elders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Greenblood goblin leaders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The chessboard wanderers | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Cauldron goblin skirmishers | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The Festering Hag | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Garanel Rucksif | Classic | The Estate of Unrest | **24-28 → 35** | 1675 / 246 | 22 minutes (or A Festering Hag) | Dwarven Work Boots (13%); Jagged Band (13%); Sphere of Unrest (12%) |  |
| Paralyzing ghouls | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Phinigel Autropos | Classic | Kedge Keep | 48-52 → 53 | 18 / 454 | 12 hours | Blue Crystal Staff; Kedge Backbone; Robe of the Kedge; Rod of Malisement |  |
| Estrella of Gloomwater | — | Kedge Keep | **40-44 → 51** | 9750 / 438 | 3 Days (2.5-3?) | Prayer Shawl (20%); Lamentation Blade (20%); Rod of Drones (20%) |  |
| Mayong Mistmoore | Classic | **Mistmoore Castle** (curated mistmoore) | 50-55 → 53 | ? / ? | — | Fanged Skull Stiletto | **not-yet-live zone** |
| Gargoyle sentries | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The vampiric court | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Kobold shaman packs | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Rogue kejek war-leaders | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Bull sharks | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The island kerran shaman | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| The Kobold King | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Highland panthers | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Highland gorillas | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Master Yael | Classic | **The Hole** (curated the-hole) | 50-55 → 56 | 32000 / 478 | 3 Days -/+8 | Earthshaker (33%); Serpent's Tooth (33%); Loam Encrusted Robe (50%); Brell's Girdle (50%) |  |
| Ratmen caretakers | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Cazic-Thule | — | — | — | — | — | — | ⚠ no {{Namedmobpage}} (generic/plural camp, not a single named) |
| The Dracoliche | Fear | Plane of Fear | **52-56 → 58** | 175000 / 600 | 7 Days (+/- 8 Hours) | Berserkers Ring; Crimson Robe of Alendine; Fearsome Shield; Grotesque Girdle |  |
| Fright, Dread, and Terror | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Innoruuk | — | — | — | — | — | — | ⚠ no {{Namedmobpage}} (generic/plural camp, not a single named) |
| The Maestro of Rancor | Hate | Plane of Hate | 52-56 → 52 | 16 / 363 | 3 Days (+/- 8 Hours) | Basoon Haste Gauntlets; Evensong; Hand of the Maestro; Kelin`s Seven Stringed Lute |  |
| Minions of Hate | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Noble Dojorn | Sky | Plane of Sky | **52-56 → 63** | 32 / 409 | 7 Days / 3 Days (No Variance) | Golden Efreeti Turban; Golden Efreeti Chestplate; Golden Efreeti Vambraces; Golden Efreeti Bracers |  |
| The Spiroc Lord | Sky | Plane of Sky | **52-56 → 63** | 33261 / 428 | — | Ceremonial Belt; Crude Wooden Flute; Dove Slippers; Fine Cloth Raiment |  |
| The Eye of Veeshan | Classic | Plane of Sky | **58-60 → 70** | 32000 / 474 | — | Blood Sky Ruby; Bloodsky Sapphire; Efreeti Great Staff; Ethereal Emerald |  |

_38/108 monsters matched a wiki page; 26 with a zone/level flag to reconcile._
