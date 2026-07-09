# Spell import — client cross-check report

Source: `D:\EverQuest Legends\spells_us.txt`  ·  generated 2026-07-09

The EQ Legends client is authoritative for the values it encodes (level, mana), so this validates the curated player-spell data against the game's own files. Note the client ships the full **Live EQ** spell table — Legends enables a subset, and the curated wiki data already captures exactly that subset. The client can therefore validate and enrich the spells Legends has, but cannot decide which spells Legends has: the curated roster stays authoritative for membership. Curated-only fields (kind/effect/duration/description/school/source/era) are never touched.


## Summary

| class | curated | icons | level fixes | mana fixes | absent-in-client | live-superset | collisions |
|---|--:|--:|--:|--:|--:|--:|--:|
| warrior | 0 | 0 | 0 | 0 | 0 | 7 | 0 |
| cleric | 165 | 165 | 0 | 0 | 0 | 21 | 6 |
| paladin | 71 | 70/71 | 0 | 0 | 0 | 0 | 2 |
| ranger | 66 | 66 | 0 | 0 | 0 | 0 | 4 |
| shadow-knight | 68 | 68 | 0 | 0 | 0 | 0 | 2 |
| druid | 192 | 192 | 0 | 0 | 0 | 56 | 8 |
| monk | 0 | 0 | 0 | 0 | 0 | 7 | 0 |
| bard | 61 | 61 | 0 | 0 | 0 | 10 | 0 |
| rogue | 0 | 0 | 0 | 0 | 0 | 26 | 0 |
| shaman | 163 | 163 | 0 | 0 | 0 | 15 | 4 |
| necromancer | 143 | 143 | 0 | 0 | 0 | 31 | 8 |
| wizard | 142 | 142 | 0 | 0 | 0 | 63 | 8 |
| magician | 157 | 157 | 0 | 0 | 0 | 23 | 3 |
| enchanter | 191 | 191 | 0 | 0 | 0 | 204 | 5 |
| beastlord | 75 | 75 | 0 | 0 | 0 | 1 | 1 |
| berserker | 0 | 0 | 0 | 0 | 0 | 24 | 0 |
| **total** | | **1493/1494** | **0** | **0** | **0** | **488** | **51** |

## warrior

**Client warrior rows ≤50 not in curated (7) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L1 Mercenary Taunt (0 mana)
- L1 Throw Stone (0 mana)
- L5 Elbow Strike (0 mana)
- L10 Focused Will Discipline (0 mana)
- L20 Provoke (0 mana)
- L30 Resistant Discipline (0 mana)
- L40 Fearless Discipline (0 mana)

## cleric

**Name collisions (multiple client rows for this class — picked lowest level):**
- Stun (client levels 2/254)
- Gate (client levels 5/254)
- Bind Affinity (client levels 10/254)
- Invisibility versus Undead (client levels 11/254)
- Promised Renewal (client levels 39/254)
- Earthquake (client levels 44/254)

**Client cleric rows ≤50 not in curated (21) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L10 Iony's Lesser Augury (70 mana)
- L14 Iony's Lesser Cleansing (70 mana)
- L14 Iony's Lesser Exorcism (70 mana)
- L23 Iony's Augury (145 mana)
- L24 Iony's Cleansing (145 mana)
- L24 Iony's Exorcism (145 mana)
- L33 Iony's Greater Augury (240 mana)
- L34 Iony's Greater Cleansing (240 mana)
- L34 Iony's Greater Exorcism (240 mana)
- L44 Greater Mass Imbue Amber (2400 mana)
- L44 Greater Mass Imbue Black Pearl (2400 mana)
- L44 Greater Mass Imbue Black Sapphire (2400 mana)
- L44 Greater Mass Imbue Diamond (2400 mana)
- L44 Greater Mass Imbue Emerald (2400 mana)
- L44 Greater Mass Imbue Opal (2400 mana)
- L44 Greater Mass Imbue Peridot (2400 mana)
- L44 Greater Mass Imbue Plains Pebble (2400 mana)
- L44 Greater Mass Imbue Rose Quartz (2400 mana)
- L44 Greater Mass Imbue Ruby (2400 mana)
- L44 Greater Mass Imbue Sapphire (2400 mana)
- L44 Greater Mass Imbue Topaz (2400 mana)

## paladin

**Name collisions (multiple client rows for this class — picked lowest level):**
- Soothe (client levels 25/106)
- Stun (client levels 28/254)

