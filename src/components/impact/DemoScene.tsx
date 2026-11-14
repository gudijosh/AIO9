"use client";

import { useRef, type CSSProperties, type ComponentType } from "react";
import { useInView } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDemoTimeline } from "@/lib/useDemoTimeline";
import { DemoBar } from "./DemoBar";
import { Reveal } from "./Reveal";
import { Fit } from "./scroll/Fit";
import type { WindowProps } from "./windows/kit";

export interface DemoSceneData {
  /** Value sent to the contact form when the visitor asks for this. */
  id: string;
  color: string;
  /** Short name, set as a neon sign above the card. */
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
 * One sector as a column: its name lit in its own colour, what the solution
 * does, and its software window playing the demonstration step by step.
 * Sectors sit two to a row; each column makes its own entrance.
 */
export function DemoScene({
  data,
  index,
  total,
  side,
  locale,
  dict,
}: {
  data: DemoSceneData;
  index: number;
  total: number;
  /** Which column it is in: decides the side it enters from. */
  side: "left" | "right";
  locale: Locale;
  dict: Dictionary;
}) {
  const ref = useRef<HTMLElement>(null);
  const live = useInView(ref, { amount: 0.45 });
  const timeline = useDemoTimeline({ durations: data.durations, resetKey: data.id, enabled: live });
  const t = dict.experience;
  const count = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const wait = side === "right" ? 160 : 0;

  return (
    <article
      ref={ref}
      aria-labelledby={`scene-${data.id}`}
      style={{ "--neon": data.color } as CSSProperties}
      className="relative flex min-w-0 flex-col px-5 py-16 lg:px-10 lg:py-20 xl:px-14"
    >
      <Reveal from={side} delay={wait}>
        <p
          aria-hidden
          className="display neon text-[clamp(3rem,8.6vw,8.5rem)] whitespace-nowrap motion-safe:[[data-reveal=shown]_&]:animate-[neon-on_1.1s_linear_both]"
        >
          {data.word}
        </p>
        <p className="mt-5 font-mono text-[11px] tracking-[0.14em] text-volt uppercase">
          {count} · {data.label}
        </p>
        <h3 id={`scene-${data.id}`} className="display mt-3 text-[clamp(2.5rem,3.9vw,4rem)] text-balance">
          {data.title}
        </h3>
        <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-fog">{data.description}</p>
      </Reveal>

      <Reveal from={side === "left" ? "right" : "left"} delay={wait + 140} className="mt-9">
        <div
          style={{ boxShadow: `0 50px 90px -30px #000, 0 0 110px -34px ${data.color}` }}
          className="rounded-[12px] lg:rounded-[14px]"
        >
          <Fit className="overflow-hidden rounded-[inherit]">
            <data.Window step={timeline.step} locale={locale} simulation={t.simulation} />
          </Fit>
        </div>
      </Reveal>

      <Reveal from="up" delay={wait + 240} className="mt-8">
        <DemoBar timeline={timeline} steps={data.steps} name={data.name} color={data.color} t={t} />
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
          <p className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] uppercase">
            <span className="rounded-full border border-bone/30 px-3.5 py-2">{data.from}</span>
            <span aria-hidden style={{ color: data.color }}>
              →
            </span>
            <span style={{ background: data.color }} className="rounded-full px-3.5 py-2 font-medium text-ink">
              {data.to}
            </span>
          </p>
          <a
            href="#contact"
            onClick={() => window.dispatchEvent(new CustomEvent("aio9:industry", { detail: data.id }))}
            className="pill bg-bone text-ink lg:ml-auto"
          >
            {t.consult}
          </a>
        </div>
      </Reveal>
    </article>
  );
}

/** Rows of two columns with a hairline between them; one column on small screens. */
export function Pairs({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1700px] grid-cols-[minmax(0,1fr)] lg:grid-cols-2 [&>*]:border-t [&>*]:border-dim lg:[&>*:nth-child(even)]:border-l">
      {children}
    </div>
  );
}
