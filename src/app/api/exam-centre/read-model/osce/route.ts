import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';

type SessionRow = {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  source: string | null;
};

type AnalyticsEventRow = {
  id: string;
  created_at: string;
  event_data: Record<string, unknown> | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function asBoolean(value: unknown): boolean | null {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parsePositiveInt(raw: string | null) {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percent(part: number, whole: number): number | null {
  if (whole <= 0) return null;
  return Math.round((part / whole) * 100);
}

function avg(values: number[]): number | null {
  if (!values.length) return null;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function parseDurationMinutes(session: SessionRow) {
  if (typeof session.duration_minutes === 'number' && session.duration_minutes >= 0) {
    return session.duration_minutes;
  }
  if (!session.ended_at) return null;
  const startedAt = Date.parse(session.started_at);
  const endedAt = Date.parse(session.ended_at);
  if (Number.isNaN(startedAt) || Number.isNaN(endedAt) || endedAt < startedAt) return null;
  return round((endedAt - startedAt) / (1000 * 60));
}

function isMissingAnalyticsEventsTable(error: unknown) {
  const details = error as { code?: string; message?: string } | null;
  const code = details?.code || '';
  const message = (details?.message || '').toLowerCase();
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    (message.includes('analytics_events') &&
      (message.includes('does not exist') || message.includes('not found')))
  );
}

function parseChecklistItemId(questionRef: string) {
  const marker = ':checklist:';
  const markerIndex = questionRef.indexOf(marker);
  if (markerIndex === -1) return null;
  const itemId = questionRef.slice(markerIndex + marker.length).trim();
  return itemId || null;
}

function gradeFromMarks(params: {
  marksAwarded: number;
  passingMarks: number | null;
  distinctionMarks: number | null;
  totalMarks: number | null;
}) {
  const { marksAwarded, passingMarks, distinctionMarks, totalMarks } = params;
  if (totalMarks === null || totalMarks <= 0) return 'N/A';
  if (distinctionMarks !== null && marksAwarded >= distinctionMarks) return 'Distinction';
  if (passingMarks !== null && marksAwarded >= passingMarks) return 'Pass';
  if (passingMarks !== null && marksAwarded >= Math.round(passingMarks * 0.85)) return 'Borderline';
  return 'Fail';
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const requestedSessionId = searchParams.get('session_id');
    const totalMarks = parsePositiveInt(searchParams.get('total_marks'));
    const passingMarks = parsePositiveInt(searchParams.get('passing_marks'));
    const distinctionMarks = parsePositiveInt(searchParams.get('distinction_marks'));
    const checklistTotal = parsePositiveInt(searchParams.get('checklist_total'));

    if (requestedSessionId && !isUuid(requestedSessionId)) {
      return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 });
    }

    const sessionQuery = requestedSessionId
      ? supabase
          .from('study_sessions')
          .select('id,started_at,ended_at,duration_minutes,source')
          .eq('id', requestedSessionId)
          .eq('user_id', userId)
          .single()
      : supabase
          .from('study_sessions')
          .select('id,started_at,ended_at,duration_minutes,source')
          .eq('user_id', userId)
          .eq('source', 'exam-centre:practical')
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

    const { data: sessionData, error: sessionError } = await sessionQuery;
    if (sessionError || !sessionData) {
      return NextResponse.json({ error: 'OSCE session not found' }, { status: 404 });
    }

    const session = sessionData as SessionRow;
    if (session.source !== 'exam-centre:practical') {
      return NextResponse.json({ error: 'Session is not a practical/OSCE session' }, { status: 400 });
    }

    const eventsQuery = await supabase
      .from('analytics_events')
      .select('id,created_at,event_data')
      .eq('user_id', userId)
      .eq('event_name', 'exam_answer')
      .filter('event_data->>session_id', 'eq', session.id)
      .filter('event_data->>mode', 'eq', 'practical')
      .order('created_at', { ascending: true })
      .limit(8000);

    let events: AnalyticsEventRow[] = [];
    if (eventsQuery.error) {
      if (!isMissingAnalyticsEventsTable(eventsQuery.error)) {
        console.error('OSCE read-model analytics query error:', eventsQuery.error);
        return NextResponse.json({ error: 'Failed to fetch OSCE analytics' }, { status: 500 });
      }
    } else {
      events = (eventsQuery.data || []) as AnalyticsEventRow[];
    }

    const checklistMap = new Map<
      string,
      {
        itemId: string;
        marks: number;
        isCritical: boolean;
        checkedAt: string;
      }
    >();

    const timeline: Array<{
      eventId: string;
      createdAt: string;
      itemId: string;
      isCritical: boolean;
      marks: number;
      isCorrect: boolean;
      timeTakenSeconds: number | null;
    }> = [];

    for (const event of events) {
      const data = asRecord(event.event_data) || {};
      const questionRef = asString(data.question_ref);
      if (!questionRef) continue;

      const itemId = parseChecklistItemId(questionRef);
      if (!itemId) continue;

      const metadata = asRecord(data.metadata) || {};
      const marks = toNumber(metadata.marks) ?? 1;
      const isCritical = asBoolean(metadata.is_critical) === true;
      const isCorrect = asBoolean(data.is_correct) ?? true;
      const timeTakenSeconds = toNumber(data.time_taken_seconds);

      timeline.push({
        eventId: event.id,
        createdAt: event.created_at,
        itemId,
        isCritical,
        marks,
        isCorrect,
        timeTakenSeconds: timeTakenSeconds !== null && timeTakenSeconds >= 0 ? timeTakenSeconds : null,
      });

      const existing = checklistMap.get(itemId);
      if (!existing || Date.parse(event.created_at) > Date.parse(existing.checkedAt)) {
        checklistMap.set(itemId, {
          itemId,
          marks,
          isCritical,
          checkedAt: event.created_at,
        });
      }
    }

    const checklistItems = Array.from(checklistMap.values());
    const checkedItems = checklistItems.length;
    const criticalItemsChecked = checklistItems.filter((item) => item.isCritical).length;
    const marksAwarded = round(
      checklistItems.reduce((sum, item) => sum + Math.max(0, item.marks), 0),
      1
    );
    const completionPercent = checklistTotal !== null ? percent(checkedItems, checklistTotal) : null;
    const scorePercent = totalMarks !== null ? percent(marksAwarded, totalMarks) : null;
    const accuracyPercent = percent(
      timeline.filter((entry) => entry.isCorrect).length,
      timeline.length
    );
    const avgActionSeconds = avg(
      timeline
        .map((entry) => entry.timeTakenSeconds)
        .filter((value): value is number => typeof value === 'number')
    );

    return NextResponse.json({
      session: {
        id: session.id,
        mode: 'practical',
        startedAt: session.started_at,
        endedAt: session.ended_at,
        durationMinutes: parseDurationMinutes(session),
        submitted: Boolean(session.ended_at),
      },
      snapshot: {
        checkedItems,
        criticalItemsChecked,
        checklistTotal,
        completionPercent,
        marksAwarded,
        totalMarks,
        passingMarks,
        distinctionMarks,
        scorePercent,
        grade: gradeFromMarks({ marksAwarded, passingMarks, distinctionMarks, totalMarks }),
        accuracyPercent,
        avgActionSeconds,
      },
      checklist: {
        items: checklistItems,
      },
      timeline: timeline.slice(-300),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('OSCE read-model GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
