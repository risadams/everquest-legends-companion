import type { ProgressionBand } from './types';

export const PROGRESSION_BANDS: ProgressionBand[] = [
  {
    id: 'band-1-5',
    label: '1-5',
    levelMin: 1,
    levelMax: 5,
    title: 'Learn your home',
    focus:
      'Stay in your starting city’s newbie yard. Kill everything that cons blue or white, keep your weapon skills rising, and spend early coin on a full set of basic armor and backpack space. Talk to your guildmasters — early quests (bone chips, gnoll fangs, orc belts) pay better than grinding.',
    milestones: [
      'Pick your secondary class at creation — grab a role you lack (a healer or a tank half makes everything smoother)',
      'Set your bind point in your home city',
      'Learn your city’s exits and nearest zone line by heart'
    ],
    roleTips: {
      tank: 'Taunt everything even now — aggro habits form early.',
      healer: 'Melee between heals; your mana pool is too small to nuke.',
      dps: 'Keep food, drink, and weapon skill-ups flowing.',
      support: 'Buff everyone you meet; faction with players pays off too.'
    }
  },
  {
    id: 'band-6-9',
    label: '6-9',
    levelMin: 6,
    levelMax: 9,
    title: 'Step past the walls',
    focus:
      'Move from the newbie yard into your region’s first real hunting zone (Qeynos Hills, Greater Faydark orc camps, East Commonlands orc road, Innothule bog, Toxxulia kobolds). Start hunting in loose groups at named camps. Bank everything — your first mount of real coin arrives now.',
    milestones: [
      'First visit to a dungeon mouth: Blackburrow, Crushbone, or the Warrens',
      'Buy your level 5-8 spell/discipline upgrades the moment you can afford them',
      'Learn to check zone level ranges before you commit (the Atlas is your friend)'
    ],
    roleTips: {
      tank: 'Practice holding two mobs at once at camp pulls.',
      healer: 'Learn each puller’s rhythm; drink between every pull.',
      dps: 'Runners kill camps — finish low-health mobs fast.',
      support: 'Your first CC and speed tools arrive; use them every fight.'
    }
  },
  {
    id: 'band-10-14',
    label: '10-14',
    levelMin: 10,
    levelMax: 14,
    title: 'Third class unlocked',
    focus:
      'At level 10 you unlock your third class — this defines your trio for the rest of the game. Round out your role coverage before doubling down on damage. Then take the new toolkit into a real dungeon: Blackburrow depths, Crushbone castle, Befallen, Upper Guk’s entrance, or the Warrens.',
    milestones: [
      'CHOOSE YOUR THIRD CLASS at level 10 — check the combo explorer for role gaps first',
      'First dungeon camps: fight at a fixed camp with an escape route planned',
      'Upgrade weapons/armor with your first dungeon drops; start the +1/+2 upgrade habit'
    ],
    roleTips: {
      tank: 'Corners are your friends — tank mobs facing away from the group.',
      healer: 'Learn heal timing against dungeon burst damage, not just chip damage.',
      dps: 'Assist the tank — kill the tank’s target, not your favorite one.',
      support: 'Mez or root every add; a controlled camp is a fast camp.'
    }
  },
  {
    id: 'band-15-19',
    label: '15-19',
    levelMin: 15,
    levelMax: 19,
    title: 'The mid-game opens',
    focus:
      'The world widens: Oasis crocs, South Karana aviaks, Unrest’s yard, Lesser Faydark, Highpass gnolls, Lake Rathetear shores. Travel between continents by boat and set up shop where the hunting is best. Difficulty settings start mattering — bump them up when camps feel safe for bonus XP and rares.',
    milestones: [
      'First cross-continent boat trip (or port from a wizard/druid class)',
      'Establish a farming camp for coin (crocs, gnolls, aviaks)',
      'Start hunting named mobs for your first real gear upgrades'
    ],
    roleTips: {
      tank: 'Learn to peel adds off your healer the instant they turn.',
      healer: 'Slow or debuff before healing when you multiclass into it.',
      dps: 'Burn named mobs fast — their specials get worse over time.',
      support: 'Track respawn timers; calling the next pull keeps XP rolling.'
    }
  },
  {
    id: 'band-20-24',
    label: '20-24',
    levelMin: 20,
    levelMax: 24,
    title: 'Dungeon era begins',
    focus:
      'This is the classic dungeon band: Unrest’s house, HighKeep goblins, Mistmoore’s yard, Sol A’s bridges, Upper Guk’s depths, Cazic-Thule’s outer maze, Splitpaw. Outdoor XP still works, but dungeons pay double in loot. Fight camped, pull single, and respect the train.',
    milestones: [
      'Commit to a dungeon home for several levels — knowing a dungeon beats touring',
      'Your core class abilities mature (slow, feign death, evac, complete heal lines begin)',
      'Gear check: everything you wear should have stats by now; push key pieces to +3/+5'
    ],
    roleTips: {
      tank: 'Position mobs off casters BEFORE they need saving.',
      healer: 'Learn each dungeon’s spike patterns; pre-heal the puller.',
      dps: 'Trains die at the zone line — know where it is from every camp.',
      support: 'CC is king in dungeons; a mezzed add is a solved problem.'
    }
  },
  {
    id: 'band-25-29',
    label: '25-29',
    levelMin: 25,
    levelMax: 29,
    title: 'Deep camps & first fortunes',
    focus:
      'Push deeper into the same dungeons: Unrest basement, Mistmoore halls, Sol A depths, HighKeep towers, Splitpaw’s den. Outdoors, Rathe Mountains hill giants drop straight platinum — the era’s classic money camp. Buy your mid-game gear plateau with it.',
    milestones: [
      'First platinum-farming operation (hill giants, HighKeep nobles)',
      'Resist gear starts to matter — begin collecting it now for the 40s',
      'Consider difficulty tier 2-3 on familiar camps for rare-drop hunting'
    ],
    roleTips: {
      tank: 'Giants and deep-camp nameds hit in spikes — ask for pre-slows.',
      healer: 'Big-hit healing means holding your nerve; do not panic-heal at 90%.',
      dps: 'Named camps reward burst discipline: save your big hits for the spawn.',
      support: 'Buff cycles and pulls can be scheduled; run the camp like a machine.'
    }
  },
  {
    id: 'band-30-34',
    label: '30-34',
    levelMin: 30,
    levelMax: 34,
    title: 'The proving grounds',
    focus:
      'Lower Guk’s live side, Mistmoore’s deep halls, Cazic-Thule’s temple, Permafrost’s giants, Kithicor at night (carefully), Stonebrunt heights. Groups become deliberate: you pick camps for specific drops now, not just XP. Your trio’s identity should be fully expressed — lean into what your combo does best.',
    milestones: [
      'Enter Lower Guk for the first time — the classic endgame dungeon apprenticeship',
      'Key abilities crest (complete heal, defensive discs, charm mastery era)',
      'Audit your build: if your trio still lacks healing or tanking, respec a class at a hub city'
    ],
    roleTips: {
      tank: 'Learn every camp’s add pattern before you need to know it.',
      healer: 'Mana efficiency beats output — downtime is the real enemy.',
      dps: 'Positioning is damage: backstabs and rear arcs full-time.',
      support: 'Your CC decides which deep camps are possible at all.'
    }
  },
  {
    id: 'band-35-39',
    label: '35-39',
    levelMin: 35,
    levelMax: 39,
    title: 'Elite camps',
    focus:
      'Lower Guk dead side, Nagafen’s Lair’s outer halls, Kedge Keep (with breath gear), The Hole’s upper ruins for the brave. Hunting is now about specific named mobs with legendary drops. Resist gear and +7/+10 pushed weapons separate smooth camps from wipes.',
    milestones: [
      'First fully underwater or fully see-invis dungeon — preparation becomes gameplay',
      'Push primary weapon and armor upgrades toward +10',
      'Collect resist sets (fire for Sol B, cold for Permafrost, disease/poison for Fear later)'
    ],
    roleTips: {
      tank: 'You set the pace now: call pulls, call breaks, call bails.',
      healer: 'Death recovery plans (rez chains, safe corners) are your job too.',
      dps: 'Sustained beats burst at elite camps — manage your endurance/mana curve.',
      support: 'Twist in resist buffs; casters in these zones hurt more than melee.'
    }
  },
  {
    id: 'band-40-44',
    label: '40-44',
    levelMin: 40,
    levelMax: 44,
    title: 'The gateway levels',
    focus:
      'Nagafen’s Lair proper, Lower Guk’s royals, The Hole, Permafrost’s giant halls. XP slows and every level matters. Run your camps at higher difficulty tiers for rares, finish your resist sets, and start joining raid-sized groups (8 players in EQL) for dragon attempts.',
    milestones: [
      'First raid experience: Lady Vox or Lord Nagafen with a full 8-player raid',
      'Complete your class-defining gear (epic-style quest lines, planar prep)',
      'All three classes should feel online every fight — practice your full rotation'
    ],
    roleTips: {
      tank: 'Dragon fights are positioning tests: learn flurry arcs and fear paths.',
      healer: 'Build the habit of healing through fear/AE chaos — planes demand it.',
      dps: 'Resist checks gate your damage now; gear the lures/pierce tools.',
      support: 'Raid support (resists, mana, CC on adds) is your endgame identity.'
    }
  },
  {
    id: 'band-45-50',
    label: '45-50',
    levelMin: 45,
    levelMax: 50,
    title: 'Planar endgame',
    focus:
      'At 46 the Planes open: Fear (via the Feerrott portal), Hate (via teleport), and Sky (via teleport, island by island). Break-ins are raid events — go with a full 8 and a plan. Between raids, The Hole, Sol B, and Lower Guk royals remain the best XP and loot to 50.',
    milestones: [
      'Level 46: planar access — join a Fear break-in with a seasoned raid first',
      'Level 50: the cap. Farm planar armor sets for all three of your classes',
      'Endgame loop: planes raids, dragon kills, +10 everything, then help your alts'
    ],
    roleTips: {
      tank: 'Planar tanking is about surviving the break-in — resist gear on, discs ready.',
      healer: 'Rez-and-recover is half of planar raiding; keep your cool mid-wipe.',
      dps: 'Assist trains matter more than parses during break-ins.',
      support: 'Resist songs/buffs decide Fear breaks. You are the difference-maker.'
    }
  }
];

export function bandForLevel(level: number): ProgressionBand {
  return (
    PROGRESSION_BANDS.find((b) => level >= b.levelMin && level <= b.levelMax) ??
    PROGRESSION_BANDS[PROGRESSION_BANDS.length - 1]
  );
}
