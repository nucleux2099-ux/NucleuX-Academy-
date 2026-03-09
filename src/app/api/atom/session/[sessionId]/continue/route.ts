import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAtomSession } from '@/lib/atom/session-store';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { createAtomTelemetryLogger, startTimer } from '@/lib/atom/telemetry';

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const elapsed = startTimer();
  const supabase = await createClient();
  const telemetry = createAtomTelemetryLogger(supabase);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    accountId?: string;
    channel?: string;
    peer?: string;
    scope?: { accountId?: string; channel?: string; peer?: string };
  };
  let resolvedScope;
  try {
    resolvedScope = resolveAtomScopeKeyForRequest({
      request,
      userId: user.id,
      envelope: body.scope,
      fallback: {
        accountId: body.accountId,
        channel: body.channel,
        peer: body.peer,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
  const scopeKey = resolvedScope.scopeKey;

  const { sessionId } = await context.params;
  const session = await getAtomSession(supabase, user.id, sessionId, scopeKey);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const continuationTopic =
    typeof session.last_user_query === 'string' && session.last_user_query.trim().length > 0
      ? session.last_user_query.trim()
      : typeof session.continuation_cursor?.lastTopic === 'string'
        ? String(session.continuation_cursor.lastTopic)
        : null;

  const response = await fetch(`${request.nextUrl.origin}/api/atom/session/${sessionId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
      'x-atom-account-id': request.headers.get('x-atom-account-id') ?? '',
      'x-atom-channel': request.headers.get('x-atom-channel') ?? 'web',
      'x-atom-peer': request.headers.get('x-atom-peer') ?? user.id,
    },
    body: JSON.stringify({
      context: session.room_id === 'atom' ? 'surgery' : session.room_id,
      scope: resolvedScope.envelope,
      message: continuationTopic
        ? `Continue exactly from where the last answer stopped about: ${continuationTopic}. Stay on same topic and format.`
        : 'Continue exactly from where the last answer stopped. Stay on same topic and format.',
    }),
  });

  const json = await response.json();
  void telemetry.log({
    eventId: crypto.randomUUID(),
    eventName: 'request.lifecycle',
    ts: new Date().toISOString(),
    scopeKey,
    actorUserId: user.id,
    sessionId,
    route: '/api/atom/session/[sessionId]/continue',
    mode: 'continue',
    latencyMs: elapsed(),
    status: response.ok ? 'ok' : 'error',
    reasonCode: response.ok ? undefined : `http_${response.status}`,
    metadata: { delegatedTo: '/api/atom/session/[sessionId]/message' },
  });
  return NextResponse.json({ ...json, scopeKey }, { status: response.status });
}
