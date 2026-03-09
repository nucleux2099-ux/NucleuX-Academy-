import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseWindow, resolveScopeAccess, windowStart } from '@/lib/atom/telemetry-access';

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

  const from = windowStart(window).toISOString();
  const to = new Date().toISOString();

  const { data, error } = await supabase
    .from('atom_telemetry_rollups')
    .select('bucket_start,continuity_score,grounding_score,personalization_score,events')
    .eq('scope_key', scopeKey)
    .eq('granularity', 'day')
    .gte('bucket_start', from)
    .lte('bucket_start', to)
    .order('bucket_start', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    kind: 'atom.telemetry.contract.calibration_trend.v1',
    scopeKey,
    window,
    points: data ?? [],
  });
}
