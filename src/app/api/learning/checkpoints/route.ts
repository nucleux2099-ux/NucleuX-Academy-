import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, userOwnsLearningTopic } from '@/lib/learning/api';
import { isLearningStage, isRecord, parseLimit } from '@/lib/learning/contracts';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const learningTopicId = searchParams.get('learning_topic_id');
    const stage = searchParams.get('stage');
    const checkpointCode = searchParams.get('checkpoint_code');
    const limit = parseLimit(searchParams.get('limit'));

    if (!learningTopicId) {
      return NextResponse.json({ error: 'learning_topic_id is required' }, { status: 400 });
    }

    if (stage && !isLearningStage(stage)) {
      return NextResponse.json({ error: 'Invalid stage filter' }, { status: 400 });
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, learningTopicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    let query = supabase
      .from('learning_checkpoints')
      .select('*')
      .eq('learning_topic_id', learningTopicId)
      .order('evaluated_at', { ascending: false })
      .limit(limit);

    if (stage) query = query.eq('stage', stage);
    if (checkpointCode) query = query.eq('checkpoint_code', checkpointCode);

    const { data, error } = await query;

    if (error) {
      console.error('Learning checkpoints GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch checkpoints' }, { status: 500 });
    }

    return NextResponse.json({ checkpoints: data || [] });
  } catch (error) {
    console.error('Learning checkpoints GET error:', error);
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

    const learningTopicId = body.learning_topic_id;
    const stage = body.stage;
    const checkpointCode = body.checkpoint_code;

    if (
      typeof learningTopicId !== 'string' ||
      !isLearningStage(stage) ||
      typeof checkpointCode !== 'string'
    ) {
      return NextResponse.json(
        { error: 'learning_topic_id, stage, and checkpoint_code are required' },
        { status: 400 }
      );
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, learningTopicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    if (body.details !== undefined && !isRecord(body.details)) {
      return NextResponse.json({ error: 'details must be an object' }, { status: 400 });
    }

    if (typeof body.passed !== 'boolean') {
      return NextResponse.json({ error: 'passed must be a boolean' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      learning_topic_id: learningTopicId,
      stage_run_id: typeof body.stage_run_id === 'string' ? body.stage_run_id : null,
      stage,
      checkpoint_code: checkpointCode.trim(),
      passed: body.passed,
      details: body.details ?? {},
    };

    if (typeof body.score === 'number') {
      payload.score = body.score;
    }
    if (typeof body.evaluated_at === 'string') {
      payload.evaluated_at = body.evaluated_at;
    }

    const { data, error } = await supabase
      .from('learning_checkpoints')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Learning checkpoints POST error:', error);
      return NextResponse.json({ error: 'Failed to create checkpoint' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Learning checkpoints POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

