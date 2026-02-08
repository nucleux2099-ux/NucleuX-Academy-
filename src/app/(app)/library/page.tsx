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
  Clock,
  Target,
  Filter,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { SUBJECTS } from "@/lib/data/subjects";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepth, setSelectedDepth] = useState<'all' | 'mbbs' | 'pg' | 'superSpecialty'>('all');

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const depthFilters = [
    { id: 'all', label: 'All Levels', icon: BookOpen },
    { id: 'mbbs', label: 'MBBS', icon: GraduationCap },
    { id: 'pg', label: 'PG', icon: Target },
    { id: 'superSpecialty', label: 'Super Specialty', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">Library</h1>
          <p className="text-[#9CA3AF] mt-1">Browse subjects, topics, and concepts</p>
        </div>
        <Badge className="w-fit bg-[rgba(6,182,212,0.15)] text-[#06B6D4] border-[rgba(6,182,212,0.3)]">
          {SUBJECTS.reduce((acc, s) => acc + s.topicCount, 0)} Topics Available
        </Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#142538] border-[rgba(6,182,212,0.15)] focus:border-[#06B6D4] text-[#E5E7EB] placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Depth Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {depthFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedDepth === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedDepth(filter.id as typeof selectedDepth)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-[#06B6D4] text-[#0D1B2A]"
                    : "bg-[#142538] text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => (
          <Link key={subject.id} href={`/library/${subject.slug}`}>
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)] hover:border-[rgba(6,182,212,0.3)] transition-all cursor-pointer group h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    {subject.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#06B6D4] transition-colors">
                        {subject.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">
                      {subject.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                        <BookOpen className="w-3.5 h-3.5" />
                        {subject.topicCount} topics
                      </span>
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#142538] flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <h3 className="text-lg font-medium text-[#E5E7EB]">No subjects found</h3>
          <p className="text-[#9CA3AF] mt-1">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
