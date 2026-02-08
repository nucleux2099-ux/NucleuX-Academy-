"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Target, 
  Brain, 
  BookOpen, 
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  FileText,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode, LibraryTopic, RetrievalCard as RetrievalCardType } from "@/lib/types/library";
import { MedicalMarkdown } from "@/components/MedicalMarkdown";

// =============================================================================
// QUIZ CARD COMPONENT
// =============================================================================

interface QuizCardProps {
  card: RetrievalCardType;
  index: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function QuizCard({ card, index, total, onNext, onPrevious }: QuizCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState<'correct' | 'incorrect' | null>(null);

  const handleReveal = () => setShowAnswer(true);
  
  const handleAnswer = (correct: boolean) => {
    setAnswered(correct ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setShowAnswer(false);
    setAnswered(null);
    onNext();
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setAnswered(null);
    onPrevious();
  };

  // Difficulty indicator
  const difficultyStars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={i < card.difficulty ? "text-[#F59E0B]" : "text-[#374151]"}>★</span>
  ));

  return (
    <Card className="bg-gradient-to-br from-[#142538] to-[#0D1B2A] border-[rgba(6,182,212,0.2)] shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className="bg-[rgba(236,72,153,0.15)] text-[#EC4899] border-[rgba(236,72,153,0.3)]">
            <Brain className="w-3 h-3 mr-1" />
            Retrieval Practice
          </Badge>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B7280]">{difficultyStars}</span>
            <Badge variant="outline" className="text-[#9CA3AF] border-[#374151]">
              {index + 1} / {total}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question */}
        <div className="p-4 bg-[#0D1B2A] rounded-xl border border-[rgba(6,182,212,0.1)]">
          <h3 className="text-sm font-medium text-[#06B6D4] mb-2">Question</h3>
          <p className="text-[#E5E7EB] text-lg">{card.question}</p>
        </div>

        {/* Answer Area */}
        {!showAnswer ? (
          <Button
            onClick={handleReveal}
            className="w-full h-14 bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] hover:from-[#0891B2] hover:to-[#7C3AED] text-white font-semibold text-lg shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Reveal Answer
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Answer */}
            <div className="p-4 bg-gradient-to-br from-[rgba(6,182,212,0.1)] to-[rgba(139,92,246,0.05)] rounded-xl border border-[rgba(6,182,212,0.2)]">
              <h4 className="text-sm font-medium text-[#10B981] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Answer
              </h4>
              <p className="text-[#E5E7EB]">{card.answer}</p>
            </div>

            {/* Self-assessment buttons */}
            {answered === null ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 font-medium"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Needs Review
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 h-12 bg-[#10B981] hover:bg-[#059669] text-white font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Got It!
                </Button>
              </div>
            ) : (
              <div className={cn(
                "p-3 rounded-xl text-center font-medium",
                answered === 'correct' 
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30" 
                  : "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30"
              )}>
                {answered === 'correct' ? '✓ Great job! Keep going!' : '✗ No worries, you\'ll get it next time!'}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(6,182,212,0.1)]">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={index === 0}
            className="text-[#9CA3AF] hover:text-[#E5E7EB]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
          >
            {index === total - 1 ? 'Restart' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// CASE SCENARIO COMPONENT
// =============================================================================

interface CaseCardProps {
  caseItem: LibraryTopic['content']['cases'][0];
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(139,92,246,0.1)] p-4 border-b border-[rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#06B6D4]/20 rounded-lg">
            <Stethoscope className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#E5E7EB]">{caseItem.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs text-[#6B7280] border-[#374151]">
                Difficulty {caseItem.difficulty}/5
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Presentation */}
        <div className="p-4 bg-[#0D1B2A] rounded-xl border border-[rgba(6,182,212,0.1)]">
          <h4 className="text-sm font-medium text-[#F59E0B] mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Clinical Presentation
          </h4>
          <p className="text-[#9CA3AF] leading-relaxed">{caseItem.presentation}</p>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#E5E7EB]">Clinical Questions</h4>
          {caseItem.questions.map((q, qi) => (
            <div 
              key={qi} 
              className="rounded-lg border border-[rgba(6,182,212,0.1)] overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(qi)}
                className="w-full p-3 flex items-center justify-between bg-[#0D1B2A] hover:bg-[rgba(6,182,212,0.05)] transition-colors text-left"
              >
                <span className="text-[#06B6D4] font-medium flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-xs">
                    {qi + 1}
                  </span>
                  {q.question}
                </span>
                <ChevronRight className={cn(
                  "w-5 h-5 text-[#6B7280] transition-transform duration-200",
                  expandedQuestions.has(qi) && "rotate-90"
                )} />
              </button>
              {expandedQuestions.has(qi) && (
                <div className="p-3 bg-[#142538] border-t border-[rgba(6,182,212,0.1)] animate-in slide-in-from-top-1 duration-200">
                  <p className="text-[#E5E7EB] pl-8">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Learning Points */}
        {caseItem.keyLearning.length > 0 && (
          <div className="p-4 bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-transparent rounded-xl border border-[rgba(245,158,11,0.2)]">
            <h4 className="text-sm font-medium text-[#F59E0B] mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Key Learning Points
            </h4>
            <ul className="space-y-2">
              {caseItem.keyLearning.map((point, pi) => (
                <li key={pi} className="text-sm text-[#E5E7EB] flex items-start gap-2">
                  <span className="text-[#F59E0B] mt-0.5">→</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// EXAM PREP SECTION COMPONENT
// =============================================================================

interface ExamPrepSectionProps {
  examPrep: NonNullable<LibraryTopic['content']['examPrep']>;
}

export function ExamPrepSection({ examPrep }: ExamPrepSectionProps) {
  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      <Card className="bg-gradient-to-br from-[#142538] to-[#0D1B2A] border-[rgba(6,182,212,0.2)] shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
            <Target className="w-5 h-5 text-[#F59E0B]" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MedicalMarkdown content={examPrep.summary} />
        </CardContent>
      </Card>

      {/* Mnemonics */}
      {examPrep.mnemonics.length > 0 && (
        <Card className="bg-[#142538] border-[rgba(236,72,153,0.2)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
              <Brain className="w-5 h-5 text-[#EC4899]" />
              Memory Tricks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examPrep.mnemonics.map((m, i) => (
                <div 
                  key={i} 
                  className="p-4 bg-gradient-to-r from-[rgba(236,72,153,0.1)] to-transparent rounded-xl border border-[rgba(236,72,153,0.2)]"
                >
                  <p className="text-[#E5E7EB] font-medium">{m}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Yield Points */}
      {examPrep.highYield.length > 0 && (
        <Card className="bg-gradient-to-br from-[rgba(245,158,11,0.15)] to-[#142538] border-[rgba(245,158,11,0.3)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[#F59E0B]">
              <Sparkles className="w-5 h-5" />
              High Yield for Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {examPrep.highYield.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[#E5E7EB]">
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Common MCQ Topics */}
      {examPrep.commonMCQs.length > 0 && (
        <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
              <FileText className="w-5 h-5 text-[#06B6D4]" />
              Frequently Tested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {examPrep.commonMCQs.map((mcq, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-[#0D1B2A] rounded-lg border border-[rgba(6,182,212,0.1)] flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4] font-bold text-sm">
                    Q{i + 1}
                  </div>
                  <span className="text-[#9CA3AF]">{mcq}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#142538] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#E5E7EB] mb-2">{title}</h3>
      <p className="text-[#9CA3AF] max-w-md mx-auto">{description}</p>
    </div>
  );
}
