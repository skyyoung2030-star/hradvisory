import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Coins, BarChart3, Layers, FileSearch, Users2, MessageCircle,
  TrendingUp, TrendingDown, Minus, RotateCcw, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ═════════════════ Drivers (input) ═════════════════ */

type DriverGroup = "보상" | "평가" | "직급" | "직무" | "조직문화" | "리더십";

type Driver = {
  id: string;
  group: DriverGroup;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  help?: string;
};

const DRIVERS: Driver[] = [
  /* 보상 */
  { id: "payband_uplift",   group: "보상",     label: "Pay Band 하위 인원 추가 인상", unit: "%",     min: 0,  max: 10, step: 1,   default: 0,  help: "Compa-Ratio 하위에 적용" },
  { id: "perf_differential",group: "보상",     label: "성과급 차등폭 (S vs C)",         unit: "배",    min: 1,  max: 5,  step: 0.5, default: 2,  help: "S등급 인상률 / C등급 인상률" },
  /* 평가 */
  { id: "grade_top_ratio",  group: "평가",     label: "상위 등급 비율 (S+A)",           unit: "%",     min: 15, max: 35, step: 5,   default: 20, help: "변별력 vs 운영 부담" },
  { id: "eval_frequency",   group: "평가",     label: "평가 사이클 빈도",               unit: "회/년", min: 1,  max: 4,  step: 1,   default: 2,  help: "연 1회 / 반기 / 분기 / 월" },
  /* 직급 */
  { id: "grade_levels",     group: "직급",     label: "직급 단계 수",                   unit: "단계",  min: 3,  max: 7,  step: 1,   default: 6,  help: "단계 적을수록 평탄" },
  /* 직무 */
  { id: "job_clarity",      group: "직무",     label: "직무 명세 명확도",               unit: "/100",  min: 30, max: 100,step: 10,  default: 60, help: "역할·책임이 명문화된 정도" },
  /* 조직문화 */
  { id: "alignment_workshops", group: "조직문화", label: "정렬 워크숍 빈도",            unit: "회/년", min: 0,  max: 12, step: 1,   default: 2,  help: "타운홀 · 부서별 액션 워크숍" },
  { id: "psych_safety",     group: "조직문화", label: "심리적 안전 (피드백·실패 용인)", unit: "/100",  min: 30, max: 100,step: 10,  default: 55, help: "구성원 서베이 점수" },
  /* 리더십 */
  { id: "leader_coaching",  group: "리더십",   label: "팀장 코칭 빈도",                 unit: "회/분기",min: 0,  max: 6,  step: 1,   default: 1,  help: "1:1 코칭 세션 횟수" },
];

const DRIVER_GROUPS: { name: DriverGroup; icon: LucideIcon }[] = [
  { name: "보상",       icon: Coins },
  { name: "평가",       icon: BarChart3 },
  { name: "직급",       icon: Layers },
  { name: "직무",       icon: FileSearch },
  { name: "조직문화",   icon: Users2 },
  { name: "리더십",     icon: MessageCircle },
];

/* ═════════════════ Outcomes (output) ═════════════════
   Each outcome is a linear combination of normalized driver positions.
   `range` defines the maximum swing around `base`. Weights can be negative
   (driver pulling outcome down) or positive. */

type OutcomeGroup = "Retention" | "Hiring" | "성과·생산성" | "몰입·문화" | "비용";

type Outcome = {
  id: string;
  group: OutcomeGroup;
  label: string;
  unit: string;
  base: number;
  range: number;
  higherIsBetter: boolean;
  decimals?: number;
  /** driver id → weight (sum of |weight| should be ≤ ~1.5 to keep result in band) */
  weights: Record<string, number>;
};