## ranger

**Name collisions (multiple client rows for this class — picked lowest level):**
- Camouflage (client levels 14/254)
- Bind Sight (client levels 17/254)
- Spirit of Wolf (client levels 28/254)
- Immolate (client levels 44/254)

## shadow-knight

**Name collisions (multiple client rows for this class — picked lowest level):**
- Lifetap (client levels 1/254)
- Bone Walk (client levels 14/254)

## druid

**Name collisions (multiple client rows for this class — picked lowest level):**
- Camouflage (client levels 4/254)
- Gate (client levels 5/254)
- Spirit of Wolf (client levels 10/254)
- Bind Affinity (client levels 12/254)
- Immolate (client levels 25/254)
- Earthquake (client levels 31/254)
- Form of the Great Wolf (client levels 40/254)
- Fire (client levels 48/254)

**Client druid rows ≤50 not in curated (56) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L11 Reebo's Lesser Augury (70 mana)
- L14 Reebo's Lesser Cleansing (70 mana)
- L14 Reebo's Lesser Exorcism (70 mana)
- L18 Ring of Grimling (300 mana)
- L19 Ring of the Nexus (150 mana)
- L20 Circle of Blightfire Moors (300 mana)
- L20 Primary Anchor Ring (150 mana)
- L20 Ring of Blightfire Moors (150 mana)
- L20 Secondary Anchor Ring (150 mana)
- L20 Zephyr: Blightfire Moors (225 mana)
- L21 Reebo's Augury (145 mana)
- L23 Ring of Twilight (300 mana)
- L24 Reebo's Cleansing (145 mana)
- L24 Reebo's Exorcism (145 mana)
- L24 Ring of the Combines (150 mana)
- L25 Ring of Knowledge (300 mana)
- L26 Circle of the Nexus (300 mana)
- L29 Circle of Grimling (600 mana)
- L29 Ring of Dawnshroud (300 mana)
- L31 Reebo's Greater Augury (240 mana)
- L31 Ring of Iceclad (150 mana)
- L32 Circle of Iceclad (300 mana)
- L32 Zephyr: Nexus (225 mana)
- L33 Circle of the Combines (300 mana)
- L33 Circle of Twilight (600 mana)
- L33 Ring of Great Divide (150 mana)
- L33 Zephyr: Iceclad (225 mana)
- L34 Reebo's Greater Cleansing (240 mana)
- L34 Reebo's Greater Exorcism (240 mana)
- L35 Primary Anchor Circle (300 mana)
- L35 Secondary Anchor Circle (300 mana)
- L36 Ring of Wakening Lands (150 mana)
- L36 Spirit of Ash (25 mana)
- L37 Circle of Dawnshroud (600 mana)
- L37 Ro's Fiery Sundering (50 mana)
- L37 Wind of the South (300 mana)
- L38 Circle of Great Divide (300 mana)
- L38 Circle of Knowledge (600 mana)
- L38 Zephyr: Grimling (225 mana)
- L39 Ring of Cobalt Scar (150 mana)
- L39 Wind of the North (300 mana)
- L40 Circle of Wakening Lands (300 mana)
- L40 Primary Anchor Push (150 mana)
- L40 Secondary Anchor Push (150 mana)
- L40 Zephyr: Combines (225 mana)
- L40 Zephyr: Primary Anchor (225 mana)
- L40 Zephyr: Secondary Anchor (225 mana)
- L41 Zephyr: Twilight (225 mana)
- L42 Circle of Cobalt Scar (300 mana)
- L42 Zephyr: Great Divide (225 mana)
- L43 Zephyr: Wakening Lands (225 mana)
- L44 Greater Mass Imbue Emerald (2400 mana)
- L44 Greater Mass Imbue Plains Pebble (2400 mana)
- L44 Zephyr: Cobalt Scar (225 mana)
- L46 Zephyr: Knowledge (225 mana)
- L50 Tangle (60 mana)

## monk

**Client monk rows ≤50 not in curated (7) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L1 Throw Stone (0 mana)
- L5 Elbow Strike (0 mana)
- L10 Focused Will Discipline (0 mana)
- L30 Resistant Discipline (0 mana)
- L35 Phantom Zephyr (0 mana)
- L40 Fearless Discipline (0 mana)
- L50 Phantom Wind (0 mana)

## bard

