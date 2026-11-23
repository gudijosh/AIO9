# Arquitectura

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 ·
Motion (única librería de animación) · Lucide · zod.

## Estructura

```
src/
  app/
    [lang]/layout.tsx        Layout raíz por idioma, metadata bilingüe, fuentes
    [lang]/page.tsx          Composición de la página, en orden de lectura
    [lang]/faq/page.tsx      Preguntas y respuestas (enlazada solo desde el pie)
    [lang]/privacy/page.tsx  Aviso de privacidad (texto en src/data/privacy.ts)
    [lang]/not-found.tsx     404 propia, en el idioma de la ruta o del navegador
    [lang]/[...rest]         Cualquier ruta inexistente bajo /es o /en → 404
    apple-icon.tsx, icons/   Íconos para la pantalla de inicio (src/lib/app-icon.tsx)
    manifest.ts              Archivo de app web
    [lang]/opengraph-image   Imagen Open Graph generada por idioma (también en faq/ y privacy/;
                             src/lib/share-card.tsx)
    api/contact/route.ts     Recepción del formulario (origen, tipo, tamaño, límite por IP)
    llms.txt, llms-full.txt  Resumen del sitio para agentes de IA (src/lib/llms.ts)
    robots.ts, sitemap.ts    Rastreadores (incluidos los de IA) y mapa del sitio
    globals.css              Tokens de diseño (@theme) y utilidades propias
  components/
    Providers.tsx LazyMotion y MotionConfig (respeta "reducir movimiento")
    layout/       Header (menú a pantalla completa), LanguageSwitch, Footer
    bot/          Botón flotante y panel del bot de preguntas (docs/BOT.md)
    seo/          JsonLd (datos estructurados con el nonce de la CSP)
    sections/     Contact, ContactForm
    impact/       Las escenas de la página (ver abajo)
      scroll/     Fit (escala las ventanas)
      windows/    kit.tsx · diez ventanas de rubro o sector (registradas en index.ts)
                  · SiteWindow (AIO9 Web)
  data/           industries.ts (seis rubros) · devices.ts (sectores de AIO9 Devices) · videos.ts
                  faq.ts (preguntas ES/EN) · bot/es.ts, bot/en.ts (catálogo del bot)
  fonts/          League Gothic (SIL OFL), servida desde el propio sitio
  i18n/           config + diccionarios es.ts / en.ts
  lib/            useDemoTimeline, usePrefersReducedMotion, contact-*, site-config, analytics,
                  rate-limit, structured-data, llms, bot/ (tipos, intenciones y motor)
  proxy.ts        CSP con nonce por visita (docs/SECURITY.md); idioma de la visita
                  (x-locale) y 404 para rutas sin idioma válido
```

## Idiomas

- Rutas `/es` y `/en`; `/` redirige a `/es` (`next.config.ts`).
- `src/i18n/dictionaries/es.ts` es la fuente de verdad. `en.ts` está tipado con
  su forma: si falta o sobra una clave, no compila.
- Los componentes no escriben texto visible: llega del diccionario o, para las
  preguntas, el aviso de privacidad y el bot, de `src/data/` (`faq.ts`,
  `privacy.ts`, `bot/`). Solo la marca "AIO9" y "Error 404" van escritos en el
  componente.
- Excepción: los rótulos internos de cada ventana de software viven en su
  propio archivo, en un objeto `copy = { es, en }` tipado con la forma del
  español. Son muchos y solo los usa esa ventana.

## Sistema de diseño ("Impacto")

Tokens en `src/app/globals.css` (`@theme`):

| Token | Valor | Uso |
|---|---|---|
| `ink` / `ink-800` | `#0A0A12` / `#14162A` | Fondo de las escenas oscuras |
| `bone` / `bone-300` | `#EFEAE0` / `#E3DCCF` | Fondo claro (hero, contacto, pie) y sus letras gigantes |
| `azure` | `#2F63FF` | Acento: palabras clave, palabras punteadas, botones del bot |
| `volt` | `#D4FF3A` | Acento secundario: etiquetas, progreso, hover de botones |
| `fog` | `#A9A7BA` | Texto secundario sobre `ink` |
| `dim` | `#2B2A3A` | Tipografía "apagada" y líneas sobre `ink` (solo decorativo) |
| `midnight`, `signal`, `amber*` | — | Formulario: texto, botón de envío, errores |
| `slate-600` | `#4D5C70` | Texto secundario sobre fondo claro (formulario, contacto, pie, menú) |

Tipografía: **League Gothic** (titulares, utilidad `display`: mayúsculas,
interlineado 0.88), Geist (texto) y Geist Mono (etiquetas, contadores).

Utilidades propias: `display`, `dots` (texto dibujado con puntos, mediante una
máscara CSS), `grain` (grano
fino sobre las secciones oscuras), `pill` (botón con barrido lima al pasar el cursor).

