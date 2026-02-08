"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  GraduationCap,
  Target,
  Library,
  Compass
} from "lucide-react";
import { SUBJECTS } from "@/lib/data/subjects";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/types/library";
import { VIEW_MODE_CONFIG } from "@/lib/types/library";

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSubjectData = selectedSubject 
    ? SUBJECTS.find(s => s.id === selectedSubject) 
    : null;
  
  const subspecialties = selectedSubject 
    ? getSubspecialtiesBySubject(selectedSubject) 
    : [];

  const viewModes: ViewMode[] = ['explorer', 'examPrep', 'textbook', 'quiz', 'cases', 'roadmap'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <Library className="w-8 h-8 text-[#06B6D4]" />
            Library
          </h1>
          <p className="text-[#9CA3AF] mt-1">Browse subjects, topics, and concepts</p>
        </div>
        <Badge className="w-fit bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border-[rgba(6,182,212,0.3)]">
          {SUBJECTS.reduce((acc, s) => acc + s.topicCount, 0)} Topics Available
        </Badge>
      </div>

      {/* View Mode Selector */}
      <div className="bg-[#142538] rounded-xl p-4 border border-[rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#06B6D4]" />
          <span className="text-sm font-medium text-[#E5E7EB]">How do you want to explore?</span>
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
                  "flex flex-col items-center gap-1 p-3 rounded-lg transition-all text-center",
                  isActive
                    ? "bg-[rgba(6,182,212,0.2)] border border-[#06B6D4]"
                    : "bg-[#0D1B2A] border border-transparent hover:bg-[rgba(6,182,212,0.1)] hover:border-[rgba(6,182,212,0.2)]"
                )}
              >
                <span className="text-xl">{config.icon}</span>
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
        <p className="text-xs text-[#6B7280] mt-2 text-center">
          {VIEW_MODE_CONFIG[viewMode].description}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <Input
          placeholder="Search subjects or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#142538] border-[rgba(6,182,212,0.15)] focus:border-[#06B6D4] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
        />
      </div>

      {/* Subject Rooms Grid */}
      {!selectedSubject ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => {
            const subspecs = getSubspecialtiesBySubject(subject.id);
            return (
              <Card
                key={subject.id}
                className="group bg-[#142538] border-[rgba(6,182,212,0.1)] hover:border-[rgba(6,182,212,0.3)] transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedSubject(subject.id)}
              >
                <CardContent className="p-0">
                  {/* Color Banner */}
                  <div 
                    className="h-2"
                    style={{ backgroundColor: subject.color }}
                  />
                  
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{subject.icon}</span>
                        <div>
                          <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#06B6D4] transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-[#6B7280]">
                            {subspecs.length} subspecialties
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#06B6D4] group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-2">
                      {subject.description}
                    </p>

                    {/* Subspecialty Preview */}
                    <div className="flex flex-wrap gap-1">
                      {subspecs.slice(0, 3).map((sub) => (
                        <Badge 
                          key={sub.id}
                          variant="outline" 
                          className="text-xs bg-[#0D1B2A] border-[rgba(6,182,212,0.2)] text-[#9CA3AF]"
                        >
                          {sub.icon} {sub.name}
                        </Badge>
                      ))}
                      {subspecs.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-[#0D1B2A] border-[rgba(6,182,212,0.2)] text-[#6B7280]"
                        >
                          +{subspecs.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(6,182,212,0.1)]">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{subject.topicCount} topics</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Subspecialties View */
        <div className="space-y-4">
          {/* Back Button + Subject Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#06B6D4] transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-sm">All Subjects</span>
            </button>
          </div>

          {selectedSubjectData && (
            <div className="flex items-center gap-4 pb-4 border-b border-[rgba(6,182,212,0.1)]">
              <span className="text-4xl">{selectedSubjectData.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-[#E5E7EB]">{selectedSubjectData.name}</h2>
                <p className="text-sm text-[#9CA3AF]">{selectedSubjectData.description}</p>
              </div>
            </div>
          )}

          {/* Subspecialties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subspecialties.map((sub) => (
              <Link
                key={sub.id}
                href={`/library/${selectedSubject}/${sub.slug}?mode=${viewMode}`}
              >
                <Card className="group bg-[#142538] border-[rgba(6,182,212,0.1)] hover:border-[rgba(6,182,212,0.3)] transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sub.icon}</span>
                        <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#06B6D4] transition-colors">
                          {sub.name}
                        </h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#06B6D4] group-hover:translate-x-1 transition-all" />
                    </div>

                    <p className="text-sm text-[#9CA3AF] mb-4">
                      {sub.description}
                    </p>

                    <div className="flex items-center gap-4 pt-3 border-t border-[rgba(6,182,212,0.1)]">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{sub.topicCount} topics</span>
                      </div>
                      <Badge 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${VIEW_MODE_CONFIG[viewMode].color}20`,
                          color: VIEW_MODE_CONFIG[viewMode].color,
                          borderColor: `${VIEW_MODE_CONFIG[viewMode].color}40`
                        }}
                      >
                        {VIEW_MODE_CONFIG[viewMode].icon} {VIEW_MODE_CONFIG[viewMode].label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {subspecialties.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Coming Soon</h3>
              <p className="text-[#9CA3AF]">Subspecialties for this subject are being added.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
