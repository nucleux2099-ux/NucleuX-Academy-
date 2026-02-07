"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Star, Target, Flame, BookOpen, Brain, Zap, 
  Crown, Medal, Award, Shield, Clock, CheckCircle,
  Lock, Sparkles, TrendingUp
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  category: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const achievements: Achievement[] = [
  // Study Streaks
  { id: "streak7", title: "Week Warrior", description: "Maintain a 7-day study streak", icon: Flame, color: "#F59E0B", bg: "rgba(245,158,11,0.15)", category: "Streaks", progress: 7, maxProgress: 7, unlocked: true, unlockedAt: "Jan 28, 2025", xp: 100, rarity: "common" },
  { id: "streak30", title: "Monthly Master", description: "Maintain a 30-day study streak", icon: Flame, color: "#EF4444", bg: "rgba(239,68,68,0.15)", category: "Streaks", progress: 12, maxProgress: 30, unlocked: false, xp: 500, rarity: "rare" },
  { id: "streak100", title: "Century Legend", description: "Maintain a 100-day study streak", icon: Crown, color: "#F59E0B", bg: "rgba(245,158,11,0.2)", category: "Streaks", progress: 12, maxProgress: 100, unlocked: false, xp: 2000, rarity: "legendary" },
  
  // MCQ Mastery
  { id: "mcq100", title: "Question Hunter", description: "Answer 100 MCQs", icon: Target, color: "#06B6D4", bg: "rgba(6,182,212,0.15)", category: "MCQs", progress: 100, maxProgress: 100, unlocked: true, unlockedAt: "Jan 25, 2025", xp: 150, rarity: "common" },
  { id: "mcq500", title: "Quiz Champion", description: "Answer 500 MCQs", icon: Target, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", category: "MCQs", progress: 487, maxProgress: 500, unlocked: false, xp: 750, rarity: "rare" },
  { id: "perfect10", title: "Perfect Ten", description: "Score 100% on 10 quizzes in a row", icon: CheckCircle, color: "#059669", bg: "rgba(5,150,105,0.15)", category: "MCQs", progress: 6, maxProgress: 10, unlocked: false, xp: 1000, rarity: "epic" },
  
  // Learning
  { id: "topics10", title: "Explorer", description: "Complete 10 topics", icon: BookOpen, color: "#059669", bg: "rgba(5,150,105,0.15)", category: "Learning", progress: 10, maxProgress: 10, unlocked: true, unlockedAt: "Jan 30, 2025", xp: 200, rarity: "common" },
  { id: "topics50", title: "Scholar", description: "Complete 50 topics", icon: BookOpen, color: "#0EA5E9", bg: "rgba(14,165,233,0.15)", category: "Learning", progress: 48, maxProgress: 50, unlocked: false, xp: 1000, rarity: "rare" },
  { id: "mastery", title: "Subject Master", description: "Achieve 90%+ mastery in any subject", icon: Brain, color: "#EC4899", bg: "rgba(236,72,153,0.15)", category: "Learning", progress: 85, maxProgress: 90, unlocked: false, xp: 1500, rarity: "epic" },
  
  // Arena
  { id: "arena1", title: "First Blood", description: "Win your first Arena match", icon: Zap, color: "#EF4444", bg: "rgba(239,68,68,0.15)", category: "Arena", progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "Feb 1, 2025", xp: 250, rarity: "common" },
  { id: "arena10", title: "Arena Regular", description: "Win 10 Arena matches", icon: Medal, color: "#F59E0B", bg: "rgba(245,158,11,0.15)", category: "Arena", progress: 7, maxProgress: 10, unlocked: false, xp: 500, rarity: "rare" },
  { id: "top10", title: "Elite Competitor", description: "Reach top 10 in any Arena leaderboard", icon: Crown, color: "#F59E0B", bg: "rgba(245,158,11,0.2)", category: "Arena", progress: 0, maxProgress: 1, unlocked: false, xp: 2000, rarity: "legendary" },
  
  // Special
  { id: "early", title: "Early Bird", description: "Study before 6 AM", icon: Clock, color: "#22D3EE", bg: "rgba(34,211,238,0.15)", category: "Special", progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "Feb 3, 2025", xp: 100, rarity: "common" },
  { id: "nightowl", title: "Night Owl", description: "Study past midnight for 5 days", icon: Star, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", category: "Special", progress: 3, maxProgress: 5, unlocked: false, xp: 200, rarity: "rare" },
  { id: "allrounder", title: "Renaissance Doctor", description: "Complete topics in all 5 subjects", icon: Award, color: "#F59E0B", bg: "rgba(245,158,11,0.2)", category: "Special", progress: 4, maxProgress: 5, unlocked: false, xp: 1500, rarity: "epic" },
];

const rarityConfig = {
  common: { label: "Common", color: "#9CA3AF", border: "rgba(156,163,175,0.3)" },
  rare: { label: "Rare", color: "#3B82F6", border: "rgba(59,130,246,0.3)" },
  epic: { label: "Epic", color: "#8B5CF6", border: "rgba(139,92,246,0.3)" },
  legendary: { label: "Legendary", color: "#F59E0B", border: "rgba(245,158,11,0.5)" },
};

const categories = ["All", "Streaks", "MCQs", "Learning", "Arena", "Special"];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filtered = selectedCategory === "All" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  const unlocked = achievements.filter(a => a.unlocked);
  const totalXP = unlocked.reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#F59E0B]" />
            Achievements
          </h1>
          <p className="text-[#9CA3AF] mt-1">Track your milestones and earn rewards</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-[#0F2233] rounded-xl border border-[rgba(6,182,212,0.15)]">
            <p className="text-2xl font-bold text-[#F59E0B]">{unlocked.length}</p>
            <p className="text-xs text-[#6B7280]">Unlocked</p>
          </div>
          <div className="text-center px-4 py-2 bg-[#0F2233] rounded-xl border border-[rgba(6,182,212,0.15)]">
            <p className="text-2xl font-bold text-[#06B6D4]">{totalXP.toLocaleString()}</p>
            <p className="text-xs text-[#6B7280]">Total XP</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#E5E7EB]">Overall Progress</h3>
            <span className="text-[#06B6D4]">{unlocked.length}/{achievements.length} achievements</span>
          </div>
          <Progress value={(unlocked.length / achievements.length) * 100} className="h-3" />
          <div className="flex justify-between mt-4">
            {Object.entries(rarityConfig).map(([key, config]) => {
              const count = achievements.filter(a => a.rarity === key && a.unlocked).length;
              const total = achievements.filter(a => a.rarity === key).length;
              return (
                <div key={key} className="text-center">
                  <Badge 
                    variant="outline" 
                    className="mb-1"
                    style={{ borderColor: config.border, color: config.color }}
                  >
                    {config.label}
                  </Badge>
                  <p className="text-sm text-[#6B7280]">{count}/{total}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat 
              ? "bg-[#06B6D4] text-[#0D1B2A]" 
              : "border-[rgba(6,182,212,0.15)] text-[#9CA3AF] hover:bg-[#142538]"
            }
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement) => {
          const Icon = achievement.icon;
          const rarity = rarityConfig[achievement.rarity];
          const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <Card 
              key={achievement.id}
              className={`bg-[#0F2233] border transition-all hover:scale-[1.02] ${
                achievement.unlocked 
                  ? 'border-[rgba(6,182,212,0.15)]' 
                  : 'border-[rgba(107,114,128,0.2)] opacity-75'
              }`}
              style={achievement.rarity === 'legendary' && achievement.unlocked ? {
                boxShadow: `0 0 20px ${rarityConfig.legendary.border}`
              } : {}}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center relative ${
                      !achievement.unlocked ? 'grayscale' : ''
                    }`}
                    style={{ backgroundColor: achievement.bg }}
                  >
                    <Icon className="w-7 h-7" style={{ color: achievement.color }} />
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 bg-[#0D1B2A]/50 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#6B7280]" />
                      </div>
                    )}
                    {achievement.unlocked && achievement.rarity === 'legendary' && (
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#F59E0B]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${
                        achievement.unlocked ? 'text-[#E5E7EB]' : 'text-[#6B7280]'
                      }`}>
                        {achievement.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="text-[10px] shrink-0"
                        style={{ borderColor: rarity.border, color: rarity.color }}
                      >
                        {rarity.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6B7280] mb-2">{achievement.description}</p>
                    
                    {/* Progress */}
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#6B7280]">Progress</span>
                          <span className="text-[#9CA3AF]">{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={progressPercent} className="h-1.5" />
                      </div>
                    )}
                    
                    {achievement.unlocked && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#059669]">✓ Unlocked {achievement.unlockedAt}</span>
                        <Badge className="bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border-none text-xs">
                          +{achievement.xp} XP
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
