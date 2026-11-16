import "server-only";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FaqGroup } from "@/data/faq";
import { siteConfig } from "@/lib/site-config";

/**
 * schema.org data (JSON-LD) that search engines and AI agents read to
 * understand who AIO9 is and what it offers. It only restates what the
 * page shows; contact details appear only when configured.
 */
const ids = {
  organization: () => `${siteConfig.url}/#organization`,
  website: () => `${siteConfig.url}/#website`,
};

function organization(dict: Dictionary) {
  return {
    "@type": "Organization",
    "@id": ids.organization(),
    name: siteConfig.name,
    url: siteConfig.url,
    description: dict.meta.description,
    slogan: dict.hero.title,
    knowsAbout: [
      ...dict.capabilities.items.map((item) => item.name),
      ...Object.values(dict.industries).map((industry) => industry.name),
      ...Object.values(dict.devices.sectors).map((sector) => sector.name),
      "ESP32",
      "Raspberry Pi",
    ],
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.nav.services,
      itemListElement: dict.capabilities.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.name, description: item.text, provider: { "@id": ids.organization() } },
      })),
    },
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": ids.website(),
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: ["es", "en"],
    publisher: { "@id": ids.organization() },
  };
}

/** Home page: the organization, the site and the page itself. */
export function homeGraph(locale: Locale, dict: Dictionary) {
  const url = `${siteConfig.url}/${locale}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(dict),
      website(),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: locale,
        isPartOf: { "@id": ids.website() },
        about: { "@id": ids.organization() },
      },
    ],
  };
}

/** Questions page: FAQPage with exactly the questions shown, plus breadcrumbs. */
export function faqGraph(locale: Locale, dict: Dictionary, groups: readonly FaqGroup[]) {
  const home = `${siteConfig.url}/${locale}`;
  const url = `${home}/faq`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization(dict),
      website(),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        name: dict.faqPage.metaTitle,
        inLanguage: locale,
        isPartOf: { "@id": ids.website() },
        about: { "@id": ids.organization() },
        mainEntity: groups.flatMap((group) =>
          group.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        ),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: dict.faqPage.home, item: home },
          { "@type": "ListItem", position: 2, name: dict.nav.faq, item: url },
        ],
      },
    ],
  };
}
