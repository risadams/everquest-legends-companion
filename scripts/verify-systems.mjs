// Verifies the stances/invocations, travel, and handbook pages in headless Chrome.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const SHOTS = process.argv[3] ?? './shots';
mkdirSync(SHOTS, { recursive: true });

let failures = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
}
async function clickButtonByText(page, text) {
  const ok = await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === t);
    if (btn) { btn.click(); return true; }
    return false;
  }, text);
  if (!ok) throw new Error(`button not found: ${text}`);
  await new Promise((r) => setTimeout(r, 150));
}

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'shell',
  args: ['--no-sandbox', '--window-size=1280,950']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 950 });
page.on('pageerror', (e) => check('no page JS errors', false, String(e)));
page.on('dialog', (d) => d.accept());

try {
  // Abilities page, no combo: full reference
  await page.goto(`${BASE}/#/abilities`, { waitUntil: 'networkidle0' });
  const cards = await page.$$eval('[data-ability]', (els) => els.length);
  check('abilities page lists all 18 stances+invocations', cards === 18, `${cards} cards`);

  // Pick a caster trio and confirm scaling math appears
  for (const cls of ['Wizard', 'Necromancer', 'Enchanter']) await clickButtonByText(page, cls);
  const abilityText = await page.evaluate(() => document.body.innerText);
  check('combo counters render', /\d of 9 stances/.test(abilityText));
  check('arcane mastery scaling computed for 3 INT classes',
    abilityText.includes('Cast & recovery time reduction: 40%'));
  check('melee stances marked not in combo', abilityText.includes('Not in combo'));
  await page.screenshot({ path: join(SHOTS, 's1-abilities.png'), fullPage: true });

  // Travel page
  await page.goto(`${BASE}/#/travel`, { waitUntil: 'networkidle0' });
  const dests = await page.$$eval('[data-travel-dest]', (els) => els.length);
  check('travel page lists port destinations', dests >= 15, `${dests} destinations`);
  for (const cls of ['Druid', 'Warrior', 'Cleric']) await clickButtonByText(page, cls);
  const travelText = await page.evaluate(() => document.body.innerText);
  check('reachable counter renders', /\d+ of \d+ port destinations/.test(travelText));
  check('rituals explainer present', travelText.includes('Rituals in 30 seconds'));
  const hasGreenRing = await page.evaluate(() =>
    [...document.querySelectorAll('.badge.good')].some((b) => b.textContent.includes('Ring of'))
  );
  check('druid rings castable (green) for a level-50 druid combo', hasGreenRing);
  await page.screenshot({ path: join(SHOTS, 's2-travel.png'), fullPage: true });

  // Zone link from travel card works
  await page.evaluate(() => {
    document.querySelector('[data-travel-dest] a').click();
  });
  await new Promise((r) => setTimeout(r, 500));
  check('travel destination links into the atlas', page.url().includes('/atlas/'));

  // Handbook page
  await page.goto(`${BASE}/#/handbook`, { waitUntil: 'networkidle0' });
  const handbookText = await page.evaluate(() => document.body.innerText);
  check('handbook covers AAs', handbookText.includes('Alternate Advancement'));
  check('handbook covers exaltation slots', handbookText.includes('Ornamentation') && handbookText.includes('Proc'));
  check('handbook covers tradeskills', handbookText.includes('Jewelcrafting') && handbookText.includes('Crafting Mastery'));
  check('handbook lists 16 deities', handbookText.includes('Veeshan') && handbookText.includes('Bertoxxulous'));
  await page.screenshot({ path: join(SHOTS, 's3-handbook.png'), fullPage: true });

  // Factions page
  await page.goto(`${BASE}/#/factions`, { waitUntil: 'networkidle0' });
  const factionCards = await page.$$eval('[data-faction]', (els) => els.length);
  check('factions page lists the significant factions', factionCards >= 15, `${factionCards} cards`);
  const factionText = await page.evaluate(() => document.body.innerText);
  check('faction rivalries render', factionText.includes('Rivals:'));
  check('halas banker gotcha present', factionText.includes('unable to bank in Halas'));
  check('EQL faction achievements note present', factionText.includes('faction achievements'));

  // Bestiary patch-sync spot checks
  await page.goto(`${BASE}/#/bestiary`, { waitUntil: 'networkidle0' });
  await page.type('input[placeholder^="Search"]', 'Baron');
  await new Promise((r) => setTimeout(r, 250));
  const baronText = await page.evaluate(() => document.body.innerText);
  check('Baron Telyx (new deep Befallen named) searchable', baronText.includes('Baron Telyx'));

  // Class detail: spells / skills / AAs
  await page.goto(`${BASE}/#/classes/cleric`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const clericText = await page.evaluate(() => document.body.innerText);
  check('cleric spell list renders with counts', /Spells \(\d{2,}\)/.test(clericText));
  check('cleric level-1 staples present', clericText.includes('Courage') && clericText.includes('Minor Healing'));
  check('source legend present', clericText.includes('Auto-granted') && clericText.includes('Vendor'));
  await page.screenshot({ path: join(SHOTS, 's5-class-spells.png') });
  await clickButtonByText(page, /Skills \(/.test(clericText) ? clericText.match(/Skills \(\d+\)/)[0] : 'Skills');
  const skillText = await page.evaluate(() => document.body.innerText);
  check('skills table shows trained vs auto', skillText.includes('Trained') && skillText.includes('Auto'));
  await clickButtonByText(page, 'AAs');
  await new Promise((r) => setTimeout(r, 400));
  const aaText = await page.evaluate(() => document.body.innerText);
  check('class AAs render', aaText.includes('Cleric class AAs'));
  check('shared AAs render', aaText.includes('General AAs') && aaText.includes('Gather Party'));
  await page.screenshot({ path: join(SHOTS, 's6-class-aas.png') });

  // Parchment maps
  await page.goto(`${BASE}/#/atlas/east-commonlands`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  const hasCompass = await page.$('.map-compass');
  const hasCartouche = await page.evaluate(
    () => document.querySelector('.map-cartouche')?.textContent ?? ''
  );
  check('zone map has compass rose', Boolean(hasCompass));
  check('zone map cartouche shows zone name', hasCartouche.includes('East Commonlands'));
  await page.screenshot({ path: join(SHOTS, 's7-parchment-map.png') });
  await page.goto(`${BASE}/#/atlas`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  check('continent map has decor', Boolean(await page.$('.continent-map-wrap .map-compass')));
  const atlasText = await page.evaluate(() => document.body.innerText);
  check('crossing-the-world panel present', atlasText.includes('Crossing the world'));
  check('boat departure marker on Antonica map', atlasText.includes('⚓ Butcherblock Mountains · Faydwer'));
  check('plane departure marker on Antonica map', atlasText.includes('✦ Plane of Fear · The Planes'));
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'The Planes').click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const planesText = await page.evaluate(() => document.body.innerText);
  check('spell-only planes show wizard-port caption', planesText.includes('reached by wizard port'));
  await page.screenshot({ path: join(SHOTS, 's8-parchment-atlas.png') });

  // Lore page
  await page.goto(`${BASE}/#/lore`, { waitUntil: 'networkidle0' });
  const eras = await page.$$eval('[data-era]', (els) => els.length);
  const deities = await page.$$eval('[data-deity]', (els) => els.length);
  const figures = await page.$$eval('[data-figure]', (els) => els.length);
  check('lore timeline shows the five ages', eras === 5, `${eras} eras`);
  check('lore lists all 16 gods', deities === 16, `${deities} deities`);
  check('lore lists figures of note', figures >= 12, `${figures} figures`);
  const loreText = await page.evaluate(() => document.body.innerText);
  check('your-place section present', loreText.includes('Your place in the world'));
  await page.screenshot({ path: join(SHOTS, 's17-lore.png') });

  // Nav wiring: grouped dropdowns
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle0' });
  const navText = await page.evaluate(() =>
    [...document.querySelectorAll('nav a, nav button')].map((a) => a.textContent.trim()).join('|')
  );
  check(
    'top nav shows grouped entries',
    ['Home', 'Atlas', 'World', 'Classes', 'Guides', 'My Character'].every((l) => navText.includes(l))
  );
  await page.evaluate(() => {
    [...document.querySelectorAll('nav button')].find((b) => b.textContent.includes('Classes')).click();
  });
  await new Promise((r) => setTimeout(r, 150));
  const menuText = await page.evaluate(() =>
    [...document.querySelectorAll('.nav-menu a')].map((a) => a.textContent.trim()).join('|')
  );
  check(
    'Classes dropdown lists its pages',
    ['Races & Classes', 'Spells & Skills', 'Stances & Invocations', 'Macro Guide'].every((l) =>
      menuText.includes(l)
    )
  );

  // Spells & Skills index page
  await page.goto(`${BASE}/#/spells`, { waitUntil: 'networkidle0' });
  const spellsIdx = await page.$$eval('.card-grid a.card', (els) => els.length);
  check('spells index lists all 16 classes', spellsIdx === 16, `${spellsIdx} cards`);
  await page.screenshot({ path: join(SHOTS, 's10-spells-index.png') });
} catch (err) {
  check('script completed', false, String(err));
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nALL SYSTEMS CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