El azul sobre `bone` o `ink` da 4.0:1, así que solo se usa en titulares
grandes (≥ 3:1) y como fondo de botón con texto blanco (4.8:1); nunca en texto
de lectura.

## Mensaje y oferta

Cuatro productos; los sectores son ejemplos de aplicación. La capacitación no
es un producto: solo aparece en el tercer paso del proceso ("Conectamos y
capacitamos"). La página usa frases cortas: un nombre, un título y una línea
por bloque.

- `capabilities.items` en los diccionarios: AIO9 Automate, AIO9 Web, AIO9
  Systems y AIO9 Devices, cada uno con una línea.
- **AIO9 Devices** es la automatización con ESP32 y Raspberry Pi. Sus textos
  están en `devices` y sus sectores en `src/data/devices.ts`.
- Cada rubro y cada sector tiene `word`, el nombre corto que se dibuja en
  puntos LED. `name`, el nombre completo, se usa en el formulario, en
  `llms.txt` y en los datos estructurados.
- Los diccionarios conservan claves que el código ya no lee. Se pueden borrar
  sin efecto visible (en `es.ts` y `en.ts` a la vez):
  - `hero`: `stackLabel`, `show`, `pause`, `play`.
  - `experience`: `railLabel`, `stepOf`, `stepsLabel`, `goToStep`, `prev`,
    `next`, `play`, `pause`, `replay`.
  - Cada rubro: `service`, `from`, `to`, `alt`, `steps` y `demo` (las ventanas
    usan su propio `copy`).
  - `devices`: `word`, `label`, `tags`; cada sector: `hardware`, `from`, `to`,
    `steps`.
  - `ui`: `sectors`, `mainOffer`, `online`; `nav`: `solutions`.

## La página, de arriba abajo

Ninguna sección queda fija (solo la cabecera y el botón del bot): es una
página de scroll normal, de unas 14 pantallas en escritorio (1440 × 900) y
entre 11 y 14 en móvil, según el alto del teléfono. Las pruebas exigen menos
de 16.

| Sección | Componente | Qué hace |
|---|---|---|
| Carga | `Preloader` | Cortina de un segundo, solo CSS. No bloquea la página. |
| Hero | `Hero`, `HeroCollage` | Fondo claro; "AIO9" de fondo en puntos LED azules, tenues e inclinados en 3D, que se encienden con un parpadeo y un barrido de luz; collage de tres ventanas y cuatro objetos que entran volando al levantarse la cortina y luego flotan. |
| Rubros | `IndustryScenes` | Corte diagonal sobre el hero. Seis rubros, de dos en dos, con línea divisoria. |
| Servicios | `ServiceScenes` | Cuatro productos, de dos en dos. Cada uno con su nombre LED y un objeto: la ventana de Salud (Automate), este mismo sitio en miniatura (Web), la ventana de Operaciones (Systems) y la foto de una placa ESP32 (Devices). |
| AIO9 Devices | `DevicesScenes` | Entrada con título, una línea y la foto de una Raspberry Pi con módulo de relés; después sus cuatro sectores, de dos en dos. |
| Proceso | `Process` | Tres pasos con solo su nombre; la línea lima se llena al bajar. |
| Videos | `VideoReel` | Fila de videos verticales que se desliza a mano; cada idioma muestra los suyos (`src/data/videos.ts`, ver `docs/VIDEOS.md`). Oculta si no hay videos. |
| Contacto y pie | `Contact`, `Footer` | Corte diagonal de vuelta al fondo claro. |

### Parejas, entradas y parallax

- `Pairs` (en `DemoScene.tsx`) es la rejilla de dos columnas con línea
  divisoria, **en todos los tamaños de pantalla**.
- `DemoScene` es la columna de un sector: nombre en puntos LED (`LedWord`),
  título, una línea, su ventana y un botón "Contactar" que lleva al formulario
  con ese sector ya elegido.
- **Un solo estándar de tamaños.** Todos los nombres LED usan el mismo tamaño
  de letra (9.4vw en móvil, 9.6vw en escritorio con tope), elegido para que el
  más largo quepa en su columna; no se ajusta por palabra. El título reserva
  dos renglones y la línea dos en móvil y uno en escritorio, así las ventanas
  de cada pareja arrancan a la misma altura. Todas las ventanas miden lo
  mismo. La línea divisoria es una sombra interior, no un borde, para no
  quitar 1 px a la columna derecha. Las pruebas lo comprueban en cinco
  combinaciones de ancho e idioma: si se añade un nombre más largo que
  "Bienes raíces", fallarán.
- `LiveWindow` hace que la ventana funcione sola: reproduce sus pasos mientras
  está en pantalla, mantiene el resultado un momento y vuelve a empezar
  (`useDemoTimeline` con `loopAfter`). No hay texto de pasos ni controles. Con
  "reducir movimiento" muestra el estado final y se queda quieta.
- `Half` es el marco de la ventana. Por debajo de 1024 px muestra **solo una
  mitad** al doble de tamaño: la columna izquierda la mitad izquierda, la
  derecha la mitad derecha. En escritorio se ve completa. Con `whole` muestra
  todo en cualquier pantalla (la foto de la ESP32, que cortada se lee mal).

Efectos, todos en `Parallax.tsx` y `Reveal.tsx`:

| Pieza | Qué hace | Ligado a |
|---|---|---|
| `Reveal` | Entrada única: el texto llega desde un lado girando en 3D. Nombre LED, título y descripción entran escalonados. | Entrar en pantalla |
| `Fly` | La ventana o imagen gira en 3D desde su lado hacia el centro; si subes, vuelve. | Scroll |
| `Drift` | El bloque se mueve algo más lento o más rápido que la página. | Scroll |
| `Curtain` | Transición entre secciones: dos paneles de color que cubren la sección se deslizan de lado, uno tras otro. Cada sección elige el lado y los dos colores. | Scroll |
| Hero | El titular sube línea por línea al levantarse la cortina; al bajar, las líneas se separan en sentidos opuestos, "AIO9" gira y se hunde, y cada pieza del collage sube a su propia velocidad. El collage se inclina hacia el cursor. | Carga, scroll y cursor |

Reglas que no se deben romper:

1. **Visible por defecto.** `useMotionReady()` es falso en el servidor y con
   "reducir movimiento": hasta entonces ningún efecto aplica estilos y
   `Curtain` no se dibuja. Sin JavaScript todo se ve.
2. `Reveal` ocurre una sola vez; `Fly`, `Drift` y `Curtain` siguen al scroll
   en ambos sentidos. `Fly` y `Curtain` se suavizan con un resorte.
3. Las secciones que los usan llevan `overflow-x-clip` (o `overflow-hidden`,
   en el hero y en contacto), porque el contenido entra desde fuera de la
   pantalla.

### Ventanas de software (`windows/`)

Diez ventanas de producto, una por rubro o sector (registradas en
`windows/index.ts`), cada una con sus colores y opciones. Todas:

- Se dibujan a un tamaño fijo de 760 × 480 px y `Fit` las escala al ancho
  disponible, como una captura. Su diseño interno es idéntico en cualquier
  pantalla.
- Son funciones puras de `step`: sin estado ni efectos. `LiveWindow` (en
  `DemoScene.tsx`) avanza los pasos con `useDemoTimeline` mientras la ventana
  está en pantalla, mantiene el resultado y vuelve a empezar. No hay controles.
  En el collage del hero se quedan fijas en un paso.
- El texto secundario (`muted`) de cada ventana da al menos 4.5:1 sobre su
  fondo y sobre su barra de título.
- Usan `Step` (de `kit.tsx`) para lo que aparece: el elemento siempre ocupa
  su lugar, así que nada salta.
- Llevan la etiqueta "Simulación ilustrativa" en su barra de título. Los datos
  son de ejemplo. La de Salud se limita a agenda y recordatorios.

`SiteWindow` es aparte: la ventana de navegador con este mismo sitio en
miniatura, el objeto de AIO9 Web en `ServiceScenes`. Usa el mismo tamaño de
760 × 480 px, pero es estática (no recibe `step`), decorativa y no lleva la
etiqueta de simulación.

### Añadir un rubro o un sector

1. Añade su id a `industryIds` en `src/data/industries.ts` o a
   `deviceSectorIds` en `src/data/devices.ts`, y su entrada con color y
   duración de cada paso (`stepDurations`). Los rubros piden además `image` y
   `focus`, aunque la página ya no muestra esas fotos.
2. Añade sus textos (`name`, `word`, `title`, `description`) en `es.ts` y
   `en.ts`.
3. Crea su ventana en `windows/` y regístrala en `windows/index.ts`.
4. Los sectores van de dos en dos: conviene mantener un número par.

El formulario, `llms.txt` y los datos estructurados lo toman solos de los ids
y los diccionarios.

## Formulario

`ContactForm` valida con el mismo esquema zod que el servidor
(`src/lib/contact-schema.ts`). Los errores son códigos que la interfaz traduce.
`src/lib/contact-delivery.ts` elige el canal (Resend o webhook) según el entorno.

| Respuesta | Significado |
|---|---|
| 200 | Enviado |
| 400 | Cuerpo inválido o honeypot |
| 403 | Origen distinto al del sitio |
| 413 | Cuerpo demasiado grande |
| 415 | El cuerpo no es JSON |
| 422 | Campos inválidos |
| 429 | Demasiadas peticiones o consultas desde la misma IP |
| 502 | El canal de entrega falló |
| 503 | Ningún canal configurado |
