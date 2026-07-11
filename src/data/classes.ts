import type { ClassDef, Role } from './types';

export const CLASSES: ClassDef[] = [
  // ── Casters ────────────────────────────────────────────────
  {
    id: 'enchanter',
    name: 'Enchanter',
    archetype: 'caster',
    roles: ['cc', 'support', 'pet'],
    blurb:
      'Master of crowd control and mana. Mesmerize, charm, and haste turn dangerous camps into safe ones.',
    strengths: [
      'Best crowd control in the game (mez, charm, lull)',
      'Haste and mana-regen buffs everyone wants',
      'Charmed pets can out-damage entire groups'
    ],
    weaknesses: [
      'Very fragile — a broken mez often lands on you',
      'Demanding to play well; charm can turn on you'
    ],
    levelNotes: {
      '1-9': 'Lean on your animation pet and early mez. Practice pulling singles with lull lines.',
      '10-19': 'Haste and breeze-style buffs make you welcome anywhere. Start practicing charm on cheap mobs.',
      '20-34': 'Clarity-tier mana regen is transformative for any caster trio. CC makes dungeons like Unrest and Mistmoore safe.',
      '35-50': 'Charm DPS dominates if you can manage it. You are the difference between chaos and control in Lower Guk and the planes.'
    }
  },
  {
    id: 'magician',
    name: 'Magician',
    archetype: 'caster',
    roles: ['caster-dps', 'pet'],
    blurb:
      'Elemental summoner whose pets tank and burn while the magician nukes and summons useful gear.',
    strengths: [
      'Strongest sustained pets — a personal tank for solo play',
      'Summoned items (food, bandages, weapons) cut downtime',
      'Reliable fire/magic burst damage'
    ],
    weaknesses: [
      'Little crowd control or escape tools',
      'Pet-unfriendly camps (casters, high-runners) hurt'
    ],
    levelNotes: {
      '1-9': 'Your elemental pet is a full party member. Send pet, nuke once or twice, repeat.',
      '10-19': 'Keep pets max-level by re-summoning. Summoned daggers and bandages help your whole trio.',
      '20-34': 'Earth pet root and water pet backstab shine in dungeons. Watch aggro — pets peel off mezzed targets.',
      '35-50': 'Focus items become important for max-level pets. Excellent steady DPS for planar targets.'
    }
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    archetype: 'caster',
    roles: ['caster-dps', 'pet', 'pull', 'cc'],
    blurb:
      'Death magic specialist: dots, undead pets, fear-kiting, and unmatched self-sufficiency.',
    strengths: [
      'Best solo class toolkit: pet, dots, fear, root, feign death',
      'Mana-for-health conversion means near-zero downtime',
      'Snare/fear kiting trivializes outdoor hunting'
    ],
    weaknesses: [
      'Dots are slow against fast group kills',
      'Fear-kiting is risky indoors; evil-aligned faction issues in good cities'
    ],
    levelNotes: {
      '1-9': 'Dot, send pet, fear when needed. Darkness-line snares keep runners from bringing friends.',
      '10-19': 'Feign death changes everything — you can now safely split camps for your trio.',
      '20-34': 'Efficient dot stacks make outdoor zones like Lake Rathetear excellent. Lich-line begins fueling your mana.',
      '35-50': 'Top-tier in Lower Guk and Plane of Fear as a puller/splitter. Twitch mana to your healer in long fights.'
    }
  },
  {
    id: 'wizard',
    name: 'Wizard',
    archetype: 'caster',
    roles: ['caster-dps', 'pull'],
    blurb:
      'Pure burst damage and teleportation. Nothing deletes a dangerous mob faster.',
    strengths: [
      'Highest burst damage in the game',
      'Ports for fast travel across all continents',
      'Evac spells save trios from wipes'
    ],
    weaknesses: [
      'Mana-limited: nuke, then sit',
      'Thin defenses and few utility tools between fights'
    ],
    levelNotes: {
      '1-9': 'Nuke-and-rest gameplay. Pair with a melee class (via multiclassing or friends) to cover downtime.',
      '10-19': 'First ports arrive — you are now the trio taxi. Learn quad-kiting basics outdoors in the Karanas.',
      '20-34': 'Evac makes deep dungeon crawls recoverable. Ice-line nukes handle fire-resistant mobs in Sol A/B.',
      '35-50': 'Lures land through high resists in the planes. Manage aggro — a full nuke off a fresh pull is a death sentence.'
    }
  },
  // ── Priests ────────────────────────────────────────────────
  {
    id: 'cleric',
    name: 'Cleric',
    archetype: 'priest',
    roles: ['healer', 'support'],
    blurb:
      'The gold standard of healing, with the buffs and resurrection every group wants.',
    strengths: [
      'Most efficient heals; complete heal defines late-game',
      'Best HP/AC buffs and resurrection',
      'Undead nukes make them offensive in Befallen, Unrest, Lower Guk'
    ],
    weaknesses: [
      'Very slow solo against living mobs',
      'Heal aggro demands a competent tank'
    ],
    levelNotes: {
      '1-9': 'Bash things in melee between heals; undead nukes carry you in newbie graveyards.',
      '10-19': 'Your buffs sell themselves. In a trio, you make dungeon camps sustainable.',
      '20-34': 'Resurrection removes the sting of deaths. Efficient heal chains let tanks hold tough camps.',
      '35-50': 'Complete heal rotations are the backbone of planar groups. Undead-heavy zones remain your playground.'
    }
  },
  {
    id: 'druid',
    name: 'Druid',
    archetype: 'priest',
    roles: ['healer', 'caster-dps', 'support'],
    blurb:
      'Nature priest mixing solid heals with nukes, snares, ports, and outdoor mastery.',
    strengths: [
      'Ports and speed-of-wolf travel for the whole trio',
      'Snare + dot kiting solos almost anywhere outdoors',
      'Flexible: heal one fight, nuke the next'
    ],
    weaknesses: [
      'Heals are weaker than a cleric’s at the top end',
      'Less effective inside dungeons where kiting is impossible'
    ],
    levelNotes: {
      '1-9': 'Kill with nuke + snare kiting. Wolf form and buffs speed everything up.',
      '10-19': 'Outdoor zones are your kingdom — Karanas, Oasis, Ocean of Tears. Ports begin at mid-levels.',
      '20-34': 'Quad-kiting animals in South Karana or Lake Rathetear is elite XP. Fine main healer for most trio content.',
      '35-50': 'Port network + evac + respectable heals make you the ultimate enabler. Fire nukes shine in Permafrost and velious-style cold zones later.'
    }
  },
  {
    id: 'shaman',
    name: 'Shaman',
    archetype: 'priest',
    roles: ['healer', 'support', 'pet'],
    blurb:
      'Spirit priest whose slows, stat buffs, and debuffs multiply a group’s power.',
    strengths: [
      'Slow is the strongest defensive tool in the game',
      'Huge stat buffs and canni-style mana engine',
      'Good heals, dots, root, and a wolf pet'
    ],
    weaknesses: [
      'Middling direct damage',
      'Turning HP into mana requires care under pressure'
    ],
    levelNotes: {
      '1-9': 'Dot + melee with your buffs up. You are sturdier than other priests.',
      '10-19': 'Spirit of Wolf makes you everyone’s friend. Root-dot soloing is steady XP.',
      '20-34': 'Slow arrives in force — dungeon camps that ate trios become routine. Cannibalize fuels endless mana.',
      '35-50': 'Slow + torpor-style regen lets shockingly small teams handle giants, planes trash, and named camps.'
    }
  },
  // ── Melee ──────────────────────────────────────────────────
  {
    id: 'berserker',
    name: 'Berserker',
    archetype: 'melee',
    roles: ['melee-dps'],
    blurb:
      'Two-handed fury: raw sustained melee damage with throwing tools and frenzy.',
    strengths: [
      'Big, consistent melee damage with cheap gear',
      'Throwing axes give rare ranged pressure for melee',
      'Simple, durable damage in any group'
    ],
    weaknesses: [
      'Few utility or escape tools',
      'Needs a tank in front — no plate, no heals'
    ],
    levelNotes: {
      '1-9': 'Swing big, eat food, repeat. Pair with any healer class for nonstop hunting.',
      '10-19': 'Keep axes stocked. Your burst helps break tough camps in Blackburrow or Crushbone.',
      '20-34': 'Frenzy-style abilities reward fighting below full HP — a healer classmate makes you fearless.',
      '35-50': 'Top-of-parse sustained damage for giant camps and planar fights.'
    }
  },
  {
    id: 'monk',
    name: 'Monk',
    archetype: 'melee',
    roles: ['melee-dps', 'pull'],
    blurb:
      'Bare-fisted damage and the art of the pull: feign death splits any camp.',
    strengths: [
      'Feign death pulling — the safest split tool in the game',
      'Excellent unarmed damage with zero weapon dependence',
      'Mend and dodge tools add real durability'
    ],
    weaknesses: [
      'Strict weight limits on gear',
      'No magic: relies on classmates for heals, snares, ports'
    ],
    levelNotes: {
      '1-9': 'Your fists outdamage most newbie weapons. Bind wounds between fights.',
      '10-19': 'Feign death arrives — learn to split camps and your trio will never take a bad pull again.',
      '20-34': 'Pull for the group in Unrest, Mistmoore, Sol A. Intimidation-era discs boost burst.',
      '35-50': 'Elite puller for Lower Guk, Permafrost giants, and the planes. Your splits set the pace of every camp.'
    }
  },
  {
    id: 'rogue',
    name: 'Rogue',
    archetype: 'melee',
    roles: ['melee-dps'],
    blurb:
      'Backstab assassin with stealth, lockpicking, and the best positional burst in the game.',
    strengths: [
      'Backstab is the hardest-hitting melee attack',
      'Sneak/hide scouting and corpse recovery',
      'Pickpocket, lockpicking, and trap skills open dungeons'
    ],
    weaknesses: [
      'Damage depends on being behind the mob',
      'Very reliant on a tank holding aggro steady'
    ],
    levelNotes: {
      '1-9': 'Melee normally until backstab matures; keep a good piercer updated.',
      '10-19': 'Position behind everything. Sneak past trash to scout camps for your trio.',
      '20-34': 'Backstab chains melt dungeon nameds. Lockpicking opens shortcuts in Guk and Mistmoore.',
      '35-50': 'Top single-target damage on planar bosses when the tank holds the line.'
    }
  },
  {
    id: 'warrior',
    name: 'Warrior',
    archetype: 'melee',
    roles: ['tank'],
    blurb:
      'The pure tank: highest HP, best mitigation, built to hold every hit meant for someone else.',
    strengths: [
      'Best mitigation and HP pool in the game',
      'Dual-wield and shield options for offense or defense',
      'Simple, dependable anchor for any trio'
    ],
    weaknesses: [
      'No spells: aggro relies on weapons and abilities',
      'Helpless against runners without a snarer classmate'
    ],
    levelNotes: {
      '1-9': 'Grab a shield when things get rough; taunt early and often.',
      '10-19': 'Dual-wield and double attack come online — keep both weapon sets handy.',
      '20-34': 'You make dungeon camps stable. Aggro tools matter: pair with a slower or CC classmate.',
      '35-50': 'Defensive-style discs make you the only choice for giants, dragons, and planar tanking.'
    }
  },
  // ── Hybrids ────────────────────────────────────────────────
  {
    id: 'bard',
    name: 'Bard',
    archetype: 'hybrid',
    roles: ['support', 'cc', 'pull'],
    blurb:
      'Song-twisting jack of all trades: speed, mana, CC, and pulling in one restless package.',
    strengths: [
      'Selo’s travel speed and song twisting benefit everything',
      'Mez, charm, resists, mana regen — a bit of all of it',
      'Swarm kiting is spectacular XP when mastered'
    ],
    weaknesses: [
      'Constant activity — nothing is passive',
      'Master of none: each song is weaker than the specialist’s version'
    ],
    levelNotes: {
      '1-9': 'Twist damage + speed songs and melee. You outrun everything that wants to kill you.',
      '10-19': 'Selo’s makes cross-continent travel trivial. Practice two-song twisting into three.',
      '20-34': 'Mana song + mez turns you into a mini-enchanter for your trio in any dungeon.',
      '35-50': 'Resist songs are mandatory prep for Fear/Hate. Elite bards swarm-kite entire fields.'
    }
  },
  {
    id: 'beastlord',
    name: 'Beastlord',
    archetype: 'hybrid',
    roles: ['melee-dps', 'pet', 'support'],
    blurb:
      'Warder-bonded brawler mixing monk-style melee, a permanent pet, and shaman-lite magic.',
    strengths: [
      'Strong pet plus solid melee — great solo package',
      'Shaman-lite buffs and slows for the trio',
      'Very low gear dependence'
    ],
    weaknesses: [
      'Jack-of-trades: outdone by specialists in each lane',
      'Pet management in tight dungeons takes care'
    ],
    levelNotes: {
      '1-9': 'Your warder tanks while you punch. Nearly downtime-free hunting.',
      '10-19': 'Buff, send warder, melee — a self-contained duo in one character slot.',
      '20-34': 'Slow-lite and haste-lite spells make you a real support piece in trios.',
      '35-50': 'Warder + slows + melee holds up in planar groups; excellent stable damage.'
    }
  },
  {
    id: 'paladin',
    name: 'Paladin',
    archetype: 'hybrid',
    roles: ['tank', 'support'],
    blurb:
      'Holy knight: a true tank with heals, stuns, and dominance over the undead.',
    strengths: [
      'Stuns give the best spell-caster lockdown of any tank',
      'Self and group heals reduce healer pressure',
      'Undead abilities shine in Befallen, Unrest, Lower Guk'
    ],
    weaknesses: [
      'Lower damage than pure melee',
      'Hybrid spellbook arrives slower than pure casters'
    ],
    levelNotes: {
      '1-9': 'Tank with taunt and early heals — you are nearly unkillable in newbie zones.',
      '10-19': 'Stuns interrupt caster mobs; lay hands saves lives once per fight-gone-wrong.',
      '20-34': 'The undead dungeons (Unrest, Befallen depths) are your best XP — bring your undead nukes.',
      '35-50': 'Stun-tanking casters in the planes is elite. Your heals turn near-wipes into recoveries.'
    }
  },
  {
    id: 'ranger',
    name: 'Ranger',
    archetype: 'hybrid',
    roles: ['melee-dps', 'pull', 'support'],
    blurb:
      'Wilderness warrior: dual-wield melee, bows, snares, tracking, and druid-lite magic.',
    strengths: [
      'Track finds named mobs and safe paths',
      'Snare stops runners — the trio’s insurance policy',
      'Solid melee plus druid-lite buffs and heals'
    ],
    weaknesses: [
      'Squishier than true tanks despite melee role',
      'Aggro from snare pulls needs careful timing'
    ],
    levelNotes: {
      '1-9': 'Dual-wield early and often. Track down exactly the mobs worth killing.',
      '10-19': 'Snare every runner before it flees — you prevent every bad add in your trio.',
      '20-34': 'Harmony-style pulls make outdoor camps trivial to split. Bow damage grows real.',
      '35-50': 'Weapon-shield pulling and track make you the outdoor camp master; strong steady DPS inside.'
    }
  },
  {
    id: 'shadow-knight',
    name: 'Shadow Knight',
    archetype: 'hybrid',
    roles: ['tank', 'pull', 'pet'],
    blurb:
      'Dark knight: a tank with necromancer tricks — harm touch, fear, feign death, and a skeleton at heel.',
    strengths: [
      'Feign death pulling on a tank chassis',
      'Snap aggro from spells makes holding mobs easy',
      'Harm touch deletes one dangerous enemy per fight'
    ],
    weaknesses: [
      'Evil faction complications in good cities',
      'Lower pure mitigation than a warrior at the very top'
    ],
    levelNotes: {
      '1-9': 'Tank with your pet out; harm touch is your emergency button.',
      '10-19': 'Feign death arrives — you can pull, split, and tank all by yourself.',
      '20-34': 'Best trio tank for aggro control; dots and taps keep you alive between heals.',
      '35-50': 'FD-split the planes, snap-aggro every add, and let the healers relax.'
    }
  }
];

export const CLASS_BY_ID: Record<string, ClassDef> = Object.fromEntries(
  CLASSES.map((c) => [c.id, c])
);

export const ARCHETYPE_LABELS: Record<string, string> = {
  caster: 'Casters',
  priest: 'Priests',
  melee: 'Melee',
  hybrid: 'Hybrids'
};

export const ROLE_LABELS: Record<Role, string> = {
  tank: 'Tank',
  healer: 'Healer',
  'melee-dps': 'Melee DPS',
  'caster-dps': 'Caster DPS',
  cc: 'Crowd Control',
  pet: 'Pets',
  pull: 'Pulling',
  support: 'Support'
};
