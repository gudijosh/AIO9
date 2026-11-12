"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/** ES / EN switch. Keeps the scroll position and the current anchor. */
export function LanguageSwitch({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1 text-[13px] font-medium">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-midnight/25">/</span>}
          <Link
            href={`/${locale}`}
            hrefLang={locale}
            lang={locale}
            title={localeNames[locale]}
            aria-current={locale === current ? "true" : undefined}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              if (locale === current) return;
              router.push(`/${locale}${window.location.hash}`, { scroll: false });
            }}
            className={cn(
              "rounded px-1.5 py-2 uppercase transition-colors duration-200",
              locale === current ? "text-midnight" : "text-slate-600 hover:text-midnight",
            )}
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
