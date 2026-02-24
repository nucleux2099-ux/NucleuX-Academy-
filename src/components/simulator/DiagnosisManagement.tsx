'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pill, Brain, ChevronLeft, CheckCircle2 } from 'lucide-react';
import type { CaseData, ManagementOption } from './types';

interface DiagnosisManagementProps {
  caseData: CaseData;
  selectedDiagnosis: string | null;
  selectedManagement: string[];
  onSelectDiagnosis: (diagnosisId: string) => void;
  onSelectManagement: (option: ManagementOption) => void;
  onComplete: () => void;
  onBack: () => void;
}

export function DiagnosisManagement({
  caseData, selectedDiagnosis, selectedManagement,
  onSelectDiagnosis, onSelectManagement, onComplete, onBack,
}: DiagnosisManagementProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-purple-400" />
          Diagnosis & Management
        </CardTitle>
        <CardDescription>Make your diagnosis and select appropriate management steps.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Diagnosis */}
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Brain className="h-4 w-4 text-amber-400" />
            What is your diagnosis?
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedDiagnosis === caseData.diagnosis.primary.id
                  ? 'bg-emerald-500/20 border-emerald-500/50'
                  : 'bg-[#0D1B2A] border-gray-700 hover:border-emerald-500/30'
              }`}
              onClick={() => onSelectDiagnosis(caseData.diagnosis.primary.id)}
            >
              <p className={`font-medium ${
                selectedDiagnosis === caseData.diagnosis.primary.id ? 'text-emerald-400' : 'text-white'
              }`}>
                {selectedDiagnosis === caseData.diagnosis.primary.id && '✓ '}
                {caseData.diagnosis.primary.name}
              </p>
            </div>
            {caseData.diagnosis.differentials.map(diff => (
              <div
                key={diff.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedDiagnosis === diff.id
                    ? 'bg-amber-500/20 border-amber-500/50'
                    : 'bg-[#0D1B2A] border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => onSelectDiagnosis(diff.id)}
              >
                <p className={`font-medium ${
                  selectedDiagnosis === diff.id ? 'text-amber-400' : 'text-white'
                }`}>
                  {selectedDiagnosis === diff.id && '○ '}
                  {diff.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Management */}
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Pill className="h-4 w-4 text-purple-400" />
            Select management steps (multiple allowed)
          </h4>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {caseData.management.map(option => {
                const isSelected = selectedManagement.includes(option.id);
                const typeColors: Record<string, string> = {
                  immediate: 'text-red-400',
                  definitive: 'text-emerald-400',
                  supportive: 'text-blue-400',
                  wrong: 'text-gray-400',
                };
                return (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? option.isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500/50'
                          : 'bg-red-500/20 border-red-500/50'
                        : 'bg-[#0D1B2A] border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => onSelectManagement(option)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isSelected ? (option.isCorrect ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
                            {isSelected && (option.isCorrect ? '✓ ' : '✗ ')}
                            {option.action}
                          </p>
                          <Badge className={`text-xs ${typeColors[option.type]} bg-transparent`}>
                            {option.type}
                          </Badge>
                        </div>
                        {isSelected && (
                          <p className="text-sm text-gray-400 mt-1">{option.explanation}</p>
                        )}
                      </div>
                      {!isSelected && (
                        <Badge className={`shrink-0 ${
                          option.isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {option.isCorrect ? `+${option.points}` : option.penalty ? `-${option.penalty}` : '0'}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
            onClick={onComplete}
            disabled={!selectedDiagnosis || selectedManagement.length === 0}
          >
            Submit & View Results <CheckCircle2 className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
