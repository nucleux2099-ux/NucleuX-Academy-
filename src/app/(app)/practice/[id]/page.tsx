"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  Flag,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  BookOpen,
  RotateCcw,
  Target,
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Award,
  Atom,
  Eye,
  EyeOff,
  Volume2,
  Bookmark,
  Share2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useAnalytics } from "@/lib/analytics";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  reference: { book: string; chapter: string; page: string };
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  highYield: boolean;
  image?: string;
  imageCaption?: string;
  pyq?: { exam: string; year: number }; // Previous Year Question
}

const questions: Question[] = [
  {
    id: 1,
    question: "A 58-year-old male presents with progressive dysphagia to solids for 3 months and 10 kg weight loss. Endoscopy reveals an ulcerated mass at the gastroesophageal junction. Biopsy shows adenocarcinoma. CT shows no distant metastasis. What is the most appropriate next step in management?",
    options: [
      "Immediate surgical resection with D2 lymphadenectomy",
      "Staging laparoscopy followed by neoadjuvant chemotherapy",
      "Definitive chemoradiation therapy",
      "Palliative chemotherapy with best supportive care"
    ],
    correctAnswer: 1,
    explanation: `**Correct Answer: Staging laparoscopy followed by neoadjuvant chemotherapy**

For locally advanced gastric/GEJ adenocarcinoma without distant metastasis on imaging:

1. **Staging laparoscopy** is recommended to rule out peritoneal disease (present in 20-30% of patients with negative CT)

2. **Neoadjuvant chemotherapy** (FLOT regimen) is the standard of care for resectable disease:
   • Improves R0 resection rates
   • Provides survival benefit over surgery alone
   • Allows assessment of tumor response

**Why other options are incorrect:**
• **A:** Immediate surgery without neoadjuvant therapy is suboptimal for locally advanced disease
• **C:** Definitive chemoradiation is for unresectable or medically inoperable cases
• **D:** Palliative approach is premature given potentially resectable disease`,
    reference: { book: "Maingot's Abdominal Operations", chapter: "Ch. 22", page: "525" },
    topic: "Gastric Cancer",
    difficulty: "Hard",
    highYield: true,
    pyq: { exam: "NEET-PG", year: 2023 },
  },
  {
    id: 2,
    question: "Which of the following is the most important prognostic factor in gastric cancer?",
    options: [
      "Tumor size",
      "Lauren classification",
      "TNM stage",
      "HER2 status"
    ],
    correctAnswer: 2,
    explanation: `**Correct Answer: TNM stage**

TNM staging is the most important prognostic factor:

• **Stage I:** >90% 5-year survival
• **Stage II:** 60-80% 5-year survival
• **Stage III:** 20-50% 5-year survival  
• **Stage IV:** <5% 5-year survival

**Other factors and their roles:**
• **Lauren classification:** Prognostic but less important than stage
• **Tumor size:** Not directly in TNM (T stage is depth, not size)
• **HER2 status:** Predictive for targeted therapy, not primary prognostic factor`,
    reference: { book: "AJCC Cancer Staging Manual", chapter: "8th Ed", page: "203" },
    topic: "Gastric Cancer",
    difficulty: "Easy",
    highYield: true,
    pyq: { exam: "AIIMS", year: 2022 },
  },
  {
    id: 3,
    question: "A D2 lymphadenectomy for gastric cancer includes removal of nodes along all of the following EXCEPT:",
    options: [
      "Left gastric artery",
      "Common hepatic artery",
      "Para-aortic region",
      "Splenic artery"
    ],
    correctAnswer: 2,
    explanation: `**Correct Answer: Para-aortic region**

**D2 lymphadenectomy includes:**
• **D1 stations (1-6):** Perigastric nodes
• **Station 7:** Left gastric artery
• **Station 8:** Common hepatic artery
• **Station 9:** Celiac axis
• **Station 10:** Splenic hilum
• **Station 11:** Splenic artery

**Para-aortic nodes (Station 16)** are NOT part of standard D2 dissection:
• Included in D3/extended dissection
• No proven survival benefit
• Increased morbidity
• Consider only for clinical trials`,
    reference: { book: "Japanese Gastric Cancer Treatment Guidelines", chapter: "5th Ed", page: "10" },
    topic: "Surgical Oncology",
    difficulty: "Medium",
    highYield: true,
  },
  {
    id: 4,
    question: "The FLOT chemotherapy regimen for gastric cancer includes all of the following drugs EXCEPT:",
    options: [
      "Docetaxel",
      "Oxaliplatin",
      "Epirubicin",
      "5-Fluorouracil"
    ],
    correctAnswer: 2,
    explanation: `**Correct Answer: Epirubicin**

**FLOT regimen components:**
• **F** - 5-Fluorouracil (2600 mg/m², 24h infusion)
• **L** - Leucovorin (200 mg/m²)
• **O** - Oxaliplatin (85 mg/m²)
• **T** - Docetaxel (Taxotere) (50 mg/m²)

**Epirubicin** is part of the older ECF/ECX regimens, which FLOT has replaced based on the FLOT4 trial showing:
• Better overall survival (50 vs 35 months)
• Higher pathologic complete response (16% vs 6%)
• Improved R0 resection rate (85% vs 78%)`,
    reference: { book: "Al-Batran et al., Lancet", chapter: "2019", page: "393:1948-57" },
    topic: "Medical Oncology",
    difficulty: "Medium",
    highYield: true,
  },
  {
    id: 5,
    question: "A 45-year-old woman with diffuse-type gastric cancer (signet ring cell) is planned for surgical resection. What is the recommended proximal margin?",
    options: [
      "3 cm",
      "4 cm",
      "5 cm",
      "6 cm"
    ],
    correctAnswer: 3,
    explanation: `**Correct Answer: 6 cm**

Margin requirements based on Lauren classification:

| Type | Recommended Margin |
|------|-------------------|
| Intestinal | 5 cm (or 4 cm if confirmed R0 on frozen) |
| Diffuse | 6 cm |
| Mixed | 6 cm |

**Rationale for wider margins in diffuse type:**
• Submucosal spread pattern
• Ill-defined tumor borders
• Higher risk of positive margins
• Associated with worse prognosis

**Clinical Pearl:** If 5-6 cm proximal margin cannot be achieved with subtotal gastrectomy, proceed to total gastrectomy.`,
    reference: { book: "Maingot's Abdominal Operations", chapter: "Ch. 22", page: "530" },
    topic: "Surgical Oncology",
    difficulty: "Medium",
    highYield: true,
    pyq: { exam: "NEET-PG", year: 2024 },
  },
  {
    id: 6,
    question: "A 55-year-old male presents with abdominal pain and weight loss. CT scan is shown above. What is the most likely diagnosis?",
    options: [
      "Pancreatic adenocarcinoma",
      "Chronic pancreatitis",
      "Pancreatic pseudocyst",
      "Insulinoma"
    ],
    correctAnswer: 0,
    explanation: `**Correct Answer: Pancreatic adenocarcinoma**

The CT image shows classic features of pancreatic head adenocarcinoma:

**Key Imaging Findings:**
• **Double duct sign** — Dilated CBD + dilated pancreatic duct
• **Hypodense mass** in pancreatic head
• **Upstream pancreatic atrophy**
• **Vascular encasement** (if present)

**Why other options are incorrect:**
• **Chronic pancreatitis:** Would show calcifications, irregular duct, no mass
• **Pseudocyst:** Well-defined fluid collection, not solid mass
• **Insulinoma:** Small, hypervascular tumor (not hypodense)

**Clinical Pearl:** Double duct sign in a patient >50y with painless jaundice = pancreatic cancer until proven otherwise.`,
    reference: { book: "Blumgart's Surgery of the Liver", chapter: "Ch. 45", page: "712" },
    topic: "Hepatobiliary",
    difficulty: "Medium",
    highYield: true,
    image: "/images/mcq/ct-pancreas-double-duct.jpg",
    imageCaption: "CT Abdomen (Axial view) - Note the double duct sign",
    pyq: { exam: "AIIMS", year: 2023 },
  },
];

