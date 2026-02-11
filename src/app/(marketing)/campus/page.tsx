'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
      className="relative py-16 lg:py-24 scroll-mt-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
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
            <Image
              src={room.imageSrc}
              alt={`${room.title} screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function CampusTourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#E8E0D5] font-bold">
            NucleuX Academy
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/campus" className="text-[#E8E0D5]">
              Campus Tour
            </Link>
            <Link href="/atom" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Meet ATOM
            </Link>
            <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Early access
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium"
            >
              Enter campus
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Presentation-style product tour
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
            Take the tour — see the campus{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">room by room</span>.
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Each room has a job. ATOM changes behaviour inside each room to make you learn faster and deeper.
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

      {/* Sections */}
      {rooms.map((room, idx) => (
        <RoomSection key={room.id} room={room} index={idx} />
      ))}

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
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
