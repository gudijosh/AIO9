"use client";

import * as m from "motion/react-m";
import { FileText, Inbox, UserCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { AppWindow, SideNav } from "./primitives/AppWindow";
import { Chip } from "./primitives/Chip";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["services"]["demo"];

/** Widths of the text lines on the page preview; `true` marks an extracted field. */
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
  ["66%", false],
];

/**
 * A document workspace: a file arrives in the inbox, the viewer scans it,
 * extracted fields fill the side panel, and the summary is handed to a person.
 */
export function ServicesDemo({ step, t }: { step: number; t: Copy }) {
  const scanning = step === 1 || step === 2;

  return (
    <DemoFrame>
      <Connector when={step >= 4} axis="y" d="M 78 40 L 78 82" />

      <Show
        when={step >= 0}
        className="flex items-center gap-2.5 rounded-xl border border-midnight/10 bg-white px-3 py-2.5 text-midnight shadow-float lg:absolute lg:top-6 lg:right-6 lg:w-[232px]"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-signal text-white">
          <Inbox aria-hidden className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-[12.5px] font-semibold">{t.received}</span>
          <span className="block truncate font-mono text-[10.5px] text-slate-600">{t.file}</span>
        </span>
      </Show>

      <AppWindow
        when={step >= 0}
        delay={0.15}
        title={t.app}
        badge={step >= 1 ? <Chip tone="soft">{t.type}</Chip> : undefined}
        className="lg:absolute lg:top-6 lg:left-6 lg:w-[416px]"
      >
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="flex min-w-0 flex-1 gap-3 p-3">
            <div className="w-[38%] shrink-0">
              <p className="flex items-center gap-1 truncate text-[10px] text-slate-600">
                <FileText aria-hidden className="size-3 shrink-0 text-signal" />
                {t.pages}
              </p>
              <div className="relative mt-1.5 overflow-hidden rounded-md border border-midnight/10 bg-cloud p-2.5">
                <div className="flex flex-col gap-[7px] max-lg:[&>*:nth-child(n+7)]:hidden">
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
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold">{t.extracted}</p>
              <dl className="mt-1 flex flex-col text-[11.5px]">
                {t.fields.map((field, i) => (
                  <Show
                    key={field}
                    when={step >= 2}
                    delay={0.2 + i * 0.18}
                    className="flex items-center justify-between gap-2 border-b border-midnight/8 py-1.5"
                  >
                    <dt className="text-slate-600">{field}</dt>
                    <dd className="font-medium">{t.values[i]}</dd>
                  </Show>
                ))}
              </dl>
              <Show when={step >= 3} className="mt-2 flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </Show>
            </div>
          </div>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 4}
        title={t.summaryLabel}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[304px]"
      >
        <div className="p-3">
          <p className="text-[12.5px] leading-snug">{t.summary}</p>
          <Show
            when={step >= 5}
            className="mt-3 flex items-center gap-2 rounded-lg bg-signal px-2.5 py-2 text-white"
          >
            <UserCheck aria-hidden className="size-4 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold">{t.review}</span>
              <span className="text-[11px] text-white/85">{t.reviewer}</span>
            </span>
          </Show>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
