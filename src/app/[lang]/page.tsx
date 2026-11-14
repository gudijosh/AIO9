import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import { Preloader } from "@/components/impact/Preloader";
import { Hero } from "@/components/impact/Hero";
import { SectorsRail } from "@/components/impact/SectorsRail";
import { IndustryScenes } from "@/components/impact/IndustryScenes";
import { Statement } from "@/components/impact/Statement";
import { ServiceScenes } from "@/components/impact/ServiceScenes";
import { DevicesScenes } from "@/components/impact/DevicesScenes";
import { Extras } from "@/components/impact/Extras";
import { Process } from "@/components/impact/Process";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-bone"
      >
        {dict.nav.skip}
      </a>
      <Preloader label={dict.ui.loading} />
      <Header locale={lang} t={dict.nav} />
      <main id="main">
        <Hero dict={dict} locale={lang} />
        <SectorsRail dict={dict} />
        <IndustryScenes dict={dict} locale={lang} />
        <Statement dict={dict} />
        <ServiceScenes dict={dict} locale={lang} />
        <DevicesScenes dict={dict} locale={lang} />
        <Extras dict={dict} />
        <Process dict={dict} />
        <Contact dict={dict} locale={lang} />
      </main>
      <Footer dict={dict} locale={lang} />
    </>
  );
}
