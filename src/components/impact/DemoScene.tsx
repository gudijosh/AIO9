"use client";

import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDemoTimeline } from "@/lib/useDemoTimeline";
import { cn } from "@/lib/cn";
import { DemoBar } from "./DemoBar";
import { DotWord } from "./DotWord";
import { Fit } from "./scroll/Fit";
import type { WindowProps } from "./windows/kit";

export interface DemoSceneData {
  /** Value sent to the contact form when the visitor asks for this. */
  id: string;
  color: string;
  word: string;
  name: string;
  /** Small line above the title: which product or hardware this shows. */
  label: string;
  title: string;
  description: string;
  from: string;
  to: string;
  steps: readonly string[];
  durations: readonly number[];
  Window: ComponentType<WindowProps>;
}

/**
 * One sector on screen: its name in dotted type, what the solution does, and
 * its software window playing the demonstration step by step.
 */
export function DemoScene({
  data,
  index,
  total,
  live,
  locale,
  dict,
}: {
  data: DemoSceneData;
  index: number;
  total: number;
  live: boolean;
  locale: Locale;
  dict: Dictionary;
}) {
  const timeline = useDemoTimeline({ durations: data.durations, resetKey: data.id, enabled: live });
  const t = dict.experience;
  const tilt = index % 2 ? 1 : -1;
  const count = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <article
      aria-labelledby={`scene-${data.id}`}
      className="relative isolate flex min-h-svh flex-col justify-center px-5 pt-[calc(11svh+25vw)] pb-12 lg:h-full lg:min-h-0 lg:px-10 lg:pt-[30svh] lg:pb-8"
    >
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <DotWord word={data.word} color={data.color} className="-z-10 top-[11svh] lg:top-[5svh]" />

      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-14">
        <div className="relative lg:pl-6">
          <span aria-hidden style={{ background: data.color }} className="absolute top-1 left-0 hidden h-8 w-[3px] lg:block" />
          <p className="font-mono text-[11px] tracking-[0.14em] text-volt uppercase">
            {count} · {data.label}
          </p>
          <h3 id={`scene-${data.id}`} className="display mt-4 text-[clamp(3.25rem,6.2vw,6.5rem)] text-balance">
            {data.title}
          </h3>
          <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-fog">{data.description}</p>
          <p className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] uppercase">
            <span className="rounded-full border border-bone/30 px-3.5 py-2">{data.from}</span>
            <span aria-hidden style={{ color: data.color }}>
              →
            </span>
            <span style={{ background: data.color }} className="rounded-full px-3.5 py-2 font-medium text-ink">
              {data.to}
            </span>
          </p>
          <div className="mt-8 max-w-[30rem]">
            <DemoBar timeline={timeline} steps={data.steps} name={data.name} color={data.color} t={t} />
          </div>
          <a
            href="#contact"
            onClick={() => window.dispatchEvent(new CustomEvent("aio9:industry", { detail: data.id }))}
            className="pill mt-8 bg-bone text-ink"
          >
            {t.consult}
          </a>
        </div>

        <div className="[perspective:1700px]">
          <div
            style={{ boxShadow: `0 60px 110px -30px #000, 0 0 140px -30px ${data.color}` }}
            className={cn(
              "rounded-[14px] lg:rounded-[18px] lg:motion-safe:[transform:rotateY(var(--ry))_rotateX(5deg)_rotateZ(var(--rz))]",
              tilt < 0 ? "[--ry:-9deg] [--rz:-2deg]" : "[--ry:9deg] [--rz:2deg]",
            )}
          >
            <Fit className="overflow-hidden rounded-[inherit]">
              <data.Window step={timeline.step} locale={locale} simulation={t.simulation} />
            </Fit>
          </div>
        </div>
      </div>
    </article>
  );
}
