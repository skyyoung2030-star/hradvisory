import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, BarChart3, Layers,
  TrendingUp, TrendingDown, Minus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ─────────────── Scenarios ───────────────
   Each scenario defines:
   - a slider with a min, max, default, suffix
   - a model function that turns the slider value into 3 metric outcomes
   The model is intentionally simple (linear interpolation) — labelled "추정치"
   so the user understands these are illustrative, not promises. */

type Metric = {
  label: string;
  unit: string;
  /** baseline value (slider at min) */
  base: number;
  /** delta added per unit of slider movement (so result = base + delta * (val - min)) */
  delta: number;
  /** bigger is better? false flips the up/down arrow + colour */
  higherIsBetter: boolean;
  format?: (n: number) => string;
};

type Scenario = {
  id: string;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  slider: { label: string; min: number; max: number; default: number; suffix: string; help: string };
  metrics: Metric[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "payband",
    icon: DollarSign,
    label: "Pay Band 조정",
    title: "Pay Band 하단 인원에게 추가 인상",
    description: "Compa-Ratio가 낮은 인원에게 시장 보상 격차를 메우면 어떻게 될까?",
    slider: {
      label: "추가 인상률",
      min: 0, max: 10, default: 5, suffix: "%",
      help: "Band 하단 인원 한정 추가 인상. 다음 1년치 재원 시뮬레이션.",
    },
    metrics: [
      { label: "시장 경쟁력 지수", unit: "pts", base: 65, delta: 1.7, higherIsBetter: true,
        format: (n) => n.toFixed(0) },
      { label: "1년 retention 추정", unit: "%",   base: 87, delta: 0.4, higherIsBetter: true,
        format: (n) => n.toFixed(1) },
      { label: "추가 인상 재원",       unit: "억원", base: 0,  delta: 0.23, higherIsBetter: false,
        format: (n) => n.toFixed(1) },
    ],
  },
  {
    id: "evalgrade",
    icon: BarChart3,
    label: "평가 등급 분포",
    title: "S·A 등급 비율 조정",
    description: "상위 등급 비율을 바꾸면 변별력과 운영 부담이 어떻게 변할까?",
    slider: {
      label: "S/A 합산 비율",
      min: 15, max: 35, default: 20, suffix: "%",
      help: "S+A를 합한 상위 비율. 나머지는 B/C/D로 자동 분배.",
    },
    metrics: [
      { label: "변별력 점수",        unit: "/5",   base: 3.0,  delta: 0.06, higherIsBetter: true,
        format: (n) => n.toFixed(2) },
      { label: "핵심인재 retention", unit: "%",    base: 82,   delta: 0.55, higherIsBetter: true,
        format: (n) => n.toFixed(1) },
      { label: "Calibration 시간",   unit: "시간", base: 14,   delta: 0.55, higherIsBetter: false,
        format: (n) => n.toFixed(0) },
    ],
  },
  {
    id: "joblevel",
    icon: Layers,
    label: "직급 단계",
    title: "직급 단계 수 통합",
    description: "6단계에서 단계를 줄이면 의사결정 속도와 승진 적체가 어떻게 변할까?",
    slider: {
      label: "직급 단계 수",
      min: 3, max: 7, default: 6, suffix: "단계",
      help: "단계가 줄어들수록 평탄해짐. 통합 시 호칭 동요는 별도 관리 필요.",
    },
    metrics: [
      { label: "의사결정 속도",        unit: "%",  base: 100, delta: 7,    higherIsBetter: true,
        format: (n) => `+${(n - 100).toFixed(0)}` },
      { label: "승진 적체 평균 대기",   unit: "년", base: 1.6, delta: -0.18, higherIsBetter: false,
        format: (n) => n.toFixed(1) },
      { label: "호칭 통합 영향 인원",   unit: "명", base: 0,   delta: 8,    higherIsBetter: false,
        format: (n) => `~${n.toFixed(0)}` },
    ],
  },
];

