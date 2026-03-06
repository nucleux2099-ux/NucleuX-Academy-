import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, userOwnsLearningTopic } from '@/lib/learning/api';
import {
  isLearningStage,
  isRecord,
  isStageRunStatus,
  parseLimit,
} from '@/lib/learning/contracts';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const learningTopicId = searchParams.get('learning_topic_id');
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');
    const limit = parseLimit(searchParams.get('limit'));

    if (stage && !isLearningStage(stage)) {
      return NextResponse.json({ error: 'Invalid stage filter' }, { status: 400 });
    }

    if (status && !isStageRunStatus(status)) {
      return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
    }

    if (learningTopicId) {
      const ownsTopic = await userOwnsLearningTopic(supabase, userId, learningTopicId);
      if (!ownsTopic) {
        return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
      }
    }

    let topicIds: string[] = [];
    if (learningTopicId) {
      topicIds = [learningTopicId];
    } else {
      const { data: topics, error: topicError } = await supabase
        .from('learning_topics')
        .select('id')
        .eq('user_id', userId)
        .limit(500);

      if (topicError) {
        console.error('Learning stage-runs topic lookup error:', topicError);
        return NextResponse.json({ error: 'Failed to fetch stage runs' }, { status: 500 });
      }

      topicIds = (topics || []).map((t) => t.id);
      if (topicIds.length === 0) return NextResponse.json({ stage_runs: [] });
    }

    let query = supabase
      .from('learning_stage_runs')
      .select('*')
      .in('learning_topic_id', topicIds)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (stage) query = query.eq('stage', stage);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('Learning stage-runs GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch stage runs' }, { status: 500 });
    }

    return NextResponse.json({ stage_runs: data || [] });
  } catch (error) {
    console.error('Learning stage-runs GET error:', error);
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

    if (typeof learningTopicId !== 'string' || !isLearningStage(stage)) {
      return NextResponse.json(
        { error: 'learning_topic_id and valid stage are required' },
        { status: 400 }
      );
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, learningTopicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    const status = body.status;
    if (status !== undefined && !isStageRunStatus(status)) {
      return NextResponse.json({ error: 'Invalid stage run status' }, { status: 400 });
    }

    const summary = body.summary;
    if (summary !== undefined && !isRecord(summary)) {
      return NextResponse.json({ error: 'summary must be an object' }, { status: 400 });
    }

    let runIndex = 1;
    if (typeof body.run_index === 'number' && Number.isInteger(body.run_index) && body.run_index >= 1) {
      runIndex = body.run_index;
    } else {
      const { data: latestRun } = await supabase
        .from('learning_stage_runs')
        .select('run_index')
        .eq('learning_topic_id', learningTopicId)
        .eq('stage', stage)
        .order('run_index', { ascending: false })
        .limit(1)
        .maybeSingle();
      runIndex = (latestRun?.run_index || 0) + 1;
    }

    const { data, error } = await supabase
      .from('learning_stage_runs')
      .insert({
        learning_topic_id: learningTopicId,
        stage,
        run_index: runIndex,
        status: status ?? 'in_progress',
        summary: summary ?? {},
      })
      .select()
      .single();

    if (error) {
      console.error('Learning stage-runs POST error:', error);
      return NextResponse.json({ error: 'Failed to create stage run' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Learning stage-runs POST error:', error);
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
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const { data: existingRun, error: existingRunError } = await supabase
      .from('learning_stage_runs')
      .select('id, learning_topic_id')
      .eq('id', id)
      .single();

    if (existingRunError || !existingRun) {
      return NextResponse.json({ error: 'Stage run not found' }, { status: 404 });
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, existingRun.learning_topic_id);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Stage run not found' }, { status: 404 });
    }

    if (body.status !== undefined && !isStageRunStatus(body.status)) {
      return NextResponse.json({ error: 'Invalid stage run status' }, { status: 400 });
    }

    if (body.summary !== undefined && !isRecord(body.summary)) {
      return NextResponse.json({ error: 'summary must be an object' }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (body.status !== undefined) patch.status = body.status;
    if (body.summary !== undefined) patch.summary = body.summary;
    if (typeof body.finished_at === 'string' || body.finished_at === null) {
      patch.finished_at = body.finished_at;
    }

    if (body.status === 'completed' && patch.finished_at === undefined) {
      patch.finished_at = new Date().toISOString();
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('learning_stage_runs')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Learning stage-runs PATCH error:', error);
      return NextResponse.json({ error: 'Failed to update stage run' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Learning stage-runs PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

