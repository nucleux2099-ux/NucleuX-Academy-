"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Fingerprint,
  Brain,
  BarChart3,
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  Flame,
  Trophy,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

// Subject competency data
const subjects = [
  { name: "Surgery", progress: 72, color: "#DC2626" },
  { name: "Medicine", progress: 58, color: "#5BB3B3" },
  { name: "Anatomy", progress: 85, color: "#7BA69E" },
  { name: "Physiology", progress: 64, color: "#6BA8C9" },
  { name: "Pathology", progress: 71, color: "#E879F9" },
  { name: "Pharmacology", progress: 49, color: "#F59E0B" },
  { name: "Microbiology", progress: 62, color: "#C9A86C" },
  { name: "Biochemistry", progress: 55, color: "#6366F1" },
];

const overallAvg = Math.round(subjects.reduce((a, s) => a + s.progress, 0) / subjects.length);

// NBME domains
const nbmeDomains = [
  { name: "Patient Care & Procedural Skills", progress: 68 },
  { name: "Medical Knowledge", progress: 74 },
  { name: "Practice-Based Learning", progress: 52 },
  { name: "Interpersonal & Communication", progress: 81 },
  { name: "Professionalism", progress: 77 },
  { name: "Systems-Based Practice", progress: 45 },
];

// Weekly heatmap (1 = studied, 0 = not)
const weekDays = [
  { day: "M", active: true },
  { day: "T", active: true },
  { day: "W", active: true },
  { day: "T", active: false },
  { day: "F", active: true },
  { day: "S", active: true },
  { day: "S", active: true },
];

// Quests
const quests = [
  { name: "Complete 50 Surgery MCQs", current: 32, total: 50 },
  { name: "Review Pharmacology Notes", current: 3, total: 5 },
  { name: "Pathology Image Practice", current: 12, total: 20 },
];

const cardBase =
  "bg-[#364A5E] border border-[rgba(255,255,255,0.06)] rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer group";

function WidgetFooter({ text, color }: { text: string; color: string }) {
  return (
    <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
      <span className="text-xs font-medium" style={{ color }}>
        {text}
      </span>
      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color }} />
    </div>
  );
}

