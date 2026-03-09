import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deriveTelemetrySummary } from '@/lib/atom/telemetry-metrics';
import { alertTimeBucket, buildAlertDedupeKey, evaluateAlerts, shouldEmitAlert, type AlertCooldownRecord } from '@/lib/atom/alerting';
import { parseWindow, resolveScopeAccess, windowStart } from '@/lib/atom/telemetry-access';
import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

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

  const now = new Date();
  const to = now;
  const from = windowStart(window);
  const prevFrom = new Date(from.getTime() - (to.getTime() - from.getTime()));

  const [eventsRes, prevRes] = await Promise.all([
    supabase.from('atom_telemetry_events').select('event_id,event_name,ts,scope_key,actor_user_id,session_id,route,mode,latency_ms,status,reason_code,metadata').eq('scope_key', scopeKey).gte('ts', from.toISOString()).lte('ts', to.toISOString()),
    supabase.from('atom_telemetry_events').select('event_id,event_name,ts,scope_key,actor_user_id,session_id,route,mode,latency_ms,status,reason_code,metadata').eq('scope_key', scopeKey).gte('ts', prevFrom.toISOString()).lt('ts', from.toISOString()),
  ]);
  if (eventsRes.error || prevRes.error) return NextResponse.json({ error: eventsRes.error?.message ?? prevRes.error?.message }, { status: 500 });

  const events = mapEvents((eventsRes.data ?? []) as Array<Record<string, unknown>>);
  const prevEvents = mapEvents((prevRes.data ?? []) as Array<Record<string, unknown>>);

  const current = deriveTelemetrySummary({ window: '24h', scopeKey, from: from.toISOString(), to: to.toISOString(), events });
  const previous = deriveTelemetrySummary({ window: '24h', scopeKey, from: prevFrom.toISOString(), to: from.toISOString(), events: prevEvents });
  const securityAnomalies = events.filter((e) => e.reasonCode?.includes('scope_guard') || e.reasonCode?.includes('security')).length;

  const alerts = evaluateAlerts({ current, previous, securityAnomalies });

  if (alerts.length > 0) {
    const recentThreshold = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const { data: recentRows } = await supabase
      .from('atom_telemetry_alerts')
      .select('kind,ts')
      .eq('scope_key', scopeKey)
      .gte('ts', recentThreshold)
      .order('ts', { ascending: false });

    const recent = ((recentRows ?? []) as Array<Record<string, unknown>>)
      .map((row) => ({ kind: String(row.kind), ts: String(row.ts) } as AlertCooldownRecord));

    const bucket = alertTimeBucket(now);
    const inserts = alerts
      .filter((a) => shouldEmitAlert(a, now, recent))
      .map((a) => ({
        scope_key: scopeKey,
        kind: a.kind,
        severity: a.severity,
        metric_value: a.metricValue,
        threshold_value: a.thresholdValue,
        metadata: a.metadata ?? {},
        ts: now.toISOString(),
        dedupe_key: buildAlertDedupeKey(scopeKey, a.kind, now),
        time_bucket: bucket,
      }));

    if (inserts.length > 0) {
      await supabase.from('atom_telemetry_alerts').upsert(inserts, { onConflict: 'dedupe_key,time_bucket', ignoreDuplicates: true });
    }
  }

  const { data: persisted } = await supabase
    .from('atom_telemetry_alerts')
    .select('event_id,scope_key,kind,severity,metric_value,threshold_value,metadata,ts,dedupe_key,time_bucket')
    .eq('scope_key', scopeKey)
    .gte('ts', from.toISOString())
    .order('ts', { ascending: false });

  return NextResponse.json({ kind: 'atom.telemetry.alerts.v1', window, scopeKey, alerts: persisted ?? [] });
}
