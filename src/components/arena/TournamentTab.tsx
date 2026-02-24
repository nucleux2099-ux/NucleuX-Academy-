'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, CheckCircle, Lock, Gift } from 'lucide-react';
import { weeklyTournament } from './data';

export function TournamentTab() {
  return (
    <div className="space-y-6">
      {/* Tournament Banner */}
      <Card className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#F3E8FF] border-[#FDE68A]/50 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/tournament-pattern.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5BB3B3]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <Badge className="bg-[#D97706] text-white mb-3 shadow-lg font-medium">{weeklyTournament.week} • {weeklyTournament.phase}</Badge>
              <h2 className="text-3xl font-bold text-[#E8E0D5] mb-2">{weeklyTournament.name}</h2>
              <p className="text-[#A0B0BC]">
                {weeklyTournament.totalParticipants.toLocaleString()} participants • Top {weeklyTournament.qualified} qualify
              </p>
              <div className="flex items-center gap-2 mt-4 bg-[#364A5E]/80 backdrop-blur px-4 py-2 rounded-xl w-fit shadow-lg border border-[rgba(91,179,179,0.15)]">
                <Trophy className="w-6 h-6 text-[#D97706]" />
                <span className="text-2xl font-bold text-[#D97706]">{weeklyTournament.prizePool}</span>
                <span className="text-[#A0B0BC]">Prize Pool</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              {weeklyTournament.userProgress.qualified ? (
                <Badge className="bg-[#7BA69E] text-white px-6 py-2 text-lg shadow-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  QUALIFIED!
                </Badge>
              ) : (
                <Badge className="bg-[#FEE2E2] text-[#DC2626] border-[#FECACA] px-6 py-2">
                  Not Qualified Yet
                </Badge>
              )}
              <Button className="bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#5B21B6] px-8 shadow-xl shadow-[#5BB3B3]/25">
                Play Tournament MCQs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Your Progress */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
          <CardHeader className="border-b border-[rgba(91,179,179,0.15)]">
            <CardTitle className="text-[#E8E0D5]">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center py-4 bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-2xl">
              <p className="text-6xl font-bold text-[#5BB3B3]">#{weeklyTournament.userProgress.rank}</p>
              <p className="text-[#A0B0BC] mt-2">Current Ranking</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Score', value: weeklyTournament.userProgress.score.toLocaleString() },
                { label: 'MCQs Answered', value: String(weeklyTournament.userProgress.questionsAnswered) },
                { label: 'Accuracy', value: `${weeklyTournament.userProgress.accuracy}%`, color: 'text-[#7BA69E]' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                  <span className="text-[#A0B0BC]">{item.label}</span>
                  <span className={`font-semibold ${item.color || 'text-[#E8E0D5]'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#F3E8FF]/50 to-[#E9D5FF]/50 border border-[#C4B5FD]/30">
              <p className="text-sm text-[#A0B0BC] mb-2">Next Milestone: Rank #{weeklyTournament.userProgress.nextMilestone.rank}</p>
              <Progress 
                value={(weeklyTournament.userProgress.score / weeklyTournament.userProgress.nextMilestone.scoreNeeded) * 100} 
                className="h-2" 
              />
              <p className="text-xs text-[#A0B0BC] mt-2">
                {weeklyTournament.userProgress.nextMilestone.scoreNeeded - weeklyTournament.userProgress.score} points to go
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Schedule */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
          <CardHeader className="border-b border-[rgba(91,179,179,0.15)]">
            <CardTitle className="text-[#E8E0D5]">Tournament Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {weeklyTournament.schedule.map((phase) => (
              <div
                key={phase.phase}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  phase.status === "active"
                    ? "bg-gradient-to-r from-[#F3E8FF] to-[#E9D5FF] border-[#5BB3B3]/30 shadow-lg"
                    : "bg-[#F8FAFC] border-[rgba(91,179,179,0.15)]"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  phase.status === "active" ? "bg-[#5BB3B3] text-white" : "bg-[#E2E8F0]"
                }`}>
                  {phase.status === "active" ? <Flame className="w-5 h-5" /> : <Lock className="w-5 h-5 text-[#94A3B8]" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#E8E0D5]">{phase.phase}</p>
                  <p className="text-sm text-[#A0B0BC]">{phase.dates}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#E8E0D5]">{phase.participants}</p>
                  <p className="text-xs text-[#A0B0BC]">players</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prizes */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-b border-[#FDE68A]/30 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
              <Gift className="w-5 h-5 text-[#D97706]" />
              Prizes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {weeklyTournament.prizes.map((prize, idx) => (
              <div key={prize.rank} className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                  idx === 0 ? "bg-gradient-to-br from-[#FDE68A] to-[#C9A86C]" :
                  idx === 1 ? "bg-gradient-to-br from-[#E2E8F0] to-[#94A3B8]" :
                  idx === 2 ? "bg-gradient-to-br from-[#FED7AA] to-[#EA580C]" :
                  "bg-gradient-to-br from-[#E9D5FF] to-[#5BB3B3]"
                }`}>
                  <prize.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#E8E0D5]">{prize.rank} Place</p>
                  <p className="text-sm text-[#A0B0BC]">{prize.prize}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
