"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,

  SkipBack,
  SkipForward,

  Bookmark,
  BookmarkCheck,
  StickyNote,
  List,

  Clock,
  Star,
  CheckCircle,
  MessageCircle,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Target,
  FileText,
  Atom,
  Plus,
  X,
  Sparkles,

} from "lucide-react";

// Mock video data
const videoData = {
  id: "esophageal-surgery",
  title: "Esophageal Surgery: Operative Techniques",
  instructor: {
    name: "Dr. Rajesh Sharma",
    title: "Professor of Surgery",
    institution: "AIIMS Delhi",
    avatar: "RS",
  },
  description: "A comprehensive lecture covering surgical approaches for esophageal diseases including Ivor Lewis, transhiatal, and McKeown procedures.",
  duration: "45:32",
  views: 12580,
  rating: 4.9,
  totalRatings: 342,
  publishedAt: "Jan 15, 2026",
  category: "Surgery",
  topic: "Esophageal Surgery",
  difficulty: "Advanced",
  progress: 0,
  isBookmarked: false,
  thumbnail: "/api/placeholder/800/450",
  chapters: [
    { id: "intro", title: "Introduction", timestamp: "0:00", duration: "3:45" },
    { id: "anatomy", title: "Surgical Anatomy", timestamp: "3:45", duration: "8:20" },
    { id: "ivor-lewis", title: "Ivor Lewis Esophagectomy", timestamp: "12:05", duration: "12:15" },
    { id: "transhiatal", title: "Transhiatal Approach", timestamp: "24:20", duration: "10:30" },
    { id: "mie", title: "Minimally Invasive Esophagectomy", timestamp: "34:50", duration: "7:12" },
    { id: "complications", title: "Complications & Management", timestamp: "42:02", duration: "3:30" },
  ],
  relatedVideos: [
    { id: "gastric-surgery", title: "Gastric Cancer Surgery", instructor: "Dr. Meena Patel", duration: "38:15", thumbnail: "" },
    { id: "lap-fundoplication", title: "Laparoscopic Fundoplication", instructor: "Dr. Amit Kumar", duration: "32:40", thumbnail: "" },
    { id: "bariatric", title: "Bariatric Surgery Basics", instructor: "Dr. Priya Singh", duration: "42:00", thumbnail: "" },
  ],
  resources: [
    { type: "pdf", title: "Lecture Slides", size: "4.2 MB" },
    { type: "pdf", title: "Operative Diagrams", size: "2.8 MB" },
    { type: "link", title: "Reference Article", size: "" },
  ],
};

interface TimestampNote {
  id: string;
  timestamp: number;
  text: string;
  createdAt: Date;
}

