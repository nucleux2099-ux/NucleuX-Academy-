'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle, Lightbulb, Clock, ChevronRight, ChevronUp, ChevronDown,
  TrendingUp, BookOpen,
} from 'lucide-react';

interface Pathway {
  name: string; description: string; nodeSequence: string[];
}
interface EmergencyFlag {
  condition: string; action: string; timeframe: string; rationale: string;
}

interface PathwaysPanelProps {
  pathways: Pathway[];
  visitedNodes: string[];
  onNavigate: (nodeId: string) => void;
}

export function PathwaysPanel({ pathways, visitedNodes, onNavigate }: PathwaysPanelProps) {
  const [show, setShow] = useState(false);
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader className="cursor-pointer" onClick={() => setShow(!show)}>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Common Pathways ({pathways.length})
          </div>
          {show ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </CardTitle>
      </CardHeader>
      {show && (
        <CardContent className="space-y-3">
          {pathways.map((pathway, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[#0D1B2A] border border-gray-700">
              <h4 className="font-medium text-white mb-1">{pathway.name}</h4>
              <p className="text-sm text-gray-400 mb-3">{pathway.description}</p>
              <div className="flex flex-wrap gap-1">
                {pathway.nodeSequence.map((nodeId, nidx) => (
                  <div key={nodeId} className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`text-xs cursor-pointer hover:bg-gray-700 ${
                        visitedNodes.includes(nodeId)
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-gray-700/50 text-gray-400 border-gray-600'
                      }`}
                      onClick={() => onNavigate(nodeId)}
                    >
                      {nodeId}
                    </Badge>
                    {nidx < pathway.nodeSequence.length - 1 && <ChevronRight className="h-3 w-3 text-gray-600 mx-1" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

interface EmergencyFlagsPanelProps {
  flags: EmergencyFlag[];
}

export function EmergencyFlagsPanel({ flags }: EmergencyFlagsPanelProps) {
  const [show, setShow] = useState(false);
  return (
    <Card className="bg-[#1A2332] border-red-500/30">
      <CardHeader className="cursor-pointer" onClick={() => setShow(!show)}>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" /> Emergency Flags ({flags.length})
          </div>
          {show ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </CardTitle>
      </CardHeader>
      {show && (
        <CardContent className="space-y-3">
          {flags.map((flag, idx) => (
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
  );
}

interface ClinicalPearlsPanelProps {
  pearls: string[];
  pitfalls: string[];
  references: string[];
}

export function ClinicalPearlsPanel({ pearls, pitfalls, references }: ClinicalPearlsPanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Clinical Pearls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {pearls.map((pearl, idx) => <li key={idx} className="text-gray-300">{pearl}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" /> Common Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {pitfalls.map((pitfall, idx) => <li key={idx} className="text-gray-300">{pitfall}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" /> References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-gray-400">
            {references.map((ref, idx) => <li key={idx}>{ref}</li>)}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