**Client bard rows ≤50 not in curated (10) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L1 Chant of Chaos (0 mana)
- L1 Chant of Flame (0 mana)
- L1 Chant of Frost (0 mana)
- L1 Chant of Magic (0 mana)
- L1 Chant of Plague (0 mana)
- L1 Chant of Venom (0 mana)
- L1 Item Benefit: Doben's Spry Sonata Rk. II (0 mana)
- L1 Item Benefit: Niv's Melody of Preservation (0 mana)
- L1 Item Benefit: Wind of Marr (0 mana)
- L25 Selo's Rhythm of Speed (0 mana)

## rogue

**Client rogue rows ≤50 not in curated (26) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L1 Blood Siphon Venom (0 mana)
- L1 Throw Stone (0 mana)
- L2 Asp Venom (0 mana)
- L4 Weakening Poison (0 mana)
- L5 Elbow Strike (0 mana)
- L5 Hobbling Poison (0 mana)
- L7 Concussive Poison (0 mana)
- L9 Befuddling Poison (0 mana)
- L10 Focused Will Discipline (0 mana)
- L11 Grounding Poison (0 mana)
- L14 Stunning Venom (0 mana)
- L18 Clumsiness Poison (0 mana)
- L20 Banishing Poison (0 mana)
- L20 Sneak Attack (0 mana)
- L23 Fettering Poison (0 mana)
- L25 Binding Poison (0 mana)
- L28 Neurotoxic Poison (0 mana)
- L30 Mind Wrack Poison (0 mana)
- L30 Resistant Discipline (0 mana)
- L33 Thought Drain Poison (0 mana)
- L36 Antimagic Poison (0 mana)
- L39 Mage Bane Poison (0 mana)
- L40 Fearless Discipline (0 mana)
- L42 Paralytic Poison (0 mana)
- L46 Blood Draw Venom (0 mana)
- L46 Cobra Venom (0 mana)

## shaman

**Name collisions (multiple client rows for this class — picked lowest level):**
- Gate (client levels 5/254)
- Spirit of Wolf (client levels 9/254)
- Bind Affinity (client levels 14/254)
- Ultravision (client levels 26/254)

**Client shaman rows ≤50 not in curated (15) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L13 Reebo's Lesser Augury (70 mana)
- L14 Reebo's Lesser Cleansing (70 mana)
- L14 Reebo's Lesser Exorcism (70 mana)
- L23 Reebo's Augury (145 mana)
- L24 Reebo's Cleansing (145 mana)
- L24 Reebo's Exorcism (145 mana)
- L33 Reebo's Greater Augury (240 mana)
- L34 Reebo's Greater Cleansing (240 mana)
- L34 Reebo's Greater Exorcism (240 mana)
- L38 Cannibalize II (0 mana)
- L44 Greater Mass Imbue Amber (2400 mana)
- L44 Greater Mass Imbue Diamond (2400 mana)
- L44 Greater Mass Imbue Ivory (2700 mana)
- L44 Greater Mass Imbue Jade (2400 mana)
- L44 Greater Mass Imbue Sapphire (2400 mana)

## necromancer

**Name collisions (multiple client rows for this class — picked lowest level):**
- Invisibility versus Undead (client levels 1/254)
- Gate (client levels 4/254)
- Bone Walk (client levels 8/254)
- Bind Affinity (client levels 12/254)
- Vampiric Curse (client levels 29/254)
- Dead Man Floating (client levels 41/254)
- Drain Soul (client levels 48/254)
- Invoke Death (client levels 48/254)

