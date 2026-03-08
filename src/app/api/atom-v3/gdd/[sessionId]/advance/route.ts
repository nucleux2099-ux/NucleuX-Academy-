import { NextRequest, NextResponse } from 'next/server';
import { advanceGuidedDeepDive } from '@/lib/atom/guided-deep-dive/runtime';
import {
  appendGuidedDeepDiveEvents,
  getGuidedDeepDiveSession,
  updateGuidedDeepDiveSession,
} from '@/lib/atom/guided-deep-dive/session-store';
import type { StepAdvanceInput } from '@/lib/atom/guided-deep-dive/runtime-types';
import { isAtomV3GddEnabled } from '@/lib/features/flags';

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  if (!isAtomV3GddEnabled()) {
    return NextResponse.json({ error: 'Guided deep dive disabled' }, { status: 403 });
  }

  const { sessionId } = await context.params;
  const found = getGuidedDeepDiveSession(sessionId);

  if (!found) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const body = (await request.json()) as StepAdvanceInput;
  const { state, events } = advanceGuidedDeepDive(found.session, body);

  updateGuidedDeepDiveSession(state);
  appendGuidedDeepDiveEvents(sessionId, events);

  return NextResponse.json({
    session: state,
    telemetry: events,
  });
}
