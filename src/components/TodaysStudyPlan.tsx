"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Play,
  CheckCircle,
  RotateCcw,
  BookOpen,
  Target,
  Brain,
  Shuffle,
  ChevronRight,
  Sparkles,
  Flame,
  Trophy,
} from "lucide-react";

// Types
interface StudyTask {
  id: string;
  title: string;
  subtitle: string;
  type: "spaced_rep" | "new_content" | "mcq_practice" | "retrieval_quiz";
  duration: number; // minutes
  status: "pending" | "current" | "completed" | "skipped";
  dueReason?: string; // "Day 7 review", "Pathway progress", etc.
  topicId?: string;
  coins: number;
  xp: number;
}

interface DayProgress {
  totalTasks: number;
  completedTasks: number;
  totalMinutes: number;
  completedMinutes: number;
  streak: number;
  coinsEarned: number;
}

// Mock data - replace with real data from backend
const mockTasks: StudyTask[] = [
  {
    id: "1",
    title: "Review: Variceal Bleeding",
    subtitle: "Spaced rep: Day 7 review window",
    type: "spaced_rep",
    duration: 15,
    status: "pending",
    dueReason: "Optimal retention window",
    topicId: "variceal",
    coins: 30,
    xp: 3,
  },
  {
    id: "2",
    title: "New: Pancreatic Pseudocyst",
    subtitle: "Pathway: Surgical GI Ch.4",
    type: "new_content",
    duration: 25,
    status: "pending",
    dueReason: "Next in pathway",
    topicId: "pancreatic-pseudocyst",
    coins: 40,
    xp: 4,
  },
  {
    id: "3",
    title: "Practice: 15 Mixed MCQs",
    subtitle: "Weak areas + random interleaving",
    type: "mcq_practice",
    duration: 20,
    status: "pending",
    dueReason: "Interleaved practice",
    coins: 50,
    xp: 5,
  },
  {
    id: "4",
    title: "Quick Quiz: Yesterday's Topics",
    subtitle: "Retrieval practice: Hepatobiliary",
    type: "retrieval_quiz",
    duration: 10,
    status: "pending",
    dueReason: "24-hour retrieval",
    coins: 25,
    xp: 3,
  },
];

const mockProgress: DayProgress = {
  totalTasks: 4,
  completedTasks: 0,
  totalMinutes: 70,
  completedMinutes: 0,
  streak: 12,
  coinsEarned: 0,
};

// Utility functions
function getTaskIcon(type: StudyTask["type"]) {
  switch (type) {
    case "spaced_rep":
      return <RotateCcw className="w-4 h-4" />;
    case "new_content":
      return <BookOpen className="w-4 h-4" />;
    case "mcq_practice":
      return <Target className="w-4 h-4" />;
    case "retrieval_quiz":
      return <Brain className="w-4 h-4" />;
  }
}

