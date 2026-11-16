import "server-only";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { faq } from "@/data/faq";
import { siteConfig } from "@/lib/site-config";

/**
 * /llms.txt and /llms-full.txt: a plain Markdown summary of the site for AI
 * agents (https://llmstxt.org). Built from the same dictionaries and FAQ as
 * the pages, so it never says anything the site doesn't.
 */
function summary(locale: Locale): string {
  const d = getDictionary(locale);
  const url = `${siteConfig.url}/${locale}`;
  const lines = [
    `## ${locale === "es" ? "Español" : "English"}`,
    "",
    `${d.hero.title} ${d.hero.subtitle}`,
    "",
    `### ${d.nav.services}`,
    ...d.capabilities.items.map((item) => `- ${item.name}: ${item.text}`),
    "",
    `### ${d.nav.sectors}`,
    ...Object.values(d.industries).map((i) => `- ${i.name}: ${i.title} ${i.description}`),
    "",
    `### AIO9 Devices`,
    `${d.devices.title} ${d.devices.description}`,
    ...Object.values(d.devices.sectors).map((s) => `- ${s.name}: ${s.title} ${s.description}`),
    "",
    `### ${d.process.title.replace(/\.$/, "")}`,
    ...d.process.steps.map((step, i) => `${i + 1}. ${step}`),
    "",
    `### ${d.nav.contact}`,
    `${d.contact.note} ${url}#contact`,
    "",
    `- [${d.nav.faq}](${url}/faq)`,
    `- [${d.meta.title}](${url})`,
    "",
    `> ${d.footer.disclaimer}`,
  ];
  return lines.join("\n");
}

function questions(locale: Locale): string {
  const d = getDictionary(locale);
  return [
    `## ${d.nav.faq} (${locale})`,
    "",
    ...faq[locale].flatMap((group) => [
      `### ${group.title}`,
      "",
      ...group.items.flatMap((item) => [`**${item.q}**`, "", item.a, ""]),
    ]),
  ].join("\n");
}

export function llmsText(full: boolean): string {
  const es = getDictionary("es");
  const head = [
    `# ${siteConfig.name}`,
    "",
    `> ${es.meta.description} / ${getDictionary("en").meta.description}`,
    "",
    `Site: ${siteConfig.url} (es: ${siteConfig.url}/es, en: ${siteConfig.url}/en)`,
    full ? "" : `Full version with every question and answer: ${siteConfig.url}/llms-full.txt`,
    "",
  ];
  const body = (["es", "en"] as const).flatMap((locale) => [summary(locale), "", ...(full ? [questions(locale), ""] : [])]);
  return [...head, ...body].join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function llmsResponse(full: boolean) {
  return new Response(llmsText(full), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
