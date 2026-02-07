"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Zap,
  Award,
  Flame,
  ArrowUp,
  ArrowDown,
  Info,
  LineChart,
  Activity,
} from "lucide-react";

// Mock data for analytics
const overviewData = {
  totalQuestions: 847,
  correctAnswers: 678,
  studyHours: 124,
  currentStreak: 12,
  longestStreak: 28,
  topicsCompleted: 34,
  totalTopics: 50,
};

const weeklyActivity = [
  { day: "Mon", questions: 45, hours: 2.5, accuracy: 82 },
  { day: "Tue", questions: 38, hours: 2.0, accuracy: 78 },
  { day: "Wed", questions: 52, hours: 3.0, accuracy: 85 },
  { day: "Thu", questions: 30, hours: 1.5, accuracy: 73 },
  { day: "Fri", questions: 48, hours: 2.8, accuracy: 88 },
  { day: "Sat", questions: 65, hours: 4.0, accuracy: 90 },
  { day: "Sun", questions: 42, hours: 2.2, accuracy: 79 },
];

const calibrationData = [
  { confidence: "Guessing", expected: 25, actual: 32, questions: 45 },
  { confidence: "Unsure", expected: 50, actual: 58, questions: 124 },
  { confidence: "Sure", expected: 75, actual: 71, questions: 286 },
  { confidence: "Very Sure", expected: 95, actual: 89, questions: 392 },
];

const forgettingCurveData = {
  topics: [
    {
      name: "Gastric Cancer",
      initialStrength: 92,
      currentStrength: 78,
      daysSinceReview: 5,
      optimalReview: 3,
      status: "overdue",
    },
    {
      name: "Esophageal Surgery",
      initialStrength: 88,
      currentStrength: 85,
      daysSinceReview: 2,
      optimalReview: 4,
      status: "good",
    },
    {
      name: "Colon Anatomy",
      initialStrength: 75,
      currentStrength: 45,
      daysSinceReview: 12,
      optimalReview: 7,
      status: "critical",
    },
    {
      name: "Liver Physiology",
      initialStrength: 90,
      currentStrength: 82,
      daysSinceReview: 3,
      optimalReview: 5,
      status: "good",
    },
    {
      name: "Pancreatic Surgery",
      initialStrength: 70,
      currentStrength: 52,
      daysSinceReview: 8,
      optimalReview: 5,
      status: "overdue",
    },
  ],
  retentionCurve: [
    { day: 0, retention: 100 },
    { day: 1, retention: 70 },
    { day: 2, retention: 55 },
    { day: 4, retention: 42 },
    { day: 7, retention: 35 },
    { day: 14, retention: 28 },
    { day: 30, retention: 22 },
  ],
};

const topicPerformance = [
  { topic: "Surgical Oncology", accuracy: 89, questions: 120, trend: "up" },
  { topic: "GI Anatomy", accuracy: 82, questions: 95, trend: "up" },
  { topic: "Hepatobiliary", accuracy: 78, questions: 80, trend: "stable" },
  { topic: "Colorectal", accuracy: 75, questions: 65, trend: "down" },
  { topic: "Bariatric Surgery", accuracy: 72, questions: 45, trend: "up" },
];

