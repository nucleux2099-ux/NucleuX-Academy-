import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#F5F3FF] via-white to-[#F0F9FF] p-12 flex-col justify-between border-r border-[#E2E8F0]">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="NucleuX" className="w-12 h-12" />
          <span className="text-2xl font-bold text-gradient-purple">
            NucleuX Academy
          </span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-[#1E293B]">
            Learn <span className="text-gradient-purple">Atomically</span>.
            <br />
            Grow <span className="text-gradient-cyan">Exponentially</span>.
          </h1>
          <p className="text-lg text-[#64748B] max-w-md">
            Join thousands of medical students who are mastering complex concepts
            with personalized AI-powered learning.
          </p>
          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-gradient-purple">10,000+</div>
              <div className="text-sm text-[#64748B]">MCQ Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-cyan">500+</div>
              <div className="text-sm text-[#64748B]">Study Materials</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-purple">24/7</div>
              <div className="text-sm text-[#64748B]">AI Support</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#94A3B8]">
          © 2026 NucleuX Academy. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/logo.svg" alt="NucleuX" className="w-10 h-10" />
              <span className="text-xl font-bold text-gradient-purple">
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
