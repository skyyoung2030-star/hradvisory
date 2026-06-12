import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  rightSlot?: ReactNode;
  children: ReactNode;
};

/**
 * Per-step shell. Layout intentionally uses flex-col with explicit block-level
 * children — earlier we hit a transient overlap where the body text appeared
 * to ghost over the heading on first paint; that was caused by font swapping
 * mid-animation. Now: animation is short, fonts are preloaded in index.html,
 * and children are explicit block elements with safe baseline metrics.
 */
export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col"
      >
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase leading-none">
                STEP {String(step.number).padStart(2, "0")}
              </span>
              <span className="w-1 h-1 rounded-full bg-ink-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-600 uppercase leading-none">
                {step.label}
              </span>
            </div>
            <h1 className="h-1 block">{step.title}</h1>
            {step.subtitle && (
              <p className="body block text-ink-600 mt-3 max-w-[680px]">
                {step.subtitle}
              </p>
            )}
          </div>
          {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
        </header>

        <div className="block">{children}</div>
      </motion.div>
    </section>
  );
}
