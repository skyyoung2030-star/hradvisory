import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, Sparkles, Target, AlertTriangle,
  ArrowRight, CheckCircle2, Layers as LayersIcon, ListChecks,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ═════════════════ Drivers ═════════════════ */

type Module = "보상" | "평가" | "직급" | "직무" | "조직문화" | "리더십" | "AI";
type Driver = {
  id: string; module: Module; label: string; unit: string;
  default: number; min: number; max: number;
  formatBeforeAfter?: (n: number) => string;
};

const DRIVERS: Driver[] = [
  { id: "payband_uplift",      module: "보상",     label: "Pay Band 하위 추가 인상", unit: "%",      default: 0,  min: 0,  max: 10 },
  { id: "perf_differential",   module: "보상",     label: "성과급 차등폭",          unit: "배",     default: 2,  min: 1,  max: 5  },
  { id: "grade_top_ratio",     module: "평가",     label: "상위 등급 비율",         unit: "%",      default: 20, min: 15, max: 35 },
  { id: "eval_frequency",      module: "평가",     label: "평가 사이클 빈도",       unit: "회/년",  default: 2,  min: 1,  max: 4,
    formatBeforeAfter: (n) => n === 1 ? "연 1회" : n === 2 ? "반기" : n === 3 ? "트라이뎀" : "분기" },
  { id: "grade_levels",        module: "직급",     label: "직급 단계 수",           unit: "단계",   default: 6,  min: 3,  max: 7  },
  { id: "job_clarity",         module: "직무",     label: "직무 명세 명확도",       unit: "/100",   default: 60, min: 30, max: 100 },
  { id: "alignment_workshops", module: "조직문화", label: "정렬 워크숍 빈도",       unit: "회/년",  default: 2,  min: 0,  max: 12 },
  { id: "psych_safety",        module: "조직문화", label: "심리적 안전 점수",       unit: "/100",   default: 55, min: 30, max: 100 },
  { id: "leader_coaching",     module: "리더십",   label: "팀장 코칭 빈도",         unit: "회/분기",default: 1,  min: 0,  max: 6  },
  { id: "ai_automation",       module: "AI",       label: "HR AI 자동화 수준",       unit: "/100",   default: 0,  min: 0,  max: 100 },
];

type OutcomeGroup = "Retention" | "Hiring" | "성과·생산성" | "몰입·문화" | "비용";
type Outcome = {
  id: string; group: OutcomeGroup; label: string; unit: string;
  base: number; range: number; higherIsBetter: boolean; decimals?: number;
  weights: Record<string, number>;
};

