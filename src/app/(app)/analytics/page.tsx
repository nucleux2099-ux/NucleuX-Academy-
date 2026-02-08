"use client";

import { useState, useEffect } from "react";
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
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useAnalytics, calculateMemoryStrength } from "@/lib/analytics";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  const {
    analytics,
    isLoaded,
    getCalibration,
    getTopicsForReview,
    getWeeklyStats,
    getOverallAccuracy,
    getTopicPerformance,
    getDifficultyBreakdown,
    refreshMemoryStrengths,
    resetAnalytics,
  } = useAnalytics();
  
  // Get computed data
  const calibrationData = getCalibration();
  const topicsForReview = getTopicsForReview();
  const weeklyStats = getWeeklyStats();
  const overallAccuracy = getOverallAccuracy();
  const topicPerformance = getTopicPerformance();
  const difficultyBreakdown = getDifficultyBreakdown();
  
  // Calculate memory status for topics
  const topicMemoryStatus = analytics.topicMemories.map(memory => {
    const now = new Date();
    const daysSinceReview = Math.floor(
      (now.getTime() - new Date(memory.lastReviewed).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const currentStrength = calculateMemoryStrength(
      memory.initialStrength,
      daysSinceReview,
      memory.reviewCount
    );
    
    let status: 'critical' | 'overdue' | 'good' = 'good';
    if (currentStrength < 50) status = 'critical';
    else if (daysSinceReview >= memory.optimalReviewDays) status = 'overdue';
    
    return {
      ...memory,
      currentStrength,
      daysSinceReview,
      status,
    };
  }).sort((a, b) => a.currentStrength - b.currentStrength);
  
  const criticalTopics = topicMemoryStatus.filter(t => t.status === 'critical' || t.status === 'overdue').length;
  
  // Placeholder data for empty states
  const hasData = analytics.totalQuestions > 0;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#A0B0BC]">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E0D5]">Analytics</h1>
          <p className="text-[#A0B0BC] mt-1">
            {hasData 
              ? "Track your learning progress and performance" 
              : "Start practicing MCQs to see your analytics!"}
          </p>
        </div>
        <div className="flex gap-2">
          {["week", "month", "all"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period
                ? "bg-[#5BB3B3] text-[#2D3E50]"
                : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMemoryStrengths}
            className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-[#5BB3B3]" />
              {overallAccuracy >= 80 && (
                <Badge className="bg-[rgba(5,150,105,0.2)] text-[#7BA69E] border-none text-xs">
                  🎯 Great!
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-[#E8E0D5]">{overallAccuracy}%</p>
            <p className="text-xs text-[#6B7280]">Overall Accuracy</p>
          </CardContent>
        </Card>

        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-[#7BA69E]" />
            </div>
            <p className="text-2xl font-bold text-[#E8E0D5]">{analytics.totalQuestions}</p>
            <p className="text-xs text-[#6B7280]">Questions Attempted</p>
          </CardContent>
        </Card>

        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <p className="text-2xl font-bold text-[#E8E0D5]">{analytics.totalStudyMinutes}m</p>
            <p className="text-xs text-[#6B7280]">Study Time</p>
          </CardContent>
        </Card>

        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-[#C9A86C]" />
            </div>
            <p className="text-2xl font-bold text-[#E8E0D5]">{analytics.currentStreak}</p>
            <p className="text-xs text-[#6B7280]">Day Streak 🔥</p>
          </CardContent>
        </Card>
      </div>

      {/* Calibration Chart */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
              <Brain className="w-5 h-5 text-[#8B5CF6]" />
              Confidence Calibration
            </CardTitle>
            <Badge variant="outline" className="border-[rgba(91,179,179,0.2)] text-[#6B7280]">
              <Info className="w-3 h-3 mr-1" />
              Metacognition
            </Badge>
          </div>
          <p className="text-sm text-[#6B7280]">
            How well does your confidence match your actual performance?
          </p>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="text-center py-12 text-[#6B7280]">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Complete some MCQs with confidence ratings to see calibration data</p>
            </div>
          ) : (
            <>
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
                      <div key={i} className="border-t border-[rgba(91,179,179,0.1)]" />
                    ))}
                  </div>
                  
                  {/* Perfect calibration line */}
                  <svg className="absolute inset-0 w-full h-[calc(100%-32px)]" preserveAspectRatio="none">
                    <line 
                      x1="0%" y1="100%" x2="100%" y2="0%" 
                      stroke="rgba(91,179,179,0.3)" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                  </svg>
                  
                  {/* Bars */}
                  <div className="absolute bottom-8 left-0 right-0 h-[calc(100%-32px)] flex justify-around items-end">
                    {calibrationData.map((item, i) => {
                      const isOverconfident = item.actual < item.expected - 10;
                      const isUnderconfident = item.actual > item.expected + 10;
                      const isCalibrated = !isOverconfident && !isUnderconfident;
                      
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                          <div className="relative w-full flex justify-center gap-1">
                            <div 
                              className="w-8 bg-[rgba(91,179,179,0.3)] rounded-t transition-all"
                              style={{ height: `${item.expected * 2}px` }}
                            />
                            <div 
                              className={`w-8 rounded-t transition-all ${
                                item.totalQuestions === 0 ? 'bg-[#374151]' :
                                isCalibrated ? 'bg-[#7BA69E]' :
                                isOverconfident ? 'bg-[#E57373]' : 'bg-[#C9A86C]'
                              }`}
                              style={{ height: `${Math.max(item.actual, 5) * 2}px` }}
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
                        <p className="text-xs text-[#A0B0BC] capitalize">{item.confidence.replace('-', ' ')}</p>
                        <p className="text-[10px] text-[#6B7280]">({item.totalQuestions})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[rgba(91,179,179,0.3)]" />
                  <span className="text-[#A0B0BC]">Expected accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#7BA69E]" />
                  <span className="text-[#A0B0BC]">Well calibrated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#E57373]" />
                  <span className="text-[#A0B0BC]">Overconfident</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#C9A86C]" />
                  <span className="text-[#A0B0BC]">Underconfident</span>
                </div>
              </div>
              
              {/* Calibration Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {calibrationData.map((item, i) => {
                  const diff = item.actual - item.expected;
                  const isCalibrated = Math.abs(diff) <= 10 || item.totalQuestions === 0;
                  
                  return (
                    <div key={i} className="p-3 rounded-lg bg-[#3A4D5F]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#E8E0D5] capitalize">{item.confidence.replace('-', ' ')}</span>
                        {item.totalQuestions > 0 && (
                          isCalibrated ? (
                            <CheckCircle className="w-4 h-4 text-[#7BA69E]" />
                          ) : diff < 0 ? (
                            <ArrowDown className="w-4 h-4 text-[#E57373]" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-[#C9A86C]" />
                          )
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        Expected: {item.expected}% → Actual: {item.actual}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Forgetting Curve */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
              <LineChart className="w-5 h-5 text-[#C9A86C]" />
              Forgetting Curves & Retention
            </CardTitle>
            {criticalTopics > 0 && (
              <Badge variant="outline" className="border-[rgba(239,68,68,0.3)] text-[#E57373]">
                {criticalTopics} topic{criticalTopics > 1 ? 's' : ''} need review
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#6B7280]">
            Spaced repetition tracking based on Ebbinghaus forgetting curve
          </p>
        </CardHeader>
        <CardContent>
          {/* Ebbinghaus Curve Visualization */}
          <div className="relative h-48 mb-6 rounded-lg bg-[#3A4D5F] p-4 overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-[rgba(91,179,179,0.1)] relative">
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
                stroke="#E57373"
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
                stroke="#7BA69E"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Review points */}
              {[35, 85, 155, 255].map((x, i) => (
                <circle key={i} cx={x} cy={[5, 10, 15, 20][i]} r="4" fill="#7BA69E" />
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
              <div className="w-6 h-0.5 bg-[#E57373] opacity-60" style={{ borderStyle: 'dashed' }} />
              <span className="text-[#A0B0BC]">Without review (Ebbinghaus curve)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-[#7BA69E]" />
              <span className="text-[#A0B0BC]">With spaced repetition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7BA69E]" />
              <span className="text-[#A0B0BC]">Review sessions</span>
            </div>
          </div>
          
          {/* Topic Retention Status */}
          <h4 className="text-sm font-medium text-[#E8E0D5] mb-3">Topic Retention Status</h4>
          {topicMemoryStatus.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280]">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Complete MCQs to track topic retention</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topicMemoryStatus.map((topic, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg ${
                    topic.status === 'critical' ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]' :
                    topic.status === 'overdue' ? 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]' :
                    'bg-[#3A4D5F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[#E8E0D5] font-medium">{topic.topicName}</span>
                      <Badge className={
                        topic.status === 'critical' ? 'bg-[#E57373]/20 text-[#E57373] border-none' :
                        topic.status === 'overdue' ? 'bg-[#C9A86C]/20 text-[#C9A86C] border-none' :
                        'bg-[#7BA69E]/20 text-[#7BA69E] border-none'
                      }>
                        {topic.status === 'critical' ? 'Critical' :
                         topic.status === 'overdue' ? 'Needs Review' : 'Good'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#E8E0D5]">{topic.currentStrength}%</p>
                      <p className="text-xs text-[#6B7280]">
                        {topic.daysSinceReview}d ago (optimal: {topic.optimalReviewDays}d)
                      </p>
                    </div>
                  </div>
                  
                  {/* Retention bar */}
                  <div className="relative h-2 bg-[rgba(91,179,179,0.1)] rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-[#6B7280]"
                      style={{ left: `${topic.initialStrength}%` }}
                    />
                    <div 
                      className={`h-full rounded-full transition-all ${
                        topic.status === 'critical' ? 'bg-[#E57373]' :
                        topic.status === 'overdue' ? 'bg-[#C9A86C]' :
                        'bg-[#7BA69E]'
                      }`}
                      style={{ width: `${topic.currentStrength}%` }}
                    />
                  </div>
                  
                  {topic.status !== 'good' && (
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" className={
                        topic.status === 'critical' 
                          ? 'bg-[#E57373] hover:bg-[#DC2626] text-white' 
                          : 'bg-[#C9A86C] hover:bg-[#D97706] text-[#2D3E50]'
                      }>
                        <Zap className="w-3 h-3 mr-1" />
                        Review Now
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Activity & Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
              <Activity className="w-5 h-5 text-[#5BB3B3]" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyStats.map((day, i) => {
                const dayName = days[new Date(day.date).getDay()];
                const accuracy = day.questionsAttempted > 0 
                  ? Math.round((day.questionsCorrect / day.questionsAttempted) * 100) 
                  : 0;
                
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-10 text-sm text-[#A0B0BC]">{dayName}</span>
                    <div className="flex-1">
                      <div className="flex gap-1 h-6">
                        <div 
                          className="bg-[#5BB3B3] rounded"
                          style={{ width: `${Math.min((day.questionsAttempted / 50) * 100, 100)}%` }}
                          title={`${day.questionsAttempted} questions`}
                        />
                      </div>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-sm text-[#E8E0D5]">{accuracy || '-'}%</p>
                      <p className="text-xs text-[#6B7280]">{day.studyMinutes}m</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Topic Performance */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
              <Target className="w-5 h-5 text-[#7BA69E]" />
              Topic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topicPerformance.length === 0 ? (
              <div className="text-center py-8 text-[#6B7280]">
                <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Complete MCQs to track topic performance</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topicPerformance.slice(0, 5).map((topic, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#E8E0D5]">{topic.topicName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#E8E0D5]">{topic.accuracy}%</span>
                        {topic.trend === "up" && <TrendingUp className="w-3 h-3 text-[#7BA69E]" />}
                        {topic.trend === "down" && <TrendingDown className="w-3 h-3 text-[#E57373]" />}
                      </div>
                    </div>
                    <Progress value={topic.accuracy} className="h-2" />
                    <p className="text-xs text-[#6B7280] mt-1">{topic.attempts} questions</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
            <BarChart3 className="w-5 h-5 text-[#C9A86C]" />
            Performance by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {difficultyBreakdown.map((level, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#3A4D5F]">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={
                    level.difficulty === "Easy" ? "bg-[rgba(5,150,105,0.2)] text-[#7BA69E] border-none" :
                    level.difficulty === "Medium" ? "bg-[rgba(245,158,11,0.2)] text-[#C9A86C] border-none" :
                    "bg-[rgba(239,68,68,0.2)] text-[#E57373] border-none"
                  }>
                    {level.difficulty}
                  </Badge>
                  <span className="text-xl font-bold text-[#E8E0D5]">
                    {level.total > 0 ? level.percentage : '-'}%
                  </span>
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
      {hasData && (
        <Card className="bg-gradient-to-r from-[rgba(139,92,246,0.15)] to-[rgba(91,179,179,0.1)] border-[rgba(139,92,246,0.2)]">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#E8E0D5] mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#8B5CF6]" />
              Learning Insights
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {calibrationData.some(c => c.totalQuestions > 0 && Math.abs(c.actual - c.expected) <= 10) && (
                <div className="p-4 rounded-lg bg-[#2D3E50]/50">
                  <p className="text-sm font-medium text-[#7BA69E] mb-1">💪 Strength</p>
                  <p className="text-sm text-[#A0B0BC]">
                    Your confidence calibration is improving! You're learning to accurately 
                    assess what you know.
                  </p>
                </div>
              )}
              {criticalTopics > 0 && (
                <div className="p-4 rounded-lg bg-[#2D3E50]/50">
                  <p className="text-sm font-medium text-[#C9A86C] mb-1">⚠️ Opportunity</p>
                  <p className="text-sm text-[#A0B0BC]">
                    {criticalTopics} topic{criticalTopics > 1 ? 's' : ''} {criticalTopics > 1 ? 'have' : 'has'} retention 
                    below optimal. Review them today to strengthen long-term memory!
                  </p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-[#2D3E50]/50">
                <p className="text-sm font-medium text-[#5BB3B3] mb-1">📊 Stats</p>
                <p className="text-sm text-[#A0B0BC]">
                  You've answered {analytics.totalQuestions} questions with {overallAccuracy}% accuracy.
                  {analytics.currentStreak > 0 && ` Current streak: ${analytics.currentStreak} days!`}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#2D3E50]/50">
                <p className="text-sm font-medium text-[#8B5CF6] mb-1">🎯 Focus</p>
                <p className="text-sm text-[#A0B0BC]">
                  {difficultyBreakdown.find(d => d.difficulty === 'Hard')?.percentage || 0 < 70
                    ? "Target: Practice more 'Hard' MCQs to build confidence with complex scenarios."
                    : "Great work on hard questions! Keep challenging yourself."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug/Reset (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Reset all analytics data?')) {
                resetAnalytics();
              }
            }}
            className="border-[rgba(239,68,68,0.2)] text-[#E57373] hover:bg-[rgba(239,68,68,0.1)]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset Analytics
          </Button>
        </div>
      )}
    </div>
  );
}