export default function BackstagePage() {
  const confidence = 78;
  const accuracy = 65;
  const gap = confidence - accuracy;
  const gapColor = gap > 15 ? "#DC2626" : gap > 8 ? "#F59E0B" : "#10B981";

  const weakestDomain = nbmeDomains.reduce((a, b) => (a.progress < b.progress ? a : b));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
            <Fingerprint className="w-6 h-6 text-[#E879F9]" />
          </div>
          Backstage
        </h1>
        <p className="text-[#A0B0BC] mt-1">Your Cognitive OS — competency, confidence, and analytics</p>
      </div>

      {/* Widget Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Competency Radar */}
        <Link href="/backstage/calibration" className={cardBase} style={{ borderColor: "rgba(232,121,249,0.15)" }}>
          <div className="p-5 group-hover:border-[#E879F9]/30">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-[#E879F9]" />
              <span className="font-semibold text-[#E8E0D5] text-sm">Competency Radar</span>
              <span className="ml-auto text-xl font-bold text-[#E879F9]">{overallAvg}%</span>
            </div>
            <div className="space-y-2">
              {subjects.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#A0B0BC] w-20 truncate">{s.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#2D3E50] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.progress}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <span className="text-[10px] text-[#A0B0BC] w-7 text-right">{s.progress}%</span>
                </div>
              ))}
            </div>
            <WidgetFooter text="View detailed breakdown →" color="#E879F9" />
          </div>
        </Link>

        {/* 2. Confidence Calibration */}
        <Link href="/backstage/calibration" className={cardBase} style={{ borderColor: "rgba(245,158,11,0.2)" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              <span className="font-semibold text-[#E8E0D5] text-sm">Confidence Calibration</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#2D3E50] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#E879F9]">{confidence}%</p>
                <p className="text-[10px] text-[#A0B0BC] mt-0.5">Confidence</p>
              </div>
              <div className="bg-[#2D3E50] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#7BA69E]">{accuracy}%</p>
                <p className="text-[10px] text-[#A0B0BC] mt-0.5">Accuracy</p>
              </div>
            </div>
            {/* Gap indicator */}
            <div className="relative h-2 rounded-full bg-[#2D3E50] mb-2 overflow-hidden">
              <div className="absolute left-0 h-full rounded-full bg-[#7BA69E]" style={{ width: `${accuracy}%` }} />
              <div
                className="absolute h-full rounded-full opacity-60"
                style={{ left: `${accuracy}%`, width: `${gap}%`, backgroundColor: gapColor }}
              />
            </div>
            <Badge className="text-[10px] px-2 py-0.5 border-0" style={{ backgroundColor: `${gapColor}20`, color: gapColor }}>
              Overconfident by {gap}%
            </Badge>
            <WidgetFooter text="Calibrate now →" color="#F59E0B" />
          </div>
        </Link>

        {/* 3. Study Streak & Habits */}
        <Link href="/backstage/logbook" className={cardBase} style={{ borderColor: "rgba(249,115,22,0.15)" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-[#F97316]" />
              <span className="font-semibold text-[#E8E0D5] text-sm">Study Streak & Habits</span>
            </div>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-[#F97316]">7 days 🔥</p>
              <p className="text-[10px] text-[#A0B0BC] mt-1">Current Streak</p>
            </div>
            <div className="flex justify-center gap-1.5 mb-4">
              {weekDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium"
                    style={{
                      backgroundColor: d.active ? "#F9731630" : "#2D3E50",
                      color: d.active ? "#F97316" : "#A0B0BC",
                      border: d.active ? "1px solid #F9731650" : "1px solid transparent",
                    }}
                  >
                    {d.day}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[#A0B0BC]">
              <span>
                Best: <span className="text-[#E8E0D5] font-medium">14 days</span>
              </span>
              <span>
                Today: <span className="text-[#E8E0D5] font-medium">2h 15m</span>
              </span>
            </div>
            <WidgetFooter text="View logbook →" color="#F97316" />
          </div>
        </Link>

        {/* 4. Study Analytics */}
        <Link href="/analytics" className={cardBase} style={{ borderColor: "rgba(91,179,179,0.15)" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#5BB3B3]" />
              <span className="font-semibold text-[#E8E0D5] text-sm">Study Analytics</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Hours", value: "12.5", icon: Clock, trend: "↑" },
                { label: "Topics", value: "23", icon: BookOpen, trend: "↑" },
                { label: "MCQs", value: "145", icon: Target, trend: "↑" },
                { label: "Accuracy", value: "↑5%", icon: TrendingUp, trend: "↑" },
              ].map((s, i) => (
                <div key={i} className="bg-[#2D3E50] rounded-xl p-3 flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#5BB3B315" }}
                  >
                    <s.icon className="w-4 h-4 text-[#5BB3B3]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#E8E0D5] leading-tight">{s.value}</p>
                    <p className="text-[10px] text-[#A0B0BC]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <WidgetFooter text="View full analytics →" color="#5BB3B3" />
          </div>
        </Link>

        {/* 5. NBME Domains */}
        <Link href="/competencies" className={cardBase} style={{ borderColor: "rgba(99,102,241,0.15)" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#6366F1]" />
              <span className="font-semibold text-[#E8E0D5] text-sm">NBME Domains</span>
            </div>
            <div className="space-y-2.5">
              {nbmeDomains.map((d) => {
                const barColor = d.progress >= 70 ? "#10B981" : d.progress >= 50 ? "#F59E0B" : "#DC2626";
                const isWeakest = d.name === weakestDomain.name;
                return (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className="text-[10px] truncate max-w-[70%]"
                        style={{ color: isWeakest ? "#DC2626" : "#A0B0BC", fontWeight: isWeakest ? 600 : 400 }}
                      >
                        {isWeakest && "⚠ "}{d.name}
                      </span>
                      <span className="text-[10px] text-[#A0B0BC]">{d.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#2D3E50] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.progress}%`, backgroundColor: barColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <WidgetFooter text="View curriculum map →" color="#6366F1" />
          </div>
        </Link>

        {/* 6. Weekly Goals & Quests */}
        <Link href="/backstage/quests" className={cardBase} style={{ borderColor: "rgba(16,185,129,0.15)" }}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-[#10B981]" />
              <span className="font-semibold text-[#E8E0D5] text-sm">Weekly Goals & Quests</span>
            </div>
            <div className="space-y-3">
              {quests.map((q, i) => {
                const pct = Math.round((q.current / q.total) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#E8E0D5] truncate max-w-[75%]">
                        {i === 0 ? "🎯 " : ""}{q.name}
                      </span>
                      <span className="text-[10px] text-[#A0B0BC]">
                        {q.current}/{q.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#2D3E50] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: "#10B981" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <WidgetFooter text="View all quests →" color="#10B981" />
          </div>
        </Link>
      </div>
    </div>
  );
}
