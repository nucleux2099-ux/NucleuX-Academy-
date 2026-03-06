import type { ArtifactType, LearningStage, LearningTopicStatus } from '@/lib/learning/contracts';
import type { Aim } from '@/lib/aim/types';
import type { MindMap } from '@/lib/mindmap/types';
import type { PreStudy } from '@/lib/prestudy/types';
import type { Shoot } from '@/lib/shoot/types';
import type { Skin } from '@/lib/skin/types';
import { scoreShootRubric, scoreSkinRubric } from '@/lib/learning/rubrics';

type JsonRecord = Record<string, unknown>;

type TopicParts = {
  subject: string;
  subspecialty: string;
  topicSlug: string;
  topicTitle: string;
};

type TopicRow = {
  id: string;
  stage: LearningStage;
  status: LearningTopicStatus;
  subject: string;
  subspecialty: string;
  topic_slug: string;
};

type TopicListResponse = {
  topics?: TopicRow[];
};

type StageRunStatus = 'in_progress' | 'completed' | 'failed' | 'abandoned';

type StageRunRow = {
  id: string;
  learning_topic_id: string;
  stage: LearningStage;
  status: StageRunStatus;
  finished_at: string | null;
};

type StageRunsResponse = {
  stage_runs?: StageRunRow[];
};

type ChunkRow = {
  id: string;
  chunk_key: string;
  chunk_order: number;
  title: string;
  why_important: string | null;
};

type ChunksResponse = {
  chunks?: ChunkRow[];
};

type TopicState = {
  id: string;
  stage: LearningStage;
  status: LearningTopicStatus;
};

type ChunkSeed = {
  localId: string;
  order: number;
  title: string;
  whyImportant?: string;
};

const TOPIC_STAGE_RANK: Record<LearningStage, number> = {
  prestudy: 1,
  aim: 2,
  shoot: 3,
  skin: 4,
};

const topicStateCache = new Map<string, TopicState>();
const chunkIdCache = new Map<string, Record<string, string>>();
const artifactSignatureCache = new Map<string, string>();
const stageRunCache = new Map<string, StageRunRow>();
const checkpointCache = new Set<string>();
const syncTimers = new Map<string, ReturnType<typeof setTimeout>>();

