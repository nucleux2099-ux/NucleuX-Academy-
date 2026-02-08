"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, RotateCcw, Lightbulb, Trophy, Target, TrendingUp, AlertCircle, Eye } from "lucide-react";

// MCQs room color - Sky Blue
const roomColor = '#6BA8C9';

const sampleQuestions = [
  { id: 1, question: "A 45-year-old male presents with progressive dysphagia to solids for 6 months. Endoscopy shows a stricture at 30cm from incisors. Which is the most likely diagnosis?", options: ["Esophageal carcinoma", "Achalasia cardia", "Peptic stricture", "Corrosive stricture"], correctAnswer: 0, explanation: "Progressive dysphagia to solids in a middle-aged male, with a stricture at 30cm (lower 1/3rd), is highly suggestive of esophageal carcinoma.", topic: "Esophageal Disorders", difficulty: "Medium" },
  { id: 2, question: "The Triad of Charcot includes all EXCEPT:", options: ["Fever with rigors", "Jaundice", "Right upper quadrant pain", "Hypotension"], correctAnswer: 3, explanation: "Charcot's triad: fever, jaundice, RUQ pain. Hypotension + confusion = Reynold's pentad.", topic: "Hepatobiliary", difficulty: "Easy" },
  { id: 3, question: "Sister Mary Joseph nodule is associated with metastasis from which malignancy?", options: ["Gastric carcinoma", "Hepatocellular carcinoma", "Rectal carcinoma", "Esophageal carcinoma"], correctAnswer: 0, explanation: "Sister Mary Joseph nodule is umbilical metastasis, most common with gastric carcinoma.", topic: "Gastric Cancer", difficulty: "Medium" },
  { id: 4, question: "Which is the most common cause of acute pancreatitis?", options: ["Alcohol", "Gallstones", "Trauma", "Hyperlipidemia"], correctAnswer: 1, explanation: "Gallstones (40%) > Alcohol (30%). Gallstone migration obstructs pancreatic duct.", topic: "Pancreatic Disorders", difficulty: "Easy" },
  { id: 5, question: "A 60-year-old cirrhotic presents with massive hematemesis. Most likely source?", options: ["Gastric ulcer", "Esophageal varices", "Mallory-Weiss tear", "Duodenal ulcer"], correctAnswer: 1, explanation: "In cirrhosis, esophageal varices cause ~70% of upper GI bleeds.", topic: "Portal Hypertension", difficulty: "Medium" },
];

type QuizMode = "quiz" | "results" | "review";

