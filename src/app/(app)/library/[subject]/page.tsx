"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  Clock,
  Target,
  GraduationCap,
  Sparkles,
  BookMarked,
  Filter,
  BarChart3,
  CheckCircle2,
  Circle
} from "lucide-react";
import { getSubjectBySlug, SUBJECTS } from "@/lib/data/subjects";
import { SURGERY_GI_TOPICS } from "@/lib/data/topics-surgery-gi";
import { cn } from "@/lib/utils";
import type { Topic, Depth } from "@/lib/types";

// Mock user progress
const userProgress: Record<string, { completed: boolean; mcqAccuracy?: number }> = {
  'surg-gi-appendicitis': { completed: true, mcqAccuracy: 85 },
  'surg-gi-cholelithiasis': { completed: true, mcqAccuracy: 72 },
  'surg-gi-portal-hypertension': { completed: false, mcqAccuracy: 45 },
};

export default function SubjectPage() {
  const params = useParams();
  const subjectSlug = params.subject as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepth, setSelectedDepth] = useState<'all' | Depth>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'progress'>('name');

  // Get subject data
  const subject = getSubjectBySlug(subjectSlug);
  
  // Get topics for this subject (for now, only surgery has data)
  const allTopics = subjectSlug === 'surgery' ? SURGERY_GI_TOPICS : [];

  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    let topics = allTopics.filter(topic => {
      // Search filter
      const matchesSearch = 
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Depth filter
      const matchesDepth = selectedDepth === 'all' || topic.depth[selectedDepth];
      
      return matchesSearch && matchesDepth;
    });

    // Sort
    switch (sortBy) {
      case 'difficulty':
        topics = topics.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case 'progress':
        topics = topics.sort((a, b) => {
          const aCompleted = userProgress[a.id]?.completed ? 1 : 0;
          const bCompleted = userProgress[b.id]?.completed ? 1 : 0;
          return bCompleted - aCompleted;
        });
        break;
      default:
        // Already sorted by order/name
        break;
    }

    return topics;
  }, [allTopics, searchQuery, selectedDepth, sortBy]);

  // Group topics by category (based on tags)
  const topicCategories = useMemo(() => {
    const categories: Record<string, Topic[]> = {
      'Esophagus': [],
      'Stomach': [],
      'Small Intestine': [],
      'Appendix': [],
      'Colon & Rectum': [],
      'Anorectal': [],
      'Hepatobiliary': [],
      'Pancreas': [],
      'Other': [],
    };

    filteredTopics.forEach(topic => {
      if (topic.tags.includes('esophagus')) categories['Esophagus'].push(topic);
      else if (topic.tags.includes('stomach')) categories['Stomach'].push(topic);
      else if (topic.tags.includes('small bowel')) categories['Small Intestine'].push(topic);
      else if (topic.tags.includes('appendix')) categories['Appendix'].push(topic);
      else if (topic.tags.includes('colon') || topic.tags.includes('rectum')) categories['Colon & Rectum'].push(topic);
      else if (topic.tags.includes('anorectal')) categories['Anorectal'].push(topic);
      else if (topic.tags.includes('liver') || topic.tags.includes('gallbladder')) categories['Hepatobiliary'].push(topic);
      else if (topic.tags.includes('pancreas')) categories['Pancreas'].push(topic);
      else categories['Other'].push(topic);
    });

    // Remove empty categories
    return Object.entries(categories).filter(([_, topics]) => topics.length > 0);
  }, [filteredTopics]);

  const depthFilters = [
    { id: 'all', label: 'All', color: '#9CA3AF' },
    { id: 'mbbs', label: 'MBBS', color: '#10B981' },
    { id: 'pg', label: 'PG', color: '#7C3AED' },
    { id: 'superSpecialty', label: 'SS', color: '#F59E0B' },
  ];

  if (!subject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#E5E7EB]">Subject not found</h2>
          <Link href="/library">
            <Button variant="link" className="text-[#06B6D4] mt-2">
              Back to Library
            </Button>
          </Link>
        </div>
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
        <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        <span className="text-[#E5E7EB] font-medium">{subject.name}</span>
      </div>

      {/* Subject Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ backgroundColor: `${subject.color}20` }}
        >
          {subject.icon}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">{subject.name}</h1>
          <p className="text-[#9CA3AF] mt-1">{subject.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge className="bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border-[rgba(6,182,212,0.3)]">
              {filteredTopics.length} Topics
            </Badge>
            <span className="text-sm text-[#9CA3AF]">
              {Object.values(userProgress).filter(p => p.completed).length} completed
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search topics or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#142538] border-[rgba(6,182,212,0.15)] focus:border-[#06B6D4] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Depth Filter */}
        <div className="flex gap-2">
          {depthFilters.map((filter) => {
            const isActive = selectedDepth === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedDepth(filter.id as typeof selectedDepth)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "text-[#0D1B2A]"
                    : "bg-[#142538] text-[#9CA3AF] hover:text-[#E5E7EB]"
                )}
                style={isActive ? { backgroundColor: filter.color } : undefined}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-lg text-sm bg-[#142538] border border-[rgba(6,182,212,0.15)] text-[#E5E7EB] cursor-pointer"
        >
          <option value="name">Sort by Name</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="progress">Sort by Progress</option>
        </select>
      </div>

      {/* Topics by Category */}
      {topicCategories.length > 0 ? (
        <div className="space-y-8">
          {topicCategories.map(([category, topics]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <h2 className="text-lg font-semibold text-[#E5E7EB]">{category}</h2>
                <Badge variant="outline" className="text-[#9CA3AF] border-[rgba(255,255,255,0.1)]">
                  {topics.length}
                </Badge>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => {
                  const progress = userProgress[topic.id];
                  const isCompleted = progress?.completed;
                  
                  return (
                    <Link key={topic.id} href={`/library/${subjectSlug}/${topic.slug}`}>
                      <Card className={cn(
                        "bg-[#0F2233] border-[rgba(255,255,255,0.06)] hover:border-[rgba(6,182,212,0.3)] transition-all cursor-pointer group h-full",
                        isCompleted && "border-l-2 border-l-[#10B981]"
                      )}>
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#E5E7EB] group-hover:text-[#06B6D4] transition-colors line-clamp-2">
                                {topic.name}
                              </h3>
                            </div>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#9CA3AF] shrink-0 opacity-50" />
                            )}
                          </div>

                          {/* Depth badges */}
                          <div className="flex gap-1.5 mt-2">
                            {topic.depth.mbbs && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[rgba(16,185,129,0.2)] text-[#10B981]">
                                MBBS
                              </span>
                            )}
                            {topic.depth.pg && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[rgba(124,58,237,0.2)] text-[#7C3AED]">
                                PG
                              </span>
                            )}
                            {topic.depth.superSpecialty && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-[rgba(245,158,11,0.2)] text-[#F59E0B]">
                                SS
                              </span>
                            )}
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-3 mt-3 text-xs text-[#9CA3AF]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {topic.estimatedMinutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              L{topic.difficulty}
                            </span>
                            {progress?.mcqAccuracy && (
                              <span className={cn(
                                "flex items-center gap-1",
                                progress.mcqAccuracy >= 70 ? "text-[#10B981]" : "text-[#F59E0B]"
                              )}>
                                <Target className="w-3 h-3" />
                                {progress.mcqAccuracy}%
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {topic.tags.slice(0, 3).map((tag) => (
                              <span 
                                key={tag}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-[rgba(255,255,255,0.05)] text-[#9CA3AF]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#142538] flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-lg font-medium text-[#E5E7EB]">
            {allTopics.length === 0 ? "Content coming soon" : "No topics found"}
          </h3>
          <p className="text-[#9CA3AF] mt-1">
            {allTopics.length === 0 
              ? "We're working on adding content for this subject"
              : "Try adjusting your filters"
            }
          </p>
        </div>
      )}
    </div>
  );
}
