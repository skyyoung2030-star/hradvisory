import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, MessageCircle, BookOpen, Sparkles, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

type Mode = {
  id: string;
  icon: LucideIcon;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  examples: string[];
  /** Optional inline CTA — used to bridge into Step 4 from the simulation mode. */
  bridge?: { label: string; to: string };
};

const MODES: Mode[] = [
  {
    id: "design",
    icon: Wrench,
    badge: "MODE 01",
    title: "페어 디자인",
    tagline: "제도를 같이 짜요",
    description:
      "직급체계, 평가, 보상 — 처음부터 끝까지 컨설턴트가 화이트보드 옆에 있어요. 정답을 던지는 게 아니라, 회사 컨텍스트에 맞는 답을 같이 만들어갑니다.",
    examples: [
      "직급 통합 시나리오 3안 같이 그리기",
      "Pay Band 워크시트 함께 채우기",
      "평가 운영 매뉴얼 초안 코칭",
      "OKR Dictionary 같이 작성",
    ],
  },
  {
    id: "execute",
    icon: MessageCircle,
    badge: "MODE 02",
    title: "실행 도우미",
    tagline: "굴러가는 동안 fine-tune",
    description:
      "제도가 한 번에 자리잡지는 않습니다. 사이클을 돌리면서 어디가 막히는지 함께 보고, 다음 분기에 맞게 조정합니다. 핫라인은 평일 상시.",
    examples: [
      "Calibration 회의 동석 · 조율",
      "팀장 워크숍 진행 (분기 1회)",
      "1:1 면담 시범 운영 동행",
      "이슈 발생 시 핫라인 즉시 대응",
    ],
  },
  {
    id: "tools",
    icon: BookOpen,
    badge: "MODE 03",
    title: "도구 제공",
    tagline: "사이사이 필요한 자료",
    description:
      "20+개의 매뉴얼 · 템플릿 · 서베이를 라이브러리로 보유. 회사가 지금 필요한 게 뭔지에 맞춰 그때그때 꺼내 전달해 드립니다.",
    examples: [
      "운영 매뉴얼 가이드북 (PDF · Notion)",
      "Pay Band Simulator (Excel)",
      "분기 진단 서베이 도구",
      "Free 템플릿 라이브러리 즉시 사용",
    ],
  },
  {
    id: "simulate",
    icon: Sparkles,
    badge: "MODE 04",
    title: "시뮬레이션",
    tagline: "바꾸기 전에 효과 미리보기",
    description:
      '"이렇게 조정하면 어떻게 될까?" — Pay Band, 평가 분포, 직급 단계 등 주요 변수를 조정하고 retention · 변별력 · 운영 부담 같은 지표가 어떻게 변하는지 추정합니다.',
    examples: [
      "Pay Band 인상 시나리오 (회사 데이터 기반)",
      "평가 등급 분포 변경 영향 분석",
      "직급 통합 전·후 비교",
      "보상 재원 ROI 추정",
    ],
    bridge: { label: "Step 4에서 미니 시뮬레이터 보셨죠", to: "/tour/4-simulate" },
  },
];

export default function Step5Modes() {
  const step = getStepBySlug("5-modes")!;
  const [activeId, setActiveId] = useState<string | null>("design");

  return (
    <>
      <StepShell step={step}>
        <p className="body text-ink-600 mb-8 max-w-[720px]">
          Master 자문은 정해진 일정대로 가는 풀패키지 컨설팅이 아닙니다.
          회사 상황에 따라 <strong className="text-ink-900">아래 4가지 모드를 elastic하게</strong> 호출해서 씁니다.
          어떤 달은 페어 디자인 위주, 어떤 달은 실행 도우미 위주 — 자유롭게.
        </p>

        {/* 2x2 mode grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {MODES.map((m, i) => (
            <ModeCard
              key={m.id} mode={m} index={i}
              isActive={activeId === m.id}
              onSelect={() => setActiveId(activeId === m.id ? null : m.id)}
            />
          ))}
        </div>

        <p className="caption mt-8 text-center">
          4가지 모드를 한 달에 모두 쓰는 회사도, 한두 가지만 쓰는 회사도 있습니다. retainer 안에서 자유롭게.
        </p>
      </StepShell>

      <TourNav current={step} nextLabel="Master 플랜 보기" />
    </>
  );
}

function ModeCard({ mode, index, isActive, onSelect }: {
  mode: Mode; index: number; isActive: boolean; onSelect: () => void;
}) {
  const Icon = mode.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <button
        type="button" onClick={onSelect}
        className={cn(
          "w-full text-left card transition-all relative overflow-hidden",
          "active:translate-y-0",
          isActive
            ? "bg-accent-500/[0.05] border-accent-500/40 shadow-glow-accent -translate-y-0.5"
            : "hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5",
        )}
      >
        {/* Glow blob on active */}
        {isActive && (
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-accent-500/30 to-accent-700/10 blur-3xl pointer-events-none"
          />
        )}

        <div className="relative flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
            isActive
              ? "bg-accent-500 text-white shadow-[0_8px_24px_-4px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]"
              : "bg-white/[0.06] text-accent-400 border border-white/10",
          )}>
            <Icon size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase mb-1">
              {mode.badge}
            </div>
            <h3 className="text-[20px] font-bold text-ink-900 leading-tight">{mode.title}</h3>
            <p className="text-[13px] text-accent-400 font-medium mt-0.5">{mode.tagline}</p>
          </div>

          <ArrowRight
            size={16}
            className={cn(
              "flex-shrink-0 transition-all",
              isActive ? "text-accent-400 rotate-90" : "text-ink-500",
            )}
          />
        </div>

        <p className="relative body-sm text-ink-700 mt-4 leading-relaxed">
          {mode.description}
        </p>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="relative overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-white/[0.08]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-3">
                  실제 활동 예시
                </div>
                <ul className="space-y-2">
                  {mode.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 body-sm text-ink-700">
                      <span className="text-accent-400 mt-0.5">·</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>

                {mode.bridge && (
                  <Link
                    to={mode.bridge.to}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-accent-400 hover:text-accent-300 mt-4 transition-colors"
                  >
                    <Sparkles size={12} />
                    {mode.bridge.label} →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
