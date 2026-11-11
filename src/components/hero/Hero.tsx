import type { Dictionary } from "@/i18n/dictionaries";
import { HeroStack } from "./HeroStack";

/**
 * Entrance sequence (CSS only, so it never blocks interaction):
 * wordmark → headline → photograph mask → secondary elements → first case.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section id="top" className="relative isolate overflow-hidden bg-midnight">
      <div
        aria-hidden
        className="absolute top-[-20%] right-[-15%] -z-10 size-[70vw] rounded-full bg-navy/55 blur-[140px]"
      />
      <div className="mx-auto grid min-h-svh max-w-[1600px] items-center gap-14 px-5 pt-28 pb-16 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:px-10 lg:pt-24 lg:pb-12">
        <div>
          <h1 className="max-w-[11ch] animate-rise text-[clamp(2.75rem,6.3vw,6rem)] leading-[0.96] font-medium tracking-[-0.04em] text-balance [animation-delay:120ms]">
            {t.title}
          </h1>
          <p className="mt-7 max-w-[44ch] animate-rise text-[17px] leading-relaxed text-white/70 [animation-delay:260ms] lg:text-lg">
            {t.subtitle}
          </p>
          <div className="mt-9 flex animate-rise flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:400ms]">
            <a
              href="#contact"
              className="inline-flex h-13 items-center rounded-full bg-signal px-7 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#1f4cc4]"
            >
              {t.primary}
            </a>
            <a
              href="#industries"
              className="py-2 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-white"
            >
              {t.secondary}
            </a>
          </div>
        </div>
        <HeroStack t={t} industries={dict.industries} />
      </div>
    </section>
  );
}
