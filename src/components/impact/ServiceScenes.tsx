"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { Boards } from "./Boards";
import { DotWord } from "./DotWord";
import { Fit } from "./scroll/Fit";
import { SteppedScene } from "./scroll/SteppedScene";
import { HealthcareWindow } from "./windows/HealthcareWindow";
import { OperationsWindow } from "./windows/OperationsWindow";
import { ServicesWindow } from "./windows/ServicesWindow";

const SERVICES = 4;

function Polaroid({ id, className }: { id: "retail" | "realEstate"; className?: string }) {
  const industry = industryById[id];
  return (
    <div className={cn("bg-bone p-2.5 shadow-[0_40px_80px_-20px_#000]", className)}>
      <Image
        src={industry.image}
        alt=""
        sizes="(min-width: 1024px) 24vw, 46vw"
        className="aspect-[4/5] w-full object-cover"
        style={{ objectPosition: industry.focus }}
      />
    </div>
  );
}

/**
 * The four products, one per screen: the name in dotted type, one object in
 * the middle that stands for it, and what it does in plain words.
 */
export function ServiceScenes({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const items = dict.capabilities.items;
  const simulation = dict.experience.simulation;
  const done = { locale, simulation } as const;

  const objects: ReactNode[] = [
    <div key="automate" className="mx-auto w-full max-w-[640px] rounded-[16px] shadow-[0_80px_130px_-30px_#000,0_0_120px_-20px_var(--color-azure)] motion-safe:[transform:rotateY(-18deg)_rotateX(8deg)_rotateZ(-5deg)]">
      <Fit className="overflow-hidden rounded-[inherit]">
        <HealthcareWindow step={5} {...done} />
      </Fit>
    </div>,
    <div key="web" className="relative mx-auto aspect-[6/5] w-full max-w-[600px]">
      <Polaroid id="retail" className="absolute top-0 left-[4%] w-[52%] motion-safe:-rotate-7" />
      <Polaroid id="realEstate" className="absolute top-[8%] right-[4%] w-[50%] motion-safe:rotate-6" />
    </div>,
    <div key="systems" className="relative mx-auto aspect-[760/560] w-full max-w-[640px]">
      <div className="absolute top-0 left-0 w-[78%] rounded-[14px] shadow-[0_60px_100px_-30px_#000] motion-safe:[transform:rotateY(14deg)_rotateX(6deg)_rotateZ(3deg)]">
        <Fit className="overflow-hidden rounded-[inherit]">
          <ServicesWindow step={5} {...done} />
        </Fit>
      </div>
      <div className="absolute right-0 bottom-0 w-[82%] rounded-[14px] shadow-[0_80px_130px_-30px_#000,0_0_120px_-30px_#F5A524] motion-safe:[transform:rotateY(-12deg)_rotateX(6deg)_rotateZ(-3deg)]">
        <Fit className="overflow-hidden rounded-[inherit]">
          <OperationsWindow step={5} {...done} />
        </Fit>
      </div>
    </div>,
    <Boards key="devices" className="mx-auto w-full max-w-[600px]" />,
  ];

  return (
    <SteppedScene id="services" count={SERVICES} label={dict.nav.services}>
      {(i) => {
        const item = items[i];
        return (
          <article
            aria-labelledby={`service-${i}`}
            className="relative isolate flex min-h-svh flex-col justify-end gap-10 px-5 pt-[34svh] pb-12 lg:h-full lg:min-h-0 lg:px-10 lg:pt-0 lg:pb-[13svh]"
          >
            <div aria-hidden className="grain absolute inset-0 -z-10" />
            <DotWord word={dict.ui.serviceWords[i]} color="var(--color-azure)" className="-z-10 top-[11svh] lg:top-[5svh]" />

            <div aria-hidden={i !== 3 ? true : undefined} className="[perspective:1500px] lg:absolute lg:inset-x-[26vw] lg:top-[24svh]">
              {objects[i]}
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex gap-5 lg:max-w-[23rem]">
                <div aria-hidden className="flex flex-col gap-1.5 pt-1.5">
                  {Array.from({ length: SERVICES }, (_, k) => (
                    <i key={k} className={cn("block w-[3px]", k === i ? "h-8 bg-volt" : "h-3 bg-dim")} />
                  ))}
                </div>
                <div>
                  <h3 id={`service-${i}`} className="text-[1.375rem] leading-tight font-semibold">
                    {item.name}
                  </h3>
                  {i === 0 && (
                    <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.14em] text-volt uppercase">{dict.ui.mainOffer}</p>
                  )}
                  <p className="mt-3 text-[0.9688rem] leading-relaxed text-fog">{item.text}</p>
                </div>
              </div>
              <a href="#contact" className="pill self-start bg-bone text-ink lg:self-auto">
                {dict.nav.cta}
              </a>
            </div>

            <p aria-hidden className="display pointer-events-none absolute bottom-[3svh] left-10 hidden text-[2.875rem] whitespace-nowrap text-[#5b5a70] lg:block">
              {items.map((entry, k) => (
                <span key={entry.name} className={cn("mr-[4.5vw]", k === i && "text-bone")}>
                  {entry.name}
                </span>
              ))}
            </p>
          </article>
        );
      }}
    </SteppedScene>
  );
}
