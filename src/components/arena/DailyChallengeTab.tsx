'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Target, Timer, Zap, Coins, Users, Play, Crown } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { dailyChallenge, pastChallenges } from './data';

export function DailyChallengeTab() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Challenge Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-white via-[#F8FAFC] to-[#F3E8FF] border-[rgba(91,179,179,0.15)] shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5BB3B3]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D97706]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-[#DC2626] text-white mb-3 shadow-lg animate-pulse">🔴 LIVE NOW</Badge>
                <CardTitle className="text-2xl text-[#E8E0D5]">{dailyChallenge.title}</CardTitle>
                <p className="text-[#A0B0BC] mt-2">{dailyChallenge.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#A0B0BC] mb-2">Ends in</p>
                <CountdownTimer {...dailyChallenge.endsIn} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Target, value: dailyChallenge.questionsCount, label: 'Questions', color: '#5BB3B3' },
                { icon: Timer, value: dailyChallenge.timeLimit, label: 'Minutes', color: '#4A9E9E' },
                { icon: Zap, value: dailyChallenge.reward.xp, label: 'XP Reward', color: '#D97706' },
                { icon: Coins, value: dailyChallenge.reward.coins, label: 'Coins', color: '#7BA69E' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#364A5E] rounded-xl p-4 text-center shadow-lg border border-[rgba(91,179,179,0.15)]">
                  <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                  <p className="text-2xl font-bold text-[#E8E0D5]">{stat.value}</p>
                  <p className="text-xs text-[#A0B0BC]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className="bg-[#FEE2E2] text-[#DC2626] border-none font-medium">{dailyChallenge.difficulty}</Badge>
                <Badge className="bg-[#F3E8FF] text-[#5BB3B3] border-none font-medium">{dailyChallenge.subject}</Badge>
              </div>
              <div className="flex items-center gap-2 text-[#A0B0BC] bg-[#364A5E] px-3 py-1.5 rounded-full border border-[rgba(91,179,179,0.15)]">
                <Users className="w-4 h-4" />
                <span className="font-medium">{dailyChallenge.participants.toLocaleString()} playing</span>
              </div>
            </div>

            <Button className="w-full py-6 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#5B21B6] text-lg font-semibold shadow-xl shadow-[#5BB3B3]/25 transition-all hover:scale-[1.02]">
              <Play className="w-5 h-5 mr-2" />
              Start Challenge
            </Button>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-b border-[#FDE68A]/30 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-[#E8E0D5]">
              <Crown className="w-5 h-5 text-[#D97706]" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {dailyChallenge.topPerformers.map((performer, idx) => (
              <div key={performer.rank} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:shadow-lg transition-all">
                <span className="text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                <Avatar className="w-10 h-10 shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-[#5BB3B3]/20 to-[#4A9E9E]/20 text-[#5BB3B3] font-medium">
                    {performer.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-[#E8E0D5]">{performer.name}</p>
                  <p className="text-sm text-[#A0B0BC]">{performer.score} • {performer.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-[rgba(91,179,179,0.15)] hover:bg-[#F8FAFC] text-[#A0B0BC]">
              View All Rankings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Past Challenges */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#E8E0D5]">Past Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastChallenges.map((challenge, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/30 hover:shadow-lg cursor-pointer transition-all">
                <p className="text-xs text-[#94A3B8] mb-1">{challenge.day}</p>
                <p className="font-semibold text-[#E8E0D5] mb-2">{challenge.title}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7BA69E] font-medium">{challenge.score}</span>
                  <span className="text-[#A0B0BC]">Rank #{challenge.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
