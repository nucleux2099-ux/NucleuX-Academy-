import type { SupabaseClient } from '@supabase/supabase-js';
import { deriveTelemetrySummary } from '@/lib/atom/telemetry-metrics';
import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

export type RollupGranularity = 'hour' | 'day';

function bucketDate(ts: string, granularity: RollupGranularity): string {
  const d = new Date(ts);
  if (granularity === 'day') d.setUTCHours(0, 0, 0, 0);
  else d.setUTCMinutes(0, 0, 0);
  return d.toISOString();
}

export function bucketEvents(events: AtomTelemetryEvent[], granularity: RollupGranularity): Map<string, AtomTelemetryEvent[]> {
  const buckets = new Map<string, AtomTelemetryEvent[]>();
  for (const event of events) {
    const key = bucketDate(event.ts, granularity);
    const arr = buckets.get(key) ?? [];
    arr.push(event);
    buckets.set(key, arr);
  }
  return buckets;
}

export async function computeAndStoreRollups(params: {
  supabase: SupabaseClient;
  scopeKey: string;
  from: string;
  to: string;
  granularity: RollupGranularity;
}): Promise<number> {
  const { data, error } = await params.supabase
    .from('atom_telemetry_events')
    .select('event_id,event_name,ts,scope_key,actor_user_id,session_id,route,mode,latency_ms,status,reason_code,metadata')
    .eq('scope_key', params.scopeKey)
    .gte('ts', params.from)
    .lte('ts', params.to)
    .order('ts', { ascending: true });

  if (error) throw new Error(error.message);

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

  const buckets = bucketEvents(events, params.granularity);
  const upserts = [...buckets.entries()].map(([bucketStart, list]) => {
    const summary = deriveTelemetrySummary({
      window: '24h',
      scopeKey: params.scopeKey,
      from: bucketStart,
      to: bucketStart,
      events: list,
    });
    return {
      scope_key: params.scopeKey,
      granularity: params.granularity,
      bucket_start: bucketStart,
      window_label: params.granularity,
      events: summary.overall.events,
      failures: Math.round(summary.overall.failureRate * summary.overall.events),
      fallbacks: Math.round(summary.overall.fallbackHitRate * summary.overall.events),
      p95_latency_ms: summary.overall.p95LatencyMs,
      continuity_score: summary.quality.continuityScore,
      grounding_score: summary.quality.groundingScore,
      isolation_score: summary.quality.isolationScore,
      personalization_score: summary.quality.personalizationScore,
      updated_at: new Date().toISOString(),
    };
  });

  if (upserts.length === 0) return 0;

  const { error: upsertError } = await params.supabase
    .from('atom_telemetry_rollups')
    .upsert(upserts, { onConflict: 'scope_key,granularity,bucket_start' });

  if (upsertError) throw new Error(upsertError.message);
  return upserts.length;
}

export async function materializeRollupsForScopes(params: {
  supabase: SupabaseClient;
  scopeKeys: string[];
  from: string;
  to: string;
  granularity: RollupGranularity;
}): Promise<{ scopeKey: string; inserted: number }[]> {
  const out: { scopeKey: string; inserted: number }[] = [];
  for (const scopeKey of params.scopeKeys) {
    const inserted = await computeAndStoreRollups({
      supabase: params.supabase,
      scopeKey,
      from: params.from,
      to: params.to,
      granularity: params.granularity,
    });
    out.push({ scopeKey, inserted });
  }
  return out;
}

export async function pruneRawTelemetry(params: {
  supabase: SupabaseClient;
  retentionDays?: number;
  dryRun?: boolean;
  scopeKey?: string;
}): Promise<{ cutoff: string; deleted: number; dryRun: boolean }> {
  const days = params.retentionDays ?? Number(process.env.ATOM_TELEMETRY_RETENTION_DAYS ?? 30);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let query = params.supabase
    .from('atom_telemetry_events')
    .select('id', { count: 'exact', head: true })
    .lt('created_at', cutoff);

  if (params.scopeKey) query = query.eq('scope_key', params.scopeKey);
  const { count, error } = await query;
  if (error) throw new Error(error.message);

  const toDelete = count ?? 0;
  if (!params.dryRun && toDelete > 0) {
    let del = params.supabase.from('atom_telemetry_events').delete().lt('created_at', cutoff);
    if (params.scopeKey) del = del.eq('scope_key', params.scopeKey);
    const { error: delErr } = await del;
    if (delErr) throw new Error(delErr.message);
  }

  return { cutoff, deleted: toDelete, dryRun: Boolean(params.dryRun) };
}

export async function getRetentionStatus(params: {
  supabase: SupabaseClient;
  retentionDays?: number;
  scopeKey?: string;
}): Promise<{ cutoff: string; expiringCount: number; retentionDays: number }> {
  const days = params.retentionDays ?? Number(process.env.ATOM_TELEMETRY_RETENTION_DAYS ?? 30);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  let query = params.supabase
    .from('atom_telemetry_events')
    .select('id', { count: 'exact', head: true })
    .lt('created_at', cutoff);

  if (params.scopeKey) query = query.eq('scope_key', params.scopeKey);

  const { count, error } = await query;
  if (error) throw new Error(error.message);

  return { cutoff, expiringCount: count ?? 0, retentionDays: days };
}
