"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { Check, UserCheck } from "lucide-react";
import type { IndustryId } from "@/data/industries";
import { industryById } from "@/data/industries";
import { themeVars } from "@/data/themes";
import type { Dictionary } from "@/i18n/dictionaries";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Skeleton } from "@/components/demos/primitives/AppWindow";
import { Chip } from "@/components/demos/primitives/Chip";

type Industries = Dictionary["industries"];

const FULL = "inset(0% 0% 0% 0%)";
const FROM = "inset(0% 0% 0% 100%)";

/** A compact view of the clinic schedule: one slot just got booked. */
function HealthcareApp({ t }: { t: Industries["healthcare"]["demo"] }) {
  const rows = [
    { time: t.slots[1], label: t.busy, kind: "busy" },
    { time: t.slots[2], label: t.booked, kind: "booked" },
    { time: t.slots[4], label: t.free, kind: "open" },
  ] as const;
  return (
    <>
      <ul className="flex flex-col gap-1">
        {rows.map((row) => (
          <li key={row.time} className="flex items-center gap-2">
            <span className="w-9 shrink-0 font-mono text-[10.5px] text-(--win-muted) tabular-nums">
              {row.time}
            </span>
            <span
              className={cn(
                "flex h-6 min-w-0 flex-1 items-center justify-between rounded-md border-l-[3px] px-2 text-[10.5px]",
                row.kind === "booked"
                  ? "border-(--app) bg-(--app) font-medium text-(--app-on)"
                  : row.kind === "open"
                    ? "border-transparent text-(--win-muted) outline-1 -outline-offset-1 outline-(--win-line) outline-dashed"
                    : "border-(--win-muted) bg-(--win-fill) text-(--win-muted)",
              )}
            >
              {row.kind === "busy" && <Skeleton className="w-12" />}
              <span className={row.kind === "busy" ? undefined : "truncate"}>{row.label}</span>
            </span>
          </li>
        ))}
      </ul>
      <Footer icon={<Check aria-hidden className="size-3" strokeWidth={3} />} title={t.confirmed} detail={t.when} />
    </>
  );
}

/** A compact view of the dining room: table 7 is assigned. */
function HospitalityApp({ t }: { t: Industries["hospitality"]["demo"] }) {
  const tables = [
    { n: 5, state: "taken" },
    { n: 6, state: "taken" },
    { n: 7, state: "assigned" },
    { n: 8, state: "taken" },
    { n: 9, state: "open" },
  ] as const;
  return (
    <>
      <p className="truncate text-[11px] font-semibold">{t.floor}</p>
      <ul className="mt-1.5 grid grid-cols-5 gap-1.5 rounded-lg bg-(--win-fill) p-2">
        {tables.map((table) => (
          <li
            key={table.n}
            className={cn(
              "grid h-8 place-items-center rounded-md text-[11px]",
              table.state === "assigned"
                ? "bg-(--app) font-bold text-(--app-on)"
                : table.state === "taken"
                  ? "bg-white/15 text-(--win-muted)"
                  : "text-(--win-muted) outline-1 -outline-offset-1 outline-white/40",
            )}
          >
            {table.n}
          </li>
        ))}
      </ul>
      <Footer
        icon={<Check aria-hidden className="size-3" strokeWidth={3} />}
        title={t.ticket}
        detail={`${t.table} · ${t.when}`}
      />
    </>
  );
}

/** A compact view of the document workspace: fields extracted, handed to a person. */
function ServicesApp({ t }: { t: Industries["services"]["demo"] }) {
  return (
    <>
      <dl className="flex flex-col text-[11px]">
        {t.fields.map((field, i) => (
          <div
            key={field}
            className="flex items-center justify-between gap-2 border-b border-(--win-line) py-1 first:pt-0"
          >
            <dt className="text-(--win-muted)">{field}</dt>
            <dd className="font-medium">{t.values[i]}</dd>
          </div>
        ))}
      </dl>
      <Footer icon={<UserCheck aria-hidden className="size-3" />} title={t.review} detail={t.reviewer} />
    </>
  );
}

function Footer({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <p className="mt-auto flex items-center gap-2 pt-2 text-[11px]">
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-(--app) text-(--app-on)">
        {icon}
      </span>
      <span className="font-semibold">{title}</span>
      <span className="truncate text-(--win-muted)">{detail}</span>
    </p>
  );
}

function Body({ id, industries }: { id: IndustryId; industries: Industries }) {
  switch (id) {
    case "healthcare":
      return <HealthcareApp t={industries.healthcare.demo} />;
    case "hospitality":
      return <HospitalityApp t={industries.hospitality.demo} />;
    case "services":
      return <ServicesApp t={industries.services.demo} />;
    default: {
      // Industries without a compact view fall back to their one-line story.
      const text = industries[id];
      return (
        <p className="flex flex-1 items-center gap-2 text-[12px]">
          <span className="text-(--win-muted)">{text.from}</span>
          <Chip tone="accent">{text.to}</Chip>
        </p>
      );
    }
  }
}

/**
 * The small product window in the hero. Each industry shows its own software,
 * in its own colours, and windows replace each other with the same
 * directional wipe as the photographs behind them.
 */
export function HeroApp({
  ids,
  active,
  industries,
  action,
}: {
  ids: readonly IndustryId[];
  active: number;
  industries: Industries;
  /** Control shown in the title bar of the visible window (pause / play). */
  action?: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState({ active, previous: active });
  if (state.active !== active) setState({ active, previous: state.active });

  return (
    <div className="relative h-[164px]">
      {ids.map((id, i) => {
        const isActive = i === state.active;
        const isPrevious = i === state.previous && !isActive;
        const { icon: Icon, theme } = industryById[id];
        return (
          <m.div
            key={id}
            aria-hidden={!isActive}
            inert={!isActive}
            style={{ ...themeVars(theme), zIndex: isActive ? 2 : isPrevious ? 1 : 0 }}
            initial={false}
            animate={{ clipPath: isActive ? [FROM, FULL] : FULL, opacity: isActive || isPrevious ? 1 : 0 }}
            transition={{ duration: reduced || !isActive ? 0 : duration.scene, ease }}
            className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-(--win-line) bg-(--win) text-(--win-text) shadow-float"
          >
            <div className="flex h-8 shrink-0 items-center gap-2 border-b border-(--win-line) bg-(--win-chrome) pr-1 pl-2.5 text-(--win-chrome-text)">
              <span className="grid size-[18px] shrink-0 place-items-center rounded-[5px] bg-(--app) text-(--app-on)">
                <Icon aria-hidden className="size-3" strokeWidth={2.25} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">
                {industries[id].demo.app}
              </span>
              {isActive && action}
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-2.5">
              <Body id={id} industries={industries} />
            </div>
          </m.div>
        );
      })}
    </div>
  );
}
