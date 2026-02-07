"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonStats } from "@/components/Skeleton";
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
import { ATOMStudyCoach } from "@/components/ATOMStudyCoach";
import { TodaysStudyPlan } from "@/components/TodaysStudyPlan";

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
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [chartMounted, setChartMounted] = useState(false);

  const stats = timePeriod === "weekly" ? weeklyStats : monthlyStats;
  const chartData = timePeriod === "weekly" ? weeklyData : monthlyData;
  const xKey = timePeriod === "weekly" ? "day" : "week";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
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
            {greeting}, Sarath! 👋
          </h1>
          <p className="text-[#9CA3AF] mt-1">
            Ready to continue your <span className="text-[#7C3AED] font-medium">Surgery</span> pathway? 
            <span className="text-[#6B7280]"> • {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)] px-3 py-1.5">
            <Flame className="w-4 h-4 mr-1" />
            12 Day Streak 🔥
          </Badge>
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
                  <Badge className="bg-[rgba(124,58,237,0.2)] text-[#A78BFA] border-none">In Progress</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#A78BFA]">{currentPathway.title}</h3>
                    <span className="text-[#9CA3AF]">{currentPathway.completedTopics}/{currentPathway.totalTopics} topics</span>
                  </div>
                  <Progress value={currentPathway.progress} className="h-3" />
                  <p className="text-sm text-[#9CA3AF] mt-2">{currentPathway.progress}% complete</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)]">
                    <p className="text-sm text-[#9CA3AF] mb-1">Currently Reading</p>
                    <p className="font-medium text-[#E5E7EB]">{currentPathway.currentTopic}</p>
                    <p className="text-xs text-[#6B7280] mt-1">Blumgart&apos;s Surgery Ch. 12-18</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#142538] border border-[rgba(6,182,212,0.1)]">
                    <p className="text-sm text-[#9CA3AF] mb-1">Up Next</p>
                    <p className="font-medium text-[#E5E7EB]">{currentPathway.nextTopic}</p>
                    <p className="text-xs text-[#6B7280] mt-1">Maingot&apos;s Ch. 32-36</p>
                  </div>
                </div>
                <Button className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg font-medium transition-all shadow-lg shadow-[#7C3AED]/20 text-white">
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
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
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
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
