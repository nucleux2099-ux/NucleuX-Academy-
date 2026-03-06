'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown, Building2, CircleCheck, XCircle } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const plans = [
  {
    name: 'Free',
    price: { monthly: '₹0', annual: '₹0' },
    period: { monthly: 'forever', annual: 'forever' },
    description: 'Start learning with zero commitment',
    icon: Sparkles,
    color: '#5BB3B3',
    cta: 'Start Free',
    ctaHref: '/signup',
    popular: false,
    features: [
      { text: '50 MCQs per day', included: true },
      { text: '3 subjects', included: true },
      { text: 'Basic ATOM (10 queries/day)', included: true },
      { text: 'Community access', included: true },
      { text: 'Basic study analytics', included: true },
      { text: 'All subjects', included: false },
      { text: 'Unlimited ATOM', included: false },
      { text: 'Spaced repetition', included: false },
      { text: 'Study plans', included: false },
      { text: 'CBME tracker', included: false },
    ],
  },
  {
    name: 'Premium',
    price: { monthly: '₹499', annual: '₹4,999' },
    period: { monthly: '/month', annual: '/year' },
    description: 'Everything you need to learn smarter',
    icon: Zap,
    color: '#E879F9',
    cta: 'Get Premium',
    ctaHref: '/signup?plan=premium',
    popular: true,
    features: [
      { text: 'Unlimited MCQs', included: true },
      { text: 'All 11 subjects', included: true },
      { text: 'Unlimited ATOM with textbook citations', included: true },
      { text: 'Spaced repetition (SM-2)', included: true },
      { text: 'Personalized study plans', included: true },
      { text: 'Full study analytics', included: true },
      { text: '6 view modes per topic', included: true },
      { text: 'Community + study groups', included: true },
      { text: 'CBME tracker', included: false },
      { text: 'Exam simulators', included: false },
    ],
  },
  {
    name: 'Pro',
    price: { monthly: '₹999', annual: '₹9,999' },
    period: { monthly: '/month', annual: '/year' },
    description: 'For serious NEET-PG preparation',
    icon: Crown,
    color: '#F59E0B',
    cta: 'Get Pro',
    ctaHref: '/signup?plan=pro',
    popular: false,
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'CBME competency tracker', included: true },
      { text: 'NEET-PG exam simulators', included: true },
      { text: 'Priority ATOM responses', included: true },
      { text: 'Advanced analytics & weak-area mapping', included: true },
      { text: 'Clinical case generators', included: true },
      { text: 'Confidence calibration tools', included: true },
      { text: 'PYQ pattern analysis', included: true },
      { text: 'Custom study marathons', included: true },
      { text: 'Early access to new features', included: true },
    ],
  },
];

const comparison = [
  { feature: 'Price (annual)', nucleux: '₹4,999', marrow: '₹19,999+', prepladder: '₹22,999+', dams: '₹15,000+' },
  { feature: 'AI tutor', nucleux: true, marrow: false, prepladder: false, dams: false },
  { feature: 'Textbook citations', nucleux: true, marrow: false, prepladder: false, dams: false },
  { feature: 'Active recall first', nucleux: true, marrow: false, prepladder: false, dams: false },
  { feature: 'CBME mapping (87 specialties)', nucleux: true, marrow: false, prepladder: false, dams: false },
  { feature: 'Spaced repetition (SM-2)', nucleux: true, marrow: false, prepladder: false, dams: false },
  { feature: '6 view modes per topic', nucleux: true, marrow: false, prepladder: false, dams: false },
  { feature: 'Video lectures', nucleux: false, marrow: true, prepladder: true, dams: true },
  { feature: 'MCQ bank', nucleux: true, marrow: true, prepladder: true, dams: true },
];

