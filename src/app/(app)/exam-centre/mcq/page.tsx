'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ClipboardList,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  Target,
  ArrowLeft,
  Brain,
  Zap,
  BookMarked,
  TrendingUp,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Meh,
} from 'lucide-react';
import { mcqRansonsCriteria, calculateRansonsScore } from '@/lib/data/templates/mcq-template';
import { addBackstageEvent, normalizeSubject } from '@/lib/backstage/store';

type ConfidenceLevel = 'sure' | 'unsure' | 'guessing' | null;

export default function MCQPracticePage() {
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showWhyWrong, setShowWhyWrong] = useState(false);
  const [showHighYield, setShowHighYield] = useState(false);
  
  const question = mcqRansonsCriteria;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const hasAnswered = selectedAnswer !== null;
  
  const handleAnswerSelect = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!hasAnswered) {
      setSelectedAnswer(option);
    }
  };
  
  const handleSubmit = () => {
    if (selectedAnswer && confidence) {
      setShowExplanation(true);

      // Backstage event (V1: localStorage)
      addBackstageEvent({
        type: 'mcq',
        subject: normalizeSubject(question.subject),
        topic: question.topic,
        confidence: confidence === 'sure' ? 85 : confidence === 'unsure' ? 55 : 30,
        bloom: 'apply',
        mcq: {
          correct: selectedAnswer === question.correctAnswer,
          difficulty: question.difficulty,
        },
      });
    }
  };
  
  const handleReset = () => {
    setSelectedAnswer(null);
    setConfidence(null);
    setShowExplanation(false);
    setShowWhyWrong(false);
    setShowHighYield(false);
  };
  
  const getOptionStyle = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!showExplanation) {
      if (selectedAnswer === option) {
        return 'bg-blue-500/20 border-blue-500 text-blue-100';
      }
      return 'bg-[#0D1B2A] border-gray-700 hover:border-blue-500/50 hover:bg-[#162535] cursor-pointer';
    }
    if (option === question.correctAnswer) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-100';
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return 'bg-red-500/20 border-red-500 text-red-100';
    }
    return 'bg-[#0D1B2A] border-gray-700 opacity-60';
  };
  
  const confidenceOptions = [
    { value: 'sure', label: 'Sure', icon: ThumbsUp, color: 'emerald' },
    { value: 'unsure', label: 'Unsure', icon: Meh, color: 'amber' },
    { value: 'guessing', label: 'Guessing', icon: ThumbsDown, color: 'red' },
  ] as const;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/exam-centre">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exam Centre
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <ClipboardList className="h-3 w-3 mr-1" />
            MCQ Practice
          </Badge>
          <Badge variant="outline" className={
            question.difficulty === 'Hard' 
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : question.difficulty === 'Medium'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }>
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {Math.floor(question.estimatedTime / 60)}:{(question.estimatedTime % 60).toString().padStart(2, '0')} min
          </Badge>
        </div>
      </div>
      
      {/* Topic Header */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{question.topic}</h2>
              <p className="text-blue-200 text-sm mt-1">
                {question.subject} • {question.system} • {question.subtopic}
              </p>
            </div>
            <Brain className="h-12 w-12 text-blue-400 opacity-50" />
          </div>
        </CardContent>
      </Card>
      
      {/* Question Card */}
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-sm text-gray-400 uppercase tracking-wide">
            Clinical Scenario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stem */}
          <div className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line font-mono text-sm">
              {question.stem}
            </p>
          </div>
          
          {/* Lead-in Question */}
          <div className="text-lg font-medium text-white">
            {question.leadIn}
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {(['a', 'b', 'c', 'd'] as const).map((option) => (
              <div
                key={option}
                className={`p-4 rounded-lg border-2 transition-all ${getOptionStyle(option)}`}
                onClick={() => handleAnswerSelect(option)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-semibold ${
                    showExplanation && option === question.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : showExplanation && option === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : selectedAnswer === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {showExplanation && option === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : showExplanation && option === selectedAnswer && option !== question.correctAnswer ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      option.toUpperCase()
                    )}
                  </div>
                  <span className={`flex-1 ${showExplanation && option !== question.correctAnswer && option !== selectedAnswer ? 'text-gray-500' : ''}`}>
                    {question.options[option].text}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Confidence Selection */}
          {selectedAnswer && !showExplanation && (
            <div className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-3">How confident are you?</h4>
              <div className="flex gap-3">
                {confidenceOptions.map(({ value, label, icon: Icon, color }) => (
                  <Button
                    key={value}
                    variant="outline"
                    className={`flex-1 ${
                      confidence === value
                        ? `bg-${color}-500/20 border-${color}-500 text-${color}-300`
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                    onClick={() => setConfidence(value)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          {selectedAnswer && confidence && !showExplanation && (
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSubmit}
            >
              <Zap className="h-4 w-4 mr-2" />
              Submit Answer
            </Button>
          )}
          
          {/* Result Banner */}
          {showExplanation && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="font-medium text-emerald-300">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="font-medium text-red-300">
                        Incorrect. The correct answer is {question.correctAnswer.toUpperCase()}.
                      </span>
                    </>
                  )}
                </div>
                <Badge variant="outline" className={
                  confidence === 'sure' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : confidence === 'unsure'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }>
                  You were {confidence}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Explanation Section */}
      {showExplanation && (
        <>
          {/* Correct Answer Explanation */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-400" />
                Why Option {question.correctAnswer.toUpperCase()} is Correct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {question.options[question.correctAnswer].whyCorrect}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Concept Explanation */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-400" />
                Concept Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed font-mono text-sm">
                    {question.conceptExplanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Why Others Are Wrong */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setShowWhyWrong(!showWhyWrong)}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  Why Other Options Are Wrong
                </div>
                {showWhyWrong ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            {showWhyWrong && (
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {question.whyOthersWrong}
                  </p>
                </div>
                
                {/* Individual Option Explanations */}
                {(['a', 'b', 'c', 'd'] as const)
                  .filter(opt => opt !== question.correctAnswer)
                  .map((option) => (
                    <div key={option} className="p-3 rounded-lg bg-[#0D1B2A] border border-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm font-semibold">
                          {option.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-300 text-sm">{question.options[option].whyWrong}</p>
                          {question.options[option].commonConfusion && (
                            <p className="text-amber-400 text-xs mt-2">
                              <AlertTriangle className="h-3 w-3 inline mr-1" />
                              Common confusion: {question.options[option].commonConfusion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            )}
          </Card>
          
          {/* High Yield Points */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setShowHighYield(!showHighYield)}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  High-Yield Points ({question.highYieldPoints.length})
                </div>
                {showHighYield ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            {showHighYield && (
              <CardContent className="space-y-3">
                {question.highYieldPoints.map((point, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-amber-200">{point.point}</p>
                        {point.mnemonic && (
                          <p className="text-purple-300 text-sm mt-1">
                            <strong>Mnemonic:</strong> {point.mnemonic}
                          </p>
                        )}
                        <p className="text-gray-400 text-sm mt-1">{point.clinicalRelevance}</p>
                        {point.examTip && (
                          <p className="text-blue-300 text-sm mt-1">
                            <Target className="h-3 w-3 inline mr-1" />
                            <strong>Exam Tip:</strong> {point.examTip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
          
          {/* Quick Revision Note */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-purple-400" />
                Quick Revision Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-[#0D1B2A] border border-purple-500/20 font-mono text-sm">
                <p className="text-gray-300 whitespace-pre-line">{question.quickRevisionNote}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Clinical Correlation */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Clinical Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {question.clinicalCorrelation}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Related Concepts */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Related Concepts to Study</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {question.relatedConcepts.map((concept, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={
                      concept.priority === 'Must-know'
                        ? 'bg-red-500/10 text-red-300 border-red-500/20'
                        : concept.priority === 'Should-know'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-gray-500/10 text-gray-300 border-gray-600'
                    }
                  >
                    {concept.concept}
                    <span className="ml-1 text-xs opacity-60">({concept.priority})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* References */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-200 font-medium">{question.primaryReference.book}</p>
                <p className="text-gray-400 text-sm">{question.primaryReference.chapter} • Pages {question.primaryReference.pages}</p>
              </div>
              <div className="text-sm text-gray-400">
                <p className="mb-2">Additional Reading:</p>
                <ul className="list-disc list-inside space-y-1">
                  {question.additionalReading.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/exam-centre">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam Centre
          </Button>
        </Link>
        
        {showExplanation && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            Practice Another Question
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
