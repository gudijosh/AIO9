"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import * as m from "motion/react-m";
import { ArrowRight, ArrowUpRight, RotateCcw, SendHorizontal, X } from "lucide-react";
import { IoMark } from "./IoMark";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { IndustryOption } from "@/lib/contact-schema";
import { replyFor, respond } from "@/lib/bot/engine";
import {
  MAX_INPUT,
  type BotAction,
  type BotKnowledge,
  type BotReply,
  type BotSection,
  type IntentId,
} from "@/lib/bot/types";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { knowledgeFor, loadKnowledge } from "./loaders";

/** How long the "typing" dots show before a reply (none with reduced motion). */
const TYPING_MS = 350;

export interface BotPanelProps {
  /** id of the dialog; the launcher points at it with aria-controls. */
  id: string;
  locale: Locale;
  t: Dictionary["bot"];
  /** Home page of this language, e.g. "/es": target of section links from other pages. */
  homeHref: string;
  /** Questions page of this language, e.g. "/es/faq". */
  faqHref: string;
  open: boolean;
  /** Closes the panel; with `returnFocus`, focus goes back to the launcher. */
  onClose: (returnFocus: boolean) => void;
}

type Entry =
  | { id: number; from: "user"; text: string }
  | { id: number; from: "bot"; reply: BotReply };

/** What a bot message shows: text, buttons and topic chips. */
interface View {
  paragraphs: readonly string[];
  actions: readonly BotAction[];
  chips: readonly IntentId[];
}

const none: readonly never[] = [];

function viewOf(reply: BotReply): View {
  switch (reply.kind) {
    case "answer":
      return { paragraphs: reply.answer, actions: reply.actions, chips: reply.related };
    case "clarify":
      return { paragraphs: [reply.text], actions: none, chips: reply.options };
    case "fallback":
      return { paragraphs: reply.answer, actions: reply.actions, chips: none };
  }
}

/** Moves keyboard focus to a section without scrolling, as following an in-page link would. */
function focusSection(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
  target.focus({ preventScroll: true });
}

const iconButton =
  "grid size-11 shrink-0 place-items-center rounded-full! text-fog transition-colors duration-200 hover:bg-bone/10 hover:text-bone";

/* Visually 36px tall; the ::before strip brings the touch target to 44px. */
const actionButton =
  "pill rounded-full! border border-volt/45 text-volt hover:border-volt before:absolute before:inset-x-0 before:-inset-y-1";

const chipButton =
  "relative inline-flex min-h-9 min-w-11 items-center justify-center rounded-full! border border-bone/20 px-3.5 py-1.5 text-[13px] leading-tight text-bone/90 transition-colors duration-200 hover:border-volt hover:text-volt before:absolute before:inset-x-0 before:-inset-y-1";

