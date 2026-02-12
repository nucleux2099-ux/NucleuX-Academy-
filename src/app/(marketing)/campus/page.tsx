'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SupportFooter } from '@/components/marketing/SupportFooter';

type Room = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  imageSrc: string;
  accent: string;
};

const rooms: Room[] = [
  {
    id: 'library',
    title: 'Library',
    subtitle: 'Modes, structure, and connected understanding.',
    bullets: [
      'Explorer / Exam Prep / Textbook / Quiz / Cases / Roadmap',
      'Prerequisites + related-topic graph for real comprehension',
      'Consistent standards across Medicine + Surgery',
    ],
    imageSrc: '/marketing/screens/library.png',
    accent: '#5BB3B3',
  },
  {
    id: 'classroom',
    title: 'Classroom',
    subtitle: 'Live learning with notes, mindmaps, and replay.',
    bullets: [
      'ATOM teaches step-by-step (not just answers)',
      'Notes + mindmaps generated as you learn',
      'Replay to revise fast before exams',
    ],
    imageSrc: '/marketing/screens/classroom.png',
    accent: '#6BA8C9',
  },
  {
    id: 'exam-centre',
    title: 'Exam Centre',
    subtitle: 'Exam-focused practice with explanations that teach.',
    bullets: [
      'Topic-wise MCQs + feedback loops',
      'Explanations link back to concepts in the Library',
      'Patterns for NEET-PG / INICET style practice',
    ],
    imageSrc: '/marketing/screens/exam-centre.png',
    accent: '#C9A86C',
  },
  {
    id: 'arena',
    title: 'Arena',
    subtitle: 'Timed drills to pressure-proof recall.',
    bullets: [
      'Mixed sets for real exam recall',
      'Accuracy + speed, tracked over time',
      'Challenge yourself (without losing learning quality)',
    ],
    imageSrc: '/marketing/screens/arena.png',
    accent: '#EC4899',
  },
  {
    id: 'backstage',
    title: 'Backstage',
    subtitle: 'Competency, calibration, reflection, and logbook.',
    bullets: [
      'Competency ladder: UI → CI → CC → UC',
      'Confidence vs accuracy calibration (fix blind spots)',
      'Reflection systems (Kolb cycle) that compound learning',
    ],
    imageSrc: '/marketing/screens/backstage.png',
    accent: '#A78BFA',
  },
  {
    id: 'common-room',
    title: 'Common Room',
    subtitle: 'Community discussions that end in clarity.',
    bullets: [
      'Doubts, threads, and high-yield takeaways',
      'Peer learning with structure',
      'Summaries you can revise later',
    ],
    imageSrc: '/marketing/screens/common-room.png',
    accent: '#10B981',
  },
];

function RoomSection({ room, index }: { room: Room; index: number }) {
  const isOdd = index % 2 === 1;

  return (
    <section
      id={room.id}
      className="relative py-16 lg:py-24 scroll-mt-24 lg:min-h-[90vh] lg:snap-start"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', scrollSnapAlign: 'start' }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className={isOdd ? 'lg:order-2' : ''}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
            style={{ borderColor: `${room.accent}33`, color: room.accent, backgroundColor: `${room.accent}14` }}
          >
            Room
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#E8E0D5]">{room.title}</h2>
          <p className="mt-3 text-[#A0B0BC] text-base">{room.subtitle}</p>

          <ul className="mt-6 space-y-2 text-sm text-[#A0B0BC]">
            {room.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: room.accent }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950"
              style={{ backgroundColor: room.accent }}
            >
              Enter campus <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Early access
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className={isOdd ? 'lg:order-1' : ''}
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-matte-lg">
            <motion.div
              initial={{ scale: 1.02 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={room.imageSrc}
                alt={`${room.title} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function CampusTourPage() {
  const roomIds = useMemo(() => rooms.map((r) => r.id), []);
  const [activeId, setActiveId] = useState(roomIds[0]);

  useEffect(() => {
    const els = roomIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { threshold: [0.35, 0.5, 0.65] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [roomIds]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="leading-tight">
            <div className="text-[#E8E0D5] font-bold">NucleuX Academy</div>
            <div className="text-xs text-[#A0B0BC]">A virtual campus for medical mastery</div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/campus" className="text-[#E8E0D5]">
                Take the tour
              </Link>
              <Link href="/atom" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Meet ATOM
              </Link>
              <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Early access
              </Link>
              <Link href="/faq" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Contact
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium"
              >
                Enter campus
              </Link>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/campus"
                className="px-3 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium"
              >
                Tour
              </Link>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-[#E8E0D5] font-medium"
              >
                Enter
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-8 sm:pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            A virtual campus for medical mastery
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
            Take the tour — see the campus{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">room by room</span>.
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Each room has one job. ATOM changes behaviour by room — so you learn faster, deeper, and with less chaos.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {rooms.map((r) => (
            <a
              key={r.id}
              href={`#${r.id}`}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-white/5 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors"
              style={{ borderColor: `${r.accent}33` }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.accent }} />
              {r.title}
            </a>
          ))}
        </div>
      </section>

      {/* Sections (scroll-snap on desktop) */}
      <div className="relative lg:snap-y lg:snap-mandatory" style={{ scrollSnapType: 'y mandatory' }}>
        {/* Progress dots */}
        <div className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
          {rooms.map((r) => {
            const isActive = activeId === r.id;
            return (
              <div key={r.id} className="relative group flex items-center justify-end">
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-md border border-white/10 bg-slate-950/85 backdrop-blur px-2 py-1 text-[11px] text-[#E8E0D5] shadow-matte-lg whitespace-nowrap">
                    {r.title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scrollTo(r.id)}
                  aria-label={`Go to ${r.title}`}
                  className="h-3 w-3 rounded-full border transition-all"
                  style={{
                    backgroundColor: isActive ? r.accent : 'rgba(255,255,255,0.18)',
                    borderColor: isActive ? `${r.accent}99` : 'rgba(255,255,255,0.25)',
                    transform: isActive ? 'scale(1.25)' : 'scale(1)',
                    boxShadow: isActive ? `0 0 0 6px ${r.accent}22` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        {rooms.map((room, idx) => (
          <RoomSection key={room.id} room={room} index={idx} />
        ))}
      </div>

      <SupportFooter />
    </div>
  );
}
