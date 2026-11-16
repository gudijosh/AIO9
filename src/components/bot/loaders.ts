import type { Locale } from "@/i18n/config";
import type { BotKnowledge } from "@/lib/bot/types";

/**
 * The bot's knowledge, one chunk per language, fetched only when the panel
 * is first opened (or prefetched when the visitor points at the launcher).
 * Nothing here runs on import: each `import()` is its own split point.
 */
const loaded: Partial<Record<Locale, BotKnowledge>> = {};

export function loadKnowledge(locale: Locale): Promise<BotKnowledge> {
  const request: Promise<BotKnowledge> =
    locale === "es"
      ? import("@/data/bot/es").then((mod) => mod.default)
      : import("@/data/bot/en").then((mod) => mod.default);
  return request.then((kb) => {
    loaded[locale] = kb;
    return kb;
  });
}

/** The knowledge for `locale` if it has already arrived, so the panel can open on the greeting. */
export function knowledgeFor(locale: Locale): BotKnowledge | null {
  return loaded[locale] ?? null;
}
