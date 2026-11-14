"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Fit } from "./scroll/Fit";
import { HealthcareWindow } from "./windows/HealthcareWindow";

/**
 * Opening screen: the promise set in oversized condensed type on a light
 * ground, with one finished product window and a product photo leaning in.
 * The dark Sectors scene cuts across its bottom edge on a diagonal.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.hero;
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lettersY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const windowY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const health = industryById.healthcare;
  const last = health.stepDurations.length - 1;

  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden bg-bone pb-[16vw] text-ink lg:min-h-svh">
      <m.div
        aria-hidden
        style={reduced ? undefined : { y: lettersY }}
        className="display pointer-events-none absolute -top-[6vw] -left-[4vw] -z-10 text-[86vw] whitespace-nowrap text-bone-300 select-none"
      >
        AIO9
      </m.div>

      <div className="mx-auto max-w-[1600px] px-5 pt-24 lg:px-10 lg:pt-[7.5rem]">
        <h1 aria-label={t.title} className="display text-[clamp(2.75rem,12.6vw,13rem)]">
          {t.lines.map((line, i) => (
            <span key={line} aria-hidden className={i === t.lines.length - 1 ? "block text-azure" : "block"}>
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
          <div>
            <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed">{t.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contact" className="pill bg-ink text-bone">
                {t.primary} <span aria-hidden>→</span>
              </a>
              <a href="#sectors" className="pill border border-ink/30 text-ink">
                {t.secondary}
              </a>
            </div>
          </div>

          <div className="relative lg:-mt-[2vw] lg:ml-auto lg:w-[min(40vw,620px)] [perspective:1500px]">
            <m.div
              style={reduced ? undefined : { y: photoY }}
              className="absolute -top-[18%] right-[2%] z-0 w-[36%] bg-bone p-[1.2%] shadow-[0_40px_80px_-20px_rgba(10,10,18,0.55)] motion-safe:[transform:rotateZ(7deg)_rotateY(-14deg)] lg:-top-[58%]"
            >
              <Image
                src={health.image}
                alt={dict.industries.healthcare.alt}
                sizes="(min-width: 1024px) 18vw, 34vw"
                preload
                className="aspect-[4/5] w-full object-cover"
                style={{ objectPosition: health.heroFocus ?? health.focus }}
              />
            </m.div>
            <m.div
              style={reduced ? undefined : { y: windowY }}
              className="relative z-10 rounded-[14px] shadow-[0_70px_110px_-30px_rgba(10,10,18,0.6)] motion-safe:[transform:rotateY(-18deg)_rotateX(7deg)_rotateZ(-4deg)] lg:rounded-[18px]"
            >
              <Fit className="overflow-hidden rounded-[inherit]">
                <HealthcareWindow step={last} locale={locale} simulation={dict.experience.simulation} />
              </Fit>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
