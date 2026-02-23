"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Flame, BookOpen, ChevronRight, Target,
  Brain, Star, AlertTriangle, Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics, useProfile, useStudyPlan, useTrackEvent } from "@/lib/api/hooks";
import { ApiStateBoundary } from "@/components/api-state-boundary";

import { Badge, ProgressBar } from "@/components/desk/shared";
import { StatCard } from "@/components/desk/StatCard";
import { StudyCoach } from "@/components/desk/StudyCoach";
import { TodaysPlan, type DeskTask } from "@/components/desk/TodaysPlan";
import { WeeklyChart } from "@/components/desk/WeeklyChart";
import { KnowledgeGraph } from "@/components/desk/KnowledgeGraph";
import { RecentActivity } from "@/components/desk/RecentActivity";

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

  const sumDuration = (evts: BackstageEvent[]) =>
    evts.reduce((sum, e) => sum + (e.duration || 15), 0) / 60;

  const weekHours = Math.round(sumDuration(weekEvents) * 10) / 10;
  const monthHours = Math.round(sumDuration(monthEvents) * 10) / 10;

  const weekTopics = new Set(weekEvents.filter(e => e.topic).map(e => e.topic)).size;
  const monthTopics = new Set(monthEvents.filter(e => e.topic).map(e => e.topic)).size;

  let streak = 0;
  const dateSet = new Set(events.map(e => new Date(e.timestamp).toDateString()));
  for (let d = new Date(); ; d.setDate(d.getDate() - 1)) {
    if (dateSet.has(d.toDateString())) streak++;
    else break;
  }

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

// Fallback empty data
const emptyStudyPlanTasks: DeskTask[] = [
  { icon: BookOpen, title: "Start your first topic", badge: "Get Started", badgeColor: "bg-teal-500/20 text-teal-400", subtitle: "Head to the Library to begin", time: "—", done: false },
];

const emptyContinueItems: { title: string; subtitle: string; badge: string; badgeColor: string; progress: number; time: string }[] = [];