type ConfidenceLevel = "guessing" | "unsure" | "sure" | "very-sure" | null;
type QuizMode = "practice" | "results" | "review";

export default function MCQPracticePage() {
  const params = useParams();
  const router = useRouter();
  const { trackMCQAttempt } = useAnalytics();
  
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [confidences, setConfidences] = useState<ConfidenceLevel[]>(new Array(questions.length).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showExplanation, setShowExplanation] = useState(false);
  const [mode, setMode] = useState<QuizMode>("practice");
  const [trackedQuestions, setTrackedQuestions] = useState<Set<number>>(new Set());
  
  // Timer
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const questionStartTime = useRef(Date.now());
  
  // Settings
  const [showConfidenceSelector, setShowConfidenceSelector] = useState(true);
  const [instantFeedback, setInstantFeedback] = useState(false);
  
  const question = questions[currentQuestion];
  
  // Timer effect
  useEffect(() => {
    if (mode === "practice" && isTimerRunning) {
      const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isTimerRunning]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Handlers
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
    
    // Track this attempt if not already tracked
    if (!trackedQuestions.has(currentQuestion)) {
      const timeSpent = Math.round((Date.now() - questionStartTime.current) / 1000);
      const confidence = confidences[currentQuestion] || 'unsure';
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      trackMCQAttempt({
        questionId: question.id.toString(),
        topicId: question.topic.toLowerCase().replace(/\s+/g, '-'),
        topicName: question.topic,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        confidence,
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
      questionStartTime.current = Date.now(); // Reset timer for next question
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
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setConfidences(new Array(questions.length).fill(null));
    setFlagged(new Array(questions.length).fill(false));
    setShowExplanation(false);
    setMode("practice");
    setTimeElapsed(0);
    setIsTimerRunning(true);
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
  
  // Calculate results
  const attempted = answers.filter(a => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].correctAnswer).length;
  const incorrect = attempted - correct;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  
  // Calibration calculation
  const calibrationData = confidences.reduce((acc, conf, i) => {
    if (conf && answers[i] !== null) {
      const isCorrect = answers[i] === questions[i].correctAnswer;
      if (!acc[conf]) acc[conf] = { correct: 0, total: 0 };
      acc[conf].total++;
      if (isCorrect) acc[conf].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);
  
  const confidenceConfig: Record<string, { label: string; color: string; expected: number }> = {
    "guessing": { label: "Guessing", color: "#EF4444", expected: 25 },
    "unsure": { label: "Unsure", color: "#F59E0B", expected: 50 },
    "sure": { label: "Sure", color: "#06B6D4", expected: 75 },
    "very-sure": { label: "Very Sure", color: "#059669", expected: 95 },
  };

  // Results Screen
  if (mode === "results") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(139,92,246,0.1)] p-8 text-center border-b border-[rgba(6,182,212,0.1)]">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${
              accuracy >= 80 ? 'bg-[rgba(5,150,105,0.2)] border-[#059669]/30' :
              accuracy >= 60 ? 'bg-[rgba(245,158,11,0.2)] border-[#F59E0B]/30' :
              'bg-[rgba(239,68,68,0.2)] border-[#EF4444]/30'
            }`}>
              <Award className={`w-12 h-12 ${
                accuracy >= 80 ? 'text-[#059669]' :
                accuracy >= 60 ? 'text-[#F59E0B]' :
                'text-[#EF4444]'
              }`} />
            </div>
            <h2 className="text-3xl font-bold text-[#E5E7EB] mb-2">Quiz Complete!</h2>
            <p className="text-[#9CA3AF]">Here's how you performed</p>
          </div>
          
          <CardContent className="p-8">
            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="rgba(6,182,212,0.1)" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke={accuracy >= 80 ? "#059669" : accuracy >= 60 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="12" fill="none" strokeLinecap="round"
                    strokeDasharray={`${(accuracy / 100) * 440} 440`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#E5E7EB]">{accuracy}%</span>
                  <span className="text-sm text-[#9CA3AF]">Accuracy</span>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#142538] text-center">
                <Target className="w-6 h-6 text-[#06B6D4] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#E5E7EB]">{correct}/{questions.length}</p>
                <p className="text-xs text-[#6B7280]">Score</p>
              </div>
              <div className="p-4 rounded-xl bg-[#142538] text-center">
                <CheckCircle className="w-6 h-6 text-[#059669] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#059669]">{correct}</p>
                <p className="text-xs text-[#6B7280]">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-[#142538] text-center">
                <XCircle className="w-6 h-6 text-[#EF4444] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#EF4444]">{incorrect}</p>
                <p className="text-xs text-[#6B7280]">Incorrect</p>
              </div>
              <div className="p-4 rounded-xl bg-[#142538] text-center">
                <Clock className="w-6 h-6 text-[#8B5CF6] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#8B5CF6]">{formatTime(timeElapsed)}</p>
                <p className="text-xs text-[#6B7280]">Time</p>
              </div>
            </div>
            
            {/* Calibration Analysis */}
            {Object.keys(calibrationData).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#8B5CF6]" />
                  Confidence Calibration
                </h3>
                <div className="space-y-3">
                  {Object.entries(calibrationData).map(([level, data]) => {
                    const config = confidenceConfig[level];
                    const actualAccuracy = Math.round((data.correct / data.total) * 100);
                    const isCalibrated = Math.abs(actualAccuracy - config.expected) < 15;
                    
                    return (
                      <div key={level} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-[#9CA3AF]">{config.label}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#6B7280]">{data.total} questions</span>
                            <span style={{ color: config.color }}>{actualAccuracy}% correct</span>
                          </div>
                          <div className="h-2 bg-[#142538] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ width: `${actualAccuracy}%`, backgroundColor: config.color }}
                            />
                          </div>
                        </div>
                        {isCalibrated ? (
                          <CheckCircle className="w-4 h-4 text-[#059669]" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-[#6B7280] mt-3">
                  {accuracy >= 80 && Object.values(calibrationData).every((d, i) => {
                    const level = Object.keys(calibrationData)[i];
                    const actual = (d.correct / d.total) * 100;
                    return Math.abs(actual - confidenceConfig[level].expected) < 15;
                  }) 
                    ? "✨ Excellent calibration! Your confidence matches your accuracy."
                    : "💡 Tip: Notice where your confidence doesn't match your accuracy to improve metacognition."
                  }
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleRestart} className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              {incorrect > 0 && (
                <Button onClick={handleReviewMistakes} variant="outline" className="flex-1 border-[rgba(6,182,212,0.15)] text-[#9CA3AF]">
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

  // Practice/Review Screen
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[#E5E7EB]">Gastric Cancer MCQs</h1>
          <p className="text-[#9CA3AF]">Surgical GI - {questions.length} Questions</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            timeElapsed > 600 ? 'bg-[rgba(239,68,68,0.2)] text-[#EF4444]' : 'bg-[#0F2233] border border-[rgba(6,182,212,0.15)] text-[#E5E7EB]'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeElapsed)}</span>
          </div>
          
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-[#9CA3AF]">
            <span>{currentQuestion + 1}/{questions.length}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-6" />
      
      {/* Question Navigator */}
      <div className="flex gap-2 flex-wrap mb-6">
        {questions.map((q, i) => {
          const isCorrect = answers[i] !== null && answers[i] === q.correctAnswer;
          const isWrong = answers[i] !== null && answers[i] !== q.correctAnswer;
          const isCurrent = i === currentQuestion;
          
          return (
            <button
              key={i}
              onClick={() => handleGoToQuestion(i)}
              className={`w-10 h-10 rounded-lg font-medium transition-all relative ${
                isCurrent ? 'bg-[#06B6D4] text-[#0D1B2A] ring-2 ring-[#06B6D4]/50' :
                isCorrect ? 'bg-[rgba(5,150,105,0.2)] text-[#059669] border border-[rgba(5,150,105,0.3)]' :
                isWrong ? 'bg-[rgba(239,68,68,0.2)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]' :
                'bg-[#0F2233] text-[#9CA3AF] border border-[rgba(6,182,212,0.15)] hover:border-[#06B6D4]'
              } ${flagged[i] ? 'ring-2 ring-[#F59E0B]' : ''}`}
            >
              {i + 1}
              {q.highYield && (
                <Zap className="absolute -top-1 -right-1 w-3 h-3 text-[#F59E0B]" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Question Card */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] border-l-4 border-l-[#06B6D4] mb-6">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border-none">{question.topic}</Badge>
              <Badge className={
                question.difficulty === "Easy" ? "bg-[rgba(5,150,105,0.15)] text-[#059669] border-none" :
                question.difficulty === "Medium" ? "bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-none" :
                "bg-[rgba(239,68,68,0.15)] text-[#EF4444] border-none"
              }>{question.difficulty}</Badge>
              {question.highYield && (
                <Badge className="bg-[rgba(245,158,11,0.2)] text-[#F59E0B] border-none">
                  <Zap className="w-3 h-3 mr-1" />
                  High Yield
                </Badge>
              )}
              {question.pyq && (
                <Badge className="bg-[rgba(139,92,246,0.2)] text-[#8B5CF6] border-none">
                  📋 {question.pyq.exam} {question.pyq.year}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFlag}
              className={flagged[currentQuestion] ? "text-[#F59E0B]" : "text-[#6B7280] hover:text-[#F59E0B]"}
            >
              <Flag className="w-5 h-5" fill={flagged[currentQuestion] ? "#F59E0B" : "none"} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question Image (if present) */}
          {question.image && (
            <div className="rounded-lg overflow-hidden border border-[rgba(6,182,212,0.15)]">
              <img 
                src={question.image} 
                alt={question.imageCaption || "Clinical image"} 
                className="w-full max-h-80 object-contain bg-[#0D1B2A]"
              />
              {question.imageCaption && (
                <p className="text-xs text-[#6B7280] text-center py-2 bg-[#142538]">
                  {question.imageCaption}
                </p>
              )}
            </div>
          )}
          
          {/* Question Text */}
          <p className="text-lg text-[#E5E7EB] leading-relaxed">{question.question}</p>
          
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              const showResult = showExplanation;
              
              let optionStyle = "bg-[#142538] border-[rgba(6,182,212,0.1)]";
              if (showResult) {
                if (isCorrectOption) {
                  optionStyle = "bg-[rgba(5,150,105,0.15)] border-[#059669] ring-2 ring-[#059669]/30";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = "bg-[rgba(239,68,68,0.15)] border-[#EF4444] ring-2 ring-[#EF4444]/30";
                }
              } else if (isSelected) {
                optionStyle = "bg-[rgba(6,182,212,0.15)] border-[#06B6D4]";
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${optionStyle} ${
                    !showExplanation ? 'hover:border-[#06B6D4] hover:bg-[rgba(6,182,212,0.1)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      showResult && isCorrectOption ? 'bg-[#059669] text-white' :
                      showResult && isSelected && !isCorrectOption ? 'bg-[#EF4444] text-white' :
                      isSelected ? 'bg-[#06B6D4] text-[#0D1B2A]' :
                      'bg-[#0F2233] text-[#9CA3AF]'
                    }`}>
                      {showResult && isCorrectOption ? <CheckCircle className="w-4 h-4" /> :
                       showResult && isSelected && !isCorrectOption ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-[#E5E7EB] ${showResult && isCorrectOption ? 'font-medium text-[#059669]' : ''}`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Confidence Selector */}
          {showConfidenceSelector && !showExplanation && selectedAnswer !== null && (
            <div className="p-4 rounded-lg bg-[#142538] border border-[rgba(6,182,212,0.1)]">
              <p className="text-sm text-[#9CA3AF] mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                How confident are you?
              </p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(confidenceConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={confidences[currentQuestion] === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectConfidence(key as ConfidenceLevel)}
                    className={confidences[currentQuestion] === key 
                      ? `text-white` 
                      : `border-[rgba(6,182,212,0.15)] text-[#9CA3AF]`
                    }
                    style={confidences[currentQuestion] === key ? { backgroundColor: config.color } : {}}
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
                <div className="p-2 rounded-lg bg-[#0F2233] shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-[#F59E0B]">Explanation</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8B5CF6] hover:text-[#A78BFA] hover:bg-[#8B5CF6]/10 gap-1"
                      onClick={() => {
                        // TODO: Integrate ElevenLabs TTS
                        alert("Voice explanation coming soon! 🔊");
                      }}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">Listen</span>
                    </Button>
                  </div>
                  <div className="text-[#9CA3AF] leading-relaxed whitespace-pre-line text-sm">
                    {question.explanation.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <p key={i} className="font-semibold text-[#E5E7EB] mt-3 mb-2">{line.slice(2, -2)}</p>;
                      }
                      if (line.startsWith("• ")) {
                        return <li key={i} className="ml-4 my-1">{line.slice(2)}</li>;
                      }
                      if (line.includes("|")) return null; // Tables need special handling
                      return line ? <p key={i} className="my-1">{line}</p> : <br key={i} />;
                    })}
                  </div>
                </div>
              </div>
              
              {/* Reference */}
              <div className="flex items-center gap-2 pt-3 border-t border-[rgba(245,158,11,0.2)] text-xs">
                <BookOpen className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-[#06B6D4] font-medium">{question.reference.book}</span>
                <span className="text-[#6B7280]">• {question.reference.chapter}</span>
                <span className="text-[#6B7280]">• p. {question.reference.page}</span>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(6,182,212,0.1)]">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="border-[rgba(6,182,212,0.15)] text-[#9CA3AF]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {!showExplanation && selectedAnswer !== null && (
                <Button onClick={handleSubmitAnswer} className="bg-[#059669] hover:bg-[#047857] text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              )}
              <Button onClick={handleNextQuestion} className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]">
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ATOM Help */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#E5E7EB]">Stuck on this question?</p>
              <p className="text-xs text-[#6B7280]">Ask ATOM for hints or detailed explanations</p>
            </div>
            <Link href={`/chat?question=${question.id}`}>
              <Button variant="outline" size="sm" className="border-[rgba(6,182,212,0.15)] text-[#06B6D4]">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask ATOM
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
