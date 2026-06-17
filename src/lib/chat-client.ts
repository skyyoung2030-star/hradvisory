// src/lib/chat-client.ts
// 라이브 채팅 시스템 — Supabase Realtime 기반
// 방문자(WelcomeMiniChat)와 어드민(AdminInbox) 양쪽에서 함께 사용.

import { getSupabase } from "./supabase";

const VISITOR_ID_KEY = "hcg_visitor_id";
const CONVERSATION_ID_KEY = "hcg_conversation_id";

export type Conversation = {
  id: string;
  created_at: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_company: string | null;
  last_message_at: string;
  has_unread: boolean;
  status: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  created_at: string;
  role: "visitor" | "admin" | "system";
  content: string;
};

function uuid(): string {
  // crypto.randomUUID is available in modern browsers + Node
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getStoredConversationId(): string | null {
  return localStorage.getItem(CONVERSATION_ID_KEY);
}

export function setStoredConversationId(id: string): void {
  localStorage.setItem(CONVERSATION_ID_KEY, id);
}

export function clearStoredConversationId(): void {
  localStorage.removeItem(CONVERSATION_ID_KEY);
}

/* ─────────────── Conversation 작업 ─────────────── */

export async function createConversation(
  visitorName?: string,
  visitorCompany?: string,
): Promise<Conversation | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const visitorId = getVisitorId();
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      visitor_id: visitorId,
      visitor_name: visitorName || null,
      visitor_company: visitorCompany || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[createConversation] failed:", error);
    return null;
  }

  setStoredConversationId(data.id);
  return data as Conversation;
}

export async function loadConversation(id: string): Promise<Conversation | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("conversations")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Conversation;
}

export async function listConversations(): Promise<Conversation[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("conversations")
    .select()
    .order("last_message_at", { ascending: false })
    .limit(200);

  return (data || []) as Conversation[];
}

export async function updateConversationMeta(
  id: string,
  patch: Partial<Pick<Conversation, "visitor_name" | "visitor_company" | "has_unread" | "status">>,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("conversations").update(patch).eq("id", id);
}

export async function markAsRead(conversationId: string): Promise<void> {
  await updateConversationMeta(conversationId, { has_unread: false });
}

/* ─────────────── Messages 작업 ─────────────── */

export async function loadMessages(conversationId: string): Promise<Message[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("messages")
    .select()
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (data || []) as Message[];
}

export async function sendMessage(
  conversationId: string,
  role: "visitor" | "admin" | "system",
  content: string,
): Promise<Message | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single();

  if (error) {
    console.error("[sendMessage] failed:", error);
    return null;
  }

  // Update conversation metadata
  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      has_unread: role === "visitor", // 방문자 메시지면 어드민이 봐야 할 게 생김
    })
    .eq("id", conversationId);

  return data as Message;
}

/* ─────────────── Realtime 구독 ─────────────── */

export function subscribeToMessages(
  conversationId: string,
  onMessage: (msg: Message) => void,
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message),
    )
    .subscribe();

  return () => {
    void channel.unsubscribe();
  };
}

/** 어드민 inbox용 — 모든 conversation 변경 감지 */
export function subscribeToInbox(onChange: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel("inbox:all")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "conversations" },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void channel.unsubscribe();
  };
}