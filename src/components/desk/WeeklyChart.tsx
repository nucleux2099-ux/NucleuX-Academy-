import { Card } from "@/components/ui/card";

interface WeeklyChartProps {
  weeklyChart: { day: string; hours: number; mcqs: number }[];
  maxHours: number;
  title?: string;
  height?: string;
  barHeight?: string;
  actionSlot?: React.ReactNode;
}

export function WeeklyChart({ weeklyChart, maxHours, title = "Study Progress", height = "h-40", barHeight = "h-32", actionSlot }: WeeklyChartProps) {
  return (
    <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#E8E0D5] font-semibold">{title}</h3>
        {actionSlot || (
          <div className="flex items-center gap-3 text-xs text-[#6B7A88]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#5BB3B3]" /> Study Hours</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#E879F9]" /> MCQs Answered</span>
          </div>
        )}
      </div>
      <div className={`flex items-end gap-2 ${height}`}>
        {weeklyChart.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full flex flex-col items-center justify-end ${barHeight} relative`}>
              <div className="w-full max-w-8 bg-[#5BB3B3] rounded-t-md transition-all" style={{ height: `${(d.hours / (maxHours + 1)) * 100}%` }} />
              <div className="absolute top-0 w-2 h-2 rounded-full bg-[#E879F9]" style={{ bottom: `${(d.mcqs / 100) * 100}%`, top: "auto" }} />
            </div>
            <span className="text-[10px] text-[#6B7A88]">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
