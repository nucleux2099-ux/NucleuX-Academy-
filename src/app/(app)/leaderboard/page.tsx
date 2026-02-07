"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, Crown, Medal, Award, TrendingUp, TrendingDown,
  Minus, Filter, Calendar, Zap, Target, Brain, Flame
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  institution: string;
  score: number;
  accuracy: number;
  streak: number;
  badges: string[];
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, name: "Dr. Arun Kumar", avatar: "AK", institution: "AIIMS Delhi", score: 48750, accuracy: 94, streak: 45, badges: ["🏆", "🔥", "⚡"] },
  { rank: 2, previousRank: 3, name: "Dr. Priya Menon", avatar: "PM", institution: "CMC Vellore", score: 45200, accuracy: 92, streak: 38, badges: ["🏆", "🎯"] },
  { rank: 3, previousRank: 2, name: "Rahul Sharma", avatar: "RS", institution: "MAMC Delhi", score: 43800, accuracy: 91, streak: 42, badges: ["🔥", "📚"] },
  { rank: 4, previousRank: 4, name: "Dr. Kavitha Reddy", avatar: "KR", institution: "NIMS Hyderabad", score: 41500, accuracy: 89, streak: 31, badges: ["⚡"] },
  { rank: 5, previousRank: 7, name: "Sneha Patel", avatar: "SP", institution: "BJ Medical Ahmedabad", score: 39200, accuracy: 88, streak: 28, badges: ["📈"] },
  { rank: 6, previousRank: 5, name: "Dr. Mohammed Ali", avatar: "MA", institution: "Osmania Hyderabad", score: 38100, accuracy: 87, streak: 25, badges: [] },
  { rank: 7, previousRank: 6, name: "Arjun Reddy", avatar: "AR", institution: "Gandhi Medical", score: 36800, accuracy: 86, streak: 22, badges: [] },
  { rank: 8, previousRank: 9, name: "Dr. Neha Singh", avatar: "NS", institution: "KGMU Lucknow", score: 35400, accuracy: 85, streak: 19, badges: [] },
  { rank: 9, previousRank: 8, name: "Vikram Desai", avatar: "VD", institution: "Grant Medical Mumbai", score: 34200, accuracy: 84, streak: 17, badges: [] },
  { rank: 10, previousRank: 12, name: "Dr. Anjali Nair", avatar: "AN", institution: "Medical College Trivandrum", score: 33100, accuracy: 83, streak: 15, badges: ["📈"] },
];

const myRank: LeaderboardEntry = {
  rank: 47, previousRank: 52, name: "Aditya", avatar: "AC", institution: "Prasanthi Medical", score: 18500, accuracy: 78, streak: 12, badges: ["📈"]
};

