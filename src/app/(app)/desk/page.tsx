"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Flame, BookOpen, ChevronRight, Target,
  Bookmark, Brain, Zap, CheckCircle2, Circle, Play,
  Star, AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics, useProfile, useStudyPlan, useTrackEvent } from "@/lib/api/hooks";
import { ApiStateBoundary } from "@/components/api-state-boundary";

// --- Helpers ---
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
}

// --- Real Data Helpers ---
interface BackstageEvent {
  type: string;
  subject?: string;
  topic?: string;
  timestamp: string;
  duration?: number;
  score?: number;
  total?: number;
  [key: string]: unknown;
}

function buildEventsFromAnalytics(
  analytics: ReturnType<typeof useAnalytics>["data"]
): BackstageEvent[] {
  if (!analytics) return [];
  const events: BackstageEvent[] = [];

  for (const session of analytics.recentSessions || []) {
    events.push({
      type: session.source || "study",
      timestamp: session.started_at || new Date().toISOString(),
      duration: session.duration_minutes || 0,
      score: session.mcqs_correct || 0,
      total: session.mcqs_attempted || 0,
    });
  }

  for (const stat of analytics.dailyStats || []) {
    events.push({
      type: "mcq",
      timestamp: `${stat.date}T00:00:00.000Z`,
      duration: stat.study_minutes || 0,
      score: stat.mcqs_correct || 0,
      total: stat.mcqs_attempted || 0,
      topic: "Daily practice",
    });
  }

  return events;
}

function computeStats(events: BackstageEvent[]) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const weekEvents = events.filter(e => new Date(e.timestamp) >= weekAgo);
  const monthEvents = events.filter(e => new Date(e.timestamp) >= monthAgo);

  // Study hours (sum durations, default 15 min per event if no duration)
  const sumDuration = (evts: BackstageEvent[]) =>
    evts.reduce((sum, e) => sum + (e.duration || 15), 0) / 60;

  const weekHours = Math.round(sumDuration(weekEvents) * 10) / 10;
  const monthHours = Math.round(sumDuration(monthEvents) * 10) / 10;

  // Unique topics
  const weekTopics = new Set(weekEvents.filter(e => e.topic).map(e => e.topic)).size;
  const monthTopics = new Set(monthEvents.filter(e => e.topic).map(e => e.topic)).size;

  // Streak: consecutive days with events going back from today
  let streak = 0;
  const dateSet = new Set(events.map(e => new Date(e.timestamp).toDateString()));
  for (let d = new Date(); ; d.setDate(d.getDate() - 1)) {
    if (dateSet.has(d.toDateString())) streak++;
    else break;
  }

  // MCQ accuracy
  const mcqEvents = events.filter(e =>
    e.type === 'mcq' || e.type === 'quiz' || (e.score !== undefined && e.total !== undefined)
  );
  const weekMcq = mcqEvents.filter(e => new Date(e.timestamp) >= weekAgo);
  const totalCorrect = weekMcq.reduce((s, e) => s + (e.score || 0), 0);
  const totalQuestions = weekMcq.reduce((s, e) => s + (e.total || 0), 0);
  const mcqAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return { weekHours, monthHours, weekTopics, monthTopics, streak, mcqAccuracy };
}

