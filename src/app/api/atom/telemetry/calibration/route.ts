import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deriveTelemetrySummary } from '@/lib/atom/telemetry-metrics';
import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';
import { buildCalibrationSummary, type FeedbackRow } from '@/lib/atom/calibration';
import { parseWindow, resolveScopeAccess, windowStart } from '@/lib/atom/telemetry-access';

function mapEvents(rows: Array<Record<string, unknown>>): AtomTelemetryEvent[] {
  return rows.map((row) => ({
    eventId: String(row.event_id),
    eventName: row.event_name as AtomTelemetryEvent['eventName'],
    ts: String(row.ts),
    scopeKey: String(row.scope_key),
    actorUserId: row.actor_user_id ? String(row.actor_user_id) : undefined,
    sessionId: row.session_id ? String(row.session_id) : undefined,
    route: String(row.route),
    mode: String(row.mode),
    latencyMs: Number(row.latency_ms ?? 0),
    status: row.status as AtomTelemetryEvent['status'],
    reasonCode: row.reason_code ? String(row.reason_code) : undefined,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
  }));
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const window = parseWindow(url.searchParams.get('window'));

  let scopeKey: string;
  try {
    scopeKey = resolveScopeAccess({ request, userId: user.id, requestedScope: url.searchParams.get('scopeKey') }).scopeKey;
  } catch {
    return NextResponse.json({ error: 'Forbidden scope access' }, { status: 403 });
  }

  const to = new Date();
  const from = windowStart(window);
  const prevFrom = new Date(from.getTime() - (to.getTime() - from.getTime()));

  const [eventsRes, prevEventsRes, feedbackRes] = await Promise.all([
    supabase.from('atom_telemetry_events').select('event_id,event_name,ts,scope_key,actor_user_id,session_id,route,mode,latency_ms,status,reason_code,metadata').eq('scope_key', scopeKey).gte('ts', from.toISOString()).lte('ts', to.toISOString()).order('ts', { ascending: true }),
    supabase.from('atom_telemetry_events').select('event_id,event_name,ts,scope_key,actor_user_id,session_id,route,mode,latency_ms,status,reason_code,metadata').eq('scope_key', scopeKey).gte('ts', prevFrom.toISOString()).lt('ts', from.toISOString()).order('ts', { ascending: true }),
    supabase.from('atom_feedback').select('sentiment,rating,resolved,classification').eq('scope_key', scopeKey).gte('created_at', from.toISOString()).lte('created_at', to.toISOString()),
  ]);

  if (eventsRes.error || prevEventsRes.error || feedbackRes.error) {
    return NextResponse.json({ error: eventsRes.error?.message ?? prevEventsRes.error?.message ?? feedbackRes.error?.message }, { status: 500 });
  }

  const events = mapEvents((eventsRes.data ?? []) as Array<Record<string, unknown>>);
  const prevEvents = mapEvents((prevEventsRes.data ?? []) as Array<Record<string, unknown>>);
  const feedback = ((feedbackRes.data ?? []) as FeedbackRow[]);

  const currentSummary = deriveTelemetrySummary({ window: '24h', scopeKey, from: from.toISOString(), to: to.toISOString(), events });
  const previousSummary = deriveTelemetrySummary({ window: '24h', scopeKey, from: prevFrom.toISOString(), to: from.toISOString(), events: prevEvents });

  const summary = buildCalibrationSummary({
    scopeKey,
    window,
    current: currentSummary,
    previous: previousSummary,
    feedback,
  });

  return NextResponse.json({ kind: 'atom.telemetry.calibration.v1', summary });
}
