import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Coins, BarChart3, Layers, FileSearch, Users2, MessageCircle,
  TrendingUp, TrendingDown, Minus, RotateCcw, Sparkles, Sliders,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ═════════════════ Drivers ═════════════════ */

type DriverGroup = "보상" | "평가" | "직급" | "직무" | "조직문화" | "리더십";
type Driver = {
  id: string; group: DriverGroup; label: string; unit: string;
  min: number; max: number; step: number; default: number; help?: string;
};

const DRIVERS: Driver[] = [
  { id: "payband_uplift",      group: "보상",     label: "Pay Band 하위 추가 인상",   unit: "%",      min: 0,  max: 10, step: 1,   default: 0,  help: "Compa-Ratio 하위에 적용" },
  { id: "perf_differential",   group: "보상",     label: "성과급 차등폭",            unit: "배",     min: 1,  max: 5,  step: 0.5, default: 2,  help: "S등급 / C등급 인상률" },
  { id: "grade_top_ratio",     group: "평가",     label: "상위 등급 비율 (S+A)",     unit: "%",      min: 15, max: 35, step: 5,   default: 20, help: "변별력 vs 운영 부담" },
  { id: "eval_frequency",      group: "평가",     label: "평가 사이클 빈도",         unit: "회/년",  min: 1,  max: 4,  step: 1,   default: 2,  help: "1=연 / 2=반기 / 4=분기" },
  { id: "grade_levels",        group: "직급",     label: "직급 단계 수",             unit: "단계",   min: 3,  max: 7,  step: 1,   default: 6,  help: "단계 적을수록 평탄" },
  { id: "job_clarity",         group: "직무",     label: "직무 명세 명확도",         unit: "/100",   min: 30, max: 100,step: 10,  default: 60, help: "역할·책임 명문화 정도" },
  { id: "alignment_workshops", group: "조직문화", label: "정렬 워크숍 빈도",         unit: "회/년",  min: 0,  max: 12, step: 1,   default: 2,  help: "타운홀·부서별 액션 워크숍" },
  { id: "psych_safety",        group: "조직문화", label: "심리적 안전",              unit: "/100",   min: 30, max: 100,step: 10,  default: 55, help: "피드백·실패 용인 수준" },
  { id: "leader_coaching",     group: "리더십",   label: "팀장 코칭 빈도",           unit: "회/분기",min: 0,  max: 6,  step: 1,   default: 1,  help: "1:1 코칭 세션 횟수" },
];

const DRIVER_GROUPS: { name: DriverGroup; icon: LucideIcon }[] = [
  { name: "보상",     icon: Coins },
  { name: "평가",     icon: BarChart3 },
  { name: "직급",     icon: Layers },
  { name: "직무",     icon: FileSearch },
  { name: "조직문화", icon: Users2 },
  { name: "리더십",   icon: MessageCircle },
];

/* ═════════════════ Outcomes ═════════════════ */

type OutcomeGroup = "Retention" | "Hiring" | "성과·생산성" | "몰입·문화" | "비용";
type Outcome = {
  id: string; group: OutcomeGroup; label: string; unit: string;
  base: number; range: number; higherIsBetter: boolean; decimals?: number;
  weights: Record<string, number>;
};

