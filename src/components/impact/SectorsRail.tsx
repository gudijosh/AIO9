"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { Bird, ScanBarcode, Sprout, Truck, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { industries } from "@/data/industries";
import { deviceSectors, type DeviceSectorId } from "@/data/devices";
import { DotWord } from "./DotWord";
import { usePinned } from "./scroll/useIsDesktop";

const DEVICE_ICONS: Record<DeviceSectorId, LucideIcon> = { farms: Bird, inventory: ScanBarcode, fleet: Truck, agro: Sprout };
const TILT = [-5, 4, -3, 6, -4, 3, -5, 4, -3, 5];
const DROP = [0, 7, -3, 8, 1, 7, -2, 8, 0, 6];

/**
 * Every sector as a framed card. On desktop the screen stays pinned while
 * vertical scrolling slides the row sideways; on touch screens it is a row
 * you swipe.
 */
export function SectorsRail({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const pinned = usePinned();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => `calc(${52 * (1 - v)}vw + ${-100 * v}% + ${46 * v}vw)`);

  const cards = [
    ...industries.map((industry) => ({
      key: industry.id,
      name: dict.industries[industry.id].name,
      color: industry.color,
      image: industry.image,
      focus: industry.focus,
      alt: dict.industries[industry.id].alt,
      Icon: null as LucideIcon | null,
    })),
    ...deviceSectors.map((sector) => ({
      key: sector.id,
      name: dict.devices.sectors[sector.id].name,
      color: sector.color,
      image: null,
      focus: "",
      alt: "",
      Icon: DEVICE_ICONS[sector.id] as LucideIcon | null,
    })),
  ];
  const total = String(cards.length).padStart(2, "0");

  return (
    <section
      ref={ref}
      id="sectors"
      aria-labelledby="sectors-heading"
      className="relative z-10 -mt-[14vw] bg-ink [clip-path:polygon(0_14vw,100%_0,100%_100%,0_100%)] lg:motion-safe:h-[320svh]"
    >
      <div className="relative isolate overflow-hidden pt-[20vw] pb-16 lg:pt-0 lg:pb-0 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_0%,var(--color-ink-800)_0%,var(--color-ink)_60%)]" />
        <div aria-hidden className="grain absolute inset-0 -z-10" />
        <DotWord word={dict.ui.sectors} color="var(--color-azure)" className="-z-10 top-[17vw] lg:top-[7svh]" />

        <div className="px-5 lg:absolute lg:bottom-[5svh] lg:left-10 lg:z-10 lg:max-w-[46rem] lg:px-0">
          <h2 id="sectors-heading" className="display text-[clamp(2.5rem,4vw,3.25rem)] text-balance lg:text-[2rem]">
            {dict.experience.heading}
          </h2>
        </div>

        <m.ul
          style={pinned ? { x } : undefined}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pt-6 pb-10 [perspective:1400px] lg:absolute lg:top-[22svh] lg:left-0 lg:mt-0 lg:w-max lg:gap-[5vw] lg:px-0 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
        >
          {cards.map((card, i) => (
            <li
              key={card.key}
              style={{ ["--tilt" as string]: `${TILT[i]}deg`, ["--drop" as string]: `${DROP[i]}svh` }}
              className="w-[62vw] max-w-[17rem] shrink-0 snap-center lg:w-[min(17vw,16rem)] lg:motion-safe:translate-y-(--drop) lg:motion-safe:rotate-(--tilt)"
            >
              <div
                style={{ background: `linear-gradient(150deg, ${card.color}, #fff 45%, ${card.color} 70%)` }}
                className="rounded-[14px] p-[7px] shadow-[0_40px_70px_-24px_#000]"
              >
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.alt}
                    sizes="(min-width: 1024px) 17vw, 62vw"
                    className="aspect-[5/7] w-full rounded-[8px] object-cover"
                    style={{ objectPosition: card.focus }}
                  />
                ) : (
                  <div className="grid aspect-[5/7] w-full place-items-center rounded-[8px] bg-ink">
                    {card.Icon && <card.Icon aria-hidden style={{ color: card.color }} className="size-[38%]" strokeWidth={1.25} />}
                  </div>
                )}
              </div>
              <p className="mt-4 text-center font-mono text-[11px] tracking-[0.14em] uppercase">
                {card.name}
                <span className="mt-1 block text-fog">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </p>
            </li>
          ))}
        </m.ul>

      </div>
    </section>
  );
}
