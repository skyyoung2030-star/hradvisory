import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  rightSlot?: ReactNode;
  children: ReactNode;
};

/**
 * Per-step shell — bare-bones block layout.
 *
 * No flex, no gap, no animation, no framer-motion. Just block elements with
 * explicit margin-bottom. Earlier versions hit a transient overlap where
 * subtitle <p> rendered on the same baseline as <h1>, traced back to a
 * combination of flex-gap collapse + framer-motion transform animation +
 * font swap timing. This version sidesteps the whole stack: position:static,
 * display:block, margin/padding zeroed, then a margin-bottom on h1 provides
 * the spacing to the subtitle. Plain HTML flow.
 */
export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      <div style={{ marginBottom: 32 }}>
        {/* Eyebrow: STEP NN · label */}
        <div
          style={{
            marginBottom: 12,
            lineHeight: 1,
            display: "block",
            position: "static",
          }}
        >
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase">
            STEP {String(step.number).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              margin: "0 8px",
              width: 4,
              height: 4,
              borderRadius: 9999,
              background: "#3F4150",
              verticalAlign: "middle",
            }}
          />
          <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-600 uppercase">
            {step.label}
          </span>
        </div>

        {/* H1 title — block element, explicit reset, marginBottom for spacing */}
        <h1
          className="h-1"
          style={{
            display: "block",
            margin: 0,
            marginBottom: 12,
            padding: 0,
            position: "static",
            float: "none",
            clear: "both",
            width: "auto",
            height: "auto",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
          }}
        >
          {step.title}
        </h1>

        {/* Subtitle — block element, no top margin (h1 provides spacing) */}
        {step.subtitle && (
          <p
            className="body text-ink-600"
            style={{
              display: "block",
              margin: 0,
              padding: 0,
              position: "static",
              float: "none",
              clear: "both",
              width: "auto",
              height: "auto",
              top: "auto",
              left: "auto",
              right: "auto",
              bottom: "auto",
              maxWidth: 680,
            }}
          >
            {step.subtitle}
          </p>
        )}

        {rightSlot && (
          <div style={{ marginTop: 12, position: "static" }}>{rightSlot}</div>
        )}
      </div>

      <div style={{ display: "block", position: "static" }}>{children}</div>
    </section>
  );
}