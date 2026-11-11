import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryIds } from "@/data/industries";
import { siteConfig } from "@/lib/site-config";
import { Signal } from "@/components/brand/Signal";
import { ContactForm } from "./ContactForm";

export function Contact({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.contact;
  const industryNames = Object.fromEntries(industryIds.map((id) => [id, dict.industries[id].name]));
  const { contactEmail, whatsappNumber } = siteConfig;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 lg:px-10 lg:pb-36">
        <div className="grid gap-12 rounded-[28px] bg-navy/55 px-5 py-12 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:rounded-[36px] lg:p-16">
          <div>
            <Signal className="w-16 text-signal-300" />
            <h2
              id="contact-heading"
              className="mt-7 max-w-[10ch] text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[0.98] font-medium tracking-[-0.04em]"
            >
              {t.title}
            </h2>
            <p className="mt-6 max-w-[30ch] text-xl leading-snug text-white/85">{t.subtitle}</p>
            <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-slate">{t.note}</p>
            {(contactEmail || whatsappNumber) && (
              <ul className="mt-8 flex flex-col gap-2 text-[15px]">
                {contactEmail && (
                  <li>
                    <span className="text-slate">{t.emailLabel}: </span>
                    <a className="underline decoration-white/30 underline-offset-[6px] hover:decoration-white" href={`mailto:${contactEmail}`}>
                      {contactEmail}
                    </a>
                  </li>
                )}
                {whatsappNumber && (
                  <li>
                    <a
                      className="underline decoration-white/30 underline-offset-[6px] hover:decoration-white"
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.whatsappLabel}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
          <ContactForm
            t={t.form}
            locale={locale}
            industryNames={industryNames}
            contactEmail={contactEmail}
          />
        </div>
      </div>
    </section>
  );
}
