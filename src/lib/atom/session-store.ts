import type { SupabaseClient } from '@supabase/supabase-js';

export type AtomSession = {
  id: string;
  thread_id: string;
  room_id: string;
  status: string;
  selected_book_ids: string[];
  last_user_query: string | null;
  continuation_cursor: Record<string, unknown>;
  updated_at?: string;
  created_at?: string;
};

export async function startOrResumeAtomSession(
  supabase: SupabaseClient,
  userId: string,
  input: { threadId: string; roomId?: string; selectedBookIds?: string[] },
): Promise<AtomSession> {
  const payload = {
    user_id: userId,
    thread_id: input.threadId,
    room_id: input.roomId ?? 'atom',
    selected_book_ids: input.selectedBookIds ?? [],
    status: 'active',
  };

  const { error: upsertError } = await supabase.from('atom_sessions').upsert(payload, { onConflict: 'user_id,thread_id' });
  if (upsertError) throw upsertError;

  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,thread_id,room_id,status,selected_book_ids,last_user_query,continuation_cursor,updated_at,created_at')
    .eq('user_id', userId)
    .eq('thread_id', input.threadId)
    .single();
  if (error) throw error;
  return data as AtomSession;
}

export async function getAtomSession(supabase: SupabaseClient, userId: string, sessionId: string) {
  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,thread_id,room_id,status,selected_book_ids,last_user_query,continuation_cursor,updated_at,created_at')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data as AtomSession;
}

export async function appendSessionMessage(
  supabase: SupabaseClient,
  sessionId: string,
  role: 'user' | 'assistant' | 'system' | 'tool',
  content: string,
  meta: Record<string, unknown> = {},
) {
  const { data: latest } = await supabase
    .from('atom_session_messages')
    .select('turn_index')
    .eq('session_id', sessionId)
    .order('turn_index', { ascending: false })
    .limit(1);

  const nextTurn = ((latest?.[0]?.turn_index as number | undefined) ?? -1) + 1;

  const { error } = await supabase.from('atom_session_messages').insert({
    session_id: sessionId,
    turn_index: nextTurn,
    role,
    content_md: content,
    meta,
  });
  if (error) throw error;
}

export async function getRecentSessionMessages(supabase: SupabaseClient, sessionId: string, limit = 12) {
  const { data, error } = await supabase
    .from('atom_session_messages')
    .select('turn_index,role,content_md,meta,created_at')
    .eq('session_id', sessionId)
    .order('turn_index', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).reverse();
}

export async function listUserAtomSessions(supabase: SupabaseClient, userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,thread_id,room_id,status,selected_book_ids,last_user_query,continuation_cursor,updated_at,created_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as AtomSession[];
}

export async function updateSessionCursor(
  supabase: SupabaseClient,
  sessionId: string,
  patch: { lastUserQuery?: string; continuationCursor?: Record<string, unknown> },
) {
  const update: Record<string, unknown> = {};
  if (typeof patch.lastUserQuery === 'string') update.last_user_query = patch.lastUserQuery;
  if (patch.continuationCursor) update.continuation_cursor = patch.continuationCursor;
  if (Object.keys(update).length === 0) return;

  const { error } = await supabase.from('atom_sessions').update(update).eq('id', sessionId);
  if (error) throw error;
}
