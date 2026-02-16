'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Clock, MapPin, Send, Users } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

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

      <MarketingHeader active="contact" subtitle="Learn atomically and grow exponentially" primaryCta={{ href: '/campus', label: 'Take the tour' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            Contact
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Let&apos;s talk.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            Questions, feedback, partnerships, or just want to say hi — we&apos;re here.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-xl font-bold text-[#E8E0D5] mb-6">Send us a message</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:Nucleux2099@gmail.com?subject=${encodeURIComponent(`[${category}] Message from ${name}`)}&body=${encodeURIComponent(message)}`; }}>
              <div>
                <label className="block text-sm text-[#A0B0BC] mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E8E0D5] placeholder-[#475569] focus:outline-none focus:border-[#5BB3B3]/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A0B0BC] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E8E0D5] placeholder-[#475569] focus:outline-none focus:border-[#5BB3B3]/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A0B0BC] mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E8E0D5] focus:outline-none focus:border-[#5BB3B3]/50 transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="institutional">Institutional / College Pricing</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A0B0BC] mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#E8E0D5] placeholder-[#475569] focus:outline-none focus:border-[#5BB3B3]/50 transition-colors resize-none"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Options */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#5BB3B3]/15 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-[#5BB3B3]" />
              </div>
              <div className="text-lg font-bold text-[#E8E0D5]">Email</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">Write to us and we&apos;ll respond as soon as possible.</p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors text-sm"
                href="mailto:Nucleux2099@gmail.com"
              >
                Nucleux2099@gmail.com
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#6366F1]/15 flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div className="text-lg font-bold text-[#E8E0D5]">Telegram Community</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">
                Join our Telegram community for discussions, study groups, and direct support.
              </p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-sm"
                href="https://t.me/ATOM_2099_bot"
                target="_blank"
                rel="noreferrer"
              >
                @ATOM_2099_bot
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#F97316]/15 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-[#F97316]" />
              </div>
              <div className="text-lg font-bold text-[#E8E0D5]">Institutional Inquiries</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">
                Medical colleges and hospitals — contact us for bulk licensing at ₹2,999/student/year with admin dashboards.
              </p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-sm"
                href="mailto:Nucleux2099@gmail.com?subject=Institutional%20Inquiry"
              >
                Get Institutional Pricing
              </a>
            </div>

            {/* Response time + Location */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-[#6B7A88]">
                <Clock className="w-4 h-4" />
                We typically respond within 24 hours
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6B7A88]">
                <MapPin className="w-4 h-4" />
                Built in India, for Indian medical students 🇮🇳
              </div>
            </div>
          </div>
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
      </main>
      <SupportFooter />
    </div>
  );
}
