import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, userOwnsLearningTopic } from '@/lib/learning/api';
import { isChunkStatus, isRecord, parseLimit } from '@/lib/learning/contracts';

type RouteContext = {
  params: Promise<{ topicId: string }> | { topicId: string };
};

async function readTopicId(context: RouteContext) {
  const params = await context.params;
  return params.topicId;
}

function chunkKeyFromTitle(title: string, chunkOrder: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug ? `${chunkOrder}-${slug}` : `chunk-${chunkOrder}`;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const topicId = await readTopicId(context);
    const ownsTopic = await userOwnsLearningTopic(supabase, userId, topicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get('limit'));

    const { data, error } = await supabase
      .from('learning_chunks')
      .select('*')
      .eq('learning_topic_id', topicId)
      .order('chunk_order', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Learning chunks GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch learning chunks' }, { status: 500 });
    }

    return NextResponse.json({ chunks: data || [] });
  } catch (error) {
    console.error('Learning chunks GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const topicId = await readTopicId(context);
    const ownsTopic = await userOwnsLearningTopic(supabase, userId, topicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const title = body.title;
    if (typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const status = body.status;
    if (status !== undefined && !isChunkStatus(status)) {
      return NextResponse.json({ error: 'Invalid chunk status' }, { status: 400 });
    }

    const payload = body.payload;
    if (payload !== undefined && !isRecord(payload)) {
      return NextResponse.json({ error: 'payload must be an object' }, { status: 400 });
    }

    let chunkOrder = 1;
    if (typeof body.chunk_order === 'number' && Number.isInteger(body.chunk_order) && body.chunk_order > 0) {
      chunkOrder = body.chunk_order;
    } else {
      const { data: latestChunk } = await supabase
        .from('learning_chunks')
        .select('chunk_order')
        .eq('learning_topic_id', topicId)
        .order('chunk_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      chunkOrder = (latestChunk?.chunk_order || 0) + 1;
    }

    const chunkKey =
      typeof body.chunk_key === 'string' && body.chunk_key.trim().length > 0
        ? body.chunk_key.trim().toLowerCase()
        : chunkKeyFromTitle(title, chunkOrder);

    const { data, error } = await supabase
      .from('learning_chunks')
      .insert({
        learning_topic_id: topicId,
        chunk_key: chunkKey,
        chunk_order: chunkOrder,
        title: title.trim(),
        why_important: typeof body.why_important === 'string' ? body.why_important : null,
        status: status ?? 'draft',
        payload: payload ?? {},
      })
      .select()
      .single();

    if (error) {
      console.error('Learning chunks POST error:', error);
      return NextResponse.json({ error: 'Failed to create learning chunk' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Learning chunks POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const topicId = await readTopicId(context);
    const ownsTopic = await userOwnsLearningTopic(supabase, userId, topicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const chunkId = body.chunk_id;
    if (typeof chunkId !== 'string') {
      return NextResponse.json({ error: 'chunk_id is required' }, { status: 400 });
    }

    if (body.status !== undefined && !isChunkStatus(body.status)) {
      return NextResponse.json({ error: 'Invalid chunk status' }, { status: 400 });
    }

    if (body.payload !== undefined && !isRecord(body.payload)) {
      return NextResponse.json({ error: 'payload must be an object' }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (typeof body.title === 'string') patch.title = body.title.trim();
    if (typeof body.why_important === 'string' || body.why_important === null) {
      patch.why_important = body.why_important;
    }
    if (body.status !== undefined) patch.status = body.status;
    if (body.payload !== undefined) patch.payload = body.payload;
    if (
      typeof body.chunk_order === 'number' &&
      Number.isInteger(body.chunk_order) &&
      body.chunk_order > 0
    ) {
      patch.chunk_order = body.chunk_order;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('learning_chunks')
      .update(patch)
      .eq('id', chunkId)
      .eq('learning_topic_id', topicId)
      .select()
      .single();

    if (error) {
      console.error('Learning chunks PATCH error:', error);
      return NextResponse.json({ error: 'Failed to update learning chunk' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Learning chunks PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

