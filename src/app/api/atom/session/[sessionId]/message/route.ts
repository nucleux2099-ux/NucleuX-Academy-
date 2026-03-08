import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  appendSessionMessage,
  getAtomSession,
  getRecentSessionMessages,
  updateSessionCursor,
} from '@/lib/atom/session-store';

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

  await appendSessionMessage(supabase, sessionId, 'user', userText);

  const history = await getRecentSessionMessages(supabase, sessionId, 12);
  const messages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content_md }));

  const assistant = await runChat(request, {
    context: body.context ?? 'surgery',
    selectedBookIds: session.selected_book_ids,
    strictSourceGrounding: true,
    messages,
  });

  await appendSessionMessage(supabase, sessionId, 'assistant', assistant);
  await updateSessionCursor(supabase, sessionId, {
    lastUserQuery: userText,
    continuationCursor: {
      lastTurnAt: new Date().toISOString(),
      lastMode: 'chat',
      lastTopic: userText,
    },
  });

  return NextResponse.json({ sessionId, assistant });
}
