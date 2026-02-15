'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, BookOpen, FileText, Target, Percent, Flame, Trophy, Lock, Clock, Sparkles, Calendar, Settings } from 'lucide-react';

const ROOM = '#5BB3B3';

const stats = [
  { label: 'Study Hours', value: '247', icon: Clock, color: ROOM },
  { label: 'Notes Created', value: '38', icon: FileText, color: '#C9A86C' },
  { label: 'MCQs Attempted', value: '1,284', icon: Target, color: '#E879F9' },
  { label: 'Accuracy', value: '72%', icon: Percent, color: '#34d399' },
  { label: 'Current Streak', value: '14 days', icon: Flame, color: '#f97316' },
];

const badges = [
  { name: 'First Note', desc: 'Created your first note', unlocked: true, icon: '📝' },
  { name: 'Quiz Master', desc: '100 MCQs completed', unlocked: true, icon: '🎯' },
  { name: 'Anatomy Pro', desc: 'All Phase 1 Anatomy done', unlocked: true, icon: '🦴' },
  { name: 'Night Owl', desc: 'Studied past midnight 10x', unlocked: true, icon: '🦉' },
  { name: 'Streak King', desc: '30-day study streak', unlocked: false, icon: '🔥' },
  { name: 'Surgeon Scholar', desc: 'Complete Surgery pathway', unlocked: false, icon: '⚔️' },
  { name: 'ATOM Whisperer', desc: '500 ATOM interactions', unlocked: true, icon: '⚛️' },
  { name: 'Bookworm', desc: 'Read 50 library articles', unlocked: false, icon: '📚' },
];

const activities = [
  { action: 'Completed MCQ set', detail: 'Cardiac Cycle — 18/20 correct', time: '2 hours ago' },
  { action: 'Added note', detail: 'Inguinal Hernia — Types & Repair', time: '5 hours ago' },
  { action: 'Achieved competency', detail: 'AN5.2 — Inguinal canal anatomy', time: '1 day ago' },
  { action: 'Watched lecture', detail: 'Pharmacokinetics — ADME Principles', time: '1 day ago' },
  { action: 'ATOM conversation', detail: 'Discussed appendicitis differential diagnosis', time: '2 days ago' },
];

const preferences = [
  { label: 'Preferred Subjects', value: 'Surgery, Anatomy, Medicine' },
  { label: 'Study Schedule', value: 'Evenings (6 PM – 11 PM)' },
  { label: 'ATOM Style', value: 'Socratic questioning, concise answers' },
  { label: 'Quiz Difficulty', value: 'Intermediate → Advanced' },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Profile Header */}
      <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${ROOM}22` }}>
            <User size={36} style={{ color: ROOM }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E8E0D5]">Aditya Chandra Bhatla</h1>
            <p className="text-sm text-[#A0B0BC]">AIIMS Mangalagiri • Final Year MBBS</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="text-xs" style={{ backgroundColor: `${ROOM}22`, color: ROOM }}>Surgery Interest</Badge>
              <Badge className="text-xs bg-amber-500/20 text-amber-400">Phase 2 Active</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-4 text-center">
            <s.icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
            <p className="text-xl font-bold text-[#E8E0D5]">{s.value}</p>
            <p className="text-[10px] text-[#A0B0BC]">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-4 flex items-center gap-2"><Trophy size={16} style={{ color: ROOM }} /> Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map(b => (
              <div key={b.name} className={`flex items-center gap-3 p-3 rounded-xl ${b.unlocked ? 'bg-[#1a2a38]' : 'bg-[#1a2a38]/50 opacity-50'}`}>
                <span className="text-2xl">{b.unlocked ? b.icon : '🔒'}</span>
                <div>
                  <p className="text-xs font-semibold text-[#E8E0D5]">{b.name}</p>
                  <p className="text-[10px] text-[#A0B0BC]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-4 flex items-center gap-2"><Clock size={16} style={{ color: ROOM }} /> Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: ROOM }} />
                  {i < activities.length - 1 && <div className="w-px flex-1 bg-[rgba(232,224,213,0.06)]" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-[#E8E0D5]">{a.action}</p>
                  <p className="text-xs text-[#A0B0BC]">{a.detail}</p>
                  <p className="text-[10px] text-[#A0B0BC]/50 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Learning Preferences */}
      <Card className="bg-[#253545] border-[rgba(232,224,213,0.06)] rounded-xl p-5">
        <h3 className="text-[#E8E0D5] font-semibold mb-4 flex items-center gap-2"><Settings size={16} style={{ color: ROOM }} /> Learning Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferences.map(p => (
            <div key={p.label} className="flex items-center justify-between p-3 rounded-xl bg-[#1a2a38]">
              <span className="text-xs text-[#A0B0BC]">{p.label}</span>
              <span className="text-xs text-[#E8E0D5] font-medium">{p.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-[#A0B0BC]/50 flex items-center justify-center gap-2">
        <Calendar size={12} /> Member since February 2026
      </p>
    </div>
  );
}
