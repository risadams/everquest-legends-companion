// Verifies the macro guide in headless Chrome.
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
const context = browser.defaultBrowserContext();
await context.overridePermissions(BASE, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 950 });
page.on('pageerror', (e) => check('no page JS errors', false, String(e)));

try {
  // No character: universal macros only
  await page.goto(`${BASE}/#/macros`, { waitUntil: 'networkidle0' });
  const baseCards = await page.$$eval('[data-macro]', (els) => els.length);
  check('universal macros show with empty combo', baseCards >= 4 && baseCards <= 8, `${baseCards} macros`);

  // Pick the SK/Shaman/Berserker combo → synergy unlocks
  for (const cls of ['Shadow Knight', 'Shaman', 'Berserker']) await clickButtonByText(page, cls);
  const comboText = await page.evaluate(() => document.body.innerText);
  check('class macros appear (Harm Touch, Slow Opener, Frenzy)',
    comboText.includes('Harm Touch') && comboText.includes('Slow Opener') && comboText.includes('Frenzy Burst'));
  check('cross-class combo macro unlocked', comboText.includes('Slow → Tap Engage'));
  check('combo counter badge shows', comboText.includes('cross-class combo macro'));
  const comboCards = await page.$$eval('[data-macro]', (els) => els.length);
  check('macro count grows with combo', comboCards > baseCards, `${baseCards} → ${comboCards}`);
  await page.screenshot({ path: join(SHOTS, 'mc1-macros-combo.png'), fullPage: true });

  // Swap Shaman out → synergy disappears
  await clickButtonByText(page, 'Shaman');
  const noShm = await page.evaluate(() => document.body.innerText);
  check('removing a class removes its synergy', !noShm.includes('Slow → Tap Engage'));
  check('remaining class macros persist', noShm.includes('Harm Touch'));

  // 4th class blocked
  await clickButtonByText(page, 'Shaman'); // back to 3
  await clickButtonByText(page, 'Wizard'); // should be ignored (already 3 selected)
  const fourth = await page.evaluate(() => document.body.innerText);
  check('cannot select a 4th class', !fourth.includes('Assist Nuke'));

  // Copy button writes to clipboard
  await page.evaluate(() => {
    const card = document.querySelector('[data-macro="sk-harm-touch"]');
    [...card.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Copy').click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  const copiedLabel = await page.evaluate(() =>
    document.querySelector('[data-macro="sk-harm-touch"]').innerText.includes('Copied')
  );
  check('copy button works', copiedLabel || clip.includes('/doability 1'),
    clip ? clip.split('\n')[0] : 'via label');

  // Character preload: create a character, then macros page preselects its combo
  await page.goto(`${BASE}/#/character`, { waitUntil: 'networkidle0' });
  await page.type('input[placeholder="Character name"]', 'Zog');
  await page.select('.card select', 'troll');
  for (const cls of ['Shadow Knight', 'Shaman', 'Berserker']) {
    await page.evaluate((t) => {
      [...document.querySelectorAll('.card button')].find((b) => b.textContent.trim().endsWith(t)).click();
    }, cls);
    await new Promise((r) => setTimeout(r, 100));
  }
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Save character').click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.goto(`${BASE}/#/macros`, { waitUntil: 'networkidle0' });
  const pre = await page.evaluate(() => document.body.innerText);
  check('active character preloads combo', pre.includes('Preloaded from Zog') && pre.includes('Slow → Tap Engage'));
} catch (err) {
  check('script completed', false, String(err));
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nALL MACRO CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
