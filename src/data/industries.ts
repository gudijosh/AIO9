import type { StaticImageData } from "next/image";
import healthcare from "../../public/images/industries/healthcare.webp";
import hospitality from "../../public/images/industries/hospitality.webp";
import realEstate from "../../public/images/industries/real-estate.webp";
import retail from "../../public/images/industries/retail.webp";
import services from "../../public/images/industries/services.webp";
import logistics from "../../public/images/industries/logistics.webp";

export const industryIds = [
  "healthcare",
  "hospitality",
  "realEstate",
  "retail",
  "services",
  "logistics",
] as const;

export type IndustryId = (typeof industryIds)[number];

export interface Industry {
  id: IndustryId;
  image: StaticImageData;
  /** CSS object-position used when the photo is cropped. */
  focus: string;
  /** Framing for the narrow portrait crop in the hero, when it needs its own. */
  heroFocus?: string;
  /**
   * One entry per step of the demonstration: how long that step stays on
   * screen (ms). The step labels live in the dictionaries and must have the
   * same length.
   */
  stepDurations: readonly number[];
  /** Colour of this industry's software, used for its card frame, word and glow. */
  color: string;
}

export const industries: readonly Industry[] = [
  { id: "healthcare", color: "#17B3A3", image: healthcare, focus: "48% 55%", heroFocus: "31% 55%", stepDurations: [1000, 1100, 1300, 1200, 1000, 1400] },
  { id: "hospitality", color: "#E8794A", image: hospitality, focus: "58% 50%", stepDurations: [1000, 1100, 1400, 1200, 1400] },
  { id: "realEstate", color: "#C9A24B", image: realEstate, focus: "45% 55%", stepDurations: [1000, 1100, 1500, 1300, 1100, 1400] },
  { id: "retail", color: "#E0457B", image: retail, focus: "62% 50%", stepDurations: [1000, 1300, 1300, 1200, 1400] },
  { id: "services", color: "#7B6CFF", image: services, focus: "42% 50%", stepDurations: [1000, 1100, 1400, 1100, 1300, 1400] },
  { id: "logistics", color: "#F5A524", image: logistics, focus: "55% 50%", stepDurations: [1000, 1300, 1300, 1200, 1200, 1400] },
];

export const industryById = Object.fromEntries(industries.map((i) => [i.id, i])) as Record<
  IndustryId,
  Industry
>;
