import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  appendSessionMessage,
  getAtomSession,
  getRecentSessionMessages,
  updateSessionCursor,
} from '@/lib/atom/session-store';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { appendAtomMemory, ensureAtomMemoryStructure } from '@/lib/atom/memory-store';
import { formatMemoryContextForPrompt, retrieveScopedMemoryContext } from '@/lib/atom/memory-retrieval';
import { createAtomArtifactService } from '@/lib/atom/artifacts/service';
import type { AtomArtifactV1 } from '@/lib/atom/artifacts/types';

function extractArtifactsFromAssistant(text: string): AtomArtifactV1[] {
  const artifacts: AtomArtifactV1[] = [];
  const fenceRegex = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(text)) !== null) {
    const language = (match[1] ?? 'txt').toLowerCase();
    const content = (match[2] ?? '').trim();
    if (!content) continue;
    artifacts.push({
      id: crypto.randomUUID(),
      title: `${language.toUpperCase()} snippet`,
      kind: language === 'json' ? 'json' : language === 'md' || language === 'markdown' ? 'markdown' : 'code',
      mime: language === 'json' ? 'application/json' : language === 'md' || language === 'markdown' ? 'text/markdown' : 'text/plain',
      content,
      metadata: { parserKind: language },
      provenance: { createdBy: 'assistant' },
      createdAt: new Date().toISOString(),
    });
  }

  if (artifacts.length === 0 && text.trim().startsWith('{')) {
    artifacts.push({
      id: crypto.randomUUID(),
      title: 'JSON output',
      kind: 'json',
      mime: 'application/json',
      content: text.trim(),
      metadata: { parserKind: 'json' },
      provenance: { createdBy: 'assistant' },
      createdAt: new Date().toISOString(),
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
  const body = (await request.json()) as {
    message?: string;
    context?: string;
    accountId?: string;
    channel?: string;
    peer?: string;
    scope?: { accountId?: string; channel?: string; peer?: string };
  };

  let scopeKey: string;
  try {
    scopeKey = resolveAtomScopeKeyForRequest({
      request,
      userId: user.id,
      envelope: body.scope,
      fallback: {
        accountId: body.accountId,
        channel: body.channel,
        peer: body.peer,
      },
    }).scopeKey;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const session = await getAtomSession(supabase, user.id, sessionId, scopeKey);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

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

  const artifactService = createAtomArtifactService(supabase);

  await ensureAtomMemoryStructure(scopeKey);
  await appendSessionMessage(supabase, user.id, scopeKey, sessionId, 'user', userText);
  await appendAtomMemory({ scopeKey, section: 'User message', content: userText });

  const history = await getRecentSessionMessages(supabase, user.id, scopeKey, sessionId, 30);
  const baseMessages = history
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content_md }));

  const retrievalSnippets = await retrieveScopedMemoryContext({
    scopeKey,
    query: previousTopic ?? userText,
    limit: 6,
  });
  const memoryPrompt = formatMemoryContextForPrompt(retrievalSnippets, 5000);

  const messages = memoryPrompt
    ? ([{ role: 'user', content: `Use this scoped memory context (same user scope only):\n${memoryPrompt}` }, ...baseMessages])
    : baseMessages;

  const assistant = await runChat(request, {
    context: body.context ?? 'surgery',
    selectedBookIds: session.selected_book_ids,
    strictSourceGrounding: true,
    messages,
  });

  const artifacts = extractArtifactsFromAssistant(assistant).map((artifact) => ({
    ...artifact,
    provenance: {
      ...artifact.provenance,
      sessionId,
      createdBy: 'assistant' as const,
    },
  }));

  const assistantMessage = await appendSessionMessage(supabase, user.id, scopeKey, sessionId, 'assistant', assistant, {
    artifacts: artifacts.map((artifact) => ({
      id: artifact.id,
      title: artifact.title,
      kind: artifact.kind,
      mime: artifact.mime,
      content: artifact.content,
      createdAt: artifact.createdAt,
    })),
    memoryContext: retrievalSnippets.map((snippet) => ({
      sourceFile: snippet.sourceFile,
      startLine: snippet.startLine,
      endLine: snippet.endLine,
      score: snippet.score,
    })),
  });

  for (const artifact of artifacts) {
    await artifactService.persistArtifact({
      scopeKey,
      sessionId,
      messageId: assistantMessage.id,
      artifact,
    });
  }
  await appendAtomMemory({ scopeKey, section: 'Assistant response', content: assistant });
  const lastTopic = isContinueLike && previousTopic ? previousTopic : userText;

  await updateSessionCursor(supabase, user.id, scopeKey, sessionId, {
    lastUserQuery: lastTopic,
    continuationCursor: {
      lastTurnAt: new Date().toISOString(),
      lastMode: 'chat',
      lastTopic,
    },
  });

  return NextResponse.json({ sessionId, assistant, artifacts, scopeKey });
}
