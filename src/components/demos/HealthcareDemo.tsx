"use client";

import { Bell, Check } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Panel, PanelTitle } from "./primitives/Show";

type Copy = Dictionary["industries"]["healthcare"]["demo"];

/** Slots that are open in the illustrative schedule; the first one gets booked. */
const OPEN = [2, 4];
const PICK = 2;

/** Message → schedule → confirmed appointment. No clinical content. */
export function HealthcareDemo({ step, t }: { step: number; t: Copy }) {
  const selected = step >= 3;
  const booked = step >= 4;

  return (
    <DemoFrame>
      <Connector when={step >= 2} d="M 15 78 C 50 78, 50 24, 85 24" />
      <Connector when={step >= 5} axis="y" d="M 85 30 L 85 84" />

      <Panel when={step >= 0} className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[290px]">
        <div className="flex flex-col gap-2.5">
          <Bubble when={step >= 0} from="them" who={t.patient}>
            {t.ask}
          </Bubble>
          <Bubble when={step >= 1} from="ai" who={t.assistant}>
            {t.checking}
          </Bubble>
          <Bubble when={step >= 3} from="ai" who={t.assistant}>
            {t.found}
          </Bubble>
        </div>
      </Panel>

      <Panel when={step >= 2} className="lg:absolute lg:top-6 lg:right-6 lg:w-[250px]">
        <div className="flex h-4 items-center justify-between">
          <PanelTitle>{t.agenda}</PanelTitle>
          {step === 2 && <Working className="text-signal-300" />}
        </div>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {t.slots.map((time, i) => {
            const open = OPEN.includes(i);
            const pick = i === PICK;
            return (
              <li
                key={time}
                className={cn(
                  "h-8 items-center justify-between rounded-lg border px-2.5 text-[12px] transition-colors duration-300",
                  open ? "flex" : "hidden lg:flex",
                  pick && booked
                    ? "border-signal bg-signal text-white"
                    : pick && selected
                      ? "border-signal-300 bg-signal/25 text-white"
                      : open
                        ? "border-dashed border-white/30 text-white"
                        : "border-transparent bg-white/6 text-white/45",
                )}
              >
                <span className="font-mono tabular-nums">{time}</span>
                <span className="text-[11px]">
                  {pick && booked ? t.booked : open ? t.free : t.busy}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel
        tone="light"
        when={step >= 5}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[250px]"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-signal text-white">
            <Check aria-hidden className="size-4.5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-[13px] font-semibold">{t.confirmed}</p>
            <p className="text-[12px] text-slate-600">{t.when}</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 border-t border-midnight/10 pt-2.5 text-[11.5px] text-slate-600">
          <Bell aria-hidden className="size-3.5" />
          {t.reminder}
        </p>
      </Panel>
    </DemoFrame>
  );
}
