'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamic import — Excalidraw requires browser APIs
const ExcalidrawCanvas = dynamic(
  () => import('@/components/classroom/ExcalidrawCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="app-shell min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
          <p className="text-[#A0B0BC]">Loading ATOM Canvas...</p>
        </div>
      </div>
    ),
  }
);

export default function CanvasPage() {
  return <ExcalidrawCanvas />;
}
