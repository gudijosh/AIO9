"use client";

import { Bell, Check, Clock, MessageSquare } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { AppWindow, Avatar, SideNav, Skeleton } from "./primitives/AppWindow";
import { Bubble, Working } from "./primitives/Bubble";
import { Connector, DemoFrame } from "./primitives/DemoFrame";

type Copy = Dictionary["industries"]["healthcare"]["demo"];

/** Slots that are open in the illustrative schedule; the first one gets booked. */
const OPEN = [2, 4];
const PICK = 2;
/** Width of the placeholder name on each booked row, so rows don't look cloned. */
const NAME_WIDTHS = ["w-16", "w-12", "", "w-20", ""];

/**
 * "Clinic schedule": a calm, light scheduling app. The patient's message
 * arrives in the inbox, the assistant reads the day and books the open slot.
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
        icon={MessageSquare}
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
        icon={industryById.healthcare.icon}
        right={step === 2 ? <Working className="text-(--app-ink)" /> : <Avatar>DR</Avatar>}
        className="lg:absolute lg:top-6 lg:right-6 lg:w-[396px]"
      >
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="min-w-0 flex-1 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold">{t.agenda}</p>
              <p className="flex rounded-md bg-(--win-fill) p-0.5 text-[10px]">
                {t.views.map((view, i) => (
                  <span
                    key={view}
                    className={cn(
                      "rounded px-1.5 py-0.5",
                      i === 0 ? "bg-(--win) font-semibold shadow-sm" : "text-(--win-muted)",
                    )}
                  >
                    {view}
                  </span>
                ))}
              </p>
            </div>
            <ul className="mt-2 flex flex-col gap-1">
              {t.slots.map((time, i) => {
                const open = OPEN.includes(i);
                const pick = i === PICK;
                return (
                  <li key={time} className={cn("items-center gap-2", open ? "flex" : "hidden lg:flex")}>
                    <span className="w-9 shrink-0 font-mono text-[10.5px] text-(--win-muted) tabular-nums">
                      {time}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 min-w-0 flex-1 items-center justify-between rounded-lg border-l-[3px] px-2 text-[11px] transition-colors duration-300",
                        pick && booked
                          ? "border-(--app) bg-(--app) font-medium text-(--app-on)"
                          : pick && selected
                            ? "border-(--app) bg-(--app-soft) font-medium text-(--app-ink)"
                            : open
                              ? "border-transparent text-(--win-muted) outline-1 -outline-offset-1 outline-(--win-line) outline-dashed"
                              : "border-(--win-muted) bg-(--win-fill) text-(--win-muted)",
                      )}
                    >
                      {open ? (
                        <>
                          <span>{pick && booked ? t.booked : t.free}</span>
                          {pick && booked && <Clock aria-hidden className="size-3" />}
                        </>
                      ) : (
                        <>
                          <Skeleton className={NAME_WIDTHS[i]} />
                          <span>{t.busy}</span>
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-(--win-muted)">
              <span className="size-1.5 rounded-full bg-(--app)" />
              {t.openings[booked ? 1 : 0]}
            </p>
          </div>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 5}
        title={t.notice}
        icon={Bell}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[256px]"
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-(--app) text-(--app-on)">
              <Check aria-hidden className="size-4.5" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[13px] font-semibold">{t.confirmed}</p>
              <p className="text-[12px] text-(--win-muted)">{t.when}</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 border-t border-(--win-line) pt-2.5 text-[11.5px] text-(--win-muted)">
            <Bell aria-hidden className="size-3.5" />
            {t.reminder}
          </p>
        </div>
      </AppWindow>
    </DemoFrame>
  );
}
