'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
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

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:scale-[1.01] transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-base font-semibold text-[#E8E0D5]">{faq.q}</div>
        <ChevronDown className={`w-5 h-5 text-[#6B7A88] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="mt-3 text-sm text-[#A0B0BC] leading-relaxed">{faq.a}</div>
      )}
    </button>
  );
}

export default function FAQPage() {
  const categories = [...new Set(faqs.map(f => f.category))];

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

      <MarketingHeader active="faq" subtitle="Medical learning OS powered by ATOM" primaryCta={{ href: '/signup', label: 'Start with ATOM' }} secondaryCta={{ href: '/campus', label: 'Campus Tour' }} />

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            FAQ
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Got questions?</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">Everything you need to know about NucleuX Academy. Can&apos;t find your answer? <Link href="/contact" className="text-[#5BB3B3] underline">Reach out to us</Link>.</p>

          {categories.map(category => (
            <div key={category} className="mt-10">
              <h2 className="text-lg font-semibold text-[#5BB3B3] mb-4">{category}</h2>
              <div className="space-y-3">
                {faqs.filter(f => f.category === category).map((f) => (
                  <FAQItem key={f.q} faq={f} />
                ))}
              </div>
            </div>
          ))}

          <div className="mt-10 flex gap-3">
            <Link
              href="/campus"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#E8E0D5] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Take the tour
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <SupportFooter />
    </div>
  );
}
