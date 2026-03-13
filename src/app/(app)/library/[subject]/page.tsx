"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Library, BookOpen } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[#A0B0BC]">Subject not found.</p>
      </div>
    );
  }

  // Surgery gets a custom hub
  if (subjectSlug === "surgery") {
    return <SurgeryHub mode={searchParams.get("mode")} />;
  }

  const subspecialties = getSubspecialtiesBySubject(subject.id);
  const mode = searchParams.get("mode");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Breadcrumb */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
        <Link href="/library" className="text-[#A0B0BC] hover:text-[#5BB3B3] transition-colors">
          Library
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <span className="text-[#E8E0D5]">{subject.name}</span>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Library className="w-7 h-7 text-[#5BB3B3]" />
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">{subject.name}</h1>
          <p className="text-[#A0B0BC]">Choose a subspecialty to continue.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Badge className="w-fit bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]">
          {subspecialties.length} subspecialties
        </Badge>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subspecialties.map((sub) => {
          const href = mode
            ? `/library/${subject.slug}/${sub.slug}?mode=${mode}`
            : `/library/${subject.slug}/${sub.slug}`;

          return (
            <Link key={sub.id} href={href}>
              <Card className="group glassmorphic-card card-hover transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sub.icon}</span>
                      <h2 className="font-semibold text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors">
                        {sub.name}
                      </h2>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#5BB3B3] group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-sm text-[#A0B0BC] mb-4">{sub.description}</p>

                  <div className="flex items-center gap-2 text-xs text-[#6B7280] pt-3 border-t border-[rgba(91,179,179,0.1)]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{sub.topicCount} topics</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
