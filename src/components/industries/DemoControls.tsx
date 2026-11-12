"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import type { DemoTimeline } from "@/lib/useDemoTimeline";
import type { Dictionary } from "@/i18n/dictionaries";

/** Play, pause or replay the demonstration of one industry. */
export function DemoControls({
  timeline,
  name,
  t,
}: {
  timeline: DemoTimeline;
  /** Industry name, added to the accessible label. */
  name: string;
  t: Dictionary["experience"];
}) {
  const { done, playing, replay, toggle } = timeline;
  const label = done ? t.replay : playing ? t.pause : t.play;
  const Icon = done ? RotateCcw : playing ? Pause : Play;
  return (
    <button
      type="button"
      aria-label={`${label}: ${name}`}
      onClick={done ? replay : toggle}
      className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-(--tile-ink) pr-5 pl-4 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85"
    >
      <Icon aria-hidden className="size-3.5" />
      {label}
    </button>
  );
}
