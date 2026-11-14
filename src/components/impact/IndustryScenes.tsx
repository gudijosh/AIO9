"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industries } from "@/data/industries";
import { DemoScene, Pairs, type DemoSceneData } from "./DemoScene";
import { Reveal } from "./Reveal";
import { industryWindows } from "./windows";

/**
 * The six industries, two to a row, each with its own software window.
 * The section cuts across the bottom of the hero on a diagonal.
 */
export function IndustryScenes({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const scenes: DemoSceneData[] = industries.map((industry) => {
    const text = dict.industries[industry.id];
    return {
      id: industry.id,
      color: industry.color,
      word: text.word,
      name: text.name,
      label: text.service,
      title: text.title,
      description: text.description,
      from: text.from,
      to: text.to,
      steps: text.steps,
      durations: industry.stepDurations,
      Window: industryWindows[industry.id],
    };
  });

  return (
    <section
      id="industries"
      aria-labelledby="industries-heading"
      className="relative isolate z-10 -mt-[14vw] overflow-x-clip bg-ink pt-[22vw] [clip-path:polygon(0_14vw,100%_0,100%_100%,0_100%)] lg:pt-[19vw]"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_0%,var(--color-ink-800)_0%,var(--color-ink)_45%)]" />
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <Reveal className="mx-auto max-w-[1700px] px-5 pb-14 lg:px-10 lg:pb-20 xl:px-14">
        <h2 id="industries-heading" className="display max-w-[16ch] text-[clamp(3.25rem,8vw,8rem)] text-balance">
          {dict.experience.heading}
        </h2>
        <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-fog">{dict.experience.intro}</p>
      </Reveal>
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
