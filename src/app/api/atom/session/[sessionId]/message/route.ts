import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  appendSessionMessage,
  getAtomSession,
  getRecentSessionMessages,
  updateSessionCursor,
} from '@/lib/atom/session-store';

function extractArtifactsFromAssistant(text: string) {
  const artifacts: Array<{ title: string; kind: string; content: string }> = [];
  const fenceRegex = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(text)) !== null) {
    const language = (match[1] ?? 'txt').toLowerCase();
    const content = (match[2] ?? '').trim();
    if (!content) continue;
    artifacts.push({
      title: `${language.toUpperCase()} snippet`,
      kind: language,
      content,
    });
  }

  if (artifacts.length === 0 && text.trim().startsWith('{')) {
    artifacts.push({
      title: 'JSON output',
      kind: 'json',
      content: text.trim(),
    });
  }

  return artifacts;
}

async function runChat(request: NextRequest, payload: Record<string, unknown>) {
  const response = await fetch(`${request.nextUrl.origin}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: request.headers.get('cookie') ?? '' },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const raw = await response.text();
    throw new Error(raw || 'chat failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let output = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';

    for (const chunk of chunks) {
      const line = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      const payloadText = line.slice(6).trim();
      if (payloadText === '[DONE]') continue;
      try {
        const parsed = JSON.parse(payloadText) as { text?: string; error?: string };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.text) output += parsed.text;
      } catch {
        continue;
      }
    }
  }

  return output;
}

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId } = await context.params;
  const session = await getAtomSession(supabase, user.id, sessionId);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const body = (await request.json()) as { message?: string; context?: string };
  const userText = body.message?.trim();
  if (!userText) return NextResponse.json({ error: 'message required' }, { status: 400 });

  const normalized = userText.toLowerCase();
  const isContinueLike = /^(continue|go on|carry on|more|next|cont\.?|continue please)\b/.test(normalized);
  const previousTopic =
    typeof session.last_user_query === 'string' && session.last_user_query.trim().length > 0
      ? session.last_user_query.trim()
      : typeof session.continuation_cursor?.lastTopic === 'string'
        ? String(session.continuation_cursor.lastTopic)
        : null;

  await appendSessionMessage(supabase, sessionId, 'user', userText);

  const history = await getRecentSessionMessages(supabase, sessionId, 30);
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content_md }));

  const assistant = await runChat(request, {
    context: body.context ?? 'surgery',
    selectedBookIds: session.selected_book_ids,
    strictSourceGrounding: true,
    messages,
  });

  const artifacts = extractArtifactsFromAssistant(assistant);
  await appendSessionMessage(supabase, sessionId, 'assistant', assistant, { artifacts });
  const lastTopic = isContinueLike && previousTopic ? previousTopic : userText;

  await updateSessionCursor(supabase, sessionId, {
    lastUserQuery: lastTopic,
    continuationCursor: {
      lastTurnAt: new Date().toISOString(),
      lastMode: 'chat',
      lastTopic,
    },
  });

  return NextResponse.json({ sessionId, assistant, artifacts });
}
