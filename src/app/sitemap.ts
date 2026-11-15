import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { siteConfig } from "@/lib/site-config";

/** Every page in both languages, each listing its other-language version. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/faq", priority: 0.8 },
  ];
  const lastModified = new Date();
  return pages.flatMap(({ path, priority }) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])),
      "x-default": `${siteConfig.url}/${defaultLocale}${path}`,
    };
    return locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? priority : priority - 0.1,
      alternates: { languages },
    }));
  });
}
