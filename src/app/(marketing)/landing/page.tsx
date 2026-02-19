'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Layers, Brain, Compass } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const manifesto = [
  {
    title: 'Teach mechanisms, not slogans',
    body: 'When you understand why, memory becomes stable and transferable.',
    icon: Brain,
  },
  {
    title: 'Design for retrieval, not comfort',
    body: 'Real learning is effortful, active, and testable.',
    icon: Layers,
  },
  {
    title: 'Build direction, not confusion',
    body: 'Every session should answer: What next? Why next? How much next?',
    icon: Compass,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5]">
      <MarketingHeader active="home" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <section className="max-w-6xl mx-auto px-6 pt-14 sm:pt-24 pb-14 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
            A new contract for medical learning.
          </h1>
          <p className="mt-6 text-xl text-[#A0B0BC] max-w-3xl mx-auto">
            NucleuX replaces passive learning loops with an operational system for understanding,
            recall, and clinical reasoning.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl px-9 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
              Start with ATOM <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/rooms" className="inline-flex items-center justify-center rounded-xl px-9 py-4 text-lg font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
              Explore Library Rooms
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-[#5BB3B3]/25 bg-[#5BB3B3]/10 p-8 text-center">
          <Atom className="w-8 h-8 text-[#5BB3B3] mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-3">ATOM is a teaching partner, not a chat shortcut.</h2>
          <p className="text-[#A0B0BC] max-w-3xl mx-auto">
            It helps you break down complexity, retrieve under pressure, and make your next study step deliberate.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-7 text-center">NucleuX Manifesto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {manifesto.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <m.icon className="w-5 h-5 text-[#5BB3B3] mb-3" />
              <h3 className="font-semibold mb-2">{m.title}</h3>
              <p className="text-sm text-[#A0B0BC]">{m.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
