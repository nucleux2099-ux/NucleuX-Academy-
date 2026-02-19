'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, Star, Users, Sparkles } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const testimonials = [
  {
    name: 'Dr. Priya S.',
    role: 'NEET-PG Aspirant',
    text: 'ATOM feels like having a brilliant senior available 24/7. It actually cites the textbook page when explaining — something no other platform does.',
    rating: 5,
  },
  {
    name: 'Rahul M.',
    role: 'Final Year MBBS',
    text: 'I switched from Marrow because I was tired of passive videos. NucleuX\'s active recall approach made me realize how much I was just recognizing, not actually knowing.',
    rating: 5,
  },
  {
    name: 'Dr. Kavitha R.',
    role: 'Junior Resident, Surgery',
    text: 'The CBME mapping is incredible. I can track exactly which competencies I\'ve covered and which ones need work. Plus it\'s ridiculously affordable.',
    rating: 5,
  },
];

const features = [
  { icon: '🧠', title: 'AI That Teaches, Not Just Answers', desc: 'ATOM uses Socratic questioning, cites 25 textbooks, and remembers your weak areas across sessions.' },
  { icon: '📚', title: 'Textbook-Grounded Content', desc: 'Every explanation comes with citations from Bailey & Love, Harrison\'s, Robbins — with actual page numbers.' },
  { icon: '🎯', title: 'Active Recall, Not Passive Videos', desc: '6 view modes, spaced repetition (SM-2), and 720+ MCQs — because retrieval beats recognition.' },
  { icon: '💰', title: '₹4,999/year (Not ₹20-30K)', desc: '75-80% cheaper than Marrow/PrepLadder. Premium medical education shouldn\'t bankrupt you.' },
  { icon: '📋', title: '87 CBME Specialties Mapped', desc: '7,288 NMC competencies mapped to content. Know exactly where you stand in your curriculum.' },
  { icon: '⚡', title: 'Built by a Physician', desc: 'Created by Dr. Aditya (MD, General Medicine) who lived the problem he\'s solving.' },
];

export default function LandingPage() {
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

      <MarketingHeader active="home" subtitle="AI-powered medical education" primaryCta={{ href: '/signup', label: 'Start Free' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      {/* Hero — Conversion Focused */}
      <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-24 pb-16 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,179,179,0.15),transparent_50%)] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3] font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Join 100+ medical students already learning smarter
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight text-[#E8E0D5]">
            Stop watching videos.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#E879F9]">Start actually learning.</span>
          </h1>
          
          <p className="mt-6 text-xl sm:text-2xl text-[#A0B0BC] max-w-2xl mx-auto leading-relaxed">
            NucleuX Academy is the AI-powered medical learning platform that thinks like your best senior — with textbook citations, active recall, and a price that doesn&apos;t hurt.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <span className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors shadow-lg shadow-[#5BB3B3]/20">
                Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
              </span>
            </Link>
            <Link href="/pricing">
              <span className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Plans from ₹4,999/yr
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { value: '720+', label: 'MCQs' },
              { value: '11', label: 'Subjects' },
              { value: '87', label: 'CBME Specialties' },
              { value: '25', label: 'Textbooks' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-[#5BB3B3]">{s.value}</div>
                <div className="text-sm text-[#A0B0BC]">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pain Point → Solution */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="rounded-3xl border border-[#E879F9]/20 bg-[#E879F9]/5 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5] mb-4">The Dirty Secret of Medical Education Platforms</h2>
          <p className="text-lg text-[#A0B0BC] max-w-2xl mx-auto mb-8">
            Watching a 2-hour video and feeling &quot;I know this&quot; is <span className="text-[#E879F9] font-semibold">recognition</span>.<br />
            Being able to recall it in a clinical scenario is <span className="text-[#5BB3B3] font-semibold">retrieval</span>.<br />
            Most platforms sell you recognition at ₹20-30K/year. We build retrieval at ₹4,999.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5]">Why Medical Students Choose NucleuX</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-[#E8E0D5] mb-2">{f.title}</h3>
              <p className="text-sm text-[#A0B0BC] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Preview */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-3">Platform Preview</h2>
          <p className="text-[#A0B0BC] max-w-2xl mx-auto">See what&apos;s waiting inside — real screenshots, not rendered mockups.</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {[
            { src: '/screenshots/atom-demo.png', alt: 'ATOM AI tutor', caption: 'ATOM — your AI teaching companion' },
            { src: '/screenshots/rooms-library.jpg', alt: 'Rooms with 11 subjects', caption: '11 subjects, 1,400+ topics, 720+ MCQs' },
            { src: '/screenshots/campus-tour.jpg', alt: 'Campus tour', caption: 'Library, Desk & Training Centre' },
          ].map((img) => (
            <div key={img.src} className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[33%] snap-center space-y-3">
              <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <Image src={img.src} alt={img.alt} width={800} height={500} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="text-center text-sm text-[#A0B0BC]">{img.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#A0B0BC] mb-4">
            <Users className="w-4 h-4" />
            From our early users
          </div>
          <h2 className="text-3xl font-bold text-[#E8E0D5]">What Students Are Saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-all duration-200"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#E8E0D5] text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <div>
                <div className="font-semibold text-[#E8E0D5] text-sm">{t.name}</div>
                <div className="text-xs text-[#A0B0BC]">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="rounded-3xl border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-10 sm:p-14 text-center">
          <Atom className="w-12 h-12 text-[#5BB3B3] mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#E8E0D5] mb-4">
            Your future patients deserve a doctor who truly learned — not one who just watched videos.
          </h2>
          <p className="text-lg text-[#A0B0BC] mb-8 max-w-xl mx-auto">
            Start free today. No credit card. No commitment. Just better learning.
          </p>
          <Link href="/signup">
            <span className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors shadow-lg shadow-[#5BB3B3]/20">
              Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </Link>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
