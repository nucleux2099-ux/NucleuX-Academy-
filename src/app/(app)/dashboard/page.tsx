"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonStats, SkeletonActivity } from "@/components/Skeleton";
import { EmptyPathway } from "@/components/EmptyState";
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
} from "lucide-react";

const weeklyData = [
  { day: "Mon", hours: 2.5, questions: 15 },
  { day: "Tue", hours: 3.2, questions: 22 },
  { day: "Wed", hours: 1.8, questions: 12 },
  { day: "Thu", hours: 4.1, questions: 28 },
  { day: "Fri", hours: 2.9, questions: 20 },
  { day: "Sat", hours: 5.2, questions: 35 },
  { day: "Sun", hours: 4.8, questions: 30 },
];

const monthlyData = [
  { week: "Week 1", hours: 18, questions: 120 },
  { week: "Week 2", hours: 22, questions: 145 },
  { week: "Week 3", hours: 19, questions: 130 },
  { week: "Week 4", hours: 26, questions: 168 },
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
    title: "Completed: Gastric Physiology",
    type: "Reading",
    time: "2 hours ago",
    icon: BookOpen,
    color: "#7C3AED",
  },
  {
    title: "MCQ Test: GI Anatomy",
    type: "Assessment",
    time: "4 hours ago",
    score: "85%",
    icon: Target,
    color: "#10B981",
  },
  {
    title: "Started: Hepatobiliary System",
    type: "Reading",
    time: "Yesterday",
    icon: Play,
    color: "#06B6D4",
  },
  {
    title: "Reviewed: Pancreatic Disorders",
    type: "Revision",
    time: "2 days ago",
    icon: TrendingUp,
    color: "#F59E0B",
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

const upcomingTasks = [
  { title: "Complete MCQ set: Appendicitis", due: "Today", priority: "high" },
  { title: "Read: Colorectal Cancer Chapter", due: "Tomorrow", priority: "medium" },
  { title: "Review: Hernia Repair Techniques", due: "In 2 days", priority: "low" },
];

export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("weekly");
  const [isLoading, setIsLoading] = useState(true);

  const stats = timePeriod === "weekly" ? weeklyStats : monthlyStats;
  const chartData = timePeriod === "weekly" ? weeklyData : monthlyData;
  const xKey = timePeriod === "weekly" ? "day" : "week";

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Aditya 👋</h1>
          <p className="text-[#94A3B8] mt-1">
            You're making great progress! Keep up the momentum.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30 px-3 py-1">
            <Flame className="w-4 h-4 mr-1" />
            12 Day Streak
          </Badge>
        </div>
      </div>

      {/* Time Period Toggle */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#94A3B8]" />
        <div className="inline-flex bg-[#1E293B] border border-[#334155] rounded-lg p-1">
          <button
            onClick={() => setTimePeriod("weekly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timePeriod === "weekly"
                ? "bg-[#7C3AED] text-white"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimePeriod("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              timePeriod === "monthly"
                ? "bg-[#7C3AED] text-white"
                : "text-[#94A3B8] hover:text-white"
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
              className="bg-[#1E293B] border-[#334155] card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#94A3B8]">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">
                      {stat.value}
                      <span className="text-lg text-[#94A3B8] ml-1">{stat.unit}</span>
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: stat.color }}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg transition-transform hover:scale-110"
                    style={{ backgroundColor: `${stat.color}20` }}
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
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey={xKey} 
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                  }}
                  labelStyle={{ color: '#F8FAFC' }}
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
              <span className="text-sm text-[#94A3B8]">Study Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#06B6D4]" />
              <span className="text-sm text-[#94A3B8]">MCQs Answered</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Pathway */}
        <Card className="lg:col-span-2 bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Pathway</span>
              <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">
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
                <span className="text-[#94A3B8]">
                  {currentPathway.completedTopics}/{currentPathway.totalTopics} topics
                </span>
              </div>
              <Progress value={currentPathway.progress} className="h-3" />
              <p className="text-sm text-[#94A3B8] mt-2">
                {currentPathway.progress}% complete
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                <p className="text-sm text-[#94A3B8] mb-1">Currently Reading</p>
                <p className="font-medium">{currentPathway.currentTopic}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                <p className="text-sm text-[#94A3B8] mb-1">Up Next</p>
                <p className="font-medium">{currentPathway.nextTopic}</p>
              </div>
            </div>

            <Button className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg font-medium transition-all animate-pulse-subtle">
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#0F172A] border border-[#334155] flex items-start gap-3 hover:border-[#7C3AED]/30 transition-colors cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    task.priority === "high"
                      ? "bg-[#EF4444]"
                      : task.priority === "medium"
                      ? "bg-[#F59E0B]"
                      : "bg-[#10B981]"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{task.title}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">{task.due}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
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
                  className="flex items-center gap-4 p-4 rounded-lg bg-[#0F172A] border border-[#334155] hover:border-[#7C3AED]/30 transition-all cursor-pointer"
                >
                  <div
                    className="p-3 rounded-lg shrink-0 transition-transform hover:scale-110"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.title}</p>
                    <p className="text-sm text-[#94A3B8]">{activity.type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {activity.score && (
                      <p className="font-medium text-[#10B981]">{activity.score}</p>
                    )}
                    <p className="text-sm text-[#94A3B8]">{activity.time}</p>
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
