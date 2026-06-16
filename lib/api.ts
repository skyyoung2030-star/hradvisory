// src/lib/api.ts
// Drop-in client-side replacements for the previous Next.js /api/* routes.
// All functions are async and silent-on-failure — analytics must NEVER
// block the tour UX.

import { getSupabase } from "./supabase";

/* ─────────────── Turnkey click tracking ─────────────── */

export async function recordTurnkeyClick(source = "welcome"): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return; // mock mode — no-op
  try {
    await supabase.from("turnkey_clicks").insert({ source });
  } catch (e) {
    console.warn("[recordTurnkeyClick] failed (non-blocking):", e);
  }
}

/* ─────────────── Lead persistence ─────────────── */

export type DiagnosePartial = {
  companySize: string;
  hrCapacity: string;
  pains: string[];
};

export type LeadSubmission = {
  name: string;
  email: string;
  phone?: string;
  company: string;
  tier: string;
  diagnose?: DiagnosePartial | null;
};

export async function saveDiagnosePartial(_data: DiagnosePartial): Promise<void> {
  // 자동 저장 비활성화 — 실제 contact_requested lead만 Supabase에 저장합니다.
  // 진단 데이터는 sessionStorage에 살아있어서 Step 2 chip 연동 + Step 6 제출 시
  // metadata로 함께 전달됩니다.
  // funnel 분석을 다시 켜고 싶다면 아래 주석을 풀고 인자명 _data → data 로 바꾸세요.
  return;
  /*
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("leads").insert({
      status: "diagnosing",
      metadata: _data,
    });
  } catch (e) {
    console.warn("[saveDiagnosePartial] failed:", e);
  }
  */
}

export async function submitLead(data: LeadSubmission): Promise<{ ok: boolean }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: true }; // mock — pretend it worked
  try {
    const { error } = await supabase.from("leads").insert({
      name:    data.name,
      email:   data.email,
      phone:   data.phone ?? null,
      company: data.company,
      tier:    data.tier,
      status:  "contact_requested",
      metadata: { diagnose: data.diagnose ?? null },
    });
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    console.error("[submitLead] failed:", e);
    return { ok: false };
  }
}

/* ─────────────── Demo chat replies (mock only) ─────────────── */
// Real Anthropic API can't be called from the browser due to CORS.
// To wire a real LLM later, point getChatReply() at a Supabase Edge
// Function or your own proxy. For the tour itself, the curated mock
// replies in claude-mock.ts feel like a real consultant.

import { getMockReply, type ChatMessage } from "./claude-mock";

export async function getChatReply(messages: ChatMessage[]): Promise<string> {
  // Simulate typing latency for realism (300–700 ms)
  const wait = 300 + Math.random() * 400;
  await new Promise((r) => setTimeout(r, wait));
  const last = messages[messages.length - 1]?.content ?? "";
  return getMockReply(last);
}
