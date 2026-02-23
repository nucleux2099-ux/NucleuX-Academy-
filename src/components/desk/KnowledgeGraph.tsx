import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge, ProgressBar } from "./shared";
import { WeeklyChart } from "./WeeklyChart";

interface KnowledgeGraphProps {
  stats: { weekTopics: number; mcqAccuracy: number };
  activePathway: { title?: string; progress_percent?: number } | undefined;
  weeklyChart: { day: string; hours: number; mcqs: number }[];
  maxHours: number;
  focusAreas: { topic: string; accuracy: number; attempts: number; color: string }[];
  recentActivity: { text: string; time: string; type: string; icon: React.ComponentType<{ className?: string }>; color: string }[];
  hasFocusAreas: boolean;
  onConnectedTopics: () => void;
  onRetrievalStrength: () => void;
  onPathwayProgress: () => void;
  onWeeklySignal: () => void;
  onPracticeWeakAreas: () => void;
}

export function KnowledgeGraph({
  stats, activePathway, weeklyChart, maxHours, focusAreas, recentActivity,
  hasFocusAreas, onConnectedTopics, onRetrievalStrength, onPathwayProgress,
  onWeeklySignal, onPracticeWeakAreas,
}: KnowledgeGraphProps) {
  return (
    <>
      <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#E8E0D5] font-semibold text-lg">Knowledge Graph Snapshot</h2>
          <Badge className="bg-[#253545] text-[#A0B0BC]">Live from your activity</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={onConnectedTopics} className="bg-[#253545] rounded-xl p-4 text-left hover:bg-[#2a3f52] transition-colors">
            <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">Connected Topics</p>
            <p className="text-2xl font-bold text-[#E8E0D5] mt-1">{stats.weekTopics}</p>
            <p className="text-xs text-[#A0B0BC] mt-1">Topics touched in the last 7 days</p>
          </button>
          <button onClick={onRetrievalStrength} className="bg-[#253545] rounded-xl p-4 text-left hover:bg-[#2a3f52] transition-colors">
            <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">Retrieval Strength</p>
            <p className="text-2xl font-bold text-[#E8E0D5] mt-1">{stats.mcqAccuracy}%</p>
            <p className="text-xs text-[#A0B0BC] mt-1">Current signal from MCQ attempts</p>
          </button>
          <button onClick={onPathwayProgress} className="bg-[#253545] rounded-xl p-4 text-left hover:bg-[#2a3f52] transition-colors">
            <p className="text-[10px] text-[#6B7A88] uppercase tracking-wider">Active Pathway</p>
            <p className="text-2xl font-bold text-[#E8E0D5] mt-1">{activePathway?.progress_percent || 0}%</p>
            <p className="text-xs text-[#A0B0BC] mt-1">{activePathway?.title || "No active pathway"}</p>
          </button>
        </div>
      </Card>

      <WeeklyChart
        weeklyChart={weeklyChart}
        maxHours={maxHours}
        title="Weekly Signal Flow"
        height="h-44"
        barHeight="h-36"
        actionSlot={<button onClick={onWeeklySignal} className="text-xs text-[#5BB3B3] hover:underline">Open full analytics</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-1">Weak Links</h3>
          <p className="text-xs text-[#6B7A88] mb-3">Low-accuracy areas detected from recent attempts.</p>
          <div className="space-y-3">
            {focusAreas.length === 0 && (
              <p className="text-sm text-[#6B7A88]">No weak links detected this week.</p>
            )}
            {focusAreas.map((a, i) => (
              <div key={i} className="bg-[#253545] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#E8E0D5]">{a.topic}</span>
                  <Badge className={a.color}>{a.accuracy}%</Badge>
                </div>
                <p className="text-[10px] text-[#6B7A88] mb-1.5">{a.attempts} attempts</p>
                <ProgressBar value={a.accuracy} barClass={a.accuracy < 60 ? "bg-red-400" : "bg-orange-400"} />
              </div>
            ))}
          </div>
          <button onClick={onPracticeWeakAreas} className="mt-3 text-[#5BB3B3] text-sm font-medium hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!hasFocusAreas}><AlertTriangle className="w-3.5 h-3.5" /> Practice Weak Areas</button>
        </Card>

        <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
          <h3 className="text-[#E8E0D5] font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-[#6B7A88] text-center py-4">No activity yet. Start studying to populate your graph.</p>
            )}
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5"><a.icon className={`w-4 h-4 ${a.color}`} /></div>
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
      </div>
    </>
  );
}
