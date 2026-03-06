import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, userOwnsLearningTopic } from '@/lib/learning/api';
import {
  isArtifactSource,
  isArtifactType,
  isRecord,
  parseLimit,
} from '@/lib/learning/contracts';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const learningTopicId = searchParams.get('learning_topic_id');
    const chunkId = searchParams.get('chunk_id');
    const stageRunId = searchParams.get('stage_run_id');
    const artifactType = searchParams.get('artifact_type');
    const currentOnly = searchParams.get('current_only') === 'true';
    const limit = parseLimit(searchParams.get('limit'));

    if (!learningTopicId) {
      return NextResponse.json({ error: 'learning_topic_id is required' }, { status: 400 });
    }

    if (artifactType && !isArtifactType(artifactType)) {
      return NextResponse.json({ error: 'Invalid artifact_type filter' }, { status: 400 });
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, learningTopicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    let query = supabase
      .from('learning_artifacts')
      .select('*')
      .eq('learning_topic_id', learningTopicId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (chunkId) query = query.eq('chunk_id', chunkId);
    if (stageRunId) query = query.eq('stage_run_id', stageRunId);
    if (artifactType) query = query.eq('artifact_type', artifactType);
    if (currentOnly) query = query.eq('is_current', true);

    const { data, error } = await query;

    if (error) {
      console.error('Learning artifacts GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch artifacts' }, { status: 500 });
    }

    return NextResponse.json({ artifacts: data || [] });
  } catch (error) {
    console.error('Learning artifacts GET error:', error);
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
    const artifactType = body.artifact_type;

    if (typeof learningTopicId !== 'string' || !isArtifactType(artifactType)) {
      return NextResponse.json(
        { error: 'learning_topic_id and valid artifact_type are required' },
        { status: 400 }
      );
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, learningTopicId);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Learning topic not found' }, { status: 404 });
    }

    const source = body.source;
    if (source !== undefined && !isArtifactSource(source)) {
      return NextResponse.json({ error: 'Invalid source value' }, { status: 400 });
    }

    const content = body.content;
    if (content !== undefined && !isRecord(content)) {
      return NextResponse.json({ error: 'content must be an object' }, { status: 400 });
    }

    const version =
      typeof body.version === 'number' && Number.isInteger(body.version) && body.version >= 1
        ? body.version
        : 1;

    const { data, error } = await supabase
      .from('learning_artifacts')
      .insert({
        learning_topic_id: learningTopicId,
        chunk_id: typeof body.chunk_id === 'string' ? body.chunk_id : null,
        stage_run_id: typeof body.stage_run_id === 'string' ? body.stage_run_id : null,
        artifact_type: artifactType,
        source: source ?? 'user',
        version,
        is_current: typeof body.is_current === 'boolean' ? body.is_current : true,
        content: content ?? {},
      })
      .select()
      .single();

    if (error) {
      console.error('Learning artifacts POST error:', error);
      return NextResponse.json({ error: 'Failed to create artifact' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Learning artifacts POST error:', error);
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

    const { data: existingArtifact, error: existingError } = await supabase
      .from('learning_artifacts')
      .select('id, learning_topic_id')
      .eq('id', id)
      .single();

    if (existingError || !existingArtifact) {
      return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
    }

    const ownsTopic = await userOwnsLearningTopic(supabase, userId, existingArtifact.learning_topic_id);
    if (!ownsTopic) {
      return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
    }

    if (body.source !== undefined && !isArtifactSource(body.source)) {
      return NextResponse.json({ error: 'Invalid source value' }, { status: 400 });
    }
    if (body.artifact_type !== undefined && !isArtifactType(body.artifact_type)) {
      return NextResponse.json({ error: 'Invalid artifact_type value' }, { status: 400 });
    }
    if (body.content !== undefined && !isRecord(body.content)) {
      return NextResponse.json({ error: 'content must be an object' }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (body.content !== undefined) patch.content = body.content;
    if (body.source !== undefined) patch.source = body.source;
    if (body.artifact_type !== undefined) patch.artifact_type = body.artifact_type;
    if (typeof body.is_current === 'boolean') patch.is_current = body.is_current;
    if (
      typeof body.version === 'number' &&
      Number.isInteger(body.version) &&
      body.version >= 1
    ) {
      patch.version = body.version;
    }
    if (typeof body.chunk_id === 'string' || body.chunk_id === null) {
      patch.chunk_id = body.chunk_id;
    }
    if (typeof body.stage_run_id === 'string' || body.stage_run_id === null) {
      patch.stage_run_id = body.stage_run_id;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('learning_artifacts')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Learning artifacts PATCH error:', error);
      return NextResponse.json({ error: 'Failed to update artifact' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Learning artifacts PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

