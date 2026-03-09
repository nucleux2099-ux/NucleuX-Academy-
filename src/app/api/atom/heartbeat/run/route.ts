import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { runScopedHeartbeat } from '@/lib/atom/heartbeat-service';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
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

  return NextResponse.json({ scopeKey: scope.scopeKey, result });
}
