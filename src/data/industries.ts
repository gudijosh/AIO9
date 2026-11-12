import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import { FolderOpen, House, ShoppingBag, Stethoscope, Truck, UtensilsCrossed } from "lucide-react";
import { themes, type AppTheme } from "./themes";
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
  /** Display order, shown in the rail. */
  number: string;
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
  /** Mark of this industry's software product. */
  icon: LucideIcon;
  /** Colours of this industry's software product. */
  theme: AppTheme;
}

export const industries: readonly Industry[] = [
  { id: "healthcare", icon: Stethoscope, theme: themes.healthcare, number: "01", image: healthcare, focus: "48% 55%", heroFocus: "31% 55%", stepDurations: [1000, 1100, 1300, 1200, 1000, 1400] },
  { id: "hospitality", icon: UtensilsCrossed, theme: themes.hospitality, number: "02", image: hospitality, focus: "58% 50%", stepDurations: [1000, 1100, 1400, 1200, 1400] },
  { id: "realEstate", icon: House, theme: themes.realEstate, number: "03", image: realEstate, focus: "45% 55%", stepDurations: [1000, 1100, 1500, 1300, 1100, 1400] },
  { id: "retail", icon: ShoppingBag, theme: themes.retail, number: "04", image: retail, focus: "62% 50%", stepDurations: [1000, 1300, 1300, 1200, 1400] },
  { id: "services", icon: FolderOpen, theme: themes.services, number: "05", image: services, focus: "42% 50%", stepDurations: [1000, 1100, 1400, 1100, 1300, 1400] },
  { id: "logistics", icon: Truck, theme: themes.logistics, number: "06", image: logistics, focus: "55% 50%", stepDurations: [1000, 1300, 1300, 1200, 1200, 1400] },
];

/** The three scenes layered in the hero. */
export const heroIndustryIds: readonly IndustryId[] = ["healthcare", "hospitality", "services"];

export const industryById = Object.fromEntries(industries.map((i) => [i.id, i])) as Record<
  IndustryId,
  Industry
>;
