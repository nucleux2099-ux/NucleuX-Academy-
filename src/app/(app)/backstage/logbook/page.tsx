"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Flame, Clock, BookOpen } from "lucide-react";

// Mock heatmap data for February 2025
const heatmapData: Record<number, number> = {
  1: 0, 2: 1.5, 3: 0.5, 4: 3.5, 5: 2, 6: 0, 7: 1, 8: 4, 9: 2.5, 10: 0,
  11: 3, 12: 1.5, 13: 0, 14: 2, 15: 0.5, 16: 0, 17: 3.5, 18: 2, 19: 1, 20: 0,
  21: 4, 22: 3, 23: 2.5, 24: 1, 25: 0, 26: 2, 27: 3, 28: 1.5,
};

function getHeatColor(hours: number) {
  if (hours === 0) return "bg-[#2D3E50]";
  if (hours < 1) return "bg-teal-900/60";
  if (hours < 3) return "bg-teal-600/60";
  return "bg-teal-400/80";
}

const weeklySummaries = [
  { week: "Feb 10–16", hours: 8.5, topics: 12, mcqs: 45 },
  { week: "Feb 3–9", hours: 14, topics: 18, mcqs: 72 },
  { week: "Jan 27–Feb 2", hours: 11, topics: 15, mcqs: 58 },
  { week: "Jan 20–26", hours: 9.5, topics: 10, mcqs: 40 },
];

const dailyLogs = [
  { date: "Feb 14", entries: "Surgery - Acute Pancreatitis (45 min), MCQ Practice (30 min)" },
  { date: "Feb 13", entries: "Pathology - Neoplasia (60 min)" },
  { date: "Feb 12", entries: "Medicine - Heart Failure (40 min), MCQ Review (20 min)" },
  { date: "Feb 11", entries: "Anatomy - Brachial Plexus (90 min), Surgery MCQs (30 min)" },
  { date: "Feb 10", entries: "Pharmacology - ANS Drugs (50 min)" },
  { date: "Feb 9", entries: "OBG - Normal Labour (45 min), Micro - Gram Staining (30 min)" },
  { date: "Feb 8", entries: "Surgery - Thyroid (120 min), MCQ Marathon (60 min)" },
];

export default function BackstageLogbookPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/backstage" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Backstage
        </Link>
        <h1 className="text-2xl font-bold text-[#E8E0D5] md:text-3xl">Learning Logbook</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Your study history and patterns at a glance.</p>
      </div>

      {/* Streak Card */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Current Streak", value: "7 days", icon: Flame, color: "text-amber-400" },
          { label: "Best Streak", value: "14 days", icon: Flame, color: "text-orange-400" },
          { label: "Total Study Days", value: "45", icon: Calendar, color: "text-teal-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-4 text-center">
            <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
            <div className="text-xl font-bold text-[#E8E0D5]">{s.value}</div>
            <div className="text-xs text-[#6B7280] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Heatmap */}
      <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5 mb-6">
        <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-teal-400" /> February 2025
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="text-center text-[10px] text-[#6B7280] mb-1">{d}</div>
          ))}
          {/* Feb 2025 starts on Saturday → 5 empty + 28 days */}
          {Array.from({ length: 5 }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: 28 }, (_, i) => {
            const day = i + 1;
            const hours = heatmapData[day] ?? 0;
            return (
              <div
                key={day}
                className={`aspect-square rounded-sm ${getHeatColor(hours)} flex items-center justify-center text-[10px] text-[#A0B0BC] hover:ring-1 hover:ring-teal-400/50 transition-all cursor-default`}
                title={`Feb ${day}: ${hours}h`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[10px] text-[#6B7280]">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#2D3E50]" />
            <div className="w-3 h-3 rounded-sm bg-teal-900/60" />
            <div className="w-3 h-3 rounded-sm bg-teal-600/60" />
            <div className="w-3 h-3 rounded-sm bg-teal-400/80" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Weekly Summaries */}
      <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5 mb-6">
        <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-teal-400" /> Weekly Summaries
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {weeklySummaries.map((w) => (
            <div key={w.week} className="rounded-lg bg-[#2D3E50] p-4 border border-[rgba(91,179,179,0.08)]">
              <div className="text-sm font-medium text-[#E8E0D5] mb-2">{w.week}</div>
              <div className="flex gap-4 text-xs text-[#A0B0BC]">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-teal-400" /> {w.hours}h</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-teal-400" /> {w.topics} topics</span>
                <span className="flex items-center gap-1">📝 {w.mcqs} MCQs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Log */}
      <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5">
        <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-teal-400" /> Daily Log (Last 7 Days)
        </h2>
        <div className="space-y-2">
          {dailyLogs.map((log) => (
            <div key={log.date} className="flex gap-3 rounded-lg bg-[#2D3E50] p-3 border border-[rgba(91,179,179,0.05)]">
              <div className="text-sm font-medium text-teal-400 w-14 shrink-0">{log.date}</div>
              <div className="text-sm text-[#A0B0BC]">{log.entries}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
