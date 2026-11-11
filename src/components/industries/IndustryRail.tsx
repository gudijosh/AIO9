"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { industries } from "@/data/industries";
import { cn } from "@/lib/cn";

/**
 * Industry selector (ARIA tabs). A numbered rail with a progress line on
 * large screens; a horizontally scrolling row of pills on small ones.
 */
export function IndustryRail({
  active,
  progress,
  onSelect,
  tabRefs,
  copy,
  label,
}: {
  active: number;
  /** Progress of the active demonstration, 0–1. */
  progress: number;
  onSelect: (index: number, focus?: boolean) => void;
  tabRefs: React.RefObject<Array<HTMLButtonElement | null>>;
  copy: Dictionary["industries"];
  label: string;
}) {
  const last = industries.length - 1;
  const onKeyDown = (event: React.KeyboardEvent) => {
    const target =
      event.key === "ArrowRight"
        ? Math.min(last, active + 1)
        : event.key === "ArrowLeft"
          ? Math.max(0, active - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    onSelect(target, true);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:p-0"
    >
      {industries.map((industry, i) => {
        const selected = i === active;
        return (
          <button
            key={industry.id}
            ref={(node) => {
              tabRefs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={`industry-tab-${industry.id}`}
            aria-selected={selected}
            aria-controls="industry-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(i)}
            className={cn(
              "group relative flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap transition-colors duration-200",
              "lg:h-auto lg:flex-col lg:items-start lg:gap-1 lg:rounded-none lg:border-0 lg:px-0 lg:pt-4 lg:pb-1 lg:text-left lg:whitespace-normal",
              selected
                ? "border-white bg-white text-midnight lg:bg-transparent lg:text-white"
                : "border-white/15 text-white/65 hover:text-white",
            )}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-white/15 lg:block">
              <span
                className="absolute inset-0 origin-left bg-white transition-transform duration-500 ease-signal"
                style={{ transform: `scaleX(${selected ? progress : i < active ? 1 : 0})` }}
              />
            </span>
            <span
              className={cn(
                "font-mono text-[12px]",
                selected ? "text-slate-600 lg:text-signal-300" : "text-slate",
              )}
            >
              {industry.number}
            </span>
            <span className="font-medium lg:text-[13px] lg:leading-snug xl:text-sm">
              {copy[industry.id].name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
