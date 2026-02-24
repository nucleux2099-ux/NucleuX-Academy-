'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame } from 'lucide-react';
import { leaderboardTabs, leaderboardData } from './data';

export function LeaderboardTab() {
  const [leaderboardTab, setLeaderboardTab] = useState("allIndia");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {leaderboardTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={leaderboardTab === tab.id ? "default" : "outline"}
            className={
              leaderboardTab === tab.id
                ? "bg-[#5BB3B3] hover:bg-[#4A9E9E] shadow-lg"
                : "border-[rgba(91,179,179,0.15)] hover:bg-[#F8FAFC] text-[#A0B0BC]"
            }
            onClick={() => setLeaderboardTab(tab.id)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(91,179,179,0.15)] text-sm text-[#A0B0BC] bg-[#F8FAFC] font-medium">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Student</div>
            <div className="col-span-2 text-center hidden sm:block">MCQs</div>
            <div className="col-span-2 text-center hidden md:block">Accuracy</div>
            <div className="col-span-1 text-center hidden lg:block">Streak</div>
            <div className="col-span-2 text-right">XP</div>
          </div>

          <ScrollArea className="h-[500px]">
            {leaderboardData.allIndia.map((user) => (
              <div key={user.rank} className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(91,179,179,0.15)] hover:bg-[#F8FAFC] transition-colors">
                <div className="col-span-1 flex items-center">
                  {user.rank <= 3 ? (
                    <span className="text-xl">{user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}</span>
                  ) : (
                    <span className="font-bold text-[#A0B0BC]">#{user.rank}</span>
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-[#5BB3B3]/20 to-[#4A9E9E]/20 text-[#5BB3B3] font-medium">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-[#E8E0D5]">{user.name}</p>
                    <p className="text-xs text-[#A0B0BC]">{user.college}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center hidden sm:flex items-center justify-center font-medium text-[#E8E0D5]">
                  {user.mcqs.toLocaleString()}
                </div>
                <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                  <span className="text-[#7BA69E] font-semibold">{user.accuracy}%</span>
                </div>
                <div className="col-span-1 text-center hidden lg:flex items-center justify-center">
                  <Badge className="bg-[#FEF3C7] text-[#D97706] border-none">
                    <Flame className="w-3 h-3 mr-1" />{user.streak}
                  </Badge>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end gap-2">
                  <span className="font-bold text-[#E8E0D5]">{user.xp.toLocaleString()}</span>
                  {user.change !== 0 && (
                    <span className={`text-xs font-medium ${user.change > 0 ? "text-[#7BA69E]" : "text-[#DC2626]"}`}>
                      {user.change > 0 ? `↑${user.change}` : `↓${Math.abs(user.change)}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* User's Position */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-[#F3E8FF] to-[#E9D5FF] border-t-2 border-[#5BB3B3]">
            <div className="col-span-1 flex items-center">
              <span className="font-bold text-[#5BB3B3]">#{leaderboardData.userRank.rank}</span>
            </div>
            <div className="col-span-4 flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-[#5BB3B3] shadow-lg">
                <AvatarFallback className="bg-[#5BB3B3] text-white font-medium">
                  {leaderboardData.userRank.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-[#E8E0D5]">{leaderboardData.userRank.name} (You)</p>
                <p className="text-xs text-[#A0B0BC]">{leaderboardData.userRank.college}</p>
              </div>
            </div>
            <div className="col-span-2 text-center hidden sm:flex items-center justify-center font-medium text-[#E8E0D5]">
              {leaderboardData.userRank.mcqs.toLocaleString()}
            </div>
            <div className="col-span-2 text-center hidden md:flex items-center justify-center">
              <span className="text-[#7BA69E] font-semibold">{leaderboardData.userRank.accuracy}%</span>
            </div>
            <div className="col-span-1 text-center hidden lg:flex items-center justify-center">
              <Badge className="bg-[#FEF3C7] text-[#D97706] border-none">
                <Flame className="w-3 h-3 mr-1" />{leaderboardData.userRank.streak}
              </Badge>
            </div>
            <div className="col-span-2 text-right flex items-center justify-end gap-2">
              <span className="font-bold text-[#E8E0D5]">{leaderboardData.userRank.xp.toLocaleString()}</span>
              <span className="text-[#7BA69E] text-xs font-medium">↑{leaderboardData.userRank.change}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
