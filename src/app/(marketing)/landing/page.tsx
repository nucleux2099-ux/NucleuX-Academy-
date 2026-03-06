'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Layers, Brain, Compass, Sparkles } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const manifesto = [
  {
    title: 'Teach mechanisms, not slogans',
    body: 'When you understand why a disease happens, memory becomes stable and transferable to real patients.',
    icon: Brain,
  },
  {
    title: 'Design for retrieval, not comfort',
    body: 'Real learning is effortful, active, and testable. Passive video watching creates false confidence.',
    icon: Layers,
  },
  {
    title: 'Build direction, not confusion',
    body: 'Every session with ATOM ends by answering: What next? Why next? How much next?',
    icon: Compass,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(91,179,179,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />

      <MarketingHeader active="home" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-28 pb-16 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm font-medium text-[#5BB3B3] mb-8">
            <Sparkles className="w-4 h-4" /> The NucleuX Ideology
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight text-white">
            Learn Atomically.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#8EE4E4]">
              Grow Exponentially.
            </span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-[#A0B0BC] max-w-3xl mx-auto font-light leading-relaxed">
            NucleuX replaces passive learning loops with an operational system for understanding,
            recall, and clinical reasoning. Powered by ATOM, your personalized AI Teaching Companion.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-2xl px-10 py-4 text-lg font-bold text-slate-950 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:scale-105 transition-all shadow-[0_0_20px_rgba(91,179,179,0.3)]">
              Start with ATOM <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/rooms" className="inline-flex items-center justify-center rounded-2xl px-10 py-4 text-lg font-bold border border-white/20 bg-white/5 hover:bg-white/10 transition-all hover:scale-105 text-white">
              Explore Library Rooms
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] border border-[#5BB3B3]/25 bg-gradient-to-br from-[#5BB3B3]/10 to-[#131E30]/50 backdrop-blur-xl p-10 sm:p-14 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#5BB3B3]/20 border border-[#5BB3B3]/40 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Atom className="w-10 h-10 text-[#5BB3B3]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white tracking-tight">ATOM is a teaching partner, not a chat shortcut.</h2>
          <p className="text-lg sm:text-xl text-[#A0B0BC] max-w-3xl mx-auto leading-relaxed">
            It helps you break down extreme complexity into atomic knowledge blocks, retrieves information under pressure, forces you into Socratic thinking, and makes your next study step utterly deliberate.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28 relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-center text-white tracking-tight">The NucleuX Manifesto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {manifesto.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-3xl border border-white/10 bg-[#131E30]/40 backdrop-blur-xl p-8 hover:bg-[#131E30]/70 hover:border-white/20 transition-all shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5BB3B3]/10 border border-[#5BB3B3]/20 flex items-center justify-center mb-6">
                <m.icon className="w-6 h-6 text-[#5BB3B3]" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-3">{m.title}</h3>
              <p className="text-[#A0B0BC] leading-relaxed">{m.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
