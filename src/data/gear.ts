import type { GearItem, GearSlot, GearTier } from './types';

// Curated notable equipment for the classic era, following classic EverQuest
// itemization that EQL recreates. Drop locations and camps are canonical-classic —
// verify exact stats and spawns in-game while the beta shakes out. Each item links
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

const PLATE = ['warrior', 'paladin', 'shadow-knight'];
const CASTERS = ['wizard', 'magician', 'necromancer', 'enchanter'];
const PRIESTS = ['cleric', 'druid', 'shaman'];

export const GEAR: GearItem[] = [
  // ── Starter (rough level 10-20) ────────────────────────────
  {
    id: 'screaming-mace',
    name: 'Screaming Mace',
    slot: 'weapon',
    notable: 'A glowing one-hand blunt that lands a life-tapping proc — an outstanding early caster/hybrid weapon and undead deterrent.',
    levelMin: 12,
    tier: 'starter',
    zoneId: 'befallen',
    monsterId: 'befallen-keepers',
    source: 'Drops off the undead knights and keepers deep in Befallen',
    farm: 'Fight down through the ramps to the lower undead floors and camp the knight spawns. Bring a group in the mid-teens; the crypt trains hard if you over-pull.'
  },
  {
    id: 'guise-deceiver',
    name: 'Guise of the Deceiver',
    slot: 'face',
    notable: 'Clicks a permanent Dark Elf illusion — one of the most coveted vanity/utility drops in the game, and a fortune on the bazaar.',
    levelMin: 18,
    tier: 'starter',
    zoneId: 'runnyeye',
    monsterId: 'runnyeye-eye',
    source: 'Rare drop from the Evil Eye in the deep vaults of Runnyeye',
    farm: 'Clear to the bottom vault and camp the Evil Eye’s long placeholder cycle. A patient duo/group in the low 20s can hold the camp; expect many kills before it drops.'
  },
  {
    id: 'granite-tomahawk',
    name: 'Polished Granite Tomahawk',
    slot: 'weapon',
    notable: 'A hard-hitting two-hand slasher that carries melee damage well into the 30s — the classic Splitpaw prize.',
    levelMin: 20,
    tier: 'starter',
    zoneId: 'splitpaw',
    monsterId: 'splitpaw-tomahawk',
    source: 'Drops from the Splitpaw elite guards in the inner tunnels',
    farm: 'Pull the elite guards from the inner tunnels back to the entrance ramp one at a time. Steady camp for a group in the mid-20s.'
  },

  // ── Mid-game (rough level 20-40) ───────────────────────────
  {
    id: 'flowing-black-silk-sash',
    name: 'Flowing Black Silk Sash',
    slot: 'waist',
    notable: 'The famous “FBSS” — a haste belt that every melee wants for years. A permanent DPS upgrade with no level requirement to speak of.',
    levelMin: 25,
    tier: 'mid',
    zoneId: 'lower-guk',
    monsterId: 'frenzied-ghoul',
    source: 'Classic drop from the Frenzied Ghoul (and other froglok ghouls) in Lower Guk',
    farm: 'Camp the Frenzied Ghoul spawn on the live side; hold the room and rotate placeholders. A strong group in the 30s farms it for cash even when it’s not for you.'
  },
  {
    id: 'ssoy',
    name: 'Short Sword of the Ykesha',
    slot: 'weapon',
    notable: 'The “SSoY” — a fast one-hander with a lifetap proc, prized by rogues and hybrids for its damage and sustain.',
    levelMin: 20,
    tier: 'mid',
    zoneId: 'upper-guk',
    source: 'Drops off Ykesha in Upper Guk',
    farm: 'Work the froglok camps toward Ykesha’s spawn. Manageable for a mid-20s group; watch for froglok adds and shaman heals.'
  },
  {
    id: 'fungus-great-staff',
    name: 'Fungus Covered Great Staff',
    slot: 'weapon',
    notable: 'A two-hand staff with a clicky heal — turns a caster or priest into a self-sufficient soloer and a group’s emergency medic.',
    levelMin: 25,
    tier: 'mid',
    classes: [...CASTERS, ...PRIESTS],
    zoneId: 'oasis',
    monsterId: 'oasis-giants',
    source: 'Drops from the Ancient Cyclops that roams the Oasis of Marr',
    farm: 'Track the Ancient Cyclops as it wanders the shoreline and islands; it hits hard, so pull to a safe spot with a group in the upper 20s–30s. Rare spawn — expect to track it repeatedly.'
  },
  {
    id: 'deepwater-helm',
    name: 'Deepwater Helm',
    slot: 'head',
    notable: 'A top-tier classic helm with strong AC and stats — the headline drop of Kedge Keep.',
    levelMin: 35,
    tier: 'mid',
    zoneId: 'kedge-keep',
    monsterId: 'phinigel',
    source: 'Drops from Phinigel Autropos, the seahorse lord of Kedge Keep',
    farm: 'Bring enchanted/underwater-breathing gear and a full group in the 35–45 range. Clear to Phinigel’s chamber and burn him fast — his adds and the drowning risk make this a coordinated fight.'
  },
  {
    id: 'lamentation',
    name: 'Lamentation',
    slot: 'weapon',
    notable: 'A very fast one-hand slasher — a benchmark proc/haste weapon for melee before raid gear.',
    levelMin: 35,
    tier: 'mid',
    zoneId: 'cazic-thule',
    monsterId: 'ct-avatars',
    source: 'Drops among the lizardman temple guardians and avatars of Cazic-Thule',
    farm: 'Hold a camp in the temple’s outer maze and pull singles; CT’s tight corridors punish loose pulls. A group in the high 30s–40s can farm the guardian spawns.'
  },

  // ── Endgame (rough level 40-50) ────────────────────────────
  {
    id: 'fungi-tunic',
    name: 'Fungus Covered Scale Tunic',
    slot: 'chest',
    notable: 'The legendary “Fungi Tunic” — passive hit-point regeneration that never stops. The single most sought-after non-raid chest piece in classic.',
    levelMin: 40,
    tier: 'endgame',
    zoneId: 'lower-guk',
    monsterId: 'ghoul-assassin',
    source: 'Drops from the froglok ghoul nobles (Ghoul Assassin line) on the dead side of Lower Guk',
    farm: 'A dead-side Lower Guk raid/strong group holds the royal camps and rotates placeholders for hours. Contested and slow — bring track, a puller, and patience.'
  },
  {
    id: 'cloak-of-flames',
    name: 'Cloak of Flames',
    slot: 'back',
    notable: 'Haste plus a fire damage-add on a cloak — a best-in-slot melee back piece for the whole era.',
    levelMin: 40,
    tier: 'endgame',
    zoneId: 'nagafens-lair',
    monsterId: 'efreeti-djarn',
    source: 'Drops from Efreeti Lord Djarn in Nagafen’s Lair (Sol B)',
    farm: 'Fight to Djarn’s spawn with a group in the mid-40s+ and fire resist ready. He’s a rare spawn on a placeholder cycle — settle in for repeat kills.'
  },
  {
    id: 'golden-efreeti-boots',
    name: 'Golden Efreeti Boots',
    slot: 'feet',
    notable: 'Permanent run-speed on your feet slot — “GEBs” free up a buff slot and let any class outrun trouble.',
    levelMin: 40,
    tier: 'endgame',
    zoneId: 'nagafens-lair',
    monsterId: 'efreeti-djarn',
    source: 'Drops from Efreeti Lord Djarn in Nagafen’s Lair (Sol B)',
    farm: 'Same camp as the Cloak of Flames — hold Djarn’s spawn and clear his placeholders. Two of the era’s best drops share one rare mob, so the camp is worth defending.'
  },
  {
    id: 'rubicite-breastplate',
    name: 'Rubicite Breastplate',
    slot: 'chest',
    notable: 'The iconic blood-red plate — top-tier classic AC for a knight or warrior, and a striking look.',
    levelMin: 40,
    tier: 'endgame',
    classes: PLATE,
    zoneId: 'nagafens-lair',
    monsterId: 'king-tranix',
    source: 'Rare drops among the named and deep spawns of Nagafen’s Lair',
    farm: 'Work the deeper Sol B camps (King Tranix and the goblin nobles) with a fire-resist group in the 40s. The full Rubicite set is a long-term chase — pieces are scattered and rare.'
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
