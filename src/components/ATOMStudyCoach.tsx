"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Atom,
  ChevronLeft,
  ChevronRight,
  Target,
  BookOpen,
  MessageSquare,
  SkipForward,
  Clock,
  Coins,
  Sparkles,
  Calendar,
  TrendingUp,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Types
interface TopicSuggestion {
  id: string;
  name: string;
  readTime: number; // minutes
  source?: string;
}

interface Recommendation {
  id: string;
  type: "weak_area" | "pathway" | "spaced_repetition";
  title: string;
  message: string;
  confidence: number;
  topics: TopicSuggestion[];
  coins: number;
  xp: number;
  urgency?: "low" | "medium" | "high";
  lastReviewed?: string;
  accuracy?: number;
}

interface TimeContext {
  hasUpcomingEvent: boolean;
  eventName?: string;
  eventTime?: string;
  minutesUntil?: number;
  availableMinutes?: number;
}

// Mock data - replace with real data from backend
const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "weak_area",
    title: "Weak Area Detected",
    message: "Your Portal Hypertension accuracy is 52%. Let's strengthen this together.",
    confidence: 94,
    accuracy: 52,
    topics: [
      { id: "t1", name: "Variceal Bleeding", readTime: 15, source: "Blumgart Ch. 12" },
      { id: "t2", name: "Child-Pugh Score", readTime: 10, source: "Harrison's" },
      { id: "t3", name: "TIPS Procedure", readTime: 20, source: "Maingot's Ch. 8" },
    ],
    coins: 50,
    xp: 5,
    urgency: "high",
    lastReviewed: "3 days ago",
  },
  {
    id: "2",
    type: "pathway",
    title: "Continue Your Pathway",
    message: "You're 65% through Surgical GI Mastery. Next up: Pancreatic Surgery.",
    confidence: 100,
    topics: [
      { id: "t4", name: "Pancreatic Anatomy", readTime: 12, source: "Gray's Anatomy" },
      { id: "t5", name: "Acute Pancreatitis", readTime: 18, source: "Bailey & Love" },
      { id: "t6", name: "Pancreatic Neoplasms", readTime: 25, source: "Blumgart Ch. 15" },
    ],
    coins: 40,
    xp: 4,
    urgency: "medium",
  },
  {
    id: "3",
    type: "spaced_repetition",
    title: "Review Due",
    message: "Inguinal Hernia is due for spaced review. Optimal retention window!",
    confidence: 87,
    topics: [
      { id: "t7", name: "Hernia Anatomy", readTime: 10, source: "Bailey Ch. 57" },
      { id: "t8", name: "Repair Techniques", readTime: 15, source: "Maingot's" },
    ],
    coins: 30,
    xp: 3,
    urgency: "medium",
    lastReviewed: "7 days ago",
  },
];

const mockTimeContext: TimeContext = {
  hasUpcomingEvent: true,
  eventName: "Surgery Posting",
  eventTime: "2:00 PM",
  minutesUntil: 45,
  availableMinutes: 40,
};

// Utility functions
function getTypeIcon(type: Recommendation["type"]) {
  switch (type) {
    case "weak_area":
      return <Target className="w-4 h-4" />;
    case "pathway":
      return <TrendingUp className="w-4 h-4" />;
    case "spaced_repetition":
      return <RotateCcw className="w-4 h-4" />;
  }
}

function getTypeColor(type: Recommendation["type"]) {
  switch (type) {
    case "weak_area":
      return "text-red-400 bg-red-500/10 border-red-500/30";
    case "pathway":
      return "text-purple-400 bg-purple-500/10 border-purple-500/30";
    case "spaced_repetition":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  }
}

function getUrgencyColor(urgency?: "low" | "medium" | "high") {
  switch (urgency) {
    case "high":
      return "border-l-red-500";
    case "medium":
      return "border-l-amber-500";
    default:
      return "border-l-cyan-500";
  }
}

