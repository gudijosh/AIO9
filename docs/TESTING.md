# Pruebas realizadas

Ejecutadas sobre el build de producción (`npm run build` + `npm run start`).

| Comprobación | Resultado |
|---|---|
| `npm run lint` | Sin errores |
| `npx tsc --noEmit` | Sin errores |
| `npm run build` | Correcto (`/es` y `/en` prerenderizadas) |
| Pruebas funcionales (`tests/functional.js`) | 75 de 75 |
| Errores de consola en 5 tamaños, ES y EN | Ninguno |
| Scroll horizontal accidental | Ninguno (375, 820, 1280, 1440, 1920 px) |

## Qué cubren las pruebas funcionales

- `/` redirige a `/es`; `lang`, título y descripción por idioma; `hreflang`;
  un solo `h1`; la cortina de carga desaparece.
- Menú: abre a pantalla completa, recibe el foco, Escape lo cierra y devuelve
  el foco; cada uno de sus cinco enlaces lleva a su sección.
- Sectores: la pantalla queda fija y el scroll vertical desliza las diez
  tarjetas hacia la izquierda.
- Rubros: la pantalla queda fija y cada tramo de scroll muestra el rubro que
  corresponde.
- Demostración: reproduce hasta el último paso, repetir, pausar, reanudar y
  saltar a un paso; la ventana muestra el resultado; las diez llevan la
  etiqueta "Simulación ilustrativa".
- "Quiero esto en mi negocio" preselecciona el rubro en el formulario, tanto
  para una industria como para un sector de AIO9 Devices.
- Servicios en orden: Automate, Web, Systems, Devices.
- Teclado: al enfocar un control de una pantalla oculta, la escena se desplaza
  hasta ella.
- Formulario: 5 errores con envío vacío, foco en el primer campo inválido,
  correo inválido, y respuesta 503 con mensaje claro cuando no hay entrega
  configurada (nunca un éxito simulado). API: 422 (campos e industria
  desconocida), 400 (honeypot), 400 (cuerpo).
- Idiomas: la página en inglés no contiene textos en español y viceversa,
  incluidos los rótulos de las ventanas.
- Movimiento reducido: sin cortina de carga, ninguna escena fija, todas las
  pantallas visibles, la demo muestra su estado final y los pasos se recorren a mano.
- Móvil: sin desborde, menú, rubros apilados, tarjetas de sectores deslizables
  con el dedo, la demo arranca al entrar en pantalla, la ventana cabe en su
  columna, objetivos táctiles de al menos 24 px.
- Sin desborde horizontal en ningún punto del scroll a 375, 820, 1280, 1440 y
  1920 px, en ambos idiomas; sin errores de consola.
- 404 para idiomas desconocidos; imagen Open Graph, sitemap y robots.

Sin prueba automática (revisado en capturas): el aspecto de cada pantalla, el
corte diagonal, la frase que se ilumina y la suavidad de las transiciones.

## Lighthouse (local, última ejecución)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Móvil (emulado, 4G lenta) | 93 | 97 | 100 | 100 |
| Escritorio | 99 | 97 | 100 | 100 |

LCP 0.9 s en móvil emulado y 0.3 s en escritorio; bloqueo total 310 ms y 0 ms;
CLS 0 en ambos. Las cifras varían entre ejecuciones.

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
colores internos de cada ventana no están en este script.

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
- Lectores de pantalla reales (solo auditoría automática y revisión de marcado).
- Rendimiento en un teléfono real: las cifras de Lighthouse son de emulación.
