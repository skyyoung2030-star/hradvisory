import type { ReactNode } from "react";
import type { TourStep } from "@/lib/tour-config";

type Props = {
  step: TourStep;
  rightSlot?: ReactNode;
  children: ReactNode;
};

/**
 * Per-step shell. All header layout uses inline styles so nothing — external
 * CSS, Tailwind purge edge cases, browser UA defaults, Bolt's WebContainer
 * style injection — can override the flex column or the explicit gaps.
 *
 * Critically: h1 and the subtitle p are each forced to position:static,
 * display:block, margin:0, padding:0. They sit inside a flex column with a
 * 16px rowGap that cannot collapse. Animations removed entirely so there is
 * no transient transform state that could mid-paint the glyphs twice.
 */
export default function StepShell({ step, rightSlot, children }: Props) {
  return (
    <section className="container-tour py-8 sm:py-10 flex-1">
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 16,
            marginBottom: 32,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              lineHeight: 1,
              position: "static",
            }}
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase">
              STEP {String(step.number).padStart(2, "0")}
            </span>
            <span
              aria-hidden
              style={{
                width: 4,
                height: 4,
                borderRadius: 9999,
                background: "#3F4150",
                display: "inline-block",
              }}
            />
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-600 uppercase">
              {step.label}
            </span>
          </div>

          {/* H1 title */}
          <h1
            className="h-1"
            style={{
              display: "block",
              margin: 0,
              padding: 0,
              position: "static",
            }}
          >
            {step.title}
          </h1>

          {/* Subtitle */}
          {step.subtitle && (
            <p
              className="body text-ink-600"
              style={{
                display: "block",
                margin: 0,
                padding: 0,
                position: "static",
                maxWidth: 680,
              }}
            >
              {step.subtitle}
            </p>
          )}

          {rightSlot && (
            <div style={{ position: "static" }}>{rightSlot}</div>
          )}
        </div>

        <div style={{ display: "block", position: "static" }}>{children}</div>
      </div>
    </section>
  );
}