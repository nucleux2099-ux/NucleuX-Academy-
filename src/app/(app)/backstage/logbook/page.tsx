"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Flame, Clock, BookOpen } from "lucide-react";
import { ApiStateBoundary } from "@/components/api-state-boundary";
import { useAnalytics, useBackstageSummary } from "@/lib/api/hooks";

function getHeatColor(v: number) {
  if (v === 0) return "bg-[#2D3E50]";
  if (v === 1) return "bg-teal-900/60";
  return "bg-teal-400/80";
}

export default function BackstageLogbookPage() {
  const { data: analytics, isLoading, error } = useAnalytics(28);
  const { data: summary } = useBackstageSummary();

  const heat = summary?.streak.heatmap?.flat() || [];
  const daily = (analytics?.dailyStats || []).slice(0, 7);
  const sessions = analytics?.recentSessions || [];

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={analytics}
      loadingText="Loading logbook..."
      errorText="Unable to load learning logbook now."
      className="bg-[#2D3E50]"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8">
          <Link href="/backstage" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Backstage
          </Link>
          <h1 className="text-2xl font-bold text-[#E8E0D5] md:text-3xl">Learning Logbook</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Your real study history and consistency signals.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Current Streak', value: `${summary?.streak.current ?? 0} days`, icon: Flame, color: 'text-amber-400' },
            { label: 'Best Streak', value: `${summary?.streak.longest ?? 0} days`, icon: Flame, color: 'text-orange-400' },
            { label: 'Active Days (28d)', value: `${summary?.streak.activeDaysIn28 ?? 0}`, icon: Calendar, color: 'text-teal-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-4 text-center">
              <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
              <div className="text-xl font-bold text-[#E8E0D5]">{s.value}</div>
              <div className="text-xs text-[#6B7280] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5 mb-6">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-teal-400" /> Last 28 Days Heatmap
          </h2>
          <div className="grid grid-cols-7 gap-1.5">
            {heat.map((v, i) => (
              <div key={i} className={`aspect-square rounded-sm ${getHeatColor(v)}`} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5 mb-6">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-teal-400" /> Recent Sessions
          </h2>
          <div className="space-y-2">
            {sessions.slice(0, 7).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-[#2D3E50] p-3 border border-[rgba(91,179,179,0.05)]">
                <div className="text-sm text-[#E8E0D5]">{s.started_at ? new Date(s.started_at).toLocaleString('en-IN') : 'Unknown'}</div>
                <div className="text-xs text-[#A0B0BC]">{s.duration_minutes ?? 0} min · {s.mcqs_attempted ?? 0} MCQs</div>
              </div>
            ))}
            {!sessions.length && <div className="text-sm text-[#A0B0BC]">No sessions logged yet.</div>}
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-teal-400" /> Daily Stats (last 7 days)
          </h2>
          <div className="space-y-2">
            {daily.map((d) => (
              <div key={d.date} className="flex gap-3 rounded-lg bg-[#2D3E50] p-3 border border-[rgba(91,179,179,0.05)]">
                <div className="text-sm font-medium text-teal-400 w-20 shrink-0">{d.date}</div>
                <div className="text-sm text-[#A0B0BC]">Study {d.study_minutes} min · MCQ {d.mcqs_attempted}/{d.mcqs_correct} correct · Topics {d.atoms_completed}</div>
              </div>
            ))}
            {!daily.length && <div className="text-sm text-[#A0B0BC]">No daily stats yet.</div>}
          </div>
        </div>
      </div>
    </ApiStateBoundary>
  );
}
