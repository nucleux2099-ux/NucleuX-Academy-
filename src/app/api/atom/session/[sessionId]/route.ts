import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAtomSession, getRecentSessionMessages } from '@/lib/atom/session-store';

export async function GET(_: Request, context: { params: Promise<{ sessionId: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await context.params;
  const session = await getAtomSession(supabase, user.id, sessionId);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const messages = await getRecentSessionMessages(supabase, sessionId, 60);

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

  return NextResponse.json({ session, messages, artifacts });
}
