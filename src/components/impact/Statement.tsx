import type { Dictionary } from "@/i18n/dictionaries";
import { Reveal } from "./Reveal";

/** The one sentence the page turns on. It arrives once, turning in 3D. */
export function Statement({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="statement-heading" className="relative isolate overflow-hidden bg-ink px-5 py-28 lg:py-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,var(--color-ink-800)_0%,var(--color-ink)_62%)]" />
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <Reveal className="mx-auto max-w-[1180px] text-center">
        <div aria-hidden className="display text-[4rem] leading-[0.5] text-azure">
          “”
        </div>
        <h2 id="statement-heading" className="display mt-3 text-[clamp(3.5rem,11.5vw,11.5rem)] text-balance">
          {dict.ui.statement}
        </h2>
        <p className="mx-auto mt-7 max-w-[34ch] text-[1.0625rem] leading-relaxed text-fog">{dict.ui.statementNote}</p>
      </Reveal>
    </section>
  );
}