**Client necromancer rows ≤50 not in curated (31) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L13 Reebo's Lesser Exorcism (70 mana)
- L13 Wuggan's Lesser Appraisal (70 mana)
- L14 Reebo's Lesser Augury (70 mana)
- L14 Reebo's Lesser Cleansing (70 mana)
- L14 Wuggan's Lesser Discombobulation (70 mana)
- L14 Wuggan's Lesser Extrication (70 mana)
- L16 Focus Crude Spellcaster's Empowering Essence (100 mana)
- L16 Focus Primitive Spellcaster's Empowering Essence (50 mana)
- L16 Focus Rudimentary Spellcaster's Empowering Essence (75 mana)
- L20 Focus Makeshift Spellcaster's Empowering Essence (150 mana)
- L20 Focus Mass Crude Spellcaster's Empowering Essence (400 mana)
- L20 Focus Mass Primitive Spellcaster's Empowering Essence (200 mana)
- L20 Focus Mass Rudimentary Spellcaster's Empowering Essence (300 mana)
- L23 Reebo's Exorcism (145 mana)
- L23 Wuggan's Appraisal (145 mana)
- L24 Focus Mass Makeshift Spellcaster's Empowering Essence (600 mana)
- L24 Reebo's Augury (145 mana)
- L24 Reebo's Cleansing (145 mana)
- L24 Wuggan's Discombobulation (145 mana)
- L24 Wuggan's Extrication (145 mana)
- L30 Focus Elementary Spellcaster's Empowering Essence (200 mana)
- L33 Reebo's Greater Exorcism (240 mana)
- L33 Wuggan's Greater Appraisal (240 mana)
- L34 Focus Mass Elementary Spellcaster's Empowering Essence (800 mana)
- L34 Reebo's Greater Augury (240 mana)
- L34 Reebo's Greater Cleansing (240 mana)
- L34 Wuggan's Greater Discombobulation (240 mana)
- L34 Wuggan's Greater Extrication (240 mana)
- L40 Focus Modest Spellcaster's Empowering Essence (250 mana)
- L44 Focus Mass Modest Spellcaster's Empowering Essence (1000 mana)
- L50 Focus Simple Spellcaster's Empowering Essence (300 mana)

## wizard

**Name collisions (multiple client rows for this class — picked lowest level):**
- Gate (client levels 4/254)
- Bind Affinity (client levels 12/254)
- Bind Sight (client levels 16/254)
- Lightning Storm (client levels 23/103)
- West Karana Gate (client levels 23/95)
- Ice Shock (client levels 34/254)
- West Karana Portal (client levels 37/95)
- Translocate: West Karana (client levels 42/95)

**Client wizard rows ≤50 not in curated (63) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L13 Xalirilan's Lesser Appraisal (70 mana)
- L14 Xalirilan's Lesser Discombobulation (70 mana)
- L14 Xalirilan's Lesser Extrication (70 mana)
- L16 Focus Crude Spellcaster's Empowering Essence (100 mana)
- L16 Focus Primitive Spellcaster's Empowering Essence (50 mana)
- L16 Focus Rudimentary Spellcaster's Empowering Essence (75 mana)
- L17 Nexus Gate (150 mana)
- L20 Blightfire Moors Gate (150 mana)
- L20 Blightfire Moors Portal (300 mana)
- L20 Focus Makeshift Spellcaster's Empowering Essence (150 mana)
- L20 Focus Mass Crude Spellcaster's Empowering Essence (400 mana)
- L20 Focus Mass Primitive Spellcaster's Empowering Essence (200 mana)
- L20 Focus Mass Rudimentary Spellcaster's Empowering Essence (300 mana)
- L20 Grimling Gate (300 mana)
- L20 Primary Anchor Gate (150 mana)
- L20 Secondary Anchor Gate (150 mana)
- L20 Translocate: Blightfire Moors (225 mana)
- L22 Twilight Gate (300 mana)
- L23 Xalirilan's Appraisal (145 mana)
- L24 Combine Gate (150 mana)
- L24 Focus Mass Makeshift Spellcaster's Empowering Essence (600 mana)
- L24 Xalirilan's Discombobulation (145 mana)
- L24 Xalirilan's Extrication (145 mana)
- L27 Knowledge Gate (300 mana)
- L29 Dawnshroud Gate (300 mana)
- L29 Grimling Portal (600 mana)
- L29 Nexus Portal (300 mana)
- L30 Focus Elementary Spellcaster's Empowering Essence (200 mana)
- L32 Iceclad Gate (150 mana)
- L33 Iceclad Portal (300 mana)
- L33 Twilight Portal (600 mana)
- L33 Xalirilan's Greater Appraisal (240 mana)
- L34 Combine Portal (300 mana)
- L34 Focus Mass Elementary Spellcaster's Empowering Essence (800 mana)
- L34 Great Divide Gate (150 mana)
- L34 Xalirilan's Greater Discombobulation (240 mana)
- L34 Xalirilan's Greater Extrication (240 mana)
- L35 Primary Anchor Portal (600 mana)
- L35 Secondary Anchor Portal (600 mana)
- L36 Great Divide Portal (300 mana)
- L36 Translocate: Nexus (225 mana)
- L38 Knowledge Portal (600 mana)
- L38 Translocate: Combine (225 mana)
- L38 Wakening Lands Gate (150 mana)
- L39 Cobalt Scar Gate (150 mana)
- L39 Dawnshroud Portal (600 mana)
- L39 Translocate: Grimling (450 mana)
- L40 Focus Modest Spellcaster's Empowering Essence (250 mana)
- L40 Primary Anchor Push (150 mana)
- L40 Secondary Anchor Push (150 mana)
- L40 Translocate: Primary Anchor (225 mana)
- L40 Translocate: Secondary Anchor (225 mana)
- L41 Translocate: Twilight (450 mana)
- L42 Wakening Lands Portal (300 mana)
- L43 Cobalt Scar Portal (300 mana)
- L44 Focus Mass Modest Spellcaster's Empowering Essence (1000 mana)
- L45 Translocate: Iceclad (225 mana)
- L45 Translocate: Knowledge (450 mana)
- L46 Translocate: Great Divide (225 mana)
- L47 Translocate: Wakening Lands (225 mana)
- L48 Translocate: Cobalt Scar (225 mana)
- L49 Translocate: Dawnshroud (450 mana)
- L50 Focus Simple Spellcaster's Empowering Essence (300 mana)

