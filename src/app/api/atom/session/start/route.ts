import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { startOrResumeAtomSession } from '@/lib/atom/session-store';
import { ensureAtomUserWorkspaceBootstrap } from '@/lib/atom/user-workspace';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';
import { ensureAtomMemoryStructure } from '@/lib/atom/memory-store';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as {
    threadId?: string;
    roomId?: string;
    selectedBookIds?: string[];
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

  await ensureAtomUserWorkspaceBootstrap({
    scopeKey,
    userId: user.id,
    roomId: body.roomId ?? 'atom',
  });
  await ensureAtomMemoryStructure(scopeKey);

  const session = await startOrResumeAtomSession(supabase, user.id, {
    scopeKey,
    threadId: body.threadId,
    roomId: body.roomId,
    selectedBookIds: body.selectedBookIds,
  });

  return NextResponse.json({ sessionId: session.id, scopeKey, session });
}
