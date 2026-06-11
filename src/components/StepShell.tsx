import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  eyebrow?: string;
  children: ReactNode;
};

export default function StepShell({ step, eyebrow, children }: Props) {
  const eyebrowText = eyebrow ?? `STEP ${step.number} · ${step.label}`;

  return (
    <section className="tour-shell container-tour py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
        className="flex-1"
      >
        <span className="chip chip-accent uppercase tracking-wider text-[11px] font-semibold">
          {eyebrowText}
        </span>
        <h1 className="h-1 mt-4">{step.title}</h1>
        {step.subtitle && (
          <p className="body-lg text-primary-600 mt-3 max-w-[680px]">
            {step.subtitle}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </motion.div>
    </section>
  );
}
