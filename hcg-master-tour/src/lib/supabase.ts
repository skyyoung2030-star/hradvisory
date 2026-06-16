import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Lazy singleton — only initialised when env vars are present.
 *
 * When the user hasn't wired Supabase yet, every call site sees `null`
 * and the lib/api.ts wrappers silently no-op. This keeps the tour fully
 * functional in pure preview mode (no backend required) while still
 * persisting data the moment keys are added.
 */
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  if (!url || !anon) return null;
  _client = createClient(url, anon);
  return _client;
}

export const isSupabaseConfigured = Boolean(url && anon);
