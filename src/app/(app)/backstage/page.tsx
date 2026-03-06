"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Compass,
  Fingerprint,
  Flame,
  Lightbulb,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TopicGap = {
  topic: string;
  confidence: number;
  accuracy: number;
};

const topicGaps: TopicGap[] = [
  { topic: "Portal Hypertension", confidence: 85, accuracy: 52 },
  { topic: "Thyroid Carcinoma", confidence: 78, accuracy: 55 },
  { topic: "Pancreatic Pseudocyst", confidence: 72, accuracy: 61 },
];

const domainPerformance = [
  { name: "Patient Care", value: 72 },
  { name: "Medical Knowledge", value: 68 },
  { name: "Practice Learning", value: 45 },
  { name: "Systems Practice", value: 52 },
  { name: "Professionalism", value: 88 },
  { name: "Communication", value: 75 },
];

const weeklyQuests = [
  { title: "Complete 50 MCQs", progress: 50, total: 50, done: true },
  { title: "Review 3 weak topics", progress: 1, total: 3, done: false },
  { title: "Study 20 hours this week", progress: 15, total: 20, done: false },
  { title: "Score 80%+ on a retrieval quiz", progress: 0, total: 1, done: false },
];

const heatmap = [
  [2, 1, 1, 2, 1, 0, 1],
  [1, 2, 1, 1, 2, 1, 0],
  [1, 1, 2, 2, 1, 1, 1],
  [2, 1, 1, 2, 1, 1, 2],
];

const insights = [
  "Your retrieval accuracy is running ahead of re-reading retention by ~15%. Keep active recall as default.",
  "The highest calibration gap is in Portal Hypertension. Prioritize high-friction questions for this topic.",
  "Your strongest consistency window is 8 PM–10 PM. Schedule hard review during this block.",
];

function gapColor(gap: number) {
  if (gap >= 20) return "text-red-400";
  if (gap >= 10) return "text-[#C9A86C]";
  return "text-[#5BB3B3]";
}

function heatColor(value: number) {
  if (value === 0) return "bg-[#253545]";
  if (value === 1) return "bg-[#5BB3B3]/35";
  return "bg-[#5BB3B3]";
}

function performanceColor(value: number) {
  if (value >= 80) return "bg-[#5BB3B3]";
  if (value >= 60) return "bg-[#7BA69E]";
  if (value >= 45) return "bg-[#C9A86C]";
  return "bg-red-400";
}

function PanelTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#5BB3B3]" />
        <h2 className="text-lg font-semibold text-[#E8E0D5]">{title}</h2>
      </div>
      {subtitle ? <p className="mt-1 text-sm text-[#A0B0BC]">{subtitle}</p> : null}
    </div>
  );
}

