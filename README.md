# EQL Companion

An unofficial fan-made companion app for **[EverQuest Legends](https://everquestlegends.com/)** — the reimagined classic Norrath from Daybreak and Game Jawn, launching July 28, 2026.

Set up your character (race, class trio, level) once, and every page personalizes itself: where to hunt, what to kill, which quests pay, and the exact hotbuttons to build before you pull.

**Live app:** https://risadams.github.io/everquest-legends-companion/

![Zone atlas with real map geometry](docs/screenshot-atlas.png)

## Features

- **🗺 Atlas** — all 67 launch zones across Antonica, Faydwer, Odus, and the Planes with level ranges, hunting camps, dangers, and connection graphs. Zone maps render real geometry from [Brewall's EverQuest maps](https://www.eqmaps.info/) with pan/zoom, POI label filtering, multi-district city maps, and clickable zone-line exits.
- **⚔ Races & Classes** — 15 races, 16 classes, and a combo explorer that grades any trio of EQL's 3-class system for role coverage (tank / healer / CC / pull / pets).
- **🐉 Bestiary** — 106 curated named monsters, raid targets, and famous camps with levels, locations, and the loot that made them legends.
- **✉ Quest Guide** — repeatable XP turn-ins and iconic item quests, gated by level, race alignment (trolls need not apply to Qeynos), and class.
- **⌨ Macro Guide** — 41 classic social macros, including one-button cross-class rotations only possible with multiclassing (shaman slow → shadow knight lifetap, one hotkey).
- **📜 Progression Guide** — a band-by-band roadmap from the newbie yard to the planar endgame at 50.
- **🧭 Personal Advisor** — ranked hunting zones (level fit + walking distance from your home city + build durability + faction warnings), build analysis, quests worth doing now, named mobs in reach, and next milestones.
- **Installable PWA** — works offline, full map data included (~5.5 MB), multiple characters stored locally in your browser.

![Personalized advisor](docs/screenshot-advisor.png)

## Development

```bash
npm install
npm run dev        # dev server with hot reload
npm test           # vitest — data integrity + advisor logic (30 tests)
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Built with Vite + React 18 + TypeScript (strict), `react-router-dom`, and `vite-plugin-pwa`. No backend — character profiles live in `localStorage`.

## Editing game data

The game is in beta and data will shift. Everything lives in typed, hand-editable files:

| File | Contents |
|---|---|
| `src/data/zones/*.ts` | zones: level ranges, connections, hotspots, dangers |
| `src/data/races.ts` / `classes.ts` | races, classes, legal primary classes, roles |
| `src/data/monsters.ts` / `quests.ts` | bestiary and quest guide |
| `src/data/macros.ts` | macro guide |
| `src/data/progression.ts` | level-band leveling guide |

Run `npm test` after editing — integrity tests verify every cross-reference (zone connections, class ids, map coverage).

### Refreshing map geometry

Zone maps are imported from Brewall's map pack:

```bash
# download + extract https://www.eqmaps.info/eq-map-files/ then:
node scripts/import-maps.mjs <path-to-extracted-brewall-folder>
```

This regenerates `src/data/maps/*.json` (one lazy-loaded chunk per zone).

## Verification scripts

`scripts/verify-app.mjs`, `verify-maps.mjs`, `verify-guides.mjs`, and `verify-macros.mjs` drive the built app in headless Chrome (via `puppeteer-core` and a local Chrome install) and assert end-to-end behavior — run any of them against `npm run preview`:

```bash
node scripts/verify-app.mjs http://localhost:4173 ./shots
```

## Credits & disclaimer

- Zone map data by **Brewall** — [eqmaps.info](https://www.eqmaps.info/)
- Game facts sourced from the [official site](https://everquestlegends.com/), [EQL Wiki](https://eqlwiki.com/), and [EQProgression](https://www.eqprogression.com/legends/faq/)
- This is an unofficial fan project, not affiliated with or endorsed by Daybreak Game Company or Game Jawn. EverQuest is a registered trademark of Daybreak Game Company LLC. Monster, quest, and zone details follow classic EverQuest (which EQL recreates) and may differ at launch.
