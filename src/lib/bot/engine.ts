/**
 * Matching engine of the AIO9 bot. Rule-based: it compares what the visitor
 * typed with the patterns and keywords of a fixed knowledge base and returns
 * one of its fixed answers. No AI, no network, no eval, no HTML.
 *
 * Safety properties (covered by tests/bot.test.mjs):
 * - Input is cut to MAX_INPUT characters before anything else.
 * - Only fixed regular expressions; nothing is ever built from user input.
 * - Pure and deterministic: same knowledge base and input, same reply.
 * - Replies only contain strings and arrays taken from the knowledge base;
 *   the visitor's text is never echoed back.
 *
 * Pipeline: normalise (strip accents, lowercase, keep [a-z0-9]) → tokens →
 * drop stopwords → synonyms → light stemming. The same pipeline runs on the
 * knowledge base, which is indexed once per object (WeakMap cache).
 *
 * Scoring per intent mixes three signals, all in [0, 1]:
 * - pattern similarity: best weighted Dice coefficient between the input and
 *   one of the intent's patterns (1 when the input is exactly a pattern);
 * - keyword evidence: weighted keyword hits, saturated;
 * - coverage: share of the input explained by the intent's vocabulary.
 * Tokens are weighted by how specific they are (inverse intent frequency),
 * so words that appear in many intents count less. Typos are tolerated by
 * edit distance, and word variants (agenda/agendar) by shared prefixes.
 *
 * Decision: fall back when too much of the input is unknown to the whole
 * knowledge base (off-topic); answer when the best intent clears a score,
 * beats the runner-up by a margin and explains enough of the input; offer
 * up to three close topics when unsure; otherwise fall back.
 */
import type { BotAction, BotIntent, BotKnowledge, BotReply, IntentId, ReplyFor, Respond } from "./types.ts";
import { MAX_INPUT } from "./types.ts";

/* ------------------------------------------------------------------------ */
/* Tuning constants                                                          */
/* ------------------------------------------------------------------------ */

/**
 * How these were chosen: the engine was run on independent evaluation sets
 * (tests/bot/eval.*.json: three visitor questions per intent plus off-topic
 * and adversarial inputs, written without looking at the knowledge bases)
 * and the constants were swept on both languages. What separates off-topic
 * input is mostly MIN_KNOWN: in-scope questions are almost entirely made of
 * words the knowledge base knows, off-topic ones are not. Around the chosen
 * values every constant can move by about ±0.05 (weights by ±0.1) and
 * accuracy changes by one question at most, so they are not fitted to
 * particular questions. Ties lean towards the fallback: a wrong answer is
 * worse than "I don't know" plus the contact form.
 */
/** Minimum score to answer directly. */
const ANSWER_MIN = 0.4;
/** The winner must beat the runner-up by this much to answer directly. */
const ANSWER_MARGIN = 0.06;
/**
 * Minimum share of the input (by token weight) that the knowledge base knows
 * at all. Off-topic questions are mostly made of words no intent uses
 * ("receta de pepián", "peso rápido"); one known word next to an equally
 * specific unknown one is exactly 0.5, so that case falls back.
 */
const MIN_KNOWN = 0.51;
/**
 * Minimum share of the input that the chosen intent must explain, for an
 * answer or a clarification option.
 */
const MIN_COVERAGE = 0.4;
/** Minimum score for a topic to be offered in a clarification. */
const CLARIFY_MIN = 0.32;
/** Topics within this distance of the best one are offered together. */
const CLARIFY_BAND = 0.06;
/** At most this many topics in a clarification. */
const CLARIFY_MAX = 3;

/** Weights of the three signals (they add up to 1). */
const PATTERN_WEIGHT = 0.4;
const KEYWORD_WEIGHT = 0.25;
const COVERAGE_WEIGHT = 0.35;
/** Keyword evidence k is saturated as k / (k + KEYWORD_HALF). */
const KEYWORD_HALF = 1;

/**
 * Weight of an input word the knowledge base doesn't know. Known words weigh
 * between ~0.17 (in every intent) and 1 (in a single intent); a word in no
 * intent is at least as specific as the rarest known one, so it weighs 1.
 * Unknown words dilute the match, which keeps off-topic input out.
 */