## magician

**Name collisions (multiple client rows for this class — picked lowest level):**
- Gate (client levels 4/254)
- Bind Affinity (client levels 12/254)
- Lava Bolt (client levels 47/254)

**Client magician rows ≤50 not in curated (23) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L6 Dimensional Pocket (40 mana)
- L13 Wuggan's Lesser Appraisal (70 mana)
- L14 Wuggan's Lesser Discombobulation (70 mana)
- L14 Wuggan's Lesser Extrication (70 mana)
- L16 Focus Crude Spellcaster's Empowering Essence (100 mana)
- L16 Focus Primitive Spellcaster's Empowering Essence (50 mana)
- L16 Focus Rudimentary Spellcaster's Empowering Essence (75 mana)
- L20 Focus Makeshift Spellcaster's Empowering Essence (150 mana)
- L20 Focus Mass Crude Spellcaster's Empowering Essence (400 mana)
- L20 Focus Mass Primitive Spellcaster's Empowering Essence (200 mana)
- L20 Focus Mass Rudimentary Spellcaster's Empowering Essence (300 mana)
- L23 Wuggan's Appraisal (145 mana)
- L24 Focus Mass Makeshift Spellcaster's Empowering Essence (600 mana)
- L24 Wuggan's Discombobulation (145 mana)
- L24 Wuggan's Extrication (145 mana)
- L30 Focus Elementary Spellcaster's Empowering Essence (200 mana)
- L33 Wuggan's Greater Appraisal (240 mana)
- L34 Focus Mass Elementary Spellcaster's Empowering Essence (800 mana)
- L34 Wuggan's Greater Discombobulation (240 mana)
- L34 Wuggan's Greater Extrication (240 mana)
- L40 Focus Modest Spellcaster's Empowering Essence (250 mana)
- L44 Focus Mass Modest Spellcaster's Empowering Essence (1000 mana)
- L50 Focus Simple Spellcaster's Empowering Essence (300 mana)

## enchanter

**Name collisions (multiple client rows for this class — picked lowest level):**
- Gate (client levels 4/254)
- Bind Sight (client levels 8/254)
- Bind Affinity (client levels 12/254)
- Ultravision (client levels 27/254)
- Rampage (client levels 38/254)

