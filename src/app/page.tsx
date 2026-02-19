'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, LayoutDashboard, GraduationCap, Atom, Brain, Sparkles, Users, Shield, Target, CheckCircle2, XCircle } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const stats = [
  { value: '720+', label: 'MCQs' },
  { value: '11', label: 'Subjects' },
  { value: '87', label: 'CBME Specialties' },
  { value: '25', label: 'Standard Textbooks' },
];

export default function HomePage() {
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

      <MarketingHeader active="home" subtitle="AI-powered medical education" primaryCta={{ href: '/campus', label: 'Take the tour' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-20 pb-16 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,179,179,0.15),transparent_50%)] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-3xl relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3] font-medium">
              <Sparkles className="w-4 h-4" />
              Not another video platform. An AI that teaches.
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-[#E8E0D5]">The AI-powered medical learning platform that thinks like </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#E879F9]">your best senior.</span>
            </h1>
            <p className="mt-5 text-xl sm:text-2xl text-[#A0B0BC] leading-relaxed">
              Active recall. Textbook citations. Spaced repetition.<br />
              Built by physicians who know that <span className="text-[#5BB3B3] font-semibold">recognition ≠ retrieval</span>.
            </p>
            <p className="mt-4 text-lg text-[#6B7A88]">
              For MBBS students, NEET-PG aspirants, and Junior Residents — powered by ATOM, your AI tutor that remembers your journey and cites Bailey &amp; Love, Harrison&apos;s, and Robbins.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors shadow-lg shadow-[#5BB3B3]/20">
                  Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                  ₹4,999/year — See Plans
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-[#5BB3B3]/30 transition-all duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-[#5BB3B3]">{s.value}</div>
                <div className="mt-1 text-sm text-[#A0B0BC]">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It's Different */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-3">How We&apos;re Different</h2>
            <p className="text-[#A0B0BC] max-w-2xl mx-auto">Most platforms give you videos to watch. We give you an AI that teaches, tests, and tracks — because learning happens at <span className="text-[#E879F9] font-semibold">encoding</span>, not review.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-[#A0B0BC] font-medium">Feature</th>
                    <th className="p-4 text-center text-[#5BB3B3] font-bold">NucleuX</th>
                    <th className="p-4 text-center text-[#A0B0BC] font-medium">Marrow / PrepLadder</th>
                  </tr>
                </thead>
                <tbody className="text-[#E8E0D5]">
                  {[
                    ['AI Tutor (remembers your journey)', true, false],
                    ['Textbook citations (page numbers)', true, false],
                    ['Active recall first (not videos)', true, false],
                    ['CBME-mapped (7,288 competencies)', true, false],
                    ['6 view modes per topic', true, false],
                    ['Spaced repetition (SM-2)', true, false],
                    ['Price', '₹4,999/yr', '₹20,000–30,000/yr'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="p-4 text-[#A0B0BC]">{row[0]}</td>
                      <td className="p-4 text-center">
                        {row[1] === true ? <CheckCircle2 className="w-5 h-5 text-[#5BB3B3] mx-auto" /> : <span className="text-[#5BB3B3] font-semibold">{row[1]}</span>}
                      </td>
                      <td className="p-4 text-center">
                        {row[2] === false ? <XCircle className="w-5 h-5 text-[#475569] mx-auto" /> : <span className="text-[#A0B0BC]">{row[2]}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* See It In Action */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-3">See It In Action</h2>
            <p className="text-[#A0B0BC] max-w-2xl mx-auto">Real screenshots from the platform — no mockups, no promises. This is what you get.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <Image src="/screenshots/atom-demo.png" alt="ATOM AI tutor demo" width={800} height={500} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-center text-sm text-[#A0B0BC]">ATOM — your AI teaching companion that remembers your journey</p>
            </div>
            <div className="space-y-4">
              <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <Image src="/screenshots/rooms-library.jpg" alt="Rooms with 11 subjects" width={800} height={500} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-center text-sm text-[#A0B0BC]">11 subjects, 1,400+ topics, 720+ MCQs — all mapped to NMC competencies</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3 Spaces */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
          <h2 className="text-center text-3xl font-bold text-[#E8E0D5] mb-3">Your Complete Learning Ecosystem</h2>
          <p className="text-center text-[#A0B0BC] mb-12 max-w-2xl mx-auto">Three powerful spaces designed around how physicians actually learn — connected by ATOM, your AI companion.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Library',
                description: '1,400+ topic files mapped to NMC competencies. Prerequisites, related topics, and 6 view modes — all from standard textbooks with page citations.',
                color: '#7BA69E',
                features: ['Explorer Mode', 'Exam Prep', 'Case-Based Learning'],
                delay: 0,
              },
              {
                icon: LayoutDashboard,
                title: 'Desk + ATOM',
                description: 'Your personal workspace with ATOM — an AI tutor that knows your weak areas, tracks your spaced repetition schedule, and cites textbooks in every answer.',
                color: '#5BB3B3',
                features: ['AI Tutor', 'Spaced Repetition', 'Study Plans'],
                highlight: true,
                delay: 0.1,
              },
              {
                icon: GraduationCap,
                title: 'Training Centre',
                description: '720+ MCQs across 11 subjects with explanations that link back to concepts. NEET-PG patterns, clinical cases, and OSCE stations.',
                color: '#6366F1',
                features: ['720+ MCQs', 'Clinical Cases', 'NEET-PG Patterns'],
                delay: 0.2,
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + feature.delay }}
                className={`rounded-2xl border p-8 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02] ${
                  feature.highlight
                    ? 'border-[#5BB3B3]/40 bg-[#5BB3B3]/10 shadow-lg shadow-[#5BB3B3]/5'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#E8E0D5] mb-3">{feature.title}</h3>
                <p className="text-[#A0B0BC] mb-5 leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.features.map((f) => (
                    <span key={f} className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#A0B0BC] border border-white/10">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What Makes ATOM Different */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="rounded-3xl border border-[#5BB3B3]/20 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-10 sm:p-14">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-[#5BB3B3]/20 flex items-center justify-center flex-shrink-0">
                <Atom className="w-10 h-10 text-[#5BB3B3]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Meet ATOM — Not a Chatbot. A Teaching Companion.</h2>
                <p className="text-lg text-[#A0B0BC] leading-relaxed mb-4">
                  ATOM knows your weak areas, remembers your learning journey, and cites actual textbook pages. It doesn&apos;t just answer — it teaches using Socratic questioning, spaced repetition triggers, and clinical correlations.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Cites 25 textbooks', 'Remembers your journey', 'Knows your weak areas', 'Teaches, not answers'].map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-[#5BB3B3]/15 text-[#5BB3B3] border border-[#5BB3B3]/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/signup" className="flex-shrink-0">
                <span className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                  Try ATOM Free <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6 View Modes */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
          <h2 className="text-center text-3xl font-bold text-[#E8E0D5] mb-3">One Topic. Six Ways to Learn.</h2>
          <p className="text-center text-[#A0B0BC] mb-12 max-w-2xl mx-auto">Every topic in the library can be viewed in 6 different modes — because every student learns differently, and every stage of preparation needs a different approach.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'Explorer', desc: 'Deep conceptual understanding with clinical correlations', color: '#5BB3B3' },
              { icon: '📝', title: 'Exam Prep', desc: 'High-yield points formatted for NEET-PG recall', color: '#E879F9' },
              { icon: '❓', title: 'Quiz', desc: 'Active recall MCQs with textbook-linked explanations', color: '#F97316' },
              { icon: '🏥', title: 'Cases', desc: 'Clinical scenarios that test application, not just memory', color: '#6366F1' },
              { icon: '⚡', title: 'Revision', desc: 'Condensed rapid-fire review before exams', color: '#10B981' },
              { icon: '🧠', title: 'Deep Dive', desc: 'Research-level detail for those who want to go beyond', color: '#F59E0B' },
            ].map((mode) => (
              <div key={mode.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
                <div className="text-2xl mb-3">{mode.icon}</div>
                <h3 className="font-bold text-[#E8E0D5] mb-1">{mode.title}</h3>
                <p className="text-xs text-[#A0B0BC] leading-relaxed">{mode.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#A0B0BC] mb-6">
              <Shield className="w-4 h-4" />
              Built by a practicing physician, for physicians
            </div>
            <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Why Doctors Trust NucleuX</h2>
            <p className="text-[#A0B0BC] max-w-2xl mx-auto">
              Created by Dr. Aditya (MD, General Medicine) who understands firsthand that medical education needs to be smarter, not just more content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                stat: '7,288 NMC Competencies',
                desc: 'Every topic mapped to CBME competencies across 87 specialties. Your learning is curriculum-aligned.',
                delay: 0,
              },
              {
                icon: Users,
                stat: 'Textbook-Grounded',
                desc: 'Content from Bailey & Love, Sabiston, Harrison\'s, Robbins, and 21 more — with actual page citations.',
                delay: 0.1,
              },
              {
                icon: Target,
                stat: '75-80% Cheaper',
                desc: '₹4,999/year vs ₹20,000-30,000 for Marrow. Premium medical education shouldn\'t require a loan.',
                delay: 0.2,
              },
            ].map((item) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + item.delay }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200"
              >
                <item.icon className="w-8 h-8 text-[#5BB3B3] mx-auto mb-4" />
                <div className="text-xl font-bold text-[#E8E0D5] mb-2">{item.stat}</div>
                <p className="text-sm text-[#A0B0BC]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Stop watching. Start learning.</h2>
          <p className="text-[#A0B0BC] mb-8 max-w-xl mx-auto">Join NucleuX Academy — where AI meets active recall, and every answer comes with a textbook citation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <span className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </span>
            </Link>
            <Link href="/campus">
              <span className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Take the Tour
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
