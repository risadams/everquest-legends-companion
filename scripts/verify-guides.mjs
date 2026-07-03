// Verifies the bestiary and quest guide in headless Chrome.
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
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(t));
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
  // Bestiary basics
  await page.goto(`${BASE}/#/bestiary`, { waitUntil: 'networkidle0' });
  const cards = await page.$$eval('.card-grid .card', (els) => els.length);
  check('bestiary lists monsters', cards > 80, `${cards} cards`);
  await clickButtonByText(page, 'Raid targets');
  const raidText = await page.evaluate(() => document.body.innerText);
  check('raid filter shows Vox & Nagafen', raidText.includes('Lady Vox') && raidText.includes('Lord Nagafen'));
  await page.screenshot({ path: join(SHOTS, 'g1-bestiary.png') });

  // Search (reset the kind filter with an exact-text click first)
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'All').click();
  });
  await new Promise((r) => setTimeout(r, 150));
  await page.type('input[placeholder^="Search"]', 'haste');
  await new Promise((r) => setTimeout(r, 200));
  const hasteText = await page.evaluate(() => document.body.innerText);
  check('loot search finds the Frenzied Ghoul via "haste"', hasteText.includes('Frenzied Ghoul'));

  // Quests page
  await page.goto(`${BASE}/#/quests`, { waitUntil: 'networkidle0' });
  const questText = await page.evaluate(() => document.body.innerText);
  check('quest guide renders classics', questText.includes('Crushbone Belts') && questText.includes('Journeyman’s Boots'));
  await clickButtonByText(page, 'Repeatable turn-ins');
  const turninText = await page.evaluate(() => document.body.innerText);
  check('turn-in filter works', turninText.includes('Gnoll Fangs') && !turninText.includes('SoulFire'));
  await page.screenshot({ path: join(SHOTS, 'g2-quests.png') });

  // Create an evil character and confirm personalization
  await page.goto(`${BASE}/#/character`, { waitUntil: 'networkidle0' });
  const hasForm = await page.$('input[placeholder="Character name"]');
  if (!hasForm) await clickButtonByText(page, '+ New character');
  await page.type('input[placeholder="Character name"]', 'Zog');
  await page.select('.card select', 'troll');
  for (const cls of ['Shadow Knight', 'Shaman', 'Berserker']) await clickButtonByText(page, cls);
  await page.evaluate(() => { document.querySelector('.card input[type="number"]').value = ''; });
  await page.type('.card input[type="number"]', '8');
  await clickButtonByText(page, 'Save character');
  await new Promise((r) => setTimeout(r, 250));
  const advisor = await page.evaluate(() => document.body.innerText);
  check('advisor shows quests section', advisor.includes('Quests worth doing'));
  check('advisor shows named targets', advisor.includes('Named mobs to hunt'));
  check('evil race gets militia belts, not gnoll fangs',
    advisor.includes('Deathfist Slashed Belts') && !advisor.includes('Gnoll Fangs'));
  await page.screenshot({ path: join(SHOTS, 'g3-advisor-quests.png'), fullPage: true });

  // Quest page personalization for the active troll
  await page.goto(`${BASE}/#/quests`, { waitUntil: 'networkidle0' });
  await clickButtonByText(page, 'Doable by Zog');
  const doable = await page.evaluate(() => document.body.innerText);
  check('doable filter removes good-only quests', !doable.includes('Crushbone Belts'), '');
  check('doable filter keeps neutral quests', doable.includes('Lightstones'), '');

  // Zone detail integration: Lower Guk monsters + quests
  await page.goto(`${BASE}/#/atlas/lower-guk`, { waitUntil: 'networkidle0' });
  const guk = await page.evaluate(() => document.body.innerText);
  check('zone page lists notable monsters', guk.includes('Notable monsters') && guk.includes('Frenzied Ghoul'));
  check('zone page lists quests starting here', guk.includes('Quests starting here') && guk.includes('Ghoulbane'));
  await page.screenshot({ path: join(SHOTS, 'g4-zone-monsters.png'), fullPage: true });

  // Bestiary personalization badge
  await page.goto(`${BASE}/#/bestiary`, { waitUntil: 'networkidle0' });
  await clickButtonByText(page, 'Targets for Zog');
  const forMe = await page.$$eval('.card-grid .card', (els) => els.length);
  check('bestiary "targets for me" filters to level range', forMe > 0 && forMe < 40, `${forMe} cards`);
} catch (err) {
  check('script completed', false, String(err));
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nALL GUIDE CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
