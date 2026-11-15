# Bot de preguntas

Botón flotante, abajo a la derecha, en la página principal y en la de
preguntas. Abre un panel que responde preguntas sobre AIO9 en el idioma de la
página. Si no sabe algo, lo dice y manda al formulario de contacto.

## No es una IA

El bot **no usa ningún modelo de lenguaje**:

1. Compara lo que escribe el visitante con un catálogo fijo de temas
   (57 por idioma).
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

La cabecera del panel dice "Respuestas predefinidas" / "Preset answers",
para que nadie crea que habla con una IA o con una persona.

## Archivos

| Archivo | Qué es |
|---|---|
| `src/lib/bot/types.ts` | Contrato: intención, catálogo, acciones, respuesta |
| `src/lib/bot/intents.ts` | Los 57 temas y qué puede decir cada respuesta |
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
   catálogos y mide los aciertos con preguntas de evaluación escritas aparte,
   sin mirar el catálogo. Falla si los aciertos bajan del 90 % o si una
   pregunta fuera de tema no termina en "no lo sé".
6. Si una pregunta real se responde mal, añade esa forma de preguntar a las
   frases del tema correcto. No edites las preguntas de evaluación para que
   pasen.
