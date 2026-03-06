"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock3,
  Flame,
  Layers,
  NotebookTabs,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const dayHours: Record<number, number> = {
  1: 0, 2: 1.5, 3: 0.5, 4: 3.5, 5: 2, 6: 0, 7: 1,
  8: 4, 9: 2.5, 10: 0, 11: 3, 12: 1.5, 13: 0, 14: 2,
  15: 0.5, 16: 0, 17: 3.5, 18: 2, 19: 1, 20: 0, 21: 4,
  22: 3, 23: 2.5, 24: 1, 25: 0, 26: 2, 27: 3, 28: 1.5,
};

const weeklySummaries = [
  { week: "Feb 10–16", hours: 8.5, topics: 12, mcqs: 45 },
  { week: "Feb 3–9", hours: 14, topics: 18, mcqs: 72 },
  { week: "Jan 27–Feb 2", hours: 11, topics: 15, mcqs: 58 },
  { week: "Jan 20–26", hours: 9.5, topics: 10, mcqs: 40 },
];

const dailyLogs = [
  { date: "Feb 14", entries: "Surgery - Acute Pancreatitis (45 min), MCQ practice (30 min)" },
  { date: "Feb 13", entries: "Pathology - Neoplasia (60 min)" },
  { date: "Feb 12", entries: "Medicine - Heart Failure (40 min), MCQ review (20 min)" },
  { date: "Feb 11", entries: "Anatomy - Brachial Plexus (90 min), Surgery MCQs (30 min)" },
  { date: "Feb 10", entries: "Pharmacology - ANS drugs (50 min)" },
  { date: "Feb 9", entries: "OBG - Normal labour (45 min), Micro - Gram stain (30 min)" },
  { date: "Feb 8", entries: "Surgery - Thyroid (120 min), MCQ marathon (60 min)" },
];

function heatColor(hours: number) {
  if (hours === 0) return "bg-[#253545]";
  if (hours < 1) return "bg-[#5BB3B3]/30";
  if (hours < 3) return "bg-[#5BB3B3]/55";
  return "bg-[#5BB3B3]";
}

export default function BackstageLogbookPage() {
  const totalHours = Object.values(dayHours).reduce((sum, value) => sum + value, 0);
  const activeDays = Object.values(dayHours).filter((value) => value > 0).length;

  return (
    <div className="ui-shell py-2 md:py-3">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="ui-reveal-up">
          <Link
            href="/backstage"
            className="ui-pill ui-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#5BB3B3]" /> Back to command center
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#E8E0D5] md:text-3xl">
            Learning Logbook
          </h1>
          <p className="mt-1 text-sm text-[#A0B0BC]">
            A concise historical view of study rhythm, effort, and session quality.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 ui-reveal-up ui-reveal-delay-1">
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Total Hours</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{Math.round(totalHours)}h</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Active Days</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{activeDays}</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Current Streak</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-[#E8E0D5]"><Flame className="h-5 w-5 text-[#C9A86C]" /> 7</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Best Streak</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">14</p>
          </Card>
        </section>

        <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <Calendar className="h-4 w-4 text-[#5BB3B3]" /> Monthly Study Heatmap
            </h2>
            <p className="mt-1 text-sm text-[#A0B0BC]">February 2025 · darker cells indicate longer study sessions.</p>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: 28 }, (_, idx) => {
              const day = idx + 1;
              const hours = dayHours[day] || 0;
              return (
                <div
                  key={day}
                  className={`flex h-7 items-center justify-center rounded-md text-[11px] text-[#A0B0BC] ${heatColor(hours)}`}
                  title={`Feb ${day}: ${hours}h`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#6B7A88]">
            <span>Low</span>
            <span className="h-2.5 w-2.5 rounded-sm bg-[#253545]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[#5BB3B3]/30" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[#5BB3B3]/55" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[#5BB3B3]" />
            <span>High</span>
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <Clock3 className="h-4 w-4 text-[#5BB3B3]" /> Weekly Summaries
            </h3>
            <div className="space-y-2.5">
              {weeklySummaries.map((row) => (
                <div key={row.week} className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                  <p className="text-sm font-semibold text-[#E8E0D5]">{row.week}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#A0B0BC]">
                    <span>{row.hours}h study</span>
                    <span>{row.topics} topics</span>
                    <span>{row.mcqs} MCQs</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <NotebookTabs className="h-4 w-4 text-[#5BB3B3]" /> Last 7 Days
            </h3>
            <div className="space-y-2.5">
              {dailyLogs.map((log) => (
                <div key={log.date} className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                  <p className="text-xs font-semibold text-[#5BB3B3]">{log.date}</p>
                  <p className="mt-1 text-sm text-[#A0B0BC]">{log.entries}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <footer className="ui-reveal-up ui-reveal-delay-3 flex items-center gap-2 text-xs text-[#6B7A88]">
          <Layers className="h-3.5 w-3.5 text-[#5BB3B3]" />
          Stable performance comes from consistent low-friction daily sessions.
        </footer>
      </div>
    </div>
  );
}
