const { chromium } = require('playwright');
const out = process.argv[2];
const only = process.argv[3];
const lang = process.argv[4] || 'es';
const views = { desk: [1440, 900], laptop: [1280, 720], wide: [1920, 1080], tablet: [820, 1180], mob: [375, 667] };
(async () => {
  const b = await chromium.launch();
  for (const [name, [w, h]] of Object.entries(views)) {
    if (only && !only.split(',').includes(name)) continue;
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errors = [];
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    p.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
    await p.goto(`http://localhost:3100/${lang}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/${name}-1-hero.png` });
    const info = await p.evaluate(() => { const t = document.querySelector('#industries > div'); const r = t.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; });
    console.log(name, 'scrollWidth', info.sw, 'client', info.cw, 'flowHeight', Math.round(info.h));
    if (w >= 1024) {
      await p.evaluate(({ top }) => scrollTo({ top, behavior: 'instant' }), info); await p.waitForTimeout(1200);
      await p.screenshot({ path: `${out}/${name}-2-flow-start.png` });
      await p.evaluate(({ top }) => scrollTo({ top: top + 420, behavior: 'instant' }), info); await p.waitForTimeout(900);
      await p.screenshot({ path: `${out}/${name}-2-flow-moving.png` });
      for (const i of [0, 1, 3, 5]) {
        await p.locator('nav ol button').nth(i).click(); await p.waitForTimeout(i === 0 ? 9000 : 9500);
        await p.screenshot({ path: `${out}/${name}-3-ch${i}.png` });
      }
      for (const [f, label] of [[0.42, 'caps'], [1, 'end']]) {
        await p.evaluate(({ top, h, f }) => scrollTo({ top: top + (h - innerHeight) * f, behavior: 'instant' }), { ...info, f }); await p.waitForTimeout(1800);
        await p.screenshot({ path: `${out}/${name}-4-${label}.png` });
      }
    } else {
      await p.evaluate(() => document.querySelector('#industries').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(600);
      for (let i = 0; i < 5; i++) { await p.screenshot({ path: `${out}/${name}-3-scroll${i}.png` }); await p.evaluate(() => scrollBy({ top: innerHeight * 0.85, behavior: 'instant' })); await p.waitForTimeout(i === 1 ? 7000 : 900); }
    }
    await p.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/${name}-5-contact.png` });
    console.log(name, 'errors:', errors.length ? errors.slice(0, 3) : 'none');
    await p.close();
  }
  await b.close();
})();
