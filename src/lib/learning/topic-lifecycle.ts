"use client";

import {
  LEARNING_STAGES,
  type LearningStage,
  type LearningTopicStatus,
} from "@/lib/learning/contracts";

export type LearningTopicRow = {
  id: string;
  stage: LearningStage;
  status: LearningTopicStatus;
  subject: string;
  subspecialty: string;
  topic_slug: string;
  topic_title: string;
  updated_at: string;
  completed_at: string | null;
};

export type LearningCheckpointRow = {
  id: string;
  stage: LearningStage;
  checkpoint_code: string;
  passed: boolean;
  score: number | null;
  details: Record<string, unknown>;
  evaluated_at: string;
};

type TopicResponse = {
  topics?: LearningTopicRow[];
};

type CheckpointsResponse = {
  checkpoints?: LearningCheckpointRow[];
};

export type CheckpointSummary = {
  passed: boolean;
  checkpointCode: string;
  evaluatedAt: string;
  score: number | null;
  details: Record<string, unknown>;
};

export type LatestCheckpointByStage = Partial<Record<LearningStage, CheckpointSummary>>;

export type CheckpointHistoryByStage = Partial<Record<LearningStage, LearningCheckpointRow[]>>;

type ReadModelCheckpointSummaryResponse = {
  passed: boolean;
  checkpoint_code: string;
  evaluated_at: string;
  score: number | null;
  details: Record<string, unknown>;
};

type ReadModelStageStateResponse = {
  stage: LearningStage;
  status: LearningTopicStatus;
  stage_progress_percent: number;
  latest_checkpoint_by_stage?: Partial<Record<LearningStage, ReadModelCheckpointSummaryResponse>>;
  latest_checkpoint_for_current_stage?: ReadModelCheckpointSummaryResponse | null;
  last_checkpoint_at?: string | null;
  failed_checkpoint_count?: number;
  passed_checkpoint_count?: number;
  checkpoint_history_by_stage?: Partial<
    Record<LearningStage, Array<LearningCheckpointRow & { learning_topic_id?: string }>>
  >;
};

type TopicReadModelResponse = {
  topic: LearningTopicRow;
  stage_state: ReadModelStageStateResponse;
};

type TopicReadModelListResponse = {
  topics?: TopicReadModelResponse[];
};

export type LearningTopicStageState = {
  stage: LearningStage;
  status: LearningTopicStatus;
  stageProgressPercent: number;
  latestCheckpointsByStage: LatestCheckpointByStage;
  latestCheckpointForCurrentStage: CheckpointSummary | null;
  lastCheckpointAt: string | null;
  failedCheckpointCount: number;
  passedCheckpointCount: number;
  checkpointHistoryByStage: CheckpointHistoryByStage;
};

export type LearningTopicReadModel = {
  topic: LearningTopicRow;
  stageState: LearningTopicStageState;
};

export type LearningMethodEfficacyStage = {
  stage: LearningStage;
  runCount: number;
  completedRunCount: number;
  failedRunCount: number;
  abandonedRunCount: number;
  inProgressRunCount: number;
  avgLatencyMinutes: number | null;
  medianLatencyMinutes: number | null;
  completionSuccessRate: number | null;
  checkpointPassRate: number | null;
  avgScore: number | null;
  failedCheckpointCount: number;
  topFailureReasons: Array<{
    reason: string;
    count: number;
    sharePercent: number;
  }>;
};

export type LearningMethodRetentionTopic = {
  topicId: string;
  topicTitle: string;
  subject: string;
  subspecialty: string;
  topicSlug: string;
  outcome: "stable" | "at_risk" | "in_progress";
  shoot: {
    passed: boolean;
    score: number | null;
    checkpointCode: string;
    evaluatedAt: string;
  } | null;
  skin: {
    passed: boolean;
    score: number | null;
    checkpointCode: string;
    evaluatedAt: string;
  } | null;
  lastEvaluatedAt: string | null;
  href: string;
};

export type LearningMethodEfficacyReadModel = {
  windowDays: number;
  summary: {
    topicCount: number;
    runCount: number;
    checkpointCount: number;
    overallCheckpointPassRate: number | null;
    completionSuccessRate: number | null;
    medianStageLatencyMinutes: number | null;
    retentionEvaluatedTopics: number;
    retentionStableTopics: number;
    retentionAtRiskTopics: number;
    retentionInProgressTopics: number;
  };
  stages: LearningMethodEfficacyStage[];
  retention: {
    earlyWindowPassRate: number | null;
    lateWindowPassRate: number | null;
    deltaPassRate: number | null;
    topics: LearningMethodRetentionTopic[];
  };
};

