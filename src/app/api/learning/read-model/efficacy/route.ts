import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/learning/api";
import { LEARNING_STAGES, parseLimit, type LearningStage } from "@/lib/learning/contracts";

type TopicRow = {
  id: string;
  subject: string;
  subspecialty: string;
  topic_slug: string;
  topic_title: string;
};

type StageRunRow = {
  learning_topic_id: string;
  stage: LearningStage;
  status: "in_progress" | "completed" | "failed" | "abandoned";
  started_at: string;
  finished_at: string | null;
};

type CheckpointRow = {
  learning_topic_id: string;
  stage: LearningStage;
  checkpoint_code: string;
  passed: boolean;
  score: number | string | null;
  details: Record<string, unknown> | null;
  evaluated_at: string;
};

type StageMetric = {
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

function parseDays(raw: string | null, fallback = 30, max = 180) {
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value < 1) return fallback;
  return Math.min(value, max);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function percent(part: number, whole: number): number | null {
  if (whole <= 0) return null;
  return Math.round((part / whole) * 100);
}

function avg(values: number[]): number | null {
  if (!values.length) return null;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return round((sorted[middle - 1] + sorted[middle]) / 2);
  }
  return round(sorted[middle]);
}

function durationMinutes(startedAt: string, finishedAt: string | null): number | null {
  if (!finishedAt) return null;
  const start = Date.parse(startedAt);
  const end = Date.parse(finishedAt);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return round((end - start) / (1000 * 60));
}

function isCompletionCheckpoint(code: string) {
  return (
    code.includes("rubric") ||
    code.includes("completion") ||
    code.endsWith("_manual_transition")
  );
}

function normalizeReason(reason: string) {
  const normalized = reason.replace(/\s+/g, " ").trim();
  if (normalized.length <= 100) return normalized;
  return `${normalized.slice(0, 97)}...`;
}

function extractFailureReasons(row: CheckpointRow): string[] {
  const details = asRecord(row.details) || {};
  const reasons: string[] = [];

  for (const key of ["reason", "failure_reason", "error", "summary", "message"]) {
    const value = asString(details[key]);
    if (value) reasons.push(normalizeReason(value));
  }

  const rubric = asRecord(details.rubric);
  if (rubric) {
    for (const chunk of asArray(rubric.chunks)) {
      const chunkRecord = asRecord(chunk);
      if (!chunkRecord) continue;
      for (const criterion of asArray(chunkRecord.criteria)) {
        const criterionRecord = asRecord(criterion);
        if (!criterionRecord) continue;
        if (criterionRecord.passed === false) {
          const label =
            asString(criterionRecord.label) || asString(criterionRecord.key) || "rubric criterion";
          reasons.push(`Failed ${label}`);
        }
      }
    }
  }

  if (!reasons.length && details.action === "complete_validation") {
    reasons.push("Rubric threshold not met");
  }

  if (!reasons.length) {
    reasons.push(`Checkpoint ${row.checkpoint_code}`);
  }

  return Array.from(new Set(reasons));
}

