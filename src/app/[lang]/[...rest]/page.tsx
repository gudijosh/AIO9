import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Any path under /es or /en that matches no page lands here and becomes a
 * 404 with the site's own page ([lang]/not-found.tsx). Paths without a
 * valid language are sent here by src/proxy.ts. The 404 page reads request
 * headers, so it renders per request and carries the CSP nonce. Next.js 16
 * answers such a 404 with status 404 and an empty error shell that the
 * browser fills from the page's data, so the 404's text appears with
 * JavaScript (search engines don't index 404s anyway).
 */
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps<"/[lang]/[...rest]">): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : defaultLocale).notFound.metaTitle };
}

export default function UnknownPage() {
  notFound();
}
