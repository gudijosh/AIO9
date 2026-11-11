"use client";

import { Check, TriangleAlert, UserCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { Working } from "./primitives/Bubble";
import { Chip } from "./primitives/Chip";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Panel, PanelTitle, Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["logistics"]["demo"];

/** Board counters [in transit, rescheduled, open exceptions] at each step. */
const BOARD: Array<[number, number, number]> = [
  [12, 0, 0],
  [12, 0, 0],
  [12, 0, 1],
  [12, 0, 1],
  [12, 0, 1],
  [12, 1, 0],
];
const EXCEPTION_CHECK = 2;

/** Order → checks → exception → suggested action → human approval → board. */
export function LogisticsDemo({ step, t }: { step: number; t: Copy }) {
  const counts = BOARD[Math.min(step, BOARD.length - 1)];

  return (
    <DemoFrame>
      <Connector when={step >= 3} axis="y" d="M 15 30 L 15 80" />
      <Connector when={step >= 5} d="M 20 84 L 85 84" />

      <Panel when={step >= 0} className="lg:absolute lg:top-6 lg:left-6 lg:w-[264px]">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[13px] font-semibold">{t.order}</p>
          <p className="text-[11.5px] text-white/60">{t.detail}</p>
        </div>
        <Show when={step >= 1} className="mt-3 border-t border-white/10 pt-2.5">
          <PanelTitle>{t.verify}</PanelTitle>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-[12px]">
            {t.checks.map((check, i) => {
              const isException = i === EXCEPTION_CHECK;
              const flagged = isException && step >= 2;
              return (
                <li key={check} className="flex h-[22px] items-center justify-between">
                  <span>{check}</span>
                  {flagged ? (
                    <Chip tone="amber">
                      <TriangleAlert aria-hidden className="size-3" />
                      {t.exception}
                    </Chip>
                  ) : isException ? (
                    <span className="flex items-center gap-1.5 text-[11px] text-white/60">
                      {t.pending}
                      <Working />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-white/70">
                      <Check aria-hidden className="size-3 text-signal-300" strokeWidth={3} />
                      {t.ok}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Show>
      </Panel>

      <Panel when={step >= 3} className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[290px]">
        <PanelTitle>{t.suggested}</PanelTitle>
        <p className="mt-1.5 text-[13px] leading-snug font-medium">{t.action}</p>
        <div className="mt-3 flex h-[22px] items-center">
          {step >= 4 ? (
            <Chip tone="blue">
              <UserCheck aria-hidden className="size-3" />
              {t.approved}
            </Chip>
          ) : (
            <Chip>{t.awaiting}</Chip>
          )}
        </div>
        <Show when={step >= 4} delay={0.3} className="mt-2 text-[11.5px] text-white/65">
          {t.owner}
        </Show>
      </Panel>

      <Panel
        tone="light"
        when={step >= 0}
        delay={0.2}
        className="max-lg:order-last lg:absolute lg:right-6 lg:bottom-6 lg:w-[236px]"
      >
        <PanelTitle className="text-slate-600 !opacity-100">{t.board}</PanelTitle>
        <dl className="mt-1.5 flex flex-col text-[12px]">
          {t.rows.map((row, i) => (
            <div
              key={row}
              className="flex items-center justify-between border-b border-midnight/8 py-1.5 last:border-0"
            >
              <dt className="text-slate-600">{row}</dt>
              <dd
                className={cn(
                  "grid h-6 min-w-6 place-items-center rounded-md px-1.5 font-mono text-[12px] font-semibold tabular-nums transition-colors duration-500",
                  i === 2 && counts[i] > 0
                    ? "bg-amber/25 text-[#8a5a0a]"
                    : i === 1 && counts[i] > 0
                      ? "bg-signal text-white"
                      : "bg-midnight/6",
                )}
              >
                {counts[i]}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
    </DemoFrame>
  );
}
