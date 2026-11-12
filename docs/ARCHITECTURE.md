# Arquitectura

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 ·
Motion (única librería de animación) · Lucide · zod.

## Estructura

```
src/
  app/
    [lang]/layout.tsx        Layout raíz por idioma, metadata bilingüe, fuentes
    [lang]/page.tsx          Composición de la landing
    [lang]/opengraph-image   Imagen Open Graph generada por idioma
    api/contact/route.ts     Recepción del formulario
    globals.css              Tokens de diseño (@theme) y estilos base
    icon.svg · robots.ts · sitemap.ts
  components/
    brand/        Wordmark, Signal (motivo de marca)
    layout/       Header (menú móvil), LanguageSwitch, Footer
    hero/         Hero, HeroStack (tres fotografías en capas)
    flow/         ServicesFlow (mosaico horizontal), IndustryChapter, Tile, FlowNav
    industries/   StepTrack, DemoControls, WipeStack (hero)
    demos/        Una demostración por industria + primitives/
    sections/     Contact, ContactForm
  data/industries.ts         Modelo tipado de las industrias
  i18n/                      config + diccionarios es.ts / en.ts
  lib/                       motion, useDemoTimeline, contact-*, site-config, analytics
```

## Idiomas

- Rutas `/es` y `/en`; `/` redirige a `/es` (`next.config.ts`).
- `src/i18n/dictionaries/es.ts` es la fuente de verdad. `en.ts` está tipado con
  su forma: si falta o sobra una clave, no compila.
- Ningún componente contiene texto visible; todo llega desde el diccionario.

## Sistema de diseño

Tokens en `src/app/globals.css` (`@theme`), disponibles como utilidades Tailwind:

| Token | Valor | Uso |
|---|---|---|
| `cream` | `#F6F3EC` | Fondo de página (predominante) |
| `midnight` | `#0B1421` | Texto, botones y paneles de las demos |
| `navy` | `#182D46` | Hover de superficies oscuras, color de fondo difuso |
| `signal` | `#2558DC` | Acento: acciones, progreso y estados confirmados |
| `signal-300` | `#86A8FF` | Azul sobre superficies oscuras (dentro de las demos) |
| `slate` / `slate-600` | `#8997A8` / `#4D5C70` | Texto secundario sobre oscuro / claro |
| `amber` / `amber-700` | `#E8A33D` / `#96560A` | Solo excepciones y errores |

**Vidrio**: la utilidad `glass` (borde blanco, fondo blanco al 52 %,
`backdrop-filter: blur + saturate`, brillo interior) define los recuadros
semitransparentes. Detrás de ellos hay manchas de color difuminadas para que
el vidrio tenga algo que refractar.

Tipografía: Geist (texto y titulares) y Geist Mono (horas, contadores, IDs).
Movimiento: `--ease-signal` y `src/lib/motion.ts` (micro 0.28 s, escena 0.8 s).

### AIO9 Signal

Motivo de marca: **punto → línea → cuadrado** (Input → Intelligence → Action).
Aparece en el wordmark (el cuadrado), el panel del hero, el indicador de pasos
de cada demo (`StepTrack`), los conectores entre paneles (`Connector`), la línea
del proceso y la tarjeta de contacto.

## El mosaico (ServicesFlow)

Todo lo que ofrece AIO9 vive en una sola cinta de recuadros: seis industrias
(bodegón fotográfico con su demo + recuadro de vidrio con el problema + recuadro de
pasos), seis capacidades intercaladas en columnas de dos, y el proceso en tres
pasos.

- **Pantallas ≥ 1024 px**: la sección se fija (sticky) y el scroll vertical
  mueve la cinta de derecha a izquierda, 1 px de scroll = 1 px de recorrido. La
  altura de la sección se calcula a partir del ancho real de la cinta
  (`ResizeObserver`), así que añadir o quitar recuadros no requiere tocar
  números. El fondo se desplaza más lento (parallax), la cinta se inclina
  levemente según la velocidad del scroll. No se secuestra el scroll.
- **Pantallas menores**: nada se fija. Los recuadros se apilan y se recorren
  con scroll vertical.
- **Parallax** (`src/components/flow/parallax.tsx`): cada recuadro calcula su
  progreso `p` por el viewport (−1 entra, 0 centrado, +1 sale) sobre el eje en
  que se mueve la página, horizontal en escritorio y vertical en móvil. De `p`
  salen su deriva (`drift`), su separación vertical (`lift`), la inclinación 3D
  (`tilt`) y la escala, de modo que cada recuadro se desliza a su
  propio ritmo. `Layer` mueve capas internas en sentido contrario (la
  fotografía dentro de su marco, los paneles de la demo). `Drift` mueve las
  capas del hero a distintas velocidades y `Arrive` hace crecer la tarjeta de
  contacto al llegar. Todo está ligado al scroll (solo `transform` y `opacity`),
  sin temporizadores.
- `FlowNav`: píldora de vidrio flotante para saltar a cualquier industria o
  avanzar y retroceder. Desplaza la página a la posición de esa industria.
- El enlace "Cómo funciona" apunta a un ancla invisible colocada a la altura
  de scroll que centra el recuadro del proceso.
- `useDemoTimeline`: motor de pasos determinista. Cada demo se reproduce una
  vez cuando su recuadro está en pantalla; con `prefers-reduced-motion`
  muestra el estado final y los pasos se recorren a mano. Todo el parallax
  se desactiva también (`p` queda en 0).
- Las demos son visuales (`aria-hidden`); los lectores de pantalla reciben la
  lista ordenada de pasos.
- La página termina en `Contact`: una pantalla completa solo con el formulario.

### Añadir una industria

1. Imagen en `public/images/industries/` y entrada en `src/data/industries.ts`
   (`stepDurations` define cuántos pasos tiene).
2. Textos en `es.ts` y `en.ts` (`steps` con la misma cantidad de entradas).
3. Componente en `src/components/demos/` usando `primitives/` y un `case` en
   `DemoRenderer.tsx`.

La cinta y la navegación se ajustan solas.

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
