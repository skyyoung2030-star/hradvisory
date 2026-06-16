import type { Template } from "@/lib/templates";

/**
 * Mock visual previews for each individual template (24 in total).
 * Switches on template.id, not area, so every entry in a given area
 * gets its own distinct visualization.
 *
 * Each preview is sized to fit a ~640x240 slot inside the modal.
 */
export function TemplatePreview({ template }: { template: Template }) {
  switch (template.id) {
    /* 직급 */
    case "grade_integration_guide":     return <GradeStageComparison />;
    case "grade_qualification_template":return <GradeRoleMatrix />;
    case "grade_transition_scenario":   return <GradeTransitionFlow />;
    /* 평가 */
    case "okr_dictionary":              return <OkrCycle />;
    case "evaluation_scale_guide":      return <GradeDistribution />;
    case "workway_diagnosis":           return <WorkWayMatrix />;
    case "checkin_meeting_guide":       return <CheckinCalendar />;
    case "calibration_session_manual":  return <CalibrationFlow />;
    /* 보상 */
    case "payband_simulator":           return <PayBandChart />;
    case "compa_ratio_management":      return <PayZoneGrid />;
    case "salary_increase_matrix":      return <SalaryMatrix />;
    case "incentive_design":            return <IncentiveBars />;
    /* 직무 */
    case "job_family_matrix":           return <JobFamilyMatrixView />;
    case "job_description_template":    return <JobDescriptionView />;
    case "job_competency_diagnosis":    return <CompetencyLevelView />;
    /* 승진 */
    case "promotion_session_manual":    return <PromotionScreeningFlow />;
    case "promotion_candidate_profile": return <CandidateProfileView />;
    case "promotion_rate_management":   return <PromotionRateBars />;
    /* 리더십 */
    case "leadership_360_diagnosis":    return <LeadershipRadar />;
    case "leadership_competency_model": return <LeadershipCompetencyTable />;
    case "leadership_coaching_program": return <LeadershipSnapshot />;
    case "leader_succession_planning":  return <SuccessionPipeline />;
    /* 조직문화 */
    case "employee_engagement_survey":  return <EngagementQuadrant />;
    case "culture_improvement_program": return <CultureProgramList />;
    case "culture_action_workshop":     return <CultureCycle />;
    default:                            return <GenericDocPreview />;
  }
}

/* ────────────────────────────────────────────────
   Shared frame
   ──────────────────────────────────────────────── */
function PreviewFrame({ title, children, height = 220 }: { title: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-lg overflow-hidden" style={{ height }}>
      <span className="absolute top-2 right-3 text-[9px] font-mono font-bold tracking-[0.22em] text-ink-500/60 uppercase pointer-events-none">PREVIEW</span>
      <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="text-[11px] font-mono font-semibold text-ink-700 truncate">{title}</div>
      </div>
      <div className="p-4 h-[calc(100%-37px)] overflow-hidden">{children}</div>
    </div>
  );
}

const ACCENT = "#0EA5E9", ACCENT_LIGHT = "#38BDF8", MUTED = "#71717A", INK = "#A1A1AA", SOFT_TEXT = "#D4D4D8";

/* ════════════════ 직급 ════════════════ */

