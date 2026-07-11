import type { CharacterProfile, Tradeskill } from './types';

// Curated tradeskill guide harvested from eqlwiki.com and classic-era guides,
// which EQL's crafting recreates. Trivials follow the classic values the wiki
// lists — expect small differences while the beta settles.

export const TRADESKILLS: Tradeskill[] = [
  // ── Crafts everyone can practice ──────────────────────────
  {
    id: 'baking',
    name: 'Baking',
    icon: '🍞',
    makes: 'Stat food and long-duration rations',
    summary:
      'Cheap to start, useful forever. Crafted food outlasts vendor rations many times over, ' +
      'and the top-end dishes add stats while they digest. Baking pairs naturally with Fishing ' +
      'and with Foraging classes — most of the good recipes start with something you caught or ' +
      'picked yourself.',
    container: 'Oven (plus a mixing bowl for batters) — every starting city has one',
    stat: 'INT or WIS (highest counts)',
    leveling: [
      {
        skill: '0–15',
        make: 'Muffins',
        trivial: 15,
        components: 'Cup of flour + water flask',
        where: 'Both from any baker vendor; ovens are steps away',
        note: 'Costs a few copper per combine — do 30 in one sitting.'
      },
      {
        skill: '15–36',
        make: 'Fish Rolls',
        trivial: 36,
        components: '2 × fresh fish + bat wing',
        where: 'Fish them yourself (raises Fishing too); bat wings drop everywhere at night',
        zoneIds: ['qeynos', 'freeport'],
        note: 'The classic double-dip: two skills for one bait budget.'
      },
      {
        skill: '36–76',
        make: 'Bear or Wolf Meat Pies',
        trivial: 76,
        components: 'Bear/wolf meat + pie tin + flour + spices',
        where: 'Meat drops off everything in Everfrost, the Karanas, and Nektulos',
        zoneIds: ['everfrost', 'west-karana', 'nektulos'],
        note: 'Halas pays a premium for the 10-lb pie — sell your practice batch.'
      },
      {
        skill: '76–135',
        make: 'Pickled goods & stews',
        trivial: 135,
        components: 'Vinegar + jars (Pottery!) + foraged vegetables or meat',
        where: 'Vinegar from brewers; jars from any potter — or make your own',
        note: 'This is where a Pottery sideline starts paying for itself.'
      },
      {
        skill: '135–248',
        make: 'Misty Thicket Picnics',
        trivial: 248,
        components: 'Bread, wine, fruit, cheese — a full basket per combine',
        where: 'Rivervale vendors stock most of it; the halflings knew what they were doing',
        zoneIds: ['rivervale', 'misty-thicket'],
        note: 'The endgame ration: feeds a full group for hours per basket.'
      }
    ],
    notable: [
      {
        name: 'Misty Thicket Picnic',
        trivial: 248,
        components: 'Bread + wine + fruit + cheese',
        why: 'Best food in the game — hours of duration, group-sized stacks, and a steady seller.'
      },
      {
        name: 'Fish Rolls',
        trivial: 36,
        components: '2 × fresh fish + bat wing',
        why: 'Days of cheap rations for casters who would rather spend coin on spells.'
      }
    ],
    tips: [
      'Buy flour and water 20 at a time and pre-slot them — baking skill-ups are a volume game.',
      'Foragers (rangers, druids, halflings) turn free forage results into skill-ups and food.',
      'Stat food stacks with spell buffs — feed your tank.'
    ]
  },
  {
    id: 'blacksmithing',
    name: 'Blacksmithing',
    icon: '⚒️',
    makes: 'Banded armor, fine plate, sharpening stones, weapon blanks',
    summary:
      'The armorer’s craft, and the most gear-relevant tradeskill for melee loadouts. ' +
      'Banded armor is the first full crafted set a tank can wear, fine plate carries you into ' +
      'the raid game, and sharpening stones upgrade the weapons you already swing. It is also ' +
      'the most expensive skill to raise — plan to fund it from another craft.',
    container: 'Forge — every city, plus camps like the Oasis dock',
    stat: 'INT or WIS; STR also checks on skill-ups',
    synergyClasses: ['warrior', 'paladin', 'shadow-knight', 'berserker'],
    synergyNote: 'Plate wearers craft their own upgrades instead of camping drops.',
    leveling: [
      {
        skill: '0–18',
        make: 'Metal Bits',
        trivial: 18,
        components: '2 × small piece of ore + water flask',
        where: 'Ore from any smithing supply vendor next to the forge',
        note: 'Keep every stack — metal bits feed the sheet metal you need next.'
      },
      {
        skill: '18–37',
        make: 'Sheet Metal & Lanterns',
        trivial: 37,
        components: 'Metal bits + smithy hammer; lantern casings from the same vendor',
        where: 'All vendor-bought — park at the Freeport or Qeynos forge',
        zoneIds: ['freeport', 'qeynos']
      },
      {
        skill: '37–74',
        make: 'Banded Armor (belt → breastplate)',
        trivial: 74,
        components: '2 × sheet metal + banded pattern + cured leather padding',
        where: 'Patterns from smithing vendors; work up the set smallest piece first',
        note: 'Belt and collar trivial lowest, breastplate highest — sell or wear every piece.'
      },
      {
        skill: '74–135',
        make: 'Weapon blanks & sharpening stones',
        trivial: 135,
        components: 'Weapon molds + metal bits + grindstone',
        where: 'Molds from weaponsmith vendors; dropped fine steel sells the result',
        note: 'Sharpening stones move fast on player vendors — melee buy them constantly.'
      },
      {
        skill: '135–188',
        make: 'Fine Plate Armor',
        trivial: 188,
        components: 'Sheet metal + plate molds + quality firing sheet (Pottery)',
        where: 'Molds are vendor-bought; firing sheets from a potter friend — or yourself',
        note: 'The payoff tier: fine plate is genuinely good armor and always in demand.'
      }
    ],
    notable: [
      {
        name: 'Fine Plate Breastplate',
        trivial: 188,
        components: 'Sheet metal + breastplate mold + quality firing sheet',
        why: 'Best non-raid chest for plate tanks, and the single most requested crafted item.'
      },
      {
        name: 'Banded Mail (full set)',
        trivial: 74,
        components: 'Sheet metal + patterns + cured leather',
        why: 'A complete tank set makeable by level 10 money — the classic twink kit.'
      },
      {
        name: 'Weapon Sharpening Stone',
        trivial: 135,
        components: 'Grindstone + metal bits',
        why: 'Consumable weapon damage — melee groups burn through these on named camps.'
      }
    ],
    tips: [
      'This is the money sink of tradeskills — level Jewelcrafting or Alchemy first to fund it.',
      'Ore weighs a ton; a STR buff or an ogre/troll/barbarian frame saves trips.',
      'Cross-train Pottery to ~135 for your own firing sheets before starting fine plate.'
    ]
  },
  {
    id: 'brewing',
    name: 'Brewing',
    icon: '🍺',
    makes: 'Ales, spirits, quest booze, and vinegar for other crafts',
    summary:
      'The cheapest skill to raise and the social one — half of Norrath’s quest chains ' +
      'want a specific bottle of something. Crafted drink also carries stat bonuses at the top ' +
      'end, and brewers supply the vinegar and casks other tradeskills quietly depend on.',
    container: 'Brew Barrel — every tavern has one',
    stat: 'INT or WIS',
    leveling: [
      {
        skill: '0–58',
        make: 'Short Beers',
        trivial: 58,
        components: 'Hops + malt + water flask + cask',
        where: 'Everything from the tavern vendor standing next to the barrel',
        note: 'A copper a combine and it carries you almost to 60 — no excuse to skip it.'
      },
      {
        skill: '58–122',
        make: 'Mead & Faydwer Shakers',
        trivial: 122,
        components: 'Honey + water + yeast; shakers add fennel',
        where: 'Honey from bee-heavy zones’ vendors (Rivervale, Kelethin)',
        zoneIds: ['rivervale', 'kelethin']
      },
      {
        skill: '122–188',
        make: 'Kaladim Constitutionals',
        trivial: 188,
        components: 'Dwarven ale base + spirits + kerran spices',
        where: 'Base stock in Kaladim — the dwarves take brewing seriously',
        zoneIds: ['kaladim']
      },
      {
        skill: '188–248',
        make: 'Heady Kiola',
        trivial: 248,
        components: 'Kiola nuts + fermented base',
        where: 'Kiola nuts only grow on Kerra Isle — bring a bag, fill it',
        zoneIds: ['kerra-isle'],
        note: 'The capstone brew, and a stat drink people actually pay for.'
      }
    ],
    notable: [
      {
        name: 'Heady Kiola',
        trivial: 248,
        components: 'Kiola nuts + fermented base',
        why: 'Top-shelf stat drink; the Kerra Isle nut run is a rite of passage.'
      },
      {
        name: 'Vinegar',
        trivial: 90,
        components: 'Wine + mother culture',
        why: 'Not glamorous — but Baking’s entire pickling tier buys it from you.'
      }
    ],
    tips: [
      'Cheapest tradeskill in the game — a few gold takes you past 100 skill.',
      'Check quest logs before selling oddball results: "quest booze" turn-ins are everywhere.',
      'Halflings and dwarves get a racial head start behind the barrel. Of course they do.'
    ]
  },
  {
    id: 'fishing',
    name: 'Fishing',
    icon: '🎣',
    makes: 'Fresh fish (food + Baking stock), rusty weapons, the occasional boot',
    summary:
      'The idle skill: cast at any open water while you camp a spawn or wait on a boat. Fresh ' +
      'fish is free food and the input for Baking’s Fish Rolls, and every fisher has a ' +
      'story about what else came up on the hook.',
    container: 'None — equip a fishing pole, face water, and cast',
    stat: 'None — practice is all that raises it',
    leveling: [
      {
        skill: '0–100',
        make: 'Cast at any water',
        components: 'Fishing pole + bait',
        where: 'Both from any tavern or fishing vendor; docks are everywhere',
        zoneIds: ['qeynos', 'freeport', 'butcherblock'],
        note: 'Skill raises on failed casts too — it just takes patience and cheap bait.'
      },
      {
        skill: 'Any',
        make: 'Fish while camping',
        components: 'A camp spot near water',
        where: 'Oasis docks, Lake Rathetear, Dagnor’s Cauldron — level where fish swim',
        zoneIds: ['oasis', 'lake-rathetear', 'dagnors-cauldron']
      }
    ],
    notable: [
      {
        name: 'Fresh Fish',
        components: 'Pole + bait + water',
        why: 'Free rations forever, and the Baking ladder’s favorite ingredient.'
      }
    ],
    tips: [
      'Poles break — carry a spare or (if you know a gnome) a collapsible one.',
      'Frogloks and kerrans fish like they were born to it. They were.',
      'Fish stacks are weightless food for casters counting every stone of ore.'
    ]
  },
  {
    id: 'fletching',
    name: 'Fletching',
    icon: '🏹',
    makes: 'Bows and arrows — sustained ammo for Ranged stance users',
    summary:
      'Ammunition economics: anyone using the Ranged stance burns arrows constantly, and ' +
      'fletchers make better ones cheaper than any vendor sells. The bow ladder tops out at ' +
      'weapons that rival dungeon drops — rangers should treat this skill as part of the kit.',
    container: 'Fletching Kit (portable — carry it in a bag slot)',
    stat: 'INT or WIS; DEX also checks on skill-ups',
    synergyClasses: ['ranger', 'rogue', 'warrior'],
    synergyNote: 'Ranged-stance users craft their own ammo instead of bleeding coin on it.',
    leveling: [
      {
        skill: '0–22',
        make: 'Class 1 Wood Point Arrows',
        trivial: 22,
        components: 'Wooden shafts + field points + round fletchings + nocks',
        where: 'All four parts from any fletching supply vendor',
        note: 'Every combine yields usable arrows — nothing is wasted at any tier.'
      },
      {
        skill: '22–68',
        make: 'Class 2 arrows (better points & fletching)',
        trivial: 68,
        components: 'Bone/steel points + parabolic fletchings + shafts',
        where: 'Vendor-bought; bone points also drop off skeletons everywhere'
      },
      {
        skill: '68–135',
        make: 'Ceramic & steel shaft arrows',
        trivial: 135,
        components: 'Ceramic shafts (Pottery) or steel shafts (Smithing) + fine parts',
        where: 'Cross-craft or buy from other crafters',
        note: 'Another quiet cross-skill dependency — friends with kilns help.'
      },
      {
        skill: '135–188',
        make: 'Carved bows (elm → oak)',
        trivial: 188,
        components: 'Bow staves + hide strings + planing tool',
        where: 'Staves from fletching vendors; strings from tanners',
        note: 'Mid bows sell to every leveling ranger and rogue on the server.'
      },
      {
        skill: '188–248',
        make: 'Trueshot Longbow',
        trivial: 248,
        components: 'Shaped oak stave + treated string + fine planing',
        where: 'The capstone combine — components across several vendors',
        note: 'A raid-quality bow, made at a workbench.'
      }
    ],
    notable: [
      {
        name: 'Trueshot Longbow',
        trivial: 248,
        components: 'Shaped oak stave + treated bow string',
        why: 'The best crafted bow — rangers camp fletching masters just to commission one.'
      },
      {
        name: 'Class 2 Ceramic Arrows',
        trivial: 135,
        components: 'Ceramic shafts + steel points + parabolic fletching',
        why: 'The damage-per-copper sweet spot for sustained ranged pulling.'
      }
    ],
    tips: [
      'Arrows from skill-up combines are never wasted — you will shoot every one of them.',
      'Wood elves and half elves take to the craft fastest (DEX pays twice here).',
      'Stock arrows before raid nights; ranged pullers clear a quiver per session.'
    ]
  },
  {
    id: 'jewelcrafting',
    name: 'Jewelcrafting',
    icon: '💍',
    makes: 'Enchanted stat jewelry from gems and bars',
    summary:
      'The money craft. Stat jewelry is the one gear slot family that is pure crafted, and ' +
      'gems drop everywhere as loot begging to be cut. The catch: the good tiers need bars ' +
      'enchanted by an enchanter — which in EQL’s multiclass world can simply be you.',
    container: 'Jeweler’s Kit (portable)',
    stat: 'INT or WIS',
    synergyClasses: ['enchanter'],
    synergyNote:
      'Enchanters cast the Enchant Silver/Gold/Platinum line themselves — the whole supply ' +
      'chain in one loadout.',
    leveling: [
      {
        skill: '0–16',
        make: 'Silver + Malachite rings',
        trivial: 16,
        components: 'Silver bar + malachite',
        where: 'Both from jewelry vendors; malachite also drops off goblins',
        zoneIds: ['neriak', 'ak-anon']
      },
      {
        skill: '16–74',
        make: 'Silver & electrum with low gems',
        trivial: 74,
        components: 'Silver/electrum bars + turquoise, azurite, jasper',
        where: 'Vendor gems; loot gems from any humanoid camp beat vendor prices'
      },
      {
        skill: '74–135',
        make: 'Gold with mid gems',
        trivial: 135,
        components: 'Gold bars + amber, opal, onyx',
        where: 'Buy bars, loot gems — highwaymen and gnolls hoard them'
      },
      {
        skill: '135–188',
        make: 'Enchanted gold jewelry',
        trivial: 188,
        components: 'Enchanted gold bar + fine gems',
        where: 'Bars need an enchanter’s Enchant Gold — cast it yourself or pay one',
        note: 'Enchanted pieces carry the stat bonuses people actually shop for.'
      },
      {
        skill: '188–250',
        make: 'Enchanted platinum with rubies & diamonds',
        trivial: 250,
        components: 'Enchanted platinum bar + ruby / sapphire / diamond',
        where: 'Top gems drop in dungeons (Guk, Sol’s Eye, Permafrost) and raid zones',
        zoneIds: ['lower-guk', 'soluseks-eye', 'permafrost']
      }
    ],
    notable: [
      {
        name: 'Enchanted Platinum Diamond Ring',
        trivial: 250,
        components: 'Enchanted platinum bar + diamond',
        why: 'Endgame stat jewelry — the standing top seller of the entire economy.'
      },
      {
        name: 'Golden Sapphire Earring',
        trivial: 188,
        components: 'Enchanted gold bar + sapphire',
        why: 'The mid-game caster earring every INT class shops for at level 30.'
      }
    ],
    tips: [
      'Never vendor a looted gem — every one is a skill-up or a sale.',
      'An enchanter in your loadout removes the biggest cost (enchanted bars) entirely.',
      'Failed combines eat the gem AND the bar: stop combining within 5 of trivial and buy the next tier.'
    ]
  },
  {
    id: 'pottery',
    name: 'Pottery',
    icon: '🏺',
    makes: 'Firing sheets, jars, idols, and quest containers',
    summary:
      'The supplier craft. Potters make the firing sheets Blacksmithing’s fine plate ' +
      'needs, the jars Baking pickles in, the ceramic shafts fletchers want, and the specific ' +
      'containers half the quest chains demand. Two-step process: shape clay at the wheel, ' +
      'then fire it in the kiln.',
    container: 'Pottery Wheel + Kiln — paired in every city crafting yard',
    stat: 'INT or WIS',
    leveling: [
      {
        skill: '0–17',
        make: 'Small Bowls',
        trivial: 17,
        components: 'Small block of clay + water + bowl sketch, then a firing sheet',
        where: 'Clay, sketches, and sheets all from the pottery vendor by the wheel'
      },
      {
        skill: '17–76',
        make: 'Jars, flasks & skewers',
        trivial: 76,
        components: 'Blocks of clay + the matching sketch + firing sheet',
        where: 'Vendor-bought; sell the jars to bakers and alchemists'
      },
      {
        skill: '76–135',
        make: 'Quality Firing Sheets & large containers',
        trivial: 135,
        components: 'High-quality clay + refined sketches',
        where: 'Quality clay from dungeon-adjacent vendors and gnoll/goblin drops',
        note: 'Quality firing sheets are the input Blacksmithing pays real money for.'
      },
      {
        skill: '135–202',
        make: 'Idols & ceremonial pieces',
        trivial: 202,
        components: 'Quality clay + gemstone inlays (Jewelcrafting scraps work)',
        where: 'Combine gem dust with clay — shaman and cleric quests eat these',
        note: 'Idol commissions are steady income once your name gets around.'
      }
    ],
    notable: [
      {
        name: 'Quality Firing Sheet',
        trivial: 135,
        components: 'High-quality clay block, fired',
        why: 'Every fine-plate smith on the server needs a stack — evergreen demand.'
      },
      {
        name: 'Ceramic Jar',
        trivial: 76,
        components: 'Block of clay + jar sketch',
        why: 'Baking’s pickling tier and several quest chains consume them endlessly.'
      }
    ],
    tips: [
      'Clay is heavy — buy per session, not in bulk, unless you brought an ogre.',
      'Check quest requirements before selling odd containers; several turn-ins want exact pieces.',
      'The wheel and kiln are separate checks: shape everything first, then fire in batches.'
    ]
  },
  {
    id: 'tailoring',
    name: 'Tailoring',
    icon: '🧵',
    makes: 'Leather and silk armor, backpacks',
    summary:
      'Armor for everyone Blacksmithing doesn’t cover: leather for druids, monks, and ' +
      'beastlords, silk for casters, and backpacks for absolutely everyone. Raw materials ' +
      'drop off the animals you were killing anyway — tailoring turns pelts into progress.',
    container: 'Sewing Kit (portable)',
    stat: 'INT or WIS',
    synergyClasses: ['monk', 'druid', 'beastlord', 'necromancer', 'wizard', 'magician', 'enchanter'],
    synergyNote: 'Leather and silk wearers craft their own armor tiers from hunting byproducts.',
    leveling: [
      {
        skill: '0–21',
        make: 'Patchwork Armor',
        trivial: 21,
        components: 'Low-quality pelts + patterns + sewing needle',
        where: 'Pelts off wolves, bears, and cats in every newbie zone',
        zoneIds: ['qeynos-hills', 'greater-faydark', 'everfrost']
      },
      {
        skill: '21–66',
        make: 'Raw-hide Armor',
        trivial: 66,
        components: 'Medium-quality pelts + raw-hide patterns',
        where: 'Better pelts from the Karanas and Butcherblock predators',
        zoneIds: ['west-karana', 'butcherblock']
      },
      {
        skill: '66–102',
        make: 'Cured leather & Backpacks',
        trivial: 102,
        components: 'High-quality pelts + tannin + backpack pattern',
        where: 'HQ pelts off higher-level beasts; tannin from tanner vendors',
        note: 'Backpacks sell to literally every character on the server.'
      },
      {
        skill: '102–135',
        make: 'Silk Swatches & caster wear',
        trivial: 135,
        components: 'Spider silks × 2 → swatch; swatches + patterns → armor',
        where: 'Spiders in Lesser Faydark, the Feerrott, and every dungeon entrance',
        zoneIds: ['lesser-faydark', 'feerrott']
      },
      {
        skill: '135–188',
        make: 'Wu’s Fighting Armor',
        trivial: 188,
        components: 'Silk swatches + cured leather + Wu’s patterns',
        where: 'Patterns from monk guild vendors in Qeynos and Freeport',
        zoneIds: ['qeynos', 'freeport'],
        note: 'The monk set — and the tailoring capstone worth selling.'
      }
    ],
    notable: [
      {
        name: 'Backpack',
        trivial: 102,
        components: 'High-quality cured leather + backpack pattern',
        why: '8 slots, weight reduction on coin, universal demand — the tailor’s bread and butter.'
      },
      {
        name: 'Wu’s Fighting Gauntlets',
        trivial: 188,
        components: 'Silk swatches + cured leather + pattern',
        why: 'Best-in-slot monk hands until the planes — monks pay whatever you ask.'
      }
    ],
    tips: [
      'Sort pelts by quality the moment they drop; each tier feeds a different rung.',
      'Silk farming doubles as XP — dungeon-entrance spiders are always level-appropriate.',
      'Sell backpacks near banks. Trust us.'
    ]
  },

  // ── Gated crafts ──────────────────────────────────────────
  {
    id: 'alchemy',
    name: 'Alchemy',
    icon: '🧪',
    makes: 'Potions: haste, regen, illusions, stat buffs',
    summary:
      'Shaman magic in a bottle. Alchemy sells the four things everyone wants and cannot ' +
      'cast: Spirit of Wolf, haste, regen, and illusions — which makes it the most reliable ' +
      'money-maker in the game. In EQL, any loadout that includes Shaman can practice it.',
    container: 'Medicine Bag, sold by shaman guild vendors',
    stat: 'INT or WIS',
    requiresClasses: ['shaman'],
    leveling: [
      {
        skill: '0–68',
        make: 'Practice tonics from guild herbs',
        trivial: 68,
        components: 'Two vendor herbs + vial of pure water',
        where: 'Everything from your shaman guild’s alchemy vendor',
        zoneIds: ['halas', 'grobb', 'oggok'],
        note: 'Bulk-buy and grind — the herbs cost less than the vials.'
      },
      {
        skill: '68–135',
        make: 'Blood of the Wolf (SoW potions)',
        trivial: 135,
        components: 'Wolf blood + herbs + vial',
        where: 'Wolf blood off every wolf in Everfrost and the Karanas',
        zoneIds: ['everfrost', 'north-karana'],
        note: 'Skill-ups that sell out before you finish the batch.'
      },
      {
        skill: '135–204',
        make: 'Resist & stat potions (Kilva’s line)',
        trivial: 204,
        components: 'Named herbs + dropped catalysts (fire beetle eyes, ice of Velious-tier zones)',
        where: 'Catalysts from Lavastorm and Permafrost camps',
        zoneIds: ['lavastorm', 'permafrost']
      },
      {
        skill: '204–248',
        make: 'Illusion & haste potions',
        trivial: 248,
        components: 'Rare dropped reagents + refined bases',
        where: 'Dungeon drops — Guk, Sol’s Eye, Mistmoore',
        zoneIds: ['lower-guk', 'soluseks-eye', 'mistmoore'],
        note: 'The endgame product line: haste in a bottle prices itself.'
      }
    ],
    notable: [
      {
        name: 'Blood of the Wolf',
        trivial: 135,
        components: 'Wolf blood + herbs + vial',
        why: 'Spirit of Wolf for people without a shaman standing next to them — sells forever.'
      },
      {
        name: 'Kilva’s Skin of Flame',
        trivial: 204,
        components: 'Fire catalysts + herb base',
        why: 'Fire resist for Sol’s Eye, Nagafen, and every dragon raid’s shopping list.'
      },
      {
        name: 'Potion of Haste',
        trivial: 248,
        components: 'Rare reagents + refined base',
        why: 'Melee haste, no enchanter required. The single most profitable consumable.'
      }
    ],
    tips: [
      'Requires Shaman in your loadout — one of multiclassing’s quiet economic perks.',
      'Every potion tier sells; price skill-up batches at cost and you level for free.',
      'Stock resist potions before each raid era rotates — demand spikes are predictable.'
    ]
  },
  {
    id: 'poison-making',
    name: 'Poison Making',
    icon: '☠️',
    makes: 'Blade poisons: damage procs, snares, debuffs',
    summary:
      'The rogue’s edge. Applied poisons give your openers a proc the other melee classes ' +
      'simply do not have — damage, movement snare, or a stat debuff, your choice per fight. ' +
      'Requires Rogue in your loadout, and the guild only teaches its own.',
    container: 'Mortar and Pestle, from rogue guild vendors',
    stat: 'INT or WIS; DEX checks when applying',
    requiresClasses: ['rogue'],
    leveling: [
      {
        skill: '0–35',
        make: 'Weak suspension poisons',
        trivial: 35,
        components: 'Vendor toxins + suspension + sealed vial',
        where: 'Rogue guild poison vendors (ask quietly)',
        zoneIds: ['qeynos', 'freeport', 'neriak']
      },
      {
        skill: '35–95',
        make: 'Lethargy & Muscle Lock lines',
        trivial: 95,
        components: 'Spider venom sacs + suspensions',
        where: 'Venom sacs off every spider you were already killing for silk'
      },
      {
        skill: '95–160',
        make: 'Fighter’s Bane line',
        trivial: 160,
        components: 'Snake venom + refined suspensions',
        where: 'Desert snakes in the Ros; refined suspensions from guild masters',
        zoneIds: ['north-ro', 'south-ro']
      },
      {
        skill: '160–235',
        make: 'System Shock line',
        trivial: 235,
        components: 'Rare venoms (Cazic-Thule tae ew, Guk froglok shamans) + master suspensions',
        where: 'Dungeon farming — bring your dagger, you work here anyway',
        zoneIds: ['cazic-thule', 'lower-guk']
      }
    ],
    notable: [
      {
        name: 'System Shock V',
        trivial: 235,
        components: 'Rare venom + master suspension',
        why: 'The big opener proc — backstab plus this is the hardest single hit in the game.'
      },
      {
        name: 'Lethargy',
        trivial: 95,
        components: 'Spider venom + suspension',
        why: 'A snare in a vial: solo rogues stop runners without a caster babysitter.'
      }
    ],
    tips: [
      'Requires Rogue in your loadout — the guild checks.',
      'Poisons are consumed on proc: brew in batches of ten before dungeon nights.',
      'A shaman/rogue loadout owns both Alchemy and Poison Making — the consumables baron.'
    ]
  },
  {
    id: 'research',
    name: 'Spell Research',
    icon: '📜',
    makes: 'Your own class spells from dungeon-dropped words, runes, and pages',
    summary:
      'The scholar’s craft, for the four INT casters. Dungeons drop words, runes, and ' +
      'torn pages; research combines them into real spells — including several that no vendor ' +
      'sells. Spells marked "Research" on your class pages come from exactly this.',
    container: 'Your class’s tome (Lexicon, Grimoire, etc.), from caster guild vendors',
    stat: 'INT',
    requiresClasses: ['enchanter', 'magician', 'necromancer', 'wizard'],
    leveling: [
      {
        skill: '0–50',
        make: 'Low-tier spell combines (level 8–16 spells)',
        components: '2 matching words or runes for the target spell',
        where: 'Words/runes drop from casters in Befallen, Blackburrow, and Upper Guk',
        zoneIds: ['befallen', 'blackburrow', 'upper-guk'],
        note: 'Trivial tracks the spell’s level — combine the lowest spells you are missing first.'
      },
      {
        skill: '50–120',
        make: 'Mid-tier combines (level 20–34 spells)',
        components: 'Rarer word/rune pairs + torn page fragments',
        where: 'Mistmoore, Najena, and Sol’s Eye casters drop the mid components',
        zoneIds: ['mistmoore', 'najena', 'soluseks-eye']
      },
      {
        skill: '120–200+',
        make: 'High combines (level 39+ spells)',
        components: 'Rare runes + matched page pairs (left + right)',
        where: 'Lower Guk, The Hole, and planar trash — raid nights feed your book',
        zoneIds: ['lower-guk', 'the-hole', 'plane-of-hate']
      }
    ],
    notable: [
      {
        name: 'Your unsellable spells',
        components: 'Words, runes, and pages — see the Research badge on your class pages',
        why: 'Several strong spells per class exist ONLY through research. Check your list.'
      }
    ],
    tips: [
      'Requires Enchanter, Magician, Necromancer, or Wizard in your loadout.',
      'Loot every word and rune even when they stack awkwardly — trivial combines still fail 5%, and components are the real cost.',
      'Filter your class page by the Research source badge to build a shopping list first.'
    ]
  },
  {
    id: 'tinkering',
    name: 'Tinkering',
    icon: '⚙️',
    makes: 'Gadgets: rebreathers, collapsible tools, spyglasses, firework oddities',
    summary:
      'Gnomes only — the eyes of Ak’Anon light up when you ask. Tinkering makes the ' +
      'utility items nothing else provides: rebreathers for the deep-water dungeons, ' +
      'collapsible tools that never clutter a bag, and a spyglass to scout pulls from a ' +
      'safe ridge.',
    container: 'Toolbox, from Ak’Anon tinkering vendors',
    stat: 'INT',
    requiresRaces: ['gnome'],
    leveling: [
      {
        skill: '0–50',
        make: 'Gears, springs & cogs',
        trivial: 50,
        components: 'Metal bits (Smithing) + gnomish schematics',
        where: 'Schematics only in Ak’Anon; metal bits you make or buy',
        zoneIds: ['ak-anon'],
        note: 'A Smithing base to ~20 feeds Tinkering forever.'
      },
      {
        skill: '50–135',
        make: 'Collapsible tools & clockwork toys',
        trivial: 135,
        components: 'Gears + springs + casing',
        where: 'All self-made from the tier below — tinkering feeds itself',
        note: 'Collapsible fishing poles never break and fold into nothing. Fishermen notice.'
      },
      {
        skill: '135–202',
        make: 'Spyglasses & measuring devices',
        trivial: 202,
        components: 'Ground lenses (gem dust!) + fitted casings',
        where: 'Gem dust from Jewelcrafting failures — yours or a friend’s'
      },
      {
        skill: '202–248',
        make: 'Gnomish Rebreathers',
        trivial: 248,
        components: 'Fine gears + treated hide bladder + brass fittings',
        where: 'The capstone gadget — components across three crafts',
        note: 'Kedge Keep raids are gated on how many of these your server’s gnomes made.'
      }
    ],
    notable: [
      {
        name: 'Gnomish Rebreather',
        trivial: 248,
        components: 'Fine gears + hide bladder + brass fittings',
        why: 'Breathe underwater indefinitely — mandatory for Kedge Keep, priceless to non-frogloks.'
      },
      {
        name: 'Collapsible Fishing Pole',
        trivial: 135,
        components: 'Gears + springs + casing',
        why: 'Never breaks, weighs nothing — every fisher on the server wants one.'
      },
      {
        name: 'Spyglass',
        trivial: 202,
        components: 'Ground lens + fitted casing',
        why: 'See farther than any spell lets you — the puller’s best friend.'
      }
    ],
    tips: [
      'Gnomes only — no AA, quest, or amount of pleading changes this.',
      'Level Smithing to ~20 first; metal bits are tinkering’s flour and water.',
      'Rebreathers before Kedge nights sell at whatever number you say out loud.'
    ]
  }
];

