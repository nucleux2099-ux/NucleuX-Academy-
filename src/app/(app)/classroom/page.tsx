'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Clock, BookOpen, CheckCircle2, Filter, Search, User, BarChart3, PenTool } from 'lucide-react';
import Link from 'next/link';

const ROOM = '#6BA8C9';

const categories = ['All', 'Surgery', 'Medicine', 'Anatomy', 'Pathology', 'Pharmacology'];

const lectures = [
  { id: 1, title: 'Inguinal Hernia — Anatomy & Surgical Repair', instructor: 'Dr. Ramesh Iyer', duration: '42 min', subject: 'Surgery', progress: 100, current: false },
  { id: 2, title: 'Cardiac Cycle & Heart Sounds', instructor: 'Dr. Priya Sharma', duration: '38 min', subject: 'Medicine', progress: 65, current: true },
  { id: 3, title: 'Brachial Plexus — Complete Overview', instructor: 'Dr. Anil Mehta', duration: '55 min', subject: 'Anatomy', progress: 0, current: false },
  { id: 4, title: 'Inflammatory Pathology — Acute vs Chronic', instructor: 'Dr. Sunita Rao', duration: '47 min', subject: 'Pathology', progress: 0, current: false },
  { id: 5, title: 'Pharmacokinetics — ADME Principles', instructor: 'Dr. Vikram Das', duration: '35 min', subject: 'Pharmacology', progress: 30, current: false },
  { id: 6, title: 'Appendicitis — Diagnosis to Appendectomy', instructor: 'Dr. Ramesh Iyer', duration: '50 min', subject: 'Surgery', progress: 0, current: false },
];

export default function ClassroomPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? lectures : lectures.filter(l => l.subject === activeCategory);
  const currentLecture = lectures.find(l => l.current)!;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Stats Row */}
      <div className="flex items-center gap-6 text-sm text-[#A0B0BC]">
        <div className="flex items-center gap-2"><BookOpen size={16} style={{ color: ROOM }} /> <span><strong className="text-[#E8E0D5]">47</strong> Lectures Available</span></div>
        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> <span><strong className="text-[#E8E0D5]">12</strong> Completed</span></div>
        <div className="flex items-center gap-2"><Clock size={16} className="text-amber-400" /> <span><strong className="text-[#E8E0D5]">8.5 hrs</strong> watched</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Hero */}
          <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl overflow-hidden">
            <div className="relative aspect-video bg-[#1a2a38] flex items-center justify-center cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${ROOM}33` }}>
                <Play size={36} fill={ROOM} style={{ color: ROOM }} />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="mb-2 text-xs" style={{ backgroundColor: `${ROOM}33`, color: ROOM }}>{currentLecture.subject}</Badge>
                <h2 className="text-xl font-semibold text-[#E8E0D5]">{currentLecture.title}</h2>
                <p className="text-sm text-[#A0B0BC] flex items-center gap-2 mt-1">
                  <User size={14} /> {currentLecture.instructor} • {currentLecture.duration}
                </p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between text-xs text-[#A0B0BC] mb-1">
                <span>Currently Watching</span>
                <span>{currentLecture.progress}%</span>
              </div>
              <div className="h-1.5 bg-[#1a2a38] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${currentLecture.progress}%`, backgroundColor: ROOM }} />
              </div>
            </div>
          </Card>

          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-[#A0B0BC]" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: activeCategory === cat ? `${ROOM}33` : 'rgba(232,224,213,0.06)',
                  color: activeCategory === cat ? ROOM : '#A0B0BC',
                  border: activeCategory === cat ? `1px solid ${ROOM}55` : '1px solid transparent',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* ATOM Canvas Card */}
          <Link href="/classroom/canvas">
            <Card className="p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-[#253545] border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                  <PenTool size={20} className="text-teal-400" />
                </div>
                <div>
                  <h3 className="text-[#E8E0D5] font-semibold text-sm">ATOM Canvas</h3>
                  <p className="text-[#A0B0BC] text-xs">Draw diagrams. Get AI feedback.</p>
                </div>
              </div>
            </Card>
          </Link>

          <div className="flex items-center justify-between">
            <h3 className="text-[#E8E0D5] font-semibold flex items-center gap-2"><BarChart3 size={16} style={{ color: ROOM }} /> Playlist</h3>
            <span className="text-xs text-[#A0B0BC]">{filtered.length} lectures</span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0B0BC]" />
            <Input placeholder="Search lectures..." className="pl-9 bg-[#253545] border-[rgba(232,224,213,0.06)] text-[#E8E0D5] placeholder:text-[#A0B0BC]/50 h-9 text-sm rounded-lg" />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((lecture) => (
              <Card
                key={lecture.id}
                className={`p-3 rounded-xl cursor-pointer transition-all border-[rgba(232,224,213,0.06)] ${
                  lecture.current ? 'bg-[#253545]' : 'bg-[#253545]/60 hover:bg-[#253545]'
                }`}
                style={lecture.current ? { borderLeft: `3px solid ${ROOM}` } : {}}
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg bg-[#1a2a38] flex-shrink-0 flex items-center justify-center relative">
                    <Play size={14} className="text-[#A0B0BC]" />
                    {lecture.progress === 100 && (
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E8E0D5] font-medium truncate">{lecture.title}</p>
                    <p className="text-xs text-[#A0B0BC] mt-0.5">{lecture.instructor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[rgba(232,224,213,0.1)] text-[#A0B0BC]">{lecture.subject}</Badge>
                      <span className="text-[10px] text-[#A0B0BC]">{lecture.duration}</span>
                    </div>
                    {lecture.progress > 0 && lecture.progress < 100 && (
                      <div className="h-1 bg-[#1a2a38] rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${lecture.progress}%`, backgroundColor: ROOM }} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
