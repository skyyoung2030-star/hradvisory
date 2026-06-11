import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type TourStep, getNextStep, getPrevStep } from "@/lib/tour-config";

type Props = {
  current: TourStep;
  disableNext?: boolean;
  nextLabel?: string;
  onBeforeNext?: () => Promise<boolean> | boolean;
  hidePrev?: boolean;
};

export default function TourNav({
  current,
  disableNext = false,
  nextLabel,
  onBeforeNext,
  hidePrev = false,
}: Props) {
  const navigate = useNavigate();
  const next = getNextStep(current);
  const prev = getPrevStep(current);

  const handleNext = async () => {
    if (disableNext || !next) return;
    if (onBeforeNext) {
      const ok = await onBeforeNext();
      if (ok === false) return;
    }
    navigate(next.path);
  };

  const handlePrev = () => {
    if (!prev) return;
    navigate(prev.path);
  };

  return (
    <div className="sticky bottom-0 z-30 bg-white/90 backdrop-blur-md border-t border-primary-100">
      <div className="container-x h-20 flex items-center justify-between gap-3">
        {!hidePrev && prev ? (
          <button
            type="button"
            onClick={handlePrev}
            className="btn-secondary"
            aria-label={`이전: ${prev.label}`}
          >
            <ArrowLeft size={16} className="mr-2" />
            이전
          </button>
        ) : (
          <span />
        )}

        {next ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={disableNext}
            className="btn-primary btn-lg"
            aria-label={`다음: ${next.label}`}
          >
            {nextLabel ?? `다음: ${next.label}`}
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
