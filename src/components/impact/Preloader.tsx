/**
 * Brief opening curtain. Pure CSS: it fades out on its own after about a
 * second, never blocks the page behind it, and is skipped entirely with
 * reduced motion or without JavaScript and CSS animations.
 */
export function Preloader({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] grid animate-[preload-out_0.5s_ease-out_1s_forwards] place-items-center bg-ink motion-reduce:hidden"
    >
      <div className="text-center text-bone">
        <div className="display text-[7rem]">
          AIO<span className="text-azure">9</span>
        </div>
        <div className="mx-auto mt-5 h-[3px] w-52 bg-dim">
          <div className="h-full origin-left animate-[preload-bar_0.9s_var(--ease-signal)_forwards] bg-volt" />
        </div>
        <div className="mt-3 font-mono text-[11px] tracking-[0.14em] text-fog uppercase">{label}</div>
      </div>
    </div>
  );
}
