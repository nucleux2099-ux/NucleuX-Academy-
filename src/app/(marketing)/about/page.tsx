import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { SupportFooter } from '@/components/marketing/SupportFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <MarketingHeader active="about" subtitle="Learn atomically and grow exponentially" primaryCta={{ href: '/campus', label: 'Take the tour' }} secondaryCta={{ href: '/login', label: 'Enter' }} />

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