function getTaskColor(type: StudyTask["type"]) {
  switch (type) {
    case "spaced_rep":
      return { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" };
    case "new_content":
      return { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" };
    case "mcq_practice":
      return { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" };
    case "retrieval_quiz":
      return { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" };
  }
}

function getTypeLabel(type: StudyTask["type"]) {
  switch (type) {
    case "spaced_rep":
      return "Spaced Rep";
    case "new_content":
      return "New Content";
    case "mcq_practice":
      return "MCQ Practice";
    case "retrieval_quiz":
      return "Retrieval";
  }
}

export function TodaysStudyPlan() {
  const router = useRouter();
  const [tasks, setTasks] = useState(mockTasks);
  const [progress, setProgress] = useState(mockProgress);
  const [isStarted, setIsStarted] = useState(false);

  const totalCoins = tasks.reduce((sum, t) => sum + t.coins, 0);
  const totalXP = tasks.reduce((sum, t) => sum + t.xp, 0);
  const completionBonus = 100; // Bonus for completing all tasks

  const handleStartDay = () => {
    setIsStarted(true);
    // Mark first task as current
    setTasks(prev => prev.map((t, i) => 
      i === 0 ? { ...t, status: "current" as const } : t
    ));
  };

  const handleTaskClick = (task: StudyTask) => {
    if (task.status === "completed") return;
    
    // Navigate based on task type
    switch (task.type) {
      case "spaced_rep":
      case "new_content":
        router.push(`/library/${task.topicId}`);
        break;
      case "mcq_practice":
        router.push("/mcqs?mode=practice&type=mixed");
        break;
      case "retrieval_quiz":
        router.push("/mcqs?mode=quiz&type=retrieval");
        break;
    }
  };

  const handleCompleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: "completed" as const };
        }
        return t;
      });
      
      // Find next pending task and mark as current
      const completedIndex = updated.findIndex(t => t.id === taskId);
      const nextPending = updated.findIndex((t, i) => i > completedIndex && t.status === "pending");
      if (nextPending !== -1) {
        updated[nextPending] = { ...updated[nextPending], status: "current" as const };
      }
      
      return updated;
    });

    // Update progress
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setProgress(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        completedMinutes: prev.completedMinutes + task.duration,
        coinsEarned: prev.coinsEarned + task.coins,
      }));
    }
  };

  const completedPercentage = (progress.completedTasks / progress.totalTasks) * 100;
  const allCompleted = progress.completedTasks === progress.totalTasks;

  return (
    <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] border-l-4 border-l-[#5BB3B3]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
            <Calendar className="w-5 h-5 text-[#5BB3B3]" />
            Today's Study Plan
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#A0B0BC]">~{progress.totalMinutes} min</span>
            {progress.streak > 0 && (
              <Badge className="bg-[rgba(245,158,11,0.15)] text-[#C9A86C] border-[rgba(245,158,11,0.3)]">
                <Flame className="w-3 h-3 mr-1" />
                {progress.streak} day streak
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isStarted && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
              <span>{progress.completedTasks}/{progress.totalTasks} tasks</span>
              <span>{progress.completedMinutes}/{progress.totalMinutes} min</span>
            </div>
            <Progress value={completedPercentage} className="h-2 bg-[#3A4D5F]" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Task List */}
        {tasks.map((task, index) => {
          const colors = getTaskColor(task.type);
          const isActive = task.status === "current";
          const isCompleted = task.status === "completed";
          
          return (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer group",
                isCompleted && "opacity-60",
                isActive 
                  ? "bg-[rgba(91,179,179,0.1)] border-[rgba(91,179,179,0.3)]"
                  : "bg-[#2D3E50] border-[rgba(91,179,179,0.1)] hover:border-[rgba(91,179,179,0.2)]"
              )}
            >
              {/* Status/Type Icon */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                isCompleted 
                  ? "bg-[#7BA69E]/20 text-[#10B981]"
                  : isActive
                    ? "bg-[#5BB3B3] text-white shadow-lg shadow-[#5BB3B3]/30"
                    : `${colors.bg} ${colors.text}`
              )}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isActive ? (
                  <Play className="w-5 h-5" />
                ) : (
                  getTaskIcon(task.type)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={cn(
                    "font-medium text-sm",
                    isCompleted ? "line-through text-[#6B7280]" : "text-[#E8E0D5]"
                  )}>
                    {task.title}
                  </p>
                  <Badge className={cn("text-xs", colors.bg, colors.text, colors.border)}>
                    {getTypeLabel(task.type)}
                  </Badge>
                </div>
                <p className="text-xs text-[#6B7280]">{task.subtitle}</p>
              </div>

              {/* Duration & Action */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-[#A0B0BC] bg-[#3A4D5F] px-2 py-1 rounded-full border border-[rgba(91,179,179,0.1)]">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {task.duration} min
                  </span>
                  <p className="text-xs text-[#6B7280] mt-1">+{task.coins} 🪙</p>
                </div>

                {isActive && !isCompleted && (
                  <Button
                    size="sm"
                    onClick={(e) => handleCompleteTask(task.id, e)}
                    className="bg-[#7BA69E] hover:bg-[#047857] text-white h-8 text-xs shadow-md"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Done
                  </Button>
                )}

                {!isActive && !isCompleted && (
                  <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#5BB3B3] transition-colors" />
                )}
              </div>
            </div>
          );
        })}

        {/* Completion Bonus Preview */}
        {!allCompleted && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-[#5BB3B3]/10 to-[#5BB3B3]/10 border border-[rgba(91,179,179,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#C9A86C]" />
                <span className="text-sm text-[#E8E0D5]">Complete all tasks</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#C9A86C]">+{completionBonus} 🪙 bonus</span>
                <span className="text-[#6B7280]">•</span>
                <span className="text-[#A78BFA]">+{totalXP} XP total</span>
              </div>
            </div>
          </div>
        )}

        {/* All Completed State */}
        {allCompleted && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-[#7BA69E]/20 to-[#5BB3B3]/20 border border-[#7BA69E]/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#C9A86C]" />
              <span className="font-semibold text-[#E8E0D5]">Day Complete!</span>
              <Sparkles className="w-5 h-5 text-[#C9A86C]" />
            </div>
            <p className="text-sm text-[#A0B0BC]">
              You earned <span className="text-[#C9A86C] font-medium">{progress.coinsEarned + completionBonus} coins</span> and 
              <span className="text-[#A78BFA] font-medium"> {totalXP} XP</span> today!
            </p>
            <p className="text-xs text-[#7BA69E] mt-1">
              🔥 Streak extended to {progress.streak + 1} days!
            </p>
          </div>
        )}

        {/* Start Day Button */}
        {!isStarted && (
          <Button
            onClick={handleStartDay}
            className="w-full bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium shadow-lg shadow-[#5BB3B3]/20"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Today's Plan
            <span className="ml-2 text-xs opacity-80">({totalCoins} coins available)</span>
          </Button>
        )}

        {/* Learning Science Note */}
        <div className="pt-2 border-t border-[rgba(91,179,179,0.1)]">
          <div className="flex items-start gap-2 text-xs text-[#6B7280]">
            <Shuffle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>
              <strong className="text-[#A0B0BC]">Interleaved learning:</strong> Tasks mix review, new content, and retrieval for optimal retention
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TodaysStudyPlan;