function computeWeeklyChart(events: BackstageEvent[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const chart: { day: string; hours: number; mcqs: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const dayEvents = events.filter(e => new Date(e.timestamp).toDateString() === dateStr);
    const hours = Math.round(dayEvents.reduce((s, e) => s + (e.duration || 15), 0) / 60 * 10) / 10;
    const mcqs = dayEvents.filter(e => e.type === 'mcq' || e.type === 'quiz').reduce((s, e) => s + (e.total || 1), 0);
    chart.push({ day: days[d.getDay()], hours, mcqs });
  }
  return chart;
}

function computeRecentActivity(events: BackstageEvent[]) {
  const now = new Date();
  const iconMap: Record<string, { icon: typeof Target; color: string; type: string }> = {
    mcq: { icon: Target, color: "text-teal-400", type: "Assessment" },
    quiz: { icon: Target, color: "text-teal-400", type: "Quiz" },
    reading: { icon: BookOpen, color: "text-blue-400", type: "Reading" },
    review: { icon: Brain, color: "text-purple-400", type: "Review" },
    start: { icon: Play, color: "text-green-400", type: "Pathway" },
  };
  const defaultIcon = { icon: BookOpen, color: "text-blue-400", type: "Study" };

  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6)
    .map(e => {
      const info = iconMap[e.type] || defaultIcon;
      const diff = now.getTime() - new Date(e.timestamp).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const time = hours < 1 ? 'Just now' : hours < 24 ? `${hours} hours ago` : hours < 48 ? 'Yesterday' : `${Math.floor(hours / 24)} days ago`;
      const text = e.topic ? `${e.type === 'mcq' ? `Scored ${e.score || 0}/${e.total || 0} on` : e.type === 'reading' ? 'Read:' : 'Studied:'} ${e.topic}` : `Study session (${e.subject || 'General'})`;
      return { text, time, type: info.type, icon: info.icon, color: info.color };
    });
}

type DeskTask = {
  icon: LucideIcon;
  title: string;
  badge: string;
  badgeColor: string;
  subtitle: string;
  time: string;
  done: boolean;
  actionPath?: string;
};

// Fallback empty data
const emptyStudyPlanTasks: DeskTask[] = [
  { icon: BookOpen, title: "Start your first topic", badge: "Get Started", badgeColor: "bg-teal-500/20 text-teal-400", subtitle: "Head to the Library to begin", time: "—", done: false },
];

const emptyContinueItems: { title: string; subtitle: string; badge: string; badgeColor: string; progress: number; time: string }[] = [];

const emptyFocusAreas: { topic: string; accuracy: number; attempts: number; color: string }[] = [];

// --- Components ---
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", className)}>{children}</span>;
}

function ProgressBar({ value, className, barClass }: { value: number; className?: string; barClass?: string }) {
  return (
    <div className={cn("h-1.5 rounded-full bg-[#253545] overflow-hidden", className)}>
      <div className={cn("h-full rounded-full bg-[#5BB3B3] transition-all", barClass)} style={{ width: `${value}%` }} />
    </div>
  );
}

