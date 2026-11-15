import type { Locale } from "@/i18n/config";

/**
 * Questions and answers for /es/faq and /en/faq, the FAQPage structured
 * data, /llms-full.txt and the bot. Every answer only restates what the site
 * already shows: no prices, timelines, clients, figures, guarantees,
 * locations or contact details. Ids are shared by both languages.
 */
export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: readonly FaqItem[];
}

const es: readonly FaqGroup[] = [
  {
    id: "about",
    title: "Sobre AIO9",
    items: [
      {
        id: "what-is",
        q: "¿Qué es AIO9?",
        a: "AIO9 implementa IA y software para que las empresas atiendan mejor, reduzcan tareas manuales y conecten sus operaciones. Lo hace con cuatro productos: AIO9 Automate, AIO9 Web, AIO9 Systems y AIO9 Devices.",
      },
      {
        id: "who-for",
        q: "¿Con qué tipo de empresas trabaja AIO9?",
        a: "En la página mostramos ejemplos para salud, restaurantes, bienes raíces, comercio, servicios profesionales y operaciones; y, con AIO9 Devices, para granjas, inventarios físicos, flota y cadena de frío, y agro. Si tu sector no aparece, elige «Otra» en el formulario y cuéntanos tu caso.",
      },
      {
        id: "demos",
        q: "¿Las ventanas de software que aparecen en la página son reales?",
        a: "Son simulaciones ilustrativas: muestran lo que se puede construir, con datos de ejemplo. Cada implementación se define y valida por proyecto.",
      },
    ],
  },
  {
    id: "products",
    title: "Productos",
    items: [
      {
        id: "automate",
        q: "¿Qué es AIO9 Automate?",
        a: "Asistentes de IA y automatizaciones. Por ejemplo: responder los mensajes de tus clientes, agendar citas, reservar mesas o atender a un interesado y agendar una visita.",
      },
      {
        id: "web",
        q: "¿Qué es AIO9 Web?",
        a: "Sitios web pensados para captar clientes. En la página, la tarjeta de AIO9 Web muestra este mismo sitio como ejemplo.",
      },
      {
        id: "systems",
        q: "¿Qué es AIO9 Systems?",
        a: "Software a medida para tu operación. Por ejemplo: leer, ordenar y resumir documentos, o revisar pedidos, detectar incidencias y proponer qué hacer.",
      },
      {
        id: "devices",
        q: "¿Qué es AIO9 Devices?",
        a: "Sensores y controladores con ESP32 y Raspberry Pi, conectados a tu software. Es automatización que toca el mundo físico: granjas, inventarios, flota y agro.",
      },
      {
        id: "combine",
        q: "¿Puedo combinar varios productos?",
        a: "Sí. Por ejemplo, un asistente de AIO9 Automate puede responder con tu inventario real, y los sensores de AIO9 Devices se conectan a tu software. Qué combinar se define en cada proyecto.",
      },
    ],
  },
  {
    id: "sectors",
    title: "Sectores",
    items: [
      {
        id: "health",
        q: "¿Qué hace AIO9 en salud?",
        a: "En una clínica, el asistente responde mensajes, agenda citas y programa recordatorios, para que no se pierdan llamadas.",
      },
      {
        id: "medical",
        q: "¿AIO9 diagnostica pacientes o da recomendaciones médicas?",
        a: "No. En salud, AIO9 se limita a tareas como responder, agendar y recordar citas. No diagnostica ni da recomendaciones médicas: eso le corresponde siempre al personal de salud.",
      },
      {
        id: "restaurants",
        q: "¿Qué hace AIO9 en restaurantes?",
        a: "El asistente responde a tus clientes, reserva la mesa y les envía la confirmación.",
      },
      {
        id: "real-estate",
        q: "¿Qué hace AIO9 en bienes raíces?",
        a: "Atiende a quien pregunta por una propiedad, lo califica (por ejemplo, según su presupuesto y su plazo) y agenda la visita, con todo registrado en el CRM.",
      },
      {
        id: "retail",
        q: "¿Qué hace AIO9 en comercio?",
        a: "Responde a tus clientes con tu inventario real, puede apartar un producto y programar el seguimiento.",
      },
      {
        id: "professional",
        q: "¿Qué hace AIO9 en servicios profesionales?",
        a: "Lee, ordena y resume documentos, como contratos, y los deja en revisión humana antes de usarlos.",
      },
      {
        id: "operations",
        q: "¿Qué hace AIO9 en operaciones?",
        a: "Revisa pedidos, detecta incidencias (por ejemplo, una entrega fuera de horario) y propone qué hacer. La acción se aplica solo cuando una persona la aprueba.",
      },
    ],
  },
  {
    id: "devices",
    title: "AIO9 Devices",
    items: [
      {
        id: "boards",
        q: "¿Para qué usan ESP32 y Raspberry Pi?",
        a: "Son placas electrónicas para conectar sensores y controladores a tu software. En los ejemplos, ESP32 mide el clima en granjas y la humedad del suelo en agro; Raspberry Pi lee etiquetas RFID y códigos de barras en inventarios, y GPS, temperatura y puertas en la flota.",
      },
      {
        id: "farms-agro",
        q: "¿Qué se puede automatizar en una granja o en el campo?",
        a: "En una granja, medir el clima del galpón y ajustar la ventilación. En agro, medir la humedad del suelo por zona y programar el riego.",
      },
      {
        id: "inventory-fleet",
        q: "¿Y en inventarios y en la flota?",
        a: "En inventarios, lectores que cuentan sin cerrar la bodega y marcan las diferencias. En la flota, GPS, temperatura y puertas en cada unidad, con avisos cuando algo sale de lo normal.",
      },
    ],
  },
  {
    id: "how",
    title: "Cómo trabajamos",
    items: [
      {
        id: "process",
        q: "¿Cómo trabaja AIO9?",
        a: "En tres pasos: identificamos qué está frenando tu operación, construimos la solución, y la conectamos y capacitamos a tu equipo para usarla.",
      },
      {
        id: "human-review",
        q: "¿La IA toma decisiones sola?",
        a: "En nuestras demostraciones, los pasos importantes pasan por una persona: los documentos quedan en revisión humana y los cambios en operaciones o en inventario requieren aprobación. Cómo se hace en tu caso se define en el proyecto.",
      },
    ],
  },
  {
    id: "start",
    title: "Empezar",
    items: [
      {
        id: "price",
        q: "¿Cuánto cuesta?",
        a: "Depende de lo que necesites: cada implementación se define por proyecto. Cuéntanos tu caso en el formulario y te respondemos con una propuesta concreta para empezar.",
      },
      {
        id: "timeline",
        q: "¿Cuánto tarda una implementación?",
        a: "Los plazos se definen en cada proyecto, según lo que haya que construir y conectar. Escríbenos en el formulario y lo conversamos.",
      },
      {
        id: "start",
        q: "¿Cómo empiezo?",
        a: "Llena el formulario de contacto con tu nombre, tu empresa, tu correo, tu industria y unas líneas sobre lo que quieres resolver. Te respondemos con una propuesta concreta para empezar.",
      },
      {
        id: "person",
        q: "¿Hablo con una persona o con un bot?",
        a: "El formulario llega a nuestro equipo y te escribimos nosotros. El bot de esta página solo da respuestas predefinidas: no es una IA ni una persona.",
      },
      {
        id: "languages",
        q: "¿En qué idiomas está el sitio?",
        a: "En español y en inglés. Puedes cambiar de idioma desde el menú o desde el pie de página.",
      },
    ],
  },
];

