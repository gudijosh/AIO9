"use client";

import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";

type Step = Dictionary["process"]["steps"][number];

/** The three marks of the AIO9 Signal: point (input), stroke (intelligence), square (action). */
const marks = ["size-[11px] rounded-full", "h-[11px] w-[3px] rounded-full", "size-[11px]"];

function ProcessStep({
  step,
  index,
  count,
  progress,
}: {
  step: Step;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const segments = count - 1;
  const reached = index / segments;
  const markColor = useTransform(progress, [reached - 0.06, reached], ["#bcc5d0", "#2558dc"]);
  const drawn = useTransform(progress, [reached, (index + 1) / segments], [0, 1], { clamp: true });
  const isLast = index === segments;

  return (
    <li className="relative pl-10 lg:pt-14 lg:pl-0">
      {!isLast && (
        <span
          aria-hidden
          className="absolute top-3 -bottom-14 left-[5px] w-px bg-midnight/12 lg:top-[5px] lg:-right-10 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
        >
          <m.span className="absolute inset-0 origin-top bg-signal lg:hidden" style={{ scaleY: drawn }} />
          <m.span className="absolute inset-0 hidden origin-left bg-signal lg:block" style={{ scaleX: drawn }} />
        </span>
      )}
      <span
        aria-hidden
        className="absolute top-1.5 left-0 grid size-[11px] place-items-center bg-cloud lg:top-0 lg:w-auto lg:pr-3"
      >
        <m.span className={cn("block", marks[index])} style={{ backgroundColor: markColor }} />
      </span>
      <p className="font-mono text-[13px] text-slate-600">0{index + 1}</p>
      <h3 className="mt-3 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight font-medium tracking-[-0.025em]">
        {step.name}
      </h3>
      <p className="mt-3 max-w-[34ch] text-[17px] leading-relaxed text-slate-600">{step.text}</p>
    </li>
  );
}

/** How AIO9 works: three steps joined by one line that draws as you scroll. */
export function Process({ t }: { t: Dictionary["process"] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });

  return (
    <section id="process" aria-labelledby="process-heading" className="on-light bg-cloud text-midnight">
      <div className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-40">
        <h2
          id="process-heading"
          className="max-w-[13ch] text-[clamp(2.25rem,5.4vw,4.75rem)] leading-none font-medium tracking-[-0.04em] text-balance"
        >
          {t.title}
        </h2>
        <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-slate-600 lg:text-xl">{t.subtitle}</p>
        <ol ref={listRef} className="mt-16 grid gap-14 lg:mt-28 lg:grid-cols-3 lg:gap-10">
          {t.steps.map((step, i) => (
            <ProcessStep
              key={step.name}
              step={step}
              index={i}
              count={t.steps.length}
              progress={scrollYProgress}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
