import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { FileText, Sparkles, X, FileType2 } from "lucide-react";
import { motion } from "framer-motion";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { TEMPLATES, PAIN_TO_AREA, PAIN_TO_AREAS, type Template } from "@/lib/templates";
import { TemplatePreview } from "@/components/TemplatePreview";
import { cn } from "@/lib/utils";

type DiagnoseState = { companySize: string; hrCapacity: string; pains: string[]; };

type TabKey = "ALL" | Template["area"];
const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "직급", label: "직급" }, { key: "평가", label: "평가" }, { key: "보상", label: "보상" },
  { key: "직무", label: "직무" }, { key: "승진", label: "승진" }, { key: "리더십", label: "리더십" },
  { key: "조직문화", label: "조직문화" },
  { key: "AI", label: "AI" },
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
        // 페인이 1개일 때만 그 area로 진입 — 여러 개 선택 시엔 ALL 유지
        // (특정 area를 무작위로 우선시키지 않음)
        if (s.pains?.length === 1) {
          const firstArea = PAIN_TO_AREA[s.pains[0]];
          if (firstArea) setActive(firstArea);
        }
      }
    } catch { /* */ }
  }, []);

  const userAreas = useMemo(
    () => new Set(userPains.flatMap((p) => PAIN_TO_AREAS[p] ?? []) as Template["area"][]),
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
        <p
          className="body text-ink-600"
          style={{ display: "block", margin: 0, marginBottom: 24, padding: 0, position: "static" }}
        >
          Master 자문에서는 제도를 같이 짜는 사이사이, 즉시 쓸 수 있는 매뉴얼과 템플릿을 전달드립니다. 국내 굴지의 대기업·중견기업 컨설팅 프로젝트에서 만들어진 자료를 라이브러리화한 것입니다.
          {userPains.length > 0 && (
            <> 회사 페인포인트 기반으로 <strong className="text-accent-400">{
              Array.from(userAreas)
                .sort((a, b) => (a === "조직문화" ? 1 : 0) - (b === "조직문화" ? 1 : 0))
                .join(" · ")
            }</strong> 영역이 강조됩니다.</>
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
                "text-left p-4 rounded-xl border bg-white/[0.03] backdrop-blur transition-all relative overflow-hidden h-full flex flex-col",
                "hover:border-accent-500/50 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]",
                "active:translate-y-0",
                userAreas.has(t.area) ? "border-accent-500/30" : "border-white/[0.08]",
              )}
            >
              <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.06] text-ink-700 border border-white/[0.06]">{t.area}</span>
                <span className="inline-flex items-center gap-1 text-ink-500 text-[10px] font-mono uppercase tracking-wider">
                  {t.format.split(" ")[0]}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <FileText size={16} className="text-accent-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="body-sm font-semibold text-ink-900 leading-snug">{t.name}</div>
                  <div className="text-[12px] text-ink-500 mt-1 leading-snug">{t.description}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <div className="text-[11px] text-accent-400/90 leading-snug flex items-start gap-1.5">
                  <Sparkles size={10} className="mt-0.5 flex-shrink-0" />
                  <span>{t.highlight}</span>
                </div>
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between text-[10px] font-mono text-ink-500">
                <span className="truncate">{t.format}</span>
                {t.pages && <span className="flex-shrink-0 ml-2">{t.pages}</span>}
              </div>
            </motion.button>
          ))}
        </div>

        <p
          className="caption"
          style={{ display: "block", margin: 0, marginTop: 32, padding: 0, position: "static" }}
        >
          총 {TEMPLATES.length}개 매뉴얼·템플릿 중 일부 미리보기. 실제 자문에서는 회사 상황에 맞게 컨설턴트가 함께 적용해드립니다.
        </p>
      </StepShell>

      {selected && <TemplateModal template={selected} onClose={() => setSelected(null)} />}

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

/* ─────────────── Template detail modal — preview-only ─────────────── */
function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
        className="card max-w-2xl w-full p-7 relative shadow-depth-3 my-8 max-h-[calc(100vh-4rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg text-ink-500 hover:bg-white/[0.06] hover:text-ink-900 flex items-center justify-center transition-colors z-10"
        ><X size={16} /></button>

        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.06] text-ink-700">{template.area}</span>
        </div>
        <h3
          className="h-3"
          style={{ display: "block", margin: 0, marginBottom: 8, padding: 0, position: "static" }}
        >{template.name}</h3>
        <p
          className="body-sm text-ink-600"
          style={{ display: "block", margin: 0, marginBottom: 16, padding: 0, position: "static" }}
        >{template.description}</p>

        {/* Highlight banner */}
        <div className="mb-5 p-3 rounded-lg bg-accent-500/[0.08] border border-accent-500/20">
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-accent-400 mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-accent-300 font-medium leading-snug">{template.highlight}</p>
          </div>
        </div>

        {/* Visual mock preview */}
        <div className="mb-5">
          <TemplatePreview template={template} />
        </div>

        {/* Contents list */}
        <div className="mb-5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-3">
            포함 내용
          </div>
          <ul className="space-y-2">
            {template.contents.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink-700 leading-relaxed">
                <span className="text-accent-400 mt-0.5 font-mono text-[10px] flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Format/pages meta */}
        <div className="flex items-center gap-4 text-[12px] text-ink-500 pt-4 border-t border-white/[0.06]">
          <span className="inline-flex items-center gap-1.5">
            <FileType2 size={12} />
            {template.format}
          </span>
          {template.pages && (
            <>
              <span className="opacity-40">·</span>
              <span>{template.pages}</span>
            </>
          )}
        </div>

        <button type="button" onClick={onClose} className="btn-secondary w-full mt-6">닫기</button>
      </motion.div>
    </div>
  );
}