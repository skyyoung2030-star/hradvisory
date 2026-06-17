import { useState, useEffect, useRef } from "react";
import {
  Send, Bot, User as UserIcon, MessageCircleQuestion,
  Calendar, MapPin, Clock, Users, ClipboardList, Coffee,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";
import { getChatReply } from "@/lib/api";
import type { ChatMessage } from "@/lib/claude-mock";
import { PAIN_IMPACT_MAP } from "@/lib/pain-impact-map";

const FALLBACK_SUGGESTED: { number: string; q: string }[] = [
  { number: "01", q: "100명 회사에 평가제도가 없는데, 어떻게 시작하나요?" },
  { number: "02", q: "Pay Band는 직급 몇 단계로 나누는 게 좋나요?" },
  { number: "03", q: "MBO에서 OKR로 전환할 때 가장 큰 위험은 뭔가요?" },
];

const SEED: ChatMessage = {
  role: "assistant",
  content: "안녕하세요. HR Master 자문 컨설턴트입니다. 직급·평가·보상·리더십·조직문화 — 무엇이든 편하게 물어보세요. 실제 자문에서도 이런 식으로 함께 풀어갑니다.",
};

export default function Step2Demo() {
  const step = getStepBySlug("2-demo")!;

  return (
    <>
      <StepShell step={step}>
        <p
          className="body text-ink-600"
          style={{ display: "block", margin: 0, marginBottom: 24, padding: 0, position: "static" }}
        >
          Master 자문은 두 가지 채널이 양쪽으로 함께 굴러갑니다. 정기적으로 깊이 다루는 현장 방문과, 사이사이 즉시 응답하는 핫라인.
        </p>

        <div className="grid lg:grid-cols-2 gap-5">
          <VisitChannel />
          <HotlineChannel />
        </div>

        <p
          className="caption text-center"
          style={{ display: "block", margin: 0, marginTop: 24, padding: 0, position: "static" }}
        >
          두 채널은 보완 관계입니다. 현장 방문이 제도와 사람을 깊이 다루고, 핫라인이 일상의 막힘을 풀어줍니다.
        </p>
      </StepShell>

      <TourNav current={step} nextLabel="도구·템플릿 보기" />
    </>
  );
}

/* ─────────────── Channel 1 — Onsite visit ─────────────── */

function VisitChannel() {
  return (
    <div>
      <InlineChannelHeader
        badge="CHANNEL 01"
        title="현장 방문 자문"
        tagline="월 정기 방문 · 깊이 있는 세션 진행"
        icon={Calendar}
      />

      <div className="card !p-0 overflow-hidden flex flex-col h-[460px] shadow-depth-2">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]">
            <Calendar size={16} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink-900">정기 방문 일정</div>
            <div className="text-[11px] text-ink-500">월 1~2회 · 회사로 직접 방문</div>
          </div>
          <div className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-success-500/15 border border-success-500/30 text-success-500 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
            예약됨
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-3">
            다음 방문 일정
          </div>

          <div className="space-y-2.5">
            <VisitCard date="3월 14일 (목)" time="오후 2시 · 3시간" location="회사 회의실" agenda="Calibration Session 동석" participants="HR + 본부장 5명" icon={ClipboardList} featured />
            <VisitCard date="3월 28일 (목)" time="오전 10시 · 2시간" location="회사 회의실" agenda="팀장 리더십 워크숍" participants="팀장 12명" icon={Users} />
            <VisitCard date="4월 11일 (목)" time="오후 4시 · 1.5시간" location="대표실" agenda="Pay Band 안 리뷰 · 의사결정" participants="대표 + HR 리더" icon={Coffee} />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="text-[11px] text-ink-600">
            <span className="text-accent-400 font-semibold">이번 달 누적: </span>
            방문 2회 · 9시간 · 안건 5건 처리
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-2">
          방문 세션에서 다루는 것
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          <ActivityPill icon={ClipboardList} text="Calibration · 평가 협의 회의 동석" />
          <ActivityPill icon={Users} text="팀장 / 임원 워크숍 진행" />
          <ActivityPill icon={Coffee} text="대표 1:1 · 제도 의사결정 동석" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Channel 2 — Realtime hotline ─────────────── */

function HotlineChannel() {
  const [messages, setMessages] = useState<ChatMessage[]>([SEED]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState(FALLBACK_SUGGESTED);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Read pain selections from Step 1 (sessionStorage) and build dynamic chips
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hcg_tour_diagnose");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { pains?: string[] };
      const pains = parsed?.pains;
      if (!Array.isArray(pains) || pains.length === 0) return;

      const qs = pains
        .map((id) => PAIN_IMPACT_MAP.find((p) => p.id === id)?.question)
        .filter((q): q is string => Boolean(q))
        .slice(0, 4);

      if (qs.length > 0) {
        setSuggested(qs.map((q, i) => ({
          number: String(i + 1).padStart(2, "0"),
          q,
        })));
      }
    } catch {
      /* keep fallback */
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const reply = await getChatReply(next);
      setMessages((c) => [...c, { role: "assistant", content: reply }]);
    } catch {
      setMessages((c) => [...c, { role: "assistant", content: "잠시 후 다시 시도해주세요." }]);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <InlineChannelHeader
        badge="CHANNEL 02"
        title="실시간 핫라인"
        tagline="평일 상시 응답 · 사이사이 빠른 질의"
        icon={MessageCircleQuestion}
      />

      <div className="card !p-0 overflow-hidden flex flex-col h-[460px] shadow-depth-2">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center font-bold text-[13px] shadow-[0_4px_12px_-2px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]">
              M
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-ink-100 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink-900">Master 컨설턴트</div>
            <div className="text-[11px] text-ink-500">온라인 · 평일 응답</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
          {loading && <TypingBubble />}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.06] bg-white/[0.02]">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="HR 관련 질의 입력…" className="input flex-1 h-10 text-[13px]" disabled={loading} />
          <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-500 text-white hover:bg-accent-400 disabled:opacity-40 active:translate-y-px transition-all shadow-[0_4px_12px_-2px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]" aria-label="메시지 전송">
            <Send size={14} />
          </button>
        </form>
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-2">
          예시 질문
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {suggested.map((s) => (
            <button key={s.number} type="button" onClick={() => send(s.q)} disabled={loading} className="group text-left p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-accent-500/40 hover:bg-accent-500/[0.05] transition-colors disabled:opacity-50">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono font-bold text-accent-400 tabular-nums pt-0.5">[{s.number}]</span>
                <span className="text-[12px] text-ink-700 group-hover:text-ink-900 leading-snug">{s.q}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Channel header — block layout (StepShell pattern) ───────────────
   v6: Same pattern that finally worked in StepShell. No flex, no gap — just
   block elements with explicit marginBottom. Each element has the full reset
   chain (display, margin, padding, position, float, clear, width/height auto,
   top/left/right/bottom auto) to defeat any external CSS interference.

   Includes a small "v6" debug marker on the badge line. If you don't see it,
   the file isn't loaded. Remove the small "v6" span once verified. */

function InlineChannelHeader({ badge, title, tagline, icon: Icon }: {
  badge: string; title: string; tagline: string; icon: LucideIcon;
}) {
  return (
    <div style={{ marginBottom: 16, display: "block", position: "static" }}>
      {/* Eyebrow row */}
      <div
        style={{
          marginBottom: 8,
          lineHeight: 1,
          display: "block",
          position: "static",
        }}
      >
        <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-accent-400 uppercase">
          {badge}
        </span>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            margin: "0 8px",
            width: 4,
            height: 4,
            borderRadius: 9999,
            background: "#3F4150",
            verticalAlign: "middle",
          }}
        />
        <Icon size={11} className="text-accent-400 inline-block align-middle" />
      </div>

      {/* H2 — explicit block reset + marginBottom */}
      <h2
        className="h-3"
        style={{
          display: "block",
          margin: 0,
          marginBottom: 6,
          padding: 0,
          position: "static",
          float: "none",
          clear: "both",
          width: "auto",
          height: "auto",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
        }}
      >
        {title}
      </h2>

      {/* Tagline — explicit block reset */}
      <p
        className="caption text-ink-600"
        style={{
          display: "block",
          margin: 0,
          padding: 0,
          position: "static",
          float: "none",
          clear: "both",
          width: "auto",
          height: "auto",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
        }}
      >
        {tagline}
      </p>
    </div>
  );
}

/* ─────────────── Visit appointment card ─────────────── */

function VisitCard({ date, time, location, agenda, participants, icon: Icon, featured }: {
  date: string; time: string; location: string; agenda: string; participants: string;
  icon: LucideIcon; featured?: boolean;
}) {
  return (
    <div className={cn("p-3 rounded-lg border transition-all", featured ? "border-accent-500/40 bg-accent-500/[0.06] shadow-[0_0_24px_-8px_rgba(14,165,233,0.4)]" : "border-white/[0.08] bg-white/[0.02]")}>
      <div className="flex items-start gap-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", featured ? "bg-accent-500 text-white" : "bg-white/[0.06] text-accent-400")}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[12px] font-mono font-bold text-ink-800 tabular-nums">{date}</span>
            {featured && <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-accent-400">NEXT</span>}
          </div>
          <div className="text-[13px] font-semibold text-ink-900 mt-0.5">{agenda}</div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-[11px] text-ink-500">
            <span className="inline-flex items-center gap-1"><Clock size={9} />{time}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={9} />{location}</span>
            <span className="inline-flex items-center gap-1"><Users size={9} />{participants}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityPill({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
      <Icon size={13} className="text-accent-400 mt-0.5 flex-shrink-0" />
      <span className="text-[12px] text-ink-700 leading-snug">{text}</span>
    </div>
  );
}

/* ─────────────── Chat bubbles ─────────────── */

function Bubble({ role, content }: { role: ChatMessage["role"]; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={cn("flex items-start gap-2", isUser && "flex-row-reverse")}>
      <div className={cn("w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center", isUser ? "bg-white/[0.08] text-ink-700" : "bg-accent-500 text-white shadow-[0_0_12px_-2px_rgba(14,165,233,0.6)]")}>
        {isUser ? <UserIcon size={12} /> : <Bot size={12} />}
      </div>
      <div className={cn("max-w-[80%] rounded-xl px-3 py-2 text-[13px] whitespace-pre-wrap leading-relaxed", isUser ? "bg-accent-500 text-white rounded-tr-md shadow-[0_4px_12px_-2px_rgba(14,165,233,0.4)]" : "bg-white/[0.06] text-ink-800 rounded-tl-md border border-white/[0.06]")}>
        {content}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-[0_0_12px_-2px_rgba(14,165,233,0.6)]"><Bot size={12} /></div>
      <div className="bg-white/[0.06] border border-white/[0.06] rounded-xl rounded-tl-md px-3 py-2.5 flex items-center gap-1">
        <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return <span className="w-1.5 h-1.5 rounded-full bg-ink-500 animate-pulse-soft" style={{ animationDelay: `${delay}ms` }} />;
}