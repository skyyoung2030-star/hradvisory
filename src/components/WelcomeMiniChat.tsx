// src/components/WelcomeMiniChat.tsx
// Welcome 페이지에 임베드되는 실시간 자문 채팅 위젯.
// Supabase Realtime으로 어드민 답변을 실시간 수신.

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import KeyHint from "@/components/KeyHint";
import {
  type Message,
  createConversation,
  getStoredConversationId,
  loadConversation,
  loadMessages,
  sendMessage,
  subscribeToMessages,
  clearStoredConversationId,
} from "@/lib/chat-client";

const STARTER_CHIPS = [
  "직원 동기부여 강화하려면?",
  "AI 도입은 어디서부터?",
  "S급 인재 이탈 막으려면?",
  "평가 등급 분포는 어떻게?",
];

const GREETING =
  "안녕하세요. HR Master 컨설턴트입니다. 평가·보상·직급·조직성과·리더십 등 HR 관련 어떤 질문이든 평일 실시간으로 답변드립니다. 가벼운 질문부터 편하게 물어보세요.";

export default function WelcomeMiniChat() {
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  /** 초기 진입 시 컨설턴트가 인사 메시지를 "입력 중"으로 보이게 한 뒤 등장 */
  const [greetingShown, setGreetingShown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  /* 초기화 — 기존 대화 복원 또는 greeting 표시 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const existingId = getStoredConversationId();
      if (existingId) {
        const conv = await loadConversation(existingId);
        if (conv && mounted) {
          // 기존 대화 복원 — greeting은 즉시 표시
          setConversationId(existingId);
          const msgs = await loadMessages(existingId);
          setMessages(msgs);
          setGreetingShown(true);
          return;
        } else if (mounted) {
          // localStorage에 있던 conversation이 DB에 없음 → 정리
          clearStoredConversationId();
        }
      }
      // 새 방문자: typing indicator 먼저 잠깐 → greeting 등장
      if (mounted) {
        const t = setTimeout(() => {
          setGreetingShown(true);
        }, 1400);
        return () => clearTimeout(t);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* Realtime 구독 — conversation 설정되면 subscribe */
  useEffect(() => {
    if (!conversationId) return;
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = subscribeToMessages(conversationId, (msg) => {
      setMessages((prev) => {
        // 중복 방지 (자신이 send한 메시지가 이미 들어있을 수 있음)
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [conversationId]);

  /* 메시지 추가 시 자동 스크롤 */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(text: string) {
    const content = text.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      let convId = conversationId;
      // 첫 메시지면 conversation 생성
      if (!convId) {
        const conv = await createConversation();
        if (!conv) {
          console.error("Failed to create conversation");
          setSending(false);
          return;
        }
        convId = conv.id;
        setConversationId(convId);
      }
      await sendMessage(convId, "visitor", content);
      setInput("");
      // 메시지 보낸 후 풀스크린 채팅 페이지로 이동
      navigate("/chat");
    } finally {
      setSending(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend(input);
    }
  }

  /* 실제 표시되는 메시지 = (조건부) greeting + DB 메시지들 */
  const displayMessages: Message[] = greetingShown
    ? [
        {
          id: "_greeting",
          conversation_id: "_init",
          created_at: new Date().toISOString(),
          role: "admin",
          content: GREETING,
        },
        ...messages,
      ]
    : [...messages];

  // chips는 greeting이 보이고 + DB 메시지 0개일 때만
  const showChips = greetingShown && messages.length === 0 && !sending;
  // typing indicator — 컨설턴트가 옆에서 입력 중인 느낌을 영구 노출
  //   ① 초기 진입 (greeting 등장 전)
  //   ② greeting 등장 후 + 메시지 없음 (응답 대기 중)
  //   ③ 사용자 메시지 직후 (답변 대기 중)
  // → admin 메시지가 마지막이면 사라짐 (방금 답변 받음)
  const lastMsg = messages[messages.length - 1];
  const showTyping =
    !greetingShown ||
    messages.length === 0 ||
    (lastMsg && lastMsg.role === "visitor");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="h-full"
    >
      <div className="relative flex flex-col h-full rounded-2xl backdrop-blur-xl overflow-hidden bg-success-500/[0.05] border-2 border-success-500/40 shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)]">
        {/* Top accent line — PATH 02와 동일한 위치/스타일, 색만 success */}
        <span
          aria-hidden
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)" }}
        />

        {/* Label stripe — PATH 02와 동일한 px-7 py-3 */}
        <div className="relative flex items-center justify-between gap-3 px-7 py-3 border-b border-success-500/20 bg-success-500/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-success-400">PATH 01</span>
            <span className="w-1 h-1 rounded-full bg-success-400/40" />
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-success-400">지금 바로 질의응답 해보기</span>
          </div>
          <KeyHint variant="dark">1</KeyHint>
        </div>

        {/* Floating LIVE chip — PATH 02 "추천" 칩과 동일한 위치 (top-3 right-14) */}
        <span className="absolute top-3 right-14 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-500 text-white text-[10px] font-bold tracking-wider shadow-[0_4px_12px_-2px_rgba(16,185,129,0.7)]">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" />
          LIVE
        </span>

        {/* Body — PATH 02와 동일한 p-7 sm:p-8 (헤더 + 메시지 영역 wrap) */}
        <div className="relative flex flex-col flex-1 min-h-0 p-7 sm:p-8 pt-6">
          {/* Glow background — PATH 02와 동일 */}
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-success-500/30 to-success-700/10 blur-3xl pointer-events-none"
          />

          {/* Title block — PATH 02와 정확히 동일한 사이즈 */}
          <div className="relative">
            <h2 className="block text-[clamp(24px,3.5vw,32px)] font-bold tracking-[-0.02em] leading-tight text-ink-900">
              간단한 질문은, 무료로 자문하세요
            </h2>
            <p
              className="block text-[14px] font-medium mt-1.5"
              style={{ color: "#34d399" }}
            >
              계약 하지 않아도 언제든 무료 자문해보세요. 20년+ 컨설팅 노하우로 성심성의껏 답변드립니다 · 평일 업무시간
            </p>
          </div>

          {/* Chat surface — title 아래 */}
          <div className="relative mt-5 flex-1 min-h-0 flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-2.5"
            >
              {displayMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "visitor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] whitespace-pre-wrap leading-relaxed
                      ${
                        m.role === "visitor"
                          ? "bg-success-500 text-white rounded-tr-md shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]"
                          : "bg-white/[0.06] text-ink-800 rounded-tl-md border border-white/[0.06]"
                      }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Starter chips */}
              {showChips && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => void handleSend(chip)}
                      disabled={sending}
                      className="text-[11.5px] px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-ink-600 hover:bg-white/[0.08] hover:text-ink-800 hover:border-white/20 transition-colors disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* 컨설턴트 입력 중 indicator
                  — 초기 진입 시 greeting 등장 전 + 사용자 메시지 직후 답변 대기 시 */}
              {showTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.06] border border-white/[0.06] rounded-xl rounded-tl-md px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-ink-500 mr-1">
                        컨설턴트가 답변 입력 중
                      </span>
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                disabled={sending}
                placeholder="HR · 조직성과 관련 무엇이든"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-500 outline-none focus:border-success-500/50 focus:bg-white/[0.06] transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => void handleSend(input)}
                disabled={!input.trim() || sending}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-success-500 hover:bg-success-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]"
                aria-label="전송"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* Caption — PATH 02 footer 자리 톤 */}
          <p className="relative mt-4 text-[11px] text-ink-500 text-center">
            평일 업무시간 내 답변 · 자리 비울 땐 메시지 남기시면 회신드립니다
          </p>
        </div>
      </div>
    </motion.div>
  );
}