const OUTCOMES: Outcome[] = [
  /* Retention */
  {
    id: "retention_1y", group: "Retention", label: "1년 직원 retention",
    unit: "%", base: 86, range: 8, higherIsBetter: true, decimals: 1,
    weights: { payband_uplift: 0.35, perf_differential: 0.10, eval_frequency: -0.05, grade_levels: -0.05,
               job_clarity: 0.15, alignment_workshops: 0.15, psych_safety: 0.25, leader_coaching: 0.20 },
  },
  {
    id: "key_talent_retention", group: "Retention", label: "핵심인재 유지율",
    unit: "%", base: 78, range: 15, higherIsBetter: true, decimals: 1,
    weights: { payband_uplift: 0.15, perf_differential: 0.30, grade_top_ratio: 0.15, eval_frequency: 0.05,
               job_clarity: 0.10, psych_safety: 0.25, leader_coaching: 0.25 },
  },
  /* Hiring */
  {
    id: "hire_success", group: "Hiring", label: "신규 채용 성공률",
    unit: "%", base: 68, range: 22, higherIsBetter: true, decimals: 0,
    weights: { payband_uplift: 0.30, perf_differential: 0.05, job_clarity: 0.30,
               psych_safety: 0.20, leader_coaching: 0.10, alignment_workshops: 0.05 },
  },
  {
    id: "hire_days", group: "Hiring", label: "평균 채용 소요일",
    unit: "일", base: 58, range: 22, higherIsBetter: false, decimals: 0,
    weights: { payband_uplift: -0.20, job_clarity: -0.30, psych_safety: -0.10,
               alignment_workshops: -0.05, leader_coaching: -0.05 },
  },
  /* 성과·생산성 */
  {
    id: "productivity", group: "성과·생산성", label: "직원 생산성 지수",
    unit: "", base: 100, range: 28, higherIsBetter: true, decimals: 0,
    weights: { perf_differential: 0.15, grade_top_ratio: 0.05, eval_frequency: 0.10,
               grade_levels: -0.15, job_clarity: 0.25, psych_safety: 0.20, leader_coaching: 0.25 },
  },
  {
    id: "decision_speed", group: "성과·생산성", label: "의사결정 속도",
    unit: "", base: 100, range: 35, higherIsBetter: true, decimals: 0,
    weights: { grade_levels: -0.50, job_clarity: 0.20, psych_safety: 0.15,
               alignment_workshops: 0.10, leader_coaching: 0.10 },
  },
  {
    id: "goal_achievement", group: "성과·생산성", label: "목표 달성률 (OKR)",
    unit: "%", base: 72, range: 18, higherIsBetter: true, decimals: 0,
    weights: { grade_top_ratio: 0.05, eval_frequency: 0.20, perf_differential: 0.10,
               job_clarity: 0.20, alignment_workshops: 0.15, psych_safety: 0.10, leader_coaching: 0.25 },
  },
  /* 몰입·문화 */
  {
    id: "engagement", group: "몰입·문화", label: "직원 몰입도 (eNPS)",
    unit: "", base: 18, range: 35, higherIsBetter: true, decimals: 0,
    weights: { payband_uplift: 0.15, perf_differential: -0.05, eval_frequency: -0.10,
               grade_levels: -0.10, job_clarity: 0.15, alignment_workshops: 0.20, psych_safety: 0.30, leader_coaching: 0.25 },
  },
  {
    id: "change_readiness", group: "몰입·문화", label: "변화 수용성",
    unit: "/100", base: 52, range: 28, higherIsBetter: true, decimals: 0,
    weights: { alignment_workshops: 0.30, psych_safety: 0.35, leader_coaching: 0.20,
               job_clarity: 0.10, eval_frequency: 0.05 },
  },
  /* 비용 */
  {
    id: "hr_burden", group: "비용", label: "HR 운영 부담",
    unit: "시간/월", base: 70, range: 45, higherIsBetter: false, decimals: 0,
    weights: { eval_frequency: 0.40, alignment_workshops: 0.25, leader_coaching: 0.15,
               grade_top_ratio: 0.05, job_clarity: -0.10 },
  },
];

const OUTCOME_GROUPS: { name: OutcomeGroup }[] = [
  { name: "Retention" }, { name: "Hiring" },
  { name: "성과·생산성" }, { name: "몰입·문화" }, { name: "비용" },
];

/* ═════════════════ Model ═════════════════ */

function defaultValues(): Record<string, number> {
  const v: Record<string, number> = {};
  DRIVERS.forEach((d) => { v[d.id] = d.default; });
  return v;
}

function computeOutcome(o: Outcome, values: Record<string, number>): number {
  let weightedSum = 0;
  for (const [driverId, weight] of Object.entries(o.weights)) {
    const driver = DRIVERS.find((d) => d.id === driverId);
    if (!driver) continue;
    const v = values[driverId];
    // Normalized -0.5 ~ +0.5 around default position
    const span = driver.max - driver.min;
    const normalized = span === 0 ? 0 : (v - driver.default) / span;
    weightedSum += normalized * weight;
  }
  // weightedSum typically lands in -0.5 ~ +0.5 range; expand to ±range
  return o.base + weightedSum * o.range * 2;
}

/* ═════════════════ Page ═════════════════ */

