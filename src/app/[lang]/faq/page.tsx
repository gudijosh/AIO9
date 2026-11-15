import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, ogLocales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { faq } from "@/data/faq";
import { siteConfig } from "@/lib/site-config";
import { faqGraph } from "@/lib/structured-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).faqPage;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: `/${lang}/faq`,
      languages: { es: "/es/faq", en: "/en/faq", "x-default": "/es/faq" },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t.metaTitle,
      description: t.metaDescription,
      url: `/${lang}/faq`,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image", title: t.metaTitle, description: t.metaDescription },
  };
}

/**
 * Questions and answers, linked only from the footer. Each answer is a
 * native <details>: it works with the keyboard and without JavaScript, and
 * the full text is in the HTML for search engines and AI agents. The same
 * questions feed the FAQPage data, /llms-full.txt and the bot.
 */
export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.faqPage;
  const groups = faq[lang];
  const home = `/${lang}`;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-bone"
      >
        {dict.nav.skip}
      </a>
      <Header locale={lang} t={dict.nav} base={home} />
      <main id="main" className="relative isolate overflow-x-clip bg-ink pt-28 pb-24 text-bone lg:pt-40 lg:pb-32">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,var(--color-ink-800)_0%,var(--color-ink)_60%)]" />
        <div aria-hidden className="grain absolute inset-0 -z-10" />

        <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
          <nav aria-label={t.breadcrumb} className="font-mono text-[11px] tracking-[0.14em] text-fog uppercase">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href={home} className="inline-block py-2 underline-offset-4 hover:text-bone hover:underline">
                  {t.home}
                </a>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-bone">
                {dict.nav.faq}
              </li>
            </ol>
          </nav>

          <h1 className="display mt-6 text-[clamp(3.75rem,10vw,9rem)]">{t.title}</h1>
          <p className="mt-6 max-w-[46ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug text-fog">{t.lead}</p>

          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`faq-${group.id}`} className="mt-16 lg:mt-20">
              <h2 id={`faq-${group.id}`} className="font-mono text-[12px] tracking-[0.16em] text-volt uppercase">
                {group.title}
              </h2>
              <div className="mt-4 border-t border-dim">
                {group.items.map((item) => (
                  <details key={item.id} id={item.id} className="group border-b border-dim">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[clamp(1.125rem,2vw,1.5rem)] leading-snug font-medium transition-colors duration-200 hover:text-volt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span
                        aria-hidden
                        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-bone/30 text-lg leading-none transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-[62ch] pb-6 text-[17px] leading-relaxed text-fog">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="faq-more" className="mt-20 rounded-[18px] border border-dim bg-ink-800 px-6 py-10 lg:mt-28 lg:px-12 lg:py-14">
            <h2 id="faq-more" className="display text-[clamp(2.5rem,5vw,4.5rem)]">
              {t.more}
            </h2>
            <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-fog">{t.moreText}</p>
            <a href={`${home}#contact`} className="pill mt-8 bg-volt text-ink">
              {t.cta} <span aria-hidden>→</span>
            </a>
          </section>
        </div>
      </main>
      <Footer dict={dict} locale={lang} base={home} />
      <JsonLd data={faqGraph(lang, dict, groups)} />
    </>
  );
}
