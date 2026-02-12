import Link from 'next/link';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#E8E0D5] font-bold">
            NucleuX Academy
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/campus" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Take the tour
              </Link>
              <Link href="/atom" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Meet ATOM
              </Link>
              <Link href="/pricing" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
                Early access
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
            </div>
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/campus"
                className="px-3 py-2 rounded-lg bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white font-medium"
              >
                Tour
              </Link>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-[#E8E0D5] font-medium"
              >
                Enter
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-16 pb-20 sm:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#A0B0BC]">
            About
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">
            We’re building a learning OS for medicine.
          </h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            NucleuX Academy is designed like a campus: each room has a job, and ATOM adapts to the room. The goal is not “more content” — it’s better understanding, better recall, and better exam performance.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{
              title: 'Why ATOM?',
              body: 'Because medical learning is not linear. You need different behaviours: explanation, drilling, calibration, and reflection — all in one system.',
            }, {
              title: 'Our standard',
              body: 'Every topic has structure: prerequisites, high-yield points, retrieval cards, and consistent formatting for fast revision.',
            }, {
              title: 'Who it’s for',
              body: 'MBBS students, residents, and anyone preparing for NEET-PG/INICET/USMLE-like workflows.',
            }, {
              title: 'Early access',
              body: 'We are onboarding in waves while we polish the campus. If you want in early, request access from the login page.',
            }].map((x) => (
              <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-lg font-bold text-[#E8E0D5]">{x.title}</div>
                <p className="mt-2 text-sm text-[#A0B0BC]">{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}
