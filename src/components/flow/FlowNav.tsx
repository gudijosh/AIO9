"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industries } from "@/data/industries";
import { cn } from "@/lib/cn";

const arrow =
  "grid size-10 place-items-center rounded-full text-midnight transition-colors duration-200 hover:bg-midnight/8 disabled:pointer-events-none disabled:opacity-30";

/** Floating glass control: jump to any industry, or step back and forward. */
export function FlowNav({
  active,
  accent,
  onSelect,
  copy,
  t,
}: {
  /** Index of the industry nearest the centre, or -1 outside the industries. */
  active: number;
  /** Colour of the industry on screen; the active pill takes it. */
  accent?: string;
  onSelect: (index: number) => void;
  copy: Dictionary["industries"];
  t: Dictionary["experience"];
}) {
  const last = industries.length - 1;
  const current = Math.max(0, active);
  return (
    <nav
      aria-label={t.railLabel}
      style={{ "--nav-accent": accent ?? "var(--color-midnight)" } as React.CSSProperties}
      className="glass absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-1 rounded-full p-1.5 lg:flex"
    >
      <button
        type="button"
        aria-label={t.prev}
        disabled={active <= 0}
        onClick={() => onSelect(current - 1)}
        className={arrow}
      >
        <ArrowLeft aria-hidden className="size-4" />
      </button>
      <ol className="flex items-center gap-1">
        {industries.map((industry, i) => {
          const selected = i === active;
          return (
            <li key={industry.id}>
              <button
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(i)}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-300",
                  selected ? "bg-(--nav-accent) text-white" : "text-slate-600 hover:bg-midnight/8 hover:text-midnight",
                )}
              >
                <span className="font-mono text-[12px]">{industry.number}</span>
                <span className={selected ? undefined : "sr-only"}>{copy[industry.id].name}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        aria-label={t.next}
        disabled={active >= last}
        onClick={() => onSelect(current + 1)}
        className={arrow}
      >
        <ArrowRight aria-hidden className="size-4" />
      </button>
    </nav>
  );
}
