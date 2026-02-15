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
  Library,
  Compass,
  Stethoscope
} from "lucide-react";
import { SUBJECTS } from "@/lib/data/subjects";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { cn } from "@/lib/utils";
import { AtomLibrarian } from "@/components/AtomLibrarian";

type LevelFilter = "all" | "UG" | "PG" | "SS";

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total stats
  const totalTopics = SUBJECTS.reduce((acc, s) => acc + s.topicCount, 0);
  const totalSubspecs = SUBJECTS.reduce((acc, s) => acc + getSubspecialtiesBySubject(s.id).length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
            <Library className="w-8 h-8 text-[#5BB3B3]" />
            Library
          </h1>
          <p className="text-[#A0B0BC] mt-1">
            Browse {SUBJECTS.length} subjects across UG, PG, and Super-Specialty levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cbme"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(91,179,179,0.1)] border border-[rgba(91,179,179,0.2)] text-[#5BB3B3] text-xs font-medium hover:bg-[rgba(91,179,179,0.2)] transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            CBME Curriculum
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#3A4D5F] rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
          <div className="text-xl font-bold text-[#E8E0D5]">{SUBJECTS.length}</div>
          <div className="text-xs text-[#6B7280]">Subjects</div>
        </div>
        <div className="bg-[#3A4D5F] rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
          <div className="text-xl font-bold text-[#E8E0D5]">{totalSubspecs}</div>
          <div className="text-xs text-[#6B7280]">Subspecialties</div>
        </div>
        <div className="bg-[#3A4D5F] rounded-lg p-3 border border-[rgba(91,179,179,0.08)]">
          <div className="text-xl font-bold text-[#E8E0D5]">{totalTopics}</div>
          <div className="text-xs text-[#6B7280]">Topics</div>
        </div>
      </div>

      {/* Training Level Toggle */}
      <div className="bg-[#3A4D5F] rounded-xl p-4 border border-[rgba(91,179,179,0.1)]">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-[#5BB3B3]" />
          <span className="text-sm font-medium text-[#E8E0D5]">Training Level</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {([
            { key: "all" as LevelFilter, label: "All Levels", color: "bg-[#5BB3B3]", desc: "Complete library across all training stages" },
            { key: "UG" as LevelFilter, label: "🟢 UG (MBBS)", color: "bg-green-600", desc: "Undergraduate — Know & Know How (K/KH)" },
            { key: "PG" as LevelFilter, label: "🔵 PG (MD/MS)", color: "bg-blue-600", desc: "Postgraduate — Shows How (SH)" },
            { key: "SS" as LevelFilter, label: "🔴 SS (DM/MCh)", color: "bg-red-600", desc: "Super Specialty — Performs (P)" },
          ]).map((level) => (
            <button
              key={level.key}
              onClick={() => setLevelFilter(level.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                levelFilter === level.key
                  ? `${level.color} text-white`
                  : "bg-[#2D3E50] text-[#A0B0BC] hover:text-[#E8E0D5] border border-transparent hover:border-[rgba(91,179,179,0.15)]"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#6B7280] mt-2">
          {levelFilter === "all" && "Showing all subjects across UG, PG, and Super Specialty levels"}
          {levelFilter === "UG" && "Foundation subjects for MBBS — NMC competency domains K (Knows) and KH (Knows How)"}
          {levelFilter === "PG" && "Advanced subjects for MD/MS residents — NMC domain SH (Shows How)"}
          {levelFilter === "SS" && "Super-specialty subjects for DM/MCh — NMC domain P (Performs)"}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
        <Input
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#3A4D5F] border-[rgba(91,179,179,0.15)] focus:border-[#5BB3B3] text-[#E8E0D5] placeholder:text-[#A0B0BC]"
        />
      </div>

      {/* Subject Grid — each card links to /library/[subject] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => {
          const subspecs = getSubspecialtiesBySubject(subject.id);

          // Level filter logic — show subject if it has content at that level
          // For now all subjects show at all levels (we can refine with actual depth data later)
          // UG: all subjects, PG: clinical subjects, SS: surgical/medical subspecialties
          const ugSubjects = ["anatomy", "physiology", "biochemistry", "pathology", "pharmacology", "microbiology", "forensic-medicine", "community-medicine", "surgery", "medicine", "obgyn", "pediatrics", "orthopedics", "ent", "ophthalmology", "psychiatry", "dermatology", "anesthesia", "radiology", "preventive-medicine", "dentistry"];
          const pgSubjects = ["surgery", "medicine", "obgyn", "pediatrics", "orthopedics", "ent", "ophthalmology", "anatomy", "physiology", "biochemistry", "pathology", "pharmacology", "microbiology", "forensic-medicine", "community-medicine", "psychiatry", "dermatology", "anesthesia", "radiology"];
          const ssSubjects = ["surgery", "medicine", "pediatrics", "obgyn", "orthopedics"];

          if (levelFilter === "UG" && !ugSubjects.includes(subject.slug)) return null;
          if (levelFilter === "PG" && !pgSubjects.includes(subject.slug)) return null;
          if (levelFilter === "SS" && !ssSubjects.includes(subject.slug)) return null;

          return (
            <Link
              key={subject.id}
              href={`/library/${subject.slug}`}
            >
              <Card className="group bg-[#3A4D5F] border-[rgba(91,179,179,0.1)] hover:border-[rgba(91,179,179,0.3)] transition-all cursor-pointer overflow-hidden h-full">
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
                          <h3 className="font-semibold text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-[#6B7280]">
                            {subspecs.length} subspecialties
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#5BB3B3] group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#A0B0BC] mb-4 line-clamp-2">
                      {subject.description}
                    </p>

                    {/* Subspecialty Preview */}
                    <div className="flex flex-wrap gap-1">
                      {subspecs.slice(0, 3).map((sub) => (
                        <Badge 
                          key={sub.id}
                          variant="outline" 
                          className="text-xs bg-[#2D3E50] border-[rgba(91,179,179,0.2)] text-[#A0B0BC]"
                        >
                          {sub.icon} {sub.name}
                        </Badge>
                      ))}
                      {subspecs.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-[#2D3E50] border-[rgba(91,179,179,0.2)] text-[#6B7280]"
                        >
                          +{subspecs.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(91,179,179,0.1)]">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{subject.topicCount} topics</span>
                      </div>
                      {/* Level indicators */}
                      <div className="flex gap-1 ml-auto">
                        {ugSubjects.includes(subject.slug) && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded border bg-green-600/20 text-green-400 border-green-500/30 font-medium">UG</span>
                        )}
                        {pgSubjects.includes(subject.slug) && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded border bg-blue-600/20 text-blue-400 border-blue-500/30 font-medium">PG</span>
                        )}
                        {ssSubjects.includes(subject.slug) && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded border bg-red-600/20 text-red-400 border-red-500/30 font-medium">SS</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">No subjects found</h3>
          <p className="text-[#A0B0BC]">Try a different search term.</p>
        </div>
      )}

      {/* ATOM Librarian */}
      <AtomLibrarian />
    </div>
  );
}
