import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';
import type { LearningStage, LearningTopicStatus } from '@/lib/learning/contracts';

type TopicStage = LearningStage | 'review';

type TopicRow = {
  id: string;
  subject: string;
  topic_title: string;
  stage: TopicStage;
  status: LearningTopicStatus;
  updated_at: string;
};

type CheckpointRow = {
  stage: LearningStage;
  checkpoint_code: string;
  passed: boolean;
  score: number | null;
  evaluated_at: string;
};

type McqAttemptRow = {
  is_correct: boolean;
  created_at: string;
};

type ActivityType = 'pyq' | 'simulation' | 'mcq' | 'practical';

type Activity = {
  type: ActivityType;
  title: string;
  score: string;
  occurredAt: string;
};

type SubjectProgress = {
  id: string;
  totalTopics: number;
  activeTopics: number;
  completedTopics: number;
};

const SUBJECT_ORDER = [
  'surgery',
  'medicine',
  'obg',
  'pediatrics',
  'anatomy',
  'pathology',
  'pharmacology',
  'radiology',
  'ophthalmology',
  'ent',
] as const;

const SUBJECT_LABELS: Record<string, string> = {
  surgery: 'Surgery',
  medicine: 'Medicine',
  obg: 'OBG',
  pediatrics: 'Pediatrics',
  anatomy: 'Anatomy',
  pathology: 'Pathology',
  pharmacology: 'Pharmacology',
  radiology: 'Radiology',
  ophthalmology: 'Ophthalmology',
  ent: 'ENT',
};

const FALLBACK_PATHWAYS = [
  {
    id: 'surgery-essentials',
    title: 'Surgery Essentials',
    modules: 12,
    completed: 4,
    description: 'Master core surgical concepts step-by-step',
    nextTopic: 'Acute Appendicitis',
    estimatedTime: '45 min',
    subjectId: 'surgery',
  },
  {
    id: 'medicine-diagnostics',
    title: 'Medicine Diagnostics',
    modules: 15,
    completed: 7,
    description: 'Learn systematic diagnostic approaches',
    nextTopic: 'Approach to Anemia',
    estimatedTime: '30 min',
    subjectId: 'medicine',
  },
  {
    id: 'emergency-protocols',
    title: 'Emergency Protocols',
    modules: 8,
    completed: 2,
    description: 'Critical emergency management pathways',
    nextTopic: 'Anaphylaxis Management',
    estimatedTime: '25 min',
    subjectId: 'surgery',
  },
] as const;

function normalizeSubject(raw: string) {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (normalized === 'ob-gyn' || normalized === 'obgyn') return 'obg';
  if (normalized === 'ophthal' || normalized === 'ophthalmology-and-eye') return 'ophthalmology';
  return normalized;
}