const OUTCOMES: Outcome[] = [
  { id: "retention_1y", group: "Retention", label: "1년 직원 retention", unit: "%", base: 86, range: 8, higherIsBetter: true, decimals: 1,
    weights: { payband_uplift: 0.35, perf_differential: 0.10, eval_frequency: -0.05, grade_levels: -0.05, job_clarity: 0.15, alignment_workshops: 0.15, psych_safety: 0.25, leader_coaching: 0.20 } },
  { id: "key_talent_retention", group: "Retention", label: "핵심인재 유지율", unit: "%", base: 78, range: 15, higherIsBetter: true, decimals: 1,
    weights: { payband_uplift: 0.15, perf_differential: 0.30, grade_top_ratio: 0.15, eval_frequency: 0.05, job_clarity: 0.10, psych_safety: 0.25, leader_coaching: 0.25 } },
  { id: "hire_success", group: "Hiring", label: "신규 채용 성공률", unit: "%", base: 68, range: 22, higherIsBetter: true, decimals: 0,
    weights: { payband_uplift: 0.30, perf_differential: 0.05, job_clarity: 0.30, psych_safety: 0.20, leader_coaching: 0.10, alignment_workshops: 0.05 } },
  { id: "hire_days", group: "Hiring", label: "평균 채용 소요일", unit: "일", base: 58, range: 22, higherIsBetter: false, decimals: 0,
    weights: { payband_uplift: -0.20, job_clarity: -0.30, psych_safety: -0.10, alignment_workshops: -0.05, leader_coaching: -0.05 } },
  { id: "productivity", group: "성과·생산성", label: "직원 생산성 지수", unit: "", base: 100, range: 28, higherIsBetter: true, decimals: 0,
    weights: { perf_differential: 0.15, grade_top_ratio: 0.05, eval_frequency: 0.10, grade_levels: -0.15, job_clarity: 0.25, psych_safety: 0.20, leader_coaching: 0.25 } },
  { id: "decision_speed", group: "성과·생산성", label: "의사결정 속도", unit: "", base: 100, range: 35, higherIsBetter: true, decimals: 0,
    weights: { grade_levels: -0.50, job_clarity: 0.20, psych_safety: 0.15, alignment_workshops: 0.10, leader_coaching: 0.10 } },
  { id: "goal_achievement", group: "성과·생산성", label: "목표 달성률 (OKR)", unit: "%", base: 72, range: 18, higherIsBetter: true, decimals: 0,
    weights: { grade_top_ratio: 0.05, eval_frequency: 0.20, perf_differential: 0.10, job_clarity: 0.20, alignment_workshops: 0.15, psych_safety: 0.10, leader_coaching: 0.25 } },
  { id: "engagement", group: "몰입·문화", label: "직원 몰입도 (eNPS)", unit: "", base: 18, range: 35, higherIsBetter: true, decimals: 0,
    weights: { payband_uplift: 0.15, perf_differential: -0.05, eval_frequency: -0.10, grade_levels: -0.10, job_clarity: 0.15, alignment_workshops: 0.20, psych_safety: 0.30, leader_coaching: 0.25 } },
  { id: "change_readiness", group: "몰입·문화", label: "변화 수용성", unit: "/100", base: 52, range: 28, higherIsBetter: true, decimals: 0,
    weights: { alignment_workshops: 0.30, psych_safety: 0.35, leader_coaching: 0.20, job_clarity: 0.10, eval_frequency: 0.05 } },
  { id: "hr_burden", group: "비용", label: "HR 운영 부담", unit: "시간/월", base: 70, range: 45, higherIsBetter: false, decimals: 0,
    weights: { eval_frequency: 0.40, alignment_workshops: 0.25, leader_coaching: 0.15, grade_top_ratio: 0.05, job_clarity: -0.10 } },
];

