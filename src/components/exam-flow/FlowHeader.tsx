'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, ArrowLeft, RotateCcw, ChevronRight } from 'lucide-react';

interface FlowHeaderProps {
  title: string;
  entryPoint: string;
  estimatedTime: number;
  visitedCount: number;
  totalNodes: number;
  progress: number;
  visitedNodes: string[];
  currentNodeId: string;
  nodes: Array<{ id: string; title: string }>;
  onReset: () => void;
  onNavigate: (nodeId: string) => void;
}

export function FlowHeader({
  title, entryPoint, estimatedTime, visitedCount, totalNodes,
  progress, visitedNodes, currentNodeId, nodes, onReset, onNavigate,
}: FlowHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/exam-centre">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Exam Centre
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Activity className="h-3 w-3 mr-1" /> Clinical Pathway
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Clock className="h-3 w-3 mr-1" /> ~{estimatedTime} min
          </Badge>
        </div>
      </div>

      {/* Title */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-purple-200 text-sm mt-1">{entryPoint}</p>
            </div>
            <Activity className="h-12 w-12 text-purple-400 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Progress: {visitedCount}/{totalNodes} nodes</span>
        <Progress value={progress} className="flex-1 h-2 bg-gray-700" />
        <Button variant="ghost" size="sm" onClick={onReset} className="text-gray-400 hover:text-white">
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>

      {/* Path Trail */}
      <div className="flex items-center gap-1 flex-wrap">
        {visitedNodes.map((nodeId, idx) => {
          const node = nodes.find(n => n.id === nodeId);
          return (
            <div key={nodeId} className="flex items-center">
              <Button
                variant="ghost" size="sm"
                className={`text-xs ${nodeId === currentNodeId ? 'text-purple-400' : 'text-gray-500'}`}
                onClick={() => onNavigate(nodeId)}
              >
                {node?.title.substring(0, 20)}...
              </Button>
              {idx < visitedNodes.length - 1 && <ChevronRight className="h-3 w-3 text-gray-600" />}
            </div>
          );
        })}
      </div>
    </>
  );
}
