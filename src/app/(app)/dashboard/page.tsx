"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonStats, SkeletonActivity } from "@/components/Skeleton";
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
  Sparkles,
  AlertCircle,
  BookMarked,
  Stethoscope,
  Pill,
  Activity,
  Atom,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Dashboard room color - Purple
const roomColor = {
  primary: '#7C3AED',
  light: '#F5F3FF',
  name: 'purple'
};

// Get current greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Burning the midnight oil";
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
  {
    title: "Study Hours",
    value: "24.5",
    unit: "hrs",
    change: "+12%",
    icon: Clock,
    color: "#7C3AED",
  },
  {
    title: "Topics Completed",
    value: "48",
    unit: "",
    change: "+8",
    icon: CheckCircle,
    color: "#10B981",
  },
  {
    title: "Current Streak",
    value: "12",
    unit: "days",
    change: "Personal best!",
    icon: Flame,
    color: "#F59E0B",
  },
  {
    title: "MCQ Accuracy",
    value: "78",
    unit: "%",
    change: "+5%",
    icon: Target,
    color: "#06B6D4",
  },
];

const monthlyStats = [
  {
    title: "Study Hours",
    value: "85",
    unit: "hrs",
    change: "+18%",
    icon: Clock,
    color: "#7C3AED",
  },
  {
    title: "Topics Completed",
    value: "156",
    unit: "",
    change: "+24",
    icon: CheckCircle,
    color: "#10B981",
  },
  {
    title: "Current Streak",
    value: "12",
    unit: "days",
    change: "Personal best!",
    icon: Flame,
    color: "#F59E0B",
  },
  {
    title: "MCQ Accuracy",
    value: "82",
    unit: "%",
    change: "+9%",
    icon: Target,
    color: "#06B6D4",
  },
];

const recentActivity = [
  {
    title: "Scored 85% on Appendicitis MCQs",
    type: "Assessment",
    time: "2 hours ago",
    icon: Target,
    color: "#10B981",
    detail: "23/27 correct • 18 min",
  },
  {
    title: "Completed: Inguinal Hernia - Anatomy & Classification",
    type: "Reading",
    time: "4 hours ago",
    icon: BookOpen,
    color: "#7C3AED",
    detail: "Bailey & Love Ch. 57",
  },
  {
    title: "Started: Hepatobiliary Surgery Module",
    type: "Pathway",
    time: "Yesterday",
    icon: Play,
    color: "#06B6D4",
    detail: "12 topics • ~8 hours",
  },
  {
    title: "Reviewed: Portal Hypertension - Weak Area",
    type: "Revision",
    time: "2 days ago",
    icon: TrendingUp,
    color: "#F59E0B",
    detail: "Flagged by ATOM for review",
  },
];

const currentPathway = {
  title: "Surgical GI Mastery",
  progress: 65,
  currentTopic: "Hepatobiliary Surgery",
  nextTopic: "Pancreatic Surgery",
  totalTopics: 24,
  completedTopics: 16,
};

// Today's Study Plan - Real medical topics
const todaysPlan = [
  { 
    title: "Complete: Femoral Hernia", 
    duration: "45 min", 
    type: "reading",
    source: "Bailey & Love Ch. 58",
    status: "current",
    icon: BookOpen,
  },
  { 
    title: "MCQ Practice: Abdominal Wall Hernias", 
    duration: "30 min", 
    type: "mcq",
    count: "25 questions",
    status: "upcoming",
    icon: Target,
  },
  { 
    title: "Review: Inguinal Canal Anatomy", 
    duration: "20 min", 
    type: "revision",
    source: "Gray's Anatomy",
    status: "upcoming",
    icon: BookMarked,
  },
  { 
    title: "Quick Quiz: Hernia Complications", 
    duration: "15 min", 
    type: "quiz",
    count: "10 questions",
    status: "upcoming",
    icon: Brain,
  },
];

// ATOM AI Suggestion
const atomSuggestion = {
  title: "ATOM's Recommendation",
  message: "Based on your performance, you're struggling with Portal Hypertension complications. I recommend spending 30 minutes reviewing Variceal Bleeding management before your next Surgery session.",
  topics: ["Variceal Bleeding", "Child-Pugh Score", "TIPS Procedure"],
  confidence: 94,
};

// Recent Weak Areas
const weakAreas = [
  { topic: "Portal Hypertension", accuracy: 52, attempts: 15 },
  { topic: "Thyroid Carcinoma Staging", accuracy: 58, attempts: 12 },
  { topic: "Pancreatic Pseudocyst", accuracy: 61, attempts: 8 },
];

