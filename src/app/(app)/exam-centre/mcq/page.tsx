'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { mcqRansonsCriteria } from '@/lib/data/templates/mcq-template';
import { addBackstageEvent, normalizeSubject } from '@/lib/backstage/store';
import { updateBackstageEvent } from '@/lib/backstage/update';

type ConfidenceLevel = 'sure' | 'unsure' | 'guessing' | null;

export default function MCQPracticePage() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showWhyWrong, setShowWhyWrong] = useState(false);
  const [showHighYield, setShowHighYield] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSubmitted, setSessionSubmitted] = useState(false);
  const [isSessionBusy, setIsSessionBusy] = useState(false);
  
  const question = mcqRansonsCriteria;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const hasAnswered = selectedAnswer !== null;
  const questionStartedAtRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string | null>(null);
  const sessionSubmittedRef = useRef<boolean>(false);

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
          body: JSON.stringify({ mode: 'mcq' }),
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && typeof data?.id === 'string') {
          setSessionId(data.id);
          setSessionSubmitted(false);
          questionStartedAtRef.current = Date.now();
        }
      } catch (error) {
        console.warn('Failed to create MCQ exam session:', error);
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
      console.warn('Failed to submit MCQ exam session:', error);
    } finally {
      setIsSessionBusy(false);
    }
  }, [sessionId, sessionSubmitted]);

  const handleBackToExamCentre = useCallback(async () => {
    await submitSessionIfNeeded();
    router.push('/exam-centre');
  }, [router, submitSessionIfNeeded]);
  
  const handleAnswerSelect = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!hasAnswered) {
      setSelectedAnswer(option);
    }
  };
  
  const [backstageEventId, setBackstageEventId] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"factual" | "conceptual" | "application" | null>(null);
  const [bloomTag, setBloomTag] = useState<
    "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create" | null
  >(null);

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const subspecialtyFromSystem = (system: string) => {
    const s = system.toLowerCase();
    if (s.includes("hepatobiliary") || s.includes("pancre")) return "hepatobiliary";
    if (s.includes("esoph")) return "esophagus";
    if (s.includes("stomach") || s.includes("duoden")) return "stomach-duodenum";
    return toSlug(system);
  };

  const handleSubmit = () => {
    if (selectedAnswer && confidence) {
      const confidenceScoreMap: Record<Exclude<ConfidenceLevel, null>, number> = {
        sure: 5,
        unsure: 3,
        guessing: 1,
      };
      const confidenceValue = confidenceScoreMap[confidence];
      const timeTakenSeconds = Math.max(
        1,
        Math.round((Date.now() - questionStartedAtRef.current) / 1000)
      );

      setShowExplanation(true);

      const subjectKey = normalizeSubject(question.subject);
      const subjectSlug = subjectKey; // matches our library subject slugs (medicine/surgery/etc)
      const subspecialtySlug = subspecialtyFromSystem(question.system);
      const topicSlug = toSlug(question.topic);
      const topicId = `${subjectSlug}/${subspecialtySlug}/${topicSlug}`;

      // Backstage event (V1: localStorage)
      const ev = addBackstageEvent({
        type: 'mcq',
        subject: subjectKey,
        topicId,
        topic: question.topic,
        confidence: confidence === 'sure' ? 85 : confidence === 'unsure' ? 55 : 30,
        bloom: 'apply',
        mcq: {
          correct: selectedAnswer === question.correctAnswer,
          difficulty: question.difficulty,
        },
      });
      setBackstageEventId(ev.id);

      if (sessionId && !sessionSubmitted) {
        void fetch(`/api/exam-centre/sessions/${sessionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_ref: question.id,
            mode: 'mcq',
            selected_option_key: selectedAnswer,
            correct_option_key: question.correctAnswer,
            is_correct: selectedAnswer === question.correctAnswer,
            confidence: confidenceValue,
            time_taken_seconds: timeTakenSeconds,
          }),
        }).catch((error) => {
          console.warn('Failed to record MCQ answer:', error);
        });
      }
    }
  };
  
  const handleReset = () => {
    setSelectedAnswer(null);
    setConfidence(null);
    setShowExplanation(false);
    setShowWhyWrong(false);
    setShowHighYield(false);
    setBackstageEventId(null);
    setErrorType(null);
    setBloomTag(null);
    questionStartedAtRef.current = Date.now();
  };
  
  const getOptionStyle = (option: 'a' | 'b' | 'c' | 'd') => {
    if (!showExplanation) {
      if (selectedAnswer === option) {
        return 'bg-[#5BB3B3]/16 border-[#5BB3B3] text-[#C8E3E3]';
      }
      return 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/40 hover:bg-[#162535] cursor-pointer';
    }
    if (option === question.correctAnswer) {
      return 'bg-[#5BB3B3]/16 border-[#5BB3B3] text-[#C8E3E3]';
    }
    if (option === selectedAnswer && option !== question.correctAnswer) {
      return 'bg-[#E57373]/18 border-[#E57373] text-[#F3D6D6]';
    }
    return 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] opacity-60';
  };
  
  const confidenceOptions = [
    { value: 'sure', label: 'Sure', icon: ThumbsUp, color: 'emerald' },
    { value: 'unsure', label: 'Unsure', icon: Meh, color: 'amber' },
    { value: 'guessing', label: 'Guessing', icon: ThumbsDown, color: 'red' },
  ] as const;
  
  const confidenceStyles = {
    sure: 'bg-[#5BB3B3]/16 border-[#5BB3B3]/30 text-[#9FC3BC]',
    unsure: 'bg-[#C9A86C]/16 border-[#C9A86C]/30 text-[#D8BE90]',
    guessing: 'bg-[#E57373]/18 border-[#E57373]/30 text-[#EAB7B7]',
  } as const;
  
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
          <Badge variant="outline" className="bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28">
            <ClipboardList className="h-3 w-3 mr-1" />
            MCQ Practice
          </Badge>
          <Badge variant="outline" className={
            question.difficulty === 'Hard' 
              ? 'bg-[#E57373]/18 text-[#EAB7B7] border-[#E57373]/28'
              : question.difficulty === 'Medium'
              ? 'bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28'
              : 'bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28'
          }>
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-[#C9A86C]/16 text-[#C9A86C] border-[#C9A86C]/30">
            <Clock className="h-3 w-3 mr-1" />
            {Math.floor(question.estimatedTime / 60)}:{(question.estimatedTime % 60).toString().padStart(2, '0')} min
          </Badge>
        </div>
      </div>
      
      {/* Topic Header */}
      <Card className="bg-gradient-to-r from-[#5BB3B3]/16 to-[#5BB3B3]/16 border-[#5BB3B3]/28">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#E8E0D5]">{question.topic}</h2>
              <p className="text-[#B8DCDD] text-sm mt-1">
                {question.subject} • {question.system} • {question.subtopic}
              </p>
            </div>
            <Brain className="h-12 w-12 text-[#8FD5D5] opacity-50" />
          </div>
        </CardContent>
      </Card>
      
      {/* Question Card */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-sm text-[#A0B0BC] uppercase tracking-wide">
            Clinical Scenario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stem */}
          <div className="p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
            <p className="text-[#C9D2DA] leading-relaxed whitespace-pre-line font-mono text-sm">
              {question.stem}
            </p>
          </div>
          
          {/* Lead-in Question */}
          <div className="text-lg font-medium text-[#E8E0D5]">
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
                      ? 'bg-[#5BB3B3] text-[#E8E0D5]'
                      : showExplanation && option === selectedAnswer
                      ? 'bg-[#E57373] text-[#E8E0D5]'
                      : selectedAnswer === option
                      ? 'bg-[#5BB3B3] text-[#E8E0D5]'
                      : 'bg-[#253545] text-[#C9D2DA]'
                  }`}>
                    {showExplanation && option === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : showExplanation && option === selectedAnswer && option !== question.correctAnswer ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      option.toUpperCase()
                    )}
                  </div>
                  <span className={`flex-1 ${showExplanation && option !== question.correctAnswer && option !== selectedAnswer ? 'text-[#6B7A88]' : ''}`}>
                    {question.options[option].text}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Confidence Selection */}
          {selectedAnswer && !showExplanation && (
            <div className="p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
              <h4 className="text-sm font-medium text-[#C9D2DA] mb-3">How confident are you?</h4>
              <div className="flex gap-3">
                {confidenceOptions.map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant="outline"
                    className={`flex-1 ${
                      confidence === value
                        ? confidenceStyles[value]
                        : 'border-[rgba(91,179,179,0.18)] text-[#A0B0BC] hover:border-[rgba(91,179,179,0.24)]'
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
              className="w-full bg-[#5BB3B3] text-[#E8E0D5] hover:bg-[#4FA3A3]"
              onClick={handleSubmit}
            >
              <Zap className="h-4 w-4 mr-2" />
              Submit Answer
            </Button>
          )}
          
          {/* Result Banner */}
          {showExplanation && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-[#5BB3B3]/16 border border-[#5BB3B3]/28' : 'bg-[#E57373]/18 border border-[#E57373]/28'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-[#8FD5D5]" />
                      <span className="font-medium text-[#9FC3BC]">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-[#EAA0A0]" />
                      <span className="font-medium text-[#EAB7B7]">
                        Incorrect. The correct answer is {question.correctAnswer.toUpperCase()}.
                      </span>
                    </>
                  )}
                </div>
                <Badge variant="outline" className={
                  confidence === 'sure' 
                    ? 'bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28'
                    : confidence === 'unsure'
                    ? 'bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28'
                    : 'bg-[#E57373]/18 text-[#EAB7B7] border-[#E57373]/28'
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
          {/* Error type + Bloom tag (Backstage intelligence) */}
          {backstageEventId ? (
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#D8BE90]" /> Tag this attempt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isCorrect ? (
                  <div className="space-y-3">
                    <div className="text-sm text-[#C9D2DA]">
                      Why did you miss it? (powers strong/weak + next actions)
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <Button
                        variant={errorType === "factual" ? "default" : "outline"}
                        className={errorType === "factual" ? "bg-[#C9A86C] text-[#E8E0D5] hover:bg-[#B89455]" : "border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"}
                        onClick={() => {
                          setErrorType("factual");
                          updateBackstageEvent(backstageEventId, { mcq: { errorType: "factual" } });
                        }}
                      >
                        Factual
                      </Button>
                      <Button
                        variant={errorType === "conceptual" ? "default" : "outline"}
                        className={errorType === "conceptual" ? "bg-[#C9A86C] text-[#E8E0D5] hover:bg-[#B89455]" : "border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"}
                        onClick={() => {
                          setErrorType("conceptual");
                          updateBackstageEvent(backstageEventId, { mcq: { errorType: "conceptual" } });
                        }}
                      >
                        Conceptual
                      </Button>
                      <Button
                        variant={errorType === "application" ? "default" : "outline"}
                        className={errorType === "application" ? "bg-[#C9A86C] text-[#E8E0D5] hover:bg-[#B89455]" : "border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"}
                        onClick={() => {
                          setErrorType("application");
                          updateBackstageEvent(backstageEventId, { mcq: { errorType: "application" } });
                        }}
                      >
                        Application
                      </Button>
                    </div>

                    {errorType ? (
                      <Badge variant="outline" className="border-[#C9A86C]/28 bg-[#C9A86C]/10 text-[#D8BE90]">
                        Error: {errorType}
                      </Badge>
                    ) : null}
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="text-sm text-[#C9D2DA]">Bloom tag (what skill level was this?)</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(
                      [
                        "remember",
                        "understand",
                        "apply",
                        "analyze",
                        "evaluate",
                        "create",
                      ] as const
                    ).map((b) => (
                      <Button
                        key={b}
                        variant={bloomTag === b ? "default" : "outline"}
                        className={
                          bloomTag === b
                            ? "bg-[#5BB3B3] text-[#E8E0D5] hover:bg-[#4FA3A3]"
                            : "border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"
                        }
                        onClick={() => {
                          setBloomTag(b);
                          updateBackstageEvent(backstageEventId, { bloom: b });
                        }}
                      >
                        {b}
                      </Button>
                    ))}
                  </div>
                  {bloomTag ? (
                    <Badge variant="outline" className="border-[#5BB3B3]/28 bg-[#5BB3B3]/10 text-[#9FC3BC]">
                      Bloom: {bloomTag}
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Correct Answer Explanation */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#8FD5D5]" />
                Why Option {question.correctAnswer.toUpperCase()} is Correct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                <p className="text-[#C9D2DA] whitespace-pre-line leading-relaxed">
                  {question.options[question.correctAnswer].whyCorrect}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Concept Explanation */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-[#8FD5D5]" />
                Concept Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#C9D2DA] whitespace-pre-line leading-relaxed font-mono text-sm">
                    {question.conceptExplanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Why Others Are Wrong */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setShowWhyWrong(!showWhyWrong)}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-[#EAA0A0]" />
                  Why Other Options Are Wrong
                </div>
                {showWhyWrong ? (
                  <ChevronUp className="h-5 w-5 text-[#A0B0BC]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#A0B0BC]" />
                )}
              </CardTitle>
            </CardHeader>
            {showWhyWrong && (
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-[#E57373]/10 border border-[#E57373]/18">
                  <p className="text-[#C9D2DA] whitespace-pre-line leading-relaxed">
                    {question.whyOthersWrong}
                  </p>
                </div>
                
                {/* Individual Option Explanations */}
                {(['a', 'b', 'c', 'd'] as const)
                  .filter(opt => opt !== question.correctAnswer)
                  .map((option) => (
                    <div key={option} className="p-3 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E57373]/18 flex items-center justify-center text-[#EAA0A0] text-sm font-semibold">
                          {option.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[#C9D2DA] text-sm">{question.options[option].whyWrong}</p>
                          {question.options[option].commonConfusion && (
                            <p className="text-[#D8BE90] text-xs mt-2">
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
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setShowHighYield(!showHighYield)}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#D8BE90]" />
                  High-Yield Points ({question.highYieldPoints.length})
                </div>
                {showHighYield ? (
                  <ChevronUp className="h-5 w-5 text-[#A0B0BC]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#A0B0BC]" />
                )}
              </CardTitle>
            </CardHeader>
            {showHighYield && (
              <CardContent className="space-y-3">
                {question.highYieldPoints.map((point, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/16">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C9A86C] flex items-center justify-center text-[#E8E0D5] text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#E0CBA3]">{point.point}</p>
                        {point.mnemonic && (
                          <p className="text-[#C9A86C] text-sm mt-1">
                            <strong>Mnemonic:</strong> {point.mnemonic}
                          </p>
                        )}
                        <p className="text-[#A0B0BC] text-sm mt-1">{point.clinicalRelevance}</p>
                        {point.examTip && (
                          <p className="text-[#9FC3BC] text-sm mt-1">
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
          <Card className="bg-gradient-to-r from-[#364A5E]/95 to-[#2D3E50]/95 border-[#C9A86C]/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-[#C9A86C]" />
                Quick Revision Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-[#2D3E50] border border-[#C9A86C]/24 font-mono text-sm">
                <p className="text-[#C9D2DA] whitespace-pre-line">{question.quickRevisionNote}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Clinical Correlation */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#8FD5D5]" />
                Clinical Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                <p className="text-[#C9D2DA] whitespace-pre-line leading-relaxed">
                  {question.clinicalCorrelation}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Related Concepts */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-sm text-[#A0B0BC]">Related Concepts to Study</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {question.relatedConcepts.map((concept, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={
                      concept.priority === 'Must-know'
                        ? 'bg-[#E57373]/10 text-[#EAB7B7] border-[#E57373]/18'
                        : concept.priority === 'Should-know'
                        ? 'bg-[#C9A86C]/10 text-[#D8BE90] border-[#C9A86C]/16'
                        : 'bg-[#253545]/30 text-[#C9D2DA] border-[rgba(91,179,179,0.18)]'
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
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#8FD5D5]" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                <p className="text-[#B8DCDD] font-medium">{question.primaryReference.book}</p>
                <p className="text-[#A0B0BC] text-sm">{question.primaryReference.chapter} • Pages {question.primaryReference.pages}</p>
              </div>
              <div className="text-sm text-[#A0B0BC]">
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
        <Button
          variant="outline"
          className="border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"
          onClick={() => {
            void handleBackToExamCentre();
          }}
          disabled={isSessionBusy}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exam Centre
        </Button>
        
        {showExplanation && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-[#5BB3B3]/28 text-[#8FD5D5] hover:bg-[#5BB3B3]/10"
          >
            Practice Another Question
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
      </div>
    </div>
  );
}
