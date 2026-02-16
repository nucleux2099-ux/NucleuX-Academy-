'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Stethoscope, Brain, Heart, Microscope, FlaskConical, Pill, Bug, Scale, Activity, Baby } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const subjects = [
  { icon: BookOpen, title: 'Anatomy', topics: 180, mcqs: 85, color: '#5BB3B3', desc: 'Gross anatomy, histology, embryology — with clinical correlations' },
  { icon: Activity, title: 'Physiology', topics: 160, mcqs: 75, color: '#6366F1', desc: 'Organ systems, homeostasis, and applied physiology' },
  { icon: FlaskConical, title: 'Biochemistry', topics: 140, mcqs: 60, color: '#F59E0B', desc: 'Metabolism, molecular biology, clinical biochemistry' },
  { icon: Microscope, title: 'Pathology', topics: 170, mcqs: 90, color: '#DC2626', desc: 'General & systemic pathology — from Robbins with love' },
  { icon: Pill, title: 'Pharmacology', topics: 150, mcqs: 80, color: '#E879F9', desc: 'Drug mechanisms, classifications, and clinical pharmacology' },
  { icon: Bug, title: 'Microbiology', topics: 120, mcqs: 55, color: '#10B981', desc: 'Bacteriology, virology, parasitology, mycology' },
  { icon: Scale, title: 'Forensic Medicine', topics: 80, mcqs: 40, color: '#A78BFA', desc: 'Medicolegal aspects, toxicology, and ethics' },
  { icon: Heart, title: 'Community Medicine', topics: 90, mcqs: 45, color: '#F97316', desc: 'Epidemiology, biostatistics, and public health' },
  { icon: Stethoscope, title: 'Surgery', topics: 130, mcqs: 85, color: '#5BB3B3', desc: 'General surgery, specialties — from Bailey & Love and Sabiston' },
  { icon: Brain, title: 'Medicine', topics: 140, mcqs: 80, color: '#6BA8C9', desc: 'Internal medicine — Harrison\'s mapped to Indian practice' },
  { icon: Baby, title: 'OBG', topics: 100, mcqs: 50, color: '#EC4899', desc: 'Obstetrics & Gynaecology — Williams and Shaw\'s' },
];

export default function RoomsPage() {
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

      <MarketingHeader active="rooms" subtitle="Browse by subject" primaryCta={{ href: '/signup', label: 'Start Free' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      <section className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-8 sm:pb-10 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Library Rooms
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">11 subjects. 1,400+ topics.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Each subject is a &quot;room&quot; in the Library. Inside every room: topic files mapped to NMC competencies, 6 view modes, and ATOM ready to teach. All sourced from standard textbooks.
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '1,400+', label: 'Topic Files' },
            { value: '720+', label: 'MCQs' },
            { value: '7,288', label: 'NMC Competencies' },
            { value: '25', label: 'Textbooks Referenced' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <div className="text-2xl font-bold text-[#5BB3B3]">{s.value}</div>
              <div className="text-xs text-[#A0B0BC] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Subject Cards */}
      <section className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  <subject.icon className="w-6 h-6" style={{ color: subject.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E8E0D5]">{subject.title}</h3>
                  <p className="text-xs text-[#A0B0BC]">{subject.desc}</p>
                </div>
              </div>
              
              <div className="flex gap-4 mb-4">
                <div className="flex-1 rounded-lg bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-[#E8E0D5]">{subject.topics}+</div>
                  <div className="text-xs text-[#A0B0BC]">Topics</div>
                </div>
                <div className="flex-1 rounded-lg bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-[#E8E0D5]">{subject.mcqs}+</div>
                  <div className="text-xs text-[#A0B0BC]">MCQs</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['Explorer', 'Exam Prep', 'Quiz', 'Cases', 'Revision', 'Deep Dive'].map((mode) => (
                  <span key={mode} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#6B7A88] border border-white/10">
                    {mode}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's Inside Each Room */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-bold text-[#E8E0D5] mb-6">What&apos;s Inside Each Room?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#5BB3B3] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#E8E0D5] text-sm">Topic Files</h4>
                  <p className="text-xs text-[#A0B0BC]">Each topic is a structured file with concepts, clinical correlations, and textbook citations. Not a video — a living document that ATOM can teach from.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#E879F9] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#E8E0D5] text-sm">6 View Modes</h4>
                  <p className="text-xs text-[#A0B0BC]">Same topic, six ways: Explorer (concepts), Exam Prep (high-yield), Quiz (MCQs), Cases (clinical), Revision (rapid), Deep Dive (research-level).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#F97316] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#E8E0D5] text-sm">CBME Competency Tags</h4>
                  <p className="text-xs text-[#A0B0BC]">Every topic is tagged with relevant NMC competencies. Track your CBME progress as you learn.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#6366F1] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#E8E0D5] text-sm">Prerequisites & Links</h4>
                  <p className="text-xs text-[#A0B0BC]">Topics aren&apos;t isolated. Each one links to prerequisites, related concepts, and clinical applications. Build a connected knowledge graph.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#10B981] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#E8E0D5] text-sm">Textbook Citations</h4>
                  <p className="text-xs text-[#A0B0BC]">Every fact cites its source: Bailey &amp; Love Ch.42, p.621. Harrison&apos;s Ch.370, p.2090. You always know where to go deeper.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#F59E0B] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#E8E0D5] text-sm">ATOM Integration</h4>
                  <p className="text-xs text-[#A0B0BC]">Ask ATOM anything about the topic. It teaches using Socratic method, tracks your understanding, and links to related content.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12 pb-20 relative z-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-[#E8E0D5] mb-3">Ready to enter the Library?</h2>
          <p className="text-[#A0B0BC] mb-6">Start with 3 subjects free. Unlock all 11 with Premium.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <span className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                Start Free <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </Link>
            <Link href="/campus">
              <span className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                Campus Tour
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SupportFooter />
    </div>
  );
}
