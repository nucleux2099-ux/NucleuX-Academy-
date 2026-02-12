import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950/30 p-12 flex-col justify-between border-r border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="NucleuX" width={48} height={48} />
          <span className="text-2xl font-bold text-gradient-purple">
            NucleuX Academy
          </span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-[#E8E0D5]">
            Learn <span className="text-[#5BB3B3]">Atomically</span>.
            <br />
            Grow <span className="text-[#6BA8C9]">Exponentially</span>.
          </h1>
          <p className="text-lg text-[#A0B0BC] max-w-md">
            A virtual campus designed for durable understanding, recall, and exam performance.
          </p>
          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-[#5BB3B3]">Library</div>
              <div className="text-sm text-[#A0B0BC]">Concepts + structure</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#6BA8C9]">Classroom</div>
              <div className="text-sm text-[#A0B0BC]">Teaching + notes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A86C]">Exam</div>
              <div className="text-sm text-[#A0B0BC]">Practice + feedback</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#6B7280]">
          © 2026 NucleuX Academy.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.svg" alt="NucleuX" width={40} height={40} />
              <span className="text-xl font-bold text-[#E8E0D5]">
                NucleuX Academy
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
