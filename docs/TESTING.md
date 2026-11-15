# Pruebas realizadas

Ejecutadas sobre el build de producción (`npm run build` + `npm run start`).
Inicia un servidor nuevo antes de cada corrida: el límite de envíos de la API
vive en la memoria del servidor y una segunda corrida lo encontraría agotado.

| Comprobación | Resultado |
|---|---|
| `npm run lint` | Sin errores |
| `npx tsc --noEmit` | Sin errores |
| `npm run build` | Correcto (`/es`, `/en` y `/faq` se generan por visita por la CSP con nonce) |
| Pruebas funcionales (`tests/functional.js`) | 156 de 156 |
| Bot (`node tests/bot.test.mjs`) | ES 91,7 % y EN 93,7 % de aciertos; 100 % de "no sé" fuera de tema |
| Violaciones de CSP | Ninguna (todas las páginas, videos, formulario y bot) |
| Errores de consola en 5 tamaños, ES y EN | Ninguno |
| Scroll horizontal accidental | Ninguno (375, 820, 1280, 1440, 1920 px; inicio y preguntas) |

## Qué cubren las pruebas funcionales

- `/` redirige a `/es`; `lang`, título y descripción por idioma; `hreflang`;
  un solo `h1`; la cortina de carga desaparece.
- Menú: abre a pantalla completa, recibe el foco, Escape lo cierra y devuelve
  el foco; cada uno de sus cinco enlaces lleva a su sección.
- Diseño: ninguna sección queda fija; la página mide menos de 16 pantallas;
  cada pareja aparece lado a lado, en escritorio y en móvil.
- Tamaños: todos los nombres LED tienen el mismo tamaño y caben en su columna;
  todos los títulos tienen el mismo tamaño; todas las ventanas miden lo mismo
  y cada pareja queda alineada (1440, 820 y 375 px; español e inglés).
- Entradas: una columna por debajo de la pantalla espera oculta y se muestra
  al llegar a ella.
- Ventanas: recorren todos sus pasos solas y vuelven a empezar; no hay texto
  de pasos, controles, numeración ni etiquetas "Ejemplo de…"; las diez llevan
  "Simulación ilustrativa".
- La sección "Además" ya no existe; el proceso muestra tres pasos sin texto.
- Videos: la frase central ya no existe. Si hay videos, la fila está justo
  antes del formulario, no descarga ningún video al cargar, `/es` muestra solo
  los de español y `/en` solo los de inglés (con títulos en inglés), tocar
  una tarjeta reproduce su video y tocar otra detiene el anterior. En
  escritorio, con los dos videos actuales la fila cabe entera y se comprueba
  que no haya flechas; si la fila desborda (más videos), se comprueba que las
  flechas la desplacen. En móvil se ve una tarjeta y el borde de la siguiente,
  y al deslizar la siguiente queda entera en pantalla. Si un idioma no tiene
  videos, la sección no aparece.
- "Quiero esto" preselecciona el sector en el formulario (industria y Devices).
- Servicios en orden: Automate, Web, Systems, Devices.
- Formulario: 5 errores con envío vacío, foco en el primer campo inválido,
  correo inválido, y respuesta 503 con mensaje claro cuando no hay entrega
  configurada (nunca un éxito simulado). API: 422 (campos e industria
  desconocida), 400 (honeypot), 400 (cuerpo).
- Idiomas: la página en inglés no contiene textos en español y viceversa,
  incluidos los rótulos de las ventanas.
- Movimiento reducido: sin cortina de carga, ninguna entrada pendiente, la
  ventana muestra su estado final y no se mueve.
- Móvil: sin desborde, menú, sectores de dos en dos, cada columna muestra
  media ventana, la ventana se anima al entrar en pantalla, objetivos táctiles
  de al menos 24 px.
- Sin desborde horizontal en ningún punto del scroll a 375, 820, 1280, 1440 y
  1920 px, en ambos idiomas; sin errores de consola.
- 404 para idiomas desconocidos; imagen Open Graph, sitemap y robots.
- Seguridad: CSP con nonce distinto en cada petición y `strict-dynamic`, cada
  `<script>` del HTML con ese nonce, ninguna violación en toda la suite; HSTS,
  `nosniff`, `X-Frame-Options: DENY`, COOP, políticas de referencia y permisos,
  sin `X-Powered-By`. API: 403 desde otro sitio o sin `Origin`, 415 si no es
  JSON, 413 por encima de 16 KB, 422 con caracteres ocultos, 429 al repetir
  envíos; respuestas `no-store` con CSP que no carga nada.
- Datos estructurados: `Organization` con los cuatro servicios, `WebSite` y
  `WebPage` en el inicio; en `/faq`, el `FAQPage` tiene exactamente las
  preguntas visibles. `/llms.txt`, `/llms-full.txt`, `robots.txt` con los
  rastreadores de IA y sitemap con `/faq` y `x-default`.
