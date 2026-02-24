import { SkeletonBox, SkeletonCard } from '@/components/ui/SkeletonPulse';

export default function ArenaLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-12 w-12 rounded-xl" />
          <div>
            <SkeletonBox className="h-8 w-36 mb-2" />
            <SkeletonBox className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-3">
          <SkeletonBox className="h-9 w-36 rounded-full" />
          <SkeletonBox className="h-9 w-32 rounded-full" />
        </div>
      </div>
      <SkeletonBox className="h-12 w-full rounded-xl" />
      <div className="grid lg:grid-cols-3 gap-6">
        <SkeletonCard className="lg:col-span-2 h-80" />
        <SkeletonCard className="h-80" />
      </div>
      <SkeletonCard className="h-40" />
    </div>
  );
}
