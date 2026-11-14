# Arquitectura

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 ·
Motion (única librería de animación) · Lucide · zod.

## Estructura

```
src/
  app/
    [lang]/layout.tsx        Layout raíz por idioma, metadata bilingüe, fuentes
    [lang]/page.tsx          Composición de la página, en orden de lectura
    [lang]/opengraph-image   Imagen Open Graph generada por idioma
    api/contact/route.ts     Recepción del formulario
    globals.css              Tokens de diseño (@theme) y utilidades propias
  components/
    layout/       Header (menú a pantalla completa), LanguageSwitch, Footer
    sections/     Contact, ContactForm
    impact/       Las escenas de la página (ver abajo)
      scroll/     Fit (escala las ventanas)
      windows/    kit.tsx + diez ventanas de software + index.ts
  data/           industries.ts (seis rubros) · devices.ts (cuatro sectores de AIO9 Devices)
  fonts/          League Gothic (SIL OFL), servida desde el propio sitio
  i18n/           config + diccionarios es.ts / en.ts
  lib/            useDemoTimeline, usePrefersReducedMotion, contact-*, site-config, analytics
```

## Idiomas

- Rutas `/es` y `/en`; `/` redirige a `/es` (`next.config.ts`).
- `src/i18n/dictionaries/es.ts` es la fuente de verdad. `en.ts` está tipado con
  su forma: si falta o sobra una clave, no compila.
- Ningún componente contiene texto visible; todo llega desde el diccionario.

- Excepción: los rótulos internos de cada ventana de software viven en su
  propio archivo, en un objeto `copy = { es, en }` tipado con la forma del
  español. Son muchos y solo los usa esa ventana.

## Sistema de diseño ("Impacto")

Tokens en `src/app/globals.css` (`@theme`):

| Token | Valor | Uso |
|---|---|---|
| `ink` / `ink-800` | `#0A0A12` / `#14162A` | Fondo de las escenas oscuras |
| `bone` / `bone-300` | `#EFEAE0` / `#E3DCCF` | Fondo claro (hero, contacto, pie) y sus letras gigantes |
| `azure` | `#2F63FF` | Acento: palabras clave, botón de envío, palabras punteadas |
| `volt` | `#D4FF3A` | Acento secundario: etiquetas, progreso, hover de botones |
| `fog` | `#A9A7BA` | Texto secundario sobre `ink` |
| `dim` | `#2B2A3A` | Tipografía "apagada" y líneas sobre `ink` (solo decorativo) |
| `midnight`, `signal`, `slate-600`, `amber*` | — | Se conservan para el formulario |

Tipografía: **League Gothic** (titulares, utilidad `display`: mayúsculas,
interlineado 0.88), Geist (texto) y Geist Mono (etiquetas, contadores).

Utilidades propias: `display`, `dots` (texto dibujado con puntos, mediante una
máscara CSS), `grain` (grano
fino sobre las secciones oscuras), `pill` (botón con barrido lima al pasar el cursor).

El azul sobre `bone` o `ink` da 4.0:1, así que solo se usa en titulares
grandes (≥ 3:1) y como fondo de botón con texto blanco (4.8:1); nunca en texto
de lectura.

## Mensaje y oferta

Cuatro productos y tres complementos; los sectores son ejemplos de aplicación.

- `capabilities.items` en los diccionarios, en orden: AIO9 Automate (oferta
  principal), AIO9 Web, AIO9 Systems, AIO9 Devices, y después Mantenimiento y
  mejoras, Tecnología creativa, Conexión y capacitación. Los cuatro primeros
  son las pantallas de `ServiceScenes`; el resto, la lista de `Extras`.
- **AIO9 Devices** es la automatización con ESP32 y Raspberry Pi. Sus textos
  están en `devices` (diccionarios) y sus sectores en `src/data/devices.ts`:
  Granjas, Inventarios físicos, Flota y cadena de frío, Agro.
- Cada industria tiene `service` ("Ejemplo de AIO9 Automate"…) y `word`, el
  nombre corto que se dibuja con puntos al fondo de su pantalla.

## La página, de arriba abajo

Nada queda fijo: es una página de scroll normal, de unas 16 pantallas en
escritorio. El movimiento son entradas que ocurren una sola vez.

