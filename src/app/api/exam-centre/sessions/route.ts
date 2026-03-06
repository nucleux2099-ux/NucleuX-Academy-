import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';
import { parseLimit } from '@/lib/learning/contracts';

const ALLOWED_MODES = ['pyq', 'mcq', 'simulator', 'practical', 'flow', 'guided'] as const;
type ExamMode = (typeof ALLOWED_MODES)[number];

function isExamMode(value: unknown): value is ExamMode {
  return typeof value === 'string' && ALLOWED_MODES.includes(value as ExamMode);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function parseOffset(raw: string | null) {
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

function parseBoolean(raw: string | null, fallback = false) {
  if (!raw) return fallback;
  return raw === '1' || raw.toLowerCase() === 'true';
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get('limit'), 20, 100);
    const offset = parseOffset(searchParams.get('offset'));
    const includeEnded = parseBoolean(searchParams.get('include_ended'), true);

    let query = supabase
      .from('study_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .ilike('source', 'exam-centre:%')
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeEnded) {
      query = query.is('ended_at', null);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Exam session listing query error:', error);
      return NextResponse.json({ error: 'Failed to load sessions' }, { status: 500 });
    }

    const sessions = (data || []).map((session) => ({
      ...session,
      mode: typeof session.source === 'string' && session.source.startsWith('exam-centre:')
        ? session.source.replace('exam-centre:', '')
        : 'unknown',
    }));

    return NextResponse.json({
      sessions,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    });
  } catch (error) {
    console.error('Exam session listing GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const body = await request.json();
    const mode = body?.mode;

    if (!isExamMode(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Expected one of: pyq, mcq, simulator, practical, flow, guided.' },
        { status: 400 }
      );
    }

    const rawAtomIds = Array.isArray(body?.atom_ids) ? body.atom_ids : [];
    const atomIds = rawAtomIds.filter((value: unknown): value is string => {
      return typeof value === 'string' && isUuid(value);
    });

    const startedAt =
      typeof body?.started_at === 'string' && !Number.isNaN(Date.parse(body.started_at))
        ? new Date(body.started_at).toISOString()
        : new Date().toISOString();

    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        started_at: startedAt,
        atoms_studied: atomIds,
        source: `exam-centre:${mode}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Exam session create error:', error);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    await fetch(new URL('/api/streaks', request.url), {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') || '' },
    }).catch(() => {
      // Best-effort streak bump.
    });

    return NextResponse.json({
      ...data,
      mode,
    });
  } catch (error) {
    console.error('Exam session create POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
