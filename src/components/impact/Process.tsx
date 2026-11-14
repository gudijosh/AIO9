"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** How an engagement goes, in three steps. The volt line fills as you scroll. */
export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.process;
  const ref = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  return (
    <section id="process" aria-labelledby="process-heading" className="relative isolate bg-ink px-5 pt-24 pb-[calc(6rem+14vw)] lg:px-10 lg:pt-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_0%,var(--color-ink-800)_0%,var(--color-ink)_60%)]" />
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-16">
          <h2 id="process-heading" className="display max-w-[12ch] text-[clamp(4.5rem,11vw,10.5rem)]">
            {t.title}
          </h2>
          <p className="max-w-[40ch] pb-4 text-[1.0625rem] leading-relaxed text-fog">{t.subtitle}</p>
        </div>

        <div aria-hidden className="mt-12 h-[3px] bg-dim">
          <m.div style={reduced ? undefined : { scaleX }} className="h-full origin-left bg-volt" />
        </div>

        <ol ref={ref} className="mt-8 grid gap-12 lg:grid-cols-3 lg:gap-10">
          {t.steps.map((step, i) => (
            <li key={step.name}>
              <span aria-hidden className={i === 1 ? "display dots block text-[9.5rem] text-volt" : "display dots block text-[9.5rem] text-azure"}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-4 text-[clamp(2.75rem,4.6vw,4.5rem)]">{step.name}</h3>
              <p className="mt-3 max-w-[36ch] text-base leading-relaxed text-fog">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
