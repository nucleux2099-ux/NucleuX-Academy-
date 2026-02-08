"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap,
  Target,
  Calendar,
  Sparkles,
  ChevronRight,
  Check,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/contexts/UserContext";
import type { UserLevel, ExamTarget } from "@/lib/types/user";
import { USER_LEVEL_CONFIG, EXAM_TARGET_CONFIG } from "@/lib/types/user";

interface UserOnboardingProps {
  onComplete?: () => void;
}

export function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const { user, updateLevel, updateExamTarget, updatePreferences } = useUser();
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(user?.level || 'pg');
  const [selectedExam, setSelectedExam] = useState<ExamTarget>(user?.examTarget || 'neet_pg');
  const [examDate, setExamDate] = useState<string>(user?.examDate || '');
  const [dailyGoal, setDailyGoal] = useState(user?.preferences.dailyGoalMinutes || 30);

  const handleComplete = () => {
    updateLevel(selectedLevel);
    updateExamTarget(selectedExam, examDate || undefined);
    updatePreferences({ dailyGoalMinutes: dailyGoal });
    onComplete?.();
  };

  const levels: UserLevel[] = ['ug', 'pg', 'resident', 'practitioner'];
  const exams: ExamTarget[] = ['neet_pg', 'inicet', 'usmle_step1', 'usmle_step2', 'mrcs', 'fmge', 'none'];
  const dailyGoalOptions = [15, 30, 45, 60, 90];

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-[#142538] border-[rgba(6,182,212,0.2)]">
        {/* Progress indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-colors",
                  s <= step ? "bg-[#06B6D4]" : "bg-[#374151]"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Level Selection */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <GraduationCap className="w-6 h-6 text-[#06B6D4]" />
                What's your level?
              </CardTitle>
              <CardDescription className="text-[#9CA3AF]">
                This helps us tailor content complexity for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {levels.map((level) => {
                const config = USER_LEVEL_CONFIG[level];
                const isSelected = selectedLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={cn(
                      "w-full p-4 rounded-xl flex items-center gap-4 transition-all text-left",
                      isSelected
                        ? "bg-[rgba(6,182,212,0.15)] border-2 border-[#06B6D4]"
                        : "bg-[#0D1B2A] border-2 border-transparent hover:border-[rgba(6,182,212,0.2)]"
                    )}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <div className="flex-1">
                      <p className={cn(
                        "font-semibold",
                        isSelected ? "text-[#06B6D4]" : "text-[#E5E7EB]"
                      )}>
                        {config.label}
                      </p>
                      <p className="text-sm text-[#9CA3AF]">{config.description}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#06B6D4]" />
                    )}
                  </button>
                );
              })}
              
              <Button
                onClick={() => setStep(2)}
                className="w-full mt-4 bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </>
        )}

        {/* Step 2: Exam Target */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <Target className="w-6 h-6 text-[#F59E0B]" />
                What are you preparing for?
              </CardTitle>
              <CardDescription className="text-[#9CA3AF]">
                We'll prioritize high-yield content for your exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {exams.map((exam) => {
                  const config = EXAM_TARGET_CONFIG[exam];
                  const isSelected = selectedExam === exam;
                  return (
                    <button
                      key={exam}
                      onClick={() => setSelectedExam(exam)}
                      className={cn(
                        "p-3 rounded-xl flex flex-col items-center gap-2 transition-all",
                        isSelected
                          ? "bg-[rgba(245,158,11,0.15)] border-2 border-[#F59E0B]"
                          : "bg-[#0D1B2A] border-2 border-transparent hover:border-[rgba(245,158,11,0.2)]"
                      )}
                    >
                      <span className="text-lg">{config.country}</span>
                      <p className={cn(
                        "font-medium text-sm text-center",
                        isSelected ? "text-[#F59E0B]" : "text-[#E5E7EB]"
                      )}>
                        {config.label}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedExam !== 'none' && (
                <div className="mt-4">
                  <label className="text-sm text-[#9CA3AF] mb-2 block">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Exam Date (optional)
                  </label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="bg-[#0D1B2A] border-[rgba(6,182,212,0.2)] text-[#E5E7EB]"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-[rgba(6,182,212,0.2)] text-[#9CA3AF]"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Daily Goal */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <Clock className="w-6 h-6 text-[#10B981]" />
                Set your daily goal
              </CardTitle>
              <CardDescription className="text-[#9CA3AF]">
                How much time can you dedicate each day?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {dailyGoalOptions.map((mins) => {
                  const isSelected = dailyGoal === mins;
                  return (
                    <button
                      key={mins}
                      onClick={() => setDailyGoal(mins)}
                      className={cn(
                        "p-3 rounded-xl flex flex-col items-center gap-1 transition-all",
                        isSelected
                          ? "bg-[rgba(16,185,129,0.15)] border-2 border-[#10B981]"
                          : "bg-[#0D1B2A] border-2 border-transparent hover:border-[rgba(16,185,129,0.2)]"
                      )}
                    >
                      <p className={cn(
                        "font-bold text-lg",
                        isSelected ? "text-[#10B981]" : "text-[#E5E7EB]"
                      )}>
                        {mins}
                      </p>
                      <p className="text-xs text-[#6B7280]">min</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-[#0D1B2A] rounded-xl">
                <p className="text-sm text-[#9CA3AF]">
                  {dailyGoal <= 15 && "🌱 Perfect for building a habit. Start small!"}
                  {dailyGoal === 30 && "⭐ The sweet spot for consistent learning."}
                  {dailyGoal === 45 && "🔥 Great commitment! You'll see rapid progress."}
                  {dailyGoal === 60 && "💪 Dedicated learner! Remember to take breaks."}
                  {dailyGoal >= 90 && "🚀 Power mode! Make sure it's sustainable."}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-[rgba(6,182,212,0.2)] text-[#9CA3AF]"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] hover:from-[#0891B2] hover:to-[#7C3AED] text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Let's Go!
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

// =============================================================================
// PROFILE SETTINGS COMPONENT (For settings page)
// =============================================================================

export function ProfileSettings() {
  const { user, updateLevel, updateExamTarget, updatePreferences } = useUser();
  
  if (!user) return null;

  const levels: UserLevel[] = ['ug', 'pg', 'resident', 'practitioner'];
  const exams: ExamTarget[] = ['neet_pg', 'inicet', 'usmle_step1', 'usmle_step2', 'mrcs', 'fmge', 'none'];

  return (
    <div className="space-y-6">
      {/* Current Level */}
      <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
        <CardHeader>
          <CardTitle className="text-[#E5E7EB] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#06B6D4]" />
            Your Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => {
              const config = USER_LEVEL_CONFIG[level];
              const isSelected = user.level === level;
              return (
                <button
                  key={level}
                  onClick={() => updateLevel(level)}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
                    isSelected
                      ? "bg-[#06B6D4] text-[#0D1B2A]"
                      : "bg-[#0D1B2A] text-[#9CA3AF] hover:text-[#E5E7EB]"
                  )}
                >
                  <span>{config.icon}</span>
                  <span className="font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Exam Target */}
      <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
        <CardHeader>
          <CardTitle className="text-[#E5E7EB] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#F59E0B]" />
            Exam Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {exams.map((exam) => {
              const config = EXAM_TARGET_CONFIG[exam];
              const isSelected = user.examTarget === exam;
              return (
                <button
                  key={exam}
                  onClick={() => updateExamTarget(exam)}
                  className={cn(
                    "px-3 py-2 rounded-lg flex items-center gap-2 transition-all",
                    isSelected
                      ? "bg-[#F59E0B] text-[#0D1B2A]"
                      : "bg-[#0D1B2A] text-[#9CA3AF] hover:text-[#E5E7EB]"
                  )}
                >
                  <span>{config.country}</span>
                  <span className="font-medium text-sm">{config.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
        <CardHeader>
          <CardTitle className="text-[#E5E7EB] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#EC4899]" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0D1B2A] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#06B6D4]">{user.streak.currentStreak}</p>
              <p className="text-xs text-[#9CA3AF]">Day Streak 🔥</p>
            </div>
            <div className="p-4 bg-[#0D1B2A] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#10B981]">{user.completedTopicsCount}</p>
              <p className="text-xs text-[#9CA3AF]">Topics Done</p>
            </div>
            <div className="p-4 bg-[#0D1B2A] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#F59E0B]">{Math.round(user.totalStudyMinutes / 60)}h</p>
              <p className="text-xs text-[#9CA3AF]">Study Time</p>
            </div>
            <div className="p-4 bg-[#0D1B2A] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#EC4899]">{user.streak.longestStreak}</p>
              <p className="text-xs text-[#9CA3AF]">Best Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
