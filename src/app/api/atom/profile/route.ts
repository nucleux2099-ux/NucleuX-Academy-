import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import {
  getAdaptiveProfile,
  patchFromEvent,
  updateAdaptiveProfile,
  type AdaptiveProfileEvent,
  type AdaptiveProfilePatch,
} from '@/lib/atom/adaptive-profile';
import { createAtomTelemetryLogger, startTimer } from '@/lib/atom/telemetry';

export async function GET(request: NextRequest) {
  const elapsed = startTimer();
  const supabase = await createClient();
  const telemetry = createAtomTelemetryLogger(supabase);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const scope = resolveAtomScopeKeyForRequest({ request, userId: user.id });
  const profile = await getAdaptiveProfile(supabase, scope.scopeKey);
  void telemetry.log({
    eventId: crypto.randomUUID(),
    eventName: 'profile.decision',
    ts: new Date().toISOString(),
    scopeKey: scope.scopeKey,
    actorUserId: user.id,
    route: '/api/atom/profile',
    mode: 'read',
    latencyMs: elapsed(),
    status: 'ok',
    metadata: { profileVersion: profile.version },
  });
  return NextResponse.json({ scopeKey: scope.scopeKey, profile });
}

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
    patch?: AdaptiveProfilePatch;
    event?: AdaptiveProfileEvent;
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

  const current = await getAdaptiveProfile(supabase, scope.scopeKey);
  const eventPatch = body.event ? patchFromEvent(body.event, current) : {};
  const mergedPatch: AdaptiveProfilePatch = { ...(body.patch ?? {}), ...eventPatch };
  const profile = await updateAdaptiveProfile(supabase, scope.scopeKey, mergedPatch);
  void telemetry.log({
    eventId: crypto.randomUUID(),
    eventName: 'profile.decision',
    ts: new Date().toISOString(),
    scopeKey: scope.scopeKey,
    actorUserId: user.id,
    route: '/api/atom/profile',
    mode: 'write',
    latencyMs: elapsed(),
    status: 'ok',
    metadata: {
      profileVersion: profile.version,
      patchKeys: Object.keys(mergedPatch),
    },
  });

  return NextResponse.json({ scopeKey: scope.scopeKey, profile, appliedPatch: mergedPatch });
}
