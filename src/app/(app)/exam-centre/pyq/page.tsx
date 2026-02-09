'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileQuestion,
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
  Eye,
  EyeOff,
  Bookmark,
  Share2,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import { pyqAcuteAppendicitisTemplate, pyqAcuteAppendicitis_AnatomyVariant, calculateAlvaradoScore } from '@/lib/data/templates/pyq-template';

type PYQQuestion = typeof pyqAcuteAppendicitisTemplate;

export default function PYQPracticePage() {
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const questions: PYQQuestion[] = [pyqAcuteAppendicitisTemplate, pyqAcuteAppendicitis_AnatomyVariant];
  const currentQuestion = questions[currentQuestionIndex];
  
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const hasAnswered = selectedAnswer !== null;
  
  const handleAnswerSelect = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!hasAnswered) {
      setSelectedAnswer(option);
      setShowExplanation(true);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowReferences(false);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowReferences(false);
    }
  };
  
  const handleReset = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowReferences(false);
  };
  
  const getOptionStyle = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!hasAnswered) {
      return 'bg-[#0D1B2A] border-gray-700 hover:border-amber-500/50 hover:bg-[#162535] cursor-pointer';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-100';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-red-500/20 border-red-500 text-red-100';
    }
    return 'bg-[#0D1B2A] border-gray-700 opacity-60';
  };
  
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
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            <FileQuestion className="h-3 w-3 mr-1" />
            {currentQuestion.examBody} {currentQuestion.year}
          </Badge>
          <Badge variant="outline" className={
            currentQuestion.difficulty === 'Hard' 
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : currentQuestion.difficulty === 'Medium'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }>
            {currentQuestion.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {currentQuestion.averageTime}s avg
          </Badge>
        </div>
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="flex-1 h-2 bg-gray-700" />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={isBookmarked ? 'text-amber-400' : 'text-gray-400'}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Question Card */}
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-amber-400" />
                {currentQuestion.topic}
              </CardTitle>
              <CardDescription className="mt-1">
                {currentQuestion.subject} • {currentQuestion.system} • {currentQuestion.subtopic}
              </CardDescription>
            </div>
            {currentQuestion.repeatFrequency === 'High' && (
              <Badge className="bg-red-500/20 text-red-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High Yield
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Clinical Vignette */}
          <div className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {currentQuestion.clinicalVignette}
            </p>
          </div>
          
          {/* Question */}
          <div className="text-lg font-medium text-white">
            {currentQuestion.question}
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {(['a', 'b', 'c', 'd'] as const).map((option) => (
              <div
                key={option}
                className={`p-4 rounded-lg border-2 transition-all ${getOptionStyle(option)}`}
                onClick={() => handleAnswerSelect(option)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    hasAnswered && option === currentQuestion.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : hasAnswered && option === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {hasAnswered && option === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : hasAnswered && option === selectedAnswer ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      option.toUpperCase()
                    )}
                  </div>
                  <span className={hasAnswered && option !== currentQuestion.correctAnswer && option !== selectedAnswer ? 'text-gray-500' : ''}>
                    {currentQuestion.options[option]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Result Banner */}
          {hasAnswered && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium text-emerald-300">Correct! Well done.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="font-medium text-red-300">
                      Incorrect. The correct answer is {currentQuestion.correctAnswer.toUpperCase()}.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Explanation Section */}
      {showExplanation && (
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Why Correct */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-medium text-emerald-300 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Why This is Correct
              </h4>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {currentQuestion.explanation.whyCorrect}
              </p>
            </div>
            
            {/* Key Fact */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Key Fact
              </h4>
              <p className="text-gray-300">{currentQuestion.explanation.keyFact}</p>
            </div>
            
            {/* Clinical Pearl */}
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <h4 className="font-medium text-purple-300 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Clinical Pearl
              </h4>
              <p className="text-gray-300">{currentQuestion.explanation.clinicalPearl}</p>
            </div>
            
            {/* Common Mistake */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-medium text-amber-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Common Mistake
              </h4>
              <p className="text-gray-300">{currentQuestion.explanation.commonMistake}</p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentQuestion.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Textbook References */}
      {showExplanation && (
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setShowReferences(!showReferences)}
          >
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                Textbook References ({currentQuestion.references.length})
              </div>
              {showReferences ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </CardTitle>
          </CardHeader>
          {showReferences && (
            <CardContent className="space-y-3">
              {currentQuestion.references.map((ref, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{ref.book}</h4>
                      <p className="text-sm text-gray-400">
                        {ref.edition} Edition • Chapter {ref.chapter}: {ref.chapterTitle}
                      </p>
                      <p className="text-sm text-blue-400 mt-1">Pages: {ref.pageNumbers}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                      Reference {idx + 1}
                    </Badge>
                  </div>
                  <div className="mt-3 p-3 rounded bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-200">
                      <strong>Key Point:</strong> {ref.keyPoint}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="border-gray-600 text-gray-300"
        >
          <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {hasAnswered && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
        >
          Next Question
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      {/* Related Questions */}
      {showExplanation && currentQuestion.relatedQuestionIds.length > 0 && (
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Related Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.relatedQuestionIds.map((id) => (
                <Badge 
                  key={id} 
                  variant="outline" 
                  className="bg-gray-500/10 text-gray-300 border-gray-600 cursor-pointer hover:border-amber-500/50"
                >
                  {id}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
