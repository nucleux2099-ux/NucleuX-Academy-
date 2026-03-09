import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listUserAtomSessions } from '@/lib/atom/session-store';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await listUserAtomSessions(supabase, user.id, 24);

  return NextResponse.json({
    threads: sessions.map((session) => ({
      id: session.thread_id,
      sessionId: session.id,
      roomId: session.room_id,
      status: session.status,
      updatedAt: session.updated_at ?? session.created_at ?? new Date().toISOString(),
      title: (session.last_user_query?.trim() || `${session.room_id.toUpperCase()} thread`).slice(0, 80),
    })),
  });
}
