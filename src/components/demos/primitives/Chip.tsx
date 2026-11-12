import { cn } from "@/lib/cn";

const tones = {
  neutral: "bg-(--win-fill) text-(--win-muted)",
  /** Solid product colour. */
  accent: "bg-(--app) text-(--app-on)",
  /** Tinted product colour. */
  soft: "bg-(--app-soft) text-(--app-ink)",
  warn: "bg-(--warn-bg) text-(--warn-text)",
} as const;

export function Chip({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center gap-1 rounded-full px-2 text-[11px] font-medium whitespace-nowrap transition-colors duration-300",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
