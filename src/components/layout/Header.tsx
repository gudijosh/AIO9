"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "./LanguageSwitch";

const links = [
  { href: "#sectors", key: "sectors" },
  { href: "#services", key: "services" },
  { href: "#devices", key: "devices" },
  { href: "#process", key: "process" },
  { href: "#contact", key: "contact" },
] as const;

/**
 * A bar with no background: it is drawn in "difference" blend so it reads
 * dark on the light sections and light on the dark ones. The menu opens as
 * a full-screen panel with oversized links.
 */
export function Header({ locale, t }: { locale: Locale; t: Dictionary["nav"] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    // The panel becomes focusable one frame after it is un-hidden.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex h-16 items-center px-5 lg:h-[76px] lg:px-10">
          <a href="#top" aria-label={t.home} className="display pointer-events-auto text-[2.125rem] leading-none">
            AIO9
          </a>
          <p className="mx-auto hidden font-mono text-[11px] tracking-[0.14em] uppercase lg:block">{t.tagline}</p>
          <div className="pointer-events-auto ml-auto flex items-center gap-3 lg:ml-0 lg:gap-6">
            <LanguageSwitch current={locale} label={t.language} />
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={t.menuOpen}
              onClick={() => setOpen(true)}
              className="group -mr-2 grid size-11 place-items-center"
            >
              <span aria-hidden className="grid gap-[5px]">
                <i className="block h-[2.5px] w-[26px] bg-current transition-[width] duration-300 group-hover:w-[18px]" />
                <i className="ml-2 block h-[2.5px] w-[18px] bg-current transition-[width,margin] duration-300 group-hover:ml-0 group-hover:w-[26px]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.primary}
        inert={!open}
        className={cn(
          "fixed inset-0 z-[70] overflow-y-auto bg-bone text-ink transition-[clip-path,visibility] duration-500 ease-(--ease-signal)",
          open ? "visible [clip-path:inset(0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div aria-hidden className="display pointer-events-none absolute -top-[4vw] -right-[3vw] text-[min(80vw,72rem)] text-bone-300 select-none">
          9
        </div>
        <div className="relative flex h-16 items-center px-5 lg:h-[76px] lg:px-10">
          <span aria-hidden className="display text-[2.125rem] leading-none">
            AIO<span className="text-azure">9</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            aria-label={t.menuClose}
            onClick={() => setOpen(false)}
            className="-mr-2 ml-auto grid size-11 place-items-center text-[1.75rem] leading-none"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>
        <nav aria-label={t.primary} className="relative px-5 pt-4 pb-10 lg:px-10">
          <ul>
            {links.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="display group flex items-baseline gap-4 py-1 text-[clamp(3.75rem,11.5vw,10rem)] transition-[color,translate] duration-500 ease-(--ease-signal) hover:text-azure motion-safe:hover:translate-x-8"
                >
                  <span aria-hidden className="font-mono text-[11px] tracking-[0.14em] text-slate-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t[link.key]}
                  <span aria-hidden className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={() => setOpen(false)} className="pill mt-8 bg-ink text-bone">
            {t.cta} <span aria-hidden>→</span>
          </a>
        </nav>
      </div>
    </>
  );
}
