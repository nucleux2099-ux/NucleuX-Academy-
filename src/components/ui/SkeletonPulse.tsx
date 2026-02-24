export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#253545] ${className}`} />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-[rgba(91,179,179,0.1)] bg-[#1B2838] p-5 ${className}`}>
      <SkeletonBox className="h-5 w-2/3 mb-3" />
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-[rgba(91,179,179,0.1)] bg-[#1B2838] p-4">
      <SkeletonBox className="h-4 w-20 mb-2" />
      <SkeletonBox className="h-8 w-16" />
    </div>
  );
}
