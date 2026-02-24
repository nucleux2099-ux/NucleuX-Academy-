"use client";

import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play, Pause, Volume2, VolumeX, Maximize2, SkipBack, SkipForward,
  Bookmark, BookmarkCheck, Share2, List,
} from "lucide-react";
import { videoData } from "./data";

interface VideoPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  isBookmarked: boolean;
  showChapters: boolean;
  onTogglePlay: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSkip: (seconds: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggleBookmark: () => void;
  onToggleChapters: () => void;
  formatTime: (s: number) => string;
}

function parseTimestamp(timestamp: string) {
  const parts = timestamp.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

export function VideoPlayer({
  isPlaying, currentTime, duration, volume, isMuted, playbackSpeed,
  isBookmarked, showChapters: _showChapters, onTogglePlay, onSeek, onSkip, onToggleMute,
  onVolumeChange, onSpeedChange, onToggleBookmark, onToggleChapters, formatTime,
}: VideoPlayerProps) {
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => { if (isPlaying) setShowControls(false); }, 3000);
  }, [isPlaying]);

  const progress = (currentTime / duration) * 100;

  return (
    <div
      className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3048] to-[#2D3E50] flex items-center justify-center">
        {!isPlaying && (
          <button onClick={onTogglePlay} className="w-20 h-20 rounded-full bg-[#5BB3B3]/90 hover:bg-[#5BB3B3] flex items-center justify-center transition-all hover:scale-110 shadow-2xl shadow-[#5BB3B3]/30">
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        )}
        {isPlaying && <div className="text-[#6B7280] text-sm">Video playing... ({formatTime(currentTime)})</div>}
      </div>

      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Badge className="bg-[#E57373]/90 text-white border-none">LIVE LECTURE</Badge>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10"><Share2 className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className={`hover:bg-white/10 ${isBookmarked ? 'text-[#C9A86C]' : 'text-white/80 hover:text-white'}`} onClick={onToggleBookmark}>
              {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <button onClick={() => onSkip(-10)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><SkipBack className="w-5 h-5" /></button>
          <button onClick={onTogglePlay} className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          <button onClick={() => onSkip(10)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><SkipForward className="w-5 h-5" /></button>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress" onClick={onSeek}>
            <div className="h-full bg-[#5BB3B3] rounded-full relative" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#5BB3B3] rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
            {videoData.chapters.slice(1).map((ch) => (
              <div key={ch.id} className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-white/50 rounded"
                style={{ left: `${(parseTimestamp(ch.timestamp) / duration) * 100}%` }} title={ch.title} />
            ))}
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={onTogglePlay}>{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
              <div className="flex items-center gap-2 group/volume">
                <button onClick={onToggleMute}>{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</button>
                <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100" />
              </div>
              <span className="text-sm">{formatTime(currentTime)} / {videoData.duration}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setShowSettings(!showSettings)} className="text-sm hover:text-[#5BB3B3] transition-colors">{playbackSpeed}x</button>
                {showSettings && (
                  <div className="absolute bottom-8 right-0 bg-[#364A5E] border border-[rgba(91,179,179,0.15)] rounded-lg p-2 min-w-[100px]">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button key={speed} onClick={() => { onSpeedChange(speed); setShowSettings(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[#3A4D5F] ${playbackSpeed === speed ? 'text-[#5BB3B3]' : 'text-[#A0B0BC]'}`}>
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={onToggleChapters} className="hover:text-[#5BB3B3] lg:hidden"><List className="w-5 h-5" /></button>
              <button className="hover:text-[#5BB3B3]"><Maximize2 className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