type ReadModelFilters = Partial<{
  stage: LearningStage;
  status: LearningTopicStatus;
  subject: string;
  subspecialty: string;
  topicSlug: string;
  limit: number;
  includeHistory: boolean;
  historyLimit: number;
}>;

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseTopicIdentity(topicId: string) {
  const raw = topicId.trim().replace(/^\/+|\/+$/g, "");
  const parts = raw.split("/").filter(Boolean);
  return {
    subject: normalizeSlug(parts[0] || "general"),
    subspecialty: normalizeSlug(parts[1] || "general"),
    topicSlug: normalizeSlug(parts[2] || raw || "topic"),
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (typeof window === "undefined" || typeof fetch === "undefined") return null;
  try {
    const headers = new Headers(init?.headers);
    if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const response = await fetch(url, { ...init, headers });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function mapCheckpointSummary(
  checkpoint: ReadModelCheckpointSummaryResponse | null | undefined
): CheckpointSummary | null {
  if (!checkpoint) return null;
  return {
    passed: checkpoint.passed,
    checkpointCode: checkpoint.checkpoint_code,
    evaluatedAt: checkpoint.evaluated_at,
    score: checkpoint.score,
    details: checkpoint.details || {},
  };
}

function mapCheckpointHistory(
  raw: ReadModelStageStateResponse["checkpoint_history_by_stage"]
): CheckpointHistoryByStage {
  const history: CheckpointHistoryByStage = {};
  if (!raw) return history;

  for (const [stage, rows] of Object.entries(raw)) {
    if (!rows || !Array.isArray(rows)) continue;
    if (!LEARNING_STAGES.includes(stage as LearningStage)) continue;
    history[stage as LearningStage] = rows.map((row) => ({
      id: row.id,
      stage: row.stage,
      checkpoint_code: row.checkpoint_code,
      passed: row.passed,
      score: row.score,
      details: row.details || {},
      evaluated_at: row.evaluated_at,
    }));
  }
  return history;
}

function mapTopicReadModel(entry: TopicReadModelResponse): LearningTopicReadModel {
  const latestCheckpointsByStage: LatestCheckpointByStage = {};
  const latestRaw = entry.stage_state.latest_checkpoint_by_stage || {};

  for (const stage of LEARNING_STAGES) {
    const summary = mapCheckpointSummary(latestRaw[stage]);
    if (summary) latestCheckpointsByStage[stage] = summary;
  }

  return {
    topic: entry.topic,
    stageState: {
      stage: entry.stage_state.stage,
      status: entry.stage_state.status,
      stageProgressPercent: entry.stage_state.stage_progress_percent,
      latestCheckpointsByStage,
      latestCheckpointForCurrentStage: mapCheckpointSummary(
        entry.stage_state.latest_checkpoint_for_current_stage || null
      ),
      lastCheckpointAt: entry.stage_state.last_checkpoint_at || null,
      failedCheckpointCount: entry.stage_state.failed_checkpoint_count || 0,
      passedCheckpointCount: entry.stage_state.passed_checkpoint_count || 0,
      checkpointHistoryByStage: mapCheckpointHistory(entry.stage_state.checkpoint_history_by_stage),
    },
  };
}

export async function fetchLearningTopicReadModels(
  filters: ReadModelFilters = {}
): Promise<LearningTopicReadModel[]> {
  const params = new URLSearchParams();
  if (filters.stage) params.set("stage", filters.stage);
  if (filters.status) params.set("status", filters.status);
  if (filters.subject) params.set("subject", filters.subject.trim().toLowerCase());
  if (filters.subspecialty) params.set("subspecialty", filters.subspecialty.trim().toLowerCase());
  if (filters.topicSlug) params.set("topic_slug", normalizeSlug(filters.topicSlug));
  if (typeof filters.limit === "number") params.set("limit", String(filters.limit));
  if (filters.includeHistory) params.set("include_history", "1");
  if (typeof filters.historyLimit === "number") {
    params.set("history_limit", String(filters.historyLimit));
  }

  const response = await fetchJson<TopicReadModelListResponse>(
    `/api/learning/read-model/topics?${params.toString()}`
  );
  const topics = response?.topics || [];
  return topics.map(mapTopicReadModel);
}

export async function fetchLearningMethodEfficacyReadModel(
  days = 30,
  retentionLimit = 12
): Promise<LearningMethodEfficacyReadModel | null> {
  const params = new URLSearchParams({
    days: String(days),
    retention_limit: String(retentionLimit),
  });

  const response = await fetchJson<LearningMethodEfficacyReadModel>(
    `/api/learning/read-model/efficacy?${params.toString()}`
  );

  if (!response) return null;

  return {
    ...response,
    stages: response.stages || [],
    retention: {
      earlyWindowPassRate: response.retention?.earlyWindowPassRate ?? null,
      lateWindowPassRate: response.retention?.lateWindowPassRate ?? null,
      deltaPassRate: response.retention?.deltaPassRate ?? null,
      topics: response.retention?.topics || [],
    },
  };
}

export async function fetchLearningTopicReadModelByTopicId(
  topicId: string,
  historyLimit = 5
): Promise<LearningTopicReadModel | null> {
  const identity = parseTopicIdentity(topicId);
  const rows = await fetchLearningTopicReadModels({
    subject: identity.subject,
    subspecialty: identity.subspecialty,
    topicSlug: identity.topicSlug,
    limit: 20,
    includeHistory: true,
    historyLimit,
  });

  return (
    rows.find(
      (entry) =>
        normalizeSlug(entry.topic.subject || "") === identity.subject &&
        normalizeSlug(entry.topic.subspecialty || "") === identity.subspecialty &&
        normalizeSlug(entry.topic.topic_slug || "") === identity.topicSlug
    ) || null
  );
}

export async function fetchLearningTopicByTopicId(topicId: string): Promise<LearningTopicRow | null> {
  const identity = parseTopicIdentity(topicId);
  const params = new URLSearchParams({
    subject: identity.subject,
    topic_slug: identity.topicSlug,
    limit: "20",
  });
  const response = await fetchJson<TopicResponse>(`/api/learning/topics?${params.toString()}`);
  const rows = response?.topics || [];
  return (
    rows.find(
      (row) =>
        normalizeSlug(row.subject || "") === identity.subject &&
        normalizeSlug(row.subspecialty || "") === identity.subspecialty &&
        normalizeSlug(row.topic_slug || "") === identity.topicSlug
    ) || null
  );
}

export async function patchLearningTopic(
  id: string,
  patch: Partial<{
    stage: LearningStage;
    status: LearningTopicStatus;
    completed_at: string | null;
  }>
): Promise<LearningTopicRow | null> {
  return fetchJson<LearningTopicRow>("/api/learning/topics", {
    method: "PATCH",
    body: JSON.stringify({
      id,
      ...patch,
    }),
  });
}

export async function createLearningCheckpoint(input: {
  learning_topic_id: string;
  stage: LearningStage;
  checkpoint_code: string;
  passed: boolean;
  details?: Record<string, unknown>;
  score?: number;
}) {
  return fetchJson<LearningCheckpointRow>("/api/learning/checkpoints", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      details: input.details || {},
    }),
  });
}

