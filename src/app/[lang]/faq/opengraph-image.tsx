import { notFound } from "next/navigation";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { shareCard, shareCardSize, splitTitle } from "@/lib/share-card";

/** Card shown when this page is shared, one per language. */
export const size = shareCardSize;
export const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: { lang: string } | Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : defaultLocale);
  return [{ id: "card", alt: dict.faqPage.metaTitle, size, contentType }];
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return shareCard({ lines: splitTitle(dict.faqPage.title, 2), tagline: dict.nav.tagline });
}
