'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Stethoscope, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { EXAM_SYSTEMS } from './constants';
import type { CaseData, ExaminationFinding } from './types';

interface PhysicalExamProps {
  caseData: CaseData;
  examinedAreas: string[];
  selectedSystem: string;
  onSelectSystem: (sys: string) => void;
  onExamine: (finding: ExaminationFinding) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PhysicalExam({
  caseData, examinedAreas, selectedSystem, onSelectSystem,
  onExamine, onNext, onBack,
}: PhysicalExamProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-emerald-400" />
          Physical Examination
        </CardTitle>
        <CardDescription>Select body systems to examine. Classic signs earn bonus points.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {EXAM_SYSTEMS.map(sys => {
            const findingsInSys = caseData.examination.filter(f => f.system === sys.id);
            const examinedInSys = findingsInSys.filter(f => examinedAreas.includes(f.id)).length;
            const SysIcon = sys.icon;
            return (
              <Button
                key={sys.id}
                variant={selectedSystem === sys.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectSystem(sys.id)}
                className={selectedSystem === sys.id
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/30'
                  : 'border-gray-600 text-gray-400 hover:text-gray-300'
                }
              >
                <SysIcon className={`h-4 w-4 mr-1 ${sys.color}`} />
                {sys.label}
                <Badge className="ml-2 bg-gray-700 text-gray-300" variant="secondary">
                  {examinedInSys}/{findingsInSys.length}
                </Badge>
              </Button>
            );
          })}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {caseData.examination
              .filter(f => f.system === selectedSystem)
              .map(finding => {
                const isExamined = examinedAreas.includes(finding.id);
                return (
                  <div
                    key={finding.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isExamined
                        ? 'bg-[#0D1B2A] border-emerald-500/30'
                        : 'bg-[#0D1B2A] border-gray-700 hover:border-emerald-500/50 cursor-pointer'
                    }`}
                    onClick={() => !isExamined && onExamine(finding)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isExamined ? 'text-emerald-400' : 'text-white'}`}>
                            {isExamined ? '✓ ' : ''}{finding.area}
                          </p>
                          {finding.isClassic && (
                            <Badge className="bg-amber-500/20 text-amber-300 text-xs">Classic Sign</Badge>
                          )}
                        </div>
                        {isExamined && (
                          <div className="mt-2 p-3 rounded bg-gray-800/50">
                            <p className={`text-sm ${finding.isPositive ? 'text-amber-300' : 'text-gray-400'}`}>
                              {finding.finding}
                            </p>
                            {finding.textbookRef && (
                              <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {finding.textbookRef}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {!isExamined && (
                        <Badge className="shrink-0 bg-emerald-500/20 text-emerald-300">+{finding.points}</Badge>
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
            Proceed to Investigations <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
