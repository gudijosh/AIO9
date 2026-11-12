"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { DemoTimeline } from "@/lib/useDemoTimeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

/**
 * The AIO9 Signal as a progress control: a point (input), one segment per
 * real step of the simulation, and a square that fills when the action is
 * done. Each segment is a button that jumps to that step.
 */
export function StepTrack({
  timeline,
  steps,
  t,
}: {
  timeline: DemoTimeline;
  steps: readonly string[];
  t: Dictionary["experience"];
}) {
  const { step, total, done, goTo } = timeline;
  return (
    <div>
      <p className="font-mono text-[12px] text-slate-600 tabular-nums">
        {fill(t.stepOf, { n: step + 1, total })}
      </p>
      <div className="relative mt-1 h-6 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.p
            key={steps[step]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="truncate text-[15px] leading-6 font-medium"
          >
            {steps[step]}
          </m.p>
        </AnimatePresence>
      </div>
      <div role="group" aria-label={t.stepsLabel} className="mt-2 flex items-center gap-1 text-(--tile-ink)">
        <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-current" />
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-label={`${fill(t.goToStep, { n: i + 1 })}: ${label}`}
            aria-current={i === step ? "step" : undefined}
            onClick={() => goTo(i)}
            className="group flex h-8 flex-1 items-center"
          >
            <span
              className={cn(
                "h-[3px] w-full rounded-full transition-colors duration-300",
                i <= step ? "bg-(--tile-ink)" : "bg-midnight/12 group-hover:bg-midnight/30",
              )}
            />
          </button>
        ))}
        <span
          aria-hidden
          className={cn(
            "size-[9px] shrink-0 border border-current transition-colors duration-300",
            done ? "bg-current" : "bg-transparent",
          )}
        />
      </div>
    </div>
  );
}
