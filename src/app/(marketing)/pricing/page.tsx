'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const plans = [
  {
    name: 'Free',
    price: { monthly: '₹0', annual: '₹0' },
    period: { monthly: 'forever', annual: 'forever' },
    description: 'Get started with the basics',
    icon: Sparkles,
    color: '#5BB3B3',
    cta: 'Start Free',
    ctaHref: '/signup',
    popular: false,
    features: [
      { text: 'Library access (limited topics)', included: true },
      { text: 'ATOM Chat (5 messages/day)', included: true },
      { text: 'MCQ Practice (50/month)', included: true },
      { text: '1 Patient Simulation', included: true },
      { text: 'Basic study analytics', included: true },
      { text: 'Community access', included: true },
      { text: 'Full Library', included: false },
      { text: 'Unlimited ATOM Chat', included: false },
      { text: 'Desk workspace', included: false },
      { text: 'Confidence Calibration', included: false },
    ],
  },
  {
    name: 'Scholar',
    price: { monthly: '₹299', annual: '₹249' },
    period: { monthly: '/month', annual: '/mo (billed yearly)' },
    description: 'Everything you need to excel',
    icon: Zap,
    color: '#6366F1',
    cta: 'Start 7-Day Trial',
    ctaHref: '/signup?plan=scholar',
    popular: true,
    features: [
      { text: 'Full Library access (all subjects)', included: true },
      { text: 'Unlimited ATOM Chat', included: true },
      { text: 'Unlimited MCQ Practice', included: true },
      { text: 'All Patient Simulations', included: true },
      { text: 'My Desk workspace', included: true },
      { text: 'Community + Study Groups', included: true },
      { text: 'Full study analytics', included: true },
      { text: 'Confidence Calibration', included: true },
      { text: 'OSCE Stations', included: true },
      { text: 'Arena + Leaderboards', included: false },
    ],
  },
  {
    name: 'Resident',
    price: { monthly: '₹599', annual: '₹499' },
    period: { monthly: '/month', annual: '/mo (billed yearly)' },
    description: 'For serious exam preparation',
    icon: Crown,
    color: '#F59E0B',
    cta: 'Start 7-Day Trial',
    ctaHref: '/signup?plan=resident',
    popular: false,
    features: [
      { text: 'Everything in Scholar', included: true },
      { text: 'Arena + Leaderboards', included: true },
      { text: 'Patient Flow Pathways', included: true },
      { text: 'Guided Learning Modules', included: true },
      { text: 'Previous Year Questions (all)', included: true },
      { text: 'Backstage Cognitive OS', included: true },
      { text: 'NBME Domain Tracking', included: true },
      { text: 'Priority ATOM responses', included: true },
      { text: 'Quests & Achievements', included: true },
      { text: 'PPT & Flashcard generation', included: true },
    ],
  },
];

const faqs = [
  {
    q: 'Is there really a free plan?',
    a: 'Yes! The free plan gives you enough to experience NucleuX Academy. You get limited Library access, 5 ATOM messages per day, and 50 MCQs per month.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. No lock-in contracts. Cancel from your profile settings and you keep access until the end of your billing period.',
  },
  {
    q: 'Do you offer institutional pricing?',
    a: 'Yes! We offer special pricing for medical colleges, hospitals, and training programs. Contact us for bulk licensing.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your notes, progress, and study history are always yours. Downgrading limits access to premium features but your data stays safe.',
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Grid overlay */}
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
        subtitle="Learn atomically and grow exponentially"
        primaryCta={{ href: '/campus', label: 'Take the tour' }}
        secondaryCta={{ href: '/login', label: 'Enter' }}
      />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Simple, transparent pricing
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-[#E8E0D5] leading-tight">
            Invest in your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">
              medical career
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#A0B0BC]">
            Start free, upgrade when you&apos;re ready. Every plan includes ATOM — your AI thinking partner.
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
              Annual <span className="text-xs opacity-75">Save 15%</span>
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
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6366F1] px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-[#6366F1]/30 animate-pulse">
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
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-[#E8E0D5]' : 'text-[#475569]'
                        }`}
                      >
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
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center hover:border-white/20 transition-all duration-200">
          <h2 className="text-2xl font-bold text-[#E8E0D5]">For Medical Colleges & Hospitals</h2>
          <p className="mt-2 text-[#A0B0BC] max-w-xl mx-auto">
            Institutional licensing with bulk pricing, admin dashboards, curriculum alignment, and dedicated support.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3 font-semibold text-[#E8E0D5] transition-colors"
          >
            Contact Sales
          </Link>
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
