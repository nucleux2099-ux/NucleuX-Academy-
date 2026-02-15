"use client";

import Link from "next/link";
import { Map, ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LibraryTopic } from "@/lib/types/library";
import {
  SURGERY_ALLIED_MAP,
  type AlliedLink,
  type TopicRoadmap,
} from "@/lib/data/allied-subject-map";

// Subject color mapping
const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  anatomy:     { bg: "bg-blue-500/15",   border: "border-blue-500/30",   text: "text-blue-400",   icon: "🦴" },
  physiology:  { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400", icon: "🧬" },
  biochemistry:{ bg: "bg-teal-500/15",    border: "border-teal-500/30",    text: "text-teal-400",    icon: "🧪" },
  pathology:   { bg: "bg-red-500/15",     border: "border-red-500/30",     text: "text-red-400",     icon: "🔬" },
  pharmacology:{ bg: "bg-purple-500/15",  border: "border-purple-500/30",  text: "text-purple-400",  icon: "💊" },
  radiology:   { bg: "bg-amber-500/15",   border: "border-amber-500/30",   text: "text-amber-400",   icon: "📷" },
  microbiology:{ bg: "bg-lime-500/15",    border: "border-lime-500/30",    text: "text-lime-400",    icon: "🦠" },
  medicine:    { bg: "bg-cyan-500/15",    border: "border-cyan-500/30",    text: "text-cyan-400",    icon: "🏥" },
  surgery:     { bg: "bg-orange-500/15",  border: "border-orange-500/30",  text: "text-orange-400",  icon: "🔪" },
};

const DEFAULT_COLOR = { bg: "bg-slate-500/15", border: "border-slate-500/30", text: "text-slate-400", icon: "📘" };

function getSubjectStyle(subject: string) {
  const key = subject.toLowerCase().replace(/\s+/g, "");
  return SUBJECT_COLORS[key] || DEFAULT_COLOR;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Allied card component
function AlliedCard({ link }: { link: AlliedLink }) {
  const style = getSubjectStyle(link.subject);
  const href = `/library/${slugify(link.subject)}/${slugify(link.topic)}`;

  return (
    <Link href={href} className="block group">
      <div
        className={cn(
          "rounded-lg border p-3 transition-all hover:scale-[1.02] hover:shadow-lg min-w-[140px]",
          style.bg,
          style.border,
          "hover:border-opacity-60"
        )}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{style.icon}</span>
          <span className={cn("text-xs font-medium uppercase tracking-wider", style.text)}>
            {link.subject}
          </span>
        </div>
        <div className="text-sm font-medium text-[#E5E7EB] group-hover:text-white truncate">
          {link.label}
        </div>
        {link.nmcCode && (
          <Badge
            className={cn(
              "mt-1.5 text-[10px] px-1.5 py-0",
              style.bg,
              style.text,
              style.border
            )}
          >
            {link.nmcCode}
          </Badge>
        )}
      </div>
    </Link>
  );
}

// Connector arrows (purely visual)
function ConnectorDown() {
  return (
    <div className="flex justify-center py-1">
      <div className="w-px h-6 bg-[rgba(91,179,179,0.3)]" />
    </div>
  );
}

function ConnectorFan({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="flex justify-center py-1">
      <div className="flex items-end gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-px h-4 bg-[rgba(91,179,179,0.25)]" />
        ))}
      </div>
    </div>
  );
}

interface RoadmapViewProps {
  topic: LibraryTopic;
  subjectSlug: string;
  subspecialtySlug: string;
}