export default function MCQsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(sampleQuestions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(600);
  const [mode, setMode] = useState<QuizMode>("quiz");
  const [isLoading, setIsLoading] = useState(true);

  const question = sampleQuestions[currentQuestion];

  useEffect(() => { setTimeout(() => setIsLoading(false), 600); }, []);
  useEffect(() => { if (mode === "quiz" && timeLeft > 0) { const t = setInterval(() => setTimeLeft(p => p - 1), 1000); return () => clearInterval(t); } }, [timeLeft, mode]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleAnswer = (i: number) => { if (showResult && mode === "quiz") return; setSelectedAnswer(i); const na = [...answers]; na[currentQuestion] = i; setAnswers(na); };
  const handleSubmit = () => setShowResult(true);
  const handleNext = () => { if (currentQuestion < sampleQuestions.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(answers[currentQuestion + 1]); setShowResult(mode === "review" || answers[currentQuestion + 1] !== null); } else if (mode === "quiz") setMode("results"); };
  const handlePrev = () => { if (currentQuestion > 0) { setCurrentQuestion(currentQuestion - 1); setSelectedAnswer(answers[currentQuestion - 1]); setShowResult(mode === "review" || answers[currentQuestion - 1] !== null); } };
  const toggleFlag = () => { const nf = [...flagged]; nf[currentQuestion] = !nf[currentQuestion]; setFlagged(nf); };
  const handleReset = () => { setCurrentQuestion(0); setSelectedAnswer(null); setShowResult(false); setAnswers(new Array(sampleQuestions.length).fill(null)); setFlagged(new Array(sampleQuestions.length).fill(false)); setTimeLeft(600); setMode("quiz"); };
  const handleReviewMistakes = () => { const fi = answers.findIndex((a, i) => a !== null && a !== sampleQuestions[i].correctAnswer); if (fi !== -1) { setCurrentQuestion(fi); setSelectedAnswer(answers[fi]); setShowResult(true); setMode("review"); } };

  const score = answers.filter((a, i) => a === sampleQuestions[i].correctAnswer).length;
  const attempted = answers.filter(a => a !== null).length;
  const incorrect = answers.filter((a, i) => a !== null && a !== sampleQuestions[i].correctAnswer).length;
  const percentage = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
  const wrongQuestions = sampleQuestions.filter((q, i) => answers[i] !== null && answers[i] !== q.correctAnswer);

  if (isLoading) return <div className="max-w-4xl mx-auto space-y-6"><div className="skeleton h-8 w-48" /><div className="skeleton h-64 w-full rounded-xl" /></div>;

  // Results Screen
  if (mode === "results") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] overflow-hidden">
          <div className="bg-gradient-to-r from-[rgba(14,165,233,0.15)] to-[rgba(91,179,179,0.1)] p-8 text-center border-b border-[rgba(91,179,179,0.1)]">
            <div className="w-24 h-24 rounded-full bg-[rgba(5,150,105,0.2)] flex items-center justify-center mx-auto mb-6 border-4 border-[#7BA69E]/30">
              <Trophy className="w-12 h-12 text-[#7BA69E]" />
            </div>
            <h2 className="text-3xl font-bold text-[#E8E0D5] mb-2">Quiz Complete!</h2>
            <p className="text-[#A0B0BC]">Here&apos;s your performance summary</p>
          </div>
          <CardContent className="p-8">
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="rgba(91,179,179,0.1)" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke={percentage >= 70 ? "#7BA69E" : percentage >= 50 ? "#C9A86C" : "#E57373"} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${(percentage / 100) * 440} 440`} className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#E8E0D5]">{percentage}%</span>
                  <span className="text-sm text-[#A0B0BC]">Accuracy</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] text-center">
                <div className="w-10 h-10 rounded-lg bg-[rgba(14,165,233,0.15)] flex items-center justify-center mx-auto mb-2"><Target className="w-5 h-5 text-[#6BA8C9]" /></div>
                <p className="text-2xl font-bold text-[#E8E0D5]">{score}/{sampleQuestions.length}</p>
                <p className="text-xs text-[#6B7280]">Score</p>
              </div>
              <div className="p-4 rounded-xl bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] text-center">
                <div className="w-10 h-10 rounded-lg bg-[rgba(5,150,105,0.15)] flex items-center justify-center mx-auto mb-2"><CheckCircle className="w-5 h-5 text-[#7BA69E]" /></div>
                <p className="text-2xl font-bold text-[#7BA69E]">{score}</p>
                <p className="text-xs text-[#6B7280]">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] text-center">
                <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center mx-auto mb-2"><XCircle className="w-5 h-5 text-[#E57373]" /></div>
                <p className="text-2xl font-bold text-[#E57373]">{incorrect}</p>
                <p className="text-xs text-[#6B7280]">Incorrect</p>
              </div>
              <div className="p-4 rounded-xl bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] text-center">
                <div className="w-10 h-10 rounded-lg bg-[rgba(91,179,179,0.15)] flex items-center justify-center mx-auto mb-2"><Clock className="w-5 h-5 text-[#5BB3B3]" /></div>
                <p className="text-2xl font-bold text-[#5BB3B3]">{formatTime(600 - timeLeft)}</p>
                <p className="text-xs text-[#6B7280]">Time</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl mb-8 ${percentage >= 70 ? "bg-[rgba(5,150,105,0.15)] border border-[rgba(5,150,105,0.3)]" : percentage >= 50 ? "bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)]" : "bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)]"}`}>
              <div className="flex items-start gap-3">
                {percentage >= 70 ? <TrendingUp className="w-5 h-5 text-[#7BA69E]" /> : <AlertCircle className="w-5 h-5 text-[#C9A86C]" />}
                <div>
                  <p className={`font-medium ${percentage >= 70 ? "text-[#7BA69E]" : percentage >= 50 ? "text-[#C9A86C]" : "text-[#E57373]"}`}>
                    {percentage >= 70 ? "Excellent Performance! 🎉" : percentage >= 50 ? "Good Effort! 💪" : "Needs Improvement"}
                  </p>
                  <p className="text-sm text-[#A0B0BC] mt-1">{percentage >= 70 ? "You've mastered these concepts!" : "Review the explanations to improve."}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleReset} className="flex-1 bg-[#6BA8C9] hover:bg-[#0284C7] text-[#2D3E50]"><RotateCcw className="w-4 h-4 mr-2" />Try Again</Button>
              {wrongQuestions.length > 0 && <Button onClick={handleReviewMistakes} variant="outline" className="flex-1 border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:bg-[#3A4D5F]"><Eye className="w-4 h-4 mr-2" />Review Mistakes</Button>}
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
            <h1 className="text-3xl font-bold text-[#E8E0D5]">📝 MCQ Practice</h1>
            {mode === "review" && <Badge className="bg-[rgba(245,158,11,0.2)] text-[#C9A86C] border-none">Review Mode</Badge>}
          </div>
          <p className="text-[#A0B0BC]">Surgical GI - Mixed Topics</p>
        </div>
        <div className="flex items-center gap-4">
          {mode === "quiz" && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? "bg-[rgba(239,68,68,0.2)] text-[#E57373] animate-pulse" : "bg-[#364A5E] border border-[rgba(91,179,179,0.15)] text-[#E8E0D5]"}`}>
              <Clock className="w-4 h-4" /><span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
          {mode === "review" && <Button onClick={handleReset} variant="outline" className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"><RotateCcw className="w-4 h-4 mr-2" />New Quiz</Button>}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#A0B0BC]">{mode === "review" ? "Reviewing" : "Question"} {currentQuestion + 1} of {sampleQuestions.length}</span>
          <span className="text-[#A0B0BC]">{Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%</span>
        </div>
        <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} className="h-2" />
      </div>

      {/* Question Navigator */}
      <div className="flex gap-2 flex-wrap">
        {sampleQuestions.map((q, i) => {
          const isWrong = answers[i] !== null && answers[i] !== q.correctAnswer;
          const isRight = answers[i] !== null && answers[i] === q.correctAnswer;
          return (
            <button key={i} onClick={() => { setCurrentQuestion(i); setSelectedAnswer(answers[i]); setShowResult(mode === "review" || answers[i] !== null); }}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${i === currentQuestion ? "bg-[#6BA8C9] text-[#2D3E50] ring-2 ring-[#6BA8C9]/50" : isRight ? "bg-[rgba(5,150,105,0.2)] text-[#7BA69E] border border-[rgba(5,150,105,0.3)]" : isWrong ? "bg-[rgba(239,68,68,0.2)] text-[#E57373] border border-[rgba(239,68,68,0.3)]" : "bg-[#364A5E] text-[#A0B0BC] border border-[rgba(91,179,179,0.15)] hover:border-[#6BA8C9]"} ${flagged[i] ? "ring-2 ring-[#C9A86C]" : ""}`}
            >{i + 1}</button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] border-l-4" style={{ borderLeftColor: roomColor }}>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-[rgba(14,165,233,0.15)] text-[#6BA8C9] border-none">{question.topic}</Badge>
              <Badge className={question.difficulty === "Easy" ? "bg-[rgba(5,150,105,0.15)] text-[#7BA69E] border-none" : question.difficulty === "Medium" ? "bg-[rgba(245,158,11,0.15)] text-[#C9A86C] border-none" : "bg-[rgba(239,68,68,0.15)] text-[#E57373] border-none"}>{question.difficulty}</Badge>
            </div>
            <CardTitle className="text-lg font-medium leading-relaxed text-[#E8E0D5]">{question.question}</CardTitle>
          </div>
          {mode === "quiz" && <Button variant="ghost" size="icon" onClick={toggleFlag} className={flagged[currentQuestion] ? "text-[#C9A86C]" : "text-[#6B7280] hover:text-[#C9A86C]"}><Flag className="w-5 h-5" fill={flagged[currentQuestion] ? "#C9A86C" : "none"} /></Button>}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              let optionStyle = "bg-[#3A4D5F] border-[rgba(91,179,179,0.1)]";
              if (showResult || mode === "review") {
                if (isCorrectOption) optionStyle = "bg-[rgba(5,150,105,0.15)] border-[#7BA69E] ring-2 ring-[#7BA69E]/30";
                else if (isSelected && !isCorrectOption) optionStyle = "bg-[rgba(239,68,68,0.15)] border-[#E57373] ring-2 ring-[#E57373]/30";
              } else if (isSelected) optionStyle = "bg-[rgba(14,165,233,0.15)] border-[#6BA8C9]";

              return (
                <button key={index} onClick={() => handleAnswer(index)} disabled={showResult || mode === "review"}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle} ${!showResult && mode === "quiz" ? "hover:border-[#6BA8C9] hover:bg-[rgba(14,165,233,0.1)]" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${(showResult || mode === "review") && isCorrectOption ? "bg-[#7BA69E] text-white" : (showResult || mode === "review") && isSelected && !isCorrectOption ? "bg-[#E57373] text-white" : isSelected ? "bg-[#6BA8C9] text-[#2D3E50]" : "bg-[#364A5E] text-[#A0B0BC]"}`}>
                      {(showResult || mode === "review") && isCorrectOption ? <CheckCircle className="w-4 h-4" /> : (showResult || mode === "review") && isSelected && !isCorrectOption ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-[#E8E0D5] ${(showResult || mode === "review") && isCorrectOption ? "text-[#7BA69E] font-medium" : ""}`}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {(showResult || mode === "review") && (
            <div className="p-4 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] mt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#364A5E] shrink-0"><Lightbulb className="w-5 h-5 text-[#C9A86C]" /></div>
                <div>
                  <p className="font-semibold text-[#C9A86C] mb-2">Explanation</p>
                  <p className="text-[#A0B0BC] leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(91,179,179,0.1)]">
            <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0} className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:bg-[#3A4D5F]"><ChevronLeft className="w-4 h-4 mr-2" />Previous</Button>
            <div className="flex gap-2">
              {mode === "quiz" && !showResult && selectedAnswer !== null && <Button onClick={handleSubmit} className="bg-[#7BA69E] hover:bg-[#047857] text-white"><CheckCircle className="w-4 h-4 mr-2" />Submit</Button>}
              <Button onClick={handleNext} className="bg-[#6BA8C9] hover:bg-[#0284C7] text-[#2D3E50]">{currentQuestion === sampleQuestions.length - 1 ? (mode === "review" ? "Back to Results" : "Finish Quiz") : "Next"}<ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
