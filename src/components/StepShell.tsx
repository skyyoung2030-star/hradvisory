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
 * No flex, no gap, no animation, no framer-motion. Just plain block elements
 * with explicit margin-bottom. This is the simplest possible structure;
 * if h1 and p still overlap with this, the issue is outside this component.
 *
 * The red "StepShell v4" banner at the top is a debug marker — if you don't
 * see it, the file isn't being loaded. Remove the banner div once verified.
 */
export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      {/* ⚠ DEBUG MARKER — remove this div once you've verified the new file is loaded */}
      <div
        style={{
          background: "#7f1d1d",
          color: "white",
          padding: "4px 10px",
          fontSize: 11,
          fontFamily: "monospace",
          marginBottom: 12,
          borderRadius: 4,
          display: "inline-block",
        }}
      >
        ✓ StepShell v4 — block layout active
      </div>

      <div style={{ marginBottom: 32 }}>
        {/* Eyebrow — inline-style block with own marginBottom */}
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

        {/* H1 — explicit block, explicit marginBottom for spacing to subtitle */}
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

        {/* Subtitle — explicit block, no top margin (h1 provides spacing) */}
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