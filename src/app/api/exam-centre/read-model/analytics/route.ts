import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';
import { parseLimit } from '@/lib/learning/contracts';

type SessionMode = 'pyq' | 'mcq' | 'simulator' | 'practical' | 'flow' | 'guided' | 'unknown';

type SessionRow = {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  mcqs_attempted: number | null;
  mcqs_correct: number | null;
  source: string | null;
};

type McqAttemptRow = {
  id: string;
  session_id: string | null;
  is_correct: boolean | null;
  confidence: number | null;
  time_taken_seconds: number | null;
  created_at: string;
  mcq_id: string | null;
  mcqs:
    | {
        specialty: string | null;
        topic: string | null;
        subtopic: string | null;
        source_exam: string | null;
      }
    | Array<{
        specialty: string | null;
        topic: string | null;
        subtopic: string | null;
        source_exam: string | null;
      }>
    | null;
};

type AnalyticsEventRow = {
  id: string;
  created_at: string;
  event_data: Record<string, unknown> | null;
};

type UnifiedAttempt = {
  id: string;
  sessionId: string;
  mode: SessionMode;
  createdAt: string;
  isCorrect: boolean;
  confidence: number | null;
  timeTakenSeconds: number | null;
  topicKey: string;
  topicLabel: string;
  subject: string;
};

const MODE_ORDER: SessionMode[] = ['pyq', 'mcq', 'simulator', 'practical', 'flow', 'guided', 'unknown'];

const SUBJECT_ALIASES: Record<string, string> = {
  surgery: 'surgery',
  medicine: 'medicine',
  med: 'medicine',
  obg: 'obg',
  obgyn: 'obg',
  obstetrics: 'obg',
  gynecology: 'obg',
  gynaecology: 'obg',
  pediatrics: 'pediatrics',
  paediatrics: 'pediatrics',
  anatomy: 'anatomy',
  pathology: 'pathology',
  pharmacology: 'pharmacology',
  radiology: 'radiology',
  ophthalmology: 'ophthalmology',
  ophthal: 'ophthalmology',
  ent: 'ent',
};

function parseDays(raw: string | null, fallback = 30, max = 180) {
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value < 1) return fallback;
  return Math.min(value, max);
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function titleize(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
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

function isSessionMode(value: string | null): value is SessionMode {
  if (!value) return false;
  return MODE_ORDER.includes(value as SessionMode);
}

function modeFromSource(source: string | null): SessionMode {
  if (!source || !source.startsWith('exam-centre:')) return 'unknown';
  const rawMode = source.replace('exam-centre:', '').trim().toLowerCase();
  return isSessionMode(rawMode) ? rawMode : 'unknown';
}

function normalizeSubject(raw: string | null) {
  if (!raw) return 'general';
  const normalized = slugify(raw);
  return SUBJECT_ALIASES[normalized] || normalized || 'general';
}

function expectedAccuracyForConfidence(confidence: number) {
  const map: Record<number, number> = {
    1: 20,
    2: 40,
    3: 60,
    4: 80,
    5: 95,
  };
  return map[confidence] || Math.min(95, Math.max(20, confidence * 20));
}

function calibrationState(gapPercent: number | null) {
  if (gapPercent === null) return 'unknown';
  if (Math.abs(gapPercent) <= 8) return 'calibrated';
  if (gapPercent > 8) return 'underconfident';
  return 'overconfident';
}

function qualityBand(score: number) {
  if (score >= 78) return 'excellent';
  if (score >= 60) return 'solid';
  if (score >= 40) return 'developing';
  return 'low';
}

function computeDurationMinutes(session: SessionRow) {
  if (typeof session.duration_minutes === 'number' && session.duration_minutes >= 0) {
    return session.duration_minutes;
  }
  if (!session.ended_at) return null;
  const startedTs = Date.parse(session.started_at);
  const endedTs = Date.parse(session.ended_at);
  if (Number.isNaN(startedTs) || Number.isNaN(endedTs) || endedTs < startedTs) return null;
  return round((endedTs - startedTs) / (1000 * 60));
}

function computeSessionQualityScore(params: {
  completed: boolean;
  attempted: number;
  accuracyPercent: number | null;
  durationMinutes: number | null;
}) {
  const { completed, attempted, accuracyPercent, durationMinutes } = params;
  let score = 0;

  score += completed ? 20 : 5;

  if (attempted >= 20) score += 25;
  else if (attempted >= 10) score += 20;
  else if (attempted >= 5) score += 12;
  else if (attempted > 0) score += 6;

  if (accuracyPercent !== null) {
    if (accuracyPercent >= 80) score += 30;
    else if (accuracyPercent >= 65) score += 24;
    else if (accuracyPercent >= 50) score += 18;
    else if (accuracyPercent >= 35) score += 10;
    else score += 4;
  }

  if (durationMinutes !== null) {
    if (durationMinutes >= 25) score += 25;
    else if (durationMinutes >= 12) score += 18;
    else if (durationMinutes >= 5) score += 10;
    else score += 4;
  }

  return Math.min(100, score);
}

function firstMcqMeta(
  value: McqAttemptRow['mcqs']
): { specialty: string | null; topic: string | null; subtopic: string | null; source_exam: string | null } | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

function extractSubjectFromQuestionRef(questionRef: string) {
  const tokens = questionRef
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);

  for (const token of tokens) {
    const mapped = SUBJECT_ALIASES[token];
    if (mapped) return mapped;
  }

  return 'template';
}

