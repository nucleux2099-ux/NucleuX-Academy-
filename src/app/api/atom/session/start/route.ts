import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { startOrResumeAtomSession } from '@/lib/atom/session-store';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await request.json()) as { threadId?: string; roomId?: string; selectedBookIds?: string[] };
  if (!body.threadId) return NextResponse.json({ error: 'threadId required' }, { status: 400 });

  const session = await startOrResumeAtomSession(supabase, user.id, {
    threadId: body.threadId,
    roomId: body.roomId,
    selectedBookIds: body.selectedBookIds,
  });

  return NextResponse.json({ sessionId: session.id, session });
}
