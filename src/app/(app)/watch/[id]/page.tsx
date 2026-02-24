"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import {
  VideoPlayer, VideoSidebar, VideoInfo, VideoDescription, NotesPanel, ResourcesPanel,
  videoData, type TimestampNote,
} from "@/components/watch";

function parseTimestamp(timestamp: string) {
  const parts = timestamp.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

export default function VideoLessonPage() {
  const params = useParams();
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(2732);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showChapters, setShowChapters] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(videoData.isBookmarked);
  const [notes, setNotes] = useState<TimestampNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [activeChapter, setActiveChapter] = useState(videoData.chapters[0].id);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * duration));
  };

  const jumpToChapter = useCallback((timestamp: string) => {
    setCurrentTime(parseTimestamp(timestamp));
    setIsPlaying(true);
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: TimestampNote = { id: Date.now().toString(), timestamp: currentTime, text: newNote.trim(), createdAt: new Date() };
    setNotes([...notes, note].sort((a, b) => a.timestamp - b.timestamp));
    setNewNote("");
  };

  useEffect(() => {
    const chapter = [...videoData.chapters].reverse().find(ch => parseTimestamp(ch.timestamp) <= currentTime);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (chapter) setActiveChapter(chapter.id);
  }, [currentTime]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(t => {
          if (t >= duration) { setIsPlaying(false); setIsCompleted(true); return duration; }
          return t + 1;
        });
      }, 1000 / playbackSpeed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, duration]);

  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors mb-4 p-2">
        <ArrowLeft className="w-4 h-4" /> Back to Classroom
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoPlayer
            isPlaying={isPlaying} currentTime={currentTime} duration={duration}
            volume={volume} isMuted={isMuted} playbackSpeed={playbackSpeed}
            isBookmarked={isBookmarked} showChapters={showChapters}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={handleSeek}
            onSkip={(s) => setCurrentTime(Math.max(0, Math.min(duration, currentTime + s)))}
            onToggleMute={() => setIsMuted(!isMuted)}
            onVolumeChange={(v) => { setVolume(v); setIsMuted(false); }}
            onSpeedChange={setPlaybackSpeed}
            onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
            onToggleChapters={() => setShowChapters(!showChapters)}
            formatTime={formatTime}
          />
          <VideoInfo isCompleted={isCompleted} hasLiked={hasLiked} onLike={setHasLiked} />
          <VideoDescription />
          <NotesPanel
            notes={notes} newNote={newNote} currentTime={currentTime} formatTime={formatTime}
            onNewNoteChange={setNewNote} onAddNote={addNote}
            onDeleteNote={(id) => setNotes(notes.filter(n => n.id !== id))}
            onJumpToTime={setCurrentTime}
          />
          <ResourcesPanel />
        </div>

        {showChapters && (
          <VideoSidebar
            currentTime={currentTime} activeChapter={activeChapter}
            isCompleted={isCompleted} videoId={params.id as string}
            onJumpToChapter={jumpToChapter} onToggleComplete={() => setIsCompleted(!isCompleted)}
          />
        )}
      </div>
    </div>
  );
}
