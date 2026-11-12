"use client";

import { Clock } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { AppWindow, SideNav } from "./primitives/AppWindow";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["retail"]["demo"];

const SWATCHES = ["#a3abb5", "#27467a", "#434952"];
const ASKED_SIZE = 1;
/** Highest stock in the illustrative table, used to scale the bars. */
const MAX_STOCK = 5;

function Jacket({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 44" className="h-9 w-10" aria-hidden>
      <path
        d="M17 5l7 4 7-4 10 6-4 9-4-2v21H15V18l-4 2-4-9z"
        fill={color}
        stroke="rgb(11 20 33 / 0.2)"
        strokeWidth={0.75}
        strokeLinejoin="round"
      />
      <path d="M24 9v30" stroke="rgb(0 0 0 / 0.25)" strokeWidth={0.75} />
    </svg>
  );
}

/**
 * A store back-office: a product question is answered from the live stock
 * table, colour options are offered, and the order is put on hold with a
 * follow-up.
 */
export function RetailDemo({ step, t }: { step: number; t: Copy }) {
  const reached = step >= 4 ? 4 : step >= 3 ? 3 : 0;

  return (
    <DemoFrame>
      <Connector when={step >= 1} d="M 15 20 L 85 20" />
      <Connector when={step >= 3} axis="y" d="M 85 30 L 85 82" />

      <AppWindow when={step >= 0} title={t.inbox} className="lg:absolute lg:top-6 lg:left-6 lg:w-[264px]">
        <div className="flex flex-col gap-2.5 p-3">
          <Bubble when={step >= 0} from="them" who={t.customer}>
            {t.ask}
          </Bubble>
          <Bubble when={step >= 2} from="ai" who={t.assistant}>
            {t.reply}
          </Bubble>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 1}
        title={t.app}
        badge={step === 1 ? <Working className="text-signal" /> : undefined}
        className="lg:absolute lg:top-6 lg:right-6 lg:w-[400px]"
      >
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="min-w-0 flex-1 p-3">
            <p className="text-[12px] font-semibold">{t.product}</p>
            <table className="mt-1.5 w-full text-[11px]">
              <thead>
                <tr className="text-left text-[10px] text-slate-600">
                  <th className="w-12 pb-1 font-medium">{t.columns[0]}</th>
                  <th className="pb-1 font-medium">{t.columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {t.sizes.map((size, i) => {
                  const count = Number(t.stock[i]);
                  const match = i === ASKED_SIZE && step >= 1;
                  return (
                    <tr
                      key={size}
                      className={cn(
                        "border-t border-midnight/8 transition-colors delay-500 duration-300",
                        match && "bg-signal/10",
                      )}
                    >
                      <td className="py-1.5 pl-1.5 font-mono font-medium">{size}</td>
                      <td className="py-1.5 pr-1.5">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-midnight/8">
                            <span
                              className={cn("block h-full rounded-full", match ? "bg-signal" : "bg-midnight/30")}
                              style={{ width: `${(count / MAX_STOCK) * 100}%` }}
                            />
                          </span>
                          <span className="w-[74px] shrink-0 text-right text-slate-600">
                            {count === 0 ? (
                              t.out
                            ) : (
                              <>
                                <span className="font-mono font-semibold text-midnight tabular-nums">{count}</span>{" "}
                                {t.units}
                              </>
                            )}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Show when={step >= 2} className="mt-2 border-t border-midnight/8 pt-2">
              <p className="text-[10px] font-medium text-slate-600">{t.options}</p>
              <ul className="mt-1.5 grid grid-cols-3 gap-1.5">
                {t.colors.map((color, i) => (
                  <li
                    key={color}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-lg border bg-cloud px-1 pt-1.5 pb-1 transition-colors duration-300",
                      i === 0 && step >= 3 ? "border-signal" : "border-transparent",
                    )}
                  >
                    <Jacket color={SWATCHES[i]} />
                    <span className="text-center text-[10px] leading-tight text-slate-600">{color}</span>
                  </li>
                ))}
              </ul>
            </Show>
          </div>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 3}
        title={t.order}
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[264px]"
      >
        <div className="p-3">
          <p className="text-[13px] font-semibold">{t.held}</p>
          <p className="text-[12px] text-slate-600">{t.item}</p>
          <ol className="mt-3 grid grid-cols-4 gap-1">
            {t.flow.map((label, i) => (
              <li key={label} className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "h-[3px] rounded-full transition-colors duration-500",
                    i < reached ? "bg-signal" : "bg-midnight/12",
                  )}
                />
                <span
                  className={cn(
                    "text-[9.5px] leading-tight transition-colors duration-500",
                    i < reached ? "text-midnight" : "text-slate-600",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
          <Show
            when={step >= 4}
            className="mt-2.5 flex items-start gap-1.5 border-t border-midnight/10 pt-2.5 text-[11.5px] text-slate-600"
          >
            <Clock aria-hidden className="mt-px size-3.5 shrink-0" />
            {t.followUp}
          </Show>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
