import { SkeletonBox, SkeletonCard, SkeletonStatCard } from '@/components/ui/SkeletonPulse';

export default function DeskLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBox className="h-8 w-48 mb-2" />
          <SkeletonBox className="h-4 w-72" />
        </div>
        <SkeletonBox className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-36" />
        </div>
        <div className="space-y-4">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-32" />
        </div>
      </div>
    </div>
  );
}
