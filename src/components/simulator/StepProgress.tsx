'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { STEPS, STEP_INDEX } from './constants';
import type { SimulatorStep } from './types';

interface StepProgressProps {
  currentStep: SimulatorStep;
  onStepClick: (step: SimulatorStep) => void;
}

export function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  const currentStepIndex = STEP_INDEX[currentStep];
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => onStepClick(step.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCompleted
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-gray-500 hover:text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-emerald-500/30'
                      : isCompleted
                        ? 'bg-emerald-500/20'
                        : 'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progressPercent} className="h-1 bg-gray-700" />
      </CardContent>
    </Card>
  );
}
