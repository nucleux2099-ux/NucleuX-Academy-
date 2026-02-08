"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Link2, BookOpen, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface BacklinkItem {
  id: string;
  title: string;
  type: "topic" | "note" | "discussion";
  excerpt: string;
  mentionContext?: string; // The sentence where this topic is mentioned
}

interface BacklinksProps {
  backlinks: BacklinkItem[];
  currentTopicTitle: string;
  className?: string;
}

function getTypeIcon(type: BacklinkItem["type"]) {
  switch (type) {
    case "note":
      return <FileText className="w-4 h-4" />;
    case "discussion":
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
}

function getTypeColor(type: BacklinkItem["type"]) {
  switch (type) {
    case "note":
      return "text-amber-400 bg-amber-500/10";
    case "discussion":
      return "text-green-400 bg-green-500/10";
    default:
      return "text-purple-400 bg-purple-500/10";
  }
}

export function Backlinks({ backlinks, currentTopicTitle, className }: BacklinksProps) {
  if (backlinks.length === 0) {
    return null;
  }

  return (
    <Card className={cn("bg-[#364A5E] border-[rgba(91,179,179,0.15)]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
          <Link2 className="w-5 h-5 text-[#5BB3B3]" />
          What links here
          <span className="text-sm font-normal text-[#6B7280] ml-auto">
            {backlinks.length} reference{backlinks.length !== 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {backlinks.map((backlink) => (
          <Link
            key={backlink.id}
            href={
              backlink.type === "note"
                ? `/notes/${backlink.id}`
                : backlink.type === "discussion"
                ? `/community/${backlink.id}`
                : `/library/${backlink.id}`
            }
            className="block p-4 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.1)] hover:border-[#5BB3B3]/50 transition-all group"
          >
            <div className="flex items-start gap-3">
              {/* Type Icon */}
              <div className={cn("p-2 rounded-lg shrink-0", getTypeColor(backlink.type))}>
                {getTypeIcon(backlink.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors line-clamp-1">
                    {backlink.title}
                  </h4>
                  <ArrowUpRight className="w-3 h-3 text-[#6B7280] group-hover:text-[#5BB3B3] transition-colors shrink-0" />
                </div>

                {/* Mention context - shows how this topic is referenced */}
                {backlink.mentionContext && (
                  <p className="text-xs text-[#A0B0BC] mt-1 line-clamp-2">
                    "...
                    <span 
                      className="text-[#A78BFA] font-medium"
                      dangerouslySetInnerHTML={{
                        __html: backlink.mentionContext.replace(
                          new RegExp(currentTopicTitle, "gi"),
                          `<mark class="bg-[#5BB3B3]/30 text-[#C4B5FD] px-1 rounded">${currentTopicTitle}</mark>`
                        ),
                      }}
                    />
                    ..."
                  </p>
                )}

                {!backlink.mentionContext && (
                  <p className="text-xs text-[#6B7280] mt-1 line-clamp-1">
                    {backlink.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}

        {/* Info text */}
        <p className="text-xs text-[#6B7280] text-center pt-2">
          These pages mention <span className="text-[#A78BFA]">{currentTopicTitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default Backlinks;