const UNKNOWN_WEIGHT = 1;

/** Typo tolerance: words this long accept one edit (Damerau–Levenshtein)… */
const TYPO_MIN_LENGTH = 5;
/** …and words this long accept two. */
const TYPO2_MIN_LENGTH = 8;
const TYPO1_QUALITY = 0.8;
const TYPO2_QUALITY = 0.6;
/**
 * Word variants: two words of at least PREFIX_MIN_LENGTH characters whose
 * common prefix covers the shorter one but its last letter count as a
 * partial match (agenda/agendar, cotizar/cotizacion, pequeno/pequena).
 */
const PREFIX_MIN_LENGTH = 6;
const PREFIX_QUALITY = 0.7;

/* ------------------------------------------------------------------------ */
/* Normalising and tokens                                                    */
/* ------------------------------------------------------------------------ */

const COMBINING_MARKS = /[\u0300-\u036f]/g;
const NON_ALNUM = /[^a-z0-9]+/g;
const HAS_DIGIT = /[0-9]/;

/** Lowercase, without accents (ñ→n, á→a), only [a-z0-9] and single spaces. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(NON_ALNUM, " ")
    .trim();
}

function words(text: string): string[] {
  const normal = normalize(text);
  return normal === "" ? [] : normal.split(" ");
}

/**
 * Light stemming for Spanish and English, applied the same way to the input
 * and to the knowledge base, so only consistency matters: plural -es/-s
 * (sectores→sector, industries→industry) and then a final -e, so that both
 * forms of a word meet (clientes/cliente→client, prices/price→pric). Words
 * of three letters or less are kept as they are. Verb endings (-ing, -ed)
 * are left alone on purpose: they merged words the knowledge base keeps
 * apart (hire/hiring).
 */
function stem(word: string): string {
  if (word.length <= 3 || HAS_DIGIT.test(word)) return word;
  let w = word;
  if (w.endsWith("ies") && w.length > 4) {
    w = `${w.slice(0, -3)}y`;
  } else if (w.endsWith("ss")) {
    // business, process, class: not a plural
  } else if (w.endsWith("es") && w.length - 2 >= 3) {
    w = w.slice(0, -2);
  } else if (w.endsWith("s") && !w.endsWith("us") && !w.endsWith("is")) {
    w = w.slice(0, -1);
  }
  if (w.endsWith("e") && w.length >= 4) w = w.slice(0, -1);
  return w;
}

/* ------------------------------------------------------------------------ */
/* Index (built once per knowledge base)                                     */
/* ------------------------------------------------------------------------ */

interface PhraseSynonym {
  from: readonly string[];
  to: readonly string[];
}

interface Lexicon {
  stop: ReadonlySet<string>;
  /** Single word (normalised, and its stem) → replacement tokens. */
  synonyms: ReadonlyMap<string, readonly string[]>;
  /** Multi-word synonym keys, matched on the normalised words. */
  phrases: readonly PhraseSynonym[];
}

interface IndexedPattern {
  /** Unique tokens. */
  tokens: readonly string[];
  /** Sum of the token weights. */
  weight: number;
}

interface IndexedKeyword {
  tokens: readonly string[];
  weight: number;
  /** Specificity of the keyword: the highest weight of its tokens. */
  specificity: number;
}

interface IndexedIntent {
  intent: BotIntent;
  patterns: readonly IndexedPattern[];
  keywords: readonly IndexedKeyword[];
  vocab: ReadonlySet<string>;
}

interface Index {
  lexicon: Lexicon;
  intents: readonly IndexedIntent[];
  /** Specificity weight of every known token, in (0, 1]. */
  weight: ReadonlyMap<string, number>;
  /** Known tokens, for typo and variant lookups. */
  vocab: readonly string[];
  byId: ReadonlyMap<string, BotIntent>;
}

const cache = new WeakMap<BotKnowledge, Index>();

