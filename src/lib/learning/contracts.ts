export const LEARNING_STAGES = ['prestudy', 'aim', 'shoot', 'skin'] as const;
export type LearningStage = (typeof LEARNING_STAGES)[number];

export const LEARNING_TOPIC_STATUSES = ['active', 'paused', 'completed', 'archived'] as const;
export type LearningTopicStatus = (typeof LEARNING_TOPIC_STATUSES)[number];

export const CHUNK_STATUSES = ['draft', 'in_progress', 'completed'] as const;
export type ChunkStatus = (typeof CHUNK_STATUSES)[number];

export const STAGE_RUN_STATUSES = ['in_progress', 'completed', 'failed', 'abandoned'] as const;
export type StageRunStatus = (typeof STAGE_RUN_STATUSES)[number];

export const ARTIFACT_TYPES = [
  'prestudy_keyword',
  'prestudy_assignment',
  'aim_question',
  'aim_rationale',
  'shoot_layer',
  'shoot_vprefre',
  'shoot_gap',
  'skin_grinde',
  'skin_gap',
  'mindmap_node',
  'mindmap_edge',
  'note',
  'other',
] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export const ARTIFACT_SOURCES = ['user', 'atom', 'system'] as const;
export type ArtifactSource = (typeof ARTIFACT_SOURCES)[number];

export function isLearningStage(value: unknown): value is LearningStage {
  return typeof value === 'string' && LEARNING_STAGES.includes(value as LearningStage);
}

export function isLearningTopicStatus(value: unknown): value is LearningTopicStatus {
  return (
    typeof value === 'string' && LEARNING_TOPIC_STATUSES.includes(value as LearningTopicStatus)
  );
}

export function isChunkStatus(value: unknown): value is ChunkStatus {
  return typeof value === 'string' && CHUNK_STATUSES.includes(value as ChunkStatus);
}

export function isStageRunStatus(value: unknown): value is StageRunStatus {
  return typeof value === 'string' && STAGE_RUN_STATUSES.includes(value as StageRunStatus);
}

export function isArtifactType(value: unknown): value is ArtifactType {
  return typeof value === 'string' && ARTIFACT_TYPES.includes(value as ArtifactType);
}

export function isArtifactSource(value: unknown): value is ArtifactSource {
  return typeof value === 'string' && ARTIFACT_SOURCES.includes(value as ArtifactSource);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseLimit(raw: string | null, fallback = 50, max = 200): number {
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

