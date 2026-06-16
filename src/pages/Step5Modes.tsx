import { motion } from "framer-motion";
import {
  Wrench, MessageCircle, BookOpen, Sparkles, ArrowRight, Users2, BarChart3,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";

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
  {
    id: "workshop",
    icon: Users2,
    badge: "MODE 05",
    title: "정렬 워크숍",
    tagline: "직원과 함께 만드는 변화",
    description:
      "제도가 잘 굴러가려면 결국 직원이 받아들여야 합니다. 새 제도 도입, 조직문화 정렬, 팀장 정렬 — 단순 통보가 아니라 워크숍으로 직접 인볼브합니다.",
    examples: [
      "전사 타운홀 · 신제도 설명회 진행",
      "팀장 정렬 워크숍 (분기 1회)",
      "조직문화 진단 후 액션 워크숍",
      "직원 참여 세션 (페르소나, 가치 정렬)",
      "1:1 면담 가이드 코칭",
    ],
  },
  {
    id: "review",
    icon: BarChart3,
    badge: "MODE 06",
    title: "분기 HR 진단",
    tagline: "숫자로 보는 우리 회사",
    description:
      "분기마다 이탈률, eNPS, Compa-Ratio, 평가 분포 등 회사 HR 지표를 점검합니다. 정성 진단과 결합해 다음 분기 우선순위를 함께 정합니다. talenx 도입 회사라면 데이터가 풍부하고, 아니어도 컨설턴트가 같이 집계해 드려요.",
    examples: [
      "분기 HR Health Check 리포트 (Excel · Notion)",
      "이탈률 · eNPS · Compa-Ratio 분석",
      "조직 진단 (Span of Control · Layer 점검)",
      "경영진 대상 분기 리뷰 미팅",
    ],
  },
];

export default function Step5Modes() {
  const step = getStepBySlug("5-modes")!;

  return (
    <>
      <StepShell step={step}>
        <p className="body text-ink-600 mb-8">
          Master 자문은 정해진 일정대로 가는 풀패키지 컨설팅이 아닙니다.
          회사 상황에 따라 <strong className="text-ink-900">아래 6가지 모드를 elastic하게</strong> 호출해서 씁니다.
          어떤 달은 페어 디자인 위주, 어떤 달은 분기 진단 위주 — 자유롭게.
        </p>

        {/* 6 modes grid — all expanded by default */}
        <div className="grid md:grid-cols-2 gap-4">
          {MODES.map((m, i) => (
            <ModeCard key={m.id} mode={m} index={i} />
          ))}
        </div>

        <p className="caption mt-8 text-center">
          6가지 모드를 한 달에 모두 쓰는 회사도, 한두 가지만 쓰는 회사도 있습니다. retainer 안에서 자유롭게.
        </p>
      </StepShell>

      <TourNav current={step} nextLabel="Master 플랜 보기" />
    </>
  );
}

function ModeCard({ mode, index }: { mode: Mode; index: number }) {
  const Icon = mode.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div className="card transition-all relative overflow-hidden hover:bg-white/[0.04] hover:border-white/15 h-full">
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.06] text-accent-400 border border-white/10">
            <Icon size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase mb-1">
              {mode.badge}
            </div>
            <h3 className="text-[20px] font-bold text-ink-900 leading-tight">{mode.title}</h3>
            <p className="text-[13px] text-accent-400 font-medium mt-0.5">{mode.tagline}</p>
          </div>
        </div>

        <p className="relative body-sm text-ink-700 mt-4 leading-relaxed">
          {mode.description}
        </p>

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
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-accent-400 hover:text-accent-300 mt-4 transition-colors"
            >
              <Sparkles size={12} />
              {mode.bridge.label}
              <ArrowRight size={11} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}