const OUTCOME_GROUPS: OutcomeGroup[] = ["Retention", "Hiring", "성과·생산성", "몰입·문화", "비용"];

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
    const span = driver.max - driver.min;
    const normalized = span === 0 ? 0 : (values[driverId] - driver.default) / span;
    weightedSum += normalized * weight;
  }
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

  const isBaseline = useMemo(() => DRIVERS.every((d) => values[d.id] === d.default), [values]);
  const changedCount = useMemo(() => DRIVERS.filter((d) => values[d.id] !== d.default).length, [values]);

  return (
    <>
      <StepShell step={step}>
        <p
          className="body text-ink-600 max-w-[720px]"
          style={{ display: "block", margin: 0, marginBottom: 24, padding: 0, position: "static" }}
        >
          Master 자문의 핵심 도구. 6개 영역 변수를 조정하면 10개 지표가 어떻게 함께 움직이는지 추정합니다.
        </p>

        {/* Status row */}
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isBaseline ? "bg-ink-500" : "bg-accent-500 animate-pulse-soft shadow-[0_0_8px_rgba(14,165,233,0.8)]",
            )} />
            <span className={isBaseline ? "text-ink-500" : "text-accent-300"}>
              {isBaseline ? "BASELINE — 변수를 조정해보세요" : `SIMULATING — ${changedCount}개 변수 조정 중`}
            </span>
          </div>
          <button
            type="button" onClick={reset} disabled={isBaseline}
            className="btn-ghost text-[11px] disabled:opacity-30"
          >
            <RotateCcw size={11} className="mr-1.5" />
            기본값
          </button>
        </div>

        {/* Two big panels side by side */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* ─── LEFT PANEL — All drivers, no tabs ─── */}
          <div className="card !p-0 overflow-hidden">
            <PanelHeader
              icon={Sliders}
              eyebrow="DRIVERS"
              title="조정 가능한 변수"
              subtitle={`${DRIVERS.length}개 항목 · 6개 영역`}
            />

            <div className="p-5 sm:p-6 space-y-6">
              {DRIVER_GROUPS.map((g, gi) => {
                const groupDrivers = DRIVERS.filter((d) => d.group === g.name);
                const groupChanged = groupDrivers.filter((d) => values[d.id] !== d.default).length;
                return (
                  <div key={g.name}>
                    {gi > 0 && <div className="border-t border-white/[0.05] -mt-3 mb-6" />}
                    <GroupLabel name={g.name} icon={g.icon} count={groupDrivers.length} changed={groupChanged} />
                    <div className="space-y-5 mt-3">
                      {groupDrivers.map((d) => (
                        <DriverRow key={d.id} driver={d} value={values[d.id]} onChange={setOne} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── RIGHT PANEL — Outcomes ─── */}
          <div className="card !p-0 overflow-hidden lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <PanelHeader
              icon={Sparkles}
              eyebrow="OUTCOMES"
              title="기대 효과 추정"
              subtitle={`${OUTCOMES.length}개 지표 · 5개 영역`}
              accent
            />

            <div className="p-5 sm:p-6 space-y-5">
              {OUTCOME_GROUPS.map((g) => {
                const groupOutcomes = OUTCOMES.filter((o) => o.group === g);
                return (
                  <div key={g}>
                    <div
                      className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-3 px-1"
                      style={{ display: "block", margin: 0, marginBottom: 12, padding: "0 4px", position: "static" }}
                    >
                      {g}
                    </div>
                    <div className="space-y-2.5">
                      {groupOutcomes.map((o) => <OutcomeRow key={o.id} outcome={o} values={values} />)}
                    </div>
                  </div>
                );
              })}

              <p
                className="text-[11px] text-ink-500 leading-relaxed pt-2 px-1 border-t border-white/[0.05]"
                style={{ display: "block", margin: 0, paddingTop: 12, marginTop: 12, position: "static" }}
              >
                ⓘ HCG 평균 사례 기반 선형 모델. 회사 데이터로 보정 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </StepShell>

      <TourNav current={step} nextLabel="협업 방식 보기" />
    </>
  );
}

/* ═════════════════ Panel header ═════════════════ */

function PanelHeader({ icon: Icon, eyebrow, title, subtitle, accent }: {
  icon: LucideIcon; eyebrow: string; title: string; subtitle: string; accent?: boolean;
}) {
  return (
    <div className={cn(
      "px-5 sm:px-6 py-4 border-b",
      accent ? "border-accent-500/20 bg-accent-500/[0.04]" : "border-white/[0.06] bg-white/[0.02]",
    )}>
      <div
        className="flex items-center gap-3"
        style={{ display: "flex", margin: 0, padding: 0, position: "static" }}
      >
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
          accent
            ? "bg-accent-500 text-white shadow-[0_4px_16px_-4px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]"
            : "bg-white/[0.05] border border-white/[0.08] text-ink-700",
        )}>
          <Icon size={16} />
        </div>
        <div style={{ display: "block", margin: 0, padding: 0, position: "static" }}>
          <div
            className={cn(
              "text-[10px] font-mono font-bold tracking-[0.22em] uppercase",
              accent ? "text-accent-400" : "text-ink-500",
            )}
            style={{ display: "block", margin: 0, padding: 0, position: "static" }}
          >
            {eyebrow}
          </div>
          <div
            className="text-[16px] font-bold text-ink-900 leading-tight"
            style={{ display: "block", margin: 0, marginTop: 1, padding: 0, position: "static" }}
          >
            {title}
          </div>
        </div>
        <span
          className="ml-auto text-[11px] font-mono text-ink-500 tabular-nums"
          style={{ display: "inline-block", margin: 0, padding: 0, position: "static" }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}

/* ═════════════════ Group label inside driver panel ═════════════════ */

function GroupLabel({ name, icon: Icon, count, changed }: { name: DriverGroup; icon: LucideIcon; count: number; changed: number }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{ display: "flex", margin: 0, padding: 0, position: "static" }}
    >
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-accent-500/15 border border-accent-500/30 text-accent-400">
        <Icon size={11} />
      </div>
      <span className="text-[12px] font-bold text-ink-800">{name}</span>
      <span className="text-[10px] font-mono text-ink-500">·</span>
      <span className="text-[10px] font-mono text-ink-500">{count}개 변수</span>
      {changed > 0 && (
        <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-400 text-[9px] font-mono font-bold">
          <span className="w-1 h-1 rounded-full bg-accent-500" />
          {changed} 조정됨
        </span>
      )}
    </div>
  );
}

/* ═════════════════ Driver row ═════════════════ */

function DriverRow({ driver, value, onChange }: {
  driver: Driver; value: number; onChange: (id: string, v: number) => void;
}) {
  const isChanged = value !== driver.default;
  return (
    <div className="pl-8">
      <div
        className="flex items-baseline justify-between gap-3 mb-2"
        style={{ display: "flex", margin: 0, marginBottom: 8, padding: 0, position: "static" }}
      >
        <span
          className="text-[13px] font-medium text-ink-800 leading-tight"
          style={{ display: "block", margin: 0, padding: 0, position: "static" }}
        >
          {driver.label}
        </span>
        <span className="flex items-baseline gap-1 whitespace-nowrap">
          <span className={cn(
            "text-[20px] font-bold tabular-nums leading-none",
            isChanged ? "text-accent-400" : "text-ink-700",
          )}>
            {value}
          </span>
          <span className="text-ink-500 text-[10px] font-medium">{driver.unit}</span>
        </span>
      </div>

      <Slider
        min={driver.min} max={driver.max} step={driver.step}
        value={value} defaultMarker={driver.default}
        onChange={(v) => onChange(driver.id, v)}
      />

      {driver.help && (
        <div className="text-[10px] text-ink-500 mt-2 font-mono">{driver.help}</div>
      )}
    </div>
  );
}

/* ═════════════════ Outcome row ═════════════════ */

function OutcomeRow({ outcome, values }: { outcome: Outcome; values: Record<string, number> }) {
  const current = computeOutcome(outcome, values);
  const diff = current - outcome.base;
  const isZero = Math.abs(diff) < 0.01;
  const isGood = (diff > 0 && outcome.higherIsBetter) || (diff < 0 && !outcome.higherIsBetter);
  const decimals = outcome.decimals ?? 1;
  const TrendIcon = isZero ? Minus : (diff > 0 ? TrendingUp : TrendingDown);

  const minVal = outcome.base - outcome.range;
  const maxVal = outcome.base + outcome.range;
  const basePct = ((outcome.base - minVal) / (maxVal - minVal)) * 100;
  const currentPct = Math.max(0, Math.min(100, ((current - minVal) / (maxVal - minVal)) * 100));

  return (
    <div className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
      <div
        className="flex items-baseline justify-between gap-2 mb-2"
        style={{ display: "flex", margin: 0, marginBottom: 8, padding: 0, position: "static" }}
      >
        <span
          className="text-[12px] text-ink-700 leading-tight flex-1"
          style={{ display: "block", margin: 0, padding: 0, position: "static" }}
        >
          {outcome.label}
        </span>
        <span className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-[20px] font-bold text-ink-900 tabular-nums leading-none">
            {current.toFixed(decimals)}
            {outcome.unit && <span className="text-[10px] text-ink-500 font-medium ml-0.5">{outcome.unit}</span>}
          </span>
          <span className={cn(
            "inline-flex items-center gap-0.5 text-[10px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded",
            isZero ? "text-ink-500 bg-white/[0.04]"
                   : isGood ? "text-success-500 bg-success-500/15"
                            : "text-warning-500 bg-warning-500/15",
          )}>
            <TrendIcon size={9} />
            {isZero ? "—" : `${diff > 0 ? "+" : ""}${diff.toFixed(decimals)}`}
          </span>
        </span>
      </div>

      <div className="relative h-1.5 rounded-full bg-white/[0.04]">
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-2.5 bg-ink-500/60" style={{ left: `${basePct}%` }} />
        {!isZero && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-1 rounded-full",
              isGood ? "bg-success-500/70" : "bg-warning-500/70",
            )}
            style={{ left: `${Math.min(basePct, currentPct)}%`, width: `${Math.abs(currentPct - basePct)}%` }}
          />
        )}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border",
            isZero ? "bg-ink-400 border-ink-300" :
            isGood ? "bg-success-500 border-success-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                   : "bg-warning-500 border-warning-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
          )}
          style={{ left: `calc(${currentPct}% - 5px)` }}
        />
      </div>
    </div>
  );
}

/* ═════════════════ Slider ═════════════════ */

function Slider({ min, max, step, value, defaultMarker, onChange }: {
  min: number; max: number; step: number; value: number; defaultMarker: number; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const defaultPct = ((defaultMarker - min) / (max - min)) * 100;
  return (
    <div className="relative h-6 flex items-center">
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/[0.06] border border-white/[0.04]" />
      <div
        className="absolute h-1.5 rounded-full bg-gradient-to-r from-accent-600 to-accent-400 shadow-[0_0_10px_-1px_rgba(14,165,233,0.6)]"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute h-3.5 w-px bg-ink-500/60 top-1/2 -translate-y-1/2"
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