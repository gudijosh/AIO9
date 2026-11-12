# AIO9 — Intelligence in Motion

Landing bilingüe (ES / EN) de AIO9: implementamos IA y software para que las
empresas atiendan mejor, reduzcan tareas manuales y conecten sus operaciones.

La oferta son tres servicios: **AIO9 Automate** (principal: asistentes de IA,
automatizaciones e integración de herramientas), **AIO9 Web** y **AIO9
Systems**, más mantenimiento y tecnología creativa como complementos. Los seis
sectores de la página son ejemplos de aplicación: cada uno reproduce una
simulación de cómo se vería la solución. Todo se presenta como un mosaico de
recuadros que fluye de derecha a izquierda al hacer scroll, y la página termina
solo con el formulario de contacto.

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
4. **Analítica**: no hay ninguna instalada. El punto de conexión es
   `src/lib/analytics.ts` (`track()` ya se llama en los eventos clave).
5. **Protección anti-spam**: hay honeypot y validación en servidor, pero no
   límite de peticiones. Añadirlo (p. ej. en el proveedor de hosting) antes de
   recibir tráfico real.
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
