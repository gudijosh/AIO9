import type { Dictionary } from "@/i18n/dictionaries";
import { Wordmark } from "@/components/brand/Wordmark";
import { Signal } from "@/components/brand/Signal";

export function Footer({ t, nav }: { t: Dictionary["footer"]; nav: Dictionary["nav"] }) {
  return (
    <footer className="border-t border-white/8 bg-midnight-900 text-white">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 lg:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <Wordmark className="text-[1.75rem]" />
          <p className="mt-4 flex items-center gap-3 text-sm text-slate">
            <Signal className="w-12 text-signal-300" />
            {t.tagline}
          </p>
        </div>
        <nav aria-label={nav.primary} className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/70">
          <a className="py-2 hover:text-white" href="#industries">{nav.solutions}</a>
          <a className="py-2 hover:text-white" href="#process">{nav.process}</a>
          <a className="py-2 hover:text-white" href="#contact">{nav.contact}</a>
        </nav>
        <p className="max-w-xl text-[13px] leading-relaxed text-slate lg:col-span-2">
          {t.disclaimer}
          <br />© {new Date().getFullYear()} AIO9. {t.rights}
        </p>
      </div>
    </footer>
  );
}
