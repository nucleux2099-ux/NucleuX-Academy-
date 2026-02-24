"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Flame, Star, Coins, Gift, Swords } from "lucide-react";
import { userCoins, leaderboardData } from "@/components/arena/data";
import { DailyChallengeTab } from "@/components/arena/DailyChallengeTab";
import { TournamentTab } from "@/components/arena/TournamentTab";
import { LeaderboardTab } from "@/components/arena/LeaderboardTab";
import { RewardsShopTab } from "@/components/arena/RewardsShopTab";

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D97706]/10 to-[#5BB3B3]/10 flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-[#D97706]" />
            </div>
            The Arena
          </h1>
          <p className="text-[#A0B0BC] mt-1 ml-15">
            Compete, climb the ranks, and win amazing rewards
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] text-[#D97706] border-[#FDE68A] px-4 py-2 font-semibold shadow-md">
            <Coins className="w-4 h-4 mr-2" />
            {userCoins.toLocaleString()} Coins
          </Badge>
          <Badge className="bg-gradient-to-r from-[#F3E8FF] to-[#E9D5FF] text-[#5BB3B3] border-[#C4B5FD] px-4 py-2 font-semibold shadow-md">
            <Star className="w-4 h-4 mr-2" />
            Rank #{leaderboardData.userRank.rank}
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#364A5E] border border-[rgba(91,179,179,0.15)] p-1.5 rounded-xl shadow-md">
          <TabsTrigger value="daily" className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]">
            <Flame className="w-4 h-4 mr-2" />Daily Challenge
          </TabsTrigger>
          <TabsTrigger value="tournament" className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]">
            <Swords className="w-4 h-4 mr-2" />Tournament
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]">
            <Trophy className="w-4 h-4 mr-2" />Leaderboards
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]">
            <Gift className="w-4 h-4 mr-2" />Rewards Shop
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <DailyChallengeTab />
        </TabsContent>
        <TabsContent value="tournament" className="space-y-6">
          <TournamentTab />
        </TabsContent>
        <TabsContent value="leaderboard" className="space-y-6">
          <LeaderboardTab />
        </TabsContent>
        <TabsContent value="rewards" className="space-y-6">
          <RewardsShopTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
