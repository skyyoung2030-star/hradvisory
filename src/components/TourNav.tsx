import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { type TourStep, getNextStep, getPrevStep } from "@/lib/tour-config";
import KeyHint from "./KeyHint";

type Props = {
  current: TourStep;
  disableNext?: boolean;
  nextLabel?: string;
  /** When disableNext is true, this hint appears explaining what's needed. */
  hintWhenDisabled?: string;
  onBeforeNext?: () => Promise<boolean> | boolean;
  hidePrev?: boolean;
};

/**
 * Bottom-fixed navigation, game-tutorial style.
 * - Buttons have visual keyboard shortcut chips
 * - ← / → / Enter trigger Prev / Next globally (skipped when typing in inputs)
 * - When Next is disabled, a hint chip explains what's needed
 */
export default function TourNav({
  current,
  disableNext = false,
  nextLabel,
  hintWhenDisabled,
  onBeforeNext,
  hidePrev = false,
}: Props) {
  const navigate = useNavigate();
  const next = getNextStep(current);
  const prev = getPrevStep(current);

  const goNext = async () => {
    if (disableNext || !next) return;
    if (onBeforeNext) {
      const ok = await onBeforeNext();
      if (ok === false) return;
    }
    navigate(next.path);
  };

  const goPrev = () => {
    if (!prev) return;
    navigate(prev.path);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        void goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableNext, onBeforeNext, current.slug]);

  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-primary-100">
      <div className="container-x py-4 flex items-center justify-between gap-3">
        {!hidePrev && prev ? (
          <button
            type="button"
            onClick={goPrev}
            className="group inline-flex items-center gap-2 px-4 h-11 rounded-lg border border-primary-200 text-primary-700 bg-white hover:border-primary-400 hover:bg-bg-soft transition-colors"
            aria-label={`이전: ${prev.label}`}
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="text-[14px] font-medium">이전</span>
            <KeyHint className="ml-1">←</KeyHint>
          </button>
        ) : (
          <span />
        )}

        <AnimatePresence>
          {disableNext && hintWhenDisabled && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-medium"
            >
              <AlertCircle size={12} />
              {hintWhenDisabled}
            </motion.div>
          )}
        </AnimatePresence>

        {next ? (
          <button
            type="button"
            onClick={() => void goNext()}
            disabled={disableNext}
            className={`group inline-flex items-center gap-2 px-6 h-12 rounded-lg font-semibold text-[15px] transition-all ${
              disableNext
                ? "bg-primary-200 text-primary-400 cursor-not-allowed"
                : "bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 active:scale-[0.98]"
            }`}
            aria-label={`다음: ${next.label}`}
          >
            <span>{nextLabel ?? `다음: ${next.label}`}</span>
            <ArrowRight
              size={16}
              className={`transition-transform ${disableNext ? "" : "group-hover:translate-x-0.5"}`}
            />
            {!disableNext && (
              <span className="hidden sm:flex items-center gap-1 ml-1 opacity-80">
                <KeyHint variant="dark">↵</KeyHint>
              </span>
            )}
          </button>
        ) : (
          <span />
        )}
      </div>

      {disableNext && hintWhenDisabled && (
        <div className="md:hidden border-t border-amber-100 bg-amber-50 px-5 py-2 text-[12px] text-amber-700 flex items-center gap-1.5">
          <AlertCircle size={12} />
          {hintWhenDisabled}
        </div>
      )}
    </div>
  );
}
