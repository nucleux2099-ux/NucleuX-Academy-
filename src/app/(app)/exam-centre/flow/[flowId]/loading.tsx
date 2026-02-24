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
      {/* Flow card */}
      <div className="h-20 rounded-xl bg-[#253545]" />
      {/* Progress bar */}
      <div className="h-4 rounded bg-[#253545]" />
      {/* Node card */}
      <div className="h-64 rounded-xl bg-[#253545]" />
      {/* Panels */}
      <div className="h-16 rounded-xl bg-[#253545]" />
      <div className="h-16 rounded-xl bg-[#253545]" />
    </div>
  );
}