function isBrowser() {
  return typeof window !== 'undefined' && typeof fetch !== 'undefined';
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseTopicId(topicId: string): TopicParts {
  const raw = topicId.trim().replace(/^\/+|\/+$/g, '');
  const parts = raw.split('/').filter(Boolean);

  const subject = normalizeSlug(parts[0] || 'general');
  const subspecialty = normalizeSlug(parts[1] || 'general');
  const topicSlug = normalizeSlug(parts[2] || raw || 'topic');

  return {
    subject,
    subspecialty,
    topicSlug,
    topicTitle: titleFromSlug(topicSlug) || 'Topic',
  };
}

function makeChunkKey(order: number, title: string) {
  const titleSlug = normalizeSlug(title);
  return titleSlug ? `${order}-${titleSlug}` : `chunk-${order}`;
}

function cacheKeyForArtifact(
  learningTopicId: string,
  artifactType: ArtifactType,
  chunkId: string | null
) {
  return `${learningTopicId}:${artifactType}:${chunkId ?? 'topic'}`;
}

function cacheKeyForStageRun(learningTopicId: string, stage: LearningStage) {
  return `${learningTopicId}:${stage}`;
}

function cacheKeyForCheckpoint(
  learningTopicId: string,
  stage: LearningStage,
  checkpointCode: string,
  dedupeToken: string | null = null
) {
  return `${learningTopicId}:${stage}:${checkpointCode}:${dedupeToken ?? 'default'}`;
}

function snapshot<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (!isBrowser()) return null;

  try {
    const headers = new Headers(init?.headers);
    if (init?.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function patchTopicState(
  topicId: string,
  id: string,
  stage: LearningStage | null,
  status: LearningTopicStatus | null,
  completedAt?: string
) {
  if (!stage && !status && !completedAt) return;

  const body: JsonRecord = { id };
  if (stage) body.stage = stage;
  if (status) body.status = status;
  if (completedAt) body.completed_at = completedAt;

  const row = await fetchJson<TopicRow>('/api/learning/topics', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  if (row?.id) {
    topicStateCache.set(topicId, {
      id: row.id,
      stage: row.stage,
      status: row.status,
    });
  }
}

async function ensureLearningTopic(
  topicId: string,
  stage: LearningStage,
  status: LearningTopicStatus,
  completedAt?: string
) {
  const cached = topicStateCache.get(topicId);
  if (cached) {
    if (cached.status !== 'completed') {
      const nextStage =
        TOPIC_STAGE_RANK[stage] > TOPIC_STAGE_RANK[cached.stage] ? stage : null;
      const nextStatus = status === 'completed' ? 'completed' : null;
      await patchTopicState(topicId, cached.id, nextStage, nextStatus, completedAt);
    }
    return cached.id;
  }

  const parts = parseTopicId(topicId);

  const search = new URLSearchParams({
    subject: parts.subject,
    topic_slug: parts.topicSlug,
    limit: '20',
  });
  const list = await fetchJson<TopicListResponse>(`/api/learning/topics?${search.toString()}`);
  const existing = (list?.topics || []).find(
    (topic) =>
      normalizeSlug(topic.subspecialty || '') === parts.subspecialty &&
      normalizeSlug(topic.subject || '') === parts.subject &&
      normalizeSlug(topic.topic_slug || '') === parts.topicSlug
  );

  if (existing) {
    topicStateCache.set(topicId, {
      id: existing.id,
      stage: existing.stage,
      status: existing.status,
    });

    if (existing.status !== 'completed') {
      const nextStage =
        TOPIC_STAGE_RANK[stage] > TOPIC_STAGE_RANK[existing.stage] ? stage : null;
      const nextStatus = status === 'completed' ? 'completed' : null;
      await patchTopicState(topicId, existing.id, nextStage, nextStatus, completedAt);
    }

    return existing.id;
  }

  const created = await fetchJson<TopicRow>('/api/learning/topics', {
    method: 'POST',
    body: JSON.stringify({
      subject: parts.subject,
      subspecialty: parts.subspecialty,
      topic_slug: parts.topicSlug,
      topic_title: parts.topicTitle,
      stage,
      status,
      ...(completedAt ? { completed_at: completedAt } : {}),
    }),
  });

  if (!created?.id) return null;

  topicStateCache.set(topicId, {
    id: created.id,
    stage: created.stage,
    status: created.status,
  });

  return created.id;
}

async function ensureChunks(
  topicId: string,
  learningTopicId: string,
  seeds: ChunkSeed[]
) {
  if (!seeds.length) return {};

  const cached = chunkIdCache.get(topicId) || {};
  const uncachedSeeds = seeds.filter((seed) => !cached[seed.localId]);
  if (uncachedSeeds.length === 0) return cached;

  const remote = await fetchJson<ChunksResponse>(
    `/api/learning/topics/${learningTopicId}/chunks?limit=200`
  );
  const remoteChunks = remote?.chunks || [];
  const remoteByKey = new Map(remoteChunks.map((chunk) => [chunk.chunk_key, chunk]));

  const next = { ...cached };
  for (const seed of seeds) {
    const chunkKey = makeChunkKey(seed.order, seed.title);
    const existing = remoteByKey.get(chunkKey);
    if (existing) {
      next[seed.localId] = existing.id;

      if (
        existing.title !== seed.title ||
        existing.chunk_order !== seed.order ||
        (seed.whyImportant !== undefined && existing.why_important !== seed.whyImportant)
      ) {
        await fetchJson<ChunkRow>(`/api/learning/topics/${learningTopicId}/chunks`, {
          method: 'PATCH',
          body: JSON.stringify({
            chunk_id: existing.id,
            title: seed.title,
            chunk_order: seed.order,
            ...(seed.whyImportant !== undefined ? { why_important: seed.whyImportant } : {}),
          }),
        });
      }
      continue;
    }

    const created = await fetchJson<ChunkRow>(`/api/learning/topics/${learningTopicId}/chunks`, {
      method: 'POST',
      body: JSON.stringify({
        chunk_key: chunkKey,
        chunk_order: seed.order,
        title: seed.title,
        ...(seed.whyImportant !== undefined ? { why_important: seed.whyImportant } : {}),
      }),
    });

    if (created?.id) {
      next[seed.localId] = created.id;
      remoteByKey.set(chunkKey, created);
    }
  }

  chunkIdCache.set(topicId, next);
  return next;
}

async function ensureStageRun(
  learningTopicId: string,
  stage: LearningStage
): Promise<StageRunRow | null> {
  const stageRunKey = cacheKeyForStageRun(learningTopicId, stage);
  const cached = stageRunCache.get(stageRunKey);
  if (cached) return cached;

  const search = new URLSearchParams({
    learning_topic_id: learningTopicId,
    stage,
    limit: '20',
  });
  const runs = await fetchJson<StageRunsResponse>(`/api/learning/stage-runs?${search.toString()}`);
  const remoteRuns = runs?.stage_runs || [];
  const openRun = remoteRuns.find((run) => run.status === 'in_progress');
  if (openRun) {
    stageRunCache.set(stageRunKey, openRun);
    return openRun;
  }

  const created = await fetchJson<StageRunRow>('/api/learning/stage-runs', {
    method: 'POST',
    body: JSON.stringify({
      learning_topic_id: learningTopicId,
      stage,
      status: 'in_progress',
    }),
  });

  if (!created?.id) return null;
  stageRunCache.set(stageRunKey, created);
  return created;
}

async function completeStageRun(
  learningTopicId: string,
  stage: LearningStage,
  finishedAt?: string
): Promise<StageRunRow | null> {
  const stageRun = await ensureStageRun(learningTopicId, stage);
  if (!stageRun?.id) return null;
  if (stageRun.status === 'completed') return stageRun;

  const patched = await fetchJson<StageRunRow>('/api/learning/stage-runs', {
    method: 'PATCH',
    body: JSON.stringify({
      id: stageRun.id,
      status: 'completed',
      finished_at: finishedAt || new Date().toISOString(),
    }),
  });

  if (!patched?.id) return stageRun;

  const stageRunKey = cacheKeyForStageRun(learningTopicId, stage);
  stageRunCache.set(stageRunKey, patched);
  return patched;
}

async function postCheckpoint(
  learningTopicId: string,
  stage: LearningStage,
  checkpointCode: string,
  passed: boolean,
  details: JsonRecord,
  stageRunId: string | null = null,
  score: number | null = null,
  dedupeToken: string | null = null
) {
  const key = cacheKeyForCheckpoint(learningTopicId, stage, checkpointCode, dedupeToken);
  if (checkpointCache.has(key)) return;

  const payload: JsonRecord = {
    learning_topic_id: learningTopicId,
    stage_run_id: stageRunId,
    stage,
    checkpoint_code: checkpointCode,
    passed,
    details,
  };
  if (typeof score === 'number') {
    payload.score = score;
  }

  const created = await fetchJson<{ id: string }>('/api/learning/checkpoints', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (created?.id) {
    checkpointCache.add(key);
  }
}

async function postArtifact(
  learningTopicId: string,
  artifactType: ArtifactType,
  content: JsonRecord,
  chunkId: string | null = null,
  stageRunId: string | null = null
) {
  const signature = JSON.stringify(content);
  const signatureKey = cacheKeyForArtifact(learningTopicId, artifactType, chunkId);
  if (artifactSignatureCache.get(signatureKey) === signature) return;

  const created = await fetchJson<{ id: string }>('/api/learning/artifacts', {
    method: 'POST',
    body: JSON.stringify({
      learning_topic_id: learningTopicId,
      chunk_id: chunkId,
      stage_run_id: stageRunId,
      artifact_type: artifactType,
      source: 'user',
      content,
      is_current: true,
    }),
  });

  if (created?.id) {
    artifactSignatureCache.set(signatureKey, signature);
  }
}

async function syncPreStudy(preStudy: PreStudy) {
  const learningTopicId = await ensureLearningTopic(preStudy.topicId, 'prestudy', 'active');
  if (!learningTopicId) return;
  const stageRun = await ensureStageRun(learningTopicId, 'prestudy');
  const stageRunId = stageRun?.id ?? null;

  const seeds = preStudy.chunks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((chunk) => ({
      localId: chunk.id,
      order: chunk.order,
      title: chunk.title,
    }));
  const chunkMap = await ensureChunks(preStudy.topicId, learningTopicId, seeds);

  const assignments = preStudy.assignments.map((assignment) => ({
    ...assignment,
    remoteChunkId: chunkMap[assignment.chunkId] || null,
  }));

  await Promise.all([
    postArtifact(learningTopicId, 'prestudy_keyword', {
      skimNotes: preStudy.skimNotes || '',
      keywords: preStudy.keywords,
      updatedAt: preStudy.updatedAt,
    }, null, stageRunId),
    postArtifact(learningTopicId, 'prestudy_assignment', {
      chunks: preStudy.chunks.map((chunk) => ({
        ...chunk,
        remoteChunkId: chunkMap[chunk.id] || null,
      })),
      assignments,
      aimQuestions: preStudy.aimQuestions,
      updatedAt: preStudy.updatedAt,
    }, null, stageRunId),
  ]);

  if (preStudy.completedAt) {
    const completedRun = await completeStageRun(learningTopicId, 'prestudy', preStudy.completedAt);
    await postCheckpoint(
      learningTopicId,
      'prestudy',
      'prestudy_completion_auto',
      true,
      {
        completedAt: preStudy.completedAt,
        keywordCount: preStudy.keywords.length,
        chunkCount: preStudy.chunks.length,
      },
      completedRun?.id ?? stageRunId
    );
  }
}

async function syncAim(aim: Aim) {
  const learningTopicId = await ensureLearningTopic(aim.topicId, 'aim', 'active');
  if (!learningTopicId) return;
  const stageRun = await ensureStageRun(learningTopicId, 'aim');
  const stageRunId = stageRun?.id ?? null;

  const seeds = aim.chunkPlans.map((plan, index) => ({
    localId: plan.chunkId,
    order: index + 1,
    title: `Chunk ${index + 1}`,
    whyImportant: plan.whyImportant,
  }));
  const chunkMap = await ensureChunks(aim.topicId, learningTopicId, seeds);

  await Promise.all(
    aim.chunkPlans.flatMap((plan) => {
      const remoteChunkId = chunkMap[plan.chunkId] || null;
      const tasks: Promise<void>[] = [
        postArtifact(
          learningTopicId,
          'aim_rationale',
          {
            chunkId: plan.chunkId,
            whyImportant: plan.whyImportant,
            updatedAt: aim.updatedAt,
          },
          remoteChunkId,
          stageRunId
        ),
      ];

      if (plan.questions.length > 0) {
        tasks.push(
          postArtifact(
            learningTopicId,
            'aim_question',
            {
              chunkId: plan.chunkId,
              questions: plan.questions,
              updatedAt: aim.updatedAt,
            },
            remoteChunkId,
            stageRunId
          )
        );
      }

      return tasks;
    })
  );

  if (aim.completedAt) {
    const completedRun = await completeStageRun(learningTopicId, 'aim', aim.completedAt);
    await postCheckpoint(
      learningTopicId,
      'aim',
      'aim_completion_auto',
      true,
      {
        completedAt: aim.completedAt,
        chunksPlanned: aim.chunkPlans.length,
      },
      completedRun?.id ?? stageRunId
    );
  }
}

async function syncShoot(shoot: Shoot) {
  const learningTopicId = await ensureLearningTopic(shoot.topicId, 'shoot', 'active');
  if (!learningTopicId) return;
  const stageRun = await ensureStageRun(learningTopicId, 'shoot');
  const stageRunId = stageRun?.id ?? null;

  const seeds = shoot.artifacts.map((artifact, index) => ({
    localId: artifact.chunkId,
    order: index + 1,
    title: `Chunk ${index + 1}`,
  }));
  const chunkMap = await ensureChunks(shoot.topicId, learningTopicId, seeds);

  await Promise.all(
    shoot.artifacts.flatMap((artifact) => {
      const remoteChunkId = chunkMap[artifact.chunkId] || null;
      return [
        postArtifact(
          learningTopicId,
          'shoot_layer',
          {
            chunkId: artifact.chunkId,
            layered: artifact.layered,
            teachBackPrompts: artifact.teachBackPrompts,
            updatedAt: shoot.updatedAt,
          },
          remoteChunkId,
          stageRunId
        ),
        postArtifact(
          learningTopicId,
          'shoot_vprefre',
          {
            chunkId: artifact.chunkId,
            vprefre: artifact.vprefre,
            updatedAt: shoot.updatedAt,
          },
          remoteChunkId,
          stageRunId
        ),
        postArtifact(
          learningTopicId,
          'shoot_gap',
          {
            chunkId: artifact.chunkId,
            gapList: artifact.gapList,
            completedAt: artifact.completedAt || null,
            updatedAt: shoot.updatedAt,
          },
          remoteChunkId,
          stageRunId
        ),
      ];
    })
  );

  if (shoot.completedAt) {
    const rubric = scoreShootRubric(shoot);
    const completedRun = await completeStageRun(learningTopicId, 'shoot', shoot.completedAt);
    await postCheckpoint(
      learningTopicId,
      'shoot',
      rubric.rubricCode,
      rubric.passed,
      {
        source: 'client_sync_auto',
        completedAt: shoot.completedAt,
        updatedAt: shoot.updatedAt,
        rubric,
      },
      completedRun?.id ?? stageRunId,
      rubric.score,
      shoot.completedAt
    );
    await postCheckpoint(
      learningTopicId,
      'shoot',
      'shoot_completion_auto',
      rubric.passed,
      {
        completedAt: shoot.completedAt,
        chunkCount: shoot.artifacts.length,
        rubric: {
          code: rubric.rubricCode,
          score: rubric.score,
          threshold: rubric.threshold,
          passed: rubric.passed,
          failedChunkCount: rubric.failedChunkCount,
          summary: rubric.summary,
        },
      },
      completedRun?.id ?? stageRunId,
      rubric.score,
      shoot.completedAt
    );
  }
}

async function syncSkin(skin: Skin) {
  const status: LearningTopicStatus = skin.completedAt ? 'completed' : 'active';
  const learningTopicId = await ensureLearningTopic(
    skin.topicId,
    'skin',
    status,
    skin.completedAt
  );
  if (!learningTopicId) return;
  const stageRun = await ensureStageRun(learningTopicId, 'skin');
  const stageRunId = stageRun?.id ?? null;

  const seeds = skin.chunks.map((chunk, index) => ({
    localId: chunk.chunkId,
    order: index + 1,
    title: `Chunk ${index + 1}`,
  }));
  const chunkMap = await ensureChunks(skin.topicId, learningTopicId, seeds);

  await Promise.all(
    skin.chunks.flatMap((chunk) => {
      const remoteChunkId = chunkMap[chunk.chunkId] || null;
      return [
        postArtifact(
          learningTopicId,
          'skin_grinde',
          {
            chunkId: chunk.chunkId,
            appliedTwoFourRule: chunk.appliedTwoFourRule,
            grinde: chunk.grinde,
            completedAt: chunk.completedAt || null,
            updatedAt: skin.updatedAt,
          },
          remoteChunkId,
          stageRunId
        ),
        postArtifact(
          learningTopicId,
          'skin_gap',
          {
            chunkId: chunk.chunkId,
            teachBackGaps: chunk.teachBackGaps,
            completedAt: chunk.completedAt || null,
            updatedAt: skin.updatedAt,
          },
          remoteChunkId,
          stageRunId
        ),
      ];
    })
  );

  if (skin.completedAt) {
    const rubric = scoreSkinRubric(skin);
    const completedRun = await completeStageRun(learningTopicId, 'skin', skin.completedAt);
    await postCheckpoint(
      learningTopicId,
      'skin',
      rubric.rubricCode,
      rubric.passed,
      {
        source: 'client_sync_auto',
        completedAt: skin.completedAt,
        updatedAt: skin.updatedAt,
        rubric,
      },
      completedRun?.id ?? stageRunId,
      rubric.score,
      skin.completedAt
    );
    await postCheckpoint(
      learningTopicId,
      'skin',
      'skin_completion_auto',
      rubric.passed,
      {
        completedAt: skin.completedAt,
        chunkCount: skin.chunks.length,
        rubric: {
          code: rubric.rubricCode,
          score: rubric.score,
          threshold: rubric.threshold,
          passed: rubric.passed,
          failedChunkCount: rubric.failedChunkCount,
          summary: rubric.summary,
        },
      },
      completedRun?.id ?? stageRunId,
      rubric.score,
      skin.completedAt
    );
  }
}

async function syncMindMap(mindMap: MindMap) {
  const stage: LearningStage = mindMap.status === 'final' ? 'skin' : 'shoot';
  const learningTopicId = await ensureLearningTopic(mindMap.topicId, stage, 'active');
  if (!learningTopicId) return;
  const stageRun = await ensureStageRun(learningTopicId, stage);
  const stageRunId = stageRun?.id ?? null;

  await Promise.all([
    postArtifact(learningTopicId, 'mindmap_node', {
      status: mindMap.status,
      version: mindMap.version,
      generatedFrom: mindMap.generatedFrom,
      requiredEdits: mindMap.requiredEdits,
      userEditsCount: mindMap.userEditsCount,
      nodes: mindMap.nodes,
      updatedAt: mindMap.updatedAt,
    }, null, stageRunId),
    postArtifact(learningTopicId, 'mindmap_edge', {
      edges: mindMap.edges,
      updatedAt: mindMap.updatedAt,
    }, null, stageRunId),
  ]);
}

function enqueueSync(key: string, task: () => Promise<void>, debounceMs = 1200) {
  if (!isBrowser()) return;

  const existing = syncTimers.get(key);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    syncTimers.delete(key);
    void task();
  }, debounceMs);

  syncTimers.set(key, timer);
}

export function schedulePreStudySync(preStudy: PreStudy) {
  const copy = snapshot(preStudy);
  enqueueSync(`learning:prestudy:${copy.topicId}`, () => syncPreStudy(copy));
}

export function scheduleAimSync(aim: Aim) {
  const copy = snapshot(aim);
  enqueueSync(`learning:aim:${copy.topicId}`, () => syncAim(copy));
}

export function scheduleShootSync(shoot: Shoot) {
  const copy = snapshot(shoot);
  enqueueSync(`learning:shoot:${copy.topicId}`, () => syncShoot(copy));
}

export function scheduleSkinSync(skin: Skin) {
  const copy = snapshot(skin);
  enqueueSync(`learning:skin:${copy.topicId}`, () => syncSkin(copy));
}

export function scheduleMindMapSync(mindMap: MindMap) {
  const copy = snapshot(mindMap);
  enqueueSync(`learning:mindmap:${copy.topicId}`, () => syncMindMap(copy));
}
