"use client";

import { Clock } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Panel, PanelTitle, Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["retail"]["demo"];

const SWATCHES = ["#a3abb5", "#27467a", "#434952"];
const ASKED_SIZE = 1;

function Jacket({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 44" className="h-11 w-12" aria-hidden>
      <path
        d="M17 5l7 4 7-4 10 6-4 9-4-2v21H15V18l-4 2-4-9z"
        fill={color}
        stroke="rgb(255 255 255 / 0.25)"
        strokeWidth={0.75}
        strokeLinejoin="round"
      />
      <path d="M24 9v30" stroke="rgb(0 0 0 / 0.25)" strokeWidth={0.75} />
    </svg>
  );
}

/** Product question → stock check → options → hold → follow-up. */
export function RetailDemo({ step, t }: { step: number; t: Copy }) {
  const reached = step >= 4 ? 4 : step >= 3 ? 3 : 0;

  return (
    <DemoFrame>
      <Connector when={step >= 1} d="M 15 20 L 85 20" />
      <Connector when={step >= 3} axis="y" d="M 85 30 L 85 82" />

      <Panel when={step >= 0} className="lg:absolute lg:top-6 lg:left-6 lg:w-[270px]">
        <div className="flex flex-col gap-2.5">
          <Bubble when={step >= 0} from="them" who={t.customer}>
            {t.ask}
          </Bubble>
          <Bubble when={step >= 2} from="ai" who={t.assistant}>
            {t.reply}
          </Bubble>
        </div>
      </Panel>

      <Panel when={step >= 1} className="lg:absolute lg:top-6 lg:right-6 lg:w-[240px]">
        <div className="flex h-4 items-center justify-between">
          <PanelTitle>{t.inventory}</PanelTitle>
          {step === 1 && <Working className="text-signal-300" />}
        </div>
        <ul className="mt-2.5 grid grid-cols-4 gap-1.5 lg:grid-cols-2">
          {t.sizes.map((size, i) => {
            const out = t.stock[i] === "0";
            const match = i === ASKED_SIZE && step >= 1;
            return (
              <li
                key={size}
                className={cn(
                  "flex flex-col rounded-lg border px-2.5 py-1.5 transition-colors delay-500 duration-300",
                  match ? "border-signal-300 bg-signal/25" : "border-white/10",
                  out && "opacity-50",
                )}
              >
                <span className="text-[11px] text-white/60">{size}</span>
                <span className="text-[12px] font-medium">
                  {out ? t.out : (
                    <>
                      <span className="font-mono tabular-nums">{t.stock[i]}</span>
                      <span className="max-lg:hidden"> {t.units}</span>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel when={step >= 2} className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[320px]">
        <PanelTitle>{t.options}</PanelTitle>
        <ul className="mt-2 grid grid-cols-3 gap-2">
          {t.colors.map((color, i) => (
            <li key={color}>
              <Show
                when={step >= 2}
                delay={0.1 + i * 0.12}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border bg-white/6 px-1 pt-2 pb-1.5 transition-colors duration-300",
                  i === 0 && step >= 3 ? "border-signal-300" : "border-transparent",
                )}
              >
                <Jacket color={SWATCHES[i]} />
                <span className="text-center text-[11px] leading-tight text-white/80">{color}</span>
              </Show>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        tone="light"
        when={step >= 3}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[264px]"
      >
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
                  i < reached ? "text-midnight" : "text-slate-600/70",
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
      </Panel>
    </DemoFrame>
  );
}
