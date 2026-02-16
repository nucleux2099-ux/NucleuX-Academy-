'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, LayoutDashboard, GraduationCap, Search, FileText, HelpCircle, Stethoscope, Zap, Brain } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const spaces = [
  {
    icon: BookOpen,
    title: 'The Library',
    subtitle: 'Your knowledge base — organized like a medical textbook should be.',
    color: '#5BB3B3',
    description: '1,400+ topic files across 11 subjects, mapped to NMC competencies and sourced from 25 standard textbooks. Every topic has prerequisites, related concepts, and clinical correlations linked together.',
    features: [
      'Subject-wise organization with topic maps',
      'Prerequisites & related topics automatically linked',
      'Content from Bailey & Love, Harrison\'s, Robbins, Sabiston',
      'CBME competency tags on every topic',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'The Desk',
    subtitle: 'Your personal workspace where ATOM lives.',
    color: '#E879F9',
    highlight: true,
    description: 'This is where the magic happens. ATOM sits at your desk — tracking your spaced repetition schedule, remembering your weak areas, generating personalized study plans, and teaching through Socratic dialogue.',
    features: [
      'ATOM AI tutor with longitudinal memory',
      'Spaced repetition scheduler (SM-2 algorithm)',
      'Personalized study plans based on your gaps',
      'Progress tracking and confidence calibration',
    ],
  },
  {
    icon: GraduationCap,
    title: 'The Training Centre',
    subtitle: 'Practice that builds retrieval, not recognition.',
    color: '#F97316',
    description: '720+ MCQs across 11 subjects with detailed explanations that link back to library topics. Clinical cases, NEET-PG pattern questions, and OSCE stations — every mistake links to the concept that fixes it.',
    features: [
      '720+ MCQs with textbook-linked explanations',
      'NEET-PG/INICET pattern questions',
      'Clinical case simulations',
      'Performance analytics & weak-area identification',
    ],
  },
];

const viewModes = [
  { icon: Search, title: 'Explorer', desc: 'Deep conceptual understanding — the "why" behind every fact. Clinical correlations, mechanisms, and connections.', color: '#5BB3B3' },
  { icon: FileText, title: 'Exam Prep', desc: 'High-yield points formatted for NEET-PG. Tables, mnemonics, and must-remember facts — optimized for recall.', color: '#E879F9' },
  { icon: HelpCircle, title: 'Quiz', desc: 'Active recall MCQs on this specific topic. Each question tests understanding, not just memory.', color: '#F97316' },
  { icon: Stethoscope, title: 'Cases', desc: 'Clinical scenarios that test application. "A 45-year-old presents with..." — think like a clinician.', color: '#6366F1' },
  { icon: Zap, title: 'Revision', desc: 'Condensed rapid-fire review. When you have 10 minutes before the exam — this is what you read.', color: '#10B981' },
  { icon: Brain, title: 'Deep Dive', desc: 'Research-level detail, recent advances, landmark studies. For those who want to go beyond the textbook.', color: '#F59E0B' },
];

export default function CampusTourPage() {
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

      <MarketingHeader active="campus" subtitle="A virtual campus for medical mastery" primaryCta={{ href: '/signup', label: 'Start Free' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-8 sm:pb-10 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Virtual Campus Tour
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
            Three spaces. One learning system.
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            NucleuX Academy is organized like a real campus — a Library for knowledge, a Desk for personalized learning with ATOM, and a Training Centre for practice. Every space is connected, and ATOM follows you everywhere.
          </p>
        </div>
      </section>

      {/* Three Spaces */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="space-y-8">
          {spaces.map((space, i) => (
            <motion.div
              key={space.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-3xl border p-8 sm:p-10 ${
                space.highlight
                  ? `border-[${space.color}]/30 bg-gradient-to-br from-[${space.color}]/10 to-transparent`
                  : 'border-white/10 bg-white/[0.03]'
              }`}
              style={space.highlight ? { borderColor: `${space.color}30`, background: `linear-gradient(135deg, ${space.color}10, transparent)` } : {}}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${space.color}20` }}
                    >
                      <space.icon className="w-7 h-7" style={{ color: space.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5]">{space.title}</h2>
                      <p className="text-[#A0B0BC]">{space.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-[#A0B0BC] leading-relaxed mt-4">{space.description}</p>
                  {space.highlight && (
                    <div className="mt-6 space-y-3">
                      <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        <Image src="/screenshots/atom-demo.png" alt="ATOM in action" width={800} height={500} className="w-full h-auto" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                      <p className="text-center text-xs text-[#A0B0BC]">ATOM in action — Socratic teaching, not spoon-feeding</p>
                    </div>
                  )}
                </div>
                <div className="md:w-80 flex-shrink-0">
                  <ul className="space-y-3">
                    {space.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#E8E0D5]">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: space.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6 View Modes */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-3">6 View Modes — Same Topic, 6 Ways to Learn</h2>
          <p className="text-[#A0B0BC] max-w-2xl mx-auto">
            Every topic in the Library can be viewed in 6 different modes. Because a 1st-year MBBS student and a NEET-PG aspirant need different things from the same topic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {viewModes.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${mode.color}15` }}
              >
                <mode.icon className="w-5 h-5" style={{ color: mode.color }} />
              </div>
              <h3 className="font-bold text-[#E8E0D5] mb-2">{mode.title}</h3>
              <p className="text-sm text-[#A0B0BC] leading-relaxed">{mode.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Example Flow */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="rounded-3xl border border-[#5BB3B3]/20 bg-gradient-to-br from-[#5BB3B3]/5 to-transparent p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-[#E8E0D5] mb-4">Example: Learning &quot;Acute Pancreatitis&quot;</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-[#5BB3B3]">1. Library (Explorer Mode)</div>
              <p className="text-sm text-[#A0B0BC]">Read the concept with clinical correlations, pathophysiology flowcharts, and textbook citations from Sabiston Ch.54 and Harrison&apos;s Ch.370.</p>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-semibold text-[#E879F9]">2. Desk (ATOM teaches)</div>
              <p className="text-sm text-[#A0B0BC]">ATOM quizzes you: &quot;What&apos;s the most common cause of acute pancreatitis? What differentiates it from chronic?&quot; — Socratic, not spoon-fed.</p>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-semibold text-[#F97316]">3. Training Centre (Quiz)</div>
              <p className="text-sm text-[#A0B0BC]">Solve MCQs on pancreatitis. Get wrong? ATOM shows you exactly which concept you missed — with the page number in Sabiston.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-[#E8E0D5]">Ready to explore the campus?</div>
            <div className="mt-1 text-sm text-[#A0B0BC]">Start free — 50 MCQs/day, 3 subjects, and 10 ATOM queries. No credit card needed.</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link href="/rooms" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Browse Rooms
              </span>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <span className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                Start Learning Free <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
