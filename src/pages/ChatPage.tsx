// src/pages/ChatPage.tsx
// 풀스크린 채팅 페이지. Welcome 위젯에서 첫 메시지 보낸 후 이리로 이동.
// 같은 conversation을 localStorage로 공유.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, ArrowLeft, MessageCircle, Check } from "lucide-react";
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
  "안녕하세요. HR Master 컨설턴트입니다. 평가·보상·직급·조직성과·리더십 등 HR 관련 어떤 질문이든 평일 실시간으로 답변드립니다. 가벼운 질문부터 편하게 물어보세요.";

const STARTER_CHIPS = [
  "직원 동기부여 강화하려면?",
  "AI 도입은 어디서부터?",
  "S급 인재 이탈 막으려면?",
  "평가 등급 분포는 어떻게?",
];

/* ─────────────── 컨설턴트 프로필 (가상) ─────────────── */
type Consultant = {
  id: string;
  initials: string;
  name: string;
  role: string;
  tagline: string;       // 컬러 강조 한 줄
  textColor: string;     // tagline 색상 (gradient와 매칭)
  specialty: string[];
  bio: string;
  gradient: string;
};

const CONSULTANTS: Consultant[] = [
  {
    id: "kim_jh",
    initials: "BK",
    name: "Brian Kim",
    role: "Master Consultant",
    tagline: "평가·성과관리 전문가",
    textColor: "#60a5fa",
    specialty: ["평가", "OKR", "성과관리"],
    bio: "대기업·중견기업 평가체계 구축 14년. HR Tech 컨퍼런스 다수 연사.",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: "park_my",
    initials: "SP",
    name: "Sarah Park",
    role: "Principal",
    tagline: "보상 설계 전문가",
    textColor: "#c084fc",
    specialty: ["보상", "Pay Band", "Total Reward"],
    bio: "중견기업 50개+ 보상체계 설계. CCP·GRP 자격. Compensation 18년.",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    id: "lee_dh",
    initials: "DL",
    name: "David Lee",
    role: "Senior Consultant",
    tagline: "조직문화·리더십 전문가",
    textColor: "#34d399",
    specialty: ["조직문화", "리더십", "변화관리"],
    bio: "조직개발 16년. 임원 코칭 200+ 세션. ICF PCC 자격.",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    id: "choi_su",
    initials: "EC",
    name: "Emma Choi",
    role: "AI HR Lead",
    tagline: "AI HR 도입 전문가",
    textColor: "#fbbf24",
    specialty: ["AI HR", "HR Analytics", "직무 분석"],
    bio: "AI·데이터 기반 HR 도입 컨설팅. SaaS 도입 30개사. Stanford MBA.",
    gradient: "from-amber-500 to-amber-700",
  },
  {
    id: "jung_hs",
    initials: "MJ",
    name: "Michael Jung",
    role: "Senior Consultant",
    tagline: "직급·승진 설계 전문가",
    textColor: "#f472b6",
    specialty: ["직급", "승진", "조직 설계"],
    bio: "스타트업·중견기업 직급체계 정비 35건+. PMI 통합 프로젝트 다수.",
    gradient: "from-pink-500 to-pink-700",
  },
];

const CONSULTANT_KEY = "hcg_selected_consultant";

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  /** 초기 진입 시 컨설턴트가 인사 메시지를 "입력 중"으로 보이게 한 뒤 등장 */
  const [greetingShown, setGreetingShown] = useState(false);
  /** 선택된 컨설턴트 ID — localStorage에 없으면 첫 컨설턴트 자동 선택 */
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>(() => {
    if (typeof window === "undefined") return CONSULTANTS[0].id;
    const stored = localStorage.getItem(CONSULTANT_KEY);
    if (stored && CONSULTANTS.some((c) => c.id === stored)) return stored;
    // 첫 진입 — 디폴트로 첫 카드 선택하고 localStorage에도 저장
    localStorage.setItem(CONSULTANT_KEY, CONSULTANTS[0].id);
    return CONSULTANTS[0].id;
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function selectConsultant(id: string) {
    setSelectedConsultantId(id);
    localStorage.setItem(CONSULTANT_KEY, id);
  }

  const selectedConsultant = CONSULTANTS.find((c) => c.id === selectedConsultantId);

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
  // typing indicator — 컨설턴트가 옆에서 입력 중인 느낌을 영구 노출 (admin 답변 받기 전까지)
  const lastMsg = messages[messages.length - 1];
  const showTyping =
    !greetingShown ||
    messages.length === 0 ||
    (lastMsg && lastMsg.role === "visitor");

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

      {/* Consultant profile bar */}
      <div className="relative z-10 border-b border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-[1100px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase"
                style={{ color: "#34d399" }}
              >
                담당 컨설턴트
              </span>
              {selectedConsultant && (
                <>
                  <span className="text-[10px] text-ink-500">·</span>
                  <span className="text-[12px] font-semibold text-ink-800">
                    {selectedConsultant.name}
                  </span>
                  <span
                    className="text-[11px] font-semibold hidden sm:inline"
                    style={{ color: selectedConsultant.textColor }}
                  >
                    {selectedConsultant.tagline}
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] text-ink-500 hidden md:inline">
              카드 클릭으로 전문가 변경 가능
            </span>
          </div>

          {/* Horizontal scroll for cards */}
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
            {CONSULTANTS.map((c) => {
              const selected = c.id === selectedConsultantId;
              return (
                <button
                  key={c.id}
                  onClick={() => selectConsultant(c.id)}
                  className={`group flex-shrink-0 w-[230px] sm:w-[250px] snap-start text-left rounded-xl p-3 border transition-all
                    ${
                      selected
                        ? "bg-success-500/10 border-success-500/60 shadow-[0_0_20px_-4px_rgba(16,185,129,0.4)]"
                        : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.18]"
                    }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-[13px] font-bold shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]`}
                      >
                        {c.initials}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success-400 border-2 border-ink-50" />
                    </div>
                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-ink-900 truncate">{c.name}</div>
                      <div className="text-[10.5px] font-mono text-ink-500 truncate">{c.role}</div>
                    </div>
                    {selected && (
                      <Check size={14} className="text-success-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Tagline — 컬러 강조 한 줄 */}
                  <div
                    className="mt-2.5 text-[11.5px] font-semibold"
                    style={{ color: c.textColor }}
                  >
                    {c.tagline}
                  </div>

                  {/* Specialty chips */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.specialty.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded
                          ${selected ? "bg-success-500/20 text-success-300" : "bg-white/[0.06] text-ink-600"}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="mt-2 text-[11px] text-ink-600 leading-snug line-clamp-2">
                    {c.bio}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

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