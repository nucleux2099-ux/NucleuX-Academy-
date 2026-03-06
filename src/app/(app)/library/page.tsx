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
  const ugSubjects = [
    "anatomy",
    "physiology",
    "biochemistry",
    "pathology",
    "pharmacology",
    "microbiology",
    "forensic-medicine",
    "community-medicine",
    "surgery",
    "medicine",
    "obgyn",
    "pediatrics",
    "orthopedics",
    "ent",
    "ophthalmology",
    "psychiatry",
    "dermatology",
    "anesthesia",
    "radiology",
    "preventive-medicine",
    "dentistry",
  ];
  const pgSubjects = [
    "surgery",
    "medicine",
    "obgyn",
    "pediatrics",
    "orthopedics",
    "ent",
    "ophthalmology",
    "anatomy",
    "physiology",
    "biochemistry",
    "pathology",
    "pharmacology",
    "microbiology",
    "forensic-medicine",
    "community-medicine",
    "psychiatry",
    "dermatology",
    "anesthesia",
    "radiology",
  ];
  const ssSubjects = ["surgery", "medicine", "pediatrics", "obgyn", "orthopedics"];

  const levelOptions = [
    {
      key: "all" as LevelFilter,
      label: "All Levels",
      dot: "bg-[#5BB3B3]",
    },
    {
      key: "UG" as LevelFilter,
      label: "UG (MBBS)",
      dot: "bg-[#7BA69E]",
    },
    {
      key: "PG" as LevelFilter,
      label: "PG (MD/MS)",
      dot: "bg-[#8EC7C7]",
    },
    {
      key: "SS" as LevelFilter,
      label: "SS (DM/MCh)",
      dot: "bg-[#C9A86C]",
    },
  ];

  return (
    <div className="ui-shell">
      <div className="ui-page space-y-5 md:space-y-6">
        <div className="ui-reveal-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#E8E0D5] sm:text-3xl">
              <Library className="h-8 w-8 text-[#5BB3B3]" />
              Library
            </h1>
            <p className="mt-1 text-sm text-[#A0B0BC]">
              Browse {SUBJECTS.length} subjects across UG, PG, and Super-Specialty levels
            </p>
          </div>
          <Link
            href="/cbme"
            className="ui-pill ui-interactive inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5BB3B3]"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            CBME Curriculum
          </Link>
        </div>

        <div className="ui-reveal-up ui-reveal-delay-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="ui-stat-card p-4">
            <div className="text-xl font-bold text-[#E8E0D5]">{SUBJECTS.length}</div>
            <div className="text-xs text-[#6B7A88]">Subjects</div>
          </div>
          <div className="ui-stat-card p-4">
            <div className="text-xl font-bold text-[#E8E0D5]">{totalSubspecs}</div>
            <div className="text-xs text-[#6B7A88]">Subspecialties</div>
          </div>
          <div className="ui-stat-card p-4">
            <div className="text-xl font-bold text-[#E8E0D5]">{totalTopics}</div>
            <div className="text-xs text-[#6B7A88]">Topics</div>
          </div>
        </div>

        <div className="ui-panel ui-reveal-up ui-reveal-delay-1 p-4 md:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-[#5BB3B3]" />
            <span className="text-sm font-medium text-[#E8E0D5]">Training Level</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {levelOptions.map((level) => (
              <button
                key={level.key}
                onClick={() => setLevelFilter(level.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  levelFilter === level.key
                    ? "ui-pill-active"
                    : "ui-pill hover:text-[#E8E0D5]"
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", level.dot)} />
                {level.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#6B7A88]">
            {levelFilter === "all" && "Showing all subjects across UG, PG, and Super Specialty levels"}
            {levelFilter === "UG" && "Foundation subjects for MBBS - NMC competency domains K (Knows) and KH (Knows How)"}
            {levelFilter === "PG" && "Advanced subjects for MD/MS residents - NMC domain SH (Shows How)"}
            {levelFilter === "SS" && "Super-specialty subjects for DM/MCh - NMC domain P (Performs)"}
          </p>
        </div>

        <div className="ui-reveal-up ui-reveal-delay-2 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0B0BC]" />
          <Input
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-xl border-[rgba(91,179,179,0.16)] bg-[rgba(54,74,94,0.7)] pl-10 text-[#E8E0D5] placeholder:text-[#A0B0BC] focus:border-[#5BB3B3]"
          />
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((subject) => {
            const subspecs = getSubspecialtiesBySubject(subject.id);

            if (levelFilter === "UG" && !ugSubjects.includes(subject.slug)) return null;
            if (levelFilter === "PG" && !pgSubjects.includes(subject.slug)) return null;
            if (levelFilter === "SS" && !ssSubjects.includes(subject.slug)) return null;

            return (
              <Link key={subject.id} href={`/library/${subject.slug}`} className="h-full">
                <Card className="ui-panel ui-interactive group h-full cursor-pointer overflow-hidden py-0">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-3 flex min-h-[3.5rem] items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(91,179,179,0.22)] bg-[rgba(37,53,69,0.74)] text-2xl leading-none shadow-[inset_0_1px_0_rgba(232,224,213,0.05)]">
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#E8E0D5] transition-colors duration-200 group-hover:text-[#5BB3B3]">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-[#6B7A88]">{subspecs.length} subspecialties</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#6B7A88] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#5BB3B3]" />
                    </div>

                    <p className="mb-4 min-h-[2.5rem] text-sm text-[#A0B0BC] line-clamp-2">
                      {subject.description}
                    </p>

                    <div className="mb-4 flex min-h-[3.7rem] flex-wrap content-start gap-1">
                      {subspecs.slice(0, 3).map((sub) => (
                        <Badge
                          key={sub.id}
                          variant="outline"
                          className="border-[rgba(91,179,179,0.2)] bg-[#2D3E50] text-xs text-[#A0B0BC]"
                        >
                          {sub.icon} {sub.name}
                        </Badge>
                      ))}
                      {subspecs.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-[rgba(91,179,179,0.2)] bg-[#2D3E50] text-xs text-[#6B7A88]"
                        >
                          +{subspecs.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-4 border-t border-[rgba(91,179,179,0.1)] pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7A88]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{subject.topicCount} topics</span>
                      </div>
                      <div className="ml-auto flex gap-1">
                        {ugSubjects.includes(subject.slug) && (
                          <span className="rounded border border-[#7BA69E]/35 bg-[#7BA69E]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#A8C9C2]">
                            UG
                          </span>
                        )}
                        {pgSubjects.includes(subject.slug) && (
                          <span className="rounded border border-[#5BB3B3]/35 bg-[#5BB3B3]/14 px-1.5 py-0.5 text-[10px] font-semibold text-[#8FD5D5]">
                            PG
                          </span>
                        )}
                        {ssSubjects.includes(subject.slug) && (
                          <span className="rounded border border-[#C9A86C]/35 bg-[#C9A86C]/14 px-1.5 py-0.5 text-[10px] font-semibold text-[#D8BE90]">
                            SS
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="py-12 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-[#6B7A88]" />
            <h3 className="mb-2 text-lg font-medium text-[#E8E0D5]">No subjects found</h3>
            <p className="text-[#A0B0BC]">Try a different search term.</p>
          </div>
        )}

        <AtomLibrarian />
      </div>
    </div>
  );
}
