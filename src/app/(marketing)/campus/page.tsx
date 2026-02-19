'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, LayoutDashboard, Atom, Users, Swords, BarChart3 } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const rooms = [
  { id: '01', title: 'Welcome Center', icon: BookOpen, role: 'Orientation', purpose: 'Set intent, define weak zones, and commit to a path.' },
  { id: '02', title: 'Library', icon: BookOpen, role: 'Knowledge Layer', purpose: 'Build concepts with prerequisite and cross-topic links.' },
  { id: '03', title: 'Exam Center', icon: GraduationCap, role: 'Retrieval Layer', purpose: 'Stress-test recall and reasoning through questions and cases.' },
  { id: '04', title: 'AI Tutor (ATOM Chamber)', icon: Atom, role: 'Teaching Layer', purpose: 'Guided Socratic learning with first-principles focus.' },
  { id: '05', title: 'Desk', icon: LayoutDashboard, role: 'Planning Layer', purpose: 'Prioritize what to study next with deliberate structure.' },
  { id: '06', title: 'Common Room', icon: Users, role: 'Consolidation Layer', purpose: 'Discuss, distill, and stabilize understanding.' },
  { id: '07', title: 'Arena', icon: Swords, role: 'Pressure Layer', purpose: 'Train decisions under constraints and uncertainty.' },
  { id: '08', title: 'Backstage', icon: BarChart3, role: 'Calibration Layer', purpose: 'Detect error patterns and confidence mismatch for correction.' },
];

export default function CampusTourPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5]">
      <MarketingHeader active="campus" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/rooms', label: 'Library Rooms' }} />

      <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-18 pb-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">A virtual campus built for clinical learning.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            These rooms are not pages for navigation. They are stages of cognition: orientation, encoding, retrieval,
            pressure, and calibration.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rooms.map((room, i) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3 mb-2">
                <room.icon className="w-5 h-5 text-[#5BB3B3]" />
                <h3 className="font-semibold">Room {room.id} — {room.title}</h3>
              </div>
              <div className="text-xs text-[#5BB3B3] mb-2">{room.role}</div>
              <p className="text-sm text-[#A0B0BC]">{room.purpose}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold">Walk in with curiosity. Walk out with clarity.</h2>
            <p className="text-sm text-[#A0B0BC] mt-1">Start from any room. ATOM keeps the whole system coherent.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/rooms" className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">Browse Library Rooms</Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">Start with ATOM <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
