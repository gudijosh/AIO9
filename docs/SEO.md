# Buscadores y agentes de IA

Lo que el sitio hace para que buscadores y agentes de IA lo encuentren,
lo entiendan y lo citen bien. Nada de esto garantiza aparecer en sus
resultados: eso lo decide cada buscador o agente. Lo que sí asegura es que,
cuando visiten el sitio, encuentren información clara, completa y coherente.

## Qué hay

| Pieza | Para qué | Dónde |
|---|---|---|
| Página de preguntas `/es/faq` y `/en/faq` | Respuestas completas en el HTML (sin depender de JavaScript), enlazadas desde el pie | `src/app/[lang]/faq/page.tsx`, `src/data/faq.ts` |
| Datos estructurados (JSON-LD) | `Organization` con los cuatro servicios, `WebSite` y `WebPage` en la principal; `FAQPage` y `BreadcrumbList` en la de preguntas | `src/lib/structured-data.ts`, `src/components/seo/JsonLd.tsx` |
| `/llms.txt` | Resumen en Markdown de qué es AIO9, productos, sectores, proceso y contacto, en los dos idiomas ([llmstxt.org](https://llmstxt.org)) | `src/lib/llms.ts` |
| `/llms-full.txt` | Lo mismo más todas las preguntas y respuestas | `src/lib/llms.ts` |
| `robots.txt` | Permite explícitamente a buscadores y rastreadores de IA (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, Claude-User, ClaudeBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended…); solo `/api/` queda fuera | `src/app/robots.ts` |
| `sitemap.xml` | Las cuatro páginas, cada una con su versión en el otro idioma y `x-default` | `src/app/sitemap.ts` |
| Metadatos | Título, descripción, canónica y versiones de idioma por página; imagen social con texto alternativo por idioma | `src/app/[lang]/layout.tsx`, `faq/page.tsx`, `opengraph-image.tsx` |

Todo se genera desde los mismos diccionarios y desde `src/data/faq.ts`. Si
cambias un texto, cambian a la vez la página, los datos estructurados,
`llms.txt` y el bot. Una prueba comprueba que las preguntas del `FAQPage`
sean exactamente las que se ven.

## Compartir el enlace (con o sin dominio propio)

Al compartir un enlace, WhatsApp, LinkedIn, Slack o iMessage muestran una
tarjeta: imagen, título, descripción y, en pequeño, el dominio. Cada página
tiene su propia tarjeta con el diseño del sitio (`src/lib/share-card.tsx`):
inicio, preguntas y privacidad, en los dos idiomas. Son PNG de 1200×630 de
menos de 100 KB, y la tipografía es League Gothic en `.woff`
(`src/fonts/league-gothic-latin.woff`), porque el generador no lee `.woff2`.

Sin dominio propio:

1. En Vercel, *Settings → Domains*, agrega una dirección corta gratuita como
   `aio9.vercel.app` (si está libre) como dominio de producción.
2. Pon `NEXT_PUBLIC_SITE_URL` con esa dirección y vuelve a desplegar.
3. Comparte solo esa dirección, nunca las de vista previa
   (`aio-9-git-…vercel.app`).
4. Si una app guardó una tarjeta vieja, renuévala con el depurador de
   Facebook (Sharing Debugger) o el Post Inspector de LinkedIn.

No pongas en `NEXT_PUBLIC_SITE_URL` un dominio que no hayas comprado: las
apps y los buscadores mandarían a la gente ahí.

## Imprescindible al publicar

1. **`NEXT_PUBLIC_SITE_URL`** con el dominio definitivo, por ejemplo
   `https://aio9.com`. Las canónicas, el sitemap, `llms.txt` y los datos
   estructurados usan esa dirección. Sin ella se usa el dominio de producción
   de Vercel.
2. **Google Search Console** y **Bing Webmaster Tools**: verificar el dominio
   y enviar `https://TU-DOMINIO/sitemap.xml`. Varios asistentes de IA se apoyan
   en los índices de esos buscadores.
3. Validar los datos estructurados con la prueba de resultados enriquecidos
   de Google o con validator.schema.org.

## Añadir o cambiar una pregunta

1. Edita `src/data/faq.ts` en los dos idiomas, con el mismo `id`.
2. Solo afirma lo que la página ya muestra: nada de precios, plazos, clientes,
   cifras, garantías, ubicación ni datos de contacto inventados.
3. Si el bot debe dar esa misma respuesta, usa `faqAnswer(locale, id)` en
   `src/data/bot/es.ts` y `en.ts` (ver [BOT.md](BOT.md)).
4. Corre `node tests/functional.js`: la prueba del `FAQPage` y las de idioma
   avisan si algo no cuadra.
