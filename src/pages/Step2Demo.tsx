import { useState, useEffect, useRef } from "react";
import { Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getStepBySlug } from "@/lib/tour-config";
import StepShell from "@/components/StepShell";
import TourNav from "@/components/TourNav";
import { cn } from "@/lib/utils";
import { getChatReply } from "@/lib/api";
import type { ChatMessage } from "@/lib/claude-mock";

const SUGGESTED_QUESTIONS = [
  "100명 회사에 평가제도가 없는데, 어떻게 시작하나요?",
  "Pay Band는 직급 몇 단계로 나누는 게 좋나요?",
  "MBO에서 OKR로 전환할 때 가장 큰 위험은 뭔가요?",
  "팀장 리더십 진단, 어떤 문항으로 하나요?",
];

const SEED: ChatMessage = {
  role: "assistant",
  content:
    "안녕하세요. HCG Master 자문 컨설턴트입니다. 직급·평가·보상·리더십·조직문화 — 무엇이든 편하게 물어보세요. 실제 자문에서도 이런 식으로 함께 풀어갑니다.",
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
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const reply = await getChatReply(next);
      setMessages((curr) => [...curr, { role: "assistant", content: reply }]);
    } catch {
      setMessages((curr) => [
        ...curr,
        { role: "assistant", content: "잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StepShell step={step}>
        <div className="grid gap-6 lg:grid-cols-[1fr,320px] items-start">
          <div className="card !p-0 overflow-hidden flex flex-col h-[540px]">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-primary-100 bg-bg-soft">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-white flex items-center justify-center font-semibold text-[13px]">
                M
              </div>
              <div>
                <div className="text-[14px] font-semibold text-primary-900">
                  Master 컨설턴트
                </div>
                <div className="text-[12px] text-success-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
                  온라인
                </div>
              </div>
              <span className="ml-auto chip chip-accent">
                <Sparkles size={11} className="mr-1" /> 데모
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-white">
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && <TypingBubble />}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 px-4 py-3 border-t border-primary-100 bg-bg-soft"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="HR 관련해서 궁금한 점을 물어보세요…"
                className="flex-1 h-11 px-4 rounded-lg border border-primary-200 bg-white text-[14px] focus:border-accent-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary !h-11 !px-4"
                aria-label="메시지 전송"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="card card-soft">
              <h3 className="h-4">실제 자문은 이렇게 진행됩니다</h3>
              <ul className="mt-4 space-y-2 body-sm text-primary-600">
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">·</span>
                  실시간 핫라인 (평일 응답)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">·</span>
                  월 1회 현장 방문 (대면)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">·</span>
                  제도 초안 함께 작성
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">·</span>
                  분기 진단 · 서베이
                </li>
              </ul>
            </div>

            <div className="card card-soft">
              <h3 className="h-4">이런 걸 물어보세요</h3>
              <div className="mt-4 flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => send(q)}
                    disabled={loading}
                    className="text-left body-sm text-primary-700 px-3 py-2 rounded-lg border border-primary-200 bg-white hover:border-accent-500 hover:text-accent-600 transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </StepShell>

      <TourNav
        current={step}
        nextLabel={messages.length > 1 ? "다음: 산출물 보기" : "둘러봐도 됩니다 →"}
      />
    </>
  );
}

function Bubble({ role, content }: { role: ChatMessage["role"]; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center",
          isUser ? "bg-primary-100 text-primary-700" : "bg-accent-500 text-white",
        )}
      >
        {isUser ? <UserIcon size={14} /> : <Bot size={14} />}
      </div>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 body-sm whitespace-pre-wrap",
          isUser ? "bg-accent-500 text-white rounded-tr-md" : "bg-primary-50 text-primary-800 rounded-tl-md",
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-accent-500 text-white flex items-center justify-center">
        <Bot size={14} />
      </div>
      <div className="bg-primary-50 text-primary-800 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
        <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-soft"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