function GradeStageComparison() {
  const opts = [
    { name: "2단계", levels: ["G2", "G1"], note: "수용성 ↓" },
    { name: "3단계", levels: ["G3", "G2", "G1"], note: "추천", featured: true },
    { name: "4단계", levels: ["G4", "G3", "G2", "G1"], note: "효과 미미" },
  ];
  return (
    <PreviewFrame title="직급체계 통합 시나리오.pdf">
      <div className="grid grid-cols-3 gap-3 h-full">
        {opts.map((o) => (
          <div key={o.name} className={`flex flex-col items-center justify-end gap-1 p-2 rounded border ${o.featured ? "border-accent-500/40 bg-accent-500/10" : "border-white/[0.06] bg-white/[0.02]"}`}>
            <div className="flex flex-col-reverse gap-0.5 mb-1 w-full">
              {o.levels.map((l, i) => (
                <div key={i} className={`text-center text-[9px] py-0.5 rounded-sm font-mono ${o.featured ? "bg-accent-500/30 text-accent-200" : "bg-white/[0.05] text-ink-600"}`}>{l}</div>
              ))}
            </div>
            <div className={`text-[10px] font-bold ${o.featured ? "text-accent-300" : "text-ink-700"}`}>{o.name}</div>
            <div className={`text-[9px] font-mono ${o.featured ? "text-accent-400" : "text-ink-500"}`}>{o.note}</div>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function GradeRoleMatrix() {
  const rows = [
    { g: "G3", role: "조직 리딩", years: "8년", title: "수석" },
    { g: "G2", role: "업무 전문가", years: "7년", title: "책임" },
    { g: "G1", role: "업무 실무자", years: "5년", title: "선임" },
  ];
  return (
    <PreviewFrame title="직급별 자격 기준.xlsx">
      <table className="w-full text-[11px] font-mono">
        <thead>
          <tr className="border-b border-white/[0.08]">
            <th className="text-left py-1.5 px-1 text-ink-500 font-semibold">Grade</th>
            <th className="text-left py-1.5 px-1 text-ink-500 font-semibold">역할</th>
            <th className="text-left py-1.5 px-1 text-ink-500 font-semibold">호칭</th>
            <th className="text-right py-1.5 px-1 text-ink-500 font-semibold">체류</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/[0.04]">
              <td className="py-2 px-1"><span className="inline-block px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 text-[10px] font-bold">{r.g}</span></td>
              <td className="py-2 px-1 text-ink-700 font-sans">{r.role}</td>
              <td className="py-2 px-1 text-ink-700 font-sans">{r.title}</td>
              <td className="py-2 px-1 text-right text-ink-600 tabular-nums">{r.years}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PreviewFrame>
  );
}

function GradeTransitionFlow() {
  return (
    <PreviewFrame title="직급 전환 시나리오.pdf">
      <svg viewBox="0 0 320 160" className="w-full h-full">
        {/* As-Is (6단계) → To-Be (4단계) */}
        <text x="40" y="14" fontSize="9" fill={MUTED} fontFamily="JetBrains Mono">AS-IS (6)</text>
        {["부장","차장","과장","대리","주임","사원"].map((l, i) => (
          <g key={i} transform={`translate(20, ${20 + i * 20})`}>
            <rect width="80" height="16" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
            <text x="40" y="11" fontSize="9" fill={SOFT_TEXT} textAnchor="middle">{l}</text>
          </g>
        ))}
        <text x="240" y="14" fontSize="9" fill={ACCENT_LIGHT} fontFamily="JetBrains Mono">TO-BE (4)</text>
        {[
          { l: "G4 수석", y: 20 }, { l: "G3 책임", y: 50 },
          { l: "G2 선임", y: 80 }, { l: "G1 전임", y: 110 },
        ].map((b, i) => (
          <g key={i} transform={`translate(220, ${b.y})`}>
            <rect width="80" height="26" rx="2" fill="rgba(14,165,233,0.15)" stroke={ACCENT} />
            <text x="40" y="17" fontSize="10" fill={ACCENT_LIGHT} textAnchor="middle" fontWeight="bold">{b.l}</text>
          </g>
        ))}
        {[20, 40, 60, 80, 100, 120].map((y, i) => {
          const targetY = [25, 25, 55, 55, 85, 115][i] + 8;
          return <path key={i} d={`M 100 ${y + 8} L 220 ${targetY}`} stroke={ACCENT} strokeWidth="0.5" opacity="0.5" />;
        })}
      </svg>
    </PreviewFrame>
  );
}

/* ════════════════ 평가 ════════════════ */

function OkrCycle() {
  const steps = [
    { l: "목표\nObjectives", x: 60, y: 50 },
    { l: "핵심결과\nKey Results", x: 180, y: 50 },
    { l: "점검\nCheck", x: 180, y: 130 },
    { l: "회고\nRetro", x: 60, y: 130 },
  ];
  return (
    <PreviewFrame title="OKR Dictionary.notion">
      <svg viewBox="0 0 280 180" className="w-full h-full">
        {/* Arrows around the cycle */}
        <path d="M 90 50 Q 120 30 150 50" fill="none" stroke={ACCENT} strokeWidth="1" markerEnd="url(#a1)" />
        <path d="M 180 80 Q 200 105 180 130" fill="none" stroke={ACCENT} strokeWidth="1" markerEnd="url(#a1)" />
        <path d="M 150 130 Q 120 150 90 130" fill="none" stroke={ACCENT} strokeWidth="1" markerEnd="url(#a1)" />
        <path d="M 60 110 Q 40 90 60 70" fill="none" stroke={ACCENT} strokeWidth="1" markerEnd="url(#a1)" />
        <defs><marker id="a1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} /></marker></defs>
        {steps.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="22" fill="rgba(14,165,233,0.15)" stroke={ACCENT} strokeWidth="1.5" />
            <text x={s.x} y={s.y - 2} fontSize="9" fill={ACCENT_LIGHT} textAnchor="middle" fontWeight="bold">{s.l.split("\n")[0]}</text>
            <text x={s.x} y={s.y + 9} fontSize="7" fill={MUTED} textAnchor="middle" fontFamily="JetBrains Mono">{s.l.split("\n")[1]}</text>
          </g>
        ))}
        <text x="140" y="92" fontSize="9" fill={MUTED} textAnchor="middle" fontFamily="JetBrains Mono">분기 사이클</text>
      </svg>
    </PreviewFrame>
  );
}

function GradeDistribution() {
  const grades = [
    { g: "S", pct: 10, h: 24 }, { g: "A", pct: 20, h: 48 },
    { g: "B", pct: 50, h: 120 }, { g: "C", pct: 15, h: 36 },
    { g: "D", pct: 5, h: 12 },
  ];
  return (
    <PreviewFrame title="평가 등급 분포 가이드.pdf">
      <div className="flex items-end justify-around h-[140px] gap-2">
        {grades.map((g, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold text-ink-700 tabular-nums">{g.pct}%</span>
            <div className="w-full rounded-sm bg-accent-500" style={{ height: `${g.h}px`, opacity: 0.3 + g.pct * 0.014 }} />
            <span className="text-[10px] font-bold text-ink-800">{g.g}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] font-mono text-ink-500 mt-1 text-center">권장 분포</p>
    </PreviewFrame>
  );
}

function WorkWayMatrix() {
  const items = [
    { l: "결과 지향", v: "강점" }, { l: "결단력", v: "강점" },
    { l: "팀워크", v: "보통" }, { l: "혁신", v: "보완" },
    { l: "책임감", v: "강점" }, { l: "변화관리", v: "보완" },
  ];
  const color = (v: string) => v === "강점" ? "bg-success-500/30 text-success-500 border-success-500/40"
                            : v === "보통" ? "bg-white/[0.05] text-ink-600 border-white/10"
                            : "bg-warning-500/15 text-warning-500 border-warning-500/30";
  return (
    <PreviewFrame title="Work Way 다면진단.xlsx">
      <div className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-md bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] text-ink-700">{it.l}</span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${color(it.v)}`}>{it.v}</span>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function CheckinCalendar() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const checkins = [2, 5, 8, 11]; // 분기별 1:1 미팅 표시
  return (
    <PreviewFrame title="Check-in 미팅 사이클.notion">
      <div className="grid grid-cols-12 gap-1 mt-2">
        {months.map((m, i) => {
          const has = checkins.includes(i);
          return (
            <div key={i} className={`flex flex-col items-center gap-1 py-2 rounded border ${has ? "border-accent-500/40 bg-accent-500/15" : "border-white/[0.06] bg-white/[0.02]"}`}>
              <span className={`text-[9px] font-mono ${has ? "text-accent-300" : "text-ink-500"}`}>{m}</span>
              {has && <div className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_6px_rgba(14,165,233,0.8)]" />}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] font-mono text-ink-500 mt-3 text-center">분기별 1:1 Check-in 미팅 (최소 연 4회)</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px]">
        <div className="p-1.5 rounded bg-white/[0.03] text-ink-600 text-center">목표 점검</div>
        <div className="p-1.5 rounded bg-white/[0.03] text-ink-600 text-center">장애 해소</div>
        <div className="p-1.5 rounded bg-white/[0.03] text-ink-600 text-center">우선순위 재설정</div>
      </div>
    </PreviewFrame>
  );
}

function CalibrationFlow() {
  return (
    <PreviewFrame title="Calibration Session 매뉴얼.pdf">
      <svg viewBox="0 0 320 160" className="w-full h-full">
        {/* 1차 평가자 → 2차 평가자 → Calibration Session → 최종 */}
        {[
          { x: 10, y: 30, l: "1차 평가자", s: "팀장" },
          { x: 120, y: 30, l: "Calibration", s: "협의" },
          { x: 230, y: 30, l: "2차 평가자", s: "본부장" },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width="80" height="40" rx="3" fill={i === 1 ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.04)"} stroke={i === 1 ? ACCENT : "rgba(255,255,255,0.1)"} />
            <text x={b.x + 40} y={b.y + 18} fontSize="10" fill={i === 1 ? ACCENT_LIGHT : SOFT_TEXT} textAnchor="middle" fontWeight="bold">{b.l}</text>
            <text x={b.x + 40} y={b.y + 32} fontSize="9" fill={MUTED} textAnchor="middle" fontFamily="JetBrains Mono">{b.s}</text>
          </g>
        ))}
        <path d="M 90 50 L 120 50" stroke={ACCENT} strokeWidth="1" markerEnd="url(#a2)" />
        <path d="M 200 50 L 230 50" stroke={ACCENT} strokeWidth="1" markerEnd="url(#a2)" />
        <defs><marker id="a2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} /></marker></defs>
        {/* Distribution bar at bottom */}
        <text x="10" y="100" fontSize="9" fill={MUTED} fontFamily="JetBrains Mono">조정 후 분포:</text>
        <g transform="translate(10, 110)">
          <rect width="30" height="14" fill="rgba(14,165,233,0.6)" /><text x="15" y="22" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">S 10%</text>
          <rect x="30" width="60" height="14" fill="rgba(14,165,233,0.45)" /><text x="60" y="22" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">A 20%</text>
          <rect x="90" width="150" height="14" fill="rgba(14,165,233,0.3)" /><text x="165" y="22" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">B 50%</text>
          <rect x="240" width="45" height="14" fill="rgba(14,165,233,0.18)" /><text x="262" y="22" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">C 15%</text>
          <rect x="285" width="15" height="14" fill="rgba(14,165,233,0.1)" /><text x="292" y="22" fontSize="7" fill={INK} textAnchor="middle">D</text>
        </g>
      </svg>
    </PreviewFrame>
  );
}

/* ════════════════ 보상 ════════════════ */

function PayBandChart() {
  const bands = [
    { level: "G1", min: 10, mid: 18, max: 28 },
    { level: "G2", min: 18, mid: 30, max: 42 },
    { level: "G3", min: 30, mid: 45, max: 60 },
    { level: "G4", min: 45, mid: 62, max: 80 },
  ];
  return (
    <PreviewFrame title="Pay Band Simulator.xlsx">
      <svg viewBox="0 0 320 140" className="w-full h-full">
        {bands.map((b, i) => {
          const y = 14 + i * 28;
          return (
            <g key={i}>
              <text x="0" y={y + 4} fontSize="9" fill={INK} fontFamily="JetBrains Mono">{b.level}</text>
              <rect x={26 + b.min * 2.8} y={y - 5} height="10" width={(b.max - b.min) * 2.8} fill="rgba(14,165,233,0.2)" stroke={ACCENT} strokeWidth="0.5" rx="2" />
              <circle cx={26 + b.mid * 2.8} cy={y} r="3.5" fill={ACCENT_LIGHT} />
              <text x={26 + b.min * 2.8} y={y - 8} fontSize="7" fill={MUTED} fontFamily="JetBrains Mono">Min</text>
              <text x={26 + b.max * 2.8} y={y - 8} fontSize="7" fill={MUTED} fontFamily="JetBrains Mono" textAnchor="end">Max</text>
            </g>
          );
        })}
      </svg>
    </PreviewFrame>
  );
}

function PayZoneGrid() {
  return (
    <PreviewFrame title="Compa-Ratio 관리.xlsx">
      <div className="space-y-2">
        <div className="text-[10px] font-mono text-ink-500">직급별 Pay Zone (3구간)</div>
        {["G3","G2","G1"].map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-ink-600 w-6">{g}</span>
            <div className="flex-1 grid grid-cols-3 gap-0.5 h-7">
              <div className="bg-warning-500/30 border border-warning-500/40 rounded-l flex items-center justify-center text-[9px] font-mono font-bold text-warning-500">
                +{(i + 1) * 2}%
              </div>
              <div className="bg-white/[0.06] border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-ink-700">
                +{i + 4}%
              </div>
              <div className="bg-success-500/15 border border-success-500/30 rounded-r flex items-center justify-center text-[9px] font-mono font-bold text-success-500">
                +{i + 2}%
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between text-[9px] font-mono text-ink-500 pl-8 pt-1">
          <span>1st Zone</span><span>2nd Zone</span><span>3rd Zone</span>
        </div>
        <p className="text-[10px] text-ink-500 text-center mt-2">하위 구간에 더 큰 인상으로 중심값 수렴 유도</p>
      </div>
    </PreviewFrame>
  );
}

function SalaryMatrix() {
  const grades = [
    { g: "S", pct: 7.7, color: "bg-success-500", w: "w-[90%]" },
    { g: "A", pct: 6.4, color: "bg-success-500/70", w: "w-[78%]" },
    { g: "B", pct: 4.9, color: "bg-accent-500/60", w: "w-[60%]" },
    { g: "C", pct: 2.3, color: "bg-warning-500/40", w: "w-[28%]" },
    { g: "D", pct: 0.8, color: "bg-danger-500/30", w: "w-[10%]" },
  ];
  return (
    <PreviewFrame title="성과 기반 임금 인상 Matrix.xlsx">
      <div className="space-y-2">
        {grades.map((g) => (
          <div key={g.g} className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-ink-800 w-4">{g.g}</span>
            <div className="flex-1 h-5 bg-white/[0.03] rounded relative overflow-hidden">
              <div className={`h-full ${g.color} ${g.w} rounded`} />
            </div>
            <span className="text-[11px] font-mono font-bold text-ink-700 tabular-nums w-12 text-right">{g.pct}%</span>
          </div>
        ))}
        <p className="text-[10px] text-ink-500 text-center pt-1">평가 등급별 인상률 (AON Korea 벤치마크)</p>
      </div>
    </PreviewFrame>
  );
}

function IncentiveBars() {
  const items = [
    { l: "기본급 (1200%)", w: 70, color: "bg-accent-500/60" },
    { l: "고정상여 (300%)", w: 17, color: "bg-accent-500/40" },
    { l: "성과상여 (100%)", w: 7, color: "bg-warning-500/50" },
    { l: "PS (영업이익 2.1%)", w: 6, color: "bg-success-500/50" },
  ];
  return (
    <PreviewFrame title="경영성과급 설계.xlsx">
      <div className="space-y-2.5">
        <div className="text-[10px] font-mono text-ink-500 mb-1">연봉 구성 비중 (제조업 A사 사례)</div>
        {items.map((it, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-ink-700">{it.l}</span>
              <span className="font-mono font-bold text-ink-600">{it.w}%</span>
            </div>
            <div className="h-3 bg-white/[0.03] rounded overflow-hidden">
              <div className={`h-full ${it.color} rounded`} style={{ width: `${it.w}%` }} />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-ink-500 text-center pt-1">목표 85% Circuit Breaker</p>
      </div>
    </PreviewFrame>
  );
}

/* ════════════════ 직무 ════════════════ */

function JobFamilyMatrixView() {
  const cols = ["JF1", "JF2", "JF3", "JF4"];
  const rows = [
    { name: "전략기획", c: [1, 1, 0, 0] }, { name: "운영", c: [1, 1, 1, 0] },
    { name: "개발", c: [0, 1, 1, 1] }, { name: "지원", c: [0, 0, 1, 1] },
  ];
  return (
    <PreviewFrame title="Job Family Matrix.xlsx">
      <table className="w-full text-[10px] font-mono">
        <thead><tr><th className="text-left text-ink-500 pb-2">직무</th>{cols.map((c) => <th key={c} className="text-center text-ink-500 pb-2 w-10">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i} className="border-t border-white/[0.06]">
            <td className="py-2 text-ink-700 font-sans">{r.name}</td>
            {r.c.map((v, j) => <td key={j} className="text-center py-2">{v ? <span className="inline-block w-4 h-4 rounded bg-accent-500/40 border border-accent-500/60" /> : <span className="inline-block w-4 h-4 rounded bg-white/[0.03] border border-white/[0.08]" />}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </PreviewFrame>
  );
}

function JobDescriptionView() {
  return (
    <PreviewFrame title="직무기술서.docx">
      <div className="text-[11px] space-y-2">
        <div className="flex justify-between border-b border-white/[0.08] pb-1.5">
          <span className="font-mono text-ink-500">직무명</span><span className="font-semibold text-ink-800">HR Business Partner</span>
        </div>
        <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
          <span className="font-mono text-ink-500">직군 / 직렬</span><span className="text-ink-700">경영지원 / 인사</span>
        </div>
        <div className="border-b border-white/[0.06] pb-1.5">
          <div className="font-mono text-ink-500 mb-1">주요 책임</div>
          <ul className="space-y-0.5 text-ink-700 pl-2">
            <li>· 사업부 인사전략 수립 및 실행</li>
            <li>· 채용·평가·보상 운영 지원</li>
            <li>· 조직 진단 및 개선과제 도출</li>
          </ul>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-ink-500">필요 역량</span><span className="text-accent-400">전략적 사고 · 커뮤니케이션 · 데이터 분석</span>
        </div>
      </div>
    </PreviewFrame>
  );
}

function CompetencyLevelView() {
  const comps = [
    { l: "전략적 사고", lvl: 4 }, { l: "데이터 분석", lvl: 5 },
    { l: "프로젝트 관리", lvl: 3 }, { l: "커뮤니케이션", lvl: 4 },
  ];
  return (
    <PreviewFrame title="직무역량 진단지.xlsx">
      <div className="space-y-2.5">
        {comps.map((c, i) => (
          <div key={i}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-ink-700">{c.l}</span>
              <span className="font-mono font-bold text-accent-400">Lv. {c.lvl}</span>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((n) => (
                <div key={n} className={`flex-1 h-3 rounded-sm ${n <= c.lvl ? "bg-accent-500 shadow-[0_0_4px_rgba(14,165,233,0.5)]" : "bg-white/[0.05]"}`} />
              ))}
            </div>
          </div>
        ))}
        <p className="text-[9px] font-mono text-ink-500 text-center pt-1">Level 1(인지) → 5(전문가)</p>
      </div>
    </PreviewFrame>
  );
}

/* ════════════════ 승진 ════════════════ */

function PromotionScreeningFlow() {
  return (
    <PreviewFrame title="승진 Session 매뉴얼.pdf">
      <svg viewBox="0 0 320 160" className="w-full h-full">
        {[
          { x: 5, y: 35, l: "체류연한", s: "충족자", c: "rgba(255,255,255,0.04)" },
          { x: 75, y: 35, l: "1차 Screening", s: "Hurdle", c: "rgba(14,165,233,0.1)" },
          { x: 170, y: 35, l: "2차 Selecting", s: "Session", c: "rgba(14,165,233,0.2)" },
          { x: 265, y: 35, l: "발령", s: "확정", c: "rgba(16,185,129,0.15)" },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={i === 1 || i === 2 ? "85" : "65"} height="40" rx="3" fill={b.c} stroke={i >= 1 && i <= 2 ? ACCENT : "rgba(255,255,255,0.1)"} />
            <text x={b.x + (i === 1 || i === 2 ? 42 : 32)} y={b.y + 18} fontSize="9" fill={i >= 1 && i <= 2 ? ACCENT_LIGHT : SOFT_TEXT} textAnchor="middle" fontWeight="bold">{b.l}</text>
            <text x={b.x + (i === 1 || i === 2 ? 42 : 32)} y={b.y + 30} fontSize="8" fill={MUTED} textAnchor="middle" fontFamily="JetBrains Mono">{b.s}</text>
          </g>
        ))}
        <path d="M 70 55 L 75 55" stroke={ACCENT} strokeWidth="1" /><path d="M 160 55 L 170 55" stroke={ACCENT} strokeWidth="1" /><path d="M 255 55 L 265 55" stroke={ACCENT} strokeWidth="1" />
        <text x="160" y="100" fontSize="9" fill={MUTED} textAnchor="middle" fontFamily="JetBrains Mono">심사 가중치</text>
        <g transform="translate(40, 110)">
          {[
            { w: 35, c: "rgba(14,165,233,0.6)", l: "전문성 35%" },
            { w: 35, c: "rgba(14,165,233,0.45)", l: "리더자질 35%" },
            { w: 15, c: "rgba(14,165,233,0.3)", l: "사례 10%" },
            { w: 15, c: "rgba(14,165,233,0.2)", l: "평가 10%" },
          ].reduce((acc, item, i) => {
            const x = acc.acc;
            acc.children.push(
              <g key={i}>
                <rect x={x * 2.4} width={item.w * 2.4} height="14" fill={item.c} />
                <text x={x * 2.4 + (item.w * 2.4) / 2} y="9" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold">{item.l}</text>
              </g>
            );
            acc.acc += item.w;
            return acc;
          }, { acc: 0, children: [] as JSX.Element[] }).children}
        </g>
      </svg>
    </PreviewFrame>
  );
}

function CandidateProfileView() {
  return (
    <PreviewFrame title="승진 후보자 Profile.pptx">
      <div className="text-[10px] space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center font-bold text-white text-[11px]">홍</div>
            <div><div className="font-bold text-ink-900 text-[11px]">홍길동</div><div className="font-mono text-ink-500">G3 · 6년차</div></div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 text-[9px] font-bold">후보</span>
        </div>
        <div>
          <div className="font-mono text-ink-500 mb-1">최근 3개년 평가</div>
          <div className="flex gap-1">
            {["B","B","A","S"].map((g, i) => {
              const c = g === "S" ? "bg-success-500" : g === "A" ? "bg-accent-500" : "bg-white/[0.08]";
              return <div key={i} className={`flex-1 py-1 rounded text-center text-[10px] font-bold ${c} ${g === "S" || g === "A" ? "text-white" : "text-ink-700"}`}>{g}</div>;
            })}
          </div>
        </div>
        <div>
          <div className="font-mono text-ink-500 mb-1">강점</div>
          <div className="flex flex-wrap gap-1">
            {["결과지향","책임감","열린소통"].map((s) => <span key={s} className="px-1.5 py-0.5 rounded bg-success-500/15 text-success-500 text-[9px] font-mono">{s}</span>)}
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

function PromotionRateBars() {
  const rates = [
    { from: "사원→주임", rate: 98 }, { from: "주임→대리", rate: 93 },
    { from: "대리→과장", rate: 80 }, { from: "과장→차장", rate: 65 },
    { from: "차장→부장", rate: 56 },
  ];
  return (
    <PreviewFrame title="승진율 관리.xlsx">
      <div className="space-y-2">
        {rates.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-ink-600 w-20">{r.from}</span>
            <div className="flex-1 h-5 bg-white/[0.03] rounded relative overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-600 to-accent-400 rounded shadow-[0_0_8px_-2px_rgba(14,165,233,0.6)]" style={{ width: `${r.rate}%` }} />
            </div>
            <span className="text-[10px] font-mono font-bold text-ink-700 tabular-nums w-9 text-right">{r.rate}%</span>
          </div>
        ))}
        <p className="text-[9px] font-mono text-ink-500 text-center pt-1">3개년 평균 직급별 승진율</p>
      </div>
    </PreviewFrame>
  );
}

/* ════════════════ 리더십 ════════════════ */

function LeadershipRadar() {
  const axes = ["소통", "의사결정", "코칭", "비전", "실행", "윤리"];
  const score = [78, 65, 72, 58, 82, 90];
  const cx = 70, cy = 70, r = 50;
  const points = axes.map((_, i) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const dist = (score[i] / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist];
  });
  return (
    <PreviewFrame title="팀장 360도 진단.pdf">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 140 140" className="w-[140px] h-[140px] flex-shrink-0">
          {[0.33, 0.66, 1].map((g, gi) => (
            <polygon key={gi} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              points={axes.map((_, i) => { const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2; return `${cx + Math.cos(a) * r * g},${cy + Math.sin(a) * r * g}`; }).join(" ")} />
          ))}
          <polygon points={points.map((p) => p.join(",")).join(" ")} fill="rgba(14,165,233,0.25)" stroke={ACCENT} strokeWidth="1.5" />
          {points.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={ACCENT_LIGHT} />)}
        </svg>
        <div className="flex flex-col gap-1 text-[10px]">
          {axes.map((a, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="text-ink-600">{a}</span>
              <span className="font-mono font-bold text-ink-900 tabular-nums">{score[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

function LeadershipCompetencyTable() {
  const groups = [
    { area: "Performance", items: ["결단력", "전략적 사고", "전문성"] },
    { area: "People", items: ["동기부여", "팀워크", "공정성"] },
  ];
  return (
    <PreviewFrame title="리더십 역량 모델.pdf">
      <div className="space-y-3">
        {groups.map((g, i) => (
          <div key={i}>
            <div className="text-[10px] font-mono font-bold tracking-wider text-accent-400 uppercase mb-1.5">{g.area}</div>
            <div className="grid grid-cols-3 gap-1.5">
              {g.items.map((it, j) => (
                <div key={j} className="p-2 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-ink-700 text-center">{it}</div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[10px] font-mono text-ink-500 text-center mt-2">6대 핵심 역량 × 행동지표 24개</p>
      </div>
    </PreviewFrame>
  );
}

function LeadershipSnapshot() {
  // 9-block matrix
  const blocks = [
    { l: "Promotion", c: "bg-success-500/30 border-success-500/50 text-success-500" },
    { l: "", c: "bg-white/[0.03]" }, { l: "", c: "bg-white/[0.03]" },
    { l: "Suitable", c: "bg-accent-500/20 border-accent-500/40 text-accent-300" },
    { l: "★", c: "bg-accent-500/30 border-accent-500/60 text-accent-200" },
    { l: "Validation", c: "bg-warning-500/15 border-warning-500/30 text-warning-500" },
    { l: "Development", c: "bg-warning-500/20 border-warning-500/40 text-warning-500" },
    { l: "", c: "bg-white/[0.03]" },
    { l: "Replacement", c: "bg-danger-500/15 border-danger-500/30 text-danger-500" },
  ];
  return (
    <PreviewFrame title="리더십 Snapshot 분포.pdf">
      <div className="flex items-center gap-3 h-full">
        <div className="flex flex-col items-center justify-around h-full text-[9px] font-mono text-ink-500">
          <span>High</span><span>Mid</span><span>Low</span>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-1 h-[140px]">
          {blocks.map((b, i) => (
            <div key={i} className={`rounded border flex items-center justify-center text-[9px] font-mono font-bold ${b.c}`}>{b.l}</div>
          ))}
        </div>
      </div>
      <div className="flex justify-around text-[9px] font-mono text-ink-500 mt-1">
        <span>Green</span><span>Yellow</span><span>Red</span>
      </div>
    </PreviewFrame>
  );
}

function SuccessionPipeline() {
  const groups = [
    { name: "Group I", desc: "Ready Now", count: 3, c: "bg-success-500" },
    { name: "Group II", desc: "Ready Soon", count: 5, c: "bg-accent-500" },
    { name: "Group III", desc: "Future Talent", count: 8, c: "bg-white/20" },
  ];
  return (
    <PreviewFrame title="Succession Plan.pptx">
      <div className="space-y-3 mt-2">
        {groups.map((g, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20">
              <div className="text-[11px] font-bold text-ink-800">{g.name}</div>
              <div className="text-[9px] font-mono text-ink-500">{g.desc}</div>
            </div>
            <div className="flex-1 flex gap-1">
              {Array.from({ length: g.count }).map((_, j) => (
                <div key={j} className={`w-6 h-6 rounded-full ${g.c} flex items-center justify-center text-white text-[10px] font-bold`}>{j + 1}</div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[10px] font-mono text-ink-500 text-center pt-2">포지션별 후계자 풀 — 직급별 관리</p>
      </div>
    </PreviewFrame>
  );
}

/* ════════════════ 조직문화 ════════════════ */

function EngagementQuadrant() {
  return (
    <PreviewFrame title="전사 조직진단 결과.pdf">
      <div className="flex items-center gap-3 h-full">
        <svg viewBox="0 0 160 140" className="w-[160px] h-[140px]">
          <rect x="0" y="0" width="80" height="70" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" />
          <rect x="80" y="0" width="80" height="70" fill="rgba(14,165,233,0.15)" stroke={ACCENT} />
          <rect x="0" y="70" width="80" height="70" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.2)" />
          <rect x="80" y="70" width="80" height="70" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.2)" />
          <text x="40" y="30" fontSize="8" fill={INK} textAnchor="middle">Detached</text>
          <text x="40" y="42" fontSize="14" fill={INK} textAnchor="middle" fontWeight="bold">2%</text>
          <text x="120" y="30" fontSize="8" fill={ACCENT_LIGHT} textAnchor="middle">Effective</text>
          <text x="120" y="46" fontSize="18" fill={ACCENT_LIGHT} textAnchor="middle" fontWeight="bold">52%</text>
          <text x="40" y="100" fontSize="8" fill="#EF4444" textAnchor="middle">Ineffective</text>
          <text x="40" y="115" fontSize="14" fill="#EF4444" textAnchor="middle" fontWeight="bold">22%</text>
          <text x="120" y="100" fontSize="8" fill="#F59E0B" textAnchor="middle">Frustrated</text>
          <text x="120" y="115" fontSize="14" fill="#F59E0B" textAnchor="middle" fontWeight="bold">23%</text>
        </svg>
        <div className="flex-1 text-[10px] space-y-1.5">
          <div className="font-mono text-ink-500">직원 유형 분포</div>
          <div className="text-ink-700">Driver × Outcome 4사분면</div>
          <div className="pt-2 space-y-1 text-[9px] text-ink-500">
            <div>Effective: 만족 + 몰입</div>
            <div>Ineffective: 잠재력 미발휘</div>
            <div>Frustrated: 이탈 가능성 ↑</div>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

function CultureProgramList() {
  const programs = [
    { n: "협업조직 멘토링", e: 3, p: 3 }, { n: "실패에 대한 인정", e: 3, p: 2 },
    { n: "업무개선 아이디어", e: 3, p: 3 }, { n: "리더십 개선사항 도출", e: 3, p: 2 },
    { n: "리버스 멘토링", e: 3, p: 3 },
  ];
  const dot = (n: number) => n === 3 ? "bg-success-500" : n === 2 ? "bg-accent-500/60" : "bg-white/10";
  return (
    <PreviewFrame title="조직문화 프로그램 카탈로그.pdf">
      <div className="space-y-1.5">
        <div className="grid grid-cols-[1fr,auto,auto] gap-3 text-[9px] font-mono text-ink-500 pb-1 border-b border-white/[0.06]">
          <span>프로그램</span><span>효과</span><span>참여도</span>
        </div>
        {programs.map((p, i) => (
          <div key={i} className="grid grid-cols-[1fr,auto,auto] gap-3 text-[10px] items-center">
            <span className="text-ink-700 truncate">{p.n}</span>
            <span className={`w-3 h-3 rounded-full ${dot(p.e)}`} />
            <span className={`w-3 h-3 rounded-full ${dot(p.p)}`} />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function CultureCycle() {
  const phases = [
    { l: "진단", m: "1-2월", c: "bg-accent-500" },
    { l: "공유", m: "3월", c: "bg-accent-500/80" },
    { l: "액션 도출", m: "3-4월", c: "bg-accent-500/60" },
    { l: "실행", m: "5-10월", c: "bg-accent-500/40" },
    { l: "재진단", m: "11-12월", c: "bg-success-500/60" },
  ];
  return (
    <PreviewFrame title="조직문화 액션 워크숍.pdf">
      <div className="flex items-center gap-1 mt-2">
        {phases.map((p, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`w-full h-10 ${p.c} rounded flex items-center justify-center text-white text-[10px] font-bold`}>{p.l}</div>
            <div className="text-[9px] font-mono text-ink-500">{p.m}</div>
            {i < phases.length - 1 && <div className="absolute" />}
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-1 text-[10px] text-ink-600">
        <div>· 부서별 워크숍 — Top 3 이슈 액션 도출</div>
        <div>· 분기 점검 + 차년도 계획</div>
        <div>· 페르소나, 가치 정렬 카드 활용</div>
      </div>
    </PreviewFrame>
  );
}

/* ════════════════ Fallback ════════════════ */

function GenericDocPreview() {
  return (
    <PreviewFrame title="문서 미리보기">
      <div className="space-y-2">
        <div className="h-2 bg-white/[0.08] rounded w-3/4" />
        <div className="h-2 bg-white/[0.06] rounded w-full" />
        <div className="h-2 bg-white/[0.06] rounded w-5/6" />
      </div>
    </PreviewFrame>
  );
}