export default function Step4Simulate() {
  const step = getStepBySlug("4-simulate")!;
  const [values, setValues] = useState<Record<string, number>>(() => defaultValues());

  const setOne = useCallback((id: string, v: number) => {
    setValues((curr) => ({ ...curr, [id]: v }));
  }, []);

  const reset = () => setValues(defaultValues());

  const isBaseline = useMemo(() => {
    return DRIVERS.every((d) => values[d.id] === d.default);
  }, [values]);

  return (
    <>
      <StepShell step={step}>
        <p
          className="body text-ink-600 max-w-[720px]"
          style={{ display: "block", margin: 0, marginBottom: 24, padding: 0, position: "static" }}
        >
          Master 자문의 핵심 도구. 보상·평가·직급·직무·조직문화·리더십 변수를 동시에 조정하면, 10개 지표가 어떻게 함께 움직이는지 추정합니다. 실제 자문에서는 회사 데이터로 모델을 보정합니다.
        </p>

        {/* Top bar — baseline indicator + reset */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono">
            {isBaseline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-ink-500" />
                <span className="text-ink-600">BASELINE — 변수를 조정해보세요</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse-soft shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                <span className="text-accent-300">SIMULATING — 실시간 추정 중</span>
              </>
            )}
          </div>
          <button
            type="button" onClick={reset} disabled={isBaseline}
            className="btn-ghost text-[12px] disabled:opacity-30"
          >
            <RotateCcw size={12} className="mr-1.5" />
            기본값 복원
          </button>
        </div>

        {/* Main grid — drivers (left) + outcomes (right) */}
        <div className="grid lg:grid-cols-[1.05fr,1fr] gap-5">
          {/* ─── Drivers ─── */}
          <div className="space-y-3">
            <SectionLabel label="DRIVERS — 조정 가능한 변수" />
            {DRIVER_GROUPS.map((g) => (
              <DriverGroupCard
                key={g.name}
                group={g.name}
                icon={g.icon}
                drivers={DRIVERS.filter((d) => d.group === g.name)}
                values={values}
                onChange={setOne}
              />
            ))}
          </div>

          {/* ─── Outcomes ─── */}
          <div className="space-y-3">
            <SectionLabel label="OUTCOMES — 기대 효과 추정" />
            {OUTCOME_GROUPS.map((g) => (
              <OutcomeGroupCard
                key={g.name}
                group={g.name}
                outcomes={OUTCOMES.filter((o) => o.group === g.name)}
                values={values}
              />
            ))}
            <p className="text-[11px] text-ink-500 leading-relaxed px-1 pt-1">
              ⓘ 추정치는 HCG 평균 사례 기반 선형 모델입니다. 회사 데이터를 넣으면 더 정교한 비선형 모델로 보정합니다.
            </p>
          </div>
        </div>
      </StepShell>

      <TourNav current={step} nextLabel="협업 방식 보기" />
    </>
  );
}

/* ═════════════════ Section label ═════════════════ */

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase px-1"
      style={{ display: "block", margin: 0, padding: "0 4px", position: "static" }}
    >
      {label}
    </div>
  );
}

/* ═════════════════ Driver group ═════════════════ */

