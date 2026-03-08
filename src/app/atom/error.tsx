'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AtomPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ATOM page crashed:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-[#E8E0D5] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h1 className="text-lg font-semibold">ATOM page hit an unexpected client error</h1>
            <p className="text-sm text-[#A0B0BC] mt-1">
              We caught it so the app doesn’t hard-crash. Please retry or continue from another room.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={reset} className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white">Retry page</Button>
          <Link href="/chat">
            <Button variant="outline" className="border-white/20 text-[#E8E0D5]">Open ATOM Chat</Button>
          </Link>
          <Link href="/campus">
            <Button variant="outline" className="border-white/20 text-[#E8E0D5]">Back to Campus</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
