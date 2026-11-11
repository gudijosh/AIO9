"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/brand/Wordmark";
import { LanguageSwitch } from "./LanguageSwitch";

const links = [
  { href: "#industries", key: "solutions" },
  { href: "#process", key: "process" },
  { href: "#contact", key: "contact" },
] as const;

export function Header({ locale, t }: { locale: Locale; t: Dictionary["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300",
        scrolled || open
          ? "border-b border-white/8 bg-midnight/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:h-[72px] lg:px-10">
        <a
          href="#top"
          aria-label={t.home}
          onClick={() => setOpen(false)}
          className="animate-rise text-white"
        >
          <Wordmark />
        </a>

        <nav aria-label={t.primary} className="hidden animate-rise items-center gap-9 [animation-delay:500ms] lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
            >
              {t[link.key]}
            </a>
          ))}
        </nav>

        <div className="flex animate-rise items-center gap-3 [animation-delay:600ms] lg:gap-6">
          <LanguageSwitch current={locale} label={t.language} />
          <a
            href="#contact"
            className="hidden h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-midnight transition-colors duration-200 hover:bg-cloud lg:inline-flex"
          >
            {t.cta}
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.menuClose : t.menuOpen}
            onClick={() => setOpen((value) => !value)}
            className="-mr-2 grid size-11 place-items-center rounded-full text-white lg:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto bg-midnight px-5 pt-6 pb-10 lg:hidden"
      >
        <nav aria-label={t.primary} className="flex flex-col">
          {links.map((link, i) => (
            <a
              key={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-5 text-3xl font-medium tracking-tight text-white"
            >
              {t[link.key]}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="mt-8 flex h-13 items-center justify-center rounded-full bg-signal px-6 text-base font-medium text-white"
        >
          {t.cta}
        </a>
      </div>
    </header>
  );
}
