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
- Dónde aparecen: la de salud en el hero; las seis como tarjetas en Sectores;
  dos sobre la frase central; dos en AIO9 Web; y dentro de las ventanas de
  Bienes raíces y Comercio.
- Los cuatro sectores de AIO9 Devices no tienen fotografía: su tarjeta usa un
  icono sobre fondo oscuro.

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
