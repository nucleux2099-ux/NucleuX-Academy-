import { SkeletonBox, SkeletonCard, SkeletonStatCard } from '@/components/ui/SkeletonPulse';

export default function ExamCentreLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBox className="h-8 w-48 mb-2" />
          <SkeletonBox className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="h-7 w-48 rounded-full" />
          <SkeletonBox className="h-7 w-32 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <SkeletonBox className="h-10 w-full rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-44" />)}
      </div>
    </div>
  );
}
