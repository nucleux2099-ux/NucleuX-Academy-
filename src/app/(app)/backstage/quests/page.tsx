"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Shield,
  Star,
  Swords,
  Trophy,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activeQuests = [
  { title: "Complete 50 Surgery MCQs", progress: 32, total: 50, reward: "Surgery Badge", done: false },
  { title: "Study 3 new topics this week", progress: 2, total: 3, reward: "Explorer Badge", done: false },
  { title: "Maintain 7-day streak", progress: 7, total: 7, reward: "Streak Master Badge", done: true },
];

const weeklyGoals = [
  { title: "Study 15 hours", current: 12.5, target: 15, unit: "h" },
  { title: "Cover 25 topics", current: 23, target: 25, unit: "" },
  { title: "80% MCQ accuracy", current: 65, target: 80, unit: "%" },
];

const completedQuests = [
  { title: "Answer 100 MCQs total", date: "Feb 10", badge: "Centurion" },
  { title: "Study 5 days in a row", date: "Feb 7", badge: "Consistency" },
  { title: "Score 90%+ on a quiz", date: "Feb 3", badge: "Sharpshooter" },
];

const lockedQuests = [
  { title: "Master 3 subjects", requirement: "Complete 200 MCQs" },
  { title: "Perfect Week", requirement: "Hit all weekly goals" },
  { title: "Night Owl", requirement: "Study after 10 PM for 5 days" },
];

function pct(progress: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((progress / total) * 100)));
}

export default function BackstageQuestsPage() {
  const completedCount = activeQuests.filter((quest) => quest.done).length;

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
            Quests & Goals
          </h1>
          <p className="mt-1 text-sm text-[#A0B0BC]">
            Keep the execution loop tight: active quests, weekly goals, and unlock progression.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 ui-reveal-up ui-reveal-delay-1">
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Active Quests</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{activeQuests.length}</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Completed</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{completedCount}</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Weekly Goals</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{weeklyGoals.length}</p>
          </Card>
          <Card className="ui-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Unlocked Badges</p>
            <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{completedQuests.length}</p>
          </Card>
        </section>

        <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
            <Swords className="h-4 w-4 text-[#5BB3B3]" /> Active Quests
          </h2>

          <div className="space-y-2.5">
            {activeQuests.map((quest) => {
              const progressPercent = pct(quest.progress, quest.total);
              return (
                <div key={quest.title} className="ui-interactive rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#E8E0D5]">{quest.title}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        quest.done
                          ? "border-[#5BB3B3]/25 bg-[#5BB3B3]/12 text-[#5BB3B3]"
                          : "border-[#C9A86C]/25 bg-[#C9A86C]/12 text-[#C9A86C]"
                      )}
                    >
                      {quest.done ? "Completed" : `${quest.progress}/${quest.total}`}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#253545]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        quest.done ? "bg-[#5BB3B3]" : "bg-[#C9A86C]"
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#A0B0BC]">Reward: {quest.reward}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <Star className="h-4 w-4 text-[#C9A86C]" /> Weekly Goals
            </h3>
            <div className="space-y-2.5">
              {weeklyGoals.map((goal) => {
                const progressPercent = pct(goal.current, goal.target);
                const onTrack = progressPercent >= 80;
                return (
                  <div key={goal.title} className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#E8E0D5]">{goal.title}</p>
                      <span className="text-xs text-[#A0B0BC]">
                        {goal.current}{goal.unit} / {goal.target}{goal.unit}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#253545]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          onTrack ? "bg-[#5BB3B3]" : "bg-[#C9A86C]"
                        )}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
              <Trophy className="h-4 w-4 text-[#5BB3B3]" /> Completed Quests
            </h3>
            <div className="space-y-2.5">
              {completedQuests.map((quest) => (
                <div key={quest.title} className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                  <p className="text-sm font-semibold text-[#E8E0D5]">{quest.title}</p>
                  <p className="mt-1 text-xs text-[#A0B0BC]">Completed {quest.date} · {quest.badge}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#E8E0D5]">
            <Lock className="h-4 w-4 text-[#C9A86C]" /> Locked Quests
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {lockedQuests.map((quest) => (
              <div key={quest.title} className="rounded-xl border border-[#C9A86C]/20 bg-[#C9A86C]/8 p-4">
                <p className="text-sm font-semibold text-[#E8E0D5]">{quest.title}</p>
                <p className="mt-1 text-xs text-[#A0B0BC]">Requirement: {quest.requirement}</p>
              </div>
            ))}
          </div>
        </Card>

        <footer className="ui-reveal-up ui-reveal-delay-3 flex items-center gap-2 text-xs text-[#6B7A88]">
          <Shield className="h-3.5 w-3.5 text-[#5BB3B3]" />
          Execute quests in sequence, review progress weekly, unlock depth gradually.
        </footer>
      </div>
    </div>
  );
}
