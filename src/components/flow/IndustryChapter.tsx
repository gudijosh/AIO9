"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import type { Industry } from "@/data/industries";
import { themeVars } from "@/data/themes";
import type { Dictionary } from "@/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useDemoTimeline } from "@/lib/useDemoTimeline";
import { DemoRenderer } from "@/components/demos/DemoRenderer";
import { DemoControls } from "@/components/industries/DemoControls";
import { StepTrack } from "@/components/industries/StepTrack";
import { Layer, useTileProgress } from "./parallax";
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
  ref: React.RefCallback<HTMLElement> | React.RefObject<HTMLElement | null>;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const chapter = useTileProgress(articleRef);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const timeline = useDemoTimeline({
    durations: industry.stepDurations,
    resetKey: industry.id,
    enabled: inView,
  });
  const text = copy[industry.id];
  const ProductIcon = industry.icon;
  const headingId = `industry-${industry.id}`;

  return (
    <article
      ref={(node) => {
        articleRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      aria-labelledby={headingId}
      // Everything inside the chapter takes the colours of this industry's product.
      style={themeVars(industry.theme)}
      className={cn(
        "grid gap-5 lg:h-(--tile-h) lg:shrink-0 lg:grid-rows-[1fr_auto] lg:gap-6",
        reversed
          ? "lg:grid-cols-[340px_var(--stage-w)]"
          : "lg:grid-cols-[var(--stage-w)_340px]",
      )}
    >
      <Tile
        progress={chapter}
        from={{ x: reversed ? -260 : 240, y: -360, rotateX: 58, rotateZ: reversed ? 10 : -10, side: -1 }}
        surface="tint"
        className={cn(
          "flex flex-col p-7 lg:row-start-1 lg:p-8",
          reversed ? "lg:col-start-1" : "lg:col-start-2",
        )}
      >
        <p className="relative flex items-center gap-2 text-[13px] font-semibold text-(--tile-ink)">
          <span className="grid size-7 place-items-center rounded-lg bg-(--tile-ink) text-white">
            <ProductIcon aria-hidden className="size-4" />
          </span>
          {text.demo.app}
          <span className="ml-auto font-mono text-[12px] font-normal text-slate-600">
            {industry.number} / 0{count}
          </span>
        </p>
        <p className="relative mt-5 text-[12px] font-medium tracking-wide text-slate-600">{text.service}</p>
        <h3
          id={headingId}
          className="relative mt-1.5 text-[clamp(1.75rem,2.3vw,2.375rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance"
        >
          {text.title}
        </h3>
        <p className="relative mt-4 text-base leading-relaxed text-slate-600">{text.description}</p>
        <a
          href="#contact"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("aio9:industry", { detail: industry.id }))
          }
          className="relative mt-auto inline-block self-start pt-5 pb-1 text-[15px] font-semibold text-(--tile-ink) underline decoration-(--tile-ink)/40 underline-offset-[6px] transition-colors duration-200 hover:decoration-(--tile-ink)"
        >
          {t.consult}
        </a>
      </Tile>

      <Tile
        ref={stageRef}
        surface="paper"
        progress={chapter}
        from={{ x: 220, rotateY: -22, scale: 0.9, side: 1, fade: false }}
        className={cn(
          "relative overflow-hidden lg:row-span-2 lg:row-start-1",
          reversed ? "lg:col-start-2" : "lg:col-start-1",
        )}
      >
        {/* The photograph drifts slightly inside its frame as the chapter passes. */}
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
          <Layer shift={-22} zoom={1.07} className="absolute inset-0">
            <Image
              src={industry.image}
              alt={text.alt}
              fill
              sizes="(min-width: 1024px) 1150px, 150vw"
              quality={85}
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: industry.focus }}
            />
          </Layer>
          {/* Small screens: fade the photo into the tile so the panels below sit on one surface. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-paper to-transparent lg:hidden" />
        </div>
        <Layer
          shift={0}
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
        progress={chapter}
        from={{ x: reversed ? -220 : 300, y: 380, rotateX: -55, rotateZ: reversed ? -12 : 12, side: 1 }}
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
        <p className="text-[11.5px] text-slate-600">{t.simulation}</p>
      </Tile>
    </article>
  );
}
