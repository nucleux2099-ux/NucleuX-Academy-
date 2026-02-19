'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Atom,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Users,
  Swords,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const rooms = [
  {
    title: 'Room 01 — Welcome Center',
    desc: 'Set your stage, identify weak zones, and start with a focused path instead of random studying.',
    icon: Sparkles,
  },
  {
    title: 'Room 02 — Library',
    desc: 'Structured topics by subject/subspecialty/prerequisites with textbook-grounded explanations.',
    icon: BookOpen,
  },
  {
    title: 'Room 03 — Exam Center',
    desc: 'MCQs, cases, timed tests, and feedback that points to exact concept gaps.',
    icon: GraduationCap,
  },
  {
    title: 'Room 04 — AI Tutor (ATOM Chamber)',
    desc: 'Socratic learning: ATOM challenges assumptions before giving answers.',
    icon: Atom,
  },
  {
    title: 'Room 05 — Dashboard (Desk)',
    desc: 'Mission control for progress, weak clusters, revision queue, and next best action.',
    icon: LayoutDashboard,
  },
  {
    title: 'Room 06 — Common Room',
    desc: 'Reflect, connect, and consolidate with notes, discussion, and integration.',
    icon: Users,
  },
  {
    title: 'Room 07 — Arena',
    desc: 'Pressure-tested application through clinical drills and decision-focused practice.',
    icon: Swords,
  },
  {
    title: 'Room 08 — Backstage',
    desc: 'Your feedback engine: analytics, error-pattern clusters, confidence calibration, and next-best intervention triggers.',
    icon: BarChart3,
  },
];

const loop = [
  'Plan — choose target competency/topic',
  'Encode — build first principles with ATOM',
  'Retrieve — active recall through questioning',
  'Apply — solve MCQ/case with reasoning',
  'Diagnose (Backstage) — identify exact weak nodes from your error patterns',
  'Reinforce — spaced return at the right interval',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(91,179,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.15) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/30 to-slate-950/70" />

      <MarketingHeader
        active="home"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: '/signup', label: 'Start Free with ATOM' }}
        secondaryCta={{ href: '/campus', label: 'Campus Tour' }}
      />

      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-20 pb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3] font-medium">
            <Sparkles className="w-4 h-4" />
            Built for MBBS, NEET-PG, and Residency
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight text-[#E8E0D5]">
            Learn like a clinician.
            <br />
            Not like a content consumer.
          </h1>
          <p className="mt-5 text-xl sm:text-2xl text-[#A0B0BC] leading-relaxed">
            NucleuX Academy is a medical learning OS where ATOM teaches through first principles, active retrieval, and textbook-grounded reasoning.
          </p>
          <p className="mt-3 text-lg text-[#6B7A88]">Because recognition is not mastery. Retrieval is.</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
              Start Free with ATOM <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/campus" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              Take the Campus Tour
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <div className="rounded-3xl border border-[#E879F9]/20 bg-[#E879F9]/5 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5] mb-4">Most platforms optimize watch-time. We optimize understanding.</h2>
          <p className="text-[#A0B0BC] text-lg leading-relaxed">
            Watching content can feel productive. But “I&apos;ve seen it” is not “I can explain it under pressure.”
            <br />
            NucleuX is built on encoding, retrieval, and application — not passive review loops.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <div className="rounded-3xl border border-[#5BB3B3]/20 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-8 sm:p-10">
          <div className="flex items-start gap-4 mb-4">
            <Atom className="w-8 h-8 text-[#5BB3B3] mt-1" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5]">Meet ATOM — your teaching companion</h2>
              <p className="mt-3 text-[#A0B0BC] leading-relaxed">
                ATOM is not a chatbot wrapper. It is a learning framework in action: break to atomic concepts, connect across subjects,
                test retrieval, diagnose gaps, and schedule reinforcement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-3">Welcome to the NucleuX Campus</h2>
        <p className="text-[#A0B0BC] mb-8 max-w-3xl">One campus. Eight rooms. One coherent learning loop.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div key={room.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-2">
                <room.icon className="w-5 h-5 text-[#5BB3B3]" />
                <h3 className="font-semibold text-[#E8E0D5]">{room.title}</h3>
              </div>
              <p className="text-sm text-[#A0B0BC]">{room.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-8">The NucleuX Learning Loop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loop.map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#5BB3B3] mt-0.5" />
              <span className="text-[#A0B0BC] text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Serious about becoming a better doctor?</h2>
          <p className="text-[#A0B0BC] mb-8 max-w-2xl mx-auto">Enter the campus. Pick one topic. Let ATOM run the loop with you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
              Start Free <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/rooms" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              Explore All Rooms
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
