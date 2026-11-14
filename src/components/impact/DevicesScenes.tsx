"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { deviceSectors } from "@/data/devices";
import { Boards } from "./Boards";
import { DemoScene, type DemoSceneData } from "./DemoScene";
import { DotWord } from "./DotWord";
import { SteppedScene } from "./scroll/SteppedScene";
import { deviceWindows } from "./windows";

/**
 * AIO9 Devices: automation with ESP32 and Raspberry Pi hardware. An opening
 * screen with the two boards, then one screen per sector with its software.
 */
export function DevicesScenes({ dict, locale }: { dict: Dictionary; locale: Locale }) {
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
    <SteppedScene id="devices" count={scenes.length + 1} label={dict.nav.devices}>
      {(i, live) =>
        i === 0 ? (
          <div className="relative isolate flex min-h-svh flex-col justify-center px-5 pt-[calc(11svh+25vw)] pb-12 lg:h-full lg:min-h-0 lg:px-10 lg:pt-[30svh] lg:pb-8">
            <div aria-hidden className="grain absolute inset-0 -z-10" />
            <DotWord word={t.word} color="var(--color-volt)" className="-z-10 top-[11svh] lg:top-[5svh]" />
            <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-volt uppercase">{t.label}</p>
                <h2 className="display mt-4 text-[clamp(3.5rem,7vw,7rem)] text-balance">{t.title}</h2>
                <p className="mt-5 max-w-[44ch] text-[1.0625rem] leading-relaxed text-fog">{t.description}</p>
                <ul className="mt-7 flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.14em] uppercase">
                  {t.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-volt/70 px-3 py-1.5 text-volt">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <Boards />
            </div>
            <ul className="display mx-auto mt-10 flex w-full max-w-[1500px] flex-wrap gap-x-12 gap-y-2 text-[clamp(1.75rem,3vw,2.875rem)] lg:mt-6">
              {deviceSectors.map((sector) => (
                <li key={sector.id} style={{ color: sector.color }}>
                  {t.sectors[sector.id].name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <DemoScene data={scenes[i - 1]} index={i - 1} total={scenes.length} live={live} locale={locale} dict={dict} />
        )
      }
    </SteppedScene>
  );
}
