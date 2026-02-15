'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, LayoutDashboard, GraduationCap, Atom, Brain, Sparkles, Users, Shield } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* subtle campus blueprint grid */}
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
        {/* Radial glow behind hero */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,179,179,0.15),transparent_50%)] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-3xl relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3] font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Medical Education Platform
            </div>
            <h1 className="mt-6 text-5xl sm:text-7xl font-bold leading-tight">
              <span className="text-[#E8E0D5]">NucleuX</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8E0D5] to-[#5BB3B3]">Academy</span>
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-[#A0B0BC] leading-relaxed">
              Learn with structure. Practice with feedback.<br />
              Progress with <span className="text-[#5BB3B3] font-semibold">AI-calibrated</span> precision.
            </p>
            <p className="mt-4 text-lg text-[#6B7A88]">
              A virtual campus for MBBS students, Interns, and Junior Residents — powered by ATOM, your AI thinking partner that remembers your journey.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors shadow-lg shadow-[#5BB3B3]/20">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <span className="inline-flex w-full items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3 Key Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <h2 className="text-center text-3xl font-bold text-[#E8E0D5] mb-3">Your Complete Learning Ecosystem</h2>
          <p className="text-center text-[#A0B0BC] mb-12 max-w-2xl mx-auto">Three powerful spaces designed around how physicians actually learn — connected by ATOM, your AI companion.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Library',
                description: 'A structured knowledge map — not a dump of pages. Prerequisites, related topics, and mental models all connected.',
                color: '#7BA69E',
                features: ['Curated Content', 'Topic Maps', 'Quick Reference'],
                delay: 0,
              },
              {
                icon: LayoutDashboard,
                title: 'Desk + ATOM',
                description: 'Your personal workspace with ATOM — an AI companion that remembers your weak areas and adapts to your learning patterns.',
                color: '#5BB3B3',
                features: ['AI Companion', 'Longitudinal Memory', 'Personalized Study'],
                highlight: true,
                delay: 0.1,
              },
              {
                icon: GraduationCap,
                title: 'Training Centre',
                description: 'PYQs, patient simulators, clinical flows, and OSCE stations — every mistake links back to the concept that fixes it.',
                color: '#6366F1',
                features: ['Patient Simulator', 'PYQ Practice', 'Clinical Pathways'],
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

      {/* ATOM Highlight */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="rounded-3xl border border-[#5BB3B3]/20 bg-gradient-to-br from-[#5BB3B3]/10 to-transparent p-10 sm:p-14">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-[#5BB3B3]/20 flex items-center justify-center flex-shrink-0">
                <Atom className="w-10 h-10 text-[#5BB3B3]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Meet ATOM — Your AI Thinking Partner</h2>
                <p className="text-lg text-[#A0B0BC] leading-relaxed">
                  Unlike generic AI chatbots, ATOM remembers your weak areas and learning patterns over time. It shows up in every room — Library, Desk, Training Centre — providing contextual help that gets smarter the more you learn.
                </p>
              </div>
              <Link href="/login" className="flex-shrink-0">
                <span className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors">
                  Try ATOM <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#A0B0BC] mb-6">
              <Shield className="w-4 h-4" />
              Built by physicians, for physicians
            </div>
            <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Trusted by the Medical Community</h2>
            <p className="text-[#A0B0BC] max-w-2xl mx-auto">
              Created by practicing physicians who understand the challenges of medical education — from MBBS to residency and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                stat: 'Evidence-Based',
                desc: 'Content sourced from standard textbooks — Bailey, Sabiston, Harrison\'s, and more.',
                delay: 0,
              },
              {
                icon: Users,
                stat: 'Physician-Designed',
                desc: 'Every feature built around real clinical learning workflows and exam preparation needs.',
                delay: 0.1,
              },
              {
                icon: Sparkles,
                stat: 'AI-Enhanced',
                desc: 'Cutting-edge AI that adapts to your learning patterns for truly personalized education.',
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
          <h2 className="text-3xl font-bold text-[#E8E0D5] mb-3">Ready to transform how you learn medicine?</h2>
          <p className="text-[#A0B0BC] mb-8 max-w-xl mx-auto">Join NucleuX Academy and experience AI-powered medical education designed for the next generation of physicians.</p>
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
