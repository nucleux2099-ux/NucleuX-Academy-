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
  const { data, error } = await supabase
    .from('atom_telemetry_alerts')
    .select('kind,severity,time_bucket,ts')
    .eq('scope_key', scopeKey)
    .gte('ts', from)
    .order('ts', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    kind: 'atom.telemetry.contract.alert_burndown.v1',
    scopeKey,
    window,
    alerts: data ?? [],
  });
}
