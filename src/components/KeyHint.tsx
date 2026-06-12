import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Visual keyboard-key indicator. Two variants:
 * - light (default): pale chip suitable on dark surfaces
 * - dark: deep-black chip suitable on accent-coloured buttons
 *
 * Both have a subtle bottom-border and inset highlight to read 3D.
 */
export default function KeyHint({
  children,
  variant = "light",
  className,
}: {
  children: ReactNode;
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md",
        "text-[11px] font-mono font-bold border select-none",
        variant === "dark"
          ? "bg-black/40 text-white/90 border-white/20 border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
          : "bg-white/[0.08] text-ink-800 border-white/15 border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
