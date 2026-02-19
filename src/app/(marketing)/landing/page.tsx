'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Brain, BookOpen, GraduationCap, Compass, Sparkles } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const pillars = [
  {
    icon: Brain,
    title: 'First-principles learning',
    desc: 'We teach from foundations to reasoning. Not shortcuts without understanding.',
  },
  {
    icon: BookOpen,
    title: 'Textbook-grounded clarity',
    desc: 'ATOM explains with source-grounded logic and clear conceptual anchors.',
  },
  {
    icon: GraduationCap,
    title: 'Retrieval-driven practice',
    desc: 'Learning is built around recall, application, and correction loops.',
  },
  {
    icon: Compass,
    title: 'Guided progression',
    desc: 'You always know what to do next: what to learn, test, and revisit.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(91,179,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.15) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/30 to-slate-950/70" />

      <MarketingHeader active="home" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-24 pb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3] font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            For MBBS, PG prep, and residency growth
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight text-[#E8E0D5]">
            Learn with structure.
            <br />
            Think with ATOM.
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-[#A0B0BC] max-w-3xl mx-auto leading-relaxed">
            NucleuX Academy is where medical learning becomes coherent: first principles, retrieval practice,
            and continuous feedback inside one connected campus.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors shadow-lg shadow-[#5BB3B3]/20">
              Start with ATOM <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/campus" className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              See the Campus
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <div className="rounded-3xl border border-[#E879F9]/20 bg-[#E879F9]/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5] mb-4">Recognition is not mastery.</h2>
          <p className="text-lg text-[#A0B0BC] max-w-3xl mx-auto">
            Watching and highlighting can feel good. But clinical confidence comes from retrieval and reasoning.
            NucleuX is designed for that shift.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5]">What makes this different</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <p.icon className="w-6 h-6 text-[#5BB3B3] mb-4" />
              <h3 className="font-bold text-[#E8E0D5] mb-2">{p.title}</h3>
              <p className="text-sm text-[#A0B0BC] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="rounded-3xl border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-10 sm:p-14 text-center">
          <Atom className="w-12 h-12 text-[#5BB3B3] mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-4">
            Build the kind of understanding patients can trust.
          </h2>
          <p className="text-lg text-[#A0B0BC] mb-8 max-w-2xl mx-auto">
            Enter the campus. Pick one topic. Let ATOM run a disciplined learning loop with you.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors shadow-lg shadow-[#5BB3B3]/20">
            Start Free <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
