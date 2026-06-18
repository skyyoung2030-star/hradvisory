// src/pages/AdminInbox.tsx
// 어드민용 라이브 채팅 inbox. PIN 인증 후 모든 conversation을 보고 답변.
// 접근: /admin

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Lock, LogOut, RefreshCw, ArrowLeft } from "lucide-react";
import {
  type Conversation,
  type Message,
  listConversations,
  loadMessages,
  sendMessage,
  subscribeToMessages,
  subscribeToInbox,
  markAsRead,
} from "@/lib/chat-client";

const PIN_KEY = "hcg_admin_pin_ok";

function fmtTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/* ─────────────── PIN 게이트 ─────────────── */

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const expectedPin = import.meta.env.VITE_ADMIN_PIN || "";

  function submit() {
    if (!expectedPin) {
      setError("관리자 PIN이 .env에 설정되지 않았습니다. VITE_ADMIN_PIN을 추가하세요.");
      return;
    }
    if (pin === expectedPin) {
      localStorage.setItem(PIN_KEY, "1");
      onUnlock();
    } else {
      setError("PIN이 올바르지 않습니다.");
      setPin("");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink-50 bg-spotlight">
      <div aria-hidden className="fixed inset-0 bg-grid-line mask-vignette opacity-60 pointer-events-none" />
      <div className="relative z-10 w-[360px] card p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4">
            <Lock size={20} className="text-ink-600" />
          </div>
          <h1 className="text-[18px] font-bold text-ink-900">관리자 인증</h1>
          <p className="text-[12px] text-ink-500 mt-1">PIN 코드를 입력해주세요</p>
        </div>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="PIN"
          autoFocus
          className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-ink-900 placeholder:text-ink-500 outline-none focus:border-accent-500/50 text-center tracking-[0.4em] font-mono"
        />
        {error && <p className="text-[11px] text-red-400 mt-2 text-center">{error}</p>}
        <button
          onClick={submit}
          className="btn-primary w-full mt-4"
        >
          입장
        </button>
      </div>
    </main>
  );
}

/* ─────────────── 본 inbox ─────────────── */

