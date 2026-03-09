import type { SupabaseClient } from '@supabase/supabase-js';
import {
  deriveAtomThreadIdForScope,
  isCanonicalScopeThreadId,
} from '@/lib/atom/user-scope';

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

type ScopeGuardInput = {
  scopeKey: string;
  threadId?: string;
};

export function resolveCanonicalThread(input: ScopeGuardInput): string {
  const canonical = deriveAtomThreadIdForScope(input.scopeKey);
  if (input.threadId && input.threadId !== canonical) {
    throw new Error('Scope guard violation: threadId does not match provided scope');
  }
  return canonical;
}

async function migrateLegacySessionToScope(
  supabase: SupabaseClient,
  userId: string,
  roomId: string,
  canonicalThreadId: string,
) {
  const { data: existingCanonical } = await supabase
    .from('atom_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('thread_id', canonicalThreadId)
    .maybeSingle();

  if (existingCanonical?.id) return;

  const { data: legacy } = await supabase
    .from('atom_sessions')
    .select('id,thread_id')
    .eq('user_id', userId)
    .eq('room_id', roomId)
    .neq('thread_id', canonicalThreadId)
    .order('updated_at', { ascending: false })
    .limit(5);

  const candidate = (legacy ?? []).find((row) => !isCanonicalScopeThreadId(row.thread_id));
  if (!candidate?.id) return;

  await supabase
    .from('atom_sessions')
    .update({ thread_id: canonicalThreadId })
    .eq('id', candidate.id)
    .eq('user_id', userId)
    .eq('thread_id', candidate.thread_id);
}

export async function startOrResumeAtomSession(
  supabase: SupabaseClient,
  userId: string,
  input: { scopeKey: string; threadId?: string; roomId?: string; selectedBookIds?: string[] },
): Promise<AtomSession> {
  const roomId = input.roomId ?? 'atom';
  const resolvedThreadId = resolveCanonicalThread({ scopeKey: input.scopeKey, threadId: input.threadId });

  await migrateLegacySessionToScope(supabase, userId, roomId, resolvedThreadId);

  const payload = {
    user_id: userId,
    thread_id: resolvedThreadId,
    room_id: roomId,
    selected_book_ids: input.selectedBookIds ?? [],
    status: 'active',
  };

  const { error: upsertError } = await supabase.from('atom_sessions').upsert(payload, { onConflict: 'user_id,thread_id' });
  if (upsertError) throw upsertError;

  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,thread_id,room_id,status,selected_book_ids,last_user_query,continuation_cursor,updated_at,created_at')
    .eq('user_id', userId)
    .eq('thread_id', resolvedThreadId)
    .single();
  if (error) throw error;
  return data as AtomSession;
}

export async function getAtomSession(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  scopeKey: string,
) {
  const canonicalThreadId = deriveAtomThreadIdForScope(scopeKey);
  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,thread_id,room_id,status,selected_book_ids,last_user_query,continuation_cursor,updated_at,created_at')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .eq('thread_id', canonicalThreadId)
    .single();
  if (error) return null;
  return data as AtomSession;
}

export async function appendSessionMessage(
  supabase: SupabaseClient,
  userId: string,
  scopeKey: string,
  sessionId: string,
  role: 'user' | 'assistant' | 'system' | 'tool',
  content: string,
  meta: Record<string, unknown> = {},
) {
  const session = await getAtomSession(supabase, userId, sessionId, scopeKey);
  if (!session) throw new Error('Scope guard violation: session not found for provided scope');

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

export async function getRecentSessionMessages(
  supabase: SupabaseClient,
  userId: string,
  scopeKey: string,
  sessionId: string,
  limit = 12,
) {
  const session = await getAtomSession(supabase, userId, sessionId, scopeKey);
  if (!session) return [];

  const { data, error } = await supabase
    .from('atom_session_messages')
    .select('turn_index,role,content_md,meta,created_at')
    .eq('session_id', sessionId)
    .order('turn_index', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).reverse();
}

export async function listUserAtomSessions(
  supabase: SupabaseClient,
  userId: string,
  scopeKey: string,
  limit = 20,
) {
  const canonicalThreadId = deriveAtomThreadIdForScope(scopeKey);
  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,thread_id,room_id,status,selected_book_ids,last_user_query,continuation_cursor,updated_at,created_at')
    .eq('user_id', userId)
    .eq('thread_id', canonicalThreadId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as AtomSession[];
}

export async function updateSessionCursor(
  supabase: SupabaseClient,
  userId: string,
  scopeKey: string,
  sessionId: string,
  patch: { lastUserQuery?: string; continuationCursor?: Record<string, unknown> },
) {
  const session = await getAtomSession(supabase, userId, sessionId, scopeKey);
  if (!session) throw new Error('Scope guard violation: session not found for provided scope');

  const update: Record<string, unknown> = {};
  if (typeof patch.lastUserQuery === 'string') update.last_user_query = patch.lastUserQuery;
  if (patch.continuationCursor) update.continuation_cursor = patch.continuationCursor;
  if (Object.keys(update).length === 0) return;

  const { error } = await supabase.from('atom_sessions').update(update).eq('id', sessionId).eq('user_id', userId);
  if (error) throw error;
}