export const TRADESKILL_BY_ID: Record<string, Tradeskill> = Object.fromEntries(
  TRADESKILLS.map((t) => [t.id, t])
);

/** can this character practice the craft at all? */
export function canPractice(t: Tradeskill, c: CharacterProfile): boolean {
  if (t.requiresRaces && !t.requiresRaces.includes(c.raceId)) return false;
  if (t.requiresClasses && !t.requiresClasses.some((id) => c.classIds.includes(id))) return false;
  return true;
}

export interface TradeskillFit {
  tradeskill: Tradeskill;
  /** 'gated' = exclusive craft this character qualifies for; 'synergy' = extra value; 'open' = available to all */
  fit: 'gated' | 'synergy' | 'open';
}

/** rank the crafts for a character: exclusive unlocks first, then synergies, then the rest */
export function tradeskillsFor(c: CharacterProfile): { available: TradeskillFit[]; locked: Tradeskill[] } {
  const available: TradeskillFit[] = [];
  const locked: Tradeskill[] = [];
  for (const t of TRADESKILLS) {
    if (!canPractice(t, c)) {
      locked.push(t);
    } else if (t.requiresClasses || t.requiresRaces) {
      available.push({ tradeskill: t, fit: 'gated' });
    } else if (t.synergyClasses?.some((id) => c.classIds.includes(id))) {
      available.push({ tradeskill: t, fit: 'synergy' });
    } else {
      available.push({ tradeskill: t, fit: 'open' });
    }
  }
  const rank = { gated: 0, synergy: 1, open: 2 } as const;
  available.sort((a, b) => rank[a.fit] - rank[b.fit]);
  return { available, locked };
}
