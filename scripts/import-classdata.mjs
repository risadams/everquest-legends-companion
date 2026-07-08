// Harvests per-class spells, skills, and AAs from eqlwiki.com into
// src/data/classdata/*.json (one lazy-loaded chunk per class, plus shared AAs).
//
//   node scripts/import-classdata.mjs
//
// Sources: each class page's RadSpellRow2 templates (spells/songs by level),
// its skill tables (wikitable and raw-HTML variants), and the
// Alternate_Advancement page (General / Archetype / Class / Special AAs).

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'classdata');
const API = 'https://eqlwiki.com/api.php';

const CLASS_PAGES = {
  bard: 'Bard',
  beastlord: 'Beastlord',
  berserker: 'Berserker',
  cleric: 'Cleric',
  druid: 'Druid',
  enchanter: 'Enchanter',
  magician: 'Magician',
  monk: 'Monk',
  necromancer: 'Necromancer',
  paladin: 'Paladin',
  ranger: 'Ranger',
  rogue: 'Rogue',
  'shadow-knight': 'Shadow_Knight',
  shaman: 'Shaman',
  warrior: 'Warrior',
  wizard: 'Wizard'
};

async function fetchWikitext(page) {
  const url = `${API}?action=parse&page=${encodeURIComponent(page)}&format=json&prop=wikitext`;
  const res = await fetch(url, { headers: { 'user-agent': 'eql-companion-importer' } });
  const json = await res.json();
  if (json.error) throw new Error(`${page}: ${json.error.info}`);
  return json.parse.wikitext['*'];
}

// ── wiki markup cleanup ──────────────────────────────────────

function clean(s) {
  return (s ?? '')
    .replace(/\{\{\s*([^}|]+?)\s+Short\s*\}\}/g, '$1') // {{Classic Short}} → Classic
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]|]*)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/<br\s*\/?\s*>/gi, '; ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** slice a section's body: from its heading to the next heading of <= depth */
function section(wikitext, headingRe) {
  const m = wikitext.match(headingRe);
  if (!m) return null;
  const depth = (m[0].match(/^=+/) ?? ['=='])[0].length;
  const start = m.index + m[0].length;
  const rest = wikitext.slice(start);
  const next = rest.match(new RegExp(`^={1,${depth}}[^=].*`, 'm'));
  return next ? rest.slice(0, next.index) : rest;
}

// ── spells: {{RadSpellRow2 |k=v ...}} with nested templates ──

function parseTemplates(body, name) {
  const out = [];
  let idx = 0;
  const marker = `{{${name}`;
  while ((idx = body.indexOf(marker, idx)) !== -1) {
    let depth = 0;
    let end = idx;
    for (let i = idx; i < body.length - 1; i++) {
      if (body[i] === '{' && body[i + 1] === '{') { depth++; i++; }
      else if (body[i] === '}' && body[i + 1] === '}') {
        depth--;
        i++;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    const inner = body.slice(idx + marker.length, end - 2);
    const params = {};
    // split on top-level pipes (ignore pipes inside nested {{ }})
    let d = 0, cur = '';
    const parts = [];
    for (let i = 0; i < inner.length; i++) {
      const two = inner.slice(i, i + 2);
      if (two === '{{') { d++; cur += two; i++; continue; }
      if (two === '}}') { d--; cur += two; i++; continue; }
      if (inner[i] === '|' && d === 0) { parts.push(cur); cur = ''; continue; }
      cur += inner[i];
    }
    parts.push(cur);
    for (const p of parts) {
      const eq = p.indexOf('=');
      if (eq === -1) continue;
      params[p.slice(0, eq).trim()] = clean(p.slice(eq + 1));
    }
    out.push(params);
    idx = end;
  }
  return out;
}

function parseSpells(wikitext) {
  const spells = [];
  const matches = [...wikitext.matchAll(/^==\s*Level\s+(\d+)\s*==/gm)];
  for (let i = 0; i < matches.length; i++) {
    const level = Number(matches[i][1]);
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : wikitext.indexOf('\n=', start);
    const body = wikitext.slice(start, end === -1 ? undefined : end);
    for (const p of parseTemplates(body, 'RadSpellRow2')) {
      if (!p.name) continue;
      spells.push({
        name: p.name,
        level,
        kind: p.kind ?? '',
        target: p.targ ?? '',
        mana: p.mana ?? '',
        maxEffect: p.max ?? '',
        duration: p.duration ?? '',
        description: p.description ?? '',
        school: p.school ?? '',
        source: p.location ?? '',
        era: p.era ?? ''
      });
    }
  }
  return spells;
}

// ── skills: wikitable AND raw-HTML table variants ────────────

const SKILL_SECTIONS = [
  'Casting Skills',
  'Combat Skills',
  'Miscellaneous Skills',
  'Musical Skills'
];

/** strip a leading `attr="…" |` segment from a wikitable cell */
function cellContent(raw) {
  const pipe = raw.indexOf('|');
  if (pipe !== -1) {
    const before = raw.slice(0, pipe);
    if (/=/.test(before) && !before.includes('[[') && !before.includes('{{')) {
      return raw.slice(pipe + 1);
    }
  }
  return raw;
}

function parseWikitableSkills(body) {
  const rows = [];
  for (const table of body.matchAll(/\{\|[\s\S]*?\|\}/g)) {
    const headerCells = [...table[0].matchAll(/^!(?!!)\s*(.+)$/gm)].flatMap((m) =>
      m[1].split(/\|\||!!/).map((c) => clean(cellContent(c)).toLowerCase())
    );
    const idx = headerIndices(headerCells);
    const chunks = table[0].split(/^\|-.*$/m).slice(1);
    for (const chunk of chunks) {
      const cells = [...chunk.matchAll(/^\|(?!\}|-)\s*(.*)$/gm)].flatMap((m) =>
        m[1].split('||').map((c) => clean(cellContent(c)))
      );
      if (cells.length >= 4) rows.push(cellsToSkill(cells, idx));
    }
  }
  return rows.filter(Boolean);
}

/** locate level/skill/trained/cap columns from header text (order varies by page) */
function headerIndices(headers) {
  const find = (...needles) =>
    headers.findIndex((h) => needles.some((n) => h.includes(n)));
  let level = find('level');
  let skill = find('skill name', 'skill');
  let trained = find('train');
  let cap50 = find('until 50', 'pre 50');
  let capPost = find('after 50', 'above 50', 'post 50');
  if (level === -1 || skill === -1 || trained === -1) {
    // no usable header — assume the common Level/Skill/Trained/caps layout
    level = 0; skill = 1; trained = 2; cap50 = 3; capPost = 4;
  }
  if (cap50 === -1) cap50 = Math.max(level, skill, trained) + 1;
  if (capPost === -1) capPost = cap50 + 1;
  return { level, skill, trained, cap50, capPost };
}

function parseHtmlSkills(body) {
  const rows = [];
  for (const tr of body.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => clean(m[1]));
    if (cells.length >= 4 && /^\d+$/.test(cells[0])) {
      // cleric-style HTML tables: Level, Trained, Skill, caps
      const trainedFirst = /^(yes|no|y|n)$/i.test(cells[1]);
      rows.push(
        cellsToSkill(
          cells,
          trainedFirst
            ? { level: 0, trained: 1, skill: 2, cap50: 3, capPost: 4 }
            : { level: 0, skill: 1, trained: 2, cap50: 3, capPost: 4 }
        )
      );
    }
  }
  return rows.filter(Boolean);
}

