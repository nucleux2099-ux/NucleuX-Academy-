import { Suspense } from 'react';
import LiveAIClassroomClient from './ui';

function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-[#364A5E] rounded w-1/3" />
      <div className="h-56 bg-[#364A5E] rounded-xl" />
      <div className="h-56 bg-[#364A5E] rounded-xl" />
    </div>
  );
}

export default function LiveAIClassroomPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LiveAIClassroomClient />
    </Suspense>
  );
}
