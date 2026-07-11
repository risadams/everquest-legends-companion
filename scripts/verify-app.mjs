// Drives the built app in headless Chrome and reports what it observes.
// Usage: node scripts/verify-app.mjs <base-url> <shot-dir>
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const SHOTS = process.argv[3] ?? './shots';
mkdirSync(SHOTS, { recursive: true });

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

let failures = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
}

async function clickButtonByText(page, text) {
  const ok = await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      b.textContent.trim().startsWith(t)
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);
  if (!ok) throw new Error(`button not found: ${text}`);
  await new Promise((r) => setTimeout(r, 120));
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--window-size=1280,900']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
page.on('pageerror', (e) => check('no page JS errors', false, String(e)));
page.on('dialog', (d) => d.accept());

try {
  // ── Home ────────────────────────────────────────────────
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle0' });
  const h1 = await page.$eval('h1', (e) => e.textContent);
  check('home renders', h1.includes('EQL Companion'), h1);
  await page.screenshot({ path: join(SHOTS, '1-home.png') });

  // ── Atlas ───────────────────────────────────────────────
  await page.goto(`${BASE}/#/atlas`, { waitUntil: 'networkidle0' });
  const antonicaCards = await page.$$eval('.card-grid > a', (els) => els.length);
  check('atlas shows Antonica zones', antonicaCards >= 30, `${antonicaCards} cards`);
  const svgNodes = await page.$$eval('.continent-map-wrap svg text', (els) => els.length);
  check('continent map has labels', svgNodes > 30, `${svgNodes} labels`);
  await clickButtonByText(page, 'Faydwer');
  const faydwerCards = await page.$$eval('.card-grid > a', (els) => els.length);
  check('Faydwer tab filters zones', faydwerCards >= 10 && faydwerCards < antonicaCards, `${faydwerCards} cards`);
  await page.screenshot({ path: join(SHOTS, '2-atlas.png') });

  // level filter probe: level 12 on Faydwer
  await page.type('input[type="number"]', '12');
  await new Promise((r) => setTimeout(r, 150));
  const lvl12 = await page.$$eval('.card-grid > a', (els) =>
    els.map((e) => e.querySelector('strong').textContent)
  );
  check(
    'level filter works (12 on Faydwer includes Crushbone)',
    lvl12.some((n) => n.includes('Crushbone')),
    lvl12.join(', ')
  );

  // ── Zone detail + connection click ─────────────────────
  await page.goto(`${BASE}/#/atlas/oasis`, { waitUntil: 'networkidle0' });
  const zoneH1 = await page.$eval('h1', (e) => e.textContent);
  check('zone detail renders Oasis', zoneH1.includes('Oasis'), zoneH1);
  const hotspotRows = await page.$$eval('table.data tbody tr', (els) => els.length);
  check('hotspot table populated', hotspotRows >= 2, `${hotspotRows} rows`);
  await page.screenshot({ path: join(SHOTS, '3-zone-oasis.png') });
  // click the North Ro exit on the SVG map itself
  // exits render as clickable SVG <g onClick> groups labeled "→ <Zone>" (schematic)
  // or "to <Zone>" (Brewall map)
  const clicked = await page.evaluate(() => {
    const label = [...document.querySelectorAll('.zone-map-wrap svg text')].find((t) =>
      /North\s+(Desert\s+of\s+)?Ro/i.test(t.textContent)
    );
    const g = label?.closest('g');
    if (g) {
      g.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return true;
    }
    return false;
  });
  await new Promise((r) => setTimeout(r, 250));
  const afterClick = await page.$eval('h1', (e) => e.textContent);
  check('map exit navigates to North Ro', clicked && afterClick.includes('North Ro'), afterClick);

  // probe: unknown zone id
  await page.goto(`${BASE}/#/atlas/not-a-zone`, { waitUntil: 'networkidle0' });
  const unknown = await page.$eval('h1', (e) => e.textContent);
  check('unknown zone id handled gracefully', unknown.includes('Unknown zone'), unknown);

  // ── Combo explorer ──────────────────────────────────────
  await page.goto(`${BASE}/#/classes`, { waitUntil: 'networkidle0' });
  for (const cls of ['Wizard', 'Magician', 'Necromancer']) {
    await clickButtonByText(page, cls);
  }
  const comboText = await page.$eval('.advice-callout', (e) => e.textContent);
  check('combo explorer flags no tank', comboText.includes('No tank'), '');
  check('combo explorer flags no healer', comboText.includes('No healer'), '');
  check(
    'combo explorer lists legal races for wizard primary',
    comboText.includes('Human') && comboText.includes('High Elf'),
    ''
  );
  await page.screenshot({ path: join(SHOTS, '4-combo.png') });

  // ── Character creation: evil Troll ──────────────────────
  await page.goto(`${BASE}/#/character`, { waitUntil: 'networkidle0' });
  await page.type('input[placeholder="Character name"]', 'Grukk');
  await page.select('select', 'troll');
  // probe: Monk should be disabled as primary for a troll
  const monkDisabled = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('.card button')].find(
      (b) => b.textContent.trim() === 'Monk'
    );
    return btn ? btn.disabled : null;
  });
  check('illegal primary (troll monk) is disabled', monkDisabled === true, String(monkDisabled));
  for (const cls of ['Shadow Knight', 'Shaman', 'Berserker']) {
    await clickButtonByText(page, cls);
  }
  // probe: level clamp
  await page.evaluate(() => {
    const inp = document.querySelector('.card input[type="number"]');
    inp.value = '';
  });
  await page.type('.card input[type="number"]', '999');
  const lvlVal = await page.$eval('.card input[type="number"]', (e) => e.value);
  check('level input clamps to 50', lvlVal === '50', lvlVal);
  await page.evaluate(() => {
    const inp = document.querySelector('.card input[type="number"]');
    inp.value = '';
  });
  await page.type('.card input[type="number"]', '12');
  await clickButtonByText(page, 'Save character');
  await new Promise((r) => setTimeout(r, 200));

  const advisor = await page.evaluate(() => document.body.innerText);
  // ── Character sheet (parchment hero) ────────────────────
  check('character sheet renders for Grukk', (await page.$('.char-sheet')) !== null);
  check('sheet shows the character name', advisor.includes('Grukk') && advisor.includes('Level 12 Troll'));
  const statBlocks = await page.$$eval('.char-sheet .stat-block', (els) => els.length);
  check('sheet shows all 7 attributes', statBlocks === 7, `${statBlocks} stat blocks`);
  const primeBlocks = await page.$$eval('.char-sheet .stat-block.prime', (els) => els.length);
  check('primary-class prime stats highlighted', primeBlocks >= 1, `${primeBlocks} prime`);
  const portraitOk = await page.evaluate(() => {
    const img = document.querySelector('.char-portrait img');
    if (img && img.complete && img.naturalWidth > 0) return 'image';
    return document.querySelector('.char-portrait .art-monogram') ? 'monogram' : null;
  });
  check('class portrait or monogram fallback shown', portraitOk !== null, String(portraitOk));
  // backstory chronicle: write, save, persists through reload
  await clickButtonByText(page, '✎ Write');
  await page.type('.char-chronicle textarea', 'Grukk smash first, ask questions never.');
  await clickButtonByText(page, 'Save');
  await new Promise((r) => setTimeout(r, 150));
  await page.reload({ waitUntil: 'networkidle0' });
  const chron = await page.$eval('.char-chronicle', (e) => e.innerText);
  check('backstory saves and persists', chron.includes('Grukk smash first'), '');
  const trollZones = await page.$$eval('table.data tbody tr td:first-child', (els) =>
    els.map((e) => e.textContent.trim())
  );
  const southern = ['Upper Guk', 'Innothule', 'Oasis', 'Feerrott', 'South Ro', 'Blackburrow'];
  check(
    'troll recs favor southern Antonica',
    trollZones.some((z) => southern.some((s) => z.includes(s))),
    trollZones.join(' | ')
  );
  check(
    'evil-race faction guidance shown',
    advisor.includes('attack on sight'),
    ''
  );
  check(
    'milestone: planar countdown',
    advisor.includes('34 levels away'),
    ''
  );
  await page.screenshot({ path: join(SHOTS, '5-advisor-troll.png'), fullPage: true });

  // ── Lore art plates (uniform image treatment) ───────────
  await page.goto(`${BASE}/#/lore`, { waitUntil: 'networkidle0' });
  const plates = await page.$$eval('.art-plate--relic', (els) => els.length);
  check('lore art uses uniform plates', plates >= 16, `${plates} plates`);
  const brokenImgs = await page.$$eval('.art-plate img', (els) =>
    els.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
  );
  check('all lore images resolve', brokenImgs.length === 0, brokenImgs.join(', '));
  // back to the character page for the sections below
  await page.goto(`${BASE}/#/character`, { waitUntil: 'networkidle0' });

  // ── Second character: High Elf, different recs ──────────
  await clickButtonByText(page, '+ New character');
  await page.type('input[placeholder="Character name"]', 'Aelora');
  await page.select('.card select', 'high-elf');
  for (const cls of ['Cleric', 'Enchanter', 'Wizard']) {
    await clickButtonByText(page, cls);
  }
  await page.evaluate(() => {
    const inp = document.querySelector('.card input[type="number"]');
    inp.value = '';
  });
  await page.type('.card input[type="number"]', '12');
  await clickButtonByText(page, 'Save character');
  await new Promise((r) => setTimeout(r, 200));
  const elfZones = await page.$$eval('table.data tbody tr td:first-child', (els) =>
    els.map((e) => e.textContent.trim())
  );
  check(
    'high elf recs differ from troll and include Faydwer',
    JSON.stringify(elfZones) !== JSON.stringify(trollZones) &&
      elfZones.some((z) => ['Crushbone', 'Butcherblock', 'Greater Faydark', 'Unrest', 'Dagnor'].some((s) => z.includes(s))),
    elfZones.join(' | ')
  );

  // ── Persistence probe: reload, switch characters ────────
  await page.reload({ waitUntil: 'networkidle0' });
  const headerOptions = await page.$$eval('header select option', (els) =>
    els.map((e) => e.textContent)
  );
  check(
    'characters persist across reload',
    headerOptions.some((o) => o.includes('Grukk')) && headerOptions.some((o) => o.includes('Aelora')),
    headerOptions.join(' | ')
  );

  // Home dashboard personalizes
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle0' });
  const homeText = await page.evaluate(() => document.body.innerText);
  check('home dashboard shows active character', homeText.includes('HUNT NEXT'), '');

  // Progression highlights current band
  await page.goto(`${BASE}/#/progression`, { waitUntil: 'networkidle0' });
  const prog = await page.evaluate(() => document.body.innerText);
  check('progression marks current band', prog.includes('you are here'), '');
  check('progression injects class notes', prog.includes('Your classes this band'), '');
  await page.screenshot({ path: join(SHOTS, '6-progression.png') });

  // ── AA rank tracking (Aelora active: cleric/enchanter/wizard) ──
  await page.goto(`${BASE}/#/classes/cleric`, { waitUntil: 'networkidle0' });
  await clickButtonByText(page, 'AAs');
  await new Promise((r) => setTimeout(r, 500)); // shared AAs lazy-load
  const bought = await page.evaluate(() => {
    const plus = [...document.querySelectorAll('button.rank-btn')].filter(
      (b) => b.textContent.trim() === '+'
    );
    if (plus.length === 0) return false;
    plus[0].click();
    return true;
  });
  await new Promise((r) => setTimeout(r, 150));
  const rankShown = await page.$eval('.rank-count', (e) => e.textContent.trim());
  check('AA rank stepper buys a rank', bought && /^1\//.test(rankShown), rankShown);
  await page.goto(`${BASE}/#/character`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700)); // AA advisor lazy-loads
  const invested = await page.evaluate(() => document.body.innerText);
  check('AA advisor shows invested points', invested.includes('pts invested'), '');

  // ── Deity: edit Aelora to follow Karana ──────────────────
  await clickButtonByText(page, 'Edit Aelora');
  await page.select('.card select[aria-label="Deity"]', 'karana');
  await clickButtonByText(page, 'Save character');
  await new Promise((r) => setTimeout(r, 200));
  const withDeity = await page.$eval('.char-sheet', (e) => e.innerText);
  check('sheet shows the chosen deity', /follows Karana/i.test(withDeity), '');
  check('advisor gives deity-flavored advice', (await page.$('[data-deity-advice]')) !== null);
  check('print sheet button present', await page.evaluate(() =>
    [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Print'))
  ));

  // ── Armory: equip an item, verify it persists ────────────
  await clickButtonByText(page, '✎ Equip your gear');
  await page.type('.char-armory-form input', 'Ghoulbane');
  await clickButtonByText(page, 'Save');
  await new Promise((r) => setTimeout(r, 150));
  await page.reload({ waitUntil: 'networkidle0' });
  const armory = await page.$eval('.char-armory', (e) => e.innerText);
  check('armory saves and persists gear', armory.includes('Ghoulbane'), '');

  // ── Tradeskill progress tracking ─────────────────────────
  await page.goto(`${BASE}/#/tradeskills`, { waitUntil: 'networkidle0' });
  await clickButtonByText(page, '⚒️ Blacksmithing');
  await page.type('[data-ts-tracker] input', '30');
  await new Promise((r) => setTimeout(r, 150));
  const tsText = await page.evaluate(() => document.body.innerText);
  check(
    'tradeskill tracker marks the current rung',
    tsText.includes('you are here') && tsText.includes('current rung: Sheet Metal'),
    ''
  );
  check(
    'tradeskill shopping list estimates combines',
    tsText.includes('Shopping list:') && /~\d+ combines/.test(tsText),
    ''
  );

  // ── Share link imports a build ───────────────────────────
  const token = Buffer.from(
    JSON.stringify({ n: 'Zik', r: 'gnome', c: ['wizard', 'enchanter'], l: 20, a: 5 })
  ).toString('base64url');
  await page.goto(`${BASE}/#/character?share=${token}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));
  const afterShare = await page.$$eval('header select option', (els) =>
    els.map((e) => e.textContent)
  );
  check('share link imports a build', afterShare.some((o) => o.includes('Zik')), afterShare.join(' | '));
} catch (err) {
  check('script completed', false, String(err));
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
