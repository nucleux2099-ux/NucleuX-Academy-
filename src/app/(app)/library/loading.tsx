import { SkeletonBox, SkeletonCard } from '@/components/ui/SkeletonPulse';

export default function LibraryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-8 w-40" />
        <SkeletonBox className="h-10 w-72 rounded-lg" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonBox key={i} className="h-9 w-24 rounded-lg" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} className="h-52" />)}
      </div>
    </div>
  );
}
