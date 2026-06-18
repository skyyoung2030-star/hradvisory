// src/pages/LeadsPage.tsx
// Supabase leads 테이블을 모바일에서 빠르게 확인하는 페이지. /leads 라우트.
// AdminInbox와 같은 PIN을 공유해서 한 번 로그인하면 자동 통과.

import { useEffect, useState } from "react";
import {
  Lock,
  LogOut,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  User,
  Briefcase,
  Users as UsersIcon,
  AlertCircle,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const PIN_KEY = "hcg_admin_pin_ok";

type Lead = {
  id: string | number;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  tier: string;
  status: string;
  metadata: {
    diagnose?: {
      companySize?: string;
      hrCapacity?: string;
      pains?: string[];
    } | null;
  } | null;
};

/* ─────────────── PIN 게이트 (AdminInbox와 동일 키 공유) ─────────────── */

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
      <div className="relative z-10 w-[360px] max-w-[90vw] card p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4">
            <Lock size={20} className="text-ink-600" />
          </div>
          <h1 className="text-[18px] font-bold text-ink-900">Leads 조회</h1>
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
        <button onClick={submit} className="btn-primary w-full mt-4">
          입장
        </button>
      </div>
    </main>
  );
}

/* ─────────────── 유틸 ─────────────── */

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tierColor(tier: string): { bg: string; text: string; label: string } {
  const t = (tier || "").toLowerCase();
  if (t.includes("premium")) return { bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-300", label: "Premium" };
  if (t.includes("standard")) return { bg: "bg-accent-500/15 border-accent-500/30", text: "text-accent-300", label: "Standard" };
  if (t.includes("light")) return { bg: "bg-success-500/15 border-success-500/30", text: "text-success-300", label: "Light" };
  return { bg: "bg-white/[0.06] border-white/10", text: "text-ink-600", label: tier || "—" };
}

/* ─────────────── Lead Card ─────────────── */

function LeadCard({ lead }: { lead: Lead }) {
  const t = tierColor(lead.tier);
  const diag = lead.metadata?.diagnose;
  const pains = diag?.pains || [];

  return (
    <div className="card p-4 sm:p-5 shadow-depth-2">
      {/* Top: name + tier */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[15px] font-bold text-ink-900">
            <User size={14} className="text-ink-500 flex-shrink-0" />
            <span className="truncate">{lead.name}</span>
          </div>
          {lead.company && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-ink-600 mt-1">
              <Building2 size={12} className="text-ink-500 flex-shrink-0" />
              <span className="truncate">{lead.company}</span>
            </div>
          )}
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md border ${t.bg} ${t.text} text-[11px] font-bold tracking-wider flex-shrink-0`}>
          {t.label}
        </span>
      </div>

      {/* Contact */}
      <div className="space-y-1.5 mb-3">
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-1.5 text-[12.5px] text-ink-700 hover:text-accent-400 transition-colors break-all"
          >
            <Mail size={12} className="text-ink-500 flex-shrink-0" />
            {lead.email}
          </a>
        )}
        {lead.phone && (
          <a
            href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-1.5 text-[12.5px] text-ink-700 hover:text-accent-400 transition-colors"
          >
            <Phone size={12} className="text-ink-500 flex-shrink-0" />
            {lead.phone}
          </a>
        )}
      </div>

      {/* Diagnose info */}
      {diag && (diag.companySize || diag.hrCapacity || (pains && pains.length > 0)) && (
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 mb-3 space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500 mb-1.5">
            진단 정보
          </div>
          {diag.companySize && (
            <div className="flex items-start gap-1.5 text-[11.5px] text-ink-700">
              <UsersIcon size={11} className="text-ink-500 flex-shrink-0 mt-0.5" />
              <span><span className="text-ink-500">규모:</span> {diag.companySize}</span>
            </div>
          )}
          {diag.hrCapacity && (
            <div className="flex items-start gap-1.5 text-[11.5px] text-ink-700">
              <Briefcase size={11} className="text-ink-500 flex-shrink-0 mt-0.5" />
              <span><span className="text-ink-500">HR:</span> {diag.hrCapacity}</span>
            </div>
          )}
          {pains && pains.length > 0 && (
            <div className="flex items-start gap-1.5 text-[11.5px] text-ink-700">
              <AlertCircle size={11} className="text-ink-500 flex-shrink-0 mt-0.5" />
              <span className="break-words">
                <span className="text-ink-500">페인:</span> {pains.join(" · ")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer: time + id */}
      <div className="flex items-center justify-between text-[10.5px] font-mono text-ink-500">
        <span>{fmtDate(lead.created_at)}</span>
        <span>#{String(lead.id).slice(0, 8)}</span>
      </div>
    </div>
  );
}

/* ─────────────── Main ─────────────── */

export default function LeadsPage() {
  const [unlocked, setUnlocked] = useState(
    typeof window !== "undefined" && localStorage.getItem(PIN_KEY) === "1",
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    void refresh();
  }, [unlocked]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Supabase가 연결되어 있지 않습니다.");
        setLeads([]);
        return;
      }
      const { data, error: qErr } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (qErr) throw qErr;
      setLeads((data || []) as Lead[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(PIN_KEY);
    setUnlocked(false);
  }

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  const contactLeads = leads.filter((l) => l.status === "contact_requested");
  const otherLeads = leads.filter((l) => l.status !== "contact_requested");

  return (
    <main className="min-h-screen bg-ink-50 bg-spotlight">
      <div aria-hidden className="fixed inset-0 bg-grid-line mask-vignette opacity-40 pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 h-14 px-4 sm:px-6 flex items-center border-b border-white/[0.06] bg-ink-50/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-2 text-ink-900 font-semibold min-w-0">
          <Briefcase size={18} className="text-accent-500 flex-shrink-0" />
          <span className="text-[14px] sm:text-[15px] truncate">Leads</span>
          <span className="ml-1 sm:ml-2 px-2 py-0.5 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300 text-[11px] font-bold tracking-wider flex-shrink-0">
            {contactLeads.length}
          </span>
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

      {/* Content */}
      <div className="relative z-10 max-w-[680px] mx-auto px-4 py-5 space-y-3">
        {error && (
          <div className="card p-4 border-red-500/30 bg-red-500/[0.05]">
            <div className="flex items-center gap-2 text-[13px] text-red-300">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading && leads.length === 0 && (
          <div className="text-center text-[12px] text-ink-500 py-12">불러오는 중…</div>
        )}

        {!loading && contactLeads.length === 0 && otherLeads.length === 0 && !error && (
          <div className="text-center text-[12px] text-ink-500 py-12">
            아직 신청한 리드가 없습니다.
          </div>
        )}

        {contactLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}

        {otherLeads.length > 0 && (
          <>
            <div className="pt-4 pb-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ink-500">
              기타 ({otherLeads.length})
            </div>
            {otherLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </>
        )}
      </div>
    </main>
  );
}