/**
 * Contract for the AIO9 bot: a rule-based helper, not an AI. It matches what
 * the visitor types against a fixed catalogue and answers with fixed text.
 * Nothing is sent to a server, nothing is executed, and answers are plain
 * text (never HTML), so there is no prompt to inject into.
 *
 * Only `import type` here: Node runs the bot tests straight from the .ts
 * files, and type-only imports are erased.
 */
import type { Locale } from "@/i18n/config";
import type { IndustryOption } from "@/lib/contact-schema";
import type { IntentId } from "./intents";

export type { IntentId };

/** Longest message the bot accepts; the input enforces it too. */
export const MAX_INPUT = 200;

/** Sections of the home page the bot can send the visitor to. */
export type BotSection = "industries" | "services" | "devices" | "process" | "videos" | "contact";

/** Buttons shown under an answer. Labels are short and plain text. */
export type BotAction =
  /** Go to the contact form; optionally preselect the industry. */
  | { type: "contact"; label: string; industry?: IndustryOption }
  /** Scroll to a section of the home page. */
  | { type: "section"; label: string; section: BotSection }
  /** Open the questions and answers page. */
  | { type: "faq"; label: string }
  /** Ask the bot about another topic, as if the visitor typed it. */
  | { type: "ask"; label: string; intent: IntentId };

/** A weighted keyword: [term, weight]. A bare string weighs 1. */
export type BotKeyword = string | readonly [term: string, weight: number];

export interface BotIntent {
  id: IntentId;
  /** Short topic name for suggestion chips, e.g. "Precios" / "Pricing". */
  label: string;
  /**
   * Whole questions the way people type them: colloquial, with and without
   * accents, with typos. Matched as phrases after normalising.
   */
  patterns: readonly string[];
  /** Words or short terms that point to this intent. */
  keywords: readonly BotKeyword[];
  /** Answer paragraphs, plain text. Never HTML, never Markdown. */
  answer: readonly string[];
  /** Buttons under the answer. */
  actions?: readonly BotAction[];
  /** Related topics offered as chips after this answer. */
  related?: readonly IntentId[];
}

export interface BotKnowledge {
  locale: Locale;
  /** First bot message when the panel opens. */
  greeting: readonly string[];
  /** Topics offered as chips when the panel opens. */
  starters: readonly IntentId[];
  /** When nothing matches: say so and send the visitor to the form. */
  fallback: { answer: readonly string[]; actions: readonly BotAction[] };
  /** Lead-in when unsure between a few topics, e.g. "¿Te refieres a…?" */
  clarify: string;
  /** Words ignored when matching (articles, pronouns, fillers). */
  stopwords: readonly string[];
  /** Word → canonical word, applied after normalising (e.g. "cotizacion" → "precio"). */
  synonyms: Readonly<Record<string, string>>;
  intents: readonly BotIntent[];
}

export type BotReply =
  | {
      kind: "answer";
      intent: IntentId;
      answer: readonly string[];
      actions: readonly BotAction[];
      related: readonly IntentId[];
      /** Matching score, for tests and tuning only. */
      score: number;
    }
  | {
      /** Unsure: offer up to three topics. */
      kind: "clarify";
      text: string;
      options: readonly IntentId[];
    }
  | {
      kind: "fallback";
      answer: readonly string[];
      actions: readonly BotAction[];
    };

/**
 * The engine's entry point (src/lib/bot/engine.ts). Pure and synchronous:
 * same input, same reply. Input longer than MAX_INPUT is cut, never run.
 */
export type Respond = (kb: BotKnowledge, input: string) => BotReply;

/**
 * Answer for a topic chosen from a button ("ask" actions, suggestion chips),
 * without matching any text. Also exported by src/lib/bot/engine.ts.
 */
export type ReplyFor = (kb: BotKnowledge, intent: IntentId) => BotReply;
