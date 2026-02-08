"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Crown,
  Medal,
  Target,
  Gift,
  Coins,
  Sparkles,
  Timer,
  Users,
  TrendingUp,
  Lock,
  CheckCircle,
  Play,
  Award,
  Swords,
  Calendar,
  Shield,
} from "lucide-react";

// Arena room color - Gold/Yellow (used in theme)

// Daily Challenge Data
const dailyChallenge = {
  title: "Speed Round: Cardiology",
  description: "Answer 20 MCQs in 15 minutes",
  subject: "Medicine",
  difficulty: "Hard",
  questionsCount: 20,
  timeLimit: 15, // minutes
  reward: { xp: 500, coins: 100 },
  participants: 1247,
  topPerformers: [
    { rank: 1, name: "Dr. Arun K", score: "20/20", time: "8:32", avatar: "AK" },
    { rank: 2, name: "MedProdigy", score: "20/20", time: "9:15", avatar: "MP" },
    { rank: 3, name: "CardioKing", score: "19/20", time: "10:02", avatar: "CK" },
  ],
  endsIn: { hours: 5, minutes: 32, seconds: 15 },
};

// Weekly Tournament Data
const weeklyTournament = {
  name: "Grand Medical Tournament",
  week: "Week 7",
  phase: "Qualifying",
  totalParticipants: 5847,
  qualified: 256,
  prizePool: "₹50,000",
  prizes: [
    { rank: "1st", prize: "₹20,000 + Premium 1 Year", icon: Crown },
    { rank: "2nd", prize: "₹10,000 + Premium 6 Months", icon: Medal },
    { rank: "3rd", prize: "₹5,000 + Premium 3 Months", icon: Award },
    { rank: "4-10", prize: "Premium 1 Month", icon: Star },
  ],
  schedule: [
    { phase: "Qualifying", dates: "Feb 1-7", status: "active", participants: 5847 },
    { phase: "Quarter Finals", dates: "Feb 8-9", status: "upcoming", participants: 256 },
    { phase: "Semi Finals", dates: "Feb 10", status: "upcoming", participants: 64 },
    { phase: "Finals", dates: "Feb 11", status: "upcoming", participants: 16 },
  ],
  userProgress: {
    rank: 128,
    score: 2340,
    questionsAnswered: 450,
    accuracy: 84,
    qualified: true,
    nextMilestone: { rank: 100, scoreNeeded: 2500 },
  },
};

// Leaderboard Data
const leaderboardTabs = [
  { id: "allIndia", label: "All India", icon: Trophy },
  { id: "college", label: "College", icon: Users },
  { id: "state", label: "State", icon: Target },
  { id: "friends", label: "Friends", icon: Star },
  { id: "weekly", label: "This Week", icon: Calendar },
];

const leaderboardData = {
  allIndia: [
    { rank: 1, name: "Dr. Ravi Kumar", college: "AIIMS Delhi", mcqs: 12450, accuracy: 94.2, streak: 187, xp: 125000, avatar: "RK", change: 0 },
    { rank: 2, name: "Priya Sharma", college: "CMC Vellore", mcqs: 11890, accuracy: 92.8, streak: 156, xp: 118900, avatar: "PS", change: 1 },
    { rank: 3, name: "Arjun Menon", college: "JIPMER", mcqs: 11234, accuracy: 91.5, streak: 134, xp: 112340, avatar: "AM", change: -1 },
    { rank: 4, name: "Sneha Patel", college: "KMC Manipal", mcqs: 10876, accuracy: 90.1, streak: 128, xp: 108760, avatar: "SP", change: 2 },
    { rank: 5, name: "Vikram Singh", college: "MAMC Delhi", mcqs: 10654, accuracy: 89.7, streak: 112, xp: 106540, avatar: "VS", change: 0 },
    { rank: 6, name: "Kavitha R", college: "Stanley MC", mcqs: 10234, accuracy: 88.9, streak: 98, xp: 102340, avatar: "KR", change: 3 },
    { rank: 7, name: "Mohammed Ali", college: "GMC Thrissur", mcqs: 9987, accuracy: 88.2, streak: 89, xp: 99870, avatar: "MA", change: -2 },
    { rank: 8, name: "Ananya Das", college: "KGMU Lucknow", mcqs: 9765, accuracy: 87.6, streak: 76, xp: 97650, avatar: "AD", change: 1 },
    { rank: 9, name: "Rahul Verma", college: "Grant MC Mumbai", mcqs: 9543, accuracy: 87.1, streak: 65, xp: 95430, avatar: "RV", change: 0 },
    { rank: 10, name: "Deepika N", college: "MMC Chennai", mcqs: 9321, accuracy: 86.5, streak: 54, xp: 93210, avatar: "DN", change: -1 },
  ],
  userRank: {
    rank: 1247,
    name: "Aditya C",
    college: "GMC Kadapa",
    mcqs: 4567,
    accuracy: 78.5,
    streak: 12,
    xp: 45670,
    avatar: "AC",
    change: 15,
  },
};

