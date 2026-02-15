import { Atom, Heart, BookOpen, Brain, Users, Stethoscope } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const values = [
  {
    icon: Brain,
    title: 'Concept-First Learning',
    description: 'Understanding mechanisms comes before compression. Build the mental model, then revise fast.',
    color: '#E879F9',
  },
  {
    icon: Atom,
    title: 'Atomic Thinking',
    description: 'Break complex topics into fundamental units. Find the smallest idea that explains the largest pattern.',
    color: '#5BB3B3',
  },
  {
    icon: BookOpen,
    title: 'Retrieval Over Re-reading',
    description: 'Quiz, recall, apply. Active retrieval turns reading into usable clinical knowledge.',
    color: '#6BA8C9',
  },
  {
    icon: Stethoscope,
    title: 'Clinical Connections',
    description: 'Every concept links to the bedside. We teach pathways, not just facts.',
    color: '#10B981',
  },
  {
    icon: Users,
    title: 'Built by Physicians',
    description: 'Created by two brothers — one in residency, one building the learning science. Real problems, real solutions.',
    color: '#F59E0B',
  },
  {
    icon: Heart,
    title: 'Calibration, Not Cramming',
    description: 'Mastery is when confidence matches performance. We measure the gap and help you close it.',
    color: '#DC2626',
  },
];

const timeline = [
  { year: '2024', event: 'The idea — two physician brothers frustrated with how medicine is taught' },
  { year: '2025', event: 'ATOM born — AI that teaches atomically, not just answers questions' },
  { year: '2026', event: 'NucleuX Academy launches — a full virtual campus with Library, Desk, Training Centre' },
  { year: 'Next', event: 'Faculty partnerships, institutional licensing, regional language support' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <MarketingHeader
        active="about"
        subtitle="Learn atomically and grow exponentially"
        primaryCta={{ href: '/campus', label: 'Take the tour' }}
        secondaryCta={{ href: '/login', label: 'Enter' }}
      />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24">
        {/* Hero */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Our Story
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-[#E8E0D5] leading-tight">
            We&apos;re building a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">
              learning OS
            </span>{' '}
            for medicine.
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC] leading-relaxed">
            NucleuX Academy started with a simple question: <em className="text-[#E8E0D5]">&quot;What if medical education worked like your brain actually works?&quot;</em>
          </p>
          <p className="mt-4 text-[#A0B0BC] leading-relaxed">
            Medical students don&apos;t lack motivation — they lack a system. A system that breaks complexity into atoms,
            connects everything to the bedside, measures what you actually know (not what you think you know),
            and grows with you from MBBS to consultant.
          </p>
        </div>

        {/* Origin Story */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-bold text-[#E8E0D5]">The Origin</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[#A0B0BC] leading-relaxed">
                Two physician brothers — one living the chaos of surgical residency, the other obsessed with
                learning science — realized the same thing independently:
              </p>
              <blockquote className="mt-4 border-l-2 border-[#5BB3B3] pl-4 text-[#E8E0D5] italic">
                &quot;Like dense chromatin is condensed and well-organized inside a nucleus — that&apos;s how knowledge should be.
                NucleuX.&quot;
              </blockquote>
            </div>
            <div>
              <p className="text-[#A0B0BC] leading-relaxed">
                The campus metaphor came naturally — a Library for browsing, a Desk for deep work, a Training Centre
                for practice, an Arena for competition, and ATOM as the AI thinking partner that follows you everywhere.
              </p>
              <p className="mt-4 text-[#A0B0BC] leading-relaxed">
                Every room has a job. Every feature serves learning. No bloat.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#E8E0D5] text-center">What We Believe</h2>
          <p className="mt-2 text-center text-[#A0B0BC]">The principles that guide every feature we build</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${v.color}15` }}
                >
                  <v.icon className="w-5 h-5" style={{ color: v.color }} />
                </div>
                <h3 className="font-semibold text-[#E8E0D5]">{v.title}</h3>
                <p className="mt-2 text-sm text-[#A0B0BC] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#E8E0D5] text-center">Our Journey</h2>
          <div className="mt-8 max-w-2xl mx-auto space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#5BB3B3] shrink-0" />
                  {i < timeline.length - 1 && <div className="w-0.5 h-16 bg-white/10" />}
                </div>
                <div className="pb-8">
                  <span className="text-sm font-bold text-[#5BB3B3]">{item.year}</span>
                  <p className="mt-1 text-[#E8E0D5]">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ATOM Section */}
        <div className="mt-16 rounded-2xl border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-8 text-center">
          <Atom className="w-12 h-12 text-[#5BB3B3] mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-[#E8E0D5]">Meet ATOM</h2>
          <p className="mt-2 text-[#A0B0BC] max-w-xl mx-auto">
            ATOM is your AI thinking partner — not a chatbot. It adapts to every room in the campus:
            Librarian in the Library, Coach in Backstage, Trainer in the Training Centre.
            One partner that grows with you.
          </p>
          <a
            href="/atom"
            className="mt-6 inline-flex items-center rounded-xl bg-[#5BB3B3] hover:bg-[#4A9E9E] px-6 py-3 font-semibold text-white transition-colors"
          >
            Learn more about ATOM
          </a>
        </div>
      </main>

      <SupportFooter />
    </div>
  );
}
