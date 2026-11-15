"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { LoaderCircle, MessageCircleQuestionMark, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import type { BotPanelProps } from "./BotPanel";
import { loadKnowledge } from "./loaders";

const PANEL_ID = "aio9-bot";

type PanelComponent = ComponentType<BotPanelProps>;

/**
 * Floating button that opens the AIO9 bot (preset answers, not an AI). The
 * panel's code, the engine and this language's knowledge are separate chunks
 * fetched on the first open, or a moment earlier when the visitor points at
 * or focuses the button. Nothing is stored and nothing is sent anywhere.
 */
export function BotLauncher({
  locale,
  t,
  homeHref,
  faqHref,
}: {
  locale: Locale;
  t: Dictionary["bot"];
  /** Home page of this language, e.g. `/${lang}`. */
  homeHref: string;
  /** Questions page of this language, e.g. `/${lang}/faq`. */
  faqHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [Panel, setPanel] = useState<PanelComponent | null>(null);
  const request = useRef<Promise<PanelComponent> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const refocus = useRef(false);

  /** Starts fetching the panel and the knowledge (once; again only after a failure). */
  const load = useCallback(() => {
    if (!request.current) {
      const knowledge = loadKnowledge(locale).catch(() => null); // the panel retries on its own
      const next = Promise.all([import("./BotPanel"), knowledge]).then(([mod]) => mod.BotPanel);
      next.catch(() => {
        request.current = null;
      });
      request.current = next;
    }
    return request.current;
  }, [locale]);

  const warm = () => {
    void load();
  };

  const show = () => {
    setOpen(true);
    if (Panel) return;
    load().then(
      (component) => setPanel(() => component),
      () => setOpen(false), // offline or a stale deploy: back to closed, the next click retries
    );
  };

  const close = useCallback((returnFocus: boolean) => {
    refocus.current = returnFocus;
    setOpen(false);
  }, []);

  // Escape and the close button send focus back here once the button is
  // visible again (on phones it is hidden while the panel is open).
  useEffect(() => {
    if (open || !refocus.current) return;
    refocus.current = false;
    buttonRef.current?.focus();
  }, [open]);

  const loading = open && !Panel;
  const shown = open && Panel !== null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t.open}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-busy={loading || undefined}
        onClick={() => (open ? close(false) : show())}
        onPointerEnter={warm}
        onFocus={warm}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) close(true);
        }}
        className={cn(
          "group fixed z-[60] inline-flex h-14 min-w-14 items-center justify-center gap-2.5 rounded-full! bg-azure px-4 text-bone sm:pr-6 sm:pl-5",
          "right-[calc(1rem_+_env(safe-area-inset-right))] bottom-[calc(1rem_+_env(safe-area-inset-bottom))]",
          "lg:right-[calc(2rem_+_env(safe-area-inset-right))] lg:bottom-[calc(2rem_+_env(safe-area-inset-bottom))]",
          "shadow-[0_18px_40px_-16px_rgb(47_99_255/0.75),inset_0_0_0_1px_rgb(239_234_224/0.14)] transition-[background-color,color,scale] duration-300 ease-(--ease-signal) hover:bg-volt hover:text-ink active:scale-95",
          shown && "max-sm:hidden",
        )}
      >
        {loading ? (
          <LoaderCircle aria-hidden className="size-6 shrink-0 animate-spin" />
        ) : open ? (
          <X aria-hidden className="size-6 shrink-0" />
        ) : (
          <MessageCircleQuestionMark aria-hidden className="size-6 shrink-0" />
        )}
        <span className="hidden text-[12px] font-bold tracking-[0.08em] text-white uppercase transition-colors duration-300 group-hover:text-ink sm:inline">
          {t.launcher}
        </span>
      </button>
      {Panel && (
        <Panel
          key={locale}
          id={PANEL_ID}
          locale={locale}
          t={t}
          homeHref={homeHref}
          faqHref={faqHref}
          open={open}
          onClose={close}
        />
      )}
    </>
  );
}
