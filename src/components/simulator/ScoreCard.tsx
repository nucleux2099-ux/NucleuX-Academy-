'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ClipboardList } from 'lucide-react';
import type { CaseData, SimulatorState } from './types';

interface ScoreCardProps {
  state: SimulatorState;
  caseData: CaseData;
  totalScore: number;
}

export function ScoreCard({ state, caseData, totalScore }: ScoreCardProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          Live Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center py-4">
          <p className="text-4xl font-bold text-emerald-400">{totalScore}</p>
          <p className="text-sm text-gray-400">/ {caseData.scoring.totalMaxPoints} max</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">History</span>
            <span className="text-amber-400">{state.score.history}/{caseData.scoring.maxHistoryPoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Examination</span>
            <span className="text-emerald-400">{state.score.examination}/{caseData.scoring.maxExamPoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Investigations</span>
            <span className="text-blue-400">{state.score.investigations}/{caseData.scoring.maxInvestigationPoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Diagnosis</span>
            <span className="text-purple-400">{state.score.diagnosis}/{caseData.scoring.diagnosisPoints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Management</span>
            <span className="text-pink-400">{state.score.management}/{caseData.scoring.managementPoints}</span>
          </div>
          {state.score.penalties > 0 && (
            <div className="flex justify-between text-red-400">
              <span>Penalties</span>
              <span>-{state.score.penalties}</span>
            </div>
          )}
        </div>
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Pass: {caseData.scoring.passingScore}</span>
            <span className="text-gray-400">Excellent: {caseData.scoring.excellentScore}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProgressSummaryProps {
  state: SimulatorState;
  caseData: CaseData;
}

export function ProgressSummary({ state, caseData }: ProgressSummaryProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-blue-400" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Questions asked</span>
          <span className="text-white">{state.askedQuestions.length}/{caseData.history.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Areas examined</span>
          <span className="text-white">{state.examinedAreas.length}/{caseData.examination.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Tests ordered</span>
          <span className="text-white">{state.orderedInvestigations.length}/{caseData.investigations.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Tests completed</span>
          <span className="text-white">{state.completedInvestigations.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
