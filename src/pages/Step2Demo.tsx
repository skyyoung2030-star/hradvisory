import { useState, useEffect, useRef } from "react";
import { Send, Bot, User as UserIcon, MessageCircleQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";
import { getChatReply } from "@/lib/api";
import type { ChatMessage } from "@/lib/claude-mock";

const SUGGESTED: { number: string; q: string }[] = [
  { number: "01", q: "100명 회사에 평가제도가 없는데, 어떻게 시작하나요?" },
  { number: "02", q: "Pay Band는 직급 몇 단계로 나누는 게 좋나요?" },
  { number: "03", q: "MBO에서 OKR로 전환할 때 가장 큰 위험은 뭔가요?" },
  { number: "04", q: "팀장 리더십 진단, 어떤 문항으로 하나요?" },
];

const SEED: ChatMessage = {
  role: "assistant",
  content: "안녕하세요. HCG Master 자문 컨설턴트입니다. 직급·평가·보상·리더십·조직문화 — 무엇이든 편하게 물어보세요. 실제 자문에서도 이런 식으로 함께 풀어갑니다.",
};

export default function Step2Demo() {
  const step = getStepBySlug("2-demo")!;
  const [messages, setMessages] = useState<ChatMessage[]>([SEED]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <>
      <StepShell step={step}>
        <div className="grid gap-5 lg:grid-cols-[1fr,320px] items-start">
          {/* Chat panel — glass card */}
          <div className="card !p-0 overflow-hidden flex flex-col h-[540px] shadow-depth-2">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center font-bold text-[14px] shadow-[0_4px_12px_-2px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.25)]">
                  M
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 border-2 border-ink-100 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-ink-900">Master 컨설턴트</div>
                <div className="text-[11px] text-ink-500">HCG · HR 자문 · 15년 경력</div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
              {loading && <TypingBubble />}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
              <input
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="HR 관련해서 궁금한 점을 물어보세요…"
                className="input flex-1" disabled={loading}
              />
              <button
                type="submit" disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-accent-500 text-white hover:bg-accent-400 disabled:opacity-40 active:translate-y-px transition-all shadow-[0_4px_12px_-2px_rgba(14,165,233,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]"
                aria-label="메시지 전송"
              ><Send size={16} /></button>
            </form>
          </div>

          {/* Side panel */}
          <aside className="space-y-3">
            <div className="px-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-accent-400 mb-2.5 inline-flex items-center gap-1">
                <MessageCircleQuestion size={11} />
                예시 질문
              </div>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED.map((s) => (
                  <button
                    key={s.number} type="button" onClick={() => send(s.q)} disabled={loading}
                    className="group text-left p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-accent-500/40 hover:bg-accent-500/[0.05] transition-colors disabled:opacity-50 active:translate-y-px"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-[11px] font-mono font-bold text-accent-400 tabular-nums pt-0.5">[{s.number}]</span>
                      <span className="body-sm text-ink-700 group-hover:text-ink-900 leading-snug">{s.q}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card !p-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-ink-500 mb-2">
                실제 자문 채널
              </div>
              <ul className="space-y-1.5 text-[13px] text-ink-700">
                <li>· 실시간 핫라인 (평일 응답)</li>
                <li>· 월 1회 현장 방문</li>
                <li>· 제도 초안 함께 작성</li>
                <li>· 분기 진단 · 서베이</li>
              </ul>
            </div>
          </aside>
        </div>
      </StepShell>

      <TourNav current={step} nextLabel="도구·템플릿 보기" />
    </>
  );
}

function Bubble({ role, content }: { role: ChatMessage["role"]; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      <div className={cn(
        "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center",
        isUser ? "bg-white/[0.08] text-ink-700" : "bg-accent-500 text-white shadow-[0_0_12px_-2px_rgba(14,165,233,0.6)]",
      )}>
        {isUser ? <UserIcon size={14} /> : <Bot size={14} />}
      </div>
      <div className={cn(
        "max-w-[78%] rounded-2xl px-4 py-2.5 body-sm whitespace-pre-wrap leading-relaxed",
        isUser ? "bg-accent-500 text-white rounded-tr-md shadow-[0_4px_12px_-2px_rgba(14,165,233,0.4)]"
               : "bg-white/[0.06] text-ink-800 rounded-tl-md border border-white/[0.06]",
      )}>{content}</div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-accent-500 text-white flex items-center justify-center shadow-[0_0_12px_-2px_rgba(14,165,233,0.6)]"><Bot size={14} /></div>
      <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
        <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
      </div>
    </div>
  );
}
function Dot({ delay }: { delay: number }) {
  return <span className="w-1.5 h-1.5 rounded-full bg-ink-500 animate-pulse-soft" style={{ animationDelay: `${delay}ms` }} />;
}
