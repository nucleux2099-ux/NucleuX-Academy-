'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Atom } from 'lucide-react';

const slides = [
  {
    title: 'Library',
    subtitle: 'Modes, structure, and connected understanding.',
    imageSrc: '/marketing/screens/library.png',
    accent: '#5BB3B3',
  },
  {
    title: 'Classroom',
    subtitle: 'Live learning with notes, mindmaps, and replay.',
    imageSrc: '/marketing/screens/classroom.png',
    accent: '#6BA8C9',
  },
  {
    title: 'Exam Centre',
    subtitle: 'Exam practice with explanations that teach.',
    imageSrc: '/marketing/screens/exam-centre.png',
    accent: '#C9A86C',
  },
  {
    title: 'Arena',
    subtitle: 'Timed drills to pressure-proof recall.',
    imageSrc: '/marketing/screens/arena.png',
    accent: '#EC4899',
  },
  {
    title: 'Backstage',
    subtitle: 'Competency, calibration, reflection, and logbook.',
    imageSrc: '/marketing/screens/backstage.png',
    accent: '#A78BFA',
  },
  {
    title: 'Common Room',
    subtitle: 'Community discussions that end in clarity.',
    imageSrc: '/marketing/screens/common-room.png',
    accent: '#10B981',
  },
] as const;

function Slide({
  title,
  subtitle,
  imageSrc,
  accent,
}: {
  title: string;
  subtitle: string;
  imageSrc: string;
  accent: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55 }}
      className="relative min-h-[72vh] lg:min-h-[86vh] py-10 lg:py-14"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/35 shadow-matte-lg">
          <div className="relative aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={imageSrc}
              alt={`${title} screenshot`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={title === 'Library'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute left-6 bottom-6 right-6">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
                style={{ borderColor: `${accent}33`, color: accent, backgroundColor: `${accent}14` }}
              >
                Room preview
              </div>
              <div className="mt-3 text-3xl sm:text-4xl font-bold text-[#E8E0D5]">{title}</div>
              <div className="mt-1 text-sm sm:text-base text-[#A0B0BC] max-w-2xl">{subtitle}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

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
              <div className="text-xs text-[#A0B0BC]">Virtual Campus • Presentation-style learning OS</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/campus" className="text-sm text-[#E8E0D5] hover:text-white transition-colors">
              Take the tour
            </Link>
            <Link href="/atom" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Meet ATOM
            </Link>
            <Link href="/pricing" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Early access
            </Link>
            <Link
              href="/campus"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white text-sm font-medium"
            >
              Take the tour <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
              Built for MBBS + Residents • NEET-PG/INICET workflows
            </div>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
              A virtual campus for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">medical mastery</span>.
            </h1>
            <p className="mt-5 text-lg text-[#A0B0BC]">
              Library • Classroom • Exam Centre • Arena • Backstage • Common Room — with ATOM adapting to each room.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/campus" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                  Take the tour <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-6 py-4 text-base font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                  Early access
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Presentation slides */}
      <div className="relative z-10">
        {slides.map((s) => (
          <Slide key={s.title} {...s} />
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-[#E8E0D5]">Want early access?</div>
            <div className="mt-1 text-sm text-[#A0B0BC]">Pricing is coming soon — we’re onboarding in waves while we polish the campus.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/campus" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Take the tour
              </span>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                Request early access
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-[#A0B0BC]">© {new Date().getFullYear()} NucleuX Academy</div>
          <div className="flex gap-4 text-sm">
            <Link href="/about" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Early access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