const OUTCOMES: Outcome[] = [
  { id: "retention_1y",         group: "Retention",  label: "1년 retention",       unit: "%",    base: 86,  range: 8,  higherIsBetter: true,  decimals: 1,
    weights: { payband_uplift: 0.35, perf_differential: 0.10, eval_frequency: -0.05, grade_levels: -0.05, job_clarity: 0.15, alignment_workshops: 0.15, psych_safety: 0.25, leader_coaching: 0.20 } },
  { id: "key_talent_retention", group: "Retention",  label: "핵심인재 유지율",      unit: "%",    base: 78,  range: 15, higherIsBetter: true,  decimals: 1,
    weights: { payband_uplift: 0.15, perf_differential: 0.30, grade_top_ratio: 0.15, eval_frequency: 0.05, job_clarity: 0.10, psych_safety: 0.25, leader_coaching: 0.25 } },
  { id: "hire_success",         group: "Hiring",     label: "신규 채용 성공률",     unit: "%",    base: 68,  range: 22, higherIsBetter: true,  decimals: 0,
    weights: { payband_uplift: 0.30, perf_differential: 0.05, job_clarity: 0.30, psych_safety: 0.20, leader_coaching: 0.10, alignment_workshops: 0.05 } },
  { id: "hire_days",            group: "Hiring",     label: "평균 채용 소요일",     unit: "일",   base: 58,  range: 22, higherIsBetter: false, decimals: 0,
    weights: { payband_uplift: -0.20, job_clarity: -0.30, psych_safety: -0.10, alignment_workshops: -0.05, leader_coaching: -0.05 } },
  { id: "productivity",         group: "성과·생산성",label: "생산성 지수",          unit: "",     base: 100, range: 28, higherIsBetter: true,  decimals: 0,
    weights: { perf_differential: 0.15, grade_top_ratio: 0.05, eval_frequency: 0.10, grade_levels: -0.15, job_clarity: 0.25, psych_safety: 0.20, leader_coaching: 0.25, ai_automation: 0.20 } },
  { id: "decision_speed",       group: "성과·생산성",label: "의사결정 속도",        unit: "",     base: 100, range: 35, higherIsBetter: true,  decimals: 0,
    weights: { grade_levels: -0.50, job_clarity: 0.20, psych_safety: 0.15, alignment_workshops: 0.10, leader_coaching: 0.10, ai_automation: 0.15 } },
  { id: "goal_achievement",     group: "성과·생산성",label: "목표 달성률",          unit: "%",    base: 72,  range: 18, higherIsBetter: true,  decimals: 0,
    weights: { grade_top_ratio: 0.05, eval_frequency: 0.20, perf_differential: 0.10, job_clarity: 0.20, alignment_workshops: 0.15, psych_safety: 0.10, leader_coaching: 0.25 } },
  { id: "engagement",           group: "몰입·문화", label: "몰입도 (eNPS)",        unit: "",     base: 18,  range: 35, higherIsBetter: true,  decimals: 0,
    weights: { payband_uplift: 0.15, perf_differential: -0.05, eval_frequency: -0.10, grade_levels: -0.10, job_clarity: 0.15, alignment_workshops: 0.20, psych_safety: 0.30, leader_coaching: 0.25, ai_automation: 0.10 } },
  { id: "change_readiness",     group: "몰입·문화", label: "변화 수용성",          unit: "/100", base: 52,  range: 28, higherIsBetter: true,  decimals: 0,
    weights: { alignment_workshops: 0.30, psych_safety: 0.35, leader_coaching: 0.20, job_clarity: 0.10, eval_frequency: 0.05 } },
  { id: "hr_burden",            group: "비용",      label: "HR 운영 부담",         unit: "h/월", base: 70,  range: 45, higherIsBetter: false, decimals: 0,
    weights: { eval_frequency: 0.40, alignment_workshops: 0.25, leader_coaching: 0.15, grade_top_ratio: 0.05, job_clarity: -0.10, ai_automation: -0.50 } },
];

const OUTCOME_GROUPS: OutcomeGroup[] = ["Retention", "Hiring", "성과·생산성", "몰입·문화", "비용"];

/* ═════════════════ Scenarios — storytelling names ═════════════════ */

