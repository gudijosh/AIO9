"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  useInView,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import * as m from "motion/react-m";
import type { Dictionary } from "@/i18n/dictionaries";
import { industries } from "@/data/industries";
import { ease } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { useDemoTimeline } from "@/lib/useDemoTimeline";
import { DemoRenderer } from "@/components/demos/DemoRenderer";
import { DemoControls } from "./DemoControls";
import { IndustryRail } from "./IndustryRail";
import { StepTrack } from "./StepTrack";
import { WipeStack, type WipeImage } from "./WipeStack";

const COUNT = industries.length;
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

/**
 * The centrepiece. On large screens the section pins and scrolling moves
 * through the six industries; the rail, the arrows and the keyboard do the
 * same by scrolling to the matching position, so scroll stays the single
 * source of truth. On small screens nothing pins: it is a tap / swipe carousel.
 */
export function IndustryExperience({
  t,
  copy,
}: {
  t: Dictionary["experience"];
  copy: Dictionary["industries"];
}) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lockRef = useRef<{ index: number; until: number } | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const [view, setView] = useState<{ active: number; direction: 1 | -1 }>({ active: 0, direction: 1 });
  const { active, direction } = view;

  const show = useCallback((index: number) => {
    setView((current) =>
      current.active === index
        ? current
        : { active: index, direction: index > current.active ? 1 : -1 },
    );
  }, []);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!isDesktop()) return;
    const index = Math.min(COUNT - 1, Math.max(0, Math.floor(value * COUNT)));
    const lock = lockRef.current;
    if (lock) {
      // While a click-initiated scroll is travelling, skip the industries in between.
      if (index !== lock.index && performance.now() < lock.until) return;
      lockRef.current = null;
    }
    show(index);
  });

  const go = useCallback(
    (index: number, focus = false) => {
      const next = Math.min(COUNT - 1, Math.max(0, index));
      show(next);
      track({ name: "industry_view", industry: industries[next].id });
      const element = trackRef.current;
      if (element && isDesktop()) {
        const top = element.getBoundingClientRect().top + window.scrollY;
        const range = element.offsetHeight - window.innerHeight;
        lockRef.current = { index: next, until: performance.now() + 1400 };
        window.scrollTo({ top: top + range * ((next + 0.5) / COUNT) });
      } else {
        tabRefs.current[next]?.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: reduced ? "auto" : "smooth",
        });
      }
      if (focus) tabRefs.current[next]?.focus({ preventScroll: true });
    },
    [show, reduced],
  );

  const industry = industries[active];
  const text = copy[industry.id];
  const inView = useInView(stageRef, { amount: 0.3 });
  const timeline = useDemoTimeline({
    durations: industry.stepDurations,
    resetKey: industry.id,
    enabled: inView,
  });

  const images: WipeImage[] = industries.map((item) => ({
    key: item.id,
    src: item.image,
    alt: copy[item.id].alt,
    focus: item.focus,
  }));

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || isDesktop()) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section id="industries" aria-labelledby="industries-heading" className="bg-midnight">
      <div className="mx-auto max-w-[1600px] px-5 pt-24 lg:px-10 lg:pt-40 lg:pb-10">
        <h2
          id="industries-heading"
          className="max-w-[17ch] text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance"
        >
          {t.heading}
        </h2>
        <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-white/70 lg:text-lg">
          {t.intro}
        </p>
      </div>

      {/* 70vh of scroll per industry on large screens. */}
      <div ref={trackRef} className="mt-10 lg:mt-0 lg:h-[calc(100svh+420vh)]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:min-h-[680px] lg:flex-col">
          <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-[minmax(0,1fr)] gap-y-6 px-5 pb-20 lg:min-h-0 lg:grid-cols-[minmax(300px,0.36fr)_1fr] lg:grid-rows-[1fr_auto_auto] lg:gap-x-12 lg:gap-y-7 lg:px-10 lg:pt-[96px] lg:pb-7">
            <div className="min-w-0 lg:col-span-2 lg:row-start-3">
              <IndustryRail
                active={active}
                progress={(timeline.step + 1) / timeline.total}
                onSelect={go}
                tabRefs={tabRefs}
                copy={copy}
                label={t.railLabel}
              />
            </div>

            <div
              role="tabpanel"
              id="industry-panel"
              aria-labelledby={`industry-tab-${industry.id}`}
              className="min-h-[15.5rem] min-w-0 sm:min-h-0 lg:col-start-1 lg:row-start-1 lg:self-center"
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={industry.id}
                  initial="hidden"
                  animate="shown"
                  exit="gone"
                  variants={{
                    hidden: {},
                    shown: { transition: { staggerChildren: 0.06 } },
                    gone: { opacity: 0, y: -10, transition: { duration: 0.18 } },
                  }}
                >
                  <m.p variants={line} className="font-mono text-[13px] text-slate">
                    {industry.number} <span className="text-slate/80">/ 0{COUNT}</span>
                  </m.p>
                  <h3 className="mt-4 overflow-hidden pb-1 text-[clamp(1.875rem,3.3vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
                    <m.span variants={mask} className="block">
                      {text.title}
                    </m.span>
                  </h3>
                  <m.p
                    variants={line}
                    className="mt-4 max-w-[40ch] text-base leading-relaxed text-white/70 lg:mt-5 lg:text-[17px]"
                  >
                    {text.description}
                  </m.p>
                  <m.a
                    variants={line}
                    href="#contact"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("aio9:industry", { detail: industry.id }))
                    }
                    className="mt-5 inline-block py-2 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-white"
                  >
                    {t.consult}
                  </m.a>
                </m.div>
              </AnimatePresence>
            </div>

            <div
              ref={stageRef}
              onTouchStart={(event) => {
                touchRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
              }}
              onTouchEnd={onTouchEnd}
              className="relative min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-[28px]">
                <WipeStack
                  images={images}
                  active={active}
                  direction={direction}
                  sizes="(min-width: 1024px) 64vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-midnight/75 via-midnight/15 to-midnight/30" />
                <p className="absolute top-3.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-midnight/60 px-3 py-1 text-[11px] whitespace-nowrap text-white/80 backdrop-blur-md">
                  {t.simulation}
                </p>
              </div>
              <div
                aria-hidden
                className="relative z-20 -mt-14 min-h-[25rem] sm:-mt-24 sm:min-h-0 lg:absolute lg:inset-0 lg:mt-0"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={industry.id}
                    className="lg:h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    <DemoRenderer id={industry.id} step={timeline.step} industries={copy} />
                  </m.div>
                </AnimatePresence>
              </div>
              <ol className="sr-only">
                {text.steps.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ol>
            </div>

            <div className="flex min-w-0 flex-col gap-5 lg:col-start-1 lg:row-start-2">
              <StepTrack timeline={timeline} steps={text.steps} t={t} />
              <DemoControls
                timeline={{
                  ...timeline,
                  replay: () => {
                    track({ name: "demo_replay", industry: industry.id });
                    timeline.replay();
                  },
                }}
                onPrev={() => go(active - 1)}
                onNext={() => go(active + 1)}
                hasPrev={active > 0}
                hasNext={active < COUNT - 1}
                t={t}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const line = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const mask = {
  hidden: { y: "105%" },
  shown: { y: "0%", transition: { duration: 0.65, ease } },
};