function topFailureReasons(failedRows: CheckpointRow[], limit = 4) {
  if (!failedRows.length) return [];
  const counts = new Map<string, number>();

  for (const row of failedRows) {
    for (const reason of extractFailureReasons(row)) {
      counts.set(reason, (counts.get(reason) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([reason, count]) => ({
      reason,
      count,
      sharePercent: Math.round((count / failedRows.length) * 100),
    }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason))
    .slice(0, limit);
}

function zeroStageMetric(stage: LearningStage): StageMetric {
  return {
    stage,
    runCount: 0,
    completedRunCount: 0,
    failedRunCount: 0,
    abandonedRunCount: 0,
    inProgressRunCount: 0,
    avgLatencyMinutes: null,
    medianLatencyMinutes: null,
    completionSuccessRate: null,
    checkpointPassRate: null,
    avgScore: null,
    failedCheckpointCount: 0,
    topFailureReasons: [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const days = parseDays(searchParams.get("days"), 30, 180);
    const topicLimit = parseLimit(searchParams.get("limit"), 140, 400);
    const retentionTopicLimit = parseLimit(searchParams.get("retention_limit"), 12, 40);

    const now = Date.now();
    const windowStartTs = now - days * 24 * 60 * 60 * 1000;
    const windowStartIso = new Date(windowStartTs).toISOString();
    const midpointIso = new Date(windowStartTs + (now - windowStartTs) / 2).toISOString();

    const { data: topicsData, error: topicsError } = await supabase
      .from("learning_topics")
      .select("id,subject,subspecialty,topic_slug,topic_title")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(topicLimit);

    if (topicsError) {
      console.error("Learning efficacy topics error:", topicsError);
      return NextResponse.json(
        { error: "Failed to fetch learning efficacy topics" },
        { status: 500 }
      );
    }

    const topics = (topicsData || []) as TopicRow[];
    if (!topics.length) {
      return NextResponse.json({
        windowDays: days,
        summary: {
          topicCount: 0,
          runCount: 0,
          checkpointCount: 0,
          overallCheckpointPassRate: null,
          completionSuccessRate: null,
          medianStageLatencyMinutes: null,
          retentionEvaluatedTopics: 0,
          retentionStableTopics: 0,
          retentionAtRiskTopics: 0,
          retentionInProgressTopics: 0,
        },
        stages: LEARNING_STAGES.map((stage) => zeroStageMetric(stage)),
        retention: {
          earlyWindowPassRate: null,
          lateWindowPassRate: null,
          deltaPassRate: null,
          topics: [],
        },
      });
    }

    const topicIds = topics.map((topic) => topic.id);
    const runLimit = Math.min(Math.max(topicIds.length * 30, 800), 10000);
    const checkpointLimit = Math.min(Math.max(topicIds.length * 120, 1200), 16000);

    const [runsQuery, checkpointsQuery] = await Promise.all([
      supabase
        .from("learning_stage_runs")
        .select("learning_topic_id,stage,status,started_at,finished_at")
        .in("learning_topic_id", topicIds)
        .gte("started_at", windowStartIso)
        .order("started_at", { ascending: false })
        .limit(runLimit),
      supabase
        .from("learning_checkpoints")
        .select("learning_topic_id,stage,checkpoint_code,passed,score,details,evaluated_at")
        .in("learning_topic_id", topicIds)
        .gte("evaluated_at", windowStartIso)
        .order("evaluated_at", { ascending: false })
        .limit(checkpointLimit),
    ]);

    if (runsQuery.error) {
      console.error("Learning efficacy stage-runs error:", runsQuery.error);
      return NextResponse.json({ error: "Failed to fetch stage run analytics" }, { status: 500 });
    }

    if (checkpointsQuery.error) {
      console.error("Learning efficacy checkpoints error:", checkpointsQuery.error);
      return NextResponse.json({ error: "Failed to fetch checkpoint analytics" }, { status: 500 });
    }

    const stageRuns = (runsQuery.data || []) as StageRunRow[];
    const checkpoints = ((checkpointsQuery.data || []) as CheckpointRow[]).map((row) => ({
      ...row,
      details: asRecord(row.details) || {},
      score: toNumber(row.score),
    }));

    const stageMetrics: StageMetric[] = LEARNING_STAGES.map((stage) => {
      const runs = stageRuns.filter((row) => row.stage === stage);
      const runDurations = runs
        .map((row) => durationMinutes(row.started_at, row.finished_at))
        .filter((value): value is number => typeof value === "number");
      const completedRunCount = runs.filter((row) => row.status === "completed").length;
      const failedRunCount = runs.filter((row) => row.status === "failed").length;
      const abandonedRunCount = runs.filter((row) => row.status === "abandoned").length;
      const inProgressRunCount = runs.filter((row) => row.status === "in_progress").length;

      const stageCheckpoints = checkpoints.filter((row) => row.stage === stage);
      const passedCheckpointCount = stageCheckpoints.filter((row) => row.passed).length;
      const failedCheckpoints = stageCheckpoints.filter((row) => !row.passed);
      const scored = stageCheckpoints
        .map((row) => toNumber(row.score))
        .filter((value): value is number => typeof value === "number");

      const completionAttempts = stageCheckpoints.filter((row) =>
        isCompletionCheckpoint(row.checkpoint_code)
      );
      const completionPassedCount = completionAttempts.filter((row) => row.passed).length;

      return {
        stage,
        runCount: runs.length,
        completedRunCount,
        failedRunCount,
        abandonedRunCount,
        inProgressRunCount,
        avgLatencyMinutes: avg(runDurations),
        medianLatencyMinutes: median(runDurations),
        completionSuccessRate: percent(completionPassedCount, completionAttempts.length),
        checkpointPassRate: percent(passedCheckpointCount, stageCheckpoints.length),
        avgScore: avg(scored),
        failedCheckpointCount: failedCheckpoints.length,
        topFailureReasons: topFailureReasons(failedCheckpoints),
      };
    });

    const completionAttemptsAll = checkpoints.filter((row) =>
      isCompletionCheckpoint(row.checkpoint_code)
    );
    const completionPassedAll = completionAttemptsAll.filter((row) => row.passed).length;
    const overallCheckpointPassRate = percent(
      checkpoints.filter((row) => row.passed).length,
      checkpoints.length
    );
    const completionSuccessRate = percent(completionPassedAll, completionAttemptsAll.length);
    const stageLatencyValues = stageMetrics
      .map((metric) => metric.medianLatencyMinutes)
      .filter((value): value is number => typeof value === "number");

    const topicById = new Map(topics.map((topic) => [topic.id, topic] as const));
    const checkpointsByTopicStage = new Map<
      string,
      Partial<Record<LearningStage, CheckpointRow[]>>
    >();
    for (const checkpoint of checkpoints) {
      const stageMap = checkpointsByTopicStage.get(checkpoint.learning_topic_id) || {};
      const bucket = stageMap[checkpoint.stage] || [];
      bucket.push(checkpoint);
      stageMap[checkpoint.stage] = bucket;
      checkpointsByTopicStage.set(checkpoint.learning_topic_id, stageMap);
    }

    const retentionTopics = topics
      .map((topic) => {
        const stageMap = checkpointsByTopicStage.get(topic.id);
        if (!stageMap) return null;
        const latestShoot = stageMap.shoot?.[0] || null;
        const latestSkin = stageMap.skin?.[0] || null;
        if (!latestShoot && !latestSkin) return null;

        const outcome =
          latestSkin != null
            ? latestSkin.passed
              ? "stable"
              : "at_risk"
            : latestShoot?.passed
              ? "in_progress"
              : "at_risk";

        const lastEvaluatedAt = [latestShoot?.evaluated_at, latestSkin?.evaluated_at]
          .filter((value): value is string => typeof value === "string")
          .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

        return {
          topicId: topic.id,
          topicTitle: topic.topic_title,
          subject: topic.subject,
          subspecialty: topic.subspecialty,
          topicSlug: topic.topic_slug,
          outcome,
          shoot: latestShoot
            ? {
                passed: latestShoot.passed,
                score: toNumber(latestShoot.score),
                checkpointCode: latestShoot.checkpoint_code,
                evaluatedAt: latestShoot.evaluated_at,
              }
            : null,
          skin: latestSkin
            ? {
                passed: latestSkin.passed,
                score: toNumber(latestSkin.score),
                checkpointCode: latestSkin.checkpoint_code,
                evaluatedAt: latestSkin.evaluated_at,
              }
            : null,
          lastEvaluatedAt: lastEvaluatedAt || null,
          href: `/library/${topic.subject}/${topic.subspecialty}/${topic.topic_slug}`,
        };
      })
      .filter(
        (
          row
        ): row is {
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
        } => Boolean(row)
      )
      .sort((a, b) => Date.parse(b.lastEvaluatedAt || "") - Date.parse(a.lastEvaluatedAt || ""))
      .slice(0, retentionTopicLimit);

    const retentionStableTopics = retentionTopics.filter((row) => row.outcome === "stable").length;
    const retentionAtRiskTopics = retentionTopics.filter((row) => row.outcome === "at_risk").length;
    const retentionInProgressTopics = retentionTopics.filter(
      (row) => row.outcome === "in_progress"
    ).length;

    const retentionCheckpoints = checkpoints.filter(
      (row) => row.stage === "shoot" || row.stage === "skin"
    );
    const earlyRetention = retentionCheckpoints.filter(
      (row) => Date.parse(row.evaluated_at) < Date.parse(midpointIso)
    );
    const lateRetention = retentionCheckpoints.filter(
      (row) => Date.parse(row.evaluated_at) >= Date.parse(midpointIso)
    );
    const earlyWindowPassRate = percent(
      earlyRetention.filter((row) => row.passed).length,
      earlyRetention.length
    );
    const lateWindowPassRate = percent(
      lateRetention.filter((row) => row.passed).length,
      lateRetention.length
    );
    const deltaPassRate =
      earlyWindowPassRate !== null && lateWindowPassRate !== null
        ? lateWindowPassRate - earlyWindowPassRate
        : null;

    return NextResponse.json({
      windowDays: days,
      summary: {
        topicCount: topicById.size,
        runCount: stageRuns.length,
        checkpointCount: checkpoints.length,
        overallCheckpointPassRate,
        completionSuccessRate,
        medianStageLatencyMinutes: median(stageLatencyValues),
        retentionEvaluatedTopics: retentionTopics.length,
        retentionStableTopics,
        retentionAtRiskTopics,
        retentionInProgressTopics,
      },
      stages: stageMetrics,
      retention: {
        earlyWindowPassRate,
        lateWindowPassRate,
        deltaPassRate,
        topics: retentionTopics,
      },
    });
  } catch (error) {
    console.error("Learning efficacy GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
