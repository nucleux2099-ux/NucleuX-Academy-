"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  BookOpen,
  Target,
  Play,
  ChevronRight,
  FileText,
  Video,
  RotateCcw,
  X,
} from "lucide-react";

// Types
interface RecentItem {
  id: string;
  title: string;
  type: "reading" | "mcq" | "video" | "note";
  progress: number; // percentage
  lastAccessed: string; // relative time
  subtitle: string; // chapter, question count, etc.
  href: string;
  timeLeft?: number; // estimated minutes to complete
}

// Mock data
const mockRecents: RecentItem[] = [
  {
    id: "1",
    title: "Hepatobiliary Surgery",
    type: "reading",
    progress: 65,
    lastAccessed: "2 hours ago",
    subtitle: "Blumgart's Ch. 12-18",
    href: "/library/hepatobiliary",
    timeLeft: 25,
  },
  {
    id: "2",
    title: "Hernia MCQ Set",
    type: "mcq",
    progress: 48,
    lastAccessed: "Yesterday",
    subtitle: "12/25 questions done",
    href: "/mcqs?set=hernia&resume=true",
    timeLeft: 15,
  },
  {
    id: "3",
    title: "Portal Hypertension Notes",
    type: "note",
    progress: 100,
    lastAccessed: "2 days ago",
    subtitle: "Last edited: TIPS section",
    href: "/notes/portal-htn",
  },
];

function getTypeIcon(type: RecentItem["type"]) {
  switch (type) {
    case "reading":
      return <BookOpen className="w-4 h-4" />;
    case "mcq":
      return <Target className="w-4 h-4" />;
    case "video":
      return <Video className="w-4 h-4" />;
    case "note":
      return <FileText className="w-4 h-4" />;
  }
}

function getTypeColor(type: RecentItem["type"]) {
  switch (type) {
    case "reading":
      return { bg: "bg-purple-500/20", text: "text-purple-400", progress: "from-purple-500 to-purple-400" };
    case "mcq":
      return { bg: "bg-cyan-500/20", text: "text-cyan-400", progress: "from-cyan-500 to-cyan-400" };
    case "video":
      return { bg: "bg-amber-500/20", text: "text-amber-400", progress: "from-amber-500 to-amber-400" };
    case "note":
      return { bg: "bg-green-500/20", text: "text-green-400", progress: "from-green-500 to-green-400" };
  }
}

function getTypeLabel(type: RecentItem["type"]) {
  switch (type) {
    case "reading":
      return "Reading";
    case "mcq":
      return "MCQ";
    case "video":
      return "Video";
    case "note":
      return "Note";
  }
}

export function ContinueWhereYouLeft() {
  const [recents, _setRecents] = useState(mockRecents);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visibleRecents = recents.filter(r => !dismissed.includes(r.id));

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(prev => [...prev, id]);
  };

  if (visibleRecents.length === 0) {
    return null; // Don't show if nothing to continue
  }

  return (
    <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#E8E0D5] text-base">
          <RotateCcw className="w-4 h-4 text-[#5BB3B3]" />
          Continue Where You Left
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {visibleRecents.map((item, index) => {
          const colors = getTypeColor(item.type);
          const isFirst = index === 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "block p-3 rounded-xl border transition-all group relative",
                isFirst
                  ? "bg-[rgba(91,179,179,0.05)] border-[rgba(91,179,179,0.2)] hover:border-[#5BB3B3]/50"
                  : "bg-[#2D3E50] border-[rgba(91,179,179,0.1)] hover:border-[rgba(91,179,179,0.2)]"
              )}
            >
              {/* Dismiss button */}
              <button
                onClick={(e) => handleDismiss(item.id, e)}
                className="absolute top-2 right-2 p-1 rounded-full text-[#6B7280] hover:text-[#A0B0BC] hover:bg-[#3A4D5F] opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-3">
                {/* Type Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  colors.bg, colors.text
                )}>
                  {getTypeIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors truncate">
                      {item.title}
                    </p>
                    <Badge className={cn("text-xs shrink-0", colors.bg, colors.text, "border-transparent")}>
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-[#6B7280] mb-2">{item.subtitle}</p>

                  {/* Progress bar */}
                  {item.progress < 100 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#3A4D5F] rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r", colors.progress)}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#6B7280] shrink-0">{item.progress}%</span>
                    </div>
                  )}
                </div>

                {/* Meta & Action */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-[#6B7280] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.lastAccessed}
                  </span>
                  
                  {item.timeLeft && item.progress < 100 && (
                    <span className="text-xs text-[#A0B0BC]">
                      ~{item.timeLeft} min left
                    </span>
                  )}

                  {isFirst && (
                    <Button
                      size="sm"
                      className="mt-1 h-7 text-xs bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50] font-medium shadow-md shadow-[#5BB3B3]/20"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Resume
                    </Button>
                  )}

                  {!isFirst && (
                    <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#5BB3B3] transition-colors mt-1" />
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Learning science note */}
        <p className="text-xs text-[#6B7280] pt-2 border-t border-[rgba(91,179,179,0.1)]">
          💡 <span className="text-[#A0B0BC]">Context restoration</span> — Resume without cognitive load of &quot;where was I?&quot;
        </p>
      </CardContent>
    </Card>
  );
}

export default ContinueWhereYouLeft;
