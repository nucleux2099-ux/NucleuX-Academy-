'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const faqs: Array<{ q: string; a: string; category: string }> = [
  {
    category: 'About NucleuX',
    q: 'How is NucleuX different from Marrow/PrepLadder?',
    a: 'Marrow and PrepLadder are primarily video-lecture platforms with MCQ banks. NucleuX takes a fundamentally different approach: active recall first, no passive video watching. We have an AI tutor (ATOM) that remembers your weak areas, cites actual textbook pages (Bailey & Love, Harrison\'s, Robbins, etc.), and adapts to your learning pattern. We also map everything to CBME competencies. And at ₹4,999/year, we\'re 75-80% cheaper.',
  },
  {
    category: 'About NucleuX',
    q: 'Do you have video lectures?',
    a: 'No — and that\'s intentional. Learning science research consistently shows that active recall and retrieval practice are 3x more effective than passive video watching. Watching a video creates an "illusion of competence" (recognition), but it doesn\'t build the retrieval pathways you need for exams and clinical practice. Instead, we give you 6 interactive learning modes, AI-guided teaching, and spaced repetition.',
  },
  {
    category: 'ATOM (AI Tutor)',
    q: 'How does the AI tutor work?',
    a: 'ATOM is not a generic chatbot. It\'s a teaching companion trained on 25 standard medical textbooks. It uses Socratic questioning to guide your thinking (not just give answers), remembers your weak areas across sessions, provides actual textbook citations with page numbers, and adapts its difficulty based on your performance. Think of it as your brilliant senior who actually wants to help.',
  },
  {
    category: 'ATOM (AI Tutor)',
    q: 'What textbooks does ATOM reference?',
    a: 'ATOM draws from 25 standard medical textbooks including Bailey & Love\'s Short Practice of Surgery, Sabiston Textbook of Surgery, Harrison\'s Principles of Internal Medicine, Robbins Pathologic Basis of Disease, Guyton & Hall Textbook of Medical Physiology, Harper\'s Illustrated Biochemistry, and more. Every citation includes the specific edition, chapter, and page number.',
  },
  {
    category: 'Exam Preparation',
    q: 'Is this useful for NEET-PG preparation?',
    a: 'Absolutely. Our MCQs follow NEET-PG/INICET patterns, our content is mapped to 87 CBME specialties and 7,288 NMC competencies, and ATOM can drill you on high-yield topics. The spaced repetition system (SM-2 algorithm) ensures you review topics at optimal intervals. Pro plan users also get exam simulators and PYQ pattern analysis.',
  },
  {
    category: 'Exam Preparation',
    q: 'What subjects are covered?',
    a: 'Currently 11 subjects with 720+ MCQs and 1,400+ topic files: Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Microbiology, Forensic Medicine, Community Medicine, Surgery, Medicine, and OBG. More subjects and content are added continuously.',
  },
  {
    category: 'Platform & Access',
    q: 'Can I use this on my phone?',
    a: 'Yes! NucleuX Academy is a Progressive Web App (PWA) designed mobile-first. It works on any modern browser — Chrome, Safari, Firefox — on both Android and iOS. You can add it to your home screen for an app-like experience. No download from app stores needed.',
  },
  {
    category: 'Platform & Access',
    q: 'Is my progress saved across devices?',
    a: 'Yes. Your study progress, MCQ history, spaced repetition schedule, ATOM conversation history, and all analytics sync across devices in real-time. Start a session on your phone during commute, continue on your laptop at home.',
  },
  {
    category: 'Pricing & Plans',
    q: 'Is the free tier really free?',
    a: 'Yes, completely free — no credit card required, no trial period. You get 50 MCQs per day, 3 subjects, basic ATOM (10 queries/day), and community access. It\'s enough to experience the platform and decide if the upgrade is worth it. We believe every Indian medical student deserves access to quality learning tools.',
  },
  {
    category: 'Support',
    q: 'How do I contact support?',
    a: 'You can reach us through our Telegram bot @ATOM_2099_bot for quick support, or email us at Nucleux2099@gmail.com. We typically respond within 24 hours. For institutional inquiries, use the contact form on our website.',
  },
];

function FAQItem({ faq, idx }: { faq: { q: string; a: string }, idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      className={`rounded-2xl border bg-[#131E30]/40 backdrop-blur-md overflow-hidden transition-all duration-300 ${open
          ? 'border-[#5BB3B3]/40 shadow-[0_0_20px_rgba(91,179,179,0.1)] bg-[#131E30]/60 text-white'
          : 'border-white/10 hover:border-white/20 hover:bg-[#131E30]/60'
        }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 flex items-center justify-between gap-4 outline-none"
      >
        <div className={`text-lg font-semibold transition-colors ${open ? 'text-white' : 'text-[#E8E0D5]'}`}>
          {faq.q}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-[#5BB3B3]/20 text-[#5BB3B3]' : 'bg-white/5 text-[#A0B0BC]'
          }`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 text-[#A0B0BC] leading-relaxed border-t border-white/5 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const categories = [...new Set(faqs.map(f => f.category))];

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E8E0D5] relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(91,179,179,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(91,179,179,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#5BB3B3]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#E879F9]/10 blur-[120px] rounded-full pointer-events-none" />

      <MarketingHeader active="faq" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <main className="max-w-4xl mx-auto px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-[#A0B0BC] backdrop-blur-md mb-6">
            <MessageCircleQuestion className="w-4 h-4 text-[#5BB3B3]" />
            FAQ
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white leading-tight tracking-tight">Got questions?</h1>
          <p className="mt-6 text-xl text-[#A0B0BC] font-light max-w-2xl mx-auto">
            Everything you need to know about NucleuX Academy. Can&apos;t find your answer?{' '}
            <Link href="/contact" className="text-[#5BB3B3] font-medium hover:text-white transition-colors underline decoration-[#5BB3B3]/40 underline-offset-4">Read out to us</Link>.
          </p>
        </motion.div>

        <div className="mt-20 space-y-16">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#5BB3B3] shadow-[0_0_8px_rgba(91,179,179,0.8)]" />
                {category}
              </h2>
              <div className="space-y-4">
                {faqs.filter(f => f.category === category).map((f, i) => (
                  <FAQItem key={f.q} faq={f} idx={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[2rem] border border-[#5BB3B3]/30 bg-gradient-to-br from-[#5BB3B3]/10 to-[#131E30]/50 backdrop-blur-xl p-12 flex flex-col items-center text-center shadow-[0_0_30px_rgba(91,179,179,0.1)]"
        >
          <h3 className="text-3xl font-bold text-white tracking-tight mb-4">Still need help?</h3>
          <p className="text-[#A0B0BC] text-lg mb-8 max-w-xl">
            Our team is always here to help you get the most out of NucleuX Academy. Don&apos;t hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-slate-950 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(91,179,179,0.3)] hover:shadow-[0_0_30px_rgba(91,179,179,0.5)]"
            >
              Contact Support
            </Link>
            <Link
              href="/campus"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Take the Campus Tour
            </Link>
          </div>
        </motion.div>
      </main>

      <SupportFooter />
    </div>
  );
}