function humanizeQuestionRef(questionRef: string) {
  return titleize(
    questionRef
      .replace(/[_/.:]+/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function zeroCalibrationBand(confidence: number) {
  return {
    confidence,
    attempts: 0,
    expectedAccuracyPercent: expectedAccuracyForConfidence(confidence),
    accuracyPercent: null as number | null,
    gapPercent: null as number | null,
    state: 'unknown',
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const days = parseDays(searchParams.get('days'), 30, 180);
    const sessionLimit = parseLimit(searchParams.get('session_limit'), 180, 400);
    const attemptLimit = parseLimit(searchParams.get('attempt_limit'), 5000, 15000);
    const weakLimit = parseLimit(searchParams.get('weak_limit'), 8, 20);

    const nowIso = new Date().toISOString();
    const windowStartIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const sessionsQuery = await supabase
      .from('study_sessions')
      .select('id,started_at,ended_at,duration_minutes,mcqs_attempted,mcqs_correct,source')
      .eq('user_id', userId)
      .ilike('source', 'exam-centre:%')
      .gte('started_at', windowStartIso)
      .order('started_at', { ascending: false })
      .limit(sessionLimit);

    if (sessionsQuery.error) {
      console.error('Exam read-model sessions query error:', sessionsQuery.error);
      return NextResponse.json({ error: 'Failed to fetch exam sessions' }, { status: 500 });
    }

    const sessions = (sessionsQuery.data || []) as SessionRow[];
    if (!sessions.length) {
      return NextResponse.json({
        windowDays: days,
        summary: {
          totalSessions: 0,
          completedSessions: 0,
          inProgressSessions: 0,
          avgSessionAccuracyPercent: null,
          avgSessionDurationMinutes: null,
          avgAttemptsPerSession: 0,
          highQualitySessionRate: 0,
          calibrationGapPercent: null,
          weakTopicCount: 0,
          recurringWeakTopicCount: 0,
        },
        sessionQuality: {
          totalSessions: 0,
          highQualitySessions: 0,
          highQualitySessionRate: 0,
          byMode: [],
          recentSessions: [],
        },
        confidenceCalibration: {
          overall: {
            attempts: 0,
            avgConfidence: null,
            accuracyPercent: null,
            expectedAccuracyPercent: null,
            calibrationGapPercent: null,
            absoluteErrorPercent: null,
          },
          bands: [1, 2, 3, 4, 5].map((confidence) => zeroCalibrationBand(confidence)),
        },
        weakTopicRecurrence: {
          totalTopicsTracked: 0,
          weakTopicCount: 0,
          recurringWeakTopicCount: 0,
          topics: [],
        },
        generatedAt: nowIso,
      });
    }

    const sessionIds = sessions.map((session) => session.id);
    const sessionIdSet = new Set(sessionIds);
    const sessionModeById = new Map(
      sessions.map((session) => [session.id, modeFromSource(session.source)] as const)
    );

    const [mcqAttemptsQuery, analyticsEventsQuery] = await Promise.all([
      supabase
        .from('mcq_attempts')
        .select('id,session_id,is_correct,confidence,time_taken_seconds,created_at,mcq_id,mcqs(specialty,topic,subtopic,source_exam)')
        .eq('user_id', userId)
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false })
        .limit(attemptLimit),
      supabase
        .from('analytics_events')
        .select('id,created_at,event_data')
        .eq('user_id', userId)
        .eq('event_name', 'exam_answer')
        .gte('created_at', windowStartIso)
        .order('created_at', { ascending: false })
        .limit(attemptLimit),
    ]);

    if (mcqAttemptsQuery.error) {
      console.error('Exam read-model MCQ attempt query error:', mcqAttemptsQuery.error);
      return NextResponse.json({ error: 'Failed to fetch attempt analytics' }, { status: 500 });
    }

    let analyticsEvents: AnalyticsEventRow[] = [];
    if (analyticsEventsQuery.error) {
      const code = (analyticsEventsQuery.error as { code?: string }).code;
      const message = (analyticsEventsQuery.error as { message?: string }).message || '';
      const isMissingAnalyticsEventsTable =
        code === '42P01' ||
        code === 'PGRST205' ||
        (message.includes('analytics_events') &&
          (message.toLowerCase().includes('does not exist') ||
            message.toLowerCase().includes('not found')));

      if (isMissingAnalyticsEventsTable) {
        console.warn('analytics_events table missing; skipping template attempt analytics');
      } else {
        console.error('Exam read-model analytics_events query error:', analyticsEventsQuery.error);
        return NextResponse.json({ error: 'Failed to fetch template analytics' }, { status: 500 });
      }
    } else {
      analyticsEvents = (analyticsEventsQuery.data || []) as AnalyticsEventRow[];
    }

    const attempts: UnifiedAttempt[] = [];

    for (const row of (mcqAttemptsQuery.data || []) as McqAttemptRow[]) {
      if (!row.session_id || !sessionIdSet.has(row.session_id)) continue;
      const meta = firstMcqMeta(row.mcqs);
      const subject = normalizeSubject(meta?.specialty || null);
      const topic = asString(meta?.topic) || 'Untitled Topic';
      const subtopic = asString(meta?.subtopic);
      const topicLabel = subtopic ? `${topic} / ${subtopic}` : topic;
      const topicKey = `mcq:${subject}:${slugify(topicLabel) || row.mcq_id || row.id}`;
      const confidence = toNumber(row.confidence);
      const normalizedConfidence =
        confidence !== null && Number.isInteger(confidence) && confidence >= 1 && confidence <= 5
          ? confidence
          : null;

      attempts.push({
        id: row.id,
        sessionId: row.session_id,
        mode: sessionModeById.get(row.session_id) || 'unknown',
        createdAt: row.created_at,
        isCorrect: row.is_correct === true,
        confidence: normalizedConfidence,
        timeTakenSeconds:
          typeof row.time_taken_seconds === 'number' && row.time_taken_seconds >= 0
            ? row.time_taken_seconds
            : null,
        topicKey,
        topicLabel,
        subject,
      });
    }

    for (const row of analyticsEvents) {
      const eventData = asRecord(row.event_data) || {};
      const sessionId = asString(eventData.session_id);
      if (!sessionId || !sessionIdSet.has(sessionId)) continue;

      if (eventData.is_correct !== true && eventData.is_correct !== false) continue;
      const confidenceRaw = toNumber(eventData.confidence);
      const confidence =
        confidenceRaw !== null &&
        Number.isInteger(confidenceRaw) &&
        confidenceRaw >= 1 &&
        confidenceRaw <= 5
          ? confidenceRaw
          : null;

      const modeRaw = asString(eventData.mode)?.toLowerCase() || null;
      const mode = isSessionMode(modeRaw) ? modeRaw : sessionModeById.get(sessionId) || 'unknown';
      const questionRef = asString(eventData.question_ref) || `template-${row.id}`;
      const topicKey = `template:${slugify(questionRef) || row.id}`;

      attempts.push({
        id: row.id,
        sessionId,
        mode,
        createdAt: row.created_at,
        isCorrect: eventData.is_correct === true,
        confidence,
        timeTakenSeconds: toNumber(eventData.time_taken_seconds),
        topicKey,
        topicLabel: humanizeQuestionRef(questionRef),
        subject: extractSubjectFromQuestionRef(questionRef),
      });
    }

    const attemptsBySession = new Map<string, UnifiedAttempt[]>();
    for (const attempt of attempts) {
      const existing = attemptsBySession.get(attempt.sessionId) || [];
      existing.push(attempt);
      attemptsBySession.set(attempt.sessionId, existing);
    }

    const recentSessions = sessions.map((session) => {
      const sessionAttempts = attemptsBySession.get(session.id) || [];
      const derivedAttempted = sessionAttempts.length;
      const derivedCorrect = sessionAttempts.filter((attempt) => attempt.isCorrect).length;
      const attempted = Math.max(session.mcqs_attempted || 0, derivedAttempted);
      const correct = Math.max(session.mcqs_correct || 0, derivedCorrect);
      const accuracyPercent = percent(correct, attempted);
      const durationMinutes = computeDurationMinutes(session);
      const completed = Boolean(session.ended_at);
      const score = computeSessionQualityScore({
        completed,
        attempted,
        accuracyPercent,
        durationMinutes,
      });
      return {
        sessionId: session.id,
        mode: modeFromSource(session.source),
        startedAt: session.started_at,
        endedAt: session.ended_at,
        completed,
        attempted,
        correct,
        accuracyPercent,
        durationMinutes,
        qualityScore: score,
        qualityBand: qualityBand(score),
      };
    });

    const modeBuckets = new Map<
      SessionMode,
      {
        mode: SessionMode;
        sessionCount: number;
        completedSessionCount: number;
        totalAttempts: number;
        totalCorrect: number;
        durationValues: number[];
        highQualitySessions: number;
        qualityValues: number[];
      }
    >();

    for (const mode of MODE_ORDER) {
      modeBuckets.set(mode, {
        mode,
        sessionCount: 0,
        completedSessionCount: 0,
        totalAttempts: 0,
        totalCorrect: 0,
        durationValues: [],
        highQualitySessions: 0,
        qualityValues: [],
      });
    }

    for (const session of recentSessions) {
      const bucket = modeBuckets.get(session.mode);
      if (!bucket) continue;
      bucket.sessionCount += 1;
      bucket.completedSessionCount += session.completed ? 1 : 0;
      bucket.totalAttempts += session.attempted;
      bucket.totalCorrect += session.correct;
      if (session.durationMinutes !== null) bucket.durationValues.push(session.durationMinutes);
      if (session.qualityScore >= 60) bucket.highQualitySessions += 1;
      bucket.qualityValues.push(session.qualityScore);
    }

    const byMode = MODE_ORDER.map((mode) => modeBuckets.get(mode))
      .filter(
        (
          bucket
        ): bucket is {
          mode: SessionMode;
          sessionCount: number;
          completedSessionCount: number;
          totalAttempts: number;
          totalCorrect: number;
          durationValues: number[];
          highQualitySessions: number;
          qualityValues: number[];
        } => Boolean(bucket && bucket.sessionCount > 0)
      )
      .map((bucket) => ({
        mode: bucket.mode,
        sessionCount: bucket.sessionCount,
        completedSessionCount: bucket.completedSessionCount,
        avgAttemptsPerSession: round(bucket.totalAttempts / bucket.sessionCount),
        avgAccuracyPercent: percent(bucket.totalCorrect, bucket.totalAttempts),
        avgDurationMinutes: avg(bucket.durationValues),
        highQualitySessions: bucket.highQualitySessions,
        highQualityRate: percent(bucket.highQualitySessions, bucket.sessionCount) || 0,
        avgQualityScore: avg(bucket.qualityValues),
      }));

    const confidenceAttempts = attempts.filter(
      (attempt) => attempt.confidence !== null
    ) as Array<UnifiedAttempt & { confidence: number }>;

    const confidenceBands = [1, 2, 3, 4, 5].map((confidence) => {
      const bucket = confidenceAttempts.filter((attempt) => attempt.confidence === confidence);
      const correct = bucket.filter((attempt) => attempt.isCorrect).length;
      const accuracyPercent = percent(correct, bucket.length);
      const expectedAccuracyPercent = expectedAccuracyForConfidence(confidence);
      const gapPercent =
        accuracyPercent === null ? null : round(accuracyPercent - expectedAccuracyPercent);
      return {
        confidence,
        attempts: bucket.length,
        expectedAccuracyPercent,
        accuracyPercent,
        gapPercent,
        state: calibrationState(gapPercent),
      };
    });

    const overallConfidenceAttempts = confidenceAttempts.length;
    const confidenceCorrect = confidenceAttempts.filter((attempt) => attempt.isCorrect).length;
    const overallAccuracy = percent(confidenceCorrect, overallConfidenceAttempts);
    const avgConfidence =
      overallConfidenceAttempts > 0
        ? round(
            confidenceAttempts.reduce((sum, attempt) => sum + attempt.confidence, 0) /
              overallConfidenceAttempts
          )
        : null;
    const expectedAccuracyOverall =
      overallConfidenceAttempts > 0
        ? round(
            confidenceAttempts.reduce(
              (sum, attempt) => sum + expectedAccuracyForConfidence(attempt.confidence),
              0
            ) / overallConfidenceAttempts
          )
        : null;
    const calibrationGapPercent =
      overallAccuracy !== null && expectedAccuracyOverall !== null
        ? round(overallAccuracy - expectedAccuracyOverall)
        : null;
    const absoluteErrorPercent =
      overallConfidenceAttempts > 0
        ? round(
            confidenceAttempts.reduce((sum, attempt) => {
              const observed = attempt.isCorrect ? 100 : 0;
              const expected = expectedAccuracyForConfidence(attempt.confidence);
              return sum + Math.abs(observed - expected);
            }, 0) / overallConfidenceAttempts
          )
        : null;

    const topicBuckets = new Map<
      string,
      {
        topicKey: string;
        topicLabel: string;
        subject: string;
        attempts: number;
        incorrectCount: number;
        correctCount: number;
        lastSeenAt: string;
        confidenceTotal: number;
        confidenceCount: number;
        modeCounts: Record<SessionMode, number>;
      }
    >();

    for (const attempt of attempts) {
      const existing = topicBuckets.get(attempt.topicKey) || {
        topicKey: attempt.topicKey,
        topicLabel: attempt.topicLabel,
        subject: attempt.subject,
        attempts: 0,
        incorrectCount: 0,
        correctCount: 0,
        lastSeenAt: attempt.createdAt,
        confidenceTotal: 0,
        confidenceCount: 0,
        modeCounts: {
          pyq: 0,
          mcq: 0,
          simulator: 0,
          practical: 0,
          flow: 0,
          guided: 0,
          unknown: 0,
        },
      };

      existing.attempts += 1;
      existing.correctCount += attempt.isCorrect ? 1 : 0;
      existing.incorrectCount += attempt.isCorrect ? 0 : 1;
      existing.lastSeenAt =
        Date.parse(attempt.createdAt) > Date.parse(existing.lastSeenAt)
          ? attempt.createdAt
          : existing.lastSeenAt;
      if (attempt.confidence !== null) {
        existing.confidenceTotal += attempt.confidence;
        existing.confidenceCount += 1;
      }
      existing.modeCounts[attempt.mode] += 1;
      topicBuckets.set(attempt.topicKey, existing);
    }

    const topics = Array.from(topicBuckets.values()).map((topic) => {
      const modeEntry = Object.entries(topic.modeCounts).sort((a, b) => b[1] - a[1])[0];
      const accuracyPercent = percent(topic.correctCount, topic.attempts) || 0;
      const recurrenceCount = Math.max(0, topic.incorrectCount - 1);
      return {
        topicKey: topic.topicKey,
        topicLabel: topic.topicLabel,
        subject: topic.subject,
        attempts: topic.attempts,
        incorrectCount: topic.incorrectCount,
        accuracyPercent,
        recurrenceCount,
        recurrenceRatePercent: percent(topic.incorrectCount, topic.attempts) || 0,
        avgConfidence:
          topic.confidenceCount > 0 ? round(topic.confidenceTotal / topic.confidenceCount) : null,
        primaryMode: (modeEntry?.[0] as SessionMode | undefined) || 'unknown',
        lastSeenAt: topic.lastSeenAt,
        status:
          topic.incorrectCount >= 3 || accuracyPercent <= 40
            ? 'high_risk'
            : topic.incorrectCount >= 2
              ? 'watch'
              : 'stable',
      };
    });

    const weakTopics = topics
      .filter((topic) => topic.attempts >= 2 && (topic.incorrectCount >= 2 || topic.accuracyPercent < 55))
      .sort((a, b) => {
        if (b.recurrenceCount !== a.recurrenceCount) return b.recurrenceCount - a.recurrenceCount;
        if (b.incorrectCount !== a.incorrectCount) return b.incorrectCount - a.incorrectCount;
        if (b.attempts !== a.attempts) return b.attempts - a.attempts;
        return Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt);
      });

    const recurringWeakTopicCount = weakTopics.filter((topic) => topic.recurrenceCount > 0).length;
    const highQualitySessions = recentSessions.filter((session) => session.qualityScore >= 60).length;
    const totalAttempts = recentSessions.reduce((sum, session) => sum + session.attempted, 0);
    const totalCorrect = recentSessions.reduce((sum, session) => sum + session.correct, 0);
    const durationValues = recentSessions
      .map((session) => session.durationMinutes)
      .filter((value): value is number => value !== null);
    const completedSessions = recentSessions.filter((session) => session.completed).length;

    return NextResponse.json({
      windowDays: days,
      summary: {
        totalSessions: recentSessions.length,
        completedSessions,
        inProgressSessions: recentSessions.length - completedSessions,
        avgSessionAccuracyPercent: percent(totalCorrect, totalAttempts),
        avgSessionDurationMinutes: avg(durationValues),
        avgAttemptsPerSession: recentSessions.length > 0 ? round(totalAttempts / recentSessions.length) : 0,
        highQualitySessionRate: percent(highQualitySessions, recentSessions.length) || 0,
        calibrationGapPercent,
        weakTopicCount: weakTopics.length,
        recurringWeakTopicCount,
      },
      sessionQuality: {
        totalSessions: recentSessions.length,
        highQualitySessions,
        highQualitySessionRate: percent(highQualitySessions, recentSessions.length) || 0,
        byMode,
        recentSessions: recentSessions.slice(0, 12),
      },
      confidenceCalibration: {
        overall: {
          attempts: overallConfidenceAttempts,
          avgConfidence,
          accuracyPercent: overallAccuracy,
          expectedAccuracyPercent: expectedAccuracyOverall,
          calibrationGapPercent,
          absoluteErrorPercent,
        },
        bands: confidenceBands,
      },
      weakTopicRecurrence: {
        totalTopicsTracked: topics.length,
        weakTopicCount: weakTopics.length,
        recurringWeakTopicCount,
        topics: weakTopics.slice(0, weakLimit),
      },
      generatedAt: nowIso,
    });
  } catch (error) {
    console.error('Exam read-model analytics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
