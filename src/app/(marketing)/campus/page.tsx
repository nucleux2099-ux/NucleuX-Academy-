'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Atom } from 'lucide-react';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const slides = [
  {
    id: 'library',
    title: 'Library',
    subtitle: 'Modes, structure, and connected understanding.',
    imageSrc: '/marketing/screens/library.png',
    accent: '#5BB3B3',
  },
  {
    id: 'classroom',
    title: 'Classroom',
    subtitle: 'Live learning with notes, mindmaps, and replay.',
    imageSrc: '/marketing/screens/classroom.png',
    accent: '#6BA8C9',
  },
  {
    id: 'exam-centre',
    title: 'Exam Centre',
    subtitle: 'Exam practice with explanations that teach.',
    imageSrc: '/marketing/screens/exam-centre.png',
    accent: '#C9A86C',
  },
  {
    id: 'arena',
    title: 'Arena',
    subtitle: 'Timed drills to pressure-proof recall.',
    imageSrc: '/marketing/screens/arena.png',
    accent: '#EC4899',
  },
  {
    id: 'backstage',
    title: 'Backstage',
    subtitle: 'Competency, calibration, reflection, and logbook.',
    imageSrc: '/marketing/screens/backstage.png',
    accent: '#A78BFA',
  },
  {
    id: 'common-room',
    title: 'Common Room',
    subtitle: 'Community discussions that end in clarity.',
    imageSrc: '/marketing/screens/common-room.png',
    accent: '#10B981',
  },
] as const;

function Slide({
  id,
  title,
  subtitle,
  imageSrc,
  accent,
}: {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  accent: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55 }}
      className="relative min-h-[58vh] sm:min-h-[72vh] lg:min-h-[86vh] py-8 sm:py-10 lg:py-14 scroll-mt-20 lg:snap-start"
      style={{ scrollSnapAlign: 'start' }}
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

export default function CampusTourPage() {
  const slideIds = useMemo(() => slides.map((s) => s.id), []);
  const [activeId, setActiveId] = useState<(typeof slideIds)[number]>(slides[0].id);

  useEffect(() => {
    const els = slideIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id as any);
      },
      { threshold: [0.35, 0.5, 0.65] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [slideIds]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[rgba(91,179,179,0.18)] border border-[rgba(91,179,179,0.35)] flex items-center justify-center">
              <Atom className="w-5 h-5 text-[#5BB3B3]" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[#E8E0D5]">NucleuX Academy</div>
              <div className="text-xs text-[#A0B0BC]">A virtual campus for medical mastery</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/campus" className="text-sm text-[#E8E0D5] hover:text-white transition-colors">
                Take the tour
              </Link>
              <Link href="/rooms" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Rooms (detailed)
              </Link>
              <Link href="/atom" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Meet ATOM
              </Link>
              <Link href="/pricing" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Early access
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
                href="/rooms"
                className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-[#E8E0D5] text-sm font-medium"
              >
                Rooms
              </Link>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white text-sm font-medium"
              >
                Enter
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-8 sm:pb-10 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Campus Tour
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">See the campus, room by room.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Want the room-by-room breakdown? Open <Link className="text-[#E8E0D5] underline" href="/rooms">Rooms (detailed)</Link>.
          </p>
        </div>
      </section>

      <div className="relative z-10 lg:snap-y lg:snap-mandatory" style={{ scrollSnapType: 'y mandatory' }}>
        <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
          {slides.map((s) => {
            const isActive = activeId === s.id;
            return (
              <div key={s.id} className="relative group flex items-center justify-end">
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-md border border-white/10 bg-slate-950/85 backdrop-blur px-2 py-1 text-[11px] text-[#E8E0D5] shadow-matte-lg whitespace-nowrap">
                    {s.title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  aria-label={`Go to ${s.title}`}
                  className="h-3 w-3 rounded-full border transition-all"
                  style={{
                    backgroundColor: isActive ? s.accent : 'rgba(255,255,255,0.18)',
                    borderColor: isActive ? `${s.accent}99` : 'rgba(255,255,255,0.25)',
                    transform: isActive ? 'scale(1.25)' : 'scale(1)',
                    boxShadow: isActive ? `0 0 0 6px ${s.accent}22` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        {slides.map((s) => (
          <Slide key={s.id} {...s} />
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-[#E8E0D5]">Want early access?</div>
            <div className="mt-1 text-sm text-[#A0B0BC]">Pricing is coming soon — we’re onboarding in waves while we polish the campus.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/rooms" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Rooms (detailed)
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

      <SupportFooter />
    </div>
  );
}
