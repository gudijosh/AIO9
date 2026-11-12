import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryIds } from "@/data/industries";
import { siteConfig } from "@/lib/site-config";
import { Signal } from "@/components/brand/Signal";
import { Arrive } from "@/components/flow/parallax";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "./ContactForm";

const link =
  "underline decoration-midnight/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-midnight";

/**
 * The end of the page: one screen with nothing but the inquiry form on a
 * glass card, and the legal line underneath.
 */
export function Contact({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.contact;
  const industryNames = Object.fromEntries(industryIds.map((id) => [id, dict.industries[id].name]));
  const { contactEmail, whatsappNumber } = siteConfig;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-cream"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute top-[10%] left-[-10%] size-[50vmax] rounded-full bg-signal-300/35 blur-[130px]" />
        <span className="absolute right-[-12%] bottom-[-10%] size-[44vmax] rounded-full bg-signal/20 blur-[130px]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 items-center px-5 pt-24 pb-10 lg:px-10 lg:pt-28">
        <Arrive className="glass grid w-full gap-12 rounded-[28px] px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:rounded-[40px] lg:p-14">
          <div>
            <Signal className="w-16 text-signal" />
            <h2
              id="contact-heading"
              className="mt-7 max-w-[10ch] text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.04em]"
            >
              {t.title}
            </h2>
            <p className="mt-6 max-w-[30ch] text-xl leading-snug">{t.subtitle}</p>
            <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-slate-600">{t.note}</p>
            {(contactEmail || whatsappNumber) && (
              <ul className="mt-8 flex flex-col gap-2 text-[15px]">
                {contactEmail && (
                  <li>
                    <span className="text-slate-600">{t.emailLabel}: </span>
                    <a className={link} href={`mailto:${contactEmail}`}>
                      {contactEmail}
                    </a>
                  </li>
                )}
                {whatsappNumber && (
                  <li>
                    <a className={link} href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
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
        </Arrive>
      </div>

      <Footer t={dict.footer} />
    </section>
  );
}
