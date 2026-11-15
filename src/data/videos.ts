import type { Locale } from "@/i18n/config";

/**
 * Videos shown in the reel before the contact form. Each language lists its
 * own: /es shows the Spanish ones and /en the English ones. A video that only
 * exists in one language goes only in that list. With an empty list the
 * section is not shown at all.
 *
 * Files live in public/videos/<lang>/ and are prepared with
 * `node scripts/prepare-videos.mjs <folder>` (see docs/VIDEOS.md), which also
 * prints the entries to paste here.
 */
export interface Video {
  /** Stable id, the same for both language versions of one video. */
  id: string;
  /** Path under /public, e.g. "/videos/es/presentacion.mp4". */
  src: string;
  /** Still frame shown before playing, e.g. "/videos/es/presentacion.webp". */
  poster: string;
  /** Short title: the card's accessible name and its caption. */
  title: string;
  /** Optional WebVTT subtitles, e.g. "/videos/es/presentacion.vtt". */
  captions?: string;
}

export const videos: Record<Locale, readonly Video[]> = {
  es: [
    { id: "ya-respondio", src: "/videos/es/ya-respondio.mp4", poster: "/videos/es/ya-respondio.webp", title: "Ya respondió" },
    { id: "modulos", src: "/videos/es/modulos.mp4", poster: "/videos/es/modulos.webp", title: "¿Qué es AIO9?" },
  ],
  en: [
    {
      id: "ya-respondio",
      src: "/videos/en/ya-respondio.mp4",
      poster: "/videos/en/ya-respondio.webp",
      title: "Already answered",
    },
    {
      id: "modulos",
      src: "/videos/en/modulos.mp4",
      poster: "/videos/en/modulos.webp",
      title: "What is AIO9?",
    },
  ],
};
