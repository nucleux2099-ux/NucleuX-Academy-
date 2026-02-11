import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Target,
  Swords,
  Gauge,
  Users,
  Sparkles,
  ArrowRight,
  Atom,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoomCard, type CampusRoom } from '@/components/marketing/RoomCard';
import { PrincipleTile } from '@/components/marketing/PrincipleTile';

export default function HomePage() {
  const rooms: CampusRoom[] = [
    {
      name: 'Library',
      href: '/login',
      icon: <BookOpen className="w-5 h-5" />,
      color: '#5BB3B3',
      description: 'Concepts with structure. Modes that match your learning.',
      atomRole: 'ATOM Librarian',
      bullets: [
        'Explorer / Exam Prep / Textbook / Quiz / Cases / Roadmap',
        'Prerequisites and related-topic links for true understanding',
        'Save, revisit, and track progress without chaos',
      ],
    },
    {
      name: 'Classroom',
      href: '/login',
      icon: <GraduationCap className="w-5 h-5" />,
      color: '#6BA8C9',
      description: 'Live learning — AI classes and human classes with a scribe.',
      atomRole: 'ATOM Scribe',
      bullets: [
        'Step-by-step teaching with doubts and checkpoints',
        'Live notes + mindmaps while you learn',
        'Replayable sessions for revision',
      ],
    },
    {
      name: 'Exam Centre',
      href: '/login',
      icon: <Target className="w-5 h-5" />,
      color: '#C9A86C',
      description: 'Exam-focused practice with feedback that teaches.',
      atomRole: 'ATOM Trainer',
      bullets: [
        'MCQs by topic + difficulty',
        'Explanations linked back to concepts',
        'Timed blocks for NEET-PG/INICET patterns',
      ],
    },
    {
      name: 'Arena',
      href: '/login',
      icon: <Swords className="w-5 h-5" />,
      color: '#EC4899',
      description: 'Pressure-proof your knowledge. Compete with your past self.',
      atomRole: 'ATOM Challenger',
      bullets: [
        'Mixed drills for real-world recall',
        'Accuracy + speed tracking',
        'Streaks and challenges (without losing learning quality)',
      ],
    },
    {
      name: 'Backstage',
      href: '/login',
      icon: <Gauge className="w-5 h-5" />,
      color: '#A78BFA',
      description: 'Your cognitive dashboard — competence, calibration, reflection.',
      atomRole: 'ATOM Coach',
      bullets: [
        'Competency ladder: UI → CI → CC → UC',
        'Confidence vs accuracy calibration (no blind spots)',
        'Kolb cycle + logbook to convert life into learning',
      ],
    },
    {
      name: 'Common Room (Community)',
      href: '/login',
      icon: <Users className="w-5 h-5" />,
      color: '#10B981',
      description: 'Discuss, clarify, and learn with others.',
      atomRole: 'ATOM Guide',
      bullets: [
        'Doubts, threads, and high-yield discussions',
        'Peer learning with structure',
        'Takeaways summarized for revision',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* subtle campus blueprint grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{
        backgroundImage:
          'linear-gradient(rgba(91,179,179,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.15) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/30 to-slate-950/70" />
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur relative z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[rgba(91,179,179,0.18)] border border-[rgba(91,179,179,0.35)] flex items-center justify-center">
              <Atom className="w-5 h-5 text-[#5BB3B3]" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[#E8E0D5]">NucleuX Academy</div>
              <div className="text-xs text-[#A0B0BC]">Virtual Campus • MBBS + Residents</div>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/atom" className="text-sm text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Meet ATOM
            </Link>
            <Link href="/login">
              <Button className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white">
                Enter Campus <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 relative z-10">
        <div className="max-w-3xl">
          <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Virtual Campus
          </Badge>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
            Learn inside a campus built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">
              medical mastery
            </span>
            .
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Library • Classroom • Exam Centre • Arena • Backstage • Common Room — with ATOM as your thinking partner in every room.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white px-6 py-6 text-base">
                Enter Campus
              </Button>
            </Link>
            <Link href="/atom" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full px-6 py-6 text-base border-white/15 text-[#E8E0D5] bg-white/5 hover:bg-white/10">
                Meet ATOM
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Map */}
      <section className="max-w-7xl mx-auto px-6 pb-10 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#E8E0D5]">Campus Map</h2>
            <p className="text-sm text-[#A0B0BC]">Same rooms. Same names. One coherent learning OS.</p>
          </div>

          {/* Campus legend */}
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Library', color: '#5BB3B3' },
              { name: 'Classroom', color: '#6BA8C9' },
              { name: 'Exam Centre', color: '#C9A86C' },
              { name: 'Arena', color: '#EC4899' },
              { name: 'Backstage', color: '#A78BFA' },
              { name: 'Common Room', color: '#10B981' },
            ].map((x) => (
              <span
                key={x.name}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-[#A0B0BC] bg-white/5"
                style={{ borderColor: `${x.color}33` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: x.color }} />
                {x.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {/* Featured buildings */}
          <div className="xl:col-span-3 md:col-span-2">
            <RoomCard room={rooms[0]} variant="featured" />
          </div>
          <div className="xl:col-span-3 md:col-span-2">
            <RoomCard room={rooms[1]} variant="featured" />
          </div>

          {/* Remaining rooms */}
          {rooms.slice(2).map((r) => (
            <div key={r.name} className="xl:col-span-2">
              <RoomCard room={r} />
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold text-[#E8E0D5]">Ideology</h2>
        <p className="text-sm text-[#A0B0BC] mt-1">How NucleuX Academy thinks about learning.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <PrincipleTile
            title="Concept-first"
            description="Build mechanisms and mental models before compressing into exam points."
          />
          <PrincipleTile
            title="Retrieval beats rereading"
            description="Quiz, recall, and apply — that’s how memory becomes usable knowledge."
          />
          <PrincipleTile
            title="Calibration creates mastery"
            description="Confidence must match performance. Backstage tracks the mismatch."
          />
          <PrincipleTile
            title="Kolb cycle"
            description="Experience → Reflect → Abstract → Experiment. Learning becomes a loop, not a pile."
          />
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="text-lg font-bold text-[#E8E0D5]">Meet ATOM</h3>
            <p className="text-sm text-[#A0B0BC]">One thinking partner, many roles across the campus.</p>
          </div>
          <Link href="/atom">
            <Button variant="secondary" className="bg-[#364A5E] text-[#E8E0D5] hover:bg-[#3A4D5F]">
              Open ATOM page →
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-[#6B7280] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} NucleuX Academy</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#E8E0D5]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#E8E0D5]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
