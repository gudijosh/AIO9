# Io, el asistente del sitio

Botón flotante redondo con un robot propio (Io), abajo a la derecha, en la
página principal y en la de preguntas. Al tocarlo se abre el chat, que
responde preguntas sobre AIO9 en el idioma de la página. Si no sabe algo, lo
dice y manda al formulario de contacto.

- **Nombre:** Io, igual en los dos idiomas (sale de las letras de AIO9).
- **Ícono:** `src/components/bot/IoMark.tsx`, un robot en SVG con los colores
  del sitio. Parpadea de vez en cuando y la antena brilla; con "reducir
  movimiento" queda quieto (`.io-eye` y `.io-antenna` en `globals.css`).
- **Lo que ve el visitante:** solo el nombre en la cabecera, sin
  explicaciones técnicas. Saluda con "¡Hola! Soy Io. ¿En qué te ayudo?". Si le
  preguntan si es una persona, responde que es el asistente virtual de AIO9 y
  ofrece el formulario para hablar con el equipo. Nunca dice ser una persona
  ni una IA.

## Cómo funciona por dentro (no es una IA)

Esto es para el equipo; el sitio no lo explica. Io **no usa ningún modelo de
lenguaje**:

1. Compara lo que escribe el visitante con un catálogo fijo de temas
   (58 por idioma).
2. Responde con textos fijos escritos de antemano.

Por eso:

- **No hay prompt injection.** No hay instrucciones que alterar: "ignora tus
  instrucciones…" es solo texto que no coincide con ningún tema, y recibe la
  respuesta de "no lo sé, usa el formulario".
- **No inventa.** Solo puede decir lo que está escrito en el catálogo, y el
  catálogo solo dice lo que la página ya muestra.
- **No envía nada.** Todo ocurre en el navegador: no hay peticiones de red al
  conversar, no se guarda la conversación y no hay cookies ni almacenamiento.
- **No ejecuta nada.** El texto del visitante se muestra siempre como texto
  (React lo escapa), con un máximo de 200 caracteres. El motor no construye
  expresiones regulares con lo que escribe el visitante ni usa `eval`.
- **No pesa en la carga.** El código del panel, el motor y el catálogo se
  descargan solo al abrir el bot (o al pasar el cursor por el botón).

## Archivos

| Archivo | Qué es |
|---|---|
| `src/lib/bot/types.ts` | Contrato: intención, catálogo, acciones, respuesta |
| `src/lib/bot/intents.ts` | Los 58 temas y qué puede decir cada respuesta |
| `src/lib/bot/engine.ts` | Motor: normaliza, compara y decide (`respond`, `replyFor`) |
| `src/data/bot/es.ts`, `en.ts` | Catálogo por idioma: frases, palabras clave, respuestas y botones |
| `src/data/faq.ts` | Preguntas de la página `/faq`; el bot reutiliza esas respuestas con `faqAnswer()` |
| `src/components/bot/` | Botón flotante y panel |
| `tests/bot.test.mjs`, `tests/bot/eval.*.json` | Pruebas del motor y del catálogo |

## Cómo decide

1. Normaliza el texto: sin acentos, en minúsculas y sin signos.
2. Quita las palabras vacías, aplica sinónimos (por ejemplo, "cotización" →
   "precio") y reduce los plurales.
3. Puntúa cada tema según sus palabras clave y su parecido con las frases de
   ejemplo. Tolera un error de tipeo en las palabras largas.
4. Decide según la puntuación:
   - Si un tema gana con claridad, da su respuesta.
   - Si dos o tres temas empatan, pregunta "¿Te refieres a…?" con botones.
   - Si nada coincide, dice que no tiene esa respuesta y ofrece el formulario
     y la página de preguntas.

Los botones bajo cada respuesta pueden:
- llevar al formulario, preseleccionando la industria cuando aplica;
- ir a una sección de la página;
- abrir la página de preguntas;
- preguntar por un tema relacionado.

## Añadir o cambiar respuestas

1. Si es un tema nuevo, añádelo a `src/lib/bot/intents.ts` con una línea que
   diga qué puede responder.
2. Añade el tema en `src/data/bot/es.ts` **y** en `en.ts`:
   - unas 8 frases como las escribiría la gente;
   - palabras clave (las decisivas con peso);
   - la respuesta (máximo 60 palabras, texto plano);
   - los botones.
3. Si la respuesta ya está en la página de preguntas, usa
   `faqAnswer(locale, "<id>")` para que digan lo mismo.
4. Reglas: nada de precios, plazos, cifras, clientes, garantías, ubicación ni
   datos de contacto inventados. Nunca decir que AIO9 diagnostica o da
   recomendaciones médicas. El único canal es el formulario.
5. Corre `node tests/bot.test.mjs`. Revisa la estructura de los dos
   catálogos y mide los aciertos con tres sets de preguntas escritas por
   agentes que nunca vieron el catálogo:
   - `eval`: el primero. Sus fallas se añadieron después al catálogo, así que
     ya no es una medida ciega (99 %).
   - `dev`: el segundo, usado para ampliar el vocabulario (sinónimos, tipos de
     negocio, herramientas, muletillas). Tampoco es ciego (94–96 %).
   - `holdout`: el tercero, **ciego**, nunca usado para ajustar. Es la cifra
     honesta: **64,7 % en español y 61,2 % en inglés** con preguntas muy
     variadas. De las fallas, casi todas son "no tengo esa respuesta" con el
     botón al formulario; respuestas equivocadas, 2 de 116 (ES) y 5 de 116 (EN).
   - Fuera de tema e intentos de manipulación terminan en "no lo sé" en el
     97–100 % de los casos en los tres sets.
   - Falla si `eval` o `dev` bajan del 90 %, `holdout` del 60 %, o "no lo sé"
     fuera de tema del 95 %.
6. Si una pregunta real se responde mal, añade esa forma de preguntar a las
   frases del tema correcto, o la palabra que falta a los sinónimos. **No
   mires ni uses el `holdout` para ajustar**: cuando quede viejo, conviértelo
   en `dev` y pide un `holdout` nuevo a alguien que no vea el catálogo.
7. Lo que más mejora a Io son **preguntas reales de clientes**: Io no guarda
   conversaciones, así que la fuente son los mensajes que llegan por el
   formulario, WhatsApp o en persona.