export default function VideoLessonPage() {
  const params = useParams();
  const router = useRouter();
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, _setDuration] = useState(2732); // 45:32 in seconds
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [_isFullscreen, _setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // UI state
  const [showChapters, setShowChapters] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(videoData.isBookmarked);
  const [_showNotes, _setShowNotes] = useState(false);
  const [notes, setNotes] = useState<TimestampNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [activeChapter, setActiveChapter] = useState(videoData.chapters[0].id);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasLiked, setHasLiked] = useState<boolean | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Parse timestamp to seconds
  const parseTimestamp = (timestamp: string) => {
    const parts = timestamp.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  };
  
  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * duration));
  };
  
  // Jump to chapter
  const jumpToChapter = (timestamp: string) => {
    setCurrentTime(parseTimestamp(timestamp));
    setIsPlaying(true);
  };
  
  // Skip forward/back
  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, currentTime + seconds)));
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Add timestamped note
  const addNote = () => {
    if (!newNote.trim()) return;
    const note: TimestampNote = {
      id: Date.now().toString(),
      timestamp: currentTime,
      text: newNote.trim(),
      createdAt: new Date(),
    };
    setNotes([...notes, note].sort((a, b) => a.timestamp - b.timestamp));
    setNewNote("");
  };
  
  // Delete note
  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };
  
  // Update active chapter based on current time
  useEffect(() => {
    const chapter = [...videoData.chapters].reverse().find(
      ch => parseTimestamp(ch.timestamp) <= currentTime
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (chapter) setActiveChapter(chapter.id);
  }, [currentTime]);
  
  // Simulate video progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(t => {
          if (t >= duration) {
            setIsPlaying(false);
            setIsCompleted(true);
            return duration;
          }
          return t + 1;
        });
      }, 1000 / playbackSpeed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, duration]);
  
  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);
  
  const progress = (currentTime / duration) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors mb-4 p-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Classroom
      </button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div 
            ref={videoRef}
            className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4 group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a3048] to-[#2D3E50] flex items-center justify-center">
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-[#5BB3B3]/90 hover:bg-[#5BB3B3] flex items-center justify-center transition-all hover:scale-110 shadow-2xl shadow-[#5BB3B3]/30"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </button>
              )}
              {isPlaying && (
                <div className="text-[#6B7280] text-sm">
                  Video playing... ({formatTime(currentTime)})
                </div>
              )}
            </div>
            
            {/* Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                <Badge className="bg-[#E57373]/90 text-white border-none">
                  LIVE LECTURE
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`hover:bg-white/10 ${isBookmarked ? 'text-[#C9A86C]' : 'text-white/80 hover:text-white'}`}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              
              {/* Center Controls */}
              <div className="absolute inset-0 flex items-center justify-center gap-8">
                <button onClick={() => skip(-10)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
                <button onClick={() => skip(10)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              
              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div 
                  className="h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-[#5BB3B3] rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#5BB3B3] rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                  {/* Chapter Markers */}
                  {videoData.chapters.slice(1).map((ch) => (
                    <div
                      key={ch.id}
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-white/50 rounded"
                      style={{ left: `${(parseTimestamp(ch.timestamp) / duration) * 100}%` }}
                      title={ch.title}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    
                    {/* Volume */}
                    <div className="flex items-center gap-2 group/volume">
                      <button onClick={toggleMute}>
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                        className="w-0 group-hover/volume:w-20 transition-all opacity-0 group-hover/volume:opacity-100"
                      />
                    </div>
                    
                    <span className="text-sm">
                      {formatTime(currentTime)} / {videoData.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Speed */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-sm hover:text-[#5BB3B3] transition-colors"
                      >
                        {playbackSpeed}x
                      </button>
                      {showSettings && (
                        <div className="absolute bottom-8 right-0 bg-[#364A5E] border border-[rgba(91,179,179,0.15)] rounded-lg p-2 min-w-[100px]">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                            <button
                              key={speed}
                              onClick={() => { setPlaybackSpeed(speed); setShowSettings(false); }}
                              className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[#3A4D5F] ${playbackSpeed === speed ? 'text-[#5BB3B3]' : 'text-[#A0B0BC]'}`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button onClick={() => setShowChapters(!showChapters)} className="hover:text-[#5BB3B3] lg:hidden">
                      <List className="w-5 h-5" />
                    </button>
                    
                    <button className="hover:text-[#5BB3B3]">
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Info */}
          <div className="mb-6">
            <div className="flex items-start gap-2 mb-3 flex-wrap">
              <Badge className="bg-[#7BA69E]/20 text-[#7BA69E] border-none">{videoData.category}</Badge>
              <Badge variant="outline" className="border-[rgba(91,179,179,0.2)] text-[#6B7280]">{videoData.difficulty}</Badge>
              {isCompleted && (
                <Badge className="bg-[#7BA69E]/20 text-[#7BA69E] border-none">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-[#E8E0D5] mb-2">{videoData.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#A0B0BC] mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {videoData.duration}
              </span>
              <span>{videoData.views.toLocaleString()} views</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#C9A86C] fill-[#C9A86C]" />
                {videoData.rating} ({videoData.totalRatings})
              </span>
              <span>{videoData.publishedAt}</span>
            </div>
            
            {/* Instructor */}
            <div className="flex items-center justify-between p-4 bg-[#364A5E] rounded-xl border border-[rgba(91,179,179,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center text-white font-semibold">
                  {videoData.instructor.avatar}
                </div>
                <div>
                  <p className="font-medium text-[#E8E0D5]">{videoData.instructor.name}</p>
                  <p className="text-sm text-[#6B7280]">{videoData.instructor.title}, {videoData.instructor.institution}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={hasLiked === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasLiked(hasLiked === true ? null : true)}
                  className={hasLiked === true ? "bg-[#7BA69E] text-white" : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful
                </Button>
                <Button
                  variant={hasLiked === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasLiked(hasLiked === false ? null : false)}
                  className={hasLiked === false ? "bg-[#E57373] text-white" : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC]"}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] mb-6">
            <CardContent className="p-4">
              <p className="text-[#A0B0BC]">{videoData.description}</p>
            </CardContent>
          </Card>
          
          {/* Timestamp Notes */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
                <StickyNote className="w-5 h-5 text-[#8B5CF6]" />
                My Notes
                <Badge variant="outline" className="ml-auto border-[rgba(91,179,179,0.2)] text-[#6B7280]">
                  {notes.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Note */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    placeholder="Add a note at current timestamp..."
                    className="w-full px-4 py-2.5 bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-lg text-[#E8E0D5] placeholder-[#6B7280] focus:border-[#8B5CF6] focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">
                    @ {formatTime(currentTime)}
                  </span>
                </div>
                <Button onClick={addNote} className="bg-[#8B5CF6] hover:bg-[#5BB3B3] text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Notes List */}
              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div 
                      key={note.id}
                      className="flex items-start gap-3 p-3 bg-[#3A4D5F] rounded-lg group"
                    >
                      <button
                        onClick={() => setCurrentTime(note.timestamp)}
                        className="text-[#8B5CF6] font-mono text-sm hover:underline shrink-0"
                      >
                        {formatTime(note.timestamp)}
                      </button>
                      <p className="text-sm text-[#A0B0BC] flex-1">{note.text}</p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#6B7280] hover:text-[#E57373] transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B7280] text-center py-4">
                  No notes yet. Add timestamps notes while watching!
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Resources */}
          <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
                <FileText className="w-5 h-5 text-[#5BB3B3]" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {videoData.resources.map((resource, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#3A4D5F] rounded-lg hover:bg-[#1a3048] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#5BB3B3]" />
                    <span className="text-[#E8E0D5] text-sm">{resource.title}</span>
                    {resource.size && (
                      <span className="text-xs text-[#6B7280]">{resource.size}</span>
                    )}
                  </div>
                  <Download className="w-4 h-4 text-[#6B7280]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        {showChapters && (
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Chapters */}
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
                  <List className="w-5 h-5 text-[#5BB3B3]" />
                  Chapters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-3">
                {videoData.chapters.map((chapter, i) => {
                  const isActive = activeChapter === chapter.id;
                  const isPast = parseTimestamp(chapter.timestamp) < currentTime;
                  
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => jumpToChapter(chapter.timestamp)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                        isActive 
                          ? 'bg-[#5BB3B3]/20 text-[#5BB3B3]' 
                          : isPast 
                            ? 'text-[#A0B0BC] hover:bg-[#3A4D5F]' 
                            : 'text-[#6B7280] hover:bg-[#3A4D5F] hover:text-[#A0B0BC]'
                      }`}
                    >
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
                <p className="text-sm text-[#A0B0BC] mb-3">
                  Ask questions about this lecture anytime. ATOM has the transcript and can help explain concepts.
                </p>
                <Link href={`/chat?video=${params.id}&t=${currentTime}`}>
                  <Button className="w-full bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask about this moment
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Related Videos */}
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[#E8E0D5]">Related Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                {videoData.relatedVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/watch/${video.id}`}
                    className="flex gap-3 p-2 rounded-lg hover:bg-[#3A4D5F] transition-colors"
                  >
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
            
            {/* Mark Complete */}
            <Button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`w-full ${
                isCompleted 
                  ? 'bg-[#7BA69E] hover:bg-[#047857] text-white' 
                  : 'bg-[#3A4D5F] hover:bg-[#1a3048] text-[#A0B0BC] border border-[rgba(91,179,179,0.15)]'
              }`}
            >
              {isCompleted ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Completed!
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          </aside>
        )}
      </div>
    </div>
  );
}
