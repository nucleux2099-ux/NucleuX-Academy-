'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';
import { SUBJECTS } from '@/lib/data/subjects';

const viewModes = ['Explorer', 'Exam Prep', 'Quiz', 'Cases', 'Revision', 'Deep Dive'];

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(147,51,234,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#9333EA]/10 blur-[150px] rounded-full pointer-events-none" />

      <MarketingHeader active="rooms" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <section className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-8 sm:pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl text-center mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-[#A0B0BC] backdrop-blur-md mb-6">
            <Layers className="w-4 h-4 text-[#9333EA]" />
            Library Rooms
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight">
            Decode Every Subject.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-[#C084FC]">
              One Room At A Time.
            </span>
          </h1>
          <p className="mt-8 text-xl text-[#A0B0BC] font-light max-w-2xl mx-auto leading-relaxed">
            Every medical subject has its own dedicated room. Inside, algorithms weave concepts into a unified graph, unlocking retrieval networks and mapping everything to the clinical ward.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-3xl border border-white/10 bg-[#131E30]/40 backdrop-blur-xl p-8 hover:bg-[#131E30]/60 hover:border-white/20 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-3xl"
                style={{ backgroundColor: `${subject.color}15` }}
              />

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner"
                  style={{ backgroundColor: `${subject.color}20`, border: `1px solid ${subject.color}40` }}
                >
                  <span className="text-2xl drop-shadow-md">{subject.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{subject.name}</h3>
                  <p className="text-sm text-[#A0B0BC] mt-0.5">{subject.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                {viewModes.map((mode) => (
                  <span key={mode} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#1A263C] text-[#A0B0BC] border border-white/5 group-hover:border-white/10 transition-colors">
                    {mode}
                  </span>
                ))}
              </div>

              <Link
                href={`/library/${subject.slug}`}
                className="inline-flex items-center w-full justify-between gap-2 text-sm font-semibold rounded-xl bg-white/5 border border-white/10 px-5 py-3 hover:bg-white/10 transition-all text-white relative z-10"
                style={{ '--hover-color': subject.color } as React.CSSProperties}
              >
                Enter Room
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-[var(--hover-color)] transition-colors">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-[#131E30]/60 backdrop-blur-xl p-12 sm:p-16 text-center shadow-[0_0_40px_rgba(91,179,179,0.1)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#131E30] to-transparent opacity-50" />

          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-[#5BB3B3]/20 border border-[#5BB3B3]/40 flex items-center justify-center mx-auto mb-8 shadow-inner">
              <BookOpen className="w-10 h-10 text-[#5BB3B3]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">Ready to step into the Library?</h2>
            <p className="text-xl text-[#A0B0BC] mb-10 max-w-2xl mx-auto font-light">
              Pick a subject room and begin with one concept. ATOM will guide the rest, connecting dots you didn&apos;t even know existed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-[#0B1220] bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(91,179,179,0.3)] hover:shadow-[0_0_30px_rgba(91,179,179,0.5)]"
              >
                Start Free Access <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/campus"
                className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                Continue Campus Tour
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <SupportFooter />
    </div>
  );
}
