"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * The one sentence the page turns on. The screen stays pinned: the sentence
 * first shows as oversized dots, then lights up word by word as you scroll,
 * and two product photos drop on top at the end.
 */
export function Statement({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const words = dict.ui.statement.split(" ");
  const [lit, setLit] = useState(0);
  const [photos, setPhotos] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dotsOpacity = useTransform(scrollYProgress, [0, 0.12, 0.24], [1, 1, 0]);
  const dotsScale = useTransform(scrollYProgress, [0, 0.24], [1, 0.4]);
  const textOpacity = useTransform(scrollYProgress, [0.14, 0.26], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const share = Math.min(1, Math.max(0, (value - 0.26) / 0.46));
    setLit(Math.round(share * words.length));
    setPhotos(value > 0.8);
  });

  const count = reduced ? words.length : lit;

  return (
    <section ref={ref} aria-labelledby="statement-heading" className="relative bg-ink motion-safe:h-[280svh]">
      <div className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-24 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:py-0">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_0%,var(--color-ink-800)_0%,var(--color-ink)_60%)]" />
        <div aria-hidden className="grain absolute inset-0 -z-10" />

        <m.div
          aria-hidden
          style={reduced ? { display: "none" } : { opacity: dotsOpacity, scale: dotsScale }}
          className="display pointer-events-none absolute inset-0 grid place-items-center text-[78vw] whitespace-nowrap text-bone/70 [mask-image:radial-gradient(circle,#000_38%,transparent_44%)] [mask-size:0.024em_0.024em] select-none"
        >
          {words[Math.min(4, words.length - 1)]}
        </m.div>

        <m.div style={reduced ? undefined : { opacity: textOpacity }} className="mx-auto max-w-[1180px] text-center">
          <div aria-hidden className="display text-[4rem] leading-[0.5] text-azure">
            “”
          </div>
          <h2 id="statement-heading" aria-label={dict.ui.statement} className="display mt-3 text-[clamp(4rem,13vw,12.5rem)]">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                aria-hidden
                className={cn("transition-colors duration-300", i < count ? "text-bone" : "text-dim")}
              >
                {word}{" "}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-7 max-w-[34ch] text-[1.0625rem] leading-relaxed text-fog">{dict.ui.statementNote}</p>
        </m.div>

        <div aria-hidden className="pointer-events-none absolute inset-0 hidden motion-safe:block">
          {(["services", "retail"] as const).map((id, i) => (
            <div
              key={id}
              className={cn(
                "absolute top-1/2 left-1/2 w-[min(52vw,26rem)] bg-bone p-2.5 shadow-[0_40px_80px_-20px_#000] transition-[translate,opacity] duration-700 ease-(--ease-signal)",
                i === 0 ? "-rotate-6 [--x:-62%]" : "rotate-5 delay-100 [--x:-38%]",
                photos ? "translate-x-(--x) -translate-y-[46%] opacity-100" : "translate-x-(--x) translate-y-[70svh] opacity-0",
              )}
            >
              <Image
                src={industryById[id].image}
                alt=""
                sizes="(min-width: 1024px) 26rem, 52vw"
                className="aspect-[5/6] w-full object-cover"
                style={{ objectPosition: industryById[id].focus }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
