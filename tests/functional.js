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
  // Scroll a pinned scene to one of its panels.
  const toPanel = async (p, id, index, count) => {
    await p.evaluate(({ id, index, count }) => { const n = document.getElementById(id); const span = n.offsetHeight - innerHeight; scrollTo({ top: n.getBoundingClientRect().top + scrollY + ((index + 0.5) / count) * span, behavior: 'instant' }); }, { id, index, count });
    await p.waitForTimeout(900);
  };
  const scene = (p, id) => p.locator(`article[aria-labelledby="scene-${id}"]`);
  const stepText = async (p, id) => (await scene(p, id).locator('span.tabular-nums').first().textContent()).trim();

  // ---------- Desktop
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  let p = await ctx.newPage(); watch(p);
  await p.goto(base + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
  check('root redirects to /es', p.url().endsWith('/es'), p.url());
  check('html lang is es', (await p.getAttribute('html', 'lang')) === 'es');
  check('ES headline', (await p.getAttribute('h1', 'aria-label')) === 'IA y software para que tu empresa trabaje mejor.');
  check('one h1 on the page', (await p.locator('h1').count()) === 1);
  check('preloader has left the screen', await p.evaluate(() => getComputedStyle(document.querySelector('[class*="preload-out"]')).visibility === 'hidden'));

  // Menu: opens full screen, Escape closes, each link lands on its section
  await p.getByRole('button', { name: 'Abrir menú' }).click(); await p.waitForTimeout(700);
  check('menu opens', await p.locator('#site-menu').isVisible());
  check('focus moves into the menu', await p.evaluate(() => document.getElementById('site-menu').contains(document.activeElement)));
  await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  check('menu closes with Escape and returns focus', !(await p.locator('#site-menu').isVisible()) && await p.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'site-menu'));
  for (const [label, id] of [['Sectores', 'sectors'], ['Servicios', 'services'], ['AIO9 Devices', 'devices'], ['Cómo funciona', 'process'], ['Contacto', 'contact']]) {
    await p.getByRole('button', { name: 'Abrir menú' }).click(); await p.waitForTimeout(600);
    await p.locator('#site-menu nav a', { hasText: label }).first().click(); await p.waitForTimeout(3800);
    const top = await topOf(p, id);
    check(`menu link "${label}" scrolls to #${id}`, Math.abs(top) < 260 && !(await p.locator('#site-menu').isVisible()), `top=${Math.round(top)}`);
  }

  // Sectors rail: pinned, and vertical scroll moves the row sideways
  const railX = () => p.evaluate(() => document.querySelector('#sectors ul li').getBoundingClientRect().left);
  await p.evaluate(() => { const n = document.getElementById('sectors'); scrollTo({ top: n.getBoundingClientRect().top + scrollY + 300, behavior: 'instant' }); }); await p.waitForTimeout(600);
  const r0 = await railX();
  await p.evaluate(() => scrollBy({ top: 700, behavior: 'instant' })); await p.waitForTimeout(600);
  const r1 = await railX();
  check('sectors: scrolling down slides the cards to the left', r0 - r1 > 200, `moved ${Math.round(r0 - r1)}px`);
  check('sectors: the screen stays pinned meanwhile', Math.abs(await p.evaluate(() => document.querySelector('#sectors > div').getBoundingClientRect().top)) < 1);
  check('sectors: ten cards (six industries, four device sectors)', (await p.locator('#sectors ul li').count()) === 10);

  // Industries: one panel per screen, pinned
  const ids = ['healthcare', 'hospitality', 'realEstate', 'retail', 'services', 'logistics'];
  for (const i of [0, 3, 5, 1]) {
    await toPanel(p, 'industries', i, 6);
    const active = await p.evaluate(() => [...document.querySelectorAll('#industries [data-active]')].map(n => n.dataset.active).indexOf('true'));
    check(`industries: scrolling to screen ${i + 1} shows ${ids[i]}`, active === i, `active=${active}`);
  }
  check('industries: the screen stays pinned', Math.abs(await p.evaluate(() => document.querySelector('#industries > div').getBoundingClientRect().top)) < 1);

  // Demo: plays to the end, replay, pause, resume, jump to a step
  await toPanel(p, 'industries', 0, 6); await p.waitForTimeout(8500);
  check('demo plays to the last step', (await stepText(p, 'healthcare')) === 'Paso 6 de 6', await stepText(p, 'healthcare'));
  check('window shows the confirmed appointment at the end', (await scene(p, 'healthcare').innerText()).includes('Cita confirmada'));
  await scene(p, 'healthcare').getByRole('button', { name: /^Repetir/ }).click(); await p.waitForTimeout(400);
  check('replay restarts at step 1', (await stepText(p, 'healthcare')) === 'Paso 1 de 6', await stepText(p, 'healthcare'));
  await scene(p, 'healthcare').getByRole('button', { name: /^Pausar/ }).click();
  const frozen = await stepText(p, 'healthcare'); await p.waitForTimeout(2600);
  check('pause holds the step', (await stepText(p, 'healthcare')) === frozen, frozen);
  await scene(p, 'healthcare').getByRole('button', { name: /^Reproducir/ }).click(); await p.waitForTimeout(2600);
  check('play resumes', (await stepText(p, 'healthcare')) !== frozen, await stepText(p, 'healthcare'));
  await scene(p, 'healthcare').getByRole('button', { name: /Ir al paso 2/ }).click(); await p.waitForTimeout(300);
  check('step segment jumps to step 2', (await stepText(p, 'healthcare')) === 'Paso 2 de 6');
  check('every window is labelled as a simulation', (await p.locator('main').innerText()).split('Simulación ilustrativa').length - 1 >= 10);

  // "I want this" preselects the sector in the form (an industry and a device sector)
  await toPanel(p, 'industries', 2, 6);
  await scene(p, 'realEstate').getByRole('link', { name: 'Quiero esto en mi negocio' }).click(); await p.waitForTimeout(3500);
  check('industry link preselects it in the form', (await p.inputValue('#industry')) === 'realEstate', await p.inputValue('#industry'));
  await toPanel(p, 'devices', 4, 5); await p.waitForTimeout(7500);
  check('devices: agro demo plays to its last step', (await stepText(p, 'agro')) === 'Paso 5 de 5', await stepText(p, 'agro'));
  await scene(p, 'agro').getByRole('link', { name: 'Quiero esto en mi negocio' }).click(); await p.waitForTimeout(3500);
  check('device sector link preselects it in the form', (await p.inputValue('#industry')) === 'agro', await p.inputValue('#industry'));

  // Services: four products, in order
  const serviceNames = await p.locator('#services h3').allTextContents();
  check('services: Automate, Web, Systems, Devices in that order', serviceNames.join('|') === 'AIO9 Automate|AIO9 Web|AIO9 Systems|AIO9 Devices', serviceNames.join('|'));

  // Keyboard: focusing a control in a hidden panel scrolls to that panel
  await toPanel(p, 'industries', 0, 6);
  await scene(p, 'retail').getByRole('link', { name: 'Quiero esto en mi negocio' }).focus(); await p.waitForTimeout(1500);
  check('keyboard focus inside a hidden panel brings that panel on screen', await p.evaluate(() => [...document.querySelectorAll('#industries [data-active]')].map(n => n.dataset.active).indexOf('true')) === 3);

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
  check('EN headline', (await p.getAttribute('h1', 'aria-label')) === 'AI and software that help your business work better.');
  const body = (await p.locator('body').innerText());
  const leaks = ['Sectores', 'Cómo funciona', 'Hablemos', 'clínica', 'Paso ', 'Enviar', 'Empresa', 'Simulación', 'Identificar', 'Mantenimiento', 'Repetir', 'Reproducir', 'Pausar', 'Paciente', 'Asistente', 'mañana', 'Todos los derechos', 'Granjas', 'Galpón', 'Válvulas', 'En línea', 'Órdenes', 'Además', 'Cargando'].filter(w => body.includes(w));
  check('EN page has no Spanish strings', leaks.length === 0, leaks.join(', '));
  check('EN <title> and description', (await p.title()).includes('AI and software that help your business work better') && (await p.getAttribute('meta[name=description]', 'content')).startsWith('AIO9 implements'));
  check('hreflang alternates present', (await p.locator('link[rel=alternate][hreflang]').count()) >= 3);
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  const esBody = await p.locator('body').innerText();
  const enLeaks = ['Industries', 'How it works', "Let's talk", 'Healthcare', 'Step ', 'Replay', 'Illustrative', 'Identify', 'Company', 'All rights', 'Farms', 'Online', 'Loading', 'Orders', 'Schedule'].filter(w => esBody.includes(w));
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
  check('reduced motion: scenes are not pinned', await p.evaluate(() => ['sectors', 'industries', 'services', 'devices'].every(id => getComputedStyle(document.querySelector(`#${id} > div`)).position !== 'sticky')));
  await p.evaluate(() => document.getElementById('scene-healthcare').scrollIntoView({ block: 'center' })); await p.waitForTimeout(600);
  check('reduced motion: demo shows its final state at once', (await stepText(p, 'healthcare')) === 'Paso 6 de 6', await stepText(p, 'healthcare'));
  await scene(p, 'healthcare').getByRole('button', { name: /Ir al paso 3/ }).click();
  check('reduced motion: steps navigable by hand', (await stepText(p, 'healthcare')) === 'Paso 3 de 6');
  check('reduced motion: every panel is visible', await p.evaluate(() => [...document.querySelectorAll('#industries [data-active]')].every(n => getComputedStyle(n).opacity === '1')));
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
  check('mobile: industries are stacked, not pinned', await p.evaluate(() => getComputedStyle(document.querySelector('#industries > div')).position !== 'sticky' && [...document.querySelectorAll('#industries [data-active]')].every(n => getComputedStyle(n).position !== 'absolute')));
  check('mobile: sector cards scroll sideways by touch', await p.evaluate(() => { const ul = document.querySelector('#sectors ul'); return ul.scrollWidth > ul.clientWidth + 100 && getComputedStyle(ul).overflowX === 'auto'; }));
  await p.evaluate(() => document.querySelector('article[aria-labelledby="scene-hospitality"]').scrollIntoView({ block: 'center', behavior: 'instant' })); await p.waitForTimeout(9000);
  check('mobile: demo plays when its scene is on screen', (await stepText(p, 'hospitality')) === 'Paso 5 de 5', await stepText(p, 'hospitality'));
  check('mobile: window fits its column', await p.evaluate(() => { const r = document.querySelector('article[aria-labelledby="scene-hospitality"] [style*="aspect-ratio"]').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1; }));
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
