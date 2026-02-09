'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Target,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Square,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  Timer,
  ClipboardList,
  Stethoscope,
  GraduationCap,
  Check,
  X,
  User,
  FileText,
  Mic,
} from 'lucide-react';
import { 
  thyroidExaminationOSCE, 
  calculateOSCEScore,
  getTimingGuide,
} from '@/lib/data/templates/osce-template';

export default function OSCEStationPage() {
  const params = useParams();
  const stationId = params.stationId as string;
  
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(thyroidExaminationOSCE.timeLimit * 60);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showChecklist, setShowChecklist] = useState(true);
  const [showModelAnswers, setShowModelAnswers] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const station = thyroidExaminationOSCE;
  const timingGuide = getTimingGuide();
  
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
    }
  };
  
  const handleStartExam = () => {
    setTimerActive(true);
    setCheckedItems([]);
    setExamCompleted(false);
    setShowAnswers(false);
    setTimeRemaining(station.timeLimit * 60);
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
  };
  
  const score = useMemo(() => 
    calculateOSCEScore(checkedItems),
    [checkedItems]
  );
  
  const checklistByCategory = useMemo(() => {
    const grouped: Record<string, typeof station.checklist> = {};
    station.checklist.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [station.checklist]);
  
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
          <Link href="/exam-centre">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exam Centre
            </Button>
          </Link>
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
      <Card className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 border-rose-500/30">
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
      <Card className={`bg-[#1A2332] border-2 ${
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
        <Card className={`border-2 ${
          score.grade === 'Distinction' 
            ? 'bg-emerald-500/20 border-emerald-500/50'
            : score.grade === 'Pass'
            ? 'bg-blue-500/20 border-blue-500/50'
            : score.grade === 'Borderline'
            ? 'bg-amber-500/20 border-amber-500/50'
            : 'bg-red-500/20 border-red-500/50'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Score: {score.score}/{station.totalMarks}
                </h3>
                <p className="text-gray-300 mt-1">{score.percentage}%</p>
              </div>
              <div className="text-right">
                <Badge className={`text-lg px-4 py-2 ${
                  score.grade === 'Distinction' 
                    ? 'bg-emerald-500'
                    : score.grade === 'Pass'
                    ? 'bg-blue-500'
                    : score.grade === 'Borderline'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}>
                  <Award className="h-5 w-5 mr-2" />
                  {score.grade}
                </Badge>
                <p className="text-sm text-gray-400 mt-2">
                  Passing: {station.passingMarks} | Distinction: {station.distinctionMarks}
                </p>
              </div>
            </div>
            <p className="text-gray-300 mt-4">{score.feedback}</p>
            
            {score.missedCritical.length > 0 && (
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
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
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
          
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
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
          
          <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-purple-400" />
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
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)] col-span-2">
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
                                : 'bg-[#0D1B2A] border-gray-700 hover:border-gray-600'
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
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowModelAnswers(!showModelAnswers)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-purple-400" />
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
              <div key={idx} className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-purple-300">{answer.section}</h4>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                    {answer.approach}
                  </Badge>
                </div>
                
                <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20 mb-3">
                  <p className="text-sm text-purple-200 italic whitespace-pre-line">
                    "{answer.verbalScript}"
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
        <Card className="bg-[#1A2332] border-red-500/30">
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
        
        <Card className="bg-[#1A2332] border-emerald-500/30">
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
        
        <Card className="bg-[#1A2332] border-amber-500/30">
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
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
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
        
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-400" />
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
