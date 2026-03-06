"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronRight,
  Clock,
  Target,
  Sparkles,
  CircleCheck,
  Circle,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode, LibraryTopic, Subspecialty } from "@/lib/types/library";
import { VIEW_MODE_CONFIG } from "@/lib/types/library";

interface SubspecialtyClientProps {
  subject: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  subspecialty: Subspecialty;
  topics: LibraryTopic[];
}

export default function SubspecialtyClient({
  subject,
  subspecialty,
  topics: allTopics
}: SubspecialtyClientProps) {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get('mode') as ViewMode) || 'explorer';

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [showHighYieldOnly, setShowHighYieldOnly] = useState(false);

  // Filter topics
  const filteredTopics = useMemo(() => {
    return allTopics.filter(topic => {
      const matchesSearch =
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (topic.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesHighYield = !showHighYieldOnly || topic.highYield;
      return matchesSearch && matchesHighYield;
    });
  }, [allTopics, searchQuery, showHighYieldOnly]);

  // Check what content is available for current view mode
  const getContentAvailability = (topic: LibraryTopic): boolean => {
    const hasContent = topic.hasContent ?? { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false };
    switch (viewMode) {
      case 'explorer':
        return hasContent.concept;
      case 'examPrep':
        return hasContent.examPrep;
      case 'textbook':
        return hasContent.textbook;
      case 'quiz':
        return hasContent.retrievalCards;
      case 'cases':
        return hasContent.cases;
      case 'roadmap':
        return hasContent.grindeMap;
      default:
        return hasContent.concept;
    }
  };

  const viewModes: ViewMode[] = ['explorer', 'examPrep', 'textbook', 'quiz', 'cases', 'roadmap'];

  return (
    <div className="ui-shell">
      <div className="ui-page space-y-5 md:space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/library" className="text-[#A0B0BC] transition-colors hover:text-[#5BB3B3]">
            Library
          </Link>
          <ChevronRight className="h-4 w-4 text-[#6B7280]" />
          <Link
            href={`/library/${subject.slug}`}
            className="text-[#A0B0BC] transition-colors hover:text-[#5BB3B3]"
          >
            {subject.name}
          </Link>
          <ChevronRight className="h-4 w-4 text-[#6B7280]" />
          <span className="text-[#E8E0D5]">{subspecialty.name}</span>
        </div>

        {/* Header */}
        <div className="ui-panel ui-reveal-up flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <div className="flex items-center gap-4">
              <Link
                href={`/library/${subject.slug}`}
                className="ui-subpanel ui-interactive rounded-lg p-2"
              >
                <ArrowLeft className="h-5 w-5 text-[#A0B0BC]" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{subspecialty.icon}</span>
                  <h1 className="text-2xl font-semibold text-[#E8E0D5] sm:text-3xl">
                    {subspecialty.name}
                  </h1>
                </div>
                <p className="mt-1 text-[#A0B0BC]">{subspecialty.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="border-[rgba(91,179,179,0.3)] bg-[rgba(91,179,179,0.15)] text-[#5BB3B3]">
              {filteredTopics.length} topics
            </Badge>
            <Badge className="border-[#C9A86C]/30 bg-[#C9A86C]/14 text-[#D8BE90]">
              {subject.icon} {subject.name}
            </Badge>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="ui-panel ui-reveal-up ui-reveal-delay-1 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-[#E8E0D5]">View Mode</span>
            <span className="text-xs text-[#6B7280]">{VIEW_MODE_CONFIG[viewMode].description}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {viewModes.map((mode) => {
              const config = VIEW_MODE_CONFIG[mode];
              const isActive = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "rounded-lg p-2 text-center transition-all",
                    isActive
                      ? "ui-pill-active border border-[rgba(91,179,179,0.32)]"
                      : "ui-pill border border-transparent hover:text-[#E8E0D5]"
                  )}
                >
                  <div className="text-lg">{config.icon}</div>
                  <div
                    className={cn(
                      "mt-1 text-xs font-medium",
                      isActive ? "text-[#E8E0D5]" : "text-[#A0B0BC]"
                    )}
                  >
                    {config.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="ui-reveal-up ui-reveal-delay-1 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0B0BC]" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-[rgba(91,179,179,0.16)] bg-[rgba(54,74,94,0.7)] pl-10 text-[#E8E0D5] placeholder:text-[#A0B0BC] focus:border-[#5BB3B3]"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHighYieldOnly(!showHighYieldOnly)}
            className={cn(
              "gap-2 rounded-xl border",
              showHighYieldOnly
                ? "border-[#C9A86C]/35 bg-[#C9A86C]/16 text-[#D8BE90] hover:bg-[#C9A86C]/24"
                : "border-[rgba(91,179,179,0.16)] bg-[rgba(54,74,94,0.7)] text-[#A0B0BC] hover:text-[#E8E0D5]"
            )}
          >
            <Target className="h-4 w-4" />
            High Yield Only
          </Button>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          {filteredTopics.map((topic) => {
            const hasContent = getContentAvailability(topic);
            const difficulty = topic.difficulty ?? 3;
            const difficultyColor = difficulty <= 2 ? '#7BA69E' : difficulty <= 3 ? '#C9A86C' : '#E57373';
            const topicHasContent = topic.hasContent ?? { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false };

            return (
              <Link
                key={topic.id}
                href={`/library/${subject.slug}/${subspecialty.slug}/${topic.slug}?mode=${viewMode}`}
              >
                <Card className={cn(
                  "ui-panel ui-interactive group cursor-pointer",
                  !hasContent && "opacity-60"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="truncate font-semibold text-[#E8E0D5] transition-colors group-hover:text-[#5BB3B3]">
                            {topic.name}
                          </h3>
                          {topic.highYield && (
                            <Badge className="shrink-0 border-[#C9A86C]/30 bg-[#C9A86C]/14 text-xs text-[#D8BE90]">
                              <Target className="mr-1 h-3 w-3" />
                              High Yield
                            </Badge>
                          )}
                        </div>

                        {topic.description && (
                          <p className="mb-3 line-clamp-1 text-sm text-[#A0B0BC]">
                            {topic.description}
                          </p>
                        )}

                        {topic.nmcCodes && topic.nmcCodes.length > 0 && (
                          <div className="mb-2 flex flex-wrap gap-1">
                            {topic.nmcCodes.slice(0, 3).map((nmc) => (
                              <span key={typeof nmc === 'string' ? nmc : nmc.code}
                                className="rounded border border-[rgba(91,179,179,0.15)] bg-[rgba(91,179,179,0.1)] px-1.5 py-0.5 text-[10px] text-[#5BB3B3]">
                                {typeof nmc === 'string' ? nmc : nmc.code}
                              </span>
                            ))}
                            {topic.nmcCodes.length > 3 && (
                              <span className="rounded bg-[#2D3E50] px-1.5 py-0.5 text-[10px] text-[#6B7280]">
                                +{topic.nmcCodes.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{topic.estimatedMinutes ?? 15} min</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: difficultyColor }}
                            />
                            <span>Difficulty {difficulty}/5</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {hasContent ? (
                              <CircleCheck className="h-3.5 w-3.5 text-[#7BA69E]" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                            <span>{hasContent ? 'Content available' : 'Coming soon'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {/* Content availability indicators */}
                        <div className="hidden items-center gap-1 sm:flex">
                          {topicHasContent.concept && (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#5BB3B3]/18" title="Concept">
                              <span className="text-xs">📖</span>
                            </div>
                          )}
                          {topicHasContent.examPrep && (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#C9A86C]/18" title="Exam Prep">
                              <span className="text-xs">🎯</span>
                            </div>
                          )}
                          {topicHasContent.retrievalCards && (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#7BA69E]/18" title="Quiz">
                              <span className="text-xs">🧪</span>
                            </div>
                          )}
                          {topicHasContent.cases && (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#5BB3B3]/18" title="Cases">
                              <span className="text-xs">🏥</span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#6B7280] transition-all group-hover:translate-x-1 group-hover:text-[#5BB3B3]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {filteredTopics.length === 0 && (
            <div className="py-12 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-[#6B7280]" />
              <h3 className="mb-2 text-lg font-medium text-[#E8E0D5]">
                {allTopics.length === 0 ? 'Coming Soon' : 'No topics found'}
              </h3>
              <p className="text-[#A0B0BC]">
                {allTopics.length === 0
                  ? 'Topics for this subspecialty are being added.'
                  : 'Try adjusting your search or filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
