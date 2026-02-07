"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SkeletonQuestion } from "@/components/Skeleton";
import { EmptyMCQs } from "@/components/EmptyState";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  RotateCcw,
  Lightbulb,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  Eye,
} from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    question: "A 45-year-old male presents with progressive dysphagia to solids for 6 months. Endoscopy shows a stricture at 30cm from incisors. Which is the most likely diagnosis?",
    options: [
      "Esophageal carcinoma",
      "Achalasia cardia",
      "Peptic stricture",
      "Corrosive stricture",
    ],
    correctAnswer: 0,
    explanation: "Progressive dysphagia to solids in a middle-aged male, with a stricture at 30cm (lower 1/3rd of esophagus), is highly suggestive of esophageal carcinoma. Achalasia typically presents with dysphagia to both solids and liquids from the onset.",
    topic: "Esophageal Disorders",
    difficulty: "Medium",
  },
  {
    id: 2,
    question: "The Triad of Charcot includes all EXCEPT:",
    options: [
      "Fever with rigors",
      "Jaundice",
      "Right upper quadrant pain",
      "Hypotension",
    ],
    correctAnswer: 3,
    explanation: "Charcot's triad consists of fever with rigors, jaundice, and right upper quadrant pain - indicative of acute cholangitis. Hypotension along with mental confusion are added in Reynold's pentad, which indicates severe acute cholangitis.",
    topic: "Hepatobiliary",
    difficulty: "Easy",
  },
  {
    id: 3,
    question: "Sister Mary Joseph nodule is associated with metastasis from which of the following malignancies?",
    options: [
      "Gastric carcinoma",
      "Hepatocellular carcinoma",
      "Rectal carcinoma",
      "Esophageal carcinoma",
    ],
    correctAnswer: 0,
    explanation: "Sister Mary Joseph nodule is an umbilical metastatic nodule, most commonly seen with gastric carcinoma. It represents advanced disease with peritoneal dissemination.",
    topic: "Gastric Cancer",
    difficulty: "Medium",
  },
  {
    id: 4,
    question: "Which of the following is the most common cause of acute pancreatitis?",
    options: [
      "Alcohol",
      "Gallstones",
      "Trauma",
      "Hyperlipidemia",
    ],
    correctAnswer: 1,
    explanation: "Gallstones are the most common cause of acute pancreatitis (40%), followed by alcohol (30%). The mechanism involves gallstone migration and transient obstruction of the pancreatic duct.",
    topic: "Pancreatic Disorders",
    difficulty: "Easy",
  },
  {
    id: 5,
    question: "A 60-year-old patient with cirrhosis presents with massive hematemesis. What is the most likely source of bleeding?",
    options: [
      "Gastric ulcer",
      "Esophageal varices",
      "Mallory-Weiss tear",
      "Duodenal ulcer",
    ],
    correctAnswer: 1,
    explanation: "In patients with cirrhosis and portal hypertension, esophageal varices are the most common cause of massive upper GI bleeding. Variceal bleeding accounts for up to 70% of upper GI bleeds in cirrhotics.",
    topic: "Portal Hypertension",
    difficulty: "Medium",
  },
];

type QuizMode = "quiz" | "results" | "review";

