'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { HISTORY_CATEGORIES } from './constants';
import type { CaseData, HistoryQuestion } from './types';

interface HistoryTakingProps {
  caseData: CaseData;
  askedQuestions: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAskQuestion: (question: HistoryQuestion) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HistoryTaking({
  caseData, askedQuestions, selectedCategory, onSelectCategory,
  onAskQuestion, onNext, onBack,
}: HistoryTakingProps) {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-amber-400" />
          History Taking
        </CardTitle>
        <CardDescription>Click on questions to ask the patient. Relevant questions earn more points.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {HISTORY_CATEGORIES.map(cat => {
            const questionsInCat = caseData.history.filter(q => q.category === cat.id);
            const answeredInCat = questionsInCat.filter(q => askedQuestions.includes(q.id)).length;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelectCategory(cat.id)}
                className={selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30'
                  : 'border-gray-600 text-gray-400 hover:text-gray-300'
                }
              >
                {cat.label}
                <Badge className="ml-2 bg-gray-700 text-gray-300" variant="secondary">
                  {answeredInCat}/{questionsInCat.length}
                </Badge>
              </Button>
            );
          })}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {caseData.history
              .filter(q => q.category === selectedCategory)
              .map(question => {
                const isAsked = askedQuestions.includes(question.id);
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isAsked
                        ? 'bg-[#0D1B2A] border-emerald-500/30'
                        : 'bg-[#0D1B2A] border-gray-700 hover:border-amber-500/50 cursor-pointer'
                    }`}
                    onClick={() => !isAsked && onAskQuestion(question)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className={`font-medium ${isAsked ? 'text-emerald-400' : 'text-white'}`}>
                          {isAsked ? '✓ ' : ''}{question.question}
                        </p>
                        {isAsked && (
                          <div className="mt-2 p-3 rounded bg-gray-800/50 border-l-2 border-amber-500">
                            <p className="text-gray-300 text-sm italic">&quot;{question.answer}&quot;</p>
                          </div>
                        )}
                      </div>
                      {!isAsked && (
                        <Badge className={`shrink-0 ${
                          question.isRelevant
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          +{question.points}
                        </Badge>
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
            Proceed to Examination <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
