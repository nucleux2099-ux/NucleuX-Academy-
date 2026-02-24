'use client';

import { Zap } from 'lucide-react';
import { type Question } from './data';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestion: number;
  answers: (number | null)[];
  flagged: boolean[];
  onGoToQuestion: (index: number) => void;
}

export function QuestionNavigator({ questions, currentQuestion, answers, flagged, onGoToQuestion }: QuestionNavigatorProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {questions.map((q, i) => {
        const isCorrect = answers[i] !== null && answers[i] === q.correctAnswer;
        const isWrong = answers[i] !== null && answers[i] !== q.correctAnswer;
        const isCurrent = i === currentQuestion;
        
        return (
          <button
            key={i}
            onClick={() => onGoToQuestion(i)}
            className={`w-10 h-10 rounded-lg font-medium transition-all relative ${
              isCurrent ? 'bg-[#5BB3B3] text-[#2D3E50] ring-2 ring-[#5BB3B3]/50' :
              isCorrect ? 'bg-[rgba(5,150,105,0.2)] text-[#7BA69E] border border-[rgba(5,150,105,0.3)]' :
              isWrong ? 'bg-[rgba(239,68,68,0.2)] text-[#E57373] border border-[rgba(239,68,68,0.3)]' :
              'bg-[#364A5E] text-[#A0B0BC] border border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]'
            } ${flagged[i] ? 'ring-2 ring-[#C9A86C]' : ''}`}
          >
            {i + 1}
            {q.highYield && <Zap className="absolute -top-1 -right-1 w-3 h-3 text-[#C9A86C]" />}
          </button>
        );
      })}
    </div>
  );
}
