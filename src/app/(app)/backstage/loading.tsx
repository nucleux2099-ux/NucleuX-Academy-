import { SkeletonBox, SkeletonCard, SkeletonStatCard } from '@/components/ui/SkeletonPulse';

export default function BackstageLoading() {
  return (
    <div className="space-y-6">
      <div>
        <SkeletonBox className="h-8 w-56 mb-2" />
        <SkeletonBox className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SkeletonCard className="h-72" />
        <SkeletonCard className="h-72" />
      </div>
      <SkeletonCard className="h-48" />
    </div>
  );
}
