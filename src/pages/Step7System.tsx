import { motion } from "framer-motion";
import {
  Sparkles, Building2, Layers, Cloud, Bot,
  CheckCircle2, ArrowRight, Shield, TrendingUp, ExternalLink,
  Database, GitBranch, type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ═════════════════ Data ═════════════════ */

type Solution = {
  id: string;
  name: string;
  ko: string;
  type: string;
  target: string;
  tagline: string;
  features: string[];
  icon: LucideIcon;
  featured?: boolean;
  url: string;
};

const SOLUTIONS: Solution[] = [
  {
    id: "talenx",
    name: "talenx",
    ko: "탈렌엑스",
    type: "올인원 AI HR SaaS",
    target: "모든 규모 기업",
    tagline: "성과·평가·근태·급여·인사 전 영역을 하나의 플랫폼에서",
    features: [
      "OKR · 평가 · Check-in · 피드백",
      "Pay Band · 보상 시뮬레이션",
      "근태 · 급여 · 인사정보 통합",
      "HR Analytics · 대시보드",
    ],
    icon: Cloud,
    featured: true,
    url: "https://e-hcg.com/solutions/talenx",
  },
  {
    id: "elizax",
    name: "elizax",
    ko: "일라이자엑스",
    type: "HR 특화 AI Agent",
    target: "AI로 HR 의사결정 고도화",
    tagline: "감과 경험을 넘어, AI 기반 의사결정의 지능화",
    features: [
      "HR 도메인 지식 결합 AI",
      "인재 관리 · 판단 품질 향상",
      "AI 피드백 감정 분석 (특허)",
      "범용 AI가 아닌 HR 특화",
    ],
    icon: Bot,
    url: "https://e-hcg.com/solutions/elizax",
  },
  {
    id: "hunel",
    name: "hunel",
    ko: "휴넬",
    type: "구축형 AI HR 솔루션",
    target: "대기업 · 그룹사",
    tagline: "복잡한 인사제도를 정교하게 구현",
    features: [
      "대기업 · 글로벌 조직 대응",
      "Global 인사 패키지",
      "그룹사 다법인 통합 관리",
      "맞춤 커스터마이징",
    ],
    icon: Building2,
    url: "https://e-hcg.com/solutions/hunel",
  },
  {
    id: "jade",
    name: "JaDE",
    ko: "제이드",
    type: "구축형 AI HR 솔루션",
    target: "중견 · 중소기업",
    tagline: "고유 인사제도 구현에 최적화된 세팅 기반",
    features: [
      "직무 · 평가 · 보상 · 승진",
      "조직 · 급여 · 근태 · 복리후생",
      "세팅 기반 빠른 도입",
      "운영 효율 극대화",
    ],
    icon: Layers,
    url: "https://e-hcg.com/solutions/jade",
  },
];

type SynergyItem = { from: string; to: string; module: string };
const SYNERGY: SynergyItem[] = [
  { module: "직급",   from: "자문에서 설계한 직급체계 (G1~G4 통합)", to: "talenx에 직급 마스터로 자동 셋업" },
  { module: "평가",   from: "자문에서 만든 OKR · Calibration 프로세스", to: "talenx에서 분기 사이클로 자동 실행" },
  { module: "보상",   from: "자문에서 정한 Pay Band · 차등 구조",       to: "talenx에서 인상률 시뮬레이션 + 산정" },
  { module: "리더십", from: "자문에서 진단한 리더십 Snapshot",          to: "talenx에서 코칭 사이클 + Successor Pool 관리" },
];

type Stat = { value: string; label: string };
const STATS: Stat[] = [
  { value: "80%",    label: "글로벌 헬스케어 A사 — 시스템 일원화 비용 절감" },
  { value: "57%",    label: "에스디바이오센서 — 평가 운영 기간 단축" },
  { value: "95%",    label: "대상 — 성과 면담 이행률 달성" },
  { value: "1,100명", label: "SK바이오사이언스 — 성과관리 혁신" },
];

/* ═════════════════ Page ═════════════════ */

export default function Step7System() {
  const step = getStepBySlug("7-system")!;

  return (
    <>
      <StepShell step={step}>
        <p
          className="body text-ink-600 max-w-[760px]"
          style={{ display: "block", margin: 0, marginBottom: 24, padding: 0, position: "static" }}
        >
          제도를 같이 짠 사람이 시스템도 만들어요. HCG는{" "}
          <strong className="text-accent-400">국내 1위 AI HR Tech 리더</strong>로,{" "}
          KOSPI 200 상장사 30% 이상이 선택한 HR 솔루션을 보유하고 있습니다. 자문에서 설계한 제도를 같은 회사의 시스템으로 운영하면 호환성이 다릅니다.
        </p>

        {/* End-to-End flow */}
        <EndToEndFlow />

        {/* Solutions */}
        <SectionHeader
          eyebrow="SOLUTIONS"
          title="HCG의 4개 AI HR 솔루션"
          subtitle="회사 규모와 단계에 맞춰 골라 쓸 수 있는 통합 라인업"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <SolutionCard solution={s} />
            </motion.div>
          ))}
        </div>

        {/* Synergy — the core message */}
        <SectionHeader
          eyebrow="SYNERGY"
          title="자문 + SaaS, 같은 회사라서 가능한 호환성"
          subtitle="다른 회사 컨설팅 + 다른 회사 시스템 = 통역 비용 · 도입 지연 · 산출물 재작업"
        />
        <SynergyPanel />

        {/* Customer success */}
        <SectionHeader
          eyebrow="PROVEN"
          title="검증된 성과"
          subtitle="국내 주요 기업들이 HCG의 솔루션으로 만든 변화"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {STATS.map((s, i) => <StatCard key={i} stat={s} />)}
        </div>

        {/* Trust indicators */}
        <TrustBar />

        {/* CTA */}
        <CTABanner />
      </StepShell>

      <TourNav current={step} disableNext={true} nextLabel="투어 완료" />
    </>
  );
}

