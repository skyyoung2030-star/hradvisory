import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  rightSlot?: ReactNode;
  children: ReactNode;
};

/**
 * Per-step shell. framer-motion was removed here because its translateY enter
 * animation was producing a transient sub-pixel double-paint on Korean glyphs
 * over the dark background (h1 + subtitle ghosting on top of each other on
 * first paint). Replaced with a plain CSS opacity fade that doesn't move the
 * layout, and the heading column uses flex-gap instead of margin-top so
 * vertical rhythm can't collapse.
 */
export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      <div className="flex flex-col animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-3 min-w-0">
            <div className="inline-flex items-center gap-2 leading-none">
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase">
                STEP {String(step.number).padStart(2, "0")}
              </span>
              <span className="w-1 h-1 rounded-full bg-ink-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-600 uppercase">
                {step.label}
              </span>
            </div>

            <h1 className="h-1" style={{ display: "block", margin: 0 }}>
              {step.title}
            </h1>

            {step.subtitle && (
              <p
                className="body text-ink-600 max-w-[680px]"
                style={{ display: "block", margin: 0 }}
              >
                {step.subtitle}
              </p>
            )}
          </div>

          {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
        </div>

        <div className="block">{children}</div>
      </div>
    </section>
  );
}