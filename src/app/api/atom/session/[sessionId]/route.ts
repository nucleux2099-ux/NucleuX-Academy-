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

  const messages = await getRecentSessionMessages(supabase, sessionId, 30);
  return NextResponse.json({ session, messages });
}
