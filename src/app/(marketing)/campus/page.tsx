'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, LayoutDashboard, GraduationCap, Atom, Users, Swords, BarChart3 } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const rooms = [
  { icon: BookOpen, title: 'Room 01 — Welcome Center', desc: 'Set context, identify weak zones, and begin with intention.' },
  { icon: BookOpen, title: 'Room 02 — Library', desc: 'Structured, connected medical knowledge with prerequisite paths.' },
  { icon: GraduationCap, title: 'Room 03 — Exam Center', desc: 'Retrieval-first assessment through questions and clinical cases.' },
  { icon: Atom, title: 'Room 04 — AI Tutor (ATOM Chamber)', desc: 'Socratic teaching to build reasoning, not dependency.' },
  { icon: LayoutDashboard, title: 'Room 05 — Desk', desc: 'Your mission control for progress, priorities, and revision.' },
  { icon: Users, title: 'Room 06 — Common Room', desc: 'Consolidation, reflection, and collaborative understanding.' },
  { icon: Swords, title: 'Room 07 — Arena', desc: 'Application under pressure with decision-focused drills.' },
  { icon: BarChart3, title: 'Room 08 — Backstage', desc: 'Analytics and diagnosis: where error patterns become action plans.' },
];

export default function CampusTourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(91,179,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.15) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/30 to-slate-950/70" />

      <MarketingHeader active="campus" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/rooms', label: 'Library Rooms' }} />

      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-8 sm:pb-10 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">Campus Tour</div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Eight rooms. One learning OS.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            NucleuX is not a content shelf. It is a connected campus where each room advances one step of the learning loop.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rooms.map((room, i) => (
            <motion.div key={room.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <room.icon className="w-5 h-5 text-[#5BB3B3]" />
                <h3 className="font-semibold text-[#E8E0D5]">{room.title}</h3>
              </div>
              <p className="text-sm text-[#A0B0BC]">{room.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 pb-20 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-[#E8E0D5]">Ready to enter the campus?</div>
            <div className="mt-1 text-sm text-[#A0B0BC]">Start with one topic. Let ATOM guide the next right step.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/rooms" className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              Browse Library Rooms
            </Link>
            <Link href="/signup" className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
              Start Free <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