const en: readonly FaqGroup[] = [
  {
    id: "about",
    title: "About AIO9",
    items: [
      {
        id: "what-is",
        q: "What is AIO9?",
        a: "AIO9 implements AI and software so businesses serve customers better, cut manual work and connect their operations. It does this with four products: AIO9 Automate, AIO9 Web, AIO9 Systems and AIO9 Devices.",
      },
      {
        id: "who-for",
        q: "What kind of businesses does AIO9 work with?",
        a: "The site shows examples for healthcare, restaurants, real estate, retail, professional services and operations; and, with AIO9 Devices, for farms, physical inventory, fleet and cold chain, and agriculture. If your industry isn't listed, choose “Other” in the form and tell us about your case.",
      },
      {
        id: "demos",
        q: "Are the software windows on the site real?",
        a: "They are illustrative simulations: they show what can be built, with sample data. Every implementation is defined and validated per project.",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    items: [
      {
        id: "automate",
        q: "What is AIO9 Automate?",
        a: "AI assistants and automations. For example: answering your customers' messages, booking appointments, reserving tables, or following up with a prospect and scheduling a visit.",
      },
      {
        id: "web",
        q: "What is AIO9 Web?",
        a: "Websites built to win customers. On the site, the AIO9 Web card shows this very site as an example.",
      },
      {
        id: "systems",
        q: "What is AIO9 Systems?",
        a: "Custom software for your operation. For example: reading, sorting and summarizing documents, or checking orders, spotting issues and suggesting what to do.",
      },
      {
        id: "devices",
        q: "What is AIO9 Devices?",
        a: "Sensors and controllers on ESP32 and Raspberry Pi, connected to your software. It is automation that reaches the physical world: farms, inventory, fleet and agriculture.",
      },
      {
        id: "combine",
        q: "Can I combine several products?",
        a: "Yes. For example, an AIO9 Automate assistant can answer with your real stock, and AIO9 Devices sensors connect to your software. What to combine is defined in each project.",
      },
    ],
  },
  {
    id: "sectors",
    title: "Industries",
    items: [
      {
        id: "health",
        q: "What does AIO9 do in healthcare?",
        a: "At a clinic, the assistant answers messages, books appointments and sets reminders, so no call goes unanswered.",
      },
      {
        id: "medical",
        q: "Does AIO9 diagnose patients or give medical advice?",
        a: "No. In healthcare, AIO9 is limited to tasks such as answering, booking and reminding patients of appointments. It does not diagnose or give medical advice: that always belongs to healthcare professionals.",
      },
      {
        id: "restaurants",
        q: "What does AIO9 do for restaurants?",
        a: "The assistant answers your guests, books the table and sends them the confirmation.",
      },
      {
        id: "real-estate",
        q: "What does AIO9 do in real estate?",
        a: "It answers whoever asks about a property, qualifies them (for example, by budget and timing) and schedules the visit, with everything recorded in the CRM.",
      },
      {
        id: "retail",
        q: "What does AIO9 do in retail?",
        a: "It answers your customers with your real stock, can hold a product for them and schedule the follow-up.",
      },
      {
        id: "professional",
        q: "What does AIO9 do in professional services?",
        a: "It reads, sorts and summarizes documents, such as contracts, and leaves them for human review before they are used.",
      },
      {
        id: "operations",
        q: "What does AIO9 do in operations?",
        a: "It checks orders, spots issues (for example, a delivery outside business hours) and suggests what to do. The action is applied only once a person approves it.",
      },
    ],
  },
  {
    id: "devices",
    title: "AIO9 Devices",
    items: [
      {
        id: "boards",
        q: "What do you use ESP32 and Raspberry Pi for?",
        a: "They are electronic boards that connect sensors and controllers to your software. In the examples, ESP32 measures the climate on farms and soil moisture in agriculture; Raspberry Pi reads RFID tags and barcodes for inventory, and GPS, temperature and doors across the fleet.",
      },
      {
        id: "farms-agro",
        q: "What can be automated on a farm or in the field?",
        a: "On a farm, measuring the climate in the barn and adjusting the ventilation. In agriculture, measuring soil moisture by zone and scheduling irrigation.",
      },
      {
        id: "inventory-fleet",
        q: "And for inventory and fleet?",
        a: "For inventory, readers that count without closing the warehouse and flag the differences. For the fleet, GPS, temperature and doors on every unit, with alerts when something is out of the ordinary.",
      },
    ],
  },
  {
    id: "how",
    title: "How we work",
    items: [
      {
        id: "process",
        q: "How does AIO9 work?",
        a: "In three steps: we identify what is holding your operation back, we build the solution, and we connect it and train your team to use it.",
      },
      {
        id: "human-review",
        q: "Does the AI make decisions on its own?",
        a: "In our demonstrations, the important steps go through a person: documents wait for human review, and changes to operations or inventory need approval. How this works in your case is defined in the project.",
      },
    ],
  },
  {
    id: "start",
    title: "Getting started",
    items: [
      {
        id: "price",
        q: "How much does it cost?",
        a: "It depends on what you need: every implementation is defined per project. Tell us about your case in the form and we'll reply with a concrete proposal to get started.",
      },
      {
        id: "timeline",
        q: "How long does an implementation take?",
        a: "Timelines are defined in each project, depending on what has to be built and connected. Write to us through the form and we'll talk it through.",
      },
      {
        id: "start",
        q: "How do I get started?",
        a: "Fill in the contact form with your name, your business, your email, your industry and a few lines about what you want to solve. We'll reply with a concrete proposal to get started.",
      },
      {
        id: "person",
        q: "Am I talking to a person or a bot?",
        a: "The form reaches our team and we write back ourselves. The bot on this site only gives preset answers: it is neither an AI nor a person.",
      },
      {
        id: "languages",
        q: "What languages is the site in?",
        a: "Spanish and English. You can switch languages from the menu or the footer.",
      },
    ],
  },
];

export const faq: Record<Locale, readonly FaqGroup[]> = { es, en };

/** One answer by id, for reuse in the bot so both always say the same. */
export function faqAnswer(locale: Locale, id: string): string {
  for (const group of faq[locale]) {
    const item = group.items.find((entry) => entry.id === id);
    if (item) return item.a;
  }
  throw new Error(`Unknown FAQ id "${id}" for ${locale}`);
}
