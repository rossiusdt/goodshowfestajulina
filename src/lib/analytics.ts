import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "https://dwosrwbutepaifdwiitl.supabase.co";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b3Nyd2J1dGVwYWlmZHdpaXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTQ3NTcsImV4cCI6MjA5MzczMDc1N30.r0JBp8eMdRzdgm4C9kqMG9icTcVbMJJDsAXaPoqPdPs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getSessionId(): string {
  let id = sessionStorage.getItem('_analytics_sid');
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('_analytics_sid', id);
  }
  return id;
}

export async function track(event: string, data: Record<string, unknown> = {}) {
  try {
    await supabase.from('analytics_events').insert({
      event,
      data,
      session_id: getSessionId(),
    });
  } catch {
    // never block UX on analytics failure
  }
}
