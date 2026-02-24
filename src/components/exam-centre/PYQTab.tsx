'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileQuestion, Play, Lock, BookOpen } from 'lucide-react';

export function PYQTab() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileQuestion className="h-5 w-5 text-amber-400" />
          Previous Year Questions
        </CardTitle>
        <CardDescription>
          University exam questions with textbook references
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Featured Sample Question */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Badge className="bg-emerald-500 text-white mb-2">NEW: Sample Available</Badge>
              <h3 className="text-lg font-semibold text-white">Acute Appendicitis - ALVARADO Score</h3>
              <p className="text-sm text-gray-400">NEET-PG 2023 • Surgery • Medium Difficulty</p>
            </div>
            <Link href="/exam-centre/pyq">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Play className="h-4 w-4 mr-2" />
                Try Sample PYQ
              </Button>
            </Link>
          </div>
          <p className="text-sm text-amber-200/80">
            Experience the complete PYQ format with clinical vignettes, textbook references from Bailey & Love, Sabiston, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {['NEET-PG 2024', 'INICET Nov 2024', 'AIIMS Nov 2024', 'NEET-PG 2023', 'INICET May 2024', 'DNB-CET 2024'].map((exam, idx) => (
            <Card key={exam} className="bg-[#0D1B2A] border-amber-500/20 hover:border-amber-500/50 cursor-pointer transition-all">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{exam}</h3>
                <p className="text-sm text-gray-400 mb-3">200 Questions • 3.5 hrs</p>
                <div className="flex gap-2">
                  {idx === 0 ? (
                    <Link href="/exam-centre/pyq" className="flex-1">
                      <Button size="sm" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 w-full">
                        <Play className="h-3 w-3 mr-1" /> Start
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" className="bg-gray-500/20 text-gray-400 flex-1" disabled>
                      <Lock className="h-3 w-3 mr-1" /> Locked
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-300">Textbook References Included</h4>
              <p className="text-sm text-amber-200/70 mt-1">
                Every question is linked to standard textbooks — Bailey, Sabiston, Harrison&apos;s, and more. 
                Learn not just the answer, but the source.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