function cellsToSkill(cells, idx) {
  const get = (k) => cells[idx[k]] ?? '';
  const level = Number(get('level'));
  const name = get('skill').replace(/\s*\*+$/, '');
  if (!name || Number.isNaN(level)) return null;
  return {
    name,
    level,
    trained: /^(y|yes)/i.test(get('trained')),
    cap50: get('cap50'),
    capPost: get('capPost')
  };
}

function parseSkills(wikitext) {
  const skills = [];
  for (const title of SKILL_SECTIONS) {
    const body = section(wikitext, new RegExp(`^=+\\s*${title}\\s*=+`, 'm'));
    if (!body) continue;
    const rows = [...parseWikitableSkills(body), ...parseHtmlSkills(body)];
    for (const r of rows) skills.push({ ...r, category: title.replace(' Skills', '') });
  }
  skills.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  return skills;
}

// ── AAs: wikitable rows Name/Ranks/Cost/Description ──────────

function parseAaTable(body) {
  const rows = [];
  if (!body) return rows;
  for (const table of body.matchAll(/\{\|[\s\S]*?\|\}/g)) {
    const chunks = table[0].split(/^\|-.*$/m).slice(1);
    for (const chunk of chunks) {
      if (/^\s*!/m.test(chunk)) continue; // header rows
      const cells = chunk
        .split(/\|\|/)
        .flatMap((c) => c.split(/^\|/m))
        .map((c) => clean(c))
        .filter((c) => c !== '');
      if (cells.length >= 4) {
        rows.push({
          name: cells[0],
          ranks: cells[1],
          cost: cells[2],
          description: cells.slice(3).join(' ')
        });
      }
    }
  }
  return rows;
}

// ── main ─────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });

const aaWikitext = await fetchWikitext('Alternate_Advancement');
const sharedAa = {
  general: parseAaTable(section(aaWikitext, /^==\s*General AAs\s*==/m)),
  archetype: parseAaTable(section(aaWikitext, /^==\s*Archetype AAs\s*==/m)),
  special: parseAaTable(section(aaWikitext, /^==\s*Special AAs\s*==/m))
};
writeFileSync(join(OUT_DIR, 'shared-aa.json'), JSON.stringify(sharedAa));
console.log(
  `shared-aa.json  general=${sharedAa.general.length} archetype=${sharedAa.archetype.length} special=${sharedAa.special.length}`
);

for (const [id, page] of Object.entries(CLASS_PAGES)) {
  const wikitext = await fetchWikitext(page);
  const classAaBody = section(
    aaWikitext,
    new RegExp(`^===\\s*${page.replace('_', ' ')} Class AAs\\s*===`, 'm')
  );
  const data = {
    spells: parseSpells(wikitext),
    skills: parseSkills(wikitext),
    aas: parseAaTable(classAaBody)
  };
  writeFileSync(join(OUT_DIR, `${id}.json`), JSON.stringify(data));
  console.log(
    `${id}.json  spells=${data.spells.length} skills=${data.skills.length} aas=${data.aas.length}`
  );
}
console.log('Done.');
