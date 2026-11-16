# AIO9 — Intelligence in Motion

Landing bilingüe (ES / EN) de AIO9: implementamos IA y software para que las
empresas atiendan mejor, reduzcan tareas manuales y conecten sus operaciones.

La oferta son cuatro productos: **AIO9 Automate** (principal: asistentes de IA,
automatizaciones e integración de herramientas), **AIO9 Web**, **AIO9 Systems**
y **AIO9 Devices** (automatización con ESP32 y Raspberry Pi), más
mantenimiento, tecnología creativa y capacitación como complementos. Los diez
sectores de la página son ejemplos de aplicación: cada uno tiene su propia
ventana de software que reproduce, paso a paso, cómo se vería la solución. Los
sectores y los productos se presentan de dos en dos, cada uno con su propia
entrada al aparecer, y la página termina en el formulario de contacto.

> Las demostraciones son **simulaciones locales y deterministas**, identificadas
> como ilustrativas en la interfaz: muestran posibilidades, y cada implementación
> se define y valida por proyecto. No hay modelos de IA ni datos reales detrás.

## Ejecutar

Requiere Node 20.9 o superior.

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:3000 (redirige a `/es`; inglés en `/en`).

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera los tipos de rutas y comprueba TypeScript |

## Variables de entorno

Copia `.env.example` a `.env.local`. Todas son opcionales.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública: canónicas, Open Graph, sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo visible en Contacto (si falta, no se muestra) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Enlace de WhatsApp (si falta, no se muestra) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Envío del formulario por correo (Resend) |
| `CONTACT_WEBHOOK_URL` | Alternativa: envío del formulario a un webhook |

**Formulario:** sin Resend ni webhook configurados, `POST /api/contact` responde
`503` y el formulario informa que la consulta no se envió. Nunca simula un envío.

## Integraciones pendientes

1. **Entrega del formulario**: crear cuenta en Resend (y verificar dominio) o
   definir un webhook, y cargar las variables.
2. **Datos de contacto reales**: correo y número de WhatsApp.
3. **Dominio** y `NEXT_PUBLIC_SITE_URL`.
4. **Analítica sin cookies (Vercel Web Analytics)**: ya está en el código, apagada.
   Para encenderla, activa *Web Analytics* en la pestaña *Analytics* del
   proyecto en Vercel, añade la variable `ENABLE_ANALYTICS=1` y vuelve a
   desplegar. Cuenta visitas sin cookies ni datos personales; los eventos del
   formulario (`src/lib/analytics.ts`) solo se guardan en los planes de pago de
   Vercel.
5. **Límite de envíos en Vercel**: el código ya limita por IP (honeypot,
   validación, origen, tamaño y frecuencia), pero el límite definitivo es una
   regla del Firewall de Vercel. Pasos en `docs/SECURITY.md`.
6. **Logotipo definitivo**: el wordmark es provisional (`src/components/brand/Wordmark.tsx`).
## Despliegue en Vercel

1. En Vercel: **Add New → Project** e importa `gudijosh/AIO9`. Detecta Next.js
   solo; no cambies el comando de build ni el directorio de salida.
2. Rama de producción: `main` (Settings → Environments → Production).
3. Variables de entorno (Settings → Environment Variables):

   | Variable | ¿Obligatoria? |
   |---|---|
   | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` **o** `CONTACT_WEBHOOK_URL` | Sí, para que el formulario envíe |
   | `NEXT_PUBLIC_SITE_URL` | Solo al conectar un dominio propio |
   | `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | Opcionales |

4. Despliega y envía una consulta de prueba desde el sitio publicado.

Las variables `NEXT_PUBLIC_*` se leen al compilar: después de cambiarlas hay
que volver a desplegar.

Sin `NEXT_PUBLIC_SITE_URL`, las URL canónicas, Open Graph y el sitemap usan el
dominio de producción del proyecto en Vercel.

Netlify también funciona: importa el repositorio (build `npm run build`) y
define las mismas variables. La ruta `/api/contact` necesita un runtime de
servidor; no es un export estático.

## Documentación

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): estructura, sistema de diseño y cómo ampliar.
- [`docs/IMAGES.md`](docs/IMAGES.md): origen y tratamiento de las imágenes.
- [`docs/TESTING.md`](docs/TESTING.md): pruebas realizadas y resultados.
- `docs/screenshots/`: capturas de escritorio y móvil.
- `.claude/skills/`: guías de buenas prácticas usadas durante el desarrollo.
- [`docs/VIDEOS.md`](docs/VIDEOS.md): cómo añadir y preparar los videos.
- [`docs/SECURITY.md`](docs/SECURITY.md): CSP, cabeceras, protección de la API y lo que hay que configurar en Vercel.
- [`docs/BOT.md`](docs/BOT.md): cómo funciona el bot de preguntas y cómo ampliar sus respuestas.
- [`docs/SEO.md`](docs/SEO.md): página de preguntas, datos estructurados, `llms.txt` y rastreadores de IA.
- Aviso de privacidad: `src/data/privacy.ts` (texto general con "AIO9" como responsable; conviene que lo revise un abogado antes del lanzamiento).
- Revisión automática: `.github/workflows/ci.yml` corre lint, tipos, pruebas del bot, compilación y la suite funcional en cada PR.

