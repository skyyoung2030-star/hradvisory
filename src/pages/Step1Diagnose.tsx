import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { saveDiagnosePartial } from "@/lib/api";

const COMPANY_SIZES = [
  { value: "<50", label: "50명 미만" },
  { value: "50-150", label: "50~150명" },
  { value: "150-300", label: "150~300명" },
  { value: "300-500", label: "300~500명" },
  { value: "500+", label: "500명 이상" },
];

const HR_CAPACITIES = [
  { value: "none", label: "없음 (대표·관리부서 겸직)" },
  { value: "parttime", label: "겸직 1명" },
  { value: "fulltime-1-2", label: "전담 1~2명" },
  { value: "team", label: "전담 팀" },
];

const PAIN_POINTS = [
  { id: "job_grade_complex", area: "직급", label: "직급체계가 복잡하거나 연공서열에 묶여있다" },
  { id: "eval_unfair", area: "평가", label: "평가가 공정하지 않다 / 변별력이 없다" },
  { id: "no_payband", area: "보상", label: "Pay Band 없이 보상이 임의적이다" },
  { id: "unclear_job", area: "직무", label: "직무 분장이 모호하다" },
  { id: "promo_unclear", area: "승진", label: "승진 기준이 불명확하다" },
  { id: "weak_leadership", area: "리더십", label: "팀장 리더십이 약하다" },
  { id: "culture_drift", area: "조직문화", label: "조직문화가 흔들린다 / 핵심인재 이탈" },
];

const STORAGE_KEY = "hcg_tour_diagnose";

export type DiagnoseState = {
  companySize: string;
  hrCapacity: string;
  pains: string[];
};

export default function Step1Diagnose() {
  const step = getStepBySlug("1-diagnose")!;
  const [companySize, setCompanySize] = useState("");
  const [hrCapacity, setHrCapacity] = useState("");
  const [pains, setPains] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as DiagnoseState;
        setCompanySize(s.companySize || "");
        setHrCapacity(s.hrCapacity || "");
        setPains(Array.isArray(s.pains) ? s.pains : []);
      }
    } catch { /* ignore */ }
  }, []);

  const togglePain = (id: string) =>
    setPains((curr) =>
      curr.includes(id) ? curr.filter((p) => p !== id) : [...curr, id],
    );

  const canProceed = Boolean(companySize && hrCapacity && pains.length > 0);

  const missingHint =
    !companySize ? "회사 규모 선택 필요"
    : !hrCapacity ? "HR 역량 선택 필요"
    : pains.length === 0 ? "페인포인트 1개 이상 선택 필요"
    : undefined;

  const onBeforeNext = async () => {
    const data: DiagnoseState = { companySize, hrCapacity, pains };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    void saveDiagnosePartial(data);
    return true;
  };

  return (
    <>
      <StepShell step={step}>
        <div className="grid gap-7">
          <Question stepNumber={1} label="회사 규모는?" done={Boolean(companySize)}>
            <div className="flex flex-wrap gap-2">
              {COMPANY_SIZES.map((opt) => (
                <Pill
                  key={opt.value}
                  selected={companySize === opt.value}
                  onClick={() => setCompanySize(opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>
          </Question>

          <Question stepNumber={2} label="현재 HR 역량은?" done={Boolean(hrCapacity)}>
            <div className="flex flex-wrap gap-2">
              {HR_CAPACITIES.map((opt) => (
                <Pill
                  key={opt.value}
                  selected={hrCapacity === opt.value}
                  onClick={() => setHrCapacity(opt.value)}
                >
                  {opt.label}
                </Pill>
              ))}
            </div>
          </Question>

          <Question
            stepNumber={3}
            label="가장 큰 페인포인트는?"
            sublabel="복수 선택 가능"
            done={pains.length > 0}
          >
            <div className="grid sm:grid-cols-2 gap-2">
              {PAIN_POINTS.map((p) => {
                const selected = pains.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePain(p.id)}
                    className={cn(
                      "flex items-start gap-3 text-left p-4 rounded-xl border transition-all bg-white",
                      "active:scale-[0.99]",
                      selected
                        ? "border-accent-500 bg-accent-50 shadow-sm shadow-accent-500/20"
                        : "border-primary-200 hover:border-accent-500",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all",
                        selected
                          ? "border-accent-500 bg-accent-500 scale-110"
                          : "border-primary-300 bg-white",
                      )}
                    >
                      {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                    </span>
                    <span className="flex flex-col">
                      <span className="caption mb-0.5">{p.area}</span>
                      <span className="body-sm text-primary-700">{p.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Question>

          <AnimatePresence>
            {canProceed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card border-accent-500/30 bg-gradient-to-r from-accent-50/50 to-white"
              >
                <p className="body-sm text-primary-700">
                  <strong className="text-accent-600">진단 완료.</strong>{" "}
                  선택하신 페인포인트{" "}
                  <strong className="text-accent-600">{pains.length}개</strong>{" "}
                  기반으로, 다음 화면부터 실제 자문이 어떻게 흘러가는지 보여드릴게요.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </StepShell>

      <TourNav
        current={step}
        disableNext={!canProceed}
        hintWhenDisabled={missingHint}
        nextLabel="자문 체험으로"
        onBeforeNext={onBeforeNext}
      />
    </>
  );
}

/* ───────── Local primitives ───────── */

function Question({
  stepNumber,
  label,
  sublabel,
  done,
  children,
}: {
  stepNumber: number;
  label: string;
  sublabel?: string;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors",
            done
              ? "bg-success-500 text-white"
              : "bg-white text-primary-500 border-2 border-primary-200",
          )}
        >
          {done ? <Check size={14} strokeWidth={3} /> : stepNumber}
        </span>
        <div>
          <h2 className="text-[18px] font-semibold text-primary-900">{label}</h2>
          {sublabel && <p className="caption mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-full border text-[14px] font-medium transition-all",
        "active:scale-[0.97]",
        selected
          ? "border-accent-500 bg-accent-500 text-white shadow-md shadow-accent-500/30"
          : "border-primary-200 bg-white text-primary-700 hover:border-accent-500 hover:text-accent-600",
      )}
    >
      {children}
    </button>
  );
}
