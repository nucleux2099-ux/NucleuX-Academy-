import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseWindow, resolveScopeAccess, windowStart } from '@/lib/atom/telemetry-access';
import { computeAndStoreRollups, type RollupGranularity } from '@/lib/atom/telemetry-rollups';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const granularity = (url.searchParams.get('granularity') ?? 'hour') as RollupGranularity;
  if (granularity !== 'hour' && granularity !== 'day') {
    return NextResponse.json({ error: 'granularity must be hour|day' }, { status: 400 });
  }

  const window = parseWindow(url.searchParams.get('window'));

  let scopeKey: string;
  try {
    scopeKey = resolveScopeAccess({ request, userId: user.id, requestedScope: url.searchParams.get('scopeKey') }).scopeKey;
  } catch {
    return NextResponse.json({ error: 'Forbidden scope access' }, { status: 403 });
  }

  const from = windowStart(window).toISOString();
  const to = new Date().toISOString();

  await computeAndStoreRollups({ supabase, scopeKey, from, to, granularity });

  const { data, error } = await supabase
    .from('atom_telemetry_rollups')
    .select('scope_key,granularity,bucket_start,events,failures,fallbacks,p95_latency_ms,continuity_score,grounding_score,isolation_score,personalization_score,updated_at')
    .eq('scope_key', scopeKey)
    .eq('granularity', granularity)
    .gte('bucket_start', from)
    .lte('bucket_start', to)
    .order('bucket_start', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ kind: 'atom.telemetry.rollups.v1', scopeKey, granularity, window, rollups: data ?? [] });
}