export default function BackstagePage() {
  const confidence = 78;
  const accuracy = 62;
  const gap = confidence - accuracy;

  const completedQuests = weeklyQuests.filter((quest) => quest.done).length;

  return (
    <div className="ui-shell py-2 md:py-3">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between ui-reveal-up">
          <div>
            <p className="text-sm font-medium text-[#A0B0BC]">Backstage Analytics</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-[#E8E0D5] md:text-3xl">
              <Fingerprint className="h-6 w-6 text-[#5BB3B3]" />
              Backstage Command Center
            </h1>
            <p className="mt-1 text-sm text-[#A0B0BC]">
              A concise view of calibration, consistency, and performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/backstage/calibration"
              className="ui-pill ui-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <Brain className="h-3.5 w-3.5 text-[#5BB3B3]" /> Calibration
            </Link>
            <Link
              href="/backstage/logbook"
              className="ui-pill ui-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#5BB3B3]" /> Logbook
            </Link>
            <Link
              href="/backstage/quests"
              className="ui-pill ui-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            >
              <Trophy className="h-3.5 w-3.5 text-[#C9A86C]" /> Quests
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="ui-panel ui-reveal-up ui-reveal-delay-1 gap-4 p-5 md:p-6">
            <PanelTitle
              icon={Brain}
              title="Calibration Snapshot"
              subtitle="Reduce confidence gaps before they become exam errors."
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Confidence</p>
                <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{confidence}%</p>
              </div>
              <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Accuracy</p>
                <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{accuracy}%</p>
              </div>
              <div className="rounded-xl border border-[#C9A86C]/18 bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Gap</p>
                <p className={cn("mt-1 text-2xl font-semibold", gapColor(gap))}>{gap}%</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {topicGaps.map((row) => {
                const currentGap = row.confidence - row.accuracy;
                return (
                  <div
                    key={row.topic}
                    className="ui-interactive rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/55 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[#E8E0D5]">{row.topic}</p>
                      <p className={cn("text-xs font-semibold", gapColor(currentGap))}>gap {currentGap}%</p>
                    </div>
                    <p className="mt-1 text-xs text-[#A0B0BC]">
                      confidence {row.confidence}% · accuracy {row.accuracy}%
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              href="/backstage/calibration"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#5BB3B3] transition-colors duration-150 hover:text-[#78c7c7]"
            >
              Open calibration report <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
            <PanelTitle icon={Target} title="Weekly Operations" subtitle="Keep execution predictable and measurable." />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Study Hours</p>
                <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">24.5h</p>
              </div>
              <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Streak</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-semibold text-[#E8E0D5]"><Flame className="h-5 w-5 text-[#C9A86C]" /> 12</p>
              </div>
              <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Quests Done</p>
                <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">{completedQuests}/4</p>
              </div>
              <div className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7A88]">Mastered Topics</p>
                <p className="mt-1 text-2xl font-semibold text-[#E8E0D5]">15</p>
              </div>
            </div>

            <div className="space-y-2">
              {weeklyQuests.map((quest) => {
                const percentage = Math.round((quest.progress / quest.total) * 100);
                return (
                  <div
                    key={quest.title}
                    className="rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/55 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#E8E0D5]">{quest.title}</p>
                      <span className="text-[11px] text-[#A0B0BC]">{quest.progress}/{quest.total}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#253545]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          quest.done ? "bg-[#5BB3B3]" : "bg-[#C9A86C]"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="ui-panel ui-reveal-up ui-reveal-delay-2 gap-4 p-5 md:p-6">
            <PanelTitle icon={BarChart3} title="Domain Performance" subtitle="Identify low-confidence competence areas quickly." />

            <div className="space-y-3">
              {domainPerformance.map((domain) => (
                <div key={domain.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-[#A0B0BC]">{domain.name}</span>
                    <span className="font-medium text-[#E8E0D5]">{domain.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#253545]">
                    <div
                      className={cn("h-full rounded-full transition-all duration-300", performanceColor(domain.value))}
                      style={{ width: `${domain.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5 md:p-6">
            <PanelTitle icon={Compass} title="Consistency Signal" subtitle="4-week activity map. Focus on avoiding zero-days." />

            <div className="grid grid-cols-7 gap-1.5">
              {heatmap.flat().map((value, index) => (
                <div key={index} className={cn("h-6 rounded-md", heatColor(value))} />
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 px-3 py-2">
              <span className="text-xs text-[#A0B0BC]">Current streak</span>
              <span className="text-sm font-semibold text-[#E8E0D5]">12 days</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[rgba(232,224,213,0.08)] bg-[#1B2838]/60 px-3 py-2">
              <span className="text-xs text-[#A0B0BC]">Longest streak</span>
              <span className="text-sm font-semibold text-[#E8E0D5]">18 days</span>
            </div>
          </Card>
        </section>

        <Card className="ui-panel ui-reveal-up ui-reveal-delay-3 gap-4 p-5 md:p-6">
          <PanelTitle icon={Lightbulb} title="ATOM Insights" subtitle="Actionable signals from your recent behavior." />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {insights.map((insight) => (
              <div
                key={insight}
                className="ui-interactive rounded-xl border border-[#5BB3B3]/20 bg-[#5BB3B3]/8 p-4"
              >
                <p className="text-sm leading-relaxed text-[#A0B0BC]">{insight}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Link
              href="/backstage/quests"
              className="inline-flex items-center gap-1 rounded-full bg-[#5BB3B3] px-4 py-2 text-sm font-semibold text-[#1E2D3D] transition-colors duration-150 hover:bg-[#67bdbd]"
            >
              Open Quests <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/backstage/logbook"
              className="inline-flex items-center gap-1 rounded-full border border-[rgba(232,224,213,0.12)] bg-[#253545]/60 px-4 py-2 text-sm font-medium text-[#A0B0BC] transition-colors duration-150 hover:text-[#E8E0D5]"
            >
              Review Logbook
            </Link>
            <Link
              href="/backstage/calibration"
              className="inline-flex items-center gap-1 rounded-full border border-[rgba(232,224,213,0.12)] bg-[#253545]/60 px-4 py-2 text-sm font-medium text-[#A0B0BC] transition-colors duration-150 hover:text-[#E8E0D5]"
            >
              Calibration Details
            </Link>
          </div>
        </Card>

        <footer className="ui-reveal-up ui-reveal-delay-3 flex items-center gap-2 text-xs text-[#6B7A88]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#5BB3B3]" />
          Focus on fewer metrics, tighter feedback loops, and faster corrective action.
        </footer>
      </div>
    </div>
  );
}
