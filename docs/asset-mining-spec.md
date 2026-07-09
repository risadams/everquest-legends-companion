# Asset Mining Spec — EverQuest client data → eql-companion

**Status:** Phases 1 & 2 IMPLEMENTED 2026-07-09 (`scripts/import-spells.mjs`,
`scripts/import-spell-icons.mjs`, `src/components/SpellIcon.tsx`, icon column in
`ClassDetail`, "Spells coming up" panel in `CharacterPage`). Outcome: the client
cross-check found **0 level and 0 mana corrections** across all 16 classes — curated data
was already 100% accurate — so the client's contribution was **spell icons** (field 75,
verified: Blast of Cold=56=blue snowflake; 144 unique icons packed into a 67 KB
`public/icons/spells.webp`, 1493/1494 spells covered). The 488 "missing" client rows are
confirmed Live-superset noise (post-classic illusions, modern focus/research spells) — NOT
added. **Also enriched every spell with client combat fields** — cast time (idx 8),
recast/reuse timer (idx 10, recorded only when ≥6s and > cast), range (idx 4), resist type
(idx 29: 1 Magic 2 Fire 3 Cold …) — surfaced as a Cast column + resist label + ⟳ cooldown
marker in the ClassDetail table and the "Spells coming up" panel. **Phase 3 (Atlas): DONE
for current content — classic only, see below.** Phases 4–8 (factions, AA, achievements,
lore, zone renders) still open.
Rewritten earlier 2026-07-09 after a design grill plus an empirical check that settled the
central question: **the install at
`D:\EverQuest Legends` is the actual EQ Legends client, and its data files are an
authoritative source for Legends.** Verified by comparing the client's per-class spell
data against the hand-curated `classdata/*.json`: **spell levels matched exactly** across
six caster classes (cleric 165/165, necromancer 143/143, shaman 163/163, enchanter
191/191, druid 192/192, wizard 137/137), and **mana matched ~99.5%** (wizard 136/137,
cleric 164/165, enchanter 191/191) — with the handful of diffs likely being *curated*
errors the client corrects (e.g. Levitation, Promised Renewal). Read the **Governing
Principle** before any phase.

## Context

- **Project:** `A:\eql` — eql-companion, a Vite + React 19 + TypeScript PWA
  (atlas, class guides, AA advisor, factions, bestiary, lore) served at eql.quest.
- **The game this site is about:** **EverQuest Legends** — a *custom* beta launching
  2026-07-28 (`src/data/meta.ts`). It is **its own game — neither Live EQ nor classic,
  but a bespoke ruleset with elements of both.** Level cap 50, four continents
  (Antonica / Faydwer / Odus / Planes), 8-player raids, and its defining mechanic is a
  **multiclass system**: pick a secondary class at character creation, a third at
  level 10. A Legends character is 1–3 classes. `CharacterProfile` already models this
  (`classIds: string[1..3]`, `level: 1..50`). Legends mixes classic and Live elements and
  diverges from each — so **do not reason from a classic OR retail reference**; reason
  from the Legends client's own data and the EQL Wiki, which are the authoritative sources.
- **The client install:** `D:\EverQuest Legends` — this is the **actual EQ Legends
  client**, and its data files carry Legends' own data. It is built on the EQ engine, so
  the raw files include the full inherited tables (`spells_us.txt` has ~30k spell rows,
  many with class-level entries past 50; the on-disk `maps/` folder and the client's other
  resources are all present). **Legends' actual content is the subset those tables encode
  for its classes at levels ≤50** — and that subset is authoritative, as the level+mana
  match proves. Filter to what a Legends class can use at ≤50 and you have real Legends
  data, not retail noise.

### Governing Principle (read this first)

**The Legends client is a first-class authoritative source for the data it encodes; the
curated `src/data/` and the EQL Wiki cover what the client does not encode, and act as a
review baseline.** Concretely:

- **Trust the client for spell mechanics** — level, class assignment, mana, cast/recast,
  range, resist, target, effect values, icon index. These are verified to match Legends
  (100% on level, ~99.5% on mana across six classes). A generator may **populate the spell
  DB directly from the client**, not merely cross-check it. Multiclass is a non-issue: the
  client's per-class level table is exactly what you union across a character's `classIds`.
