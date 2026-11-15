"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { HeroCollage } from "./HeroCollage";
import { useMotionReady } from "./Parallax";

/** One headline line: rises from behind its baseline, then slides sideways on scroll. */
function Line({
  text,
  index,
  last,
  progress,
}: {
  text: string;
  index: number;
  last: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const ready = useMotionReady();
  const x = useTransform(
    progress,
    [0, 1],
    ["0vw", `${(index % 2 ? 1 : -1) * 16}vw`],
  );
  return (
    <m.span
      aria-hidden
      style={ready ? { x } : undefined}
      className="block overflow-hidden pt-[0.06em] -mt-[0.06em]"
    >
      <span
        style={{ animationDelay: `${0.95 + index * 0.14}s` }}
        className={
          last
            ? "block text-azure motion-safe:animate-[line-up_0.95s_var(--ease-signal)_both]"
            : "block motion-safe:animate-[line-up_0.95s_var(--ease-signal)_both]"
        }
      >
        {text}
      </span>
    </m.span>
  );
}

/**
 * Opening screen. When the curtain lifts, the headline rises line by line
 * and the collage flies in piece by piece. On scroll everything separates
 * into layers: the lines slide apart, the LED wordmark behind them turns and
 * sinks, and each piece of the collage climbs at its own speed. The first
 * dark section cuts across the bottom edge on a diagonal.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.hero;
  const ref = useRef<HTMLElement>(null);
  const ready = useMotionReady();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const lettersY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const lettersTurn = useTransform(scrollYProgress, [0, 1], [-16, 14]);
  const lettersTilt = useTransform(scrollYProgress, [0, 1], [20, 34]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden bg-bone pb-[18vw] text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [perspective:1200px]"
      >
        <m.div
          style={
            ready
              ? {
                  y: lettersY,
                  rotateY: lettersTurn,
                  rotateX: lettersTilt,
                  rotateZ: 2,
                }
              : { transform: "rotateX(20deg) rotateY(-16deg) rotateZ(2deg)" }
          }
          className="display absolute -top-[3vw] left-[1vw] origin-[35%_45%] text-[60vw] leading-[0.8] whitespace-nowrap select-none [transform-style:preserve-3d]"
        >
          {/* A soft blue halo that follows the outline of each letter… */}
          <span
            style={{ textShadow: "0 0 0.03em rgb(47 99 255 / 0.32), 0 0 0.08em rgb(47 99 255 / 0.16)" }}
            className="absolute inset-0 block text-transparent motion-safe:animate-[rise_1.6s_ease-out_1.2s_both]"
          >
            AIO9
          </span>
          {/* …around one layer of blue LED dots, which switches on with a flicker while a band of light sweeps across. */}
          <span
            style={{
              backgroundImage: "linear-gradient(105deg, #2f63ff 40%, #cfe0ff 50%, #2f63ff 60%)",
              backgroundSize: "300% 100%",
            }}
            className="dots relative block bg-clip-text text-transparent opacity-35 [mask-size:10px_10px] [background-position:-40%_0] motion-safe:animate-[led-on_1.3s_linear_0.9s_both,led-sweep_2.2s_var(--ease-signal)_1.3s_both]"
          >
            AIO9
          </span>
        </m.div>
      </div>

      <div className="mx-auto max-w-[1700px] px-5 pt-24 lg:px-10 lg:pt-[7.5rem] xl:px-14">
        <h1
          aria-label={t.title}
          className="display relative z-10 text-[clamp(2.75rem,12.6vw,13rem)]"
        >
          {t.lines.map((line, i) => (
            <Line
              key={line}
              text={line}
              index={i}
              last={i === t.lines.length - 1}
              progress={scrollYProgress}
            />
          ))}
        </h1>

        <div className="mt-8 grid gap-10 lg:mt-6 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-end">
          <m.div
            style={ready ? { y: copyY, opacity: copyFade } : undefined}
            className="relative z-10 lg:pb-[6vw]"
          >
            <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed motion-safe:animate-[rise_0.9s_var(--ease-signal)_1.45s_both]">
              {t.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 motion-safe:animate-[rise_0.9s_var(--ease-signal)_1.6s_both]">
              <a href="#contact" className="pill bg-ink text-bone">
                {t.primary} <span aria-hidden>→</span>
              </a>
              <a
                href="#industries"
                className="pill border border-ink/30 text-ink"
              >
                {t.secondary}
              </a>
            </div>
          </m.div>
          <div className="lg:-mt-[3vw] lg:ml-auto lg:w-[min(54vw,860px)]">
            <HeroCollage
              locale={locale}
              simulation={dict.experience.simulation}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