/* When slider is at value v, compute base + delta * (v - min). For 직급 단계
   the slider invert is needed (smaller = bigger effect on speed). We handle
   that by allowing negative `delta` and the higherIsBetter flag for colour. */
function computeMetric(m: Metric, slider: { min: number; max: number }, value: number): number {
  // For 직급 단계, smaller value = bigger effect — model: effect proportional to (max - value)
  // For others, value-min. We pick by checking if delta is large enough that base alone would be the "no change" case.
  // Simplification: always use (value - min) as the dial position; sliders are defined so
  // value at min = baseline. For 직급 단계 we set min=3 (most aggressive) max=7, and use (max - value) effect.
  // Easiest: if slider min == 3 (joblevel case), invert.
  const isInverted = slider.min === 3 && slider.max === 7;
  const offset = isInverted ? (slider.max - value) : (value - slider.min);
  return m.base + m.delta * offset;
}

export default function Step4Simulate() {
  const step = getStepBySlug("4-simulate")!;
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const active = SCENARIOS.find((s) => s.id === activeId)!;
  const [sliderValue, setSliderValue] = useState(active.slider.default);

  // Reset slider when scenario changes
  const onScenarioChange = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id)!;
    setActiveId(id);
    setSliderValue(s.slider.default);
  };

  const isBaseline = sliderValue === active.slider.default;

  return (
    <>
      <StepShell step={step}>
        <p className="body text-ink-600 mb-6 max-w-[720px]">
          Master 자문의 핵심 도구 중 하나. 현재 회사 지표를 기준으로,{" "}
          <strong className="text-ink-900">수치를 조정하면 어떻게 변할지</strong> 미리 추정합니다.
          실제 자문에서는 회사 데이터를 넣고 더 정교한 모델로 계산합니다.
        </p>

        {/* Scenario tabs */}
        <ScenarioTabs scenarios={SCENARIOS} activeId={activeId} onChange={onScenarioChange} />

        {/* Active scenario */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8 grid lg:grid-cols-[1fr,1.2fr] gap-5"
          >
            {/* Left: scenario title + slider */}
            <div className="card flex flex-col">
              <h2 className="h-3">{active.title}</h2>
              <p className="body-sm text-ink-600 mt-2">{active.description}</p>

              <div className="mt-7 pt-6 border-t border-white/[0.06]">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-[12px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500">
                    {active.slider.label}
                  </span>
                  <span className="text-[24px] font-bold text-accent-400 tabular-nums">
                    {sliderValue}<span className="text-ink-500 text-[14px] font-medium ml-1">{active.slider.suffix}</span>
                  </span>
                </div>

                <Slider
                  min={active.slider.min} max={active.slider.max}
                  value={sliderValue} onChange={setSliderValue}
                  defaultMarker={active.slider.default}
                />

                <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-ink-500">
                  <span>{active.slider.min}{active.slider.suffix}</span>
                  <span>{active.slider.max}{active.slider.suffix}</span>
                </div>

                <p className="caption mt-5">{active.slider.help}</p>
              </div>
            </div>

            {/* Right: metric cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400 inline-flex items-center gap-1.5">
                  <Sparkles size={11} /> 추정 결과
                </div>
                <div className="text-[10px] font-mono text-ink-500">
                  {isBaseline ? "BASELINE" : "AFTER CHANGE"}
                </div>
              </div>

              {active.metrics.map((m, i) => {
                const baseValue = computeMetric(m, active.slider, active.slider.default);
                const currentValue = computeMetric(m, active.slider, sliderValue);
                return (
                  <MetricCard
                    key={`${active.id}-${i}`}
                    metric={m}
                    baseValue={baseValue}
                    currentValue={currentValue}
                  />
                );
              })}

              <div className="px-1 pt-2">
                <p className="caption">
                  ⓘ 추정치는 HCG 평균 사례 기준 모델입니다. 실제 자문에서는 회사 데이터로 보정합니다.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </StepShell>

      <TourNav current={step} nextLabel="협업 방식 보기" />
    </>
  );
}

/* ─────────────── Scenario tabs ─────────────── */

function ScenarioTabs({ scenarios, activeId, onChange }: {
  scenarios: Scenario[]; activeId: string; onChange: (id: string) => void;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = refs.current[activeId];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeId]);

  return (
    <div className="relative inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
      {/* Sliding active pill */}
      <motion.span
        aria-hidden animate={pill}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="absolute top-1 bottom-1 bg-accent-500 rounded-lg shadow-[0_4px_16px_-4px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]"
      />
      {scenarios.map((s) => {
        const Icon = s.icon;
        const isActive = activeId === s.id;
        return (
          <button
            key={s.id}
            ref={(el) => { refs.current[s.id] = el; }}
            type="button" onClick={() => onChange(s.id)}
            className={cn(
              "relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors",
              isActive ? "text-white" : "text-ink-600 hover:text-ink-900",
            )}
          >
            <Icon size={14} />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────── Custom dark slider ─────────────── */

function Slider({ min, max, value, onChange, defaultMarker }: {
  min: number; max: number; value: number; onChange: (v: number) => void; defaultMarker: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const defaultPct = ((defaultMarker - min) / (max - min)) * 100;
  return (
    <div className="relative h-7 flex items-center">
      {/* Track */}
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/[0.06] border border-white/[0.04]" />
      {/* Filled */}
      <div
        className="absolute h-1.5 rounded-full bg-gradient-to-r from-accent-600 to-accent-400 shadow-[0_0_12px_-2px_rgba(14,165,233,0.6)]"
        style={{ width: `${pct}%` }}
      />
      {/* Default marker */}
      <div
        className="absolute h-3 w-px bg-ink-500/60 top-1/2 -translate-y-1/2"
        style={{ left: `${defaultPct}%` }}
        title="기본값"
      />
      {/* Input */}
      <input
        type="range" min={min} max={max} value={value} step={(max - min) <= 10 ? 1 : 1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
      {/* Thumb */}
      <div
        className="absolute w-5 h-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_0_4px_rgba(14,165,233,0.2)] border-2 border-accent-500 pointer-events-none"
        style={{ left: `calc(${pct}% - 10px)` }}
      />
    </div>
  );
}

/* ─────────────── Metric card ─────────────── */

function MetricCard({ metric, baseValue, currentValue }: {
  metric: Metric; baseValue: number; currentValue: number;
}) {
  const diff = currentValue - baseValue;
  const isZero = Math.abs(diff) < 0.001;
  const isPositiveDirection = (diff > 0 && metric.higherIsBetter) || (diff < 0 && !metric.higherIsBetter);

  const Icon = isZero ? Minus : (diff > 0 ? TrendingUp : TrendingDown);

  const formatFn = metric.format ?? ((n: number) => n.toFixed(1));
  const formattedCurrent = formatFn(currentValue);

  // Color: green for "good direction", red for "bad direction", neutral for zero
  const colour = isZero
    ? "text-ink-600 border-white/[0.06]"
    : isPositiveDirection
    ? "text-success-500 border-success-500/30"
    : "text-warning-500 border-warning-500/30";

  return (
    <motion.div
      layout
      animate={{ scale: isZero ? 1 : [1, 1.02, 1] }}
      transition={{ duration: 0.3 }}
      className="card !p-5 flex items-center justify-between gap-4"
    >
      <div>
        <div className="text-[12px] text-ink-600 font-medium">{metric.label}</div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[28px] font-bold text-ink-900 tabular-nums leading-none">
            {formattedCurrent}
          </span>
          <span className="text-[13px] text-ink-500 font-medium">{metric.unit}</span>
        </div>
      </div>

      <div className={cn(
        "flex flex-col items-end gap-0.5 px-3 py-2 rounded-lg border bg-white/[0.02]",
        colour,
      )}>
        <Icon size={14} />
        <span className="text-[11px] font-mono font-bold tabular-nums">
          {isZero ? "—" : `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`}
        </span>
      </div>
    </motion.div>
  );
}
