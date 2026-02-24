"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock } from "lucide-react";
import { useAnalytics } from "@/lib/analytics";
import { questions, type ConfidenceLevel, type QuizMode } from "@/components/practice/data";
import { ResultsScreen } from "@/components/practice/ResultsScreen";
import { QuestionNavigator } from "@/components/practice/QuestionNavigator";
import { QuestionCard } from "@/components/practice/QuestionCard";

export default function MCQPracticePage() {
  const _params = useParams();
  const router = useRouter();
  const { trackMCQAttempt } = useAnalytics();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [confidences, setConfidences] = useState<ConfidenceLevel[]>(new Array(questions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showExplanation, setShowExplanation] = useState(false);
  const [mode, setMode] = useState<QuizMode>("practice");
  const [trackedQuestions, setTrackedQuestions] = useState<Set<number>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const questionStartTime = useRef(0);
  const [instantFeedback] = useState(false);
  
  const question = questions[currentQuestion];
  
  useEffect(() => {
    if (mode === "practice" && isTimerRunning) {
      const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isTimerRunning]);

  useEffect(() => { questionStartTime.current = Date.now(); }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };
  
  const handleSelectConfidence = (level: ConfidenceLevel) => {
    const newConfidences = [...confidences];
    newConfidences[currentQuestion] = level;
    setConfidences(newConfidences);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    
    if (!trackedQuestions.has(currentQuestion)) {
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);
      trackMCQAttempt({
        questionId: question.id.toString(),
        topicId: question.topic.toLowerCase().replace(/\s+/g, '-'),
        topicName: question.topic,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: selectedAnswer === question.correctAnswer,
        confidence: confidences[currentQuestion] || 'unsure',
        difficulty: question.difficulty,
        timeSpent,
        isHighYield: question.highYield,
      });
      setTrackedQuestions(prev => new Set(prev).add(currentQuestion));
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(instantFeedback ? false : answers[currentQuestion + 1] !== null);
      questionStartTime.current = Date.now();
    } else {
      setMode("results");
      setIsTimerRunning(false);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(answers[currentQuestion - 1] !== null);
    }
  };
  
  const handleGoToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]);
    setShowExplanation(mode === "review" || answers[index] !== null);
  };
  
  const toggleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestion] = !newFlagged[currentQuestion];
    setFlagged(newFlagged);
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0); setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setConfidences(new Array(questions.length).fill(null));
    setFlagged(new Array(questions.length).fill(false));
    setShowExplanation(false); setMode("practice");
    setTimeElapsed(0); setIsTimerRunning(true);
    setTrackedQuestions(new Set());
    questionStartTime.current = Date.now();
  };
  
  const handleReviewMistakes = () => {
    const firstWrong = answers.findIndex((a, i) => a !== null && a !== questions[i].correctAnswer);
    if (firstWrong !== -1) {
      setCurrentQuestion(firstWrong);
      setSelectedAnswer(answers[firstWrong]);
      setShowExplanation(true);
      setMode("review");
    }
  };
  
  const attempted = answers.filter(a => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length;
  const incorrect = attempted - correct;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  
  const calibrationData = confidences.reduce((acc, conf, i) => {
    if (conf && answers[i] !== null) {
      const isCorrect = answers[i] === questions[i].correctAnswer;
      if (!acc[conf]) acc[conf] = { correct: 0, total: 0 };
      acc[conf].total++;
      if (isCorrect) acc[conf].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  if (mode === "results") {
    return (
      <ResultsScreen
        accuracy={accuracy} correct={correct} incorrect={incorrect}
        totalQuestions={questions.length} timeElapsed={timeElapsed}
        formatTime={formatTime} calibrationData={calibrationData}
        onRestart={handleRestart} onReviewMistakes={handleReviewMistakes}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />Back
          </button>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">Gastric Cancer MCQs</h1>
          <p className="text-[#A0B0BC]">Surgical GI - {questions.length} Questions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeElapsed > 600 ? 'bg-[rgba(239,68,68,0.2)] text-[#E57373]' : 'bg-[#364A5E] border border-[rgba(91,179,179,0.15)] text-[#E8E0D5]'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeElapsed)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#A0B0BC]">
            <span>{currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>
      </div>
      
      <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-6" />
      
      <QuestionNavigator
        questions={questions} currentQuestion={currentQuestion}
        answers={answers} flagged={flagged} onGoToQuestion={handleGoToQuestion}
      />
      
      <QuestionCard
        question={question} currentQuestion={currentQuestion}
        totalQuestions={questions.length} selectedAnswer={selectedAnswer}
        showExplanation={showExplanation} flagged={flagged[currentQuestion]}
        confidenceLevel={confidences[currentQuestion]}
        showConfidenceSelector={true}
        onSelectAnswer={handleSelectAnswer} onSelectConfidence={handleSelectConfidence}
        onSubmitAnswer={handleSubmitAnswer} onNextQuestion={handleNextQuestion}
        onPrevQuestion={handlePrevQuestion} onToggleFlag={toggleFlag}
      />
    </div>
  );
}