function buildLexicon(kb: BotKnowledge): Lexicon {
  const stop = new Set<string>();
  for (const entry of kb.stopwords) {
    for (const w of words(entry)) {
      stop.add(w);
      stop.add(stem(w));
    }
  }
  const valueTokens = (value: string): string[] =>
    words(value)
      .filter((w) => w.length > 1 && !stop.has(w))
      .map(stem);
  const synonyms = new Map<string, readonly string[]>();
  const phrases: PhraseSynonym[] = [];
  for (const [key, value] of Object.entries(kb.synonyms)) {
    const from = words(key);
    const to = valueTokens(value);
    if (from.length === 0) continue;
    if (from.length === 1) {
      if (!synonyms.has(from[0])) synonyms.set(from[0], to);
      const stemmed = stem(from[0]);
      if (!synonyms.has(stemmed)) synonyms.set(stemmed, to);
    } else {
      phrases.push({ from: from.map(stem), to });
    }
  }
  // Longer phrases first, so the most specific one wins.
  phrases.sort((a, b) => b.from.length - a.from.length);
  return { stop, synonyms, phrases };
}

/** Text → analysed tokens, in order (duplicates kept). */
function analyze(text: string, lex: Lexicon): string[] {
  const raw = words(text);
  const out: string[] = [];
  let i = 0;
  while (i < raw.length) {
    let replaced = false;
    for (const phrase of lex.phrases) {
      const n = phrase.from.length;
      if (i + n > raw.length) continue;
      let ok = true;
      for (let j = 0; j < n; j++) {
        if (stem(raw[i + j]) !== phrase.from[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        out.push(...phrase.to);
        i += n;
        replaced = true;
        break;
      }
    }
    if (replaced) continue;
    const word = raw[i];
    i += 1;
    // Single letters carry no meaning here; single digits do ("2 + 2").
    if (word.length < 2 && !HAS_DIGIT.test(word)) continue;
    const direct = lex.synonyms.get(word);
    if (direct) {
      out.push(...direct);
      continue;
    }
    const stemmed = stem(word);
    if (lex.stop.has(word) || lex.stop.has(stemmed)) continue;
    const viaStem = lex.synonyms.get(stemmed);
    if (viaStem) out.push(...viaStem);
    else out.push(stemmed);
  }
  return out;
}

function unique(tokens: readonly string[]): string[] {
  return [...new Set(tokens)];
}

function buildIndex(kb: BotKnowledge): Index {
  const lexicon = buildLexicon(kb);
  const drafts = kb.intents.map((intent) => {
    const patterns = intent.patterns.map((p) => unique(analyze(p, lexicon))).filter((t) => t.length > 0);
    const keywordMap = new Map<string, { tokens: string[]; weight: number }>();
    for (const keyword of intent.keywords) {
      const term = typeof keyword === "string" ? keyword : keyword[0];
      const weight = typeof keyword === "string" ? 1 : keyword[1];
      const tokens = analyze(term, lexicon);
      if (tokens.length === 0 || !(weight > 0)) continue;
      const key = tokens.join(" ");
      const prev = keywordMap.get(key);
      if (!prev || prev.weight < weight) keywordMap.set(key, { tokens, weight });
    }
    const vocab = new Set<string>();
    for (const p of patterns) for (const t of p) vocab.add(t);
    for (const k of keywordMap.values()) for (const t of k.tokens) vocab.add(t);
    return { intent, patterns, keywords: [...keywordMap.values()], vocab };
  });

  // Specificity: inverse intent frequency, scaled to (0, 1].
  const df = new Map<string, number>();
  for (const d of drafts) for (const t of d.vocab) df.set(t, (df.get(t) ?? 0) + 1);
  const n = Math.max(drafts.length, 1);
  const top = Math.log(1 + n);
  const weight = new Map<string, number>();
  for (const [t, f] of df) weight.set(t, Math.log(1 + n / f) / top);
  const w = (t: string): number => weight.get(t) ?? UNKNOWN_WEIGHT;

  const intents: IndexedIntent[] = drafts.map((d) => ({
    intent: d.intent,
    vocab: d.vocab,
    patterns: d.patterns.map((tokens) => ({ tokens, weight: tokens.reduce((s, t) => s + w(t), 0) })),
    keywords: d.keywords.map((k) => ({
      tokens: k.tokens,
      weight: k.weight,
      specificity: Math.max(...k.tokens.map(w)),
    })),
  }));

  const byId = new Map<string, BotIntent>();
  for (const intent of kb.intents) if (!byId.has(intent.id)) byId.set(intent.id, intent);

  return { lexicon, intents, weight, vocab: [...weight.keys()], byId };
}

function indexOf(kb: BotKnowledge): Index {
  let index = cache.get(kb);
  if (!index) {
    index = buildIndex(kb);
    cache.set(kb, index);
  }
  return index;
}

/* ------------------------------------------------------------------------ */
/* Fuzzy matching                                                            */
/* ------------------------------------------------------------------------ */

/** Damerau–Levenshtein (optimal string alignment), or max + 1 if larger. */
function editDistance(a: string, b: string, max: number): number {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  let prev2: number[] = [];
  let prev: number[] = [];
  for (let j = 0; j <= lb; j++) prev.push(j);
  for (let i = 1; i <= la; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (
        i > 1 &&
        j > 1 &&
        a.charCodeAt(i - 1) === b.charCodeAt(j - 2) &&
        a.charCodeAt(i - 2) === b.charCodeAt(j - 1)
      ) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[lb];
}

function commonPrefix(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a.charCodeAt(i) === b.charCodeAt(i)) i++;
  return i;
}

/**
 * Known tokens an input token stands for, with a quality in (0, 1]:
 * itself (1), a word variant (shared prefix) or, for unknown words, a typo.
 */
function matchesFor(token: string, index: Index): Map<string, number> {
  const found = new Map<string, number>();
  const known = index.weight.has(token);
  if (known) found.set(token, 1);
  if (HAS_DIGIT.test(token)) return found;
  for (const candidate of index.vocab) {
    if (candidate === token || HAS_DIGIT.test(candidate)) continue;
    const shorter = Math.min(token.length, candidate.length);
    let quality = 0;
    if (shorter >= PREFIX_MIN_LENGTH && commonPrefix(token, candidate) >= shorter - 1) {
      quality = PREFIX_QUALITY;
    }
    if (!known && shorter >= TYPO_MIN_LENGTH) {
      const max = shorter >= TYPO2_MIN_LENGTH ? 2 : 1;
      const d = editDistance(token, candidate, max);
      if (d <= max) quality = Math.max(quality, d === 1 ? TYPO1_QUALITY : TYPO2_QUALITY);
    }
    if (quality > 0) found.set(candidate, quality);
  }
  return found;
}

/* ------------------------------------------------------------------------ */
/* Scoring                                                                   */
/* ------------------------------------------------------------------------ */

interface Ranked {
  position: number;
  score: number;
  /** Share of the input explained by the intent's vocabulary. */
  coverage: number;
}

interface QueryToken {
  matches: Map<string, number>;
  weight: number;
}

function bestIn(q: QueryToken, set: ReadonlySet<string> | readonly string[]): number {
  let best = 0;
  if (set instanceof Set) {
    for (const [t, quality] of q.matches) if (quality > best && set.has(t)) best = quality;
  } else {
    for (const t of set as readonly string[]) {
      const quality = q.matches.get(t);
      if (quality !== undefined && quality > best) best = quality;
    }
  }
  return best;
}

interface Ranking {
  /** Share of the input (by token weight) known to the knowledge base at all. */
  known: number;
  /** One entry per intent, in knowledge-base order. */
  intents: Ranked[];
}

function rank(index: Index, sequence: readonly string[]): Ranking {
  const w = (t: string): number => index.weight.get(t) ?? UNKNOWN_WEIGHT;
  const query: QueryToken[] = [];
  const byToken = new Map<string, QueryToken>();
  for (const token of unique(sequence)) {
    const matches = matchesFor(token, index);
    let weight = UNKNOWN_WEIGHT;
    if (index.weight.has(token)) weight = w(token);
    else if (matches.size > 0) weight = Math.max(...[...matches.keys()].map(w));
    const q = { matches, weight };
    query.push(q);
    byToken.set(token, q);
  }
  const queryWeight = query.reduce((s, q) => s + q.weight, 0);
  let knownWeight = 0;
  for (const q of query) knownWeight += q.weight * Math.max(0, ...q.matches.values());
  const known = queryWeight > 0 ? knownWeight / queryWeight : 0;
  // Best quality with which each known token is present in the input.
  const present = new Map<string, number>();
  for (const q of query) {
    for (const [t, quality] of q.matches) {
      if ((present.get(t) ?? 0) < quality) present.set(t, quality);
    }
  }

  const intents = index.intents.map((entry, position): Ranked => {
    // Pattern similarity: weighted Dice against the best pattern.
    let pattern = 0;
    for (const p of entry.patterns) {
      let inPattern = 0;
      for (const t of p.tokens) inPattern += w(t) * (present.get(t) ?? 0);
      if (inPattern === 0) continue;
      let inQuery = 0;
      for (const q of query) inQuery += q.weight * bestIn(q, p.tokens);
      const dice = (inPattern + inQuery) / (p.weight + queryWeight);
      if (dice > pattern) pattern = dice;
    }
    // An input that is exactly one of the patterns is the strongest signal.
    if (pattern >= 0.9999) return { position, score: 1, coverage: 1 };

    // Keyword evidence.
    let evidence = 0;
    for (const k of entry.keywords) {
      let quality = 0;
      if (k.tokens.length === 1) {
        quality = present.get(k.tokens[0]) ?? 0;
      } else {
        for (let i = 0; i + k.tokens.length <= sequence.length; i++) {
          let q = 1;
          for (let j = 0; j < k.tokens.length && q > 0; j++) {
            q = Math.min(q, byToken.get(sequence[i + j])?.matches.get(k.tokens[j]) ?? 0);
          }
          if (q > quality) quality = q;
        }
      }
      evidence += k.weight * quality * k.specificity;
    }
    const keyword = evidence / (evidence + KEYWORD_HALF);

    // Coverage: share of the input explained by the intent's vocabulary.
    let covered = 0;
    for (const q of query) covered += q.weight * bestIn(q, entry.vocab);
    const coverage = queryWeight > 0 ? covered / queryWeight : 0;

    const score = PATTERN_WEIGHT * pattern + KEYWORD_WEIGHT * keyword + COVERAGE_WEIGHT * coverage;
    return { position, score, coverage };
  });
  return { known, intents };
}

/* ------------------------------------------------------------------------ */
/* Replies                                                                   */
/* ------------------------------------------------------------------------ */

function fallback(kb: BotKnowledge): BotReply {
  return { kind: "fallback", answer: [...kb.fallback.answer], actions: [...kb.fallback.actions] };
}

function answer(intent: BotIntent, score: number): BotReply {
  const actions: readonly BotAction[] = intent.actions ?? [];
  const related: readonly IntentId[] = intent.related ?? [];
  return {
    kind: "answer",
    intent: intent.id,
    answer: [...intent.answer],
    actions: [...actions],
    related: [...related],
    score: Math.round(score * 1000) / 1000,
  };
}

export const respond: Respond = (kb, input) => {
  const text = typeof input === "string" ? input.slice(0, MAX_INPUT) : "";
  const index = indexOf(kb);
  const sequence = analyze(text, index.lexicon);
  if (sequence.length === 0 || index.intents.length === 0) return fallback(kb);

  const { known, intents } = rank(index, sequence);
  // Too much of the input is unknown to the knowledge base: off-topic.
  if (known < MIN_KNOWN) return fallback(kb);
  const ranked = intents.sort((a, b) => b.score - a.score || a.position - b.position);
  const best = ranked[0];
  // The margin is measured against every intent, even those that fail the
  // coverage gate: a strong competitor means the input is ambiguous.
  const second = ranked[1]?.score ?? 0;

  if (best.score >= ANSWER_MIN && best.score - second >= ANSWER_MARGIN && best.coverage >= MIN_COVERAGE) {
    return answer(index.intents[best.position].intent, best.score);
  }
  if (best.score >= CLARIFY_MIN) {
    const options: IntentId[] = [];
    for (const r of ranked) {
      if (options.length >= CLARIFY_MAX || r.score < CLARIFY_MIN || r.score < best.score - CLARIFY_BAND) break;
      if (r.coverage < MIN_COVERAGE) continue;
      const id = index.intents[r.position].intent.id;
      if (!options.includes(id)) options.push(id);
    }
    if (options.length >= 2) return { kind: "clarify", text: kb.clarify, options };
  }
  return fallback(kb);
};

export const replyFor: ReplyFor = (kb, id) => {
  const intent = indexOf(kb).byId.get(id);
  return intent ? answer(intent, 1) : fallback(kb);
};
