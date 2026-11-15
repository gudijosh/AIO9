# Videos

La sección "AIO9 en video." aparece justo antes del formulario. Cada idioma
muestra sus propios videos: `/es` los de español y `/en` los de inglés. Si un
idioma no tiene videos, la sección no aparece en esa página.

## Añadir videos

1. Pon los originales en una carpeta, nombrados `<id>-es.<ext>` y
   `<id>-en.<ext>`, por ejemplo `presentacion-es.mp4` y `presentacion-en.mov`.
   El `<id>` es el mismo para las dos versiones de un video. Si hay
   subtítulos, van al lado con el mismo nombre y extensión `.srt` o `.vtt`.
2. Ejecuta:

   ```bash
   node scripts/prepare-videos.mjs ruta/a/la/carpeta
   ```

   Necesita `ffmpeg` y `ffprobe`. Para cada video escribe en
   `public/videos/<idioma>/`:
   - `<id>.mp4`: H.264, 720 px de ancho, audio AAC 128 kb/s, preparado para
     empezar antes de terminar de descargar;
   - `<id>.webp`: un fotograma como portada;
   - `<id>.vtt`: los subtítulos, si había.

   Al final imprime las entradas para `src/data/videos.ts`.
3. Pega las entradas en `src/data/videos.ts`, en el orden en que deben
   aparecer, y cambia cada `title` por un título real y corto: es el nombre
   del botón que lo reproduce y el texto bajo la tarjeta.

Si la portada sale a mitad de una animación, saca otra en el segundo que
prefieras (aquí, el 22):

```bash
ffmpeg -y -ss 22 -i original.mp4 -frames:v 1 -vf "scale=720:-2" -quality 82 public/videos/es/<id>.webp
```

## Videos actuales

| Idioma | id | Título | Duración | Peso |
|---|---|---|---|---|
| es | `ya-respondio` | Ya respondió | 39 s | 1,9 MB |
| es | `modulos` | ¿Qué es AIO9? | 39 s | 1,9 MB |
| en | `ya-respondio` | Already answered | 39 s | 1,9 MB |
| en | `modulos` | What is AIO9? | 38 s | 1,9 MB |

Los originales (1080×1920, 10–14 MB) se comprimieron a 720×1280 sin pérdida
visible. Las portadas de `ya-respondio` son el fotograma de los 22 s
("Atienden. Agendan. Responden." / "Answer. Book. Reply."); las de `modulos`,
el del primer segundo.

## Cómo se comportan

- Fila de tarjetas verticales (9:16) que se desliza con el dedo, con la
  rueda o arrastrando con el ratón. En móvil se ve una tarjeta y el borde de
  la siguiente.
- Con hasta tres videos, en escritorio el título va a la izquierda y los
  videos a su lado. Con más, la fila ocupa todo el ancho debajo del título.
- Las flechas (escritorio) solo aparecen cuando la fila no cabe en pantalla.
- Cada tarjeta muestra su portada. Al tocarla se reproduce con sonido y
  controles; si había otro sonando, se detiene. Los videos no se descargan
  hasta que se tocan.
- Con "reducir movimiento" no hay entrada animada; los videos funcionan igual.

## Peso

Un reel de 30–60 s queda en unos 2–5 MB. Los videos se sirven desde el propio
sitio en Vercel. Si el total pasa de unos 100 MB, conviene alojarlos fuera del
repositorio (YouTube no listado o Vercel Blob) y cambiar `src` por esa URL.
