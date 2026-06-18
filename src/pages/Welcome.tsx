import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight,
  ShieldCheck, MessageCircle, Calendar, Wrench, BookOpen, Users2,
  Award, Sparkles, Check, Building, Building2,
  type LucideIcon,
} from "lucide-react";
import { recordTurnkeyClick } from "@/lib/api";
import KeyHint from "@/components/KeyHint";
import WelcomeMiniChat from "@/components/WelcomeMiniChat";

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
      <div aria-hidden className="absolute inset-0 bg-grid-line mask-vignette opacity-60 pointer-events-none" />
      <CornerMarks />

      <header className="relative z-10 h-14 flex items-center container-x">
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink-900 tracking-tight">
          <LogoMark />
          <span>HR Master</span>
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
            국내 굴지의 기업과 중소형 기업이 함께 선택한 자문 컨설팅
          </div>

          <h1 className="h-hero mt-5">
            월{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent">
                50만원
              </span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 h-3 bg-accent-500/30 blur-md -z-0" />
            </span>
            부터,
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            최고 전문 HRBP를 우리 회사에
          </h1>

          <p className="body text-ink-600 mt-5 max-w-[560px] mx-auto">
            HR 전문가 채용이 부담스러우시죠?<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            베테랑 HR 컨설턴트가 매월 함께하며 조직을 한 단계 성장시켜드립니다.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            인력과 관련된 모든 것을 부스팅보세요. 5분 체험 시작
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 sm:mt-14 flex items-center justify-center gap-3 text-[10px] font-mono font-bold tracking-[0.22em] text-ink-500 uppercase"
        >
          <span className="h-px w-12 bg-white/10" />
          <span>지금 바로 시작하세요</span>
          <span className="h-px w-12 bg-white/10" />
        </motion.div>

        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
          className="grid md:grid-cols-2 gap-4 mt-6 text-left"
        >
          {/* ─────────── 왼쪽: 실시간 자문 채팅 ─────────── */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
            <WelcomeMiniChat />
          </motion.div>

          {/* ─────────── 오른쪽: PATH 02 — Master (featured) ─────────── */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
            <MasterPath onCtaClick={startMasterTour} />
          </motion.div>
        </motion.div>

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

        {/* ─────────── 하단: PATH 01 — 통합 컨설팅 (중견기업 이상) ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-12 border-t border-white/[0.06]"
        >
          <div className="text-center mb-6">
            <p className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-500 uppercase">
              그 외 옵션
            </p>
            <h2 className="text-[22px] font-bold text-ink-900 mt-2">
              규모가 크다면, 통합 컨설팅도 가능합니다
            </h2>
            <p className="text-[13.5px] text-ink-600 mt-2.5 max-w-[520px] mx-auto leading-relaxed">
              중견기업 이상, 3~4개월 상주형 풀세트 컨설팅.
              <br className="hidden sm:block" />
              직급·평가·보상·진단을 한 번에 새로 설계해야 할 때.
            </p>
          </div>
          <div className="max-w-[720px] mx-auto text-left">
            <TurnkeyPath onCtaClick={handleTurnkeyClick} />
          </div>
        </motion.div>

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

/* ─────────────── Path 01 — Turnkey (dimmed body, alive CTA) ─────────────── */

function TurnkeyPath({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <div className="relative h-full rounded-2xl backdrop-blur-xl overflow-hidden border border-dashed border-white/[0.12] bg-white/[0.02]">
      {/* deeply muted body — keep card from drawing attention */}
      <div className="opacity-65">
        {/* Top edge highlight (very subtle) */}
        <span
          aria-hidden
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
        />

        <div className="flex items-center justify-between gap-3 px-7 py-3 border-b border-white/[0.05] bg-white/[0.015]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-ink-500">PATH 01</span>
            <span className="w-1 h-1 rounded-full bg-ink-500/40" />
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-ink-500">통합 컨설팅</span>
          </div>
          <KeyHint variant="light">1</KeyHint>
        </div>

        <div className="p-7 sm:p-8 pb-4">
          <h2 className="block text-[clamp(24px,3.5vw,32px)] font-bold tracking-[-0.02em] leading-tight text-ink-700">
            제도설계 컨설팅(중견기업 이상)
          </h2>
          <p className="block text-[14px] text-ink-500 mt-1.5">
            3~4개월 상주형 · 처음부터 끝까지
          </p>

          <p className="body-sm text-ink-600 mt-5 leading-relaxed">
            직급·평가·보상·진단을 한 번에 새로 설계해야 할 때.
            컨설턴트가 상주하며 풀세트로 함께 만듭니다.
          </p>

          {/* Fit profile */}
          <div className="mt-5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-2.5">
              이런 회사에 적합
            </div>
            <ul className="space-y-1.5">
              <FitRow text="규모 500명+ / 또는 인사제도 전면 개편이 필요한 시점" />
              <FitRow text="IPO 준비 · M&A 직후 · 사업 전환기" />
              <FitRow text="기존 제도가 거의 없거나 큰 폭의 재설계 필요" />
              <FitRow text="자체 HR 역량이 충분히 갖춰진 회사" />
                 <FitRow text="턴키, 고비용" />
            </ul>
          </div>
        </div>
      </div>

      {/* CTA stays active — undimmed */}
      <div className="p-7 sm:p-8 pt-0">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center gap-2 px-4 h-11 rounded-lg font-semibold text-[14px]
                     border border-white/10 bg-white/[0.03] text-ink-500
                     cursor-not-allowed opacity-60"
        >
          <span>별도 상담</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

function FitRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[12px] text-ink-600 leading-relaxed">
      <span className="text-ink-500 mt-1 flex-shrink-0">·</span>
      <span>{text}</span>
    </li>
  );
}

/* ─────────────── Path 02 — Master (featured) ─────────────── */

function MasterPath({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <div
      role="button" tabIndex={0}
      onClick={onCtaClick}
      onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); onCtaClick(); } }}
      className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 rounded-2xl h-full"
    >
      <div className="relative flex flex-col h-full rounded-2xl backdrop-blur-xl overflow-hidden bg-accent-500/[0.05] border-2 border-accent-500/40 shadow-glow-accent group-hover:shadow-glow-accent-lg group-hover:-translate-y-1 transition-all duration-300">
        <span
          aria-hidden
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)" }}
        />

        <div className="relative flex items-center justify-between gap-3 px-7 py-3 border-b border-accent-500/20 bg-accent-500/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400">PATH 02</span>
            <span className="w-1 h-1 rounded-full bg-accent-400/40" />
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-accent-400">자문 서비스 알아보기</span>
          </div>
          <KeyHint variant="dark">2</KeyHint>
        </div>

        <span className="absolute top-3 right-14 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-500 text-white text-[10px] font-bold tracking-wider shadow-[0_4px_12px_-2px_rgba(14,165,233,0.7)]">
          <Sparkles size={9} />
          추천
        </span>

        <div className="relative flex flex-col flex-1 p-7 sm:p-8">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-accent-500/30 to-accent-700/10 blur-3xl pointer-events-none"
          />

          <div className="relative">
            <h2 className="block text-[clamp(24px,3.5vw,32px)] font-bold tracking-[-0.02em] leading-tight text-ink-900">
              HR 마스터 계약 알아보기
            </h2>
            <p className="block text-[14px] text-accent-400 font-medium mt-1.5">
              전문컨설턴트를 일정기간 HRBP로 활용하며 조직체질 개선
            </p>
          </div>

          <p className="relative body-sm text-ink-600 mt-5 leading-relaxed">
            계약 기간 동안 전문 컨설턴트가 밀착 관리합니다. 제도 수립 지원, 운영 자문을 받아 인력과 조직을 업그레이드 시키고 코어를 강화하세요
            
          </p>

          {/* Fit profile */}
          <div className="relative mt-5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-2.5">
              이런 회사에 적합
            </div>
            <ul className="space-y-1.5">
              <FitRowFeatured text="규모 50~500명 / 성장 중인 스타트업·중견기업" />
              <FitRowFeatured text="제도가 비어있고 운영이슈가 항상 발생하는 상태" />
              <FitRowFeatured text="HR 담당이 1~2명, 전문가 부재" />
              <FitRowFeatured text="Lean하게 운영하고 수정하고 파인튜닝하면서 개선하고싶은 회사" />
                <FitRowFeatured text="합리적 월별 자문료" />
            </ul>
          </div>

          <div className="relative mt-6">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-2.5">
              협업 모드 5가지
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { icon: Wrench, label: "페어 디자인" },
                { icon: MessageCircle, label: "실행 도우미" },
                { icon: BookOpen, label: "도구 제공" },
                { icon: Calendar, label: "시뮬레이션" },
                { icon: Users2, label: "정렬 워크숍" },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium bg-accent-500/15 text-accent-300 border border-accent-500/30"
                  >
                    <Icon size={11} />
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative mt-auto pt-7">
            <div className="inline-flex items-center gap-2 px-4 h-11 rounded-lg font-semibold text-[14px] bg-accent-500 text-white shadow-[0_8px_24px_-8px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:bg-accent-400 group-hover:shadow-[0_12px_32px_-8px_rgba(14,165,233,0.75),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all">
              <span>투어 시작</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              <KeyHint variant="dark" className="ml-1">Enter</KeyHint>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FitRowFeatured({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[12px] text-ink-700 leading-relaxed">
      <Check size={11} className="text-accent-400 mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
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