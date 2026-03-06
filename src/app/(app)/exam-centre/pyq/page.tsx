'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Bookmark,
  Share2,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import { pyqAcuteAppendicitisTemplate, pyqAcuteAppendicitis_AnatomyVariant } from '@/lib/data/templates/pyq-template';

type PYQQuestion = typeof pyqAcuteAppendicitisTemplate;
type OptionKey = 'a' | 'b' | 'c' | 'd';

export default function PYQPracticePage() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSubmitted, setSessionSubmitted] = useState(false);
  const [isSessionBusy, setIsSessionBusy] = useState(false);
  
  const questions: PYQQuestion[] = [pyqAcuteAppendicitisTemplate, pyqAcuteAppendicitis_AnatomyVariant];
  const currentQuestion = questions[currentQuestionIndex];
  const questionStartedAtRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string | null>(null);
  const sessionSubmittedRef = useRef<boolean>(false);
  
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const hasAnswered = selectedAnswer !== null;

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    sessionSubmittedRef.current = sessionSubmitted;
  }, [sessionSubmitted]);

  useEffect(() => {
    let cancelled = false;

    const createSession = async () => {
      try {
        const response = await fetch('/api/exam-centre/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'pyq' }),
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && typeof data?.id === 'string') {
          setSessionId(data.id);
          setSessionSubmitted(false);
          questionStartedAtRef.current = Date.now();
        }
      } catch (error) {
        console.warn('Failed to create PYQ exam session:', error);
      }
    };

    void createSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      const activeSessionId = sessionIdRef.current;
      if (!activeSessionId || sessionSubmittedRef.current) return;

      void fetch(`/api/exam-centre/sessions/${activeSessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ended_at: new Date().toISOString() }),
        keepalive: true,
      });
    };
  }, []);

  const submitSessionIfNeeded = useCallback(async () => {
    if (!sessionId || sessionSubmitted) return;
    setIsSessionBusy(true);
    try {
      const response = await fetch(`/api/exam-centre/sessions/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ended_at: new Date().toISOString() }),
      });
      if (response.ok) {
        setSessionSubmitted(true);
      }
    } catch (error) {
      console.warn('Failed to submit PYQ exam session:', error);
    } finally {
      setIsSessionBusy(false);
    }
  }, [sessionId, sessionSubmitted]);

  const recordTemplateAnswer = useCallback(
    async (questionId: string, selectedOption: OptionKey, correctOption: OptionKey) => {
      if (!sessionId || sessionSubmitted) return;
      const timeTakenSeconds = Math.max(
        1,
        Math.round((Date.now() - questionStartedAtRef.current) / 1000)
      );

      try {
        await fetch(`/api/exam-centre/sessions/${sessionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_ref: questionId,
            mode: 'pyq',
            selected_option_key: selectedOption,
            correct_option_key: correctOption,
            is_correct: selectedOption === correctOption,
            confidence: 3,
            time_taken_seconds: timeTakenSeconds,
          }),
        });
      } catch (error) {
        console.warn('Failed to record PYQ answer:', error);
      }
    },
    [sessionId, sessionSubmitted]
  );

  const handleBackToExamCentre = useCallback(async () => {
    await submitSessionIfNeeded();
    router.push('/exam-centre');
  }, [router, submitSessionIfNeeded]);
  
  const handleAnswerSelect = (option: OptionKey) => {
    if (!hasAnswered) {
      setSelectedAnswer(option);
      setShowExplanation(true);
      void recordTemplateAnswer(currentQuestion.id, option, currentQuestion.correctAnswer);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowReferences(false);
      questionStartedAtRef.current = Date.now();
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowReferences(false);
      questionStartedAtRef.current = Date.now();
    }
  };
  
  const handleReset = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowReferences(false);
    questionStartedAtRef.current = Date.now();
  };
  
  const getOptionStyle = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!hasAnswered) {
      return 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[#C9A86C]/40 hover:bg-[#162535] cursor-pointer';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-[#5BB3B3]/16 border-[#5BB3B3] text-[#C8E3E3]';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-[#E57373]/18 border-[#E57373] text-[#F3D6D6]';
    }
    return 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] opacity-60';
  };
  
  return (
    <div className="ui-shell">
      <div className="ui-page space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#A0B0BC] hover:text-[#E8E0D5]"
            onClick={() => {
              void handleBackToExamCentre();
            }}
            disabled={isSessionBusy}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam Centre
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28">
            <FileQuestion className="h-3 w-3 mr-1" />
            {currentQuestion.examBody} {currentQuestion.year}
          </Badge>
          <Badge variant="outline" className={
            currentQuestion.difficulty === 'Hard' 
              ? 'bg-[#E57373]/18 text-[#EAB7B7] border-[#E57373]/28'
              : currentQuestion.difficulty === 'Medium'
              ? 'bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28'
              : 'bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28'
          }>
            {currentQuestion.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-[#C9A86C]/16 text-[#C9A86C] border-[#C9A86C]/30">
            <Clock className="h-3 w-3 mr-1" />
            {currentQuestion.averageTime}s avg
          </Badge>
        </div>
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#A0B0BC]">Question {currentQuestionIndex + 1} of {questions.length}</span>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="flex-1 h-2 bg-[#253545]" />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={isBookmarked ? 'text-[#D8BE90]' : 'text-[#A0B0BC]'}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#A0B0BC]">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Question Card */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg text-[#E8E0D5] flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#D8BE90]" />
                {currentQuestion.topic}
              </CardTitle>
              <CardDescription className="mt-1">
                {currentQuestion.subject} • {currentQuestion.system} • {currentQuestion.subtopic}
              </CardDescription>
            </div>
            {currentQuestion.repeatFrequency === 'High' && (
              <Badge className="bg-[#E57373]/18 text-[#EAB7B7]">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High Yield
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Clinical Vignette */}
          <div className="p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
            <p className="text-[#C9D2DA] leading-relaxed whitespace-pre-line">
              {currentQuestion.clinicalVignette}
            </p>
          </div>
          
          {/* Question */}
          <div className="text-lg font-medium text-[#E8E0D5]">
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
                      ? 'bg-[#5BB3B3] text-[#E8E0D5]'
                      : hasAnswered && option === selectedAnswer
                      ? 'bg-[#E57373] text-[#E8E0D5]'
                      : 'bg-[#253545] text-[#C9D2DA]'
                  }`}>
                    {hasAnswered && option === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : hasAnswered && option === selectedAnswer ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      option.toUpperCase()
                    )}
                  </div>
                  <span className={hasAnswered && option !== currentQuestion.correctAnswer && option !== selectedAnswer ? 'text-[#6B7A88]' : ''}>
                    {currentQuestion.options[option]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Result Banner */}
          {hasAnswered && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-[#5BB3B3]/16 border border-[#5BB3B3]/28' : 'bg-[#E57373]/18 border border-[#E57373]/28'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-[#8FD5D5]" />
                    <span className="font-medium text-[#9FC3BC]">Correct! Well done.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-[#EAA0A0]" />
                    <span className="font-medium text-[#EAB7B7]">
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
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#D8BE90]" />
              Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Why Correct */}
            <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
              <h4 className="font-medium text-[#9FC3BC] mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Why This is Correct
              </h4>
              <p className="text-[#C9D2DA] whitespace-pre-line leading-relaxed">
                {currentQuestion.explanation.whyCorrect}
              </p>
            </div>
            
            {/* Key Fact */}
            <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
              <h4 className="font-medium text-[#9FC3BC] mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Key Fact
              </h4>
              <p className="text-[#C9D2DA]">{currentQuestion.explanation.keyFact}</p>
            </div>
            
            {/* Clinical Pearl */}
            <div className="p-4 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/24">
              <h4 className="font-medium text-[#C9A86C] mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Clinical Pearl
              </h4>
              <p className="text-[#C9D2DA]">{currentQuestion.explanation.clinicalPearl}</p>
            </div>
            
            {/* Common Mistake */}
            <div className="p-4 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/16">
              <h4 className="font-medium text-[#D8BE90] mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Common Mistake
              </h4>
              <p className="text-[#C9D2DA]">{currentQuestion.explanation.commonMistake}</p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentQuestion.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-[#253545]/30 text-[#A0B0BC] border-[rgba(91,179,179,0.18)]">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Textbook References */}
      {showExplanation && (
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setShowReferences(!showReferences)}
          >
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#8FD5D5]" />
                Textbook References ({currentQuestion.references.length})
              </div>
              {showReferences ? (
                <ChevronUp className="h-5 w-5 text-[#A0B0BC]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#A0B0BC]" />
              )}
            </CardTitle>
          </CardHeader>
          {showReferences && (
            <CardContent className="space-y-3">
              {currentQuestion.references.map((ref, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[#E8E0D5]">{ref.book}</h4>
                      <p className="text-sm text-[#A0B0BC]">
                        {ref.edition} Edition • Chapter {ref.chapter}: {ref.chapterTitle}
                      </p>
                      <p className="text-sm text-[#8FD5D5] mt-1">Pages: {ref.pageNumbers}</p>
                    </div>
                    <Badge variant="outline" className="bg-[#5BB3B3]/10 text-[#9FC3BC] border-[#5BB3B3]/16">
                      Reference {idx + 1}
                    </Badge>
                  </div>
                  <div className="mt-3 p-3 rounded bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                    <p className="text-sm text-[#B8DCDD]">
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
          className="border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"
        >
          <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {hasAnswered && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-[#C9A86C]/28 text-[#D8BE90] hover:bg-[#C9A86C]/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="bg-[#C9A86C]/16 text-[#D8BE90] hover:bg-[#C9A86C]/28"
        >
          Next Question
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      {/* Related Questions */}
      {showExplanation && currentQuestion.relatedQuestionIds.length > 0 && (
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm text-[#A0B0BC]">Related Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.relatedQuestionIds.map((id) => (
                <Badge 
                  key={id} 
                  variant="outline" 
                  className="bg-[#253545]/30 text-[#C9D2DA] border-[rgba(91,179,179,0.18)] cursor-pointer hover:border-[#C9A86C]/40"
                >
                  {id}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
