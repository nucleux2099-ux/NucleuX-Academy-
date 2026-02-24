'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen, Clock, List, Bookmark, BookmarkCheck,
  StickyNote, Target, CheckCircle, Sparkles,
} from 'lucide-react';
import { topicData } from './data';

interface ReaderSidebarProps {
  activeSection: string;
  scrollProgress: number;
  readingTime: number;
  isBookmarked: boolean;
  isCompleted: boolean;
  showNotes: boolean;
  onScrollToSection: (id: string) => void;
  onToggleBookmark: () => void;
  onToggleNotes: () => void;
  onToggleCompleted: () => void;
}

export function ReaderSidebar({
  activeSection, scrollProgress, readingTime,
  isBookmarked, isCompleted, showNotes,
  onScrollToSection, onToggleBookmark, onToggleNotes, onToggleCompleted,
}: ReaderSidebarProps) {
  return (
    <aside className="hidden lg:block w-72 shrink-0 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Source Info */}
      <div className="mb-6 p-4 bg-[#364A5E] rounded-xl border border-[rgba(91,179,179,0.15)]">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#7BA69E]/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-[#7BA69E]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#E8E0D5]">{topicData.source.book}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{topicData.source.chapter} • p. {topicData.source.pages}</p>
          </div>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#A0B0BC]">Reading Progress</span>
          <span className="text-[#E8E0D5] font-medium">{Math.round(scrollProgress)}%</span>
        </div>
        <Progress value={scrollProgress} className="h-2" />
        <p className="text-xs text-[#6B7280] mt-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />~{readingTime} min remaining
        </p>
      </div>
      
      {/* Table of Contents */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
          <List className="w-4 h-4 text-[#5BB3B3]" />Contents
        </h3>
        <nav className="space-y-1">
          {topicData.sections.map((section) => (
            <button key={section.id} onClick={() => onScrollToSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activeSection === section.id
                  ? "bg-[#7BA69E]/20 text-[#7BA69E] border-l-2 border-[#7BA69E] font-medium"
                  : "text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#3A4D5F]"
              }`}>
              {section.title}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Key Points */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#C9A86C]" />Key Points
        </h3>
        <ul className="space-y-2">
          {topicData.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#A0B0BC]">
              <CheckCircle className="w-3 h-3 text-[#7BA69E] mt-0.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={onToggleBookmark} variant="outline"
          className={`w-full justify-start border-[rgba(91,179,179,0.15)] ${isBookmarked ? 'text-[#C9A86C] bg-[#C9A86C]/10' : 'text-[#A0B0BC]'}`}>
          {isBookmarked ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        <Button onClick={onToggleNotes} variant="outline"
          className={`w-full justify-start border-[rgba(91,179,179,0.15)] ${showNotes ? 'text-[#8B5CF6] bg-[#8B5CF6]/10' : 'text-[#A0B0BC]'}`}>
          <StickyNote className="w-4 h-4 mr-2" />Take Notes
        </Button>
        <Button onClick={onToggleCompleted}
          className={`w-full justify-start ${isCompleted ? 'bg-[#7BA69E] hover:bg-[#047857] text-white' : 'bg-[#3A4D5F] hover:bg-[#1a3048] text-[#A0B0BC]'}`}>
          {isCompleted ? <Sparkles className="w-4 h-4 mr-2" /> : <Target className="w-4 h-4 mr-2" />}
          {isCompleted ? "Completed!" : "Mark Complete"}
        </Button>
      </div>
    </aside>
  );
}
