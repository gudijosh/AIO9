import { notFound } from "next/navigation";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { shareCard, shareCardSize } from "@/lib/share-card";

/** Card shown when the home page is shared, one per language. */
export const size = shareCardSize;
export const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: { lang: string } | Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);
  return [{ id: "card", alt: dict.meta.ogAlt, size, contentType }];
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // Only real languages get an image; anything else is a 404, not a render.
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return shareCard({ lines: dict.hero.lines, tagline: dict.nav.tagline });
}