function formatRelativeTime(iso: string) {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return 'Recently';
  const diffMs = Date.now() - ts;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function stageLabel(stage: TopicStage | LearningStage) {
  if (stage === 'skin') return 'Skin';
  if (stage === 'shoot') return 'Shoot';
  if (stage === 'aim') return 'Aim';
  if (stage === 'review') return 'Review';
  return 'PreStudy';
}

function buildSubjectProgress(topics: TopicRow[]): SubjectProgress[] {
  const buckets = new Map<string, SubjectProgress>();

  for (const topic of topics) {
    const subjectId = normalizeSubject(topic.subject);
    if (!subjectId) continue;
    const existing = buckets.get(subjectId) || {
      id: subjectId,
      totalTopics: 0,
      activeTopics: 0,
      completedTopics: 0,
    };
    existing.totalTopics += 1;
    if (topic.status === 'active' || topic.status === 'paused') existing.activeTopics += 1;
    if (topic.status === 'completed') existing.completedTopics += 1;
    buckets.set(subjectId, existing);
  }

  const ordered: SubjectProgress[] = SUBJECT_ORDER.map((id) => {
    return (
      buckets.get(id) || {
        id,
        totalTopics: 0,
        activeTopics: 0,
        completedTopics: 0,
      }
    );
  });

  for (const [id, stats] of buckets.entries()) {
    if (!SUBJECT_ORDER.includes(id as (typeof SUBJECT_ORDER)[number])) {
      ordered.push(stats);
    }
  }

  return ordered;
}

function buildGuidedPathways(topics: TopicRow[], subjectProgress: SubjectProgress[]) {
  const dynamic = subjectProgress
    .filter((subject) => subject.totalTopics > 0)
    .sort((a, b) => b.totalTopics - a.totalTopics)
    .slice(0, 3)
    .map((subject) => {
      const topicRows = topics.filter(
        (topic) => normalizeSubject(topic.subject) === subject.id
      );
      const nextTopic =
        topicRows.find((topic) => topic.status !== 'completed')?.topic_title || 'Revision Loop';
      const remaining = Math.max(subject.totalTopics - subject.completedTopics, 1);
      return {
        id: `${subject.id}-mastery`,
        title: `${SUBJECT_LABELS[subject.id] || subject.id} Mastery`,
        modules: subject.totalTopics,
        completed: subject.completedTopics,
        description: `Structured progression for ${SUBJECT_LABELS[subject.id] || subject.id}.`,
        nextTopic,
        estimatedTime: `${Math.max(20, remaining * 12)} min`,
        subjectId: subject.id,
      };
    });

  if (dynamic.length) return dynamic;
  return [...FALLBACK_PATHWAYS];
}

function buildRecentActivity(topics: TopicRow[], checkpoints: CheckpointRow[], mcqAttempts: McqAttemptRow[]) {
  const activity: Activity[] = [];

  for (const attempt of mcqAttempts.slice(0, 4)) {
    activity.push({
      type: 'mcq',
      title: 'MCQ practice',
      score: attempt.is_correct ? 'Correct' : 'Incorrect',
      occurredAt: attempt.created_at,
    });
  }

  for (const checkpoint of checkpoints.slice(0, 4)) {
    const type: ActivityType =
      checkpoint.stage === 'skin'
        ? 'practical'
        : checkpoint.stage === 'shoot'
          ? 'simulation'
          : 'pyq';
    activity.push({
      type,
      title: `${stageLabel(checkpoint.stage)} checkpoint`,
      score:
        checkpoint.score !== null
          ? `${Math.round(checkpoint.score)}%`
          : checkpoint.passed
            ? 'Pass'
            : 'Needs work',
      occurredAt: checkpoint.evaluated_at,
    });
  }

  for (const topic of topics.slice(0, 4)) {
    activity.push({
      type: topic.stage === 'shoot' || topic.stage === 'skin' ? 'simulation' : 'pyq',
      title: `Updated ${topic.topic_title}`,
      score: topic.status === 'completed' ? 'Completed' : stageLabel(topic.stage),
      occurredAt: topic.updated_at,
    });
  }

  return activity
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    .slice(0, 6)
    .map((row) => ({
      type: row.type,
      title: row.title,
      score: row.score,
      time: formatRelativeTime(row.occurredAt),
      occurredAt: row.occurredAt,
    }));
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const [
      streakResult,
      attemptsCountResult,
      correctCountResult,
      recentAttemptsResult,
      topicsResult,
      checkpointsResult,
    ] = await Promise.all([
      supabase
        .from('streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('mcq_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('mcq_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_correct', true),
      supabase
        .from('mcq_attempts')
        .select('is_correct,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('learning_topics')
        .select('id,subject,topic_title,stage,status,updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(300),
      supabase
        .from('learning_checkpoints')
        .select('stage,checkpoint_code,passed,score,evaluated_at')
        .order('evaluated_at', { ascending: false })
        .limit(120),
    ]);

    if (attemptsCountResult.error || correctCountResult.error) {
      console.error('Exam centre overview MCQ summary error:', {
        attemptsError: attemptsCountResult.error,
        correctError: correctCountResult.error,
      });
      return NextResponse.json({ error: 'Failed to load exam centre metrics' }, { status: 500 });
    }

    if (streakResult.error || recentAttemptsResult.error || topicsResult.error || checkpointsResult.error) {
      console.error('Exam centre overview query error:', {
        streakError: streakResult.error,
        recentAttemptsError: recentAttemptsResult.error,
        topicsError: topicsResult.error,
        checkpointsError: checkpointsResult.error,
      });
      return NextResponse.json({ error: 'Failed to load exam centre overview' }, { status: 500 });
    }

    const attemptsCount = attemptsCountResult.count || 0;
    const correctCount = correctCountResult.count || 0;
    const accuracyPercent =
      attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0;

    const topics = (topicsResult.data || []) as TopicRow[];
    const checkpoints = (checkpointsResult.data || []) as CheckpointRow[];
    const recentAttempts = (recentAttemptsResult.data || []) as McqAttemptRow[];

    const casesCompleted = topics.filter(
      (topic) => topic.status === 'completed' || topic.stage === 'skin' || topic.stage === 'shoot'
    ).length;
    const pathwaysDone = topics.filter((topic) => topic.status === 'completed').length;
    const subjectProgress = buildSubjectProgress(topics);
    const guidedPathways = buildGuidedPathways(topics, subjectProgress);
    const recentActivity = buildRecentActivity(topics, checkpoints, recentAttempts);

    return NextResponse.json({
      summary: {
        questionsAttempted: attemptsCount,
        accuracyPercent,
        casesCompleted,
        pathwaysDone,
        studyStreakDays: streakResult.data?.current_streak || 0,
      },
      guidedPathways,
      subjectProgress,
      recentActivity,
    });
  } catch (error) {
    console.error('Exam centre overview GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