export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const stats = timePeriod === "weekly" ? weeklyStats : monthlyStats;
  const chartData = timePeriod === "weekly" ? weeklyData : monthlyData;
  const xKey = timePeriod === "weekly" ? "day" : "week";

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const greeting = getGreeting();

  return (
    <div className="space-y-6 max-w-7xl mx-auto page-transition">
      {/* Welcome Header - Personalized */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">
            {greeting}, Sarath! 👋
          </h1>
          <p className="text-[#64748B] mt-1">
            Ready to continue your <span className="text-[#7C3AED] font-medium">Surgery</span> pathway? 
            <span className="text-[#94A3B8]"> • {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] px-3 py-1.5 shadow-sm">
            <Flame className="w-4 h-4 mr-1" />
            12 Day Streak 🔥
          </Badge>
          <Badge className="bg-[#F0FDF4] text-[#059669] border-[#A7F3D0] px-3 py-1.5 shadow-sm">
            <Activity className="w-4 h-4 mr-1" />
            NEET-PG 2026
          </Badge>
        </div>
      </div>

      {/* ATOM Study Coach Card - Enhanced with room color */}
      <Card className="bg-gradient-to-r from-[#F5F3FF] via-white to-[#F0F9FF] border-[#E9D5FF] shadow-lg overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#06B6D4]/5 rounded-full blur-xl" />
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-lg shadow-[#7C3AED]/25 shrink-0">
                <Atom className="w-6 h-6 text-white" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-[#1E293B] flex items-center gap-2">
                  <span>📊</span> ATOM Study Coach
                </h3>
                <Badge className="bg-[#7C3AED]/10 text-[#7C3AED] border-none text-xs">
                  {atomSuggestion.confidence}% confident
                </Badge>
              </div>
              <p className="text-[#64748B] text-sm mb-3">{atomSuggestion.message}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {atomSuggestion.topics.map((topic) => (
                  <Badge key={topic} className="bg-white text-[#64748B] border-[#E2E8F0] text-xs cursor-pointer hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all">
                    {topic}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-xs h-8 shadow-md shadow-[#7C3AED]/20">
                  <Target className="w-3 h-3 mr-1" />
                  Start Review
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED]/5 text-xs h-8"
                  onClick={() => window.location.href = '/chat'}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Ask ATOM
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Study Plan */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-[#1E293B]">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
              Today's Study Plan
            </span>
            <span className="text-sm font-normal text-[#64748B]">~2 hours total</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysPlan.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                  item.status === "current"
                    ? "bg-gradient-to-r from-[#F5F3FF] to-white border-[#7C3AED]/30 shadow-sm"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#7C3AED]/20"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === "current" ? "bg-[#7C3AED] text-white" : "bg-white border border-[#E2E8F0]"
                }`}>
                  {item.status === "current" ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <item.icon className="w-4 h-4 text-[#64748B]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${item.status === "current" ? "text-[#7C3AED]" : "text-[#1E293B]"}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    {item.source || item.count}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#64748B] bg-white px-2 py-1 rounded-full border border-[#E2E8F0]">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {item.duration}
                  </span>
                  {item.status === "current" && (
                    <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] h-7 text-xs shadow-md">
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Period Toggle */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#64748B]" />
        <div className="inline-flex bg-white border border-[#E2E8F0] rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setTimePeriod("weekly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timePeriod === "weekly"
                ? "bg-[#7C3AED] text-white shadow-md"
                : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimePeriod("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timePeriod === "monthly"
                ? "bg-[#7C3AED] text-white shadow-md"
                : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
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
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="bg-white border-[#E2E8F0] shadow-sm hover:shadow-lg transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#64748B]">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#1E293B] mt-2">
                      {stat.value}
                      <span className="text-lg text-[#64748B] ml-1">{stat.unit}</span>
                    </p>
                    <p
                      className="text-sm mt-1 font-medium"
                      style={{ color: stat.color }}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg transition-transform hover:scale-110 shadow-sm"
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
      <Card className="bg-white border-[#E2E8F0] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1E293B]">
            <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
            Study Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey={xKey} 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: '#1E293B' }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="hours"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  name="Study Hours"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="questions"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorQuestions)"
                  name="MCQs Answered"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
              <span className="text-sm text-[#64748B]">Study Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#06B6D4]" />
              <span className="text-sm text-[#64748B]">MCQs Answered</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Pathway */}
        <Card className="lg:col-span-2 bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-[#1E293B]">
              <span>Current Pathway</span>
              <Badge className="bg-[#F5F3FF] text-[#7C3AED] border-[#E9D5FF]">
                In Progress
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gradient-purple">
                  {currentPathway.title}
                </h3>
                <span className="text-[#64748B]">
                  {currentPathway.completedTopics}/{currentPathway.totalTopics} topics
                </span>
              </div>
              <Progress value={currentPathway.progress} className="h-3" />
              <p className="text-sm text-[#64748B] mt-2">
                {currentPathway.progress}% complete
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#F5F3FF] border border-[#E9D5FF]">
                <p className="text-sm text-[#64748B] mb-1">Currently Reading</p>
                <p className="font-medium text-[#1E293B]">{currentPathway.currentTopic}</p>
                <p className="text-xs text-[#94A3B8] mt-1">Blumgart's Surgery Ch. 12-18</p>
              </div>
              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-sm text-[#64748B] mb-1">Up Next</p>
                <p className="font-medium text-[#1E293B]">{currentPathway.nextTopic}</p>
                <p className="text-xs text-[#94A3B8] mt-1">Maingot's Ch. 32-36</p>
              </div>
            </div>

            <Button className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg font-medium transition-all shadow-lg shadow-[#7C3AED]/20">
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Weak Areas (ATOM Flagged) */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1E293B]">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#64748B]">ATOM flagged these topics based on your MCQ performance:</p>
            {weakAreas.map((area, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-[#1E293B]">{area.topic}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    area.accuracy < 60 ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#D97706]"
                  }`}>
                    {area.accuracy}%
                  </span>
                </div>
                <Progress value={area.accuracy} className="h-1.5" />
                <p className="text-xs text-[#94A3B8] mt-1">{area.attempts} attempts</p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-[#FDE68A] text-[#D97706] hover:bg-[#FFFBEB]">
              <Brain className="w-4 h-4 mr-2" />
              Practice Weak Areas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1E293B]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonActivity key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div
                    className="p-3 rounded-lg shrink-0 transition-transform hover:scale-110 shadow-sm"
                    style={{ backgroundColor: `${activity.color}15` }}
                  >
                    <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E293B] truncate">{activity.title}</p>
                    <p className="text-sm text-[#94A3B8]">{activity.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-[#64748B]">{activity.time}</p>
                    <p className="text-xs text-[#94A3B8]">{activity.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
