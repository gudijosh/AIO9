import type { Locale } from "@/i18n/config";

/**
 * Privacy notice for /es/privacy and /en/privacy. It describes only what is
 * true of this site: the five form fields, no cookies, Io keeps nothing,
 * cookie-free visit counts, and the providers that run the site. The
 * controller is named only "AIO9" (no country or address, by the owner's
 * choice). General wording: have it reviewed by a lawyer before launch.
 *
 * `{email}` in a paragraph is replaced by the contact email when one is
 * configured; the paragraph marked `emailOnly` is dropped otherwise.
 */
export interface PrivacySection {
  id: string;
  title: string;
  paragraphs: readonly { text: string; emailOnly?: boolean }[];
}

/** Date of the current version, ISO format. */
export const privacyUpdated = "2026-11-16";

const es: readonly PrivacySection[] = [
  {
    id: "controller",
    title: "Quién es responsable",
    paragraphs: [{ text: "El responsable de los datos que recibimos en este sitio es AIO9." }],
  },
  {
    id: "data",
    title: "Qué datos recibimos",
    paragraphs: [
      {
        text: "Solo los que escribes en el formulario de contacto: tu nombre, el nombre de tu empresa, tu correo, tu industria y tu mensaje.",
      },
      { text: "Io, el asistente del sitio, funciona en tu navegador: no guarda ni envía lo que le escribes." },
    ],
  },
  {
    id: "use",
    title: "Para qué los usamos",
    paragraphs: [
      {
        text: "Para responder tu consulta y, si nos lo pides, preparar una propuesta. No los usamos para otra cosa y no los vendemos.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies y medición",
    paragraphs: [
      {
        text: "Este sitio no usa cookies. Podemos medir las visitas de forma agregada y anónima, sin cookies y sin identificarte, para saber qué partes del sitio son útiles.",
      },
    ],
  },
  {
    id: "providers",
    title: "Con quién se comparten",
    paragraphs: [
      {
        text: "Con los proveedores que hacen funcionar el sitio: Vercel, que lo aloja y mide las visitas, y el servicio que nos entrega los mensajes del formulario. Ellos tratan los datos solo para prestar ese servicio.",
      },
    ],
  },
  {
    id: "retention",
    title: "Cuánto tiempo los guardamos",
    paragraphs: [
      {
        text: "Guardamos tus mensajes mientras sean necesarios para atender tu consulta y la relación que surja de ella. Puedes pedir que los borremos en cualquier momento.",
      },
    ],
  },
  {
    id: "rights",
    title: "Qué puedes pedirnos",
    paragraphs: [
      {
        text: "Puedes pedirnos ver, corregir o borrar tus datos, o que dejemos de usarlos. Escríbenos por el formulario de contacto.",
      },
      { text: "También puedes escribirnos a {email}.", emailOnly: true },
    ],
  },
  {
    id: "changes",
    title: "Cambios",
    paragraphs: [{ text: "Si cambiamos este aviso, publicaremos aquí la nueva versión con su fecha." }],
  },
];

const en: readonly PrivacySection[] = [
  {
    id: "controller",
    title: "Who is responsible",
    paragraphs: [{ text: "The controller of the data we receive on this site is AIO9." }],
  },
  {
    id: "data",
    title: "What data we receive",
    paragraphs: [
      {
        text: "Only what you write in the contact form: your name, your business name, your email, your industry and your message.",
      },
      { text: "Io, the site's assistant, runs in your browser: it doesn't keep or send what you type to it." },
    ],
  },
  {
    id: "use",
    title: "What we use it for",
    paragraphs: [
      {
        text: "To reply to your inquiry and, if you ask us to, prepare a proposal. We don't use it for anything else and we don't sell it.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and measurement",
    paragraphs: [
      {
        text: "This site doesn't use cookies. We may count visits in an aggregated, anonymous way, without cookies and without identifying you, to learn which parts of the site are useful.",
      },
    ],
  },
  {
    id: "providers",
    title: "Who it is shared with",
    paragraphs: [
      {
        text: "With the providers that run the site: Vercel, which hosts it and counts visits, and the service that delivers the form's messages to us. They process the data only to provide that service.",
      },
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    paragraphs: [
      {
        text: "We keep your messages for as long as needed to handle your inquiry and any relationship that comes from it. You can ask us to delete them at any time.",
      },
    ],
  },
  {
    id: "rights",
    title: "What you can ask of us",
    paragraphs: [
      {
        text: "You can ask us to show, correct or delete your data, or to stop using it. Write to us through the contact form.",
      },
      { text: "You can also write to {email}.", emailOnly: true },
    ],
  },
  {
    id: "changes",
    title: "Changes",
    paragraphs: [{ text: "If we change this notice, we'll publish the new version here with its date." }],
  },
];

export const privacy: Record<Locale, readonly PrivacySection[]> = { es, en };
