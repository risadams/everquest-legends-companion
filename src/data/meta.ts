export const DATA_VERSION = '0.6.0 — launch data (client build 2026-07-27, patches through 2026-07-29)';

export const DISCLAIMER =
  'EverQuest Legends went live on July 28, 2026 and is patching weekly — zone levels, class rules, and loot tables still move. ' +
  'This is an unofficial fan-made companion; it is not affiliated with Daybreak Game Company or Game Jawn. ' +
  'Game data files live in src/data and are easy to edit as the game evolves.';

export const SOURCES = [
  { label: 'Official site', url: 'https://everquestlegends.com/' },
  { label: 'Official patch notes', url: 'https://www.everquestlegends.com/patch-notes' },
  { label: 'EQL Wiki', url: 'https://eqlwiki.com/' },
  { label: 'EQProgression Legends FAQ', url: 'https://www.eqprogression.com/legends/faq/' },
  // maps come from the client's own maps/ folder; Brewall still covers the
  // handful of dungeons the client ships no map for
  { label: 'Zone maps by Brewall (fallback zones)', url: 'https://www.eqmaps.info/' }
];
