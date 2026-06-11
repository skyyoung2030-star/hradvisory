import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { FileText, Lock, Unlock, Sparkles, X } from "lucide-react";
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

type TabKey = "ALL" | Template["area"];
const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL",        label: "전체" },
  { key: "직급",        label: "직급" },
  { key: "평가",        label: "평가" },
  { key: "보상",        label: "보상" },
  { key: "직무",        label: "직무" },
  { key: "승진",        label: "승진" },
  { key: "리더십",      label: "리더십" },
  { key: "조직문화",    label: "조직문화" },
];

export default function Step3Deliverables() {
  const step = getStepBySlug("3-deliverables")!;
  const [active, setActive] = useState<TabKey>("ALL");
  const [selected, setSelected] = useState<Template | null>(null);
  const [userPains, setUserPains] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hcg_tour_diagnose");
      if (raw) {
        const s = JSON.parse(raw) as DiagnoseState;
        setUserPains(s.pains || []);
        const firstArea = s.pains?.[0] && PAIN_TO_AREA[s.pains[0]];
        if (firstArea) setActive(firstArea);
      }
    } catch { /* ignore */ }
  }, []);

  const userAreas = useMemo(
    () =>
      new Set(
        userPains.map((p) => PAIN_TO_AREA[p]).filter(Boolean) as Template["area"][],
      ),
    [userPains],
  );

  const filtered = useMemo(
    () => (active === "ALL" ? TEMPLATES : TEMPLATES.filter((t) => t.area === active)),
    [active],
  );

  const countByArea = useMemo(() => {
    const map: Record<string, number> = { ALL: TEMPLATES.length };
    for (const t of TEMPLATES) map[t.area] = (map[t.area] ?? 0) + 1;
    return map;
  }, []);

  return (
    <>
      <StepShell step={step}>
        {userPains.length > 0 && (
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700 text-[12px] font-medium">
            <Sparkles size={12} />
            회사 맞춤: {Array.from(userAreas).join(" · ")} 영역이 강조됩니다
          </div>
        )}

        {/* Tab bar with sliding active indicator */}
        <TabBar
          tabs={TABS}
          active={active}
          onChange={setActive}
          counts={countByArea}
          highlighted={userAreas}
        />

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {filtered.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className={cn(
                "text-left p-4 rounded-xl border bg-white transition-all",
                "hover:border-accent-500 hover:shadow-[0_8px_24px_-12px_rgba(14,165,233,0.25)] hover:-translate-y-0.5",
                "active:translate-y-0",
                userAreas.has(t.area) ? "border-accent-500/40" : "border-primary-200",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary-100 text-primary-700">
                  {t.area}
                </span>
                {t.isFree ? (
                  <span className="inline-flex items-center gap-1 text-success-500 text-[11px] font-bold uppercase tracking-wider">
                    <Unlock size={10} /> Free
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-primary-400 text-[11px] font-bold uppercase tracking-wider">
                    <Lock size={10} /> Master
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
          <span className="text-success-500 font-medium">Free</span>는 가입만 해도 받으실 수 있고,{" "}
          <span className="text-primary-600 font-medium">Master</span>는 자문 계약 시 잠금 해제됩니다.
        </p>
      </StepShell>

      {selected && (
        <TemplatePreviewModal template={selected} onClose={() => setSelected(null)} />
      )}

      <TourNav current={step} nextLabel="6개월 프로세스" />
    </>
  );
}

/* ───────── Tab bar with sliding active indicator ───────── */

function TabBar({
  tabs,
  active,
  onChange,
  counts,
  highlighted,
}: {
  tabs: { key: TabKey; label: string }[];
  active: TabKey;
  onChange: (k: TabKey) => void;
  counts: Record<string, number>;
  highlighted: Set<Template["area"]>;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) {
      setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active]);

  return (
    <div className="relative border-b border-primary-200">
      <div className="flex items-end gap-1 overflow-x-auto pb-0 -mb-px">
        {tabs.map((t) => {
          const isActive = active === t.key;
          const isHighlighted =
            t.key !== "ALL" && highlighted.has(t.key as Template["area"]);
          return (
            <button
              key={t.key}
              ref={(el) => { refs.current[t.key] = el; }}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "text-accent-600"
                  : "text-primary-500 hover:text-primary-800",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {t.label}
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-full text-[10px] font-bold tabular-nums",
                    isActive
                      ? "bg-accent-500 text-white"
                      : "bg-primary-100 text-primary-500",
                  )}
                >
                  {counts[t.key] ?? 0}
                </span>
                {isHighlighted && !isActive && (
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 rounded-full bg-accent-500"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      {/* Sliding active indicator */}
      <motion.span
        aria-hidden
        animate={pillStyle}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="absolute bottom-0 h-[2px] bg-accent-500 rounded-full"
      />
    </div>
  );
}

function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
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
        className="bg-white rounded-2xl max-w-lg w-full p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-700 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary-100 text-primary-700">
            {template.area}
          </span>
          {template.isFree ? (
            <span className="inline-flex items-center gap-1 text-success-500 text-[11px] font-bold uppercase tracking-wider">
              <Unlock size={10} /> Free 템플릿
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary-400 text-[11px] font-bold uppercase tracking-wider">
              <Lock size={10} /> Master 계약 시 잠금 해제
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
