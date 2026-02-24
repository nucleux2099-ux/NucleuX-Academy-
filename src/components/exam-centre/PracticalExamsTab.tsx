'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Play, Lock, Clock, ClipboardList, Stethoscope, Users } from 'lucide-react';

export function PracticalExamsTab() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-rose-400" />
          Practical & Clinical Exams
        </CardTitle>
        <CardDescription>
          OSCE stations, long cases, short cases, and viva preparation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Featured OSCE Station */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Badge className="bg-emerald-500 text-white mb-2">NEW: Sample Available</Badge>
              <h3 className="text-lg font-semibold text-white">Thyroid Examination OSCE Station</h3>
              <p className="text-sm text-gray-400">Endocrine • 8 minutes • 41 checklist items</p>
            </div>
            <Link href="/exam-centre/osce/thyroid-examination">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                <Play className="h-4 w-4 mr-2" />
                Start OSCE
              </Button>
            </Link>
          </div>
          <p className="text-sm text-rose-200/80">
            Complete OSCE station with timer, examiner checklist, self-scoring, model answers, and verbal scripts.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'OSCE Stations', desc: 'Timed clinical skill stations', count: 50, icon: Clock, href: '/exam-centre/osce/thyroid-examination', available: true },
            { title: 'Long Cases', desc: 'Complete case presentations', count: 30, icon: ClipboardList, href: '#', available: false },
            { title: 'Short Cases', desc: 'Focused clinical examinations', count: 45, icon: Stethoscope, href: '#', available: false },
            { title: 'Viva Voce', desc: 'Common viva questions', count: 200, icon: Users, href: '#', available: false },
          ].map((item) => (
            <Card key={item.title} className={`bg-[#0D1B2A] border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all ${!item.available ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.count} available</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{item.desc}</p>
                {item.available ? (
                  <Link href={item.href}>
                    <Button size="sm" className="w-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30">
                      Practice Now
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" className="w-full bg-gray-500/20 text-gray-400" disabled>
                    <Lock className="h-3 w-3 mr-1" /> Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
