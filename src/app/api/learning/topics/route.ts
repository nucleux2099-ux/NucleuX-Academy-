import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';
import {
  isLearningStage,
  isLearningTopicStatus,
  isRecord,
  parseLimit,
} from '@/lib/learning/contracts';

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');
    const subject = searchParams.get('subject');
    const topicSlug = searchParams.get('topic_slug');
    const limit = parseLimit(searchParams.get('limit'));

    if (stage && !isLearningStage(stage)) {
      return NextResponse.json({ error: 'Invalid stage filter' }, { status: 400 });
    }

    if (status && !isLearningTopicStatus(status)) {
      return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
    }

    let query = supabase
      .from('learning_topics')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (stage) query = query.eq('stage', stage);
    if (status) query = query.eq('status', status);
    if (subject) query = query.eq('subject', subject.trim().toLowerCase());
    if (topicSlug) query = query.eq('topic_slug', normalizeSlug(topicSlug));

    const { data, error } = await query;

    if (error) {
      console.error('Learning topics GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch learning topics' }, { status: 500 });
    }

    return NextResponse.json({ topics: data || [] });
  } catch (error) {
    console.error('Learning topics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const topicSlugRaw = body.topic_slug;
    const topicTitleRaw = body.topic_title;
    const subjectRaw = body.subject;

    if (
      typeof topicSlugRaw !== 'string' ||
      typeof topicTitleRaw !== 'string' ||
      typeof subjectRaw !== 'string'
    ) {
      return NextResponse.json(
        { error: 'topic_slug, topic_title, and subject are required' },
        { status: 400 }
      );
    }

    const stage = body.stage;
    if (stage !== undefined && !isLearningStage(stage)) {
      return NextResponse.json({ error: 'Invalid stage value' }, { status: 400 });
    }

    const status = body.status;
    if (status !== undefined && !isLearningTopicStatus(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const metadata = body.metadata;
    if (metadata !== undefined && !isRecord(metadata)) {
      return NextResponse.json({ error: 'metadata must be an object' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      user_id: userId,
      atom_id: typeof body.atom_id === 'string' ? body.atom_id : null,
      subject: subjectRaw.trim().toLowerCase(),
      subspecialty: typeof body.subspecialty === 'string' ? body.subspecialty.trim().toLowerCase() : '',
      topic_slug: normalizeSlug(topicSlugRaw),
      topic_title: topicTitleRaw.trim(),
      stage: stage ?? 'prestudy',
      status: status ?? 'active',
      metadata: metadata ?? {},
    };

    const { data, error } = await supabase
      .from('learning_topics')
      .upsert(payload, {
        onConflict: 'user_id,subject,subspecialty,topic_slug',
      })
      .select()
      .single();

    if (error) {
      console.error('Learning topics POST error:', error);
      return NextResponse.json({ error: 'Failed to save learning topic' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Learning topics POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const id = body.id;
    if (typeof id !== 'string') {
      return NextResponse.json({ error: 'id is required for updates' }, { status: 400 });
    }

    if (body.stage !== undefined && !isLearningStage(body.stage)) {
      return NextResponse.json({ error: 'Invalid stage value' }, { status: 400 });
    }

    if (body.status !== undefined && !isLearningTopicStatus(body.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    if (body.metadata !== undefined && !isRecord(body.metadata)) {
      return NextResponse.json({ error: 'metadata must be an object' }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};

    if (typeof body.topic_title === 'string') patch.topic_title = body.topic_title.trim();
    if (typeof body.subject === 'string') patch.subject = body.subject.trim().toLowerCase();
    if (typeof body.subspecialty === 'string') {
      patch.subspecialty = body.subspecialty.trim().toLowerCase();
    }
    if (typeof body.topic_slug === 'string') patch.topic_slug = normalizeSlug(body.topic_slug);
    if (typeof body.atom_id === 'string' || body.atom_id === null) patch.atom_id = body.atom_id;
    if (body.stage !== undefined) patch.stage = body.stage;
    if (body.status !== undefined) patch.status = body.status;
    if (body.metadata !== undefined) patch.metadata = body.metadata;
    if (typeof body.completed_at === 'string' || body.completed_at === null) {
      patch.completed_at = body.completed_at;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('learning_topics')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Learning topics PATCH error:', error);
      return NextResponse.json({ error: 'Failed to update learning topic' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Learning topics PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

