"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  BookOpen,
  Clock3,
  Flame,
  Gauge,
  Layers,
  Target,
} from "lucide-react";

import { ATOMStudyCoach } from "@/components/ATOMStudyCoach";
import { ApiStateBoundary } from "@/components/api-state-boundary";
import { Card } from "@/components/ui/card";
import {
  useAnalytics,
  useLearningMethodEfficacy,
  useLearningOverview,
  useProfile,
  useStudyPlan,
  useTrackEvent,
} from "@/lib/api/hooks";
import { cn } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatRelativeTime(timestamp: string) {
  const ts = Date.parse(timestamp);
  if (Number.isNaN(ts)) return "recently";
  const deltaMins = Math.floor((Date.now() - ts) / (1000 * 60));
  if (deltaMins < 1) return "just now";
  if (deltaMins < 60) return `${deltaMins}m ago`;
  const deltaHours = Math.floor(deltaMins / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;
  return `${Math.floor(deltaHours / 24)}d ago`;
}

function formatEventType(type: string) {
  if (type === "mcq") return "MCQ practice";
  if (type === "review") return "Retrieval review";
  if (type === "study") return "Study session";
  const normalized = type
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return `${normalized || "Study"} session`;
}

type EventRow = {
  type: string;
  timestamp: string;
  topic?: string;
  duration?: number;
  score?: number;
  total?: number;
};

function buildEventsFromAnalytics(
  analytics: ReturnType<typeof useAnalytics>["data"]
): EventRow[] {
  if (!analytics) return [];

  const events: EventRow[] = [];

  for (const session of analytics.recentSessions || []) {
    events.push({
      type: session.source || "study",
      timestamp: session.started_at || new Date().toISOString(),
      duration: session.duration_minutes || 0,
      score: session.mcqs_correct || 0,
      total: session.mcqs_attempted || 0,
    });
  }

  for (const day of analytics.dailyStats || []) {
    events.push({
      type: "mcq",
      timestamp: `${day.date}T00:00:00.000Z`,
      topic: "Daily practice",
      duration: day.study_minutes || 0,
      score: day.mcqs_correct || 0,
      total: day.mcqs_attempted || 0,
    });
  }

  return events;
}

function computeStreak(events: EventRow[]) {
  const days = new Set(
    events
      .map((event) => new Date(event.timestamp))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map((date) => date.toDateString())
  );

  let streak = 0;
  for (let day = new Date(); ; day.setDate(day.getDate() - 1)) {
    if (days.has(day.toDateString())) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
}

type DeskTask = {
  title: string;
  subtitle: string;
  badge: string;
  etaMinutes: number;
  actionPath: string;
  icon: "study" | "mcq" | "review";
};

type ContinueItem = {
  title: string;
  subtitle: string;
  progress: number;
  path: string;
};

type FocusArea = {
  topic: string;
  accuracy: number;
  attempts: number;
  href: string;
};

function MetricTile({
  label,
  value,
  hint,
  accent = "teal",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "teal" | "gold";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 ui-interactive",
        accent === "gold"
          ? "border-[#C9A86C]/20 bg-[#1B2838]/65"
          : "border-[#5BB3B3]/18 bg-[#1B2838]/65"
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#A0B0BC]">{hint}</p> : null}
    </div>
  );
}

export default function DeskPage() {
  const router = useRouter();
  const { trackEvent } = useTrackEvent();

  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: studyPlan, isLoading: studyPlanLoading, error: studyPlanError } = useStudyPlan();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAnalytics(30);
  const {
    data: learningOverview,
    isLoading: learningOverviewLoading,
    error: learningOverviewError,
  } = useLearningOverview(7);
  const {
    data: learningEfficacy,
    isLoading: learningEfficacyLoading,
    error: learningEfficacyError,
  } = useLearningMethodEfficacy(30);

  const events = useMemo(() => buildEventsFromAnalytics(analytics), [analytics]);
  const streak = useMemo(() => computeStreak(events), [events]);

  const weeklyStudyHours = useMemo(() => {
    const rows = analytics?.dailyStats || [];
    const weeklyMinutes = rows
      .slice(-7)
      .reduce((total, row) => total + (row.study_minutes || 0), 0);
    return Math.round((weeklyMinutes / 60) * 10) / 10;
  }, [analytics?.dailyStats]);

  const studyPlanTasks = useMemo<DeskTask[]>(() => {
    const tasks = studyPlan?.tasks || [];
    if (!tasks.length) {
      return [
        {
          title: "Start your first topic",
          subtitle: "Pick one core topic and begin the method flow.",
          badge: "Get started",
          etaMinutes: 20,
          actionPath: "/library",
          icon: "study",
        },
      ];
    }

    return tasks.slice(0, 4).map((task) => {
      const type = typeof task.type === "string" ? task.type : "study";
      const estimatedMinutes =
        typeof task.estimated_minutes === "number" ? task.estimated_minutes : 15;
      const atomId = typeof task.atom_id === "string" ? task.atom_id : undefined;
      const slug = typeof task.slug === "string" ? task.slug : undefined;

      const actionPath =
        type === "mcq"
          ? "/mcqs?mode=practice&type=mixed"
          : type === "review"
            ? "/mcqs?mode=quiz&type=retrieval"
            : slug
              ? `/read/${slug}`
              : atomId
                ? `/read/${atomId}`
                : "/library";

      return {
        title: typeof task.title === "string" ? task.title : "Study task",
        subtitle:
          typeof task.description === "string"
            ? task.description
            : "Follow the next recommended learning action.",
        badge: type,
        etaMinutes: estimatedMinutes,
        actionPath,
        icon: type === "mcq" ? "mcq" : type === "review" ? "review" : "study",
      };
    });
  }, [studyPlan?.tasks]);

  const continueItems = useMemo<ContinueItem[]>(() => {
    const rows = studyPlan?.continue_learning || [];
    return rows.slice(0, 3).map((row) => {
      const title = typeof row.title === "string" ? row.title : "Continue topic";
      const subtitle = typeof row.topic === "string" ? row.topic : "Resume where you left off";
      const progress =
        typeof row.progress_percent === "number" ? Math.max(0, Math.min(100, row.progress_percent)) : 0;
      const path =
        typeof row.href === "string" && row.href.startsWith("/") ? row.href : "/library";
      return { title, subtitle, progress, path };
    });
  }, [studyPlan?.continue_learning]);

  const focusAreas = useMemo<FocusArea[]>(() => {
    return (learningOverview?.deficits || []).slice(0, 4).map((row) => ({
      topic: row.topicTitle,
      accuracy: row.accuracy,
      attempts: row.attempts,
      href: row.href,
    }));
  }, [learningOverview?.deficits]);

  const recentActivity = useMemo(() => {
    return events
      .slice()
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .slice(0, 6)
      .map((event) => {
        const scoreText =
          typeof event.total === "number" && event.total > 0
            ? ` · ${event.score || 0}/${event.total}`
            : "";
        return {
          key: `${event.type}-${event.timestamp}`,
          title: `${formatEventType(event.type)}${scoreText}`,
          time: formatRelativeTime(event.timestamp),
        };
      });
  }, [events]);

  const connectedTopics = learningOverview?.summary.connectedTopics ?? 0;
  const completedTopics = learningOverview?.summary.completedTopics ?? 0;
  const retrievalIntegrity = learningOverview?.summary.retrievalIntegrity ?? 0;

  const methodSuccess = learningEfficacy?.summary.completionSuccessRate ?? retrievalIntegrity;
  const medianLatency = learningEfficacy?.summary.medianStageLatencyMinutes;
  const retentionEvaluated = learningEfficacy?.summary.retentionEvaluatedTopics ?? 0;
  const retentionStable = learningEfficacy?.summary.retentionStableTopics ?? 0;
  const retentionAtRisk = learningEfficacy?.summary.retentionAtRiskTopics ?? 0;
  const retentionStableRate =
    retentionEvaluated > 0 ? Math.round((retentionStable / retentionEvaluated) * 100) : null;

  const efficacyStages = useMemo(() => learningEfficacy?.stages || [], [learningEfficacy?.stages]);

  const primaryTask = studyPlanTasks[0];

  const isLoading =
    profileLoading ||
    studyPlanLoading ||
    analyticsLoading ||
    learningOverviewLoading ||
    learningEfficacyLoading;

  const error =
    profileError ||
    studyPlanError ||
    analyticsError ||
    learningOverviewError ||
    learningEfficacyError;

  const dataSnapshot =
    studyPlan || analytics || profile || learningOverview || learningEfficacy || null;

  const openPath = (path: string, source: string, extra?: Record<string, unknown>) => {
    void trackEvent("recommendation_clicked", {
      source,
      ...extra,
    });
    router.push(path);
  };

  const iconForTask = (icon: DeskTask["icon"]) => {
    if (icon === "mcq") return Target;
    if (icon === "review") return Brain;
    return BookOpen;
  };

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={dataSnapshot}
      loadingText="Loading your desk..."
      errorText="Unable to load your desk right now."
      className="app-shell"
    >
      <div className="ui-shell py-2 md:py-3">
        <div className="mx-auto max-w-6xl space-y-5">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between ui-reveal-up">
            <div>
              <p className="text-sm font-medium text-[#A0B0BC]">{formatDate()}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#E8E0D5] md:text-3xl">
                {getGreeting()}, {profile?.full_name || profile?.username || "Learner"}
              </h1>
              <p className="mt-1 text-sm text-[#A0B0BC]">
                A clean control surface for what to do next.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="ui-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
                <Flame className="h-3.5 w-3.5 text-[#C9A86C]" /> {streak} day streak
              </span>
              <span className="ui-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
                <Layers className="h-3.5 w-3.5 text-[#5BB3B3]" /> {connectedTopics} connected topics
              </span>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card className="ui-panel ui-reveal-up ui-reveal-delay-1 gap-4 p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A88]">Today</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#E8E0D5]">Today&apos;s Focus</h2>
                  <p className="mt-1 text-sm text-[#A0B0BC]">Start with the highest-impact task, then continue active modules.</p>
                </div>
                <button
                  onClick={() => openPath(primaryTask.actionPath, "desk_start_primary", { task: primaryTask.title })}
                  className="inline-flex items-center gap-1 rounded-full bg-[#5BB3B3] px-4 py-2 text-sm font-semibold text-[#1E2D3D] transition-colors duration-150 hover:bg-[#67bdbd]"
                >
                  Start session <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl border border-[#5BB3B3]/18 bg-[#1B2838]/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[#E8E0D5] truncate">{primaryTask.title}</p>
                    <p className="mt-1 text-sm text-[#A0B0BC]">{primaryTask.subtitle}</p>
                  </div>
                  <span className="rounded-full border border-[#5BB3B3]/20 bg-[#5BB3B3]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#5BB3B3]">
                    {primaryTask.badge}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-[#A0B0BC]">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{primaryTask.etaMinutes} min estimated</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {studyPlanTasks.slice(1, 4).map((task) => {
                  const TaskIcon = iconForTask(task.icon);
                  return (
                    <button
                      key={task.title}
                      onClick={() => openPath(task.actionPath, "desk_secondary_task", { task: task.title })}
                      className="ui-interactive rounded-xl border border-[rgba(232,224,213,0.09)] bg-[#253545]/70 p-3 text-left"
                    >
                      <TaskIcon className="h-4 w-4 text-[#5BB3B3]" />
                      <p className="mt-2 line-clamp-2 text-sm font-medium text-[#E8E0D5]">{task.title}</p>
                      <p className="mt-1 text-xs text-[#6B7A88]">{task.etaMinutes} min</p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A88]">Performance</p>
                <h2 className="mt-1 text-xl font-semibold text-[#E8E0D5]">Snapshot</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <MetricTile
                  label="Retrieval Integrity"
                  value={`${retrievalIntegrity}%`}
                  hint="Checkpoint pass ratio"
                />
                <MetricTile
                  label="Method Success"
                  value={`${methodSuccess}%`}
                  hint="Stage completion attempts"
                  accent="gold"
                />
                <MetricTile
                  label="Median Stage Latency"
                  value={medianLatency != null ? `${Math.round(medianLatency)}m` : "n/a"}
                  hint={medianLatency != null ? "Across all stage runs" : "Awaiting completed runs"}
                />
                <MetricTile
                  label="Retention Stability"
                  value={retentionStableRate != null ? `${retentionStableRate}%` : "n/a"}
                  hint={
                    retentionEvaluated
                      ? `${retentionStable}/${retentionEvaluated} stable · ${retentionAtRisk} at risk`
                      : "Not enough retention signals yet"
                  }
                  accent="gold"
                />
              </div>
            </Card>
          </section>

          <section className="ui-reveal-up ui-reveal-delay-1">
            <ATOMStudyCoach />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
            <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A88]">Continue</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#E8E0D5]">Active Modules</h2>
                </div>
                <button
                  onClick={() => openPath(studyPlan?.active_pathway ? "/pathways" : "/library", "desk_continue_learning")}
                  className="text-sm font-medium text-[#5BB3B3] transition-colors duration-150 hover:text-[#78c7c7]"
                >
                  View all
                </button>
              </div>

              <div className="space-y-2.5">
                {continueItems.length === 0 ? (
                  <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4 text-sm text-[#A0B0BC]">
                    No active modules yet. Start one topic from Library and it will appear here.
                  </div>
                ) : (
                  continueItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => openPath(item.path, "desk_continue_item", { title: item.title })}
                      className="ui-interactive w-full rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4 text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#E8E0D5]">{item.title}</p>
                        <span className="text-xs font-medium text-[#A0B0BC]">{item.progress}%</span>
                      </div>
                      <p className="mt-1 text-xs text-[#6B7A88]">{item.subtitle}</p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#253545]">
                        <div
                          className="h-full rounded-full bg-[#5BB3B3] transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>

            <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A88]">Efficacy</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#E8E0D5]">By Stage</h2>
                </div>
                <Gauge className="h-4 w-4 text-[#C9A86C]" />
              </div>

              <div className="space-y-2.5">
                {efficacyStages.length === 0 ? (
                  <p className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/55 p-3 text-sm text-[#A0B0BC]">
                    Stage analytics will appear after checkpoints and stage runs are recorded.
                  </p>
                ) : (
                  efficacyStages.map((stage) => (
                    <div
                      key={stage.stage}
                      className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/55 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold capitalize text-[#E8E0D5]">{stage.stage}</p>
                        <span className="text-xs font-medium text-[#A0B0BC]">
                          {stage.completionSuccessRate != null
                            ? `${stage.completionSuccessRate}% success`
                            : "No completion attempts"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-[11px] text-[#6B7A88]">
                        <span>{stage.runCount} runs</span>
                        <span>
                          latency {stage.medianLatencyMinutes != null ? `${Math.round(stage.medianLatencyMinutes)}m` : "n/a"}
                        </span>
                        <span>{stage.failedCheckpointCount} failed checkpoints</span>
                      </div>
                      {stage.topFailureReasons[0] ? (
                        <p className="mt-2 line-clamp-1 text-xs text-[#C9A86C]">
                          Top failure signal: {stage.topFailureReasons[0].reason}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A88]">Focus</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#E8E0D5]">Weak Areas</h2>
                </div>
                <button
                  onClick={() =>
                    openPath(
                      focusAreas[0]?.href || "/mcqs?mode=practice&type=mixed&focus=weak",
                      "desk_patch_deficits"
                    )
                  }
                  disabled={focusAreas.length === 0}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    focusAreas.length === 0
                      ? "cursor-not-allowed bg-[#253545]/70 text-[#6B7A88]"
                      : "bg-[#C9A86C]/15 text-[#C9A86C] hover:bg-[#C9A86C]/25"
                  )}
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Practice
                </button>
              </div>

              <div className="space-y-2.5">
                {focusAreas.length === 0 ? (
                  <p className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4 text-sm text-[#A0B0BC]">
                    No critical deficits detected in the current window.
                  </p>
                ) : (
                  focusAreas.map((row) => (
                    <button
                      key={row.topic}
                      onClick={() => openPath(row.href, "desk_focus_area", { topic: row.topic })}
                      className="ui-interactive w-full rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4 text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#E8E0D5]">{row.topic}</p>
                        <span className="text-xs font-semibold text-[#C9A86C]">{row.accuracy}%</span>
                      </div>
                      <p className="mt-1 text-xs text-[#6B7A88]">{row.attempts} attempts logged</p>
                    </button>
                  ))
                )}
              </div>
            </Card>

            <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5 md:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B7A88]">Activity</p>
                <h2 className="mt-1 text-xl font-semibold text-[#E8E0D5]">Recent Activity</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricTile
                  label="Study Hours (7 Days)"
                  value={`${weeklyStudyHours}h`}
                  hint="From tracked sessions"
                />
                <MetricTile
                  label="Topics Completed"
                  value={`${completedTopics}`}
                  hint="Lifecycle total"
                  accent="gold"
                />
              </div>

              <div className="space-y-2">
                {recentActivity.length === 0 ? (
                  <p className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4 text-sm text-[#A0B0BC]">
                    No recent activity yet.
                  </p>
                ) : (
                  recentActivity.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 px-3 py-2.5"
                    >
                      <p className="text-sm text-[#E8E0D5]">{entry.title}</p>
                      <span className="text-xs text-[#6B7A88]">{entry.time}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </ApiStateBoundary>
  );
}
