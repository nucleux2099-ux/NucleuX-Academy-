import type { SupabaseClient } from '@supabase/supabase-js';

export type SourceBookStatusProjection = {
  source_book_id: string;
  source_id: string | null;
  title: string;
  domain: string | null;
  level_tags: string[];
  lifecycle_state: string;
  qc_passed: boolean;
  indexed_ready: boolean;
  rollout_state: string;
  selectable: boolean;
  availability_reason: string | null;
  pipeline_version: string | null;
  ocr_model_version: string | null;
  prompt_version: string | null;
  chunk_count: number | null;
  ingest_duration_ms: number | null;
  embed_cost_usd: number | null;
  index_cost_usd: number | null;
  active_index_version: string | null;
  candidate_index_version: string | null;
  validated_at: string | null;
  revalidate_after: string | null;
  updated_at: string;
};

export type QcImportPayload = {
  sourceId?: string;
  title?: string;
  domain?: string;
  levelTags?: string[];
  lifecycleState?: string;
  status?: 'passed' | 'failed' | 'pending';
  summary?: string;
  details?: Record<string, unknown>;
  validatedAt?: string;
  revalidateAfter?: string;
  pipelineVersion?: string;
  ocrModelVersion?: string;
  promptVersion?: string;
  approvedBy?: string;
  approvedAt?: string;
  overrideReason?: string;
  chapters?: Array<{
    chapterKey?: string;
    chapterTitle?: string;
    status?: 'pending' | 'passed' | 'failed' | 'warning';
    score?: number;
    findings?: Record<string, unknown>;
    validatedAt?: string;
    revalidateAfter?: string;
  }>;
};

export function computeSelectable(input: { indexedReady: boolean; qcPassed: boolean; rolloutState: string }): boolean {
  return input.indexedReady && input.qcPassed && input.rolloutState === 'active';
}

function inferAvailabilityReason(input: {
  indexedReady: boolean;
  qcPassed: boolean;
  rolloutState: string;
  lifecycleState: string;
}): string | null {
  if (computeSelectable(input)) return null;
  if (!input.qcPassed) return 'QC has not passed';
  if (!input.indexedReady) return 'Ingestion/index is not ready';
  if (input.rolloutState !== 'active') return `Rollout state is ${input.rolloutState}`;
  return `Lifecycle state is ${input.lifecycleState}`;
}

export function isMissingRelationError(error: unknown, relationHint?: string): boolean {
  const maybeError = error as { code?: string; message?: string } | null;
  const message = String(maybeError?.message ?? '').toLowerCase();
  const relation = (relationHint ?? '').toLowerCase();
  return (
    maybeError?.code === '42P01' ||
    message.includes('does not exist') ||
    message.includes('relation') ||
    (relation.length > 0 && message.includes(relation))
  );
}

export async function fetchSourceStatusProjection(
  supabase: SupabaseClient,
  filters: { domain?: string | null; level?: string | null } = {}
): Promise<SourceBookStatusProjection[] | null> {
  let query = supabase
    .from('source_book_status')
    .select(
      'source_book_id,source_id,title,domain,level_tags,lifecycle_state,qc_passed,indexed_ready,rollout_state,selectable,availability_reason,pipeline_version,ocr_model_version,prompt_version,chunk_count,ingest_duration_ms,embed_cost_usd,index_cost_usd,active_index_version,candidate_index_version,validated_at,revalidate_after,updated_at'
    )
    .order('title', { ascending: true });

  if (filters.domain && filters.domain !== 'all') {
    query = query.eq('domain', filters.domain);
  }

  if (filters.level && filters.level !== 'all') {
    query = query.contains('level_tags', [filters.level]);
  }

  const result = await query;

  if (result.error) {
    if (isMissingRelationError(result.error, 'source_book_status')) {
      return null;
    }
    throw result.error;
  }

  return (result.data ?? []) as SourceBookStatusProjection[];
}

