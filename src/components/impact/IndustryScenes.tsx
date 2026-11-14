"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { industries } from "@/data/industries";
import { DemoScene, type DemoSceneData } from "./DemoScene";
import { SteppedScene } from "./scroll/SteppedScene";
import { industryWindows } from "./windows";

/** The six industries, one per screen, each with its own software window. */
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
    <SteppedScene id="industries" count={scenes.length} label={dict.experience.railLabel}>
      {(i, live) => (
        <DemoScene data={scenes[i]} index={i} total={scenes.length} live={live} locale={locale} dict={dict} />
      )}
    </SteppedScene>
  );
}