const difficultyBreakdown = [
  { level: "Easy", correct: 245, total: 280, percentage: 88 },
  { level: "Medium", correct: 312, total: 420, percentage: 74 },
  { level: "Hard", correct: 121, total: 185, percentage: 65 },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const overallAccuracy = Math.round((overviewData.correctAnswers / overviewData.totalQuestions) * 100);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB]">Analytics</h1>
          <p className="text-[#9CA3AF] mt-1">Track your learning progress and performance</p>
        </div>
        <div className="flex gap-2">
          {["week", "month", "all"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period
                ? "bg-[#06B6D4] text-[#0D1B2A]"
                : "border-[rgba(6,182,212,0.15)] text-[#9CA3AF]"
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-[#06B6D4]" />
              <Badge className="bg-[rgba(5,150,105,0.2)] text-[#059669] border-none text-xs">
                <ArrowUp className="w-3 h-3 mr-1" />
                +5%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{overallAccuracy}%</p>
            <p className="text-xs text-[#6B7280]">Overall Accuracy</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-[#059669]" />
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{overviewData.totalQuestions}</p>
            <p className="text-xs text-[#6B7280]">Questions Attempted</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{overviewData.studyHours}h</p>
            <p className="text-xs text-[#6B7280]">Study Time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{overviewData.currentStreak}</p>
            <p className="text-xs text-[#6B7280]">Day Streak 🔥</p>
          </CardContent>
        </Card>
      </div>

      {/* Calibration Chart */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-[#E5E7EB]">
              <Brain className="w-5 h-5 text-[#8B5CF6]" />
              Confidence Calibration
            </CardTitle>
            <Badge variant="outline" className="border-[rgba(6,182,212,0.2)] text-[#6B7280]">
              <Info className="w-3 h-3 mr-1" />
              Metacognition
            </Badge>
          </div>
          <p className="text-sm text-[#6B7280]">
            How well does your confidence match your actual performance?
          </p>
        </CardHeader>
        <CardContent>
          {/* Calibration Chart */}
          <div className="relative h-64 mb-6">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-[#6B7280] w-8">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-10 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-[rgba(6,182,212,0.1)]" />
                ))}
              </div>
              
              {/* Perfect calibration line */}
              <svg className="absolute inset-0 w-full h-[calc(100%-32px)]" preserveAspectRatio="none">
                <line 
                  x1="0%" y1="100%" x2="100%" y2="0%" 
                  stroke="rgba(6,182,212,0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="5,5"
                />
              </svg>
              
              {/* Bars */}
              <div className="absolute bottom-8 left-0 right-0 h-[calc(100%-32px)] flex justify-around items-end">
                {calibrationData.map((item, i) => {
                  const isOverconfident = item.actual < item.expected;
                  const isUnderconfident = item.actual > item.expected;
                  const diff = Math.abs(item.actual - item.expected);
                  const isCalibrated = diff <= 10;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                      {/* Expected vs Actual */}
                      <div className="relative w-full flex justify-center gap-1">
                        {/* Expected bar */}
                        <div 
                          className="w-8 bg-[rgba(6,182,212,0.3)] rounded-t transition-all"
                          style={{ height: `${item.expected * 2}px` }}
                        />
                        {/* Actual bar */}
                        <div 
                          className={`w-8 rounded-t transition-all ${
                            isCalibrated ? 'bg-[#059669]' :
                            isOverconfident ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
                          }`}
                          style={{ height: `${item.actual * 2}px` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                {calibrationData.map((item, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-[#9CA3AF]">{item.confidence}</p>
                    <p className="text-[10px] text-[#6B7280]">({item.questions})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend & Insights */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[rgba(6,182,212,0.3)]" />
              <span className="text-[#9CA3AF]">Expected accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#059669]" />
              <span className="text-[#9CA3AF]">Well calibrated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#EF4444]" />
              <span className="text-[#9CA3AF]">Overconfident</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#F59E0B]" />
              <span className="text-[#9CA3AF]">Underconfident</span>
            </div>
          </div>
          
          {/* Calibration Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {calibrationData.map((item, i) => {
              const diff = item.actual - item.expected;
              const isCalibrated = Math.abs(diff) <= 10;
              
              return (
                <div key={i} className="p-3 rounded-lg bg-[#142538]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#E5E7EB]">{item.confidence}</span>
                    {isCalibrated ? (
                      <CheckCircle className="w-4 h-4 text-[#059669]" />
                    ) : diff < 0 ? (
                      <ArrowDown className="w-4 h-4 text-[#EF4444]" />
                    ) : (
                      <ArrowUp className="w-4 h-4 text-[#F59E0B]" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Expected: {item.expected}% → Actual: {item.actual}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Forgetting Curve */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-[#E5E7EB]">
              <LineChart className="w-5 h-5 text-[#F59E0B]" />
              Forgetting Curves & Retention
            </CardTitle>
            <Badge variant="outline" className="border-[rgba(239,68,68,0.3)] text-[#EF4444]">
              3 topics need review
            </Badge>
          </div>
          <p className="text-sm text-[#6B7280]">
            Spaced repetition tracking based on Ebbinghaus forgetting curve
          </p>
        </CardHeader>
        <CardContent>
          {/* Ebbinghaus Curve Visualization */}
          <div className="relative h-48 mb-6 rounded-lg bg-[#142538] p-4 overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-[rgba(6,182,212,0.1)] relative">
                  <span className="absolute -left-1 -top-2 text-[10px] text-[#6B7280]">
                    {100 - i * 25}%
                  </span>
                </div>
              ))}
            </div>
            
            {/* Curve */}
            <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]" preserveAspectRatio="none">
              {/* Without review curve */}
              <path
                d={`M 0 0 
                    C 50 70, 100 85, 150 90
                    S 250 95, 350 98
                    L 350 100 L 0 100 Z`}
                fill="rgba(239,68,68,0.1)"
                stroke="none"
              />
              <path
                d="M 0 0 C 50 70, 100 85, 150 90 S 250 95, 350 98"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="5,5"
                vectorEffect="non-scaling-stroke"
                className="opacity-60"
              />
              
              {/* With spaced repetition curve */}
              <path
                d={`M 0 0 
                    L 30 30 L 35 5 
                    L 80 35 L 85 10 
                    L 150 40 L 155 15
                    L 250 45 L 255 20
                    L 350 25`}
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Review points */}
              {[35, 85, 155, 255].map((x, i) => (
                <circle key={i} cx={x} cy={[5, 10, 15, 20][i]} r="4" fill="#059669" />
              ))}
            </svg>
            
            {/* Labels */}
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-[#6B7280]">
              <span>Day 0</span>
              <span>Day 7</span>
              <span>Day 14</span>
              <span>Day 30</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-[#EF4444] opacity-60" style={{ borderStyle: 'dashed' }} />
              <span className="text-[#9CA3AF]">Without review (Ebbinghaus curve)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-[#059669]" />
              <span className="text-[#9CA3AF]">With spaced repetition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#059669]" />
              <span className="text-[#9CA3AF]">Review sessions</span>
            </div>
          </div>
          
          {/* Topic Retention Status */}
          <h4 className="text-sm font-medium text-[#E5E7EB] mb-3">Topic Retention Status</h4>
          <div className="space-y-3">
            {forgettingCurveData.topics.map((topic, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg ${
                  topic.status === 'critical' ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]' :
                  topic.status === 'overdue' ? 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]' :
                  'bg-[#142538]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[#E5E7EB] font-medium">{topic.name}</span>
                    <Badge className={
                      topic.status === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444] border-none' :
                      topic.status === 'overdue' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-none' :
                      'bg-[#059669]/20 text-[#059669] border-none'
                    }>
                      {topic.status === 'critical' ? 'Critical' :
                       topic.status === 'overdue' ? 'Needs Review' : 'Good'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#E5E7EB]">{topic.currentStrength}%</p>
                    <p className="text-xs text-[#6B7280]">
                      {topic.daysSinceReview}d ago (optimal: {topic.optimalReview}d)
                    </p>
                  </div>
                </div>
                
                {/* Retention bar */}
                <div className="relative h-2 bg-[rgba(6,182,212,0.1)] rounded-full overflow-hidden">
                  {/* Initial strength marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-[#6B7280]"
                    style={{ left: `${topic.initialStrength}%` }}
                  />
                  {/* Current strength */}
                  <div 
                    className={`h-full rounded-full transition-all ${
                      topic.status === 'critical' ? 'bg-[#EF4444]' :
                      topic.status === 'overdue' ? 'bg-[#F59E0B]' :
                      'bg-[#059669]'
                    }`}
                    style={{ width: `${topic.currentStrength}%` }}
                  />
                </div>
                
                {topic.status !== 'good' && (
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" className={
                      topic.status === 'critical' 
                        ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white' 
                        : 'bg-[#F59E0B] hover:bg-[#D97706] text-[#0D1B2A]'
                    }>
                      <Zap className="w-3 h-3 mr-1" />
                      Review Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity & Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#E5E7EB]">
              <Activity className="w-5 h-5 text-[#06B6D4]" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-10 text-sm text-[#9CA3AF]">{day.day}</span>
                  <div className="flex-1">
                    <div className="flex gap-1 h-6">
                      {/* Questions bar */}
                      <div 
                        className="bg-[#06B6D4] rounded"
                        style={{ width: `${(day.questions / 70) * 100}%` }}
                        title={`${day.questions} questions`}
                      />
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-sm text-[#E5E7EB]">{day.accuracy}%</p>
                    <p className="text-xs text-[#6B7280]">{day.hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topic Performance */}
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#E5E7EB]">
              <Target className="w-5 h-5 text-[#059669]" />
              Topic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicPerformance.map((topic, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#E5E7EB]">{topic.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#E5E7EB]">{topic.accuracy}%</span>
                      {topic.trend === "up" && <TrendingUp className="w-3 h-3 text-[#059669]" />}
                      {topic.trend === "down" && <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
                    </div>
                  </div>
                  <Progress value={topic.accuracy} className="h-2" />
                  <p className="text-xs text-[#6B7280] mt-1">{topic.questions} questions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#E5E7EB]">
            <BarChart3 className="w-5 h-5 text-[#F59E0B]" />
            Performance by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {difficultyBreakdown.map((level, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#142538]">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={
                    level.level === "Easy" ? "bg-[rgba(5,150,105,0.2)] text-[#059669] border-none" :
                    level.level === "Medium" ? "bg-[rgba(245,158,11,0.2)] text-[#F59E0B] border-none" :
                    "bg-[rgba(239,68,68,0.2)] text-[#EF4444] border-none"
                  }>
                    {level.level}
                  </Badge>
                  <span className="text-xl font-bold text-[#E5E7EB]">{level.percentage}%</span>
                </div>
                <Progress 
                  value={level.percentage} 
                  className="h-2 mb-2"
                />
                <p className="text-xs text-[#6B7280]">
                  {level.correct} / {level.total} correct
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-[rgba(139,92,246,0.15)] to-[rgba(6,182,212,0.1)] border-[rgba(139,92,246,0.2)]">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#8B5CF6]" />
            Learning Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0D1B2A]/50">
              <p className="text-sm font-medium text-[#059669] mb-1">💪 Strength</p>
              <p className="text-sm text-[#9CA3AF]">
                Your calibration on "Very Sure" questions is excellent (89% actual vs 95% expected). 
                You know what you know!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0D1B2A]/50">
              <p className="text-sm font-medium text-[#F59E0B] mb-1">⚠️ Opportunity</p>
              <p className="text-sm text-[#9CA3AF]">
                Colon Anatomy retention dropped to 45%. Consider reviewing today to strengthen 
                long-term memory before it fades further.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0D1B2A]/50">
              <p className="text-sm font-medium text-[#06B6D4] mb-1">📊 Pattern</p>
              <p className="text-sm text-[#9CA3AF]">
                Your accuracy peaks on Saturdays (90%). Consider scheduling challenging topics 
                for weekends when you're most focused.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#0D1B2A]/50">
              <p className="text-sm font-medium text-[#8B5CF6] mb-1">🎯 Focus</p>
              <p className="text-sm text-[#9CA3AF]">
                Hard questions at 65% accuracy. Target: Practice more "Hard" MCQs to build 
                confidence with complex clinical scenarios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
