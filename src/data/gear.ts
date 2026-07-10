import type { GearItem, GearSlot, GearTier } from './types';

// Curated notable equipment. Stats, slots, class restrictions and drop sources are
// cross-checked against the EQL Wiki's {{Itempage}} data (scripts/import-items.mjs,
// docs/reports/item-import.md) — Legends re-cut several items and re-homed their drops
// vs. classic EQ, so these follow Legends, not classic memory. Items whose Legends source
// is a not-yet-live zone (e.g. Kunark's Old Sebilis) carry `available: false` and are
// flagged in the UI rather than shown with a fabricated classic location. Each item links
// to the zone it farms in (Atlas) and, where modeled, the mob that drops it (Bestiary).

export const SLOT_LABELS: Record<GearSlot, string> = {
  weapon: 'Weapon',
  shield: 'Shield',
  head: 'Head',
  chest: 'Chest',
  arms: 'Arms',
  hands: 'Hands',
  wrist: 'Wrist',
  legs: 'Legs',
  feet: 'Feet',
  neck: 'Neck',
  back: 'Back',
  waist: 'Waist',
  face: 'Face',
  ears: 'Ear',
  fingers: 'Ring'
};

export const TIER_LABELS: Record<GearTier, string> = {
  starter: 'Starter',
  mid: 'Mid-game',
  endgame: 'Endgame',
  raid: 'Raid'
};

