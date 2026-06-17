// src/components/WelcomeMiniChat.tsx
// Welcome 페이지에 임베드되는 실시간 자문 채팅 위젯.
// Supabase Realtime으로 어드민 답변을 실시간 수신.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
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
  "안녕하세요. HCG의 Master 컨설턴트입니다. 평가·보상·직급·조직성과·리더십 등 HR 관련 어떤 질문이든 평일 실시간으로 답변드립니다. 가벼운 질문부터 편하게 물어보세요.";

export default function WelcomeMiniChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
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
          // 기존 대화 복원
          setConversationId(existingId);
          const msgs = await loadMessages(existingId);
          setMessages(msgs);
          return;
        } else if (mounted) {
          // localStorage에 있던 conversation이 DB에 없음 → 정리
          clearStoredConversationId();
        }
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
      const msg = await sendMessage(convId, "visitor", content);
      if (msg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      setInput("");
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

  /* 실제 표시되는 메시지 = greeting (가상) + DB 메시지들 */
  const displayMessages: Message[] = [
    {
      id: "_greeting",
      conversation_id: "_init",
      created_at: new Date().toISOString(),
      role: "admin",
      content: GREETING,
    },
    ...messages,
  ];

  const showChips = messages.length === 0 && !sending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mt-10 max-w-[640px] mx-auto"
    >
      <div className="card relative overflow-hidden shadow-depth-2 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(14,165,233,0.5)]">
              <MessageCircle size={16} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 border-2 border-ink-50 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="text-[14px] font-bold text-ink-900"
              style={{ display: "block", margin: 0, padding: 0, lineHeight: 1.2 }}
            >
              HR Master 컨설턴트
            </span>
            <span
              className="text-[11px] font-mono text-success-400"
              style={{ display: "block", margin: 0, padding: 0, lineHeight: 1.3 }}
            >
              온라인 · 평일 실시간 응답
            </span>
          </div>
          <span className="ml-auto text-[10px] font-mono text-ink-500 tracking-wider hidden sm:inline">
            INSTANT CHAT
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="h-[260px] overflow-y-auto px-4 py-3 space-y-2.5"
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
                      ? "bg-accent-500 text-white rounded-tr-md shadow-[0_4px_12px_-2px_rgba(14,165,233,0.4)]"
                      : "bg-white/[0.06] text-ink-800 rounded-tl-md border border-white/[0.06]"
                  }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Starter chips — greeting만 있을 때 표시 */}
          {showChips && (
            <div className="flex flex-wrap gap-1.5 pt-2">
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

          {/* "답변 입력 중" indicator — visitor가 메시지 보낸 후 admin 답변 기다리는 중 */}
          {messages.length > 0 &&
            messages[messages.length - 1].role === "visitor" && (
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

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.06] bg-white/[0.02]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={sending}
            placeholder="HR · 조직성과 관련 무엇이든 물어보세요"
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-500 outline-none focus:border-accent-500/50 focus:bg-white/[0.06] transition-colors disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => void handleSend(input)}
            disabled={!input.trim() || sending}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-500 hover:bg-accent-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_-2px_rgba(14,165,233,0.4)]"
            aria-label="전송"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Subtle note */}
      <p className="text-center text-[11.5px] text-ink-500 mt-3">
        평일 업무시간 내에 답변 드립니다. 자리 비울 땐 메시지 남겨주시면 회신드립니다.
      </p>
    </motion.div>
  );
}