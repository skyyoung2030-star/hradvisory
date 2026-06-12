import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase">
                Step {String(step.number).padStart(2, "0")}
              </span>
              <span className="w-1 h-1 rounded-full bg-ink-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-600 uppercase">
                {step.label}
              </span>
            </div>
            <h1 className="h-1">{step.title}</h1>
            {step.subtitle && <p className="body text-ink-600 mt-2 max-w-[680px]">{step.subtitle}</p>}
          </div>
          {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
        </div>
        <div>{children}</div>
      </motion.div>
    </section>
  );
}
