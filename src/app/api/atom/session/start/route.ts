import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { startOrResumeAtomSession } from '@/lib/atom/session-store';
import { deriveAtomUserScopeKey } from '@/lib/atom/user-scope';
import { ensureAtomUserWorkspaceBootstrap } from '@/lib/atom/user-workspace';

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
  };

  const scopeKey = deriveAtomUserScopeKey({
    userId: user.id,
    accountId: body.accountId ?? request.headers.get('x-atom-account-id'),
    channel: body.channel ?? request.headers.get('x-atom-channel') ?? 'web',
    peer: body.peer ?? request.headers.get('x-atom-peer') ?? user.id,
  });

  await ensureAtomUserWorkspaceBootstrap({
    scopeKey,
    userId: user.id,
    roomId: body.roomId ?? 'atom',
  });

  const session = await startOrResumeAtomSession(supabase, user.id, {
    scopeKey,
    threadId: body.threadId,
    roomId: body.roomId,
    selectedBookIds: body.selectedBookIds,
  });

  return NextResponse.json({ sessionId: session.id, scopeKey, session });
}
