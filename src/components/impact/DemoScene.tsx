"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { useInView } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDemoTimeline } from "@/lib/useDemoTimeline";
import { cn } from "@/lib/cn";
import { LedWord } from "./LedWord";
import { Drift, Fly } from "./Parallax";
import { Reveal } from "./Reveal";
import { Fit } from "./scroll/Fit";
import type { WindowProps } from "./windows/kit";

export type Side = "left" | "right";

export interface DemoSceneData {
  /** Value sent to the contact form when the visitor asks for this. */
  id: string;
  color: string;
  /** Short name, drawn in LED dots above the card. */
  word: string;
  title: string;
  description: string;
  durations: readonly number[];
  Window: ComponentType<WindowProps>;
}

/**
 * Frame of a window or picture. On phones the columns are narrow, so the
 * frame shows only one half of its content at twice the size: the left
 * column keeps the left half, the right column the right half.
 */
export function Half({
  side,
  color,
  whole = false,
  children,
}: {
  side: Side;
  color: string;
  /** Show the whole content on every screen (photos, which read badly cut in half). */
  whole?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{ boxShadow: `0 40px 80px -30px #000, 0 0 100px -34px ${color}` }}
      className={cn(
        "overflow-hidden lg:rounded-[14px]",
        side === "left" ? "rounded-l-[10px]" : "rounded-r-[10px]",
      )}
    >
      <div
        className={cn(
          whole ? "w-full" : "w-[200%] lg:w-full",
          !whole && side === "right" && "-ml-[100%] lg:ml-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A product window that runs by itself: it plays its story while on screen,
 * holds the result for a moment and starts over. With reduced motion it
 * shows the finished state.
 */
export function LiveWindow({
  id,
  Window,
  durations,
  locale,
  simulation,
}: {
  id: string;
  Window: ComponentType<WindowProps>;
  durations: readonly number[];
  locale: Locale;
  simulation: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { amount: 0.4 });
  const { step } = useDemoTimeline({
    durations,
    resetKey: id,
    enabled: live,
    loopAfter: 2200,
  });
  return (
    <div ref={ref} data-step={step}>
      <Fit>
        <Window step={step} locale={locale} simulation={simulation} />
      </Fit>
    </div>
  );
}

/**
 * One sector as a column: its name in LED dots in its own colour, one short
 * line on what the solution does, and its software running by itself.
 */
export function DemoScene({
  data,
  side,
  locale,
  dict,
}: {
  data: DemoSceneData;
  side: Side;
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.experience;
  const wait = side === "right" ? 160 : 0;

  return (
    <article
      aria-labelledby={`scene-${data.id}`}
      className={cn(
        "relative flex min-w-0 flex-col py-12 lg:px-10 lg:py-20 xl:px-14",
        side === "left" ? "pr-0 pl-4" : "pr-4 pl-0",
      )}
    >
      <Drift speed={-36} className={cn("lg:px-0", side === "right" && "pl-4")}>
        <Reveal from={side} delay={wait}>
          <LedWord word={data.word} color={data.color} />
        </Reveal>
        <Reveal from={side} delay={wait + 160}>
          <h3
            id={`scene-${data.id}`}
            className="display mt-3 pr-3 text-[clamp(1.5rem,3.9vw,4rem)] text-balance lg:mt-5"
          >
            {data.title}
          </h3>
        </Reveal>
        <Reveal from="up" delay={wait + 280}>
          <p className="mt-2 max-w-[46ch] pr-3 text-[13px] leading-snug text-fog lg:mt-4 lg:text-base lg:leading-relaxed">
            {data.description}
          </p>
        </Reveal>
      </Drift>

      <Fly from={side} className="mt-6 lg:mt-9">
        <Half side={side} color={data.color}>
          <LiveWindow
            id={data.id}
            Window={data.Window}
            durations={data.durations}
            locale={locale}
            simulation={t.simulation}
          />
        </Half>
      </Fly>

      <Reveal
        from="up"
        delay={wait + 200}
        className={cn("mt-6 lg:mt-8", side === "right" && "pl-4 lg:pl-0")}
      >
        <a
          href="#contact"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("aio9:industry", { detail: data.id }),
            )
          }
          className="pill bg-bone text-ink"
        >
          {t.consult} <span aria-hidden>→</span>
        </a>
      </Reveal>
    </article>
  );
}

/** Rows of two columns with a hairline between them, on every screen size. */
export function Pairs({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1700px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] [&>*]:border-t [&>*]:border-dim [&>*:nth-child(even)]:border-l">
      {children}
    </div>
  );
}
