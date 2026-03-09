import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { getAtomSession } from '@/lib/atom/session-store';
import { createAtomArtifactService } from '@/lib/atom/artifacts/service';
import { createAtomTelemetryLogger, startTimer } from '@/lib/atom/telemetry';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string; artifactId: string }> },
) {
  const elapsed = startTimer();
  const supabase = await createClient();
  const telemetry = createAtomTelemetryLogger(supabase);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, artifactId } = await context.params;

  const url = new URL(request.url);
  let scopeKey: string;
  try {
    scopeKey = resolveAtomScopeKeyForRequest({
      request,
      userId: user.id,
      envelope: {
        accountId: url.searchParams.get('accountId') ?? undefined,
        channel: url.searchParams.get('channel') ?? undefined,
        peer: url.searchParams.get('peer') ?? undefined,
      },
    }).scopeKey;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const session = await getAtomSession(supabase, user.id, sessionId, scopeKey);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const artifactService = createAtomArtifactService(supabase);
  const download = await artifactService.resolveDownload({
    scopeKey,
    sessionId,
    artifactId,
    actorUserId: user.id,
  });

  if (!download) return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });

  void telemetry.log({
    eventId: crypto.randomUUID(),
    eventName: 'artifact.usage',
    ts: new Date().toISOString(),
    scopeKey,
    actorUserId: user.id,
    sessionId,
    route: '/api/atom/session/[sessionId]/artifacts/[artifactId]/download',
    mode: 'download',
    latencyMs: elapsed(),
    status: 'ok',
    metadata: { artifactId, mime: download.mime },
  });

  return new NextResponse(download.content, {
    status: 200,
    headers: {
      'Content-Type': download.mime,
      'Content-Disposition': `attachment; filename="${download.filename}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  });
}
