import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/learning/api";
import { parseLimit } from "@/lib/learning/contracts";

type LearningStage = "prestudy" | "aim" | "shoot" | "skin";
type LearningTopicStatus = "active" | "paused" | "completed" | "archived";

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
  learning_topic_id: string;
  passed: boolean;
  score: number | null;
  evaluated_at: string;
};

function parseDays(raw: string | null, fallback = 7, max = 90) {
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value < 1) return fallback;
  return Math.min(value, max);
}

function dayKey(iso: string) {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return "";
  return new Date(ts).toISOString().slice(0, 10);
}

function toDayLabel(isoDate: string) {
  const ts = Date.parse(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(ts)) return isoDate;
  return new Date(ts).toLocaleDateString("en-US", { weekday: "short" });
}

function stageWeight(stage: LearningStage, status: LearningTopicStatus) {
  if (status === "completed") return 4;
  if (status === "archived") return 0;
  if (stage === "skin") return 4;
  if (stage === "shoot") return 3;
  if (stage === "aim") return 2;
  return 1;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { searchParams } = new URL(request.url);
    const days = parseDays(searchParams.get("days"), 7, 30);
    const topicLimit = parseLimit(searchParams.get("limit"), 80, 200);

    const now = new Date();
    const windowStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const checkpointWindowDays = Math.max(days, 30);
    const checkpointStart = new Date(
      now.getTime() - checkpointWindowDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: topicsData, error: topicsError } = await supabase
      .from("learning_topics")
      .select(
        "id,subject,subspecialty,topic_slug,topic_title,stage,status,updated_at,completed_at"
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(topicLimit);

    if (topicsError) {
      console.error("Learning overview topics error:", topicsError);
      return NextResponse.json({ error: "Failed to fetch learning overview" }, { status: 500 });
    }

    const topics = (topicsData || []) as TopicRow[];
    const topicIds = topics.map((topic) => topic.id);

    let checkpoints: CheckpointRow[] = [];
    if (topicIds.length) {
      const { data: checkpointsData, error: checkpointsError } = await supabase
        .from("learning_checkpoints")
        .select("learning_topic_id,passed,score,evaluated_at")
        .in("learning_topic_id", topicIds)
        .gte("evaluated_at", checkpointStart)
        .order("evaluated_at", { ascending: false })
        .limit(4000);

      if (checkpointsError) {
        console.error("Learning overview checkpoints error:", checkpointsError);
        return NextResponse.json(
          { error: "Failed to fetch learning overview checkpoints" },
          { status: 500 }
        );
      }
      checkpoints = (checkpointsData || []) as CheckpointRow[];
    }

    const activeTopics = topics.filter((topic) => topic.status === "active" || topic.status === "paused");
    const completedTopics = topics.filter((topic) => topic.status === "completed");
    const connectedTopics = topics.filter((topic) => {
      const ts = Date.parse(topic.updated_at);
      return !Number.isNaN(ts) && ts >= windowStart.getTime();
    }).length;

    const totalWeight = topics.length * 4;
    const currentWeight = topics.reduce((sum, topic) => {
      return sum + stageWeight(topic.stage, topic.status);
    }, 0);
    const stageCompletionPercent =
      totalWeight > 0 ? Math.round((currentWeight / totalWeight) * 100) : 0;

    const retrievalWindow = checkpoints.filter((checkpoint) => {
      const ts = Date.parse(checkpoint.evaluated_at);
      return !Number.isNaN(ts) && ts >= windowStart.getTime();
    });

    const passedCount = retrievalWindow.filter((checkpoint) => checkpoint.passed).length;
    const retrievalIntegrity =
      retrievalWindow.length > 0 ? Math.round((passedCount / retrievalWindow.length) * 100) : 0;

    const topicById = new Map(topics.map((topic) => [topic.id, topic] as const));
    const deficits = Array.from(
      checkpoints.reduce(
        (acc, checkpoint) => {
          const bucket = acc.get(checkpoint.learning_topic_id) || {
            attempts: 0,
            passed: 0,
            failed: 0,
          };
          bucket.attempts += 1;
          if (checkpoint.passed) bucket.passed += 1;
          else bucket.failed += 1;
          acc.set(checkpoint.learning_topic_id, bucket);
          return acc;
        },
        new Map<string, { attempts: number; passed: number; failed: number }>()
      ).entries()
    )
      .map(([topicId, counts]) => {
        const topic = topicById.get(topicId);
        if (!topic) return null;
        const accuracy =
          counts.attempts > 0 ? Math.round((counts.passed / counts.attempts) * 100) : 0;
        return {
          topicId,
          topicTitle: topic.topic_title,
          subject: topic.subject,
          subspecialty: topic.subspecialty,
          topicSlug: topic.topic_slug,
          accuracy,
          attempts: counts.attempts,
          failed: counts.failed,
          href: `/library/${topic.subject}/${topic.subspecialty}/${topic.topic_slug}?mode=quiz`,
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
          accuracy: number;
          attempts: number;
          failed: number;
          href: string;
        } => Boolean(row && row.attempts >= 3 && row.accuracy < 80)
      )
      .sort((a, b) => a.accuracy - b.accuracy || b.failed - a.failed)
      .slice(0, 6);

    const dayRows = Array.from({ length: days }, (_, index) => {
      const day = new Date(windowStart.getTime() + index * 24 * 60 * 60 * 1000);
      const isoDate = day.toISOString().slice(0, 10);
      const topicUpdates = topics.filter((topic) => dayKey(topic.updated_at) === isoDate).length;
      const checkpointsForDay = retrievalWindow.filter(
        (checkpoint) => dayKey(checkpoint.evaluated_at) === isoDate
      );
      const passed = checkpointsForDay.filter((checkpoint) => checkpoint.passed).length;
      return {
        date: isoDate,
        day: toDayLabel(isoDate),
        topicUpdates,
        checkpoints: checkpointsForDay.length,
        passed,
        failed: checkpointsForDay.length - passed,
      };
    });

    return NextResponse.json({
      windowDays: days,
      summary: {
        totalTopics: topics.length,
        activeTopics: activeTopics.length,
        completedTopics: completedTopics.length,
        connectedTopics,
        stageCompletionPercent,
        retrievalIntegrity,
        deficitCount: deficits.length,
        checkpointsEvaluated: retrievalWindow.length,
      },
      daily: dayRows,
      deficits,
    });
  } catch (error) {
    console.error("Learning overview GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