const emptyFocusAreas: { topic: string; accuracy: number; attempts: number; color: string }[] = [];

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
        type === "mcq" ? "/mcqs?mode=practice&type=mixed"
          : type === "review" ? "/mcqs?mode=quiz&type=retrieval"
            : slug ? `/read/${slug}` : atomId ? `/read/${atomId}` : "/library";
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
      .map((d) => ({ ...d, color: d.accuracy < 60 ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400" }));
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

  // --- Handlers ---
  const handleStartTodayPlan = () => {
    void trackEvent("task_started", { source: "desk_start_today_plan", target_path: primaryTaskPath || "/library", task_title: studyPlanTasks[0]?.title || null });
    router.push(primaryTaskPath || "/library");
  };

  const handleTaskClick = (task: DeskTask) => {
    if (!task.actionPath) return;
    void trackEvent("task_started", { source: "desk_task_card", task_title: task.title, target_path: task.actionPath });
    router.push(task.actionPath);
  };

  const handleContinueLearning = () => {
    void trackEvent("recommendation_clicked", { source: "desk_continue_learning", has_active_pathway: !!activePathway, continue_items: continueItems.length });
    router.push(activePathway ? "/pathways" : "/library");
  };

  const handlePracticeWeakAreas = () => {
    if (!hasFocusAreas) return;
    void trackEvent("recommendation_clicked", { source: "desk_practice_weak_areas", weak_area_count: focusAreas.length });
    router.push("/mcqs?mode=practice&type=mixed&focus=weak");
  };

  const handleAskWhy = () => {
    void trackEvent("recommendation_clicked", { source: "desk_ask_why", accuracy: stats.mcqAccuracy });
    router.push(`/chat?context=desk-coach&accuracy=${stats.mcqAccuracy}`);
  };

  const nav = (source: string, path: string, extra: Record<string, unknown> = {}) => {
    void trackEvent("recommendation_clicked", { source, ...extra });
    router.push(path);
  };

  return (
    <ApiStateBoundary isLoading={isLoading} error={error} data={studyPlan || analytics || profile} loadingText="Loading your desk..." errorText="Unable to load your desk right now." className="bg-[#2D3E50]">
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

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {(["overview", "graph"] as const).map((t) => (
          <button key={t} onClick={() => { setActiveTab(t); void trackEvent("recommendation_clicked", { source: "desk_tab_switch", tab: t }); }}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", activeTab === t ? "bg-[#5BB3B3] text-white" : "bg-[#1B2838] text-[#A0B0BC] hover:text-[#E8E0D5]")}>
            {t === "overview" ? "Overview" : "Knowledge Graph"}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
      <>
        <StudyCoach stats={stats} hasData={hasData} coachFocusLabel={coachFocusLabel} coachConfidence={coachConfidence} coachSessionMinutes={coachSessionMinutes} lastStudyText={lastStudyText} recommendedChips={recommendedChips} studyPlanToday={studyPlan?.today} onAskWhy={handleAskWhy} />

        <TodaysPlan tasks={studyPlanTasks} streak={stats.streak} todayTotalMinutes={todayTotalMinutes} totalTaskCount={studyPlan?.tasks?.length || 0} onTaskClick={handleTaskClick} onStartPlan={handleStartTodayPlan} />

        {/* Continue + Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
            <h3 className="text-[#E8E0D5] font-semibold mb-3">Continue Where You Left</h3>
            <div className="space-y-3">
              {continueItems.length === 0 && (
                <div className="bg-[#253545] rounded-xl p-4">
                  <p className="text-sm text-[#E8E0D5]">No in-progress topics yet.</p>
                  <p className="text-xs text-[#6B7A88] mt-1">Start one topic and it will appear here for fast resume.</p>
                  <button onClick={() => nav("desk_empty_start_first_topic", "/library")} className="mt-3 text-xs text-[#5BB3B3] hover:underline">Start from Library</button>
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
                  {analytics?.avgAccuracy ? `Current rolling accuracy is ${analytics.avgAccuracy}%. Keep logging MCQs for sharper recommendations.` : "Complete a few MCQ sets to unlock stronger accuracy guidance."}
                </p>
              </div>
            </div>
            <button className="text-xs text-[#5BB3B3] mt-2 hover:underline">Why these metrics?</button>
          </Card>
        </div>

        {/* Stats Row */}
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

        <WeeklyChart weeklyChart={weeklyChart} maxHours={maxHours} />

        {/* Pathway + Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#E8E0D5] font-semibold">Current Pathway</h3>
              <Badge className={activePathway ? "bg-teal-500/20 text-teal-400" : "bg-[#253545] text-[#A0B0BC]"}>{pathwayStatus}</Badge>
            </div>
            <p className="text-[#A0B0BC] text-sm">{activePathway ? `${activePathway.title} · ${activePathway.current_atom_index}/${activePathway.total_atoms} topics` : "No active pathway yet"}</p>
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
                <button onClick={() => nav("desk_empty_start_first_pathway", "/pathways")} className="mt-2 text-xs text-[#5BB3B3] hover:underline">Start your first pathway</button>
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
                  <button onClick={() => nav("desk_graph_retrieval_strength", "/mcqs?mode=quiz&type=retrieval", { retrieval_accuracy: stats.mcqAccuracy })} className="mt-3 text-xs text-[#5BB3B3] hover:underline">Take diagnostic quiz</button>
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

        <RecentActivity recentActivity={recentActivity} />
      </>
      ) : (
        <KnowledgeGraph
          stats={stats}
          activePathway={activePathway}
          weeklyChart={weeklyChart}
          maxHours={maxHours}
          focusAreas={focusAreas}
          recentActivity={recentActivity}
          hasFocusAreas={hasFocusAreas}
          onConnectedTopics={() => nav("desk_graph_connected_topics", "/library", { topics_week: stats.weekTopics })}
          onRetrievalStrength={() => nav("desk_graph_retrieval_strength", "/mcqs?mode=quiz&type=retrieval", { retrieval_accuracy: stats.mcqAccuracy })}
          onPathwayProgress={() => nav("desk_graph_pathway_progress", activePathway ? "/pathways" : "/library", { has_active_pathway: !!activePathway, pathway_progress: activePathway?.progress_percent || 0 })}
          onWeeklySignal={() => nav("desk_graph_open_analytics", "/analytics")}
          onPracticeWeakAreas={handlePracticeWeakAreas}
        />
      )}
    </div>
    </ApiStateBoundary>
  );
}
