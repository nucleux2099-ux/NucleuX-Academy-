"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play, List, CheckCircle, MessageCircle, Atom, Target, Sparkles,
} from "lucide-react";
import { videoData } from "./data";

function parseTimestamp(timestamp: string) {
  const parts = timestamp.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

interface VideoSidebarProps {
  currentTime: number;
  activeChapter: string;
  isCompleted: boolean;
  videoId: string;
  onJumpToChapter: (timestamp: string) => void;
  onToggleComplete: () => void;
}

export function VideoSidebar({
  currentTime, activeChapter, isCompleted, videoId,
  onJumpToChapter, onToggleComplete,
}: VideoSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Chapters */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
            <List className="w-5 h-5 text-[#5BB3B3]" /> Chapters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-3">
          {videoData.chapters.map((chapter, i) => {
            const isActive = activeChapter === chapter.id;
            const isPast = parseTimestamp(chapter.timestamp) < currentTime;
            return (
              <button key={chapter.id} onClick={() => onJumpToChapter(chapter.timestamp)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                  isActive ? 'bg-[#5BB3B3]/20 text-[#5BB3B3]'
                  : isPast ? 'text-[#A0B0BC] hover:bg-[#3A4D5F]'
                  : 'text-[#6B7280] hover:bg-[#3A4D5F] hover:text-[#A0B0BC]'
                }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isPast ? 'bg-[#7BA69E]/20 text-[#7BA69E]' : 'bg-[#3A4D5F] text-[#6B7280]'
                }`}>
                  {isPast ? <CheckCircle className="w-3 h-3" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{chapter.title}</p>
                  <p className="text-xs text-[#6B7280]">{chapter.timestamp} • {chapter.duration}</p>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Ask ATOM */}
      <Card className="bg-gradient-to-br from-[rgba(91,179,179,0.15)] to-[rgba(139,92,246,0.1)] border-[rgba(91,179,179,0.2)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#E8E0D5]">ATOM Assistant</p>
              <p className="text-xs text-[#6B7280]">Watching with you</p>
            </div>
          </div>
          <p className="text-sm text-[#A0B0BC] mb-3">Ask questions about this lecture anytime. ATOM has the transcript and can help explain concepts.</p>
          <Link href={`/chat?video=${videoId}&t=${currentTime}`}>
            <Button className="w-full bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]">
              <MessageCircle className="w-4 h-4 mr-2" /> Ask about this moment
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Related */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardHeader className="pb-3"><CardTitle className="text-lg text-[#E8E0D5]">Related Videos</CardTitle></CardHeader>
        <CardContent className="space-y-3 p-3">
          {videoData.relatedVideos.map((video) => (
            <Link key={video.id} href={`/watch/${video.id}`} className="flex gap-3 p-2 rounded-lg hover:bg-[#3A4D5F] transition-colors">
              <div className="w-28 h-16 bg-[#3A4D5F] rounded-lg flex items-center justify-center shrink-0">
                <Play className="w-6 h-6 text-[#6B7280]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#E8E0D5] line-clamp-2">{video.title}</p>
                <p className="text-xs text-[#6B7280] mt-1">{video.instructor}</p>
                <p className="text-xs text-[#6B7280]">{video.duration}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Button onClick={onToggleComplete}
        className={`w-full ${isCompleted
          ? 'bg-[#7BA69E] hover:bg-[#047857] text-white'
          : 'bg-[#3A4D5F] hover:bg-[#1a3048] text-[#A0B0BC] border border-[rgba(91,179,179,0.15)]'
        }`}>
        {isCompleted ? <><Sparkles className="w-4 h-4 mr-2" />Completed!</> : <><Target className="w-4 h-4 mr-2" />Mark as Complete</>}
      </Button>
    </aside>
  );
}
