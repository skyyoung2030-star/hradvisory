import type { Template } from "@/lib/templates";

/**
 * Mock visual previews per template area. Each one is a small SVG/HTML
 * "document peek" that conveys what kind of artifact the user would receive.
 * Not the real document — labelled with a "PREVIEW" watermark — but visually
 * meaningful so they understand the shape of what's coming.
 *
 * Returns a JSX element sized to fit a ~360x220 preview slot inside a modal.
 */
export function TemplatePreview({ template }: { template: Template }) {
  const area = template.area;

  switch (area) {
    case "직급":
    case "승진":
      return <JobLevelDiagram />;
    case "평가":
      return <EvaluationDistribution />;
    case "보상":
      return <PayBandChart />;
    case "직무":
      return <JobMatrix />;
    case "리더십":
      return <LeadershipRadar />;
    case "조직문화":
      return <CultureScoreCard />;
    default:
      return <GenericDocPreview />;
  }
}

/* ─────────────── Shared frame ─────────────── */

function PreviewFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative h-[220px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-lg overflow-hidden">
      {/* Watermark */}
      <span className="absolute top-2 right-3 text-[9px] font-mono font-bold tracking-[0.22em] text-ink-500/60 uppercase pointer-events-none">
        Preview
      </span>
      {/* Doc title bar */}
      <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="text-[11px] font-mono font-semibold text-ink-700 truncate">{title}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ─────────────── 직급/승진 — Job level diagram ─────────────── */

function JobLevelDiagram() {
  const levels = [
    { name: "L1 Associate",  width: 35 },
    { name: "L2 Senior",     width: 50 },
    { name: "L3 Lead",       width: 65 },
    { name: "L4 Manager",    width: 80 },
    { name: "L5 Director",   width: 95 },
  ];
  return (
    <PreviewFrame title="직급체계 통합안 v2.xlsx">
      <div className="flex flex-col gap-1.5">
        {levels.map((l, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-[9px] font-mono text-ink-600 w-3 text-right">L{i + 1}</span>
            <div className="flex-1 h-4 rounded-sm bg-white/[0.03] relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-600 to-accent-400 rounded-sm"
                style={{ width: `${l.width}%` }}
              />
              <span className="absolute inset-y-0 left-2 flex items-center text-[9px] font-medium text-white">
                {l.name}
              </span>
            </div>
            <span className="text-[9px] font-mono text-ink-600 w-8">{l.width}%</span>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

/* ─────────────── 평가 — Grade distribution ─────────────── */

function EvaluationDistribution() {
  const grades = [
    { g: "S", pct: 10, color: "bg-accent-500" },
    { g: "A", pct: 20, color: "bg-accent-500/80" },
    { g: "B", pct: 50, color: "bg-accent-500/55" },
    { g: "C", pct: 15, color: "bg-accent-500/35" },
    { g: "D", pct:  5, color: "bg-accent-500/20" },
  ];
  return (
    <PreviewFrame title="평가 등급 분포 가이드.pdf">
      <div className="flex items-end justify-around h-[140px] gap-2">
        {grades.map((g, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold text-ink-700 tabular-nums">{g.pct}%</span>
            <div className={`w-full rounded-sm ${g.color}`} style={{ height: `${g.pct * 2.4}px` }} />
            <span className="text-[10px] font-bold text-ink-800">{g.g}</span>
          </div>
        ))}
      </div>
      <p className="caption text-[9px] mt-2 text-center">권장 분포 (조정 가능)</p>
    </PreviewFrame>
  );
}

/* ─────────────── 보상 — Pay Band chart ─────────────── */

function PayBandChart() {
  // Each band: { level, min, mid, max } as % of svg width
  const bands = [
    { level: "L1", min: 10, mid: 18, max: 28 },
    { level: "L2", min: 18, mid: 30, max: 42 },
    { level: "L3", min: 30, mid: 45, max: 60 },
    { level: "L4", min: 45, mid: 62, max: 80 },
    { level: "L5", min: 60, mid: 78, max: 95 },
  ];
  return (
    <PreviewFrame title="Pay Band Simulator.xlsx">
      <svg viewBox="0 0 320 140" className="w-full h-[140px]">
        {bands.map((b, i) => {
          const y = 12 + i * 24;
          return (
            <g key={i}>
              <text x="0" y={y + 4} fontSize="9" fill="#A1A1AA" fontFamily="JetBrains Mono">{b.level}</text>
              {/* Band rect (min → max) */}
              <rect
                x={20 + b.min * 2.8} y={y - 4} height="8"
                width={(b.max - b.min) * 2.8}
                fill="rgba(14,165,233,0.2)" rx="2"
              />
              {/* Mid marker */}
              <circle cx={20 + b.mid * 2.8} cy={y} r="3" fill="#38BDF8" />
            </g>
          );
        })}
        {/* Axis labels */}
        <text x="20" y="135" fontSize="8" fill="#71717A" fontFamily="JetBrains Mono">3000만</text>
        <text x="280" y="135" fontSize="8" fill="#71717A" fontFamily="JetBrains Mono">1.2억</text>
      </svg>
    </PreviewFrame>
  );
}

/* ─────────────── 직무 — Job family matrix ─────────────── */

function JobMatrix() {
  const cols = ["JF1", "JF2", "JF3", "JF4"];
  const rows = [
    { name: "전략기획", cells: [1, 1, 0, 0] },
    { name: "운영",     cells: [1, 1, 1, 0] },
    { name: "개발",     cells: [0, 1, 1, 1] },
    { name: "지원",     cells: [0, 0, 1, 1] },
  ];
  return (
    <PreviewFrame title="Job Family Matrix.xlsx">
      <table className="w-full text-[10px] font-mono">
        <thead>
          <tr>
            <th className="text-left text-ink-600 font-semibold pb-1">직무</th>
            {cols.map((c) => (
              <th key={c} className="text-center text-ink-600 font-semibold pb-1 w-10">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-white/[0.06]">
              <td className="py-1.5 text-ink-700">{r.name}</td>
              {r.cells.map((c, j) => (
                <td key={j} className="text-center py-1.5">
                  {c ? (
                    <span className="inline-block w-4 h-4 rounded bg-accent-500/40 border border-accent-500/60" />
                  ) : (
                    <span className="inline-block w-4 h-4 rounded bg-white/[0.03] border border-white/[0.08]" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </PreviewFrame>
  );
}

/* ─────────────── 리더십 — 360 radar ─────────────── */

function LeadershipRadar() {
  // 6 axes: 소통 · 의사결정 · 코칭 · 비전 · 실행 · 윤리
  const axes = ["소통", "의사결정", "코칭", "비전", "실행", "윤리"];
  const score = [78, 65, 72, 58, 82, 90]; // 0-100
  const cx = 70, cy = 70, r = 50;
  const points = axes.map((_, i) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const dist = (score[i] / 100) * r;
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist];
  });
  const grid = [0.33, 0.66, 1];
  return (
    <PreviewFrame title="팀장 360도 진단 결과.pdf">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 140 140" className="w-[140px] h-[140px] flex-shrink-0">
          {grid.map((g, gi) => (
            <polygon
              key={gi}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              points={axes.map((_, i) => {
                const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
                return `${cx + Math.cos(angle) * r * g},${cy + Math.sin(angle) * r * g}`;
              }).join(" ")}
            />
          ))}
          <polygon
            points={points.map((p) => p.join(",")).join(" ")}
            fill="rgba(14,165,233,0.25)"
            stroke="#0EA5E9"
            strokeWidth="1.5"
          />
          {points.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="#38BDF8" />
          ))}
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

/* ─────────────── 조직문화 — Score card ─────────────── */

function CultureScoreCard() {
  const dims = [
    { name: "참여도",     score: 7.8, prev: 7.2 },
    { name: "심리적 안전",  score: 6.5, prev: 6.8 },
    { name: "성장 기회",   score: 7.1, prev: 6.9 },
    { name: "리더 신뢰",   score: 6.2, prev: 6.5 },
  ];
  return (
    <PreviewFrame title="조직문화 진단 결과.pdf">
      <div className="grid grid-cols-2 gap-2">
        {dims.map((d, i) => {
          const diff = d.score - d.prev;
          const up = diff > 0;
          return (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-md p-2">
              <div className="text-[10px] text-ink-600">{d.name}</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[18px] font-bold text-ink-900 tabular-nums leading-none">
                  {d.score.toFixed(1)}
                </span>
                <span className={`text-[9px] font-mono font-bold tabular-nums ${up ? "text-success-500" : "text-warning-500"}`}>
                  {up ? "▲" : "▼"} {Math.abs(diff).toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="caption text-[9px] mt-2 text-center">전기 대비 변동 · 10점 만점</p>
    </PreviewFrame>
  );
}

/* ─────────────── Fallback — generic doc preview ─────────────── */

function GenericDocPreview() {
  return (
    <PreviewFrame title="문서 미리보기">
      <div className="space-y-2">
        <div className="h-2 bg-white/[0.08] rounded w-3/4" />
        <div className="h-2 bg-white/[0.06] rounded w-full" />
        <div className="h-2 bg-white/[0.06] rounded w-5/6" />
        <div className="h-2 bg-white/[0.06] rounded w-2/3" />
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="h-12 bg-white/[0.04] border border-white/[0.06] rounded" />
          <div className="h-12 bg-white/[0.04] border border-white/[0.06] rounded" />
          <div className="h-12 bg-white/[0.04] border border-white/[0.06] rounded" />
        </div>
      </div>
    </PreviewFrame>
  );
}
