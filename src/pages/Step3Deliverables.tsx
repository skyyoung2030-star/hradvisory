import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { FileText, Lock, Unlock, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { TEMPLATES, PAIN_TO_AREA, type Template } from "@/lib/templates";
import { cn } from "@/lib/utils";

type DiagnoseState = { companySize: string; hrCapacity: string; pains: string[]; };

type TabKey = "ALL" | Template["area"];
const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "직급", label: "직급" }, { key: "평가", label: "평가" }, { key: "보상", label: "보상" },
  { key: "직무", label: "직무" }, { key: "승진", label: "승진" }, { key: "리더십", label: "리더십" },
  { key: "조직문화", label: "조직문화" },
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
    } catch { /* */ }
  }, []);

  const userAreas = useMemo(
    () => new Set(userPains.map((p) => PAIN_TO_AREA[p]).filter(Boolean) as Template["area"][]),
    [userPains],
  );
  const filtered = useMemo(
    () => active === "ALL" ? TEMPLATES : TEMPLATES.filter((t) => t.area === active),
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
        <p className="body text-ink-600 mb-6 max-w-[680px]">
          Master 자문에서는 제도를 같이 짜는 사이사이, 즉시 쓸 수 있는 매뉴얼과 템플릿을 전달드립니다.
          {userPains.length > 0 && (
            <> <strong className="text-accent-400">{Array.from(userAreas).join(" · ")}</strong> 영역이 강조됩니다.</>
          )}
        </p>

        <TabBar tabs={TABS} active={active} onChange={setActive} counts={countByArea} highlighted={userAreas} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {filtered.map((t, i) => (
            <motion.button
              key={t.id} type="button" onClick={() => setSelected(t)}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className={cn(
                "text-left p-4 rounded-xl border bg-white/[0.03] backdrop-blur transition-all relative overflow-hidden",
                "hover:border-accent-500/50 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]",
                "active:translate-y-0",
                userAreas.has(t.area) ? "border-accent-500/30" : "border-white/[0.08]",
              )}
            >
              {/* Top edge highlight */}
              <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.06] text-ink-700 border border-white/[0.06]">{t.area}</span>
                {t.isFree ? (
                  <span className="inline-flex items-center gap-1 text-success-500 text-[10px] font-bold uppercase tracking-wider"><Unlock size={10} /> Free</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-ink-500 text-[10px] font-bold uppercase tracking-wider"><Lock size={10} /> Master</span>
                )}
              </div>
              <div className="flex items-start gap-2.5">
                <FileText size={16} className="text-accent-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="body-sm font-semibold text-ink-900">{t.name}</div>
                  <div className="text-[13px] text-ink-500 mt-1 leading-snug">{t.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="caption mt-8">
          총 {TEMPLATES.length}개 템플릿 중 일부 미리보기.{" "}
          <span className="text-success-500 font-medium">Free</span>는 가입만 해도 받으실 수 있고,{" "}
          <span className="text-ink-700 font-medium">Master</span>는 자문 계약 시 잠금 해제됩니다.
        </p>
      </StepShell>

      {selected && <TemplatePreviewModal template={selected} onClose={() => setSelected(null)} />}

      <TourNav current={step} nextLabel="시뮬레이션 보기" />
    </>
  );
}

function TabBar({ tabs, active, onChange, counts, highlighted }: {
  tabs: { key: TabKey; label: string }[]; active: TabKey; onChange: (k: TabKey) => void;
  counts: Record<string, number>; highlighted: Set<Template["area"]>;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  return (
    <div className="relative border-b border-white/[0.08]">
      <div className="flex items-end gap-1 overflow-x-auto pb-0 -mb-px">
        {tabs.map((t) => {
          const isActive = active === t.key;
          const isHL = t.key !== "ALL" && highlighted.has(t.key as Template["area"]);
          return (
            <button
              key={t.key}
              ref={(el) => { refs.current[t.key] = el; }}
              type="button" onClick={() => onChange(t.key)}
              className={cn(
                "relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors",
                isActive ? "text-accent-400" : "text-ink-600 hover:text-ink-900",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {t.label}
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-full text-[10px] font-bold tabular-nums",
                  isActive ? "bg-accent-500 text-white shadow-[0_0_8px_-2px_rgba(14,165,233,0.6)]" : "bg-white/[0.06] text-ink-600",
                )}>{counts[t.key] ?? 0}</span>
                {isHL && !isActive && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />}
              </span>
            </button>
          );
        })}
      </div>
      <motion.span
        aria-hidden animate={pillStyle}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="absolute bottom-0 h-[2px] bg-accent-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"
      />
    </div>
  );
}

function TemplatePreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
        className="card max-w-lg w-full p-7 relative shadow-depth-3" onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg text-ink-500 hover:bg-white/[0.06] hover:text-ink-900 flex items-center justify-center transition-colors"
        ><X size={16} /></button>

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.06] text-ink-700">{template.area}</span>
          {template.isFree ? (
            <span className="inline-flex items-center gap-1 text-success-500 text-[10px] font-bold uppercase tracking-wider"><Unlock size={10} /> Free 템플릿</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-ink-500 text-[10px] font-bold uppercase tracking-wider"><Lock size={10} /> Master 잠금 해제</span>
          )}
        </div>
        <h3 className="h-3 mb-2">{template.name}</h3>
        <p className="body-sm text-ink-600 mb-6">{template.description}</p>

        <div className="border border-dashed border-white/15 rounded-xl p-6 bg-white/[0.02] text-center">
          <FileText size={32} className="text-ink-500 mx-auto mb-2" />
          <p className="caption">미리보기 (실제 자문 시 PDF · Excel · Notion 형태로 전달)</p>
        </div>

        <button type="button" onClick={onClose} className="btn-secondary w-full mt-6">닫기</button>
      </motion.div>
    </div>
  );
}
