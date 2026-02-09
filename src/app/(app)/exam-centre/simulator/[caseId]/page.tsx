'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertTriangle,
  CheckCircle2,
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
  Info,
  ArrowRight,
  RotateCcw,
  Home,
  Loader2,
} from 'lucide-react';
import { getCaseById } from '@/lib/data/cases/acute-appendicitis';
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
  { id: 'chief_complaint', label: 'Chief Complaint', color: 'text-red-400' },
  { id: 'history_of_presenting_illness', label: 'HPI', color: 'text-amber-400' },
  { id: 'past_history', label: 'Past History', color: 'text-blue-400' },
  { id: 'family_history', label: 'Family History', color: 'text-purple-400' },
  { id: 'personal_history', label: 'Personal History', color: 'text-green-400' },
  { id: 'drug_history', label: 'Drug History', color: 'text-cyan-400' },
];

// Examination systems
const EXAM_SYSTEMS = [
  { id: 'general', label: 'General', icon: Eye, color: 'text-gray-400' },
  { id: 'abdomen', label: 'Abdomen', icon: Activity, color: 'text-emerald-400' },
  { id: 'cardiovascular', label: 'Cardiovascular', icon: Heart, color: 'text-red-400' },
  { id: 'respiratory', label: 'Respiratory', icon: Wind, color: 'text-blue-400' },
  { id: 'neurological', label: 'Neurological', icon: Brain, color: 'text-purple-400' },
  { id: 'musculoskeletal', label: 'Musculoskeletal', icon: Bone, color: 'text-amber-400' },
];

