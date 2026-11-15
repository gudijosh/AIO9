"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industryById } from "@/data/industries";
import { cn } from "@/lib/cn";
import chip from "../../../public/images/hero/esp32.webp";
import { Half, LiveWindow, Pairs, type Side } from "./DemoScene";
import { LedWord } from "./LedWord";
import { Curtain, Drift, Fly } from "./Parallax";
import { Reveal } from "./Reveal";
import { Fit } from "./scroll/Fit";
import { HealthcareWindow } from "./windows/HealthcareWindow";
import { OperationsWindow } from "./windows/OperationsWindow";
import { SiteWindow } from "./windows/SiteWindow";

const COLORS = ["#2F63FF", "#FF7A52", "#B79CFF", "#D4FF3A"];

/**
 * The four products, two to a row: the name in LED dots, one thing that
 * stands for it (a running window, this site in a browser, a real board),
 * and one line on what it does.
 */
export function ServiceScenes({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const items = dict.capabilities.items;
  const simulation = dict.experience.simulation;

  const objects: ReactNode[] = [
    <LiveWindow
      key="automate"
      id="service-automate"
      Window={HealthcareWindow}
      durations={industryById.healthcare.stepDurations}
      locale={locale}
      simulation={simulation}
    />,
    <Fit key="web">
      <SiteWindow
        lines={dict.hero.lines}
        cta={dict.hero.primary}
        words={[
          dict.industries.healthcare.word,
          dict.industries.hospitality.word,
        ]}
      />
    </Fit>,
    <LiveWindow
      key="systems"
      id="service-systems"
      Window={OperationsWindow}
      durations={industryById.logistics.stepDurations}
      locale={locale}
      simulation={simulation}
    />,
    <Image
      key="devices"
      src={chip}
      alt={dict.devices.chipAlt}
      sizes="(min-width: 1024px) 46vw, 96vw"
      className="aspect-[380/480] w-full object-cover lg:aspect-[760/480]"
    />,
  ];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-x-clip bg-ink"
    >
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <Curtain to="right" />
      <h2 id="services-heading" className="sr-only">
        {dict.nav.services}
      </h2>
      <Pairs>
        {items.map((item, i) => {
          const side: Side = i % 2 ? "right" : "left";
          const wait = i % 2 ? 160 : 0;
          const pad = side === "right" && "pl-4 lg:pl-0";
          return (
            <article
              key={item.name}
              aria-labelledby={`service-${i}`}
              className={cn(
                "flex min-w-0 flex-col py-12 lg:px-10 lg:py-20 xl:px-14",
                side === "left" ? "pr-0 pl-4" : "pr-4 pl-0",
              )}
            >
              <Reveal from={side} delay={wait} className={cn(pad)}>
                <LedWord word={dict.ui.serviceWords[i]} color={COLORS[i]} />
              </Reveal>
              <Fly from={side} className="mt-6 lg:mt-8">
                <Half side={side} color={COLORS[i]} whole={i === 3}>
                  <div aria-hidden={i === 3 ? undefined : true}>
                    {objects[i]}
                  </div>
                </Half>
              </Fly>
              <Drift speed={-30} className={cn("mt-6 lg:mt-9", pad)}>
                <Reveal
                  from={side}
                  delay={wait + 160}
                  className="flex flex-col pr-3"
                >
                  <h3
                    id={`service-${i}`}
                    className="display text-[clamp(1.5rem,3.9vw,4rem)]"
                  >
                    {item.name}
                  </h3>
                  <p className="mt-2 min-h-[3lh] max-w-[48ch] text-[13px] leading-snug text-fog lg:mt-4 lg:min-h-[1lh] lg:text-base lg:leading-relaxed">
                    {item.text}
                  </p>
                  <a
                    href="#contact"
                    className="pill mt-5 self-start bg-bone text-ink lg:mt-7"
                  >
                    {dict.experience.consult}{" "}
                    <span aria-hidden>→</span>
                  </a>
                </Reveal>
              </Drift>
            </article>
          );
        })}
      </Pairs>
    </section>
  );
}
