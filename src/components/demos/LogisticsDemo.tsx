"use client";

import { Check, ClipboardList, Lightbulb, TriangleAlert, UserCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { AppWindow, SideNav } from "./primitives/AppWindow";
import { Working } from "./primitives/Bubble";
import { Chip } from "./primitives/Chip";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["logistics"]["demo"];

/** Dashboard counters [in transit, rescheduled, open exceptions] at each step. */
const BOARD: Array<[number, number, number]> = [
  [12, 0, 0],
  [12, 0, 0],
  [12, 0, 1],
  [12, 0, 1],
  [12, 0, 1],
  [12, 1, 0],
];
const EXCEPTION_CHECK = 2;
/** Index into `statuses` for the tracked order at each step. */
const ORDER_STATUS = [0, 1, 2, 2, 2, 3];
/** Bar heights of the little activity chart on each counter (decorative). */
const SPARKS = [
  [5, 8, 6, 9, 7, 10, 8],
  [2, 3, 2, 4, 3, 3, 4],
  [1, 2, 1, 1, 3, 2, 1],
];

function Spark({ bars }: { bars: number[] }) {
  return (
    <svg viewBox="0 0 28 12" className="h-3 w-7 opacity-60" aria-hidden>
      {bars.map((height, i) => (
        <rect key={i} x={i * 4} y={12 - height} width={2.5} height={height} rx={1} fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * "Operations": a dark control console with amber signals. The new order
 * shows up in the table, its checks run in the detail window, an exception is
 * flagged, and a suggested action waits for a person to approve it before the
 * dashboard updates.
 */
export function LogisticsDemo({ step, t }: { step: number; t: Copy }) {
  const at = Math.min(step, BOARD.length - 1);
  const counts = BOARD[at];
  const status = ORDER_STATUS[at];
  const [, orderNumber] = t.order.split(" ");

  return (
    <DemoFrame>
      <Connector when={step >= 1} axis="y" d="M 82 40 L 82 60" />
      <Connector when={step >= 3} axis="-x" d="M 70 84 L 30 84" />

      <AppWindow
        when={step >= 0}
        title={t.app}
        icon={industryById.logistics.icon}
        right={
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-(--win-muted)">
            <span className="size-1.5 animate-blink rounded-full bg-[#4ADE9C]" />
            {t.live}
          </span>
        }
        className="lg:absolute lg:top-6 lg:left-6 lg:w-[432px]"
      >
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="min-w-0 flex-1 p-3">
            <dl className="grid grid-cols-3 gap-1.5">
              {t.rows.map((row, i) => (
                <div
                  key={row}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 transition-colors duration-500",
                    i === 2 && counts[i] > 0
                      ? "border-(--warn-text) bg-(--warn-bg) text-(--warn-text)"
                      : i === 1 && counts[i] > 0
                        ? "border-(--app) bg-(--app-soft) text-(--app-ink)"
                        : "border-(--win-line) bg-(--win-fill)",
                  )}
                >
                  <div className="flex items-end justify-between">
                    <dd className="font-mono text-[18px] leading-none font-semibold tabular-nums">
                      {counts[i]}
                    </dd>
                    <Spark bars={SPARKS[i]} />
                  </div>
                  <dt className="mt-1 text-[9.5px] leading-tight opacity-80">{row}</dt>
                </div>
              ))}
            </dl>
            <table className="mt-2.5 w-full font-mono text-[10.5px]">
              <thead>
                <tr className="text-left text-[9.5px] tracking-wide text-(--win-muted)">
                  {t.columns.map((column) => (
                    <th key={column} className="pb-1 font-medium last:text-right">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-(--win-line) text-(--win-muted)">
                  <td className="py-1.5 pl-1">4810</td>
                  <td>{t.routes[0]}</td>
                  <td className="pr-1 text-right">{t.delivered}</td>
                </tr>
                <tr className="border-t border-(--win-line) text-(--win-muted)">
                  <td className="py-1.5 pl-1">4811</td>
                  <td>{t.routes[1]}</td>
                  <td className="pr-1 text-right">{t.inTransit}</td>
                </tr>
                <tr className="border-t border-(--win-line) bg-(--win-fill) font-semibold">
                  <td className="py-1.5 pl-1 text-(--app-ink)">{orderNumber}</td>
                  <td>{t.routes[2]}</td>
                  <td className="pr-1 text-right">
                    <Chip
                      tone={status === 2 ? "warn" : status === 3 ? "accent" : "soft"}
                      className="h-5 font-sans"
                    >
                      {t.statuses[status]}
                    </Chip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 1}
        title={t.detailTitle}
        icon={ClipboardList}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[268px]"
      >
        <div className="p-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-mono text-[13px] font-semibold text-(--app-ink)">{t.order}</p>
            <p className="truncate text-[10.5px] text-(--win-muted)">{t.detail}</p>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 border-t border-(--win-line) pt-2 text-[11.5px]">
            {t.checks.map((check, i) => {
              const isException = i === EXCEPTION_CHECK;
              const flagged = isException && step >= 2;
              return (
                <li key={check} className="flex h-[22px] items-center justify-between">
                  <span>{check}</span>
                  {flagged ? (
                    <Chip tone="warn">
                      <TriangleAlert aria-hidden className="size-3" />
                      {t.exception}
                    </Chip>
                  ) : isException ? (
                    <span className="flex items-center gap-1.5 text-[11px] text-(--win-muted)">
                      {t.pending}
                      <Working />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-(--win-muted)">
                      <Check aria-hidden className="size-3 text-[#4ADE9C]" strokeWidth={3} />
                      {t.ok}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 3}
        title={t.suggested}
        icon={Lightbulb}
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[286px]"
      >
        <div className="p-3">
          <p className="text-[12.5px] leading-snug font-medium">{t.action}</p>
          <div className="mt-2.5 flex h-7 items-center gap-2">
            {step >= 4 ? (
              <span className="flex h-7 items-center gap-1.5 rounded-md bg-[#4ADE9C] px-2.5 text-[11px] font-semibold text-[#0B2A1C]">
                <UserCheck aria-hidden className="size-3.5" />
                {t.approved}
              </span>
            ) : (
              <>
                <span className="flex h-7 items-center rounded-md bg-(--app) px-3 text-[11px] font-semibold text-(--app-on)">
                  {t.approve}
                </span>
                <span className="text-[10.5px] text-(--win-muted)">{t.awaiting}</span>
              </>
            )}
          </div>
          <Show when={step >= 4} delay={0.3} className="mt-2 text-[11.5px] text-(--win-muted)">
            {t.owner}
          </Show>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
