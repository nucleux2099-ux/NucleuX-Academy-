'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, Clock, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  AlertCircle, CircleDot, Stethoscope, Syringe, Target,
} from 'lucide-react';

const nodeTypeIcons: Record<string, React.ElementType> = {
  entry: AlertCircle, decision: CircleDot, investigation: Stethoscope,
  treatment: Syringe, diagnosis: Target, endpoint: CheckCircle,
};

const nodeTypeColors: Record<string, string> = {
  entry: 'from-red-500 to-orange-500', decision: 'from-blue-500 to-cyan-500',
  investigation: 'from-purple-500 to-pink-500', treatment: 'from-emerald-500 to-teal-500',
  diagnosis: 'from-amber-500 to-yellow-500', endpoint: 'from-green-500 to-emerald-500',
};

interface FlowNode {
  id: string; title: string; type: string; content: string;
  isEmergency?: boolean; timeframe?: string;
}
interface FlowBranch {
  fromNodeId: string; toNodeId: string; condition: string;
  label?: string; explanation?: string;
}

interface CurrentNodeCardProps {
  currentNode: FlowNode;
  outgoingBranches: FlowBranch[];
  allNodes: FlowNode[];
  canGoBack: boolean;
  onNavigate: (nodeId: string) => void;
  onGoBack: () => void;
}

export function CurrentNodeCard({
  currentNode, outgoingBranches, allNodes, canGoBack, onNavigate, onGoBack,
}: CurrentNodeCardProps) {
  const NodeIcon = nodeTypeIcons[currentNode.type] || CircleDot;
  const nodeColorClass = nodeTypeColors[currentNode.type] || 'from-gray-500 to-gray-600';

  return (
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
                    <Clock className="h-3 w-3 mr-1" />{currentNode.timeframe}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          {currentNode.isEmergency && (
            <Badge className="bg-red-500 text-white animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" /> EMERGENCY
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
          <p className="text-gray-300 whitespace-pre-line leading-relaxed font-mono text-sm">
            {currentNode.content}
          </p>
        </div>

        {outgoingBranches.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Next Steps</h4>
            {outgoingBranches.map((branch) => {
              const targetNode = allNodes.find(n => n.id === branch.toNodeId);
              const TargetIcon = targetNode ? nodeTypeIcons[targetNode.type] || ChevronRight : ChevronRight;
              return (
                <div
                  key={`${branch.fromNodeId}-${branch.toNodeId}`}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    branch.label === 'yes'
                      ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500'
                      : branch.label === 'no'
                      ? 'bg-red-500/10 border-red-500/30 hover:border-red-500'
                      : 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500'
                  }`}
                  onClick={() => onNavigate(branch.toNodeId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        branch.label === 'yes' ? 'bg-emerald-500/20'
                        : branch.label === 'no' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      }`}>
                        {branch.label === 'yes' ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                        : branch.label === 'no' ? <XCircle className="h-4 w-4 text-red-400" />
                        : <TargetIcon className="h-4 w-4 text-blue-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{branch.condition}</p>
                        {branch.explanation && <p className="text-sm text-gray-400 mt-1">{branch.explanation}</p>}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {canGoBack && (
          <Button variant="outline" className="w-full border-gray-600 text-gray-300" onClick={onGoBack}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
