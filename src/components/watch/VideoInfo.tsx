"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, Star, ThumbsUp, ThumbsDown, Sparkles, StickyNote, FileText,
  Plus, X, Download,
} from "lucide-react";
import { videoData, type TimestampNote } from "./data";

interface VideoInfoProps {
  isCompleted: boolean;
  hasLiked: boolean | null;
  onLike: (val: boolean | null) => void;
}

export function VideoInfo({ isCompleted, hasLiked, onLike }: VideoInfoProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-2 mb-3 flex-wrap">
        <Badge className="bg-[#7BA69E]/20 text-[#7BA69E] border-none">{videoData.category}</Badge>
        <Badge variant="outline" className="border-[rgba(91,179,179,0.2)] text-[#6B7280]">{videoData.difficulty}</Badge>
        {isCompleted && <Badge className="bg-[#7BA69E]/20 text-[#7BA69E] border-none"><Sparkles className="w-3 h-3 mr-1" />Completed</Badge>}
      </div>
      <h1 className="text-2xl font-bold text-[#E8E0D5] mb-2">{videoData.title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-[#A0B0BC] mb-4">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{videoData.duration}</span>
        <span>{videoData.views.toLocaleString()} views</span>
        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#C9A86C] fill-[#C9A86C]" />{videoData.rating} ({videoData.totalRatings})</span>
        <span>{videoData.publishedAt}</span>
      </div>
      <div className="flex items-center justify-between p-4 bg-[#364A5E] rounded-xl border border-[rgba(91,179,179,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center text-white font-semibold">{videoData.instructor.avatar}</div>
          <div>
            <p className="font-medium text-[#E8E0D5]">{videoData.instructor.name}</p>
            <p className="text-sm text-[#6B7280]">{videoData.instructor.title}, {videoData.instructor.institution}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={hasLiked === true ? "default" : "outline"} size="sm"
            onClick={() => onLike(hasLiked === true ? null : true)}
            className={hasLiked === true ? "bg-[#7BA69E] text-white" : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"}>
            <ThumbsUp className="w-4 h-4 mr-1" />Helpful
          </Button>
          <Button variant={hasLiked === false ? "default" : "outline"} size="sm"
            onClick={() => onLike(hasLiked === false ? null : false)}
            className={hasLiked === false ? "bg-[#E57373] text-white" : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"}>
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function VideoDescription() {
  return (
    <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] mb-6">
      <CardContent className="p-4"><p className="text-[#A0B0BC]">{videoData.description}</p></CardContent>
    </Card>
  );
}

interface NotesProps {
  notes: TimestampNote[];
  newNote: string;
  currentTime: number;
  formatTime: (s: number) => string;
  onNewNoteChange: (val: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onJumpToTime: (time: number) => void;
}

export function NotesPanel({ notes, newNote, currentTime, formatTime, onNewNoteChange, onAddNote, onDeleteNote, onJumpToTime }: NotesProps) {
  return (
    <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
          <StickyNote className="w-5 h-5 text-[#8B5CF6]" />My Notes
          <Badge variant="outline" className="ml-auto border-[rgba(91,179,179,0.2)] text-[#6B7280]">{notes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input type="text" value={newNote} onChange={(e) => onNewNoteChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddNote()}
              placeholder="Add a note at current timestamp..."
              className="w-full px-4 py-2.5 bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-lg text-[#E8E0D5] placeholder-[#6B7280] focus:border-[#8B5CF6] focus:outline-none" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">@ {formatTime(currentTime)}</span>
          </div>
          <Button onClick={onAddNote} className="bg-[#8B5CF6] hover:bg-[#5BB3B3] text-white"><Plus className="w-4 h-4" /></Button>
        </div>
        {notes.length > 0 ? (
          <div className="space-y-2">
            {notes.map((note) => (
              <div key={note.id} className="flex items-start gap-3 p-3 bg-[#3A4D5F] rounded-lg group">
                <button onClick={() => onJumpToTime(note.timestamp)} className="text-[#8B5CF6] font-mono text-sm hover:underline shrink-0">{formatTime(note.timestamp)}</button>
                <p className="text-sm text-[#A0B0BC] flex-1">{note.text}</p>
                <button onClick={() => onDeleteNote(note.id)} className="opacity-0 group-hover:opacity-100 text-[#6B7280] hover:text-[#E57373] transition-opacity"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-[#6B7280] text-center py-4">No notes yet. Add timestamps notes while watching!</p>}
      </CardContent>
    </Card>
  );
}

export function ResourcesPanel() {
  return (
    <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
          <FileText className="w-5 h-5 text-[#5BB3B3]" />Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {videoData.resources.map((resource, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-[#3A4D5F] rounded-lg hover:bg-[#1a3048] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#5BB3B3]" />
              <span className="text-[#E8E0D5] text-sm">{resource.title}</span>
              {resource.size && <span className="text-xs text-[#6B7280]">{resource.size}</span>}
            </div>
            <Download className="w-4 h-4 text-[#6B7280]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
