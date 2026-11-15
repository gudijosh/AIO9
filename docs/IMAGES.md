# Imágenes de cada industria

Cada industria se ambienta con **un bodegón fotográfico de objetos propios del
sector** (no una fotografía de un lugar), con los azules de la marca como
acento en piezas concretas: `public/images/industries/`. Son imágenes generadas
con IA para este proyecto (ElevenLabs Image, modelo `gpt-image-2.5-sunburst`,
desde la cuenta del propietario del repositorio). Revisa los términos de tu
plan de ElevenLabs para confirmar el uso comercial.

- Generadas a 1280×720 y ampliadas a 2560×1440 (Topaz Upscale, también en
  ElevenLabs) para que se vean nítidas en pantallas de alta densidad. En el
  repo: WebP calidad 82.
- `next/image` sirve AVIF/WebP redimensionado y un placeholder borroso.
- Dónde aparecen ahora: dentro de las ventanas de Bienes raíces y Comercio. Las demás siguen en el repositorio sin uso.

## Dirección

Fotografía de producto realista, objetos reales agrupados al centro, fondo de
estudio crema y **solo azul Signal y azul marino como colores de acento**.
Todas comparten este prompt base:

> Photorealistic studio product photograph, real objects, shot on a full-frame
> camera with an 85mm lens, sharp detail, true-to-life materials: [objetos].
> Objects arranged together in the center of the frame with generous empty
> space around, soft natural contact shadows. Accent colors limited to royal
> blue and deep navy, everything else natural and neutral. Seamless warm
> off-white cream studio backdrop, soft diffused daylight-style studio
> lighting, premium editorial still life. No text, no logos, no people.

| Archivo | Objetos (acento azul) |
|---|---|
| `healthcare.webp` | Estetoscopio azul (dos olivas, tubo en Y, una campana), tablilla con hoja de citas, calendario, suculenta en maceta azul marino |
| `hospitality.webp` | Menú de cuero azul marino, plato de pasta, servilleta azul |
| `real-estate.webp` | Maqueta de casa con puerta azul, llaves con llavero azul marino |
| `retail.webp` | Bolsa kraft con suéter azul, tenis blancos, lector de tarjetas |
| `services.webp` | Portafolio azul marino, documentos, pluma azul, lentes, calculadora, café |
| `logistics.webp` | Caja con cinta azul, paquete azul marino, lector de códigos |

La foto de salud se regeneró una vez: en la primera versión el estetoscopio
no tenía olivas y el tubo formaba un aro cerrado. Conviene revisar que los
objetos generados sean correctos, no solo bonitos.

(Series anteriores descartadas: arquitectura sofisticada, negocios cotidianos
fotografiados, ilustraciones monocromas en azul y renders 3D a color.)

## Sustituir una imagen

Reemplaza el archivo conservando el nombre (16:9, idealmente 2560×1440), con
los objetos centrados, fondo de estudio crema y sin texto. Los paneles de la
demo flotan en las esquinas, así que lo importante debe quedar al centro.

## Objetos del hero

`public/images/hero/`: `board.webp`, `phone.webp`, `ribbon.webp`,
`bubble.webp`. Renders 3D generados con Seedream 5.5 en ElevenLabs (98
créditos cada uno), sin texto ni interfaces. Tres llegaron con fondo blanco y
se recortaron con un script (relleno desde los bordes más los huecos blancos
grandes), después se ajustaron a 1100 px de ancho en WebP con transparencia.
Son decorativos: van con `alt=""` dentro de un bloque `aria-hidden`.

`esp32.webp` (una placa ESP32 sola, en la tarjeta de AIO9 Devices) y
`raspberry.webp` (una Raspberry Pi con módulo de relés, en la sección de
Devices) son fotografías generadas con Seedream 5.5, 98 créditos cada una.
La tarjeta de AIO9 Web no usa fotos: muestra `SiteWindow`, una miniatura de
este mismo sitio dentro de una ventana de navegador.
