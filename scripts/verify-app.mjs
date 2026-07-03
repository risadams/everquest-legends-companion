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
  const clicked = await page.evaluate(() => {
    const link = [...document.querySelectorAll('.zone-map-wrap a')].find((a) =>
      a.textContent.includes('North Ro')
    );
    if (link) {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
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
  check('advisor renders for Grukk', advisor.includes('Advisor: Grukk, level 12 Troll'));
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
} catch (err) {
  check('script completed', false, String(err));
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
