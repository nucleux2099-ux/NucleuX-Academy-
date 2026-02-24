'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { subjects } from './data';

export function SubjectGrid() {
  return (
    <Card className="bg-[#1A2332] border-[rgba(91,179,179,0.15)]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Subject-wise Practice
        </CardTitle>
        <CardDescription>Jump into any subject</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {subjects.map((subject) => (
            <div 
              key={subject.id}
              className="p-4 rounded-lg bg-[#0D1B2A] hover:bg-[#162535] cursor-pointer transition-all hover:scale-105 text-center group"
            >
              <subject.icon className={`h-8 w-8 mx-auto mb-2 ${subject.color} group-hover:scale-110 transition-transform`} />
              <p className="text-sm font-medium text-white">{subject.name}</p>
              <p className="text-xs text-gray-500 mt-1">{subject.pyqs.toLocaleString()} PYQs</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
