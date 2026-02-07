"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  XCircle,
  RotateCcw,
  Lightbulb,
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
];

export default function MCQsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(sampleQuestions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isComplete, setIsComplete] = useState(false);

  const question = sampleQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  useEffect(() => {
    if (!isComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
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
      setShowResult(answers[currentQuestion + 1] !== null);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowResult(answers[currentQuestion - 1] !== null);
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
    setIsComplete(false);
  };

  const score = answers.filter((a, i) => a === sampleQuestions[i].correctAnswer).length;

  if (isComplete) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#10B981]" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
            <p className="text-[#94A3B8] mb-8">Here's how you performed</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-[#0F172A]">
                <p className="text-3xl font-bold text-[#7C3AED]">{score}/{sampleQuestions.length}</p>
                <p className="text-sm text-[#94A3B8]">Score</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0F172A]">
                <p className="text-3xl font-bold text-[#06B6D4]">{Math.round((score / sampleQuestions.length) * 100)}%</p>
                <p className="text-sm text-[#94A3B8]">Accuracy</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0F172A]">
                <p className="text-3xl font-bold text-[#F59E0B]">{formatTime(600 - timeLeft)}</p>
                <p className="text-sm text-[#94A3B8]">Time Taken</p>
              </div>
            </div>

            <Button onClick={handleReset} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">MCQ Practice</h1>
          <p className="text-[#94A3B8] mt-1">Surgical GI - Mixed Topics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeLeft < 60 ? "bg-red-500/20 text-red-400" : "bg-[#1E293B]"
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#94A3B8]">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
          <span className="text-[#94A3B8]">{Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%</span>
        </div>
        <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} className="h-2" />
      </div>

      {/* Question Navigator */}
      <div className="flex gap-2 flex-wrap">
        {sampleQuestions.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentQuestion(i);
              setSelectedAnswer(answers[i]);
              setShowResult(answers[i] !== null);
            }}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              i === currentQuestion
                ? "bg-[#7C3AED] text-white"
                : answers[i] !== null
                ? answers[i] === sampleQuestions[i].correctAnswer
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
            } ${flagged[i] ? "ring-2 ring-[#F59E0B]" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFlag}
            className={flagged[currentQuestion] ? "text-[#F59E0B]" : "text-[#94A3B8]"}
          >
            <Flag className="w-5 h-5" fill={flagged[currentQuestion] ? "#F59E0B" : "none"} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              let optionStyle = "bg-[#0F172A] border-[#334155] hover:border-[#7C3AED]";

              if (showResult) {
                if (isCorrectOption) {
                  optionStyle = "bg-[#10B981]/10 border-[#10B981]";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = "bg-red-500/10 border-red-500";
                }
              } else if (isSelected) {
                optionStyle = "bg-[#7C3AED]/10 border-[#7C3AED]";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        showResult && isCorrectOption
                          ? "bg-[#10B981] text-white"
                          : showResult && isSelected && !isCorrectOption
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-[#7C3AED] text-white"
                          : "bg-[#334155] text-[#94A3B8]"
                      }`}
                    >
                      {showResult && isCorrectOption ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showResult && isSelected && !isCorrectOption ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] mt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#F59E0B] mb-2">Explanation</p>
                  <p className="text-[#94A3B8]">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="border-[#334155]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {!showResult && selectedAnswer !== null && (
                <Button onClick={handleSubmit} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Submit Answer
                </Button>
              )}
              {(showResult || currentQuestion < sampleQuestions.length - 1) && (
                <Button onClick={handleNext} className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                  {currentQuestion === sampleQuestions.length - 1 ? "Finish" : "Next"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
