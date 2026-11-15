# Pruebas realizadas

Ejecutadas sobre el build de producción (`npm run build` + `npm run start`).

| Comprobación | Resultado |
|---|---|
| `npm run lint` | Sin errores |
| `npx tsc --noEmit` | Sin errores |
| `npm run build` | Correcto (`/es` y `/en` prerenderizadas) |
| Pruebas funcionales (`tests/functional.js`) | 90 de 90 |
| Errores de consola en 5 tamaños, ES y EN | Ninguno |
| Scroll horizontal accidental | Ninguno (375, 820, 1280, 1440, 1920 px) |

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

Sin prueba automática (revisado en capturas): el aspecto de cada sección, el
corte diagonal, el vuelo de las piezas del hero, el brillo de los nombres LED, las cortinas
entre secciones, el giro 3D de las ventanas y la suavidad del parallax.

## Lighthouse (local, última ejecución)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Móvil (emulado, 4G lenta) | 95 | 97 | 100 | 100 |
| Escritorio | 99 | 97 | 100 | 100 |

LCP 0.9 s en móvil emulado y 0.3 s en escritorio; bloqueo total 240 ms y 0 ms;
CLS 0 en ambos. Las cifras varían entre ejecuciones: en móvil se midieron 86 y
92 con el mismo código.

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
