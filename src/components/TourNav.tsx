import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { type TourStep, getNextStep, getPrevStep } from "@/lib/tour-config";
import KeyHint from "./KeyHint";

type Props = {
  current: TourStep;
  disableNext?: boolean;
  nextLabel?: string;
  hintWhenDisabled?: string;
  onBeforeNext?: () => Promise<boolean> | boolean;
  hidePrev?: boolean;
  /** Render the next button as a subtle text link (for optional/extra-info steps) */
  nextSubtle?: boolean;
};

export default function TourNav({
  current,
  disableNext = false,
  nextLabel,
  hintWhenDisabled,
  onBeforeNext,
  hidePrev = false,
  nextSubtle = false,
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

  const goPrev = () => { if (prev) navigate(prev.path); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); void goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableNext, onBeforeNext, current.slug]);

  return (
    <div className="sticky bottom-0 z-30 bg-ink-50/80 backdrop-blur-xl border-t border-white/[0.06]">
      <div className="container-x py-4 flex items-center justify-between gap-3">
        {!hidePrev && prev ? (
          <button type="button" onClick={goPrev} className="btn-secondary group" aria-label={`이전: ${prev.label}`}>
            이전
            <KeyHint className="ml-2">←</KeyHint>
          </button>
        ) : <span />}

        <AnimatePresence>
          {disableNext && hintWhenDisabled && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning-500/10 border border-warning-500/30 text-warning-500 text-[12px] font-medium"
            >
              <AlertCircle size={12} />
              {hintWhenDisabled}
            </motion.div>
          )}
        </AnimatePresence>

        {next ? (
          nextSubtle ? (
            <button
              type="button"
              onClick={() => void goNext()}
              disabled={disableNext}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white/90 bg-white/[0.12] border border-white/30 rounded-lg hover:text-white hover:bg-white/[0.18] hover:border-white/45 transition-all group disabled:opacity-40 shadow-sm"
              aria-label={`추가: ${next.label}`}
            >
              <span>{nextLabel ?? next.label}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void goNext()}
              disabled={disableNext}
              className="btn-primary btn-lg group"
              aria-label={`다음: ${next.label}`}
            >
              <span>{nextLabel ?? `다음: ${next.label}`}</span>
              <ArrowRight size={16} className={`ml-2 transition-transform ${disableNext ? "" : "group-hover:translate-x-0.5"}`} />
              {!disableNext && <KeyHint variant="dark" className="ml-2">↵</KeyHint>}
            </button>
          )
        ) : <span />}
      </div>

      {disableNext && hintWhenDisabled && (
        <div className="md:hidden border-t border-warning-500/20 bg-warning-500/10 px-5 py-2 text-[12px] text-warning-500 flex items-center gap-1.5">
          <AlertCircle size={12} />
          {hintWhenDisabled}
        </div>
      )}
    </div>
  );
}