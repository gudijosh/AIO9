// Functional checks against the production build: `npm run build && npx next start -p 3100`,
// then `node tests/functional.js`.
const { chromium } = require('playwright');
const base = 'http://localhost:3100';
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
(async () => {
  const b = await chromium.launch();
  const errors = [];
  const watch = (p) => { p.on('console', m => m.type() === 'error' && errors.push(m.text())); p.on('pageerror', e => errors.push('PAGEERROR ' + e.message)); };
  const topOf = (p, id) => p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
  // Bring one sector's column to the middle of the screen.
  const show = async (p, id) => { await p.evaluate((id) => document.querySelector(`article[aria-labelledby="scene-${id}"]`).scrollIntoView({ block: 'center', behavior: 'instant' }), id); await p.waitForTimeout(900); };
  const box = (p, id) => p.evaluate((id) => { const r = document.querySelector(`article[aria-labelledby="scene-${id}"]`).getBoundingClientRect(); return { top: Math.round(r.top + scrollY), left: Math.round(r.left), width: Math.round(r.width) }; }, id);
  const scene = (p, id) => p.locator(`article[aria-labelledby="scene-${id}"]`);
  // Which step the window of a sector is showing (0-based).
  const stepOf = async (p, id) => Number(await scene(p, id).locator('[data-step]').getAttribute('data-step'));

  // ---------- Desktop
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  let p = await ctx.newPage(); watch(p);
  await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
  check('root redirects to /es', p.url().endsWith('/es'), p.url());
  check('html lang is es', (await p.getAttribute('html', 'lang')) === 'es');
  check('ES headline', (await p.getAttribute('h1', 'aria-label')) === 'Soluciones para que tu empresa trabaje mejor.');
  check('one h1 on the page', (await p.locator('h1').count()) === 1);
  check('preloader has left the screen', await p.evaluate(() => getComputedStyle(document.querySelector('[class*="preload-out"]')).visibility === 'hidden'));

  // Menu: opens full screen, Escape closes, each link lands on its section
  await p.getByRole('button', { name: 'Abrir menú' }).click(); await p.waitForTimeout(700);
  check('menu opens', await p.locator('#site-menu').isVisible());
  check('focus moves into the menu', await p.evaluate(() => document.getElementById('site-menu').contains(document.activeElement)));
  await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  check('menu closes with Escape and returns focus', !(await p.locator('#site-menu').isVisible()) && await p.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'site-menu'));
  for (const [label, id] of [['Sectores', 'industries'], ['Servicios', 'services'], ['AIO9 Devices', 'devices'], ['Cómo funciona', 'process'], ['Contacto', 'contact']]) {
    await p.getByRole('button', { name: 'Abrir menú' }).click(); await p.waitForTimeout(600);
    await p.locator('#site-menu nav a', { hasText: label }).first().click(); await p.waitForTimeout(3800);
    const top = await topOf(p, id);
    check(`menu link "${label}" scrolls to #${id}`, Math.abs(top) < 260 && !(await p.locator('#site-menu').isVisible()), `top=${Math.round(top)}`);
  }

  // Layout: nothing is pinned, sectors sit two to a row
  check('no section is pinned', await p.evaluate(() => [...document.querySelectorAll('main *')].every(n => getComputedStyle(n).position !== 'sticky')));
  check('the page is under 16 screens tall', await p.evaluate(() => document.documentElement.scrollHeight / innerHeight) < 16, (await p.evaluate(() => document.documentElement.scrollHeight / innerHeight)).toFixed(1) + ' screens');
  check('the old sectors rail is gone', (await p.locator('#sectors').count()) === 0);
  for (const [a, c] of [['healthcare', 'hospitality'], ['realEstate', 'retail'], ['services', 'logistics'], ['farms', 'inventory'], ['fleet', 'agro']]) {
    const l = await box(p, a), r = await box(p, c);
    check(`${a} and ${c} sit side by side`, l.top === r.top && r.left >= l.left + l.width - 2 && Math.abs(l.width - r.width) < 3, `tops ${l.top}/${r.top}, lefts ${l.left}/${r.left}`);
  }
  const rows = await Promise.all(['healthcare', 'realEstate', 'services'].map((id) => box(p, id)));
  check('industry pairs follow each other down the page', rows[0].top < rows[1].top && rows[1].top < rows[2].top);
  const sv = await p.evaluate(() => [...document.querySelectorAll('#services article')].map(n => { const r = n.getBoundingClientRect(); return [Math.round(r.top + scrollY), Math.round(r.left)]; }));
  check('services sit two to a row', sv.length === 4 && sv[0][0] === sv[1][0] && sv[2][0] === sv[3][0] && sv[0][0] < sv[2][0] && sv[0][1] < sv[1][1], JSON.stringify(sv));

  // One standard of sizes for every sector and product
  const sizes = (pg) => pg.evaluate(() => [...document.querySelectorAll('#industries article, #devices article, #services article')].map((a) => { const led = a.querySelector('p[aria-hidden] span'); const st = getComputedStyle(a); const ar = a.getBoundingClientRect(); const fr = a.querySelector('[style*="box-shadow"]').getBoundingClientRect(); return { name: parseFloat(getComputedStyle(led).fontSize), title: parseFloat(getComputedStyle(a.querySelector('h3')).fontSize), room: ar.right - parseFloat(st.paddingRight) - led.getBoundingClientRect().right, row: Math.round(ar.top + scrollY), win: [Math.round(fr.top + scrollY), Math.round(fr.width), Math.round(fr.height)].join('/') }; }));
  const consistent = (list) => { const rows = {}; for (const x of list) (rows[x.row] = rows[x.row] || []).push(x.win); return { names: new Set(list.map((x) => x.name)).size, titles: new Set(list.map((x) => x.title)).size, room: Math.min(...list.map((x) => x.room)), wins: new Set(list.map((x) => x.win.split('/').slice(1).join('x'))).size, rows: Object.values(rows).every((v) => v.length === 2 && v[0] === v[1]) }; };
  for (const [w, h, lang] of [[1440, 900, 'es'], [375, 667, 'es'], [820, 1180, 'es'], [1440, 900, 'en'], [375, 667, 'en']]) {
    const c2 = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const q = await c2.newPage(); watch(q);
    await q.goto(`${base}/${lang}`, { waitUntil: 'networkidle' }); await q.waitForTimeout(500);
    const k = consistent(await sizes(q));
    check(`${w}px ${lang}: every LED name is the same size and fits its column`, k.names === 1 && k.room >= 0, `sizes ${k.names}, tightest fit ${Math.round(k.room)}px`);
    check(`${w}px ${lang}: every title is the same size`, k.titles === 1);
    check(`${w}px ${lang}: every window is the same size and each pair lines up`, k.wins === 1 && k.rows, `window sizes ${k.wins}`);
    await c2.close();
  }

  // Entrances: a column below the fold is hidden until it scrolls in, then shown for good
  await p.goto('about:blank'); await p.goto(base + '/es', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const revealState = () => p.evaluate(() => document.querySelector('article[aria-labelledby="scene-logistics"] [data-reveal]').dataset.reveal);
  check('a sector below the fold waits for its entrance', (await revealState()) === 'hidden');
  await show(p, 'logistics'); await p.waitForTimeout(1300);
  check('it enters when scrolled to', (await revealState()) === 'shown' && await p.evaluate(() => getComputedStyle(document.querySelector('article[aria-labelledby="scene-logistics"] [data-reveal]')).opacity === '1'));

  // Demo: runs by itself, shows its result, then starts over. No step controls.
  await show(p, 'healthcare');
  const seen = new Set();
  for (let i = 0; i < 26; i++) { seen.add(await stepOf(p, 'healthcare')); await p.waitForTimeout(500); }
  check('window plays through every step by itself', [0, 1, 2, 3, 4, 5].every((n) => seen.has(n)), [...seen].join(','));
  let wrapped = false, prev = await stepOf(p, 'healthcare');
  for (let i = 0; i < 30 && !wrapped; i++) { await p.waitForTimeout(500); const now = await stepOf(p, 'healthcare'); if (now < prev) wrapped = true; prev = now; }
  check('window starts over after showing its result', wrapped);
  check('no step text or step controls are shown', !(await p.locator('main').innerText()).match(/Paso \d+ de \d+/) && (await p.locator('#industries, #services, #devices').getByRole('button', { name: /Pausar|Reproducir|Repetir|Ir al paso/ }).count()) === 0);
  check('no numbering or "example of" labels', !(await p.locator('main').innerText()).match(/\d\d \/ \d\d|EJEMPLO DE/i));
  check('the "Además" section is gone', (await p.locator('#extras-heading').count()) === 0 && !(await p.locator('main').innerText()).includes('MANTENIMIENTO'));
  check('process shows three bare steps', (await p.locator('#process ol li').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim().toUpperCase()).join('|') === '01 IDENTIFICAMOS|02 CONSTRUIMOS|03 CONECTAMOS Y CAPACITAMOS', (await p.locator('#process ol li').allInnerTexts()).join('|'));
  check('every window is labelled as a simulation', (await p.locator('main').innerText()).split('Simulación ilustrativa').length - 1 >= 10);

  // "I want this" preselects the sector in the form (an industry and a device sector)
  await show(p, 'realEstate');
  await scene(p, 'realEstate').getByRole('link', { name: 'Contactar' }).click(); await p.waitForTimeout(3500);
  check('industry link preselects it in the form', (await p.inputValue('#industry')) === 'realEstate', await p.inputValue('#industry'));
  await show(p, 'agro');
  await scene(p, 'agro').getByRole('link', { name: 'Contactar' }).click(); await p.waitForTimeout(3500);
  check('device sector link preselects it in the form', (await p.inputValue('#industry')) === 'agro', await p.inputValue('#industry'));

  // Services: four products, in order
  const serviceNames = await p.locator('#services h3').allTextContents();
  check('services: Automate, Web, Systems, Devices in that order', serviceNames.join('|') === 'AIO9 Automate|AIO9 Web|AIO9 Systems|AIO9 Devices', serviceNames.join('|'));

  // Video reel: each language shows its own videos; nothing downloads until played
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  check('the statement section is gone', (await p.locator('#statement-heading').count()) === 0 && !(await p.locator('main').innerText()).toUpperCase().includes('PROCESO CONCRETO Y MEDIBLE'));
  const reel = await p.locator('#videos').count();
  if (!reel) {
    check('video reel stays hidden while there are no videos', (await p.locator('#videos').count()) === 0);
  } else {
    const mediaRequests = [];
    p.on('request', (r) => { if (/\.(mp4|webm|mov)(\?|$)/.test(r.url())) mediaRequests.push(r.url()); });
    await p.reload({ waitUntil: 'networkidle' });
    await p.evaluate(() => document.getElementById('videos').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(1200);
    check('reel sits right before the contact form', await p.evaluate(() => document.getElementById('videos').closest('section').nextElementSibling?.id === 'contact'));
    check('no video downloads before one is played', mediaRequests.length === 0, mediaRequests.join(' '));
    const srcs = await p.evaluate(() => [...document.querySelectorAll('#videos-row img')].map((i) => decodeURIComponent(i.currentSrc || i.src)));
    check('/es shows only Spanish videos', srcs.length > 0 && srcs.every((x) => x.includes('/videos/es/')), srcs.slice(0, 2).join(' '));
    const left0 = await p.evaluate(() => document.getElementById('videos-row').scrollLeft);
    await p.getByRole('button', { name: 'Video siguiente' }).click(); await p.waitForTimeout(900);
    const left1 = await p.evaluate(() => document.getElementById('videos-row').scrollLeft);
    check('next arrow slides the row', left1 > left0 + 100, `${left0} -> ${left1}`);
    await p.getByRole('button', { name: 'Video anterior' }).click(); await p.waitForTimeout(900);
    check('previous arrow slides it back', (await p.evaluate(() => document.getElementById('videos-row').scrollLeft)) < 5);
    const cards = p.locator('#videos-row li button');
    await cards.nth(0).click(); await p.waitForTimeout(1500);
    const first = await p.evaluate(() => { const v = document.querySelector('#videos-row video'); return v && { src: v.currentSrc, paused: v.paused }; });
    check('tapping a card plays its video', !!first && !first.paused && first.src.includes('/videos/es/'), JSON.stringify(first));
    await p.locator('#videos-row li').nth(1).locator('button').click(); await p.waitForTimeout(1500);
    const playing = await p.evaluate(() => [...document.querySelectorAll('#videos-row video')].map((v) => ({ src: v.currentSrc, paused: v.paused })));
    check('playing another stops the first (one at a time)', playing.length === 1 && !playing[0].paused && playing[0].src !== first.src, JSON.stringify(playing));
    await p.goto(base + '/en', { waitUntil: 'networkidle' });
    const enSrcs = await p.evaluate(() => [...document.querySelectorAll('#videos-row img')].map((i) => decodeURIComponent(i.currentSrc || i.src)));
    check('/en shows only English videos', enSrcs.length > 0 && enSrcs.every((x) => x.includes('/videos/en/')), enSrcs.slice(0, 2).join(' '));
    await p.goto(base + '/es', { waitUntil: 'networkidle' });
  }

  // Form
  await p.reload({ waitUntil: 'networkidle' }); await p.evaluate(() => document.getElementById('contact-heading').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Enviar mensaje' }).click(); await p.waitForTimeout(300);
  check('empty submit shows 5 field errors', (await p.locator('[id$="-error"]').count()) === 5, String(await p.locator('[id$="-error"]').count()));
  check('focus moves to first invalid field', await p.evaluate(() => document.activeElement?.id === 'name'));
  await p.fill('#name', 'Ana Pérez'); await p.fill('#company', 'Empresa Demo'); await p.fill('#email', 'no-es-correo');
  await p.selectOption('#industry', 'farms'); await p.fill('#message', 'Queremos medir temperatura y humedad en dos galpones.');
  await p.getByRole('button', { name: 'Enviar mensaje' }).click(); await p.waitForTimeout(300);
  check('invalid email is the only error', (await p.locator('[id$="-error"]').count()) === 1 && (await p.textContent('#email-error')).includes('correo válido'));
  await p.fill('#email', 'ana@example.com');
  const [resp] = await Promise.all([p.waitForResponse(x => x.url().includes('/api/contact')), p.getByRole('button', { name: 'Enviar mensaje' }).click()]);
  await p.waitForTimeout(400);
  const formText = await p.textContent('#contact');
  check('unconfigured backend → 503 and honest message (no fake success)', resp.status() === 503 && formText.includes('no se envió') && !formText.includes('Recibimos tu mensaje'), 'status ' + resp.status());
  errors.splice(0, errors.length, ...errors.filter(e => !e.includes('503'))); // expected network error line

  // API contract
  const api = async (body) => (await p.request.post(base + '/api/contact', { data: body, failOnStatusCode: false })).status();
  check('API: invalid fields → 422', (await api({ name: 'A' })) === 422);
  check('API: unknown industry → 422', (await api({ name: 'Ana Pérez', company: 'Demo', email: 'a@b.co', industry: 'nope', message: 'x'.repeat(30) })) === 422);
  check('API: honeypot filled → 400', (await api({ name: 'Ana Pérez', company: 'Demo', email: 'a@b.co', industry: 'fleet', message: 'x'.repeat(30), website: 'spam' })) === 400);
  check('API: malformed body → 400', (await p.request.post(base + '/api/contact', { data: 'nope', headers: { 'content-type': 'application/json' }, failOnStatusCode: false })).status() === 400);

  // Language
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await p.locator('header a[hreflang=en]').click(); await p.waitForURL('**/en**'); await p.waitForTimeout(800);
  check('EN: url and html lang', p.url().includes('/en') && (await p.getAttribute('html', 'lang')) === 'en');
  check('EN headline', (await p.getAttribute('h1', 'aria-label')) === 'Solutions that help your business work better.');
  const body = (await p.locator('body').innerText());
  const leaks = ['Sectores', 'Cómo funciona', 'Contactar', 'clínica', 'Paso ', 'Enviar', 'Empresa', 'Simulación', 'Identificamos', 'Construimos', 'Paciente', 'Asistente', 'mañana', 'Todos los derechos', 'Granjas', 'Galpón', 'Válvulas', 'En línea', 'Órdenes', 'Además', 'Cargando', 'Video siguiente', 'Prueba'].filter(w => body.includes(w));
  check('EN page has no Spanish strings', leaks.length === 0, leaks.join(', '));
  check('EN <title> and description', (await p.title()).includes('AI and software that help your business work better') && (await p.getAttribute('meta[name=description]', 'content')).startsWith('AIO9 implements'));
  check('hreflang alternates present', (await p.locator('link[rel=alternate][hreflang]').count()) >= 3);
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  const esBody = await p.locator('body').innerText();
  const enLeaks = ['Industries', 'How it works', 'Contact us', 'Healthcare', 'Illustrative', 'We identify', 'Company', 'All rights', 'Farms', 'Online', 'Loading', 'Orders', 'Schedule'].filter(w => esBody.includes(w));
  check('ES page has no English strings', enLeaks.length === 0, enLeaks.join(', '));
  check('unknown locale → 404', (await p.request.get(base + '/fr', { failOnStatusCode: false })).status() === 404);
  check('og image renders', (await p.request.get(base + (await p.getAttribute('meta[property="og:image"]', 'content')).replace(/^https?:\/\/[^/]+/, ''))).status() === 200);
  check('sitemap + robots', (await p.request.get(base + '/sitemap.xml')).status() === 200 && (await p.request.get(base + '/robots.txt')).status() === 200);
  await ctx.close();

  // ---------- Reduced motion
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  p = await ctx.newPage(); watch(p);
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  check('reduced motion: no preloader', await p.evaluate(() => getComputedStyle(document.querySelector('[class*="preload-out"]')).display === 'none'));
  await p.evaluate(() => document.getElementById('scene-healthcare').scrollIntoView({ block: 'center' })); await p.waitForTimeout(600);
  check('reduced motion: window shows its final state and stays there', (await stepOf(p, 'healthcare')) === 5 && (await p.waitForTimeout(3000), (await stepOf(p, 'healthcare')) === 5));
  check('reduced motion: nothing waits for an entrance', await p.evaluate(() => [...document.querySelectorAll('[data-reveal]')].every(n => getComputedStyle(n).opacity === '1' && getComputedStyle(n).transform === 'none')));
  await ctx.close();

  // ---------- Mobile
  ctx = await b.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });
  p = await ctx.newPage(); watch(p);
  await p.goto(base + '/es', { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
  check('mobile: no horizontal overflow', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await p.getByRole('button', { name: 'Abrir menú' }).click(); await p.waitForTimeout(700);
  check('mobile menu opens', await p.locator('#site-menu').isVisible());
  await p.locator('#site-menu nav a', { hasText: 'Cómo funciona' }).click(); await p.waitForTimeout(4500);
  check('mobile menu link scrolls and closes', !(await p.locator('#site-menu').isVisible()) && await p.evaluate(() => { const r = document.getElementById('process-heading').getBoundingClientRect(); return r.top > -40 && r.top < innerHeight; }));
  const mh = await box(p, 'healthcare'), mr = await box(p, 'hospitality');
  check('mobile: sectors sit two to a row', mr.top === mh.top && mr.left > mh.left && Math.abs(mh.width - mr.width) < 3, `tops ${mh.top}/${mr.top}, lefts ${mh.left}/${mr.left}`);
  await show(p, 'hospitality');
  const halves = await p.evaluate(() => ['healthcare', 'hospitality'].map((id) => { const a = document.querySelector(`article[aria-labelledby="scene-${id}"]`); const frame = a.querySelector('[data-step]').parentElement.parentElement.getBoundingClientRect(); const win = a.querySelector('[data-step]').getBoundingClientRect(); return { frame: Math.round(frame.width), win: Math.round(win.width), winLeft: Math.round(win.left - frame.left) }; }));
  check('mobile: each column shows half of its window', halves.every((h) => Math.abs(h.win - 2 * h.frame) < 4) && halves[0].winLeft === 0 && Math.abs(halves[1].winLeft + halves[1].frame) < 4, JSON.stringify(halves));
  let moved = false; const first = await stepOf(p, 'hospitality');
  for (let i = 0; i < 12 && !moved; i++) { await p.waitForTimeout(500); moved = (await stepOf(p, 'hospitality')) !== first; }
  check('mobile: window animates when on screen', moved);
  check('mobile: still no horizontal overflow', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const small = await p.evaluate(() => [...document.querySelectorAll('main button, main a, header button, header a, footer a')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 24 || r.width < 24); }).map(e => (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30)));
  check('mobile: touch targets ≥ 24px', small.length === 0, small.join(' | '));
  await ctx.close();

  // ---------- Every size, both languages: no overflow, no errors
  for (const [w, h] of [[375, 667], [820, 1180], [1280, 720], [1440, 900], [1920, 1080]]) {
    for (const lang of ['es', 'en']) {
      ctx = await b.newContext({ viewport: { width: w, height: h } }); p = await ctx.newPage(); watch(p);
      await p.goto(`${base}/${lang}`, { waitUntil: 'networkidle' });
      const total = await p.evaluate(() => document.documentElement.scrollHeight);
      let over = 0;
      for (let y = 0; y < total; y += h * 2) { await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(120); over = Math.max(over, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
      check(`${w}px ${lang}: no horizontal overflow anywhere`, over <= 0, `overflow ${over}px`);
      await ctx.close();
    }
  }

  check('no console errors or page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
  await b.close();
})();