- Página de preguntas: enlazada solo desde el pie; título; respuestas en el
  HTML; canónica y versiones de idioma; abre y cierra con teclado; enlaces de
  vuelta a las secciones; el cambio de idioma conserva la página; sin textos
  del otro idioma; 404 para idiomas desconocidos.
- Bot: el botón está en el inicio y en `/faq`; su código se descarga solo al
  abrirlo; dice que da respuestas predefinidas; el foco va al campo; responde
  precio y "no diagnostica"; ante lo desconocido y los intentos de
  manipulación responde "no tengo esa respuesta" con el botón al formulario;
  el HTML que escribe el visitante queda como texto; campo de 200 caracteres
  como máximo; ninguna petición de red al conversar; "Ir al formulario" cierra
  el panel, va a `#contact` y preselecciona la industria; Escape cierra y
  devuelve el foco; en inglés responde en inglés; en móvil es una hoja a todo
  el ancho, sin desborde.

## Bot (`tests/bot.test.mjs`)

- **Estructura de los dos catálogos:** cada uno de los 58 temas existe una sola
  vez; los botones apuntan a temas e industrias válidos; las respuestas no
  tienen HTML ni pasan de 60 palabras.
- **Seguridad del motor:** ninguna respuesta repite lo que escribió el
  visitante, 5.000 caracteres se procesan en milisegundos y la misma entrada
  da siempre la misma respuesta.
- **Precisión:** se mide con 174 preguntas por idioma escritas por un agente
  que nunca vio el catálogo, más 44 preguntas fuera de tema e intentos de
  manipulación por idioma.
  - Resultado: ES 91,7 % y EN 93,7 % de aciertos; 100 % de las preguntas fuera
    de tema terminan en "no tengo esa respuesta".
  - Una respuesta de "¿te refieres a…?" que incluye el tema correcto cuenta
    medio acierto.
  - Falla si los aciertos bajan del 90 % o las respuestas "no sé" fuera de tema
    bajan del 95 %.

Sin prueba automática (revisado en capturas): el aspecto de cada sección, el
corte diagonal, el vuelo de las piezas del hero, el brillo de los nombres LED, las cortinas
entre secciones, el giro 3D de las ventanas y la suavidad del parallax.

## Lighthouse (local, última ejecución)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Móvil (emulado, 4G lenta) | 92 | 97 | 100 | 100 |
| Escritorio | 99 | 97 | 100 | 100 |

Medido con la CSP con nonce (páginas generadas por visita) y el bot. LCP 1,2 s
en móvil emulado y 0,3 s en escritorio; bloqueo total 280 ms y 0 ms; CLS 0;
primera respuesta del servidor 210 ms (móvil emulado) y 30 ms (escritorio).
Antes, con las páginas estáticas, móvil daba 95 (con variaciones entre 86 y
95 de una ejecución a otra) y escritorio 99.

Accesibilidad no llega a 100 por un solo aviso, de contraste, en la cabecera.
La cabecera se dibuja en modo "diferencia" (blanco que se invierte según lo que
tiene detrás), y la auditoría la mide como texto blanco sobre fondo claro. En
pantalla se ve oscura sobre claro y clara sobre oscuro. Se revisó a mano; no
se corrigió para la herramienta.

## Contraste

`node tests/contrast.js` calcula el contraste de los pares texto/fondo de la
paleta y de las etiquetas de color de los diez sectores, y falla si alguno
baja de su mínimo (4.5:1 para texto, 3:1 para titulares grandes). Sus valores
deben mantenerse iguales a `globals.css`, `industries.ts` y `devices.ts`. Los
colores internos de cada ventana no están en este script; su texto secundario
se revisó aparte y da al menos 4.5:1.

## Repetir las pruebas

Los scripts usan Playwright, que no es dependencia del proyecto:

```bash
npm install --no-save playwright
```

```bash
npx playwright install chromium
```

```bash
npm run build
```

```bash
npx next start -p 3100
```

En otra terminal:

```bash
node tests/functional.js
```

```bash
mkdir -p /tmp/aio9-shots
```

```bash
node tests/screenshots.js /tmp/aio9-shots
```

```bash
node tests/contrast.js
```

## No probado

- Entrega real del formulario (Resend o webhook): requiere credenciales.
- Dispositivos físicos: todo se verificó en Chromium con emulación; conviene
  revisar Safari en iPhone y un Android de gama media antes de publicar.
- Las ventanas se repiten en bucle y no tienen botón de pausa: quien no tenga
  activado "reducir movimiento" no puede detenerlas.
- Lectores de pantalla reales (solo auditoría automática y revisión de marcado).
- Rendimiento en un teléfono real: las cifras de Lighthouse son de emulación.
