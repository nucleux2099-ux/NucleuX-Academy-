import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { createAtomTelemetryLogger } from '@/lib/atom/telemetry';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const telemetry = createAtomTelemetryLogger(supabase);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const scope = resolveAtomScopeKeyForRequest({ request, userId: user.id, envelope: body.envelope as Record<string, unknown> | undefined });

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (typeof body.resolved === 'boolean') updates.resolved = body.resolved;
  if (typeof body.classification === 'string') updates.classification = body.classification;
  if (typeof body.correction === 'string') updates.correction = body.correction;

  const { data, error } = await supabase
    .from('atom_feedback')
    .update(updates)
    .eq('id', id)
    .eq('scope_key', scope.scopeKey)
    .eq('actor_user_id', user.id)
    .select('id,scope_key,session_id,message_id,artifact_id,feedback_type,sentiment,rating,classification,resolved,updated_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (typeof body.resolved === 'boolean') {
    void telemetry.log({
      eventId: crypto.randomUUID(),
      eventName: 'outcome.confirmed',
      ts: new Date().toISOString(),
      scopeKey: scope.scopeKey,
      actorUserId: user.id,
      sessionId: typeof data.session_id === 'string' ? data.session_id : undefined,
      route: '/api/atom/feedback/:id',
      mode: 'feedback',
      latencyMs: 0,
      status: 'ok',
      metadata: { feedbackId: id, resolved: body.resolved, messageId: data.message_id, artifactId: data.artifact_id },
    });
  }

  return NextResponse.json({ kind: 'atom.feedback.v1', feedback: data });
}