type Scenario = {
  id: string;
  num: string;
  /** 스토리텔링 이름 — 시나리오의 비즈니스 의도가 한눈에 보이게 */
  name: string;
  /** 한 줄 설명 — 어떻게 달성하는지 */
  tagline: string;
  modules: Module[];
  fitFor: string;
  drivers: Record<string, number>;
  insights: string[];
  caveats?: string[];
  preview: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "baseline",
    num: "00",
    name: "현재 상태",
    tagline: "어떤 개입도 하지 않은 baseline",
    modules: [],
    fitFor: "비교 기준점",
    drivers: {},
    insights: ["다른 시나리오와 비교하기 위한 baseline입니다.", "어느 영역에 개입할지 결정하기 전 현재 지표 확인용."],
    preview: [],
  },
  {
    id: "key_talent",
    num: "01",
    name: "핵심인재 Retention",
    tagline: "변별력 있는 평가와 차등 보상으로 S급 이탈 차단",
    modules: ["평가", "보상"],
    fitFor: "100~500명 / 핵심인재 이탈 우려",
    drivers: { payband_uplift: 3, perf_differential: 3.5, grade_top_ratio: 25, eval_frequency: 4 },
    insights: [
      "핵심인재는 인상폭보다 '인정받는다'는 신호에 더 민감하게 반응합니다.",
      "변별력 있는 평가가 차등 보상의 정당성을 제공합니다.",
      "분기 평가는 HR 운영 부담을 늘리지만 retention ROI가 충분히 보상합니다.",
    ],
    caveats: [
      "차등 확대는 단기 갈등 가능성이 있어 커뮤니케이션이 핵심입니다.",
      "Calibration Session으로 평가 공정성 보완은 필수입니다.",
    ],
    preview: ["key_talent_retention", "productivity"],
  },
  {
    id: "performance_motivation",
    num: "02",
    name: "성과 동기부여",
    tagline: "적은 투자로 변별력과 목표 정렬도부터 확보",
    modules: ["평가"],
    fitFor: "재원 여유 없음 · 평가가 형식화된 회사",
    drivers: { grade_top_ratio: 25, eval_frequency: 4 },
    insights: [
      "보상 재원 증가 없이도 변별력 있는 평가만으로 목표 달성률을 끌어올릴 수 있습니다.",
      "잦은 Check-in 사이클은 정렬도와 피드백 문화를 만듭니다.",
      "다만 변별만 강화하고 보상이 따르지 않으면 단기적으로 만족도 하락 위험이 있습니다.",
    ],
    caveats: [
      "보상으로 이어지지 않으면 평가 무력감 발생 — 6~12개월 내 보상 연계를 권장합니다.",
    ],
    preview: ["goal_achievement", "hr_burden"],
  },
  {
    id: "productivity_boost",
    num: "03",
    name: "생산성 가속",
    tagline: "직무 명확화 + 리더십 강화로 일하는 방식 개선",
    modules: ["직무", "리더십"],
    fitFor: "급성장 회사 · 역할 모호 · 팀장 역량 편차",
    drivers: { job_clarity: 90, leader_coaching: 4 },
    insights: [
      "직무가 명확하면 채용 소요일과 운영 부담이 동시에 줄어듭니다.",
      "팀장 코칭은 단일 변수 중 생산성·목표 달성률에 가장 큰 영향을 주는 driver.",
      "비용 없는 개입이지만 시간 투자가 필요 — 경영진 commitment가 핵심입니다.",
    ],
    preview: ["productivity", "hire_days"],
  },
  {
    id: "ai_productivity",
    num: "04",
    name: "AI HR 생산성 가속",
    tagline: "AI 에이전트로 운영 부담 줄이고 의사결정 품질 향상",
    modules: ["AI", "직무", "평가"],
    fitFor: "HR 운영 효율 / 데이터 기반 의사결정 필요 / HR 1~2명 회사",
    drivers: { ai_automation: 80, job_clarity: 85, eval_frequency: 4 },
    insights: [
      "AI HR 에이전트는 단순 자동화가 아니라 의사결정 보조 — 평가 코멘트, 면담 가이드, 채용 검토 등 품질이 균질해집니다.",
      "HR 운영 부담 30~50% 감소 가능 — 인사팀이 단순 운영보다 전략 업무에 집중할 수 있게 됩니다.",
      "AI는 평가·면담·코칭의 일관성을 높여 팀장 역량 편차를 좁히는 효과도 가져옵니다.",
    ],
    caveats: [
      "AI 도입은 단독으로는 효과 제한적 — 직무 명확화와 평가 체계가 함께 가야 시너지 발생.",
      "AI가 사람을 대체하는 게 아니라 의사결정 품질을 높이는 도구로 자리매김하는 게 중요합니다.",
    ],
    preview: ["hr_burden", "productivity"],
  },
  {
    id: "goal_alignment",
    num: "05",
    name: "조직성과 최적화",
    tagline: "OKR과 정렬 워크숍으로 전사 목표 alignment 강화",
    modules: ["평가", "조직문화", "리더십"],
    fitFor: "부서 간 silo · 목표 정렬도 낮음",
    drivers: { eval_frequency: 4, alignment_workshops: 8, leader_coaching: 3, grade_top_ratio: 25 },
    insights: [
      "OKR 분기 사이클이 정렬 워크숍과 결합되어야 전사 alignment가 작동합니다.",
      "팀장 코칭이 OKR 운영의 질을 결정 — 회의가 아니라 실제 점검이 되도록.",
      "목표 달성률은 평가 빈도보다 부서 간 정렬 빈도에 더 민감합니다.",
    ],
    caveats: [
      "OKR 도입 초기 6개월은 학습 곡선이 가팔라 HR 부담이 크게 증가합니다.",
      "정렬 워크숍이 형식화되지 않도록 facilitation 역량 확보가 중요합니다.",
    ],
    preview: ["goal_achievement", "decision_speed"],
  },
  {
    id: "scale_up",
    num: "06",
    name: "스케일업 (Scale-Up)",
    tagline: "급성장기 — 채용 가속과 조직 정렬 동시 진행",
    modules: ["직무", "직급", "리더십"],
    fitFor: "50명 → 200명+ 급성장 / 채용 활발",
    drivers: { job_clarity: 85, grade_levels: 4, leader_coaching: 4, alignment_workshops: 4, payband_uplift: 3 },
    insights: [
      "급성장기에는 직무 명확화가 채용 성공률과 신규 인재의 적응 속도를 결정합니다.",
      "직급 단계 축소 + 명확한 R&R이 조직이 커져도 의사결정 속도를 유지하는 핵심.",
      "신임 리더가 다수 양성되는 시기라 팀장 코칭이 평소보다 더 중요합니다.",
    ],
    caveats: [
      "급격한 채용 + 제도 정비를 동시에 하면 HR 캐파 한계 — 단계적 진행 권장.",
      "직급 단순화는 입사 시 직급 매칭과 충돌할 수 있어 채용팀과 정렬 필요.",
    ],
    preview: ["hire_success", "decision_speed"],
  },
  {
    id: "progressive_culture",
    num: "07",
    name: "일하고 싶은 선진 조직",
    tagline: "심리적 안전 · 코칭 · 명확한 직무로 인재 자석 만들기",
    modules: ["보상", "조직문화", "리더십"],
    fitFor: "Employer Brand 강화 / 인재 경쟁 치열",
    drivers: { psych_safety: 90, alignment_workshops: 6, leader_coaching: 3, payband_uplift: 3, job_clarity: 80 },
    insights: [
      "선진 조직문화는 한 요소가 아니라 여러 요소의 결합으로 만들어집니다.",
      "심리적 안전이 retention driver 중 보상보다도 강력합니다 (몰입도 가중치 0.30 vs 0.15).",
      "직무 명확화 + 정기 정렬이 함께 가야 '일하기 좋은 조직'으로 인식됩니다.",
    ],
    caveats: [
      "심리적 안전은 제도가 아니라 리더 행동에서 만들어집니다 — 임원 commitment 필수.",
    ],
    preview: ["engagement", "key_talent_retention"],
  },
  {
    id: "engagement_trust",
    num: "08",
    name: "신뢰와 안전",
    tagline: "심리적 안전과 정렬 워크숍으로 평균 만족도 회복",
    modules: ["보상", "조직문화"],
    fitFor: "이탈률 높음 · 직원 만족도 낮음",
    drivers: { payband_uplift: 4, alignment_workshops: 6, psych_safety: 80 },
    insights: [
      "보상만으로는 한계 — 심리적 안전이 retention의 더 큰 driver입니다.",
      "정기 정렬 워크숍이 변화 수용성을 만들어 후속 제도 도입을 쉽게 합니다.",
      "Pay Band 하위 인상은 채용 성공률에도 직접 영향을 줍니다.",
    ],
    preview: ["engagement", "retention_1y"],
  },
  {
    id: "decision_speed",
    num: "09",
    name: "빠른 의사결정",
    tagline: "직급 통합과 직무 명확화로 조직 평탄화",
    modules: ["직급", "직무"],
    fitFor: "스타트업 → 중견 성장기 · 의사결정 느림",
    drivers: { grade_levels: 4, job_clarity: 85 },
    insights: [
      "직급 단계 축소는 의사결정 속도에 가장 큰 영향(가중치 -0.50)을 주는 단일 driver입니다.",
      "직무가 명확하지 않으면 단계 축소가 혼란을 야기 — 반드시 함께 진행.",
      "단기적으로 직급 호칭 변화에 대한 동요 가능 — 사전 커뮤니케이션 필요.",
    ],
    caveats: [
      "기존 직급 보전금 산정 필요 (대리·과장 통합 시 인상 상실분).",
    ],
    preview: ["decision_speed", "productivity"],
  },
  {
    id: "all_in",
    num: "10",
    name: "올인 패키지",
    tagline: "보상 · 평가 · 문화 · 리더십 전 영역 동시 강화",
    modules: ["보상", "평가", "조직문화", "리더십"],
    fitFor: "S급 인재 다수 보유 · 경쟁사 적극 영입 중",
    drivers: {
      payband_uplift: 5, perf_differential: 4, grade_top_ratio: 30, eval_frequency: 4,
      psych_safety: 85, leader_coaching: 4, alignment_workshops: 6,
    },
    insights: [
      "단일 변수로는 핵심인재 retention을 충분히 끌어올릴 수 없습니다 — 다중 driver의 동시 작용이 필요.",
      "보상(차등) + 평가(변별력) + 안전한 환경 + 코칭이 결합되어야 합니다.",
      "비용은 크지만 핵심 1명 이탈 시 대체 비용이 연봉의 2~3배인 것과 비교하면 ROI는 명확합니다.",
    ],
    caveats: [
      "HR 운영 부담이 크게 증가 — HRIS 도입을 권장합니다.",
      "도입 후 6개월 시점 효과 측정 + 조정이 필요합니다.",
    ],
    preview: ["key_talent_retention", "engagement"],
  },
];

