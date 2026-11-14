// Captures the page one screen at a time. Usage (with the build running on :3100):
//   node tests/screenshots.js <output dir> [width] [height] [lang]
const { chromium } = require('playwright');
const [out, w = '1440', h = '900', lang = 'es'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const errors = [];
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  p.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  await p.goto(`http://localhost:3100/${lang}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < total - +h + 1; y += +h) {
    await p.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/${String(i++).padStart(3, '0')}.png` });
  }
  console.log(`${i} screens, ${(total / +h).toFixed(1)} screens tall, overflow ${await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)}px, ${errors.length} console errors`);
  await b.close();
})();