export const GEAR: GearItem[] = [
  // ── Starter (rough level 10-20) ────────────────────────────
  {
    id: 'screaming-mace',
    name: 'Screaming Mace',
    slot: 'weapon',
    notable: 'A 1H Blunt (8 dmg / 35 delay) whose proc is a short STR + AC buff, much like a self-cast Yaulp — a strong early hybrid/melee reward. Usable by all but the pure INT casters.',
    levelMin: 12,
    tier: 'starter',
    zoneId: 'crushbone',
    source: 'Final reward of the Screaming Mace Quest, given by the dwarven smith in Crushbone.',
    farm: 'Not a drop — run the Screaming Mace Quest in Crushbone: recover the smith’s stolen goods (Brass Earring, Shiny Brass Shield), prove the deaths of Emperor Crush and the orc warlord, then have the elven priest enchant a Dwarven Mace into the Screaming Mace. A low-teens group clearing Crushbone can finish it over a few sessions.'
  },
  {
    id: 'guise-deceiver',
    name: 'Guise of the Deceiver',
    slot: 'face',
    notable: 'Clicks a permanent Dark Elf illusion (AC 4, CHA +13, MR +7) — one of the most coveted vanity/utility items in the game. NO DROP and only equippable by bards and rogues, but clickable from inventory by any class.',
    levelMin: 18,
    tier: 'starter',
    zoneId: 'lower-guk',
    source: 'Rare NO DROP off a ghoul assassin in Lower Guk (restored to the Legends beta May 2026; when it stops dropping, the assassin drops Mask of Deception instead).',
    farm: 'Camp the ghoul-assassin spawns on the live side of Lower Guk and rotate placeholders. A patient group in the 20s–30s can hold it; expect a long grind for the rare.'
  },
  {
    id: 'granite-tomahawk',
    name: 'Polished Granite Tomahawk',
    slot: 'weapon',
    notable: 'A fast 1H Slashing weapon (6 dmg / 26 delay) whose Berserker Strength proc adds STR and a small damage shield — a great early melee one-hander for warriors, knights, rangers, bards and rogues.',
    levelMin: 20,
    tier: 'starter',
    classes: ['warrior', 'paladin', 'ranger', 'shadow-knight', 'bard', 'rogue'],
    zoneId: 'highpass',
    source: 'Drops from Grenix Mucktail in Highpass Hold.',
    farm: 'Camp Grenix Mucktail and his gnoll cohort in Highpass Hold; a small group or a strong duo in the low 20s can hold the spawn and rotate placeholders.'
  },

  // ── Mid-game (rough level 20-40) ───────────────────────────
  {
    id: 'flowing-black-silk-sash',
    name: 'Flowing Black Silk Sash',
    slot: 'waist',
    notable: 'The famous “FBSS” — +21% haste on the waist with no level requirement, usable by every class. A permanent DPS upgrade the whole server chases.',
    levelMin: 25,
    tier: 'mid',
    zoneId: 'lower-guk',
    monsterId: 'frenzied-ghoul',
    source: 'Drops from a frenzied ghoul (and other froglok ghouls) in Lower Guk.',
    farm: 'Camp the Frenzied Ghoul spawn on the live side; hold the room and rotate placeholders. A strong group in the 30s farms it for cash even when it’s not for you.'
  },
  {
    id: 'ssoy',
    name: 'Short Sword of the Ykesha',
    slot: 'weapon',
    notable: 'The “SSoY” — a fast 1H Slashing weapon (9 dmg / 24 delay) with the Ykesha aggro proc; an excellent ratio prized by warriors for threat and by rogues/hybrids for DPS.',
    levelMin: 20,
    tier: 'mid',
    classes: ['warrior', 'paladin', 'ranger', 'shadow-knight', 'bard', 'rogue'],
    zoneId: 'lower-guk',
    source: 'Drops off the ghoul lord in Lower Guk.',
    farm: 'Work the froglok ghoul camps toward the ghoul lord’s spawn. Manageable for a mid-20s group; watch for froglok adds and shaman heals.'
  },
  {
    id: 'fungus-great-staff',
    name: 'Fungus Covered Great Staff',
    slot: 'weapon',
    notable: 'A 2H Blunt (18/35) with WIS/INT and an instant clicky heal (Fungal Regrowth), usable by every class — the all-class “pre-nerf” version. Note: this version no longer drops; the current Fungi Covered Great Staff is Druid/Shaman only.',
    levelMin: 25,
    tier: 'mid',
    available: false,
    zoneId: 'old-sebilis',
    source: 'No longer obtainable in Legends. The all-class version formerly dropped off the myconid spore king in Old Sebilis (Kunark).',
    farm: 'Not currently farmable — retired content. If chasing a clicky-heal staff, look to the current Druid/Shaman Fungi Covered Great Staff once Kunark is live.'
  },
  {
    id: 'deepwater-helm',
    name: 'Deepwater Helm',
    slot: 'head',
    notable: 'A strong Paladin helm (AC 21) with a clicky Daring aggro effect at level 45 — part of the Deepwater armor set. Paladin-only.',
    levelMin: 45,
    tier: 'endgame',
    classes: ['paladin'],
    available: false,
    zoneId: 'old-sebilis',
    source: 'Drops off the crypt caretaker in Old Sebilis (Kunark) — not obtainable until Kunark is live.',
    farm: 'Kunark content: camp the crypt caretaker in Old Sebilis with a group once the expansion opens. (It also vendors around 337p, so watch merchants.)'
  },
  {
    id: 'lamentation',
    name: 'Lamentation',
    slot: 'weapon',
    notable: 'A very fast 1H Slashing weapon (9 dmg / 19 delay) with STR +6, STA +6 and HP +20 — a benchmark ratio one-hander for warriors, rangers and shadow knights.',
    levelMin: 35,
    tier: 'endgame',
    classes: ['warrior', 'ranger', 'shadow-knight'],
    available: false,
    zoneId: 'old-sebilis',
    source: 'Drops off the sebilite guardian in Old Sebilis (Kunark) — not obtainable until Kunark is live.',
    farm: 'Kunark content: camp the sebilite guardians in Old Sebilis with a group once the expansion opens.'
  },

  // ── Endgame (rough level 40-50) ────────────────────────────
  {
    id: 'fungi-tunic',
    name: 'Fungus Covered Scale Tunic',
    slot: 'chest',
    notable: 'The legendary “Fungi Tunic” — AC 21 and +15 HP/tick worn regen that stacks with spell and racial regen (it alone hits the worn-regen cap). The single most sought-after non-raid chest piece.',
    levelMin: 40,
    tier: 'endgame',
    available: false,
    zoneId: 'old-sebilis',
    source: 'Drops off the Myconid Spore King in Old Sebilis (Kunark) — not obtainable until Kunark is live (it is not a Lower Guk drop in Legends).',
    farm: 'Kunark content: hold the Myconid Spore King camp in Old Sebilis with a strong group once the expansion opens. Expect it to be heavily contested.'
  },
  {
    id: 'cloak-of-flames',
    name: 'Cloak of Flames',
    slot: 'back',
    notable: '+36% haste on a cloak, plus AC 10 and AGI/DEX +9 and HP +50 — a best-in-slot melee back piece, usable by any class. In Legends it drops from the red dragon himself rather than a named efreeti.',
    levelMin: 50,
    tier: 'raid',
    zoneId: 'nagafens-lair',
    monsterId: 'lord-nagafen',
    source: 'Drops from Lord Nagafen in Nagafen’s Lair (Sol B).',
    farm: 'A raid drop: bring an 8-player raid with fire resist to Lord Nagafen’s lair, clear the giant halls, and beat his enrage. Pair the kill with the Djarn camp to clear Sol B’s best prizes in one trip.'
  },
  {
    id: 'golden-efreeti-boots',
    name: 'Golden Efreeti Boots',
    slot: 'feet',
    notable: 'Permanent run-speed on your feet slot, plus AC 5 and WIS/INT +9 — “GEBs” free up a buff slot and let any class outrun trouble.',
    levelMin: 40,
    tier: 'endgame',
    zoneId: 'nagafens-lair',
    monsterId: 'efreeti-djarn',
    source: 'Drops from Efreeti Lord Djarn in Nagafen’s Lair (Sol B).',
    farm: 'Same camp as the Cloak of Flames — hold Djarn’s spawn and clear his placeholders. Two of the era’s best drops share one rare mob, so the camp is worth defending.'
  },
  {
    id: 'rubicite-breastplate',
    name: 'Rubicite Breastplate',
    slot: 'chest',
    notable: 'The iconic blood-red breastplate (AC 19) with a striking look — usable by a wide melee/priest spread (warrior, cleric, paladin, ranger, shadow knight, bard, rogue, shaman), not just plate tanks.',
    levelMin: 45,
    tier: 'endgame',
    classes: ['warrior', 'cleric', 'paladin', 'ranger', 'shadow-knight', 'bard', 'rogue', 'shaman'],
    zoneId: 'cazic-thule',
    source: 'Drops from the Avatar of Fear in Cazic-Thule.',
    farm: 'Assemble a strong group/mini-raid in the mid-40s+ and fight to the Avatar of Fear’s spawn in the temple. The full Rubicite set is a long-term chase — pieces are rare.'
  },

  // ── Raid (level 46-50) ─────────────────────────────────────
  {
    id: 'white-dragonscale',
    name: 'White Dragonscale Armor (Vox)',
    slot: 'chest',
    notable: 'Class-specific raid armor cut from Lady Vox’s hide — a full-set upgrade for every class at the level cap.',
    levelMin: 50,
    tier: 'raid',
    zoneId: 'permafrost',
    monsterId: 'lady-vox',
    source: 'Lady Vox drops class dragonscale pieces and her hide for tailored armor',
    farm: 'An 8-player raid with cold resist gear breaks into her lair past the ice giant halls. Bring a plan for her fear and ice breath; loot rights and dragonscale tailoring make this a guild project.'
  },
  {
    id: 'black-dragonscale',
    name: 'Black Dragonscale Armor (Nagafen)',
    slot: 'chest',
    notable: 'Lord Nagafen’s counterpart to the Vox sets — class raid armor and scales from the red dragon of Sol B.',
    levelMin: 50,
    tier: 'raid',
    zoneId: 'nagafens-lair',
    monsterId: 'lord-nagafen',
    source: 'Lord Nagafen drops class dragonscale pieces and his hide',
    farm: 'Deep in Nagafen’s Lair — the raid needs fire resist and the DPS to beat his enrage. Pair the kill with the Djarn camp and you clear the era’s two best Sol B prizes in one trip.'
  },
  {
    id: 'plane-of-fear-armor',
    name: 'Plane of Fear Class Armor',
    slot: 'chest',
    notable: 'The first true raid armor sets — a class-specific suit assembled from Fear’s drops, the milestone gear of the classic endgame.',
    levelMin: 46,
    tier: 'raid',
    zoneId: 'plane-of-fear',
    source: 'Class-specific armor quest pieces drop throughout the Plane of Fear',
    farm: 'A full raid breaks in through the Feerrott portal and controls the golems and dracoliche. Sort loot by class and expect several successful break-ins to complete a set.'
  },
  {
    id: 'plane-of-hate-armor',
    name: 'Plane of Hate Class Armor',
    slot: 'chest',
    notable: 'Hate’s class armor and caster robes (the Robe of the Ishva and its kin) — the second pillar of classic raid gearing alongside Fear.',
    levelMin: 46,
    tier: 'raid',
    zoneId: 'plane-of-hate',
    source: 'Class armor pieces and robes drop across the Plane of Hate',
    farm: 'Teleport in with a full raid and grind Maestro’s minions toward Innoruuk. Like Fear, it’s a set assembled over multiple raids — split loot by class from the start.'
  }
];

/** notable gear grouped by the zone it drops in (for the zone page) */
export const GEAR_BY_ZONE: Record<string, GearItem[]> = GEAR.reduce((acc, g) => {
  (acc[g.zoneId] ??= []).push(g);
  return acc;
}, {} as Record<string, GearItem[]>);
