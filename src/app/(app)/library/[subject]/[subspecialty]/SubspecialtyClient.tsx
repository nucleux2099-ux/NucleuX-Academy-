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
  BookOpen, 
  ChevronRight,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/library" className="text-[#A0B0BC] hover:text-[#5BB3B3] transition-colors">
          Library
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <Link 
          href={`/library/${subject.slug}`} 
          className="text-[#A0B0BC] hover:text-[#5BB3B3] transition-colors"
        >
          {subject.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <span className="text-[#E8E0D5]">{subspecialty.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/library/${subject.slug}`}
            className="p-2 rounded-lg bg-[#3A4D5F] hover:bg-[rgba(91,179,179,0.1)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#A0B0BC]" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{subspecialty.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5]">
                {subspecialty.name}
              </h1>
            </div>
            <p className="text-[#A0B0BC] mt-1">{subspecialty.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]">
            {filteredTopics.length} topics
          </Badge>
          <Badge 
            className="border"
            style={{ 
              backgroundColor: `${subject.color}20`,
              color: subject.color,
              borderColor: `${subject.color}40`
            }}
          >
            {subject.icon} {subject.name}
          </Badge>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="bg-[#3A4D5F] rounded-xl p-4 border border-[rgba(91,179,179,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#E8E0D5]">View Mode</span>
          <span className="text-xs text-[#6B7280]">{VIEW_MODE_CONFIG[viewMode].description}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {viewModes.map((mode) => {
            const config = VIEW_MODE_CONFIG[mode];
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all text-center",
                  isActive
                    ? "bg-[rgba(91,179,179,0.2)] border border-[#5BB3B3]"
                    : "bg-[#2D3E50] border border-transparent hover:bg-[rgba(91,179,179,0.1)]"
                )}
              >
                <span className="text-lg">{config.icon}</span>
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-[#5BB3B3]" : "text-[#A0B0BC]"
                )}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] focus:border-[#5BB3B3] text-[#E8E0D5] placeholder:text-[#A0B0BC]"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHighYieldOnly(!showHighYieldOnly)}
          className={cn(
            "gap-2",
            showHighYieldOnly 
              ? "bg-[#C9A86C] text-[#2D3E50] border-[#C9A86C] hover:bg-[#D97706]" 
              : "bg-[#3A4D5F] text-[#A0B0BC] border-[rgba(91,179,179,0.15)] hover:text-[#E8E0D5]"
          )}
        >
          <Target className="w-4 h-4" />
          High Yield Only
        </Button>
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const hasContent = getContentAvailability(topic);
          const difficulty = topic.difficulty ?? 3;
          const difficultyColor = difficulty <= 2 ? '#10B981' : difficulty <= 3 ? '#C9A86C' : '#E57373';
          const topicHasContent = topic.hasContent ?? { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false };
          
          return (
            <Link
              key={topic.id}
              href={`/library/${subject.slug}/${subspecialty.slug}/${topic.slug}?mode=${viewMode}`}
            >
              <Card className={cn(
                "group bg-[#3A4D5F] border-[rgba(91,179,179,0.1)] hover:border-[rgba(91,179,179,0.3)] transition-all cursor-pointer",
                !hasContent && "opacity-60"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors truncate">
                          {topic.name}
                        </h3>
                        {topic.highYield && (
                          <Badge className="bg-[rgba(245,158,11,0.15)] text-[#C9A86C] border-[rgba(245,158,11,0.3)] text-xs shrink-0">
                            <Target className="w-3 h-3 mr-1" />
                            High Yield
                          </Badge>
                        )}
                      </div>
                      
                      {topic.description && (
                        <p className="text-sm text-[#A0B0BC] mb-3 line-clamp-1">
                          {topic.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{topic.estimatedMinutes ?? 15} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: difficultyColor }}
                          />
                          <span>Difficulty {difficulty}/5</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasContent ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>{hasContent ? 'Content available' : 'Coming soon'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Content availability indicators */}
                      <div className="hidden sm:flex items-center gap-1">
                        {topicHasContent.concept && (
                          <div className="w-6 h-6 rounded bg-[#10B981]/20 flex items-center justify-center" title="Concept">
                            <span className="text-xs">📖</span>
                          </div>
                        )}
                        {topicHasContent.examPrep && (
                          <div className="w-6 h-6 rounded bg-[#C9A86C]/20 flex items-center justify-center" title="Exam Prep">
                            <span className="text-xs">🎯</span>
                          </div>
                        )}
                        {topicHasContent.retrievalCards && (
                          <div className="w-6 h-6 rounded bg-[#EC4899]/20 flex items-center justify-center" title="Quiz">
                            <span className="text-xs">🧪</span>
                          </div>
                        )}
                        {topicHasContent.cases && (
                          <div className="w-6 h-6 rounded bg-[#5BB3B3]/20 flex items-center justify-center" title="Cases">
                            <span className="text-xs">🏥</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#5BB3B3] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">
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
  );
}
