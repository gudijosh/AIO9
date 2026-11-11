"use client";

import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import type { DemoTimeline } from "@/lib/useDemoTimeline";
import type { Dictionary } from "@/i18n/dictionaries";

const round =
  "grid size-11 place-items-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/8 disabled:pointer-events-none disabled:opacity-30";

/** Previous / next industry and play, pause or replay of the current demo. */
export function DemoControls({
  timeline,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  t,
}: {
  timeline: DemoTimeline;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  t: Dictionary["experience"];
}) {
  const { done, playing, replay, toggle } = timeline;
  const label = done ? t.replay : playing ? t.pause : t.play;
  const Icon = done ? RotateCcw : playing ? Pause : Play;
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={t.prev} onClick={onPrev} disabled={!hasPrev} className={round}>
        <ArrowLeft aria-hidden className="size-4" />
      </button>
      <button type="button" aria-label={t.next} onClick={onNext} disabled={!hasNext} className={round}>
        <ArrowRight aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        onClick={done ? replay : toggle}
        className="ml-auto inline-flex h-11 items-center gap-2 rounded-full border border-white/15 pr-5 pl-4 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/8"
      >
        <Icon aria-hidden className="size-3.5" />
        {label}
      </button>
    </div>
  );
}
