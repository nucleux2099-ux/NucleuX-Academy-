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
      {/* Step progress */}
      <div className="h-16 rounded-xl bg-[#253545]" />
      {/* Main grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="h-96 rounded-xl bg-[#253545]" />
        </div>
        <div className="space-y-4">
          <div className="h-48 rounded-xl bg-[#253545]" />
          <div className="h-32 rounded-xl bg-[#253545]" />
        </div>
      </div>
    </div>
  );
}
