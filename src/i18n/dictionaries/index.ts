import type { Locale } from "../config";
import { es } from "./es";
import { en } from "./en";

/** Spanish is the source of truth: `en` must match its shape to compile. */
export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = { es, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
