"use client";

import { Clock, MessageSquare, Receipt } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { AppWindow, Avatar, Tabs } from "./primitives/AppWindow";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["retail"]["demo"];

const SWATCHES = ["#a3abb5", "#27467a", "#434952"];
const ASKED_SIZE = 1;
/** Highest stock in the illustrative table, used to scale the bars. */
const MAX_STOCK = 5;

function Jacket({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path
        d="M17 5l7 4 7-4 10 6-4 9-4-2v21H15V18l-4 2-4-9z"
        fill={color}
        stroke="rgb(43 19 32 / 0.2)"
        strokeWidth={0.75}
        strokeLinejoin="round"
      />
      <path d="M24 9v30" stroke="rgb(0 0 0 / 0.25)" strokeWidth={0.75} />
    </svg>
  );
}

/**
 * "Store": a bright back-office with top tabs. A product question is answered
 * from the live stock table, colour options are offered, and the order is put
 * on hold with a follow-up, shown as a receipt.
 */
export function RetailDemo({ step, t }: { step: number; t: Copy }) {
  const reached = step >= 4 ? 4 : step >= 3 ? 3 : 0;

  return (
    <DemoFrame>
      <Connector when={step >= 1} d="M 15 20 L 85 20" />

      <AppWindow
        when={step >= 0}
        title={t.inbox}
        icon={MessageSquare}
        className="lg:absolute lg:top-6 lg:left-6 lg:w-[264px]"
      >
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
        icon={industryById.retail.icon}
        right={step === 1 ? <Working className="text-(--app-ink)" /> : <Avatar>TI</Avatar>}
        className="lg:absolute lg:top-6 lg:right-6 lg:w-[388px]"
      >
        <Tabs items={t.nav} />
        <div className="p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-(--app-soft)">
              <Jacket color={SWATCHES[0]} className="h-8 w-9" />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] leading-tight font-semibold">{t.product}</p>
              <p className="font-mono text-[10px] text-(--win-muted)">{t.sku}</p>
            </div>
          </div>
          <table className="mt-2 w-full text-[11px]">
            <thead>
              <tr className="text-left text-[10px] text-(--win-muted)">
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
                      "border-t border-(--win-line) transition-colors delay-500 duration-300",
                      match && "bg-(--app-soft)",
                    )}
                  >
                    <td className="py-1.5 pl-1.5 font-mono font-semibold">{size}</td>
                    <td className="py-1.5 pr-1.5">
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--win-fill)">
                          <span
                            className={cn(
                              "block h-full rounded-full",
                              match ? "bg-(--app)" : "bg-(--win-muted) opacity-50",
                            )}
                            style={{ width: `${(count / MAX_STOCK) * 100}%` }}
                          />
                        </span>
                        <span className="w-[74px] shrink-0 text-right text-(--win-muted)">
                          {count === 0 ? (
                            t.out
                          ) : (
                            <>
                              <span className="font-mono font-semibold text-(--win-text) tabular-nums">
                                {count}
                              </span>{" "}
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
          <Show when={step >= 2} className="mt-2 border-t border-(--win-line) pt-2">
            <p className="text-[10px] font-medium text-(--win-muted)">{t.options}</p>
            <ul className="mt-1.5 grid grid-cols-3 gap-1.5">
              {t.colors.map((color, i) => (
                <li
                  key={color}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-1.5 py-1 transition-colors duration-300",
                    i === 0 && step >= 3 ? "border-(--app) bg-(--app-soft)" : "border-(--win-line)",
                  )}
                >
                  <Jacket color={SWATCHES[i]} className="h-6 w-7 shrink-0" />
                  <span className="text-[10px] leading-tight">{color}</span>
                </li>
              ))}
            </ul>
          </Show>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 3}
        title={t.order}
        icon={Receipt}
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[264px]"
      >
        <div className="p-3">
          <p className="text-[13px] font-semibold">{t.held}</p>
          <p className="border-b border-dashed border-(--win-line) pb-2 font-mono text-[11px] text-(--win-muted)">
            {t.item}
          </p>
          <ol className="mt-2.5 grid grid-cols-4 gap-1">
            {t.flow.map((label, i) => (
              <li key={label} className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "h-[3px] rounded-full transition-colors duration-500",
                    i < reached ? "bg-(--app)" : "bg-(--win-fill)",
                  )}
                />
                <span
                  className={cn(
                    "text-[9.5px] leading-tight transition-colors duration-500",
                    i < reached ? "text-(--win-text)" : "text-(--win-muted)",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
          <Show
            when={step >= 4}
            className="mt-2.5 flex items-start gap-1.5 border-t border-(--win-line) pt-2.5 text-[11.5px] text-(--win-muted)"
          >
            <Clock aria-hidden className="mt-px size-3.5 shrink-0" />
            {t.followUp}
          </Show>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
