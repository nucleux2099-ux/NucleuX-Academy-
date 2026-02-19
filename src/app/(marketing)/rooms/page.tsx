'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';
import { SUBJECTS } from '@/lib/data/subjects';

const viewModes = ['Explorer', 'Exam Prep', 'Quiz', 'Cases', 'Revision', 'Deep Dive'];

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(91,179,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.15) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/30 to-slate-950/70" />

      <MarketingHeader active="rooms" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-8 sm:pb-10 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">Library Rooms</div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Subject rooms in the Library</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Each subject room is built for connected learning: concept files, retrieval modes, and ATOM-ready teaching flow.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECTS.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
                  <span className="text-xl">{subject.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E8E0D5]">{subject.name}</h3>
                  <p className="text-xs text-[#A0B0BC]">{subject.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {viewModes.map((mode) => (
                  <span key={mode} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#6B7A88] border border-white/10">
                    {mode}
                  </span>
                ))}
              </div>

              <Link href={`/library/${subject.slug}`} className="inline-flex items-center gap-2 text-sm text-[#5BB3B3] hover:text-[#7BC5C5] transition-colors">
                Open room <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 pb-20 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 text-center">
          <BookOpen className="w-10 h-10 text-[#5BB3B3] mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-[#E8E0D5] mb-3">Ready to start learning inside the Library?</h2>
          <p className="text-[#A0B0BC] mb-6">Pick a subject room and begin with one concept. ATOM will guide the rest.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
              Start Free <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/campus" className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              Campus Tour
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
