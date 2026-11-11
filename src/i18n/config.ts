export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const localeNames: Record<Locale, string> = { es: "Español", en: "English" };
export const ogLocales: Record<Locale, string> = { es: "es_GT", en: "en_US" };
