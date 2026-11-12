# Pruebas realizadas

Ejecutadas sobre el build de producción (`npm run build` + `npm run start`).

| Comprobación | Resultado |
|---|---|
| `npm run lint` | Sin errores |
| `npx tsc --noEmit` | Sin errores |
| `npm run build` | Correcto (`/es` y `/en` prerenderizadas) |
| Pruebas funcionales (`tests/functional.js`) | 54 de 54 |
| Errores de consola en 5 tamaños, ES y EN | Ninguno |
| Scroll horizontal accidental | Ninguno (375, 820, 1280, 1440, 1920 px) |

## Qué cubren las pruebas funcionales

- `/` redirige a `/es`; `lang`, título y descripción por idioma; `hreflang`.
- Anclas del menú, botón principal y menú móvil (abrir, Escape, enlace).
- El mosaico avanza de derecha a izquierda 1:1 con el scroll y la sección
  permanece fija mientras tanto.
- Navegación flotante: cada industria se centra; anterior, siguiente, estado
  deshabilitado en los extremos y uso con teclado.
- Demostración: reproduce hasta el último paso, repetir, pausar, reanudar y
  saltar a un paso.
- "Cómo funciona" lleva al recuadro del proceso (escritorio y móvil).
- "Hablar de mi sector" preselecciona la industria en el formulario.
- La página termina en el formulario.
- Formulario: 5 errores con envío vacío, foco en el primer campo inválido,
  correo inválido, y respuesta 503 con mensaje claro cuando no hay entrega
  configurada (nunca un éxito simulado). API: 422, 400 (honeypot), 400 (cuerpo).
- Idiomas: la página en inglés no contiene textos en español y viceversa.
- Movimiento reducido: la demo muestra su estado final, los pasos se recorren
  a mano y el hero no rota. El parallax también se desactiva, pero eso no
  tiene prueba automática.
- Móvil: mosaico apilado sin fijación, la demo se reproduce al entrar en
  pantalla, objetivos táctiles de al menos 24 px.
- 404 para idiomas desconocidos; imagen Open Graph, sitemap y robots.

## Lighthouse (local, última ejecución)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Móvil (emulado, 4G lenta) | 90 | 100 | 100 | 100 |
| Escritorio | 79 | 100 | 100 | 100 |

LCP 3.3 s en móvil emulado y 0.7 s en escritorio; CLS 0 en ambos. El
rendimiento en escritorio bajó respecto a versiones anteriores (antes 89–95)
por el parallax ligado al scroll: el tiempo de bloqueo al cargar ronda los
480 ms. Las cifras varían entre ejecuciones.

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

## No probado

- Entrega real del formulario (Resend o webhook): requiere credenciales.
- Dispositivos físicos: todo se verificó en Chromium con emulación; conviene
  revisar Safari en iPhone y un Android de gama media antes de publicar.
- Lectores de pantalla reales (solo auditoría automática y revisión de marcado).
