import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Calendar,
  Wrench,
  BookOpen,
  Layers,
  FileStack,
  Users,
  Award,
  type LucideIcon,
} from "lucide-react";
import { recordTurnkeyClick } from "@/lib/api";

export default function Welcome() {
  const handleTurnkeyClick = async () => {
    void recordTurnkeyClick("welcome");
    window.open("https://e-hcg.com/professional-services", "_blank");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <BackgroundDecor />

      <header className="relative z-10 h-16 flex items-center container-x">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-primary-900 tracking-tight"
        >
          <LogoMark />
          <span>HCG Master</span>
        </Link>
        <span className="ml-auto hidden md:inline-flex items-center gap-1.5 text-[12px] text-primary-500">
          <ShieldCheck size={13} className="text-accent-500" />
          국내 1위 AI HR Tech · ISO/IEC 27001
        </span>
      </header>

      <section className="relative z-10 container-tour pt-10 sm:pt-16 lg:pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-accent-50 to-white border border-accent-100 text-[12px] font-semibold text-accent-700 tracking-wide">
            <Sparkles size={12} />
            KOSPI 200 상장사 30%가 선택한 HCG
          </div>

          <h1 className="h-hero mt-6">
            HR 컨설팅,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                5분
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 h-2.5 bg-accent-100/80 -z-0"
              />
            </span>
            으로
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            압축해서 보여드릴게요
          </h1>

          <p className="body-lg text-primary-500 mt-6 max-w-[540px] mx-auto">
            회사 상황에 맞는 방식을 골라주세요.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            컨설턴트가 어떻게 함께하는지 직접 체험하실 수 있어요.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
          }}
          className="grid md:grid-cols-2 gap-5 mt-14 sm:mt-16 text-left"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
            }}
          >
            <ChoiceCard
              tone="muted"
              eyebrow={
                <span className="chip">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-1" />
                  준비 중
                </span>
              }
              title="통합 컨설팅"
              subtitle="3~4개월 상주형 · 풀패키지"
              description="처음부터 끝까지 새로 설계해야 할 때. 직급 · 평가 · 보상 · 진단을 한 번에 풀세트로 함께 만듭니다."
              chipsLabel="포함 영역"
              chips={[
                { icon: Layers, label: "직급 통합" },
                { icon: FileStack, label: "평가 설계" },
                { icon: Users, label: "보상 · 진단" },
              ]}
              ctaLabel="HCG 본사 사이트에서 상담"
              ctaIcon={ArrowUpRight}
              onClick={handleTurnkeyClick}
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
            }}
          >
            <ChoiceCard
              tone="featured"
              eyebrow={
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500 text-white text-[12px] font-semibold tracking-wide">
                  <Sparkles size={11} />
                  지금 5분 체험
                </span>
              }
              title="Master 자문"
              subtitle="월 retainer · 필요할 때 함께"
              description="HR 담당자 옆에 전문가 한 명을 두는 비용으로. 핫라인 · 정기 방문 · 템플릿 · 제도 설계까지 — 매달 함께 운영합니다."
              chipsLabel="이용 가능 채널"
              chips={[
                { icon: MessageCircle, label: "실시간 핫라인" },
                { icon: Calendar, label: "정기 방문" },
                { icon: BookOpen, label: "템플릿 라이브러리" },
                { icon: Wrench, label: "제도 설계" },
              ]}
              to="/tour/1-diagnose"
              ctaLabel="투어 시작"
              ctaIcon={ArrowRight}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 sm:mt-20 mb-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12px] text-primary-400"
        >
          <TrustItem icon={Award} label="국내 HR Tech 시장 1위" />
          <span className="opacity-30">·</span>
          <TrustItem icon={ShieldCheck} label="ISO/IEC 27001:2022" />
          <span className="opacity-30">·</span>
          <TrustItem icon={ShieldCheck} label="ISMS 인증" />
          <span className="opacity-30">·</span>
          <TrustItem icon={Sparkles} label="AI 피드백 감정 분석 특허" />
        </motion.div>
      </section>
    </main>
  );
}

/* ─────────────── Pieces ─────────────── */

type ChoiceCardProps = {
  tone: "muted" | "featured";
  eyebrow: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  chipsLabel: string;
  chips: { icon: LucideIcon; label: string }[];
  ctaLabel: string;
  ctaIcon: LucideIcon;
  to?: string;
  onClick?: () => void;
};

function ChoiceCard({
  tone,
  eyebrow,
  title,
  subtitle,
  description,
  chipsLabel,
  chips,
  ctaLabel,
  ctaIcon: CtaIcon,
  to,
  onClick,
}: ChoiceCardProps) {
  const isFeatured = tone === "featured";

  const innerContent = (
    <div
      className={`relative flex flex-col h-full rounded-2xl p-7 sm:p-8 transition-all duration-300 overflow-hidden ${
        isFeatured
          ? "bg-white border-2 border-accent-500 shadow-[0_24px_56px_-24px_rgba(14,165,233,0.4)] group-hover:shadow-[0_32px_64px_-20px_rgba(14,165,233,0.5)] group-hover:-translate-y-1"
          : "bg-bg-soft border border-dashed border-primary-300 group-hover:border-primary-400 group-hover:bg-white"
      }`}
    >
      {isFeatured && (
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-accent-200 to-accent-100 blur-3xl opacity-70 pointer-events-none"
        />
      )}

      <div className="relative flex items-center justify-between mb-6">
        {eyebrow}
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isFeatured
              ? "bg-accent-500 text-white group-hover:scale-110 group-hover:bg-accent-600"
              : "bg-white border border-primary-200 text-primary-400 group-hover:border-primary-400 group-hover:text-primary-600"
          }`}
        >
          {isFeatured ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}
        </span>
      </div>

      <div className="relative">
        <h2
          className={`block text-[clamp(24px,3.5vw,32px)] font-bold tracking-[-0.02em] leading-tight ${
            isFeatured ? "text-primary-900" : "text-primary-700"
          }`}
        >
          {title}
        </h2>
        <p
          className={`block text-[14px] mt-1.5 ${
            isFeatured ? "text-accent-600 font-medium" : "text-primary-500"
          }`}
        >
          {subtitle}
        </p>
      </div>

      <p className="relative body text-primary-600 mt-5 leading-relaxed">
        {description}
      </p>

      <div className="relative mt-7">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-400 mb-3">
          {chipsLabel}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((c, i) => {
            const Icon = c.icon;
            return (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium ${
                  isFeatured
                    ? "bg-accent-50 text-accent-700 border border-accent-100"
                    : "bg-white text-primary-600 border border-primary-200"
                }`}
              >
                <Icon size={12} />
                {c.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="relative mt-auto pt-7">
        <span
          className={`inline-flex items-center gap-1.5 text-[14px] font-semibold ${
            isFeatured ? "text-accent-600" : "text-primary-500"
          }`}
        >
          {ctaLabel}
          <CtaIcon
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 rounded-2xl"
      >
        {innerContent}
      </Link>
    );
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 rounded-2xl"
    >
      {innerContent}
    </div>
  );
}

function TrustItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={12} className="text-accent-500" />
      {label}
    </span>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="inline-flex w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-accent-700 text-white items-center justify-center font-bold text-[13px] shadow-sm shadow-accent-500/20"
    >
      H
    </span>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-accent-200/60 via-accent-100/40 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-rose-100/40 via-orange-50/30 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </>
  );
}
