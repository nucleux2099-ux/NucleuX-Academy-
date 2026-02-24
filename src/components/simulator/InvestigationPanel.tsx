'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Microscope, DollarSign, Timer, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { INVESTIGATION_CATEGORIES } from './constants';
import type { CaseData, Investigation, InvestigationProgress } from './types';

interface InvestigationPanelProps {
  caseData: CaseData;
  orderedInvestigations: string[];
  completedInvestigations: string[];
  investigationProgress: Map<string, InvestigationProgress>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOrderInvestigation: (investigation: Investigation) => void;
  getTotalCost: () => number;
  onNext: () => void;
  onBack: () => void;
}

export function InvestigationPanel({
  caseData, orderedInvestigations, completedInvestigations, investigationProgress,
  selectedCategory, onSelectCategory, onOrderInvestigation, getTotalCost,
  onNext, onBack,
}: InvestigationPanelProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="h-5 w-5 text-blue-400" />
          Investigations
        </CardTitle>
        <CardDescription>Order tests wisely. Unnecessary tests incur penalties. Results appear after processing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cost Warning */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-300">
            <DollarSign className="h-5 w-5" />
            <span>Total Investigation Cost: ₹{getTotalCost().toLocaleString()}</span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-300">
            {orderedInvestigations.length} tests ordered
          </Badge>
        </div>

        <div className="flex gap-2">
          {INVESTIGATION_CATEGORIES.map(cat => {
            const testsInCat = caseData.investigations.filter(i => i.category === cat.id);
            const orderedInCat = testsInCat.filter(i => orderedInvestigations.includes(i.id)).length;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectCategory(cat.id)}
                className={selectedCategory === cat.id
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

        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-2">
            {caseData.investigations
              .filter(inv => inv.category === selectedCategory)
              .map(investigation => {
                const isOrdered = orderedInvestigations.includes(investigation.id);
                const progress = investigationProgress.get(investigation.id);
                const isComplete = completedInvestigations.includes(investigation.id);
                return (
                  <div
                    key={investigation.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isOrdered
                        ? 'bg-[#0D1B2A] border-blue-500/30'
                        : 'bg-[#0D1B2A] border-gray-700 hover:border-blue-500/50 cursor-pointer'
                    }`}
                    onClick={() => !isOrdered && onOrderInvestigation(investigation)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isComplete ? 'text-emerald-400' : isOrdered ? 'text-blue-400' : 'text-white'}`}>
                            {isComplete ? '✓ ' : ''}{investigation.name}
                          </p>
                          {investigation.isEssential && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">Essential</Badge>
                          )}
                          {investigation.isUnnecessary && isOrdered && (
                            <Badge className="bg-red-500/20 text-red-300 text-xs">Unnecessary</Badge>
                          )}
                        </div>
                        {progress && progress.status === 'processing' && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                              <Timer className="h-3 w-3 animate-pulse" />
                              Processing... {Math.round(progress.progress)}%
                            </div>
                            <Progress value={progress.progress} className="h-1 bg-gray-700" />
                          </div>
                        )}
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
                              <p className="text-xs text-gray-500 mt-2">Normal: {investigation.normalRange}</p>
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
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30" onClick={onNext}>
            Proceed to Management <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
