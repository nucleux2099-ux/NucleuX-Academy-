import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAtomSession, getRecentSessionMessages } from '@/lib/atom/session-store';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';

export async function GET(request: Request, context: { params: Promise<{ sessionId: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await context.params;
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
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const messages = await getRecentSessionMessages(supabase, user.id, scopeKey, sessionId, 60);

  const artifacts = messages.flatMap((message, index) => {
    if (message.role !== 'assistant') return [];
    const metaArtifacts =
      message.meta && typeof message.meta === 'object' && Array.isArray((message.meta as { artifacts?: unknown[] }).artifacts)
        ? ((message.meta as { artifacts: unknown[] }).artifacts as Array<{ title?: string; kind?: string; content?: string }>)
        : [];

    return metaArtifacts
      .filter((artifact) => typeof artifact?.content === 'string' && artifact.content.trim().length > 0)
      .map((artifact) => ({
        id: `${sessionId}-${index}-${artifact.kind ?? 'artifact'}`,
        title: artifact.title ?? 'Artifact',
        kind: artifact.kind ?? 'artifact',
        content: artifact.content ?? '',
      }));
  });

  return NextResponse.json({ session, messages, artifacts, scopeKey });
}
