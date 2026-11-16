import { cn } from "@/lib/cn";

/**
 * Io, AIO9's assistant: a small robot head drawn for this site. Bone head,
 * dark visor with volt eyes that blink now and then, and an antenna whose
 * tip glows softly. The animations live in globals.css (`.io-eye`,
 * `.io-antenna`) and stop under reduced motion. Decorative: the button or
 * heading around it carries the name.
 */
export function IoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden focusable="false" className={cn("shrink-0", className)}>
      {/* Antenna */}
      <rect x="22.9" y="5.5" width="2.2" height="6" rx="1.1" className="fill-bone-300" />
      <circle cx="24" cy="5" r="3" className="io-antenna fill-volt" />
      {/* Ear bolts */}
      <rect x="4.5" y="21" width="5" height="10" rx="2.5" className="fill-bone-300" />
      <rect x="38.5" y="21" width="5" height="10" rx="2.5" className="fill-bone-300" />
      {/* Head */}
      <rect x="8" y="11" width="32" height="29" rx="11" className="fill-bone" />
      {/* Visor */}
      <rect x="12.5" y="17.5" width="23" height="13.5" rx="6.75" className="fill-ink" />
      {/* Eyes */}
      <rect x="17" y="21" width="4.6" height="6.4" rx="2.3" className="io-eye fill-volt" />
      <rect x="26.4" y="21" width="4.6" height="6.4" rx="2.3" className="io-eye fill-volt" />
      {/* Smile */}
      <path d="M20.5 34.6q3.5 2.4 7 0" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-ink/70" />
    </svg>
  );
}
