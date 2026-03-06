import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <Image src="/logo.svg" alt="NucleuX" width={32} height={32} />
            <span className="text-lg font-semibold text-white">NucleuX Academy</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/signup" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to signup
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert prose-gray max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: February 9, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using NucleuX Academy (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              NucleuX Academy provides an AI-powered medical education platform including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
              <li>MCQ practice and assessment tools</li>
              <li>AI tutoring and study assistance (ATOM)</li>
              <li>Study materials and textbook references</li>
              <li>Progress tracking and analytics</li>
              <li>Community features and discussions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p className="text-gray-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. 
              You must provide accurate information during registration and keep it updated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Share your account with others</li>
              <li>Copy, distribute, or reproduce content without permission</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with other users&apos; use of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on NucleuX Academy, including text, graphics, logos, and software, is the property of NucleuX Academy 
              or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              The educational content provided is for learning purposes only and should not replace professional medical advice, 
              diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:support@nucleux.academy" className="text-[#5BB3B3] hover:underline">
                support@nucleux.academy
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 NucleuX Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
