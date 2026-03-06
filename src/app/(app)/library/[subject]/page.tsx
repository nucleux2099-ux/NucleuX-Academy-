"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, BookOpen } from "lucide-react";
import { getSubjectBySlug } from "@/lib/data/subjects";
import { getSubspecialtiesBySubject } from "@/lib/data/subspecialties";
import { resolveCanonicalSubjectSlug } from "@/lib/data/cbme-aliases";
import SurgeryHub from "@/components/library/SurgeryHub";

export default function SubjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const subjectSlug = params.subject as string;
  const canonicalSubjectSlug = resolveCanonicalSubjectSlug(subjectSlug);
  const subject = getSubjectBySlug(canonicalSubjectSlug);

  if (!subject) {
    return (
      <div className="ui-shell">
        <div className="ui-page flex min-h-[40vh] items-center justify-center">
          <p className="text-[#A0B0BC]">Subject not found.</p>
        </div>
      </div>
    );
  }

  // Surgery gets a custom hub
  if (subjectSlug === "surgery") {
    return <SurgeryHub mode={searchParams.get("mode")} />;
  }

  const subspecialties = getSubspecialtiesBySubject(subject.id);
  const mode = searchParams.get("mode");

  return (
    <div className="ui-shell">
      <div className="ui-page space-y-5 md:space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/library" className="text-[#A0B0BC] transition-colors hover:text-[#5BB3B3]">
            Library
          </Link>
          <ChevronRight className="h-4 w-4 text-[#6B7280]" />
          <span className="text-[#E8E0D5]">{subject.name}</span>
        </div>

        <div className="ui-panel ui-reveal-up p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(91,179,179,0.22)] bg-[rgba(37,53,69,0.74)] text-2xl leading-none shadow-[inset_0_1px_0_rgba(232,224,213,0.05)]">
                {subject.icon}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[#E8E0D5] md:text-3xl">{subject.name}</h1>
                <p className="text-[#A0B0BC]">Choose a subspecialty to continue.</p>
              </div>
            </div>
            <Badge className="w-fit border-[rgba(91,179,179,0.3)] bg-[rgba(91,179,179,0.15)] text-[#5BB3B3]">
              {subspecialties.length} subspecialties
            </Badge>
          </div>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subspecialties.map((sub) => {
            const href = mode
              ? `/library/${subject.slug}/${sub.slug}?mode=${mode}`
              : `/library/${subject.slug}/${sub.slug}`;

            return (
              <Link key={sub.id} href={href} className="h-full">
                <Card className="ui-panel ui-interactive group h-full cursor-pointer">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(91,179,179,0.2)] bg-[rgba(37,53,69,0.72)] text-xl leading-none">
                          {sub.icon}
                        </div>
                        <h2 className="font-semibold text-[#E8E0D5] transition-colors group-hover:text-[#5BB3B3]">
                          {sub.name}
                        </h2>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#6B7280] transition-all group-hover:translate-x-1 group-hover:text-[#5BB3B3]" />
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm text-[#A0B0BC]">{sub.description}</p>

                    <div className="mt-auto flex items-center gap-2 border-t border-[rgba(91,179,179,0.1)] pt-3 text-xs text-[#6B7280]">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{sub.topicCount} topics</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
