import type { Dictionary } from "@/i18n/dictionaries";
import { Wordmark } from "@/components/brand/Wordmark";

/** A single quiet line under the form, so the page ends on the form itself. */
export function Footer({ t }: { t: Dictionary["footer"] }) {
  return (
    <footer className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 px-5 pb-8 text-[13px] leading-relaxed text-slate-600 lg:flex-row lg:items-baseline lg:gap-8 lg:px-10">
      <Wordmark className="text-lg text-midnight" />
      <p className="lg:flex-1">{t.disclaimer}</p>
      <p>
        © {new Date().getFullYear()} AIO9. {t.rights}
      </p>
    </footer>
  );
}
