import type { CasterGroup, CombatAbility } from './types';

// Stances & Invocations as documented on eqlwiki.com/Invocations (June 2026 beta).
// Every character gets all applicable ones at level 1; one stance + one
// invocation active at a time, each on its own 6-second swap timer.

/** class groups used by scaling formulas ("per additional intelligence class" etc.) */
export const CASTER_GROUPS: Record<CasterGroup, string[]> = {
  int: ['enchanter', 'magician', 'necromancer', 'wizard', 'shadow-knight'],
  wis: ['cleric', 'druid', 'shaman', 'paladin', 'ranger', 'beastlord'],
  'pure-caster': [
    'cleric',
    'druid',
    'shaman',
    'enchanter',
    'magician',
    'necromancer',
    'wizard'
  ]
};

export const CASTER_GROUP_LABELS: Record<CasterGroup, string> = {
  int: 'INT class',
  wis: 'WIS class',
  'pure-caster': 'non-hybrid caster'
};

const MELEE_9 = [
  'berserker',
  'bard',
  'beastlord',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'shadow-knight',
  'warrior'
];

const CASTER_7 = [
  'cleric',
  'druid',
  'enchanter',
  'magician',
  'necromancer',
  'shaman',
  'wizard'
];

const SPELL_12 = [
  'bard',
  'beastlord',
  'paladin',
  'cleric',
  'druid',
  'enchanter',
  'magician',
  'necromancer',
  'ranger',
  'shadow-knight',
  'shaman',
  'wizard'
];

