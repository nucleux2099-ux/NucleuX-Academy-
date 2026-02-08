"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame,
  Target,
  Clock,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  ChevronRight,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import { EXAM_TARGET_CONFIG, USER_LEVEL_CONFIG } from "@/lib/types/user";
import Link from "next/link";

// =============================================================================
// STREAK CARD
// =============================================================================

export function StreakCard() {
  const { user, updateStreak } = useUser();
  
  if (!user) return null;

  const { currentStreak, longestStreak, totalStudyDays } = user.streak;

  return (
    <Card className="bg-gradient-to-br from-[#142538] to-[#0D1B2A] border-[rgba(245,158,11,0.2)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className={cn(
                "w-6 h-6",
                currentStreak > 0 ? "text-[#F59E0B]" : "text-[#6B7280]"
              )} />
              <span className="text-sm text-[#9CA3AF]">Current Streak</span>
            </div>
            <p className="text-4xl font-bold text-[#E5E7EB]">
              {currentStreak}
              <span className="text-lg text-[#9CA3AF] ml-1">days</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Best: {longestStreak} days</p>
            <p className="text-sm text-[#6B7280]">Total: {totalStudyDays} days</p>
          </div>
        </div>
        
        {currentStreak > 0 && (
          <div className="mt-4 p-3 bg-[rgba(245,158,11,0.1)] rounded-lg">
            <p className="text-sm text-[#F59E0B]">
              {currentStreak >= 7 
                ? "🔥 You're on fire! Keep the momentum going!"
                : currentStreak >= 3
                  ? "💪 Great consistency! You're building a habit!"
                  : "🌱 Nice start! Come back tomorrow to grow your streak!"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// DAILY GOAL CARD
// =============================================================================

export function DailyGoalCard() {
  const { user } = useUser();
  
  if (!user) return null;

  const { dailyGoalMinutes } = user.preferences;
  const todayMinutes = 0; // TODO: Calculate from today's sessions
  const progress = Math.min(100, (todayMinutes / dailyGoalMinutes) * 100);

  return (
    <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#06B6D4]" />
            <span className="font-medium text-[#E5E7EB]">Daily Goal</span>
          </div>
          <Badge className={cn(
            progress >= 100 
              ? "bg-[#10B981]/20 text-[#10B981]" 
              : "bg-[#06B6D4]/20 text-[#06B6D4]"
          )}>
            {todayMinutes} / {dailyGoalMinutes} min
          </Badge>
        </div>
        
        <Progress 
          value={progress} 
          className="h-3 bg-[#0D1B2A]"
        />
        
        {progress >= 100 ? (
          <p className="text-sm text-[#10B981] mt-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Goal achieved! Great work today!
          </p>
        ) : (
          <p className="text-sm text-[#9CA3AF] mt-3">
            {dailyGoalMinutes - todayMinutes} minutes left to reach your goal
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// EXAM COUNTDOWN CARD
// =============================================================================

export function ExamCountdownCard() {
  const { user } = useUser();
  
  if (!user || !user.examDate) return null;

  const examDate = new Date(user.examDate);
  const today = new Date();
  const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const examConfig = EXAM_TARGET_CONFIG[user.examTarget];

  if (daysLeft < 0) return null;

  return (
    <Card className={cn(
      "border-2",
      daysLeft <= 30 
        ? "bg-[rgba(239,68,68,0.1)] border-[#EF4444]" 
        : daysLeft <= 90
          ? "bg-[rgba(245,158,11,0.1)] border-[#F59E0B]"
          : "bg-[#142538] border-[rgba(6,182,212,0.1)]"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className={cn(
                "w-5 h-5",
                daysLeft <= 30 ? "text-[#EF4444]" : daysLeft <= 90 ? "text-[#F59E0B]" : "text-[#06B6D4]"
              )} />
              <span className="text-sm text-[#9CA3AF]">{examConfig.label}</span>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              daysLeft <= 30 ? "text-[#EF4444]" : daysLeft <= 90 ? "text-[#F59E0B]" : "text-[#E5E7EB]"
            )}>
              {daysLeft}
              <span className="text-lg text-[#9CA3AF] ml-1">days left</span>
            </p>
          </div>
          <div className="text-4xl">
            {examConfig.country}
          </div>
        </div>
        
        {daysLeft <= 30 && (
          <div className="mt-4 p-3 bg-[rgba(239,68,68,0.1)] rounded-lg">
            <p className="text-sm text-[#EF4444]">
              ⚡ Final sprint! Focus on high-yield topics and revision.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// WEAK AREAS CARD
// =============================================================================

export function WeakAreasCard() {
  const { getWeakAreas } = useUser();
  const weakAreas = getWeakAreas();

  if (weakAreas.length === 0) return null;

  return (
    <Card className="bg-[#142538] border-[rgba(239,68,68,0.2)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#E5E7EB] flex items-center gap-2 text-base">
          <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          Needs Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weakAreas.slice(0, 3).map((area) => (
            <Link
              key={area.topicId}
              href={`/library/surgery/esophagus/${area.topicId}`}
              className="flex items-center justify-between p-3 bg-[#0D1B2A] rounded-lg hover:bg-[rgba(239,68,68,0.05)] transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-[#E5E7EB]">{area.topicName}</p>
                <p className="text-xs text-[#9CA3AF]">
                  {area.reason === 'low_quiz_score' && `Quiz score: ${area.score}%`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// DUE FOR REVIEW CARD
// =============================================================================

export function DueForReviewCard() {
  const { getDueForReview } = useUser();
  const dueTopics = getDueForReview();

  if (dueTopics.length === 0) return null;

  return (
    <Card className="bg-[#142538] border-[rgba(139,92,246,0.2)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#E5E7EB] flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-[#8B5CF6]" />
          Due for Review
          <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs">
            {dueTopics.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#9CA3AF] mb-3">
          Spaced repetition keeps knowledge fresh. Review these topics:
        </p>
        <div className="space-y-2">
          {dueTopics.slice(0, 3).map((topicId) => (
            <Link
              key={topicId}
              href={`/library/surgery/esophagus/${topicId}?mode=quiz`}
              className="flex items-center justify-between p-3 bg-[#0D1B2A] rounded-lg hover:bg-[rgba(139,92,246,0.05)] transition-colors"
            >
              <p className="text-sm font-medium text-[#E5E7EB]">{topicId}</p>
              <Badge className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs">Quiz</Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// LEARNING STATS OVERVIEW
// =============================================================================

export function LearningStatsOverview() {
  const { user } = useUser();
  
  if (!user) return null;

  const levelConfig = USER_LEVEL_CONFIG[user.level];
  const examConfig = EXAM_TARGET_CONFIG[user.examTarget];

  return (
    <Card className="bg-gradient-to-br from-[#142538] to-[#0D1B2A] border-[rgba(6,182,212,0.2)]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-2xl">
            {levelConfig.icon}
          </div>
          <div>
            <p className="font-semibold text-[#E5E7EB]">{levelConfig.label}</p>
            <p className="text-sm text-[#9CA3AF]">
              Preparing for {examConfig.label} {examConfig.country}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#0D1B2A] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#06B6D4]" />
              <span className="text-xs text-[#9CA3AF]">Topics</span>
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{user.completedTopicsCount}</p>
            <p className="text-xs text-[#6B7280]">completed</p>
          </div>
          
          <div className="p-4 bg-[#0D1B2A] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs text-[#9CA3AF]">Time</span>
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{Math.round(user.totalStudyMinutes / 60)}</p>
            <p className="text-xs text-[#6B7280]">hours studied</p>
          </div>
          
          <div className="p-4 bg-[#0D1B2A] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs text-[#9CA3AF]">Streak</span>
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{user.streak.currentStreak}</p>
            <p className="text-xs text-[#6B7280]">day streak</p>
          </div>
          
          <div className="p-4 bg-[#0D1B2A] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#EC4899]" />
              <span className="text-xs text-[#9CA3AF]">Progress</span>
            </div>
            <p className="text-2xl font-bold text-[#E5E7EB]">{Object.keys(user.topicProgress).length}</p>
            <p className="text-xs text-[#6B7280]">topics started</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
