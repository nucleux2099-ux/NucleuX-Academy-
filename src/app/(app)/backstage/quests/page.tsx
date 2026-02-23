"use client";

import Link from "next/link";
import { ArrowLeft, Swords, Trophy, Lock, CheckCircle2, Star } from "lucide-react";
import { ApiStateBoundary } from "@/components/api-state-boundary";
import { useBackstageSummary } from "@/lib/api/hooks";

const lockedQuests = [
  { title: "Master 3 subjects", requirement: "Complete 200 MCQs", icon: "🏆" },
  { title: "Perfect Week", requirement: "Hit all weekly goals", icon: "⭐" },
  { title: "Night Owl", requirement: "Study after 10 PM for 5 days", icon: "🦉" },
];

export default function BackstageQuestsPage() {
  const { data, isLoading, error } = useBackstageSummary();

  const active = data?.quests?.active || [];
  const weeklyGoals = data?.quests?.weeklyGoals || [];

  return (
    <ApiStateBoundary
      isLoading={isLoading}
      error={error}
      data={data}
      loadingText="Loading quests..."
      errorText="Unable to load quest progress now."
      className="bg-[#2D3E50]"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8">
          <Link href="/backstage" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Backstage
          </Link>
          <h1 className="text-2xl font-bold text-[#E8E0D5] md:text-3xl">Quests &amp; Goals</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Live progress from your study telemetry.</p>
        </div>

        <div className="rounded-xl border border-emerald-500/15 bg-[#364A5E] p-5 mb-6">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
            <Swords className="h-5 w-5 text-emerald-400" /> Active Quests
          </h2>
          <div className="space-y-3">
            {active.map((q) => {
              const pct = Math.round((q.progress / q.total) * 100);
              return (
                <div key={q.title} className={`rounded-lg p-4 border ${q.done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#2D3E50] border-[rgba(91,179,179,0.08)]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#E8E0D5]">{q.title}</span>
                    {q.done ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" /> Completed
                      </span>
                    ) : (
                      <span className="text-xs text-[#6B7280]">{q.progress}/{q.total} ({pct}%)</span>
                    )}
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#2D3E50] overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${q.done ? 'bg-emerald-400' : 'bg-emerald-500/60'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-[#6B7280]">Reward: {q.reward}</div>
                </div>
              );
            })}
            {!active.length && <div className="text-sm text-[#A0B0BC]">No active quests yet.</div>}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/15 bg-[#364A5E] p-5 mb-6">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-amber-400" /> Weekly Goals
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {weeklyGoals.map((g) => {
              const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
              return (
                <div key={g.title} className="rounded-lg bg-[#2D3E50] p-4 border border-[rgba(91,179,179,0.08)]">
                  <div className="text-sm font-medium text-[#E8E0D5] mb-1">{g.title}</div>
                  <div className="text-lg font-bold text-[#E8E0D5]">{g.current}{g.unit} <span className="text-xs font-normal text-[#6B7280]">/ {g.target}{g.unit}</span></div>
                  <div className="w-full h-2 rounded-full bg-[#364A5E] overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${g.ok ? 'bg-emerald-500/60' : 'bg-red-400/60'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[rgba(91,179,179,0.15)] bg-[#364A5E] p-5">
          <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-[#6B7280]" /> Quest Shop — Unlock Next
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {lockedQuests.map((q) => (
              <div key={q.title} className="rounded-lg bg-[#2D3E50] p-4 border border-[rgba(91,179,179,0.08)] opacity-70">
                <div className="text-2xl mb-2">{q.icon}</div>
                <div className="text-sm font-medium text-[#A0B0BC]">{q.title}</div>
                <div className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> {q.requirement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ApiStateBoundary>
  );
}
