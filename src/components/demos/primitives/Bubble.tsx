import { cn } from "@/lib/cn";
import { Show } from "./Show";

/** One message in a conversation. `from="them"` is the person, `"ai"` the assistant. */
export function Bubble({
  when,
  delay,
  from,
  who,
  children,
}: {
  when: boolean;
  delay?: number;
  from: "them" | "ai";
  who: string;
  children: React.ReactNode;
}) {
  return (
    <Show when={when} delay={delay} className={cn("flex flex-col", from === "ai" ? "items-end" : "items-start")}>
      <span className="mb-1 px-1 text-[10.5px] font-medium text-slate-600">{who}</span>
      <span
        className={cn(
          "max-w-[92%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug",
          from === "ai"
            ? "rounded-br-md bg-signal text-white"
            : "rounded-bl-md bg-cloud text-midnight",
        )}
      >
        {children}
      </span>
    </Show>
  );
}

/** Three pulsing dots: the system is working. */
export function Working({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex items-center gap-[3px]", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1 animate-blink rounded-full bg-current"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}
