"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
  Filter,
  ArrowLeft
} from "lucide-react";
import { SUBJECTS } from "@/lib/data/subjects";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { ESOPHAGUS_TOPICS } from "@/lib/data/topics/esophagus";
import { cn } from "@/lib/utils";
import type { ViewMode, LibraryTopic } from "@/lib/types/library";
import { VIEW_MODE_CONFIG } from "@/lib/types/library";

export default function SubspecialtyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const subjectSlug = params.subject as string;
  const subspecialtySlug = params.subspecialty as string;
  const initialMode = (searchParams.get('mode') as ViewMode) || 'explorer';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [showHighYieldOnly, setShowHighYieldOnly] = useState(false);

  // Get subject and subspecialty data
  const subject = SUBJECTS.find(s => s.slug === subjectSlug);
  const subspecialties = subject ? getSubspecialtiesBySubject(subject.id) : [];
  const subspecialty = subspecialties.find(s => s.slug === subspecialtySlug);

  // Get topics for this subspecialty
  // For now, only esophagus has real data
  const allTopics: LibraryTopic[] = useMemo(() => {
    if (subspecialtySlug === 'esophagus') {
      return ESOPHAGUS_TOPICS;
    }
    return [];
  }, [subspecialtySlug]);

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
    switch (viewMode) {
      case 'explorer':
        return topic.hasContent.concept;
      case 'examPrep':
        return topic.hasContent.examPrep;
      case 'textbook':
        return topic.hasContent.textbook;
      case 'quiz':
        return topic.hasContent.retrievalCards;
      case 'cases':
        return topic.hasContent.cases;
      case 'roadmap':
        return topic.hasContent.grindeMap;
      default:
        return topic.hasContent.concept;
    }
  };

  const viewModes: ViewMode[] = ['explorer', 'examPrep', 'textbook', 'quiz', 'cases', 'roadmap'];

  if (!subject || !subspecialty) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-[#E5E7EB]">Subspecialty not found</h2>
        <Link href="/library" className="text-[#06B6D4] hover:underline mt-4 block">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/library" className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors">
          Library
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <Link 
          href={`/library?subject=${subject.slug}`} 
          className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors"
        >
          {subject.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <span className="text-[#E5E7EB]">{subspecialty.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/library"
            className="p-2 rounded-lg bg-[#142538] hover:bg-[rgba(6,182,212,0.1)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#9CA3AF]" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{subspecialty.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">
                {subspecialty.name}
              </h1>
            </div>
            <p className="text-[#9CA3AF] mt-1">{subspecialty.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border-[rgba(6,182,212,0.3)]">
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
      <div className="bg-[#142538] rounded-xl p-4 border border-[rgba(6,182,212,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#E5E7EB]">View Mode</span>
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
                    ? "bg-[rgba(6,182,212,0.2)] border border-[#06B6D4]"
                    : "bg-[#0D1B2A] border border-transparent hover:bg-[rgba(6,182,212,0.1)]"
                )}
              >
                <span className="text-lg">{config.icon}</span>
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-[#06B6D4]" : "text-[#9CA3AF]"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#142538] border-[rgba(6,182,212,0.15)] focus:border-[#06B6D4] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHighYieldOnly(!showHighYieldOnly)}
          className={cn(
            "gap-2",
            showHighYieldOnly 
              ? "bg-[#F59E0B] text-[#0D1B2A] border-[#F59E0B] hover:bg-[#D97706]" 
              : "bg-[#142538] text-[#9CA3AF] border-[rgba(6,182,212,0.15)] hover:text-[#E5E7EB]"
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
          const difficultyColor = topic.difficulty <= 2 ? '#10B981' : topic.difficulty <= 3 ? '#F59E0B' : '#EF4444';
          
          return (
            <Link
              key={topic.id}
              href={`/library/${subjectSlug}/${subspecialtySlug}/${topic.slug}?mode=${viewMode}`}
            >
              <Card className={cn(
                "group bg-[#142538] border-[rgba(6,182,212,0.1)] hover:border-[rgba(6,182,212,0.3)] transition-all cursor-pointer",
                !hasContent && "opacity-60"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#06B6D4] transition-colors truncate">
                          {topic.name}
                        </h3>
                        {topic.highYield && (
                          <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)] text-xs shrink-0">
                            <Target className="w-3 h-3 mr-1" />
                            High Yield
                          </Badge>
                        )}
                      </div>
                      
                      {topic.description && (
                        <p className="text-sm text-[#9CA3AF] mb-3 line-clamp-1">
                          {topic.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{topic.estimatedMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: difficultyColor }}
                          />
                          <span>Difficulty {topic.difficulty}/5</span>
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
                        {topic.hasContent.concept && (
                          <div className="w-6 h-6 rounded bg-[#10B981]/20 flex items-center justify-center" title="Concept">
                            <span className="text-xs">📖</span>
                          </div>
                        )}
                        {topic.hasContent.examPrep && (
                          <div className="w-6 h-6 rounded bg-[#F59E0B]/20 flex items-center justify-center" title="Exam Prep">
                            <span className="text-xs">🎯</span>
                          </div>
                        )}
                        {topic.hasContent.retrievalCards && (
                          <div className="w-6 h-6 rounded bg-[#EC4899]/20 flex items-center justify-center" title="Quiz">
                            <span className="text-xs">🧪</span>
                          </div>
                        )}
                        {topic.hasContent.cases && (
                          <div className="w-6 h-6 rounded bg-[#06B6D4]/20 flex items-center justify-center" title="Cases">
                            <span className="text-xs">🏥</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#06B6D4] group-hover:translate-x-1 transition-all" />
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
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">
              {allTopics.length === 0 ? 'Coming Soon' : 'No topics found'}
            </h3>
            <p className="text-[#9CA3AF]">
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
