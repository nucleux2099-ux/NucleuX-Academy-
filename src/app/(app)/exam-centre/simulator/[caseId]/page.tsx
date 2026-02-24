'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Stethoscope, Clock, TrendingUp, XCircle, Home, Loader2, RotateCcw, Lightbulb,
} from 'lucide-react';
import { getCaseById } from '@/lib/data/cases/acute-appendicitis';
import {
  StepProgress, CasePresentation, HistoryTaking, PhysicalExam,
  InvestigationPanel, DiagnosisManagement, ScoreCard, ProgressSummary,
  ResultsModal, STEPS, STEP_INDEX, formatTime,
} from '@/components/simulator';
import type { 
  CaseData, SimulatorStep, SimulatorState, HistoryQuestion,
  ExaminationFinding, Investigation, InvestigationProgress, ManagementOption,
} from '@/lib/types/simulator';

export default function PatientSimulatorPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<SimulatorState>({
    currentStep: 'presentation', askedQuestions: [], examinedAreas: [],
    orderedInvestigations: [], completedInvestigations: [], selectedDiagnosis: null,
    selectedManagement: [],
    score: { history: 0, examination: 0, investigations: 0, diagnosis: 0, management: 0, penalties: 0, total: 0 },
    timeSpent: 0, isComplete: false,
  });
  const [investigationProgress, setInvestigationProgress] = useState<Map<string, InvestigationProgress>>(new Map());
  const [selectedHistoryCategory, setSelectedHistoryCategory] = useState('chief_complaint');
  const [selectedExamSystem, setSelectedExamSystem] = useState('abdomen');
  const [selectedInvCategory, setSelectedInvCategory] = useState('laboratory');
  const [showResults, setShowResults] = useState(false);

  // Timer
  useEffect(() => {
    if (!state.isComplete) {
      const timer = setInterval(() => setState(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 })), 1000);
      return () => clearInterval(timer);
    }
  }, [state.isComplete]);

  // Load case
  useEffect(() => {
    const data = getCaseById(caseId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setCaseData(data);
    setLoading(false);
  }, [caseId]);

  // Investigation timer
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
                setState(prev => ({ ...prev, completedInvestigations: [...prev.completedInvestigations, id] }));
                hasUpdates = true;
              } else { newProgress.set(id, { ...inv, progress }); hasUpdates = true; }
            }
          }
        });
        return hasUpdates ? newProgress : prev;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [caseData]);

  const calculateTotalScore = useCallback(() => {
    const { history, examination, investigations, diagnosis, management, penalties } = state.score;
    return history + examination + investigations + diagnosis + management - penalties;
  }, [state.score]);

  const getTotalCost = () => {
    if (!caseData) return 0;
    return state.orderedInvestigations.reduce((total, id) => {
      const inv = caseData.investigations.find(i => i.id === id);
      return total + (inv?.cost || 0);
    }, 0);
  };

  const handleAskQuestion = (question: HistoryQuestion) => {
    if (state.askedQuestions.includes(question.id)) return;
    setState(prev => ({ ...prev, askedQuestions: [...prev.askedQuestions, question.id],
      score: { ...prev.score, history: prev.score.history + question.points } }));
  };

  const handleExamine = (finding: ExaminationFinding) => {
    if (state.examinedAreas.includes(finding.id)) return;
    setState(prev => ({ ...prev, examinedAreas: [...prev.examinedAreas, finding.id],
      score: { ...prev.score, examination: prev.score.examination + finding.points } }));
  };

  const handleOrderInvestigation = (investigation: Investigation) => {
    if (state.orderedInvestigations.includes(investigation.id)) return;
    const penalty = investigation.isUnnecessary ? (investigation.penaltyIfUnnecessary || 0) : 0;
    setState(prev => ({ ...prev, orderedInvestigations: [...prev.orderedInvestigations, investigation.id],
      score: { ...prev.score, investigations: prev.score.investigations + investigation.points, penalties: prev.score.penalties + penalty } }));
    setInvestigationProgress(prev => {
      const n = new Map(prev);
      n.set(investigation.id, { id: investigation.id, status: 'processing', progress: 0, startTime: Date.now() });
      return n;
    });
  };

  const handleSelectDiagnosis = (diagnosisId: string) => {
    if (!caseData) return;
    const primaryCorrect = diagnosisId === caseData.diagnosis.primary.id;
    const differential = caseData.diagnosis.differentials.find(d => d.id === diagnosisId);
    let points = 0;
    if (primaryCorrect) points = caseData.scoring.diagnosisPoints;
    else if (differential?.partialCredit) points = differential.partialCredit;
    setState(prev => ({ ...prev, selectedDiagnosis: diagnosisId, score: { ...prev.score, diagnosis: points } }));
  };

  const handleSelectManagement = (option: ManagementOption) => {
    if (state.selectedManagement.includes(option.id)) {
      setState(prev => ({ ...prev, selectedManagement: prev.selectedManagement.filter(id => id !== option.id),
        score: { ...prev.score, management: prev.score.management - option.points, penalties: prev.score.penalties - (option.penalty || 0) } }));
    } else {
      setState(prev => ({ ...prev, selectedManagement: [...prev.selectedManagement, option.id],
        score: { ...prev.score, management: prev.score.management + option.points, penalties: prev.score.penalties + (option.penalty || 0) } }));
    }
  };

  const goToStep = (step: SimulatorStep) => setState(prev => ({ ...prev, currentStep: step }));
  const goToNextStep = () => {
    const idx = STEP_INDEX[state.currentStep];
    if (idx < STEPS.length - 1) setState(prev => ({ ...prev, currentStep: STEPS[idx + 1].id }));
  };
  const goToPreviousStep = () => {
    const idx = STEP_INDEX[state.currentStep];
    if (idx > 0) setState(prev => ({ ...prev, currentStep: STEPS[idx - 1].id }));
  };
  const completeSimulation = () => { setState(prev => ({ ...prev, isComplete: true })); setShowResults(true); };
  const resetSimulation = () => {
    setState({ currentStep: 'presentation', askedQuestions: [], examinedAreas: [],
      orderedInvestigations: [], completedInvestigations: [], selectedDiagnosis: null,
      selectedManagement: [],
      score: { history: 0, examination: 0, investigations: 0, diagnosis: 0, management: 0, penalties: 0, total: 0 },
      timeSpent: 0, isComplete: false });
    setInvestigationProgress(new Map());
    setShowResults(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
    </div>
  );

  if (!caseData) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <XCircle className="h-16 w-16 text-red-400" />
      <h2 className="text-xl font-semibold text-white">Case Not Found</h2>
      <p className="text-gray-400">The requested case could not be loaded.</p>
      <Button onClick={() => router.push('/exam-centre')} className="mt-4">
        <Home className="h-4 w-4 mr-2" /> Back to Exam Centre
      </Button>
    </div>
  );

  const totalScore = calculateTotalScore();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-emerald-400" /> Patient Simulator
          </h1>
          <p className="text-gray-400 mt-1">{caseData.title} • {caseData.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />{formatTime(state.timeSpent)}
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />Score: {totalScore}
          </Badge>
          <Badge variant="outline" className={`${
            caseData.difficulty === 'hard' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
            caseData.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            'bg-green-500/20 text-green-300 border-green-500/30'
          }`}>{caseData.difficulty.charAt(0).toUpperCase() + caseData.difficulty.slice(1)}</Badge>
        </div>
      </div>

      <StepProgress currentStep={state.currentStep} onStepClick={goToStep} />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {state.currentStep === 'presentation' && <CasePresentation caseData={caseData} onNext={goToNextStep} />}
          {state.currentStep === 'history' && (
            <HistoryTaking caseData={caseData} askedQuestions={state.askedQuestions}
              selectedCategory={selectedHistoryCategory} onSelectCategory={setSelectedHistoryCategory}
              onAskQuestion={handleAskQuestion} onNext={goToNextStep} onBack={goToPreviousStep} />
          )}
          {state.currentStep === 'examination' && (
            <PhysicalExam caseData={caseData} examinedAreas={state.examinedAreas}
              selectedSystem={selectedExamSystem} onSelectSystem={setSelectedExamSystem}
              onExamine={handleExamine} onNext={goToNextStep} onBack={goToPreviousStep} />
          )}
          {state.currentStep === 'investigations' && (
            <InvestigationPanel caseData={caseData} orderedInvestigations={state.orderedInvestigations}
              completedInvestigations={state.completedInvestigations} investigationProgress={investigationProgress}
              selectedCategory={selectedInvCategory} onSelectCategory={setSelectedInvCategory}
              onOrderInvestigation={handleOrderInvestigation} getTotalCost={getTotalCost}
              onNext={goToNextStep} onBack={goToPreviousStep} />
          )}
          {state.currentStep === 'management' && (
            <DiagnosisManagement caseData={caseData} selectedDiagnosis={state.selectedDiagnosis}
              selectedManagement={state.selectedManagement} onSelectDiagnosis={handleSelectDiagnosis}
              onSelectManagement={handleSelectManagement} onComplete={completeSimulation} onBack={goToPreviousStep} />
          )}
        </div>

        <div className="space-y-4">
          <ScoreCard state={state} caseData={caseData} totalScore={totalScore} />
          <ProgressSummary state={state} caseData={caseData} />
          {(state.askedQuestions.length > 3 || state.examinedAreas.length > 3) && (
            <Card className="bg-[#1A2332] border-amber-500/20">
              <CardContent className="p-4">
                <p className="text-base font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" /> Clinical Pearl
                </p>
                <p className="text-sm text-amber-200/80">
                  {caseData.clinicalPearls[Math.min(
                    Math.floor((state.askedQuestions.length + state.examinedAreas.length) / 4),
                    caseData.clinicalPearls.length - 1
                  )]}
                </p>
              </CardContent>
            </Card>
          )}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full border-gray-600 text-gray-400 hover:text-gray-300" onClick={resetSimulation}>
                <RotateCcw className="h-4 w-4 mr-2" /> Restart Case
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-gray-400 hover:text-gray-300" onClick={() => router.push('/exam-centre')}>
                <Home className="h-4 w-4 mr-2" /> Exit to Exam Centre
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showResults && (
        <ResultsModal caseData={caseData} state={state} totalScore={totalScore}
          getTotalCost={getTotalCost} onReset={resetSimulation} onExit={() => router.push('/exam-centre')} />
      )}
    </div>
  );
}
