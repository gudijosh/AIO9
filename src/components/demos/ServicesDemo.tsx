"use client";

import * as m from "motion/react-m";
import { FileText, UserCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { Chip } from "./primitives/Chip";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Panel, PanelTitle, Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["services"]["demo"];

/** Widths of the text lines on the page thumbnail; `true` marks an extracted field. */
const LINES: Array<[width: string, field: boolean]> = [
  ["62%", false],
  ["88%", true],
  ["94%", false],
  ["70%", false],
  ["82%", true],
  ["96%", false],
  ["54%", false],
  ["76%", true],
  ["90%", false],
];

/** Document → type → extracted fields → tags → summary → human review. */
export function ServicesDemo({ step, t }: { step: number; t: Copy }) {
  const scanning = step === 1 || step === 2;

  return (
    <DemoFrame>
      <Connector when={step >= 2} d="M 15 30 C 50 30, 50 22, 85 22" />
      <Connector when={step >= 4} axis="y" d="M 85 30 L 85 82" />

      <Panel
        tone="light"
        when={step >= 0}
        className="lg:absolute lg:top-7 lg:left-7 lg:w-[226px] lg:-rotate-2"
      >
        <div className="flex items-center gap-2">
          <FileText aria-hidden className="size-4 shrink-0 text-signal" />
          <div className="min-w-0">
            <p className="truncate font-mono text-[11.5px] font-medium">{t.file}</p>
            <p className="text-[10.5px] text-slate-600">{t.pages}</p>
          </div>
        </div>
        <div className="relative mt-3 overflow-hidden rounded-md border border-midnight/8 bg-cloud p-3">
          <div className="flex flex-col gap-[7px] max-lg:[&>*:nth-child(n+6)]:hidden">
            {LINES.map(([width, field], i) => (
              <span
                key={i}
                style={{ width }}
                className={cn(
                  "h-[5px] rounded-full transition-colors duration-500",
                  field && step >= 2 ? "bg-signal" : "bg-midnight/14",
                )}
              />
            ))}
          </div>
          {scanning && (
            <m.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-full border-b-2 border-signal bg-linear-to-b from-transparent to-signal/15"
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
            />
          )}
        </div>
        <div className="mt-3 flex h-[22px] items-center">
          {step >= 1 ? <Chip tone="soft">{t.type}</Chip> : <Chip tone="ink">{t.received}</Chip>}
        </div>
      </Panel>

      <Panel when={step >= 2} className="lg:absolute lg:top-6 lg:right-6 lg:w-[262px]">
        <PanelTitle>{t.extracted}</PanelTitle>
        <dl className="mt-2 flex flex-col text-[12px]">
          {t.fields.map((field, i) => (
            <Show
              key={field}
              when={step >= 2}
              delay={0.2 + i * 0.18}
              className="flex items-center justify-between border-b border-white/8 py-1.5 last:border-0"
            >
              <dt className="text-white/60">{field}</dt>
              <dd className="font-medium">{t.values[i]}</dd>
            </Show>
          ))}
        </dl>
        <Show when={step >= 3} className="mt-2 flex flex-wrap gap-1.5">
          {t.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </Show>
      </Panel>

      <Panel when={step >= 4} className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[300px]">
        <PanelTitle>{t.summaryLabel}</PanelTitle>
        <p className="mt-1.5 text-[12.5px] leading-snug text-white/90">{t.summary}</p>
        <Show
          when={step >= 5}
          className="mt-3 flex items-center gap-2 rounded-lg bg-white/94 px-2.5 py-2 text-midnight"
        >
          <UserCheck aria-hidden className="size-4 shrink-0 text-signal" />
          <span className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold">{t.review}</span>
            <span className="text-[11px] text-slate-600">{t.reviewer}</span>
          </span>
        </Show>
      </Panel>
    </DemoFrame>
  );
}
