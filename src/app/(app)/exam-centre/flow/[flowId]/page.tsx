'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleDot,
  Target,
  BookOpen,
  Calculator,
  Heart,
  Droplets,
  Stethoscope,
  Syringe,
  TrendingUp,
} from 'lucide-react';
import { 
  upperGIBleedingFlow, 
  calculateBlatchfordScore,
  calculateRockallScore,
} from '@/lib/data/templates/patient-flow-template';
import { useExamCentreFlowResult } from '@/lib/api/hooks';

const nodeTypeIcons: Record<string, React.ElementType> = {
  entry: AlertCircle,
  decision: CircleDot,
  investigation: Stethoscope,
  treatment: Syringe,
  diagnosis: Target,
  endpoint: CheckCircle,
};

const nodeTypeColors: Record<string, string> = {
  entry: 'from-[#E57373] to-[#A88758]',
  decision: 'from-[#5BB3B3] to-[#5BB3B3]',
  investigation: 'from-[#C9A86C] to-[#A88758]',
  treatment: 'from-[#5BB3B3] to-[#4A9E9E]',
  diagnosis: 'from-[#D8BE90] to-[#A88758]',
  endpoint: 'from-[#7BA69E] to-[#5BB3B3]',
};

export default function PatientFlowPage() {
  const params = useParams();
  const router = useRouter();
  const flowId = params.flowId as string;
  const [currentNodeId, setCurrentNodeId] = useState('N1');
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['N1']);
  const [showScoring, setShowScoring] = useState(false);
  const [activeScorer, setActiveScorer] = useState<'blatchford' | 'rockall' | null>(null);
  const [showPathways, setShowPathways] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSubmitted, setSessionSubmitted] = useState(false);
  const [isSessionBusy, setIsSessionBusy] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const sessionSubmittedRef = useRef(false);
  const actionStartedAtRef = useRef<number>(Date.now());
  
  const flow = upperGIBleedingFlow;

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
        body: JSON.stringify({ mode: 'flow' }),
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
      console.warn('Failed to create flow exam session:', error);
    } finally {
      setIsSessionBusy(false);
    }
    return false;
  }, []);

  useEffect(() => {
    void createExamSession();
  }, [createExamSession]);

  const submitSessionIfNeeded = useCallback(async () => {
    if (!sessionId || sessionSubmitted) return true;
    setIsSessionBusy(true);
    try {
      const response = await fetch(`/api/exam-centre/sessions/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ended_at: new Date().toISOString() }),
      });
      if (response.ok) {
        setSessionSubmitted(true);
        sessionSubmittedRef.current = true;
        return true;
      }
    } catch (error) {
      console.warn('Failed to submit flow exam session:', error);
    } finally {
      setIsSessionBusy(false);
    }
    return false;
  }, [sessionId, sessionSubmitted]);

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

  const canonicalTransitions = useMemo(() => {
    const canonical = new Set<string>();
    const primaryPath = flow.pathways[0]?.nodeSequence || [];
    for (let index = 0; index < primaryPath.length - 1; index += 1) {
      canonical.add(`${primaryPath[index]}->${primaryPath[index + 1]}`);
    }
    return canonical;
  }, [flow.pathways]);

  const recordFlowBranch = useCallback(
    async (params: {
      fromNodeId: string;
      toNodeId: string;
      label: 'yes' | 'no' | 'option' | 'proceed';
      isCorrect: boolean;
    }) => {
      if (!sessionId || sessionSubmitted) return;

      try {
        await fetch(`/api/exam-centre/sessions/${sessionId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_ref: `${flowId || flow.id}:branch:${params.fromNodeId}->${params.toNodeId}`,
            mode: 'flow',
            selected_option_key: params.label,
            is_correct: params.isCorrect,
            confidence: params.isCorrect ? 4 : 2,
            time_taken_seconds: getElapsedActionSeconds(),
          }),
        });
      } catch (error) {
        console.warn('Failed to record flow branch:', error);
      }
    },
    [flow.id, flowId, getElapsedActionSeconds, sessionId, sessionSubmitted]
  );

  const handleBackToExamCentre = useCallback(async () => {
    await submitSessionIfNeeded();
    router.push('/exam-centre');
  }, [router, submitSessionIfNeeded]);

  const { data: flowResult } = useExamCentreFlowResult(sessionId || undefined, flow.branches.length);
  const flowSnapshot = flowResult?.snapshot;
  
  const currentNode = useMemo(() => 
    flow.nodes.find(n => n.id === currentNodeId),
    [currentNodeId, flow.nodes]
  );
  
  const outgoingBranches = useMemo(() =>
    flow.branches.filter(b => b.fromNodeId === currentNodeId),
    [currentNodeId, flow.branches]
  );
  
  const progress = useMemo(() => 
    (visitedNodes.length / flow.nodes.length) * 100,
    [visitedNodes.length, flow.nodes.length]
  );

  const flowScoreMeta = useMemo(() => {
    const grade = flowSnapshot?.grade?.toLowerCase();
    if (grade === 'excellent') {
      return { label: 'Excellent', className: 'bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28' };
    }
    if (grade === 'good') {
      return { label: 'Good', className: 'bg-[#5BB3B3]/12 text-[#8FD5D5] border-[#5BB3B3]/24' };
    }
    if (grade === 'developing') {
      return { label: 'Developing', className: 'bg-[#C9A86C]/16 text-[#D8BE90] border-[#C9A86C]/28' };
    }
    if (grade === 'at-risk') {
      return { label: 'At Risk', className: 'bg-[#E57373]/18 text-[#EAB7B7] border-[#E57373]/30' };
    }
    return { label: 'In Progress', className: 'bg-[#253545] text-[#A0B0BC] border-[#334658]' };
  }, [flowSnapshot?.grade]);
  
  const handleNavigate = useCallback((toNodeId: string) => {
    const fromNodeId = currentNodeId;
    const branch =
      flow.branches.find((item) => item.fromNodeId === fromNodeId && item.toNodeId === toNodeId) || null;
    const isCorrect = canonicalTransitions.has(`${fromNodeId}->${toNodeId}`);

    setCurrentNodeId(toNodeId);
    setVisitedNodes((prev) => (prev.includes(toNodeId) ? prev : [...prev, toNodeId]));

    if (branch) {
      void recordFlowBranch({
        fromNodeId,
        toNodeId,
        label: branch.label,
        isCorrect,
      });
    }

    const targetNode = flow.nodes.find((node) => node.id === toNodeId);
    const hasOutgoing = flow.branches.some((item) => item.fromNodeId === toNodeId);
    if (targetNode?.type === 'endpoint' || !hasOutgoing) {
      void submitSessionIfNeeded();
    }
  }, [
    canonicalTransitions,
    currentNodeId,
    flow.branches,
    flow.nodes,
    recordFlowBranch,
    submitSessionIfNeeded,
  ]);
  
  const handleReset = useCallback(() => {
    setCurrentNodeId('N1');
    setVisitedNodes(['N1']);
    setShowScoring(false);
    setActiveScorer(null);
    setShowPathways(false);
    setShowEmergency(false);
    actionStartedAtRef.current = Date.now();

    const rotateSession = async () => {
      await submitSessionIfNeeded();
      await createExamSession();
    };
    void rotateSession();
  }, [createExamSession, submitSessionIfNeeded]);
  
  const handleGoBack = () => {
    if (visitedNodes.length > 1) {
      const newVisited = visitedNodes.slice(0, -1);
      setVisitedNodes(newVisited);
      setCurrentNodeId(newVisited[newVisited.length - 1]);
    }
  };
  
  const NodeIcon = currentNode ? nodeTypeIcons[currentNode.type] : CircleDot;
  const nodeColorClass = currentNode ? nodeTypeColors[currentNode.type] : 'from-[#6B7A88] to-[#6B7A88]';
  
  // Demo Blatchford calculation
  const demoBlatchford = calculateBlatchfordScore({
    bunMmol: 15,
    hbGdl: 9.5,
    isMale: true,
    sbp: 95,
    pulse: 110,
    hasMelena: true,
    hasSyncope: false,
    hasHepaticDisease: false,
    hasCardiacFailure: false,
  });
  
  // Demo Rockall calculation
  const demoRockall = calculateRockallScore({
    age: 65,
    sbp: 95,
    hr: 110,
    comorbidity: 'cardiac',
    diagnosis: 'other',
    stigmata: 'blood_vessel',
  });
  
  return (
    <div className="ui-shell">
      <div className="ui-page space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
          <Badge variant="outline" className="bg-[#C9A86C]/16 text-[#C9A86C] border-[#C9A86C]/30">
            <Activity className="h-3 w-3 mr-1" />
            Clinical Pathway
          </Badge>
          <Badge variant="outline" className="bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28">
            <Clock className="h-3 w-3 mr-1" />
            ~{flow.estimatedTime} min
          </Badge>
        </div>
      </div>
      
      {/* Flow Title */}
      <Card className="bg-gradient-to-r from-[#364A5E]/95 to-[#2D3E50]/95 border-[#C9A86C]/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#E8E0D5]">{flow.title}</h2>
              <p className="text-[#C9A86C] text-sm mt-1">{flow.entryPoint}</p>
            </div>
            <Activity className="h-12 w-12 text-[#C9A86C] opacity-50" />
          </div>
        </CardContent>
      </Card>
      
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#A0B0BC]">
          Progress: {visitedNodes.length}/{flow.nodes.length} nodes
          {flowSnapshot ? ` • ${flowSnapshot.decisionsMade} decisions` : ''}
        </span>
        <Progress value={progress} className="flex-1 h-2 bg-[#253545]" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-[#A0B0BC] hover:text-[#E8E0D5]"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Session Snapshot */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#8FD5D5]" />
              <span className="text-sm font-medium text-[#E8E0D5]">Session Snapshot</span>
            </div>
            <Badge variant="outline" className={flowScoreMeta.className}>
              {flowSnapshot ? `${flowSnapshot.scorePercent}% • ${flowScoreMeta.label}` : flowScoreMeta.label}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <div className="rounded-md bg-[#2D3E50] p-2">
              <p className="text-[#A0B0BC]">Decisions</p>
              <p className="font-semibold text-[#E8E0D5]">
                {flowSnapshot ? flowSnapshot.decisionsMade : Math.max(0, visitedNodes.length - 1)}
              </p>
            </div>
            <div className="rounded-md bg-[#2D3E50] p-2">
              <p className="text-[#A0B0BC]">Alignment</p>
              <p className="font-semibold text-[#9FC3BC]">
                {flowSnapshot?.alignmentPercent !== null && flowSnapshot?.alignmentPercent !== undefined
                  ? `${flowSnapshot.alignmentPercent}%`
                  : '—'}
              </p>
            </div>
            <div className="rounded-md bg-[#2D3E50] p-2">
              <p className="text-[#A0B0BC]">Drift</p>
              <p className="font-semibold text-[#EAB7B7]">
                {flowSnapshot ? flowSnapshot.driftDecisions : '—'}
              </p>
            </div>
            <div className="rounded-md bg-[#2D3E50] p-2">
              <p className="text-[#A0B0BC]">Coverage</p>
              <p className="font-semibold text-[#D8BE90]">
                {flowSnapshot?.branchCoveragePercent !== null && flowSnapshot?.branchCoveragePercent !== undefined
                  ? `${flowSnapshot.branchCoveragePercent}%`
                  : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Path Trail */}
      <div className="flex items-center gap-1 flex-wrap">
        {visitedNodes.map((nodeId, idx) => {
          const node = flow.nodes.find(n => n.id === nodeId);
          return (
            <div key={nodeId} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${nodeId === currentNodeId ? 'text-[#C9A86C]' : 'text-[#6B7A88]'}`}
                onClick={() => setCurrentNodeId(nodeId)}
              >
                {node?.title.substring(0, 20)}...
              </Button>
              {idx < visitedNodes.length - 1 && (
                <ChevronRight className="h-3 w-3 text-[#6B7A88]" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Current Node Card */}
      {currentNode && (
        <Card className={`bg-[#364A5E] border-2 ${
          currentNode.isEmergency ? 'border-[#E57373]/40' : 'border-[rgba(91,179,179,0.15)]'
        }`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${nodeColorClass} flex items-center justify-center`}>
                  <NodeIcon className="h-6 w-6 text-[#E8E0D5]" />
                </div>
                <div>
                  <CardTitle className="text-lg text-[#E8E0D5]">{currentNode.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-[#253545]/56">
                      {currentNode.type.toUpperCase()}
                    </Badge>
                    {currentNode.timeframe && (
                      <Badge variant="outline" className="text-xs bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentNode.timeframe}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              {currentNode.isEmergency && (
                <Badge className="bg-[#E57373] text-[#E8E0D5] animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  EMERGENCY
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Node Content */}
            <div className="p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
              <p className="text-[#C9D2DA] whitespace-pre-line leading-relaxed font-mono text-sm">
                {currentNode.content}
              </p>
            </div>
            
            {/* Decision Branches */}
            {outgoingBranches.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#A0B0BC] uppercase tracking-wide">
                  Next Steps
                </h4>
                {outgoingBranches.map((branch) => {
                  const targetNode = flow.nodes.find(n => n.id === branch.toNodeId);
                  const TargetIcon = targetNode ? nodeTypeIcons[targetNode.type] : ChevronRight;
                  
                  return (
                    <div
                      key={`${branch.fromNodeId}-${branch.toNodeId}`}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer
                        ${branch.label === 'yes' 
                          ? 'bg-[#5BB3B3]/10 border-[#5BB3B3]/28 hover:border-[#5BB3B3]'
                          : branch.label === 'no'
                          ? 'bg-[#E57373]/10 border-[#E57373]/28 hover:border-[#E57373]'
                          : 'bg-[#5BB3B3]/10 border-[#5BB3B3]/28 hover:border-[#5BB3B3]'
                        }`}
                      onClick={() => handleNavigate(branch.toNodeId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            branch.label === 'yes' 
                              ? 'bg-[#5BB3B3]/16'
                              : branch.label === 'no'
                              ? 'bg-[#E57373]/18'
                              : 'bg-[#5BB3B3]/16'
                          }`}>
                            {branch.label === 'yes' ? (
                              <CheckCircle className="h-4 w-4 text-[#8FD5D5]" />
                            ) : branch.label === 'no' ? (
                              <XCircle className="h-4 w-4 text-[#EAA0A0]" />
                            ) : (
                              <TargetIcon className="h-4 w-4 text-[#8FD5D5]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#E8E0D5]">{branch.condition}</p>
                            {branch.explanation && (
                              <p className="text-sm text-[#A0B0BC] mt-1">{branch.explanation}</p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#A0B0BC]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Back Button */}
            {visitedNodes.length > 1 && (
              <Button
                variant="outline"
                className="w-full border-[rgba(91,179,179,0.18)] text-[#C9D2DA]"
                onClick={handleGoBack}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Scoring Systems */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowScoring(!showScoring)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#D8BE90]" />
              Scoring Calculators
            </div>
            {showScoring ? (
              <ChevronUp className="h-5 w-5 text-[#A0B0BC]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#A0B0BC]" />
            )}
          </CardTitle>
        </CardHeader>
        {showScoring && (
          <CardContent className="space-y-4">
            {/* Score Selector */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeScorer === 'blatchford' ? 'default' : 'outline'}
                className={activeScorer === 'blatchford' 
                  ? 'bg-[#5BB3B3] text-[#E8E0D5]' 
                  : 'border-[#5BB3B3]/28 text-[#8FD5D5]'}
                onClick={() => setActiveScorer(activeScorer === 'blatchford' ? null : 'blatchford')}
              >
                <Droplets className="h-4 w-4 mr-2" />
                Glasgow-Blatchford
              </Button>
              <Button
                variant={activeScorer === 'rockall' ? 'default' : 'outline'}
                className={activeScorer === 'rockall' 
                  ? 'bg-[#C9A86C] text-[#E8E0D5]' 
                  : 'border-[#C9A86C]/30 text-[#C9A86C]'}
                onClick={() => setActiveScorer(activeScorer === 'rockall' ? null : 'rockall')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Rockall Score
              </Button>
            </div>
            
            {/* Blatchford Score Display */}
            {activeScorer === 'blatchford' && (
              <div className="p-4 rounded-lg bg-[#5BB3B3]/10 border border-[#5BB3B3]/16 space-y-4">
                <h4 className="font-medium text-[#9FC3BC]">Glasgow-Blatchford Score (Pre-Endoscopy)</h4>
                <p className="text-sm text-[#A0B0BC]">{flow.scoringSystems[0].purpose}</p>
                
                {/* Components Table */}
                <div className="space-y-2">
                  {flow.scoringSystems[0].components.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                      <p className="font-medium text-[#E8E0D5] mb-2">{comp.parameter}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {comp.scoring.map((s, sidx) => (
                          <div key={sidx} className="flex justify-between text-[#A0B0BC]">
                            <span>{s.condition}</span>
                            <span className="text-[#8FD5D5]">+{s.points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Interpretation */}
                <div className="p-3 rounded bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                  <p className="font-medium text-[#E8E0D5] mb-2">Interpretation</p>
                  <div className="space-y-1 text-sm">
                    {flow.scoringSystems[0].interpretation.map((interp, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-[#A0B0BC]">Score {interp.range}</span>
                        <span className="text-[#9FC3BC]">{interp.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Demo Calculation */}
                <div className="p-3 rounded bg-[#5BB3B3]/16 border border-[#5BB3B3]/28">
                  <p className="font-medium text-[#B8DCDD] mb-2">Example Calculation</p>
                  <p className="text-sm text-[#C9D2DA]">
                    BUN 15 mmol/L, Hb 9.5 g/dL (male), SBP 95, Pulse 110, Melena present
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge className="bg-[#5BB3B3] text-[#E8E0D5] text-lg">
                      Score: {demoBlatchford.score}
                    </Badge>
                    <span className="text-[#B8DCDD]">{demoBlatchford.risk}</span>
                  </div>
                  <p className="text-sm text-[#9FC3BC] mt-2">{demoBlatchford.recommendation}</p>
                </div>
              </div>
            )}
            
            {/* Rockall Score Display */}
            {activeScorer === 'rockall' && (
              <div className="p-4 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/24 space-y-4">
                <h4 className="font-medium text-[#C9A86C]">Complete Rockall Score (Post-Endoscopy)</h4>
                <p className="text-sm text-[#A0B0BC]">{flow.scoringSystems[1].purpose}</p>
                
                {/* Components Table */}
                <div className="space-y-2">
                  {flow.scoringSystems[1].components.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                      <p className="font-medium text-[#E8E0D5] mb-2">{comp.parameter}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {comp.scoring.map((s, sidx) => (
                          <div key={sidx} className="flex justify-between text-[#A0B0BC]">
                            <span>{s.condition}</span>
                            <span className="text-[#C9A86C]">+{s.points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Interpretation */}
                <div className="p-3 rounded bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                  <p className="font-medium text-[#E8E0D5] mb-2">Interpretation</p>
                  <div className="space-y-1 text-sm">
                    {flow.scoringSystems[1].interpretation.map((interp, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-[#A0B0BC]">Score {interp.range}</span>
                        <div className="text-right">
                          <span className="text-[#C9A86C]">{interp.meaning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Demo Calculation */}
                <div className="p-3 rounded bg-[#C9A86C]/16 border border-[#C9A86C]/30">
                  <p className="font-medium text-[#C9A86C] mb-2">Example Calculation</p>
                  <p className="text-sm text-[#C9D2DA]">
                    65 years old, SBP 95, HR 110, Cardiac disease, Non-MW diagnosis, Blood/vessel seen
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge className="bg-[#C9A86C] text-[#E8E0D5] text-lg">
                      Score: {demoRockall.score}
                    </Badge>
                    <div className="text-sm">
                      <span className="text-[#EAB7B7]">Rebleed: {demoRockall.rebleedRisk}</span>
                      <span className="text-[#6B7A88] mx-2">•</span>
                      <span className="text-[#C9A86C]">Mortality: {demoRockall.mortalityRisk}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      {/* Pre-defined Pathways */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowPathways(!showPathways)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#8FD5D5]" />
              Common Pathways ({flow.pathways.length})
            </div>
            {showPathways ? (
              <ChevronUp className="h-5 w-5 text-[#A0B0BC]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#A0B0BC]" />
            )}
          </CardTitle>
        </CardHeader>
        {showPathways && (
          <CardContent className="space-y-3">
            {flow.pathways.map((pathway, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.15)]">
                <h4 className="font-medium text-[#E8E0D5] mb-1">{pathway.name}</h4>
                <p className="text-sm text-[#A0B0BC] mb-3">{pathway.description}</p>
                <div className="flex flex-wrap gap-1">
                  {pathway.nodeSequence.map((nodeId, nidx) => {
                    return (
                      <div key={nodeId} className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`text-xs cursor-pointer hover:bg-[#253545] ${
                            visitedNodes.includes(nodeId) 
                              ? 'bg-[#5BB3B3]/16 text-[#9FC3BC] border-[#5BB3B3]/28' 
                              : 'bg-[#253545]/56 text-[#A0B0BC] border-[rgba(91,179,179,0.18)]'
                          }`}
                          onClick={() => handleNavigate(nodeId)}
                        >
                          {nodeId}
                        </Badge>
                        {nidx < pathway.nodeSequence.length - 1 && (
                          <ChevronRight className="h-3 w-3 text-[#6B7A88] mx-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
      
      {/* Emergency Flags */}
      <Card className="bg-[#364A5E] border-[#E57373]/28">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowEmergency(!showEmergency)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#EAA0A0]" />
              Emergency Flags ({flow.emergencyFlags.length})
            </div>
            {showEmergency ? (
              <ChevronUp className="h-5 w-5 text-[#A0B0BC]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#A0B0BC]" />
            )}
          </CardTitle>
        </CardHeader>
        {showEmergency && (
          <CardContent className="space-y-3">
            {flow.emergencyFlags.map((flag, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#E57373]/10 border border-[#E57373]/18">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-[#EAA0A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#EAB7B7]">{flag.condition}</p>
                    <p className="text-sm text-[#E8E0D5] mt-1">{flag.action}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#A0B0BC]">
                      <span><Clock className="h-3 w-3 inline mr-1" />{flag.timeframe}</span>
                    </div>
                    <p className="text-xs text-[#6B7A88] mt-1">{flag.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
      
      {/* Clinical Pearls & Pitfalls */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#D8BE90]" />
              Clinical Pearls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {flow.clinicalPearls.map((pearl, idx) => (
                <li key={idx} className="text-[#C9D2DA]">{pearl}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#EAA0A0]" />
              Common Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {flow.commonPitfalls.map((pitfall, idx) => (
                <li key={idx} className="text-[#C9D2DA]">{pitfall}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* References */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#8FD5D5]" />
            References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-[#A0B0BC]">
            {flow.references.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