/* ═════════════════ Model ═════════════════ */

function effectiveValues(scenario: Scenario): Record<string, number> {
  const v: Record<string, number> = {};
  DRIVERS.forEach((d) => { v[d.id] = scenario.drivers[d.id] ?? d.default; });
  return v;
}

function computeOutcome(o: Outcome, values: Record<string, number>): number {
  let weightedSum = 0;
  for (const [driverId, weight] of Object.entries(o.weights)) {
    const driver = DRIVERS.find((d) => d.id === driverId);
    if (!driver) continue;
    const span = driver.max - driver.min;
    const normalized = span === 0 ? 0 : (values[driverId] - driver.default) / span;
    weightedSum += normalized * weight;
  }
  return o.base + weightedSum * o.range * 2;
}

/* ═════════════════ Page ═════════════════ */

export default function Step4Simulate() {
  const step = getStepBySlug("4-simulate")!;
  const [selectedId, setSelectedId] = useState<string>("key_talent");
  const selected = SCENARIOS.find((s) => s.id === selectedId)!;
  const values = useMemo(() => effectiveValues(selected), [selected]);
  const changedDrivers = useMemo(() => DRIVERS.filter((d) => Object.prototype.hasOwnProperty.call(selected.drivers, d.id)), [selected]);

  return (
    <>
      <StepShell step={step}>
        <p
          className="body-sm text-ink-600"
          style={{ display: "block", margin: 0, marginBottom: 16, padding: 0, position: "static" }}
        >
          Master 컨설턴트가 큐레이션한 개선 시나리오. 카드를 클릭하면 그 조합이 어떤 변수를 어떻게 조정하고, 어떤 효과를 내는지 한눈에 보입니다.
        </p>

        {/* Wide breakout */}
        <div
          style={{
            marginLeft: "calc(50% - 50vw + 8px)",
            marginRight: "calc(50% - 50vw + 8px)",
            width: "calc(100vw - 16px)",
          }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-[320px,1fr] gap-4 items-start">
              {/* ─── LEFT — Scenario picker box (sticky, scrollable inside) ─── */}
              <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh_-_100px)] flex flex-col">
                <div className="card !p-0 overflow-hidden flex flex-col h-full">
                  {/* Box header */}
                  <div className="px-4 py-3 border-b border-white/[0.08] bg-white/[0.02] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] text-ink-700 flex items-center justify-center flex-shrink-0">
                      <ListChecks size={13} />
                    </div>
                    <div style={{ display: "block", lineHeight: 1 }}>
                      <div
                        className="text-[9px] font-mono font-bold tracking-[0.22em] uppercase text-ink-500"
                        style={{ display: "block", margin: 0, padding: 0, lineHeight: 1 }}
                      >SCENARIOS</div>
                      <div
                        className="text-[14px] font-bold text-ink-900"
                        style={{ display: "block", margin: 0, marginTop: 3, padding: 0, lineHeight: 1 }}
                      >개선 시나리오</div>
                    </div>
                    <span
                      className="ml-auto text-[10px] font-mono text-ink-500 tabular-nums whitespace-nowrap"
                      style={{ display: "inline-block", margin: 0, padding: 0 }}
                    >{SCENARIOS.length}개</span>
                  </div>

                  {/* Scrollable list */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1.5 hcg-scrollbar">
                    {SCENARIOS.map((s) => (
                      <ScenarioCard
                        key={s.id} scenario={s}
                        isSelected={s.id === selectedId}
                        values={effectiveValues(s)}
                        onClick={() => setSelectedId(s.id)}
                      />
                    ))}
                  </div>
                </div>
              </aside>

              {/* ─── RIGHT — Detail panel (sticky + internal scroll) ─── */}
              <main className="lg:sticky lg:top-4 lg:h-[calc(100vh_-_100px)] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 min-h-0 flex flex-col"
                  >
                    <ScenarioDetail scenario={selected} changedDrivers={changedDrivers} values={values} />
                  </motion.div>
                </AnimatePresence>

                <p
                  className="text-[10px] font-mono text-ink-500 mt-2 text-center flex-shrink-0"
                  style={{ display: "block", margin: 0, marginTop: 8, padding: 0, position: "static" }}
                >
                  ⓘ 평균 사례 기반 추정. 실제 자문에서는 회사 데이터로 시나리오를 맞춤화합니다.
                </p>
              </main>
            </div>
          </div>
        </div>
      </StepShell>

      <TourNav current={step} nextLabel="협업 방식 보기" />

      {/* Custom scrollbar styling — inline so no global CSS edit needed */}
      <style>{`
        .hcg-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.12) transparent;
        }
        .hcg-scrollbar::-webkit-scrollbar { width: 6px; }
        .hcg-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hcg-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.10);
          border-radius: 3px;
        }
        .hcg-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.18);
        }
      `}</style>
    </>
  );
}