function StatCard({ label, value, change, extra }: { label: string; value: string; change: string; extra?: string }) {
  const isPositive = change.startsWith("+");
  return (
    <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-4 flex-1">
      <p className="text-[#6B7A88] text-xs">{label}</p>
      <p className="text-[#E8E0D5] text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={cn("text-xs font-medium", isPositive ? "text-green-400" : "text-[#6B7A88]")}>{change}</span>
        {extra && <span className="text-[10px] text-[#F97316]">{extra}</span>}
      </div>
    </Card>
  );
}

export default function DeskPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "graph">("overview");
  const [statsPeriod, setStatsPeriod] = useState<"week" | "month">("week");
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: studyPlan, isLoading: studyPlanLoading, error: studyPlanError } = useStudyPlan();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAnalytics(30);
  const { trackEvent } = useTrackEvent();

  const events = useMemo(() => buildEventsFromAnalytics(analytics), [analytics]);

  const stats = useMemo(() => computeStats(events), [events]);
  const weeklyChart = useMemo(() => computeWeeklyChart(events), [events]);
  const recentActivity = useMemo(() => computeRecentActivity(events), [events]);

  const hasData =
    (analytics?.totalStudyMinutes || 0) > 0 ||
    (studyPlan?.tasks?.length || 0) > 0 ||
    (studyPlan?.continue_learning?.length || 0) > 0;

  const studyPlanTasks = useMemo<DeskTask[]>(() => {
    const tasks = studyPlan?.tasks || [];
    if (tasks.length === 0) return emptyStudyPlanTasks;
    return tasks.slice(0, 4).map((task) => {
      const type = typeof task.type === "string" ? task.type : "study";
      const estimated = typeof task.estimated_minutes === "number" ? task.estimated_minutes : 15;
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
        icon: type === "mcq" ? Target : type === "review" ? Brain : BookOpen,
        title: typeof task.title === "string" ? task.title : "Study Task",
        badge: type,
        badgeColor: type === "mcq" ? "bg-orange-500/20 text-orange-400" : "bg-teal-500/20 text-teal-400",
        subtitle: typeof task.description === "string" ? task.description : "From your learning plan",
        time: `${estimated} min`,
        done: false,
        actionPath,
      };
    });
  }, [studyPlan?.tasks]);

  const continueItems = useMemo(() => {
    const items = studyPlan?.continue_learning || [];
    if (items.length === 0) return emptyContinueItems;
    return items.slice(0, 3).map((item) => ({
      title: typeof item.title === "string" ? item.title : "Continue topic",
      subtitle: typeof item.topic === "string" ? item.topic : "In progress",
      badge: typeof item.type === "string" ? item.type : "Study",
      badgeColor: "bg-indigo-500/20 text-indigo-400",
      progress: typeof item.progress_percent === "number" ? item.progress_percent : 0,
      time: typeof item.estimated_time === "number" ? `${item.estimated_time} min` : "Pending",
    }));
  }, [studyPlan?.continue_learning]);

  const focusAreas = useMemo(() => {
    const rows = (analytics?.dailyStats || [])
      .filter((d) => d.mcqs_attempted >= 5)
      .map((d) => ({
        topic: new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
        accuracy: d.mcqs_attempted > 0 ? Math.round((d.mcqs_correct / d.mcqs_attempted) * 100) : 0,
        attempts: d.mcqs_attempted,
      }))
      .filter((d) => d.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .map((d) => ({
        ...d,
        color: d.accuracy < 60 ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400",
      }));
    return rows.length > 0 ? rows : emptyFocusAreas;
  }, [analytics?.dailyStats]);

  const maxHours = Math.max(...weeklyChart.map((d) => d.hours), 1);
  const displayName = profile?.full_name || profile?.username || "User";
  const isLoading = profileLoading || studyPlanLoading || analyticsLoading;
  const error = profileError || studyPlanError || analyticsError;
  const activePathway = studyPlan?.active_pathway;
  const todayTotalMinutes = studyPlanTasks.reduce((total, task) => {
    const raw = Number.parseInt(task.time, 10);
    return total + (Number.isNaN(raw) ? 0 : raw);
  }, 0);
  const targetExam = profile?.target_exam || "Exam not set";
  const coachConfidence = hasData ? Math.min(95, 55 + Math.round(stats.mcqAccuracy * 0.4)) : 0;
  const coachFocusLabel = stats.mcqAccuracy < 70 ? "Weak Area" : "On Track";
  const recommendedChips = (studyPlan?.recommended || []).slice(0, 3).map((item, index) => {
    const title = typeof item.title === "string" ? item.title : `Recommendation ${index + 1}`;
    const minutes = typeof item.estimated_time === "number" ? `${item.estimated_time} min` : "15 min";
    const source = typeof item.specialty === "string" ? item.specialty : "Nucleux";
    return { title, minutes, source };
  });
  const primaryTaskMinutes = Number.parseInt(studyPlanTasks[0]?.time || "", 10);
  const coachSessionMinutes = Number.isNaN(primaryTaskMinutes) ? 20 : primaryTaskMinutes;
  const lastStudyText = analytics?.lastStudyDate
    ? new Date(analytics.lastStudyDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })
    : "No recent session";
  const pathwayStatus = activePathway ? "In Progress" : "Not Started";
  const hasFocusAreas = focusAreas.length > 0;
  const primaryTaskPath = studyPlanTasks[0]?.actionPath;

  const handleStartTodayPlan = () => {
    void trackEvent("task_started", {
      source: "desk_start_today_plan",
      target_path: primaryTaskPath || "/library",
      task_title: studyPlanTasks[0]?.title || null,
    });
    if (primaryTaskPath) {
      router.push(primaryTaskPath);
      return;
    }
    router.push("/library");
  };

  const handleContinueLearning = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_continue_learning",
      has_active_pathway: !!activePathway,
      continue_items: continueItems.length,
    });
    if (activePathway) {
      router.push("/pathways");
      return;
    }
    if (continueItems.length > 0) {
      router.push("/library");
      return;
    }
    router.push("/library");
  };

  const handlePracticeWeakAreas = () => {
    if (!hasFocusAreas) return;
    void trackEvent("recommendation_clicked", {
      source: "desk_practice_weak_areas",
      weak_area_count: focusAreas.length,
    });
    router.push("/mcqs?mode=practice&type=mixed&focus=weak");
  };

  const handleAskWhy = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_ask_why",
      accuracy: stats.mcqAccuracy,
    });
    router.push(`/chat?context=desk-coach&accuracy=${stats.mcqAccuracy}`);
  };

  const handleOpenConnectedTopics = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_graph_connected_topics",
      topics_week: stats.weekTopics,
    });
    router.push("/library");
  };

  const handleOpenRetrievalStrength = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_graph_retrieval_strength",
      retrieval_accuracy: stats.mcqAccuracy,
    });
    router.push("/mcqs?mode=quiz&type=retrieval");
  };

  const handleOpenPathwayProgress = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_graph_pathway_progress",
      has_active_pathway: !!activePathway,
      pathway_progress: activePathway?.progress_percent || 0,
    });
    router.push(activePathway ? "/pathways" : "/library");
  };

  const handleOpenWeeklySignal = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_graph_open_analytics",
    });
    router.push("/analytics");
  };

  const handleStartFirstTopic = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_empty_start_first_topic",
    });
    router.push("/library");
  };

  const handleStartFirstPathway = () => {
    void trackEvent("recommendation_clicked", {
      source: "desk_empty_start_first_pathway",
    });
    router.push("/pathways");
  };

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={studyPlan || analytics || profile}
      loadingText="Loading your desk..."
      errorText="Unable to load your desk right now."
      className="bg-[#2D3E50]"
    >
    <div className="min-h-screen bg-[#2D3E50] p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#E8E0D5]">{getGreeting()}, {displayName}! 👋</h1>
          <p className="text-[#A0B0BC] text-sm mt-1">Ready to continue your learning pathway? · {formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {stats.streak} Day Streak</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400">{targetExam}</Badge>
        </div>
      </div>
      <div className="flex gap-2">
        {(["overview", "graph"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              void trackEvent("recommendation_clicked", {
                source: "desk_tab_switch",
                tab: t,
              });
            }}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", activeTab === t ? "bg-[#5BB3B3] text-white" : "bg-[#1B2838] text-[#A0B0BC] hover:text-[#E8E0D5]")}
          >
            {t === "overview" ? "Overview" : "Knowledge Graph"}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
      <>
      {/* 2. ATOM Study Coach */}
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#5EEAD4] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[#E8E0D5] font-semibold">ATOM Study Coach</h2>
              <Badge className={stats.mcqAccuracy < 70 ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}>{coachFocusLabel}</Badge>
              <span className="ml-auto text-sm text-[#A0B0BC]">{coachConfidence}% confidence</span>
            </div>
            <ProgressBar value={stats.mcqAccuracy || 0} className="mt-2 h-2" barClass={stats.mcqAccuracy < 60 ? "bg-[#F97316]" : "bg-[#5BB3B3]"} />
            <p className="text-[#A0B0BC] text-sm mt-2 italic">{hasData ? `&quot;Your overall accuracy is ${stats.mcqAccuracy}%. ${stats.mcqAccuracy < 70 ? "Let's strengthen this together." : "Great progress!"}&quot;` : `&quot;Start studying to see your personalized insights here.&quot;`}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {recommendedChips.map((t) => (
                <span key={t.title} className="bg-[#253545] text-[#E8E0D5] text-xs px-3 py-1.5 rounded-lg border border-[rgba(232,224,213,0.06)]">
                  {t.title} · <span className="text-[#6B7A88]">{t.minutes} · {t.source}</span>
                </span>
              ))}
              {recommendedChips.length === 0 && (
                <span className="bg-[#253545] text-[#E8E0D5] text-xs px-3 py-1.5 rounded-lg border border-[rgba(232,224,213,0.06)]">
                  Complete more sessions to unlock targeted recommendations.
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7A88]">
              <span>{studyPlan?.today?.study_minutes || 0} min studied today</span>
              <span>{studyPlan?.today?.mcqs_attempted || 0} MCQs today</span>
              <span>{coachSessionMinutes} min suggested</span>
              <span>Last studied: {lastStudyText}</span>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Start {coachSessionMinutes}-min Review</button>
              <button onClick={handleAskWhy} className="border border-[rgba(232,224,213,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5] px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"><Bookmark className="w-3.5 h-3.5" /> Ask Why</button>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Today's Study Plan */}
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[#E8E0D5] font-semibold text-lg">Today&apos;s Study Plan</h2>
            <span className="text-[#6B7A88] text-sm">~{todayTotalMinutes} min</span>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {stats.streak} day streak</Badge>
        </div>
        <div className="space-y-2">
          {studyPlanTasks.map((task, i) => (
            <div
              key={i}
              onClick={() => {
                if (!task.actionPath) return;
                void trackEvent("task_started", {
                  source: "desk_task_card",
                  task_title: task.title,
                  target_path: task.actionPath,
                });
                router.push(task.actionPath);
              }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                task.done ? "bg-[#253545]/50 opacity-60" : "bg-[#253545] hover:bg-[#2a3f52]",
                task.actionPath ? "cursor-pointer" : ""
              )}
            >
              {task.done ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <Circle className="w-5 h-5 text-[#6B7A88] shrink-0" />}
              <task.icon className="w-4 h-4 text-[#5BB3B3] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium", task.done ? "line-through text-[#6B7A88]" : "text-[#E8E0D5]")}>{task.title}</span>
                  <Badge className={task.badgeColor}>{task.badge}</Badge>
                </div>
                <p className="text-xs text-[#6B7A88]">{task.subtitle}</p>
              </div>
              <span className="text-sm text-[#A0B0BC] shrink-0 flex items-center gap-1">{task.time} <ChevronRight className="w-3 h-3" /></span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(232,224,213,0.06)]">
          <div className="text-xs text-[#6B7A88]">{studyPlan?.tasks?.length || 0} tasks generated for today based on your goals.</div>
        </div>
          <button onClick={handleStartTodayPlan} className="w-full mt-3 bg-[#5BB3B3] hover:bg-[#4a9e9e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">Start Today&apos;s Plan</button>
        <p className="text-[10px] text-[#6B7A88] mt-2 text-center">💡 Interleaved learning: Topics mix review, new content, and retrieval for optimal retention</p>
      </Card>

      {/* 4. Continue + Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-3">Continue Where You Left</h3>
          <div className="space-y-3">
            {continueItems.length === 0 && (
              <div className="bg-[#253545] rounded-xl p-4">
                <p className="text-sm text-[#E8E0D5]">No in-progress topics yet.</p>
                <p className="text-xs text-[#6B7A88] mt-1">Start one topic and it will appear here for fast resume.</p>
                <button onClick={handleStartFirstTopic} className="mt-3 text-xs text-[#5BB3B3] hover:underline">
                  Start from Library
                </button>
              </div>
            )}
            {continueItems.map((item, i) => (
              <div key={i} className="bg-[#253545] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#E8E0D5]">{item.title}</span>
                    <Badge className={item.badgeColor}>{item.badge}</Badge>
                  </div>
                  <span className="text-xs text-[#6B7A88]">{item.time}</span>
                </div>
                <p className="text-xs text-[#6B7A88] mb-2">{item.subtitle}</p>
                <ProgressBar value={item.progress} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-3">Your Learning This Week</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Retrieval Accuracy", value: `${stats.mcqAccuracy}%`, target: 85, current: stats.mcqAccuracy },
              { label: "Study Hours", value: `${stats.weekHours}h`, target: 20, current: stats.weekHours },
              { label: "Topics Covered", value: `${stats.weekTopics}`, extra: hasData ? "This week" : "No data" },
              { label: "Learning Streak", value: `${stats.streak} days`, extra: stats.streak > 0 ? "Keep going!" : "Start today" },
            ].map((m, i) => (
              <div key={i} className="bg-[#253545] rounded-xl p-3">
                <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">{m.label}</p>
                <p className="text-xl font-bold text-[#E8E0D5] mt-1">{m.value}</p>
                {m.target && <ProgressBar value={(m.current! / m.target) * 100} className="mt-2" />}
                {m.extra && <p className="text-[10px] text-[#5BB3B3] mt-1">{m.extra}</p>}
              </div>
            ))}
          </div>
            <div className="bg-[#253545] rounded-xl p-3 mt-3 flex gap-2 items-start">
            <Star className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-[#E8E0D5] font-medium">Key Insight</p>
              <p className="text-xs text-[#A0B0BC]">
                {analytics?.avgAccuracy
                  ? `Current rolling accuracy is ${analytics.avgAccuracy}%. Keep logging MCQs for sharper recommendations.`
                  : "Complete a few MCQ sets to unlock stronger accuracy guidance."}
              </p>
            </div>
          </div>
          <button className="text-xs text-[#5BB3B3] mt-2 hover:underline">Why these metrics?</button>
        </Card>
      </div>

      {/* 5. Stats Row */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {(["week", "month"] as const).map((p) => (
            <button key={p} onClick={() => setStatsPeriod(p)} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors", statsPeriod === p ? "bg-[#5BB3B3] text-white" : "bg-[#1B2838] text-[#A0B0BC]")}>
              This {p === "week" ? "Week" : "Month"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Study Hours" value={`${statsPeriod === 'week' ? stats.weekHours : stats.monthHours} hrs`} change={hasData ? "From events" : "No data yet"} />
          <StatCard label="Topics Completed" value={`${statsPeriod === 'week' ? stats.weekTopics : stats.monthTopics}`} change={hasData ? "Unique topics" : "No data yet"} />
          <StatCard label="Current Streak" value={`${stats.streak} days`} change={stats.streak > 0 ? "Keep going!" : "Start today!"} extra={stats.streak >= 7 ? "🔥" : undefined} />
          <StatCard label="MCQ Accuracy" value={`${stats.mcqAccuracy}%`} change={hasData ? "This week" : "No MCQs yet"} />
        </div>
      </div>

      {/* 6. Study Progress Chart */}
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#E8E0D5] font-semibold">Study Progress</h3>
          <div className="flex items-center gap-3 text-xs text-[#6B7A88]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#5BB3B3]" /> Study Hours</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#E879F9]" /> MCQs Answered</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {weeklyChart.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-32 relative">
                <div className="w-full max-w-8 bg-[#5BB3B3] rounded-t-md transition-all" style={{ height: `${(d.hours / (maxHours + 1)) * 100}%` }} />
                <div className="absolute top-0 w-2 h-2 rounded-full bg-[#E879F9]" style={{ bottom: `${(d.mcqs / 100) * 100}%`, top: "auto" }} />
              </div>
              <span className="text-[10px] text-[#6B7A88]">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 7. Pathway + Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#E8E0D5] font-semibold">Current Pathway</h3>
            <Badge className={activePathway ? "bg-teal-500/20 text-teal-400" : "bg-[#253545] text-[#A0B0BC]"}>{pathwayStatus}</Badge>
          </div>
          <p className="text-[#A0B0BC] text-sm">
            {activePathway ? `${activePathway.title} · ${activePathway.current_atom_index}/${activePathway.total_atoms} topics` : "No active pathway yet"}
          </p>
          <ProgressBar value={activePathway?.progress_percent || 0} className="mt-2 h-2" />
          <p className="text-xs text-[#6B7A88] mt-1 text-right">{activePathway?.progress_percent || 0}%</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-[#5BB3B3]" />
              <span className="text-[#6B7A88]">Reading:</span>
              <span className="text-[#E8E0D5]">{continueItems[0]?.title || "Start a new topic"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-[#6B7A88]" />
              <span className="text-[#6B7A88]">Up Next:</span>
              <span className="text-[#A0B0BC]">{continueItems[1]?.title || "Follow your recommended plan"}</span>
            </div>
          </div>
          {!activePathway && (
            <div className="mt-3 bg-[#253545] rounded-xl p-3">
              <p className="text-xs text-[#A0B0BC]">No active pathway is currently tracking your progress.</p>
              <button onClick={handleStartFirstPathway} className="mt-2 text-xs text-[#5BB3B3] hover:underline">
                Start your first pathway
              </button>
            </div>
          )}
          <button onClick={handleContinueLearning} className="mt-4 text-[#5BB3B3] text-sm font-medium hover:underline flex items-center gap-1">Continue Learning <ChevronRight className="w-4 h-4" /></button>
        </Card>

        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-1">Focus Areas</h3>
          <p className="text-xs text-[#6B7A88] mb-3">ATOM flagged these topics based on your MCQ performance:</p>
          <div className="space-y-3">
            {focusAreas.length === 0 && (
              <div className="bg-[#253545] rounded-xl p-4">
                <p className="text-sm text-[#E8E0D5]">No weak areas detected yet.</p>
                <p className="text-xs text-[#6B7A88] mt-1">Take a retrieval quiz to generate targeted weak-area insights.</p>
                <button onClick={handleOpenRetrievalStrength} className="mt-3 text-xs text-[#5BB3B3] hover:underline">
                  Take diagnostic quiz
                </button>
              </div>
            )}
            {focusAreas.map((a, i) => (
              <div key={i} className="bg-[#253545] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#E8E0D5]">{a.topic}</span>
                  <Badge className={a.color}>{a.accuracy}%</Badge>
                </div>
                <p className="text-[10px] text-[#6B7A88] mb-1.5">{a.attempts} attempts</p>
                <ProgressBar value={a.accuracy} barClass={a.accuracy < 60 ? "bg-red-400" : "bg-orange-400"} />
              </div>
            ))}
          </div>
          <button onClick={handlePracticeWeakAreas} className="mt-3 text-[#5BB3B3] text-sm font-medium hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!hasFocusAreas}><AlertTriangle className="w-3.5 h-3.5" /> Practice Weak Areas</button>
        </Card>
      </div>

      {/* 8. Recent Activity */}
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <h3 className="text-[#E8E0D5] font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length === 0 && (
            <p className="text-sm text-[#6B7A88] text-center py-4">No activity yet. Start studying to see your progress here!</p>
          )}
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5"><a.icon className={cn("w-4 h-4", a.color)} /></div>
              <div className="flex-1">
                <p className="text-sm text-[#E8E0D5]">{a.text}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#6B7A88]">{a.time}</span>
                  <Badge className="bg-[#253545] text-[#A0B0BC]">{a.type}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      </>
      ) : (
      <>
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#E8E0D5] font-semibold text-lg">Knowledge Graph Snapshot</h2>
          <Badge className="bg-[#253545] text-[#A0B0BC]">Live from your activity</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={handleOpenConnectedTopics} className="bg-[#253545] rounded-xl p-4 text-left hover:bg-[#2a3f52] transition-colors">
            <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">Connected Topics</p>
            <p className="text-2xl font-bold text-[#E8E0D5] mt-1">{stats.weekTopics}</p>
            <p className="text-xs text-[#A0B0BC] mt-1">Topics touched in the last 7 days</p>
          </button>
          <button onClick={handleOpenRetrievalStrength} className="bg-[#253545] rounded-xl p-4 text-left hover:bg-[#2a3f52] transition-colors">
            <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">Retrieval Strength</p>
            <p className="text-2xl font-bold text-[#E8E0D5] mt-1">{stats.mcqAccuracy}%</p>
            <p className="text-xs text-[#A0B0BC] mt-1">Current signal from MCQ attempts</p>
          </button>
          <button onClick={handleOpenPathwayProgress} className="bg-[#253545] rounded-xl p-4 text-left hover:bg-[#2a3f52] transition-colors">
            <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">Active Pathway</p>
            <p className="text-2xl font-bold text-[#E8E0D5] mt-1">{activePathway?.progress_percent || 0}%</p>
            <p className="text-xs text-[#A0B0BC] mt-1">{activePathway?.title || "No active pathway"}</p>
          </button>
        </div>
      </Card>

      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#E8E0D5] font-semibold">Weekly Signal Flow</h3>
          <button onClick={handleOpenWeeklySignal} className="text-xs text-[#5BB3B3] hover:underline">Open full analytics</button>
        </div>
        <div className="flex items-end gap-2 h-44">
          {weeklyChart.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-36 relative">
                <div className="w-full max-w-8 bg-[#5BB3B3] rounded-t-md transition-all" style={{ height: `${(d.hours / (maxHours + 1)) * 100}%` }} />
                <div className="absolute top-0 w-2 h-2 rounded-full bg-[#E879F9]" style={{ bottom: `${(d.mcqs / 100) * 100}%`, top: "auto" }} />
              </div>
              <span className="text-[10px] text-[#6B7A88]">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-1">Weak Links</h3>
          <p className="text-xs text-[#6B7A88] mb-3">Low-accuracy areas detected from recent attempts.</p>
          <div className="space-y-3">
            {focusAreas.length === 0 && (
              <p className="text-sm text-[#6B7A88]">No weak links detected this week.</p>
            )}
            {focusAreas.map((a, i) => (
              <div key={i} className="bg-[#253545] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#E8E0D5]">{a.topic}</span>
                  <Badge className={a.color}>{a.accuracy}%</Badge>
                </div>
                <p className="text-[10px] text-[#6B7A88] mb-1.5">{a.attempts} attempts</p>
                <ProgressBar value={a.accuracy} barClass={a.accuracy < 60 ? "bg-red-400" : "bg-orange-400"} />
              </div>
            ))}
          </div>
          <button onClick={handlePracticeWeakAreas} className="mt-3 text-[#5BB3B3] text-sm font-medium hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!hasFocusAreas}><AlertTriangle className="w-3.5 h-3.5" /> Practice Weak Areas</button>
        </Card>

        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-[#6B7A88] text-center py-4">No activity yet. Start studying to populate your graph.</p>
            )}
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5"><a.icon className={cn("w-4 h-4", a.color)} /></div>
                <div className="flex-1">
                  <p className="text-sm text-[#E8E0D5]">{a.text}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#6B7A88]">{a.time}</span>
                    <Badge className="bg-[#253545] text-[#A0B0BC]">{a.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      </>
      )}
    </div>
    </ApiStateBoundary>
  );
}
