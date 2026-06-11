import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small visual "press X" key indicator. Used in TourNav and various
 * call-to-actions to communicate keyboard shortcuts game-tutorial-style.
 *
 * Example:
 *   <KeyHint>Enter</KeyHint>  →  ▶ Enter
 *   <KeyHint variant="dark">→</KeyHint>
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
        "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-bold font-mono",
        "border-b-2 shadow-sm select-none",
        variant === "dark"
          ? "bg-primary-800 text-white border-primary-900"
          : "bg-white text-primary-700 border-primary-300",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
