import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryIds } from "@/data/industries";
import { deviceSectorIds } from "@/data/devices";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "./ContactForm";

const link =
  "underline decoration-ink/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-ink";

/**
 * The end of the page: back to the light ground on a diagonal cut, with the
 * closing line in display type and nothing else but the inquiry form.
 */
export function Contact({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.contact;
  const industryNames = {
    ...Object.fromEntries(industryIds.map((id) => [id, dict.industries[id].name])),
    ...Object.fromEntries(deviceSectorIds.map((id) => [id, dict.devices.sectors[id].name])),
  };
  const { contactEmail, whatsappNumber } = siteConfig;
  // "Tu negocio. Reinventado." → first sentence in ink, the rest in blue.
  const cut = t.title.indexOf(". ") + 1;
  const [first, rest] = cut > 0 ? [t.title.slice(0, cut), t.title.slice(cut + 1)] : [t.title, ""];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate z-10 -mt-[14vw] overflow-hidden bg-bone pt-[20vw] pb-20 text-ink [clip-path:polygon(0_14vw,100%_0,100%_100%,0_100%)] lg:pt-[18vw] lg:pb-28"
    >
      <div aria-hidden className="display pointer-events-none absolute top-[6vw] -left-[4vw] -z-10 text-[86vw] whitespace-nowrap text-bone-300 select-none">
        AIO9
      </div>
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 lg:grid-cols-[1.15fr_minmax(0,30rem)] lg:items-start lg:gap-16 lg:px-10">
        <div>
          <h2 id="contact-heading" className="display text-[clamp(4.5rem,13.5vw,13.5rem)]">
            <span className="block">{first}</span>
            {rest && <span className="block text-azure">{rest}</span>}
          </h2>
          <p className="mt-7 max-w-[30ch] text-xl leading-snug">{t.subtitle}</p>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-slate-600">{t.note}</p>
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
        <div className="bg-bone p-6 shadow-[0_50px_90px_-30px_rgba(10,10,18,0.5)] sm:p-9 lg:mt-6 lg:motion-safe:rotate-[1.5deg]">
          <ContactForm t={t.form} locale={locale} industryNames={industryNames} contactEmail={contactEmail} />
        </div>
      </div>
    </section>
  );
}
