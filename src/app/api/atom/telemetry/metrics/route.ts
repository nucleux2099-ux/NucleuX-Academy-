import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { deriveTelemetrySummary } from '@/lib/atom/telemetry-metrics';
import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

function windowToStart(window: string): Date {
  const now = Date.now();
  if (window === '1h') return new Date(now - 60 * 60 * 1000);
  if (window === '7d') return new Date(now - 7 * 24 * 60 * 60 * 1000);
  return new Date(now - 24 * 60 * 60 * 1000);
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const window = (url.searchParams.get('window') ?? '24h') as '1h' | '24h' | '7d';

  let scope = resolveAtomScopeKeyForRequest({ request, userId: user.id });
  const requestedScope = url.searchParams.get('scopeKey');
  if (requestedScope && requestedScope !== scope.scopeKey) {
    const adminKey = request.headers.get('x-atom-admin-key');
    if (!adminKey || adminKey !== process.env.ATOM_ADMIN_KEY) {
      return NextResponse.json({ error: 'Forbidden scope access' }, { status: 403 });
    }
    scope = { ...scope, scopeKey: requestedScope };
  }

  const from = windowToStart(window).toISOString();
  const to = new Date().toISOString();

  const { data, error } = await supabase
    .from('atom_telemetry_events')
    .select('event_id,event_name,ts,scope_key,actor_user_id,session_id,route,mode,latency_ms,status,reason_code,metadata')
    .eq('scope_key', scope.scopeKey)
    .gte('ts', from)
    .lte('ts', to)
    .order('ts', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const events: AtomTelemetryEvent[] = (data ?? []).map((row) => ({
    eventId: row.event_id,
    eventName: row.event_name,
    ts: row.ts,
    scopeKey: row.scope_key,
    actorUserId: row.actor_user_id ?? undefined,
    sessionId: row.session_id ?? undefined,
    route: row.route,
    mode: row.mode,
    latencyMs: row.latency_ms,
    status: row.status,
    reasonCode: row.reason_code ?? undefined,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
  }));

  const summary = deriveTelemetrySummary({ window, scopeKey: scope.scopeKey, from, to, events });
  return NextResponse.json({
    kind: 'atom.telemetry.summary.v1',
    summary,
  });
}
