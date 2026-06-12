import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight,
  ShieldCheck, MessageCircle, Calendar, Wrench, BookOpen, Users2,
  Layers, FileStack, Users, Award, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { recordTurnkeyClick } from "@/lib/api";
import KeyHint from "@/components/KeyHint";

export default function Welcome() {
  const navigate = useNavigate();
  const handleTurnkeyClick = async () => {
    void recordTurnkeyClick("welcome");
    window.open("https://e-hcg.com/professional-services", "_blank");
  };
  const startMasterTour = () => navigate("/tour/1-diagnose");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
      if (e.key === "1") { e.preventDefault(); handleTurnkeyClick(); }
      else if (e.key === "2" || e.key === "Enter") { e.preventDefault(); startMasterTour(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-50 bg-spotlight">
      {/* Layered background textures */}
      <div aria-hidden className="absolute inset-0 bg-grid-line mask-vignette opacity-60 pointer-events-none" />
      <CornerMarks />

      <header className="relative z-10 h-14 flex items-center container-x">
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink-900 tracking-tight">
          <LogoMark />
          <span>HCG Master</span>
        </Link>
        <span className="ml-auto inline-flex items-center gap-2 text-[11px] font-mono text-ink-500 tracking-wider">
          <span className="hidden md:inline">INTERACTIVE TOUR</span>
          <span className="hidden md:inline opacity-40">·</span>
          <span>EST. 5 MIN</span>
        </span>
      </header>

      <section className="relative z-10 container-tour pt-8 sm:pt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur text-[11px] font-mono font-semibold text-ink-700 tracking-wider shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse-soft shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
            KOSPI 200 상장사 30%가 선택한 HCG
          </div>

          <h1 className="h-hero mt-5">
            HR 컨설팅,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent">
                5분
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-3 bg-accent-500/30 blur-md -z-0"
              />
            </span>
            으로
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            압축해서 보여드릴게요
          </h1>

          <p className="body text-ink-600 mt-5 max-w-[520px] mx-auto">
            진단 → 자문 → 도구 → 시뮬레이션 → 협업 방식.<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Master 컨설턴트가 어떻게 옆에 있는지 직접 체험하실 수 있어요.
          </p>
        </motion.div>

        {/* Branch label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 sm:mt-14 flex items-center justify-center gap-3 text-[10px] font-mono font-bold tracking-[0.22em] text-ink-500 uppercase"
        >
          <span className="h-px w-12 bg-white/10" />
          <span>경로를 선택하세요</span>
          <span className="h-px w-12 bg-white/10" />
        </motion.div>

        {/* Two paths */}
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
          className="grid md:grid-cols-2 gap-4 mt-6 text-left"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
            <PathCard
              pathNumber="01" keyLabel="1" status="준비 중" tone="muted"
              title="통합 컨설팅" subtitle="3~4개월 상주형 · 풀패키지"
              description="처음부터 끝까지 새로 설계해야 할 때. 직급 · 평가 · 보상 · 진단을 한 번에 풀세트로 함께 만듭니다."
              chipsLabel="포함 영역"
              chips={[
                { icon: Layers, label: "직급 통합" },
                { icon: FileStack, label: "평가 설계" },
                { icon: Users, label: "보상 · 진단" },
              ]}
              ctaLabel="HCG 본사에서 상담" ctaIcon={ArrowUpRight}
              onClick={handleTurnkeyClick}
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
            <PathCard
              pathNumber="02" keyLabel="2" status="지금 체험" tone="featured" recommended
              title="Master 자문" subtitle="월 retainer · 필요할 때 함께"
              description="제도를 같이 짜고, 실행하면서 fine-tune하고, 사이사이 도구와 시뮬레이션도 제공합니다. 정해진 일정이 아니라 elastic 협업."
              chipsLabel="협업 모드 5가지"
              chips={[
                { icon: Wrench, label: "페어 디자인" },
                { icon: MessageCircle, label: "실행 도우미" },
                { icon: BookOpen, label: "도구 제공" },
                { icon: Calendar, label: "시뮬레이션" },
                { icon: Users2, label: "정렬 워크숍" },
              ]}
              ctaLabel="투어 시작" ctaIcon={ArrowRight} ctaKey="Enter"
              onClick={startMasterTour}
            />
          </motion.div>
        </motion.div>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-mono text-ink-500"
        >
          <span className="inline-flex items-center gap-1.5">
            <KeyHint>1</KeyHint><KeyHint>2</KeyHint>
            <span>경로 선택</span>
          </span>
          <span className="opacity-30">·</span>
          <span className="inline-flex items-center gap-1.5">
            <KeyHint>↵</KeyHint>
            <span>추천 경로 시작</span>
          </span>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-ink-500 pt-6 border-t border-white/[0.06] max-w-[680px] mx-auto"
        >
          <TrustItem icon={Award} label="국내 HR Tech 시장 1위" />
          <span className="opacity-30">·</span>
          <TrustItem icon={ShieldCheck} label="ISO/IEC 27001:2022" />
          <span className="opacity-30">·</span>
          <TrustItem icon={ShieldCheck} label="ISMS 인증" />
          <span className="opacity-30">·</span>
          <TrustItem icon={Sparkles} label="AI 감정 분석 특허" />
        </motion.div>
      </section>
    </main>
  );
}

/* ─────────────── Path card ─────────────── */

type PathCardProps = {
  pathNumber: string;
  keyLabel: string;
  status: string;
  tone: "muted" | "featured";
  recommended?: boolean;
  title: string;
  subtitle: string;
  description: string;
  chipsLabel: string;
  chips: { icon: LucideIcon; label: string }[];
  ctaLabel: string;
  ctaIcon: LucideIcon;
  ctaKey?: string;
  onClick: () => void;
};

function PathCard({
  pathNumber, keyLabel, status, tone, recommended,
  title, subtitle, description, chipsLabel, chips,
  ctaLabel, ctaIcon: CtaIcon, ctaKey, onClick,
}: PathCardProps) {
  const isFeatured = tone === "featured";

  return (
    <div
      role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); onClick(); } }}
      className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 rounded-2xl"
    >
      <div
        className={`relative flex flex-col h-full rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          isFeatured
            ? "bg-accent-500/[0.05] border-2 border-accent-500/40 shadow-glow-accent group-hover:shadow-glow-accent-lg group-hover:-translate-y-1"
            : "bg-white/[0.03] border border-dashed border-white/[0.15] group-hover:border-white/25 group-hover:bg-white/[0.05]"
        }`}
      >
        {/* Top edge highlight via pseudo */}
        <span
          aria-hidden
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background: isFeatured
              ? "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        {/* Header strip */}
        <div
          className={`relative flex items-center justify-between gap-3 px-7 py-3 border-b ${
            isFeatured ? "bg-accent-500/[0.06] border-accent-500/20" : "bg-white/[0.02] border-white/[0.06]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold tracking-[0.22em] ${isFeatured ? "text-accent-400" : "text-ink-600"}`}>
              PATH {pathNumber}
            </span>
            <span className="w-1 h-1 rounded-full bg-current opacity-40" />
            <span className={`text-[10px] font-mono font-bold tracking-[0.18em] uppercase ${isFeatured ? "text-accent-400" : "text-ink-500"}`}>
              {status}
            </span>
          </div>
          <KeyHint variant={isFeatured ? "dark" : "light"}>{keyLabel}</KeyHint>
        </div>

        {recommended && (
          <span className="absolute top-3 right-14 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-500 text-white text-[10px] font-bold tracking-wider shadow-[0_4px_12px_-2px_rgba(14,165,233,0.7)]">
            <Sparkles size={9} />
            추천
          </span>
        )}

        <div className="relative flex flex-col flex-1 p-7 sm:p-8">
          {isFeatured && (
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-accent-500/30 to-accent-700/10 blur-3xl pointer-events-none"
            />
          )}

          <div className="relative">
            <h2 className={`block text-[clamp(24px,3.5vw,32px)] font-bold tracking-[-0.02em] leading-tight ${isFeatured ? "text-ink-900" : "text-ink-800"}`}>
              {title}
            </h2>
            <p className={`block text-[14px] mt-1.5 ${isFeatured ? "text-accent-400 font-medium" : "text-ink-500"}`}>
              {subtitle}
            </p>
          </div>

          <p className="relative body-sm text-ink-600 mt-5 leading-relaxed">{description}</p>

          <div className="relative mt-6">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-2.5">
              {chipsLabel}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c, i) => {
                const Icon = c.icon;
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium ${
                      isFeatured
                        ? "bg-accent-500/15 text-accent-300 border border-accent-500/30"
                        : "bg-white/[0.05] text-ink-700 border border-white/10"
                    }`}
                  >
                    <Icon size={11} />
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative mt-auto pt-7">
            <div
              className={`inline-flex items-center gap-2 px-4 h-11 rounded-lg font-semibold text-[14px] transition-all ${
                isFeatured
                  ? "bg-accent-500 text-white shadow-[0_8px_24px_-8px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:bg-accent-400 group-hover:shadow-[0_12px_32px_-8px_rgba(14,165,233,0.75),inset_0_1px_0_rgba(255,255,255,0.25)]"
                  : "border border-white/15 bg-white/[0.04] text-ink-800 group-hover:bg-white/[0.08] group-hover:border-white/25"
              }`}
            >
              <span>{ctaLabel}</span>
              <CtaIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
              {ctaKey && <KeyHint variant="dark" className="ml-1">{ctaKey}</KeyHint>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Decor ─────────────── */

function TrustItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={11} className="text-accent-500" />
      {label}
    </span>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="inline-flex w-7 h-7 rounded-md bg-gradient-to-br from-accent-400 to-accent-600 text-white items-center justify-center font-bold text-[13px] shadow-[0_4px_12px_-2px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
    >
      H
    </span>
  );
}

function CornerMarks() {
  const mark = (
    <svg width="14" height="14" viewBox="0 0 14 14" className="text-white/15">
      <path d="M0 1h6M1 0v6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
  return (
    <>
      <span aria-hidden className="hidden md:block absolute top-6 left-6 z-10">{mark}</span>
      <span aria-hidden className="hidden md:block absolute top-6 right-6 z-10 rotate-90">{mark}</span>
      <span aria-hidden className="hidden md:block absolute bottom-6 left-6 z-10 -rotate-90">{mark}</span>
      <span aria-hidden className="hidden md:block absolute bottom-6 right-6 z-10 rotate-180">{mark}</span>
    </>
  );
}
