import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAtomSession } from '@/lib/atom/session-store';

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await context.params;
  const session = await getAtomSession(supabase, user.id, sessionId);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const continuationTopic =
    typeof session.last_user_query === 'string' && session.last_user_query.trim().length > 0
      ? session.last_user_query.trim()
      : typeof session.continuation_cursor?.lastTopic === 'string'
        ? String(session.continuation_cursor.lastTopic)
        : null;

  const response = await fetch(`${request.nextUrl.origin}/api/atom/session/${sessionId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: request.headers.get('cookie') ?? '' },
    body: JSON.stringify({
      context: session.room_id === 'atom' ? 'surgery' : session.room_id,
      message: continuationTopic
        ? `Continue exactly from where the last answer stopped about: ${continuationTopic}. Stay on same topic and format.`
        : 'Continue exactly from where the last answer stopped. Stay on same topic and format.',
    }),
  });

  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
