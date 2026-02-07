"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, TrendingUp, Brain, Target, Clock, Zap,
  AlertTriangle, CheckCircle, XCircle, HelpCircle,
  Calendar, ArrowUp, ArrowDown, Minus, Info, Lightbulb
} from "lucide-react";

// Learning Science Analytics
const analyticsData = {
  calibration: {
    score: 71,
    trend: "+5%",
    interpretation: "Your confidence aligns with your accuracy 71% of the time. You're slightly overconfident on difficult topics.",
    breakdown: [
      { confidence: "Very Sure", accuracy: 92, questions: 45 },
      { confidence: "Sure", accuracy: 78, questions: 89 },
      { confidence: "Unsure", accuracy: 54, questions: 67 },
      { confidence: "Guessing", accuracy: 31, questions: 23 },
    ]
  },
  retrieval: {
    score: 82,
    trend: "+4%",
    firstAttempt: 68,
    afterSpacing: 89,
    interpretation: "Strong retrieval! Your spaced reviews boost accuracy by 21%."
  },
  retention: {
    topics: [
      { name: "Portal Hypertension", strength: 95, stability: 88, lastReview: "2 days ago" },
      { name: "Acute Pancreatitis", strength: 87, stability: 72, lastReview: "5 days ago" },
      { name: "Thyroid Carcinoma", strength: 78, stability: 65, lastReview: "1 week ago" },
      { name: "Hepatobiliary Anatomy", strength: 92, stability: 85, lastReview: "3 days ago" },
      { name: "Esophageal Surgery", strength: 65, stability: 45, lastReview: "2 weeks ago" },
    ]
  },
  errors: {
    total: 156,
    conceptual: 45,
    factual: 67,
    application: 44,
    recurring: [
      { topic: "Child-Pugh Score components", count: 5, type: "factual" },
      { topic: "TNM staging interpretation", count: 4, type: "application" },
      { topic: "Ranson's criteria timing", count: 3, type: "factual" },
    ]
  },
  difficulty: {
    distribution: [
      { level: "Too Easy", percent: 15, color: "#9CA3AF" },
      { level: "Optimal (70-85%)", percent: 58, color: "#059669" },
      { level: "Too Hard", percent: 27, color: "#EF4444" },
    ],
    averageAccuracy: 76,
    suggestion: "You're mostly in the optimal zone! Consider increasing difficulty in Hepatobiliary."
  },
  timeInsights: {
    avgPerQuestion: "45 sec",
    fastCorrect: 34,
    slowCorrect: 28,
    fastIncorrect: 12,
    slowIncorrect: 26,
    insight: "You're accurate when you take your time. Rushing leads to 2x more errors."
  }
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  const TrendIndicator = ({ value }: { value: string }) => {
    const isPositive = value.startsWith("+");
    const isNeutral = value === "0%";
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-[#059669]' : isNeutral ? 'text-[#6B7280]' : 'text-[#EF4444]'}`}>
        {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : isNeutral ? <Minus className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#06B6D4]" />
            Learning Analytics
          </h1>
          <p className="text-[#9CA3AF] mt-1">Metrics that predict actual learning, not just effort</p>
        </div>
        
        {/* Time Range */}
        <div className="flex gap-2 bg-[#0F2233] rounded-lg p-1 border border-[rgba(6,182,212,0.15)]">
          {(["week", "month", "all"] as const).map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-[#142538] text-[#E5E7EB]" : "text-[#6B7280]"}
            >
              {range === "all" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Insight Banner */}
      <Card className="bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(139,92,246,0.15)] border-[rgba(6,182,212,0.2)]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.2)] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#E5E7EB]">Key Insight</h3>
              <p className="text-sm text-[#9CA3AF] mt-1">
                Your <span className="text-[#06B6D4] font-medium">retrieval accuracy</span> is strong (82%), but{" "}
                <span className="text-[#F59E0B] font-medium">Esophageal Surgery</span> has low stability — schedule a review this week to prevent forgetting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calibration Score */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-sm text-[#9CA3AF]">Calibration</span>
                <HelpCircle className="w-3 h-3 text-[#6B7280] cursor-help" title="How well your confidence matches your accuracy" />
              </div>
              <TrendIndicator value={analyticsData.calibration.trend} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#E5E7EB]">{analyticsData.calibration.score}</span>
              <span className="text-[#6B7280] mb-1">%</span>
            </div>
            <p className="text-xs text-[#6B7280] mt-2">Confidence ↔ Accuracy alignment</p>
          </CardContent>
        </Card>

        {/* Retrieval Accuracy */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-sm text-[#9CA3AF]">Retrieval</span>
              </div>
              <TrendIndicator value={analyticsData.retrieval.trend} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#E5E7EB]">{analyticsData.retrieval.score}</span>
              <span className="text-[#6B7280] mb-1">%</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-[#6B7280]">1st try: <span className="text-[#9CA3AF]">{analyticsData.retrieval.firstAttempt}%</span></span>
              <span className="text-[#6B7280]">After spacing: <span className="text-[#059669]">{analyticsData.retrieval.afterSpacing}%</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Zone */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-sm text-[#9CA3AF]">Difficulty Zone</span>
              </div>
              <Badge className="bg-[rgba(5,150,105,0.15)] text-[#059669] border-none">Optimal</Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#E5E7EB]">{analyticsData.difficulty.distribution[1].percent}</span>
              <span className="text-[#6B7280] mb-1">%</span>
            </div>
            <p className="text-xs text-[#6B7280] mt-2">Questions in the 70-85% sweet spot</p>
          </CardContent>
        </Card>
      </div>

      {/* Calibration Breakdown */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg text-[#E5E7EB] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#8B5CF6]" />
            Confidence Calibration
          </CardTitle>
          <CardDescription className="text-[#6B7280]">
            {analyticsData.calibration.interpretation}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.calibration.breakdown.map((item, i) => {
              const isCalibrated = Math.abs(
                (i === 0 ? 95 : i === 1 ? 80 : i === 2 ? 50 : 25) - item.accuracy
              ) < 15;
              return (
                <div key={item.confidence} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-[#9CA3AF]">{item.confidence}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#6B7280]">{item.questions} questions</span>
                      <span className={isCalibrated ? "text-[#059669]" : "text-[#F59E0B]"}>
                        {item.accuracy}% accurate
                      </span>
                    </div>
                    <div className="h-2 bg-[#142538] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${item.accuracy}%`,
                          backgroundColor: isCalibrated ? "#059669" : "#F59E0B"
                        }}
                      />
                    </div>
                  </div>
                  {isCalibrated ? (
                    <CheckCircle className="w-4 h-4 text-[#059669]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Retention & Stability */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg text-[#E5E7EB] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#059669]" />
            Knowledge Retention
          </CardTitle>
          <CardDescription className="text-[#6B7280]">
            Strength = can recall now | Stability = will recall in 2 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.retention.topics.map((topic) => {
              const needsReview = topic.stability < 60;
              return (
                <div key={topic.name} className="p-3 rounded-lg bg-[#142538] border border-[rgba(6,182,212,0.1)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#E5E7EB]">{topic.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280]">{topic.lastReview}</span>
                      {needsReview && (
                        <Badge className="bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-none text-[10px]">
                          Review Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7280]">Strength</span>
                        <span className="text-[#06B6D4]">{topic.strength}%</span>
                      </div>
                      <Progress value={topic.strength} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7280]">Stability</span>
                        <span className={topic.stability > 70 ? "text-[#059669]" : "text-[#F59E0B]"}>
                          {topic.stability}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0F2233] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${topic.stability}%`,
                            backgroundColor: topic.stability > 70 ? "#059669" : "#F59E0B"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Types */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg text-[#E5E7EB] flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#EF4444]" />
              Error Analysis
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              {analyticsData.errors.total} total errors this {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Conceptual", count: analyticsData.errors.conceptual, color: "#8B5CF6", desc: "Misunderstanding core concepts" },
                { type: "Factual", count: analyticsData.errors.factual, color: "#F59E0B", desc: "Wrong facts or numbers" },
                { type: "Application", count: analyticsData.errors.application, color: "#06B6D4", desc: "Applying knowledge incorrectly" },
              ].map((error) => (
                <div key={error.type} className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: error.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#E5E7EB]">{error.type}</span>
                      <span className="text-sm text-[#6B7280]">{error.count}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">{error.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recurring Mistakes */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg text-[#E5E7EB] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              Recurring Mistakes
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Topics you keep getting wrong — address these!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.errors.recurring.map((error, i) => (
                <div 
                  key={error.topic}
                  className="flex items-center justify-between p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]"
                >
                  <div>
                    <p className="font-medium text-[#E5E7EB]">{error.topic}</p>
                    <Badge variant="outline" className="mt-1 text-[10px] border-[rgba(6,182,212,0.2)] text-[#6B7280]">
                      {error.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#EF4444]">{error.count}x</p>
                    <p className="text-xs text-[#6B7280]">wrong</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-[#0F2233] border border-[rgba(6,182,212,0.15)] text-[#06B6D4] hover:bg-[#142538]">
              Practice These Topics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Time Insight */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg text-[#E5E7EB] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#22D3EE]" />
            Time vs Accuracy
          </CardTitle>
          <CardDescription className="text-[#6B7280]">
            {analyticsData.timeInsights.insight}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[rgba(5,150,105,0.15)] border border-[rgba(5,150,105,0.2)] text-center">
              <p className="text-2xl font-bold text-[#059669]">{analyticsData.timeInsights.slowCorrect}%</p>
              <p className="text-xs text-[#6B7280] mt-1">Slow & Correct</p>
            </div>
            <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.15)] border border-[rgba(6,182,212,0.2)] text-center">
              <p className="text-2xl font-bold text-[#06B6D4]">{analyticsData.timeInsights.fastCorrect}%</p>
              <p className="text-xs text-[#6B7280] mt-1">Fast & Correct</p>
            </div>
            <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.2)] text-center">
              <p className="text-2xl font-bold text-[#F59E0B]">{analyticsData.timeInsights.slowIncorrect}%</p>
              <p className="text-xs text-[#6B7280] mt-1">Slow & Incorrect</p>
            </div>
            <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.2)] text-center">
              <p className="text-2xl font-bold text-[#EF4444]">{analyticsData.timeInsights.fastIncorrect}%</p>
              <p className="text-xs text-[#6B7280] mt-1">Fast & Incorrect</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
