import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/hero/Hero";
import { ServicesFlow } from "@/components/flow/ServicesFlow";
import { Contact } from "@/components/sections/Contact";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-midnight focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
      >
        {dict.nav.skip}
      </a>
      <Header locale={lang} t={dict.nav} />
      <main id="main">
        <Hero dict={dict} />
        <ServicesFlow dict={dict} />
        <Contact dict={dict} locale={lang} />
      </main>
    </>
  );
}
