'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Compass, Play } from 'lucide-react';
import { guidedPathways } from './data';

export function GuidedLearningTab() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-purple-400" />
          Guided Learning Pathways
        </CardTitle>
        <CardDescription>
          Step-by-step concept mastery with spaced repetition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {guidedPathways.map((pathway) => (
          <Card key={pathway.id} className="bg-[#0D1B2A] border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{pathway.title}</h3>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                  {pathway.completed}/{pathway.modules} Complete
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-3">{pathway.description}</p>
              <Progress value={(pathway.completed / pathway.modules) * 100} className="h-2 bg-gray-700 mb-3" />
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Next: </span>
                  <span className="text-purple-400">{pathway.nextTopic}</span>
                  <span className="text-gray-500 ml-2">• {pathway.estimatedTime}</span>
                </div>
                <Button size="sm" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                  <Play className="h-3 w-3 mr-1" /> Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
