import { cn } from "@/lib/cn";
import { Show } from "./Show";

/**
 * A floating application window: title bar with window controls, the product
 * name, an optional status badge, and the app's content. Every demonstration
 * is built from these so it reads as real software rather than loose cards.
 */
export function AppWindow({
  when,
  delay,
  title,
  badge,
  className,
  children,
}: {
  when: boolean;
  delay?: number;
  /** Product or view name shown in the title bar. */
  title: string;
  /** Small element on the right of the title bar (sync state, counters…). */
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Show
      when={when}
      delay={delay}
      className={cn(
        "overflow-hidden rounded-xl border border-midnight/10 bg-white text-midnight shadow-float",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-2.5 border-b border-midnight/8 bg-cloud px-3">
        <span className="flex shrink-0 gap-1">
          <span className="size-2 rounded-full bg-midnight/15" />
          <span className="size-2 rounded-full bg-midnight/15" />
          <span className="size-2 rounded-full bg-midnight/15" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-600">{title}</span>
        {badge}
      </div>
      {children}
    </Show>
  );
}

/** The app's side navigation (large screens only). The first item is the open view. */
export function SideNav({ items, active = 0 }: { items: readonly string[]; active?: number }) {
  return (
    <ul className="hidden w-[98px] shrink-0 flex-col gap-0.5 border-r border-midnight/8 bg-cloud/60 p-1.5 lg:flex">
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[10.5px] leading-tight",
            i === active ? "bg-white font-semibold text-midnight shadow-sm" : "text-slate-600",
          )}
        >
          <span
            className={cn("size-1.5 shrink-0 rounded-[2px]", i === active ? "bg-signal" : "bg-midnight/20")}
          />
          <span className="truncate">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A grey placeholder bar standing in for data that is not part of the story. */
export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-midnight/12", className)} />;
}
