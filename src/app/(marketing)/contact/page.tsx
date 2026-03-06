'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Clock, MapPin, Send, Users } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(249,115,22,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#6366F1]/10 blur-[150px] rounded-full pointer-events-none" />

      <MarketingHeader active="contact" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <main className="max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#131E30]/50 px-4 py-1.5 text-sm font-medium text-[#A0B0BC] backdrop-blur-md">
            Contact
          </div>
          <h1 className="mt-8 text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight">Let&apos;s talk.</h1>
          <p className="mt-6 text-xl text-[#A0B0BC] font-light max-w-2xl leading-relaxed">
            Questions, feedback, partnerships, or just want to say hi — we&apos;re here.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[2rem] border border-white/10 bg-[#131E30]/40 backdrop-blur-xl p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5BB3B3]/5 to-transparent pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-8 relative z-10 tracking-tight">Send us a message</h2>
            <form className="space-y-6 relative z-10 flex-grow flex flex-col" onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:Nucleux2099@gmail.com?subject=${encodeURIComponent(`[${category}] Message from ${name}`)}&body=${encodeURIComponent(message)}`; }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A0B0BC] mb-2 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#475569] focus:outline-none focus:border-[#5BB3B3] focus:ring-1 focus:ring-[#5BB3B3] transition-all shadow-inner"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A0B0BC] mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#475569] focus:outline-none focus:border-[#5BB3B3] focus:ring-1 focus:ring-[#5BB3B3] transition-all shadow-inner"
                    placeholder="doctor@hospital.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A0B0BC] mb-2 uppercase tracking-wide">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-[#1A263C] border border-white/10 text-white focus:outline-none focus:border-[#5BB3B3] focus:ring-1 focus:ring-[#5BB3B3] transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="institutional">Institutional / College Pricing</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex-grow flex flex-col">
                <label className="block text-sm font-medium text-[#A0B0BC] mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full flex-grow min-h-[160px] px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-[#475569] focus:outline-none focus:border-[#5BB3B3] focus:ring-1 focus:ring-[#5BB3B3] transition-all resize-none shadow-inner"
                  placeholder="How can we help you today?"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl px-8 py-5 text-lg font-bold text-slate-950 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(91,179,179,0.3)] hover:shadow-[0_0_30px_rgba(91,179,179,0.5)] mt-4"
              >
                <Send className="w-5 h-5 mr-3" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Options */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-white/10 bg-[#131E30]/40 backdrop-blur-md p-8 hover:border-white/20 hover:bg-[#131E30]/60 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#5BB3B3]/15 flex items-center justify-center mb-6 border border-[#5BB3B3]/20 group-hover:bg-[#5BB3B3]/20 transition-colors">
                <Mail className="w-7 h-7 text-[#5BB3B3]" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">Email Us</div>
              <p className="mt-3 text-[#A0B0BC] leading-relaxed">Write to the founder and team directly. We read and respond to every email we receive as soon as possible.</p>
              <a
                className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#0B1220] bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-all"
                href="mailto:Nucleux2099@gmail.com"
              >
                Nucleux2099@gmail.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-3xl border border-white/10 bg-[#131E30]/40 backdrop-blur-md p-8 hover:border-[#6366F1]/30 hover:bg-[#131E30]/60 transition-all duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.1)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#6366F1]/15 flex items-center justify-center mb-6 border border-[#6366F1]/20 group-hover:bg-[#6366F1]/20 transition-colors">
                    <MessageCircle className="w-7 h-7 text-[#6366F1]" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">Telegram Community</div>
                  <p className="mt-3 text-[#A0B0BC] leading-relaxed max-w-sm">
                    Join our active Telegram community for subject discussions, feature requests, and direct support.
                  </p>
                </div>
                <a
                  className="inline-flex items-center justify-center rounded-2xl p-4 text-[#E8E0D5] border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#6366F1]/30 hover:text-white transition-all hover:scale-110 active:scale-95 group-hover:bg-[#6366F1]/10"
                  href="https://t.me/ATOM_2099_bot"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Join Telegram"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-3xl border border-white/10 bg-[#131E30]/40 backdrop-blur-md p-8 hover:border-[#F97316]/30 hover:bg-[#131E30]/60 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F97316]/15 flex items-center justify-center mb-6 border border-[#F97316]/20 group-hover:bg-[#F97316]/20 transition-colors">
                <Users className="w-7 h-7 text-[#F97316]" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">Institutional Inquiries</div>
              <p className="mt-3 text-[#A0B0BC] leading-relaxed">
                Medical colleges and hospitals — contact us for bulk licensing at <strong className="text-white">₹2,999/student/year</strong> with dedicated admin dashboards.
              </p>
              <a
                className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#F97316] border border-[#F97316]/30 bg-[#F97316]/10 hover:bg-[#F97316]/20 transition-all"
                href="mailto:Nucleux2099@gmail.com?subject=Institutional%20Inquiry"
              >
                Get Institutional Pricing
              </a>
            </motion.div>

            {/* Response time + Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-4 mt-8 px-4"
            >
              <div className="flex items-center gap-3 text-sm text-[#A0B0BC] font-medium">
                <Clock className="w-5 h-5 text-[#5BB3B3]" />
                We typically respond within 12-24 hours
              </div>
              <div className="flex items-center gap-3 text-sm text-[#A0B0BC] font-medium">
                <MapPin className="w-5 h-5 text-[#E879F9]" />
                Built in India, for the future of medicine everywhere
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}
