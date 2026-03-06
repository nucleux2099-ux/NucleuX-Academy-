import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/learning/api";
import {
  isLearningStage,
  isLearningTopicStatus,
  parseLimit,
  type LearningStage,
  type LearningTopicStatus,
} from "@/lib/learning/contracts";

type TopicRow = {
  id: string;
  subject: string;
  subspecialty: string;
  topic_slug: string;
  topic_title: string;
  stage: LearningStage;
  status: LearningTopicStatus;
  updated_at: string;
  completed_at: string | null;
};

type CheckpointRow = {
  id: string;
  learning_topic_id: string;
  stage: LearningStage;
  checkpoint_code: string;
  passed: boolean;
  score: number | null;
  details: Record<string, unknown>;
  evaluated_at: string;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseBooleanFlag(raw: string | null, fallback = false) {
  if (!raw) return fallback;
  return raw === "1" || raw.toLowerCase() === "true";
}

function stageProgressPercent(stage: LearningStage, status: LearningTopicStatus) {
  if (status === "completed") return 100;
  if (status === "archived") return 0;
  if (stage === "skin") return 85;
  if (stage === "shoot") return 65;
  if (stage === "aim") return 45;
  return 20;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const status = searchParams.get("status");
    const subject = searchParams.get("subject");
    const subspecialty = searchParams.get("subspecialty");
    const topicSlug = searchParams.get("topic_slug");
    const limit = parseLimit(searchParams.get("limit"));
    const includeHistory = parseBooleanFlag(searchParams.get("include_history"), false);
    const historyLimit = parseLimit(searchParams.get("history_limit"), 5, 20);

    if (stage && !isLearningStage(stage)) {
      return NextResponse.json({ error: "Invalid stage filter" }, { status: 400 });
    }

    if (status && !isLearningTopicStatus(status)) {
      return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
    }

    let query = supabase
      .from("learning_topics")
      .select(
        "id,subject,subspecialty,topic_slug,topic_title,stage,status,updated_at,completed_at"
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (stage) query = query.eq("stage", stage);
    if (status) query = query.eq("status", status);
    if (subject) query = query.eq("subject", subject.trim().toLowerCase());
    if (subspecialty) query = query.eq("subspecialty", subspecialty.trim().toLowerCase());
    if (topicSlug) query = query.eq("topic_slug", normalizeSlug(topicSlug));

    const { data: topicsData, error: topicsError } = await query;
    if (topicsError) {
      console.error("Learning read-model topics error:", topicsError);
      return NextResponse.json({ error: "Failed to fetch topic read-model" }, { status: 500 });
    }

    const topics = (topicsData || []) as TopicRow[];
    if (!topics.length) {
      return NextResponse.json({ topics: [] });
    }

    const topicIds = topics.map((topic) => topic.id);
    const checkpointsLimit = Math.min(Math.max(topicIds.length * 120, 500), 8000);

    const { data: checkpointsData, error: checkpointsError } = await supabase
      .from("learning_checkpoints")
      .select(
        "id,learning_topic_id,stage,checkpoint_code,passed,score,details,evaluated_at"
      )
      .in("learning_topic_id", topicIds)
      .order("evaluated_at", { ascending: false })
      .limit(checkpointsLimit);

    if (checkpointsError) {
      console.error("Learning read-model checkpoints error:", checkpointsError);
      return NextResponse.json({ error: "Failed to fetch checkpoint read-model" }, { status: 500 });
    }

    const checkpoints = (checkpointsData || []) as CheckpointRow[];
    const checkpointsByTopic = checkpoints.reduce(
      (acc, checkpoint) => {
        const bucket = acc.get(checkpoint.learning_topic_id) || [];
        bucket.push({
          ...checkpoint,
          details: checkpoint.details || {},
        });
        acc.set(checkpoint.learning_topic_id, bucket);
        return acc;
      },
      new Map<string, CheckpointRow[]>()
    );

    const responseTopics = topics.map((topic) => {
      const rows = checkpointsByTopic.get(topic.id) || [];
      const latestByStage: Partial<Record<LearningStage, Omit<CheckpointRow, "learning_topic_id" | "id">>> = {};
      const historyByStage: Partial<Record<LearningStage, CheckpointRow[]>> = {};

      for (const row of rows) {
        if (!latestByStage[row.stage]) {
          latestByStage[row.stage] = {
            stage: row.stage,
            checkpoint_code: row.checkpoint_code,
            passed: row.passed,
            score: row.score,
            details: row.details || {},
            evaluated_at: row.evaluated_at,
          };
        }

        if (includeHistory) {
          const history = historyByStage[row.stage] || [];
          if (history.length < historyLimit) {
            history.push({
              id: row.id,
              learning_topic_id: row.learning_topic_id,
              stage: row.stage,
              checkpoint_code: row.checkpoint_code,
              passed: row.passed,
              score: row.score,
              details: row.details || {},
              evaluated_at: row.evaluated_at,
            });
            historyByStage[row.stage] = history;
          }
        }
      }

      const failedCheckpointCount = rows.reduce((sum, row) => sum + (row.passed ? 0 : 1), 0);
      const passedCheckpointCount = rows.length - failedCheckpointCount;

      const stageState: Record<string, unknown> = {
        stage: topic.stage,
        status: topic.status,
        stage_progress_percent: stageProgressPercent(topic.stage, topic.status),
        latest_checkpoint_by_stage: latestByStage,
        latest_checkpoint_for_current_stage: latestByStage[topic.stage] || null,
        last_checkpoint_at: rows[0]?.evaluated_at || null,
        failed_checkpoint_count: failedCheckpointCount,
        passed_checkpoint_count: passedCheckpointCount,
      };
      if (includeHistory) {
        stageState.checkpoint_history_by_stage = historyByStage;
      }

      return {
        topic,
        stage_state: stageState,
      };
    });

    return NextResponse.json({ topics: responseTopics });
  } catch (error) {
    console.error("Learning read-model GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
