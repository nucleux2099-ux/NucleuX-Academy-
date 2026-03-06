"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Atom,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  MessageSquare,
  RotateCcw,
  SkipForward,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchLearningTopicReadModels,
  type LearningTopicRow,
} from "@/lib/learning/topic-lifecycle";

interface TopicSuggestion {
  id: string;
  name: string;
  readTime: number;
  source?: string;
  href: string;
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

const DEFAULT_TIME_CONTEXT: TimeContext = {
  hasUpcomingEvent: false,
};

function stageToMode(stage: LearningTopicRow["stage"]) {
  if (stage === "prestudy") return "explorer";
  if (stage === "aim") return "textbook";
  if (stage === "shoot") return "cases";
  return "quiz";
}

function stageToReadTime(stage: LearningTopicRow["stage"]) {
  if (stage === "prestudy") return 15;
  if (stage === "aim") return 20;
  if (stage === "shoot") return 25;
  return 18;
}

function topicHref(topic: LearningTopicRow) {
  return `/library/${topic.subject}/${topic.subspecialty}/${topic.topic_slug}?mode=${stageToMode(topic.stage)}`;
}

function daysSince(iso: string) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return 0;
  return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
}

function humanDate(iso: string) {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return "Recently";
  return new Date(ts).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function getTypeIcon(type: Recommendation["type"]) {
  if (type === "weak_area") return <Target className="w-4 h-4" />;
  if (type === "pathway") return <TrendingUp className="w-4 h-4" />;
  return <RotateCcw className="w-4 h-4" />;
}

function getTypeColor(type: Recommendation["type"]) {
  if (type === "weak_area") return "text-red-400 bg-red-500/10 border-red-500/30";
  if (type === "pathway") return "text-purple-400 bg-purple-500/10 border-purple-500/30";
  return "text-amber-400 bg-amber-500/10 border-amber-500/30";
}

function getUrgencyColor(urgency?: "low" | "medium" | "high") {
  if (urgency === "high") return "border-l-red-500";
  if (urgency === "medium") return "border-l-amber-500";
  return "border-l-cyan-500";
}

function fallbackRecommendations(): Recommendation[] {
  return [
    {
      id: "bootstrap-pathway",
      type: "pathway",
      title: "Start Your Learning Pathway",
      message: "Open your first topic and begin with Prestudy to initialize ATOM's coaching signals.",
      confidence: 70,
      topics: [
        {
          id: "open-library",
          name: "Open Library",
          readTime: 10,
          source: "NucleuX",
          href: "/library",
        },
      ],
      coins: 20,
      xp: 2,
      urgency: "medium",
    },
  ];
}

export function ATOMStudyCoach() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    fallbackRecommendations()
  );
  const [timeContext] = useState<TimeContext>(DEFAULT_TIME_CONTEXT);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    let active = true;

    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const readModels = await fetchLearningTopicReadModels({ limit: 15 });
        const models = readModels.filter((entry) => entry.topic.status !== "archived");
        const topics = models.map((entry) => entry.topic);
        if (!topics.length) {
          if (active) setRecommendations(fallbackRecommendations());
          return;
        }

        const recs: Recommendation[] = [];

        const weakModel = models.find(
          (entry) =>
            entry.stageState.failedCheckpointCount > 0 ||
            entry.stageState.latestCheckpointForCurrentStage?.passed === false
        );

        if (weakModel) {
          const weakTopic = weakModel.topic;
          const failedCount =
            weakModel.stageState.failedCheckpointCount ||
            (weakModel.stageState.latestCheckpointForCurrentStage?.passed === false ? 1 : 0);
          const scoreSamples = Object.values(weakModel.stageState.latestCheckpointsByStage)
            .map((checkpoint) => checkpoint?.score)
            .filter((score): score is number => typeof score === "number");
          const avgScore = scoreSamples.length
            ? Math.round(scoreSamples.reduce((sum, score) => sum + score, 0) / scoreSamples.length)
            : 58;

          const related = models
            .filter((entry) => entry.topic.subject === weakTopic.subject)
            .slice(0, 3)
            .map((entry) => ({
              id: entry.topic.id,
              name: entry.topic.topic_title,
              readTime: stageToReadTime(entry.topic.stage),
              source: entry.topic.stage.toUpperCase(),
              href: topicHref(entry.topic),
            }));

          recs.push({
            id: `weak-${weakTopic.id}`,
            type: "weak_area",
            title: "Checkpoint Risk Detected",
            message: `Recent checkpoints show ${failedCount} unresolved gaps in ${weakTopic.topic_title}.`,
            confidence: 92,
            accuracy: avgScore,
            topics: related.length
              ? related
              : [
                  {
                    id: weakTopic.id,
                    name: weakTopic.topic_title,
                    readTime: stageToReadTime(weakTopic.stage),
                    source: weakTopic.stage.toUpperCase(),
                    href: topicHref(weakTopic),
                  },
                ],
            coins: 50,
            xp: 5,
            urgency: "high",
            lastReviewed: humanDate(weakTopic.updated_at),
          });
        }

        const activeModel = models.find(
          (entry) => entry.topic.status === "active" || entry.topic.status === "paused"
        );
        if (activeModel) {
          const activeTopic = activeModel.topic;
          const pathwayTopics = models
            .filter((entry) => entry.topic.status === "active" || entry.topic.status === "paused")
            .slice(0, 3)
            .map((entry) => ({
              id: entry.topic.id,
              name: entry.topic.topic_title,
              readTime: stageToReadTime(entry.topic.stage),
              source: entry.topic.stage.toUpperCase(),
              href: topicHref(entry.topic),
            }));

          recs.push({
            id: `pathway-${activeTopic.id}`,
            type: "pathway",
            title: "Continue Your Active Pathway",
            message: `${activeTopic.topic_title} is currently in ${activeTopic.stage.toUpperCase()} stage.`,
            confidence: 88,
            topics: pathwayTopics,
            coins: 35,
            xp: 4,
            urgency: "medium",
            lastReviewed: humanDate(activeTopic.updated_at),
          });
        }

        const reviewTopic = topics
          .filter((topic) => topic.status !== "archived")
          .sort((a, b) => daysSince(b.updated_at) - daysSince(a.updated_at))[0];

        if (reviewTopic && daysSince(reviewTopic.updated_at) >= 3) {
          recs.push({
            id: `review-${reviewTopic.id}`,
            type: "spaced_repetition",
            title: "Spaced Review Opportunity",
            message: `${reviewTopic.topic_title} hasn't been revised for ${daysSince(reviewTopic.updated_at)} days.`,
            confidence: 84,
            topics: [
              {
                id: reviewTopic.id,
                name: reviewTopic.topic_title,
                readTime: stageToReadTime(reviewTopic.stage),
                source: "Review",
                href: topicHref(reviewTopic),
              },
            ],
            coins: 28,
            xp: 3,
            urgency: "medium",
            lastReviewed: humanDate(reviewTopic.updated_at),
          });
        }

        const next = recs.length ? recs.slice(0, 3) : fallbackRecommendations();
        if (active) setRecommendations(next);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRecommendations();
    return () => {
      active = false;
    };
  }, []);

  const currentRec = recommendations[currentIndex] || recommendations[0];
  const totalTopicTime = useMemo(
    () => currentRec.topics.reduce((sum, topic) => sum + topic.readTime, 0),
    [currentRec]
  );
  const allThreeBonus = completedToday === 2 ? 200 : 0;

  const goToPrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? recommendations.length - 1 : prev - 1));
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, 300);
  }, [recommendations.length]);

  const goToNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1));
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimating(false);
    }, 300);
  }, [recommendations.length]);

  useEffect(() => {
    if (recommendations.length <= 1) return;
    const timer = setInterval(goToNext, 10000);
    return () => clearInterval(timer);
  }, [goToNext, recommendations.length]);

  const handleStartReview = () => {
    const href = currentRec.topics[0]?.href || "/library";
    router.push(href);
  };

  const handleAskWhy = () => {
    router.push(`/chat?context=learning-coach&id=${currentRec.id}`);
  };

  const handleSkip = () => {
    if (recommendations.length <= 1) return;
    goToNext();
  };

  return (
    <Card
      className={cn(
        "bg-[#364A5E] border-l-4 border-[rgba(91,179,179,0.15)] overflow-hidden relative",
        getUrgencyColor(currentRec.urgency)
      )}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#5BB3B3]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5BB3B3]/5 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
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
              <p className="text-xs text-[#A0B0BC]">
                {loading ? "Calibrating with your lifecycle data..." : "Recommendations from learning lifecycle"}
              </p>
            </div>
          </div>

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
                    idx === currentIndex ? "bg-[#5BB3B3] w-4" : "bg-[#374151] hover:bg-[#4B5563]"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {timeContext.hasUpcomingEvent && timeContext.minutesUntil && timeContext.minutesUntil <= 60 && (
          <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-[#5BB3B3]/10 to-[#5BB3B3]/10 border border-[rgba(91,179,179,0.2)]">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#E8E0D5]">
                <strong>{timeContext.eventName}</strong> in {timeContext.minutesUntil} min
              </span>
              <span className="text-[#A0B0BC]">-</span>
              <span className="text-[#A0B0BC]">
                Perfect time for a {timeContext.availableMinutes}-min review!
              </span>
            </div>
          </div>
        )}

        <div
          className={cn(
            "transition-all duration-300",
            isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
          )}
        >
          <p className="text-[#E8E0D5] mb-4 leading-relaxed">
            &quot;{currentRec.message}&quot;
          </p>

          {currentRec.type === "weak_area" && typeof currentRec.accuracy === "number" && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-[#A0B0BC] mb-1">
                <span>Checkpoint health score</span>
                <span className="text-red-400">{currentRec.accuracy}%</span>
              </div>
              <Progress value={currentRec.accuracy} className="h-1.5 bg-[#1F2937]" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            {currentRec.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => router.push(topic.href)}
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

          {currentRec.lastReviewed && (
            <p className="text-xs text-[#6B7280] mb-4">
              Last checkpoint: {currentRec.lastReviewed}
            </p>
          )}
        </div>

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
            disabled={recommendations.length <= 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#2D3E50]/80 text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#1F2937] transition-all opacity-0 group-hover:opacity-100"
          disabled={recommendations.length <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#2D3E50]/80 text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#1F2937] transition-all opacity-0 group-hover:opacity-100"
          disabled={recommendations.length <= 1}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </CardContent>
    </Card>
  );
}

export default ATOMStudyCoach;
