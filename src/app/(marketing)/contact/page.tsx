import Link from 'next/link';
import { Mail, MessageCircle, Clock } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function ContactPage() {
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

      <MarketingHeader active="contact" subtitle="Learn atomically and grow exponentially" primaryCta={{ href: '/campus', label: 'Take the tour' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Contact
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Reach us.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            For early access, support, or partnerships — choose one of the options below.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#5BB3B3]/15 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-[#5BB3B3]" />
              </div>
              <div className="text-lg font-bold text-[#E8E0D5]">Email</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">Write to us and we&apos;ll respond as soon as possible.</p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors"
                href="mailto:Nucleux2099@gmail.com"
              >
                Nucleux2099@gmail.com
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#5BB3B3]/15 flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-[#5BB3B3]" />
              </div>
              <div className="text-lg font-bold text-[#E8E0D5]">Customer Support</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">
                Use our Telegram bot for support.
              </p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                href="https://t.me/ATOM_2099_bot"
                target="_blank"
                rel="noreferrer"
              >
                @ATOM_2099_bot
              </a>
              <div className="mt-3 text-sm text-[#A0B0BC]">
                (Share screenshots + your registered email/phone for faster resolution.)
              </div>
            </div>
          </div>

          {/* Response time note */}
          <div className="mt-6 flex items-center gap-2 text-sm text-[#6B7A88]">
            <Clock className="w-4 h-4" />
            We typically respond within 24 hours
          </div>

          <div className="mt-10 flex gap-3">
            <Link
              href="/campus"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Take the tour
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}