export function ATOMStudyCoach() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalCoinsToday, setTotalCoinsToday] = useState(0);

  const recommendations = mockRecommendations;
  const timeContext = mockTimeContext;
  const currentRec = recommendations[currentIndex];

  const totalTopicTime = currentRec.topics.reduce((sum, t) => sum + t.readTime, 0);
  const allThreeBonus = completedToday === 2 ? 200 : 0; // Bonus if completing 3rd

  // Navigation
  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? recommendations.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    const timer = setInterval(goToNext, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleStartReview = () => {
    // In real app: track start, navigate to curated session
    router.push(`/library?topic=${currentRec.topics[0].id}`);
  };

  const handleAskWhy = () => {
    // Open ATOM chat with context
    router.push(`/chat?context=recommendation&id=${currentRec.id}`);
  };

  const handleSkip = () => {
    // Track skip for learning, move to next
    goToNext();
  };

  return (
    <Card className={cn(
      "bg-[#364A5E] border-l-4 border-[rgba(91,179,179,0.15)] overflow-hidden relative",
      getUrgencyColor(currentRec.urgency)
    )}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#5BB3B3]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5BB3B3]/5 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="p-5 relative">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* ATOM Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center shadow-lg shadow-[#5BB3B3]/25">
                <Atom className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-[#364A5E]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#E8E0D5]">ATOM Study Coach</h3>
                <Badge className={cn("text-xs border", getTypeColor(currentRec.type))}>
                  {getTypeIcon(currentRec.type)}
                  <span className="ml-1 capitalize">{currentRec.type.replace("_", " ")}</span>
                </Badge>
              </div>
              <p className="text-xs text-[#A0B0BC]">Always here to help you learn</p>
            </div>
          </div>

          {/* Carousel indicators + confidence */}
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)] text-xs">
              {currentRec.confidence}% confident
            </Badge>
            <div className="flex items-center gap-1.5">
              {recommendations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentIndex
                      ? "bg-[#5BB3B3] w-4"
                      : "bg-[#374151] hover:bg-[#4B5563]"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Time-Aware Banner (if applicable) */}
        {timeContext.hasUpcomingEvent && timeContext.minutesUntil && timeContext.minutesUntil <= 60 && (
          <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-[#5BB3B3]/10 to-[#5BB3B3]/10 border border-[rgba(91,179,179,0.2)]">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#E8E0D5]">
                <strong>{timeContext.eventName}</strong> in {timeContext.minutesUntil} min
              </span>
              <span className="text-[#A0B0BC]">—</span>
              <span className="text-[#A0B0BC]">
                Perfect time for a {timeContext.availableMinutes}-min review!
              </span>
            </div>
          </div>
        )}

        {/* Main Message */}
        <div className={cn(
          "transition-all duration-300",
          isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
        )}>
          <p className="text-[#E8E0D5] mb-4 leading-relaxed">
            "{currentRec.message}"
          </p>

          {/* Accuracy indicator for weak areas */}
          {currentRec.type === "weak_area" && currentRec.accuracy && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-[#A0B0BC] mb-1">
                <span>Current accuracy</span>
                <span className="text-red-400">{currentRec.accuracy}%</span>
              </div>
              <Progress value={currentRec.accuracy} className="h-1.5 bg-[#1F2937]" />
            </div>
          )}

          {/* Topic Cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {currentRec.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => router.push(`/library/${topic.id}`)}
                className="group p-3 rounded-lg bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] hover:border-[#5BB3B3]/50 hover:bg-[#1a3048] transition-all text-left"
              >
                <p className="text-sm font-medium text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors line-clamp-2">
                  {topic.name}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#A0B0BC]">
                  <Clock className="w-3 h-3" />
                  <span>{topic.readTime} min</span>
                </div>
                {topic.source && (
                  <p className="text-xs text-[#6B7280] mt-1 truncate">{topic.source}</p>
                )}
              </button>
            ))}
          </div>

          {/* Rewards Preview */}
          <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.1)]">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-[#E8E0D5]">+{currentRec.coins} coins</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-[#E8E0D5]">+{currentRec.xp} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-[#A0B0BC]">~{totalTopicTime} min</span>
            </div>
            {allThreeBonus > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">+{allThreeBonus} bonus!</span>
              </div>
            )}
          </div>

          {/* Daily Progress */}
          {completedToday > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-[#A0B0BC] mb-1">
                <span>Today's suggestions completed</span>
                <span>{completedToday}/3</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 h-1.5 rounded-full transition-all",
                      i < completedToday ? "bg-[#22C55E]" : "bg-[#1F2937]"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Last reviewed indicator */}
          {currentRec.lastReviewed && (
            <p className="text-xs text-[#6B7280] mb-4">
              Last reviewed: {currentRec.lastReviewed}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleStartReview}
            className="flex-1 bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50] font-medium shadow-lg shadow-[#5BB3B3]/20"
          >
            <Target className="w-4 h-4 mr-2" />
            Start {totalTopicTime}-min Review
          </Button>
          <Button
            onClick={handleAskWhy}
            variant="outline"
            className="border-[rgba(91,179,179,0.3)] text-[#5BB3B3] hover:bg-[rgba(91,179,179,0.1)]"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Ask Why
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="icon"
            className="text-[#6B7280] hover:text-[#A0B0BC] hover:bg-[#1F2937]"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#2D3E50]/80 text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#1F2937] transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#2D3E50]/80 text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#1F2937] transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </CardContent>
    </Card>
  );
}

export default ATOMStudyCoach;
