import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { saveDiagnosePartial } from "@/lib/api";

const COMPANY_SIZES = [
  { value: "<50", label: "50명 미만" }, { value: "50-150", label: "50~150명" },
  { value: "150-300", label: "150~300명" }, { value: "300-500", label: "300~500명" },
  { value: "500+", label: "500명 이상" },
];
const HR_CAPACITIES = [
  { value: "none", label: "없음 (대표·관리부서 겸직)" }, { value: "parttime", label: "겸직 1명" },
  { value: "fulltime-1-2", label: "전담 1~2명" }, { value: "team", label: "전담 팀" },
];
const PAIN_POINTS = [
  // 사용자 요청 — 상단 우선순위
  { id: "low_motivation",    area: "조직문화", label: "직원 동기부여가 약하다 / 의욕이 낮다" },
  { id: "ai_adoption",       area: "AI",       label: "AI 도입으로 생산성 향상하고 싶은데 어디서부터 시작할지 모르겠다" },
  { id: "key_talent_risk",   area: "보상",     label: "S급 핵심인재 이탈 우려 / 경쟁사 적극 영입" },
  { id: "weak_leadership",   area: "리더십",   label: "팀장 리더십이 약하거나 편차가 크다" },
  { id: "goal_miss",         area: "평가",     label: "팀·개인의 목표 달성률이 낮아 조직성과가 향상되지 않는다" },
  { id: "low_performers",    area: "리더십",   label: "저성과자 관리가 안 된다 / 무임승차" },
  { id: "culture_drift",     area: "조직문화", label: "직원 몰입도·만족도가 낮다" },
  // 나머지
  { id: "eval_unfair",       area: "평가",     label: "평가가 공정하지 않다 / 변별력이 없다" },
  { id: "no_payband",        area: "보상",     label: "Pay Band 없이 보상이 임의적이다" },
  { id: "poor_alignment",    area: "조직문화", label: "부서 간 silo / 목표 정렬이 안 된다" },
  { id: "job_grade_complex", area: "직급",     label: "직급체계가 복잡하거나 연공서열에 묶여있다" },
  { id: "decision_slow",     area: "직급",     label: "의사결정이 느리고 조직이 비대하다" },
  { id: "unclear_job",       area: "직무",     label: "직무 분장이 모호하다" },
  { id: "hire_difficulty",   area: "직무",     label: "채용이 어렵거나 신규 입사자 적응이 느리다" },
  { id: "promo_unclear",     area: "승진",     label: "승진 기준이 불명확하다" },
];
const STORAGE_KEY = "hcg_tour_diagnose";

export type DiagnoseState = { companySize: string; hrCapacity: string; pains: string[]; };

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
        setCompanySize(s.companySize || ""); setHrCapacity(s.hrCapacity || "");
        setPains(Array.isArray(s.pains) ? s.pains : []);
      }
    } catch { /* */ }
  }, []);

  const togglePain = (id: string) =>
    setPains((c) => c.includes(id) ? c.filter((p) => p !== id) : [...c, id]);

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
                <Pill key={opt.value} selected={companySize === opt.value} onClick={() => setCompanySize(opt.value)}>{opt.label}</Pill>
              ))}
            </div>
          </Question>

          <Question stepNumber={2} label="현재 HR 역량은?" done={Boolean(hrCapacity)}>
            <div className="flex flex-wrap gap-2">
              {HR_CAPACITIES.map((opt) => (
                <Pill key={opt.value} selected={hrCapacity === opt.value} onClick={() => setHrCapacity(opt.value)}>{opt.label}</Pill>
              ))}
            </div>
          </Question>

          <Question stepNumber={3} label="가장 큰 페인포인트는?" sublabel="복수 선택 가능" done={pains.length > 0}>
            <div className="grid sm:grid-cols-2 gap-2">
              {PAIN_POINTS.map((p) => {
                const selected = pains.includes(p.id);
                return (
                  <button
                    key={p.id} type="button" onClick={() => togglePain(p.id)}
                    className={cn(
                      "flex items-start gap-3 text-left p-4 rounded-xl border backdrop-blur transition-all active:scale-[0.99]",
                      selected
                        ? "border-accent-500/60 bg-accent-500/10 shadow-[0_0_24px_-8px_rgba(14,165,233,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all",
                        selected ? "border-accent-500 bg-accent-500 scale-110 shadow-[0_0_12px_rgba(14,165,233,0.6)]"
                                 : "border-white/20 bg-white/[0.04]",
                      )}
                    >
                      {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                    </span>
                    <span className="body-sm text-ink-800">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </Question>

          <AnimatePresence>
            {canProceed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="card bg-accent-500/[0.05] border-accent-500/30"
              >
                <p className="body-sm text-ink-700">
                  <strong className="text-accent-400">진단 완료.</strong> 선택하신 페인포인트{" "}
                  <strong className="text-accent-400">{pains.length}개</strong>{" "}
                  기반으로, 다음 화면부터 실제 자문이 어떻게 흘러가는지 보여드릴게요.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </StepShell>

      <TourNav current={step} disableNext={!canProceed} hintWhenDisabled={missingHint} nextLabel="자문 체험으로" onBeforeNext={onBeforeNext} />
    </>
  );
}

function Question({ stepNumber, label, sublabel, done, children }: {
  stepNumber: number; label: string; sublabel?: string; done: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all",
          done ? "bg-success-500 text-white shadow-[0_0_16px_-2px_rgba(16,185,129,0.6)]"
               : "bg-white/[0.05] text-ink-600 border-2 border-white/15",
        )}>
          {done ? <Check size={14} strokeWidth={3} /> : stepNumber}
        </span>
        <div>
          <h2 className="text-[18px] font-semibold text-ink-900">{label}</h2>
          {sublabel && <p className="caption mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode; }) {
  return (
    <button
      type="button" onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-full border text-[14px] font-medium transition-all active:translate-y-px",
        selected
          ? "border-accent-500 bg-accent-500 text-white shadow-[0_8px_24px_-8px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]"
          : "border-white/15 bg-white/[0.04] text-ink-700 hover:border-white/30 hover:bg-white/[0.07] hover:text-ink-900",
      )}
    >
      {children}
    </button>
  );
}