// Rewards Shop Data
const userCoins = 2450;
const rewardCategories = ["All", "Premium", "Badges", "Cosmetics", "Donate"];
const rewardsShop = [
  {
    id: 1,
    name: "Premium Week",
    description: "7 days of premium access",
    price: 500,
    category: "Premium",
    icon: Sparkles,
    color: "#5BB3B3",
    popular: true,
  },
  {
    id: 2,
    name: "Premium Month",
    description: "30 days of premium access",
    price: 1500,
    category: "Premium",
    icon: Crown,
    color: "#D97706",
    popular: true,
  },
  {
    id: 3,
    name: "Speed Demon Badge",
    description: "Show off your quick answering",
    price: 300,
    category: "Badges",
    icon: Zap,
    color: "#DC2626",
    popular: false,
  },
  {
    id: 4,
    name: "Scholar Badge",
    description: "100 MCQs with 90%+ accuracy",
    price: 500,
    category: "Badges",
    icon: Award,
    color: "#7BA69E",
    popular: false,
  },
  {
    id: 5,
    name: "Streak Shield",
    description: "Protect your streak once",
    price: 200,
    category: "Cosmetics",
    icon: Shield,
    color: "#4A9E9E",
    popular: true,
  },
  {
    id: 6,
    name: "Profile Frame: Gold",
    description: "Golden border for your avatar",
    price: 800,
    category: "Cosmetics",
    icon: Star,
    color: "#D97706",
    popular: false,
  },
  {
    id: 7,
    name: "2x XP Boost (1 Day)",
    description: "Double XP for 24 hours",
    price: 400,
    category: "Premium",
    icon: TrendingUp,
    color: "#5BB3B3",
    popular: true,
  },
  {
    id: 8,
    name: "Donate to Scholar Fund",
    description: "Help a student in need",
    price: 100,
    category: "Donate",
    icon: Gift,
    color: "#DB2777",
    popular: false,
  },
];

