import { Link, useLocation } from "react-router-dom";
import { PROGRESS_STEPS, TOUR_STEPS, getStepByPath } from "@/lib/tour-config";

export default function TourProgressBar() {
  const { pathname } = useLocation();
  const current = getStepByPath(pathname);

  if (!current || !current.showInProgress) return null;

  const currentIndexInProgress = PROGRESS_STEPS.findIndex(
    (s) => s.index === current.index,
  );

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-primary-100">
      <div className="container-x h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-900 font-semibold tracking-tight"
          aria-label="처음으로 돌아가기"
        >
          <LogoMark />
          <span className="hidden sm:inline">HCG Master</span>
        </Link>

        <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
          <span className="text-[13px] font-medium text-primary-600 whitespace-nowrap">
            {current.number} / {PROGRESS_STEPS.length}
          </span>
          <div className="flex-1 flex items-center gap-1">
            {PROGRESS_STEPS.map((step, i) => {
              const isDone = i < currentIndexInProgress;
              const isActive = i === currentIndexInProgress;
              return (
                <div
                  key={step.slug}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    isDone || isActive ? "bg-accent-500" : "bg-primary-200"
                  }`}
                  title={`${step.number}. ${step.label}`}
                />
              );
            })}
          </div>
          <span className="text-[13px] font-medium text-primary-900 whitespace-nowrap hidden md:inline">
            {current.label}
          </span>
        </div>

        {current.index < TOUR_STEPS.length - 1 && (
          <Link
            to="/tour/6-master"
            className="text-[13px] text-primary-400 hover:text-primary-600 transition-colors"
          >
            건너뛰기
          </Link>
        )}
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="inline-flex w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-accent-700 text-white items-center justify-center font-bold text-[13px]"
    >
      H
    </span>
  );
}
