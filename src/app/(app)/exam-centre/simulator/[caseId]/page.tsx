'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users,
  ClipboardList,
  Stethoscope,
  Microscope,
  Pill,
  ChevronRight,
  ChevronLeft,
  Clock,
  DollarSign,
  CircleCheck,
  XCircle,
  BookOpen,
  Lightbulb,
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Brain,
  Bone,
  Eye,
  Timer,
  Award,
  TrendingUp,
  RotateCcw,
  Home,
  Loader2,
} from 'lucide-react';
import { getCaseById } from '@/lib/data/cases/acute-appendicitis';
import { useExamCentreSimulatorResult } from '@/lib/api/hooks';
import type {
  CaseData,
  SimulatorStep,
  SimulatorState,
  HistoryQuestion,
  ExaminationFinding,
  Investigation,
  InvestigationProgress,
  ManagementOption,
} from '@/lib/types/simulator';

// Step configuration
const STEPS: { id: SimulatorStep; label: string; icon: React.ElementType }[] = [
  { id: 'presentation', label: 'Case Presentation', icon: Users },
  { id: 'history', label: 'History Taking', icon: ClipboardList },
  { id: 'examination', label: 'Physical Examination', icon: Stethoscope },
  { id: 'investigations', label: 'Investigations', icon: Microscope },
  { id: 'management', label: 'Management', icon: Pill },
];

const STEP_INDEX: Record<SimulatorStep, number> = {
  presentation: 0,
  history: 1,
  examination: 2,
  investigations: 3,
  management: 4,
};

// History categories
const HISTORY_CATEGORIES = [
  { id: 'chief_complaint', label: 'Chief Complaint', color: 'text-[#EAA0A0]' },
  { id: 'history_of_presenting_illness', label: 'HPI', color: 'text-[#D8BE90]' },
  { id: 'past_history', label: 'Past History', color: 'text-[#8FD5D5]' },
  { id: 'family_history', label: 'Family History', color: 'text-[#C9A86C]' },
  { id: 'personal_history', label: 'Personal History', color: 'text-[#A8C9C2]' },
  { id: 'drug_history', label: 'Drug History', color: 'text-[#8FD5D5]' },
];

// Examination systems
const EXAM_SYSTEMS = [
  { id: 'general', label: 'General', icon: Eye, color: 'text-[#A0B0BC]' },
  { id: 'abdomen', label: 'Abdomen', icon: Activity, color: 'text-[#8FD5D5]' },
  { id: 'cardiovascular', label: 'Cardiovascular', icon: Heart, color: 'text-[#EAA0A0]' },
  { id: 'respiratory', label: 'Respiratory', icon: Wind, color: 'text-[#8FD5D5]' },
  { id: 'neurological', label: 'Neurological', icon: Brain, color: 'text-[#C9A86C]' },
  { id: 'musculoskeletal', label: 'Musculoskeletal', icon: Bone, color: 'text-[#D8BE90]' },
];

// Investigation categories
const INVESTIGATION_CATEGORIES = [
  { id: 'laboratory', label: 'Laboratory', color: 'text-[#8FD5D5]' },
  { id: 'imaging', label: 'Imaging', color: 'text-[#8FD5D5]' },
  { id: 'special', label: 'Special Tests', color: 'text-[#C9A86C]' },
];

