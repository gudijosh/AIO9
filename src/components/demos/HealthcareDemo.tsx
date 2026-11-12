"use client";

import { Bell, Check } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { AppWindow, SideNav, Skeleton } from "./primitives/AppWindow";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";

type Copy = Dictionary["industries"]["healthcare"]["demo"];

/** Slots that are open in the illustrative schedule; the first one gets booked. */
const OPEN = [2, 4];
const PICK = 2;

/**
 * A clinic scheduling app: the patient's message arrives in the inbox, the
 * assistant reads the day's schedule and books the open slot.
 * No clinical content.
 */
export function HealthcareDemo({ step, t }: { step: number; t: Copy }) {
  const selected = step >= 3;
  const booked = step >= 4;

  return (
    <DemoFrame>
      <Connector when={step >= 2} d="M 15 78 C 50 78, 50 24, 85 24" />
      <Connector when={step >= 5} axis="y" d="M 85 30 L 85 84" />

      <AppWindow
        when={step >= 0}
        title={t.inbox}
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[272px]"
      >
        <div className="flex flex-col gap-2.5 p-3">
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
      </AppWindow>

      <AppWindow
        when={step >= 2}
        title={t.app}
        badge={step === 2 ? <Working className="text-signal" /> : undefined}
        className="lg:absolute lg:top-6 lg:right-6 lg:w-[392px]"
      >
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="min-w-0 flex-1 p-3">
            <p className="text-[12px] font-semibold">{t.agenda}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {t.slots.map((time, i) => {
                const open = OPEN.includes(i);
                const pick = i === PICK;
                return (
                  <li
                    key={time}
                    className={cn("items-center gap-2", open ? "flex" : "hidden lg:flex")}
                  >
                    <span className="w-9 shrink-0 font-mono text-[11px] text-slate-600 tabular-nums">
                      {time}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 min-w-0 flex-1 items-center justify-between rounded-md border px-2 text-[11px] transition-colors duration-300",
                        pick && booked
                          ? "border-signal bg-signal font-medium text-white"
                          : pick && selected
                            ? "border-signal bg-signal/10 font-medium text-signal"
                            : open
                              ? "border-dashed border-midnight/25 text-slate-600"
                              : "border-transparent bg-midnight/6 text-slate-600",
                      )}
                    >
                      {open ? (
                        <span>{pick && booked ? t.booked : t.free}</span>
                      ) : (
                        <>
                          <Skeleton className="w-16" />
                          <span>{t.busy}</span>
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 5}
        title={t.notice}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[256px]"
      >
        <div className="p-3">
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
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
