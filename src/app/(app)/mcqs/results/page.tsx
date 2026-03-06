"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  XCircle,
  BookOpen,
  Brain,
  Sparkles,
} from "lucide-react";

interface QuestionResult {
  id: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
  timeSpent: number;
}

const sampleResults: QuestionResult[] = [
  {
    id: "1",
    question: "A 45-year-old man with cirrhosis presents with hematemesis. What is the initial management?",
    selectedAnswer: "B",
    correctAnswer: "B",
    isCorrect: true,
    topic: "Portal Hypertension",
    timeSpent: 45,
  },
  {
    id: "2",
    question: "Which is the most common cause of portal hypertension worldwide?",
    selectedAnswer: "A",
    correctAnswer: "C",
    isCorrect: false,
    topic: "Portal Hypertension",
    timeSpent: 62,
  },
  {
    id: "3",
    question: "HVPG value for clinically significant portal hypertension is:",
    selectedAnswer: "B",
    correctAnswer: "B",
    isCorrect: true,
    topic: "Portal Hypertension",
    timeSpent: 28,
  },
  {
    id: "4",
    question: "First line treatment for hepatic encephalopathy includes:",
    selectedAnswer: "D",
    correctAnswer: "D",
    isCorrect: true,
    topic: "Hepatic Encephalopathy",
    timeSpent: 55,
  },
  {
    id: "5",
    question: "Child-Pugh score parameters include all EXCEPT:",
    selectedAnswer: "C",
    correctAnswer: "C",
    isCorrect: true,
    topic: "Cirrhosis",
    timeSpent: 40,
  },
  {
    id: "6",
    question: "Most common cause of SBP in cirrhotics:",
    selectedAnswer: "A",
    correctAnswer: "B",
    isCorrect: false,
    topic: "Ascites",
    timeSpent: 38,
  },
  {
    id: "7",
    question: "TIPS is contraindicated in:",
    selectedAnswer: "D",
    correctAnswer: "D",
    isCorrect: true,
    topic: "Portal Hypertension",
    timeSpent: 52,
  },
  {
    id: "8",
    question: "Diagnostic paracentesis in SBP shows:",
    selectedAnswer: "B",
    correctAnswer: "B",
    isCorrect: true,
    topic: "Ascites",
    timeSpent: 35,
  },
  {
    id: "9",
    question: "Band ligation vs sclerotherapy - preferred for esophageal varices:",
    selectedAnswer: "A",
    correctAnswer: "A",
    isCorrect: true,
    topic: "Variceal Bleeding",
    timeSpent: 30,
  },
  {
    id: "10",
    question: "Type 1 HRS criteria includes:",
    selectedAnswer: "C",
    correctAnswer: "A",
    isCorrect: false,
    topic: "HRS",
    timeSpent: 68,
  },
];

