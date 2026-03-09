import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listUserAtomSessions } from '@/lib/atom/session-store';
import { deriveAtomThreadIdForScope } from '@/lib/atom/user-scope';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  let scopeKey: string;
  try {
    scopeKey = resolveAtomScopeKeyForRequest({
      request,
      userId: user.id,
      envelope: {
        accountId: url.searchParams.get('accountId') ?? undefined,
        channel: url.searchParams.get('channel') ?? undefined,
        peer: url.searchParams.get('peer') ?? undefined,
      },
    }).scopeKey;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const canonicalThreadId = deriveAtomThreadIdForScope(scopeKey);
  const sessions = await listUserAtomSessions(supabase, user.id, scopeKey, 24);

  return NextResponse.json({
    scopeKey,
    threads: sessions
      .filter((session) => session.thread_id === canonicalThreadId)
      .map((session) => ({
        id: session.thread_id,
        sessionId: session.id,
        roomId: session.room_id,
        status: session.status,
        updatedAt: session.updated_at ?? session.created_at ?? new Date().toISOString(),
        title: (session.last_user_query?.trim() || `${session.room_id.toUpperCase()} thread`).slice(0, 80),
      })),
  });
}
