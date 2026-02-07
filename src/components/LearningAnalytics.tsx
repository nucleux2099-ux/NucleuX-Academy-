"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Trophy,
  Flame,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";

// Types
interface LearningMetric {
  id: string;
  label: string;
  description: string;
  current: number;
  previous: number;
  unit: string;
  trend: "up" | "down" | "stable";
  target?: number;
  color: string;
}

// Mock data - learning-focused metrics (not vanity metrics)
const mockMetrics: LearningMetric[] = [
  {
    id: "retrieval",
    label: "Retrieval Accuracy",
    description: "MCQ performance on previously studied topics",
    current: 82,
    previous: 78,
    unit: "%",
    trend: "up",
    target: 85,
    color: "#06B6D4", // cyan
  },
  {
    id: "calibration",
    label: "Confidence Calibration",
    description: "How well your confidence matches actual performance",
    current: 71,
    previous: 62,
    unit: "%",
    trend: "up",
    target: 80,
    color: "#7C3AED", // purple
  },
  {
    id: "mastery",
    label: "Topics Mastered",
    description: "Passed retrieval threshold (≥80% on 3+ attempts)",
    current: 15,
    previous: 12,
    unit: "",
    trend: "up",
    color: "#059669", // green
  },
  {
    id: "streak",
    label: "Learning Streak",
    description: "Consecutive days with meaningful study",
    current: 12,
    previous: 12,
    unit: "days",
    trend: "stable",
    color: "#F59E0B", // amber
  },
];

function getTrendIcon(trend: LearningMetric["trend"]) {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-3 h-3" />;
    case "down":
      return <TrendingDown className="w-3 h-3" />;
    default:
      return null;
  }
}

function getTrendColor(trend: LearningMetric["trend"]) {
  switch (trend) {
    case "up":
      return "text-green-400";
    case "down":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

function getTrendText(current: number, previous: number, trend: LearningMetric["trend"]) {
  if (trend === "stable") return "No change";
  const diff = current - previous;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff}`;
}

export function LearningAnalytics() {
  const [showInfo, setShowInfo] = useState<string | null>(null);

  return (
    <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#E5E7EB] text-base">
            <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
            Your Learning This Week
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#6B7280] hover:text-[#9CA3AF] text-xs"
          >
            Deep Analytics
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {mockMetrics.map((metric) => (
            <div
              key={metric.id}
              className="p-3 rounded-xl bg-[#0D1B2A] border border-[rgba(6,182,212,0.1)] relative group"
            >
              {/* Info button */}
              <button
                onClick={() => setShowInfo(showInfo === metric.id ? null : metric.id)}
                className="absolute top-2 right-2 p-1 rounded-full text-[#6B7280] hover:text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-all"
              >
                <Info className="w-3 h-3" />
              </button>

              {/* Label */}
              <p className="text-xs text-[#6B7280] mb-1">{metric.label}</p>

              {/* Value */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: metric.color }}>
                  {metric.current}
                </span>
                <span className="text-sm text-[#6B7280]">{metric.unit}</span>
              </div>

              {/* Trend */}
              <div className={cn("flex items-center gap-1 mt-1 text-xs", getTrendColor(metric.trend))}>
                {getTrendIcon(metric.trend)}
                <span>{getTrendText(metric.current, metric.previous, metric.trend)}</span>
                <span className="text-[#6B7280]">vs last week</span>
              </div>

              {/* Progress to target */}
              {metric.target && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                    <span>Target: {metric.target}{metric.unit}</span>
                    <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(metric.current / metric.target) * 100} 
                    className="h-1 bg-[#142538]"
                  />
                </div>
              )}

              {/* Info tooltip */}
              {showInfo === metric.id && (
                <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 rounded-lg bg-[#142538] border border-[rgba(6,182,212,0.2)] shadow-xl">
                  <p className="text-xs text-[#9CA3AF]">{metric.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Insight */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-[#7C3AED]/10 to-[#06B6D4]/10 border border-[rgba(124,58,237,0.2)]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#7C3AED]/20 shrink-0">
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-sm text-[#E5E7EB] font-medium">Key Insight</p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Your <span className="text-[#7C3AED]">confidence calibration improved 9%</span> this week! 
                You're getting better at knowing what you know. Keep using ATOM's feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Science Note */}
        <div className="flex items-start gap-2 text-xs text-[#6B7280] pt-2 border-t border-[rgba(6,182,212,0.1)]">
          <Brain className="w-3 h-3 mt-0.5 shrink-0" />
          <span>
            <strong className="text-[#9CA3AF]">Why these metrics?</strong> Retrieval accuracy and confidence calibration predict actual learning better than study hours.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default LearningAnalytics;
