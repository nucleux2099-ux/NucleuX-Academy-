import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#E8E0D5] font-bold">
            NucleuX Academy
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/campus" className="text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors">
              Campus Tour
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
            Contact
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-[#E8E0D5] leading-tight">Reach us.</h1>
          <p className="mt-5 text-lg text-[#A0B0BC]">
            For early access, support, or partnerships — choose one of the options below.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-bold text-[#E8E0D5]">Email</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">Write to us and we’ll respond as soon as possible.</p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-slate-950 bg-[#5BB3B3] hover:bg-[#4A9E9E] transition-colors"
                href="mailto:Nucleux2099@gmail.com"
              >
                Nucleux2099@gmail.com
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-bold text-[#E8E0D5]">Customer Support</div>
              <p className="mt-2 text-sm text-[#A0B0BC]">
                Use the <span className="text-[#E8E0D5]">NucleuX Academy Telegram bot</span> for support.
              </p>
              <div className="mt-4 text-sm text-[#A0B0BC]">
                (Share screenshots + your registered email/phone for faster resolution.)
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
        </div>
      </main>
    </div>
  );
}
