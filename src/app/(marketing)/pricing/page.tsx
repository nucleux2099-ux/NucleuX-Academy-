import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#E8E0D5] font-bold">
            NucleuX Academy
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/campus" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Take the tour
            </Link>
            <Link href="/atom" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Meet ATOM
            </Link>
            <Link href="/faq" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Contact
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium"
            >
              Enter campus
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Early access
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
            Pricing is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BB3B3] to-[#6BA8C9]">coming soon</span>.
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            We’re onboarding early users and shaping the product around real workflows. If you want early access, request it — we enable accounts in waves.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/campus"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Take the tour
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E]"
            >
              Request early access <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Students (MBBS)',
              points: ['Library + MCQ practice', 'Backstage tracking', 'Community'],
            },
            {
              title: 'Residents',
              points: ['Case-based learning', 'Fast revision flows', 'Skill ladder + logbook'],
            },
            {
              title: 'Institutions',
              points: ['Cohort dashboards', 'Custom content packs', 'OSCE/MCQ workflows'],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-lg font-bold text-[#E8E0D5]">{card.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-[#A0B0BC]">
                {card.points.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
      <SupportFooter />
    </div>
  );
}
