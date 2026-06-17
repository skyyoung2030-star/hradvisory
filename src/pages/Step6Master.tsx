import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ArrowRight, Sparkles, Mail, Phone, Building2, User, Star,
  type LucideIcon,
} from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/api";

const TIERS = [
  {
    id: "light", name: "Light",
    subtitle: "핫라인 + 운영지원",
    price: "월 50~100만원", priceNote: "인원수에 따라",
    audience: "100명 미만 추천",
    features: ["실시간 핫라인 (평일 응답)", "월 1회 현장 방문", "무료 템플릿 라이브러리 전체", "HR 제도 검토 · 자문", "네트워크 연결 (단가 매칭)"],
  },
  {
    id: "standard", name: "Standard",
    subtitle: "월 방문 + 제도설계 지원",
    price: "월 200~300만원", priceNote: "대부분의 회사에 적합",
    audience: "100~300명 추천",
    features: ["실시간 핫라인 (우선 응답)", "월 1회 현장 방문 및 분기별 맟춤 방문", "템플릿 전체", "주요 제도 설계 지원", "리더십 진단 및 코칭", "노무사 연결 (우대 단가)"],
  },
  {
    id: "premium", name: "Premium",
    subtitle: "격주 방문 + 제도 설계 및 맞춤 워크샵",
    price: "월 500만원+", priceNote: "맞춤 견적",
    audience: "300명+ · IPO 준비 추천",
    features: ["실시간 핫라인 (상시 응답)", "월 2회+ 현장 방문", "맞춤 템플릿 제작", "제도 풀세트 설계 지원", "제도 안정화 및 변화관리", "1:1 코칭 및 워크샵", "연 1회 종합 진단 포함", "노무사 무료 1회/년 포함"],
  },
];

type LeadForm = { name: string; email: string; phone: string; company: string; agreed: boolean; };

export default function Step6Master() {
  const step = getStepBySlug("6-master")!;
  const [selectedTier, setSelectedTier] = useState<string>("standard");
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", company: "", agreed: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendedTier, setRecommendedTier] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hcg_tour_diagnose");
      if (raw) {
        const s = JSON.parse(raw);
        const rec = s.companySize === "<50" ? "light" : s.companySize === "500+" ? "premium" : "standard";
        setRecommendedTier(rec); setSelectedTier(rec);
      }
    } catch { /* */ }
  }, []);

  const canSubmit = form.name.trim().length > 0 && /\S+@\S+\.\S+/.test(form.email) && form.company.trim().length > 0 && form.agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const diagnoseRaw = sessionStorage.getItem("hcg_tour_diagnose");
    await submitLead({
      ...form, tier: selectedTier,
      diagnose: diagnoseRaw ? JSON.parse(diagnoseRaw) : null,
    });
    setSubmitted(true); setSubmitting(false);
  };

  if (submitted) {
    return (
      <section className="container-tour py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="w-16 h-16 rounded-full bg-success-500 text-white flex items-center justify-center mb-6 shadow-[0_0_32px_-4px_rgba(16,185,129,0.8)]"
        ><Check size={28} strokeWidth={3} /></motion.div>
        <h1
          className="text-[28px] font-bold text-ink-900"
          style={{ display: "block", margin: 0, marginBottom: 16, padding: 0, position: "static", lineHeight: 1.3, float: "none", clear: "both" }}
        >
          상담 신청이 접수되었습니다
        </h1>
        <p
          className="text-[14px] text-ink-600 max-w-[500px]"
          style={{ display: "block", margin: 0, padding: 0, position: "static", lineHeight: 1.6, float: "none", clear: "both" }}
        >
          영업일 기준 1일 내에 담당 컨설턴트가 직접 연락드립니다.<br />
          제출하신 진단 결과를 사전 검토하고 찾아뵙겠습니다.
        </p>
      </section>
    );
  }

  return (
    <>
      <StepShell step={step}>
        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map((t) => {
            const isSelected = selectedTier === t.id;
            const isRecommended = recommendedTier === t.id;
            return (
              <button
                key={t.id} type="button" onClick={() => setSelectedTier(t.id)}
                className={cn(
                  "text-left card relative transition-all flex flex-col",
                  "active:translate-y-0",
                  isSelected
                    ? "bg-accent-500/[0.06] border-accent-500/50 shadow-glow-accent -translate-y-1"
                    : "hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5",
                )}
              >
                {isRecommended && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-500 text-white text-[11px] font-bold tracking-wider shadow-[0_4px_12px_-2px_rgba(14,165,233,0.7)]">
                    <Star size={10} fill="currentColor" /> 추천
                  </span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="h-3">{t.name}</h3>
                  <span className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected ? "border-accent-500 bg-accent-500 scale-110 shadow-[0_0_12px_rgba(14,165,233,0.7)]" : "border-white/20 bg-white/[0.04]",
                  )}>
                    {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                </div>
                <p className="body-sm text-ink-500">{t.subtitle}</p>

                <div className="my-5 py-4 border-y border-white/[0.06]">
                  <div className="text-[20px] font-bold text-ink-900">{t.price}</div>
                  <div className="caption mt-0.5">{t.priceNote}</div>
                </div>

                <ul className="space-y-2 mb-5">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 body-sm text-ink-700">
                      <Check size={14} className="text-accent-400 mt-1 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="caption mt-auto">{t.audience}</p>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="card mt-10 max-w-[640px] mx-auto shadow-depth-2"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/15 text-accent-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-3 border border-accent-500/30">
                <Sparkles size={11} />
                상담 신청
              </div>
              <h2
                className="text-[22px] font-bold text-ink-900"
                style={{ display: "block", margin: 0, marginBottom: 6, padding: 0, position: "static", lineHeight: 1.3, float: "none", clear: "both" }}
              >
                담당 컨설턴트가 직접 연락드립니다
              </h2>
              <p
                className="text-[12px] text-ink-500"
                style={{ display: "block", margin: 0, padding: 0, position: "static", lineHeight: 1.4, float: "none", clear: "both" }}
              >
                영업일 기준 1일 내 회신
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Field icon={User} label="이름" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="홍길동" required />
              <Field icon={Building2} label="회사명" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="회사명" required />
              <Field icon={Mail} label="이메일" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="name@company.com" type="email" required />
              <Field icon={Phone} label="연락처" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="010-0000-0000" />
            </div>

            <label className="flex items-start gap-2.5 mt-5 cursor-pointer">
              <input
                type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-accent-500 cursor-pointer"
              />
              <span className="body-sm text-ink-600">개인정보 수집 · 이용에 동의합니다.</span>
            </label>

            <button
              type="submit" disabled={!canSubmit || submitting}
              className={cn(
                "btn-primary btn-lg w-full mt-6",
                (!canSubmit || submitting) && "opacity-40 cursor-not-allowed",
              )}
            >
              {submitting ? "전송 중…" : `${TIERS.find((t) => t.id === selectedTier)?.name} 플랜 상담 신청`}
              <ArrowRight size={16} className="ml-2" />
            </button>

            <p className="caption text-center mt-3">지금까지 입력하신 진단 정보가 함께 전달됩니다.</p>
          </motion.form>
        </AnimatePresence>
      </StepShell>

      <TourNav current={step} nextLabel="시스템 소개도 보기" nextSubtle={true} />
    </>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, required, type = "text" }: {
  icon: LucideIcon; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink-700 mb-1.5">
        {label} {required && <span className="text-danger-500">*</span>}
      </span>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          className="input pl-9"
        />
      </div>
    </label>
  );
}