const categories = [
  { id: "overall", label: "Overall", icon: Trophy },
  { id: "weekly", label: "This Week", icon: Calendar },
  { id: "surgery", label: "Surgery", icon: Target },
  { id: "medicine", label: "Medicine", icon: Brain },
  { id: "streak", label: "Streaks", icon: Flame },
];

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("overall");

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) return { icon: TrendingUp, color: "text-[#059669]", text: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: "text-[#EF4444]", text: `${diff}` };
    return { icon: Minus, color: "text-[#6B7280]", text: "—" };
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]", icon: Crown, iconColor: "text-white" };
    if (rank === 2) return { bg: "bg-gradient-to-r from-[#9CA3AF] to-[#6B7280]", icon: Medal, iconColor: "text-white" };
    if (rank === 3) return { bg: "bg-gradient-to-r from-[#CD7F32] to-[#A0522D]", icon: Award, iconColor: "text-white" };
    return { bg: "bg-[#142538]", icon: null, iconColor: "" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#F59E0B]" />
            Leaderboard
          </h1>
          <p className="text-[#9CA3AF] mt-1">Compete with medical students across India</p>
        </div>
        
        {/* Your Rank Card */}
        <Card className="bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(139,92,246,0.15)] border-[rgba(6,182,212,0.2)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#06B6D4]">#{myRank.rank}</p>
              <p className="text-xs text-[#6B7280]">Your Rank</p>
            </div>
            <div className="h-10 w-px bg-[rgba(6,182,212,0.2)]" />
            <div>
              <p className="text-sm text-[#E5E7EB]">{myRank.score.toLocaleString()} pts</p>
              <div className="flex items-center gap-1 text-xs text-[#059669]">
                <TrendingUp className="w-3 h-3" />
                <span>+5 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className={selectedCategory === cat.id 
              ? "bg-[#06B6D4] text-[#0D1B2A]" 
              : "border-[rgba(6,182,212,0.15)] text-[#9CA3AF] hover:bg-[#142538]"
            }
          >
            <cat.icon className="w-4 h-4 mr-1" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 0, 2].map((index) => {
          const entry = leaderboardData[index];
          const style = getRankStyle(entry.rank);
          const isFirst = entry.rank === 1;
          
          return (
            <Card 
              key={entry.rank}
              className={`bg-[#0F2233] border-[rgba(6,182,212,0.15)] ${isFirst ? 'ring-2 ring-[#F59E0B]/30' : ''}`}
            >
              <CardContent className={`p-4 text-center ${isFirst ? 'pt-2' : 'pt-6'}`}>
                {isFirst && (
                  <div className="flex justify-center mb-2">
                    <Crown className="w-8 h-8 text-[#F59E0B]" />
                  </div>
                )}
                <div className={`w-16 h-16 mx-auto rounded-full ${style.bg} flex items-center justify-center mb-3`}>
                  <span className="text-xl font-bold text-white">{entry.avatar}</span>
                </div>
                <h3 className="font-semibold text-[#E5E7EB] truncate">{entry.name}</h3>
                <p className="text-xs text-[#6B7280] truncate">{entry.institution}</p>
                <p className="text-lg font-bold text-[#06B6D4] mt-2">{entry.score.toLocaleString()}</p>
                <div className="flex justify-center gap-1 mt-2">
                  {entry.badges.map((badge, i) => (
                    <span key={i} className="text-sm">{badge}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardHeader>
          <CardTitle className="text-lg text-[#E5E7EB]">Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-[#6B7280] border-b border-[rgba(6,182,212,0.1)]">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Student</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right">Accuracy</div>
              <div className="col-span-2 text-right">Streak</div>
              <div className="col-span-1 text-right">Δ</div>
            </div>

            {/* Entries */}
            {leaderboardData.map((entry) => {
              const rankChange = getRankChange(entry.rank, entry.previousRank);
              const RankIcon = rankChange.icon;
              const style = getRankStyle(entry.rank);
              
              return (
                <div 
                  key={entry.rank}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg items-center ${
                    entry.rank <= 3 ? 'bg-[rgba(245,158,11,0.05)]' : 'hover:bg-[#142538]'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                      {style.icon ? (
                        <style.icon className={`w-4 h-4 ${style.iconColor}`} />
                      ) : (
                        <span className="text-sm font-bold text-[#9CA3AF]">{entry.rank}</span>
                      )}
                    </div>
                  </div>

                  {/* Student */}
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white text-xs">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-[#E5E7EB] truncate">{entry.name}</p>
                      <p className="text-xs text-[#6B7280] truncate">{entry.institution}</p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-right">
                    <span className="font-semibold text-[#E5E7EB]">{entry.score.toLocaleString()}</span>
                  </div>

                  {/* Accuracy */}
                  <div className="col-span-2 text-right">
                    <Badge className="bg-[rgba(5,150,105,0.15)] text-[#059669] border-none">
                      {entry.accuracy}%
                    </Badge>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 text-right">
                    <span className="text-[#F59E0B] flex items-center justify-end gap-1">
                      <Flame className="w-3 h-3" />
                      {entry.streak}
                    </span>
                  </div>

                  {/* Change */}
                  <div className="col-span-1 text-right">
                    <span className={`flex items-center justify-end gap-0.5 text-xs ${rankChange.color}`}>
                      <RankIcon className="w-3 h-3" />
                      {rankChange.text}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Your Position Highlight */}
            <div className="mt-4 pt-4 border-t border-[rgba(6,182,212,0.1)]">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 rounded-lg items-center bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)]">
                <div className="col-span-1">
                  <div className="w-8 h-8 rounded-lg bg-[#06B6D4] flex items-center justify-center">
                    <span className="text-sm font-bold text-[#0D1B2A]">{myRank.rank}</span>
                  </div>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <Avatar className="w-8 h-8 ring-2 ring-[#06B6D4]">
                    <AvatarFallback className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] text-white text-xs">
                      {myRank.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#E5E7EB]">{myRank.name} <Badge className="ml-1 bg-[#06B6D4] text-[#0D1B2A] text-[10px]">You</Badge></p>
                    <p className="text-xs text-[#6B7280]">{myRank.institution}</p>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-semibold text-[#E5E7EB]">{myRank.score.toLocaleString()}</span>
                </div>
                <div className="col-span-2 text-right">
                  <Badge className="bg-[rgba(5,150,105,0.15)] text-[#059669] border-none">
                    {myRank.accuracy}%
                  </Badge>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-[#F59E0B] flex items-center justify-end gap-1">
                    <Flame className="w-3 h-3" />
                    {myRank.streak}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="flex items-center justify-end gap-0.5 text-xs text-[#059669]">
                    <TrendingUp className="w-3 h-3" />
                    +5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