/* ═════════════════ Scenario card ═════════════════ */

function ScenarioCard({ scenario, isSelected, values, onClick }: {
  scenario: Scenario; isSelected: boolean; values: Record<string, number>; onClick: () => void;
}) {
  const previewOutcomes = scenario.preview
    .map((id) => OUTCOMES.find((o) => o.id === id))
    .filter((o): o is Outcome => !!o)
    .map((o) => {
      const current = computeOutcome(o, values);
      const diff = current - o.base;
      const isGood = (diff > 0 && o.higherIsBetter) || (diff < 0 && !o.higherIsBetter);
      return { o, diff, isGood };
    });

  const isBaseline = scenario.id === "baseline";

  return (
    <button
      type="button" onClick={onClick}
      className={cn(
        "text-left w-full p-2.5 rounded-lg border transition-all relative",
        isSelected
          ? "bg-accent-500/[0.10] border-accent-500/50 shadow-[0_0_20px_-6px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-white/[0.02] border-white/[0.06] hover:border-accent-500/30 hover:bg-white/[0.04]",
      )}
    >
      {isSelected && (
        <span aria-hidden className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />
      )}

      {/* Number + name row */}
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className={cn(
            "text-[9px] font-mono font-bold tracking-[0.22em] flex-shrink-0",
            isSelected ? "text-accent-400" : "text-ink-500",
          )}>#{scenario.num}</span>
          <span
            className="text-[13px] font-bold text-ink-900 truncate"
            style={{ display: "inline-block", margin: 0, padding: 0, position: "static" }}
          >
            {scenario.name}
          </span>
        </div>
        {isSelected && <CheckCircle2 size={13} className="text-accent-400 flex-shrink-0" />}
      </div>

      {/* Module chips */}
      <div className="flex flex-wrap gap-1 mb-1.5">
        {isBaseline ? (
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.05] text-ink-500 uppercase tracking-wider">
            기준점
          </span>
        ) : scenario.modules.map((m) => (
          <span
            key={m}
            className={cn(
              "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
              isSelected
                ? "bg-accent-500/20 text-accent-300 border border-accent-500/30"
                : "bg-white/[0.05] text-ink-600 border border-white/[0.06]",
            )}
          >{m}</span>
        ))}
      </div>

      {/* Tagline */}
      <div
        className="text-[10px] text-ink-500 leading-snug mb-1.5"
        style={{ display: "block", margin: 0, marginBottom: 6, padding: 0, position: "static" }}
      >
        {scenario.tagline}
      </div>

      {/* Preview effects */}
      {previewOutcomes.length > 0 && (
        <div className="space-y-0.5 pt-1.5 border-t border-white/[0.05]">
          {previewOutcomes.map(({ o, diff, isGood }) => {
            const decimals = o.decimals ?? 1;
            const Icon = diff > 0 ? TrendingUp : TrendingDown;
            return (
              <div key={o.id} className="flex items-center justify-between text-[10px]">
                <span className="text-ink-600 truncate">{o.label}</span>
                <span className={cn(
                  "inline-flex items-center gap-0.5 font-mono font-bold tabular-nums whitespace-nowrap",
                  isGood ? "text-success-500" : "text-warning-500",
                )}>
                  <Icon size={9} />
                  {diff > 0 ? "+" : ""}{diff.toFixed(decimals)}
                  {o.unit && <span className="text-ink-500 ml-0.5 font-medium">{o.unit}</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </button>
  );
}

/* ═════════════════ Scenario detail ═════════════════ */

function ScenarioDetail({ scenario, changedDrivers, values }: {
  scenario: Scenario; changedDrivers: Driver[]; values: Record<string, number>;
}) {
  const isBaseline = scenario.id === "baseline";

  return (
    <div className="card !p-0 overflow-hidden flex flex-col h-full">
      {/* Header — fixed */}
      <div className="flex-shrink-0 px-4 sm:px-5 py-3.5 border-b border-white/[0.08] bg-gradient-to-b from-accent-500/[0.06] to-transparent">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div
              className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase"
              style={{ display: "block", margin: 0, padding: 0, position: "static", lineHeight: 1 }}
            >
              선택된 시나리오 #{scenario.num}
            </div>
            <div
              className="text-[18px] font-bold text-ink-900"
              style={{ display: "block", margin: 0, marginTop: 4, padding: 0, position: "static", lineHeight: 1.2 }}
            >
              {scenario.name}
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-ink-500">
            <Target size={11} className="text-accent-400" />
            <span>{scenario.fitFor}</span>
          </div>
        </div>
      </div>

      {/* Body — scrollable 3-column grid */}
      <div className="flex-1 min-h-0 overflow-y-auto hcg-scrollbar">
        <div className="grid lg:grid-cols-[1fr,1fr,1.2fr] gap-px bg-white/[0.05]">
        {/* ── Insights ── */}
        <div className="bg-ink-50 p-4 sm:p-5">
          <SectionHead icon={Sparkles} label="핵심 인사이트" accent />
          <ul className="space-y-2.5 mt-3">
            {scenario.insights.map((it, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-ink-700 leading-relaxed">
                <span className="text-accent-400 mt-0.5 font-mono text-[10px] flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
          {scenario.caveats && scenario.caveats.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <SectionHead icon={AlertTriangle} label="유의사항" />
              <ul className="space-y-2 mt-2.5">
                {scenario.caveats.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-warning-500/90 leading-relaxed">
                    <span className="text-warning-500 mt-0.5 flex-shrink-0">·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Driver changes ── */}
        <div className="bg-ink-50 p-4 sm:p-5">
          <SectionHead icon={LayersIcon} label="조정되는 변수" />
          {isBaseline || changedDrivers.length === 0 ? (
            <div className="text-[12px] text-ink-500 mt-3 italic">조정되는 변수가 없습니다 (baseline).</div>
          ) : (
            <div className="space-y-2.5 mt-3">
              {changedDrivers.map((d) => {
                const newVal = scenario.drivers[d.id];
                const fmt = d.formatBeforeAfter ?? ((n: number) => `${n}${d.unit}`);
                return (
                  <div key={d.id} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <div
                      className="text-[10px] font-mono text-ink-500 uppercase tracking-wider mb-1"
                      style={{ display: "block", margin: 0, marginBottom: 4, padding: 0, position: "static" }}
                    >
                      {d.module}
                    </div>
                    <div
                      className="text-[12px] text-ink-700 mb-1.5"
                      style={{ display: "block", margin: 0, marginBottom: 6, padding: 0, position: "static" }}
                    >
                      {d.label}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-mono tabular-nums">
                      <span className="text-ink-500">{fmt(d.default)}</span>
                      <ArrowRight size={10} className="text-accent-400" />
                      <span className="text-accent-400 font-bold">{fmt(newVal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Outcome effects ── */}
        <div className="bg-ink-50 p-4 sm:p-5">
          <SectionHead icon={Sparkles} label="기대 효과" accent />
          <div className="space-y-3 mt-3">
            {OUTCOME_GROUPS.map((g) => {
              const groupOutcomes = OUTCOMES.filter((o) => o.group === g);
              return (
                <div key={g}>
                  <div
                    className="text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-1.5"
                    style={{ display: "block", margin: 0, marginBottom: 6, padding: "0 2px", position: "static" }}
                  >
                    {g}
                  </div>
                  <div className="space-y-1">
                    {groupOutcomes.map((o) => <OutcomeMini key={o.id} outcome={o} values={values} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function SectionHead({ icon: Icon, label, accent }: { icon: LucideIcon; label: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        accent ? "text-accent-400" : "text-ink-600",
      )}
      style={{ display: "flex", margin: 0, padding: 0, position: "static" }}
    >
      <Icon size={11} />
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}

function OutcomeMini({ outcome, values }: { outcome: Outcome; values: Record<string, number> }) {
  const current = computeOutcome(outcome, values);
  const diff = current - outcome.base;
  const isZero = Math.abs(diff) < 0.01;
  const isGood = (diff > 0 && outcome.higherIsBetter) || (diff < 0 && !outcome.higherIsBetter);
  const decimals = outcome.decimals ?? 1;
  const TrendIcon = isZero ? Minus : (diff > 0 ? TrendingUp : TrendingDown);

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
      <span className="text-[11px] text-ink-700 truncate">{outcome.label}</span>
      <div className="flex items-baseline gap-1.5 whitespace-nowrap flex-shrink-0">
        <span className="text-[13px] font-bold text-ink-900 tabular-nums leading-none">
          {current.toFixed(decimals)}
          {outcome.unit && <span className="text-[9px] text-ink-500 font-medium ml-0.5">{outcome.unit}</span>}
        </span>
        <span className={cn(
          "inline-flex items-center gap-0.5 text-[9px] font-mono font-bold tabular-nums px-1 py-0.5 rounded min-w-[42px] justify-center",
          isZero ? "text-ink-500 bg-white/[0.04]"
                 : isGood ? "text-success-500 bg-success-500/15"
                          : "text-warning-500 bg-warning-500/15",
        )}>
          <TrendIcon size={8} />
          {isZero ? "—" : `${diff > 0 ? "+" : ""}${diff.toFixed(decimals)}`}
        </span>
      </div>
    </div>
  );
}