// Investigation categories
const INVESTIGATION_CATEGORIES = [
  { id: 'laboratory', label: 'Laboratory', color: 'text-blue-400' },
  { id: 'imaging', label: 'Imaging', color: 'text-emerald-400' },
  { id: 'special', label: 'Special Tests', color: 'text-purple-400' },
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
  const [showReference, setShowReference] = useState<string | null>(null);
  
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
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }
  
  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="h-16 w-16 text-red-400" />
        <h2 className="text-xl font-semibold text-white">Case Not Found</h2>
        <p className="text-gray-400">The requested case could not be loaded.</p>
        <Button onClick={() => router.push('/exam-centre')} className="mt-4">
          <Home className="h-4 w-4 mr-2" /> Back to Exam Centre
        </Button>
      </div>
    );
  }
  
  const currentStepIndex = STEP_INDEX[state.currentStep];
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;
  const totalScore = calculateTotalScore();
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-emerald-400" />
            Patient Simulator
          </h1>
          <p className="text-gray-400 mt-1">{caseData.title} • {caseData.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(state.timeSpent)}
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            Score: {totalScore}
          </Badge>
          <Badge variant="outline" className={`${
            caseData.difficulty === 'hard' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
            caseData.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            'bg-green-500/20 text-green-300 border-green-500/30'
          }`}>
            {caseData.difficulty.charAt(0).toUpperCase() + caseData.difficulty.slice(1)}
          </Badge>
        </div>
      </div>
      
      {/* Progress Steps */}
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const isActive = step.id === state.currentStep;
              const isCompleted = index < currentStepIndex;
              const StepIcon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : isCompleted 
                          ? 'text-emerald-400 hover:bg-emerald-500/10' 
                          : 'text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-emerald-500/30' 
                        : isCompleted 
                          ? 'bg-emerald-500/20' 
                          : 'bg-gray-700'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{step.label}</span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progressPercent} className="h-1 bg-gray-700" />
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Panel - Main Interaction */}
        <div className="col-span-2 space-y-4">
          {/* Step Content */}
          {state.currentStep === 'presentation' && (
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-400" />
                  Case Presentation
                </CardTitle>
                <CardDescription>
                  Read the clinical scenario carefully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Patient Info */}
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {caseData.patient.age}-year-old {caseData.patient.gender === 'male' ? 'Male' : 'Female'}
                      </h3>
                      <p className="text-gray-400">{caseData.patient.occupation}</p>
                      <Badge className="mt-1 bg-blue-500/20 text-blue-300">
                        {caseData.patient.setting}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/10 rounded-r-lg">
                    <p className="text-amber-300 font-medium">Chief Complaint</p>
                    <p className="text-white mt-1">{caseData.presentation.chiefComplaint}</p>
                  </div>
                </div>
                
                {/* Scenario */}
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    Clinical Scenario
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {caseData.presentation.scenario}
                  </p>
                </div>
                
                {/* Vitals */}
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-400" />
                    Vital Signs
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg bg-red-500/10 text-center">
                      <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Pulse</p>
                      <p className="text-sm font-medium text-white">{caseData.presentation.vitals.pulse}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                      <Activity className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">BP</p>
                      <p className="text-sm font-medium text-white">{caseData.presentation.vitals.bp}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 text-center">
                      <Thermometer className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Temp</p>
                      <p className="text-sm font-medium text-white">{caseData.presentation.vitals.temperature}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-500/10 text-center">
                      <Wind className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">RR</p>
                      <p className="text-sm font-medium text-white">{caseData.presentation.vitals.respiratory_rate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                      <Droplets className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">SpO2</p>
                      <p className="text-sm font-medium text-white">{caseData.presentation.vitals.spo2}</p>
                    </div>
                  </div>
                </div>
                
                {/* General Appearance */}
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-400" />
                    General Appearance
                  </h4>
                  <p className="text-gray-300">{caseData.presentation.generalAppearance}</p>
                </div>
                
                <Button 
                  className="w-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  onClick={goToNextStep}
                >
                  Proceed to History Taking <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          {state.currentStep === 'history' && (
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-amber-400" />
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
                          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30'
                          : 'border-gray-600 text-gray-400 hover:text-gray-300'
                        }
                      >
                        {cat.label}
                        <Badge className="ml-2 bg-gray-700 text-gray-300" variant="secondary">
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
                            className={`p-4 rounded-lg border transition-all ${
                              isAsked 
                                ? 'bg-[#0D1B2A] border-emerald-500/30' 
                                : 'bg-[#0D1B2A] border-gray-700 hover:border-amber-500/50 cursor-pointer'
                            }`}
                            onClick={() => !isAsked && handleAskQuestion(question)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className={`font-medium ${isAsked ? 'text-emerald-400' : 'text-white'}`}>
                                  {isAsked ? '✓ ' : ''}{question.question}
                                </p>
                                {isAsked && (
                                  <div className="mt-2 p-3 rounded bg-gray-800/50 border-l-2 border-amber-500">
                                    <p className="text-gray-300 text-sm italic">"{question.answer}"</p>
                                  </div>
                                )}
                              </div>
                              {!isAsked && (
                                <Badge className={`shrink-0 ${
                                  question.isRelevant 
                                    ? 'bg-emerald-500/20 text-emerald-300' 
                                    : 'bg-gray-600/20 text-gray-400'
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
                    className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    onClick={goToNextStep}
                  >
                    Proceed to Examination <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {state.currentStep === 'examination' && (
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-emerald-400" />
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
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/30'
                          : 'border-gray-600 text-gray-400 hover:text-gray-300'
                        }
                      >
                        <SysIcon className={`h-4 w-4 mr-1 ${sys.color}`} />
                        {sys.label}
                        <Badge className="ml-2 bg-gray-700 text-gray-300" variant="secondary">
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
                            className={`p-4 rounded-lg border transition-all ${
                              isExamined 
                                ? 'bg-[#0D1B2A] border-emerald-500/30' 
                                : 'bg-[#0D1B2A] border-gray-700 hover:border-emerald-500/50 cursor-pointer'
                            }`}
                            onClick={() => !isExamined && handleExamine(finding)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isExamined ? 'text-emerald-400' : 'text-white'}`}>
                                    {isExamined ? '✓ ' : ''}{finding.area}
                                  </p>
                                  {finding.isClassic && (
                                    <Badge className="bg-amber-500/20 text-amber-300 text-xs">
                                      Classic Sign
                                    </Badge>
                                  )}
                                </div>
                                {isExamined && (
                                  <div className="mt-2 p-3 rounded bg-gray-800/50">
                                    <p className={`text-sm ${
                                      finding.isPositive ? 'text-amber-300' : 'text-gray-400'
                                    }`}>
                                      {finding.finding}
                                    </p>
                                    {finding.textbookRef && (
                                      <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {finding.textbookRef}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              {!isExamined && (
                                <Badge className="shrink-0 bg-emerald-500/20 text-emerald-300">
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
                    className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    onClick={goToNextStep}
                  >
                    Proceed to Investigations <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {state.currentStep === 'investigations' && (
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-blue-400" />
                  Investigations
                </CardTitle>
                <CardDescription>
                  Order tests wisely. Unnecessary tests incur penalties. Results appear after processing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Warning */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-300">
                    <DollarSign className="h-5 w-5" />
                    <span>Total Investigation Cost: ₹{getTotalCost().toLocaleString()}</span>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-300">
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
                          ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30'
                          : 'border-gray-600 text-gray-400 hover:text-gray-300'
                        }
                      >
                        {cat.label}
                        <Badge className="ml-2 bg-gray-700 text-gray-300" variant="secondary">
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
                            className={`p-4 rounded-lg border transition-all ${
                              isOrdered 
                                ? 'bg-[#0D1B2A] border-blue-500/30' 
                                : 'bg-[#0D1B2A] border-gray-700 hover:border-blue-500/50 cursor-pointer'
                            }`}
                            onClick={() => !isOrdered && handleOrderInvestigation(investigation)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isComplete ? 'text-emerald-400' : isOrdered ? 'text-blue-400' : 'text-white'}`}>
                                    {isComplete ? '✓ ' : ''}{investigation.name}
                                  </p>
                                  {investigation.isEssential && (
                                    <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
                                      Essential
                                    </Badge>
                                  )}
                                  {investigation.isUnnecessary && isOrdered && (
                                    <Badge className="bg-red-500/20 text-red-300 text-xs">
                                      Unnecessary
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Progress bar while processing */}
                                {progress && progress.status === 'processing' && (
                                  <div className="mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                      <Timer className="h-3 w-3 animate-pulse" />
                                      Processing... {Math.round(progress.progress)}%
                                    </div>
                                    <Progress value={progress.progress} className="h-1 bg-gray-700" />
                                  </div>
                                )}
                                
                                {/* Results */}
                                {isComplete && (
                                  <div className={`mt-2 p-3 rounded ${
                                    investigation.isAbnormal ? 'bg-red-500/10 border border-red-500/20' : 'bg-gray-800/50'
                                  }`}>
                                    <pre className={`text-sm whitespace-pre-wrap font-mono ${
                                      investigation.isAbnormal ? 'text-red-300' : 'text-gray-300'
                                    }`}>
                                      {investigation.result}
                                    </pre>
                                    {investigation.normalRange && (
                                      <p className="text-xs text-gray-500 mt-2">
                                        Normal: {investigation.normalRange}
                                      </p>
                                    )}
                                    {investigation.textbookRef && (
                                      <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {investigation.textbookRef}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              {!isOrdered && (
                                <div className="text-right shrink-0">
                                  <p className="text-sm text-gray-400">₹{investigation.cost}</p>
                                  <p className="text-xs text-gray-500">{investigation.waitTime}s wait</p>
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
                    className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    onClick={goToNextStep}
                  >
                    Proceed to Management <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {state.currentStep === 'management' && (
            <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-purple-400" />
                  Diagnosis & Management
                </CardTitle>
                <CardDescription>
                  Make your diagnosis and select appropriate management steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Diagnosis Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Brain className="h-4 w-4 text-amber-400" />
                    What is your diagnosis?
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Primary diagnosis option */}
                    <div
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        state.selectedDiagnosis === caseData.diagnosis.primary.id
                          ? 'bg-emerald-500/20 border-emerald-500/50'
                          : 'bg-[#0D1B2A] border-gray-700 hover:border-emerald-500/30'
                      }`}
                      onClick={() => handleSelectDiagnosis(caseData.diagnosis.primary.id)}
                    >
                      <p className={`font-medium ${
                        state.selectedDiagnosis === caseData.diagnosis.primary.id ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {state.selectedDiagnosis === caseData.diagnosis.primary.id && '✓ '}
                        {caseData.diagnosis.primary.name}
                      </p>
                    </div>
                    {/* Differentials */}
                    {caseData.diagnosis.differentials.map(diff => (
                      <div
                        key={diff.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          state.selectedDiagnosis === diff.id
                            ? 'bg-amber-500/20 border-amber-500/50'
                            : 'bg-[#0D1B2A] border-gray-700 hover:border-gray-500'
                        }`}
                        onClick={() => handleSelectDiagnosis(diff.id)}
                      >
                        <p className={`font-medium ${
                          state.selectedDiagnosis === diff.id ? 'text-amber-400' : 'text-white'
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
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Pill className="h-4 w-4 text-purple-400" />
                    Select management steps (multiple allowed)
                  </h4>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {caseData.management.map(option => {
                        const isSelected = state.selectedManagement.includes(option.id);
                        const typeColors = {
                          immediate: 'text-red-400',
                          definitive: 'text-emerald-400',
                          supportive: 'text-blue-400',
                          wrong: 'text-gray-400',
                        };
                        
                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? option.isCorrect 
                                  ? 'bg-emerald-500/20 border-emerald-500/50'
                                  : 'bg-red-500/20 border-red-500/50'
                                : 'bg-[#0D1B2A] border-gray-700 hover:border-gray-500'
                            }`}
                            onClick={() => handleSelectManagement(option)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isSelected ? (option.isCorrect ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
                                    {isSelected && (option.isCorrect ? '✓ ' : '✗ ')}
                                    {option.action}
                                  </p>
                                  <Badge className={`text-xs ${typeColors[option.type]} bg-transparent`}>
                                    {option.type}
                                  </Badge>
                                </div>
                                {isSelected && (
                                  <p className="text-sm text-gray-400 mt-1">
                                    {option.explanation}
                                  </p>
                                )}
                              </div>
                              {!isSelected && (
                                <Badge className={`shrink-0 ${
                                  option.isCorrect 
                                    ? 'bg-emerald-500/20 text-emerald-300' 
                                    : 'bg-gray-600/20 text-gray-400'
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
                    className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    onClick={completeSimulation}
                    disabled={!state.selectedDiagnosis || state.selectedManagement.length === 0}
                  >
                    Submit & View Results <CheckCircle2 className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Panel - Score & Info */}
        <div className="space-y-4">
          {/* Live Score */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Live Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-emerald-400">{totalScore}</p>
                <p className="text-sm text-gray-400">/ {caseData.scoring.totalMaxPoints} max</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">History</span>
                  <span className="text-amber-400">{state.score.history}/{caseData.scoring.maxHistoryPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Examination</span>
                  <span className="text-emerald-400">{state.score.examination}/{caseData.scoring.maxExamPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investigations</span>
                  <span className="text-blue-400">{state.score.investigations}/{caseData.scoring.maxInvestigationPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Diagnosis</span>
                  <span className="text-purple-400">{state.score.diagnosis}/{caseData.scoring.diagnosisPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Management</span>
                  <span className="text-pink-400">{state.score.management}/{caseData.scoring.managementPoints}</span>
                </div>
                {state.score.penalties > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Penalties</span>
                    <span>-{state.score.penalties}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pass: {caseData.scoring.passingScore}</span>
                  <span className="text-gray-400">Excellent: {caseData.scoring.excellentScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Summary */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-400" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Questions asked</span>
                <span className="text-white">{state.askedQuestions.length}/{caseData.history.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Areas examined</span>
                <span className="text-white">{state.examinedAreas.length}/{caseData.examination.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tests ordered</span>
                <span className="text-white">{state.orderedInvestigations.length}/{caseData.investigations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tests completed</span>
                <span className="text-white">{state.completedInvestigations.length}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Clinical Pearls (shown after some progress) */}
          {(state.askedQuestions.length > 3 || state.examinedAreas.length > 3) && (
            <Card className="bg-[#1A2332] border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  Clinical Pearl
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-200/80">
                  {caseData.clinicalPearls[Math.min(
                    Math.floor((state.askedQuestions.length + state.examinedAreas.length) / 4),
                    caseData.clinicalPearls.length - 1
                  )]}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Quick Actions */}
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardContent className="p-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-400 hover:text-gray-300"
                onClick={resetSimulation}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Restart Case
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-400 hover:text-gray-300"
                onClick={() => router.push('/exam-centre')}
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
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-6 w-6 text-amber-400" />
                Simulation Complete!
              </CardTitle>
              <CardDescription>
                Here's your performance summary for {caseData.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final Score */}
              <div className="text-center py-6 bg-[#0D1B2A] rounded-lg">
                <p className="text-6xl font-bold text-emerald-400">{totalScore}</p>
                <p className="text-gray-400 mt-1">out of {caseData.scoring.totalMaxPoints}</p>
                <div className="mt-4">
                  {totalScore >= caseData.scoring.excellentScore ? (
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-lg px-4 py-1">
                      🎉 Excellent!
                    </Badge>
                  ) : totalScore >= caseData.scoring.passingScore ? (
                    <Badge className="bg-amber-500/20 text-amber-300 text-lg px-4 py-1">
                      ✓ Passed
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 text-lg px-4 py-1">
                      Needs Improvement
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <p className="text-amber-400 font-medium">History Taking</p>
                  <p className="text-2xl font-bold text-white">{state.score.history}</p>
                  <p className="text-sm text-gray-400">{state.askedQuestions.length} questions asked</p>
                </div>
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <p className="text-emerald-400 font-medium">Examination</p>
                  <p className="text-2xl font-bold text-white">{state.score.examination}</p>
                  <p className="text-sm text-gray-400">{state.examinedAreas.length} areas examined</p>
                </div>
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <p className="text-blue-400 font-medium">Investigations</p>
                  <p className="text-2xl font-bold text-white">{state.score.investigations}</p>
                  <p className="text-sm text-gray-400">₹{getTotalCost()} spent</p>
                </div>
                <div className="p-4 rounded-lg bg-[#0D1B2A]">
                  <p className="text-purple-400 font-medium">Diagnosis</p>
                  <p className="text-2xl font-bold text-white">{state.score.diagnosis}</p>
                  <p className="text-sm text-gray-400">
                    {state.selectedDiagnosis === caseData.diagnosis.primary.id ? 'Correct!' : 'Partial credit'}
                  </p>
                </div>
              </div>
              
              {/* Correct Answer */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="font-medium text-emerald-300 mb-2">Correct Diagnosis</h4>
                <p className="text-white font-semibold">{caseData.diagnosis.primary.name}</p>
                <p className="text-sm text-gray-300 mt-2">{caseData.diagnosis.primary.explanation}</p>
              </div>
              
              {/* Textbook References */}
              <div className="space-y-3">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  Textbook References
                </h4>
                {caseData.textbookReferences.map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#0D1B2A] text-sm">
                    <p className="text-blue-400 font-medium">{ref.book}</p>
                    <p className="text-gray-400">{ref.chapter} {ref.page && `• Page ${ref.page}`}</p>
                    <p className="text-gray-300 mt-1">{ref.keyPoint}</p>
                  </div>
                ))}
              </div>
              
              {/* Time */}
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Time spent: {formatTime(state.timeSpent)}</span>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  onClick={resetSimulation}
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Try Again
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.push('/exam-centre')}
                >
                  Back to Exam Centre
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
