import type { MacroDef, MacroCategory } from './types';

// Classic-style social macros. Spell gem numbers (/cast 1-8) and ability
// slots (/doability 1-6) are placeholders — match them to your own loadout.
// Replace names in CAPS (e.g. MAINPULLER) with your group's actual names.

export const MACROS: MacroDef[] = [
  // ── Everyone ──────────────────────────────────────────────
  {
    id: 'assist-call',
    name: 'Assist & Attack',
    category: 'combat',
    forClasses: [],
    lines: ['/assist MAINPULLER', '/attack on'],
    description:
      'The single most important macro in the game. Everyone kills the same target, in order, every time.',
    tips: 'Solo trio? Point it at yourself being disciplined: target the puller’s mob before engaging.'
  },
  {
    id: 'pull-announce',
    name: 'Pull Announce',
    category: 'pulling',
    forClasses: [],
    lines: ['/g Incoming — %t !', '/g <<< watch for adds >>>'],
    description:
      'Tells the group exactly what is coming. %t expands to your current target’s name.',
  },
  {
    id: 'con-and-loc',
    name: 'Consider + Location',
    category: 'safety',
    forClasses: [],
    lines: ['/consider', '/loc'],
    description:
      'Con the target and stamp your location in one press — the /loc pairs perfectly with the atlas maps.',
  },
  {
    id: 'corpse-drag',
    name: 'Corpse Drag',
    category: 'safety',
    forClasses: [],
    lines: ['/corpse', '/pause 5', '/corpse'],
    description: 'Tugs your corpse toward you twice. Spam it on the run back after a bad night.',
  },
  {
    id: 'train-warning',
    name: 'Train Warning',
    category: 'safety',
    forClasses: [],
    lines: ['/shout TRAIN to zone — sorry!', '/g DROP CAMP — run to the zone line NOW'],
    description:
      'When it goes wrong, warn the zone and your group in one press. Using it earns forgiveness; not using it earns a reputation.',
  },
  // ── Warrior ───────────────────────────────────────────────
  {
    id: 'war-taunt-cycle',
    name: 'Taunt Cycle',
    category: 'combat',
    forClasses: ['warrior'],
    lines: ['/attack on', '/taunt', '/pause 10', '/taunt'],
    description: 'Engage and stack taunts. Spam this every time aggro so much as wobbles.',
  },
  {
    id: 'war-kick-taunt',
    name: 'Kick + Taunt',
    category: 'combat',
    forClasses: ['warrior'],
    lines: ['/kick', '/taunt'],
    description: 'Kick for the extra aggro bump, then taunt. Your bread-and-butter mid-fight press.',
  },
  // ── Paladin ───────────────────────────────────────────────
  {
    id: 'pal-stun-open',
    name: 'Stun Opener',
    category: 'combat',
    forClasses: ['paladin'],
    lines: ['/attack on', '/pause 5', '/cast 1'],
    description:
      'Engage and stun. Keep your stun in gem 1 — it interrupts caster mobs and glues aggro to you.',
    tips: 'Chain-stunning an enemy cleric mob is worth more than any amount of damage.'
  },
  {
    id: 'pal-loh',
    name: 'Lay Hands SOS',
    category: 'healing',
    forClasses: ['paladin'],
    lines: ['/g LAY HANDS on %t !', '/doability 1'],
    description:
      'Target the dying, press once. Announcing it stops your healer from wasting a big heal on the same target.',
  },
  // ── Shadow Knight ─────────────────────────────────────────
  {
    id: 'sk-fd-pull',
    name: 'Feign Death Split',
    category: 'pulling',
    forClasses: ['shadow-knight'],
    lines: ['/g Splitting — FD incoming, hold the camp', '/cast 4'],
    description:
      'Announce, then drop. Keep feign death in gem 4. Wait for wanderers to drift home before standing.',
  },
  {
    id: 'sk-harm-touch',
    name: 'Harm Touch',
    category: 'combat',
    forClasses: ['shadow-knight'],
    lines: ['/doability 1', '/g HARM TOUCH burned on %t'],
    description:
      'One button deletes one problem per fight. Announce it so the group knows the emergency card is spent.',
  },
  {
    id: 'sk-snap-aggro',
    name: 'Snap Aggro',
    category: 'combat',
    forClasses: ['shadow-knight'],
    lines: ['/attack on', '/cast 2'],
    description: 'Engage plus a terror-line spell — instant hate no warrior can match. Peel adds off your healer with it.',
  },
  // ── Cleric ────────────────────────────────────────────────
  {
    id: 'clr-ch-chain',
    name: 'Complete Heal Call',
    category: 'healing',
    forClasses: ['cleric'],
    lines: ['/g CH >>> %t — landing in 10', '/cast 1'],
    description:
      'The famous CH chain call. The announce lets your tank plan discs around the landing.',
    tips: 'In a CH rotation with other clerics, add your position: "CH 2 >>> %t".'
  },
  {
    id: 'clr-emergency',
    name: 'Emergency Heal',
    category: 'healing',
    forClasses: ['cleric'],
    lines: ['/g FAST HEAL on %t', '/cast 2'],
    description: 'Your fast (not complete) heal for spike moments. Keep it in gem 2 always.',
  },
  {
    id: 'clr-rez-call',
    name: 'Rez Call',
    category: 'safety',
    forClasses: ['cleric'],
    lines: ['/g Rezzing %t — DO NOT loot the corpse', '/cast 8'],
    description: 'Prevents the classic tragedy of a looted corpse mid-resurrection.',
  },
  // ── Druid ─────────────────────────────────────────────────
  {
    id: 'dru-kite',
    name: 'Snare & Dot Kite',
    category: 'combat',
    forClasses: ['druid'],
    lines: ['/cast 1', '/pause 30', '/cast 2'],
    description:
      'Snare (gem 1), wait out the cast, dot (gem 2), then run. The outdoor XP machine in two lines.',
  },
  {
    id: 'dru-port-call',
    name: 'Port Departure Call',
    category: 'travel',
    forClasses: ['druid'],
    lines: ['/g PORT leaving in 30 seconds — group up on me', '/pause 300', '/g PORT casting NOW'],
    description: 'No more leaving the rogue behind. Pause 300 = 30 seconds (pauses are in tenths).',
  },
  // ── Shaman ────────────────────────────────────────────────
  {
    id: 'shm-slow-open',
    name: 'Slow Opener',
    category: 'combat',
    forClasses: ['shaman'],
    lines: ['/g Slowing %t <<<', '/cast 1'],
    description:
      'The most valuable debuff in the game, announced. Land it before the tank takes the third hit.',
  },
  {
    id: 'shm-canni',
    name: 'Cannibalize Cycle',
    category: 'healing',
    forClasses: ['shaman'],
    lines: ['/cast 8', '/pause 25', '/sit on'],
    description: 'Convert health to mana and drop straight back into meditation. Spam between pulls, not during them.',
  },
  // ── Enchanter ─────────────────────────────────────────────
  {
    id: 'enc-mez-call',
    name: 'Mez + Warning',
    category: 'control',
    forClasses: ['enchanter'],
    lines: ['/cast 1', '/g MEZZED >>> %t <<< DO NOT TOUCH IT'],
    description:
      'The macro that saves camps. The warning matters as much as the spell — one stray arrow undoes everything.',
  },
  {
    id: 'enc-charm',
    name: 'Charm Announce',
    category: 'pet',
    forClasses: ['enchanter'],
    lines: ['/g Charming %t — if it turns on me, HELP', '/cast 3'],
    description: 'Charm is the best DPS in the game until it isn’t. Make sure the group knows the deal.',
  },
  // ── Magician ──────────────────────────────────────────────
  {
    id: 'mag-pet-open',
    name: 'Pet Assault',
    category: 'pet',
    forClasses: ['magician'],
    lines: ['/pet attack', '/pause 20', '/cast 2'],
    description: 'Pet in first, nuke after it has aggro. The pause keeps you off the hate list’s top slot.',
  },
  {
    id: 'mag-pet-recall',
    name: 'Pet Recall',
    category: 'pet',
    forClasses: ['magician'],
    lines: ['/pet back off', '/pet guard here'],
    description: 'Yanks the pet off a mezzed or wrong target and parks it. The enchanter in your trio thanks you.',
  },
  // ── Necromancer ───────────────────────────────────────────
  {
    id: 'nec-fd',
    name: 'Feign Death',
    category: 'safety',
    forClasses: ['necromancer'],
    lines: ['/cast 5', '/g FD — I am fine, keep the camp'],
    description: 'Keep FD in gem 5, always memorized. Dead-looking beats dead.',
  },
  {
    id: 'nec-dot-stack',
    name: 'Dot Stack',
    category: 'combat',
    forClasses: ['necromancer'],
    lines: ['/cast 1', '/pause 30', '/cast 2', '/pause 30', '/cast 3'],
    description: 'Layers three dots with casting pauses. Press once per new target and go manage your pet.',
  },
  {
    id: 'nec-twitch',
    name: 'Mana Twitch',
    category: 'healing',
    forClasses: ['necromancer'],
    lines: ['/g Twitching %t — keep casting', '/cast 8'],
    description: 'Feeds your mana to the healer or nuker who needs it. The quiet reason necros are welcome everywhere.',
  },
  // ── Wizard ────────────────────────────────────────────────
  {
    id: 'wiz-assist-nuke',
    name: 'Assist Nuke',
    category: 'combat',
    forClasses: ['wizard'],
    lines: ['/assist MAINPULLER', '/pause 5', '/cast 1'],
    description:
      'Never nuke the wrong target again. The pause gives the server a beat to swap targets before the cast.',
    tips: 'Wait for the tank’s second swing before pressing, or enjoy tanking in a dress.'
  },
  {
    id: 'wiz-evac',
    name: 'EVAC',
    category: 'safety',
    forClasses: ['wizard'],
    lines: ['/g EVAC NOW — GET IN RANGE', '/pause 30', '/cast 8'],
    description: 'The wipe-eraser. Everyone in range lives; everyone out of range tells the story.',
  },
  // ── Rogue ─────────────────────────────────────────────────
  {
    id: 'rog-backstab',
    name: 'Backstab',
    category: 'combat',
    forClasses: ['rogue'],
    lines: ['/attack on', '/doability 1'],
    description: 'Engage and backstab in one press. Keep it bound close — you will press it ten thousand times.',
  },
  {
    id: 'rog-evade',
    name: 'Evade',
    category: 'combat',
    forClasses: ['rogue'],
    lines: ['/attack off', '/doability 3', '/pause 5', '/attack on'],
    description:
      'The classic evade: drop attack, flash hide to shed aggro, resume stabbing. Use it every time you pull hate.',
  },
  {
    id: 'rog-sneak-scout',
    name: 'Sneak & Hide Scout',
    category: 'pulling',
    forClasses: ['rogue'],
    lines: ['/doability 3', '/pause 5', '/doability 4', '/g Scouting ahead — hold'],
    description: 'Vanish and go look at the camp before the group commits. Knowledge is cheaper than corpses.',
  },
  // ── Monk ──────────────────────────────────────────────────
  {
    id: 'mnk-fd',
    name: 'Feign Death',
    category: 'pulling',
    forClasses: ['monk'],
    lines: ['/doability 1'],
    description:
      'One line, zero delay — FD must fire instantly. Never bury it under announcements.',
    tips: 'Make a separate announce macro if you want one. FD itself stays pure.'
  },
  {
    id: 'mnk-split-call',
    name: 'Split Call',
    category: 'pulling',
    forClasses: ['monk'],
    lines: ['/g Splitting %t’s camp — kill what reaches you, I am FINE'],
    description: 'Said before every FD split, so nobody “rescues” you into a full camp of adds.',
  },
  {
    id: 'mnk-mend',
    name: 'Mend',
    category: 'healing',
    forClasses: ['monk'],
    lines: ['/doability 2', '/g Mended — %t still hits hard'],
    description: 'Self-heal mid-fight. At low levels a failed mend hurts you — press it above half health.',
  },
  // ── Bard ──────────────────────────────────────────────────
  {
    id: 'brd-melody',
    name: 'Combat Melody',
    category: 'combat',
    forClasses: ['bard'],
    lines: ['/stopsong', '/melody 1 2 3'],
    description:
      'Your standard combat twist in one press. Swap the gem numbers per situation (add the resist song for casters).',
    tips: 'If /melody is unavailable, twist manually: /cast 1, wait for the pulse, /cast 2, repeat.'
  },
  {
    id: 'brd-selo-run',
    name: 'Selo’s Travel',
    category: 'travel',
    forClasses: ['bard'],
    lines: ['/stopsong', '/cast 5', '/g Selo’s up — keep pace or wave goodbye'],
    description: 'Drop everything, start running music. The whole trio moves at bard speed.',
  },
  // ── Ranger ────────────────────────────────────────────────
  {
    id: 'rng-snare-runner',
    name: 'Snare the Runner',
    category: 'combat',
    forClasses: ['ranger'],
    lines: ['/g Snaring %t — it goes nowhere', '/cast 1'],
    description:
      'Press the moment a mob turns to flee. A snared runner dies alone; an unsnared one comes back with friends.',
  },
  {
    id: 'rng-bow-open',
    name: 'Bow Opener',
    category: 'pulling',
    forClasses: ['ranger'],
    lines: ['/autofire', '/pause 20', '/attack on'],
    description: 'Open at range, close to melee as it arrives. Clean single pulls without spells.',
  },
  // ── Beastlord ─────────────────────────────────────────────
  {
    id: 'bst-pet-open',
    name: 'Warder Opener',
    category: 'pet',
    forClasses: ['beastlord'],
    lines: ['/pet attack', '/pause 10', '/attack on'],
    description: 'Warder first, fists second. The pause lets the warder cement aggro before you swing.',
  },
  {
    id: 'bst-pet-save',
    name: 'Warder Recall & Heal',
    category: 'pet',
    forClasses: ['beastlord'],
    lines: ['/pet back off', '/cast 4'],
    description: 'Pull the warder out and patch it up. A dead warder is a long resummon you do not have time for.',
  },
  // ── Berserker ─────────────────────────────────────────────
  {
    id: 'ber-burst',
    name: 'Frenzy Burst',
    category: 'combat',
    forClasses: ['berserker'],
    lines: ['/attack on', '/doability 1', '/pause 10', '/doability 2'],
    description: 'Engage and unload both frenzy abilities. Your one job, in one button.',
  },
  {
    id: 'ber-axes',
    name: 'Axe Volley',
    category: 'pulling',
    forClasses: ['berserker'],
    lines: ['/autofire', '/g Axe inbound — %t is tagged'],
    description: 'Throwing axes make you the rare melee who can tag pulls at range. Keep axes stocked!',
  },
  // ── Cross-class combo macros (one character, multiple classes) ──
  {
    id: 'combo-slow-tap',
    name: 'Slow → Tap Engage',
    category: 'combat',
    forClasses: [],
    requiresAll: ['shaman', 'shadow-knight'],
    lines: ['/cast 1', '/pause 40', '/cast 2', '/attack on'],
    description:
      'The EQL dream: your shaman half slows the mob, your shadow knight half life-taps in, then melee. One button, whole opener.',
    tips: 'Gem 1 = slow, gem 2 = lifetap. Adjust the pause to your slow’s cast time.'
  },
  {
    id: 'combo-mez-nuke',
    name: 'Mez the Add, Nuke the Target',
    category: 'control',
    forClasses: [],
    requiresAll: ['enchanter', 'wizard'],
    lines: ['/cast 1', '/g MEZZED %t — do not touch', '/pause 40', '/assist MAINPULLER', '/cast 2'],
    description:
      'Enchanter half parks the add, wizard half swings back to the kill target. Two classes, one crisis, one press.',
  },
  {
    id: 'combo-fd-slow',
    name: 'FD Split → Slow Greeting',
    category: 'pulling',
    forClasses: [],
    requiresAll: ['monk', 'shaman'],
    lines: ['/doability 1', '/pause 80', '/stand', '/cast 1'],
    description:
      'Monk half splits with feign death; when the single walks back, your shaman half greets it pre-slowed. The safest pull in Norrath.',
    tips: 'Tune the pause to the camp’s walk-back time; 80 = 8 seconds.'
  },
  {
    id: 'combo-pet-dot',
    name: 'Pet + Dot Sustain',
    category: 'pet',
    forClasses: [],
    requiresAll: ['magician', 'necromancer'],
    lines: ['/pet attack', '/pause 15', '/cast 1', '/pause 30', '/cast 2'],
    description:
      'Mag pet tanks while the necro half layers dots. A complete solo engine on a single hotbutton.',
  },
  {
    id: 'combo-heal-taunt',
    name: 'Self-Heal Without Losing Aggro',
    category: 'healing',
    forClasses: [],
    requiresAll: ['warrior', 'cleric'],
    lines: ['/cast 2', '/pause 30', '/taunt', '/kick'],
    description:
      'Tank-cleric hybrids: heal yourself, then immediately re-cement hate — heal aggro pulls mobs onto squishier friends otherwise.',
  },
  {
    id: 'combo-snare-backstab',
    name: 'Snare → Flank → Backstab',
    category: 'combat',
    forClasses: [],
    requiresAll: ['ranger', 'rogue'],
    lines: ['/cast 1', '/pause 25', '/attack on', '/doability 1'],
    description:
      'Ranger half pins the target, rogue half slips behind it. Snared mobs turn slowly — every fight becomes a backstab fight.',
  }
];

export const MACRO_CATEGORY_LABELS: Record<MacroCategory, string> = {
  combat: 'Combat',
  pulling: 'Pulling & splitting',
  healing: 'Healing & recovery',
  pet: 'Pets & charm',
  control: 'Crowd control',
  travel: 'Travel',
  safety: 'Safety & emergencies'
};

export const MACRO_CATEGORIES: MacroCategory[] = [
  'combat',
  'pulling',
  'control',
  'healing',
  'pet',
  'travel',
  'safety'
];
