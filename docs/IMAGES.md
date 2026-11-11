# Fotografías

Las seis fotografías de `public/images/industries/` son **imágenes generadas
con IA** para este proyecto (ElevenLabs Image, modelo `gpt-image-2.5-sunburst`,
desde la cuenta del propietario del repositorio). No proceden de bancos de
imágenes ni de la página de referencia. Revisa los términos de tu plan de
ElevenLabs para confirmar el uso comercial.

- Original: PNG 1280×720. En el repo: WebP calidad 86 (70–130 KB).
- `next/image` sirve AVIF/WebP redimensionado y un placeholder borroso.
- El hero reutiliza tres de ellas (salud, hospitalidad, servicios).

## Dirección común

Todas comparten este cierre de prompt, que les da aspecto de una misma campaña:

> Cinematic lighting, deep navy-blue shadows, cool neutral palette […] Main
> subject weighted to the right two thirds, calm darker negative space on the
> left. Shot on a medium-format camera, 35mm lens, high-end magazine quality.
> Wide landscape composition. No people, no text, no signage, no logos, no screens.

| Archivo | Escena |
|---|---|
| `healthcare.webp` | Recepción de clínica privada, piedra clara, luz de mañana |
| `hospitality.webp` | Restaurante contemporáneo antes del servicio |
| `real-estate.webp` | Residencia de concreto y vidrio a la hora azul |
| `retail.webp` | Boutique minimalista con repisas iluminadas |
| `services.webp` | Sala de juntas de una firma al anochecer |
| `logistics.webp` | Pasillo de centro de distribución |

## Sustituir una imagen

Reemplaza el archivo conservando el nombre (16:9, idealmente 2560×1440) y
ajusta `focus` en `src/data/industries.ts` si cambia el encuadre. Sujeto a la
derecha y sin texto ni personas, para que los paneles flotantes sigan legibles.
