import { Link } from 'react-router-dom';

// Static game-systems reference harvested from eqlwiki.com, with the launch
// systems taken from the official patch notes of 2026-07-28 and 2026-07-29:
// Tradeskills, Alternate Advancement, Exaltations, difficulty tiers, and deities.

const TRADESKILLS: { name: string; makes: string; note?: string }[] = [
  { name: 'Alchemy', makes: 'Potions: haste, regen, illusions, stat buffs', note: 'Shaman-flavored; big money-maker.' },
  { name: 'Baking', makes: 'Stat food and long-duration rations' },
  { name: 'Blacksmithing', makes: 'Banded armor, fine plate, sharpening stones', note: 'Skill-ups also check Strength.' },
  { name: 'Brewing', makes: 'Ales, short beers, and quest booze' },
  { name: 'Fletching', makes: 'Bows and arrows — sustained ammo for Ranged stance users', note: 'Skill-ups also check Dexterity.' },
  { name: 'Jewelcrafting', makes: 'Enchanted stat jewelry from gems and bars' },
  { name: 'Pottery', makes: 'Firing sheets, idols, and quest containers' },
  { name: 'Tailoring', makes: 'Leather and silk armor, backpacks' },
  { name: 'Tinkering', makes: 'Gadgets, rebreathers, collapsible tools', note: 'Gnomes only.' }
];

const DEITIES: { name: string; epithet: string }[] = [
  { name: 'Bertoxxulous', epithet: 'The Plaguebringer' },
  { name: 'Brell Serilis', epithet: 'The Duke of Below' },
  { name: 'Bristlebane Fizzlethrope', epithet: 'The King of Thieves' },
  { name: 'Cazic-Thule', epithet: 'The Faceless' },
  { name: 'Erollisi Marr', epithet: 'The Queen of Love' },
  { name: 'Innoruuk', epithet: 'The Prince of Hate' },
  { name: 'Karana', epithet: 'The Rainkeeper' },
  { name: 'Mithaniel Marr', epithet: 'The Lightbearer' },
  { name: 'Prexus', epithet: 'The Oceanlord' },
  { name: 'Quellious', epithet: 'The Tranquil' },
  { name: 'Rallos Zek', epithet: 'The Warlord' },
  { name: 'Rodcet Nife', epithet: 'The Prime Healer' },
  { name: 'Solusek Ro', epithet: 'The Burning Prince' },
  { name: 'The Tribunal', epithet: 'The Six Hammers' },
  { name: 'Tunare', epithet: 'The Mother of All' },
  { name: 'Veeshan', epithet: 'The Wurmqueen' }
];

const EXALTATION_SLOTS: { slot: string; itemLevel: string; does: string }[] = [
  { slot: 'Ornamentation', itemLevel: '+0 (base)', does: 'Copies the visual appearance of another item (via Ornamentation Tokens).' },
  { slot: 'Focus', itemLevel: '+1', does: 'Transfers a focus effect (e.g. Burning Affliction) from another item.' },
  { slot: 'Click', itemLevel: '+2', does: 'Transfers a click effect from another item.' },
  { slot: 'Worn', itemLevel: '+3', does: 'Transfers a passive worn effect from another item.' },
  { slot: 'Proc', itemLevel: '+4', does: 'Transfers a weapon proc — e.g. move a lifetap proc onto your best weapon.' }
];

