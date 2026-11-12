import { cn } from "@/lib/cn";

const tones = {
  neutral: "bg-midnight/6 text-slate-600",
  blue: "bg-signal text-white",
  soft: "bg-signal/12 text-signal",
  amber: "bg-amber/20 text-amber-700",
  ink: "bg-midnight/8 text-midnight/80",
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
