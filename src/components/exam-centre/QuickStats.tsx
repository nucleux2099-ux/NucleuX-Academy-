'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Stethoscope, Compass, Sparkles } from 'lucide-react';

export function QuickStats() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-sm">PYQs Solved</p>
              <p className="text-2xl font-bold text-white">2,340</p>
            </div>
            <FileQuestion className="h-8 w-8 text-amber-400 opacity-80" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm">Cases Completed</p>
              <p className="text-2xl font-bold text-white">85</p>
            </div>
            <Stethoscope className="h-8 w-8 text-emerald-400 opacity-80" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Pathways Done</p>
              <p className="text-2xl font-bold text-white">13</p>
            </div>
            <Compass className="h-8 w-8 text-purple-400 opacity-80" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Study Streak</p>
              <p className="text-2xl font-bold text-white">7 Days</p>
            </div>
            <Sparkles className="h-8 w-8 text-blue-400 opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
