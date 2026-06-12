import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, Sparkles, Target, AlertTriangle,
  ArrowRight, CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ═════════════════ Drivers & Outcomes (data) ═════════════════ */

type Module = "보상" | "평가" | "직급" | "직무" | "조직문화" | "리더십";
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
    weights: { perf_differential: 0.15, grade_top_ratio: 0.05, eval_frequency: 0.10, grade_levels: -0.15, job_clarity: 0.25, psych_safety: 0.20, leader_coaching: 0.25 } },
  { id: "decision_speed",       group: "성과·생산성",label: "의사결정 속도",        unit: "",     base: 100, range: 35, higherIsBetter: true,  decimals: 0,
    weights: { grade_levels: -0.50, job_clarity: 0.20, psych_safety: 0.15, alignment_workshops: 0.10, leader_coaching: 0.10 } },
  { id: "goal_achievement",     group: "성과·생산성",label: "목표 달성률",          unit: "%",    base: 72,  range: 18, higherIsBetter: true,  decimals: 0,
    weights: { grade_top_ratio: 0.05, eval_frequency: 0.20, perf_differential: 0.10, job_clarity: 0.20, alignment_workshops: 0.15, psych_safety: 0.10, leader_coaching: 0.25 } },
  { id: "engagement",           group: "몰입·문화", label: "몰입도 (eNPS)",        unit: "",     base: 18,  range: 35, higherIsBetter: true,  decimals: 0,
    weights: { payband_uplift: 0.15, perf_differential: -0.05, eval_frequency: -0.10, grade_levels: -0.10, job_clarity: 0.15, alignment_workshops: 0.20, psych_safety: 0.30, leader_coaching: 0.25 } },
  { id: "change_readiness",     group: "몰입·문화", label: "변화 수용성",          unit: "/100", base: 52,  range: 28, higherIsBetter: true,  decimals: 0,
    weights: { alignment_workshops: 0.30, psych_safety: 0.35, leader_coaching: 0.20, job_clarity: 0.10, eval_frequency: 0.05 } },
  { id: "hr_burden",            group: "비용",      label: "HR 운영 부담",         unit: "h/월", base: 70,  range: 45, higherIsBetter: false, decimals: 0,
    weights: { eval_frequency: 0.40, alignment_workshops: 0.25, leader_coaching: 0.15, grade_top_ratio: 0.05, job_clarity: -0.10 } },
];

const OUTCOME_GROUPS: OutcomeGroup[] = ["Retention", "Hiring", "성과·생산성", "몰입·문화", "비용"];

/* ═════════════════ Scenarios — curated improvement bundles ═════════════════ */