const faqs = [
  {
    q: 'Is the free tier really free?',
    a: 'Yes! 50 MCQs per day, 3 subjects, and 10 ATOM queries per day — forever free. No credit card required. We believe every medical student deserves access to quality learning.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. No lock-in contracts. Cancel from your profile settings and you keep access until the end of your billing period.',
  },
  {
    q: 'Why no video lectures?',
    a: 'Because learning science shows active recall beats passive watching. Every hour spent watching a video could be spent on 3x more effective practice with ATOM. We\'re not anti-video — we\'re pro-learning.',
  },
  {
    q: 'Do you offer institutional pricing?',
    a: 'Yes! ₹2,999/student/year for colleges and hospitals. Includes admin dashboard, curriculum alignment, and bulk licensing. Contact us for details.',
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,121,249,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(232,121,249,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#6366F1]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#E879F9]/10 blur-[120px] rounded-full pointer-events-none" />

      <MarketingHeader
        active="pricing"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: '/signup', label: 'Start with ATOM' }}
        secondaryCta={{ href: '/campus', label: 'Campus Tour' }}
      />

      <main className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E879F9]/30 bg-[#E879F9]/10 px-4 py-1.5 text-sm text-[#E879F9] font-medium shadow-[0_0_15px_rgba(232,121,249,0.2)]">
            75-80% cheaper than Marrow
          </div>
          <h1 className="mt-8 text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight">
            Elite medical education.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#E879F9]">
              Ethical pricing.
            </span>
          </h1>
          <p className="mt-6 text-xl text-[#A0B0BC] font-light leading-relaxed">
            Start free. Upgrade when you&apos;re ready. Every plan includes ATOM — your AI teaching companion.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#131E30]/50 backdrop-blur-md p-1.5 shadow-xl">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-[#5BB3B3] text-[#0B1220] shadow-md' : 'text-[#A0B0BC] hover:text-white'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${billing === 'annual' ? 'bg-[#5BB3B3] text-[#0B1220] shadow-md' : 'text-[#A0B0BC] hover:text-white'
                }`}
            >
              Annual <span className="ml-1 text-[10px] uppercase tracking-wider opacity-80 border border-current px-2 py-0.5 rounded-full">Save 17%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl border p-8 flex flex-col transition-all duration-300 ${plan.popular
                ? 'border-[#E879F9]/50 bg-gradient-to-b from-[#E879F9]/10 to-[#131E30]/80 backdrop-blur-xl md:scale-105 shadow-[0_0_40px_rgba(232,121,249,0.15)] z-10'
                : 'border-white/10 bg-[#131E30]/40 backdrop-blur-sm'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#E879F9] to-[#6366F1] px-5 py-1.5 text-xs font-bold text-white shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${plan.color}20`, border: `1px solid ${plan.color}40` }}
                >
                  <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <p className="text-sm text-[#A0B0BC] font-medium">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white tracking-tight">{plan.price[billing]}</span>
                <span className="text-[#A0B0BC] font-medium ml-2">{plan.period[billing]}</span>
              </div>

              <Link
                href={plan.ctaHref}
                className={`w-full text-center rounded-2xl px-6 py-4 text-lg font-bold transition-all hover:scale-105 active:scale-95 ${plan.popular
                  ? 'bg-gradient-to-r from-[#E879F9] to-[#6366F1] text-white shadow-[0_0_20px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.5)]'
                  : 'border border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-8 flex-1">
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">
                  Everything included:
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="rounded-full bg-[#5BB3B3]/20 p-1 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#5BB3B3]" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-white/5 p-1 mt-0.5">
                          <X className="w-3.5 h-3.5 text-[#475569]" />
                        </div>
                      )}
                      <span className={`text-[15px] leading-snug ${feature.included ? 'text-[#E8E0D5]' : 'text-[#475569]'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Institutional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[2rem] border border-[#F97316]/30 bg-gradient-to-br from-[#F97316]/10 to-[#131E30]/50 backdrop-blur-md p-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
              <Building2 className="w-10 h-10 text-[#F97316]" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">For Medical Colleges &amp; Hospitals</h2>
              <p className="mt-3 text-[#A0B0BC] text-lg max-w-2xl leading-relaxed">
                <span className="text-[#F97316] font-bold text-2xl tracking-tight">₹2,999</span> /student/year — Includes administrative dashboards, curriculum alignment, CBME tracking, and dedicated success managers.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center justify-center rounded-2xl bg-[#F97316]/20 border border-[#F97316]/40 hover:bg-[#F97316]/30 hover:border-[#F97316] px-8 py-4 text-lg font-bold text-[#F97316] transition-all hover:scale-105 active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">NucleuX vs The Rest</h2>
            <p className="text-xl text-[#A0B0BC]">See why active learning beats passive watching — at a fraction of the cost.</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#131E30]/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-6 text-sm uppercase tracking-widest text-[#A0B0BC] font-bold">Feature</th>
                    <th className="p-6 text-center text-lg text-[#5BB3B3] font-bold">NucleuX</th>
                    <th className="p-6 text-center text-[#A0B0BC] font-medium">Marrow</th>
                    <th className="p-6 text-center text-[#A0B0BC] font-medium">PrepLadder</th>
                    <th className="p-6 text-center text-[#A0B0BC] font-medium">DAMS</th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {comparison.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-6 text-[#E8E0D5] font-medium">{row.feature}</td>
                      {(['nucleux', 'marrow', 'prepladder', 'dams'] as const).map((col) => (
                        <td key={col} className="p-6 text-center">
                          {typeof row[col] === 'boolean' ? (
                            row[col] ? (
                              <div className="inline-flex rounded-full bg-[#5BB3B3]/20 p-1.5 border border-[#5BB3B3]/30 shadow-[0_0_10px_rgba(91,179,179,0.2)]">
                                <CircleCheck className="w-6 h-6 text-[#5BB3B3]" />
                              </div>
                            ) : (
                              <div className="inline-flex rounded-full bg-white/5 p-1.5 opacity-50">
                                <XCircle className="w-6 h-6 text-[#475569]" />
                              </div>
                            )
                          ) : (
                            <span className={col === 'nucleux' ? 'text-2xl text-[#5BB3B3] font-bold tracking-tight' : 'text-[#A0B0BC]'}>{row[col]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      <SupportFooter />
    </div>
  );
}
