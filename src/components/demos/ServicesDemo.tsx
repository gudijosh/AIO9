"use client";

import * as m from "motion/react-m";
import { Archive, FileSearch, FileText, Inbox, UserCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { AppWindow, IconRail, Toast } from "./primitives/AppWindow";
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
const RAIL = [Inbox, FileSearch, Archive];
/** How sure the extraction is about each field (bar length only, no figures shown). */
const CONFIDENCE = ["92%", "97%", "84%"];

/**
 * "Documents": a sober indigo workspace with an icon rail. A file arrives,
 * the viewer scans it, extracted fields fill the side panel with a confidence
 * bar each, and the summary is handed to a person for review.
 */
export function ServicesDemo({ step, t }: { step: number; t: Copy }) {
  const scanning = step === 1 || step === 2;

  return (
    <DemoFrame>
      <Connector when={step >= 4} axis="y" d="M 78 40 L 78 82" />

      <Toast
        when={step >= 0}
        icon={Inbox}
        title={t.received}
        detail={t.file}
        className="lg:absolute lg:top-6 lg:right-6 lg:w-[232px]"
      />

      <AppWindow
        when={step >= 0}
        delay={0.15}
        title={t.app}
        icon={industryById.services.icon}
        right={step >= 1 ? <Chip tone="soft">{t.type}</Chip> : undefined}
        className="lg:absolute lg:top-6 lg:left-6 lg:w-[416px]"
      >
        <div className="flex">
          <IconRail icons={RAIL} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 border-b border-(--win-line) px-3 py-1.5 text-[10.5px] text-(--win-muted)">
              {t.nav[0]}
              <span aria-hidden>/</span>
              <span className="truncate font-mono text-(--win-text)">{t.file}</span>
            </p>
            <div className="flex gap-3 p-3">
              <div className="w-[36%] shrink-0">
                <p className="flex items-center gap-1 truncate text-[10px] text-(--win-muted)">
                  <FileText aria-hidden className="size-3 shrink-0 text-(--app-ink)" />
                  {t.pages}
                </p>
                <div className="relative mt-1.5 overflow-hidden rounded-md border border-(--win-line) bg-(--win-chrome) p-2.5">
                  <div className="flex flex-col gap-[7px] max-lg:[&>*:nth-child(n+7)]:hidden">
                    {LINES.map(([width, field], i) => (
                      <span
                        key={i}
                        style={{ width }}
                        className={cn(
                          "h-[5px] rounded-full transition-colors duration-500",
                          field && step >= 2 ? "bg-(--app)" : "bg-(--win-fill)",
                        )}
                      />
                    ))}
                  </div>
                  {scanning && (
                    <m.span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-full border-b-2 border-(--app) bg-linear-to-b from-transparent to-(--app-soft)"
                      initial={{ y: "-100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center justify-between text-[12px] font-semibold">
                  {t.extracted}
                  <span className="text-[9.5px] font-normal text-(--win-muted)">{t.confidence}</span>
                </p>
                <dl className="mt-1 flex flex-col text-[11.5px]">
                  {t.fields.map((field, i) => (
                    <Show
                      key={field}
                      when={step >= 2}
                      delay={0.2 + i * 0.18}
                      className="grid grid-cols-[1fr_auto_34px] items-center gap-2 border-b border-(--win-line) py-1.5"
                    >
                      <dt className="text-(--win-muted)">{field}</dt>
                      <dd className="font-medium">{t.values[i]}</dd>
                      <span className="h-1 overflow-hidden rounded-full bg-(--win-fill)">
                        <span className="block h-full rounded-full bg-(--app)" style={{ width: CONFIDENCE[i] }} />
                      </span>
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
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 4}
        title={t.summaryLabel}
        icon={FileText}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[304px]"
      >
        <div className="p-3">
          <p className="border-l-2 border-(--app) pl-2.5 text-[12.5px] leading-snug">{t.summary}</p>
          <Show
            when={step >= 5}
            className="mt-3 flex items-center gap-2 rounded-lg bg-(--app) px-2.5 py-2 text-(--app-on)"
          >
            <UserCheck aria-hidden className="size-4 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold">{t.review}</span>
              <span className="text-[11px] opacity-90">{t.reviewer}</span>
            </span>
          </Show>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
