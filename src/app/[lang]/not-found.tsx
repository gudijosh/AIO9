import { headers } from "next/headers";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * The site's 404, in the visitor's language. A not-found page doesn't get
 * route params, so the language comes from the `x-locale` request header
 * that src/proxy.ts sets on every page request.
 */
export default async function NotFound() {
  const requested = (await headers()).get("x-locale") ?? "";
  const lang = isLocale(requested) ? requested : defaultLocale;
  const dict = getDictionary(lang);
  const t = dict.notFound;
  const home = `/${lang}`;

  return (
    <>
      <Header locale={lang} t={dict.nav} base={home} />
      <main id="main" className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink pt-28 pb-24 text-bone">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,var(--color-ink-800)_0%,var(--color-ink)_65%)]" />
        <div aria-hidden className="grain absolute inset-0 -z-10" />
        <p
          aria-hidden
          className="display dots pointer-events-none absolute -right-[6vw] bottom-[-8vw] -z-10 text-[58vw] leading-[0.8] text-azure/25 select-none"
        >
          404
        </p>

        <div className="mx-auto w-full max-w-[1500px] px-5 lg:px-10">
          <p className="font-mono text-[12px] tracking-[0.16em] text-volt uppercase">Error 404</p>
          <h1 className="display mt-5 max-w-[11ch] text-[clamp(3.75rem,11vw,10rem)]">{t.title}</h1>
          <p className="mt-6 max-w-[40ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug text-fog">{t.text}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={home} className="pill bg-volt text-ink">
              {t.home} <span aria-hidden>→</span>
            </a>
            <a href={`${home}/faq`} className="pill bg-bone text-ink">
              {t.faq} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </main>
      <Footer dict={dict} locale={lang} base={home} />
    </>
  );
}
