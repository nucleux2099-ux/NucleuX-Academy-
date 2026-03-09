import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveScopeAccess } from '@/lib/atom/telemetry-access';
import { getRetentionStatus } from '@/lib/atom/telemetry-rollups';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const retentionDays = Number(url.searchParams.get('retentionDays') ?? process.env.ATOM_TELEMETRY_RETENTION_DAYS ?? 30);
  let scopeKey: string;

  try {
    scopeKey = resolveScopeAccess({ request, userId: user.id, requestedScope: url.searchParams.get('scopeKey') }).scopeKey;
  } catch {
    return NextResponse.json({ error: 'Forbidden scope access' }, { status: 403 });
  }

  const status = await getRetentionStatus({ supabase, retentionDays, scopeKey });
  return NextResponse.json({ kind: 'atom.telemetry.contract.retention_status.v1', scopeKey, ...status });
}
