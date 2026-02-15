"use client"

import Link from "next/link"
import {
  Fingerprint, Brain, BarChart3, Target, Flame, CheckCircle,
  Trophy, Lightbulb, Clock, BookOpen, Zap, ArrowRight,
  ChevronRight, CircleDot, Settings, Award,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── helpers ─── */
function ProgressBar({ value, color, h = "h-2" }: { value: number; color: string; h?: string }) {
  return (
    <div className={cn("w-full rounded-full bg-[#1B2838]", h)}>
      <div className={cn("rounded-full", h)} style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-[#253545] border border-[rgba(232,224,213,0.06)] rounded-2xl p-5 md:p-6", className)}>
      {children}
    </div>
  )
}

function gapColor(gap: number) {
  if (gap > 15) return "#EF4444"
  if (gap >= 5) return "#F97316"
  return "#10B981"
}

function accuracyColor(v: number) {
  if (v > 70) return "#10B981"
  if (v >= 50) return "#F59E0B"
  return "#EF4444"
}

/* ─── data ─── */
const overconfidentTopics = [
  { name: "Portal Hypertension", confidence: 85, accuracy: 52 },
  { name: "Thyroid Carcinoma", confidence: 78, accuracy: 55 },
  { name: "Pancreatic Pseudocyst", confidence: 72, accuracy: 61 },
]

const stats = [
  { label: "Weekly Study Hours", value: "24.5", unit: "hrs", change: "+17%", icon: Clock },
  { label: "Topics Mastered", value: "15", unit: "/ 20", change: null, icon: Target },
  { label: "MCQs Attempted", value: "342", unit: "this month", change: null, icon: Zap },
  { label: "Avg Session Length", value: "45", unit: "min", change: null, icon: BookOpen },
]

const domains = [
  { name: "Patient Care", value: 72 },
  { name: "Medical Knowledge", value: 68 },
  { name: "Practice-Based Learning", value: 45 },
  { name: "Systems-Based Practice", value: 52 },
  { name: "Professionalism", value: 88 },
  { name: "Communication", value: 75 },
]

const quests = [
  { text: "Complete 50 MCQs", progress: "50/50", coins: 25, done: true },
  { text: "Review 3 weak topics", progress: "1/3", coins: 15, done: false },
  { text: "Study 20 hours this week", progress: "14.5/20", coins: 30, done: false },
  { text: "Maintain 7-day streak", progress: "12/7", coins: 20, done: true },
  { text: "Score >80% on a quiz", progress: "best: 78%", coins: 25, done: false },
]

const subjects = [
  { name: "Surgery", accuracy: 78, mcqs: 120, topics: 15 },
  { name: "Medicine", accuracy: 65, mcqs: 89, topics: 12 },
  { name: "Anatomy", accuracy: 72, mcqs: 67, topics: 18 },
  { name: "Pathology", accuracy: 58, mcqs: 45, topics: 8 },
  { name: "Pharmacology", accuracy: 45, mcqs: 34, topics: 6 },
  { name: "Pediatrics", accuracy: 70, mcqs: 28, topics: 5 },
]

// 4 weeks heatmap: 0=miss, 1=studied, 2=high
const heatmap = [
  [2,1,1,2,1,0,1],
  [1,2,1,1,2,1,0],
  [1,1,2,2,1,1,1],
  [2,1,1,2,1,1,2],
]

const insights = [
  "Your retrieval accuracy is 15% higher than your re-reading retention. Keep using active recall!",
  "You study best between 8-10 PM. Consider scheduling hard topics then.",
  "Spaced repetition is due for 8 topics. Check your Study Plan.",
]

const quickLinks = [
  "Calibration Details", "Full Analytics", "Study Logbook",
  "Achievements", "Leaderboard", "Settings",
]

/* ─── page ─── */
export default function BackstagePage() {
  const confidence = 78
  const accuracy = 62
  const gap = confidence - accuracy

  return (
    <div className="min-h-screen w-full px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── 1. Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-[#E8E0D5]">
              <Fingerprint className="h-7 w-7 text-[#5BB3B3]" />
              Your Backstage
            </h1>
            <p className="mt-1 text-[#A0B0BC] text-sm md:text-base">Your Cognitive OS — see yourself clearly</p>
          </div>
          <span className="text-[#6B7A88] text-xs md:text-sm">Last updated: 2 min ago</span>
        </div>

        {/* ── 2. Confidence Calibration (HERO) ── */}
        <Card className="border-[#E879F9]/20">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="h-5 w-5 text-[#E879F9]" />
            <h2 className="text-lg font-semibold text-[#E8E0D5]">Confidence Calibration</h2>
          </div>

          {/* gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Your Confidence", val: confidence, col: "#E879F9" },
              { label: "Your Accuracy", val: accuracy, col: "#5BB3B3" },
            ].map((g) => (
              <div key={g.label} className="flex flex-col items-center">
                <div className="relative w-32 h-16 overflow-hidden">
                  {/* semi-circle track */}
                  <div className="absolute inset-0 rounded-t-full border-[6px] border-[#1B2838] border-b-0" />
                  {/* filled arc via conic-gradient */}
                  <div
                    className="absolute inset-0 rounded-t-full border-b-0 overflow-hidden"
                    style={{
                      background: `conic-gradient(${g.col} 0deg, ${g.col} ${g.val * 1.8}deg, transparent ${g.val * 1.8}deg, transparent 180deg, transparent 180deg, transparent 360deg)`,
                      maskImage: "radial-gradient(circle at 50% 100%, transparent 52px, black 53px)",
                      WebkitMaskImage: "radial-gradient(circle at 50% 100%, transparent 52px, black 53px)",
                    }}
                  />
                </div>
                <span className="text-2xl font-bold text-[#E8E0D5] -mt-2">{g.val}%</span>
                <span className="text-xs text-[#A0B0BC]">{g.label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: gapColor(gap) }}>{gap}%</span>
              <span className="text-xs text-[#A0B0BC]">Calibration Gap</span>
              <span
                className="mt-1 rounded-full text-[10px] px-2 py-0.5 font-medium"
                style={{ backgroundColor: gapColor(gap) + "22", color: gapColor(gap) }}
              >
                {gap > 15 ? "Overconfident" : gap >= 5 ? "Moderate" : "Well-Calibrated"}
              </span>
            </div>
          </div>

          {/* overconfident topics */}
          <p className="text-sm text-[#A0B0BC] mb-3">You&apos;re overconfident in {overconfidentTopics.length} topics</p>
          <div className="space-y-2 mb-4">
            {overconfidentTopics.map((t) => {
              const g = t.confidence - t.accuracy
              return (
                <div key={t.name} className="flex items-center justify-between rounded-xl bg-[#1B2838] px-4 py-2.5 text-sm">
                  <span className="text-[#E8E0D5] font-medium">{t.name}</span>
                  <div className="flex items-center gap-3 text-xs text-[#A0B0BC]">
                    <span>Conf {t.confidence}%</span>
                    <span>Acc {t.accuracy}%</span>
                    <span className="font-semibold" style={{ color: gapColor(g) }}>GAP {g}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ATOM insight */}
          <div className="flex items-start gap-2 rounded-xl bg-[#5BB3B3]/10 border border-[#5BB3B3]/20 px-4 py-3 mb-4">
            <Zap className="h-4 w-4 text-[#5BB3B3] mt-0.5 shrink-0" />
            <p className="text-sm text-[#A0B0BC]">
              <span className="text-[#5BB3B3] font-medium">ATOM: </span>
              Focus on Portal Hypertension first — the largest gap. Try 20 MCQs today.
            </p>
          </div>

          <Link
            href="/desk"
            className="inline-flex items-center gap-1 rounded-full bg-[#E879F9]/15 text-[#E879F9] text-sm font-medium px-4 py-2 hover:bg-[#E879F9]/25 transition-colors"
          >
            Practice Overconfident Topics <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        {/* ── 3. Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#A0B0BC] text-xs mb-1">
                <s.icon className="h-4 w-4" />
                {s.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#E8E0D5]">{s.value}</span>
                <span className="text-sm text-[#6B7A88]">{s.unit}</span>
              </div>
              {s.change && (
                <span className="text-[10px] text-[#10B981] font-medium">{s.change} vs last week</span>
              )}
            </Card>
          ))}
        </div>

        {/* ── 4. NBME + Quests ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* NBME */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[#6366F1]" />
              <h2 className="text-base font-semibold text-[#E8E0D5]">NBME Domain Progress</h2>
            </div>
            <div className="space-y-3">
              {domains.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#A0B0BC]">{d.name}</span>
                    <span className="text-[#E8E0D5] font-medium">{d.value}%</span>
                  </div>
                  <ProgressBar value={d.value} color={accuracyColor(d.value)} h="h-2.5" />
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Quests */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-[#F59E0B]" />
              <h2 className="text-base font-semibold text-[#E8E0D5]">Weekly Quests</h2>
            </div>
            <div className="space-y-2.5">
              {quests.map((q) => (
                <div key={q.text} className="flex items-center gap-3 text-sm">
                  {q.done ? (
                    <CheckCircle className="h-5 w-5 text-[#10B981] shrink-0" />
                  ) : (
                    <CircleDot className="h-5 w-5 text-[#6B7A88] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={cn("text-[#E8E0D5]", q.done && "line-through opacity-60")}>{q.text}</span>
                    <span className="text-[#6B7A88] text-xs ml-2">({q.progress})</span>
                  </div>
                  <span className="text-[#F59E0B] text-xs font-medium whitespace-nowrap">+{q.coins}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(232,224,213,0.06)] text-xs text-[#A0B0BC]">
              3/5 completed — <span className="text-[#F59E0B] font-medium">45 coins earned</span>, 70 coins possible
            </div>
          </Card>
        </div>

        {/* ── 5. Subject Performance ── */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-[#5BB3B3]" />
            <h2 className="text-base font-semibold text-[#E8E0D5]">Subject Performance Map</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((s) => {
              const col = accuracyColor(s.accuracy)
              return (
                <div
                  key={s.name}
                  className="rounded-xl bg-[#1B2838] p-4 border-l-4"
                  style={{ borderLeftColor: col }}
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[#E8E0D5] font-medium">{s.name}</span>
                    <span className="text-lg font-bold" style={{ color: col }}>{s.accuracy}%</span>
                  </div>
                  <ProgressBar value={s.accuracy} color={col} />
                  <div className="flex gap-4 mt-2 text-[10px] text-[#6B7A88]">
                    <span>{s.mcqs} MCQs</span>
                    <span>{s.topics} topics</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* ── 6. Study Streak ── */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-[#F97316]" />
            <h2 className="text-base font-semibold text-[#E8E0D5]">Study Streak & Consistency</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {heatmap.flat().map((v, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-md"
                style={{
                  backgroundColor: v === 0 ? "#1B2838" : v === 1 ? "#10B98155" : "#10B981",
                }}
              />
            ))}
          </div>
          <p className="text-sm text-[#A0B0BC]">
            Current streak: <span className="text-[#E8E0D5] font-medium">12 days 🔥</span>
            {" | "}Longest: <span className="text-[#E8E0D5] font-medium">18 days</span>
            {" | "}This month: <span className="text-[#E8E0D5] font-medium">22/28 days</span>
          </p>
        </Card>

        {/* ── 7. ATOM Insights ── */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-[#5BB3B3]" />
            <h2 className="text-base font-semibold text-[#E8E0D5]">Recent Insights from ATOM</h2>
          </div>
          <div className="space-y-3">
            {insights.map((text, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-[#5BB3B3]/20 bg-[#5BB3B3]/5 px-4 py-3">
                <Lightbulb className="h-4 w-4 text-[#5BB3B3] mt-0.5 shrink-0" />
                <p className="text-sm text-[#A0B0BC]">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 8. Quick Links ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quickLinks.map((l) => (
            <Link
              key={l}
              href="#"
              className="rounded-full border border-[rgba(232,224,213,0.1)] bg-[#253545] px-4 py-2 text-xs text-[#A0B0BC] hover:text-[#E8E0D5] hover:border-[#5BB3B3]/30 transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
