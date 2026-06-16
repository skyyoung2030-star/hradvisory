import { motion } from "framer-motion";
import {
  Sparkles, Cloud, Bot, CheckCircle2, ArrowRight, Shield,
  ExternalLink, Database, GitBranch, Target, BarChart3,
  Clock, Coins, Users, type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";

/* ═════════════════ Data ═════════════════ */

const TALENX_MODULES: { icon: LucideIcon; name: string; desc: string }[] = [
  { icon: Target,     name: "성과 관리",    desc: "OKR · Check-in · 상시 피드백" },
  { icon: BarChart3,  name: "평가 운영",    desc: "Calibration · 등급 분포 관리" },
  { icon: Clock,      name: "근태 관리",    desc: "근로시간 · 휴가 · OT 자동 집계" },
  { icon: Coins,      name: "급여 운영",    desc: "급여 · 보상 · Pay Band 시뮬레이션" },
  { icon: Users,      name: "인사 정보",    desc: "조직도 · 인사 마스터 통합" },
  { icon: Database,   name: "HR Analytics", desc: "대시보드 · AI 인사이트" },
];

const TALENX_HIGHLIGHTS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Bot,    title: "HR 도메인 특화 AI",  desc: "범용 AI가 아닌, HR 영역 데이터로 학습된 AI가 의사결정을 보조" },
  { icon: Cloud,  title: "Cloud SaaS",        desc: "별도 구축 없이 빠른 도입. 지속적 업데이트와 신기능 제공" },
  { icon: GitBranch, title: "자문 산출물 자동 연동", desc: "Master 자문에서 설계한 제도가 AI HR SaaS 셋업으로 그대로 반영" },
  { icon: Shield, title: "보안 · 정보보호",   desc: "ISO/IEC 27001 · ISMS 인증. 기업 데이터 안전하게 보관" },
];

type SynergyItem = { from: string; to: string; module: string };
const SYNERGY: SynergyItem[] = [
  { module: "직급",   from: "자문에서 설계한 직급체계 (G1~G4 통합)", to: "AI HR SaaS에 직급 마스터로 자동 셋업" },
  { module: "평가",   from: "자문에서 만든 OKR · Calibration 프로세스", to: "AI HR SaaS에서 분기 사이클로 자동 실행" },
  { module: "보상",   from: "자문에서 정한 Pay Band · 차등 구조",       to: "AI HR SaaS에서 인상률 시뮬레이션 + 산정" },
  { module: "리더십", from: "자문에서 진단한 리더십 Snapshot",          to: "AI HR SaaS에서 코칭 사이클 + Successor Pool 관리" },
];

type Stat = { value: string; label: string };
const STATS: Stat[] = [
  { value: "80%",    label: "글로벌 헬스케어 A사 — 시스템 일원화 비용 절감" },
  { value: "57%",    label: "바이오센서 B사 — 평가 운영 기간 단축" },
  { value: "95%",    label: "IT C사 — 성과 면담 이행률 달성" },
  { value: "1,100명", label: "제조 D사 — 성과관리 혁신" },
];

/* ═════════════════ Page ═════════════════ */