export default function PatientSimulatorPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  // Case data
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulator state
  const [state, setState] = useState<SimulatorState>({
    currentStep: 'presentation',
    askedQuestions: [],
    examinedAreas: [],
    orderedInvestigations: [],
    completedInvestigations: [],
    selectedDiagnosis: null,
    selectedManagement: [],
    score: {
      history: 0,
      examination: 0,
      investigations: 0,
      diagnosis: 0,
      management: 0,
      penalties: 0,
      total: 0,
    },
    timeSpent: 0,
    isComplete: false,
  });

  // Investigation progress tracking
  const [investigationProgress, setInvestigationProgress] = useState<Map<string, InvestigationProgress>>(new Map());

  // UI state
  const [selectedHistoryCategory, setSelectedHistoryCategory] = useState('chief_complaint');
  const [selectedExamSystem, setSelectedExamSystem] = useState('abdomen');
  const [selectedInvCategory, setSelectedInvCategory] = useState('laboratory');
  const [showResults, setShowResults] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSubmitted, setSessionSubmitted] = useState(false);
  const [isSessionBusy, setIsSessionBusy] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const sessionSubmittedRef = useRef(false);
  const actionStartedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    sessionSubmittedRef.current = sessionSubmitted;
  }, [sessionSubmitted]);

  const getElapsedActionSeconds = useCallback(() => {
    const now = Date.now();
    const elapsed = Math.max(1, Math.round((now - actionStartedAtRef.current) / 1000));
    actionStartedAtRef.current = now;
    return elapsed;
  }, []);

  const createExamSession = useCallback(async () => {
    try {
      setIsSessionBusy(true);
      const response = await fetch('/api/exam-centre/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'simulator' }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (typeof data?.id === 'string') {
        setSessionId(data.id);
        setSessionSubmitted(false);
        sessionSubmittedRef.current = false;
        actionStartedAtRef.current = Date.now();
        return true;
      }
    } catch (error) {
      console.warn('Failed to create simulator exam session:', error);
    } finally {
      setIsSessionBusy(false);
    }
    return false;
  }, []);

  useEffect(() => {
    void createExamSession();
  }, [createExamSession]);

  const submitSessionIfNeeded = useCallback(
    async (options?: { notesCreated?: number }) => {
      if (!sessionId || sessionSubmitted) return true;
      setIsSessionBusy(true);
      try {
        const payload: Record<string, unknown> = {
          ended_at: new Date().toISOString(),
        };
        if (typeof options?.notesCreated === 'number' && options.notesCreated >= 0) {
          payload.notes_created = Math.round(options.notesCreated);
        }
        const response = await fetch(`/api/exam-centre/sessions/${sessionId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setSessionSubmitted(true);
          sessionSubmittedRef.current = true;
          return true;
        }
      } catch (error) {
        console.warn('Failed to submit simulator exam session:', error);
      } finally {
        setIsSessionBusy(false);
      }
      return false;
    },
    [sessionId, sessionSubmitted]
  );

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

  const recordSimulatorEvent = useCallback(
    async (params: {
      questionRef: string;
      selectedOptionKey: string;
      isCorrect: boolean;
      confidence?: number;
      metadata?: Record<string, unknown>;
    }) => {
      if (!sessionId || sessionSubmitted) return;

      try {
        await fetch(`/api/exam-centre/sessions/${sessionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_ref: params.questionRef,
            mode: 'simulator',
            selected_option_key: params.selectedOptionKey,
            is_correct: params.isCorrect,
            confidence: params.confidence ?? 3,
            time_taken_seconds: getElapsedActionSeconds(),
            metadata: params.metadata || null,
          }),
        });
      } catch (error) {
        console.warn('Failed to record simulator interaction:', error);
      }
    },
    [getElapsedActionSeconds, sessionId, sessionSubmitted]
  );

  const handleExitToExamCentre = useCallback(async () => {
    await submitSessionIfNeeded({ notesCreated: state.selectedManagement.length });
    router.push('/exam-centre');
  }, [router, state.selectedManagement.length, submitSessionIfNeeded]);

  const { data: simulatorResult } = useExamCentreSimulatorResult(sessionId || undefined);
  const simulatorSnapshot = simulatorResult?.snapshot;

  // Timer
  useEffect(() => {
    if (!state.isComplete) {
      const timer = setInterval(() => {
        setState(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.isComplete]);

  // Load case data
  useEffect(() => {
    const data = getCaseById(caseId);
    if (data) {
      setCaseData(data);
    }
    setLoading(false);
  }, [caseId]);

  // Investigation timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setInvestigationProgress(prev => {
        const newProgress = new Map(prev);
        let hasUpdates = false;

        newProgress.forEach((inv, id) => {
          if (inv.status === 'processing') {
            const investigation = caseData?.investigations.find(i => i.id === id);
            if (investigation) {
              const elapsed = (Date.now() - inv.startTime) / 1000;
              const progress = Math.min(100, (elapsed / investigation.waitTime) * 100);

              if (progress >= 100) {
                newProgress.set(id, { ...inv, status: 'complete', progress: 100 });
                setState(prev => ({
                  ...prev,
                  completedInvestigations: [...prev.completedInvestigations, id],
                }));
                hasUpdates = true;
              } else {
                newProgress.set(id, { ...inv, progress });
                hasUpdates = true;
              }
            }
          }
        });

        return hasUpdates ? newProgress : prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [caseData]);

  // Calculate total score
  const calculateTotalScore = useCallback(() => {
    const { history, examination, investigations, diagnosis, management, penalties } = state.score;
    return history + examination + investigations + diagnosis + management - penalties;
  }, [state.score]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get total cost of ordered investigations
  const getTotalCost = () => {
    if (!caseData) return 0;
    return state.orderedInvestigations.reduce((total, id) => {
      const inv = caseData.investigations.find(i => i.id === id);
      return total + (inv?.cost || 0);
    }, 0);
  };

  // Handle asking a history question
  const handleAskQuestion = (question: HistoryQuestion) => {
    if (state.askedQuestions.includes(question.id)) return;

    setState(prev => ({
      ...prev,
      askedQuestions: [...prev.askedQuestions, question.id],
      score: {
        ...prev.score,
        history: prev.score.history + question.points,
      },
    }));

    void recordSimulatorEvent({
      questionRef: `${caseId}:history:${question.id}`,
      selectedOptionKey: 'asked',
      isCorrect: question.isRelevant,
      confidence: question.isRelevant ? 4 : 2,
    });
  };

  // Handle examining an area
  const handleExamine = (finding: ExaminationFinding) => {
    if (state.examinedAreas.includes(finding.id)) return;

    setState(prev => ({
      ...prev,
      examinedAreas: [...prev.examinedAreas, finding.id],
      score: {
        ...prev.score,
        examination: prev.score.examination + finding.points,
      },
    }));

    void recordSimulatorEvent({
      questionRef: `${caseId}:examination:${finding.id}`,
      selectedOptionKey: 'examined',
      isCorrect: finding.isPositive || finding.points > 0,
      confidence: finding.isClassic ? 4 : 3,
    });
  };

  // Handle ordering an investigation
  const handleOrderInvestigation = (investigation: Investigation) => {
    if (state.orderedInvestigations.includes(investigation.id)) return;

    // Add penalty for unnecessary tests
    const penalty = investigation.isUnnecessary ? (investigation.penaltyIfUnnecessary || 0) : 0;

    setState(prev => ({
      ...prev,
      orderedInvestigations: [...prev.orderedInvestigations, investigation.id],
      score: {
        ...prev.score,
        investigations: prev.score.investigations + investigation.points,
        penalties: prev.score.penalties + penalty,
      },
    }));

    // Start investigation timer
    setInvestigationProgress(prev => {
      const newProgress = new Map(prev);
      newProgress.set(investigation.id, {
        id: investigation.id,
        status: 'processing',
        progress: 0,
        startTime: Date.now(),
      });
      return newProgress;
    });

    void recordSimulatorEvent({
      questionRef: `${caseId}:investigation:${investigation.id}`,
      selectedOptionKey: 'ordered',
      isCorrect: investigation.isEssential && !investigation.isUnnecessary,
      confidence: investigation.isEssential ? 4 : 2,
    });
  };

  // Handle selecting diagnosis
  const handleSelectDiagnosis = (diagnosisId: string) => {
    if (!caseData) return;

    const primaryCorrect = diagnosisId === caseData.diagnosis.primary.id;
    const differential = caseData.diagnosis.differentials.find(d => d.id === diagnosisId);

    let points = 0;
    if (primaryCorrect) {
      points = caseData.scoring.diagnosisPoints;
    } else if (differential?.partialCredit) {
      points = differential.partialCredit;
    }

    setState(prev => ({
      ...prev,
      selectedDiagnosis: diagnosisId,
      score: {
        ...prev.score,
        diagnosis: points,
      },
    }));

    void recordSimulatorEvent({
      questionRef: `${caseId}:diagnosis`,
      selectedOptionKey: diagnosisId,
      isCorrect: primaryCorrect,
      confidence: primaryCorrect ? 4 : 2,
    });
  };

  // Handle selecting management
  const handleSelectManagement = (option: ManagementOption) => {
    if (state.selectedManagement.includes(option.id)) {
      // Deselect
      setState(prev => ({
        ...prev,
        selectedManagement: prev.selectedManagement.filter(id => id !== option.id),
        score: {
          ...prev.score,
          management: prev.score.management - option.points,
          penalties: prev.score.penalties - (option.penalty || 0),
        },
      }));
    } else {
      // Select
      setState(prev => ({
        ...prev,
        selectedManagement: [...prev.selectedManagement, option.id],
        score: {
          ...prev.score,
          management: prev.score.management + option.points,
          penalties: prev.score.penalties + (option.penalty || 0),
        },
      }));

      void recordSimulatorEvent({
        questionRef: `${caseId}:management:${option.id}`,
        selectedOptionKey: 'selected',
        isCorrect: option.isCorrect && !option.isHarmful,
        confidence: option.isCorrect ? 4 : 2,
      });
    }
  };

  // Handle step navigation
  const goToStep = (step: SimulatorStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const goToNextStep = () => {
    const currentIndex = STEP_INDEX[state.currentStep];
    if (currentIndex < STEPS.length - 1) {
      setState(prev => ({ ...prev, currentStep: STEPS[currentIndex + 1].id }));
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = STEP_INDEX[state.currentStep];
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, currentStep: STEPS[currentIndex - 1].id }));
    }
  };

  // Complete simulation
  const completeSimulation = () => {
    setState(prev => ({ ...prev, isComplete: true }));
    setShowResults(true);
    void submitSessionIfNeeded({ notesCreated: state.selectedManagement.length });
  };

  // Reset simulation
  const resetSimulation = () => {
    setState({
      currentStep: 'presentation',
      askedQuestions: [],
      examinedAreas: [],
      orderedInvestigations: [],
      completedInvestigations: [],
      selectedDiagnosis: null,
      selectedManagement: [],
      score: {
        history: 0,
        examination: 0,
        investigations: 0,
        diagnosis: 0,
        management: 0,
        penalties: 0,
        total: 0,
      },
      timeSpent: 0,
      isComplete: false,
    });
    setInvestigationProgress(new Map());
    setShowResults(false);
    actionStartedAtRef.current = Date.now();

    const rotateSession = async () => {
      await submitSessionIfNeeded({ notesCreated: state.selectedManagement.length });
      await createExamSession();
    };
    void rotateSession();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8FD5D5]" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="h-16 w-16 text-[#EAA0A0]" />
        <h2 className="text-xl font-semibold text-[#E8E0D5]">Case Not Found</h2>
        <p className="text-[#A0B0BC]">The requested case could not be loaded.</p>
        <Button
          onClick={() => {
            void handleExitToExamCentre();
          }}
          className="mt-4"
          disabled={isSessionBusy}
        >
          <Home className="h-4 w-4 mr-2" /> Back to Exam Centre
        </Button>
      </div>
    );
  }

  const currentStepIndex = STEP_INDEX[state.currentStep];
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;
  const totalScore = calculateTotalScore();
  const localScorePercent =
    caseData.scoring.totalMaxPoints > 0
      ? Math.round((totalScore / caseData.scoring.totalMaxPoints) * 100)
      : 0;
  const hasSimulatorSnapshot = typeof simulatorSnapshot?.scorePercent === 'number';
  const displayScorePercent = hasSimulatorSnapshot ? simulatorSnapshot.scorePercent : localScorePercent;
  const scoreHeadline = hasSimulatorSnapshot ? `${displayScorePercent}%` : `${totalScore}`;
  const scoreSubline = hasSimulatorSnapshot
    ? `${simulatorSnapshot.successfulActions}/${simulatorSnapshot.attemptedActions} successful actions`
    : `/ ${caseData.scoring.totalMaxPoints} max`;
  const gradeMeta = (() => {
    const grade = simulatorSnapshot?.grade?.toLowerCase();
    if (grade === 'excellent') {
      return {
        label: 'Excellent',
        className: 'bg-[#5BB3B3]/16 text-[#9FC3BC]',
      };
    }
    if (grade === 'good') {
      return {
        label: 'Good',
        className: 'bg-[#5BB3B3]/12 text-[#8FD5D5]',
      };
    }
    if (grade === 'developing') {
      return {
        label: 'Developing',
        className: 'bg-[#C9A86C]/16 text-[#D8BE90]',
      };
    }
    if (grade === 'at-risk') {
      return {
        label: 'At Risk',
        className: 'bg-[#E57373]/18 text-[#EAB7B7]',
      };
    }

    if (totalScore >= caseData.scoring.excellentScore) {
      return {
        label: 'Excellent',
        className: 'bg-[#5BB3B3]/16 text-[#9FC3BC]',
      };
    }
    if (totalScore >= caseData.scoring.passingScore) {
      return {
        label: 'Passed',
        className: 'bg-[#C9A86C]/16 text-[#D8BE90]',
      };
    }
    return {
      label: 'Needs Improvement',
      className: 'bg-[#E57373]/18 text-[#EAB7B7]',
    };
  })();

  return (
    <div className="ui-shell">
      <div className="ui-page space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5] flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-[#8FD5D5]" />
            Patient Simulator
          </h1>
          <p className="text-[#A0B0BC] mt-1">{caseData.title} • {caseData.subject}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(state.timeSpent)}
          </Badge>
          <Badge variant="outline" className="bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28">
            <TrendingUp className="h-3 w-3 mr-1" />
            Score: {totalScore}
          </Badge>
          <Badge variant="outline" className={`${caseData.difficulty === 'hard' ? 'bg-[#E57373]/18 text-[#EAB7B7] border-[#E57373]/28' :
              caseData.difficulty === 'medium' ? 'bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28' :
                'bg-[#7BA69E]/16 text-[#A8C9C2] border-[#7BA69E]/28'
            }`}>
            {caseData.difficulty.charAt(0).toUpperCase() + caseData.difficulty.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between overflow-x-auto pb-1">
            {STEPS.map((step, index) => {
              const isActive = step.id === state.currentStep;
              const isCompleted = index < currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex min-w-[9.5rem] flex-1 items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isActive
                        ? 'bg-[#5BB3B3]/16 text-[#8FD5D5]'
                        : isCompleted
                          ? 'text-[#8FD5D5] hover:bg-[#5BB3B3]/10'
                          : 'text-[#6B7A88] hover:text-[#A0B0BC]'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive
                        ? 'bg-[#5BB3B3]/28'
                        : isCompleted
                          ? 'bg-[#5BB3B3]/16'
                          : 'bg-[#253545]'
                      }`}>
                      {isCompleted ? (
                        <CircleCheck className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{step.label}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-[#5BB3B3]' : 'bg-[#253545]'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progressPercent} className="h-1 bg-[#253545]" />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Left Panel - Main Interaction */}
        <div className="space-y-4 xl:col-span-2">
          {/* Step Content */}
          {state.currentStep === 'presentation' && (
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#8FD5D5]" />
                  Case Presentation
                </CardTitle>
                <CardDescription>
                  Read the clinical scenario carefully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Patient Info */}
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#5BB3B3]/16 flex items-center justify-center">
                      <Users className="h-8 w-8 text-[#8FD5D5]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#E8E0D5] text-lg">
                        {caseData.patient.age}-year-old {caseData.patient.gender === 'male' ? 'Male' : 'Female'}
                      </h3>
                      <p className="text-[#A0B0BC]">{caseData.patient.occupation}</p>
                      <Badge className="mt-1 bg-[#5BB3B3]/16 text-[#9FC3BC]">
                        {caseData.patient.setting}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#C9A86C] pl-4 py-2 bg-[#C9A86C]/10 rounded-r-lg">
                    <p className="text-[#D8BE90] font-medium">Chief Complaint</p>
                    <p className="text-[#E8E0D5] mt-1">{caseData.presentation.chiefComplaint}</p>
                  </div>
                </div>

                {/* Scenario */}
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <h4 className="font-medium text-[#E8E0D5] mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#A0B0BC]" />
                    Clinical Scenario
                  </h4>
                  <p className="text-[#C9D2DA] leading-relaxed">
                    {caseData.presentation.scenario}
                  </p>
                </div>

                {/* Vitals */}
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <h4 className="font-medium text-[#E8E0D5] mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#EAA0A0]" />
                    Vital Signs
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                    <div className="p-3 rounded-lg bg-[#E57373]/10 text-center">
                      <Heart className="h-5 w-5 text-[#EAA0A0] mx-auto mb-1" />
                      <p className="text-xs text-[#A0B0BC]">Pulse</p>
                      <p className="text-sm font-medium text-[#E8E0D5]">{caseData.presentation.vitals.pulse}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#5BB3B3]/10 text-center">
                      <Activity className="h-5 w-5 text-[#8FD5D5] mx-auto mb-1" />
                      <p className="text-xs text-[#A0B0BC]">BP</p>
                      <p className="text-sm font-medium text-[#E8E0D5]">{caseData.presentation.vitals.bp}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#C9A86C]/10 text-center">
                      <Thermometer className="h-5 w-5 text-[#D8BE90] mx-auto mb-1" />
                      <p className="text-xs text-[#A0B0BC]">Temp</p>
                      <p className="text-sm font-medium text-[#E8E0D5]">{caseData.presentation.vitals.temperature}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#5BB3B3]/10 text-center">
                      <Wind className="h-5 w-5 text-[#8FD5D5] mx-auto mb-1" />
                      <p className="text-xs text-[#A0B0BC]">RR</p>
                      <p className="text-sm font-medium text-[#E8E0D5]">{caseData.presentation.vitals.respiratory_rate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#5BB3B3]/10 text-center">
                      <Droplets className="h-5 w-5 text-[#8FD5D5] mx-auto mb-1" />
                      <p className="text-xs text-[#A0B0BC]">SpO2</p>
                      <p className="text-sm font-medium text-[#E8E0D5]">{caseData.presentation.vitals.spo2}</p>
                    </div>
                  </div>
                </div>

                {/* General Appearance */}
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <h4 className="font-medium text-[#E8E0D5] mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#C9A86C]" />
                    General Appearance
                  </h4>
                  <p className="text-[#C9D2DA]">{caseData.presentation.generalAppearance}</p>
                </div>

                <Button
                  className="w-full bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28"
                  onClick={goToNextStep}
                >
                  Proceed to History Taking <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}

          {state.currentStep === 'history' && (
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#D8BE90]" />
                  History Taking
                </CardTitle>
                <CardDescription>
                  Click on questions to ask the patient. Relevant questions earn more points.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                  {HISTORY_CATEGORIES.map(cat => {
                    const questionsInCat = caseData.history.filter(q => q.category === cat.id);
                    const answeredInCat = questionsInCat.filter(q => state.askedQuestions.includes(q.id)).length;

                    return (
                      <Button
                        key={cat.id}
                        variant={selectedHistoryCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedHistoryCategory(cat.id)}
                        className={selectedHistoryCategory === cat.id
                          ? 'bg-[#C9A86C]/16 text-[#D8BE90] hover:bg-[#C9A86C]/28 border-[#C9A86C]/28'
                          : 'border-[rgba(91,179,179,0.18)] text-[#A0B0BC] hover:text-[#C9D2DA]'
                        }
                      >
                        {cat.label}
                        <Badge className="ml-2 bg-[#253545] text-[#C9D2DA]" variant="secondary">
                          {answeredInCat}/{questionsInCat.length}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>

                {/* Questions */}
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {caseData.history
                      .filter(q => q.category === selectedHistoryCategory)
                      .map(question => {
                        const isAsked = state.askedQuestions.includes(question.id);

                        return (
                          <div
                            key={question.id}
                            className={`p-4 rounded-lg border transition-all ${isAsked
                                ? 'bg-[#2D3E50] border-[#5BB3B3]/28'
                                : 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[#C9A86C]/40 cursor-pointer'
                              }`}
                            onClick={() => !isAsked && handleAskQuestion(question)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className={`font-medium ${isAsked ? 'text-[#8FD5D5]' : 'text-[#E8E0D5]'}`}>
                                  {isAsked ? '✓ ' : ''}{question.question}
                                </p>
                                {isAsked && (
                                  <div className="mt-2 p-3 rounded bg-[#253545]/60 border-l-2 border-[#C9A86C]">
                                    <p className="text-[#C9D2DA] text-sm italic">&quot;{question.answer}&quot;</p>
                                  </div>
                                )}
                              </div>
                              {!isAsked && (
                                <Badge className={`shrink-0 ${question.isRelevant
                                    ? 'bg-[#5BB3B3]/16 text-[#9FC3BC]'
                                    : 'bg-[#253545]/35 text-[#A0B0BC]'
                                  }`}>
                                  +{question.points}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button
                    className="bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28"
                    onClick={goToNextStep}
                  >
                    Proceed to Examination <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state.currentStep === 'examination' && (
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-[#8FD5D5]" />
                  Physical Examination
                </CardTitle>
                <CardDescription>
                  Select body systems to examine. Classic signs earn bonus points.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Tabs */}
                <div className="flex flex-wrap gap-2">
                  {EXAM_SYSTEMS.map(sys => {
                    const findingsInSys = caseData.examination.filter(f => f.system === sys.id);
                    const examinedInSys = findingsInSys.filter(f => state.examinedAreas.includes(f.id)).length;
                    const SysIcon = sys.icon;

                    return (
                      <Button
                        key={sys.id}
                        variant={selectedExamSystem === sys.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedExamSystem(sys.id)}
                        className={selectedExamSystem === sys.id
                          ? 'bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28 border-[#5BB3B3]/28'
                          : 'border-[rgba(91,179,179,0.18)] text-[#A0B0BC] hover:text-[#C9D2DA]'
                        }
                      >
                        <SysIcon className={`h-4 w-4 mr-1 ${sys.color}`} />
                        {sys.label}
                        <Badge className="ml-2 bg-[#253545] text-[#C9D2DA]" variant="secondary">
                          {examinedInSys}/{findingsInSys.length}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>

                {/* Findings */}
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {caseData.examination
                      .filter(f => f.system === selectedExamSystem)
                      .map(finding => {
                        const isExamined = state.examinedAreas.includes(finding.id);

                        return (
                          <div
                            key={finding.id}
                            className={`p-4 rounded-lg border transition-all ${isExamined
                                ? 'bg-[#2D3E50] border-[#5BB3B3]/28'
                                : 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/40 cursor-pointer'
                              }`}
                            onClick={() => !isExamined && handleExamine(finding)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isExamined ? 'text-[#8FD5D5]' : 'text-[#E8E0D5]'}`}>
                                    {isExamined ? '✓ ' : ''}{finding.area}
                                  </p>
                                  {finding.isClassic && (
                                    <Badge className="bg-[#C9A86C]/16 text-[#D8BE90] text-xs">
                                      Classic Sign
                                    </Badge>
                                  )}
                                </div>
                                {isExamined && (
                                  <div className="mt-2 p-3 rounded bg-[#253545]/60">
                                    <p className={`text-sm ${finding.isPositive ? 'text-[#D8BE90]' : 'text-[#A0B0BC]'
                                      }`}>
                                      {finding.finding}
                                    </p>
                                    {finding.textbookRef && (
                                      <p className="text-xs text-[#8FD5D5] mt-2 flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {finding.textbookRef}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              {!isExamined && (
                                <Badge className="shrink-0 bg-[#5BB3B3]/16 text-[#9FC3BC]">
                                  +{finding.points}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button
                    className="bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28"
                    onClick={goToNextStep}
                  >
                    Proceed to Investigations <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state.currentStep === 'investigations' && (
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-[#8FD5D5]" />
                  Investigations
                </CardTitle>
                <CardDescription>
                  Order tests wisely. Unnecessary tests incur penalties. Results appear after processing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Warning */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/16">
                  <div className="flex items-center gap-2 text-[#D8BE90]">
                    <DollarSign className="h-5 w-5" />
                    <span>Total Investigation Cost: ₹{getTotalCost().toLocaleString()}</span>
                  </div>
                  <Badge className="bg-[#C9A86C]/16 text-[#D8BE90]">
                    {state.orderedInvestigations.length} tests ordered
                  </Badge>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2">
                  {INVESTIGATION_CATEGORIES.map(cat => {
                    const testsInCat = caseData.investigations.filter(i => i.category === cat.id);
                    const orderedInCat = testsInCat.filter(i => state.orderedInvestigations.includes(i.id)).length;

                    return (
                      <Button
                        key={cat.id}
                        variant={selectedInvCategory === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedInvCategory(cat.id)}
                        className={selectedInvCategory === cat.id
                          ? 'bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28 border-[#5BB3B3]/28'
                          : 'border-[rgba(91,179,179,0.18)] text-[#A0B0BC] hover:text-[#C9D2DA]'
                        }
                      >
                        {cat.label}
                        <Badge className="ml-2 bg-[#253545] text-[#C9D2DA]" variant="secondary">
                          {orderedInCat}/{testsInCat.length}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>

                {/* Investigations */}
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-2">
                    {caseData.investigations
                      .filter(inv => inv.category === selectedInvCategory)
                      .map(investigation => {
                        const isOrdered = state.orderedInvestigations.includes(investigation.id);
                        const progress = investigationProgress.get(investigation.id);
                        const isComplete = state.completedInvestigations.includes(investigation.id);

                        return (
                          <div
                            key={investigation.id}
                            className={`p-4 rounded-lg border transition-all ${isOrdered
                                ? 'bg-[#2D3E50] border-[#5BB3B3]/28'
                                : 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/40 cursor-pointer'
                              }`}
                            onClick={() => !isOrdered && handleOrderInvestigation(investigation)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isComplete ? 'text-[#8FD5D5]' : isOrdered ? 'text-[#8FD5D5]' : 'text-[#E8E0D5]'}`}>
                                    {isComplete ? '✓ ' : ''}{investigation.name}
                                  </p>
                                  {investigation.isEssential && (
                                    <Badge className="bg-[#5BB3B3]/16 text-[#9FC3BC] text-xs">
                                      Essential
                                    </Badge>
                                  )}
                                  {investigation.isUnnecessary && isOrdered && (
                                    <Badge className="bg-[#E57373]/18 text-[#EAB7B7] text-xs">
                                      Unnecessary
                                    </Badge>
                                  )}
                                </div>

                                {/* Progress bar while processing */}
                                {progress && progress.status === 'processing' && (
                                  <div className="mt-2">
                                    <div className="flex items-center gap-2 text-sm text-[#A0B0BC] mb-1">
                                      <Timer className="h-3 w-3 animate-pulse" />
                                      Processing... {Math.round(progress.progress)}%
                                    </div>
                                    <Progress value={progress.progress} className="h-1 bg-[#253545]" />
                                  </div>
                                )}

                                {/* Results */}
                                {isComplete && (
                                  <div className={`mt-2 p-3 rounded ${investigation.isAbnormal ? 'bg-[#E57373]/10 border border-[#E57373]/18' : 'bg-[#253545]/60'
                                    }`}>
                                    <pre className={`text-sm whitespace-pre-wrap font-mono ${investigation.isAbnormal ? 'text-[#EAB7B7]' : 'text-[#C9D2DA]'
                                      }`}>
                                      {investigation.result}
                                    </pre>
                                    {investigation.normalRange && (
                                      <p className="text-xs text-[#6B7A88] mt-2">
                                        Normal: {investigation.normalRange}
                                      </p>
                                    )}
                                    {investigation.textbookRef && (
                                      <p className="text-xs text-[#8FD5D5] mt-2 flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {investigation.textbookRef}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              {!isOrdered && (
                                <div className="text-right shrink-0">
                                  <p className="text-sm text-[#A0B0BC]">₹{investigation.cost}</p>
                                  <p className="text-xs text-[#6B7A88]">{investigation.waitTime}s wait</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button
                    className="bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28"
                    onClick={goToNextStep}
                  >
                    Proceed to Management <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {state.currentStep === 'management' && (
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-[#C9A86C]" />
                  Diagnosis & Management
                </CardTitle>
                <CardDescription>
                  Make your diagnosis and select appropriate management steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Diagnosis Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-[#E8E0D5] flex items-center gap-2">
                    <Brain className="h-4 w-4 text-[#D8BE90]" />
                    What is your diagnosis?
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {/* Primary diagnosis option */}
                    <div
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${state.selectedDiagnosis === caseData.diagnosis.primary.id
                          ? 'bg-[#5BB3B3]/16 border-[#5BB3B3]/40'
                          : 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/28'
                        }`}
                      onClick={() => handleSelectDiagnosis(caseData.diagnosis.primary.id)}
                    >
                      <p className={`font-medium ${state.selectedDiagnosis === caseData.diagnosis.primary.id ? 'text-[#8FD5D5]' : 'text-[#E8E0D5]'
                        }`}>
                        {state.selectedDiagnosis === caseData.diagnosis.primary.id && '✓ '}
                        {caseData.diagnosis.primary.name}
                      </p>
                    </div>
                    {/* Differentials */}
                    {caseData.diagnosis.differentials.map(diff => (
                      <div
                        key={diff.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${state.selectedDiagnosis === diff.id
                            ? 'bg-[#C9A86C]/16 border-[#C9A86C]/40'
                            : 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[rgba(91,179,179,0.24)]'
                          }`}
                        onClick={() => handleSelectDiagnosis(diff.id)}
                      >
                        <p className={`font-medium ${state.selectedDiagnosis === diff.id ? 'text-[#D8BE90]' : 'text-[#E8E0D5]'
                          }`}>
                          {state.selectedDiagnosis === diff.id && '○ '}
                          {diff.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Management Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-[#E8E0D5] flex items-center gap-2">
                    <Pill className="h-4 w-4 text-[#C9A86C]" />
                    Select management steps (multiple allowed)
                  </h4>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {caseData.management.map(option => {
                        const isSelected = state.selectedManagement.includes(option.id);
                        const typeColors = {
                          immediate: 'text-[#EAA0A0]',
                          definitive: 'text-[#8FD5D5]',
                          supportive: 'text-[#8FD5D5]',
                          wrong: 'text-[#A0B0BC]',
                        };

                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                ? option.isCorrect
                                  ? 'bg-[#5BB3B3]/16 border-[#5BB3B3]/40'
                                  : 'bg-[#E57373]/18 border-[#E57373]/40'
                                : 'bg-[#2D3E50] border-[rgba(91,179,179,0.15)] hover:border-[rgba(91,179,179,0.24)]'
                              }`}
                            onClick={() => handleSelectManagement(option)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isSelected ? (option.isCorrect ? 'text-[#8FD5D5]' : 'text-[#EAA0A0]') : 'text-[#E8E0D5]'}`}>
                                    {isSelected && (option.isCorrect ? '✓ ' : '✗ ')}
                                    {option.action}
                                  </p>
                                  <Badge className={`text-xs ${typeColors[option.type]} bg-transparent`}>
                                    {option.type}
                                  </Badge>
                                </div>
                                {isSelected && (
                                  <p className="text-sm text-[#A0B0BC] mt-1">
                                    {option.explanation}
                                  </p>
                                )}
                              </div>
                              {!isSelected && (
                                <Badge className={`shrink-0 ${option.isCorrect
                                    ? 'bg-[#5BB3B3]/16 text-[#9FC3BC]'
                                    : 'bg-[#253545]/35 text-[#A0B0BC]'
                                  }`}>
                                  {option.isCorrect ? `+${option.points}` : option.penalty ? `-${option.penalty}` : '0'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <Button
                    className="bg-[#C9A86C]/16 text-[#C9A86C] hover:bg-[#C9A86C]/30"
                    onClick={completeSimulation}
                    disabled={!state.selectedDiagnosis || state.selectedManagement.length === 0}
                  >
                    Submit & View Results <CircleCheck className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Score & Info */}
        <div className="space-y-4">
          {/* Live Score */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-[#D8BE90]" />
                Session Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-[#8FD5D5]">{scoreHeadline}</p>
                <p className="text-sm text-[#A0B0BC]">{scoreSubline}</p>
              </div>

              <div className="space-y-2 text-sm">
                {hasSimulatorSnapshot && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#A0B0BC]">Action accuracy</span>
                      <span className="text-[#8FD5D5]">
                        {simulatorSnapshot.accuracyPercent !== null ? `${simulatorSnapshot.accuracyPercent}%` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A0B0BC]">Phase completion</span>
                      <span className="text-[#9FC3BC]">{simulatorSnapshot.phaseCompletionPercent}%</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-[#A0B0BC]">History</span>
                  <span className="text-[#D8BE90]">{state.score.history}/{caseData.scoring.maxHistoryPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0B0BC]">Examination</span>
                  <span className="text-[#8FD5D5]">{state.score.examination}/{caseData.scoring.maxExamPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0B0BC]">Investigations</span>
                  <span className="text-[#8FD5D5]">{state.score.investigations}/{caseData.scoring.maxInvestigationPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0B0BC]">Diagnosis</span>
                  <span className="text-[#C9A86C]">{state.score.diagnosis}/{caseData.scoring.diagnosisPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0B0BC]">Management</span>
                  <span className="text-[#C9A86C]">{state.score.management}/{caseData.scoring.managementPoints}</span>
                </div>
                {state.score.penalties > 0 && (
                  <div className="flex justify-between text-[#EAA0A0]">
                    <span>Penalties</span>
                    <span>-{state.score.penalties}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[rgba(91,179,179,0.15)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A0B0BC]">Grade</span>
                  <Badge className={gradeMeta.className}>{gradeMeta.label}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#8FD5D5]" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A0B0BC]">Questions asked</span>
                <span className="text-[#E8E0D5]">{state.askedQuestions.length}/{caseData.history.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0B0BC]">Areas examined</span>
                <span className="text-[#E8E0D5]">{state.examinedAreas.length}/{caseData.examination.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0B0BC]">Tests ordered</span>
                <span className="text-[#E8E0D5]">{state.orderedInvestigations.length}/{caseData.investigations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0B0BC]">Tests completed</span>
                <span className="text-[#E8E0D5]">{state.completedInvestigations.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Pearls (shown after some progress) */}
          {(state.askedQuestions.length > 3 || state.examinedAreas.length > 3) && (
            <Card className="bg-[#364A5E] border-[#C9A86C]/16">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[#D8BE90]" />
                  Clinical Pearl
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#E0CBA3]/80">
                  {caseData.clinicalPearls[Math.min(
                    Math.floor((state.askedQuestions.length + state.examinedAreas.length) / 4),
                    caseData.clinicalPearls.length - 1
                  )]}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardContent className="p-4 space-y-2">
              <Button
                variant="outline"
                className="w-full border-[rgba(91,179,179,0.18)] text-[#A0B0BC] hover:text-[#C9D2DA]"
                onClick={resetSimulation}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Restart Case
              </Button>
              <Button
                variant="outline"
                className="w-full border-[rgba(91,179,179,0.18)] text-[#A0B0BC] hover:text-[#C9D2DA]"
                onClick={() => {
                  void handleExitToExamCentre();
                }}
                disabled={isSessionBusy}
              >
                <Home className="h-4 w-4 mr-2" /> Exit to Exam Centre
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-6 w-6 text-[#D8BE90]" />
                Simulation Complete!
              </CardTitle>
              <CardDescription>
                Here&apos;s your performance summary for {caseData.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final Score */}
              <div className="text-center py-6 bg-[#2D3E50] rounded-lg">
                <p className="text-6xl font-bold text-[#8FD5D5]">{scoreHeadline}</p>
                <p className="text-[#A0B0BC] mt-1">
                  {hasSimulatorSnapshot
                    ? `${simulatorSnapshot.successfulActions} successful actions out of ${simulatorSnapshot.attemptedActions}`
                    : `out of ${caseData.scoring.totalMaxPoints}`}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Badge className={`${gradeMeta.className} text-lg px-4 py-1`}>
                    {gradeMeta.label}
                  </Badge>
                  {hasSimulatorSnapshot && (
                    <Badge variant="outline" className="bg-[#5BB3B3]/10 text-[#8FD5D5] border-[#5BB3B3]/28">
                      Phase completion {simulatorSnapshot.phaseCompletionPercent}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <p className="text-[#D8BE90] font-medium">History Taking</p>
                  <p className="text-2xl font-bold text-[#E8E0D5]">{state.score.history}</p>
                  <p className="text-sm text-[#A0B0BC]">{state.askedQuestions.length} questions asked</p>
                </div>
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <p className="text-[#8FD5D5] font-medium">Examination</p>
                  <p className="text-2xl font-bold text-[#E8E0D5]">{state.score.examination}</p>
                  <p className="text-sm text-[#A0B0BC]">{state.examinedAreas.length} areas examined</p>
                </div>
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <p className="text-[#8FD5D5] font-medium">Investigations</p>
                  <p className="text-2xl font-bold text-[#E8E0D5]">{state.score.investigations}</p>
                  <p className="text-sm text-[#A0B0BC]">₹{getTotalCost()} spent</p>
                </div>
                <div className="p-4 rounded-lg bg-[#2D3E50]">
                  <p className="text-[#C9A86C] font-medium">Diagnosis</p>
                  <p className="text-2xl font-bold text-[#E8E0D5]">{state.score.diagnosis}</p>
                  <p className="text-sm text-[#A0B0BC]">
                    {state.selectedDiagnosis === caseData.diagnosis.primary.id ? 'Correct!' : 'Partial credit'}
                  </p>
                </div>
              </div>

              {/* Correct Answer */}
              <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16">
                <h4 className="font-medium text-[#9FC3BC] mb-2">Correct Diagnosis</h4>
                <p className="text-[#E8E0D5] font-semibold">{caseData.diagnosis.primary.name}</p>
                <p className="text-sm text-[#C9D2DA] mt-2">{caseData.diagnosis.primary.explanation}</p>
              </div>

              {/* Textbook References */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#E8E0D5] flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#8FD5D5]" />
                  Textbook References
                </h4>
                {caseData.textbookReferences.map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#2D3E50] text-sm">
                    <p className="text-[#8FD5D5] font-medium">{ref.book}</p>
                    <p className="text-[#A0B0BC]">{ref.chapter} {ref.page && `• Page ${ref.page}`}</p>
                    <p className="text-[#C9D2DA] mt-1">{ref.keyPoint}</p>
                  </div>
                ))}
              </div>

              {/* Time */}
              <div className="flex items-center justify-center gap-2 text-[#A0B0BC]">
                <Clock className="h-4 w-4" />
                <span>Time spent: {formatTime(state.timeSpent)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#5BB3B3]/16 text-[#9FC3BC] hover:bg-[#5BB3B3]/28"
                  onClick={resetSimulation}
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Try Again
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    void handleExitToExamCentre();
                  }}
                  disabled={isSessionBusy}
                >
                  Back to Exam Centre
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
