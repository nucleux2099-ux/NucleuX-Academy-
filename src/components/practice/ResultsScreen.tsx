'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Target, CheckCircle, XCircle, Clock, Brain, RotateCcw, Eye, AlertTriangle } from 'lucide-react';
import { confidenceConfig } from './data';

interface ResultsScreenProps {
  accuracy: number;
  correct: number;
  incorrect: number;
  totalQuestions: number;
  timeElapsed: number;
  formatTime: (s: number) => string;
  calibrationData: Record<string, { correct: number; total: number }>;
  onRestart: () => void;
  onReviewMistakes: () => void;
}

export function ResultsScreen({
  accuracy, correct, incorrect, totalQuestions, timeElapsed,
  formatTime, calibrationData, onRestart, onReviewMistakes,
}: ResultsScreenProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] overflow-hidden">
        <div className="bg-gradient-to-r from-[rgba(91,179,179,0.15)] to-[rgba(139,92,246,0.1)] p-8 text-center border-b border-[rgba(91,179,179,0.1)]">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${
            accuracy >= 80 ? 'bg-[rgba(5,150,105,0.2)] border-[#7BA69E]/30' :
            accuracy >= 60 ? 'bg-[rgba(245,158,11,0.2)] border-[#C9A86C]/30' :
            'bg-[rgba(239,68,68,0.2)] border-[#E57373]/30'
          }`}>
            <Award className={`w-12 h-12 ${
              accuracy >= 80 ? 'text-[#7BA69E]' : accuracy >= 60 ? 'text-[#C9A86C]' : 'text-[#E57373]'
            }`} />
          </div>
          <h2 className="text-3xl font-bold text-[#E8E0D5] mb-2">Quiz Complete!</h2>
          <p className="text-[#A0B0BC]">Here&apos;s how you performed</p>
        </div>
        
        <CardContent className="p-8">
          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="rgba(91,179,179,0.1)" strokeWidth="12" fill="none" />
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke={accuracy >= 80 ? "#7BA69E" : accuracy >= 60 ? "#C9A86C" : "#E57373"}
                  strokeWidth="12" fill="none" strokeLinecap="round"
                  strokeDasharray={`${(accuracy / 100) * 440} 440`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#E8E0D5]">{accuracy}%</span>
                <span className="text-sm text-[#A0B0BC]">Accuracy</span>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Target, value: `${correct}/${totalQuestions}`, label: 'Score', color: '#5BB3B3' },
              { icon: CheckCircle, value: String(correct), label: 'Correct', color: '#7BA69E' },
              { icon: XCircle, value: String(incorrect), label: 'Incorrect', color: '#E57373' },
              { icon: Clock, value: formatTime(timeElapsed), label: 'Time', color: '#8B5CF6' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-[#3A4D5F] text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Calibration Analysis */}
          {Object.keys(calibrationData).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#E8E0D5] mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#8B5CF6]" />
                Confidence Calibration
              </h3>
              <div className="space-y-3">
                {Object.entries(calibrationData).map(([level, data]) => {
                  const config = confidenceConfig[level];
                  const actualAccuracy = Math.round((data.correct / data.total) * 100);
                  const isCalibrated = Math.abs(actualAccuracy - config.expected) < 15;
                  
                  return (
                    <div key={level} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-[#A0B0BC]">{config.label}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#6B7280]">{data.total} questions</span>
                          <span style={{ color: config.color }}>{actualAccuracy}% correct</span>
                        </div>
                        <div className="h-2 bg-[#3A4D5F] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${actualAccuracy}%`, backgroundColor: config.color }} />
                        </div>
                      </div>
                      {isCalibrated ? <CheckCircle className="w-4 h-4 text-[#7BA69E]" /> : <AlertTriangle className="w-4 h-4 text-[#C9A86C]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onRestart} className="flex-1 bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            {incorrect > 0 && (
              <Button onClick={onReviewMistakes} variant="outline" className="flex-1 border-[rgba(91,179,179,0.15)] text-[#A0B0BC]">
                <Eye className="w-4 h-4 mr-2" />
                Review Mistakes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
