'use client';

import dynamic from 'next/dynamic';

const AtomMindMap = dynamic(
  () => import('@/components/classroom/AtomMindMap'),
  { ssr: false }
);

export default function MindMapPage() {
  return <AtomMindMap />;
}
