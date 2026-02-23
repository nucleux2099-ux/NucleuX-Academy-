import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, change, extra }: { label: string; value: string; change: string; extra?: string }) {
  const isPositive = change.startsWith("+");
  return (
    <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-4 flex-1">
      <p className="text-[#6B7A88] text-xs">{label}</p>
      <p className="text-[#E8E0D5] text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={cn("text-xs font-medium", isPositive ? "text-green-400" : "text-[#6B7A88]")}>{change}</span>
        {extra && <span className="text-[10px] text-[#F97316]">{extra}</span>}
      </div>
    </Card>
  );
}
