import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';

type TopicRow = {
  subject: string;
  status: string;
  stage: string;
};

const CASES = [
  {
    id: 'acute-appendicitis',
    title: 'Acute Appendicitis',
    description: 'A 22-year-old male with right iliac fossa pain for 12 hours...',
    difficulty: 'Medium',
    duration: '20 min',
    subject: 'surgery',
    rating: 4.9,
    isNew: true,
    isAvailable: true,
  },
  {
    id: 'acute-abdomen',
    title: 'Acute Abdomen Emergency',
    description: 'A 45-year-old male presents with severe abdominal pain...',
    difficulty: 'Hard',
    duration: '25 min',
    subject: 'surgery',
    rating: 4.8,
    isNew: false,
    isAvailable: false,
  },
  {
    id: 'chest-pain',
    title: 'Chest Pain Evaluation',
    description: 'A 60-year-old diabetic female with crushing chest pain...',
    difficulty: 'Medium',
    duration: '20 min',
    subject: 'medicine',
    rating: 4.9,
    isNew: false,
    isAvailable: false,
  },
  {
    id: 'labor-management',
    title: 'Normal Labor Management',
    description: 'A primigravida at 39 weeks presents in early labor...',
    difficulty: 'Medium',
    duration: '30 min',
    subject: 'obg',
    rating: 4.7,
    isNew: false,
    isAvailable: false,
  },
] as const;

function normalizeSubject(raw: string) {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-');

  if (normalized.includes('surgery')) return 'surgery';
  if (normalized.includes('medicine')) return 'medicine';
  if (normalized.includes('ob') || normalized.includes('gyn')) return 'obg';
  return normalized;
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { data: topicsData, error: topicsError } = await supabase
      .from('learning_topics')
      .select('subject,status,stage')
      .eq('user_id', userId)
      .limit(600);

    if (topicsError) {
      console.error('Simulator catalog query error:', topicsError);
      return NextResponse.json({ error: 'Failed to load simulator catalog' }, { status: 500 });
    }

    const topics = (topicsData || []) as TopicRow[];

    const progressBySubject = topics.reduce((acc, topic) => {
      const subject = normalizeSubject(topic.subject);
      const bucket = acc.get(subject) || { total: 0, completed: 0, active: 0 };
      bucket.total += 1;
      if (topic.status === 'completed') bucket.completed += 1;
      if (topic.status === 'active' || topic.status === 'paused') bucket.active += 1;
      acc.set(subject, bucket);
      return acc;
    }, new Map<string, { total: number; completed: number; active: number }>());

    const cases = CASES.map((item) => {
      const subjectProgress = progressBySubject.get(item.subject) || { total: 0, completed: 0, active: 0 };
      const completionRate =
        subjectProgress.total > 0
          ? Math.round((subjectProgress.completed / subjectProgress.total) * 100)
          : 0;

      return {
        ...item,
        completionRate,
      };
    });

    const attemptedCases = cases.filter((item) => item.completionRate > 0).length;
    const masteredCases = cases.filter((item) => item.completionRate >= 70).length;

    return NextResponse.json({
      summary: {
        totalCases: cases.length,
        attemptedCases,
        masteredCases,
      },
      cases,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Simulator catalog GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
