"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Pause, Play } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { heroIndustryIds, industryById } from "@/data/industries";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { WipeStack, type WipeImage } from "@/components/industries/WipeStack";

const ROTATE_MS = 4200;

const frames = [
  // Front frame: revealed with a mask on load.
  "left-[8%] top-[9%] z-20 h-[80%] w-[72%] rounded-[28px] animate-unmask [animation-delay:300ms]",
  // Two frames peeking from behind hint at the other industries.
  "right-0 top-0 z-10 h-[46%] w-[42%] rounded-[22px] animate-rise [animation-delay:650ms]",
  "bottom-0 left-0 z-10 h-[38%] w-[38%] rounded-[22px] animate-rise [animation-delay:780ms]",
];

/**
 * Three layered photographs that trade places, with a small floating
 * interface naming the transformation of the active case.
 */
export function HeroStack({
  t,
  industries,
}: {
  t: Dictionary["hero"];
  industries: Dictionary["industries"];
}) {
  const reduced = usePrefersReducedMotion();
  const count = heroIndustryIds.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rotating = !paused && !reduced;

  useEffect(() => {
    if (!rotating) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((value) => (value + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [rotating, count]);

  const images: WipeImage[] = heroIndustryIds.map((id) => ({
    key: id,
    src: industryById[id].image,
    alt: industries[id].alt,
    focus: industryById[id].focus,
  }));
  const current = industries[heroIndustryIds[active]];

  return (
    <div
      role="group"
      aria-label={t.stackLabel}
      className="relative mx-auto aspect-[5/6] w-full max-w-[420px] lg:mr-0 lg:max-w-[min(540px,calc((100svh-10rem)*0.82))]"
    >
      {frames.map((frame, slot) => {
        const index = (active + slot) % count;
        const stack = (
          <WipeStack
            images={images}
            active={index}
            sizes={slot === 0 ? "(min-width: 1024px) 390px, 72vw" : "(min-width: 1024px) 230px, 40vw"}
            preloadFirst={slot === 0}
          />
        );
        if (slot === 0) {
          return (
            <div key={slot} className={cn("absolute overflow-hidden border border-white shadow-glass", frame)}>
              {stack}
            </div>
          );
        }
        return (
          <button
            key={slot}
            type="button"
            aria-label={`${t.show}: ${industries[heroIndustryIds[index]].name}`}
            onClick={() => {
              setActive(index);
              setPaused(true);
            }}
            className={cn("group absolute overflow-hidden border border-white shadow-glass", frame)}
          >
            {stack}
            <span className="absolute inset-0 z-10 bg-cream/45 transition-opacity duration-300 group-hover:opacity-0" />
          </button>
        );
      })}

      <div className="absolute right-0 bottom-[3%] z-30 w-[min(300px,78%)] glass animate-rise rounded-2xl p-4 [animation-delay:950ms]">
        <div className="flex items-start justify-between gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={heroIndustryIds[active]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease }}
              className="min-w-0 flex-1"
            >
              <p className="truncate text-[12px] text-slate-600">{current.name}</p>
              <p className="mt-2 text-[13px] font-medium text-slate-600">{current.from}</p>
              <span aria-hidden className="my-1.5 flex items-center gap-[3px] text-signal">
                <span className="size-[5px] rounded-full bg-current" />
                <span className="relative h-px flex-1 bg-midnight/15">
                  <m.span
                    className="absolute inset-0 origin-left bg-current"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, ease, delay: 0.2 }}
                  />
                </span>
                <m.span
                  className="size-[7px] bg-current"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 1 }}
                />
              </span>
              <p className="text-[15px] font-medium">{current.to}</p>
            </m.div>
          </AnimatePresence>
          {!reduced && (
            <button
              type="button"
              aria-label={paused ? t.play : t.pause}
              onClick={() => setPaused((value) => !value)}
              className="-mt-1.5 -mr-1.5 grid size-9 shrink-0 place-items-center rounded-full text-slate-600 transition-colors duration-200 hover:bg-midnight/8 hover:text-midnight"
            >
              {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
