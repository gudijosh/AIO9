import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, ogLocales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { privacy, privacyUpdated } from "@/data/privacy";
import { siteConfig } from "@/lib/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang).privacyPage;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { es: "/es/privacy", en: "/en/privacy", "x-default": "/es/privacy" },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t.metaTitle,
      description: t.metaDescription,
      url: `/${lang}/privacy`,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
  };
}

/**
 * Privacy notice, linked from the footer and from under the contact form.
 * The text lives in src/data/privacy.ts.
 */
export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.privacyPage;
  const home = `/${lang}`;
  const email = siteConfig.contactEmail;
  const updated = new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(privacyUpdated));

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

        <div className="mx-auto max-w-[900px] px-5 lg:px-10">
          <h1 className="display text-[clamp(3.5rem,9vw,8rem)]">{t.title}</h1>
          <p className="mt-6 max-w-[46ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug text-fog">{t.lead}</p>
          <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-fog uppercase">
            {t.updated}: <time dateTime={privacyUpdated}>{updated}</time>
          </p>

          {privacy[lang].map((section) => (
            <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="mt-12 border-t border-dim pt-8 lg:mt-14">
              <h2 id={`privacy-${section.id}`} className="font-mono text-[12px] tracking-[0.16em] text-volt uppercase">
                {section.title}
              </h2>
              {section.paragraphs
                .filter((paragraph) => !paragraph.emailOnly || email)
                .map((paragraph, i) => (
                  <p key={i} className="mt-4 max-w-[65ch] text-[17px] leading-relaxed text-bone/90">
                    {paragraph.text.replace("{email}", email ?? "")}
                  </p>
                ))}
            </section>
          ))}

          <a href={`${home}#contact`} className="pill mt-14 bg-volt text-ink">
            {dict.nav.cta} <span aria-hidden>→</span>
          </a>
        </div>
      </main>
      <Footer dict={dict} locale={lang} base={home} />
    </>
  );
}
