import { Card } from "@/components/ui/card";
import { Zap, Bookmark } from "lucide-react";
import { Badge, ProgressBar } from "./shared";

interface StudyCoachProps {
  stats: { mcqAccuracy: number };
  hasData: boolean;
  coachFocusLabel: string;
  coachConfidence: number;
  coachSessionMinutes: number;
  lastStudyText: string;
  recommendedChips: { title: string; minutes: string; source: string }[];
  studyPlanToday: { study_minutes?: number; mcqs_attempted?: number } | undefined;
  onAskWhy: () => void;
}

export function StudyCoach({
  stats, hasData, coachFocusLabel, coachConfidence, coachSessionMinutes,
  lastStudyText, recommendedChips, studyPlanToday, onAskWhy,
}: StudyCoachProps) {
  return (
    <Card className="bg-[#1B2838] border-[rgba(232,224,213,0.06)] rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#5EEAD4] flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[#E8E0D5] font-semibold">ATOM Study Coach</h2>
            <Badge className={stats.mcqAccuracy < 70 ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}>{coachFocusLabel}</Badge>
            <span className="ml-auto text-sm text-[#A0B0BC]">{coachConfidence}% confidence</span>
          </div>
          <ProgressBar value={stats.mcqAccuracy || 0} className="mt-2 h-2" barClass={stats.mcqAccuracy < 60 ? "bg-[#F97316]" : "bg-[#5BB3B3]"} />
          <p className="text-[#A0B0BC] text-sm mt-2 italic">{hasData ? `"Your overall accuracy is ${stats.mcqAccuracy}%. ${stats.mcqAccuracy < 70 ? "Let's strengthen this together." : "Great progress!"}"` : `"Start studying to see your personalized insights here."`}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {recommendedChips.map((t) => (
              <span key={t.title} className="bg-[#253545] text-[#E8E0D5] text-xs px-3 py-1.5 rounded-lg border border-[rgba(232,224,213,0.06)]">
                {t.title} · <span className="text-[#6B7A88]">{t.minutes} · {t.source}</span>
              </span>
            ))}
            {recommendedChips.length === 0 && (
              <span className="bg-[#253545] text-[#E8E0D5] text-xs px-3 py-1.5 rounded-lg border border-[rgba(232,224,213,0.06)]">
                Complete more sessions to unlock targeted recommendations.
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-[#6B7A88]">
            <span>{studyPlanToday?.study_minutes || 0} min studied today</span>
            <span>{studyPlanToday?.mcqs_attempted || 0} MCQs today</span>
            <span>{coachSessionMinutes} min suggested</span>
            <span>Last studied: {lastStudyText}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Start {coachSessionMinutes}-min Review</button>
            <button onClick={onAskWhy} className="border border-[rgba(232,224,213,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5] px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors"><Bookmark className="w-3.5 h-3.5" /> Ask Why</button>
          </div>
        </div>
      </div>
    </Card>
  );
}
