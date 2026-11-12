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

## Mensaje y oferta

La página presenta **tres servicios** y dos complementos; los sectores son
ejemplos de aplicación, no el producto.

- Los seis recuadros intercalados entre rubros (`capabilities.items` en los
  diccionarios) son, en orden: AIO9 Automate (oferta principal), AIO9 Web, AIO9
  Systems, Mantenimiento y mejoras, Tecnología creativa, y Conexión y
  capacitación. Sus iconos están en `CAPABILITY_ICONS` (`ServicesFlow.tsx`), en
  el mismo orden.
- Cada industria tiene una clave `service` ("Ejemplo de AIO9 Automate"…) que se
  muestra en su recuadro de título.
- `capabilities.title` es la frase que precede al proceso (por dónde empezamos).

## El mosaico (ServicesFlow)

Todo lo que ofrece AIO9 vive en una sola cinta de recuadros: seis industrias
(bodegón fotográfico con su demo + recuadro de vidrio con el problema + recuadro de
pasos), seis capacidades intercaladas en columnas de dos, y el proceso en tres
pasos.

- **Pantallas ≥ 1024 px**: la sección se fija (sticky) y el scroll vertical
  mueve la cinta de derecha a izquierda, 1 px de scroll = 1 px de recorrido. La
  altura de la sección se calcula a partir del ancho real de la cinta
  (`ResizeObserver`), así que añadir o quitar recuadros no requiere tocar
  números. El fondo se desplaza más lento. No se secuestra el scroll.
- **Pantallas menores**: nada se fija. Los recuadros se apilan y se recorren
  con scroll vertical.
- **Armado al hacer scroll** (`src/components/flow/parallax.tsx`): cada rubro
  llega deslizándose con su fotografía y sus ventanas de software, y sus
  recuadros (título, pasos) entran dispersos desde lados distintos, girados en
  3D y transparentes, hasta encajar en la cuadrícula cuando el rubro llega al
  centro. Las capacidades y el proceso hacen lo mismo. Cada pieza calcula su
  progreso `p` por el viewport (−1 entra, 0 centrado) sobre el eje en que se
  mueve la página: horizontal en escritorio, vertical en móvil (donde entran
  desde los costados). `from` define de dónde viene cada recuadro y `progress`
  lo ata a su rubro. Está ligado al scroll, sin temporizadores: al volver
  atrás se reproduce al revés. `Drift` mueve levemente las capas del hero y
  `Arrive` hace crecer la tarjeta de contacto.
- `FlowNav`: píldora de vidrio flotante para saltar a cualquier industria o
  avanzar y retroceder. Desplaza la página a la posición de esa industria.
- El enlace "Cómo funciona" apunta a un ancla invisible colocada a la altura
  de scroll que centra el recuadro del proceso.
- `useDemoTimeline`: motor de pasos determinista. Cada demo se reproduce una
  vez cuando su recuadro está en pantalla; con `prefers-reduced-motion`
  muestra el estado final y los pasos se recorren a mano. El armado también
  se desactiva (`p` queda en 0 y todo está en su sitio).
- Las demos son visuales (`aria-hidden`); los lectores de pantalla reciben la
  lista ordenada de pasos.
- La página termina en `Contact`: una pantalla completa solo con el formulario.

### Seis productos, seis identidades

Cada rubro es un producto de software distinto, con colores propios fuera de
la paleta AIO9 (definidos en `src/data/themes.ts`) y una estructura distinta:

| Rubro | Producto | Color | Forma |
|---|---|---|---|
| Salud | Agenda clínica | Verde azulado | Clara, menú lateral, agenda por horas |
| Restaurantes | Reservas | Terracota sobre café oscuro | App oscura con plano del salón y turnos |
| Bienes raíces | CRM inmobiliario | Verde bosque y dorado | Marco verde oscuro, tablero por etapas |
| Retail | Tienda | Frambuesa | Pestañas superiores, tabla de inventario, pedido tipo recibo |
| Servicios | Documentos | Índigo | Riel de iconos, visor y extracción con confianza |
| Logística | Operaciones | Ámbar sobre carbón | Consola oscura, indicadores y tabla monoespaciada |

`IndustryChapter` expone el tema como variables CSS (`themeVars`) en su
`<article>`; las piezas de `demos/primitives/AppWindow.tsx` (`AppWindow`,
`SideNav`, `IconRail`, `Tabs`, `Avatar`, `SearchField`, `Toast`) y `Bubble` /
`Chip` las leen, así que ningún componente lleva colores fijos. Los recuadros
que acompañan a cada rubro (título con la insignia del producto, pasos y el par
de capacidades que le sigue) y la píldora activa de la navegación usan el mismo
tema. Cada par texto/fondo de los seis temas se verificó a 4.5:1 o más.

Para cambiar los colores de un producto basta editar su entrada en
`src/data/themes.ts`.

### El software en el hero

`hero/HeroApp.tsx` muestra, junto a las fotografías, una ventana compacta del
producto del rubro activo (agenda clínica, reservas, documentos), con su tema.
Las ventanas se relevan con el mismo barrido de `clip-path` que las fotos. Los
rubros del hero se eligen en `heroIndustryIds` (`src/data/industries.ts`); uno
sin vista compacta propia cae a una línea "de → a".

### Añadir una industria

1. Imagen en `public/images/industries/` y entrada en `src/data/industries.ts`
   (`stepDurations` define cuántos pasos tiene).
2. Textos en `es.ts` y `en.ts` (`steps` con la misma cantidad de entradas).
3. Componente en `src/components/demos/` usando `primitives/` y un `case` en
   `DemoRenderer.tsx`.
4. Su tema en `src/data/themes.ts` y su icono en `src/data/industries.ts`.

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
