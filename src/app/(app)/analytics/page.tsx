"use client"

import { useState } from "react"
import { Clock, BookOpen, Target, FileText, MessageCircle, TrendingUp, TrendingDown, AlertTriangle, Zap } from "lucide-react"

const periods = ["This Week", "This Month", "All Time"] as const

const stats = [
  { label: "Total Study Hours", value: "32.5", icon: Clock },
  { label: "Topics Covered", value: "47", icon: BookOpen },
  { label: "MCQ Accuracy", value: "73%", icon: Target },
  { label: "Notes Created", value: "18", icon: FileText },
  { label: "ATOM Conversations", value: "24", icon: MessageCircle },
]

const subjects = [
  { name: "Anatomy", hours: 8.2, questions: 120, accuracy: 81, up: true },
  { name: "Surgery", hours: 6.5, questions: 95, accuracy: 74, up: true },
  { name: "Medicine", hours: 5.8, questions: 88, accuracy: 69, up: false },
  { name: "Pathology", hours: 4.2, questions: 76, accuracy: 65, up: false },
  { name: "Pharmacology", hours: 3.8, questions: 64, accuracy: 58, up: false },
  { name: "OBG", hours: 2.5, questions: 42, accuracy: 72, up: true },
  { name: "Pediatrics", hours: 1.5, questions: 30, accuracy: 60, up: false },
]

const dailyBars = [
  { day: "Mon", h: 65 },
  { day: "Tue", h: 40 },
  { day: "Wed", h: 85 },
  { day: "Thu", h: 55 },
  { day: "Fri", h: 70 },
  { day: "Sat", h: 90 },
  { day: "Sun", h: 30 },
]

const weakAreas = [
  { subject: "Pharmacology", accuracy: 58, tip: "Focus on drug classifications" },
  { subject: "Pediatrics", accuracy: 60, tip: "Review growth milestones" },
  { subject: "Pathology", accuracy: 65, tip: "Practice histology slides" },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<string>("This Week")

  return (
    <div className="min-h-screen bg-[#2D3E50] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8E0D5]">Study Analytics</h1>
        <div className="flex gap-1 bg-[#253545] rounded-xl p-1">
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p ? "bg-[#5BB3B3] text-white" : "text-[#A0B0BC] hover:text-[#E8E0D5]"}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-[#253545] rounded-xl p-4 border border-[#5BB3B3]/20">
            <s.icon className="w-5 h-5 text-[#5BB3B3] mb-2" />
            <p className="text-2xl font-bold text-[#E8E0D5]">{s.value}</p>
            <p className="text-xs text-[#A0B0BC]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20">
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-4">Subject Breakdown</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-[#A0B0BC] text-left border-b border-[#A0B0BC]/20">
            <th className="pb-2">Subject</th><th className="pb-2">Hours</th><th className="pb-2">Questions</th><th className="pb-2">Accuracy</th><th className="pb-2">Trend</th>
          </tr></thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.name} className="border-b border-[#A0B0BC]/10 text-[#E8E0D5]">
                <td className="py-2.5">{s.name}</td>
                <td>{s.hours}h</td>
                <td>{s.questions}</td>
                <td>{s.accuracy}%</td>
                <td>{s.up ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20">
        <h2 className="text-lg font-semibold text-[#E8E0D5] mb-4">Daily Activity</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {dailyBars.map(b => (
            <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-[#5BB3B3]" style={{ height: `${b.h}%` }} />
              <span className="text-xs text-[#A0B0BC]">{b.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#253545] rounded-xl p-5 border border-red-400/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-[#E8E0D5]">Weak Areas</h2>
          </div>
          <div className="space-y-3">
            {weakAreas.map(w => (
              <div key={w.subject} className="flex items-center justify-between bg-[#2D3E50] rounded-lg p-3">
                <div>
                  <p className="text-[#E8E0D5] font-medium">{w.subject} — {w.accuracy}%</p>
                  <p className="text-xs text-[#A0B0BC]">{w.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-[#E8E0D5]">Peak Study Time</h2>
          </div>
          <p className="text-3xl font-bold text-[#5BB3B3]">9 – 11 PM</p>
          <p className="text-[#A0B0BC] mt-2 text-sm">You're most productive during late evening sessions. Your accuracy peaks at 82% during this window.</p>
        </div>
      </div>
    </div>
  )
}
