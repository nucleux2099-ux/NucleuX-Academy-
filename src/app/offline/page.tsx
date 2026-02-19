import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-[#E8E0D5] flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">You are offline</h1>
        <p className="text-sm text-[#A0B0BC] mb-6">
          Network is unavailable. You can retry once your connection is restored.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[#5BB3B3] px-4 py-2 text-sm font-medium text-[#1E2D3D] hover:bg-[#4A9E9E]"
        >
          Retry
        </Link>
      </div>
    </main>
  );
}
