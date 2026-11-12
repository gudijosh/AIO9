"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { heroIndustryIds, industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { Drift } from "@/components/flow/parallax";
import { HeroApp } from "./HeroApp";
import { WipeStack, type WipeImage } from "@/components/industries/WipeStack";

const ROTATE_MS = 4200;

/** Where each frame sits, how it looks, and how fast it leaves on scroll. */
const frames = [
  // Front frame: revealed with a mask on load.
  {
    place: "left-[8%] top-[9%] z-20 h-[80%] w-[72%]",
    look: "rounded-[28px] animate-unmask [animation-delay:300ms]",
    speed: -0.03,
  },
  // Two frames peeking from behind hint at the other industries.
  {
    place: "right-0 top-0 z-10 h-[46%] w-[42%]",
    look: "rounded-[22px] animate-rise [animation-delay:650ms]",
    speed: -0.12,
  },
  {
    place: "bottom-0 left-0 z-10 h-[38%] w-[38%]",
    look: "rounded-[22px] animate-rise [animation-delay:780ms]",
    speed: 0.08,
  },
];

/**
 * Three layered photographs that trade places, with a small floating window
 * showing the active industry's own software.
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
            // The photo is landscape but the frame is portrait, so the visible crop
            // comes from an image roughly 2.4× wider than the frame itself.
            sizes={
              slot === 0
                ? "(min-width: 1024px) 960px, 180vw"
                : "(min-width: 1024px) 560px, 110vw"
            }
            preloadFirst={slot === 0}
          />
        );
        return (
          <Drift key={slot} speed={frame.speed} className={cn("absolute", frame.place)}>
            {slot === 0 ? (
              <div
                className={cn(
                  "relative size-full overflow-hidden border border-white shadow-glass",
                  frame.look,
                )}
              >
                {stack}
              </div>
            ) : (
              <button
                type="button"
                aria-label={`${t.show}: ${industries[heroIndustryIds[index]].name}`}
                onClick={() => {
                  setActive(index);
                  setPaused(true);
                }}
                className={cn(
                  "group relative block size-full overflow-hidden border border-white shadow-glass",
                  frame.look,
                )}
              >
                {stack}
                <span className="absolute inset-0 z-10 bg-cream/45 transition-opacity duration-300 group-hover:opacity-0" />
              </button>
            )}
          </Drift>
        );
      })}

      <Drift speed={-0.07} className="absolute right-0 bottom-[3%] z-30 w-[min(300px,78%)]">
        <div className="animate-rise [animation-delay:950ms]">
          <HeroApp
            ids={heroIndustryIds}
            active={active}
            industries={industries}
            action={
              reduced ? undefined : (
                <button
                  type="button"
                  aria-label={paused ? t.play : t.pause}
                  onClick={() => setPaused((value) => !value)}
                  className="grid size-7 shrink-0 place-items-center rounded-md opacity-70 transition-opacity duration-200 hover:opacity-100"
                >
                  {paused ? (
                    <Play aria-hidden className="size-3.5" />
                  ) : (
                    <Pause aria-hidden className="size-3.5" />
                  )}
                </button>
              )
            }
          />
        </div>
      </Drift>
    </div>
  );
}
