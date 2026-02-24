'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Stethoscope, Clock, Play, Lock, ChevronRight,
  Users, ClipboardList, Microscope, Pill, Activity,
} from 'lucide-react';
import { featuredSimulations } from './data';

export function SimulatorTab() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-emerald-400" />
          Patient Simulator
        </CardTitle>
        <CardDescription>
          Real-life clinical scenarios based on standard textbooks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simulation Flow Explanation */}
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <h4 className="font-medium text-emerald-300 mb-3">How Patient Simulation Works</h4>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { icon: Users, label: 'Patient Presents', desc: 'Read the case' },
              { icon: ClipboardList, label: 'Take History', desc: 'Ask questions' },
              { icon: Stethoscope, label: 'Examine', desc: 'Physical findings' },
              { icon: Microscope, label: 'Investigate', desc: 'Order tests' },
              { icon: Pill, label: 'Manage', desc: 'Treatment plan' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                  <step.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-xs font-medium text-emerald-300">{step.label}</p>
                <p className="text-xs text-emerald-200/60 mt-0.5">{step.desc}</p>
                {idx < 4 && (
                  <ChevronRight className="absolute top-3 -right-1 h-4 w-4 text-emerald-500/50" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Patient Flow Link */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Badge className="bg-purple-500 text-white mb-2">CLINICAL PATHWAYS</Badge>
              <h3 className="text-lg font-semibold text-white">Upper GI Bleeding Flow</h3>
              <p className="text-sm text-gray-400">Interactive decision tree with Blatchford & Rockall scores</p>
            </div>
            <Link href="/exam-centre/flow/upper-gi-bleeding">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Activity className="h-4 w-4 mr-2" />
                Try Flow
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Cases */}
        <div className="grid grid-cols-2 gap-4">
          {featuredSimulations.map((sim) => (
            <Card key={sim.id} className={`bg-[#0D1B2A] border-emerald-500/20 hover:border-emerald-500/40 transition-all ${
              sim.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      sim.difficulty === 'Hard' 
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }>
                      {sim.difficulty}
                    </Badge>
                    {sim.isNew && (
                      <Badge className="bg-emerald-500/20 text-emerald-300">NEW</Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{sim.subject}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  {sim.title}
                  {!sim.isAvailable && <Lock className="h-3 w-3 text-gray-500" />}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{sim.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {sim.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {sim.duration}
                  </span>
                  {sim.isAvailable ? (
                    <Link href={`/exam-centre/simulator/${sim.id}`}>
                      <Button size="sm" className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                        <Play className="h-3 w-3 mr-1" /> Start Case
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" className="bg-gray-500/20 text-gray-400" disabled>
                      <Lock className="h-3 w-3 mr-1" /> Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
