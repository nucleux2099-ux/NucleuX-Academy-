'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock } from 'lucide-react';
import { examTypes } from './data';

export function ExamTypesGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {examTypes.map((exam) => (
        <Link key={exam.id} href={exam.href || '#'}>
          <Card 
            className={`bg-[#1A2332] border-[rgba(91,179,179,0.15)] hover:border-indigo-500/50 cursor-pointer transition-all group h-full ${
              !exam.isAvailable ? 'opacity-60' : ''
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <exam.icon className="h-6 w-6 text-white" />
                </div>
                {exam.isAvailable ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                ) : (
                  <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Coming Soon
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-white mb-1">{exam.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{exam.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{exam.stats.total.toLocaleString()} total</span>
                <span className="text-emerald-400">{exam.stats.mastered} mastered</span>
              </div>
              <Progress 
                value={(exam.stats.mastered / exam.stats.total) * 100} 
                className="h-1 mt-2 bg-gray-700"
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
