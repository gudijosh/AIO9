"use client";

import Image from "next/image";
import { CalendarCheck, Check, Database } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { Bubble } from "./primitives/Bubble";
import { Chip } from "./primitives/Chip";
import { Connector, DemoFrame } from "./primitives/DemoFrame";
import { Panel, PanelTitle, Show } from "./primitives/Show";

type Copy = Dictionary["industries"]["realEstate"]["demo"];

/** Inquiry → listing → qualification → visit → CRM record (all illustrative). */
export function RealEstateDemo({ step, t }: { step: number; t: Copy }) {
  return (
    <DemoFrame>
      <Connector when={step >= 1} d="M 15 78 C 50 78, 50 22, 85 22" />
      <Connector when={step >= 3} axis="y" d="M 85 30 L 85 82" />

      <Panel when={step >= 0} className="lg:absolute lg:bottom-6 lg:left-6 lg:w-[290px]">
        <div className="flex flex-col gap-2.5">
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
      </Panel>

      <Panel when={step >= 1} className="!p-0 overflow-hidden lg:absolute lg:top-6 lg:right-6 lg:w-[250px]">
        <div className="flex lg:block">
          <div className="relative h-auto w-24 shrink-0 lg:h-[88px] lg:w-full">
            <Image
              src={industryById.realEstate.image}
              alt=""
              fill
              sizes="250px"
              className="object-cover object-[80%_40%]"
            />
          </div>
          <div className="p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold">{t.property}</p>
              <Chip tone="neutral" className="max-lg:hidden">
                {t.available}
              </Chip>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/65">{t.specs.join(" · ")}</p>
          </div>
        </div>
      </Panel>

      <Panel when={step >= 3} className="lg:absolute lg:right-6 lg:bottom-6 lg:w-[250px]">
        <div className="flex items-center justify-between">
          <PanelTitle>{t.lead}</PanelTitle>
          <Chip tone="blue">
            {t.interest}: {t.level}
          </Chip>
        </div>
        <ul className="mt-2.5 flex flex-col gap-1.5 text-[12px]">
          {t.criteria.map((item, i) => (
            <li key={item}>
              <Show when={step >= 3} delay={0.15 + i * 0.15} className="flex items-center gap-2">
                <span className="grid size-4 place-items-center rounded-full bg-signal-300/25 text-signal-300">
                  <Check aria-hidden className="size-2.5" strokeWidth={3} />
                </span>
                {item}
              </Show>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-2.5 text-[12px]">
          <Show when={step >= 4} className="flex items-center gap-2">
            <CalendarCheck aria-hidden className="size-3.5 text-signal-300" />
            <span className="font-medium">{t.visit}</span>
            <span className="ml-auto text-white/65">{t.visitWhen}</span>
          </Show>
          <Show when={step >= 5} className="flex items-center gap-2 text-white/75">
            <Database aria-hidden className="size-3.5 text-signal-300" />
            {t.crm}
          </Show>
        </div>
      </Panel>
    </DemoFrame>
  );
}
