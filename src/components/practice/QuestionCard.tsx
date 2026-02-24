'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Flag, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Lightbulb, BookOpen, Brain, Zap, Volume2, Atom, MessageCircle,
} from 'lucide-react';
import { type Question, type ConfidenceLevel, confidenceConfig } from './data';

interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  flagged: boolean;
  confidenceLevel: ConfidenceLevel;
  showConfidenceSelector: boolean;
  onSelectAnswer: (index: number) => void;
  onSelectConfidence: (level: ConfidenceLevel) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onToggleFlag: () => void;
}

export function QuestionCard({
  question, currentQuestion, totalQuestions, selectedAnswer,
  showExplanation, flagged, confidenceLevel, showConfidenceSelector,
  onSelectAnswer, onSelectConfidence, onSubmitAnswer,
  onNextQuestion, onPrevQuestion, onToggleFlag,
}: QuestionCardProps) {
  return (
    <>
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] border-l-4 border-l-[#5BB3B3] mb-6">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-none">{question.topic}</Badge>
              <Badge className={
                question.difficulty === "Easy" ? "bg-[rgba(5,150,105,0.15)] text-[#7BA69E] border-none" :
                question.difficulty === "Medium" ? "bg-[rgba(245,158,11,0.15)] text-[#C9A86C] border-none" :
                "bg-[rgba(239,68,68,0.15)] text-[#E57373] border-none"
              }>{question.difficulty}</Badge>
              {question.highYield && (
                <Badge className="bg-[rgba(245,158,11,0.2)] text-[#C9A86C] border-none">
                  <Zap className="w-3 h-3 mr-1" />High Yield
                </Badge>
              )}
              {question.pyq && (
                <Badge className="bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] border-none">
                  📋 {question.pyq.exam} {question.pyq.year}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onToggleFlag}
              className={flagged ? "text-[#C9A86C]" : "text-[#6B7280] hover:text-[#C9A86C]"}>
              <Flag className="w-5 h-5" fill={flagged ? "#C9A86C" : "none"} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question Image */}
          {question.image && (
            <div className="rounded-lg overflow-hidden border border-[rgba(91,179,179,0.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={question.image} alt={question.imageCaption || "Clinical image"} className="w-full max-h-80 object-contain bg-[#2D3E50]" />
              {question.imageCaption && (
                <p className="text-xs text-[#6B7280] text-center py-2 bg-[#3A4D5F]">{question.imageCaption}</p>
              )}
            </div>
          )}
          
          <p className="text-lg text-[#E8E0D5] leading-relaxed">{question.question}</p>
          
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              
              let optionStyle = "bg-[#3A4D5F] border-[rgba(91,179,179,0.1)]";
              if (showExplanation) {
                if (isCorrectOption) optionStyle = "bg-[rgba(5,150,105,0.15)] border-[#7BA69E] ring-2 ring-[#7BA69E]/30";
                else if (isSelected && !isCorrectOption) optionStyle = "bg-[rgba(239,68,68,0.15)] border-[#E57373] ring-2 ring-[#E57373]/30";
              } else if (isSelected) {
                optionStyle = "bg-[rgba(91,179,179,0.15)] border-[#5BB3B3]";
              }
              
              return (
                <button key={index} onClick={() => onSelectAnswer(index)} disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle} ${
                    !showExplanation ? 'hover:border-[#5BB3B3] hover:bg-[rgba(91,179,179,0.1)]' : ''
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      showExplanation && isCorrectOption ? 'bg-[#7BA69E] text-white' :
                      showExplanation && isSelected && !isCorrectOption ? 'bg-[#E57373] text-white' :
                      isSelected ? 'bg-[#5BB3B3] text-[#2D3E50]' :
                      'bg-[#364A5E] text-[#A0B0BC]'
                    }`}>
                      {showExplanation && isCorrectOption ? <CheckCircle className="w-4 h-4" /> :
                       showExplanation && isSelected && !isCorrectOption ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-[#E8E0D5] ${showExplanation && isCorrectOption ? 'font-medium text-[#7BA69E]' : ''}`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Confidence Selector */}
          {showConfidenceSelector && !showExplanation && selectedAnswer !== null && (
            <div className="p-4 rounded-lg bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)]">
              <p className="text-sm text-[#A0B0BC] mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                How confident are you?
              </p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(confidenceConfig).map(([key, config]) => (
                  <Button key={key}
                    variant={confidenceLevel === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectConfidence(key as ConfidenceLevel)}
                    className={confidenceLevel === key ? `text-white` : `border-[rgba(91,179,179,0.15)] text-[#A0B0BC]`}
                    style={confidenceLevel === key ? { backgroundColor: config.color } : {}}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Explanation */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#364A5E] shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#C9A86C]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-[#C9A86C]">Explanation</p>
                    <Button variant="ghost" size="sm" className="text-[#8B5CF6] hover:text-[#A78BFA] hover:bg-[#8B5CF6]/10 gap-1"
                      onClick={() => alert("Voice explanation coming soon! 🔊")}>
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">Listen</span>
                    </Button>
                  </div>
                  <div className="text-[#A0B0BC] leading-relaxed whitespace-pre-line text-sm">
                    {question.explanation.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-[#E8E0D5] mt-3 mb-2">{line.slice(2, -2)}</p>;
                      if (line.startsWith("• ")) return <li key={i} className="ml-4 my-1">{line.slice(2)}</li>;
                      if (line.includes("|")) return null;
                      return line ? <p key={i} className="my-1">{line}</p> : <br key={i} />;
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-[rgba(245,158,11,0.2)] text-xs">
                <BookOpen className="w-4 h-4 text-[#5BB3B3]" />
                <span className="text-[#5BB3B3] font-medium">{question.reference.book}</span>
                <span className="text-[#6B7280]">• {question.reference.chapter}</span>
                <span className="text-[#6B7280]">• p. {question.reference.page}</span>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(91,179,179,0.1)]">
            <Button variant="outline" onClick={onPrevQuestion} disabled={currentQuestion === 0}
              className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC]">
              <ChevronLeft className="w-4 h-4 mr-2" />Previous
            </Button>
            <div className="flex gap-2">
              {!showExplanation && selectedAnswer !== null && (
                <Button onClick={onSubmitAnswer} className="bg-[#7BA69E] hover:bg-[#047857] text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />Submit
                </Button>
              )}
              <Button onClick={onNextQuestion} className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]">
                {currentQuestion === totalQuestions - 1 ? "Finish" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ATOM Help */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#E8E0D5]">Stuck on this question?</p>
              <p className="text-xs text-[#6B7280]">Ask ATOM for hints or detailed explanations</p>
            </div>
            <Link href={`/chat?question=${question.id}`}>
              <Button variant="outline" size="sm" className="border-[rgba(91,179,179,0.15)] text-[#5BB3B3]">
                <MessageCircle className="w-4 h-4 mr-2" />Ask ATOM
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
