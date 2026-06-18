// src/pages/ChatPage.tsx
// 풀스크린 채팅 페이지. Welcome 위젯에서 첫 메시지 보낸 후 이리로 이동.
// 같은 conversation을 localStorage로 공유.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
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

const GREETING =
  "안녕하세요. HCG의 Master 컨설턴트입니다. 평가·보상·직급·조직성과·리더십 등 HR 관련 어떤 질문이든 평일 실시간으로 답변드립니다. 가벼운 질문부터 편하게 물어보세요.";

const STARTER_CHIPS = [
  "직원 동기부여 강화하려면?",
  "AI 도입은 어디서부터?",
  "S급 인재 이탈 막으려면?",
  "평가 등급 분포는 어떻게?",
];

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  /** 초기 진입 시 컨설턴트가 인사 메시지를 "입력 중"으로 보이게 한 뒤 등장 */
  const [greetingShown, setGreetingShown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* 초기 — 기존 대화 로드 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const existingId = getStoredConversationId();
      if (existingId) {
        const conv = await loadConversation(existingId);
        if (conv && mounted) {
          setConversationId(existingId);
          const msgs = await loadMessages(existingId);
          setMessages(msgs);
          // 기존 대화면 greeting 즉시 표시
          setGreetingShown(true);
        } else if (mounted) {
          clearStoredConversationId();
        }
      }
      if (mounted) inputRef.current?.focus();
      // 새 방문자: 1.4초 후 greeting 등장 (그동안 typing 표시)
      if (mounted) {
        const t = setTimeout(() => setGreetingShown(true), 1400);
        return () => clearTimeout(t);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* Realtime 구독 */
  useEffect(() => {
    if (!conversationId) return;
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = subscribeToMessages(conversationId, (msg) => {
      setMessages((prev) => {
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

  /* 자동 스크롤 */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(text: string) {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      let convId = conversationId;
      if (!convId) {
        const conv = await createConversation();
        if (!conv) {
          setSending(false);
          return;
        }
        convId = conv.id;
        setConversationId(convId);
      }
      const msg = await sendMessage(convId, "visitor", content);
      if (msg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      setInput("");
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend(input);
    }
  }

  const showChips = greetingShown && messages.length === 0 && !sending;
  const showTyping =
    !greetingShown ||
    (messages.length > 0 && messages[messages.length - 1].role === "visitor");

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-50 bg-spotlight flex flex-col">
      <div aria-hidden className="absolute inset-0 bg-grid-line mask-vignette opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 h-14 flex items-center gap-3 container-x border-b border-white/[0.06]">
        {/* Left — back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-600 hover:text-ink-900 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Welcome</span>
        </Link>

        {/* Center — consultant info */}
        <div className="flex-1 flex items-center justify-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-success-500 to-success-700 flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]">
              <MessageCircle size={14} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success-400 border-2 border-ink-50 animate-pulse-soft" />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className="text-[13px] font-bold text-ink-900 truncate"
              style={{ display: "block", margin: 0, padding: 0, lineHeight: 1.2 }}
            >
              전문 HRBP 실시간 자문
            </span>
            <span
              className="text-[10px] font-mono truncate"
              style={{ color: "#34d399", display: "block", margin: 0, padding: 0, lineHeight: 1.3 }}
            >
              온라인 · 평일 응답
            </span>
          </div>
        </div>

        {/* Right — LIVE chip */}
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/15 border border-success-500/30 text-[10px] font-mono font-bold flex-shrink-0"
          style={{ color: "#34d399" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse-soft" />
          LIVE
        </span>
      </header>

      {/* Chat body */}
      <section className="relative z-10 flex-1 min-h-0 flex flex-col w-full max-w-[800px] mx-auto px-4 pb-6">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-6 space-y-4">
          {/* Greeting (가상) — 1.4초 뒤에 등장 */}
          {greetingShown && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white/[0.06] text-ink-800 rounded-2xl rounded-tl-md border border-white/[0.06] px-4 py-3 text-[14px] whitespace-pre-wrap leading-relaxed">
                {GREETING}
              </div>
            </div>
          )}

          {/* DB messages */}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "visitor" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-[14px] whitespace-pre-wrap leading-relaxed
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

          {/* Starter chips — greeting 등장 + 메시지 0개일 때 */}
          {showChips && (
            <div className="flex flex-wrap gap-2 pt-2">
              {STARTER_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => void handleSend(chip)}
                  disabled={sending}
                  className="text-[12.5px] px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-ink-600 hover:bg-white/[0.08] hover:text-ink-800 hover:border-white/20 transition-colors disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator — 초기 greeting 등장 전 + 사용자 메시지 직후 답변 대기 */}
          {showTyping && (
            <div className="flex justify-start">
              <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-ink-500 mr-1">컨설턴트가 답변 입력 중</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="rounded-xl bg-white/[0.04] border border-success-500/30 backdrop-blur-xl p-3 flex items-end gap-2 shadow-[0_0_24px_-8px_rgba(16,185,129,0.3)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={sending}
            rows={2}
            placeholder="HR · 조직성과 관련 무엇이든 물어보세요 (Enter 전송 / Shift+Enter 줄바꿈)"
            className="flex-1 bg-transparent text-[14px] text-ink-900 placeholder:text-ink-500 outline-none resize-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => void handleSend(input)}
            disabled={!input.trim() || sending}
            className="h-11 px-4 flex items-center gap-1.5 rounded-lg bg-success-500 hover:bg-success-400 text-white text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]"
          >
            <Send size={14} /> 전송
          </button>
        </div>

        <p className="text-center text-[11px] text-ink-500 mt-3">
          평일 업무시간 내 답변 · 자리 비울 땐 메시지 남기시면 회신드립니다
        </p>
      </section>
    </main>
  );
} 