type Scenario = {
  id: string;
  num: string;
  name: string;
  tagline: string;
  modules: Module[];
  fitFor: string;
  /** driver id → 조정된 값 (없으면 default 사용) */
  drivers: Record<string, number>;
  insights: string[];
  caveats?: string[];
  /** 강조해서 미리보기에 띄울 outcome id 1-2개 */
  preview: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "baseline",
    num: "00",
    name: "현재 상태",
    tagline: "어떤 개입도 하지 않은 baseline 상태",
    modules: [],
    fitFor: "비교 기준점",
    drivers: {},
    insights: ["다른 시나리오와 비교하기 위한 baseline입니다.", "어느 영역에 개입할지 결정하기 전 현재 지표 확인용."],
    preview: [],
  },
  {
    id: "eval_comp_overhaul",
    num: "01",
    name: "평가 + 보상 통합 개선",
    tagline: "변별력 있는 평가와 차등 보상으로 핵심인재 잡기",
    modules: ["평가", "보상"],
    fitFor: "100~500명 / 핵심인재 이탈 우려 회사",
    drivers: { payband_uplift: 3, perf_differential: 3.5, grade_top_ratio: 25, eval_frequency: 4 },
    insights: [
      "변별력 있는 평가가 차등 보상의 정당성을 제공합니다.",
      "핵심인재는 인상폭보다 '인정받는다'는 신호에 더 민감하게 반응합니다.",
      "분기 평가는 HR 운영 부담을 늘리지만 retention ROI가 충분히 보상합니다.",
    ],
    caveats: [
      "차등 확대는 단기 갈등 가능성이 있어 커뮤니케이션이 핵심입니다.",
      "Calibration Session으로 평가 공정성 보완은 필수입니다.",
    ],
    preview: ["key_talent_retention", "productivity"],
  },
  {
    id: "eval_only",
    num: "02",
    name: "평가만 단독 강화",
    tagline: "적은 투자로 변별력과 정렬도부터 확보",
    modules: ["평가"],
    fitFor: "재원 여유 없음 · 평가가 형식화된 회사",
    drivers: { grade_top_ratio: 25, eval_frequency: 4 },
    insights: [
      "보상 재원 증가 없이도 변별력 있는 평가만으로 목표 달성률을 끌어올릴 수 있습니다.",
      "잦은 Check-in 사이클은 정렬도와 피드백 문화를 만듭니다.",
      "다만 변별만 강화하고 보상이 따르지 않으면 단기적으로 만족도 하락 위험.",
    ],
    caveats: [
      "보상으로 이어지지 않으면 평가 무력감 발생 — 6~12개월 내 보상 연계 권장.",
    ],
    preview: ["goal_achievement", "hr_burden"],
  },
  {
    id: "comp_culture",
    num: "03",
    name: "보상 + 조직문화 개선",
    tagline: "직원 만족도와 retention을 함께 끌어올리는 패키지",
    modules: ["보상", "조직문화"],
    fitFor: "이탈률 높음 · 직원 만족도 낮음 회사",
    drivers: { payband_uplift: 4, alignment_workshops: 6, psych_safety: 80 },
    insights: [
      "보상만으로는 한계 — 심리적 안전이 retention의 더 큰 driver입니다.",
      "정기 정렬 워크숍이 변화 수용성을 만들어 후속 제도 도입을 쉽게 합니다.",
      "Pay Band 하위 인상은 채용 성공률에도 직접 영향을 줍니다.",
    ],
    preview: ["engagement", "retention_1y"],
  },
  {
    id: "job_leader",
    num: "04",
    name: "직무 명확화 + 리더십 강화",
    tagline: "생산성과 운영 효율을 동시에",
    modules: ["직무", "리더십"],
    fitFor: "급성장 회사 · 역할 모호 · 팀장 역량 편차",
    drivers: { job_clarity: 90, leader_coaching: 4 },
    insights: [
      "직무가 명확하면 채용 소요일과 운영 부담이 동시에 줄어듭니다.",
      "팀장 코칭은 단일 변수 중 생산성과 목표 달성률에 가장 큰 영향을 주는 driver.",
      "비용 없는 개입이지만 시간 투자가 필요 — 경영진 commitment가 핵심입니다.",
    ],
    preview: ["productivity", "hire_days"],
  },
  {
    id: "flatten",
    num: "05",
    name: "조직 슬림화",
    tagline: "직급 통합 + 직무 명확화로 의사결정 가속",
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
    id: "key_talent_full",
    num: "06",
    name: "핵심인재 retention 종합",
    tagline: "모든 영역을 활용한 프리미엄 패키지",
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
      "HR 운영 부담이 크게 증가 — HRIS 도입 권장.",
      "도입 후 6개월 시점 효과 측정 + 조정 필요.",
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
  const [selectedId, setSelectedId] = useState<string>("eval_comp_overhaul");
  const selected = SCENARIOS.find((s) => s.id === selectedId)!;
  const values = useMemo(() => effectiveValues(selected), [selected]);
  const changedDrivers = useMemo(() => DRIVERS.filter((d) => Object.prototype.hasOwnProperty.call(selected.drivers, d.id)), [selected]);

  return (
    <>
      <StepShell step={step}>
        <p
          className="body-sm text-ink-600 max-w-[720px]"
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
            {/* ─── Scenario picker grid ─── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
              {SCENARIOS.map((s) => (
                <ScenarioCard
                  key={s.id} scenario={s}
                  isSelected={s.id === selectedId}
                  values={effectiveValues(s)}
                  onClick={() => setSelectedId(s.id)}
                />
              ))}
            </div>

            {/* ─── Detail panel ─── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ScenarioDetail scenario={selected} changedDrivers={changedDrivers} values={values} />
              </motion.div>
            </AnimatePresence>

            <p
              className="text-[10px] font-mono text-ink-500 mt-3 text-center"
              style={{ display: "block", margin: 0, marginTop: 12, padding: 0, position: "static" }}
            >
              ⓘ HCG 평균 사례 기반 추정. 실제 자문에서는 회사 데이터로 시나리오를 맞춤화합니다.
            </p>
          </div>
        </div>
      </StepShell>

      <TourNav current={step} nextLabel="협업 방식 보기" />
    </>
  );
}

/* ═════════════════ Scenario card ═════════════════ */

function ScenarioCard({ scenario, isSelected, values, onClick }: {
  scenario: Scenario; isSelected: boolean; values: Record<string, number>; onClick: () => void;
}) {
  // Compute preview outcome diffs
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
        "text-left p-3 rounded-xl border transition-all relative overflow-hidden h-full flex flex-col",
        isSelected
          ? "bg-accent-500/[0.08] border-accent-500/50 shadow-[0_0_24px_-4px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-white/[0.03] border-white/[0.08] hover:border-accent-500/30 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6)]",
      )}
    >
      {isSelected && (
        <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />
      )}

      {/* Number + module chips */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn(
          "text-[9px] font-mono font-bold tracking-[0.22em]",
          isSelected ? "text-accent-400" : "text-ink-500",
        )}>#{scenario.num}</span>
        {isSelected && <CheckCircle2 size={12} className="text-accent-400" />}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {isBaseline ? (
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.06] text-ink-500 uppercase tracking-wider">
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

      {/* Name */}
      <div
        className="text-[14px] font-bold text-ink-900 leading-tight mb-1"
        style={{ display: "block", margin: 0, marginBottom: 4, padding: 0, position: "static" }}
      >
        {scenario.name}
      </div>

      {/* Tagline */}
      <div
        className="text-[11px] text-ink-500 leading-snug mb-2.5 flex-1"
        style={{ display: "block", margin: 0, marginBottom: 10, padding: 0, position: "static" }}
      >
        {scenario.tagline}
      </div>

      {/* Preview effects */}
      {previewOutcomes.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-white/[0.05]">
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
    <div className="card !p-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-white/[0.08] bg-gradient-to-b from-accent-500/[0.06] to-transparent">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div
              className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase"
              style={{ display: "block", margin: 0, padding: 0, position: "static", lineHeight: 1 }}
            >
              선택된 시나리오 #{scenario.num}
            </div>
            <div
              className="text-[18px] font-bold text-ink-900 mt-1"
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

      {/* Body — three columns: insights / driver changes / outcomes */}
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
            <>
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
            </>
          )}
        </div>

        {/* ── Driver changes ── */}
        <div className="bg-ink-50 p-4 sm:p-5">
          <SectionHead icon={ArrowRight} label="조정되는 변수" />
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