export default function ResultsPage() {
  const [showReview, setShowReview] = useState(false);
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  const correctCount = sampleResults.filter((r) => r.isCorrect).length;
  const totalCount = sampleResults.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  const totalTime = sampleResults.reduce((acc, r) => acc + r.timeSpent, 0);
  const avgTime = Math.round(totalTime / totalCount);

  // Group by topic
  const topicStats = sampleResults.reduce((acc, r) => {
    if (!acc[r.topic]) {
      acc[r.topic] = { correct: 0, total: 0 };
    }
    acc[r.topic].total++;
    if (r.isCorrect) acc[r.topic].correct++;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const filteredResults = sampleResults.filter((r) => {
    if (filter === "correct") return r.isCorrect;
    if (filter === "incorrect") return !r.isCorrect;
    return true;
  });

  const getGrade = () => {
    if (percentage >= 90) return { label: "Excellent!", color: "text-green-400", bg: "bg-green-500/20" };
    if (percentage >= 70) return { label: "Good!", color: "text-cyan-400", bg: "bg-cyan-500/20" };
    if (percentage >= 50) return { label: "Fair", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { label: "Needs Work", color: "text-red-400", bg: "bg-red-500/20" };
  };

  const grade = getGrade();

  return (
    <div className="ui-shell ui-page space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${grade.bg} mb-4`}>
          <Trophy className={`w-5 h-5 ${grade.color}`} />
          <span className={`font-medium ${grade.color}`}>{grade.label}</span>
        </div>
        <h1 className="text-3xl font-bold text-[#E8E0D5] mb-2">Quiz Complete!</h1>
        <p className="text-[#A0B0BC]">Portal Hypertension & Complications</p>
      </div>

      {/* Score Card */}
      <Card className="bg-gradient-to-br from-[#364A5E]/95 to-[#2D3E50]/95 border-[#5BB3B3]/30 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 4.4} 440`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5BB3B3" />
                  <stop offset="100%" stopColor="#5BB3B3" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-[#E8E0D5]">{correctCount}</span>
              <span className="text-[#A0B0BC]">/ {totalCount}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-[#2D3E50] rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-[#5BB3B3] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#E8E0D5]">{percentage}%</p>
              <p className="text-sm text-[#A0B0BC]">Accuracy</p>
            </div>
            <div className="bg-[#2D3E50] rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#E8E0D5]">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, "0")}</p>
              <p className="text-sm text-[#A0B0BC]">Total Time</p>
            </div>
            <div className="bg-[#2D3E50] rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#E8E0D5]">{avgTime}s</p>
              <p className="text-sm text-[#A0B0BC]">Avg per Q</p>
            </div>
            <div className="bg-[#2D3E50] rounded-xl p-4 text-center">
              <Brain className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#E8E0D5]">{totalCount - correctCount}</p>
              <p className="text-sm text-[#A0B0BC]">To Review</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Topic Breakdown */}
      <Card className="bg-[#364A5E]/85 border-[rgba(232,224,213,0.1)] p-6">
        <h3 className="text-lg font-semibold text-[#E8E0D5] mb-4">Topic Performance</h3>
        <div className="space-y-4">
          {Object.entries(topicStats).map(([topic, stats]) => {
            const topicPercent = Math.round((stats.correct / stats.total) * 100);
            return (
              <div key={topic} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#C8D2DA]">{topic}</span>
                  <span className={topicPercent >= 70 ? "text-green-400" : "text-yellow-400"}>
                    {stats.correct}/{stats.total} ({topicPercent}%)
                  </span>
                </div>
                <Progress
                  value={topicPercent}
                  className="h-2 bg-gray-700"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          className="border-[rgba(232,224,213,0.2)] text-[#C8D2DA]"
          onClick={() => setShowReview(!showReview)}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {showReview ? "Hide Review" : "Review Answers"}
        </Button>
        <Button variant="outline" className="border-[rgba(232,224,213,0.2)] text-[#C8D2DA]">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
        <Link href="/mcqs">
          <Button className="bg-[#5BB3B3] hover:bg-[#4A9E9E]">
            <Sparkles className="w-4 h-4 mr-2" />
            New Quiz
          </Button>
        </Link>
      </div>

      {/* Review Section */}
      {showReview && (
        <Card className="bg-[#364A5E]/85 border-[rgba(232,224,213,0.1)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#E8E0D5]">Answer Review</h3>
            <div className="flex gap-2">
              {(["all", "correct", "incorrect"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={filter === f ? "bg-[#5BB3B3]" : "border-[rgba(232,224,213,0.2)] text-[#C8D2DA]"}
                >
                  {f === "all" ? "All" : f === "correct" ? "Correct" : "Incorrect"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${
                  result.isCorrect
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-[#6B7A88]">Q{index + 1}</span>
                      <Badge variant="outline" className="border-[rgba(232,224,213,0.2)] text-[#A0B0BC]">
                        {result.topic}
                      </Badge>
                    </div>
                    <p className="text-[#E8E0D5] mb-3">{result.question}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className={result.isCorrect ? "text-green-400" : "text-red-400"}>
                        Your answer: {result.selectedAnswer}
                      </span>
                      {!result.isCorrect && (
                        <span className="text-green-400">
                          Correct: {result.correctAnswer}
                        </span>
                      )}
                      <span className="text-[#6B7A88]">
                        Time: {result.timeSpent}s
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6B7A88]" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="bg-[#364A5E]/85 border-[rgba(232,224,213,0.1)] p-6">
        <h3 className="text-lg font-semibold text-[#E8E0D5] mb-4">Recommended Next Steps</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <button className="p-4 rounded-lg border border-[rgba(232,224,213,0.1)] hover:border-[#5BB3B3]/40 transition-colors text-left group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Brain className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="font-medium text-[#E8E0D5]">Review Weak Topics</span>
            </div>
            <p className="text-sm text-[#A0B0BC]">
              Focus on HRS and SBP - you missed questions here
            </p>
          </button>
          <button className="p-4 rounded-lg border border-[rgba(232,224,213,0.1)] hover:border-[#5BB3B3]/40 transition-colors text-left group">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-medium text-[#E8E0D5]">Read Source Material</span>
            </div>
            <p className="text-sm text-[#A0B0BC]">
              Sleisenger Ch.74: Portal Hypertension
            </p>
          </button>
        </div>
      </Card>
    </div>
  );
}