export default function MCQsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(sampleQuestions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [mode, setMode] = useState<QuizMode>("quiz");
  const [isLoading, setIsLoading] = useState(true);

  const question = sampleQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mode === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (index: number) => {
    if (showResult && mode === "quiz") return;
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowResult(mode === "review" || answers[currentQuestion + 1] !== null);
    } else if (mode === "quiz") {
      setMode("results");
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowResult(mode === "review" || answers[currentQuestion - 1] !== null);
    }
  };

  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestion] = !newFlagged[currentQuestion];
    setFlagged(newFlagged);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(sampleQuestions.length).fill(null));
    setFlagged(new Array(sampleQuestions.length).fill(false));
    setTimeLeft(600);
    setMode("quiz");
  };

  const handleReviewMistakes = () => {
    const firstWrongIndex = answers.findIndex((a, i) => a !== null && a !== sampleQuestions[i].correctAnswer);
    if (firstWrongIndex !== -1) {
      setCurrentQuestion(firstWrongIndex);
      setSelectedAnswer(answers[firstWrongIndex]);
      setShowResult(true);
      setMode("review");
    }
  };

  const score = answers.filter((a, i) => a === sampleQuestions[i].correctAnswer).length;
  const attempted = answers.filter(a => a !== null).length;
  const incorrect = answers.filter((a, i) => a !== null && a !== sampleQuestions[i].correctAnswer).length;
  const percentage = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

  // Get wrong questions for review
  const wrongQuestions = sampleQuestions.filter((q, i) => answers[i] !== null && answers[i] !== q.correctAnswer);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="skeleton h-10 w-24 rounded-lg" />
        </div>
        <SkeletonQuestion />
      </div>
    );
  }

  // Results Screen
  if (mode === "results") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
        <Card className="bg-[#1E293B] border-[#334155] overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6 border-4 border-[#10B981]/30">
              <Trophy className="w-12 h-12 text-[#10B981]" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-[#94A3B8]">Here's your performance summary</p>
          </div>

          <CardContent className="p-8">
            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#334155"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={percentage >= 70 ? "#10B981" : percentage >= 50 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 440} 440`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{percentage}%</span>
                  <span className="text-sm text-[#94A3B8]">Accuracy</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <p className="text-2xl font-bold">{score}/{sampleQuestions.length}</p>
                <p className="text-xs text-[#94A3B8]">Score</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <p className="text-2xl font-bold text-[#10B981]">{score}</p>
                <p className="text-xs text-[#94A3B8]">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-400">{incorrect}</p>
                <p className="text-xs text-[#94A3B8]">Incorrect</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/20 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <p className="text-2xl font-bold text-[#06B6D4]">{formatTime(600 - timeLeft)}</p>
                <p className="text-xs text-[#94A3B8]">Time Taken</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-4 rounded-xl mb-8 ${
              percentage >= 70 ? "bg-[#10B981]/10 border border-[#10B981]/30" :
              percentage >= 50 ? "bg-[#F59E0B]/10 border border-[#F59E0B]/30" :
              "bg-red-500/10 border border-red-500/30"
            }`}>
              <div className="flex items-start gap-3">
                {percentage >= 70 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-[#10B981] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#10B981]">Excellent Performance! 🎉</p>
                      <p className="text-sm text-[#94A3B8] mt-1">
                        You've mastered these concepts. Keep up the great work!
                      </p>
                    </div>
                  </>
                ) : percentage >= 50 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#F59E0B]">Good Effort! 💪</p>
                      <p className="text-sm text-[#94A3B8] mt-1">
                        Review the explanations for incorrect answers to improve.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-400">Needs Improvement</p>
                      <p className="text-sm text-[#94A3B8] mt-1">
                        Don't worry! Review the material and try again.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Question Breakdown */}
            {wrongQuestions.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Questions to Review ({wrongQuestions.length})
                </h3>
                <div className="space-y-3">
                  {wrongQuestions.map((q, i) => (
                    <div key={q.id} className="p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-2">
                            Q{sampleQuestions.findIndex(sq => sq.id === q.id) + 1}
                          </Badge>
                          <p className="text-sm line-clamp-2">{q.question}</p>
                        </div>
                        <Badge className="bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/30 shrink-0">
                          {q.topic}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleReset} className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              {wrongQuestions.length > 0 && (
                <Button 
                  onClick={handleReviewMistakes} 
                  variant="outline" 
                  className="flex-1 border-[#334155] hover:border-[#7C3AED]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Mistakes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz / Review Mode
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">MCQ Practice</h1>
            {mode === "review" && (
              <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30">
                Review Mode
              </Badge>
            )}
          </div>
          <p className="text-[#94A3B8]">Surgical GI - Mixed Topics</p>
        </div>
        <div className="flex items-center gap-4">
          {mode === "quiz" && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              timeLeft < 60 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-[#1E293B]"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
          {mode === "review" && (
            <Button onClick={handleReset} variant="outline" className="border-[#334155]">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#94A3B8]">
            {mode === "review" ? "Reviewing" : "Question"} {currentQuestion + 1} of {sampleQuestions.length}
          </span>
          <span className="text-[#94A3B8]">{Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%</span>
        </div>
        <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} className="h-2" />
      </div>

      {/* Question Navigator */}
      <div className="flex gap-2 flex-wrap">
        {sampleQuestions.map((q, i) => {
          const isWrong = answers[i] !== null && answers[i] !== q.correctAnswer;
          const isRight = answers[i] !== null && answers[i] === q.correctAnswer;
          
          return (
            <button
              key={i}
              onClick={() => {
                setCurrentQuestion(i);
                setSelectedAnswer(answers[i]);
                setShowResult(mode === "review" || answers[i] !== null);
              }}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                i === currentQuestion
                  ? "bg-[#7C3AED] text-white ring-2 ring-[#7C3AED]/50"
                  : isRight
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                  : isWrong
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#7C3AED]/50"
              } ${flagged[i] ? "ring-2 ring-[#F59E0B]" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/30">
                {question.topic}
              </Badge>
              <Badge
                className={
                  question.difficulty === "Easy"
                    ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
                    : question.difficulty === "Medium"
                    ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {question.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg font-medium leading-relaxed">
              {question.question}
            </CardTitle>
          </div>
          {mode === "quiz" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFlag}
              className={flagged[currentQuestion] ? "text-[#F59E0B]" : "text-[#94A3B8]"}
            >
              <Flag className="w-5 h-5" fill={flagged[currentQuestion] ? "#F59E0B" : "none"} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              let optionStyle = "bg-[#0F172A] border-[#334155]";
              let canHover = !showResult && mode === "quiz";

              if (showResult || mode === "review") {
                if (isCorrectOption) {
                  optionStyle = "bg-[#10B981]/10 border-[#10B981] ring-2 ring-[#10B981]/30";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = "bg-red-500/10 border-red-500 ring-2 ring-red-500/30";
                }
              } else if (isSelected) {
                optionStyle = "bg-[#7C3AED]/10 border-[#7C3AED]";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult || mode === "review"}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle} ${
                    canHover ? "hover:border-[#7C3AED] hover:bg-[#7C3AED]/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        (showResult || mode === "review") && isCorrectOption
                          ? "bg-[#10B981] text-white"
                          : (showResult || mode === "review") && isSelected && !isCorrectOption
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-[#7C3AED] text-white"
                          : "bg-[#334155] text-[#94A3B8]"
                      }`}
                    >
                      {(showResult || mode === "review") && isCorrectOption ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (showResult || mode === "review") && isSelected && !isCorrectOption ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className={
                      (showResult || mode === "review") && isCorrectOption ? "text-[#10B981] font-medium" : ""
                    }>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {(showResult || mode === "review") && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5 border border-[#F59E0B]/20 mt-6 animate-slide-in-up">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#F59E0B]/20 shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="font-semibold text-[#F59E0B] mb-2">Explanation</p>
                  <p className="text-[#94A3B8] leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="border-[#334155] hover:border-[#7C3AED]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {mode === "quiz" && !showResult && selectedAnswer !== null && (
                <Button onClick={handleSubmit} className="bg-[#10B981] hover:bg-[#059669]">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
              )}
              <Button onClick={handleNext} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                {currentQuestion === sampleQuestions.length - 1 
                  ? (mode === "review" ? "Back to Results" : "Finish Quiz")
                  : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
