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
    industries/   IndustryExperience, IndustryRail, StepTrack, DemoControls, WipeStack
    demos/        Una demostración por industria + primitives/
    sections/     Process, Capabilities, Contact, ContactForm
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
| `midnight` | `#0B1421` | Fondo principal |
| `navy` | `#182D46` | Superficies secundarias |
| `signal` | `#2558DC` | Acento: acciones y estados confirmados |
| `signal-300` | `#86A8FF` | Azul para texto y trazos sobre oscuro (contraste) |
| `slate` / `slate-600` | `#8997A8` / `#4D5C70` | Texto secundario sobre oscuro / claro |
| `cloud` | `#F5F7FA` | Sección clara |
| `amber` | `#E8A33D` | Solo excepciones y errores |

Tipografía: Geist (texto y titulares) y Geist Mono (horas, contadores, IDs).
Movimiento: `--ease-signal` y `src/lib/motion.ts` (micro 0.28 s, escena 0.8 s).

### AIO9 Signal

Motivo de marca: **punto → línea → cuadrado** (Input → Intelligence → Action).
Aparece en el wordmark (el cuadrado), el panel del hero, el indicador de pasos
de cada demo (`StepTrack`), los conectores entre paneles (`Connector`), la línea
de "Cómo funciona" y el pie.

## Industry Experience

- **Pantallas ≥ 1024 px**: la sección se fija (sticky) y el scroll recorre las
  seis industrias (70 vh cada una). El riel, las flechas y el teclado
  (← → Inicio Fin) desplazan la página a la posición de esa industria, así el
  scroll es la única fuente de verdad. No se secuestra el scroll.
- **Pantallas menores**: sin sticky. Carrusel por toque en las píldoras,
  flechas o deslizamiento horizontal sobre la fotografía.
- `WipeStack`: las fotos permanecen montadas; la activa entra con un barrido
  direccional de `clip-path` y un ligero zoom.
- `useDemoTimeline`: motor de pasos determinista. Reproduce una vez y se
  detiene; se pausa fuera de pantalla; con `prefers-reduced-motion` muestra el
  estado final y los pasos se recorren a mano.
- Las demos son visuales (`aria-hidden`); los lectores de pantalla reciben la
  lista ordenada de pasos.

### Añadir una industria

1. Imagen en `public/images/industries/` y entrada en `src/data/industries.ts`
   (`stepDurations` define cuántos pasos tiene).
2. Textos en `es.ts` y `en.ts` (`steps` con la misma cantidad de entradas).
3. Componente en `src/components/demos/` usando `primitives/` y un `case` en
   `DemoRenderer.tsx`.
4. El riel usa seis columnas: ajustar `lg:grid-cols-6` en `IndustryRail.tsx` y
   la altura `420vh` (70 vh × industrias) en `IndustryExperience.tsx`.

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
