import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", className)}>{children}</span>;
}

export function ProgressBar({ value, className, barClass }: { value: number; className?: string; barClass?: string }) {
  return (
    <div className={cn("h-1.5 rounded-full bg-[#253545] overflow-hidden", className)}>
      <div className={cn("h-full rounded-full bg-[#5BB3B3] transition-all", barClass)} style={{ width: `${value}%` }} />
    </div>
  );
}
