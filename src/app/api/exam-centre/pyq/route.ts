import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';
import { parseLimit } from '@/lib/learning/contracts';

type McqRow = {
  id: string;
  source_exam: string | null;
  source: string | null;
  specialty: string;
  topic: string;
};

type PaperAggregate = {
  id: string;
  name: string;
  source: string;
  year: number | null;
  totalQuestions: number;
  subjects: Set<string>;
  topics: Map<string, number>;
};

const FALLBACK_PAPERS = [
  { name: 'NEET-PG 2024', totalQuestions: 200, year: 2024 },
  { name: 'INICET Nov 2024', totalQuestions: 200, year: 2024 },
  { name: 'AIIMS Nov 2024', totalQuestions: 200, year: 2024 },
  { name: 'NEET-PG 2023', totalQuestions: 200, year: 2023 },
  { name: 'INICET May 2024', totalQuestions: 200, year: 2024 },
  { name: 'DNB-CET 2024', totalQuestions: 200, year: 2024 },
] as const;

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeSubject(raw: string) {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-');

  if (normalized.includes('surgery')) return 'surgery';
  if (normalized.includes('medicine')) return 'medicine';
  if (normalized.includes('ob') || normalized.includes('gyn')) return 'obg';
  if (normalized.includes('pediatric')) return 'pediatrics';
  if (normalized.includes('anatomy')) return 'anatomy';
  if (normalized.includes('pathology')) return 'pathology';
  if (normalized.includes('pharma')) return 'pharmacology';
  if (normalized.includes('radio')) return 'radiology';
  if (normalized.includes('ophthal') || normalized.includes('eye')) return 'ophthalmology';
  if (normalized === 'ent' || normalized.includes('ear') || normalized.includes('nose') || normalized.includes('throat')) return 'ent';
  return normalized;
}

function parseYear(value: string) {
  const match = value.match(/(19|20)\d{2}/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function topTopics(topics: Map<string, number>, limit = 3) {
  return Array.from(topics.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase } = auth;

    const { searchParams } = new URL(request.url);
    const subjectFilter = searchParams.get('subject');
    const limit = parseLimit(searchParams.get('limit'), 12, 40);

    const { data, error } = await supabase
      .from('mcqs')
      .select('id,source_exam,source,specialty,topic')
      .eq('is_published', true)
      .not('source_exam', 'is', null)
      .limit(6000);

    if (error) {
      console.error('PYQ listing query error:', error);
      return NextResponse.json({ error: 'Failed to load PYQ catalog' }, { status: 500 });
    }

    const rows = ((data || []) as McqRow[]).filter((row) => {
      if (!subjectFilter) return true;
      return normalizeSubject(row.specialty) === normalizeSubject(subjectFilter);
    });

    const paperMap = new Map<string, PaperAggregate>();

    for (const row of rows) {
      if (!row.source_exam) continue;
      const key = row.source_exam.trim();
      const existing = paperMap.get(key) || {
        id: toSlug(key),
        name: key,
        source: row.source || 'question-bank',
        year: parseYear(key),
        totalQuestions: 0,
        subjects: new Set<string>(),
        topics: new Map<string, number>(),
      };
      existing.totalQuestions += 1;
      existing.subjects.add(normalizeSubject(row.specialty));
      existing.topics.set(row.topic, (existing.topics.get(row.topic) || 0) + 1);
      paperMap.set(key, existing);
    }

    const paperRows = Array.from(paperMap.values())
      .sort((a, b) => {
        const yearA = a.year || 0;
        const yearB = b.year || 0;
        if (yearA !== yearB) return yearB - yearA;
        return b.totalQuestions - a.totalQuestions;
      })
      .slice(0, limit);

    const subjectSet = new Set<string>();
    for (const paper of paperRows) {
      for (const subject of paper.subjects) {
        if (subject) subjectSet.add(subject);
      }
    }

    const papers = paperRows
      .map((paper, index) => ({
        id: paper.id,
        name: paper.name,
        source: paper.source,
        year: paper.year,
        totalQuestions: paper.totalQuestions,
        totalSubjects: paper.subjects.size,
        highYieldTopics: topTopics(paper.topics, 3),
        durationMinutes: 210,
        isAvailable: index === 0,
        href: '/exam-centre/pyq',
      }));

    if (!papers.length) {
      return NextResponse.json({
        summary: {
          totalPapers: FALLBACK_PAPERS.length,
          totalQuestions: FALLBACK_PAPERS.reduce((sum, paper) => sum + paper.totalQuestions, 0),
          totalSubjects: 0,
        },
        papers: FALLBACK_PAPERS.slice(0, limit).map((paper, index) => ({
          id: toSlug(paper.name),
          name: paper.name,
          source: 'seed',
          year: paper.year,
          totalQuestions: paper.totalQuestions,
          totalSubjects: 0,
          highYieldTopics: [],
          durationMinutes: 210,
          isAvailable: index === 0,
          href: '/exam-centre/pyq',
        })),
        fallbackUsed: true,
      });
    }

    return NextResponse.json({
      summary: {
        totalPapers: papers.length,
        totalQuestions: papers.reduce((sum, paper) => sum + paper.totalQuestions, 0),
        totalSubjects: subjectSet.size,
      },
      papers,
      fallbackUsed: false,
    });
  } catch (error) {
    console.error('PYQ listing GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
