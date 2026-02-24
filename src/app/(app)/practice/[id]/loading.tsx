export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-[#253545]" />
          <div className="h-4 w-40 rounded bg-[#253545]" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-[#253545]" />
          <div className="h-8 w-24 rounded-full bg-[#253545]" />
        </div>
      </div>
      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-10 w-3/4 rounded bg-[#253545]" />
        <div className="h-4 w-full rounded bg-[#253545]" />
        <div className="h-4 w-5/6 rounded bg-[#253545]" />
        <div className="h-64 rounded-xl bg-[#253545]" />
        <div className="h-4 w-full rounded bg-[#253545]" />
        <div className="h-4 w-4/5 rounded bg-[#253545]" />
        <div className="h-32 rounded-xl bg-[#253545]" />
      </div>
    </div>
  );
}
