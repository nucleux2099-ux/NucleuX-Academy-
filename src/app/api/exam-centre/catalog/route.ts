import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';

type McqCatalogRow = {
  specialty: string | null;
  source_exam: string | null;
};

type LearningTopicRow = {
  subject: string;
  status: string;
};

type LearningCheckpointRow = {
  stage: string;
  passed: boolean;
};

type AttemptWithMcqRow = {
  is_correct: boolean | null;
  mcqs: { source_exam: string | null } | { source_exam: string | null }[] | null;
};

type SubjectBucket = {
  id: string;
  name: string;
  totalQuestions: number;
  pyqQuestions: number;
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

function normalizeSubject(raw: string) {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (normalized === 'ob-gyn' || normalized === 'obgyn' || normalized === 'obstetrics-and-gynecology') {
    return 'obg';
  }
  if (normalized === 'ophthal') return 'ophthalmology';
  return normalized;
}

function toTitle(subjectId: string) {
  return SUBJECT_LABELS[subjectId] || subjectId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function asArray(value: AttemptWithMcqRow['mcqs']) {
  if (!value) return [] as { source_exam: string | null }[];
  return Array.isArray(value) ? value : [value];
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const [
      totalMcqsResult,
      pyqMcqsResult,
      totalAttemptsResult,
      totalCorrectResult,
      attemptsWithMcqResult,
      mcqCatalogResult,
      topicsResult,
      checkpointsResult,
    ] = await Promise.all([
      supabase
        .from('mcqs')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('mcqs')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true)
        .not('source_exam', 'is', null),
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
        .select('is_correct,mcqs!inner(source_exam)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3000),
      supabase
        .from('mcqs')
        .select('specialty,source_exam')
        .eq('is_published', true)
        .limit(5000),
      supabase
        .from('learning_topics')
        .select('subject,status')
        .eq('user_id', userId)
        .limit(500),
      supabase
        .from('learning_checkpoints')
        .select('stage,passed')
        .in('stage', ['shoot', 'skin'])
        .order('evaluated_at', { ascending: false })
        .limit(1500),
    ]);

    if (
      totalMcqsResult.error ||
      pyqMcqsResult.error ||
      totalAttemptsResult.error ||
      totalCorrectResult.error ||
      attemptsWithMcqResult.error ||
      mcqCatalogResult.error ||
      topicsResult.error ||
      checkpointsResult.error
    ) {
      console.error('Exam centre catalog query error:', {
        totalMcqsError: totalMcqsResult.error,
        pyqMcqsError: pyqMcqsResult.error,
        totalAttemptsError: totalAttemptsResult.error,
        totalCorrectError: totalCorrectResult.error,
        attemptsWithMcqError: attemptsWithMcqResult.error,
        mcqCatalogError: mcqCatalogResult.error,
        topicsError: topicsResult.error,
        checkpointsError: checkpointsResult.error,
      });
      return NextResponse.json({ error: 'Failed to load catalog' }, { status: 500 });
    }

    const totalMcqs = totalMcqsResult.count || 0;
    const totalPyqs = pyqMcqsResult.count || 0;
    const totalAttempts = totalAttemptsResult.count || 0;
    const totalCorrect = totalCorrectResult.count || 0;

    const attemptsWithMcq = (attemptsWithMcqResult.data || []) as AttemptWithMcqRow[];
    const pyqAttempts = attemptsWithMcq.reduce((sum, row) => {
      const hasPyq = asArray(row.mcqs).some((mcq) => Boolean(mcq.source_exam));
      return sum + (hasPyq ? 1 : 0);
    }, 0);
    const pyqCorrect = attemptsWithMcq.reduce((sum, row) => {
      const hasPyq = asArray(row.mcqs).some((mcq) => Boolean(mcq.source_exam));
      return sum + (hasPyq && row.is_correct ? 1 : 0);
    }, 0);

    const topics = (topicsResult.data || []) as LearningTopicRow[];
    const checkpoints = (checkpointsResult.data || []) as LearningCheckpointRow[];
    const shootAttempts = checkpoints.filter((row) => row.stage === 'shoot').length;
    const shootPassed = checkpoints.filter((row) => row.stage === 'shoot' && row.passed).length;
    const skinAttempts = checkpoints.filter((row) => row.stage === 'skin').length;
    const skinPassed = checkpoints.filter((row) => row.stage === 'skin' && row.passed).length;

    const subjectBuckets = new Map<string, SubjectBucket>();

    for (const row of (mcqCatalogResult.data || []) as McqCatalogRow[]) {
      if (!row.specialty) continue;
      const id = normalizeSubject(row.specialty);
      const existing = subjectBuckets.get(id) || {
        id,
        name: toTitle(id),
        totalQuestions: 0,
        pyqQuestions: 0,
        activeTopics: 0,
        completedTopics: 0,
      };
      existing.totalQuestions += 1;
      if (row.source_exam) existing.pyqQuestions += 1;
      subjectBuckets.set(id, existing);
    }

    for (const topic of topics) {
      const id = normalizeSubject(topic.subject);
      const existing = subjectBuckets.get(id) || {
        id,
        name: toTitle(id),
        totalQuestions: 0,
        pyqQuestions: 0,
        activeTopics: 0,
        completedTopics: 0,
      };
      if (topic.status === 'completed') existing.completedTopics += 1;
      if (topic.status === 'active' || topic.status === 'paused') existing.activeTopics += 1;
      subjectBuckets.set(id, existing);
    }

    const orderedSubjects = SUBJECT_ORDER.map((id) => {
      return (
        subjectBuckets.get(id) || {
          id,
          name: toTitle(id),
          totalQuestions: 0,
          pyqQuestions: 0,
          activeTopics: 0,
          completedTopics: 0,
        }
      );
    });

    for (const [id, row] of subjectBuckets.entries()) {
      if (!SUBJECT_ORDER.includes(id as (typeof SUBJECT_ORDER)[number])) {
        orderedSubjects.push(row);
      }
    }

    const examTypes = [
      {
        id: 'pyq',
        title: 'Previous Year Questions',
        description: 'University papers with textbook references',
        href: '/exam-centre/pyq',
        isAvailable: true,
        stats: {
          total: totalPyqs,
          attempted: pyqAttempts,
          mastered: pyqCorrect,
        },
      },
      {
        id: 'mcq',
        title: 'MCQ Practice',
        description: 'Topic-wise questions with explanations',
        href: '/exam-centre/mcq',
        isAvailable: true,
        stats: {
          total: totalMcqs,
          attempted: totalAttempts,
          mastered: totalCorrect,
        },
      },
      {
        id: 'patient-sim',
        title: 'Patient Simulator',
        description: 'Real-life case simulations',
        href: '/exam-centre/simulator/acute-appendicitis',
        isAvailable: true,
        stats: {
          total: 12,
          attempted: shootAttempts,
          mastered: shootPassed,
        },
      },
      {
        id: 'patient-flow',
        title: 'Patient Flows',
        description: 'Clinical decision pathways',
        href: '/exam-centre/flow/upper-gi-bleeding',
        isAvailable: true,
        stats: {
          total: 24,
          attempted: shootAttempts,
          mastered: shootPassed,
        },
      },
      {
        id: 'practical',
        title: 'Practical Exams',
        description: 'OSCE & clinical skills assessment',
        href: '/exam-centre/osce/thyroid-examination',
        isAvailable: true,
        stats: {
          total: 16,
          attempted: skinAttempts,
          mastered: skinPassed,
        },
      },
      {
        id: 'guided',
        title: 'Guided Learning',
        description: 'Step-by-step concept mastery',
        href: '#',
        isAvailable: false,
        stats: {
          total: topics.length || 100,
          attempted: topics.filter((topic) => topic.status !== 'archived').length,
          mastered: topics.filter((topic) => topic.status === 'completed').length,
        },
      },
    ];

    return NextResponse.json({
      summary: {
        totalMcqs,
        totalPyqs,
        totalAttempts,
        totalCorrect,
      },
      examTypes,
      subjects: orderedSubjects,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Exam centre catalog GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
