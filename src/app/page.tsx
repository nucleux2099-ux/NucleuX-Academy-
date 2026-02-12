'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* subtle campus blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(91,179,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.15) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/30 to-slate-950/70" />

      <MarketingHeader active="home" subtitle="Learn atomically and grow exponentially" primaryCta={{ href: '/campus', label: 'Take the tour' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
              Built for MBBS + Residents • NEET-PG/INICET workflows
            </div>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">NucleuX Academy</h1>
            <p className="mt-3 text-xl text-[#A0B0BC]">
              Learn with structure. Practice with feedback. Progress with calibration.
            </p>
            <p className="mt-4 text-lg text-[#A0B0BC]">
              A virtual campus for MBBS, Interns, and Junior Residents — with ATOM as your thinking partner that stays with you.
            </p>
            <p className="mt-3 text-sm text-[#6B7280]">
              The differentiator: ATOM remembers your weak areas and patterns over time, and shows up in every room.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/campus" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                  Take the tour <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
              <Link href="/atom" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                  Meet ATOM
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{
            title: 'Learn with structure',
            body: 'Library is not a dump of pages. It is a connected map: prerequisites, related topics, and mental models.',
          }, {
            title: 'Practice with feedback',
            body: 'Exam Centre/Arena are not just scores. Every mistake links back to the concept that fixes it.',
          }, {
            title: 'Progress with calibration',
            body: 'Backstage aligns confidence with accuracy, so performance becomes predictable in exams and wards.',
          }, {
            title: 'ATOM stays with you',
            body: 'The main feature: longitudinal memory of your weak areas and patterns — plus presence across every room.',
          }].map((x) => (
            <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-bold text-[#E8E0D5]">{x.title}</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">{x.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/35 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-[#E8E0D5]">See the campus in action</div>
            <div className="mt-1 text-sm text-[#A0B0BC]">A virtual campus for medical mastery — with real screenshots.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/campus" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                Take the tour
              </span>
            </Link>
            <Link href="/rooms" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Rooms (detailed)
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
