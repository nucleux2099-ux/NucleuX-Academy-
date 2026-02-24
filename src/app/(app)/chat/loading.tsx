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
      {/* Chat layout */}
      <div className="flex h-[calc(100vh-12rem)] gap-0 -m-4 sm:-m-6">
        <div className="w-[280px] bg-[#253545] rounded-none hidden md:block" />
        <div className="flex-1 flex flex-col">
          <div className="h-14 bg-[#253545]" />
          <div className="flex-1 bg-[#1B2838] p-4 space-y-4">
            <div className="h-16 w-3/4 rounded-2xl bg-[#253545]" />
            <div className="h-12 w-1/2 rounded-2xl bg-[#253545] ml-auto" />
            <div className="h-20 w-3/4 rounded-2xl bg-[#253545]" />
          </div>
          <div className="h-16 bg-[#253545]" />
        </div>
        <div className="w-[320px] bg-[#253545] rounded-none hidden lg:block" />
      </div>
    </div>
  );
}
