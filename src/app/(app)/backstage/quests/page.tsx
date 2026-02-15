"use client";

import Link from "next/link";
import { ArrowLeft, Swords, Trophy, Lock, CheckCircle2, Star, Shield, Compass } from "lucide-react";

const activeQuests = [
  { title: "Complete 50 Surgery MCQs", progress: 32, total: 50, reward: "Surgery Badge", icon: "🗡️", done: false },
  { title: "Study 3 new topics this week", progress: 2, total: 3, reward: "Explorer Badge", icon: "🧭", done: false },
  { title: "Maintain 7-day streak", progress: 7, total: 7, reward: "Streak Master Badge", icon: "🔥", done: true },
];

const weeklyGoals = [
  { title: "Study 15 hours", current: 12.5, target: 15, unit: "h", ok: true },
  { title: "Cover 25 topics", current: 23, target: 25, unit: "", ok: true },
  { title: "80% MCQ accuracy", current: 65, target: 80, unit: "%", ok: false },
];

const completedQuests = [
  { title: "Answer 100 MCQs total", date: "Feb 10", badge: "Centurion 💯" },
  { title: "Study 5 days in a row", date: "Feb 7", badge: "Consistent 📅" },
  { title: "Score 90%+ on a quiz", date: "Feb 3", badge: "Sharpshooter 🎯" },
];

const lockedQuests = [
  { title: "Master 3 subjects", requirement: "Complete 200 MCQs", icon: "🏆" },
  { title: "Perfect Week", requirement: "Hit all weekly goals", icon: "⭐" },
  { title: "Night Owl", requirement: "Study after 10 PM for 5 days", icon: "🦉" },
];

export default function BackstageQuestsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/backstage" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Backstage
        </Link>
        <h1 className="text-2xl font-bold text-[#E8E0D5] md:text-3xl">Quests &amp; Goals</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Complete challenges, earn badges, level up.</p>
      </div>

      {/* Active Quests */}
      <div className="rounded-xl border border-emerald-500/15 bg-[#364A5E] p-5 mb-6">
        <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
          <Swords className="h-5 w-5 text-emerald-400" /> Active Quests
        </h2>
        <div className="space-y-3">
          {activeQuests.map((q) => {
            const pct = Math.round((q.progress / q.total) * 100);
            return (
              <div key={q.title} className={`rounded-lg p-4 border ${q.done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#2D3E50] border-[rgba(91,179,179,0.08)]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{q.icon}</span>
                    <span className="text-sm font-medium text-[#E8E0D5]">{q.title}</span>
                  </div>
                  {q.done ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Completed! Claim reward
                    </span>
                  ) : (
                    <span className="text-xs text-[#6B7280]">{q.progress}/{q.total} ({pct}%)</span>
                  )}
                </div>
                <div className="w-full h-2 rounded-full bg-[#2D3E50] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${q.done ? 'bg-emerald-400' : 'bg-emerald-500/60'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-[#6B7280]">Reward: {q.reward}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Goals */}
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
                <div className="text-lg font-bold text-[#E8E0D5]">
                  {g.current}{g.unit} <span className="text-xs font-normal text-[#6B7280]">/ {g.target}{g.unit}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#364A5E] overflow-hidden mt-2">
                  <div className={`h-full rounded-full ${g.ok ? 'bg-emerald-500/60' : 'bg-red-400/60'}`} style={{ width: `${pct}%` }} />
                </div>
                {!g.ok && <div className="text-xs text-red-400 mt-1">Needs work</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Quests */}
      <div className="rounded-xl border border-emerald-500/15 bg-[#364A5E] p-5 mb-6">
        <h2 className="text-base font-semibold text-[#E8E0D5] flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-400" /> Completed Quests
        </h2>
        <div className="space-y-2">
          {completedQuests.map((q) => (
            <div key={q.title} className="flex items-center justify-between rounded-lg bg-[#2D3E50] p-3 border border-emerald-500/10">
              <div>
                <div className="text-sm font-medium text-[#E8E0D5]">{q.title}</div>
                <div className="text-xs text-[#6B7280] mt-0.5">Completed {q.date}</div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/20">
                {q.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Shop */}
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
  );
}
