import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { PAIN_IMPACT_MAP } from "@/lib/pain-impact-map";

type DiagnoseState = {
  companySize: string;
  hrCapacity: string;
  pains: string[];
};

export default function Step5BeforeAfter() {
  const step = getStepBySlug("5-before-after")!;
  const [pains, setPains] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hcg_tour_diagnose");
      if (raw) {
        const s = JSON.parse(raw) as DiagnoseState;
        setPains(s.pains || []);
      }
    } catch { /* ignore */ }
  }, []);

  const items =
    pains.length > 0
      ? PAIN_IMPACT_MAP.filter((p) => pains.includes(p.id))
      : PAIN_IMPACT_MAP.slice(0, 3);

  const isPersonalized = pains.length > 0;

  return (
    <>
      <StepShell step={step}>
        {!isPersonalized && (
          <div className="card card-soft mb-6">
            <p className="body-sm text-primary-600">
              아직 진단을 완료하지 않으셔서, 대표 사례 3개를 보여드립니다. 진단을 완료하시면 회사 페인포인트에 맞춰 보입니다.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="card !p-0 overflow-hidden shadow-sm"
            >
              <div className="grid md:grid-cols-[1fr,80px,1fr] items-stretch">
                <div className="p-6 sm:p-7 bg-bg-soft border-r border-primary-100">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-danger-500/10 text-danger-500 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <AlertTriangle size={11} />
                    Before
                  </div>
                  <p className="body-sm text-primary-500 mb-2">{it.area}</p>
                  <p className="body font-semibold text-primary-800 leading-snug">
                    {it.pain_text}
                  </p>
                </div>

                <div className="flex items-center justify-center py-4 md:py-0 bg-bg-soft border-r border-primary-100">
                  <span className="w-10 h-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-accent-500 shadow-sm">
                    <ArrowRight size={18} />
                  </span>
                </div>

                <div className="p-6 sm:p-7 bg-white">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-success-500/10 text-success-500 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <CheckCircle2 size={11} />
                    After
                  </div>
                  <p className="body font-semibold text-primary-900 leading-snug">
                    {it.after_text}
                  </p>
                  {it.metric_text && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-accent-700 bg-accent-50 px-2.5 py-1 rounded-full">
                      <TrendingUp size={12} />
                      {it.metric_text}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="caption mt-8">
          위 수치는 평균 사례 기준이며, 회사 상황에 따라 달라질 수 있습니다.
        </p>
      </StepShell>

      <TourNav current={step} nextLabel="Master 플랜 보기" />
    </>
  );
}
