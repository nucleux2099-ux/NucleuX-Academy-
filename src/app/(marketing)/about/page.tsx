'use client';

import { Atom, Heart, BookOpen, Brain, Stethoscope, Target, GraduationCap } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const values = [
  {
    icon: Brain,
    title: 'Learning Happens at Encoding',
    description: 'Most platforms focus on review. We focus on the moment you first encounter a concept — using active recall, desirable difficulty, and metacognitive triggers.',
    color: '#E879F9',
  },
  {
    icon: Atom,
    title: 'Atomic Thinking',
    description: 'Named after the idea of breaking complex medical knowledge into fundamental, irreducible units. Like atoms in chemistry — small, powerful, combinable.',
    color: '#5BB3B3',
  },
  {
    icon: BookOpen,
    title: 'Recognition ≠ Retrieval',
    description: 'Watching a video and feeling "I know this" is recognition. Being able to recall it in a clinical scenario is retrieval. We build retrieval, not false confidence.',
    color: '#6BA8C9',
  },
  {
    icon: Stethoscope,
    title: 'Clinical Connections First',
    description: 'Every concept links to the bedside. We teach pathways, not just facts. Because in the ward, isolated facts are useless.',
    color: '#10B981',
  },
  {
    icon: Target,
    title: 'Calibration Over Cramming',
    description: 'Mastery is when confidence matches performance. We measure the gap between what you think you know and what you actually know — then help you close it.',
    color: '#F59E0B',
  },
  {
    icon: Heart,
    title: 'Affordable Excellence',
    description: 'Premium medical education shouldn\'t require a loan. At ₹4,999/year (75-80% cheaper than alternatives), we make world-class learning accessible.',
    color: '#DC2626',
  },
];

const timeline = [
  { year: '2024', event: 'Dr. Aditya (MD, General Medicine) — frustrated by passive video-based learning — starts building an alternative' },
  { year: '2025', event: 'ATOM is born — an AI tutor that cites textbooks, remembers your journey, and teaches using Socratic method' },
  { year: '2026', event: 'NucleuX Academy launches with 720+ MCQs, 1,400+ topics, 87 CBME specialties, and 25 textbook integrations' },
  { year: 'Next', event: 'Regional languages, institutional partnerships, expanding from medical to all learning — one platform for everyone' },
];

export default function AboutPage() {
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

      <MarketingHeader
        active="about"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: '/signup', label: 'Start with ATOM' }}
        secondaryCta={{ href: '/campus', label: 'Campus Tour' }}
      />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24 relative z-10">
        {/* Hero */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Our Story
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-[#E8E0D5] leading-tight">
            Built by a physician who was{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#E879F9]">
              tired of passive learning.
            </span>
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC] leading-relaxed">
            NucleuX Academy started with a simple frustration: <em className="text-[#E8E0D5]">&quot;Why does medical education still rely on hours of video lectures when learning science has proven that active recall, spaced repetition, and retrieval practice work better?&quot;</em>
          </p>
          <p className="mt-4 text-[#A0B0BC] leading-relaxed">
            Dr. Aditya Chandra Bhatla (MD, General Medicine) — a practicing physician — decided to build the platform he wished he had during his own MBBS and residency. Not another content dump, but a true learning system.
          </p>
        </div>

        {/* Origin Story */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-bold text-[#E8E0D5]">The Name: NucleuX</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-8">
            <div>
              <blockquote className="border-l-2 border-[#5BB3B3] pl-4 text-[#E8E0D5] italic relative">
                <div className="absolute -left-px top-0 bottom-0 w-0.5 bg-[#5BB3B3] shadow-[0_0_8px_rgba(91,179,179,0.4)]" />
                &quot;Like dense chromatin is condensed and well-organized inside a nucleus — that&apos;s how knowledge should be stored in your mind. NucleuX.&quot;
              </blockquote>
              <p className="mt-4 text-[#A0B0BC] leading-relaxed">
                The &apos;X&apos; represents the unknown — the frontier of AI-powered education. Just as a nucleus contains the blueprint of life, NucleuX contains the blueprint of medical knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#E8E0D5] mb-3">The ATOM Story</h3>
              <p className="text-[#A0B0BC] leading-relaxed">
                ATOM stands for our philosophy of <span className="text-[#5BB3B3] font-medium">Atomic Thinking</span> — breaking complex medical knowledge into fundamental, irreducible units. Like atoms in chemistry, these knowledge units are small, powerful, and infinitely combinable.
              </p>
              <p className="mt-3 text-[#A0B0BC] leading-relaxed">
                But ATOM is also your AI teaching companion — one that doesn&apos;t just answer questions, but teaches through Socratic dialogue, cites actual textbook pages, and remembers where you struggled last week.
              </p>
            </div>
          </div>
        </div>

        {/* The Problem We Solve */}
        <div className="mt-16 rounded-2xl border border-[#E879F9]/20 bg-[#E879F9]/5 p-8">
          <h2 className="text-2xl font-bold text-[#E8E0D5] mb-4">The Problem We Saw</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#E879F9] mb-2">What Exists Today</h3>
              <ul className="space-y-2 text-[#A0B0BC]">
                <li className="flex gap-2"><span className="text-[#E879F9]">•</span> Hours of passive video lectures (₹20-30K/year)</li>
                <li className="flex gap-2"><span className="text-[#E879F9]">•</span> MCQ banks without conceptual teaching</li>
                <li className="flex gap-2"><span className="text-[#E879F9]">•</span> Generic AI chatbots that don&apos;t know medical textbooks</li>
                <li className="flex gap-2"><span className="text-[#E879F9]">•</span> No connection between learning and CBME requirements</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#5BB3B3] mb-2">What We Built</h3>
              <ul className="space-y-2 text-[#A0B0BC]">
                <li className="flex gap-2"><span className="text-[#5BB3B3]">•</span> Active recall from day one — no passive watching</li>
                <li className="flex gap-2"><span className="text-[#5BB3B3]">•</span> AI tutor citing Bailey &amp; Love, Harrison&apos;s, Robbins (page numbers)</li>
                <li className="flex gap-2"><span className="text-[#5BB3B3]">•</span> 87 CBME specialties, 7,288 NMC competencies mapped</li>
                <li className="flex gap-2"><span className="text-[#5BB3B3]">•</span> ₹4,999/year — accessible to every Indian med student</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#E8E0D5] text-center">The Science Behind Our Approach</h2>
          <p className="mt-2 text-center text-[#A0B0BC]">Every feature is built on proven learning science — metacognition, desirable difficulty, and active recall</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02] transition-all duration-200"
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
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#5BB3B3] shrink-0 group-hover:shadow-[0_0_8px_rgba(91,179,179,0.6)] transition-shadow duration-200" />
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

        {/* Vision */}
        <div className="mt-16 rounded-2xl border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-8 text-center">
          <GraduationCap className="w-12 h-12 text-[#5BB3B3] mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-[#E8E0D5]">The Vision: Beyond Medicine</h2>
          <p className="mt-2 text-[#A0B0BC] max-w-xl mx-auto">
            We started with medical students because we are physicians. But the technology — AI-powered active recall, textbook-grounded teaching, competency mapping — works for any domain. From medical students to school kids, our long-term vision is one platform for all learning.
          </p>
          <a
            href="/signup"
            className="mt-6 inline-flex items-center rounded-xl bg-[#5BB3B3] hover:bg-[#4A9E9E] px-6 py-3 font-semibold text-slate-950 transition-colors"
          >
            Join the Journey
          </a>
        </div>
      </main>

      <SupportFooter />
    </div>
  );
}
