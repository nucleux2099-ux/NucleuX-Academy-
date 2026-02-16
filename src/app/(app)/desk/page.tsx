"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Flame, BookOpen, Clock, ChevronRight, Target, TrendingUp,
  Bookmark, Brain, Zap, CheckCircle2, Circle, Play,
  BarChart3, Award, Activity, Star, MessageSquare, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function loadBackstageEvents(): BackstageEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nx_backstage_events');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadPocketNotes(): unknown[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nx_pocket_notes');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
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

// Fallback empty data
const emptyStudyPlanTasks = [
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
  const [activeTab, setActiveTab] = useState<"overview" | "graph">("overview");
  const [statsPeriod, setStatsPeriod] = useState<"week" | "month">("week");
  const [events, setEvents] = useState<BackstageEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEvents(loadBackstageEvents());
    setMounted(true);
  }, []);

  const stats = useMemo(() => computeStats(events), [events]);
  const weeklyChart = useMemo(() => computeWeeklyChart(events), [events]);
  const recentActivity = useMemo(() => computeRecentActivity(events), [events]);

  const hasData = events.length > 0;
  const studyPlanTasks = hasData ? events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4)
    .map(e => ({
      icon: e.type === 'mcq' ? Target : e.type === 'review' ? Brain : BookOpen,
      title: e.topic || e.subject || 'Study Session',
      badge: e.type || 'Study',
      badgeColor: e.type === 'mcq' ? "bg-orange-500/20 text-orange-400" : "bg-teal-500/20 text-teal-400",
      subtitle: e.subject || 'General',
      time: `${e.duration || 15} min`,
      done: true,
    })) : emptyStudyPlanTasks;

  const continueItems = emptyContinueItems;
  const focusAreas = emptyFocusAreas;

  const maxHours = Math.max(...weeklyChart.map((d) => d.hours), 1);

  return (
    <div className="min-h-screen bg-[#2D3E50] p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#E8E0D5]">{getGreeting()}, User! 👋</h1>
          <p className="text-[#A0B0BC] text-sm mt-1">Ready to continue your Surgery pathway? · {formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {stats.streak} Day Streak</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400">NEET PG 202X</Badge>
        </div>
      </div>
      <div className="flex gap-2">
        {(["overview", "graph"] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", activeTab === t ? "bg-[#5BB3B3] text-white" : "bg-[#1B2838] text-[#A0B0BC] hover:text-[#E8E0D5]")}>
            {t === "overview" ? "Overview" : "Knowledge Graph"}
          </button>
        ))}
      </div>

      {/* 2. ATOM Study Coach */}
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#5EEAD4] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[#E8E0D5] font-semibold">ATOM Study Coach</h2>
              <Badge className="bg-orange-500/20 text-orange-400">Weak Area</Badge>
              <span className="ml-auto text-sm text-[#A0B0BC]">84% confidence</span>
            </div>
            <ProgressBar value={stats.mcqAccuracy || 0} className="mt-2 h-2" barClass={stats.mcqAccuracy < 60 ? "bg-[#F97316]" : "bg-[#5BB3B3]"} />
            <p className="text-[#A0B0BC] text-sm mt-2 italic">{hasData ? `&quot;Your overall accuracy is ${stats.mcqAccuracy}%. ${stats.mcqAccuracy < 70 ? "Let's strengthen this together." : "Great progress!"}&quot;` : `&quot;Start studying to see your personalized insights here.&quot;`}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[{ name: "Variceal Bleeding", time: "15 min", src: "Shackelford Ch.35" }, { name: "Child-Pugh Score", time: "10 min", src: "Harrison's Ch.12" }, { name: "TIPS Procedure", time: "20 min", src: "Sabiston Ch.54" }].map((t) => (
                <span key={t.name} className="bg-[#253545] text-[#E8E0D5] text-xs px-3 py-1.5 rounded-lg border border-[rgba(232,224,213,0.06)]">
                  {t.name} · <span className="text-[#6B7A88]">{t.time} · {t.src}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7A88]">
              <span>+50 coins</span><span>+5 XP</span><span>45 min</span><span>Last reviewed: 3 days ago</span>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Start 45-min Review</button>
              <button className="border border-[rgba(232,224,213,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5] px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"><Bookmark className="w-3.5 h-3.5" /> Ask Why</button>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Today's Study Plan */}
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[#E8E0D5] font-semibold text-lg">Today&apos;s Study Plan</h2>
            <span className="text-[#6B7A88] text-sm">~70 min</span>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {stats.streak} day streak</Badge>
        </div>
        <div className="space-y-2">
          {studyPlanTasks.map((task, i) => (
            <div key={i} className={cn("flex items-center gap-3 p-3 rounded-xl transition-colors", task.done ? "bg-[#253545]/50 opacity-60" : "bg-[#253545] hover:bg-[#2a3f52]")}>
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
          <div className="text-xs text-[#6B7A88]">Complete all tasks: <span className="text-[#F97316]">+100 coins bonus</span>, <span className="text-[#5BB3B3]">+15 XP total</span></div>
        </div>
        <button className="w-full mt-3 bg-[#5BB3B3] hover:bg-[#4a9e9e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">Start Today&apos;s Plan (145 coins available)</button>
        <p className="text-[10px] text-[#6B7A88] mt-2 text-center">💡 Interleaved learning: Topics mix review, new content, and retrieval for optimal retention</p>
      </Card>

      {/* 4. Continue + Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-3">Continue Where You Left</h3>
          <div className="space-y-3">
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
              <p className="text-xs text-[#A0B0BC]">Your retrieval accuracy peaks during morning sessions. Consider scheduling weak areas before noon.</p>
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
            <Badge className="bg-teal-500/20 text-teal-400">In Progress</Badge>
          </div>
          <p className="text-[#A0B0BC] text-sm">Surgical GI Mastery · 16/24 topics</p>
          <ProgressBar value={85} className="mt-2 h-2" />
          <p className="text-xs text-[#6B7A88] mt-1 text-right">85%</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-[#5BB3B3]" />
              <span className="text-[#6B7A88]">Reading:</span>
              <span className="text-[#E8E0D5]">Hepatobiliary Anatomy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-[#6B7A88]" />
              <span className="text-[#6B7A88]">Up Next:</span>
              <span className="text-[#A0B0BC]">Biliary Tract Surgery</span>
            </div>
          </div>
          <button className="mt-4 text-[#5BB3B3] text-sm font-medium hover:underline flex items-center gap-1">Continue Learning <ChevronRight className="w-4 h-4" /></button>
        </Card>

        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-1">Focus Areas</h3>
          <p className="text-xs text-[#6B7A88] mb-3">ATOM flagged these topics based on your MCQ performance:</p>
          <div className="space-y-3">
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
          <button className="mt-3 text-[#5BB3B3] text-sm font-medium hover:underline flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Practice Weak Areas</button>
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
    </div>
  );
}