**Client enchanter rows ≤50 not in curated (204) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L1 Illusion: Akheva (20 mana)
- L1 Illusion: Ancient Sarnak Warrior (20 mana)
- L1 Illusion: Ancient Yeti (20 mana)
- L1 Illusion: Aqua Goblin (20 mana)
- L1 Illusion: Arcane Scrykin (30 mana)
- L1 Illusion: Armored Kunark Goblin (20 mana)
- L1 Illusion: Armored Shiliskin (20 mana)
- L1 Illusion: Aviak Rook (30 mana)
- L1 Illusion: Banshee (30 mana)
- L1 Illusion: Barraki (30 mana)
- L1 Illusion: Bixie Drone (30 mana)
- L1 Illusion: Bixie Queen (30 mana)
- L1 Illusion: Bixie Soldier (20 mana)
- L1 Illusion: Blood Raven (0 mana)
- L1 Illusion: Blood Red Bellikos (20 mana)
- L1 Illusion: Blood Runed Gargoyle (30 mana)
- L1 Illusion: Boar Beast (0 mana)
- L1 Illusion: Bokon (20 mana)
- L1 Illusion: Brell Serilis (0 mana)
- L1 Illusion: Broken Skull Drowned (25 mana)
- L1 Illusion: Brownie (30 mana)
- L1 Illusion: Brownie Noble (30 mana)
- L1 Illusion: Butterfly (25 mana)
- L1 Illusion: Candlefolk (0 mana)
- L1 Illusion: Centaur (30 mana)
- L1 Illusion: Centaur Warrior (20 mana)
- L1 Illusion: Combine Orator (20 mana)
- L1 Illusion: Combine Tactician (20 mana)
- L1 Illusion: Corrupt Akhevan (20 mana)
- L1 Illusion: Corrupted Shiliskin (30 mana)
- L1 Illusion: Crystal Golem (30 mana)
- L1 Illusion: Crystalline Sessiloid (30 mana)
- L1 Illusion: Crystalline Trichordont (30 mana)
- L1 Illusion: Dark Bellikos (20 mana)
- L1 Illusion: Dark Elf Pirate Female (20 mana)
- L1 Illusion: Dark Elf Pirate Male (20 mana)
- L1 Illusion: Dark Minotaur (20 mana)
- L1 Illusion: Deathfist Pawn (25 mana)
- L1 Illusion: Drachnid (30 mana)
- L1 Illusion: Dragorn (20 mana)
- L1 Illusion: Drolvarg (20 mana)
- L1 Illusion: Dusty Iksar Skeleton (20 mana)
- L1 Illusion: Dwarven Sentinel (25 mana)
- L1 Illusion: Eagle Aviak (30 mana)
- L1 Illusion: Elddar (20 mana)
- L1 Illusion: Embattled Minotaur (30 mana)
- L1 Illusion: Enchanted Armor Guardian (0 mana)
- L1 Illusion: Erudite Pirate Female (20 mana)
- L1 Illusion: Erudite Pirate Male (20 mana)
- L1 Illusion: Evil Eye (30 mana)
- L1 Illusion: Fairy (30 mana)
- L1 Illusion: Fallen Knight (20 mana)
- L1 Illusion: Fallen Soldier (20 mana)
- L1 Illusion: Faydark Forest Guardian (25 mana)
- L1 Illusion: Flame Telmira (20 mana)
- L1 Illusion: Flood Telmira (20 mana)
- L1 Illusion: Forest Fairy (20 mana)
- L1 Illusion: Fourth Gate Guardian (25 mana)
- L1 Illusion: Frost Goblin (30 mana)
- L1 Illusion: Fungal Warrior (20 mana)
- L1 Illusion: Gelatinous Cube (20 mana)
- L1 Illusion: Gelidran (30 mana)
- L1 Illusion: Geonid (20 mana)
- L1 Illusion: Gilded Gnomework (25 mana)
- L1 Illusion: Gingerbread Man (20 mana)
- L1 Illusion: Girplan (20 mana)
- L1 Illusion: Gnomish Pirate (30 mana)
- L1 Illusion: Goblin King (30 mana)
- L1 Illusion: Grand Overseer (0 mana)
- L1 Illusion: Greater Jann (100 mana)
- L1 Illusion: Grimling (20 mana)
- L1 Illusion: Gunthak Pirate (25 mana)
- L1 Illusion: Hadal Templar (20 mana)
- L1 Illusion: Harpy Queen (0 mana)
- L1 Illusion: Hideous Harpy (30 mana)
- L1 Illusion: Hooded Scrykin (30 mana)
- L1 Illusion: Hraquis Hunter (25 mana)
- L1 Illusion: Human Pirate Female (20 mana)
- L1 Illusion: Human Pirate Male (20 mana)
- L1 Illusion: Ice Giant (25 mana)
- L1 Illusion: Ice Golem (30 mana)
- L1 Illusion: Iksar Skeleton (30 mana)
- L1 Illusion: Iron-Toothed Earthdigger (20 mana)
- L1 Illusion: Izon (20 mana)
- L1 Illusion: Junkyard Gnomework (20 mana)
- L1 Illusion: Kobold King (30 mana)
- L1 Illusion: Kobold Serf (30 mana)
- L1 Illusion: Lightning Warrior (20 mana)
- L1 Illusion: Lord Gorelik (20 mana)
- L1 Illusion: Mastruq (20 mana)
- L1 Illusion: Mother of the Ayr`Dal (25 mana)
- L1 Illusion: Oathsworn Giant (0 mana)
- L1 Illusion: Obulus Skeleton (25 mana)
- L1 Illusion: Ogre Pirate (30 mana)
- L1 Illusion: Othmir Gentleman (20 mana)
- L1 Illusion: Paineel Skeleton Guard (0 mana)
- L1 Illusion: Phantom Froglok (20 mana)
- L1 Illusion: Plaguebringer (20 mana)
- L1 Illusion: Plains Wyvern (20 mana)
- L1 Illusion: Polar Bear (20 mana)
- L1 Illusion: Primal Kerran (30 mana)
- L1 Illusion: Pyrilen (30 mana)
- L1 Illusion: Queen Velazul Di`Zok (20 mana)
- L1 Illusion: Rallosian Goblin (20 mana)
- L1 Illusion: Rallosian Ogre (0 mana)
- L1 Illusion: Raptor Predator (30 mana)
- L1 Illusion: Recluse Spider (30 mana)
- L1 Illusion: Regal Vampire Female (20 mana)
- L1 Illusion: Regal Vampire Male (20 mana)
- L1 Illusion: Relife (20 mana)
- L1 Illusion: Restless Cadaver (0 mana)
- L1 Illusion: Restless Coldain (20 mana)
- L1 Illusion: Rivervale Deputy (25 mana)
- L1 Illusion: Robed Scrykin (20 mana)
- L1 Illusion: Runic Tattoo Nihil Female (20 mana)
- L1 Illusion: Runic Tattoo Nihil Male (20 mana)
- L1 Illusion: Sarnak Skeleton (20 mana)
- L1 Illusion: Sarnak Warrior (20 mana)
- L1 Illusion: Scrykin Herald (30 mana)
- L1 Illusion: Shade (0 mana)
- L1 Illusion: Shadow Nekhon (20 mana)
- L1 Illusion: Shiny Steam Suit (20 mana)
- L1 Illusion: Shissar (20 mana)
- L1 Illusion: Shissar Priest (0 mana)
- L1 Illusion: Silver Gnomework (20 mana)
- L1 Illusion: Simple Bellikos (20 mana)
- L1 Illusion: Simple Gnomework (20 mana)
- L1 Illusion: Siren Enticer (30 mana)
- L1 Illusion: Siren Sorceress (20 mana)
- L1 Illusion: Snow Kobold (30 mana)
- L1 Illusion: Spectre (30 mana)
- L1 Illusion: Spellbound Armor (0 mana)
- L1 Illusion: Spirited Satyr (30 mana)
- L1 Illusion: Stone Gargoyle (30 mana)
- L1 Illusion: Stonegrabber (20 mana)
- L1 Illusion: Swifttail Grandmaster (25 mana)
- L1 Illusion: Tae Ew Lizardman (0 mana)
- L1 Illusion: Twisted Gnomework (20 mana)
- L1 Illusion: Tyrannosaurus (25 mana)
- L1 Illusion: Undead Gnoll (20 mana)
- L1 Illusion: Undead Servant (0 mana)
- L1 Illusion: Valkyrie (0 mana)
- L1 Illusion: Visage of the Bixie Worker (25 mana)
- L1 Illusion: Visage of the Gigyn (25 mana)
- L1 Illusion: Visage of The Gnomework (25 mana)
- L1 Illusion: Visage of Vaniki (25 mana)
- L1 Illusion: Vitrik (30 mana)
- L1 Illusion: Warmly Clad Coldain (0 mana)
- L1 Illusion: Warped Chetari (20 mana)
- L1 Spell: Illusion: Badger (0 mana)
- L1 Spell: Illusion: Braxi (0 mana)
- L1 Spell: Illusion: Marionette (0 mana)
- L1 Spell: Illusion: Owlbear (0 mana)
- L1 Visage of the Daft Trickster (25 mana)
- L10 Illusion: Burning Nekhon (25 mana)
- L10 Illusion: Kedge (25 mana)
- L10 Illusion: Simple Gnoll (20 mana)
- L10 Illusion: Steam Suit (20 mana)
- L11 Greater Mass Enchant Silver (720 mana)
- L12 Greater Mass Enchant Clay (720 mana)
- L13 Wuggan's Lesser Appraisal (70 mana)
- L14 Wuggan's Lesser Discombobulation (70 mana)
- L14 Wuggan's Lesser Extrication (70 mana)
- L16 Focus Crude Spellcaster's Empowering Essence (100 mana)
- L16 Focus Makeshift Spellcaster's Empowering Essence (150 mana)
- L16 Focus Primitive Spellcaster's Empowering Essence (50 mana)
- L16 Focus Rudimentary Spellcaster's Empowering Essence (75 mana)
- L17 Greater Mass Thicken Mana (1200 mana)
- L19 Greater Mass Enchant Electrum (900 mana)
- L20 Focus Mass Crude Spellcaster's Empowering Essence (400 mana)
- L20 Focus Mass Makeshift Spellcaster's Empowering Essence (600 mana)
- L20 Focus Mass Primitive Spellcaster's Empowering Essence (200 mana)
- L20 Focus Mass Rudimentary Spellcaster's Empowering Essence (300 mana)
- L21 Enchant Steel (325 mana)
- L23 Wuggan's Appraisal (145 mana)
- L24 Wuggan's Discombobulation (145 mana)
- L24 Wuggan's Extrication (145 mana)
- L25 Focus Elementary Spellcaster's Empowering Essence (200 mana)
- L28 Greater Mass Enchant Gold (1800 mana)
- L29 Focus Mass Elementary Spellcaster's Empowering Essence (800 mana)
- L30 Greater Mass Crystallize Mana (2400 mana)
- L30 Illusion: Drakkin of Draton`ra (10 mana)
- L30 Illusion: Drakkin of Osh`vir (10 mana)
- L30 Illusion: Drakkin of Venesh (10 mana)
- L33 Wuggan's Greater Appraisal (240 mana)
- L34 Wuggan's Greater Discombobulation (240 mana)
- L34 Wuggan's Greater Extrication (240 mana)
- L35 Focus Modest Spellcaster's Empowering Essence (250 mana)
- L38 Greater Mass Enchant Platinum (2700 mana)
- L39 Focus Mass Modest Spellcaster's Empowering Essence (1000 mana)
- L43 Enchant Velium (200 mana)
- L44 Greater Mass Clarify Mana (3600 mana)
- L44 Greater Mass Enchant Velium (2400 mana)
- L44 Mass Enchant Velium (600 mana)
- L45 Focus Simple Spellcaster's Empowering Essence (300 mana)
- L48 Enchant Adamantite (325 mana)
- L48 Enchant Mithril (325 mana)
- L49 Enchant Brellium (325 mana)
- L49 Focus Mass Simple Spellcaster's Empowering Essence (1200 mana)
- L49 Mass Enchant Adamantite (975 mana)
- L49 Mass Enchant Brellium (975 mana)
- L49 Mass Enchant Mithril (975 mana)
- L49 Mass Enchant Steel (975 mana)
- L50 Focus Spellcaster's Empowering Essence (350 mana)

