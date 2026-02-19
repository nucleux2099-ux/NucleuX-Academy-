'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, Zap, Crown, Building2, CheckCircle2, XCircle } from 'lucide-react';
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
    color: '#6366F1',
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
        active="pricing"
        subtitle="Medical learning OS powered by ATOM"
        primaryCta={{ href: '/signup', label: 'Start with ATOM' }}
        secondaryCta={{ href: '/campus', label: 'Campus Tour' }}
      />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5BB3B3]/30 bg-[#5BB3B3]/10 px-4 py-1.5 text-sm text-[#5BB3B3] font-medium">
            75-80% cheaper than Marrow
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-[#E8E0D5] leading-tight">
            Premium medical education{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#E879F9]">
              without the premium price.
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#A0B0BC]">
            Start free, upgrade when you&apos;re ready. Every plan includes ATOM — your AI teaching companion.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === 'monthly' ? 'bg-[#5BB3B3] text-slate-950' : 'text-[#A0B0BC] hover:text-[#E8E0D5]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === 'annual' ? 'bg-[#5BB3B3] text-slate-950' : 'text-[#A0B0BC] hover:text-[#E8E0D5]'
              }`}
            >
              Annual <span className="text-xs opacity-75">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 ${
                plan.popular
                  ? 'border-[#6366F1]/50 bg-gradient-to-b from-[#6366F1]/10 to-transparent md:scale-105 shadow-xl shadow-[#6366F1]/10 hover:scale-[1.07]'
                  : 'border-white/10 bg-white/[0.03] hover:scale-[1.02] hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6366F1] px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-[#6366F1]/30">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E8E0D5]">{plan.name}</h3>
                  <p className="text-xs text-[#A0B0BC]">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[#E8E0D5]">{plan.price[billing]}</span>
                <span className="text-[#A0B0BC] text-sm">{plan.period[billing]}</span>
              </div>

              <Link
                href={plan.ctaHref}
                className={`w-full text-center rounded-xl px-5 py-3 font-semibold transition-all ${
                  plan.popular
                    ? 'bg-[#6366F1] hover:bg-[#5558E6] text-white shadow-lg'
                    : 'border border-white/15 bg-white/5 hover:bg-white/10 text-[#E8E0D5]'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-6 flex-1">
                <div className="text-xs font-semibold text-[#A0B0BC] uppercase tracking-wider mb-3">
                  What&apos;s included
                </div>
                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-[#5BB3B3] mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-[#475569] mt-0.5 shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-[#E8E0D5]' : 'text-[#475569]'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional */}
        <div className="mt-12 rounded-2xl border border-[#F97316]/20 bg-[#F97316]/5 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-xl bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-7 h-7 text-[#F97316]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#E8E0D5]">For Medical Colleges &amp; Hospitals</h2>
              <p className="mt-1 text-[#A0B0BC]">
                <span className="text-[#F97316] font-bold text-xl">₹2,999</span>/student/year — Bulk licensing with admin dashboard, curriculum alignment, CBME tracking, and dedicated support.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 hover:bg-[#F97316]/20 px-6 py-3 font-semibold text-[#F97316] transition-colors"
            >
              Contact for Institutional Pricing
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#E8E0D5] text-center mb-3">NucleuX vs The Rest</h2>
          <p className="text-center text-[#A0B0BC] mb-8">See why active learning beats passive watching — at a fraction of the cost.</p>
          
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-[#A0B0BC] font-medium">Feature</th>
                    <th className="p-4 text-center text-[#5BB3B3] font-bold">NucleuX</th>
                    <th className="p-4 text-center text-[#A0B0BC] font-medium">Marrow</th>
                    <th className="p-4 text-center text-[#A0B0BC] font-medium">PrepLadder</th>
                    <th className="p-4 text-center text-[#A0B0BC] font-medium">DAMS</th>
                  </tr>
                </thead>
                <tbody className="text-[#E8E0D5]">
                  {comparison.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="p-4 text-[#A0B0BC]">{row.feature}</td>
                      {(['nucleux', 'marrow', 'prepladder', 'dams'] as const).map((col) => (
                        <td key={col} className="p-4 text-center">
                          {typeof row[col] === 'boolean' ? (
                            row[col] ? <CheckCircle2 className="w-5 h-5 text-[#5BB3B3] mx-auto" /> : <XCircle className="w-5 h-5 text-[#475569] mx-auto" />
                          ) : (
                            <span className={col === 'nucleux' ? 'text-[#5BB3B3] font-semibold' : 'text-[#A0B0BC]'}>{row[col]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#E8E0D5] text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition-all duration-200">
                <h3 className="font-semibold text-[#E8E0D5]">{faq.q}</h3>
                <p className="mt-2 text-sm text-[#A0B0BC]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SupportFooter />
    </div>
  );
}