function DriverGroupCard({ group, icon: Icon, drivers, values, onChange }: {
  group: DriverGroup; icon: LucideIcon; drivers: Driver[];
  values: Record<string, number>; onChange: (id: string, v: number) => void;
}) {
  return (
    <div className="card !p-4">
      <div
        className="flex items-center gap-2 mb-3"
        style={{ display: "flex", margin: 0, marginBottom: 12, padding: 0, position: "static" }}
      >
        <div className="w-7 h-7 rounded-lg bg-accent-500/15 border border-accent-500/30 text-accent-400 flex items-center justify-center">
          <Icon size={13} />
        </div>
        <span className="text-[13px] font-bold text-ink-900">{group}</span>
      </div>
      <div className="space-y-3">
        {drivers.map((d) => (
          <DriverRow key={d.id} driver={d} value={values[d.id]} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

function DriverRow({ driver, value, onChange }: {
  driver: Driver; value: number; onChange: (id: string, v: number) => void;
}) {
  const isChanged = value !== driver.default;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="text-[12px] text-ink-700 leading-tight flex-1">{driver.label}</span>
        <span
          className={cn(
            "text-[13px] font-mono font-bold tabular-nums whitespace-nowrap",
            isChanged ? "text-accent-400" : "text-ink-600",
          )}
        >
          {value}
          <span className="text-ink-500 text-[10px] font-medium ml-0.5">{driver.unit}</span>
        </span>
      </div>
      <Slider
        min={driver.min} max={driver.max} step={driver.step}
        value={value} defaultMarker={driver.default}
        onChange={(v) => onChange(driver.id, v)}
      />
      {driver.help && (
        <div className="text-[10px] text-ink-500 mt-1 font-mono">{driver.help}</div>
      )}
    </div>
  );
}

/* ═════════════════ Outcome group ═════════════════ */

function OutcomeGroupCard({ group, outcomes, values }: {
  group: OutcomeGroup; outcomes: Outcome[]; values: Record<string, number>;
}) {
  return (
    <div className="card !p-4">
      <div
        className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-3"
        style={{ display: "block", margin: 0, marginBottom: 12, padding: 0, position: "static" }}
      >
        {group}
      </div>
      <div className="space-y-3">
        {outcomes.map((o) => <OutcomeRow key={o.id} outcome={o} values={values} />)}
      </div>
    </div>
  );
}

function OutcomeRow({ outcome, values }: { outcome: Outcome; values: Record<string, number> }) {
  const current = computeOutcome(outcome, values);
  const diff = current - outcome.base;
  const isZero = Math.abs(diff) < 0.01;
  const isGood = (diff > 0 && outcome.higherIsBetter) || (diff < 0 && !outcome.higherIsBetter);
  const decimals = outcome.decimals ?? 1;
  const Icon = isZero ? Minus : (diff > 0 ? TrendingUp : TrendingDown);

  // Bar position — current vs base on a -range ~ +range scale around base
  const minVal = outcome.base - outcome.range;
  const maxVal = outcome.base + outcome.range;
  const basePct = ((outcome.base - minVal) / (maxVal - minVal)) * 100;
  const currentPct = Math.max(0, Math.min(100, ((current - minVal) / (maxVal - minVal)) * 100));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="text-[12px] text-ink-700 leading-tight flex-1">{outcome.label}</span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-[14px] font-mono font-bold tabular-nums text-ink-900">
            {current.toFixed(decimals)}{outcome.unit && <span className="text-[10px] text-ink-500 ml-0.5">{outcome.unit}</span>}
          </span>
        </span>
      </div>

      {/* Visual bar — base marker + current fill */}
      <div className="relative h-2 rounded-full bg-white/[0.04] border border-white/[0.04] mb-1">
        {/* Base marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-ink-500/60"
          style={{ left: `${basePct}%` }}
          aria-label="기본값"
        />
        {/* Current dot with fill from base to current */}
        {!isZero && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full",
              isGood ? "bg-success-500/60" : "bg-warning-500/60",
            )}
            style={{
              left: `${Math.min(basePct, currentPct)}%`,
              width: `${Math.abs(currentPct - basePct)}%`,
            }}
          />
        )}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 shadow-md",
            isZero ? "bg-ink-500 border-ink-400" :
            isGood ? "bg-success-500 border-success-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                   : "bg-warning-500 border-warning-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
          )}
          style={{ left: `calc(${currentPct}% - 5px)` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-ink-500">
        <span>기본 {outcome.base.toFixed(decimals)}</span>
        <span className={cn(
          "inline-flex items-center gap-1 font-bold",
          isZero ? "text-ink-500" : isGood ? "text-success-500" : "text-warning-500",
        )}>
          <Icon size={10} />
          {isZero ? "—" : `${diff > 0 ? "+" : ""}${diff.toFixed(decimals)}`}
        </span>
      </div>
    </div>
  );
}

/* ═════════════════ Custom slider ═════════════════ */

function Slider({ min, max, step, value, defaultMarker, onChange }: {
  min: number; max: number; step: number; value: number; defaultMarker: number; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const defaultPct = ((defaultMarker - min) / (max - min)) * 100;
  return (
    <div className="relative h-6 flex items-center">
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/[0.06] border border-white/[0.04]" />
      <div
        className="absolute h-1.5 rounded-full bg-gradient-to-r from-accent-600 to-accent-400 shadow-[0_0_8px_-1px_rgba(14,165,233,0.6)]"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute h-3 w-px bg-ink-500/60 top-1/2 -translate-y-1/2"
        style={{ left: `${defaultPct}%` }}
        title="기본값"
      />
      <input
        type="range" min={min} max={max} value={value} step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.5),0_0_0_3px_rgba(14,165,233,0.2)] border-2 border-accent-500 pointer-events-none"
        style={{ left: `calc(${pct}% - 8px)` }}
      />
    </div>
  );
}