import { cn } from "@/lib/cn";

/**
 * Provisional typographic wordmark. The letters take the surrounding text
 * colour, so it works on light and dark; the square is the "action" mark of
 * the AIO9 Signal and is the only part that carries the brand blue.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.14em] font-sans text-[1.375rem] leading-none font-semibold tracking-[-0.045em]",
        className,
      )}
    >
      <span>
        AIO<span className="font-medium tracking-[-0.02em]">9</span>
      </span>
      <span aria-hidden className="size-[0.3em] translate-y-[-0.04em] bg-signal" />
    </span>
  );
}