export async function refreshSourceStatusProjection(
  supabase: SupabaseClient,
  sourceBookId: string
): Promise<void> {
  const { data: book, error: bookError } = await supabase
    .from('source_books')
    .select(
      'id,source_id,title,domain,level_tags,lifecycle_state,pipeline_version,ocr_model_version,prompt_version,approved_by,approved_at,override_reason,validated_at,revalidate_after,active_index_version,candidate_index_version,rollout_state'
    )
    .eq('id', sourceBookId)
    .single();

  if (bookError || !book) throw bookError ?? new Error('Book not found');

  const { data: latestQc } = await supabase
    .from('source_book_qc_runs')
    .select('id,status')
    .eq('source_book_id', sourceBookId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestIngestion } = await supabase
    .from('source_ingestion_runs')
    .select('id,status,chunk_count,ingest_duration_ms,embed_cost_usd,index_cost_usd,active_index_version,candidate_index_version,rollout_state')
    .eq('source_book_id', sourceBookId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const qcPassed = latestQc?.status === 'passed' || book.lifecycle_state === 'qc_passed' || book.lifecycle_state === 'indexed_ready';
  const indexedReady = latestIngestion?.status === 'indexed_ready' || book.lifecycle_state === 'indexed_ready';
  const rolloutState = (latestIngestion?.rollout_state ?? book.rollout_state ?? 'inactive') as string;

  const availabilityReason = inferAvailabilityReason({
    indexedReady,
    qcPassed,
    rolloutState,
    lifecycleState: book.lifecycle_state as string,
  });

  const payload = {
    source_book_id: sourceBookId,
    source_id: book.source_id,
    title: book.title,
    domain: book.domain,
    level_tags: book.level_tags ?? [],
    lifecycle_state: book.lifecycle_state,
    qc_passed: qcPassed,
    indexed_ready: indexedReady,
    rollout_state: rolloutState,
    availability_reason: availabilityReason,
    last_qc_run_id: latestQc?.id ?? null,
    last_ingestion_run_id: latestIngestion?.id ?? null,
    pipeline_version: book.pipeline_version,
    ocr_model_version: book.ocr_model_version,
    prompt_version: book.prompt_version,
    approved_by: book.approved_by,
    approved_at: book.approved_at,
    override_reason: book.override_reason,
    validated_at: book.validated_at,
    revalidate_after: book.revalidate_after,
    chunk_count: latestIngestion?.chunk_count ?? null,
    ingest_duration_ms: latestIngestion?.ingest_duration_ms ?? null,
    embed_cost_usd: latestIngestion?.embed_cost_usd ?? null,
    index_cost_usd: latestIngestion?.index_cost_usd ?? null,
    active_index_version: latestIngestion?.active_index_version ?? book.active_index_version,
    candidate_index_version: latestIngestion?.candidate_index_version ?? book.candidate_index_version,
  };

  const { error } = await supabase.from('source_book_status').upsert(payload, { onConflict: 'source_book_id' });
  if (error) throw error;
}

export async function importSourceQcRun(
  supabase: SupabaseClient,
  userId: string,
  payload: QcImportPayload
): Promise<{ sourceBookId: string; qcRunId: string; chapterCount: number }> {
  const sourceId = payload.sourceId?.trim() || null;
  const title = payload.title?.trim() || sourceId || 'Untitled source';

  let sourceBookId: string;
  if (sourceId) {
    const { data: existing } = await supabase.from('source_books').select('id').eq('source_id', sourceId).maybeSingle();
    if (existing?.id) {
      sourceBookId = existing.id;
    } else {
      const { data: created, error: createError } = await supabase
        .from('source_books')
        .insert({
          source_id: sourceId,
          title,
          domain: payload.domain ?? null,
          level_tags: payload.levelTags ?? [],
          lifecycle_state: payload.lifecycleState ?? 'qc_pending',
          pipeline_version: payload.pipelineVersion ?? null,
          ocr_model_version: payload.ocrModelVersion ?? null,
          prompt_version: payload.promptVersion ?? null,
          approved_by: payload.approvedBy ?? null,
          approved_at: payload.approvedAt ?? null,
          override_reason: payload.overrideReason ?? null,
          validated_at: payload.validatedAt ?? null,
          revalidate_after: payload.revalidateAfter ?? null,
          rollout_state: 'inactive',
        })
        .select('id')
        .single();

      if (createError || !created) throw createError ?? new Error('Unable to create source book');
      sourceBookId = created.id;
    }
  } else {
    const { data: created, error: createError } = await supabase
      .from('source_books')
      .insert({
        title,
        domain: payload.domain ?? null,
        level_tags: payload.levelTags ?? [],
        lifecycle_state: payload.lifecycleState ?? 'qc_pending',
      })
      .select('id')
      .single();

    if (createError || !created) throw createError ?? new Error('Unable to create source book');
    sourceBookId = created.id;
  }

  const { data: qcRun, error: qcError } = await supabase
    .from('source_book_qc_runs')
    .insert({
      source_book_id: sourceBookId,
      status: payload.status ?? 'pending',
      summary: payload.summary ?? null,
      details: payload.details ?? {},
      pipeline_version: payload.pipelineVersion ?? null,
      ocr_model_version: payload.ocrModelVersion ?? null,
      prompt_version: payload.promptVersion ?? null,
      approved_by: payload.approvedBy ?? null,
      approved_at: payload.approvedAt ?? null,
      override_reason: payload.overrideReason ?? null,
      validated_at: payload.validatedAt ?? null,
      revalidate_after: payload.revalidateAfter ?? null,
      created_by: userId,
    })
    .select('id')
    .single();

  if (qcError || !qcRun) throw qcError ?? new Error('Unable to create QC run');

  const chapters = payload.chapters ?? [];
  if (chapters.length > 0) {
    const chapterRows = chapters.map((chapter) => ({
      source_book_id: sourceBookId,
      qc_run_id: qcRun.id,
      chapter_key: chapter.chapterKey ?? null,
      chapter_title: chapter.chapterTitle ?? null,
      status: chapter.status ?? 'pending',
      score: chapter.score ?? null,
      findings: chapter.findings ?? {},
      validated_at: chapter.validatedAt ?? null,
      revalidate_after: chapter.revalidateAfter ?? null,
    }));

    const { error: chapterError } = await supabase.from('source_chapter_qc').insert(chapterRows);
    if (chapterError) throw chapterError;
  }

  await supabase
    .from('source_books')
    .update({
      lifecycle_state: payload.status === 'passed' ? 'qc_passed' : payload.status === 'failed' ? 'qc_failed' : 'qc_pending',
      pipeline_version: payload.pipelineVersion ?? null,
      ocr_model_version: payload.ocrModelVersion ?? null,
      prompt_version: payload.promptVersion ?? null,
      approved_by: payload.approvedBy ?? null,
      approved_at: payload.approvedAt ?? null,
      override_reason: payload.overrideReason ?? null,
      validated_at: payload.validatedAt ?? null,
      revalidate_after: payload.revalidateAfter ?? null,
    })
    .eq('id', sourceBookId);

  await refreshSourceStatusProjection(supabase, sourceBookId);

  return {
    sourceBookId,
    qcRunId: qcRun.id,
    chapterCount: chapters.length,
  };
}

export async function writeSourceIngestionRun(
  supabase: SupabaseClient,
  payload: {
    sourceBookId: string;
    userId?: string;
    status: 'queued' | 'running' | 'indexed_ready' | 'failed' | 'rolled_back';
    notes?: string;
    pipelineVersion?: string;
    ocrModelVersion?: string;
    promptVersion?: string;
    chunkCount?: number;
    ingestDurationMs?: number;
    embedCostUsd?: number;
    indexCostUsd?: number;
    activeIndexVersion?: string;
    candidateIndexVersion?: string;
    rolloutState?: 'inactive' | 'canary' | 'active' | 'rolled_back';
  }
): Promise<string> {
  const { data, error } = await supabase
    .from('source_ingestion_runs')
    .insert({
      source_book_id: payload.sourceBookId,
      status: payload.status,
      notes: payload.notes ?? null,
      pipeline_version: payload.pipelineVersion ?? null,
      ocr_model_version: payload.ocrModelVersion ?? null,
      prompt_version: payload.promptVersion ?? null,
      chunk_count: payload.chunkCount ?? null,
      ingest_duration_ms: payload.ingestDurationMs ?? null,
      embed_cost_usd: payload.embedCostUsd ?? null,
      index_cost_usd: payload.indexCostUsd ?? null,
      active_index_version: payload.activeIndexVersion ?? null,
      candidate_index_version: payload.candidateIndexVersion ?? null,
      rollout_state: payload.rolloutState ?? null,
      created_by: payload.userId ?? null,
      started_at: payload.status === 'running' ? new Date().toISOString() : null,
      completed_at: payload.status === 'indexed_ready' || payload.status === 'failed' || payload.status === 'rolled_back' ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error || !data) throw error ?? new Error('Unable to write ingestion run');

  await refreshSourceStatusProjection(supabase, payload.sourceBookId);

  return data.id;
}

export async function getSourceStatusSummary(supabase: SupabaseClient): Promise<{
  total: number;
  selectable: number;
  byLifecycle: Record<string, number>;
  byRollout: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from('source_book_status')
    .select('lifecycle_state,rollout_state,selectable');

  if (error) {
    if (isMissingRelationError(error, 'source_book_status')) {
      return { total: 0, selectable: 0, byLifecycle: {}, byRollout: {} };
    }
    throw error;
  }

  const rows = (data ?? []) as Array<{ lifecycle_state: string; rollout_state: string; selectable: boolean }>;
  const byLifecycle: Record<string, number> = {};
  const byRollout: Record<string, number> = {};
  let selectable = 0;

  for (const row of rows) {
    byLifecycle[row.lifecycle_state] = (byLifecycle[row.lifecycle_state] ?? 0) + 1;
    byRollout[row.rollout_state] = (byRollout[row.rollout_state] ?? 0) + 1;
    if (row.selectable) selectable += 1;
  }

  return {
    total: rows.length,
    selectable,
    byLifecycle,
    byRollout,
  };
}
