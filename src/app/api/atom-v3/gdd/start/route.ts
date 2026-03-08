import { NextRequest, NextResponse } from 'next/server';
import { createGuidedDeepDiveSessionState } from '@/lib/atom/guided-deep-dive/session-state';
import { putGuidedDeepDiveSession } from '@/lib/atom/guided-deep-dive/session-store';
import { createGddTelemetryEvent } from '@/lib/atom/guided-deep-dive/telemetry';
import { isAtomV3GddEnabled } from '@/lib/features/flags';

type StartPayload = {
  topic?: string;
  level?: string;
  goal?: string;
};

export async function POST(request: NextRequest) {
  if (!isAtomV3GddEnabled()) {
    return NextResponse.json({ error: 'Guided deep dive disabled' }, { status: 403 });
  }

  const body = (await request.json()) as StartPayload;

  if (!body.topic || !body.level || !body.goal) {
    return NextResponse.json({ error: 'Invalid quick start input', details: { topic: 'required', level: 'required', goal: 'required' } }, { status: 400 });
  }

  const session = createGuidedDeepDiveSessionState({
    topic: body.topic,
    level: body.level,
    goal: body.goal,
  });

  const startEvent = createGddTelemetryEvent({
    event: 'gdd_session_started',
    sessionId: session.sessionId,
    topic: session.topic,
    level: session.level,
    currentStep: session.currentStep,
    payload: { goal: session.goal, source: 'atom-v3-launch' },
  });

  putGuidedDeepDiveSession(session, [startEvent]);

  return NextResponse.json({
    session,
    telemetry: [startEvent],
  });
}
