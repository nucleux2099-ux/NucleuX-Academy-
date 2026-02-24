'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Clock, Star, ChevronRight, Lock } from 'lucide-react';
import { featuredSimulations } from './data';

export function FeaturedSimulations() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-emerald-400" />
          Featured Patient Cases
        </CardTitle>
        <CardDescription>Real-world clinical simulations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {featuredSimulations.map((sim) => (
          <Link 
            key={sim.id}
            href={sim.isAvailable ? `/exam-centre/simulator/${sim.id}` : '#'}
            className={`block p-3 rounded-lg bg-[#0D1B2A] hover:bg-[#162535] transition-colors group ${
              sim.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  {sim.title}
                  {sim.isNew && (
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">NEW</Badge>
                  )}
                  {!sim.isAvailable && (
                    <Lock className="h-3 w-3 text-gray-500" />
                  )}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{sim.description}</p>
              </div>
              <Badge variant="outline" className={
                sim.difficulty === 'Hard' 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }>
                {sim.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {sim.duration}
              </span>
              <span>{sim.subject}</span>
              <span className="flex items-center gap-1 ml-auto text-amber-400">
                <Star className="h-3 w-3 fill-current" /> {sim.rating}
              </span>
            </div>
          </Link>
        ))}
        <Button variant="outline" className="w-full mt-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
          View All Cases <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
