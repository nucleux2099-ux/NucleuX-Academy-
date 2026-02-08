"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonStats, SkeletonCard } from "@/components/Skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BookOpen,
  Clock,
  Target,
  Flame,
  TrendingUp,
  Play,
  CheckCircle,
  ArrowRight,
  Calendar,
  Brain,
  AlertCircle,
  BookMarked,
  Activity,
  Atom,
  MessageSquare,
  Network,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ATOMStudyCoach } from "@/components/ATOMStudyCoach";
import { TodaysStudyPlan } from "@/components/TodaysStudyPlan";
import { ContinueWhereYouLeft } from "@/components/ContinueWhereYouLeft";
import { LearningAnalytics } from "@/components/LearningAnalytics";
import { useStreak, useStudyPlan, useAnalytics, useStudySessions } from "@/lib/api/hooks";

// Dashboard room color - Purple
const roomColor = '#7C3AED';

// Get current greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Burning the midnight oil";
}

// Human-readable time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const weeklyData = [
  { day: "Mon", hours: 2.5, questions: 45 },
  { day: "Tue", hours: 3.2, questions: 62 },
  { day: "Wed", hours: 1.8, questions: 38 },
  { day: "Thu", hours: 4.1, questions: 78 },
  { day: "Fri", hours: 2.9, questions: 55 },
  { day: "Sat", hours: 5.2, questions: 95 },
  { day: "Sun", hours: 4.8, questions: 82 },
];

const monthlyData = [
  { week: "Week 1", hours: 18, questions: 320 },
  { week: "Week 2", hours: 22, questions: 445 },
  { week: "Week 3", hours: 19, questions: 380 },
  { week: "Week 4", hours: 26, questions: 512 },
];

const weeklyStats = [
  { title: "Study Hours", value: "24.5", unit: "hrs", change: "+12%", icon: Clock, color: "#7C3AED" },
  { title: "Topics Completed", value: "48", unit: "", change: "+8", icon: CheckCircle, color: "#059669" },
  { title: "Current Streak", value: "12", unit: "days", change: "Personal best!", icon: Flame, color: "#F59E0B" },
  { title: "MCQ Accuracy", value: "78", unit: "%", change: "+5%", icon: Target, color: "#06B6D4" },
];

const monthlyStats = [
  { title: "Study Hours", value: "85", unit: "hrs", change: "+18%", icon: Clock, color: "#7C3AED" },
  { title: "Topics Completed", value: "156", unit: "", change: "+24", icon: CheckCircle, color: "#059669" },
  { title: "Current Streak", value: "12", unit: "days", change: "Personal best!", icon: Flame, color: "#F59E0B" },
  { title: "MCQ Accuracy", value: "82", unit: "%", change: "+9%", icon: Target, color: "#06B6D4" },
];

const recentActivity = [
  { title: "Scored 85% on Appendicitis MCQs", type: "Assessment", time: "2 hours ago", icon: Target, color: "#059669", detail: "23/27 correct • 18 min" },
  { title: "Completed: Inguinal Hernia - Anatomy & Classification", type: "Reading", time: "4 hours ago", icon: BookOpen, color: "#7C3AED", detail: "Bailey & Love Ch. 57" },
  { title: "Started: Hepatobiliary Surgery Module", type: "Pathway", time: "Yesterday", icon: Play, color: "#06B6D4", detail: "12 topics • ~8 hours" },
  { title: "Reviewed: Portal Hypertension - Weak Area", type: "Revision", time: "2 days ago", icon: TrendingUp, color: "#F59E0B", detail: "Flagged by ATOM for review" },
];

const currentPathway = {
  title: "Surgical GI Mastery",
  progress: 65,
  currentTopic: "Hepatobiliary Surgery",
  nextTopic: "Pancreatic Surgery",
  totalTopics: 24,
  completedTopics: 16,
};

