# Seguridad

Qué protege el sitio, dónde está cada protección y qué hay que configurar en
Vercel. Las pruebas de todo esto están en `tests/functional.js`; ver
[TESTING.md](TESTING.md).

## Resumen

| Riesgo | Protección | Dónde |
|---|---|---|
| Código inyectado en la página (XSS) | CSP con nonce por visita y `strict-dynamic`: solo se ejecutan los scripts del propio sitio que llevan el nonce de esa visita. Sin `eval`. | `src/proxy.ts` |
| Que otro sitio muestre la página dentro de un marco (clickjacking) | `frame-ancestors 'none'` y `X-Frame-Options: DENY` | `src/proxy.ts`, `next.config.ts` |
| Conexión sin cifrar | `Strict-Transport-Security` (2 años, subdominios) y `upgrade-insecure-requests` | `next.config.ts`, `src/proxy.ts` |
| Que otro sitio envíe el formulario por el visitante (CSRF) | La API exige `Origin` del propio dominio y `Content-Type: application/json` | `src/app/api/contact/route.ts` |
| Inundar el correo con envíos | Límite por IP: 30 peticiones/min y 5 consultas válidas cada 10 min. Trampa para bots (`website`). | `src/app/api/contact/route.ts`, `src/lib/rate-limit.ts` |
| Cuerpos enormes | 413 por encima de 16 KB | `src/app/api/contact/route.ts` |
| Caracteres ocultos (saltos de línea en el asunto, texto invertido) | Se rechazan en nombre, empresa y mensaje | `src/lib/contact-schema.ts` |
| Menciones o enlaces disfrazados en Slack/Discord | Se escapan `& < >` y `allowed_mentions` vacío | `src/lib/contact-delivery.ts` |
| Llamadas salientes colgadas | Timeout de 8 s | `src/lib/contact-delivery.ts` |
| Secretos en registros | Los errores se registran sin la URL del webhook ni datos del visitante | `src/app/api/contact/route.ts` |
| Rutas inventadas | Cualquier ruta inexistente da 404 con la página propia del sitio (con nonce); la imagen social de un idioma inventado, 404 sin renderizar | `src/proxy.ts`, `src/app/[lang]/[...rest]`, `opengraph-image.tsx` |
| Seguimiento de visitantes | Sin cookies. La analítica (Vercel Web Analytics) está apagada hasta activarla y no usa cookies ni datos personales | `src/app/[lang]/layout.tsx` |
| Pistas para atacantes | Sin `X-Powered-By` | `next.config.ts` |
| Prompt injection en el bot | El bot no es una IA: compara con un catálogo fijo y responde textos fijos, en el navegador, sin red | `src/lib/bot/`, [BOT.md](BOT.md) |

Además: el formulario nunca simula un envío exitoso (503 si no hay canal
configurado, 502 si falla). No hay scripts ni fuentes de terceros, iframes
ni cookies, y los secretos solo existen en el servidor (`server-only`).

## Content-Security-Policy

`src/proxy.ts` genera un nonce nuevo en cada visita y envía:

```
default-src 'self';
script-src 'self' 'nonce-…' 'strict-dynamic';
style-src 'self' 'unsafe-inline';            ← respaldo para navegadores antiguos
style-src-elem 'self' 'nonce-…';
style-src-attr 'unsafe-inline';              ← atributos style="" de Motion
img-src 'self' data: blob:; media-src 'self'; font-src 'self'; connect-src 'self';
worker-src 'self'; manifest-src 'self';
object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';
frame-ancestors 'none'; upgrade-insecure-requests
```

- **Consecuencia:** como el nonce cambia en cada visita, `/es`, `/en` y `/faq` se
  generan en el servidor por petición (ya no son HTML estático). `robots.txt`,
  `sitemap.xml`, `llms.txt` y la imagen social siguen siendo estáticos.
- **Zod** intenta usar `new Function()` para acelerarse; con la CSP eso queda
  prohibido, así que se desactiva con `z.config({ jitless: true })`
  (`src/lib/contact-schema.ts`).
- **Barra de Vercel en las vistas previas:** sus scripts no llevan el nonce y
  quedan bloqueados. El sitio no la necesita.
- **Si añades un script de terceros** (analítica, chat externo), la CSP lo
  bloqueará. Hay que cargarlo con el nonce (`(await headers()).get("x-nonce")`)
  o desde un chunk propio; ver la guía de Next en
  `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.

## Lo que tienes que configurar en Vercel

1. **Límite definitivo de envíos (Firewall).** El límite del código vive en la
   memoria de cada instancia, así que no frena un ataque desde muchas IPs.
   - En el panel del proyecto, sección *Firewall*, crea una regla personalizada
     (los nombres exactos del menú pueden cambiar).
   - Condición: la ruta es `/api/contact` y el método es `POST`.
   - Acción: limitar la frecuencia (*rate limit*), por ejemplo 10 peticiones
     por minuto por IP, y bloquear lo que pase de ahí.
   - Guarda y publica la regla.
2. **Proteger las vistas previas.** *Settings → Deployment Protection →
   Vercel Authentication* activado para *Preview*. Así nadie usa una vista
   previa para enviar el formulario.
3. **Variables de entorno solo donde hacen falta.** `RESEND_API_KEY`,
   `CONTACT_*` y `CONTACT_WEBHOOK_URL` solo en *Production*.
4. **HSTS preload (opcional).** Cuando el dominio propio y todos sus
   subdominios sirvan HTTPS, se puede añadir `preload` a la cabecera y
   registrarlo en hstspreload.org. No lo activamos sin tu dominio final.

## Verificar en producción

```bash
curl -sI https://TU-DOMINIO/es | grep -iE "content-security|strict-transport|x-frame|cross-origin|permissions|referrer|x-powered"
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://TU-DOMINIO/api/contact -H "Content-Type: application/json" -d '{}'
```

La segunda debe responder `403`, porque no lleva el `Origin` del sitio.

## Dependencias

`npm audit --omit=dev` daba 0 vulnerabilidades en producción al momento de
este cambio (Next 16.4.6, React 19.3). Repetirlo antes de cada despliegue
importante.
