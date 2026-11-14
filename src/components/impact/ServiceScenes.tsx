import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import { Boards } from "./Boards";
import { Pairs } from "./DemoScene";
import { LedWord } from "./LedWord";
import { Reveal } from "./Reveal";
import { Fit } from "./scroll/Fit";
import { HealthcareWindow } from "./windows/HealthcareWindow";
import { OperationsWindow } from "./windows/OperationsWindow";
import { ServicesWindow } from "./windows/ServicesWindow";

const COLORS = ["#2F63FF", "#FF7A52", "#B79CFF", "#D4FF3A"];

function Polaroid({ id, className }: { id: "retail" | "realEstate"; className?: string }) {
  const industry = industryById[id];
  return (
    <div className={cn("bg-bone p-2 shadow-[0_40px_80px_-20px_#000]", className)}>
      <Image
        src={industry.image}
        alt=""
        sizes="(min-width: 1024px) 20vw, 46vw"
        className="aspect-[4/5] w-full object-cover"
        style={{ objectPosition: industry.focus }}
      />
    </div>
  );
}

/**
 * The four products, two to a row: the name in LED dots, one object that
 * stands for it, and what it does in plain words.
 */
export function ServiceScenes({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const items = dict.capabilities.items.slice(0, 4);
  const done = { locale, simulation: dict.experience.simulation } as const;
  const frame = "rounded-[12px] shadow-[0_50px_90px_-30px_#000]";

  const objects: ReactNode[] = [
    <div key="automate" className={cn(frame, "shadow-[0_50px_90px_-30px_#000,0_0_110px_-30px_var(--color-azure)]")}>
      <Fit className="overflow-hidden rounded-[inherit]">
        <HealthcareWindow step={5} {...done} />
      </Fit>
    </div>,
    <div key="web" className="relative mx-auto aspect-[760/480] w-full">
      <Polaroid id="retail" className="absolute top-0 left-[12%] w-[36%] motion-safe:-rotate-7" />
      <Polaroid id="realEstate" className="absolute top-[4%] right-[12%] w-[36%] motion-safe:rotate-6" />
    </div>,
    <div key="systems" className="relative aspect-[760/480] w-full">
      <div className={cn(frame, "absolute top-0 left-0 w-[70%]")}>
        <Fit className="overflow-hidden rounded-[inherit]">
          <ServicesWindow step={5} {...done} />
        </Fit>
      </div>
      <div className={cn(frame, "absolute right-0 bottom-0 w-[72%]")}>
        <Fit className="overflow-hidden rounded-[inherit]">
          <OperationsWindow step={5} {...done} />
        </Fit>
      </div>
    </div>,
    <div key="devices" className="grid aspect-[760/480] w-full place-items-center">
      <Boards className="w-[78%]" />
    </div>,
  ];

  return (
    <section id="services" aria-labelledby="services-heading" className="relative isolate overflow-x-clip bg-ink">
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <h2 id="services-heading" className="sr-only">
        {dict.nav.services}
      </h2>
      <Pairs>
        {items.map((item, i) => {
          const side = i % 2 ? "right" : "left";
          const wait = i % 2 ? 160 : 0;
          return (
            <article
              key={item.name}
              aria-labelledby={`service-${i}`}
              className="flex min-w-0 flex-col px-5 py-16 lg:px-10 lg:py-20 xl:px-14"
            >
              <Reveal from={side} delay={wait}>
                <LedWord word={dict.ui.serviceWords[i]} color={COLORS[i]} />
              </Reveal>
              <Reveal from={side === "left" ? "right" : "left"} delay={wait + 140} className="mt-8">
                <div aria-hidden>{objects[i]}</div>
              </Reveal>
              <Reveal delay={wait + 240} className="mt-9 flex flex-1 flex-col">
                <h3 id={`service-${i}`} className="display text-[clamp(2.5rem,3.9vw,4rem)]">
                  {item.name}
                </h3>
                {i === 0 && (
                  <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-volt uppercase">{dict.ui.mainOffer}</p>
                )}
                <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-fog">{item.text}</p>
                <a href={i === 3 ? "#devices" : "#contact"} className="pill mt-7 self-start bg-bone text-ink">
                  {i === 3 ? dict.nav.devices : dict.nav.cta} <span aria-hidden>→</span>
                </a>
              </Reveal>
            </article>
          );
        })}
      </Pairs>
    </section>
  );
}
