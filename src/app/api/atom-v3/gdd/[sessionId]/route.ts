import { NextResponse } from 'next/server';
import { getGuidedDeepDiveSession } from '@/lib/atom/guided-deep-dive/session-store';
import { isAtomV3GddEnabled } from '@/lib/features/flags';

export async function GET(_: Request, context: { params: Promise<{ sessionId: string }> }) {
  if (!isAtomV3GddEnabled()) {
    return NextResponse.json({ error: 'Guided deep dive disabled' }, { status: 403 });
  }

  const { sessionId } = await context.params;
  const found = getGuidedDeepDiveSession(sessionId);

  if (!found) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({
    session: found.session,
    telemetry: found.events,
  });
}
