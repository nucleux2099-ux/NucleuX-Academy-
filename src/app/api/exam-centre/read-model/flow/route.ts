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

function gradeFromScore(scorePercent: number) {
  if (scorePercent >= 85) return 'excellent';
  if (scorePercent >= 70) return 'good';
  if (scorePercent >= 55) return 'developing';
  return 'at-risk';
}

function parseTransition(questionRef: string) {
  const marker = ':branch:';
  const markerIndex = questionRef.indexOf(marker);
  if (markerIndex === -1) return null;
  const value = questionRef.slice(markerIndex + marker.length).trim();
  if (!value || !value.includes('->')) return null;
  const [fromNodeId, toNodeId] = value.split('->').map((segment) => segment.trim());
  if (!fromNodeId || !toNodeId) return null;
  return { transition: `${fromNodeId}->${toNodeId}`, fromNodeId, toNodeId };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const requestedSessionId = searchParams.get('session_id');
    const expectedBranchesRaw = searchParams.get('expected_branches');
    const expectedBranches = (() => {
      if (!expectedBranchesRaw) return null;
      const parsed = Number.parseInt(expectedBranchesRaw, 10);
      if (Number.isNaN(parsed) || parsed <= 0) return null;
      return parsed;
    })();

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
          .eq('source', 'exam-centre:flow')
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

    const { data: sessionData, error: sessionError } = await sessionQuery;
    if (sessionError || !sessionData) {
      return NextResponse.json({ error: 'Flow session not found' }, { status: 404 });
    }

    const session = sessionData as SessionRow;
    if (session.source !== 'exam-centre:flow') {
      return NextResponse.json({ error: 'Session is not a flow session' }, { status: 400 });
    }

    const eventsQuery = await supabase
      .from('analytics_events')
      .select('id,created_at,event_data')
      .eq('user_id', userId)
      .eq('event_name', 'exam_answer')
      .filter('event_data->>session_id', 'eq', session.id)
      .filter('event_data->>mode', 'eq', 'flow')
      .order('created_at', { ascending: true })
      .limit(5000);

    let events: AnalyticsEventRow[] = [];
    if (eventsQuery.error) {
      if (!isMissingAnalyticsEventsTable(eventsQuery.error)) {
        console.error('Flow read-model analytics query error:', eventsQuery.error);
        return NextResponse.json({ error: 'Failed to fetch flow analytics' }, { status: 500 });
      }
    } else {
      events = (eventsQuery.data || []) as AnalyticsEventRow[];
    }

    const decisions = events
      .map((event) => {
        const data = asRecord(event.event_data) || {};
        const questionRef = asString(data.question_ref);
        const isCorrect = asBoolean(data.is_correct);
        const selectedLabel = asString(data.selected_option_key);
        if (!questionRef || isCorrect === null) return null;
        const transition = parseTransition(questionRef);
        if (!transition) return null;
        return {
          eventId: event.id,
          createdAt: event.created_at,
          questionRef,
          ...transition,
          selectedLabel,
          isCorrect,
          timeTakenSeconds: toNumber(data.time_taken_seconds),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    const decisionsMade = decisions.length;
    const alignedDecisions = decisions.filter((entry) => entry.isCorrect).length;
    const driftDecisions = decisionsMade - alignedDecisions;
    const alignmentPercent = percent(alignedDecisions, decisionsMade);
    const uniqueTransitions = new Set(decisions.map((entry) => entry.transition));
    const uniqueNodes = new Set<string>();
    for (const decision of decisions) {
      uniqueNodes.add(decision.fromNodeId);
      uniqueNodes.add(decision.toNodeId);
    }

    const branchCoveragePercent =
      expectedBranches !== null ? percent(uniqueTransitions.size, expectedBranches) : null;
    const avgDecisionSeconds = avg(
      decisions
        .map((entry) => entry.timeTakenSeconds)
        .filter((value): value is number => typeof value === 'number' && value >= 0)
    );
    const scorePercent = round(((alignmentPercent || 0) * 0.7) + ((branchCoveragePercent || 0) * 0.3), 0);

    return NextResponse.json({
      session: {
        id: session.id,
        mode: 'flow',
        startedAt: session.started_at,
        endedAt: session.ended_at,
        durationMinutes: parseDurationMinutes(session),
        submitted: Boolean(session.ended_at),
      },
      snapshot: {
        decisionsMade,
        alignedDecisions,
        driftDecisions,
        alignmentPercent,
        uniqueTransitions: uniqueTransitions.size,
        uniqueNodesVisited: uniqueNodes.size,
        expectedBranches,
        branchCoveragePercent,
        avgDecisionSeconds,
        scorePercent,
        grade: gradeFromScore(scorePercent),
      },
      timeline: decisions.slice(-120),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Flow read-model GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
