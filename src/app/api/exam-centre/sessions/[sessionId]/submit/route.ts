import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';

type SessionRow = {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  mcqs_attempted: number | null;
  mcqs_correct: number | null;
  notes_created: number | null;
  source: string | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;

    if (!sessionId || !isUuid(sessionId)) {
      return NextResponse.json({ error: 'Invalid session id' }, { status: 400 });
    }

    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { data: sessionData, error: sessionError } = await supabase
      .from('study_sessions')
      .select('id,user_id,started_at,ended_at,duration_minutes,mcqs_attempted,mcqs_correct,notes_created,source')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionData as SessionRow;

    if (session.ended_at) {
      return NextResponse.json({
        sessionId: session.id,
        status: 'already_submitted',
        endedAt: session.ended_at,
        durationMinutes: session.duration_minutes,
        mcqsAttempted: session.mcqs_attempted || 0,
        mcqsCorrect: session.mcqs_correct || 0,
      });
    }

    const body = await request.json().catch(() => ({}));
    const endedAt =
      typeof body?.ended_at === 'string' && !Number.isNaN(Date.parse(body.ended_at))
        ? new Date(body.ended_at).toISOString()
        : new Date().toISOString();

    const explicitDuration = toNumber(body?.duration_minutes);
    const computedDuration = Math.max(
      1,
      Math.round((Date.parse(endedAt) - Date.parse(session.started_at)) / 60000)
    );

    const durationMinutes =
      explicitDuration !== null && explicitDuration >= 0
        ? Math.round(explicitDuration)
        : computedDuration;

    const notesCreatedRaw = toNumber(body?.notes_created);
    const notesCreated =
      notesCreatedRaw !== null && notesCreatedRaw >= 0
        ? Math.round(notesCreatedRaw)
        : session.notes_created || 0;

    const updatePayload = {
      ended_at: endedAt,
      duration_minutes: durationMinutes,
      notes_created: notesCreated,
    };

    const { error: updateError } = await supabase
      .from('study_sessions')
      .update(updatePayload)
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Exam session submit update error:', updateError);
      return NextResponse.json({ error: 'Failed to submit session' }, { status: 500 });
    }

    const mcqsAttempted = session.mcqs_attempted || 0;
    const mcqsCorrect = session.mcqs_correct || 0;

    const today = new Date().toISOString().slice(0, 10);

    const { error: studyTimeError } = await supabase.rpc('increment_study_time', {
      p_user_id: userId,
      p_date: today,
      p_minutes: durationMinutes,
    });
    if (studyTimeError) {
      console.warn('increment_study_time failed for exam session submit:', studyTimeError.message);
    }

    if (mcqsAttempted > 0 || mcqsCorrect > 0) {
      const { error: mcqStatsError } = await supabase.rpc('increment_mcq_stats', {
        p_user_id: userId,
        p_date: today,
        p_attempted: mcqsAttempted,
        p_correct: mcqsCorrect,
      });
      if (mcqStatsError) {
        console.warn('increment_mcq_stats failed for exam session submit:', mcqStatsError.message);
      }
    }

    await fetch(new URL('/api/streaks', request.url), {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') || '' },
    }).catch(() => {
      // Best-effort streak bump.
    });

    return NextResponse.json({
      sessionId: session.id,
      status: 'submitted',
      mode:
        typeof session.source === 'string' && session.source.startsWith('exam-centre:')
          ? session.source.replace('exam-centre:', '')
          : 'unknown',
      startedAt: session.started_at,
      endedAt,
      durationMinutes,
      mcqsAttempted,
      mcqsCorrect,
      accuracyPercent: mcqsAttempted > 0 ? Math.round((mcqsCorrect / mcqsAttempted) * 100) : 0,
    });
  } catch (error) {
    console.error('Exam session submit POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