export async function fetchLatestCheckpointsByStage(
  learningTopicId: string
): Promise<LatestCheckpointByStage> {
  const params = new URLSearchParams({
    learning_topic_id: learningTopicId,
    limit: "100",
  });
  const response = await fetchJson<CheckpointsResponse>(
    `/api/learning/checkpoints?${params.toString()}`
  );
  const rows = response?.checkpoints || [];

  const latest: LatestCheckpointByStage = {};
  for (const row of rows) {
    const current = latest[row.stage];
    if (!current || Date.parse(row.evaluated_at) > Date.parse(current.evaluatedAt)) {
      latest[row.stage] = {
        passed: row.passed,
        checkpointCode: row.checkpoint_code,
        evaluatedAt: row.evaluated_at,
        score: row.score,
        details: row.details || {},
      };
    }
  }

  return latest;
}

export async function fetchCheckpointHistoryByStage(
  learningTopicId: string,
  perStageLimit = 5
): Promise<CheckpointHistoryByStage> {
  const params = new URLSearchParams({
    learning_topic_id: learningTopicId,
    limit: "200",
  });
  const response = await fetchJson<CheckpointsResponse>(
    `/api/learning/checkpoints?${params.toString()}`
  );
  const rows = (response?.checkpoints || []).slice().sort((a, b) => {
    return Date.parse(b.evaluated_at) - Date.parse(a.evaluated_at);
  });

  const history: CheckpointHistoryByStage = {};
  for (const row of rows) {
    const bucket = history[row.stage] || [];
    if (bucket.length >= perStageLimit) continue;
    bucket.push(row);
    history[row.stage] = bucket;
  }
  return history;
}
