"use client";

import { Check, TriangleAlert, UserCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
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

/**
 * An operations console: the new order shows up in the table, its checks run
 * in the detail window, an exception is flagged, and a suggested action waits
 * for a person to approve it before the dashboard updates.
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

      <AppWindow when={step >= 0} title={t.app} className="lg:absolute lg:top-6 lg:left-6 lg:w-[432px]">
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="min-w-0 flex-1 p-3">
            <dl className="grid grid-cols-3 gap-1.5">
              {t.rows.map((row, i) => (
                <div
                  key={row}
                  className={cn(
                    "rounded-lg px-2 py-1.5 transition-colors duration-500",
                    i === 2 && counts[i] > 0
                      ? "bg-amber/20"
                      : i === 1 && counts[i] > 0
                        ? "bg-signal text-white"
                        : "bg-cloud",
                  )}
                >
                  <dd className="font-mono text-[17px] leading-none font-semibold tabular-nums">{counts[i]}</dd>
                  <dt className="mt-1 text-[9.5px] leading-tight opacity-75">{row}</dt>
                </div>
              ))}
            </dl>
            <table className="mt-2.5 w-full text-[11px]">
              <thead>
                <tr className="text-left text-[10px] text-slate-600">
                  {t.columns.map((column) => (
                    <th key={column} className="pb-1 font-medium last:text-right">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-midnight/8 text-slate-600">
                  <td className="py-1.5 font-mono">4810</td>
                  <td>{t.routes[0]}</td>
                  <td className="text-right">{t.delivered}</td>
                </tr>
                <tr className="border-t border-midnight/8 text-slate-600">
                  <td className="py-1.5 font-mono">4811</td>
                  <td>{t.routes[1]}</td>
                  <td className="text-right">{t.inTransit}</td>
                </tr>
                <tr className="border-t border-midnight/8 bg-signal/8 font-medium">
                  <td className="py-1.5 pl-1 font-mono">{orderNumber}</td>
                  <td>{t.routes[2]}</td>
                  <td className="pr-1 text-right">
                    <Chip tone={status === 2 ? "amber" : status === 3 ? "blue" : "soft"} className="h-5">
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
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[252px]"
      >
        <div className="p-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-mono text-[13px] font-semibold">{t.order}</p>
            <p className="truncate text-[10.5px] text-slate-600">{t.detail}</p>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 border-t border-midnight/8 pt-2 text-[11.5px]">
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
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      {t.pending}
                      <Working />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-600">
                      <Check aria-hidden className="size-3 text-signal" strokeWidth={3} />
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
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[286px]"
      >
        <div className="p-3">
          <p className="text-[12.5px] leading-snug font-medium">{t.action}</p>
          <div className="mt-2.5 flex h-[22px] items-center">
            {step >= 4 ? (
              <Chip tone="blue">
                <UserCheck aria-hidden className="size-3" />
                {t.approved}
              </Chip>
            ) : (
              <Chip>{t.awaiting}</Chip>
            )}
          </div>
          <Show when={step >= 4} delay={0.3} className="mt-2 text-[11.5px] text-slate-600">
            {t.owner}
          </Show>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
