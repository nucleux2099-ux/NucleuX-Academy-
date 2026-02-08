"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  History, Clock, BookOpen, Target, Brain, Video,
  Calendar, ChevronRight, Filter, TrendingUp, Flame,
  CheckCircle, XCircle, Play, FileText
} from "lucide-react";
import Link from "next/link";

interface StudySession {
  id: string;
  type: "reading" | "mcq" | "video" | "revision" | "arena";
  title: string;
  topic: string;
  source?: string;
  date: string;
  duration: string;
  progress?: number;
  score?: number;
  totalQuestions?: number;
  correct?: number;
}

const studySessions: StudySession[] = [
  {
    id: "1",
    type: "mcq",
    title: "Portal Hypertension MCQs",
    topic: "Hepatobiliary",
    source: "NEET-PG 2024",
    date: "Today, 10:30 PM",
    duration: "25 min",
    score: 85,
    totalQuestions: 20,
    correct: 17
  },
  {
    id: "2",
    type: "reading",
    title: "Acute Pancreatitis - Harrison's Ch. 340",
    topic: "GI Medicine",
    source: "Harrison's Principles",
    date: "Today, 8:15 PM",
    duration: "45 min",
    progress: 100
  },
  {
    id: "3",
    type: "video",
    title: "Esophageal Surgery Techniques",
    topic: "Surgery",
    source: "Dr. Rajesh Sharma",
    date: "Today, 6:00 PM",
    duration: "32 min",
    progress: 75
  },
  {
    id: "4",
    type: "arena",
    title: "Speed Round: Cardiology",
    topic: "Medicine",
    date: "Yesterday, 9:00 PM",
    duration: "15 min",
    score: 90,
    totalQuestions: 20,
    correct: 18
  },
  {
    id: "5",
    type: "revision",
    title: "Spaced Review - Thyroid Carcinoma",
    topic: "Surgery",
    date: "Yesterday, 4:30 PM",
    duration: "18 min",
    score: 78,
    totalQuestions: 10,
    correct: 8
  },
  {
    id: "6",
    type: "reading",
    title: "Gastric Adenocarcinoma - Maingot's Ch. 22",
    topic: "Surgery",
    source: "Maingot's Abdominal Operations",
    date: "Yesterday, 2:00 PM",
    duration: "55 min",
    progress: 100
  },
  {
    id: "7",
    type: "mcq",
    title: "Mixed GI Surgery Practice",
    topic: "Surgery",
    date: "2 days ago",
    duration: "40 min",
    score: 72,
    totalQuestions: 30,
    correct: 22
  },
  {
    id: "8",
    type: "video",
    title: "Laparoscopic Cholecystectomy",
    topic: "Surgery",
    source: "SAGES Manual",
    date: "2 days ago",
    duration: "28 min",
    progress: 100
  },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  reading: { icon: BookOpen, color: "#7BA69E", bg: "rgba(5,150,105,0.15)", label: "Reading" },
  mcq: { icon: Target, color: "#6BA8C9", bg: "rgba(14,165,233,0.15)", label: "MCQ Practice" },
  video: { icon: Video, color: "#E57373", bg: "rgba(239,68,68,0.15)", label: "Video" },
  revision: { icon: Brain, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", label: "Spaced Review" },
  arena: { icon: Flame, color: "#C9A86C", bg: "rgba(245,158,11,0.15)", label: "Arena" },
};

export default function HistoryPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredSessions = filter === "all" 
    ? studySessions 
    : studySessions.filter(s => s.type === filter);

  // Calculate stats
  const totalTime = studySessions.reduce((sum, s) => {
    const mins = parseInt(s.duration);
    return sum + mins;
  }, 0);
  const totalMCQs = studySessions
    .filter(s => s.totalQuestions)
    .reduce((sum, s) => sum + (s.totalQuestions || 0), 0);
  const avgAccuracy = Math.round(
    studySessions
      .filter(s => s.score)
      .reduce((sum, s, _, arr) => sum + (s.score || 0) / arr.length, 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
            <History className="w-8 h-8 text-[#5BB3B3]" />
            Study History
          </h1>
          <p className="text-[#A0B0BC] mt-1">Review your learning journey</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-[#5BB3B3] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E8E0D5]">{Math.round(totalTime / 60)}h {totalTime % 60}m</p>
            <p className="text-xs text-[#6B7280]">Total Study Time</p>
          </CardContent>
        </Card>
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-[#6BA8C9] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E8E0D5]">{totalMCQs}</p>
            <p className="text-xs text-[#6B7280]">MCQs Attempted</p>
          </CardContent>
        </Card>
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-[#7BA69E] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E8E0D5]">{avgAccuracy}%</p>
            <p className="text-xs text-[#6B7280]">Avg Accuracy</p>
          </CardContent>
        </Card>
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 text-[#C9A86C] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E8E0D5]">{studySessions.length}</p>
            <p className="text-xs text-[#6B7280]">Sessions This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" 
            ? "bg-[#5BB3B3] text-[#2D3E50]" 
            : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:bg-[#3A4D5F]"
          }
        >
          All
        </Button>
        {Object.entries(typeConfig).map(([type, config]) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
            className={filter === type 
              ? "bg-[#5BB3B3] text-[#2D3E50]" 
              : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:bg-[#3A4D5F]"
            }
          >
            <config.icon className="w-3 h-3 mr-1" style={{ color: filter === type ? undefined : config.color }} />
            {config.label}
          </Button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.map((session) => {
          const config = typeConfig[session.type];
          const Icon = config.icon;
          
          return (
            <Card 
              key={session.id}
              className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] hover:border-[rgba(91,179,179,0.3)] transition-all cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className="text-[10px]"
                            style={{ borderColor: `${config.color}50`, color: config.color }}
                          >
                            {config.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-[rgba(91,179,179,0.2)] text-[#6B7280]">
                            {session.topic}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-[#E8E0D5]">{session.title}</h3>
                        {session.source && (
                          <p className="text-xs text-[#6B7280] mt-0.5">{session.source}</p>
                        )}
                      </div>

                      {/* Time & Duration */}
                      <div className="text-right shrink-0">
                        <p className="text-xs text-[#6B7280]">{session.date}</p>
                        <p className="text-sm text-[#A0B0BC] flex items-center justify-end gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {session.duration}
                        </p>
                      </div>
                    </div>

                    {/* Progress or Score */}
                    <div className="mt-3">
                      {session.score !== undefined && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              session.score >= 80 ? 'bg-[rgba(5,150,105,0.15)]' : 
                              session.score >= 60 ? 'bg-[rgba(245,158,11,0.15)]' : 
                              'bg-[rgba(239,68,68,0.15)]'
                            }`}>
                              <span className={`text-sm font-bold ${
                                session.score >= 80 ? 'text-[#7BA69E]' : 
                                session.score >= 60 ? 'text-[#C9A86C]' : 
                                'text-[#E57373]'
                              }`}>{session.score}%</span>
                            </div>
                            <div className="text-xs text-[#6B7280]">
                              <span className="text-[#7BA69E]">{session.correct}</span>
                              <span className="mx-1">/</span>
                              <span>{session.totalQuestions}</span>
                              <span className="ml-1">correct</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="ml-auto text-[#5BB3B3] hover:bg-[rgba(91,179,179,0.1)]">
                            Review
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}
                      
                      {session.progress !== undefined && !session.score && (
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#6B7280]">Progress</span>
                              <span className={session.progress === 100 ? "text-[#7BA69E]" : "text-[#A0B0BC]"}>
                                {session.progress}%
                              </span>
                            </div>
                            <Progress value={session.progress} className="h-1.5" />
                          </div>
                          <Button size="sm" variant="ghost" className="text-[#5BB3B3] hover:bg-[rgba(91,179,179,0.1)]">
                            {session.progress === 100 ? "Review" : "Continue"}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline" className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:bg-[#3A4D5F]">
          Load More Sessions
        </Button>
      </div>
    </div>
  );
}
