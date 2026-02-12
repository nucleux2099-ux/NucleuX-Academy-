'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Atom } from 'lucide-react';
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

      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[rgba(91,179,179,0.18)] border border-[rgba(91,179,179,0.35)] flex items-center justify-center">
              <Atom className="w-5 h-5 text-[#5BB3B3]" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[#E8E0D5]">NucleuX Academy</div>
              <div className="text-xs text-[#A0B0BC]">Learn atomically and grow exponentially</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/campus" className="text-sm text-[#E8E0D5] hover:text-white transition-colors">
                Take the tour
              </Link>
              <Link href="/atom" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Meet ATOM
              </Link>
              <Link href="/pricing" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Early access
              </Link>
              <Link href="/faq" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Contact
              </Link>
              <Link
                href="/campus"
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white text-sm font-medium"
              >
                Take the tour <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/campus"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white text-sm font-medium"
              >
                Tour <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
              Built for MBBS + Residents • NEET-PG/INICET workflows
            </div>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">NucleuX Academy</h1>
            <p className="mt-3 text-xl text-[#A0B0BC]">Learn atomically and grow exponentially.</p>
            <p className="mt-4 text-lg text-[#A0B0BC]">
              Not another “content app”. A learning OS — built as a campus, powered by ATOM.
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
            title: 'Atomic learning',
            body: 'Break complex topics into the smallest teachable units, then connect them into a mental model.',
          }, {
            title: 'Retrieval > rereading',
            body: 'Recall and application (MCQs/cases) turn reading into usable clinical knowledge.',
          }, {
            title: 'Calibration + reflection',
            body: 'Confidence must match performance. Backstage helps you see blind spots and improve predictably.',
          }, {
            title: 'Rooms with jobs',
            body: 'Each room does one thing well. ATOM changes behaviour by room so the system stays coherent.',
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
