'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Droplets, Heart, ChevronUp, ChevronDown } from 'lucide-react';

interface ScoringSystem {
  purpose: string;
  components: Array<{ parameter: string; scoring: Array<{ condition: string; points: number }> }>;
  interpretation: Array<{ range: string; meaning: string }>;
}

interface ScoringCalculatorsProps {
  scoringSystems: ScoringSystem[];
  demoBlatchford: { score: number; risk: string; recommendation: string };
  demoRockall: { score: number; rebleedRisk: string; mortalityRisk: string };
}

export function ScoringCalculators({ scoringSystems, demoBlatchford, demoRockall }: ScoringCalculatorsProps) {
  const [showScoring, setShowScoring] = useState(false);
  const [activeScorer, setActiveScorer] = useState<'blatchford' | 'rockall' | null>(null);

  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader className="cursor-pointer" onClick={() => setShowScoring(!showScoring)}>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-amber-400" /> Scoring Calculators
          </div>
          {showScoring ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </CardTitle>
      </CardHeader>
      {showScoring && (
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={activeScorer === 'blatchford' ? 'default' : 'outline'}
              className={activeScorer === 'blatchford' ? 'bg-blue-500 text-white' : 'border-blue-500/30 text-blue-400'}
              onClick={() => setActiveScorer(activeScorer === 'blatchford' ? null : 'blatchford')}
            >
              <Droplets className="h-4 w-4 mr-2" /> Glasgow-Blatchford
            </Button>
            <Button
              variant={activeScorer === 'rockall' ? 'default' : 'outline'}
              className={activeScorer === 'rockall' ? 'bg-purple-500 text-white' : 'border-purple-500/30 text-purple-400'}
              onClick={() => setActiveScorer(activeScorer === 'rockall' ? null : 'rockall')}
            >
              <Heart className="h-4 w-4 mr-2" /> Rockall Score
            </Button>
          </div>

          {activeScorer === 'blatchford' && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-4">
              <h4 className="font-medium text-blue-300">Glasgow-Blatchford Score (Pre-Endoscopy)</h4>
              <p className="text-sm text-gray-400">{scoringSystems[0].purpose}</p>
              <div className="space-y-2">
                {scoringSystems[0].components.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                    <p className="font-medium text-white mb-2">{comp.parameter}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {comp.scoring.map((s, sidx) => (
                        <div key={sidx} className="flex justify-between text-gray-400">
                          <span>{s.condition}</span><span className="text-blue-400">+{s.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                <p className="font-medium text-white mb-2">Interpretation</p>
                <div className="space-y-1 text-sm">
                  {scoringSystems[0].interpretation.map((interp, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-400">Score {interp.range}</span>
                      <span className="text-blue-300">{interp.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded bg-blue-500/20 border border-blue-500/30">
                <p className="font-medium text-blue-200 mb-2">Example Calculation</p>
                <p className="text-sm text-gray-300">BUN 15 mmol/L, Hb 9.5 g/dL (male), SBP 95, Pulse 110, Melena present</p>
                <div className="mt-2 flex items-center gap-4">
                  <Badge className="bg-blue-500 text-white text-lg">Score: {demoBlatchford.score}</Badge>
                  <span className="text-blue-200">{demoBlatchford.risk}</span>
                </div>
                <p className="text-sm text-blue-300 mt-2">{demoBlatchford.recommendation}</p>
              </div>
            </div>
          )}

          {activeScorer === 'rockall' && (
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 space-y-4">
              <h4 className="font-medium text-purple-300">Complete Rockall Score (Post-Endoscopy)</h4>
              <p className="text-sm text-gray-400">{scoringSystems[1].purpose}</p>
              <div className="space-y-2">
                {scoringSystems[1].components.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                    <p className="font-medium text-white mb-2">{comp.parameter}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {comp.scoring.map((s, sidx) => (
                        <div key={sidx} className="flex justify-between text-gray-400">
                          <span>{s.condition}</span><span className="text-purple-400">+{s.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded bg-[#0D1B2A] border border-gray-700">
                <p className="font-medium text-white mb-2">Interpretation</p>
                <div className="space-y-1 text-sm">
                  {scoringSystems[1].interpretation.map((interp, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-400">Score {interp.range}</span>
                      <span className="text-purple-300">{interp.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded bg-purple-500/20 border border-purple-500/30">
                <p className="font-medium text-purple-200 mb-2">Example Calculation</p>
                <p className="text-sm text-gray-300">65 years old, SBP 95, HR 110, Cardiac disease, Non-MW diagnosis, Blood/vessel seen</p>
                <div className="mt-2 flex items-center gap-4">
                  <Badge className="bg-purple-500 text-white text-lg">Score: {demoRockall.score}</Badge>
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
  );
}