| Sección | Componente | Qué hace |
|---|---|---|
| Carga | `Preloader` | Cortina de un segundo, solo CSS. No bloquea la página. |
| Hero | `Hero`, `HeroCollage` | Fondo claro; "AIO9" de fondo con volumen (sombra escalonada + cara punteada); collage de tres ventanas y cuatro objetos que entran volando al levantarse la cortina y luego flotan. |
| Rubros | `IndustryScenes` | Corte diagonal sobre el hero. Seis rubros, de dos en dos, con línea divisoria. |
| Frase | `Statement` | Una frase que entra girando en 3D. |
| Servicios | `ServiceScenes` | Cuatro productos, de dos en dos. |
| AIO9 Devices | `DevicesScenes` | Entrada con las dos placas y sus cuatro sectores, de dos en dos. |
| Complementos | `Extras` | Lista; cada renglón reacciona al cursor. |
| Proceso | `Process` | La línea lima se llena al bajar. |
| Contacto y pie | `Contact`, `Footer` | Corte diagonal de vuelta al fondo claro. |

### Parejas y entradas

- `Pairs` (en `DemoScene.tsx`) es la rejilla de dos columnas con línea
  divisoria; una sola columna por debajo de 1024 px.
- `DemoScene` es la columna de un sector: su nombre en puntos LED en su color
  (`LedWord`: al subir por la pantalla un brillo blanco recorre los puntos, el
  resplandor crece hacia el centro y la palabra se desplaza apenas de lado;
  todo ligado al scroll con `useScroll`, quieto con "reducir movimiento"), título, texto,
  ventana y controles. La demostración arranca cuando la columna está en
  pantalla (`useInView`) y se detiene al terminar.
- `Reveal` hace la entrada: el contenido llega desde un lado girando en 3D la
  primera vez que entra en pantalla. La columna derecha espera 160 ms más que
  la izquierda, y dentro de cada columna el texto y la ventana entran desde
  lados opuestos.

Reglas de `Reveal` que no se deben romper:

1. **Visible por defecto.** Solo se oculta, ya en el navegador, lo que está
   por debajo de la pantalla al cargar. Sin JavaScript todo se ve.
2. **Una sola vez.** Al mostrarse deja de observar; no se repite al subir.
3. **Con "reducir movimiento" no hay entrada**: las clases son `motion-safe:`.
4. Las secciones que lo usan llevan `overflow-x-clip`, porque el estado
   oculto desplaza el contenido hacia un lado.

### Ventanas de software (`windows/`)

Diez productos distintos, cada uno con sus colores y opciones. Todas:

- Se dibujan a un tamaño fijo de 760 × 480 px y `Fit` las escala al ancho
  disponible, como una captura. Su diseño interno es idéntico en cualquier
  pantalla.
- Son funciones puras de `step`: sin estado ni efectos. `useDemoTimeline`
  (en `DemoScene`) avanza los pasos una sola vez y se detiene; `DemoBar` da
  reproducir, pausar, repetir y saltar a un paso.
- El texto secundario (`muted`) de cada ventana da al menos 4.5:1 sobre su
  fondo y sobre su barra de título.
- Usan `Step` (de `kit.tsx`) para lo que aparece: el elemento siempre ocupa
  su lugar, así que nada salta.
- Llevan la etiqueta "Simulación ilustrativa" en su barra de título. Los datos
  son de ejemplo. La de Salud se limita a agenda y recordatorios.

### Añadir un rubro o un sector

1. Añade su entrada en `src/data/industries.ts` o `src/data/devices.ts`
   (color y duración de cada paso).
2. Añade sus textos en `es.ts` y `en.ts`; `steps` debe tener tantas entradas
   como `stepDurations`.
3. Crea su ventana en `windows/` y regístrala en `windows/index.ts`.
4. Los sectores van de dos en dos: conviene mantener un número par.

## Formulario

`ContactForm` valida con el mismo esquema zod que el servidor
(`src/lib/contact-schema.ts`). Los errores son códigos que la interfaz traduce.
`src/lib/contact-delivery.ts` elige el canal (Resend o webhook) según el entorno.

| Respuesta | Significado |
|---|---|
| 200 | Enviado |
| 400 | Cuerpo inválido o honeypot |
| 422 | Campos inválidos |
| 502 | El canal de entrega falló |
| 503 | Ningún canal configurado |
