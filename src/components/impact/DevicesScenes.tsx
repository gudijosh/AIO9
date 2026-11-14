"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { deviceSectors } from "@/data/devices";
import Image from "next/image";
import photo from "../../../public/images/hero/devices.webp";
import { DemoScene, Pairs, type DemoSceneData } from "./DemoScene";
import { Curtain, Drift, Fly } from "./Parallax";
import { Reveal } from "./Reveal";
import { deviceWindows } from "./windows";

/**
 * AIO9 Devices: automation with ESP32 and Raspberry Pi hardware. An opening
 * with a photo of the hardware, then its four sectors two to a row.
 */
export function DevicesScenes({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const t = dict.devices;
  const scenes: DemoSceneData[] = deviceSectors.map((sector) => {
    const text = t.sectors[sector.id];
    return {
      id: sector.id,
      color: sector.color,
      word: text.word,
      name: text.name,
      label: text.hardware,
      title: text.title,
      description: text.description,
      from: text.from,
      to: text.to,
      steps: text.steps,
      durations: sector.stepDurations,
      Window: deviceWindows[sector.id],
    };
  });

  return (
    <section
      id="devices"
      aria-labelledby="devices-heading"
      className="relative isolate overflow-x-clip bg-ink pt-24 lg:pt-32"
    >
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <Curtain to="left" colors={["var(--color-volt)", "var(--color-azure)"]} />
      <div className="mx-auto grid max-w-[1700px] items-center gap-10 px-5 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-10 lg:pb-24 xl:px-14">
        <Reveal from="left">
          <p className="font-mono text-[11px] tracking-[0.14em] text-volt uppercase">
            {t.label}
          </p>
          <h2
            id="devices-heading"
            className="display mt-4 text-[clamp(3.5rem,7.4vw,7.5rem)] text-balance"
          >
            {t.title}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-fog">
            {t.description}
          </p>
          <ul className="mt-7 flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.14em] uppercase">
            {t.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-volt/70 px-3 py-1.5 text-volt"
              >
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>
        <Fly from="right">
          <Drift speed={70}>
            <Image
              src={photo}
              alt={t.photoAlt}
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="aspect-[16/10] w-full rounded-[14px] object-cover shadow-[0_60px_110px_-30px_#000,0_0_120px_-40px_var(--color-volt)]"
            />
          </Drift>
        </Fly>
      </div>
      <Pairs>
        {scenes.map((scene, i) => (
          <DemoScene
            key={scene.id}
            data={scene}
            index={i}
            total={scenes.length}
            side={i % 2 ? "right" : "left"}
            locale={locale}
            dict={dict}
          />
        ))}
      </Pairs>
    </section>
  );
}
