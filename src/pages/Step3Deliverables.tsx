import { useEffect, useMemo, useState } from "react";
import { FileText, Lock, Unlock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { TEMPLATES, PAIN_TO_AREA, type Template } from "@/lib/templates";
import { cn } from "@/lib/utils";

type DiagnoseState = {
  companySize: string;
  hrCapacity: string;
  pains: string[];
};

const AREAS: Template["area"][] = [
  "직급", "평가", "보상", "직무", "승진", "리더십", "조직문화",
];

export default function Step3Deliverables() {
  const step = getStepBySlug("3-deliverables")!;
  const [activeArea, setActiveArea] = useState<Template["area"] | "ALL">("ALL");
  const [selected, setSelected] = useState<Template | null>(null);
  const [userPains, setUserPains] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hcg_tour_diagnose");
      if (raw) {
        const s = JSON.parse(raw) as DiagnoseState;
        setUserPains(s.pains || []);
        const firstArea = s.pains?.[0] && PAIN_TO_AREA[s.pains[0]];
        if (firstArea) setActiveArea(firstArea);
      }
    } catch { /* ignore */ }
  }, []);

  const userAreas = useMemo(
    () => new Set(userPains.map((p) => PAIN_TO_AREA[p]).filter(Boolean) as Template["area"][]),
    [userPains],
  );

  const filtered = useMemo(
    () => activeArea === "ALL" ? TEMPLATES : TEMPLATES.filter((t) => t.area === activeArea),
    [activeArea],
  );

  return (
    <>
      <StepShell step={step}>
        {userPains.length > 0 && (
          <div className="card card-soft border-accent-500/30 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-accent-500" />
              <span className="caption text-accent-600 font-semibold uppercase tracking-wider">
                회사 맞춤
              </span>
            </div>
            <p className="body">
              선택하신 페인포인트에 따라{" "}
              <strong className="text-accent-600">
                {Array.from(userAreas).join(" · ")}
              </strong>{" "}
              영역의 템플릿이 먼저 도착합니다.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          <FilterPill active={activeArea === "ALL"} onClick={() => setActiveArea("ALL")}>
            전체
          </FilterPill>
          {AREAS.map((a) => (
            <FilterPill
              key={a}
              active={activeArea === a}
              highlighted={userAreas.has(a)}
              onClick={() => setActiveArea(a)}
            >
              {a}
              {userAreas.has(a) && (
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-accent-500" />
              )}
            </FilterPill>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className={cn(
                "text-left p-4 rounded-xl border transition-all bg-white",
                "hover:border-accent-500 hover:shadow-[0_8px_24px_-12px_rgba(14,165,233,0.25)]",
                userAreas.has(t.area) ? "border-accent-500/50" : "border-primary-200",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="chip">{t.area}</span>
                {t.isFree ? (
                  <span className="inline-flex items-center gap-1 text-success-500 text-[12px] font-medium">
                    <Unlock size={11} /> Free
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-primary-400 text-[12px] font-medium">
                    <Lock size={11} /> Master
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2.5">
                <FileText size={16} className="text-accent-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="body-sm font-semibold text-primary-900">{t.name}</div>
                  <div className="text-[13px] text-primary-500 mt-1 leading-snug">
                    {t.description}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="caption mt-8">
          총 {TEMPLATES.length}개 템플릿 중 일부 미리보기.{" "}
          <span className="text-success-500">Free</span>는 가입만 해도 받으실 수 있고,{" "}
          <span className="text-primary-600">Master</span>는 자문 계약 시 잠금 해제됩니다.
        </p>
      </StepShell>

      {selected && (
        <TemplatePreviewModal template={selected} onClose={() => setSelected(null)} />
      )}

      <TourNav current={step} nextLabel="다음: 6개월 프로세스" />
    </>
  );
}

function FilterPill({
  active,
  highlighted,
  onClick,
  children,
}: {
  active: boolean;
  highlighted?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
        active
          ? "bg-accent-500 text-white border-accent-500"
          : highlighted
          ? "bg-accent-50 text-accent-700 border-accent-100 hover:border-accent-500"
          : "bg-white text-primary-600 border-primary-200 hover:border-accent-500 hover:text-accent-600",
      )}
    >
      {children}
    </button>
  );
}

function TemplatePreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-primary-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl max-w-lg w-full p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="chip">{template.area}</span>
          {template.isFree ? (
            <span className="inline-flex items-center gap-1 text-success-500 text-[12px] font-medium">
              <Unlock size={11} /> Free 템플릿
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary-400 text-[12px] font-medium">
              <Lock size={11} /> Master 계약 시 잠금 해제
            </span>
          )}
        </div>
        <h3 className="h-3 mb-2">{template.name}</h3>
        <p className="body-sm text-primary-600 mb-6">{template.description}</p>

        <div className="border border-dashed border-primary-200 rounded-xl p-6 bg-bg-soft text-center">
          <FileText size={32} className="text-primary-300 mx-auto mb-2" />
          <p className="caption">미리보기 (실제 자문 시 PDF · Excel · Notion 형태로 전달)</p>
        </div>

        <button type="button" onClick={onClose} className="btn-secondary w-full mt-6">
          닫기
        </button>
      </motion.div>
    </div>
  );
}
