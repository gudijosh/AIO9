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
  es: [],
  en: [],
};
