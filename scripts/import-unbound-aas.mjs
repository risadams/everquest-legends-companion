// Completes and flags the 16 autogranted "Unbound" class AAs in
// src/data/classdata/*.json.
//
//   node scripts/import-unbound-aas.mjs [--game <dir>]
//
// These shipped with the July 28 2026 launch patch: one per class, passive, and
// granted rather than purchased. The wiki documents 10 of them (with per-rank
// numbers and the level 12 requirement, which the client does not encode); the
// client's dbstr_us.txt carries all 16. So this merges rather than overwrites:
//
//   - the client supplies the canonical name (the wiki has one as "Unbounded
//     Strikethrough") and the class each belongs to
//   - a wiki description that already carries numbers WINS, because the client
//     string only has a "#1" placeholder the server fills in
//   - the 6 the wiki has no page for are filled in from the client
//   - all 16 get autogranted: true so the advisor stops offering them as buys
//
// import-classdata.mjs rebuilds the `aas` array wholesale from the wiki — run
// this after it. The upsert is idempotent, so re-running is safe.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CD_DIR = join(HERE, '..', 'src', 'data', 'classdata');
const argv = process.argv.slice(2);
const gameIdx = argv.indexOf('--game');
const GAME = gameIdx === -1 ? 'D:\\EverQuest Legends' : argv[gameIdx + 1];
const DBSTR = join(GAME, 'dbstr_us.txt');

if (!existsSync(DBSTR)) {
  console.error(`Not found: ${DBSTR}`);
  console.error('Usage: node scripts/import-unbound-aas.mjs [--game <dir>]');
  process.exit(1);
}

// Every description names its class except Unbound Destruction, which is the
// only one left once the other fifteen are assigned — the wizard's.
const CLASS_BY_AA = {
  'Unbound Affliction': 'necromancer',
  'Unbound Alacrity': 'monk',
  'Unbound Boon': 'cleric',
  'Unbound Cascade': 'shaman',
  'Unbound Clarity': 'enchanter',
  'Unbound Companion': 'magician',
  'Unbound Destruction': 'wizard',
  'Unbound Drain': 'shadow-knight',
  'Unbound Ferocity': 'beastlord',
  'Unbound Fury': 'berserker',
  'Unbound Lethality': 'rogue',
  'Unbound Life': 'paladin',
  'Unbound Nature': 'druid',
  'Unbound Strikethrough': 'ranger',
  'Unbound Versatility': 'bard',
  'Unbound Wrath': 'warrior'
};

// Per-rank values, where the patch notes state them. The client string carries a
// "#1" placeholder the server fills in, so anything not listed here stays
// unquantified rather than guessed.
// Source: https://www.everquestlegends.com/patch-notes/eql-update-notes-7-28-2026
const RANK_VALUES = {
  'Unbound Alacrity': '3/6/10%',
  'Unbound Life': '2/4/6%',
  'Unbound Ferocity': '3/6/9%'
};

const RANKS = '3';

/** dbstr rows are `id^type^text^0^`; type 1 is the name, type 4 the description */
function readStrings() {
  const names = new Map(); // id -> name
  const descs = new Map(); // id -> description
  for (const line of readFileSync(DBSTR, 'latin1').split('\n')) {
    const parts = line.split('^');
    if (parts.length < 3) continue;
    const [id, type, text] = parts;
    if (type === '1' && text.startsWith('Unbound ')) names.set(id, text);
    else if (type === '4') descs.set(id, text);
  }
  const out = [];
  for (const [id, name] of names) {
    const description = descs.get(id);
    if (description) out.push({ id, name, description });
  }
  return out;
}

/** turn the client's raw string into a sentence the class page can show */
function polish(name, raw) {
  let text = raw
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const values = RANK_VALUES[name];
  if (values) {
    text = text.replace(/#\d+%/, values).replace(/#\d+/, values);
  } else {
    // no published numbers — drop the placeholder rather than invent one
    text = text
      .replace(/ by #\d+%/g, ' with each rank')
      .replace(/ by #\d+/g, ' with each rank')
      .replace(/#\d+%/g, 'a scaling amount')
      .replace(/#\d+/g, 'a scaling amount');
  }
  return `Autogranted at launch. ${text}`;
}

const rows = readStrings();
const found = rows.filter((r) => CLASS_BY_AA[r.name]);
const unknown = rows.filter((r) => !CLASS_BY_AA[r.name]).map((r) => r.name);

/** the wiki's AA scrape leaves a stray brace on some rows */
const cleanWiki = (s) => s.replace(/\s*\}\s*$/, '').replace(/\s+/g, ' ').trim();

/** a description is worth keeping if it states real per-rank numbers */
const hasNumbers = (s) => /\d/.test(s.replace(/6 second/g, ''));

let added = 0;
let kept = 0;
let renamed = 0;
for (const row of found) {
  const classId = CLASS_BY_AA[row.name];
  const file = join(CD_DIR, `${classId}.json`);
  if (!existsSync(file)) {
    console.warn(`  ! no class file for ${classId} (${row.name})`);
    continue;
  }
  const data = JSON.parse(readFileSync(file, 'utf8'));
  // match loosely so the wiki's "Unbounded Strikethrough" is found and renamed
  const key = row.name.replace(/^Unbound /, '').toLowerCase();
  const i = data.aas.findIndex(
    (a) => a.name === row.name || a.name.toLowerCase().endsWith(` ${key}`)
  );
  const existing = i === -1 ? null : data.aas[i];

  if (existing) {
    if (existing.name !== row.name) renamed++;
    const wiki = cleanWiki(existing.description ?? '');
    data.aas[i] = {
      ...existing,
      name: row.name,
      ranks: existing.ranks || RANKS,
      cost: '0',
      autogranted: true,
      description: hasNumbers(wiki) ? wiki : polish(row.name, row.description)
    };
    kept++;
  } else {
    // keep it first: it is the line every character of the class already has
    data.aas.unshift({
      name: row.name,
      ranks: RANKS,
      cost: '0',
      autogranted: true,
      description: polish(row.name, row.description)
    });
    added++;
  }
  writeFileSync(file, JSON.stringify(data));
}

const missing = Object.keys(CLASS_BY_AA).filter((n) => !found.some((r) => r.name === n));
console.log(
  `Unbound AAs: ${added} added from the client, ${kept} kept from the wiki, ` +
    `${renamed} renamed (of ${Object.keys(CLASS_BY_AA).length})`
);
if (missing.length) console.log(`  not in this client build: ${missing.join(', ')}`);
if (unknown.length) console.log(`  unmapped Unbound strings (new class AA?): ${unknown.join(', ')}`);
