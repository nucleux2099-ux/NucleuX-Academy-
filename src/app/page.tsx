'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Atom,
  Brain,
  GitBranch,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Users,
  Swords,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const principles = [
  {
    title: 'From memory load to mental models',
    body: 'Understand mechanisms first. Then compress for revision. This prevents fragile rote learning.',
    icon: Brain,
  },
  {
    title: 'From isolated topics to connected graphs',
    body: 'Each topic sits in a prerequisite chain so you see why a concept exists and where it applies.',
    icon: GitBranch,
  },
  {
    title: 'From passive exposure to retrieval pressure',
    body: 'You are repeatedly asked to recall, explain, and apply under constraints.',
    icon: GraduationCap,
  },
  {
    title: 'From false confidence to calibrated performance',
    body: 'Backstage compares confidence vs correctness and surfaces blind spots early.',
    icon: BarChart3,
  },
];

const rooms = [
  ['Room 01 — Welcome Center', 'Set context, define goals, and choose your learning path.', BookOpen],
  ['Room 02 — Library', 'Structured concept map with prerequisites and linked understanding.', BookOpen],
  ['Room 03 — Exam Center', 'Retrieval-first MCQ/case practice with diagnosis-focused feedback.', GraduationCap],
  ['Room 04 — AI Tutor (ATOM Chamber)', 'Socratic tutoring that challenges assumptions before answers.', Atom],
  ['Room 05 — Desk', 'Daily command center for priorities, review queues, and next action.', LayoutDashboard],
  ['Room 06 — Common Room', 'Collaborative consolidation and reflective synthesis.', Users],
  ['Room 07 — Arena', 'Decision pressure drills for speed, clarity, and resilience.', Swords],
  ['Room 08 — Backstage', 'Performance analytics, error clusters, and calibration loops.', BarChart3],
] as const;

const loop = [
  'Plan — select a competency or clinical target',
  'Encode — build first-principles understanding with ATOM',
  'Retrieve — active recall through guided challenge',
  'Apply — solve questions/cases with reasoning',
  'Diagnose — inspect error pattern + confidence mismatch',
  'Reinforce — spaced revisit until stable retrieval',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5]">
      <MarketingHeader
        active="home"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: '/signup', label: 'Start with ATOM' }}
        secondaryCta={{ href: '/campus', label: 'Campus Tour' }}
      />

      <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-20 pb-14">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/35 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3]">
            <ShieldCheck className="w-4 h-4" /> Learning design over content overload
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Build clinical thinking,
            <br />
            <span className="text-[#5BB3B3]">not just exam memory.</span>
          </h1>

          <p className="mt-6 text-xl text-[#A0B0BC] max-w-4xl leading-relaxed">
            NucleuX Academy is a connected learning campus where ATOM helps you learn in layers:
            concept, retrieval, application, and calibration. You don&apos;t just finish topics — you build usable judgment.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
              Start with ATOM <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/rooms" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              Explore Library Rooms
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="rounded-3xl border border-[#E879F9]/25 bg-[#E879F9]/10 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Core Learning Truth</h2>
          <p className="text-lg text-[#A0B0BC] leading-relaxed">
            Recognition feels like progress. Retrieval proves progress.
            <br />
            ATOM and the campus are engineered around this truth.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">The NucleuX Shift</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p.icon className="w-5 h-5 text-[#5BB3B3] mb-3" />
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-[#A0B0BC]">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">NucleuX Campus Architecture</h2>
        <p className="text-[#A0B0BC] mb-7">Eight rooms. One continuous learning pipeline.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map(([title, desc, Icon]) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-[#5BB3B3]" />
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="text-sm text-[#A0B0BC]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">The ATOM Loop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {loop.map((step) => (
              <div key={step} className="flex gap-3 items-start rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <CheckCircle2 className="w-4 h-4 text-[#5BB3B3] mt-0.5" />
                <span className="text-sm text-[#A0B0BC]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/12 to-transparent p-9 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start with one topic. Build a system for life.</h2>
          <p className="text-[#A0B0BC] max-w-2xl mx-auto mb-8">
            ATOM helps you think better today and compounds that thinking across your medical journey.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
            Enter NucleuX <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