export default function Handbook() {
  return (
    <div>
      <h1>Systems Handbook</h1>
      <p className="muted">
        A field guide to EQL&rsquo;s new and returning systems beyond classes and zones:
        alternate advancement, gear customization, crafting, and the gods of Norrath. For stances
        and invocations, see the <Link to="/abilities">dedicated guide</Link>; for ports and
        rituals, the <Link to="/travel">Travel Guide</Link>.
      </p>

      <section>
        <h2>Alternate Advancement (AA)</h2>
        <p className="small">
          Unlike classic EQ, AAs start at <strong>level 1</strong> — there is no slider; AA points
          accrue alongside normal XP at a fixed rate. Open the AA window with <code>V</code>. Four
          tabs: <strong>General</strong> (everyone), <strong>Archetype</strong> and{' '}
          <strong>Class</strong> (driven by your class picks), and <strong>Special</strong>.
        </p>
        <div className="advice-callout small">
          <strong>Early picks worth knowing:</strong>{' '}
          <em>Origin</em> (free — teleport to your starting city every 18 minutes),{' '}
          <em>Gather Party</em> (free — summon your group to you, 6-hour cooldown),{' '}
          <em>Quick Buff</em> (rebuff the whole group with one click),{' '}
          <em>Combat Fury / Combat Agility</em> (cheap crit and avoidance for melee trios), and{' '}
          <em>First Aid</em> (bind wound up to 100% health — a real sustain tool for meleers).
          Recent patches also auto-grant class passives like DoT and heal crit lines, so check the
          window after each patch.
        </div>
      </section>

      <section>
        <h2>Exaltations — gear customization</h2>
        <p className="small">
          Exaltations let you strip the best properties off gear you have outgrown and slot them
          into what you actually wear — stats from one item, proc from another, looks from a
          third. Combining duplicate items raises an item&rsquo;s level; each level unlocks
          another slot type:
        </p>
        <table className="data">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Item level</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            {EXALTATION_SLOTS.map((s) => (
              <tr key={s.slot}>
                <td style={{ color: 'var(--gold)' }}>{s.slot}</td>
                <td>{s.itemLevel}</td>
                <td>{s.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small muted">
          Watch the restrictions: an exaltation carries its own class limits, and the host item
          narrows to the overlap. Exaltations in traded items become attuned on trade — buy
          carefully. This is why duplicate drops of named-mob items stay valuable; see the{' '}
          <Link to="/bestiary">Bestiary</Link> for who drops what.
        </p>
      </section>

      <section>
        <h2>Tradeskills</h2>
        <p className="small">
          The short version — the <Link to="/tradeskills">full Tradeskill Guide</Link> covers
          leveling ladders, trivials, and the recipes worth making for every craft.
        </p>
        <table className="data">
          <thead>
            <tr>
              <th>Craft</th>
              <th>Makes</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {TRADESKILLS.map((t) => (
              <tr key={t.name}>
                <td style={{ color: 'var(--gold)' }}>{t.name}</td>
                <td>{t.makes}</td>
                <td className="muted">{t.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="advice-callout small" style={{ marginTop: '0.8rem' }}>
          <strong>The rules that matter:</strong>
          <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
            <li>
              Your highest of INT/WIS governs skill-up chance (Smithing also checks STR, Fletching
              DEX). Charisma improves merchant buy/sell prices.
            </li>
            <li>
              <strong>Stats never affect combine success</strong> — only your skill vs. the
              recipe&rsquo;s trivial. Trivial combines still fail 5% of the time; hard ones still
              succeed 5% of the time.
            </li>
            <li>
              Plan your main craft: only one skill can pass 200 until you buy the{' '}
              <em>Crafting Mastery</em> AA (each rank frees another skill up to 300).
            </li>
            <li>
              When combining stackables, put each item in its own container slot —{' '}
              <code>CTRL</code>-click takes one off a stack.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Deities of Norrath</h2>
        <p className="small">
          At creation you follow a deity or stay agnostic (options depend on race and class).
          Deity choice colors faction standings, usable "worshiper" gear, and a few quest lines.
        </p>
        <div className="chip-row">
          {DEITIES.map((d) => (
            <span className="badge" key={d.name} title={d.epithet}>
              {d.name} · <span className="muted">{d.epithet}</span>
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>Instances &amp; picks</h2>
        <p className="small">
          EQL instances classic Norrath three ways:
        </p>
        <ul className="small" style={{ paddingLeft: '1.1rem' }}>
          <li>
            <strong>Picks</strong> — crowded zones spawn extra copies; switch via the Difficulty
            UI (<code>/pick</code>).
          </li>
          <li>
            <strong>Difficulty tiers</strong> — the same UI sets how hard the copy is, and since
            the July 29 hotfix that choice <em>is</em> your loot table: drops correspond to the
            tier you are standing in, with a diminishing chance to roll higher. In D1 you roll +1
            or better; in D4 you roll +4 or better. Running a camp at a tier you can hold is
            worth more than farming a soft one quickly.
          </li>
          <li>
            <strong>Personal instances</strong> — a private copy of a dungeon for you (or your
            group) from the same Difficulty UI. Currently disabled for zones that are also raid
            zones: The Hole, Kedge Keep, Nagafen&rsquo;s Lair, Permafrost, and the Planes of Hate,
            Fear, and Sky.
          </li>
          <li>
            <strong>Raid instances</strong> — requested from NPCs (e.g. the voidlings in Paineel
            open Master Yael raids in The Hole), with solo-scaled raid versions of dragon fights
            like Nagafen. Loot lockouts are per-NPC for you and your group, so separate raid
            targets in one zone can be run on separate timers — and a boss on lockout is now
            guaranteed to drop one unique treasure on top of its normal loot pool.
          </li>
        </ul>
        <p className="small muted">
          Also live at launch: mounts are enabled (classic horse models with
          per-race riding animations), and point-blank AoE spells cap at 8 targets. Content
          arrives in <strong>eras</strong> — Classic now, with Sky, Temple, Chardok, Epic Quests,
          and eventually Kunark/Velious content gated behind future unlocks (the wiki tags pages
          by era for this reason).
        </p>
      </section>

      <section>
        <h2>Loadouts &amp; gear sets</h2>
        <p className="small">
          Your three classes form a <strong>loadout</strong>, and characters can hold more than
          one — swapping loadouts swaps classes, spells, and (via saved{' '}
          <strong>Loadout Equipment Sets</strong> and the <strong>Bandolier</strong>) entire gear
          configurations, down to the exact exaltations each piece carried. Equipment and
          Augmentation keyrings hold 50 items each outside your bags. This system is still
          churning patch to patch — re-check specifics against the patch notes.
        </p>
      </section>

      <section>
        <h2>Live at launch</h2>
        <p className="small">
          What the July 28 launch patch and its July 29 hotfix put in the game. These are the
          rules most likely to catch out anyone who learned the game in beta.
        </p>
        <ul className="small" style={{ paddingLeft: '1.1rem' }}>
          <li>
            <strong>Void-touched Potential</strong> — a raid token earned from voidlings, capped
            at <strong>3 per week</strong>. It merges the way motes do, pushing an item or a
            spell up <strong>one rank</strong>. Weekly-capped and rank-defining, so decide what
            you are upgrading before you spend it.
          </li>
          <li>
            <strong>Autogranted class AAs</strong> — every class received a passive{' '}
            <strong>Unbound</strong> line, granted rather than purchased. Your class page lists
            yours with a <span className="badge good">granted</span> badge; it costs no points.
          </li>
          <li>
            <strong>Tasks</strong> — the quest tracker, on <code>Alt+Q</code>. Guildmaster task
            chains like <em>What Happened Here?</em> in the New Sebilisian Expedition run through
            it, and hand out faction as well as gear.
          </li>
          <li>
            <strong>Stun immunity</strong> — a stunned player gets a brief immunity afterwards, so
            chain-stunning no longer locks anyone down.
          </li>
          <li>
            <strong>Loss of control caps at 30 seconds</strong> — mez, charm, fear, and root all
            fall under it. Long mez pulls are gone: a crowd-control trio has to plan around
            re-application rather than one long sleep, and charm needs re-establishing far more
            often than in classic.
          </li>
          <li>
            <strong>Faster dungeons</strong> — placeholders were removed and respawn timers cut in{' '}
            <Link to="/atlas/the-hole">The Hole</Link>,{' '}
            <Link to="/atlas/nagafens-lair">Nagafen&rsquo;s Lair</Link>,{' '}
            <Link to="/atlas/lower-guk">Lower Guk</Link>,{' '}
            <Link to="/atlas/splitpaw">Splitpaw Lair</Link>,{' '}
            <Link to="/atlas/the-warrens">The Warrens</Link>, and{' '}
            <Link to="/atlas/mistmoore">Castle Mistmoore</Link>. Camping a named in these zones is
            markedly faster than the classic experience suggests.
          </li>
          <li>
            <strong>Kerra Isle and the New Sebilisian Expedition</strong> — the{' '}
            <Link to="/atlas/kerra-isle">Kerran</Link> and{' '}
            <Link to="/atlas/new-sebilis-expedition">Iksar</Link> starting zones, both rebuilt for
            the starter level range and both opened up further by the launch patch.
          </li>
        </ul>
        <p className="small muted">
          Source:{' '}
          <a
            href="https://www.everquestlegends.com/patch-notes"
            target="_blank"
            rel="noreferrer"
          >
            official patch notes
          </a>{' '}
          for 2026-07-28 and 2026-07-29.
        </p>
      </section>
    </div>
  );
}
