import Link from 'next/link';
import { SupportFooter } from '@/components/marketing/SupportFooter';

const faqs: Array<{ q: string; a: string }> = [
  {
    q: 'Is this for MBBS students or residents?',
    a: 'Both. The campus is designed for MBBS + residents. Rooms and modes adapt to how you learn at each stage.',
  },
  {
    q: 'Which exams does this help with?',
    a: 'Designed around NEET-PG/INICET-style workflows (and broadly useful for USMLE-like concept building + recall).',
  },
  {
    q: 'Is ATOM a chatbot?',
    a: 'No. ATOM changes behaviour based on the room: teaching in Classroom, drilling in Arena, calibration in Backstage, and structure in the Library.',
  },
  {
    q: 'Do I need to upload my own notes?',
    a: 'Optional. You can learn from the built-in library, and you can also attach your own notes/pdfs to personalize learning.',
  },
  {
    q: 'When will pricing be available?',
    a: 'Pricing is coming soon. We are onboarding early users in waves while we polish the campus.',
  },
  {
    q: 'How do I get early access?',
    a: 'Take the tour, then request early access from the login page. We enable accounts in waves.',
  },
];

export default function FAQPage() {
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
            <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Early access
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
            FAQ
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Quick answers.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            If you still have a question, reach out from the contact page.
          </p>

          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-base font-semibold text-[#E8E0D5]">{f.q}</div>
                <div className="mt-2 text-sm text-[#A0B0BC]">{f.a}</div>
              </div>
            ))}
          </div>

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
              Contact
            </Link>
          </div>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}
