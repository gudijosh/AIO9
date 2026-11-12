"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import type { Industry } from "@/data/industries";
import type { Dictionary } from "@/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useDemoTimeline } from "@/lib/useDemoTimeline";
import { DemoRenderer } from "@/components/demos/DemoRenderer";
import { DemoControls } from "@/components/industries/DemoControls";
import { StepTrack } from "@/components/industries/StepTrack";
import { Layer } from "./parallax";
import { Tile } from "./Tile";

/**
 * One industry in the mosaic: a product-style photograph that sets the scene
 * with its live demonstration floating over it, a glass tile that names the problem, and a glass tile with
 * the step-by-step progress. The demonstration plays when the photograph is
 * on screen.
 */
export function IndustryChapter({
  industry,
  count,
  reversed,
  copy,
  t,
  ref,
}: {
  industry: Industry;
  count: number;
  /** Mirrors the layout so consecutive chapters don't repeat. */
  reversed: boolean;
  copy: Dictionary["industries"];
  t: Dictionary["experience"];
  ref: React.Ref<HTMLElement>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const timeline = useDemoTimeline({
    durations: industry.stepDurations,
    resetKey: industry.id,
    enabled: inView,
  });
  const text = copy[industry.id];
  const headingId = `industry-${industry.id}`;

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      className={cn(
        "grid gap-5 lg:h-(--tile-h) lg:shrink-0 lg:grid-rows-[1fr_auto] lg:gap-6",
        reversed
          ? "lg:grid-cols-[340px_var(--stage-w)]"
          : "lg:grid-cols-[var(--stage-w)_340px]",
      )}
    >
      <Tile
        drift={-0.55}
        lift={-0.5}
        className={cn(
          "flex flex-col p-7 lg:row-start-1 lg:p-8",
          reversed ? "lg:col-start-1" : "lg:col-start-2",
        )}
      >
        <p className="font-mono text-[13px] text-slate-600">
          {industry.number} <span className="text-slate-600">/ 0{count}</span>
        </p>
        <h3
          id={headingId}
          className="mt-4 text-[clamp(1.75rem,2.3vw,2.375rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance"
        >
          {text.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-slate-600">{text.description}</p>
        <a
          href="#contact"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("aio9:industry", { detail: industry.id }))
          }
          className="mt-auto inline-block self-start pt-5 pb-1 text-[15px] font-medium underline decoration-midnight/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-midnight"
        >
          {t.consult}
        </a>
      </Tile>

      <Tile
        ref={stageRef}
        surface="paper"
        tilt={0.6}
        className={cn(
          "relative overflow-hidden lg:row-span-2 lg:row-start-1",
          reversed ? "lg:col-start-2" : "lg:col-start-1",
        )}
      >
        {/* The photograph slides inside its frame; the demo panels float the other way. */}
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
          <Layer shift={-48} zoom={1.13} className="absolute inset-0">
            <Image
              src={industry.image}
              alt={text.alt}
              fill
              sizes="(min-width: 1024px) 1100px, 120vw"
              quality={85}
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: industry.focus }}
            />
          </Layer>
          {/* Small screens: fade the photo into the tile so the panels below sit on one surface. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-paper to-transparent lg:hidden" />
          <p className="absolute top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-midnight/85 px-3 py-1 text-[11px] whitespace-nowrap text-white">
            {t.simulation}
          </p>
        </div>
        <Layer
          shift={26}
          aria-hidden
          className="relative z-10 -mt-4 min-h-[25rem] pb-3 sm:min-h-[20rem] lg:absolute lg:inset-0 lg:mt-0 lg:min-h-0 lg:pb-0"
        >
          <DemoRenderer id={industry.id} step={timeline.step} industries={copy} />
        </Layer>
        <ol className="sr-only">
          {text.steps.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ol>
      </Tile>

      <Tile
        drift={0.45}
        lift={0.5}
        className={cn(
          "flex flex-col gap-4 p-6 lg:row-start-2",
          reversed ? "lg:col-start-1" : "lg:col-start-2",
        )}
      >
        <StepTrack timeline={timeline} steps={text.steps} t={t} />
        <DemoControls
          name={text.name}
          t={t}
          timeline={{
            ...timeline,
            replay: () => {
              track({ name: "demo_replay", industry: industry.id });
              timeline.replay();
            },
          }}
        />
      </Tile>
    </article>
  );
}
