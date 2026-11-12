const { chromium } = require('playwright');
const base = 'http://localhost:3100';
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); };
(async () => {
  const b = await chromium.launch();
  const errors = [];
  const watch = (p) => { p.on('console', m => m.type() === 'error' && errors.push(m.text())); p.on('pageerror', e => errors.push('PAGEERROR ' + e.message)); };

  // ---------- Desktop
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  let p = await ctx.newPage(); watch(p);
  let r = await p.goto(base + '/', { waitUntil: 'networkidle' });
  check('root redirects to /es', p.url().endsWith('/es'), p.url());
  check('html lang is es', (await p.getAttribute('html', 'lang')) === 'es');
  check('ES headline', (await p.textContent('h1')).includes('La inteligencia que transforma negocios.'));

  for (const [label, id] of [['Soluciones', 'industries'], ['Contacto', 'contact']]) {
    await p.locator('header nav a:visible', { hasText: label }).click();
    await p.waitForTimeout(3500);
    const top = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
    check(`nav anchor "${label}" scrolls to #${id}`, Math.abs(top) < 120, `top=${Math.round(top)}`);
  }
  await p.locator('header a:visible', { hasText: 'Hablemos de tu proyecto' }).click();
  await p.waitForTimeout(1200);
  check('header CTA goes to contact', Math.abs(await p.evaluate(() => document.getElementById('contact').getBoundingClientRect().top)) < 120);

  // Mosaic flow: floating nav, right-to-left travel, demos
  const names = ['Salud', 'Hospitalidad y restaurantes', 'Bienes raíces', 'Retail y ecommerce', 'Servicios profesionales', 'Operaciones y logística'];
  const ids = ['healthcare', 'hospitality', 'realEstate', 'retail', 'services', 'logistics'];
  const items = p.locator('nav ol button');
  const centred = (id) => p.evaluate((id) => { const r = document.getElementById('industry-' + id).closest('article').getBoundingClientRect(); return Math.abs((r.left + r.right) / 2 - innerWidth / 2); }, id);
  const flow = await p.evaluate(() => { const w = document.querySelector('#industries > div'); return { top: w.getBoundingClientRect().top + scrollY, h: w.offsetHeight }; });
  await p.evaluate(({ top }) => scrollTo({ top, behavior: 'instant' }), flow); await p.waitForTimeout(500);
  const x0 = await p.evaluate(() => document.getElementById('industry-healthcare').closest('article').getBoundingClientRect().left);
  await p.evaluate(({ top }) => scrollTo({ top: top + 600, behavior: 'instant' }), flow); await p.waitForTimeout(500);
  const x1 = await p.evaluate(() => document.getElementById('industry-healthcare').closest('article').getBoundingClientRect().left);
  check('scrolling down moves the mosaic right-to-left, 1:1', Math.abs((x0 - x1) - 600) < 4, `moved ${Math.round(x0 - x1)}px for 600px of scroll`);
  check('section stays pinned while the mosaic travels', await p.evaluate(() => Math.abs(document.querySelector('#industries .lg\\:sticky').getBoundingClientRect().top) < 1));
  for (const i of [3, 0, 5, 1, 2, 4]) {
    await items.nth(i).click(); await p.waitForTimeout(2000);
    const off = await centred(ids[i]);
    check(`nav item ${i + 1} "${names[i]}" brings its chapter to the centre`, off < 40 && (await items.nth(i).getAttribute('aria-current')) === 'true', `offset ${Math.round(off)}px`);
  }
  await p.getByRole('button', { name: 'Industria siguiente' }).click(); await p.waitForTimeout(2000);
  check('next button → industry 06', (await items.nth(5).getAttribute('aria-current')) === 'true');
  check('next disabled at the end', await p.getByRole('button', { name: 'Industria siguiente' }).isDisabled());
  await p.getByRole('button', { name: 'Industria anterior' }).click(); await p.waitForTimeout(2000);
  check('previous button → industry 05', (await items.nth(4).getAttribute('aria-current')) === 'true');
  await items.nth(4).focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Enter'); await p.waitForTimeout(2000);
  check('keyboard (Tab + Enter) → industry 04', (await items.nth(3).getAttribute('aria-current')) === 'true');
  await items.nth(0).click(); await p.waitForTimeout(1500);

  // Demo: plays, pause, replay, step jump (healthcare chapter)
  const chapter = p.locator('article', { has: p.locator('#industry-healthcare') });
  const stepText = () => chapter.locator('p.font-mono.tabular-nums').textContent();
  await p.waitForTimeout(8500);
  check('demo plays to the last step', (await stepText()).trim() === 'Paso 6 de 6', await stepText());
  await chapter.getByRole('button', { name: /^Repetir/ }).click(); await p.waitForTimeout(400);
  check('replay restarts at step 1', (await stepText()).trim() === 'Paso 1 de 6', await stepText());
  await chapter.getByRole('button', { name: /^Pausar/ }).click();
  const frozen = await stepText(); await p.waitForTimeout(2600);
  check('pause holds the step', (await stepText()) === frozen, frozen);
  await chapter.getByRole('button', { name: /^Reproducir/ }).click(); await p.waitForTimeout(2600);
  check('play resumes', (await stepText()) !== frozen, await stepText());
  await chapter.getByRole('button', { name: /Ir al paso 2/ }).click(); await p.waitForTimeout(300);
  check('step segment jumps to step 2', (await stepText()).trim() === 'Paso 2 de 6');
  // "How it works" anchor lands on the process tile
  await p.locator('header nav a:visible', { hasText: 'Cómo funciona' }).click(); await p.waitForTimeout(2200);
  const pr = await p.evaluate(() => { const r = document.getElementById('process-heading').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; });
  check('"Cómo funciona" brings the process tile on screen', pr);
  await items.nth(2).click(); await p.waitForTimeout(1800);

  // "Talk about my sector" preselects industry
  await p.locator('article', { has: p.locator('#industry-realEstate') }).getByRole('link', { name: 'Quiero esto en mi negocio' }).click(); await p.waitForTimeout(1500);
  check('sector link preselects industry in the form', (await p.inputValue('#industry')) === 'realEstate', await p.inputValue('#industry'));

  check('page ends on the contact form (nothing after it but the legal line)', await p.evaluate(() => { const c = document.getElementById('contact'); return !c.nextElementSibling && c.parentElement.id === 'main' && c.offsetHeight >= innerHeight; }));

  // Form
  await p.reload({ waitUntil: 'networkidle' }); await p.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' }));
  await p.getByRole('button', { name: 'Enviar mensaje' }).click(); await p.waitForTimeout(300);
  check('empty submit shows 5 field errors', (await p.locator('[id$="-error"]').count()) === 5, String(await p.locator('[id$="-error"]').count()));
  check('focus moves to first invalid field', await p.evaluate(() => document.activeElement?.id === 'name'));
  await p.fill('#name', 'Ana Pérez'); await p.fill('#company', 'Empresa Demo'); await p.fill('#email', 'no-es-correo');
  await p.selectOption('#industry', 'retail'); await p.fill('#message', 'Queremos automatizar la atención de pedidos en línea.');
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
  check('API: honeypot filled → 400', (await api({ name: 'Ana Pérez', company: 'Demo', email: 'a@b.co', industry: 'retail', message: 'x'.repeat(30), website: 'spam' })) === 400);
  check('API: malformed body → 400', (await p.request.post(base + '/api/contact', { data: 'nope', headers: { 'content-type': 'application/json' }, failOnStatusCode: false })).status() === 400);

  // Language
  await p.locator('header a[hreflang=en]').click(); await p.waitForURL('**/en**'); await p.waitForTimeout(800);
  check('EN: url and html lang', p.url().includes('/en') && (await p.getAttribute('html', 'lang')) === 'en');
  check('EN headline', (await p.textContent('h1')).includes('Intelligence that moves business forward.'));
  const body = (await p.locator('body').innerText());
  const leaks = ['Soluciones', 'Cómo funciona', 'Hablemos', 'clínica', 'Paso ', 'Enviar', 'Empresa', 'Simulación', 'Entender', 'Agentes', 'Repetir', 'Reproducir', 'Pausar', 'Paciente', 'Asistente', 'mañana', 'Todos los derechos'].filter(w => body.includes(w));
  check('EN page has no Spanish strings', leaks.length === 0, leaks.join(', '));
  check('EN <title> and description', (await p.title()).includes('Intelligence that moves business forward') && (await p.getAttribute('meta[name=description]', 'content')).startsWith('AIO9 builds'));
  check('hreflang alternates present', (await p.locator('link[rel=alternate][hreflang]').count()) >= 3);
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  const esBody = await p.locator('body').innerText();
  const enLeaks = ['Solutions', 'How it works', "Let's talk", 'Healthcare', 'Step ', 'Replay', 'Illustrative', 'Understand', 'Company', 'All rights'].filter(w => esBody.includes(w));
  check('ES page has no English strings', enLeaks.length === 0, enLeaks.join(', '));
  check('unknown locale → 404', (await p.request.get(base + '/fr', { failOnStatusCode: false })).status() === 404);
  check('og image renders', (await p.request.get(base + (await p.getAttribute('meta[property="og:image"]', 'content')).replace(/^https?:\/\/[^/]+/, ''))).status() === 200);
  check('sitemap + robots', (await p.request.get(base + '/sitemap.xml')).status() === 200 && (await p.request.get(base + '/robots.txt')).status() === 200);
  await ctx.close();

  // ---------- Reduced motion
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  p = await ctx.newPage(); watch(p);
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.getElementById('industries').scrollIntoView()); await p.waitForTimeout(500);
  check('reduced motion: demo shows final state at once', (await p.locator('#industries p.font-mono.tabular-nums').first().textContent()).trim() === 'Paso 6 de 6');
  check('reduced motion: hero has no rotation control', (await p.getByRole('button', { name: 'Pausar la rotación' }).count()) === 0);
  await p.getByRole('button', { name: /Ir al paso 3/ }).first().click();
  check('reduced motion: steps navigable manually', (await p.locator('#industries p.font-mono.tabular-nums').first().textContent()).trim() === 'Paso 3 de 6');
  await ctx.close();

  // ---------- Mobile
  ctx = await b.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });
  p = await ctx.newPage(); watch(p);
  await p.goto(base + '/es', { waitUntil: 'networkidle' });
  check('mobile: no horizontal overflow', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await p.getByRole('button', { name: 'Abrir menú' }).click();
  check('mobile menu opens', await p.locator('#mobile-menu').isVisible());
  await p.keyboard.press('Escape');
  check('mobile menu closes with Escape', !(await p.locator('#mobile-menu').isVisible()));
  await p.getByRole('button', { name: 'Abrir menú' }).click();
  await p.locator('#mobile-menu a', { hasText: 'Cómo funciona' }).click(); await p.waitForTimeout(4000);
  check('mobile menu link scrolls and closes', !(await p.locator('#mobile-menu').isVisible()) && await p.evaluate(() => { const r = document.getElementById('process-heading').getBoundingClientRect(); return r.top > 0 && r.top < innerHeight; }));
  check('mobile: mosaic is stacked, not pinned', await p.evaluate(() => { const w = document.querySelector('#industries > div'); return !w.style.height && getComputedStyle(w.querySelector('div')).position !== 'sticky'; }));
  await p.locator('#industry-hospitality').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  await p.evaluate(() => scrollBy({ top: 420, behavior: 'instant' })); await p.waitForTimeout(9000);
  check('mobile: demo plays when its tile is on screen', (await p.locator('article', { has: p.locator('#industry-hospitality') }).locator('p.font-mono.tabular-nums').textContent()).trim() === 'Paso 5 de 5');
  check('mobile: still no horizontal overflow', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const small = await p.evaluate(() => [...document.querySelectorAll('main button, main a, header button, header a')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 24 || r.width < 24); }).map(e => (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30)));
  check('mobile: touch targets ≥ 24px', small.length === 0, small.join(' | '));
  await ctx.close();

  check('no console errors or page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
  await b.close();
})();
