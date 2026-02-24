'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Compass, Clock, ChevronRight } from 'lucide-react';
import { guidedPathways } from './data';

export function GuidedPathways() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Compass className="h-5 w-5 text-purple-400" />
          Continue Learning
        </CardTitle>
        <CardDescription>Your guided learning pathways</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {guidedPathways.map((pathway) => (
          <div 
            key={pathway.id}
            className="p-3 rounded-lg bg-[#0D1B2A] hover:bg-[#162535] cursor-pointer transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors">
                  {pathway.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{pathway.description}</p>
              </div>
              <span className="text-xs text-gray-400">
                {pathway.completed}/{pathway.modules} modules
              </span>
            </div>
            <Progress 
              value={(pathway.completed / pathway.modules) * 100} 
              className="h-1.5 bg-gray-700 mb-2"
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-400">
                Next: {pathway.nextTopic}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {pathway.estimatedTime}
              </span>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
          Explore All Pathways <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
