import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitch } from "./LanguageSwitch";

const links = [
  { href: "#sectors", key: "sectors" },
  { href: "#services", key: "services" },
  { href: "#devices", key: "devices" },
  { href: "#process", key: "process" },
  { href: "#contact", key: "contact" },
] as const;

/** The page closes on the wordmark, as large as the screen allows. */
export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.footer;
  return (
    <footer className="relative overflow-hidden bg-bone px-5 pt-16 text-ink lg:px-10 lg:pt-20">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
        <div className="lg:flex-1">
          <p className="display text-[clamp(3rem,6vw,5.5rem)]">{t.tagline}</p>
          <a href="#contact" className="pill mt-6 bg-ink text-bone">
            {dict.nav.cta} <span aria-hidden>→</span>
          </a>
        </div>
        <nav aria-label={dict.nav.primary}>
          <ul className="grid gap-1 font-mono text-[12px] tracking-[0.14em] uppercase">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-block py-1.5 underline-offset-4 hover:underline">
                  {dict.nav[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitch current={locale} label={dict.nav.language} />
      </div>
      <div className="mx-auto mt-12 flex max-w-[1500px] flex-col gap-3 border-t border-ink/20 pt-5 text-[13px] leading-relaxed text-slate-600 lg:flex-row lg:gap-10">
        <p className="lg:max-w-[60ch] lg:flex-1">{t.disclaimer}</p>
        <p>
          © {new Date().getFullYear()} AIO9. {t.rights}
        </p>
      </div>
      <div aria-hidden className="display pointer-events-none -mb-[0.2em] text-[52vw] leading-[0.8] whitespace-nowrap select-none">
        AIO<span className="text-azure">9</span>
      </div>
    </footer>
  );
}
