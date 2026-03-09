import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { runScopedHeartbeat } from '@/lib/atom/heartbeat-service';
import { createAtomTelemetryLogger, startTimer } from '@/lib/atom/telemetry';

export async function POST(request: NextRequest) {
  const elapsed = startTimer();
  const supabase = await createClient();
  const telemetry = createAtomTelemetryLogger(supabase);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as {
    cadenceMinutes?: number;
    activeHours?: { startHour: number; endHour: number; timezone?: string };
    scope?: { accountId?: string; channel?: string; peer?: string };
    accountId?: string;
    channel?: string;
    peer?: string;
  };

  const scope = resolveAtomScopeKeyForRequest({
    request,
    userId: user.id,
    envelope: body.scope,
    fallback: { accountId: body.accountId, channel: body.channel, peer: body.peer },
  });

  const result = await runScopedHeartbeat({
    scopeKey: scope.scopeKey,
    config: {
      cadenceMinutes: Math.max(15, body.cadenceMinutes ?? 180),
      activeHours: body.activeHours,
    },
  });

  void telemetry.log({
    eventId: crypto.randomUUID(),
    eventName: 'heartbeat.outcome',
    ts: new Date().toISOString(),
    scopeKey: scope.scopeKey,
    actorUserId: user.id,
    route: '/api/atom/heartbeat/run',
    mode: 'heartbeat',
    latencyMs: elapsed(),
    status: result.status === 'ACTION' ? 'ok' : 'skipped',
    reasonCode: result.reason,
    metadata: { shouldEmit: result.shouldEmit, filesRead: result.readFiles.length },
  });

  return NextResponse.json({ scopeKey: scope.scopeKey, result });
}
