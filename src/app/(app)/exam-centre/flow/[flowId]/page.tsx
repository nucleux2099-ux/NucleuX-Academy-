'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

const nodeTypeIcons: Record<string, React.ElementType> = {
  entry: AlertCircle,
  decision: CircleDot,
  investigation: Stethoscope,
  treatment: Syringe,
  diagnosis: Target,
  endpoint: CheckCircle,
};

const nodeTypeColors: Record<string, string> = {
  entry: 'from-red-500 to-orange-500',
  decision: 'from-blue-500 to-cyan-500',
  investigation: 'from-purple-500 to-pink-500',
  treatment: 'from-emerald-500 to-teal-500',
  diagnosis: 'from-amber-500 to-yellow-500',
  endpoint: 'from-green-500 to-emerald-500',
};

export default function PatientFlowPage() {
  const params = useParams();
  const _flowId = params.flowId as string;
  
  const [currentNodeId, setCurrentNodeId] = useState('N1');
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['N1']);
  const [showScoring, setShowScoring] = useState(false);
  const [activeScorer, setActiveScorer] = useState<'blatchford' | 'rockall' | null>(null);
  const [showPathways, setShowPathways] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  
  const flow = upperGIBleedingFlow;
  
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
  
  const handleNavigate = (toNodeId: string) => {
    setCurrentNodeId(toNodeId);
    if (!visitedNodes.includes(toNodeId)) {
      setVisitedNodes([...visitedNodes, toNodeId]);
    }
  };
  
  const handleReset = () => {
    setCurrentNodeId('N1');
    setVisitedNodes(['N1']);
    setShowScoring(false);
    setActiveScorer(null);
  };
  
  const handleGoBack = () => {
    if (visitedNodes.length > 1) {
      const newVisited = visitedNodes.slice(0, -1);
      setVisitedNodes(newVisited);
      setCurrentNodeId(newVisited[newVisited.length - 1]);
    }
  };
  
  const NodeIcon = currentNode ? nodeTypeIcons[currentNode.type] : CircleDot;
  const nodeColorClass = currentNode ? nodeTypeColors[currentNode.type] : 'from-gray-500 to-gray-600';
  
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
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Activity className="h-3 w-3 mr-1" />
            Clinical Pathway
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Clock className="h-3 w-3 mr-1" />
            ~{flow.estimatedTime} min
          </Badge>
        </div>
      </div>
      
      {/* Flow Title */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{flow.title}</h2>
              <p className="text-purple-200 text-sm mt-1">{flow.entryPoint}</p>
            </div>
            <Activity className="h-12 w-12 text-purple-400 opacity-50" />
          </div>
        </CardContent>
      </Card>
      
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Progress: {visitedNodes.length}/{flow.nodes.length} nodes</span>
        <Progress value={progress} className="flex-1 h-2 bg-gray-700" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-gray-400 hover:text-white"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
      
      {/* Path Trail */}
      <div className="flex items-center gap-1 flex-wrap">
        {visitedNodes.map((nodeId, idx) => {
          const node = flow.nodes.find(n => n.id === nodeId);
          return (
            <div key={nodeId} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${nodeId === currentNodeId ? 'text-purple-400' : 'text-gray-500'}`}
                onClick={() => setCurrentNodeId(nodeId)}
              >
                {node?.title.substring(0, 20)}...
              </Button>
              {idx < visitedNodes.length - 1 && (
                <ChevronRight className="h-3 w-3 text-gray-600" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Current Node Card */}
      {currentNode && (
        <Card className={`bg-[#1A2332] border-2 ${
          currentNode.isEmergency ? 'border-red-500/50' : 'border-[rgba(91,179,179,0.15)]'
        }`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${nodeColorClass} flex items-center justify-center`}>
                  <NodeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">{currentNode.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-gray-700/50">
                      {currentNode.type.toUpperCase()}
                    </Badge>
                    {currentNode.timeframe && (
                      <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentNode.timeframe}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              {currentNode.isEmergency && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  EMERGENCY
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Node Content */}
            <div className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
              <p className="text-gray-300 whitespace-pre-line leading-relaxed font-mono text-sm">
                {currentNode.content}
              </p>
            </div>
            
            {/* Decision Branches */}
            {outgoingBranches.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
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
                          ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500'
                          : branch.label === 'no'
                          ? 'bg-red-500/10 border-red-500/30 hover:border-red-500'
                          : 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500'
                        }`}
                      onClick={() => handleNavigate(branch.toNodeId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            branch.label === 'yes' 
                              ? 'bg-emerald-500/20'
                              : branch.label === 'no'
                              ? 'bg-red-500/20'
                              : 'bg-blue-500/20'
                          }`}>
                            {branch.label === 'yes' ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : branch.label === 'no' ? (
                              <XCircle className="h-4 w-4 text-red-400" />
                            ) : (
                              <TargetIcon className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{branch.condition}</p>
                            {branch.explanation && (
                              <p className="text-sm text-gray-400 mt-1">{branch.explanation}</p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
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
                className="w-full border-gray-600 text-gray-300"
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
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowScoring(!showScoring)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-400" />
              Scoring Calculators
            </div>
            {showScoring ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        {showScoring && (
          <CardContent className="space-y-4">
            {/* Score Selector */}
            <div className="flex gap-2">
              <Button
                variant={activeScorer === 'blatchford' ? 'default' : 'outline'}
                className={activeScorer === 'blatchford' 
                  ? 'bg-blue-500 text-white' 
                  : 'border-blue-500/30 text-blue-400'}
                onClick={() => setActiveScorer(activeScorer === 'blatchford' ? null : 'blatchford')}
              >
                <Droplets className="h-4 w-4 mr-2" />
                Glasgow-Blatchford
              </Button>
              <Button
                variant={activeScorer === 'rockall' ? 'default' : 'outline'}
                className={activeScorer === 'rockall' 
                  ? 'bg-purple-500 text-white' 
                  : 'border-purple-500/30 text-purple-400'}
                onClick={() => setActiveScorer(activeScorer === 'rockall' ? null : 'rockall')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Rockall Score
              </Button>
            </div>
            
            {/* Blatchford Score Display */}
            {activeScorer === 'blatchford' && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-4">
                <h4 className="font-medium text-blue-300">Glasgow-Blatchford Score (Pre-Endoscopy)</h4>
                <p className="text-sm text-gray-400">{flow.scoringSystems[0].purpose}</p>
                
                {/* Components Table */}
                <div className="space-y-2">
                  {flow.scoringSystems[0].components.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                      <p className="font-medium text-white mb-2">{comp.parameter}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {comp.scoring.map((s, sidx) => (
                          <div key={sidx} className="flex justify-between text-gray-400">
                            <span>{s.condition}</span>
                            <span className="text-blue-400">+{s.points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Interpretation */}
                <div className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                  <p className="font-medium text-white mb-2">Interpretation</p>
                  <div className="space-y-1 text-sm">
                    {flow.scoringSystems[0].interpretation.map((interp, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-400">Score {interp.range}</span>
                        <span className="text-blue-300">{interp.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Demo Calculation */}
                <div className="p-3 rounded bg-blue-500/20 border border-blue-500/30">
                  <p className="font-medium text-blue-200 mb-2">Example Calculation</p>
                  <p className="text-sm text-gray-300">
                    BUN 15 mmol/L, Hb 9.5 g/dL (male), SBP 95, Pulse 110, Melena present
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge className="bg-blue-500 text-white text-lg">
                      Score: {demoBlatchford.score}
                    </Badge>
                    <span className="text-blue-200">{demoBlatchford.risk}</span>
                  </div>
                  <p className="text-sm text-blue-300 mt-2">{demoBlatchford.recommendation}</p>
                </div>
              </div>
            )}
            
            {/* Rockall Score Display */}
            {activeScorer === 'rockall' && (
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 space-y-4">
                <h4 className="font-medium text-purple-300">Complete Rockall Score (Post-Endoscopy)</h4>
                <p className="text-sm text-gray-400">{flow.scoringSystems[1].purpose}</p>
                
                {/* Components Table */}
                <div className="space-y-2">
                  {flow.scoringSystems[1].components.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                      <p className="font-medium text-white mb-2">{comp.parameter}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {comp.scoring.map((s, sidx) => (
                          <div key={sidx} className="flex justify-between text-gray-400">
                            <span>{s.condition}</span>
                            <span className="text-purple-400">+{s.points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Interpretation */}
                <div className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                  <p className="font-medium text-white mb-2">Interpretation</p>
                  <div className="space-y-1 text-sm">
                    {flow.scoringSystems[1].interpretation.map((interp, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-400">Score {interp.range}</span>
                        <div className="text-right">
                          <span className="text-purple-300">{interp.meaning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Demo Calculation */}
                <div className="p-3 rounded bg-purple-500/20 border border-purple-500/30">
                  <p className="font-medium text-purple-200 mb-2">Example Calculation</p>
                  <p className="text-sm text-gray-300">
                    65 years old, SBP 95, HR 110, Cardiac disease, Non-MW diagnosis, Blood/vessel seen
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <Badge className="bg-purple-500 text-white text-lg">
                      Score: {demoRockall.score}
                    </Badge>
                    <div className="text-sm">
                      <span className="text-red-300">Rebleed: {demoRockall.rebleedRisk}</span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-purple-300">Mortality: {demoRockall.mortalityRisk}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      {/* Pre-defined Pathways */}
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowPathways(!showPathways)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Common Pathways ({flow.pathways.length})
            </div>
            {showPathways ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        {showPathways && (
          <CardContent className="space-y-3">
            {flow.pathways.map((pathway, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
                <h4 className="font-medium text-white mb-1">{pathway.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{pathway.description}</p>
                <div className="flex flex-wrap gap-1">
                  {pathway.nodeSequence.map((nodeId, nidx) => {
                    const _node = flow.nodes.find(n => n.id === nodeId);
                    return (
                      <div key={nodeId} className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`text-xs cursor-pointer hover:bg-gray-700 ${
                            visitedNodes.includes(nodeId) 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                              : 'bg-gray-700/50 text-gray-400 border-gray-600'
                          }`}
                          onClick={() => handleNavigate(nodeId)}
                        >
                          {nodeId}
                        </Badge>
                        {nidx < pathway.nodeSequence.length - 1 && (
                          <ChevronRight className="h-3 w-3 text-gray-600 mx-1" />
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
      <Card className="bg-[#1A2332] border-red-500/30">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setShowEmergency(!showEmergency)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Emergency Flags ({flow.emergencyFlags.length})
            </div>
            {showEmergency ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        {showEmergency && (
          <CardContent className="space-y-3">
            {flow.emergencyFlags.map((flag, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-300">{flag.condition}</p>
                    <p className="text-sm text-white mt-1">{flag.action}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span><Clock className="h-3 w-3 inline mr-1" />{flag.timeframe}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{flag.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
      
      {/* Clinical Pearls & Pitfalls */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              Clinical Pearls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {flow.clinicalPearls.map((pearl, idx) => (
                <li key={idx} className="text-gray-300">{pearl}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Common Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {flow.commonPitfalls.map((pitfall, idx) => (
                <li key={idx} className="text-gray-300">{pitfall}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* References */}
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-gray-400">
            {flow.references.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