- **When the client and curated data disagree, the client is the default winner** (it is
  the game's own data), but the generator must **emit a diff** so a human can catch the
  rare case where curated carried a deliberate Legends-specific note. The observed diffs
  (Levitation mana, Promised Renewal mana) look like curated errors the client fixes.
- **What the client does NOT encode — keep curating from the EQL Wiki:** AA
  ranks/costs (server-side), the multiclass rules, the spell **source** classification
  (auto-grant / vendor / drop / quest — likely not a simple spell-file field; verify
  before trusting), zone level ranges, quests, faction *design intent*, and all prose /
  advice. The EQL Wiki (https://eqlwiki.com/) remains authoritative for these and feeds
  `scripts/import-classdata.mjs`.
- **Still verify field offsets, don't blind-trust a field list.** The trust is in the
  client's *values*; the risk that remains is reading the *wrong column*. Every importer
  asserts known values for known IDs at startup (anchors below) and fails loudly if a
  patch shifts fields.

### Project conventions (follow these)

- Importers live in `scripts/*.mjs`, plain Node ESM, **no new npm dependencies** —
  `node:fs`, `node:path` only. House style: a `MAPPING`/config table at top, small pure
  functions, a summary line at the end (`Wrote N files, X MB`), warnings for missing
  inputs. See `scripts/import-maps.mjs` and `scripts/import-classdata.mjs`.
- Importer source path is `argv[2]`, defaulting to `D:\EverQuest Legends` but overridable.
- Generated data → `src/data/` as JSON. Static binary assets (icons) → `public/`.
  Add a `verify-*.mjs` per phase (see `scripts/verify-*.mjs`). `npm test` (vitest) and
  `npm run build` must stay green.
- Types live in `src/data/types.ts` and `src/lib/classdata.ts` (`SpellRow`, `ClassData`,
  etc.) — extend those, don't fork parallel types.
- **PWA size budget matters** (precache). Current map data ~8 MB. Don't ship multi-MB
  JSON without filtering. Check `vite.config.ts` precache globs before adding assets.

### Parsing gotchas (apply everywhere)

- Encoding is **latin1** (`readFileSync(p, 'latin1')`), not UTF-8. Game text contains
  `` ` `` (e.g. `O\`Keil`) and high-latin1 chars.
- Delimiter is `^`. Fields may be empty. Text may contain `<BR>` tags and `%1` tokens.
- Lines end `\r\n`; some files have a trailing `^`, blank lines, or a `#` header row.
- Files are large (`spells_us.txt` 36 MB) — split once and iterate; don't repeatedly
  regex the whole file.
- **Client formats drift between patches.** Every importer must assert known values for
  known IDs at startup and fail loudly if they don't hold.

### Legality note

All Daybreak-copyrighted. Text/map/icon mining is what every EQ fan site has done for
20+ years and is tolerated. Do **not** mine `sounds/`, `voice/`, or music. Keep
extracted in-repo data minimal (only what the site renders).

---

## Phase 1 — Spell database generated from the client (the flagship)

The existing UI already renders and personalizes spells: `ClassDetail.tsx` shows a
per-class table (Lv / Name / Type / Mana / Effect / Duration / Source) from
`classdata/*.json` and **auto-filters to the active character** — line 82 sets
`maxLevel = active.level + 4` when the class is in the combo, with a slider to 50 and
search. The curated lists are already substantial (wizard ~142–170, druid ~192, enchanter
~191, cleric ~165). So the goal is not new pages — it's to make the client the **generator
source** for the spell data behind that surface, filling gaps and correcting values, and
to add icons.

### 1a. Generate the spell table from the client

- **Filter:** from `spells_us.txt`, take every spell a Legends class can cast at level
  ≤50 (any of the 16 per-class level fields in 1..50). That subset is authoritative
  Legends data (proven: 100% level match, ~99.5% mana match vs. curated).
- **Field anchors** (`spells_us.txt`, 173 caret-fields this build; assert these at
  startup): idx 1 = name; idx 14 = mana (verified vs. curated); the **16-field per-class
  level run starts at idx 36**, class order War, Clr, Pal, Rng, Shd, Dru, Mnk, Brd, Rog,
  Shm, Nec, Wiz, Mag, Enc, Bst, Ber — so **Wizard = idx 47** (verified: Blast of Cold id
  372 = `255×11` then `1` at idx 47). Locate cast-time (idx 8 region), recast (idx 10),
  range (idx 4), resist/target, description-id (join into `dbstr_us.txt` type 6), and the
  **icon index** each by anchoring to known spells before trusting the column — the
  values are trustworthy, the column positions must be re-verified per patch.
- **Emit** a normalized `classdata/*.json` (or a unified `src/data/spells.json` the class
  files reference) with level, class, mana, cast/recast, range, effect, duration, school,
  description, and icon. **Client wins on conflict; always write a diff** vs. the current
  curated file (`in-client-not-curated.md`, `curated-not-in-client.md`,
  `value-mismatch.md`) so a human reviews changes before commit — expect the mismatch list
  to be short and high-signal (e.g. Levitation/Promised Renewal mana looked like curated
  errors the client fixes).
- **Source classification stays curated:** the auto-grant / vendor / drop / quest `source`
  field is likely *not* a plain `spells_us.txt` column (it's about where the scroll comes
  from — item/vendor/loot data). Verify whether the client encodes it; if not, keep the
  existing curated `source` values and carry them across when regenerating. **Do not let
  regeneration wipe curated `source`, prose descriptions, or era notes.**
- **Class roster = whatever `src/data/classes.ts` defines** (incl. `berserker`); reconcile
  spell data to that roster, don't filter classes by a classic-vs-Live litmus.

### 1b. Icons

- **Sources:** `uifiles/default/Spells01.tga … Spells63.tga` — 6×6 grids of 40×40 icons
  (36/sheet). Icon index `n` → sheet `Spells{floor(n/36)+1}`, cell `n%36` row-major.
  **Verify** with 2–3 visually-known spells (render a contact sheet) first.
  (`gemicons01–23.tga` = small gem variants.)
- The icon index comes free with 1a (it's a field on each spell row). **TGA decode needs
  ImageMagick** (`magick`) — Node can't decode TGA; check availability, fail with install
  notes, document as build-time-only.
- **Output:** `public/icons/spells.webp` — packed sprite of **only the referenced icon
  indices** (not all ~2,268), target < 500 KB; `src/data/spell-icons.json` (index →
  sprite x/y); `src/components/SpellIcon.tsx` renders via `background-position`; add an
  icon column to the `ClassDetail` table.

**Acceptance:** field anchors assert green; icon arithmetic verified by contact sheet;
sprite < 500 KB; `ClassDetail` shows icons; regeneration diff reviewed and curated
`source`/prose preserved. Add `scripts/verify-spells.mjs` (every spell has a class ≤50,
an in-range icon index, non-empty effect; sprite parses).

## Phase 2 — Aggregated "Spells coming up" panel on CharacterPage (grill-approved new feature)

The per-class list solves the planner for one class, but a 3-class character shouldn't
open three pages to see the next ding. Add a panel that mirrors `AaAdvisor` (same file,
`src/pages/CharacterPage.tsx`) exactly:

- **Data:** `loadClassData(id)` for each `character.classIds` (the AA advisor already does
  this — copy the effect/promise pattern).
- **Semantics:** union across the character's classes of spells with `level` in
  `(character.level, character.level + 4]` (match the `ClassDetail` +4 horizon; optional
  "show all to 50" toggle). Group by level ascending.
- **Row:** icon + spell name + **class badge** (which of your classes grants it — needed
  when two of your classes both get something) + **source badge** (Auto-granted / Vendor
  / Drop / Quest, reusing `spellSource` / `SPELL_SOURCE_LABELS` from `classdata.ts`).
- **Nothing hidden by source** — drop/quest spells are precisely what's worth
  *anticipating*; badge them "hunt/earn," don't filter them out.
- Place it beside `AaAdvisor` so the character page reads as one "here's what your next
  few dings bring: spells here, AA here." Reacts live to the existing Ding! button.

**Acceptance:** panel renders for 1-, 2-, and 3-class characters; updates on Ding!;
`npm run build` green. Extend `scripts/verify-app.mjs` (puppeteer, `shots/` pattern) to
screenshot it.

## Phase 3 — Atlas expansion (per-zone, NOT wholesale)

**Source:** `maps/brewall/` (~1,830 files) and the client's own `maps/` root. Same
`L`/`P` format `scripts/import-maps.mjs` already parses.

**The catch (raised during grill):** Brewall draws against *current retail* geometry, and
many zones exist in multiple layouts (original vs. revamped — Freeport, Nektulos, the
Commonlands, Faydark…). Legends is bespoke and may use *either* version per zone — do
**not** assume it always uses the original. **The authority for which layout a zone uses
is the map file the Legends client itself ships in its own `maps/` root** (the folder the
game loads), not an external assumption. Where the client's shipped `maps/` and the
Brewall pack disagree, the client's shipped map wins; use Brewall only to fill zones the
client doesn't ship a usable map for, and match its layout to the client's. The existing
`MAPPING` already resolved this per-zone by hand (e.g. `freportw/n/e`, `qeynos2/qeynos`,
`neriaka/b/c`) — **preserve that per-zone discipline; never bulk-glob the folder.**

**CURRENT STATUS (2026-07-09): nothing to do — classic only.** The Atlas already covers
all 67 classic zones (67 modeled = 67 maps, 1:1). Confirmed with the user: **only classic
is live right now; Kunark, Velious, and later expansions are NOT yet available and will be
added later.** The EQL Wiki *Category:Zones* lists Kunark+Velious zones (Chardok, Cabilis,
Dreadlands, Firiona Vie, Kael Drakkel, Thurgadin, Western Wastes, Temple of Veeshan, …)
because they are planned/documented, not because they are playable. Their brewall maps
DO exist (`maps/brewall/`: burningwood, cabeast/west, chardok, dreadlands, firiona,
karnor, sebilis, veeshan, kael, eastwastes, westwastes, thurgadina/b, skyshrine,
templeveeshan, velketor, sleeper, … all present) so extraction is trivial *when* an
expansion launches. **Do NOT add expansion zones until they are live** — it would show
players zones they cannot visit. Re-open this phase per expansion release.

**Work (when an expansion goes live):** extend `MAPPING` with that expansion's zones,
add a continent (`kunark`/`velious`) to the `Continent` type + `CONTINENT_LABELS` +
`CONTINENTS`, add curated `src/data/zones/*.ts` entries (levels/connections/lore from the
EQL Wiki — do not fabricate), and optionally a `COASTLINES` entry in
`src/components/ContinentMap.tsx` (a new continent auto-fits without one, like the Planes).

**Acceptance:** `node scripts/verify-maps.mjs` passes; per-zone JSON sizes comparable to
existing; Atlas renders new zones; each added zone's layout matches what the Legends
client ships.

## Phase 4 — Factions (client-generated, with diff)

**Sources:** `Resources/Faction/` — `FactionBaseData.txt` (`factionId^min^max^…`, e.g.
`65^-2000^2000^0^0^0^`), `FactionAssociations.txt` (starting modifiers, e.g. `65^51^-600`),
window-category files. Faction **names** live in `dbstr_us.txt`.

**Approach:** this is the Legends client's own faction data — treat it as authoritative
like the spell data. `scripts/import-factions.mjs` → generate values keyed to
`src/data/factions.ts` (match by name), **emit a diff** and let a human confirm before
commit. The one thing the client won't give you is the *design narrative* (why a faction
hates you) — keep that curated. Determine the `FactionAssociations` middle-field key
(race / class / deity) by anchoring to a known faction before trusting it.

## Phase 5 — AA names/descriptions (client-generated) + curated costs

**Sources:** `dbstr_us.txt` **type 1 = AA names** (2,576 rows), **type 4 = AA
descriptions** (6,016 rows). Names and descriptions are the client's own and can be
generated directly. **Rank / cost / level tables are server-side, NOT in the client** —
curated `classdata/shared-aa.json` + per-class AAs remain the source for those.

**Output:** `scripts/import-aa-strings.mjs` → generate authoritative AA name+description
strings, **emit a diff** against the AAs the advisor references. The client lists many
AAs; Legends enables a subset, so match curated→client (the advisor's AA set is the
roster of record) and use the client to correct names/wording, not to bulk-add AAs whose
costs you don't have.

## Phase 6 — Achievements (new feature, optional, era-filtered)

**Sources:** `Resources/Achievements/` — `AchievementsClient.txt`
(`id^name^description^iconId^points^…`, e.g. `5^Level 5^…^2272^10^0^0`),
`AchievementCategories.txt` (`parentId^order^id^name^fullName^artKey`), components +
associations files. These are modern-retail achievements; **filter hard** to categories
that fit Legends' actual content and level-50 scope, and treat the set as candidate
content the user curates, not a bulk import. UI: a checklist page persisting via the
`src/context/` localStorage pattern.

## Phase 7 — Lore & manual text (optional, curation-heavy)

**Sources:** `eqmanual_supplement.txt` (171 KB), `everquest_manual.txt`, `Storyline/*.txt`,
`eqstr_us.txt` (space-delimited after an `EQST0004` header — different from dbstr).
`eqlsstr_us.txt` + `eqlsnews.txt` are **Legends-server-specific** and worth reading for
genuinely Legends-unique strings. Prose, not tables — mine selectively into
`src/data/lore.ts`; a human picks excerpts.

## Phase 8 — Zone geometry renders (stretch, separate spec)

Zone meshes live in `.s3d`/`.eqg` archives in the game root.
[LanternExtractor](https://github.com/LanternEQ/LanternExtractor) extracts to glTF/OBJ; a
top-down ortho render per zone would give the Atlas real terrain underlays. Separate
pipeline (external tool + headless render). Watch the same classic-vs-revamp trap. Don't
start here.

---

## Execution order & effort (revised)

| Phase | Effort | Value | Notes |
|-------|--------|-------|-------|
| 1 Spell DB from client + icons | M | High | Client is authoritative for spell mechanics; generate + diff |
| 2 "Coming up" panel | S | High | Clones `AaAdvisor`; data + pattern both already exist |
| 3 Atlas expansion | S–M | High | Per-zone, matched to the client's shipped map |
| 5 AA names/descriptions | S | Low–Med | Client-generated strings; costs stay curated |
| 4 Factions | M | Low–Med | Client-generated values + diff; narrative stays curated |
| 6 Achievements | M | Med | Filter to Legends' scope; new UI |
| 7 Lore text | S (curation) | Low | Prefer `eqls*` Legends-specific files |
| 8 Zone renders | XL | High | Separate spec |

Each phase is an independent PR: importer/generator + generated asset + verify script +
UI wiring. The client is authoritative for the data it encodes, so importers **generate**
that data — but **always emit a diff against the current curated file** and **never wipe
curated-only fields** (spell `source`, prose, era notes, AA costs, faction narrative,
advice). The EQL Wiki remains the source for everything the client does not encode.

## Decisions locked during the 2026-07-09 grill

0. **Legends is its own game — neither Live EQ nor classic, elements of both.** Reason
   from Legends' own sources, not a classic or retail reference.
1. **The install at `D:\EverQuest Legends` IS the EQ Legends client, and its data files
   are authoritative for the data they encode** — empirically verified (per-class spell
   level 100% match, mana ~99.5% vs. curated). Importers may **generate** from the client.
2. Guardrails on that authority: importers **emit a diff** against the current curated
   file, **client wins on value conflicts** (curated diffs like Levitation/Promised Renewal
   mana were curated errors), but importers **never wipe curated-only fields** (spell
   `source`, prose, era notes, AA costs/ranks, faction narrative, advice). The EQL Wiki
   remains the source for what the client does not encode. Field *offsets* are still
   asserted per-patch — trust the values, verify the column.
3. Maps: per-zone choice matched to the map the Legends client itself ships; the existing
   `MAPPING` already does this and must be preserved. Never bulk-glob.
4. Phase 1 = generate the spell DB (level/class/mana/cast/effect/icon) from the client
   into the existing `classdata`/`ClassDetail` surface, filling gaps and correcting values
   — this reverses the earlier draft's "icons + report-only" scope after the data proved
   the client authoritative.
5. Add an aggregated cross-combo "Spells coming up" panel on CharacterPage (mirrors
   `AaAdvisor`): union across `classIds`, `level+4` horizon, class + source badges,
   nothing hidden by source.
6. Class roster = whatever `src/data/classes.ts` defines (incl. `berserker`); don't
   filter classes by a classic-vs-Live litmus.