function Typing() {
  return (
    <div data-entry aria-hidden className="flex w-fit items-center gap-1.5 rounded-[16px] rounded-tl-[4px] bg-bone/5 px-4 py-4">
      {[0, 160, 320].map((delay) => (
        <span key={delay} className="size-1.5 animate-blink rounded-full bg-fog" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}

function BotMessage({
  view,
  t,
  labels,
  onAction,
  onAsk,
}: {
  view: View;
  t: Dictionary["bot"];
  labels: ReadonlyMap<IntentId, string>;
  onAction: (action: BotAction) => void;
  onAsk: (intent: IntentId) => void;
}) {
  const chips = view.chips.filter((intent) => labels.has(intent));
  return (
    <div data-entry className="flex flex-col items-start gap-3">
      <div className="max-w-[92%] rounded-[16px] rounded-tl-[4px] border border-bone/[0.07] bg-bone/5 px-4 py-3 text-[15px] leading-[1.55] text-bone">
        {view.paragraphs.map((text, i) => (
          <p key={i} className={cn(i > 0 && "mt-2")}>
            {i === 0 && <span className="sr-only">{t.bot}: </span>}
            {text}
          </p>
        ))}
      </div>
      {view.actions.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {view.actions.map((action, i) => (
            <li key={i}>
              <button type="button" onClick={() => onAction(action)} className={actionButton}>
                {action.label}
                {action.type === "faq" ? (
                  <ArrowUpRight aria-hidden className="size-3.5" />
                ) : action.type !== "ask" ? (
                  <ArrowRight aria-hidden className="size-3.5" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
      {chips.length > 0 && (
        <ul aria-label={t.suggestions} className="flex flex-wrap gap-2">
          {chips.map((intent) => (
            <li key={intent}>
              <button type="button" onClick={() => onAsk(intent)} className={chipButton}>
                {labels.get(intent)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * The bot's panel: a non-modal dialog with the conversation and a field to
 * ask. It loads the knowledge for its language, answers with the rule-based
 * engine and keeps the conversation only in memory: it lives while the page
 * does and "start over" clears it. Answers are rendered as plain text nodes.
 * Stays mounted while closed so reopening shows the same conversation.
 */
export function BotPanel({ id, locale, t, homeHref, faqHref, open, onClose }: BotPanelProps) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [kb, setKb] = useState<BotKnowledge | null>(() => knowledgeFor(locale));
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const pending = useRef<{ timer: number; entry: Entry } | null>(null);
  const smooth = useRef(false);

  const titleId = `${id}-title`;

  const labels = useMemo(
    () => new Map<IntentId, string>(kb ? kb.intents.map((intent) => [intent.id, intent.label] as const) : []),
    [kb],
  );

  // Fetch this language's knowledge the first time the panel opens (it is
  // usually already here: the launcher requests it with the panel's code).
  useEffect(() => {
    if (!open || kb) return;
    let live = true;
    loadKnowledge(locale).then(
      (loaded) => {
        if (!live) return;
        setKb(loaded);
        setFailed(false);
      },
      () => {
        if (live) setFailed(true);
      },
    );
    return () => {
      live = false;
    };
  }, [open, kb, locale, attempt]);

  useEffect(() => {
    const timers = pending;
    return () => {
      if (timers.current) window.clearTimeout(timers.current.timer);
    };
  }, []);

  // On open, focus the question field. On touch screens that would pop the
  // keyboard over the greeting, so the dialog itself takes focus instead.
  useEffect(() => {
    if (!open) return;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    (touch ? dialogRef.current : inputRef.current)?.focus({ preventScroll: true });
  }, [open]);

  // Keep the newest message in view; a long answer shows from its first line.
  useEffect(() => {
    const log = logRef.current;
    if (!open || !log) {
      smooth.current = false;
      return;
    }
    const items = log.querySelectorAll<HTMLElement>("[data-entry]");
    const last = items[items.length - 1];
    const bottom = log.scrollHeight - log.clientHeight;
    const lastTop = last
      ? last.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 16
      : bottom;
    log.scrollTo({
      top: Math.max(0, Math.min(bottom, lastTop)),
      behavior: smooth.current && !reduced ? "smooth" : "auto",
    });
    smooth.current = true;
  }, [open, kb, failed, entries, typing, reduced]);

  /** Shows a reply that is still behind the typing dots right away. */
  const settle = () => {
    const waiting = pending.current;
    if (!waiting) return;
    window.clearTimeout(waiting.timer);
    pending.current = null;
    setTyping(false);
    setEntries((list) => [...list, waiting.entry]);
  };

  /** One exchange: the visitor's bubble, then (after the dots) the bot's reply. */
  const exchange = (text: string, reply: BotReply) => {
    settle();
    const asked: Entry = { id: nextId.current++, from: "user", text };
    const answered: Entry = { id: nextId.current++, from: "bot", reply };
    if (reduced) {
      setEntries((list) => [...list, asked, answered]);
      return;
    }
    setEntries((list) => [...list, asked]);
    setTyping(true);
    const timer = window.setTimeout(() => {
      pending.current = null;
      setTyping(false);
      setEntries((list) => [...list, answered]);
    }, TYPING_MS);
    pending.current = { timer, entry: answered };
  };

  /** A topic picked from a chip or an "ask" button: shown as if the visitor had typed its name. */
  const ask = (intent: IntentId, fallbackLabel?: string) => {
    const label = labels.get(intent) ?? fallbackLabel;
    if (!kb || !label) return;
    exchange(label, replyFor(kb, intent));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.replace(/\s+/g, " ").trim().slice(0, MAX_INPUT);
    if (!text || !kb) return;
    setDraft("");
    exchange(text, respond(kb, text));
  };

  const restart = () => {
    if (pending.current) window.clearTimeout(pending.current.timer);
    pending.current = null;
    setTyping(false);
    setEntries([]);
    setDraft("");
    if (failed) setAttempt((n) => n + 1);
  };

  /**
   * Goes to a home page section: in place when it is on this page, otherwise
   * by navigating to the home page. Sections other than the form are only
   * looked up on the home page itself, because other pages reuse some of
   * those ids (the questions page has <details id="devices">, for one).
   */
  const jump = (section: BotSection, industry?: IndustryOption) => {
    const trim = (path: string) => path.replace(/\/+$/, "");
    const home = trim(window.location.pathname) === trim(homeHref);
    const target = section === "contact" || home ? document.getElementById(section) : null;
    onClose(false);
    if (!target) {
      router.push(`${homeHref}#${section}`);
      return;
    }
    if (industry) window.dispatchEvent(new CustomEvent("aio9:industry", { detail: industry }));
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${section}`);
    focusSection(target);
  };

  const act = (action: BotAction) => {
    switch (action.type) {
      case "ask":
        ask(action.intent, action.label);
        return;
      case "contact":
        jump("contact", action.industry);
        return;
      case "section":
        jump(action.section);
        return;
      case "faq":
        onClose(false);
        router.push(faqHref);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || event.nativeEvent.isComposing) return;
    event.stopPropagation();
    onClose(true);
  };

  if (!open) return null;

  return (
    <m.div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.12 : 0.34, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed z-[60] flex flex-col overflow-hidden border border-bone/10 bg-ink-800 text-bone shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)] outline-none!",
        // Phones: a sheet across the bottom of the screen.
        "inset-x-0 bottom-0 h-[min(80svh,40rem)] rounded-t-[18px]! rounded-b-none! border-b-0",
        // From 640px: a card floating above the launcher.
        "sm:inset-x-auto sm:right-[calc(1rem_+_env(safe-area-inset-right))] sm:bottom-[calc(5.25rem_+_env(safe-area-inset-bottom))] sm:h-[min(600px,75vh)] sm:w-[380px] sm:rounded-[18px]! sm:border-b",
        "lg:right-[calc(2rem_+_env(safe-area-inset-right))] lg:bottom-[calc(6.25rem_+_env(safe-area-inset-bottom))]",
      )}
    >
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />

      <div className="relative flex items-center gap-1 border-b border-bone/10 py-3 pr-2 pl-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IoMark className="size-10" />
          {/* Mono, not the display face: in League Gothic capitals "IO" reads as
              "10", and in the sans the capital I looks like an l. */}
          <h2 id={titleId} className="font-mono text-[1.5rem] leading-none font-semibold text-bone">
            {t.title}
          </h2>
        </div>
        <button type="button" onClick={restart} aria-label={t.restart} title={t.restart} className={iconButton}>
          <RotateCcw aria-hidden className="size-[18px]" />
        </button>
        <button type="button" onClick={() => onClose(true)} aria-label={t.close} title={t.close} className={iconButton}>
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={t.log}
        className="relative min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-color:var(--color-dim)_transparent] [scrollbar-width:thin]"
      >
        {kb ? (
          <BotMessage
            view={{ paragraphs: kb.greeting, actions: none, chips: kb.starters }}
            t={t}
            labels={labels}
            onAction={act}
            onAsk={ask}
          />
        ) : failed ? (
          <BotMessage view={{ paragraphs: [t.error], actions: none, chips: none }} t={t} labels={labels} onAction={act} onAsk={ask} />
        ) : (
          <Typing />
        )}
        {entries.map((entry) =>
          entry.from === "user" ? (
            <div key={entry.id} data-entry className="flex justify-end">
              <p className="max-w-[85%] rounded-[16px] rounded-br-[4px] bg-azure px-4 py-2.5 text-[15px] leading-snug text-white [overflow-wrap:anywhere]">
                <span className="sr-only">{t.you}: </span>
                {entry.text}
              </p>
            </div>
          ) : (
            <BotMessage key={entry.id} view={viewOf(entry.reply)} t={t} labels={labels} onAction={act} onAsk={ask} />
          ),
        )}
        {typing && <Typing />}
      </div>

      <form
        onSubmit={submit}
        className="relative border-t border-bone/10 p-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] sm:pb-3"
      >
        <div className="flex items-center gap-2 rounded-full border border-bone/15 bg-ink py-1 pr-1 pl-5 transition-[border-color,box-shadow] duration-200 focus-within:border-volt focus-within:shadow-[0_0_0_1px_var(--color-volt)]">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, MAX_INPUT))}
            maxLength={MAX_INPUT}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            autoComplete="off"
            enterKeyHint="send"
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-bone outline-none! shadow-none! placeholder:text-fog"
          />
          <button
            type="submit"
            aria-label={t.send}
            className="grid size-11 shrink-0 place-items-center rounded-full! bg-azure text-white transition-colors duration-200 hover:bg-volt hover:text-ink"
          >
            <SendHorizontal aria-hidden className="size-[18px]" />
          </button>
        </div>
      </form>
    </m.div>
  );
}