export default function Step7System() {
  const step = getStepBySlug("7-system")!;

  return (
    <>
      <StepShell step={step}>
        <p
          className="body text-ink-600"
          style={{ display: "block", margin: 0, marginBottom: 24, padding: 0, position: "static" }}
        >
          제도를 같이 짠 사람이 시스템도 만들어요.{" "}
          <strong className="text-accent-400">올인원 AI HR SaaS</strong>는 성과·평가·근태·급여·인사를 하나의 플랫폼에서 운영하며, 자문에서 설계한 제도를 시스템에 그대로 반영해 호환성을 극대화합니다.
        </p>

        {/* End-to-End flow */}
        <EndToEndFlow />

        {/* Talenx hero */}
        <SectionHeader
          eyebrow="SOLUTION"
          title="올인원 AI HR SaaS"
          subtitle="성과 · 평가 · 근태 · 급여 · 인사를 하나의 플랫폼에서 운영"
        />
        <TalenxHero />

        {/* Synergy */}
        <SectionHeader
          eyebrow="SYNERGY"
          title="자문 + AI HR SaaS, 자연스럽게 이어지는 호환성"
          subtitle="다른 회사 컨설팅 + 다른 회사 시스템 = 통역 비용 · 도입 지연 · 산출물 재작업"
        />
        <SynergyPanel />

        {/* Customer success */}
        <SectionHeader
          eyebrow="PROVEN"
          title="검증된 성과"
          subtitle="AI HR SaaS 도입으로 만든 실제 변화"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {STATS.map((s, i) => <StatCard key={i} stat={s} />)}
        </div>

        {/* Trust bar */}
        <TrustBar />
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
    { icon: Cloud,    label: "AI HR SaaS", sub: "통합 플랫폼", color: "bg-accent-500/15 border-accent-500/40 text-accent-300", featured: true },
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

/* ═════════════════ Talenx hero panel ═════════════════ */

function TalenxHero() {
  return (
    <div className="card !p-0 overflow-hidden mb-10 relative">
      <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-500/70 to-transparent" />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-accent-500/[0.04] via-transparent to-transparent pointer-events-none" />

      {/* Header band */}
      <div className="relative px-5 sm:px-6 py-5 border-b border-white/[0.08]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500 text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_-4px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]">
            <Cloud size={22} />
          </div>
          <div className="flex-1 min-w-0" style={{ display: "block", lineHeight: 1 }}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div
                className="text-[24px] font-bold text-ink-900"
                style={{ display: "inline-block", margin: 0, padding: 0, lineHeight: 1 }}
              >
                AI HR SaaS
              </div>
              <div
                className="text-[12px] font-mono text-ink-500"
                style={{ display: "inline-block", margin: 0, padding: 0, lineHeight: 1 }}
              >
                All-in-One Platform
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={9} /> 올인원 AI HR SaaS
              </span>
            </div>
            <div
              className="text-[13px] text-ink-600 mt-2 leading-snug"
              style={{ display: "block", margin: 0, marginTop: 8, padding: 0, lineHeight: 1.5 }}
            >
              모든 규모 기업을 위한 HR 전 영역 통합 플랫폼. 자문에서 설계한 제도를 그대로 시스템에서 운영합니다.
            </div>
          </div>
        </div>
      </div>

      {/* Modules grid */}
      <div className="relative p-5 sm:p-6">
        <div
          className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-3 px-1"
          style={{ display: "block", margin: 0, marginBottom: 12, padding: "0 4px", position: "static" }}
        >
          핵심 모듈 6개
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
          {TALENX_MODULES.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="p-3 rounded-lg bg-white/[0.025] border border-white/[0.06] hover:border-accent-500/30 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-md bg-accent-500/15 border border-accent-500/30 text-accent-400 flex items-center justify-center flex-shrink-0">
                  <m.icon size={13} />
                </div>
                <div
                  className="text-[13px] font-bold text-ink-900"
                  style={{ display: "inline-block", margin: 0, padding: 0, lineHeight: 1.2 }}
                >
                  {m.name}
                </div>
              </div>
              <div
                className="text-[11px] text-ink-600 leading-snug pl-9"
                style={{ display: "block", margin: 0, padding: "0 0 0 36px", position: "static" }}
              >
                {m.desc}
              </div>
            </motion.div>
          ))}
        </div>

        <div
          className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-3 px-1"
          style={{ display: "block", margin: 0, marginBottom: 12, padding: "0 4px", position: "static" }}
        >
          AI HR SaaS의 차별점
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
          {TALENX_HIGHLIGHTS.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-accent-500/[0.04] border border-accent-500/15">
              <h.icon size={14} className="text-accent-400 mt-0.5 flex-shrink-0" />
              <div style={{ display: "block", lineHeight: 1 }}>
                <div
                  className="text-[12px] font-bold text-ink-800"
                  style={{ display: "block", margin: 0, padding: 0, lineHeight: 1.3 }}
                >
                  {h.title}
                </div>
                <div
                  className="text-[11px] text-ink-600 mt-1 leading-snug"
                  style={{ display: "block", margin: 0, marginTop: 4, padding: 0, lineHeight: 1.5 }}
                >
                  {h.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-[11px] font-mono text-ink-500">
          상담 신청 후 담당 컨설턴트가 도입 절차를 자세히 안내해드립니다.
        </div>
      </div>
    </div>
  );
}

/* ═════════════════ Synergy panel ═════════════════ */

function SynergyPanel() {
  return (
    <div className="card !p-0 overflow-hidden mb-10">
      <div className="px-4 py-3 border-b border-white/[0.08] bg-gradient-to-b from-accent-500/[0.08] to-transparent flex items-center gap-2.5">
        <Database size={14} className="text-accent-400" />
        <span
          className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400"
          style={{ display: "inline-block", margin: 0, padding: 0, position: "static" }}
        >
          자문 산출물 → AI HR SaaS 자동 연동
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
            AI HR SaaS에서 운영
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
            다른 회사 컨설팅 + 다른 회사 시스템 조합은 산출물 재작업·통역 비용·도입 지연이 늘 발생합니다. 같은 팀이 자문부터 시스템 셋업, 운영·유지보수까지 매끄럽게 연결합니다.
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
    { icon: Users, label: "국내 굴지의 대기업·중견·중소기업 다수 도입" },
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