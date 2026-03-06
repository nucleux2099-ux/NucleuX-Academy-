'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Target,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowLeft,
  Play,
  RotateCcw,
  Square,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  ClipboardList,
  Stethoscope,
  Check,
  User,
  FileText,
  Mic,
} from 'lucide-react';
import { 
  thyroidExaminationOSCE, 
  calculateOSCEScore,
  getTimingGuide,
} from '@/lib/data/templates/osce-template';
import { useExamCentreOsceResult } from '@/lib/api/hooks';

export default function OSCEStationPage() {
  const params = useParams();
  const router = useRouter();
  const routeStationId = params.stationId as string;
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(thyroidExaminationOSCE.timeLimit * 60);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showModelAnswers, setShowModelAnswers] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSubmitted, setSessionSubmitted] = useState(false);
  const [isSessionBusy, setIsSessionBusy] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const sessionSubmittedRef = useRef(false);
  const actionStartedAtRef = useRef<number>(Date.now());
  
  const station = thyroidExaminationOSCE;
  const timingGuide = getTimingGuide();
  const stationRef = routeStationId || station.id;

  const { data: osceResult } = useExamCentreOsceResult(sessionId || undefined, {
    totalMarks: station.totalMarks,
    passingMarks: station.passingMarks,
    distinctionMarks: station.distinctionMarks,
    checklistTotal: station.checklist.length,
  });
  const osceSnapshot = osceResult?.snapshot;

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
        body: JSON.stringify({ mode: 'practical' }),
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
      console.warn('Failed to create OSCE session:', error);
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
        console.warn('Failed to submit OSCE session:', error);
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

  const recordChecklistEvent = useCallback(
    async (itemId: string, isCritical: boolean, marks: number) => {
      if (!sessionId || sessionSubmitted) return;

      try {
        await fetch(`/api/exam-centre/sessions/${sessionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_ref: `${stationRef}:checklist:${itemId}`,
            mode: 'practical',
            selected_option_key: 'checked',
            is_correct: true,
            confidence: isCritical ? 4 : 3,
            time_taken_seconds: getElapsedActionSeconds(),
            metadata: {
              marks,
              is_critical: isCritical,
            },
          }),
        });
      } catch (error) {
        console.warn('Failed to record OSCE checklist event:', error);
      }
    },
    [getElapsedActionSeconds, sessionId, sessionSubmitted, stationRef]
  );

  const handleBackToExamCentre = useCallback(async () => {
    await submitSessionIfNeeded({ notesCreated: checkedItems.length });
    router.push('/exam-centre');
  }, [checkedItems.length, router, submitSessionIfNeeded]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setExamCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    if (!examCompleted) return;
    void submitSessionIfNeeded({ notesCreated: checkedItems.length });
  }, [checkedItems.length, examCompleted, submitSessionIfNeeded]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleToggleItem = (itemId: string) => {
    if (checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter(id => id !== itemId));
    } else {
      setCheckedItems([...checkedItems, itemId]);
      const item = station.checklist.find((row) => row.id === itemId);
      if (item) {
        void recordChecklistEvent(item.id, item.isCritical, item.marks);
      }
    }
  };
  
  const handleStartExam = () => {
    setTimerActive(true);
    setCheckedItems([]);
    setExamCompleted(false);
    setShowAnswers(false);
    setTimeRemaining(station.timeLimit * 60);
    actionStartedAtRef.current = Date.now();
    if (!sessionId || sessionSubmitted) {
      void createExamSession();
    }
  };
  
  const handleStopExam = () => {
    setTimerActive(false);
    setExamCompleted(true);
  };
  
  const handleResetExam = () => {
    setTimerActive(false);
    setTimeRemaining(station.timeLimit * 60);
    setCheckedItems([]);
    setExamCompleted(false);
    setShowAnswers(false);
    actionStartedAtRef.current = Date.now();

    const rotateSession = async () => {
      await submitSessionIfNeeded({ notesCreated: checkedItems.length });
      await createExamSession();
    };
    void rotateSession();
  };
  
  const score = useMemo(() => 
    calculateOSCEScore(checkedItems),
    [checkedItems]
  );

  const totalCriticalActions = useMemo(
    () => station.checklist.filter((item) => item.isCritical).length,
    [station.checklist]
  );

  const hasOsceSnapshot = typeof osceSnapshot?.marksAwarded === 'number';
  const displayScore = hasOsceSnapshot ? osceSnapshot.marksAwarded : score.score;
  const displayPercentage =
    hasOsceSnapshot && osceSnapshot.scorePercent !== null ? osceSnapshot.scorePercent : score.percentage;
  const displayGrade = hasOsceSnapshot ? osceSnapshot.grade : score.grade;
  const displayFeedback = hasOsceSnapshot
    ? displayGrade === 'Distinction'
      ? 'Strong station execution with high checklist completion.'
      : displayGrade === 'Pass'
      ? 'Solid attempt. Keep rehearsing verbal structure and flow.'
      : displayGrade === 'Borderline'
      ? 'Near pass threshold. Tighten sequence and key checkpoints.'
      : displayGrade === 'N/A'
      ? 'Session captured. Complete more checklist actions for graded outcome.'
      : 'Needs improvement. Rework critical actions and order of examination.'
    : score.feedback;

  const gradeStyles: Record<string, string> = {
    Distinction: 'bg-emerald-500',
    Pass: 'bg-blue-500',
    Borderline: 'bg-amber-500',
    Fail: 'bg-red-500',
    'N/A': 'bg-gray-500',
  };

  const scoreCardStyles: Record<string, string> = {
    Distinction: 'bg-emerald-500/20 border-emerald-500/50',
    Pass: 'bg-blue-500/20 border-blue-500/50',
    Borderline: 'bg-amber-500/20 border-amber-500/50',
    Fail: 'bg-red-500/20 border-red-500/50',
    'N/A': 'bg-gray-500/20 border-gray-500/50',
  };
  
  const checklistByCategory = useMemo(() => {
    const grouped: Record<string, typeof station.checklist> = {};
    station.checklist.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [station]);
  
  const categoryProgress = useMemo(() => {
    const progress: Record<string, { checked: number; total: number; marks: number; maxMarks: number }> = {};
    Object.entries(checklistByCategory).forEach(([category, items]) => {
      const checked = items.filter(item => checkedItems.includes(item.id)).length;
      const marks = items
        .filter(item => checkedItems.includes(item.id))
        .reduce((sum, item) => sum + item.marks, 0);
      const maxMarks = items.reduce((sum, item) => sum + item.marks, 0);
      progress[category] = { 
        checked, 
        total: items.length, 
        marks,
        maxMarks 
      };
    });
    return progress;
  }, [checklistByCategory, checkedItems]);
  
  const timerColor = timeRemaining < 60 
    ? 'text-red-400' 
    : timeRemaining < 120 
    ? 'text-amber-400' 
    : 'text-emerald-400';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
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
          <Badge variant="outline" className="bg-rose-500/20 text-rose-300 border-rose-500/30">
            <Target className="h-3 w-3 mr-1" />
            OSCE Station {station.stationNumber}
          </Badge>
          <Badge variant="outline" className={
            station.difficulty === 'Advanced' 
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : station.difficulty === 'Intermediate'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }>
            {station.difficulty}
          </Badge>
        </div>
      </div>
      
      {/* Station Title Card */}
      <Card className="bg-gradient-to-r from-[#364A5E]/95 to-[#2D3E50]/95 border-[#C9A86C]/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{station.title}</h2>
              <p className="text-rose-200 text-sm mt-1">
                {station.system} • {station.topic} • {station.timeLimit} minutes
              </p>
            </div>
            <Stethoscope className="h-12 w-12 text-rose-400 opacity-50" />
          </div>
        </CardContent>
      </Card>
      
      {/* Timer & Controls */}
      <Card className={`bg-[#364A5E] border-2 ${
        timerActive ? 'border-emerald-500/50' : examCompleted ? 'border-amber-500/50' : 'border-gray-700'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-mono font-bold ${timerColor}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-400">
                {timerActive ? 'Exam in progress...' : examCompleted ? 'Exam completed' : 'Ready to start'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!timerActive && !examCompleted && (
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleStartExam}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Exam
                </Button>
              )}
              {timerActive && (
                <Button 
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                  onClick={handleStopExam}
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Exam
                </Button>
              )}
              {examCompleted && (
                <Button 
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                  onClick={handleResetExam}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress 
              value={(1 - timeRemaining / (station.timeLimit * 60)) * 100} 
              className="h-2 bg-gray-700"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Timing Guide */}
      {(timerActive || examCompleted) && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {timingGuide.map((phase, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="whitespace-nowrap bg-gray-700/50 text-gray-300 border-gray-600"
            >
              <Clock className="h-3 w-3 mr-1" />
              {phase.suggestedTime}: {phase.phase}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Score Display (when completed) */}
      {examCompleted && (
        <Card className={`border-2 ${scoreCardStyles[displayGrade] || scoreCardStyles.Fail}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Score: {displayScore}/{station.totalMarks}
                </h3>
                <p className="text-gray-300 mt-1">{displayPercentage}%</p>
              </div>
              <div className="text-right">
                <Badge className={`text-lg px-4 py-2 ${gradeStyles[displayGrade] || gradeStyles.Fail}`}>
                  <Award className="h-5 w-5 mr-2" />
                  {displayGrade}
                </Badge>
                <p className="text-sm text-gray-400 mt-2">
                  Passing: {station.passingMarks} | Distinction: {station.distinctionMarks}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mt-4">{displayFeedback}</p>

            {hasOsceSnapshot && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-[#5BB3B3]/10 text-[#8FD5D5] border-[#5BB3B3]/28">
                  Checklist completion {osceSnapshot.completionPercent ?? 0}%
                </Badge>
                <Badge variant="outline" className="bg-[#C9A86C]/10 text-[#D8BE90] border-[#C9A86C]/28">
                  Critical checked {osceSnapshot.criticalItemsChecked}/{totalCriticalActions}
                </Badge>
              </div>
            )}
            
            {!hasOsceSnapshot && score.missedCritical.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <h4 className="font-medium text-red-300 mb-2">Critical Actions Missed:</h4>
                <ul className="list-disc list-inside text-sm text-red-200 space-y-1">
                  {score.missedCritical.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Instructions */}
        <div className="space-y-4">
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Candidate Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {station.candidateInstructions}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-400" />
                Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                {station.taskDescription}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-[#C9A86C]" />
                Equipment Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                {station.equipmentRequired.map((eq, idx) => (
                  <li key={idx}>{eq}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle Column - Checklist */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-rose-400" />
                Examiner Checklist
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {checkedItems.length}/{station.checklist.length} items
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="text-gray-400"
                >
                  {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {Object.entries(checklistByCategory).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <div 
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-700/30 cursor-pointer"
                      onClick={() => setActiveSection(activeSection === category ? null : category)}
                    >
                      <h4 className="font-medium text-white flex items-center gap-2">
                        {activeSection === category ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        {category}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {categoryProgress[category]?.marks}/{categoryProgress[category]?.maxMarks} marks
                        </span>
                        <Progress 
                          value={(categoryProgress[category]?.checked / categoryProgress[category]?.total) * 100}
                          className="w-16 h-1.5 bg-gray-700"
                        />
                      </div>
                    </div>
                    
                    {(activeSection === category || activeSection === null) && (
                      <div className="space-y-1 pl-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border transition-all cursor-pointer ${
                              checkedItems.includes(item.id)
                                ? 'bg-emerald-500/20 border-emerald-500/50'
                                : 'bg-[#2D3E50] border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => handleToggleItem(item.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                                checkedItems.includes(item.id)
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-700 text-gray-400'
                              }`}>
                                {checkedItems.includes(item.id) ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <span className="text-xs">{item.marks}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <p className={`text-sm ${
                                    checkedItems.includes(item.id) ? 'text-emerald-200' : 'text-gray-300'
                                  }`}>
                                    {item.action}
                                  </p>
                                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                    {item.isCritical && (
                                      <Badge className="bg-red-500/20 text-red-300 text-xs">
                                        Critical
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs bg-gray-700/50">
                                      {item.marks} pts
                                    </Badge>
                                  </div>
                                </div>
                                
                                {showAnswers && (
                                  <>
                                    {item.expectedFindings && item.expectedFindings.length > 0 && (
                                      <div className="mt-2 p-2 rounded bg-blue-500/10 border border-blue-500/20">
                                        <p className="text-xs text-blue-300 font-medium mb-1">Expected:</p>
                                        <ul className="text-xs text-blue-200 list-disc list-inside">
                                          {item.expectedFindings.map((f, idx) => (
                                            <li key={idx}>{f}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {item.teachingNote && (
                                      <p className="mt-1 text-xs text-amber-400">
                                        <Lightbulb className="h-3 w-3 inline mr-1" />
                                        {item.teachingNote}
                                      </p>
                                    )}
                                    {item.commonMistakes && (
                                      <p className="mt-1 text-xs text-red-400">
                                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                                        {item.commonMistakes}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Model Answers Section */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowModelAnswers(!showModelAnswers)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-[#C9A86C]" />
              Model Answers & Verbal Scripts
            </div>
            {showModelAnswers ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        {showModelAnswers && (
          <CardContent className="space-y-4">
            {station.modelAnswers.map((answer, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#2D3E50] border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#C9A86C]">{answer.section}</h4>
                  <Badge variant="outline" className="bg-[#C9A86C]/10 text-[#C9A86C] border-[#C9A86C]/24">
                    {answer.approach}
                  </Badge>
                </div>
                
                <div className="p-3 rounded bg-[#C9A86C]/10 border border-[#C9A86C]/24 mb-3">
                  <p className="text-sm text-[#C9A86C] italic whitespace-pre-line">
                    &quot;{answer.verbalScript}&quot;
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 mb-1">Key Points:</p>
                  <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                    {answer.keyPoints.map((point, pidx) => (
                      <li key={pidx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
      
      {/* Red Flags, Tips & Common Mistakes */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#364A5E] border-red-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {station.redFlags.map((flag, idx) => (
                <li key={idx} className="text-red-200">{flag}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-[#364A5E] border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-emerald-400" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {station.tips.map((tip, idx) => (
                <li key={idx} className="text-emerald-200">{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-[#364A5E] border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-amber-400" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {station.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="text-amber-200">{mistake}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Differentials & References */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              Key Differentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {station.keyDifferentials.map((diff, idx) => (
                <Badge key={idx} variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                  {diff}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#C9A86C]" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-gray-400">
              {station.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
