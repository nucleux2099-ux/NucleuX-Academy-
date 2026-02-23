import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./shared";

interface RecentActivityProps {
  recentActivity: { text: string; time: string; type: string; icon: React.ComponentType<{ className?: string }>; color: string }[];
}

export function RecentActivity({ recentActivity }: RecentActivityProps) {
  return (
    <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
      <h3 className="text-[#E8E0D5] font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentActivity.length === 0 && (
          <p className="text-sm text-[#6B7A88] text-center py-4">No activity yet. Start studying to see your progress here!</p>
        )}
        {recentActivity.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5"><a.icon className={cn("w-4 h-4", a.color)} /></div>
            <div className="flex-1">
              <p className="text-sm text-[#E8E0D5]">{a.text}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#6B7A88]">{a.time}</span>
                <Badge className="bg-[#253545] text-[#A0B0BC]">{a.type}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