// Countdown Timer Component
function CountdownTimer({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
  const [time, setTime] = useState({ hours, minutes, seconds });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="text-center">
        <div className="bg-[#364A5E] rounded-xl px-3 py-2 min-w-[50px] shadow-lg border border-[rgba(91,179,179,0.15)]">
          <span className="text-2xl font-bold text-[#5BB3B3]">{String(time.hours).padStart(2, "0")}</span>
        </div>
        <span className="text-xs text-[#A0B0BC] mt-1 block">Hours</span>
      </div>
      <span className="text-2xl font-bold text-[#94A3B8]">:</span>
      <div className="text-center">
        <div className="bg-[#364A5E] rounded-xl px-3 py-2 min-w-[50px] shadow-lg border border-[rgba(91,179,179,0.15)]">
          <span className="text-2xl font-bold text-[#5BB3B3]">{String(time.minutes).padStart(2, "0")}</span>
        </div>
        <span className="text-xs text-[#A0B0BC] mt-1 block">Minutes</span>
      </div>
      <span className="text-2xl font-bold text-[#94A3B8]">:</span>
      <div className="text-center">
        <div className="bg-[#364A5E] rounded-xl px-3 py-2 min-w-[50px] shadow-lg border border-[rgba(91,179,179,0.15)]">
          <span className="text-2xl font-bold text-[#5BB3B3]">{String(time.seconds).padStart(2, "0")}</span>
        </div>
        <span className="text-xs text-[#A0B0BC] mt-1 block">Seconds</span>
      </div>
    </div>
  );
}

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [leaderboardTab, setLeaderboardTab] = useState("allIndia");
  const [rewardCategory, setRewardCategory] = useState("All");

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
          <TabsTrigger
            value="daily"
            className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]"
          >
            <Flame className="w-4 h-4 mr-2" />
            Daily Challenge
          </TabsTrigger>
          <TabsTrigger
            value="tournament"
            className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]"
          >
            <Swords className="w-4 h-4 mr-2" />
            Tournament
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboards
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-[#5BB3B3] data-[state=active]:text-white data-[state=active]:shadow-lg px-6 rounded-lg text-[#A0B0BC]"
          >
            <Gift className="w-4 h-4 mr-2" />
            Rewards Shop
          </TabsTrigger>
        </TabsList>

        {/* Daily Challenge Tab */}
        <TabsContent value="daily" className="space-y-6">
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
                {/* Challenge Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#364A5E] rounded-xl p-4 text-center shadow-lg border border-[rgba(91,179,179,0.15)]">
                    <Target className="w-6 h-6 mx-auto text-[#5BB3B3] mb-2" />
                    <p className="text-2xl font-bold text-[#E8E0D5]">{dailyChallenge.questionsCount}</p>
                    <p className="text-xs text-[#A0B0BC]">Questions</p>
                  </div>
                  <div className="bg-[#364A5E] rounded-xl p-4 text-center shadow-lg border border-[rgba(91,179,179,0.15)]">
                    <Timer className="w-6 h-6 mx-auto text-[#4A9E9E] mb-2" />
                    <p className="text-2xl font-bold text-[#E8E0D5]">{dailyChallenge.timeLimit}</p>
                    <p className="text-xs text-[#A0B0BC]">Minutes</p>
                  </div>
                  <div className="bg-[#364A5E] rounded-xl p-4 text-center shadow-lg border border-[rgba(91,179,179,0.15)]">
                    <Zap className="w-6 h-6 mx-auto text-[#D97706] mb-2" />
                    <p className="text-2xl font-bold text-[#E8E0D5]">{dailyChallenge.reward.xp}</p>
                    <p className="text-xs text-[#A0B0BC]">XP Reward</p>
                  </div>
                  <div className="bg-[#364A5E] rounded-xl p-4 text-center shadow-lg border border-[rgba(91,179,179,0.15)]">
                    <Coins className="w-6 h-6 mx-auto text-[#7BA69E] mb-2" />
                    <p className="text-2xl font-bold text-[#E8E0D5]">{dailyChallenge.reward.coins}</p>
                    <p className="text-xs text-[#A0B0BC]">Coins</p>
                  </div>
                </div>

                {/* Difficulty & Participants */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-[#FEE2E2] text-[#DC2626] border-none font-medium">
                      {dailyChallenge.difficulty}
                    </Badge>
                    <Badge className="bg-[#F3E8FF] text-[#5BB3B3] border-none font-medium">
                      {dailyChallenge.subject}
                    </Badge>
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
                  <div
                    key={performer.rank}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:shadow-lg transition-all"
                  >
                    <span className="text-2xl">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                    </span>
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
                {[
                  { day: "Yesterday", title: "Pharmacology Sprint", score: "18/20", rank: 45 },
                  { day: "2 days ago", title: "Anatomy Quick Fire", score: "16/20", rank: 89 },
                  { day: "3 days ago", title: "Pathology Master", score: "19/20", rank: 23 },
                  { day: "4 days ago", title: "Surgery Challenge", score: "17/20", rank: 56 },
                ].map((challenge, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/30 hover:shadow-lg cursor-pointer transition-all"
                  >
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
        </TabsContent>

        {/* Tournament Tab */}
        <TabsContent value="tournament" className="space-y-6">
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
                  <p className="text-6xl font-bold text-[#5BB3B3]">
                    #{weeklyTournament.userProgress.rank}
                  </p>
                  <p className="text-[#A0B0BC] mt-2">Current Ranking</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <span className="text-[#A0B0BC]">Score</span>
                    <span className="font-semibold text-[#E8E0D5]">{weeklyTournament.userProgress.score.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <span className="text-[#A0B0BC]">MCQs Answered</span>
                    <span className="font-semibold text-[#E8E0D5]">{weeklyTournament.userProgress.questionsAnswered}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-[#F8FAFC] rounded-lg">
                    <span className="text-[#A0B0BC]">Accuracy</span>
                    <span className="font-semibold text-[#7BA69E]">{weeklyTournament.userProgress.accuracy}%</span>
                  </div>
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
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        phase.status === "active" ? "bg-[#5BB3B3] text-white" : "bg-[#E2E8F0]"
                      }`}
                    >
                      {phase.status === "active" ? (
                        <Flame className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5 text-[#94A3B8]" />
                      )}
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
                  <div
                    key={prize.rank}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:shadow-lg transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        idx === 0
                          ? "bg-gradient-to-br from-[#FDE68A] to-[#C9A86C]"
                          : idx === 1
                          ? "bg-gradient-to-br from-[#E2E8F0] to-[#94A3B8]"
                          : idx === 2
                          ? "bg-gradient-to-br from-[#FED7AA] to-[#EA580C]"
                          : "bg-gradient-to-br from-[#E9D5FF] to-[#5BB3B3]"
                      }`}
                    >
                      <prize.icon
                        className={`w-6 h-6 ${
                          idx === 0 || idx === 2
                            ? "text-white"
                            : idx === 1
                            ? "text-white"
                            : "text-white"
                        }`}
                      />
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
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          {/* Leaderboard Tabs */}
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

          {/* Leaderboard Table */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(91,179,179,0.15)] text-sm text-[#A0B0BC] bg-[#F8FAFC] font-medium">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Student</div>
                <div className="col-span-2 text-center hidden sm:block">MCQs</div>
                <div className="col-span-2 text-center hidden md:block">Accuracy</div>
                <div className="col-span-1 text-center hidden lg:block">Streak</div>
                <div className="col-span-2 text-right">XP</div>
              </div>

              {/* Table Rows */}
              <ScrollArea className="h-[500px]">
                {leaderboardData.allIndia.map((user) => (
                  <div
                    key={user.rank}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(91,179,179,0.15)] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="col-span-1 flex items-center">
                      {user.rank <= 3 ? (
                        <span className="text-xl">
                          {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
                        </span>
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
                        <Flame className="w-3 h-3 mr-1" />
                        {user.streak}
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
                    <Flame className="w-3 h-3 mr-1" />
                    {leaderboardData.userRank.streak}
                  </Badge>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end gap-2">
                  <span className="font-bold text-[#E8E0D5]">{leaderboardData.userRank.xp.toLocaleString()}</span>
                  <span className="text-[#7BA69E] text-xs font-medium">↑{leaderboardData.userRank.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Shop Tab */}
        <TabsContent value="rewards" className="space-y-6">
          {/* Coin Balance */}
          <Card className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#F3E8FF] border-[#FDE68A]/50 shadow-xl">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#364A5E] shadow-lg flex items-center justify-center border border-[#FDE68A]">
                  <Coins className="w-8 h-8 text-[#D97706]" />
                </div>
                <div>
                  <p className="text-sm text-[#A0B0BC]">Your Balance</p>
                  <p className="text-4xl font-bold text-[#E8E0D5]">{userCoins.toLocaleString()} <span className="text-lg text-[#D97706]">Coins</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-[#D97706] text-[#D97706] hover:bg-[#FFFBEB]">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Earn More
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {rewardCategories.map((cat) => (
              <Button
                key={cat}
                variant={rewardCategory === cat ? "default" : "outline"}
                className={
                  rewardCategory === cat
                    ? "bg-[#5BB3B3] hover:bg-[#4A9E9E] shadow-lg"
                    : "border-[rgba(91,179,179,0.15)] hover:bg-[#F8FAFC] text-[#A0B0BC]"
                }
                onClick={() => setRewardCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewardsShop
              .filter((r) => rewardCategory === "All" || r.category === rewardCategory)
              .map((reward) => (
                <Card
                  key={reward.id}
                  className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] hover:border-[#5BB3B3]/30 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {reward.popular && (
                      <Badge className="absolute top-3 right-3 bg-[#DC2626] text-white text-xs shadow-lg">
                        Popular
                      </Badge>
                    )}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${reward.color}20, ${reward.color}40)` }}
                    >
                      <reward.icon className="w-8 h-8" style={{ color: reward.color }} />
                    </div>
                    <h3 className="font-bold text-[#E8E0D5] mb-1">{reward.name}</h3>
                    <p className="text-sm text-[#A0B0BC] mb-4">{reward.description}</p>
                    <Button
                      className={`w-full shadow-lg ${
                        userCoins >= reward.price
                          ? "bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#5B21B6]"
                          : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                      }`}
                      disabled={userCoins < reward.price}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {reward.price}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* How to Earn */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] shadow-lg">
            <CardHeader className="border-b border-[rgba(91,179,179,0.15)]">
              <CardTitle className="text-[#E8E0D5]">How to Earn Coins</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { action: "Complete Daily Challenge", coins: 100, icon: Flame, color: "#DC2626" },
                  { action: "Win Tournament Match", coins: 50, icon: Trophy, color: "#D97706" },
                  { action: "7-Day Streak", coins: 200, icon: Calendar, color: "#5BB3B3" },
                  { action: "Answer in Q&A", coins: 10, icon: Star, color: "#7BA69E" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[rgba(91,179,179,0.15)] hover:shadow-lg transition-all"
                  >
                    <div 
                      className="w-10 h-10 rounded-xl shadow-md flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}30)` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#E8E0D5]">{item.action}</p>
                      <p className="text-[#D97706] text-sm font-semibold">+{item.coins} coins</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
