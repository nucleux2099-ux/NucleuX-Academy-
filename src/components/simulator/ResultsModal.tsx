'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, Clock, RotateCcw } from 'lucide-react';
import type { CaseData, SimulatorState } from './types';
import { formatTime } from './types';

interface ResultsModalProps {
  caseData: CaseData;
  state: SimulatorState;
  totalScore: number;
  getTotalCost: () => number;
  onReset: () => void;
  onExit: () => void;
}

export function ResultsModal({ caseData, state, totalScore, getTotalCost, onReset, onExit }: ResultsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-amber-400" />
            Simulation Complete!
          </CardTitle>
          <CardDescription>
            Here&apos;s your performance summary for {caseData.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Final Score */}
          <div className="text-center py-6 bg-[#0D1B2A] rounded-lg">
            <p className="text-6xl font-bold text-emerald-400">{totalScore}</p>
            <p className="text-gray-400 mt-1">out of {caseData.scoring.totalMaxPoints}</p>
            <div className="mt-4">
              {totalScore >= caseData.scoring.excellentScore ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 text-lg px-4 py-1">🎉 Excellent!</Badge>
              ) : totalScore >= caseData.scoring.passingScore ? (
                <Badge className="bg-amber-500/20 text-amber-300 text-lg px-4 py-1">✓ Passed</Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-300 text-lg px-4 py-1">Needs Improvement</Badge>
              )}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0D1B2A]">
              <p className="text-amber-400 font-medium">History Taking</p>
              <p className="text-2xl font-bold text-white">{state.score.history}</p>
              <p className="text-sm text-gray-400">{state.askedQuestions.length} questions asked</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0D1B2A]">
              <p className="text-emerald-400 font-medium">Examination</p>
              <p className="text-2xl font-bold text-white">{state.score.examination}</p>
              <p className="text-sm text-gray-400">{state.examinedAreas.length} areas examined</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0D1B2A]">
              <p className="text-blue-400 font-medium">Investigations</p>
              <p className="text-2xl font-bold text-white">{state.score.investigations}</p>
              <p className="text-sm text-gray-400">₹{getTotalCost()} spent</p>
            </div>
            <div className="p-4 rounded-lg bg-[#0D1B2A]">
              <p className="text-purple-400 font-medium">Diagnosis</p>
              <p className="text-2xl font-bold text-white">{state.score.diagnosis}</p>
              <p className="text-sm text-gray-400">
                {state.selectedDiagnosis === caseData.diagnosis.primary.id ? 'Correct!' : 'Partial credit'}
              </p>
            </div>
          </div>

          {/* Correct Answer */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="font-medium text-emerald-300 mb-2">Correct Diagnosis</h4>
            <p className="text-white font-semibold">{caseData.diagnosis.primary.name}</p>
            <p className="text-sm text-gray-300 mt-2">{caseData.diagnosis.primary.explanation}</p>
          </div>

          {/* Textbook References */}
          <div className="space-y-3">
            <h4 className="font-medium text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              Textbook References
            </h4>
            {caseData.textbookReferences.map((ref, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0D1B2A] text-sm">
                <p className="text-blue-400 font-medium">{ref.book}</p>
                <p className="text-gray-400">{ref.chapter} {ref.page && `• Page ${ref.page}`}</p>
                <p className="text-gray-300 mt-1">{ref.keyPoint}</p>
              </div>
            ))}
          </div>

          {/* Time */}
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Time spent: {formatTime(state.timeSpent)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Try Again
            </Button>
            <Button variant="outline" className="flex-1" onClick={onExit}>
              Back to Exam Centre
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
