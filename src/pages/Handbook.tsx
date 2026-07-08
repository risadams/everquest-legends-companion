import { Link } from 'react-router-dom';

// Static game-systems reference harvested from eqlwiki.com (June 2026 beta):
// Tradeskills, Alternate Advancement, Exaltations, and deities.

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
            <strong>Personal instances</strong> — a private copy of a dungeon for you (or your
            group) from the same Difficulty UI. Currently disabled for zones that are also raid
            zones: The Hole, Kedge Keep, Nagafen&rsquo;s Lair, Permafrost, and the Planes of Hate,
            Fear, and Sky.
          </li>
          <li>
            <strong>Raid instances</strong> — requested from NPCs (e.g. the voidlings in Paineel
            open Master Yael raids in The Hole), with solo-scaled raid versions of dragon fights
            like Nagafen. Loot lockouts are per-NPC for you and your group, so separate raid
            targets in one zone can be run on separate timers.
          </li>
        </ul>
        <p className="small muted">
          Also new since the May 2026 beta patches: mounts are enabled (classic horse models with
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
          churning patch to patch — treat specifics as beta.
        </p>
      </section>
    </div>
  );
}