export function RoadmapView({ topic, subjectSlug, subspecialtySlug }: RoadmapViewProps) {
  // Look up roadmap data — try topic slug, then topic id
  const roadmap: TopicRoadmap | undefined =
    SURGERY_ALLIED_MAP[topic.slug] || SURGERY_ALLIED_MAP[topic.id] || undefined;

  const hasData = roadmap && (
    roadmap.foundations.length > 0 ||
    roadmap.clinical.length > 0 ||
    roadmap.extensions.length > 0 ||
    roadmap.nextTopics.length > 0
  );

  // Difficulty dots
  const difficulty = topic.difficulty ?? 3;
  const difficultyDots = Array.from({ length: 5 }, (_, i) => i < difficulty);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#3A4D5F] border-[rgba(91,179,179,0.1)]">
        <CardContent className="p-5">
          <h2 className="text-lg font-bold text-[#E5E7EB] flex items-center gap-2">
            <Map className="w-5 h-5 text-[#5BB3B3]" />
            Learning Roadmap: {topic.name}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Cross-subject connections for integrated learning
          </p>
        </CardContent>
      </Card>

      {!hasData ? (
        /* Coming soon placeholder */
        <Card className="bg-[#142538] border-[rgba(91,179,179,0.1)]">
          <CardContent className="py-16 text-center">
            <BookOpen className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">
              Allied Subject Map — Coming Soon
            </h3>
            <p className="text-[#9CA3AF] max-w-md mx-auto">
              Cross-subject connections for <strong>{topic.name}</strong> are being mapped.
              Check back soon for an interactive learning roadmap linking anatomy, physiology,
              pathology, pharmacology, and more.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* FOUNDATIONS */}
          {roadmap!.foundations.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium mb-2 flex items-center gap-1.5">
                📐 Foundations <span className="text-[#6B7280]">— study these first</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {roadmap!.foundations.map((link, i) => (
                  <AlliedCard key={i} link={link} />
                ))}
              </div>
              <ConnectorFan count={roadmap!.foundations.length} />
              <ConnectorDown />
            </div>
          )}

          {/* CURRENT TOPIC */}
          <Card className="bg-[rgba(91,179,179,0.08)] border-[#5BB3B3]">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-[#5BB3B3] font-medium mb-2">
                🏥 Current Topic
              </div>
              <h3 className="text-xl font-bold text-[#E5E7EB]">{topic.name}</h3>
              {topic.nmcCodes && topic.nmcCodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {topic.nmcCodes.map((nmc) => (
                    <Badge
                      key={nmc.code}
                      className="bg-[#5BB3B3]/15 text-[#5BB3B3] border-[#5BB3B3]/30 text-xs"
                    >
                      {nmc.code}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-[#9CA3AF]">Difficulty:</span>
                  <span className="flex gap-0.5">
                    {difficultyDots.map((filled, i) => (
                      <span
                        key={i}
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          filled ? "bg-[#5BB3B3]" : "bg-[#374151]"
                        )}
                      />
                    ))}
                  </span>
                </div>
                {topic.highYield && (
                  <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]">
                    High Yield
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CLINICAL / PARALLEL */}
          {roadmap!.clinical.length > 0 && (
            <div>
              <ConnectorDown />
              <ConnectorFan count={roadmap!.clinical.length} />
              <div className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium mb-2 flex items-center gap-1.5">
                🔬 Clinical Extensions
              </div>
              <div className="flex flex-wrap gap-3">
                {roadmap!.clinical.map((link, i) => (
                  <AlliedCard key={i} link={link} />
                ))}
              </div>
            </div>
          )}

          {/* EXTENSIONS */}
          {roadmap!.extensions.length > 0 && (
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium mb-2 flex items-center gap-1.5">
                🧩 Advanced Extensions
              </div>
              <div className="flex flex-wrap gap-3">
                {roadmap!.extensions.map((link, i) => (
                  <AlliedCard key={i} link={link} />
                ))}
              </div>
            </div>
          )}

          {/* NEXT TOPICS */}
          {roadmap!.nextTopics.length > 0 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium mb-2 flex items-center gap-1.5">
                ➡️ Next Topics
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {roadmap!.nextTopics.map((t, i) => (
                  <Link
                    key={i}
                    href={`/library/${subjectSlug}/${subspecialtySlug}/${slugify(t)}?mode=roadmap`}
                    className="shrink-0"
                  >
                    <Badge className="bg-[#142538] hover:bg-[rgba(91,179,179,0.1)] text-[#9CA3AF] border-[rgba(91,179,179,0.2)] cursor-pointer whitespace-nowrap px-3 py-1.5">
                      {t}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* PREV TOPICS */}
          {roadmap!.prevTopics.length > 0 && (
            <div className="mt-2">
              <div className="text-xs uppercase tracking-wider text-[#9CA3AF] font-medium mb-2 flex items-center gap-1.5">
                ⬅️ Previous Topics
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {roadmap!.prevTopics.map((t, i) => (
                  <Link
                    key={i}
                    href={`/library/${subjectSlug}/${subspecialtySlug}/${slugify(t)}?mode=roadmap`}
                    className="shrink-0"
                  >
                    <Badge className="bg-[#142538] hover:bg-[rgba(91,179,179,0.1)] text-[#9CA3AF] border-[rgba(91,179,179,0.2)] cursor-pointer whitespace-nowrap px-3 py-1.5">
                      {t}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
