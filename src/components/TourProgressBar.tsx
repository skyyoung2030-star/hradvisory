import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  PROGRESS_STEPS,
  TOUR_STEPS,
  getStepByPath,
} from "@/lib/tour-config";

/**
 * Persistent top bar across all tour steps. Two rows on desktop:
 *
 *   Row 1:  [H] HCG Master   |   [STEP 2/6 ▶ 자문 체험]   ........   건너뛰기
 *   Row 2:  ─━─━─━─━─━─━  (segmented progress, current pulses)
 *
 * The step badge is the visual focal point — a dark pill with the current
 * step number and label, paired with a chevron so it reads as a route
 * indicator. Keeps the tutorial "you are here" feel without screaming XP.
 */
export default function TourProgressBar() {
  const { pathname } = useLocation();
  const current = getStepByPath(pathname);

  if (!current || !current.showInProgress) return null;

  const currentIndexInProgress = PROGRESS_STEPS.findIndex(
    (s) => s.index === current.index,
  );

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-primary-100">
      <div className="container-x">
        {/* ── Top row ── */}
        <div className="h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-primary-900 tracking-tight flex-shrink-0"
            aria-label="처음으로 돌아가기"
          >
            <LogoMark />
            <span className="hidden md:inline text-[14px]">HCG Master</span>
          </Link>

          <span className="w-px h-5 bg-primary-200 mx-1 hidden md:block" />

          {/* Step badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-900 text-white text-[11px] font-bold tracking-wider shadow-sm">
            <span className="opacity-60">STEP</span>
            <span className="tabular-nums">
              {current.number}
              <span className="opacity-50">/{PROGRESS_STEPS.length}</span>
            </span>
            <ChevronRight size={12} className="opacity-60" />
            <span>{current.label}</span>
          </div>

          <div className="flex-1" />

          {current.index < TOUR_STEPS.length - 1 && (
            <Link
              to="/tour/6-master"
              className="text-[12px] text-primary-400 hover:text-primary-600 transition-colors px-2"
            >
              건너뛰기
            </Link>
          )}
        </div>

        {/* ── Bottom row: segmented progress ── */}
        <div className="flex items-center gap-1 pb-2.5">
          {PROGRESS_STEPS.map((step, i) => {
            const isDone = i < currentIndexInProgress;
            const isActive = i === currentIndexInProgress;
            return (
              <div
                key={step.slug}
                className="flex-1 group relative"
                title={`${step.number}. ${step.label}`}
              >
                <div
                  className={`h-1 rounded-full transition-all ${
                    isDone
                      ? "bg-accent-500"
                      : isActive
                      ? "bg-accent-500 animate-pulse-soft"
                      : "bg-primary-200"
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
      className="inline-flex w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-accent-700 text-white items-center justify-center font-bold text-[13px] shadow-sm shadow-accent-500/20"
    >
      H
    </span>
  );
}
