import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { createAtomTelemetryLogger } from '@/lib/atom/telemetry';
import { isValidFeedbackType } from '@/lib/atom/feedback';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const telemetry = createAtomTelemetryLogger(supabase);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const scope = resolveAtomScopeKeyForRequest({ request, userId: user.id, envelope: body.envelope as Record<string, unknown> | undefined });

  const feedbackType = String(body.feedbackType ?? '').trim();
  if (!isValidFeedbackType(feedbackType)) {
    return NextResponse.json({ error: 'feedbackType must be one of thumbs_up|thumbs_down|rating|correction|outcome' }, { status: 400 });
  }

  const sentiment = typeof body.sentiment === 'string' ? body.sentiment : null;
  const rating = typeof body.rating === 'number' ? body.rating : null;
  const classification = typeof body.classification === 'string' ? body.classification : null;
  const comment = typeof body.comment === 'string' ? body.comment : null;
  const correction = typeof body.correction === 'string' ? body.correction : null;
  const resolved = typeof body.resolved === 'boolean' ? body.resolved : null;

  const payload = {
    scope_key: scope.scopeKey,
    actor_user_id: user.id,
    session_id: typeof body.sessionId === 'string' ? body.sessionId : null,
    message_id: typeof body.messageId === 'string' ? body.messageId : null,
    artifact_id: typeof body.artifactId === 'string' ? body.artifactId : null,
    feedback_type: feedbackType,
    sentiment,
    rating,
    classification,
    comment,
    correction,
    resolved,
    metadata: (body.metadata && typeof body.metadata === 'object') ? body.metadata : {},
  };

  const { data, error } = await supabase
    .from('atom_feedback')
    .insert(payload)
    .select('id,scope_key,session_id,message_id,artifact_id,feedback_type,sentiment,rating,classification,resolved,created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const baseEvent = {
    eventId: crypto.randomUUID(),
    ts: new Date().toISOString(),
    scopeKey: scope.scopeKey,
    actorUserId: user.id,
    sessionId: payload.session_id ?? undefined,
    route: '/api/atom/feedback',
    mode: 'feedback',
    latencyMs: 0,
    status: 'ok' as const,
    metadata: {
      feedbackType,
      messageId: payload.message_id,
      artifactId: payload.artifact_id,
      classification,
      resolved,
    },
  };

  void telemetry.log({ ...baseEvent, eventName: 'feedback.submitted' });
  if (classification) void telemetry.log({ ...baseEvent, eventId: crypto.randomUUID(), eventName: 'feedback.classified' });
  if (resolved !== null) void telemetry.log({ ...baseEvent, eventId: crypto.randomUUID(), eventName: 'outcome.confirmed' });
  if (correction) void telemetry.log({ ...baseEvent, eventId: crypto.randomUUID(), eventName: 'correction.recorded' });

  return NextResponse.json({ kind: 'atom.feedback.v1', feedback: data }, { status: 201 });
}