export const ABILITIES: CombatAbility[] = [
  // ── Stances ────────────────────────────────────────────────
  {
    id: 'stance-balanced',
    name: 'Balanced',
    kind: 'stance',
    forClasses: MELEE_9,
    effect:
      'All incoming damage is reduced by 10% and your chance to hit is increased by 10%. In-combat endurance regen is doubled.',
    cost: 'Free — no endurance cost to upkeep.',
    tips: 'The default melee stance. Swap out of it only when you have the endurance to fund something stronger.'
  },
  {
    id: 'stance-berserker',
    name: 'Berserker',
    kind: 'stance',
    forClasses: ['berserker'],
    effect:
      'Attack speed and combat-skill recharge are doubled; chance to hit and combat-skill damage +25%.',
    cost:
      'Every point of damage dealt consumes half that amount in endurance (reduced by your Strategy skill), and you take 8.3% of your outgoing damage yourself. Critical-hit bonus damage is free.',
    tips: 'Berserker exclusive. Pair with a healer class in the trio — you are burning your own health for throughput.'
  },
  {
    id: 'stance-channeler',
    name: 'Channeler',
    kind: 'stance',
    forClasses: CASTER_7,
    effect:
      'All incoming damage is reduced by 40% and your chance to successfully channel through hits is increased.',
    cost: 'Half of the mitigated damage is charged to both mana and endurance (reduced by Strategy skill).',
    tips: 'The caster survival stance — lets a pure caster eat a beating that would interrupt or kill them.'
  },
  {
    id: 'stance-defensive',
    name: 'Defensive',
    kind: 'stance',
    forClasses: ['paladin', 'shadow-knight', 'warrior'],
    effect: 'Incoming melee damage −50%, incoming magical damage −20%.',
    cost: 'Every point of damage reduced consumes an equal amount of endurance (reduced by Strategy skill).',
    tips: 'Your main-tank stance for hard pulls. Watch the endurance bar — when it empties, the mitigation stops.'
  },
  {
    id: 'stance-evasive',
    name: 'Evasive',
    kind: 'stance',
    forClasses: ['bard', 'monk', 'ranger', 'beastlord', 'rogue'],
    effect: 'You have a 95% chance to evade all incoming attacks.',
    cost:
      'Every point of damage evaded consumes 2 endurance (reduced by Strategy skill). Fails with insufficient endurance or while feigning death.',
    tips: 'Turns a monk or rogue into a short-window evasion tank — superb for splitting camps and emergency off-tanking.'
  },
  {
    id: 'stance-mage-hunter',
    name: 'Mage Hunter',
    kind: 'stance',
    forClasses: ['berserker', 'paladin', 'shadow-knight'],
    effect: 'Incoming spell damage −50%, incoming physical damage −20%.',
    cost: 'Every point of damage reduced consumes an equal amount of endurance (reduced by Strategy skill).',
    tips: 'The mirror of Defensive — swap to it for caster mobs and dragon breath.'
  },
  {
    id: 'stance-offensive',
    name: 'Offensive',
    kind: 'stance',
    forClasses: MELEE_9,
    effect: 'Outgoing melee damage +100% and chance to hit +25%.',
    cost:
      'Every point of bonus damage consumes an equal amount of endurance (reduced by Strategy skill). Below 25% endurance the hit bonus fades. Critical-hit bonus damage is free.',
    tips: 'Your burn stance when someone else is tanking.'
  },
  {
    id: 'stance-ranged',
    name: 'Ranged',
    kind: 'stance',
    forClasses: ['berserker', 'monk', 'ranger', 'rogue'],
    effect:
      'Your ranged attack has no minimum distance, gains +25% accuracy, and can double and triple attack.',
    cost: 'Every point of damage consumes endurance (reduced by Strategy skill).',
    tips: 'Makes bow rangers and throwing berserkers real builds — you can shoot point-blank.'
  },
  {
    id: 'stance-striker',
    name: 'Striker',
    kind: 'stance',
    forClasses: ['berserker', 'monk', 'rogue', 'warrior'],
    effect:
      'Weapon-skill abilities deal 3× damage, non-weapon-skill abilities deal 5× damage, and chance to hit +25%.',
    cost:
      'Every point of damage dealt consumes an equal amount of endurance (reduced by Strategy skill). Below 25% endurance the hit bonus fades. Critical-hit bonus damage is free.',
    tips: 'The skill-spam stance: backstab, kick, and flying kick numbers get silly.'
  },

  // ── Invocations ────────────────────────────────────────────
  {
    id: 'inv-arcane-mastery',
    name: 'Arcane Mastery',
    kind: 'invocation',
    forClasses: ['enchanter', 'magician', 'necromancer', 'shadow-knight', 'wizard'],
    effect:
      'Spell cast and recovery times are reduced, and detrimental spells cost less mana. Scales with the INT classes in your combo.',
    cost: 'None beyond normal spell costs.',
    scaling: [
      {
        group: 'int',
        counting: 'additional',
        label: 'Cast & recovery time reduction',
        base: 20,
        per: 10,
        unit: '%'
      },
      {
        group: 'int',
        counting: 'additional',
        label: 'Detrimental spell mana cost reduction',
        base: 10,
        per: 5,
        unit: '%'
      }
    ],
    tips: 'The default nuker invocation — stacking multiple INT classes in one trio turns this into a huge haste.'
  },
  {
    id: 'inv-divine',
    name: 'Divine',
    kind: 'invocation',
    forClasses: ['beastlord', 'cleric', 'druid', 'paladin', 'ranger', 'shaman'],
    effect:
      'Spending mana heals the group member with the lowest HP percentage by that amount.',
    cost: 'None beyond the mana you were already spending.',
    scaling: [
      {
        group: 'wis',
        counting: 'additional',
        template:
          'With your combo the heal repeats {n} extra time(s) at 33% of the mana spent each.'
      }
    ],
    tips: 'Every debuff, nuke, or buff you cast also heals — a shaman/druid trio effectively heals while doing everything else.'
  },
  {
    id: 'inv-empower',
    name: 'Empower',
    kind: 'invocation',
    forClasses: CASTER_7,
    effect: 'Damage and healing spell effects are amplified. Scales with the non-hybrid casters in your combo.',
    cost: '+20% mana on damage spells, +10% mana on healing spells.',
    scaling: [
      {
        group: 'pure-caster',
        counting: 'additional',
        label: 'Damage effect bonus',
        base: 20,
        per: 10,
        unit: '%'
      },
      {
        group: 'pure-caster',
        counting: 'additional',
        label: 'Healing effect bonus',
        base: 10,
        per: 5,
        unit: '%'
      }
    ]
  },
  {
    id: 'inv-inversion',
    name: 'Inversion',
    kind: 'invocation',
    forClasses: SPELL_12,
    effect:
      'Shifts two-thirds of spell cast time into the global recovery time — spells land almost instantly, then you recover.',
    cost: '20% of the mana cost is converted into half as much endurance cost.',
    tips: 'Great for landing a clutch heal or mez before the hit that would have interrupted it.'
  },
  {
    id: 'inv-inviolable',
    name: 'Inviolable',
    kind: 'invocation',
    forClasses: ['bard', 'wizard'],
    effect: 'Cast spells are uninterruptible.',
    cost: '+100% mana, and the same amount again as endurance.',
    tips: 'Expensive insurance — flip it on for one must-land cast, then flip back.'
  },
  {
    id: 'inv-over-channel',
    name: 'Over Channel',
    kind: 'invocation',
    forClasses: SPELL_12,
    effect: 'Cast spells punch through resists far more reliably.',
    cost: '10% of the mana cost is charged as endurance.',
    scaling: [
      {
        group: 'pure-caster',
        counting: 'every',
        label: 'Resist adjust',
        base: -150,
        per: -15,
        unit: ''
      }
    ],
    tips: 'Swap to this against high-resist targets like the planar bosses instead of eating "your target resisted" all night.'
  },
  {
    id: 'inv-recovery',
    name: 'Recovery',
    kind: 'invocation',
    forClasses: SPELL_12,
    effect:
      'You regenerate mana twice as fast and spells cost 5% less mana. The out-of-combat regen bonus applies even while another invocation is active.',
    cost: 'Free — this is the base invocation.',
    tips: 'Your med-break setting. Because its out-of-combat bonus persists, you only care about it during long fights.'
  },
  {
    id: 'inv-spellblade',
    name: 'Spellblade',
    kind: 'invocation',
    forClasses: ['beastlord', 'paladin', 'ranger', 'shadow-knight'],
    effect:
      'Your first spell-gem slot becomes a melee proc. The spell must have a reuse time no longer than its cast time.',
    cost: '40% of the spell mana cost as mana plus 20% as endurance per proc.',
    tips: 'The hybrid signature: load a lifetap or snare in gem 1 and it fires itself while you swing.'
  },
  {
    id: 'inv-unyielding',
    name: 'Unyielding',
    kind: 'invocation',
    forClasses: ['berserker', 'monk', 'rogue', 'warrior'],
    effect:
      'Health regen (excluding out-of-combat bonus) is doubled, with +25% resistance to fear, mez, and charm loss of control.',
    cost: 'Free — no mana cost to upkeep.',
    tips: 'The pure-melee default; the control resistance is why raid tanks live here.'
  }
];

export const ABILITY_BY_ID: Record<string, CombatAbility> = Object.fromEntries(
  ABILITIES.map((a) => [a.id, a])
);

export const STANCES = ABILITIES.filter((a) => a.kind === 'stance');
export const INVOCATIONS = ABILITIES.filter((a) => a.kind === 'invocation');
