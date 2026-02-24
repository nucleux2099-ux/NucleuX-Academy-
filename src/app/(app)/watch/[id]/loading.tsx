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
      {/* Video player */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="aspect-video rounded-xl bg-[#253545] mb-4" />
          <div className="h-8 w-3/4 rounded bg-[#253545] mb-2" />
          <div className="h-4 w-1/2 rounded bg-[#253545] mb-6" />
          <div className="h-20 rounded-xl bg-[#253545]" />
        </div>
        <div className="w-full lg:w-80 space-y-4">
          <div className="h-64 rounded-xl bg-[#253545]" />
          <div className="h-32 rounded-xl bg-[#253545]" />
        </div>
      </div>
    </div>
  );
}
