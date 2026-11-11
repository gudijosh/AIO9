import { cn } from "@/lib/cn";

/**
 * AIO9 Signal — the brand motif: Input → Intelligence → Action.
 * A point (the request), a line (the processing) and a solid square (the action).
 * `progress` (0–1) draws the line; the square fills when the action is done.
 */
export function Signal({
  progress = 1,
  done = true,
  className,
}: {
  progress?: number;
  done?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("inline-flex items-center gap-[3px]", className)}>
      <span className="size-[5px] shrink-0 rounded-full bg-current" />
      <span className="relative h-px min-w-3 flex-1 bg-current/25">
        <span
          className="absolute inset-0 origin-left bg-current transition-transform duration-500 ease-signal"
          style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
        />
      </span>
      <span
        className={cn(
          "size-[7px] shrink-0 border border-current transition-colors duration-300",
          done ? "bg-current" : "bg-transparent",
        )}
      />
    </span>
  );
}
