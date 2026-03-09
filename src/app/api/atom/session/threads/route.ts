import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listUserAtomSessions } from '@/lib/atom/session-store';
import { deriveAtomUserScopeKey, deriveAtomThreadIdForScope } from '@/lib/atom/user-scope';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const scopeKey = deriveAtomUserScopeKey({
    userId: user.id,
    accountId: url.searchParams.get('accountId') ?? request.headers.get('x-atom-account-id'),
    channel: url.searchParams.get('channel') ?? request.headers.get('x-atom-channel') ?? 'web',
    peerId: url.searchParams.get('peer') ?? request.headers.get('x-atom-peer') ?? user.id,
  });

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
