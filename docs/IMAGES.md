# Ilustraciones

Cada industria se ambienta con **un objeto ilustrado en 3D**, no con una
fotografía: `public/images/industries/`. Son imágenes generadas con IA para
este proyecto (ElevenLabs Image, modelo `gpt-image-2.5-sunburst`, desde la
cuenta del propietario del repositorio). Revisa los términos de tu plan de
ElevenLabs para confirmar el uso comercial.

- Original: PNG 1280×720. En el repo: WebP calidad 88 (15–40 KB).
- `next/image` sirve AVIF/WebP redimensionado y un placeholder borroso.
- El hero reutiliza tres de ellas (salud, hospitalidad, servicios).
- El fondo de las ilustraciones es el token `paper` (`#FEFBF4`).

## Dirección

Un solo objeto por escena, material mate tipo arcilla, flotando con sombra
suave, en la paleta de la marca. Todas comparten este prompt base:

> Minimal stylized 3D illustration, not photorealistic: a single [objeto],
> floating slightly above the ground with a soft shadow, centered in the frame
> with generous empty space around it. Soft matte clay-like material, smooth
> rounded edges, friendly and simple. Color palette limited to deep navy blue,
> royal blue, soft grey-blue and warm cream. Seamless plain warm off-white
> cream studio background, soft diffused studio lighting. No text, no logos,
> no people.

| Archivo | Objeto |
|---|---|
| `healthcare.webp` | Estetoscopio y calendario con un día marcado |
| `hospitality.webp` | Menú de restaurante con tenedor y cuchara |
| `real-estate.webp` | Casa pequeña con una llave |
| `retail.webp` | Bolsa de compras con una prenda |
| `services.webp` | Carpeta con documentos y un bolígrafo |
| `logistics.webp` | Caja de envío |

(Antes se probaron dos series fotográficas, una de arquitectura sofisticada y
otra de negocios cotidianos; ambas se descartaron a favor de las ilustraciones.)

## Sustituir una imagen

Reemplaza el archivo conservando el nombre (16:9, idealmente 2560×1440), con
el objeto centrado, fondo `#FEFBF4` y sin texto. Los paneles de la demo flotan
en las esquinas, así que el centro debe quedar libre para el objeto.
