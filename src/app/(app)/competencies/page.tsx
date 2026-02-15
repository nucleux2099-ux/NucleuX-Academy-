'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Award, BookOpen, ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  allCompetencies,
  getCompetenciesByPhase,
  getCompetencyStats,
  subjectsWithCompetencies,
  type Competency,
} from '@/lib/data/competencies';

const ROOM = '#E879F9';

const phases = ['Phase-1', 'Phase-2', 'Phase-3A', 'Phase-3B'] as const;
const phaseLabels: Record<string, string> = { 'Phase-1': 'Phase 1', 'Phase-2': 'Phase 2', 'Phase-3A': 'Phase 3A', 'Phase-3B': 'Phase 3B' };

const typeInfo: Record<string, { label: string; color: string }> = {
  K: { label: 'Knowledge', color: '#60a5fa' },
  S: { label: 'Skill', color: '#34d399' },
  A: { label: 'Attitude', color: '#fbbf24' },
  C: { label: 'Communication', color: '#f472b6' },
};

// Mock progress — simulate ~46% completion
const mockCompleted = new Set(allCompetencies.slice(0, Math.floor(allCompetencies.length * 0.46)).map(c => c.code));

export default function CompetenciesPage() {
  const [activePhase, setActivePhase] = useState<string>('Phase-2');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const stats = getCompetencyStats();
  const phaseCompetencies = getCompetenciesByPhase(activePhase);
  const filtered = subjectFilter === 'All' ? phaseCompetencies : phaseCompetencies.filter(c => c.subject === subjectFilter);

  const completedCount = allCompetencies.filter(c => mockCompleted.has(c.code)).length;

  // Subject progress for current phase
  const subjectProgress = useMemo(() => {
    const subjects = [...new Set(phaseCompetencies.map(c => c.subject))];
    return subjects.map(s => {
      const total = phaseCompetencies.filter(c => c.subject === s).length;
      const done = phaseCompetencies.filter(c => c.subject === s && mockCompleted.has(c.code)).length;
      return { subject: s, total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  }, [activePhase, phaseCompetencies]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Stats Banner */}
      <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ROOM}22` }}>
              <Target size={20} style={{ color: ROOM }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8E0D5]">{completedCount}/{allCompetencies.length}</p>
              <p className="text-xs text-[#A0B0BC]">Competencies Achieved</p>
            </div>
          </div>
          <div className="h-10 w-px bg-[rgba(232,224,213,0.06)] hidden sm:block" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15">
              <TrendingUp size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#E8E0D5]">{phaseLabels[activePhase]}</p>
              <p className="text-xs text-[#A0B0BC]">Active Phase</p>
            </div>
          </div>
          <div className="h-10 w-px bg-[rgba(232,224,213,0.06)] hidden sm:block" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/15">
              <Award size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#E8E0D5]">{subjectsWithCompetencies.length}</p>
              <p className="text-xs text-[#A0B0BC]">Subjects</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Phase Tabs */}
      <div className="flex items-center gap-2">
        {phases.map(p => (
          <button
            key={p}
            onClick={() => { setActivePhase(p); setSubjectFilter('All'); }}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: activePhase === p ? `${ROOM}22` : 'transparent',
              color: activePhase === p ? ROOM : '#A0B0BC',
              border: activePhase === p ? `1px solid ${ROOM}44` : '1px solid rgba(232,224,213,0.06)',
            }}
          >
            {phaseLabels[p]}
          </button>
        ))}

        {/* Subject Filter */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
            className="px-3 py-2 rounded-xl text-sm flex items-center gap-2 bg-[#253545] border border-[rgba(232,224,213,0.06)] text-[#A0B0BC] hover:text-[#E8E0D5] transition"
          >
            <BookOpen size={14} /> {subjectFilter} <ChevronDown size={14} />
          </button>
          {showSubjectDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-[#253545] border border-[rgba(232,224,213,0.06)] rounded-xl py-1 z-10 min-w-[180px] shadow-xl">
              {['All', ...subjectsWithCompetencies.map(s => s.name)].map(s => (
                <button key={s} onClick={() => { setSubjectFilter(s); setShowSubjectDropdown(false); }}
                  className="block w-full text-left px-3 py-1.5 text-sm hover:bg-[rgba(232,224,213,0.06)] transition"
                  style={{ color: subjectFilter === s ? ROOM : '#A0B0BC' }}
                >{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subject Progress Bars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subjectProgress.map(sp => (
          <Card key={sp.subject} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#E8E0D5] font-medium truncate">{sp.subject}</p>
              <span className="text-xs font-bold" style={{ color: ROOM }}>{sp.pct}%</span>
            </div>
            <div className="h-2 bg-[#1a2a38] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${sp.pct}%`, backgroundColor: ROOM }} />
            </div>
            <p className="text-[10px] text-[#A0B0BC] mt-1">{sp.done}/{sp.total}</p>
          </Card>
        ))}
      </div>

      {/* Competency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(c => {
          const done = mockCompleted.has(c.code);
          const ti = typeInfo[c.type];
          return (
            <Card key={c.code} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: done ? 'rgba(52,211,153,0.15)' : `${ROOM}15` }}>
                {done ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Target size={16} style={{ color: ROOM }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#E8E0D5]">{c.code}</span>
                  <Badge className="text-[10px] px-1.5 py-0" style={{ backgroundColor: `${ti.color}22`, color: ti.color }}>{ti.label}</Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[rgba(232,224,213,0.1)] text-[#A0B0BC]">{c.level}</Badge>
                  {done && <Badge className="text-[10px] px-1.5 py-0 bg-emerald-500/20 text-emerald-400">Achieved</Badge>}
                </div>
                <p className="text-sm text-[#A0B0BC] mt-1 leading-relaxed">{c.description}</p>
                <p className="text-[10px] text-[#A0B0BC]/60 mt-1">{c.subject} • {c.domain} • {c.xpReward} XP</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