export default function AdminInbox() {
  const [unlocked, setUnlocked] = useState(
    typeof window !== "undefined" && localStorage.getItem(PIN_KEY) === "1",
  );
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesUnsubRef = useRef<(() => void) | null>(null);
  const inboxUnsubRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* 초기 로드 + inbox realtime */
  useEffect(() => {
    if (!unlocked) return;
    void refresh();
    inboxUnsubRef.current = subscribeToInbox(() => {
      void refresh();
    });
    return () => {
      if (inboxUnsubRef.current) {
        inboxUnsubRef.current();
        inboxUnsubRef.current = null;
      }
    };
  }, [unlocked]);

  /* 선택된 conversation의 messages 로드 + realtime */
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    void (async () => {
      const msgs = await loadMessages(selectedId);
      setMessages(msgs);
      // 읽음 처리
      await markAsRead(selectedId);
    })();

    if (messagesUnsubRef.current) messagesUnsubRef.current();
    messagesUnsubRef.current = subscribeToMessages(selectedId, (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // 새 방문자 메시지 들어오면 자동으로 읽음 처리
      if (msg.role === "visitor") {
        void markAsRead(selectedId);
      }
    });

    return () => {
      if (messagesUnsubRef.current) {
        messagesUnsubRef.current();
        messagesUnsubRef.current = null;
      }
    };
  }, [selectedId]);

  /* 메시지 자동 스크롤 */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function refresh() {
    setLoading(true);
    const list = await listConversations();
    setConversations(list);
    setLoading(false);
  }

  async function handleReply() {
    if (!selectedId || !reply.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage(selectedId, "admin", reply.trim());
      if (msg) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      setReply("");
    } finally {
      setSending(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleReply();
    }
  }

  function logout() {
    localStorage.removeItem(PIN_KEY);
    setUnlocked(false);
  }

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const unreadCount = conversations.filter((c) => c.has_unread).length;

  return (
    <main className="min-h-screen bg-ink-50 bg-spotlight">
      <div aria-hidden className="fixed inset-0 bg-grid-line mask-vignette opacity-40 pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 h-14 px-4 sm:px-6 flex items-center border-b border-white/[0.06] bg-ink-50/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-ink-900 font-semibold min-w-0">
          <MessageCircle size={18} className="text-accent-500 flex-shrink-0" />
          <span className="text-[14px] sm:text-[15px] truncate">Master Inbox</span>
          {unreadCount > 0 && (
            <span className="ml-1 sm:ml-2 px-2 py-0.5 rounded-full bg-accent-500 text-white text-[11px] font-bold flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => void refresh()}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-ink-500 hover:text-ink-800 transition-colors"
            aria-label="새로고침"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[12px] text-ink-500 hover:text-ink-800 transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </header>

      {/* Layout: 2-column on desktop / stacked single-view on mobile */}
      <div className="relative z-10 h-[calc(100vh-56px)] md:grid md:grid-cols-[340px_1fr]">
        {/* Sidebar — conversation list. 모바일에서는 selectedId 없을 때만 보임 */}
        <aside
          className={`border-r border-white/[0.06] overflow-y-auto h-full ${
            selectedId ? "hidden md:block" : "block"
          }`}
        >
          {conversations.length === 0 && !loading && (
            <div className="p-6 text-center text-[12px] text-ink-500">
              아직 대화가 없습니다.
              <br />
              방문자가 Welcome 페이지에서 첫 메시지를 보내면 여기 표시됩니다.
            </div>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-white/[0.04] transition-colors
                ${
                  selectedId === c.id
                    ? "bg-white/[0.06]"
                    : "hover:bg-white/[0.03]"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink-900">
                    {c.visitor_name || "익명 방문자"}
                  </span>
                  {c.has_unread && (
                    <span className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_4px_rgba(14,165,233,0.7)]" />
                  )}
                </div>
                <span className="text-[10px] font-mono text-ink-500">
                  {fmtTime(c.last_message_at)}
                </span>
              </div>
              {c.visitor_company && (
                <div className="text-[11px] text-ink-600 mb-0.5">{c.visitor_company}</div>
              )}
              <div className="text-[10px] font-mono text-ink-500 truncate">
                id: {c.visitor_id.slice(0, 8)}…
              </div>
            </button>
          ))}
        </aside>

        {/* Main — conversation panel. 모바일에서는 selectedId 있을 때만 보임 */}
        <section
          className={`flex-col h-full ${
            selectedId ? "flex" : "hidden md:flex"
          }`}
        >
          {!selectedConv && (
            <div className="flex-1 flex items-center justify-center text-ink-500 text-[13px]">
              왼쪽에서 대화를 선택하세요.
            </div>
          )}

          {selectedConv && (
            <>
              {/* Header */}
              <div className="px-3 sm:px-5 py-3 sm:py-3.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2 sm:gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/[0.06] text-ink-500 hover:text-ink-800 transition-colors flex-shrink-0"
                  aria-label="목록으로"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ink-600 to-ink-800 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                  {(selectedConv.visitor_name || "?").slice(0, 1)}
                </div>
                <div className="flex-1 leading-tight min-w-0">
                  <div className="text-[14px] font-bold text-ink-900 truncate">
                    {selectedConv.visitor_name || "익명 방문자"}
                  </div>
                  <div className="text-[11px] text-ink-500 truncate">
                    {selectedConv.visitor_company || "회사명 미입력"} · {fmtTime(selectedConv.created_at)}
                  </div>
                </div>
                <span className="hidden sm:inline text-[10px] font-mono text-ink-500 flex-shrink-0">
                  {selectedConv.id.slice(0, 8)}
                </span>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-[12px] text-ink-500 py-8">
                    아직 메시지가 없습니다.
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%] sm:max-w-[70%]">
                      <div
                        className={`rounded-xl px-3.5 py-2.5 text-[13.5px] whitespace-pre-wrap leading-relaxed
                          ${
                            m.role === "admin"
                              ? "bg-accent-500 text-white rounded-tr-md"
                              : m.role === "visitor"
                              ? "bg-white/[0.06] text-ink-900 rounded-tl-md border border-white/[0.06]"
                              : "bg-yellow-500/10 text-yellow-200 rounded-md border border-yellow-500/20 text-[12px]"
                          }`}
                      >
                        {m.content}
                      </div>
                      <div className="text-[10px] font-mono text-ink-500 mt-1 px-1">
                        {m.role === "admin" ? "나" : m.role === "visitor" ? "방문자" : "system"} ·{" "}
                        {fmtTime(m.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div className="border-t border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={onKey}
                    rows={2}
                    disabled={sending}
                    placeholder="답변 입력…"
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-[13.5px] text-ink-900 placeholder:text-ink-500 outline-none focus:border-accent-500/50 focus:bg-white/[0.06] transition-colors resize-none disabled:opacity-60"
                  />
                  <button
                    onClick={() => void handleReply()}
                    disabled={!reply.trim() || sending}
                    className="h-[60px] px-3 sm:px-4 flex items-center justify-center gap-1.5 rounded-lg bg-accent-500 hover:bg-accent-400 text-white text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_-2px_rgba(14,165,233,0.4)] flex-shrink-0"
                  >
                    <Send size={14} />
                    <span className="hidden sm:inline">전송</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}