## beastlord

**Name collisions (multiple client rows for this class — picked lowest level):**
- Spirit of Wolf (client levels 24/254)

**Client beastlord rows ≤50 not in curated (1) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L35 Languid Pace (50 mana)

## berserker

**Client berserker rows ≤50 not in curated (24) — Live superset, mostly NOT Legends content; do NOT bulk-add:**
_The client ships the full Live EQ spell table. A class-level field here does not mean Legends grants the spell (these are dominated by disciplines, post-classic illusions, modern focus/research spells, and gates to post-classic zones). The curated roster is authoritative for membership; only add after confirming on the EQL Wiki._

- L1 Corroded Axe (0 mana)
- L1 Throw Stone (0 mana)
- L5 Blunt Axe (0 mana)
- L5 Elbow Strike (0 mana)
- L8 Leg Strike (0 mana)
- L10 Focused Will Discipline (0 mana)
- L10 Steel Axe (0 mana)
- L15 Bearded Axe (0 mana)
- L16 Head Strike (0 mana)
- L20 Mithril Axe (0 mana)
- L24 Divertive Strike (0 mana)
- L25 Balanced War Axe (0 mana)
- L30 Battle Cry (0 mana)
- L30 Bonesplicer Axe (0 mana)
- L30 Resistant Discipline (0 mana)
- L32 Leg Cut (0 mana)
- L35 Fleshtear Axe (0 mana)
- L40 Cold Steel Cleaving Axe (0 mana)
- L40 Fearless Discipline (0 mana)
- L40 Head Pummel (0 mana)
- L45 Mithril Bloodaxe (0 mana)
- L48 Distracting Strike (0 mana)
- L50 Rage Axe (0 mana)
- L50 War Cry (0 mana)