/* ═════════════════ Section header ═════════════════ */

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <div
        className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase"
        style={{ display: "block", margin: 0, marginBottom: 4, padding: 0, position: "static", lineHeight: 1 }}
      >
        {eyebrow}
      </div>
      <div
        className="text-[20px] font-bold text-ink-900"
        style={{ display: "block", margin: 0, marginBottom: 4, padding: 0, position: "static", lineHeight: 1.2 }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          className="text-[12px] text-ink-500"
          style={{ display: "block", margin: 0, padding: 0, position: "static" }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

/* ═════════════════ End-to-End flow ═════════════════ */

function EndToEndFlow() {
  const phases = [
    { icon: Sparkles, label: "컨설팅", sub: "제도 설계", color: "bg-white/[0.05] border-white/[0.10] text-ink-700" },
    { icon: Cloud,    label: "솔루션", sub: "AI HR 시스템", color: "bg-accent-500/15 border-accent-500/40 text-accent-300", featured: true },
    { icon: Shield,   label: "운영", sub: "유지보수 · Payroll", color: "bg-white/[0.05] border-white/[0.10] text-ink-700" },
  ];
  return (
    <div className="card !p-4 mb-10">
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={12} className="text-accent-400" />
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400"
          style={{ display: "inline-block", margin: 0, padding: 0, position: "static" }}
        >
          End-to-End 통합 서비스
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 items-stretch">
        {phases.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="relative">
              <div className={cn(
                "p-3 rounded-lg border h-full flex flex-col items-center justify-center text-center gap-1.5",
                p.color,
                p.featured && "shadow-[0_0_24px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]",
              )}>
                <Icon size={20} />
                <div className="text-[13px] font-bold">{p.label}</div>
                <div className="text-[10px] font-mono opacity-70">{p.sub}</div>
              </div>
              {i < phases.length - 1 && (
                <ArrowRight size={14} className="absolute top-1/2 -right-2.5 -translate-y-1/2 text-ink-500 hidden sm:block z-10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═════════════════ Solution card ═════════════════ */

function SolutionCard({ solution }: { solution: Solution }) {
  const Icon = solution.icon;
  return (
    <div className={cn(
      "card !p-4 h-full flex flex-col relative overflow-hidden transition-all hover:-translate-y-0.5",
      solution.featured
        ? "border-accent-500/40 bg-accent-500/[0.06] shadow-[0_0_28px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
        : "hover:border-accent-500/30",
    )}>
      {solution.featured && (
        <>
          <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-[0_0_10px_-2px_rgba(14,165,233,0.7)]">
            <Sparkles size={8} /> 추천
          </span>
        </>
      )}

      <div className="flex items-center gap-2 mb-2.5">
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
          solution.featured
            ? "bg-accent-500 text-white shadow-[0_4px_12px_-4px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]"
            : "bg-white/[0.06] border border-white/[0.08] text-accent-400",
        )}>
          <Icon size={16} />
        </div>
        <div style={{ display: "block", lineHeight: 1 }}>
          <div
            className="text-[15px] font-bold text-ink-900"
            style={{ display: "block", margin: 0, padding: 0, lineHeight: 1 }}
          >
            {solution.name}
          </div>
          <div
            className="text-[10px] font-mono text-ink-500"
            style={{ display: "block", margin: 0, marginTop: 3, padding: 0, lineHeight: 1 }}
          >
            {solution.ko}
          </div>
        </div>
      </div>

      <div
        className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-400 mb-1"
        style={{ display: "block", margin: 0, marginBottom: 4, padding: 0, position: "static" }}
      >
        {solution.type}
      </div>
      <div
        className="text-[11px] text-ink-600 mb-2"
        style={{ display: "block", margin: 0, marginBottom: 8, padding: 0, position: "static" }}
      >
        {solution.target}
      </div>
      <div
        className="text-[12px] text-ink-700 leading-snug mb-3"
        style={{ display: "block", margin: 0, marginBottom: 12, padding: 0, position: "static" }}
      >
        {solution.tagline}
      </div>

      <ul className="space-y-1 flex-1">
        {solution.features.map((f, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-ink-600 leading-snug">
            <CheckCircle2 size={10} className={cn("mt-0.5 flex-shrink-0", solution.featured ? "text-accent-400" : "text-ink-500")} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={solution.url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px] font-mono text-accent-400 hover:text-accent-300 mt-3 pt-3 border-t border-white/[0.06]"
      >
        자세히 알아보기 <ExternalLink size={10} />
      </a>
    </div>
  );
}

/* ═════════════════ Synergy panel — the core message ═════════════════ */

function SynergyPanel() {
  return (
    <div className="card !p-0 overflow-hidden mb-10">
      {/* Header band */}
      <div className="px-4 py-3 border-b border-white/[0.08] bg-gradient-to-b from-accent-500/[0.08] to-transparent flex items-center gap-2.5">
        <Database size={14} className="text-accent-400" />
        <span
          className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400"
          style={{ display: "inline-block", margin: 0, padding: 0, position: "static" }}
        >
          자문 산출물 → 시스템 자동 연동
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-2 items-center mb-1">
          <div
            className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 px-1"
            style={{ display: "block", margin: 0, padding: "0 4px", position: "static" }}
          >
            자문에서 설계
          </div>
          <div className="hidden lg:block w-9" />
          <div
            className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400 px-1"
            style={{ display: "block", margin: 0, padding: "0 4px", position: "static" }}
          >
            talenx에서 운영
          </div>
        </div>

        <div className="space-y-2">
          {SYNERGY.map((s, i) => <SynergyRow key={i} item={s} />)}
        </div>

        <div className="mt-5 p-3 rounded-lg bg-accent-500/[0.06] border border-accent-500/20 flex items-start gap-2.5">
          <Sparkles size={14} className="text-accent-400 mt-0.5 flex-shrink-0" />
          <p
            className="text-[12px] text-ink-700 leading-relaxed"
            style={{ display: "block", margin: 0, padding: 0, position: "static" }}
          >
            <strong className="text-accent-300">디자인한 사람이 시스템도 만들어요.</strong>{" "}
            다른 회사 컨설팅 + 다른 회사 시스템 조합은 산출물 재작업·통역 비용·도입 지연이 늘 발생합니다. HCG는 자문 워크숍 결과가 talenx 셋업으로, 다시 운영·유지보수로 매끄럽게 이어집니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function SynergyRow({ item }: { item: SynergyItem }) {
  return (
    <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-2 items-center p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05]">
      <div className="flex items-start gap-2">
        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/[0.05] text-ink-600 border border-white/[0.06] uppercase tracking-wider flex-shrink-0 mt-0.5">
          {item.module}
        </span>
        <span className="text-[12px] text-ink-700 leading-snug">{item.from}</span>
      </div>
      <div className="flex items-center justify-center px-2">
        <ArrowRight size={14} className="text-accent-400 hidden lg:block" />
        <ArrowRight size={12} className="text-accent-400 rotate-90 lg:hidden" />
      </div>
      <div className="text-[12px] text-accent-300 leading-snug font-medium">{item.to}</div>
    </div>
  );
}

/* ═════════════════ Stats ═════════════════ */

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="card !p-3 text-center">
      <div
        className="text-[24px] font-bold text-accent-400 tabular-nums leading-none mb-1.5"
        style={{ display: "block", margin: 0, marginBottom: 6, padding: 0, position: "static" }}
      >
        {stat.value}
      </div>
      <div
        className="text-[10px] text-ink-600 leading-snug"
        style={{ display: "block", margin: 0, padding: 0, position: "static" }}
      >
        {stat.label}
      </div>
    </div>
  );
}

/* ═════════════════ Trust bar ═════════════════ */

function TrustBar() {
  const items = [
    { icon: TrendingUp, label: "KOSPI 200 상장사 30% 이상" },
    { icon: Shield, label: "ISO/IEC 27001:2022 · ISMS 인증" },
    { icon: Bot, label: "AI 피드백 감정 분석 특허 (10-2954894)" },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-2 mb-8">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <Icon size={12} className="text-accent-400 flex-shrink-0" />
            <span className="text-[11px] text-ink-600 leading-snug">{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═════════════════ CTA ═════════════════ */

function CTABanner() {
  return (
    <div className="card !p-6 text-center relative overflow-hidden bg-gradient-to-b from-accent-500/[0.08] to-transparent border-accent-500/30">
      <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />

      <div
        className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400 mb-2"
        style={{ display: "block", margin: 0, marginBottom: 8, padding: 0, position: "static" }}
      >
        투어를 마치며
      </div>
      <div
        className="text-[22px] font-bold text-ink-900 mb-2"
        style={{ display: "block", margin: 0, marginBottom: 8, padding: 0, position: "static", lineHeight: 1.3 }}
      >
        제도 설계부터 시스템 운영까지, HCG가 함께합니다
      </div>
      <p
        className="text-[13px] text-ink-600 max-w-[520px] mx-auto mb-5"
        style={{ display: "block", margin: "0 auto 20px", padding: 0, position: "static" }}
      >
        Master 자문 + talenx 운영이 결합되면 컨설팅 효과가 일회성이 아니라 지속됩니다.
        궁금하신 게 있으면 언제든 문의주세요.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href="https://e-hcg.com/inquiry" target="_blank" rel="noopener noreferrer"
          className="btn-primary"
        >
          <Sparkles size={14} className="mr-2" />
          도입 문의하기
          <ExternalLink size={12} className="ml-2 opacity-70" />
        </a>
        <a
          href="https://e-hcg.com/solutions" target="_blank" rel="noopener noreferrer"
          className="btn-secondary"
        >
          솔루션 전체 보기
          <ExternalLink size={12} className="ml-2 opacity-70" />
        </a>
      </div>
    </div>
  );
}