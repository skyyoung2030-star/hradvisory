import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  /** Optional right-side widget (e.g. tab counts, mini-stats). */
  rightSlot?: ReactNode;
  children: ReactNode;
};

/**
 * Consistent per-step header.
 *   • Eyebrow: STEP N · Label (small, monospaced uppercase)
 *   • Title: large, bold
 *   • Subtitle: muted body
 *   • Optional rightSlot for step-specific widgets
 */
export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-[0.18em] text-accent-600 uppercase">
                Step {step.number}
              </span>
              <span className="w-1 h-1 rounded-full bg-primary-300" />
              <span className="text-[10px] font-bold tracking-[0.18em] text-primary-500 uppercase">
                {step.label}
              </span>
            </div>
            <h1 className="h-1">{step.title}</h1>
            {step.subtitle && (
              <p className="body text-primary-500 mt-2 max-w-[680px]">
                {step.subtitle}
              </p>
            )}
          </div>
          {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
        </div>

        <div>{children}</div>
      </motion.div>
    </section>
  );
}
