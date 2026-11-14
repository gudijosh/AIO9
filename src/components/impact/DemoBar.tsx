"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import type { DemoTimeline } from "@/lib/useDemoTimeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

/**
 * Controls of one demonstration on the dark scenes: play / pause / replay,
 * the current step in words, and one segment per step that jumps to it.
 */
export function DemoBar({
  timeline,
  steps,
  name,
  color,
  t,
}: {
  timeline: DemoTimeline;
  steps: readonly string[];
  /** Sector name, added to the accessible labels. */
  name: string;
  color: string;
  t: Dictionary["experience"];
}) {
  const { step, total, done, playing, replay, toggle, goTo } = timeline;
  const label = done ? t.replay : playing ? t.pause : t.play;
  const Icon = done ? RotateCcw : playing ? Pause : Play;
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label={`${label}: ${name}`}
        onClick={done ? replay : toggle}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-bone/30 text-bone transition-colors duration-200 hover:border-volt hover:text-volt"
      >
        <Icon aria-hidden className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] leading-5 text-bone" aria-live="off">
          <span className="font-mono text-[11px] text-fog tabular-nums">{fill(t.stepOf, { n: step + 1, total })}</span>
          <span className="mx-2 text-fog">·</span>
          {steps[step]}
        </p>
        <div role="group" aria-label={`${t.stepsLabel}: ${name}`} className="mt-1 flex gap-1">
          {steps.map((text, i) => (
            <button
              key={text}
              type="button"
              aria-label={`${fill(t.goToStep, { n: i + 1 })}: ${text}`}
              aria-current={i === step ? "step" : undefined}
              onClick={() => goTo(i)}
              className="group flex h-6 flex-1 items-center"
            >
              <span
                style={i <= step ? { background: color } : undefined}
                className={cn("h-[3px] w-full rounded-full transition-colors duration-300", i <= step ? "" : "bg-bone/20 group-hover:bg-bone/45")}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
