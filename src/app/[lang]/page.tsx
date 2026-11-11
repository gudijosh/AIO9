import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { IndustryExperience } from "@/components/industries/IndustryExperience";
import { Process } from "@/components/sections/Process";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-midnight"
      >
        {dict.nav.skip}
      </a>
      <Header locale={lang} t={dict.nav} />
      <main id="main">
        <Hero dict={dict} />
        <IndustryExperience t={dict.experience} copy={dict.industries} />
        <Process t={dict.process} />
        <Capabilities t={dict.capabilities} />
        <Contact dict={dict} locale={lang} />
      </main>
      <Footer t={dict.footer} nav={dict.nav} />
    </>
  );
}
