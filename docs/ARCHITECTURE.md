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
      scroll/     SteppedScene, Fit, useIsDesktop / usePinned
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
máscara CSS), `grain` (grano fino sobre las escenas), `pill` (botón con barrido
lima al pasar el cursor).

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

| Sección | Componente | Comportamiento en escritorio |
|---|---|---|
| Carga | `Preloader` | Cortina de un segundo, solo CSS. No bloquea la página. |
| Hero | `Hero` | Fondo claro; la ventana y la foto suben más rápido que el texto. |
| Sectores | `SectorsRail` | Corte diagonal sobre el hero. Pantalla fija: el scroll vertical desliza las diez tarjetas en horizontal. |
| Rubros | `IndustryScenes` | Pantalla fija, una por rubro, con su ventana animada. |
| Frase | `Statement` | Pantalla fija: puntos gigantes → se ilumina palabra por palabra → caen dos fotos. |
| Servicios | `ServiceScenes` | Pantalla fija, una por producto. |
| AIO9 Devices | `DevicesScenes` | Pantalla fija: entrada con las dos placas y una pantalla por sector. |
| Complementos | `Extras` | Lista; cada renglón reacciona al cursor. |
| Proceso | `Process` | La línea lima se llena al bajar. |
| Contacto y pie | `Contact`, `Footer` | Corte diagonal de vuelta al fondo claro. |

### Escenas fijas (`SteppedScene`)

La sección mide (pantallas + 1) × 100 svh y su contenido es `sticky`. El
progreso del scroll decide qué pantalla está activa; el cambio entre pantallas
es una transición CSS, no una animación por fotograma. No hay WebGL ni
librerías de scroll: es `position: sticky`, `useScroll` de Motion,
`clip-path` para los cortes y transformaciones CSS para el 3D.

Tres reglas que no se deben romper:

1. **La fijación es CSS, no JavaScript.** Las clases usan `lg:motion-safe:`,
   así que el diseño es correcto antes de hidratar. `usePinned()` solo activa
   el comportamiento (qué pantalla está viva).
2. **Todo el contenido está siempre en el HTML**, en orden de lectura. Las
   pantallas no activas se ocultan con opacidad, no se desmontan. Si el foco
   del teclado entra en una pantalla oculta, la escena se desplaza hasta ella.
3. **Por debajo de 1024 px, y con "reducir movimiento", nada se fija**: las
   pantallas quedan apiladas, las tarjetas de sectores se deslizan con el dedo
   y cada demostración arranca cuando entra en pantalla.

### Ventanas de software (`windows/`)

Diez productos distintos, cada uno con sus colores y opciones. Todas:

- Se dibujan a un tamaño fijo de 760 × 480 px y `Fit` las escala al ancho
  disponible, como una captura. Su diseño interno es idéntico en cualquier
  pantalla.
- Son funciones puras de `step`: sin estado ni efectos. `useDemoTimeline`
  (en `DemoScene`) avanza los pasos una sola vez y se detiene; `DemoBar` da
  reproducir, pausar, repetir y saltar a un paso.
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
4. Si es de Devices, añade su id a la lista de opciones del formulario (ya se
   toma de `deviceSectorIds`) y su icono en `SectorsRail.tsx`.

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
