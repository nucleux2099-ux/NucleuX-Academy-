'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { 
  upperGIBleedingFlow, 
  calculateBlatchfordScore,
  calculateRockallScore,
} from '@/lib/data/templates/patient-flow-template';
import {
  FlowHeader, CurrentNodeCard, ScoringCalculators,
  PathwaysPanel, EmergencyFlagsPanel, ClinicalPearlsPanel,
} from '@/components/exam-flow';

export default function PatientFlowPage() {
  const params = useParams();
  const _flowId = params.flowId as string;

  const [currentNodeId, setCurrentNodeId] = useState('N1');
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['N1']);

  const flow = upperGIBleedingFlow;

  const currentNode = useMemo(() => flow.nodes.find(n => n.id === currentNodeId), [currentNodeId, flow.nodes]);
  const outgoingBranches = useMemo(() => flow.branches.filter(b => b.fromNodeId === currentNodeId), [currentNodeId, flow.branches]);
  const progress = useMemo(() => (visitedNodes.length / flow.nodes.length) * 100, [visitedNodes.length, flow.nodes.length]);

  const handleNavigate = (toNodeId: string) => {
    setCurrentNodeId(toNodeId);
    if (!visitedNodes.includes(toNodeId)) setVisitedNodes([...visitedNodes, toNodeId]);
  };

  const handleReset = () => { setCurrentNodeId('N1'); setVisitedNodes(['N1']); };

  const handleGoBack = () => {
    if (visitedNodes.length > 1) {
      const newVisited = visitedNodes.slice(0, -1);
      setVisitedNodes(newVisited);
      setCurrentNodeId(newVisited[newVisited.length - 1]);
    }
  };

  const demoBlatchford = calculateBlatchfordScore({
    bunMmol: 15, hbGdl: 9.5, isMale: true, sbp: 95, pulse: 110,
    hasMelena: true, hasSyncope: false, hasHepaticDisease: false, hasCardiacFailure: false,
  });
  const demoRockall = calculateRockallScore({
    age: 65, sbp: 95, hr: 110, comorbidity: 'cardiac',
    diagnosis: 'other', stigmata: 'blood_vessel',
  });

  return (
    <div className="space-y-6">
      <FlowHeader
        title={flow.title} entryPoint={flow.entryPoint} estimatedTime={flow.estimatedTime}
        visitedCount={visitedNodes.length} totalNodes={flow.nodes.length} progress={progress}
        visitedNodes={visitedNodes} currentNodeId={currentNodeId} nodes={flow.nodes}
        onReset={handleReset} onNavigate={(id) => setCurrentNodeId(id)}
      />

      {currentNode && (
        <CurrentNodeCard
          currentNode={currentNode} outgoingBranches={outgoingBranches}
          allNodes={flow.nodes} canGoBack={visitedNodes.length > 1}
          onNavigate={handleNavigate} onGoBack={handleGoBack}
        />
      )}

      <ScoringCalculators
        scoringSystems={flow.scoringSystems}
        demoBlatchford={demoBlatchford} demoRockall={demoRockall}
      />

      <PathwaysPanel pathways={flow.pathways} visitedNodes={visitedNodes} onNavigate={handleNavigate} />
      <EmergencyFlagsPanel flags={flow.emergencyFlags} />
      <ClinicalPearlsPanel pearls={flow.clinicalPearls} pitfalls={flow.commonPitfalls} references={flow.references} />
    </div>
  );
}
