"use client";

import { useState } from "react";
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

// --- Mock Data ---
const studyPlanTasks = [
  { icon: Brain, title: "Portal Hypertension Review", badge: "Spaced Rep", badgeColor: "bg-purple-500/20 text-purple-400", subtitle: "Surgical GI · Weak Area", time: "15 min", done: false },
  { icon: BookOpen, title: "Hepatobiliary Anatomy", badge: "New Content", badgeColor: "bg-teal-500/20 text-teal-400", subtitle: "Surgical GI Mastery", time: "20 min", done: false },
  { icon: Target, title: "Upper GI MCQ Set", badge: "MCQ Practice", badgeColor: "bg-orange-500/20 text-orange-400", subtitle: "30 questions · Mixed difficulty", time: "20 min", done: false },
  { icon: CheckCircle2, title: "Esophageal Surgery Notes", badge: "Review", badgeColor: "bg-green-500/20 text-green-400", subtitle: "Quick review before moving on", time: "15 min", done: true },
];

const continueItems = [
  { title: "Portal Hypertension", subtitle: "Surgical GI · Chapter 12", badge: "Reading", badgeColor: "bg-blue-500/20 text-blue-400", progress: 65, time: "8 min left" },
  { title: "Appendicitis MCQs", subtitle: "Assessment · 30 questions", badge: "MCQ", badgeColor: "bg-orange-500/20 text-orange-400", progress: 40, time: "12 min left" },
  { title: "Hepatobiliary Module", subtitle: "Surgical GI Mastery", badge: "New", badgeColor: "bg-green-500/20 text-green-400", progress: 0, time: "Start" },
];

const weeklyChart = [
  { day: "Mon", hours: 3.5, mcqs: 45 },
  { day: "Tue", hours: 4.2, mcqs: 60 },
  { day: "Wed", hours: 2.8, mcqs: 35 },
  { day: "Thu", hours: 5.1, mcqs: 80 },
  { day: "Fri", hours: 3.0, mcqs: 50 },
  { day: "Sat", hours: 6.2, mcqs: 90 },
  { day: "Sun", hours: 1.5, mcqs: 20 },
];

const focusAreas = [
  { topic: "Portal Hypertension", accuracy: 52, attempts: 23, color: "text-red-400 bg-red-500/20" },
  { topic: "Biliary Anatomy", accuracy: 61, attempts: 18, color: "text-orange-400 bg-orange-500/20" },
  { topic: "Peptic Ulcer Disease", accuracy: 67, attempts: 15, color: "text-orange-400 bg-orange-500/20" },
];

const recentActivity = [
  { text: "Scored 85% on Appendicitis MCQs", time: "2 hours ago", type: "Assessment", icon: Target, color: "text-teal-400" },
  { text: "Completed: Inguinal Hernia — Anatomy & Classification", time: "4 hours ago", type: "Reading", icon: BookOpen, color: "text-blue-400" },
  { text: "Started: Hepatobiliary Surgery Module", time: "Yesterday", type: "Pathway", icon: Play, color: "text-green-400" },
  { text: "Reviewed: Portal Hypertension — Weak Area", time: "2 days ago", type: "Review", icon: Brain, color: "text-purple-400" },
];

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
  const maxHours = Math.max(...weeklyChart.map((d) => d.hours));

  return (
    <div className="min-h-screen bg-[#2D3E50] p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#E8E0D5]">{getGreeting()}, User! 👋</h1>
          <p className="text-[#A0B0BC] text-sm mt-1">Ready to continue your Surgery pathway? · {formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> 12 Day Streak</Badge>
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
            <ProgressBar value={52} className="mt-2 h-2" barClass="bg-[#F97316]" />
            <p className="text-[#A0B0BC] text-sm mt-2 italic">&quot;Your Portal Hypertension accuracy is 52%. Let&apos;s strengthen this together.&quot;</p>
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
          <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> 12 day streak</Badge>
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
              { label: "Retrieval Accuracy", value: "82%", target: 85, current: 82 },
              { label: "Confidence Calibration", value: "71%", target: 80, current: 71 },
              { label: "Topics Mastered", value: "15", extra: "+3 vs last week" },
              { label: "Learning Streak", value: "12 days", extra: "Personal best!" },
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
          <StatCard label="Study Hours" value="24.5 hrs" change="+17%" />
          <StatCard label="Topics Completed" value="48" change="+8" />
          <StatCard label="Current Streak" value="12 days" change="Personal best!" extra="🔥" />
          <StatCard label="MCQ Accuracy" value="78%" change="+5%" />
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