const todaysPlan = [
  { title: "Complete: Femoral Hernia", duration: "45 min", type: "reading", source: "Bailey & Love Ch. 58", status: "current", icon: BookOpen },
  { title: "MCQ Practice: Abdominal Wall Hernias", duration: "30 min", type: "mcq", count: "25 questions", status: "upcoming", icon: Target },
  { title: "Review: Inguinal Canal Anatomy", duration: "20 min", type: "revision", source: "Gray's Anatomy", status: "upcoming", icon: BookMarked },
  { title: "Quick Quiz: Hernia Complications", duration: "15 min", type: "quiz", count: "10 questions", status: "upcoming", icon: Brain },
];

const atomSuggestion = {
  title: "ATOM's Recommendation",
  message: "Based on your performance, you're struggling with Portal Hypertension complications. I recommend spending 30 minutes reviewing Variceal Bleeding management before your next Surgery session.",
  topics: ["Variceal Bleeding", "Child-Pugh Score", "TIPS Procedure"],
  confidence: 94,
};

const weakAreas = [
  { topic: "Portal Hypertension", accuracy: 52, attempts: 15 },
  { topic: "Thyroid Carcinoma Staging", accuracy: 58, attempts: 12 },
  { topic: "Pancreatic Pseudocyst", accuracy: 61, attempts: 8 },
];

