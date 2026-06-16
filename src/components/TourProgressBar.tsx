import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PROGRESS_STEPS, TOUR_STEPS, getStepByPath } from "@/lib/tour-config";

export default function TourProgressBar() {
  const { pathname } = useLocation();
  const current = getStepByPath(pathname);

  if (!current || !current.showInProgress) return null;

  const currentIndexInProgress = PROGRESS_STEPS.findIndex((s) => s.index === current.index);

  return (
    <header className="sticky top-0 z-40 bg-ink-50/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="container-x">
        <div className="h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-ink-900 tracking-tight flex-shrink-0"
            aria-label="처음으로 돌아가기"
          >
            <LogoMark />
            <span className="hidden md:inline text-[14px]">HR Master</span>
          </Link>

          <span className="w-px h-5 bg-white/10 mx-1 hidden md:block" />

          {/* Step badge — game tutorial style chip with inner glow */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-ink-700 text-[11px] font-bold tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="text-ink-500">STEP</span>
            <span className="tabular-nums text-ink-900">
              {current.number}
              <span className="text-ink-500">/{PROGRESS_STEPS.length}</span>
            </span>
            <ChevronRight size={12} className="text-ink-500" />
            <span className="text-accent-400">{current.label}</span>
          </div>

          <div className="flex-1" />

          {current.index < TOUR_STEPS.length - 1 && (
            <Link
              to="/tour/6-master"
              className="text-[12px] text-ink-500 hover:text-ink-700 transition-colors px-2"
            >
              건너뛰기
            </Link>
          )}
        </div>

        {/* Segmented progress dots */}
        <div className="flex items-center gap-1 pb-2.5">
          {PROGRESS_STEPS.map((step, i) => {
            const isDone = i < currentIndexInProgress;
            const isActive = i === currentIndexInProgress;
            return (
              <div key={step.slug} className="flex-1 relative" title={`${step.number}. ${step.label}`}>
                <div
                  className={`h-[3px] rounded-full transition-all ${
                    isDone
                      ? "bg-accent-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]"
                      : isActive
                      ? "bg-accent-500 animate-shimmer shadow-[0_0_12px_rgba(14,165,233,0.8)]"
                      : "bg-white/[0.08]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="inline-flex w-7 h-7 rounded-md bg-gradient-to-br from-accent-400 to-accent-600 text-white items-center justify-center font-bold text-[13px] shadow-[0_4px_12px_-2px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
    >
      H
    </span>
  );
}
