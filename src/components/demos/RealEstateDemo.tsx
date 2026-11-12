"use client";

import Image from "next/image";
import { CalendarCheck, Check, MessageSquare, Plus, RefreshCw, Star } from "lucide-react";
import * as m from "motion/react-m";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { AppWindow, Avatar, SearchField, SideNav, Skeleton, Toast } from "./primitives/AppWindow";
import { Bubble } from "./primitives/Bubble";
import { Chip } from "./primitives/Chip";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["realEstate"]["demo"];

/** Placeholder cards already sitting in each pipeline column. */
const OTHER_CARDS = [2, 1, 1];

/**
 * "Real estate CRM": a white workspace framed in deep green. An inquiry
 * becomes a lead card that moves through the pipeline (new → qualified →
 * visit) as the assistant talks to the buyer.
 */
export function RealEstateDemo({ step, t }: { step: number; t: Copy }) {
  // Which pipeline column the lead is in at this step.
  const column = step >= 4 ? 2 : step >= 3 ? 1 : 0;
  const { image, focus, icon } = industryById.realEstate;

  return (
    <DemoFrame>
      <Connector when={step >= 1} d="M 15 78 C 50 78, 50 22, 85 22" />

      <AppWindow
        when={step >= 0}
        title={t.inbox}
        icon={MessageSquare}
        className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[272px]"
      >
        <div className="flex flex-col gap-2 p-3">
          <Bubble when={step >= 0} from="them" who={t.buyer}>
            {t.ask}
          </Bubble>
          <Bubble when={step >= 2} from="ai" who={t.assistant}>
            {t.reply}
          </Bubble>
          <Bubble when={step >= 2} delay={0.7} from="them" who={t.buyer}>
            {t.answer}
          </Bubble>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 1}
        title={t.listing}
        className="max-lg:hidden lg:absolute lg:top-6 lg:left-6 lg:w-[236px]"
      >
        <div className="flex gap-3 p-2.5">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-paper">
            <Image
              src={image}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
              style={{ objectPosition: focus }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] leading-tight font-semibold">{t.property}</p>
            <p className="mt-1 text-[10.5px] leading-snug text-(--win-muted)">{t.specs.join(" · ")}</p>
            <Chip tone="soft" className="mt-1.5 h-[18px] text-[10px]">
              {t.available}
            </Chip>
          </div>
        </div>
      </AppWindow>

      <AppWindow
        when={step >= 1}
        title={t.app}
        icon={icon}
        right={
          step >= 5 ? (
            <span className="flex items-center gap-1 text-[10.5px] font-medium">
              <RefreshCw aria-hidden className="size-3" />
              {t.crm}
            </span>
          ) : (
            <Avatar>AG</Avatar>
          )
        }
        className="lg:absolute lg:top-6 lg:right-6 lg:w-[414px]"
      >
        <div className="flex">
          <SideNav items={t.nav} />
          <div className="min-w-0 flex-1 p-3">
            <div className="flex items-center gap-2">
              <SearchField label={t.search} className="flex-1" />
              <span className="flex h-6 shrink-0 items-center gap-1 rounded-md bg-(--app) px-2 text-[10.5px] font-semibold text-(--app-on)">
                <Plus aria-hidden className="size-3" strokeWidth={3} />
                {t.addLead}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {t.columns.map((name, i) => (
                <div
                  key={name}
                  className="flex min-h-[126px] flex-col gap-1.5 rounded-lg bg-(--win-fill) p-1.5"
                >
                  <p className="flex items-center gap-1 px-0.5 text-[10.5px] font-semibold">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        i === 0 ? "bg-(--win-muted)" : i === 1 ? "bg-[#C9962B]" : "bg-(--app)",
                      )}
                    />
                    {name}
                    <span className="ml-auto font-mono font-normal text-(--win-muted) tabular-nums">
                      {OTHER_CARDS[i] + (column === i ? 1 : 0)}
                    </span>
                  </p>
                  {column === i && (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className={cn(
                        "rounded-md border bg-(--win) p-1.5 shadow-sm",
                        i === 0 ? "border-(--win-line)" : "border-(--app)",
                      )}
                    >
                      <p className="text-[10.5px] leading-tight font-semibold">{t.leadName}</p>
                      <p className="mt-0.5 text-[9.5px] leading-tight text-(--win-muted)">{t.property}</p>
                      {i === 1 && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded bg-[#F6ECD6] px-1 py-0.5 text-[9px] font-semibold text-[#8A5F12]">
                          <Star aria-hidden className="size-2.5 fill-current" />
                          {t.interest}: {t.level}
                        </span>
                      )}
                      {i === 2 && (
                        <span className="mt-1 flex items-center gap-1 text-[9.5px] font-semibold text-(--app-ink)">
                          <CalendarCheck aria-hidden className="size-3 shrink-0" />
                          {t.visitWhen}
                        </span>
                      )}
                    </m.div>
                  )}
                  {Array.from({ length: OTHER_CARDS[i] }, (_, j) => (
                    <div
                      key={j}
                      className="flex flex-col gap-1 rounded-md border border-(--win-line) bg-(--win) p-1.5"
                    >
                      <Skeleton className="w-4/5" />
                      <Skeleton className="w-1/2 opacity-60" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Show when={step >= 3} className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px]">
              {t.criteria.map((item) => (
                <span key={item} className="flex items-center gap-1 text-(--win-muted)">
                  <Check aria-hidden className="size-3 text-(--app-ink)" strokeWidth={3} />
                  {item}
                </span>
              ))}
            </Show>
          </div>
        </div>
      </AppWindow>

      <Toast
        when={step >= 4}
        icon={CalendarCheck}
        title={t.visit}
        detail={t.visitWhen}
        className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[250px]"
      />
    </DemoFrame>
  );
}
