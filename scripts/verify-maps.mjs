// Verifies the Brewall-based interactive zone maps in headless Chrome.
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

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'shell',
  args: ['--no-sandbox', '--window-size=1280,950']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 950 });
page.on('pageerror', (e) => check('no page JS errors', false, String(e)));

try {
  // Oasis: real geometry + clickable exit
  await page.goto(`${BASE}/#/atlas/oasis`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.zone-map-wrap polyline', { timeout: 10000 });
  const polys = await page.$$eval('.zone-map-wrap polyline', (els) => els.length);
  check('Oasis renders real geometry', polys > 100, `${polys} polylines`);
  const labels = await page.$$eval('.zone-map-wrap text', (els) => els.map((e) => e.textContent));
  check(
    'key labels include zone lines',
    labels.some((l) => l.includes('North Desert of Ro')),
    labels.slice(0, 6).join(' | ')
  );
  await page.screenshot({ path: join(SHOTS, 'm1-oasis.png') });

  // Click the "→ North Desert of Ro" exit marker
  await page.evaluate(() => {
    const t = [...document.querySelectorAll('.zone-map-wrap text')].find((e) =>
      e.textContent.includes('North Desert of Ro')
    );
    t.parentElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 400));
  const h1 = await page.$eval('h1', (e) => e.textContent);
  check('exit marker navigates to North Ro', h1.includes('North Ro'), h1);

  // Label mode: all labels shows merchants
  await page.goto(`${BASE}/#/atlas/oasis`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.zone-map-wrap polyline');
  const keyCount = await page.$$eval('.zone-map-wrap text', (els) => els.length);
  await page.select('select[aria-label="Label detail"]', 'all');
  await new Promise((r) => setTimeout(r, 200));
  const allCount = await page.$$eval('.zone-map-wrap text', (els) => els.length);
  check('label detail expands POIs', allCount > keyCount, `${keyCount} key → ${allCount} all`);

  // Zoom via wheel
  const before = await page.$eval('.zone-map-wrap svg', (e) => e.getAttribute('viewBox'));
  await page.hover('.zone-map-wrap svg');
  await page.mouse.wheel({ deltaY: -300 });
  await new Promise((r) => setTimeout(r, 200));
  const after = await page.$eval('.zone-map-wrap svg', (e) => e.getAttribute('viewBox'));
  check('wheel zoom changes viewBox', before !== after, `${before} → ${after}`);
  await page.screenshot({ path: join(SHOTS, 'm2-oasis-zoomed.png') });

  // Freeport: multi-variant tabs
  await page.goto(`${BASE}/#/atlas/freeport`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.zone-map-wrap polyline');
  const tabs = await page.$$eval('.filter-bar button', (els) => els.map((e) => e.textContent));
  check(
    'Freeport shows district tabs',
    tabs.some((t) => t.includes('West Freeport')) && tabs.some((t) => t.includes('East Freeport')),
    tabs.join(' | ')
  );
  const westPolys = await page.$$eval('.zone-map-wrap polyline', (els) => els.length);
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((b) => b.textContent.includes('East Freeport')).click();
  });
  await new Promise((r) => setTimeout(r, 200));
  const eastPolys = await page.$$eval('.zone-map-wrap polyline', (els) => els.length);
  check('variant switch swaps geometry', westPolys !== eastPolys, `${westPolys} → ${eastPolys}`);
  await page.screenshot({ path: join(SHOTS, 'm3-freeport-east.png') });

  // Dungeon map: Lower Guk
  await page.goto(`${BASE}/#/atlas/lower-guk`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.zone-map-wrap polyline', { timeout: 10000 });
  const gukPolys = await page.$$eval('.zone-map-wrap polyline', (els) => els.length);
  check('Lower Guk dungeon geometry renders', gukPolys > 200, `${gukPolys} polylines`);
  await page.screenshot({ path: join(SHOTS, 'm4-lowerguk.png') });

  // Attribution present
  const attribution = await page.evaluate(() => document.body.innerText);
  check('Brewall attribution shown', attribution.includes('Brewall'));
} catch (err) {
  check('script completed', false, String(err));
} finally {
  await browser.close();
}

console.log(failures === 0 ? '\nALL MAP CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
