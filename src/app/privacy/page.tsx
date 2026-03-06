import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-gray max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: February 9, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We collect information you provide directly:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Account information (name, email, password)</li>
              <li>Profile information (medical college, year of study)</li>
              <li>Study data (progress, quiz scores, time spent)</li>
              <li>Communications with our AI tutor (ATOM)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Provide and personalize our educational services</li>
              <li>Track your learning progress and identify weak areas</li>
              <li>Send study reminders and recommendations via Telegram</li>
              <li>Improve our platform and AI tutoring capabilities</li>
              <li>Communicate important updates about the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption in transit and at rest. 
              Your study data is stored securely and is never sold to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. AI & Learning Analytics</h2>
            <p className="text-gray-300 leading-relaxed">
              Our AI tutor (ATOM) analyzes your study patterns to provide personalized recommendations. 
              This analysis is used solely to improve your learning experience. 
              You can request deletion of your learning history at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Service providers who assist in operating our platform</li>
              <li>Analytics services to improve our Service (anonymized)</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your learning data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies to maintain your session and remember your preferences. 
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at{' '}
              <a href="mailto:privacy@nucleux.academy" className="text-[#5BB3B3] hover:underline">
                privacy@nucleux.academy
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