// Knowledge Graph data
const graphNodes = [
  { id: 1, name: "Hepatobiliary", connections: 12, mastery: 78, status: "current" },
  { id: 2, name: "Pancreatic Surgery", connections: 8, mastery: 45, status: "upcoming" },
  { id: 3, name: "Portal Hypertension", connections: 15, mastery: 52, status: "weak" },
  { id: 4, name: "Hernia Surgery", connections: 10, mastery: 85, status: "strong" },
  { id: 5, name: "Appendicitis", connections: 6, mastery: 90, status: "strong" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("weekly");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [chartMounted, setChartMounted] = useState(false);
  
  // ============================================
  // REAL DATA HOOKS - Replacing mock data
  // ============================================
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: studyPlan, isLoading: planLoading } = useStudyPlan();
  const { data: weeklyAnalytics, isLoading: weeklyLoading } = useAnalytics(7);
  const { data: monthlyAnalytics, isLoading: monthlyLoading } = useAnalytics(30);
  const { data: sessionsData, isLoading: sessionsLoading } = useStudySessions(5);

  // Combine loading states
  const isLoading = streakLoading || planLoading || (timePeriod === "weekly" ? weeklyLoading : monthlyLoading);
  
  // Get user's first name for greeting (Supabase stores name in user_metadata)
  const userName = user?.user_metadata?.full_name?.split(' ')[0] 
    || user?.email?.split('@')[0] 
    || 'Student';

  // ============================================
  // COMPUTED STATS FROM REAL DATA
  // ============================================
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;

  // Build stats from analytics data
  const analytics = timePeriod === "weekly" ? weeklyAnalytics : monthlyAnalytics;
  
  const stats = useMemo(() => {
    if (!analytics) return [];
    
    const studyHours = Math.round((analytics.totalStudyMinutes / 60) * 10) / 10;
    const accuracy = analytics.totalQuestions > 0 
      ? Math.round((analytics.correctAnswers / analytics.totalQuestions) * 100)
      : 0;

    return [
      { 
        title: "Study Hours", 
        value: studyHours.toString(), 
        unit: "hrs", 
        change: "+12%", // TODO: compute from historical data
        icon: Clock, 
        color: "#7C3AED" 
      },
      { 
        title: "Topics Completed", 
        value: analytics.topicsCompleted.toString(), 
        unit: "", 
        change: `+${analytics.topicsCompleted}`, 
        icon: CheckCircle, 
        color: "#059669" 
      },
      { 
        title: "Current Streak", 
        value: currentStreak.toString(), 
        unit: "days", 
        change: currentStreak >= longestStreak ? "Personal best!" : `Best: ${longestStreak}`, 
        icon: Flame, 
        color: "#F59E0B" 
      },
      { 
        title: "MCQ Accuracy", 
        value: accuracy.toString(), 
        unit: "%", 
        change: `${analytics.totalQuestions} attempted`, 
        icon: Target, 
        color: "#06B6D4" 
      },
    ];
  }, [analytics, currentStreak, longestStreak]);

  // Build chart data from analytics
  const chartData = useMemo(() => {
    if (!analytics?.dailyStats?.length) {
      // Fallback to mock data if no real data
      return timePeriod === "weekly" ? weeklyData : monthlyData;
    }
    return analytics.dailyStats.map((day: any) => ({
      day: day.date ? new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }) : day.day,
      hours: Math.round((day.study_minutes || 0) / 60 * 10) / 10,
      questions: day.mcqs_attempted || 0,
    }));
  }, [analytics, timePeriod]);

  const xKey = timePeriod === "weekly" ? "day" : "week";

  // Build recent activity from sessions
  const recentActivityFromSessions = useMemo(() => {
    if (!sessionsData?.sessions?.length) return recentActivity; // fallback to mock
    
    return sessionsData.sessions.slice(0, 4).map((session) => {
      const accuracy = session.mcqs_attempted > 0 
        ? Math.round((session.mcqs_correct / session.mcqs_attempted) * 100)
        : 0;
      const timeAgo = getTimeAgo(new Date(session.started_at));
      
      return {
        title: session.mcqs_attempted > 0 
          ? `Scored ${accuracy}% on MCQs` 
          : `Study session: ${session.atoms_studied?.[0] || 'General'}`,
        type: session.mcqs_attempted > 0 ? "Assessment" : "Study",
        time: timeAgo,
        icon: session.mcqs_attempted > 0 ? Target : BookOpen,
        color: session.mcqs_attempted > 0 ? "#059669" : "#7C3AED",
        detail: session.mcqs_attempted > 0 
          ? `${session.mcqs_correct}/${session.mcqs_attempted} correct • ${session.duration_minutes || 0} min`
          : `${session.duration_minutes || 0} min session`,
      };
    });
  }, [sessionsData]);

  // Current pathway from study plan
  const currentPathwayData = useMemo(() => {
    if (!studyPlan?.active_pathway) return currentPathway; // fallback to mock
    
    const pathway = studyPlan.active_pathway;
    return {
      title: pathway.title,
      progress: pathway.progress_percent,
      currentTopic: `Topic ${pathway.current_atom_index + 1}`,
      nextTopic: `Topic ${pathway.current_atom_index + 2}`,
      totalTopics: pathway.total_atoms,
      completedTopics: pathway.current_atom_index,
    };
  }, [studyPlan]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setChartMounted(true);
  }, []);

  const greeting = getGreeting();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB]">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-[#9CA3AF] mt-1">
            Ready to continue your <span className="text-[#7C3AED] font-medium">Surgery</span> pathway? 
            <span className="text-[#6B7280]"> • {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streakLoading ? (
            <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)] px-3 py-1.5 animate-pulse">
              <Flame className="w-4 h-4 mr-1" />
              Loading...
            </Badge>
          ) : (
            <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)] px-3 py-1.5">
              <Flame className="w-4 h-4 mr-1" />
              {currentStreak} Day Streak {currentStreak > 0 ? '🔥' : ''}
            </Badge>
          )}
          <Badge className="bg-[rgba(5,150,105,0.15)] text-[#059669] border-[rgba(5,150,105,0.3)] px-3 py-1.5">
            <Activity className="w-4 h-4 mr-1" />
            NEET-PG 2026
          </Badge>
        </div>
      </div>

      {/* Dashboard Tabs - Overview & Graph */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#0F2233] border border-[rgba(6,182,212,0.15)] p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#9CA3AF]"
          >
            <Zap className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="graph" 
            className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-[#9CA3AF]"
          >
            <Network className="w-4 h-4 mr-2" />
            Knowledge Graph
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* ATOM Study Coach - Enhanced with Carousel, Coins, Time-Aware */}
          <ATOMStudyCoach />

          {/* Today's Study Plan - Learning Science Based */}
          <TodaysStudyPlan />

          {/* Two-column layout: Continue + Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Continue Where You Left - Context Restoration */}
            <ContinueWhereYouLeft />

            {/* Learning Analytics - Not Vanity Metrics */}
            <LearningAnalytics />
          </div>

          {/* Time Period Toggle */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
            <div className="inline-flex bg-[#0F2233] border border-[rgba(6,182,212,0.15)] rounded-lg p-1">
              <button
                onClick={() => setTimePeriod("weekly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timePeriod === "weekly"
                    ? "bg-[#7C3AED] text-white shadow-md"
                    : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#142538]"
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimePeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timePeriod === "monthly"
                    ? "bg-[#7C3AED] text-white shadow-md"
                    : "text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#142538]"
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonStats key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card 
                  key={stat.title} 
                  className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] hover:border-[rgba(6,182,212,0.3)] transition-all room-transition"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-[#9CA3AF]">{stat.title}</p>
                        <p className="text-3xl font-bold text-[#E5E7EB] mt-2">
                          {stat.value}
                          <span className="text-lg text-[#6B7280] ml-1">{stat.unit}</span>
                        </p>
                        <p className="text-sm mt-1 font-medium" style={{ color: stat.color }}>
                          {stat.change}
                        </p>
                      </div>
                      <div
                        className="p-3 rounded-lg transition-transform hover:scale-110"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Progress Chart */}
          <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
                Study Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                      <XAxis dataKey={xKey} stroke="#9CA3AF" fontSize={12} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F2233', 
                          border: '1px solid rgba(6, 182, 212, 0.15)',
                          borderRadius: '8px',
                          color: '#E5E7EB'
                        }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                      <Area yAxisId="left" type="monotone" dataKey="hours" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" name="Study Hours" />
                      <Area yAxisId="right" type="monotone" dataKey="questions" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorQuestions)" name="MCQs Answered" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-pulse bg-[#142538] rounded-lg w-full h-full" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                  <span className="text-sm text-[#9CA3AF]">Study Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#06B6D4]" />
                  <span className="text-sm text-[#9CA3AF]">MCQs Answered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Current Pathway */}
            <Card className="lg:col-span-2 bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#E5E7EB]">
                  <span>Current Pathway</span>
                  {planLoading ? (
                    <Badge className="bg-[rgba(124,58,237,0.2)] text-[#A78BFA] border-none animate-pulse">Loading...</Badge>
                  ) : studyPlan?.active_pathway ? (
                    <Badge className="bg-[rgba(124,58,237,0.2)] text-[#A78BFA] border-none">In Progress</Badge>
                  ) : (
                    <Badge className="bg-[rgba(107,114,128,0.2)] text-[#9CA3AF] border-none">No Active Pathway</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {planLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-[#142538] rounded w-3/4" />
                    <div className="h-3 bg-[#142538] rounded w-full" />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="h-24 bg-[#142538] rounded-lg" />
                      <div className="h-24 bg-[#142538] rounded-lg" />
                    </div>
                  </div>
                ) : !studyPlan?.active_pathway ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                    <p className="text-[#9CA3AF] mb-4">No active learning pathway</p>
                    <Button 
                      onClick={() => router.push('/pathways')}
                      className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    >
                      Browse Pathways
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-[#A78BFA]">{currentPathwayData.title}</h3>
                        <span className="text-[#9CA3AF]">{currentPathwayData.completedTopics}/{currentPathwayData.totalTopics} topics</span>
                      </div>
                      <Progress value={currentPathwayData.progress} className="h-3" />
                      <p className="text-sm text-[#9CA3AF] mt-2">{currentPathwayData.progress}% complete</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)]">
                        <p className="text-sm text-[#9CA3AF] mb-1">Currently Reading</p>
                        <p className="font-medium text-[#E5E7EB]">{currentPathwayData.currentTopic}</p>
                        <p className="text-xs text-[#6B7280] mt-1">Blumgart&apos;s Surgery Ch. 12-18</p>
                      </div>
                      <div className="p-4 rounded-lg bg-[#142538] border border-[rgba(6,182,212,0.1)]">
                        <p className="text-sm text-[#9CA3AF] mb-1">Up Next</p>
                        <p className="font-medium text-[#E5E7EB]">{currentPathwayData.nextTopic}</p>
                        <p className="text-xs text-[#6B7280] mt-1">Maingot&apos;s Ch. 32-36</p>
                      </div>
                    </div>
                    <Button className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg font-medium transition-all shadow-lg shadow-[#7C3AED]/20 text-white">
                      Continue Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Weak Areas */}
            <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[#9CA3AF]">ATOM flagged these topics based on your MCQ performance:</p>
                {weakAreas.map((area, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] cursor-pointer hover:border-[rgba(245,158,11,0.4)] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-[#E5E7EB]">{area.topic}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        area.accuracy < 60 ? "bg-[rgba(239,68,68,0.2)] text-[#EF4444]" : "bg-[rgba(245,158,11,0.2)] text-[#F59E0B]"
                      }`}>
                        {area.accuracy}%
                      </span>
                    </div>
                    <Progress value={area.accuracy} className="h-1.5" />
                    <p className="text-xs text-[#6B7280] mt-1">{area.attempts} attempts</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-[rgba(245,158,11,0.3)] text-[#F59E0B] hover:bg-[rgba(245,158,11,0.1)]">
                  <Brain className="w-4 h-4 mr-2" />
                  Practice Weak Areas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
            <CardHeader>
              <CardTitle className="text-[#E5E7EB]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-[#142538]">
                      <div className="w-12 h-12 bg-[#0F2233] rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#0F2233] rounded w-3/4" />
                        <div className="h-3 bg-[#0F2233] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivityFromSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#9CA3AF]">No recent activity</p>
                  <p className="text-sm text-[#6B7280]">Start a study session to see your progress here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivityFromSessions.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-[#142538] border border-[rgba(6,182,212,0.1)] hover:border-[rgba(124,58,237,0.2)] transition-all cursor-pointer">
                      <div className="p-3 rounded-lg shrink-0" style={{ backgroundColor: `${activity.color}15` }}>
                        <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#E5E7EB] truncate">{activity.title}</p>
                        <p className="text-sm text-[#6B7280]">{activity.detail}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-[#9CA3AF]">{activity.time}</p>
                        <p className="text-xs text-[#6B7280]">{activity.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Graph Tab */}
        <TabsContent value="graph" className="space-y-6 mt-6">
          <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] border-l-4" style={{ borderLeftColor: roomColor }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <Network className="w-5 h-5 text-[#7C3AED]" />
                Your Knowledge Graph
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#9CA3AF] mb-6">Visual map of your learning progress and topic connections.</p>
              
              {/* Graph Visualization Placeholder */}
              <div className="h-[400px] rounded-xl bg-[#142538] border border-[rgba(6,182,212,0.1)] flex items-center justify-center mb-6">
                <div className="text-center">
                  <Network className="w-16 h-16 text-[#7C3AED] mx-auto mb-4 opacity-50" />
                  <p className="text-[#9CA3AF]">Interactive graph visualization</p>
                  <p className="text-xs text-[#6B7280]">Coming soon with D3.js integration</p>
                </div>
              </div>

              {/* Topic Nodes List */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {graphNodes.map((node) => (
                  <div 
                    key={node.id} 
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-105 ${
                      node.status === 'current' ? 'bg-[rgba(124,58,237,0.1)] border-[rgba(124,58,237,0.3)]' :
                      node.status === 'weak' ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]' :
                      node.status === 'strong' ? 'bg-[rgba(5,150,105,0.1)] border-[rgba(5,150,105,0.2)]' :
                      'bg-[#142538] border-[rgba(6,182,212,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-[#E5E7EB]">{node.name}</p>
                      <Badge className={`text-xs border-none ${
                        node.status === 'current' ? 'bg-[#7C3AED] text-white' :
                        node.status === 'weak' ? 'bg-[#EF4444] text-white' :
                        node.status === 'strong' ? 'bg-[#059669] text-white' :
                        'bg-[#0EA5E9] text-white'
                      }`}>
                        {node.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <span>{node.connections} connections</span>
                      <span>{node.mastery}% mastery</span>
                    </div>
                    <Progress value={node.mastery} className="h-1 mt-2" />
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
