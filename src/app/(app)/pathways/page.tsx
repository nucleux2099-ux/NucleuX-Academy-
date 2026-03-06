'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route, CircleCheck, Circle, Clock, BarChart3, BookOpen, Star, Zap, ArrowRight, MapPin } from 'lucide-react';

const ROOM = '#7BA69E';

const pathways = [
  { id: 1, title: 'Surgery Mastery', desc: 'Complete surgical training from anatomy to advanced procedures', progress: 45, time: '120 hrs', difficulty: 'Advanced', chapters: 24, enrolled: true, active: true },
  { id: 2, title: 'Internal Medicine Core', desc: 'Master diagnosis and management of systemic diseases', progress: 30, time: '100 hrs', difficulty: 'Intermediate', chapters: 20, enrolled: true, active: false },
  { id: 3, title: 'USMLE Step 1 Prep', desc: 'High-yield review of basic science concepts for board exams', progress: 0, time: '200 hrs', difficulty: 'Advanced', chapters: 32, enrolled: false, active: false },
  { id: 4, title: 'Clinical Rotations', desc: 'Prepare for ward rounds, case presentations & bedside skills', progress: 15, time: '80 hrs', difficulty: 'Intermediate', chapters: 16, enrolled: false, active: false },
  { id: 5, title: 'Research Track', desc: 'Learn research methodology, biostatistics & academic writing', progress: 0, time: '60 hrs', difficulty: 'Beginner', chapters: 12, enrolled: false, active: false },
];

const milestones = [
  { label: 'Anatomy Foundations', status: 'completed' as const },
  { label: 'Surgical Instruments', status: 'completed' as const },
  { label: 'Suturing Techniques', status: 'completed' as const },
  { label: 'Hernia Repair', status: 'current' as const },
  { label: 'Appendectomy', status: 'upcoming' as const },
  { label: 'Cholecystectomy', status: 'upcoming' as const },
  { label: 'Bowel Anastomosis', status: 'upcoming' as const },
];

const recommended = [
  { title: 'Pharmacology Essentials', time: '45 hrs', chapters: 14, reason: 'Based on your Surgery pathway' },
  { title: 'Emergency Medicine Basics', time: '35 hrs', chapters: 10, reason: 'Popular with your peers' },
  { title: 'Radiology for Clinicians', time: '25 hrs', chapters: 8, reason: 'Complements Clinical Rotations' },
];

const diffColors: Record<string, string> = { Beginner: '#34d399', Intermediate: '#fbbf24', Advanced: '#f87171' };

export default function PathwaysPage() {
  const active = pathways.find(p => p.active)!;

  return (
    <div className="ui-shell ui-page space-y-6">
      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-[#A0B0BC]">
        <div className="flex items-center gap-2"><Route size={16} style={{ color: ROOM }} /> <span><strong className="text-[#E8E0D5]">2</strong> Active Pathways</span></div>
        <div className="flex items-center gap-2"><BarChart3 size={16} className="text-amber-400" /> <span><strong className="text-[#E8E0D5]">45%</strong> Surgery Complete</span></div>
        <div className="flex items-center gap-2"><MapPin size={16} className="text-emerald-400" /> <span><strong className="text-[#E8E0D5]">12</strong> Milestones Reached</span></div>
      </div>

      {/* Active Pathway Hero */}
      <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-6" style={{ borderLeft: `4px solid ${ROOM}` }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="text-xs" style={{ backgroundColor: `${ROOM}22`, color: ROOM }}>Active Now</Badge>
              <Badge className="text-xs" style={{ backgroundColor: `${diffColors[active.difficulty]}22`, color: diffColors[active.difficulty] }}>{active.difficulty}</Badge>
            </div>
            <h2 className="text-xl font-bold text-[#E8E0D5]">{active.title}</h2>
            <p className="text-sm text-[#A0B0BC] mt-1">{active.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: ROOM }}>{active.progress}%</p>
            <p className="text-xs text-[#A0B0BC]">{active.chapters} chapters • {active.time}</p>
          </div>
        </div>
        <div className="h-2 bg-[#1a2a38] rounded-full overflow-hidden mb-6">
          <div className="h-full rounded-full" style={{ width: `${active.progress}%`, backgroundColor: ROOM }} />
        </div>

        {/* Milestones */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: m.status === 'completed' ? 'rgba(52,211,153,0.2)' : m.status === 'current' ? `${ROOM}33` : 'rgba(232,224,213,0.06)',
                  }}>
                  {m.status === 'completed' ? <CircleCheck size={16} className="text-emerald-400" /> :
                    m.status === 'current' ? <Zap size={16} style={{ color: ROOM }} /> :
                      <Circle size={16} className="text-[#A0B0BC]/40" />}
                </div>
                <span className="text-[10px] mt-1 max-w-[70px] text-center leading-tight"
                  style={{ color: m.status === 'current' ? ROOM : m.status === 'completed' ? '#34d399' : '#A0B0BC' }}>
                  {m.label}
                </span>
              </div>
              {i < milestones.length - 1 && (
                <div className="w-8 h-0.5 mx-1 mt-[-16px]"
                  style={{ backgroundColor: m.status === 'completed' ? '#34d399' : 'rgba(232,224,213,0.1)' }} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* All Pathways */}
      <h3 className="text-[#E8E0D5] font-semibold">All Pathways</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pathways.filter(p => !p.active).map(p => (
          <Card key={p.id} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-4 hover:border-[rgba(232,224,213,0.12)] transition cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="text-[10px]" style={{ backgroundColor: `${diffColors[p.difficulty]}22`, color: diffColors[p.difficulty] }}>{p.difficulty}</Badge>
              {p.enrolled && <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400">Enrolled</Badge>}
            </div>
            <h4 className="text-sm font-semibold text-[#E8E0D5] mb-1">{p.title}</h4>
            <p className="text-xs text-[#A0B0BC] mb-3">{p.desc}</p>
            <div className="flex items-center gap-3 text-[10px] text-[#A0B0BC]/70 mb-2">
              <span className="flex items-center gap-1"><Clock size={10} /> {p.time}</span>
              <span className="flex items-center gap-1"><BookOpen size={10} /> {p.chapters} chapters</span>
            </div>
            {p.enrolled && (
              <div className="h-1.5 bg-[#1a2a38] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: ROOM }} />
              </div>
            )}
            {!p.enrolled && (
              <Button variant="outline" size="sm" className="mt-2 text-xs rounded-lg border-[rgba(232,224,213,0.1)] text-[#A0B0BC] hover:text-[#E8E0D5]">
                Enroll <ArrowRight size={12} className="ml-1" />
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* Recommended */}
      <h3 className="text-[#E8E0D5] font-semibold flex items-center gap-2"><Star size={16} style={{ color: ROOM }} /> Recommended for You</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommended.map((r, i) => (
          <Card key={i} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[#E8E0D5] mb-1">{r.title}</h4>
            <p className="text-[10px] text-[#A0B0BC]/70 mb-2 italic">{r.reason}</p>
            <div className="flex items-center gap-3 text-[10px] text-[#A0B0BC]">
              <span>{r.time}</span>
              <span>{r.chapters} chapters</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
