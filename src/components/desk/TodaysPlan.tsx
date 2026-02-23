import { Card } from "@/components/ui/card";
import { Flame, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./shared";
import type { LucideIcon } from "lucide-react";

export type DeskTask = {
  icon: LucideIcon;
  title: string;
  badge: string;
  badgeColor: string;
  subtitle: string;
  time: string;
  done: boolean;
  actionPath?: string;
};

interface TodaysPlanProps {
  tasks: DeskTask[];
  streak: number;
  todayTotalMinutes: number;
  totalTaskCount: number;
  onTaskClick: (task: DeskTask) => void;
  onStartPlan: () => void;
}

export function TodaysPlan({ tasks, streak, todayTotalMinutes, totalTaskCount, onTaskClick, onStartPlan }: TodaysPlanProps) {
  return (
    <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[#E8E0D5] font-semibold text-lg">Today&apos;s Study Plan</h2>
          <span className="text-[#6B7A88] text-sm">~{todayTotalMinutes} min</span>
        </div>
        <Badge className="bg-orange-500/20 text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {streak} day streak</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div
            key={i}
            onClick={() => { if (task.actionPath) onTaskClick(task); }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-colors",
              task.done ? "bg-[#253545]/50 opacity-60" : "bg-[#253545] hover:bg-[#2a3f52]",
              task.actionPath ? "cursor-pointer" : ""
            )}
          >
            {task.done ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" /> : <Circle className="w-5 h-5 text-[#6B7A88] shrink-0" />}
            <task.icon className="w-4 h-4 text-[#5BB3B3] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", task.done ? "line-through text-[#6B7A88]" : "text-[#E8E0D5]")}>{task.title}</span>
                <Badge className={task.badgeColor}>{task.badge}</Badge>
              </div>
              <p className="text-xs text-[#6B7A88]">{task.subtitle}</p>
            </div>
            <span className="text-sm text-[#A0B0BC] shrink-0 flex items-center gap-1">{task.time} <ChevronRight className="w-3 h-3" /></span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(232,224,213,0.06)]">
        <div className="text-xs text-[#6B7A88]">{totalTaskCount} tasks generated for today based on your goals.</div>
      </div>
      <button onClick={onStartPlan} className="w-full mt-3 bg-[#5BB3B3] hover:bg-[#4a9e9e] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">Start Today&apos;s Plan</button>
      <p className="text-[10px] text-[#6B7A88] mt-2 text-center">💡 Interleaved learning: Topics mix review, new content, and retrieval for optimal retention</p>
    </Card>
  );
}
