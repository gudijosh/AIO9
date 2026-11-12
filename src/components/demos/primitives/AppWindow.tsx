import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Show } from "./Show";

/**
 * Building blocks for the product windows. They read the industry theme from
 * CSS variables (src/data/themes.ts), so the same pieces render a teal clinic
 * scheduler, a dark reservations app or an amber operations console.
 */

/** A floating application window with a branded title bar. */
export function AppWindow({
  when,
  delay,
  title,
  icon: Icon,
  right,
  className,
  children,
}: {
  when: boolean;
  delay?: number;
  /** Product or view name shown in the title bar. */
  title: string;
  /** Product mark. Without it the bar shows plain window controls. */
  icon?: LucideIcon;
  /** Right side of the title bar: avatar, status, counters… */
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Show
      when={when}
      delay={delay}
      className={cn(
        "overflow-hidden rounded-xl border border-(--win-line) bg-(--win) text-(--win-text) shadow-float",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-2 border-b border-(--win-line) bg-(--win-chrome) px-2.5 text-(--win-chrome-text)">
        {Icon ? (
          <span className="grid size-[18px] shrink-0 place-items-center rounded-[5px] bg-(--app) text-(--app-on)">
            <Icon aria-hidden className="size-3" strokeWidth={2.25} />
          </span>
        ) : (
          <span className="flex shrink-0 gap-1 opacity-40">
            <span className="size-2 rounded-full bg-current" />
            <span className="size-2 rounded-full bg-current" />
            <span className="size-2 rounded-full bg-current" />
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{title}</span>
        {right}
      </div>
      {children}
    </Show>
  );
}

/** Side navigation with text labels (large screens only). The first item is open. */
export function SideNav({ items, active = 0 }: { items: readonly string[]; active?: number }) {
  return (
    <ul className="hidden w-[98px] shrink-0 flex-col gap-0.5 border-r border-(--win-line) bg-(--side) p-1.5 text-(--side-text) lg:flex">
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[10.5px] leading-tight",
            i === active && "bg-(--app) font-semibold text-(--app-on)",
          )}
        >
          <span className="size-1.5 shrink-0 rounded-[2px] bg-current opacity-70" />
          <span className="truncate">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A narrow rail of icons (large screens only). The first one is open. */
export function IconRail({ icons, active = 0 }: { icons: readonly LucideIcon[]; active?: number }) {
  return (
    <ul className="hidden w-9 shrink-0 flex-col items-center gap-1 bg-(--side) py-2 text-(--side-text) lg:flex">
      {icons.map((Icon, i) => (
        <li
          key={i}
          className={cn(
            "grid size-6 place-items-center rounded-md",
            i === active && "bg-(--app) text-(--app-on)",
          )}
        >
          <Icon aria-hidden className="size-3.5" />
        </li>
      ))}
    </ul>
  );
}

/** Top tabs. The first one is open. */
export function Tabs({ items, active = 0 }: { items: readonly string[]; active?: number }) {
  return (
    <ul className="flex gap-4 border-b border-(--win-line) px-3 text-[11px]">
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            "-mb-px border-b-2 py-1.5",
            i === active
              ? "border-(--app) font-semibold text-(--app-ink)"
              : "border-transparent text-(--win-muted)",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A user's initials in a circle. */
export function Avatar({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-[18px] shrink-0 place-items-center rounded-full bg-(--app-soft) text-[8.5px] font-bold text-(--app-ink)",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A search field, as decoration: it tells you this is a working app. */
export function SearchField({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-6 min-w-0 items-center gap-1.5 rounded-md bg-(--win-fill) px-2 text-[10.5px] text-(--win-muted)",
        className,
      )}
    >
      <Search aria-hidden className="size-3 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

/** A grey placeholder bar standing in for data that is not part of the story. */
export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-(--win-fill)", className)} />;
}

/** A small notification card (no window chrome). */
export function Toast({
  when,
  delay,
  icon: Icon,
  title,
  detail,
  className,
}: {
  when: boolean;
  delay?: number;
  icon: LucideIcon;
  title: string;
  detail: string;
  className?: string;
}) {
  return (
    <Show
      when={when}
      delay={delay}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-(--win-line) bg-(--win) px-3 py-2.5 text-(--win-text) shadow-float",
        className,
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--app) text-(--app-on)">
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-semibold">{title}</span>
        <span className="block truncate text-[11.5px] text-(--win-muted)">{detail}</span>
      </span>
    </Show>
  );
}
