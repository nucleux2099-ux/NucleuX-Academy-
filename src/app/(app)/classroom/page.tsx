"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  ChevronDown,
  FileText,
  Bookmark,
  HelpCircle,
  Send,
  Zap,
  Clock,
  BookOpen,
  User,
  MessageCircle,
  Brain,
  Sparkles,
  Atom,
  Network,
  StickyNote,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// Classroom room color - Sky Blue
const roomColor = {
  primary: '#0EA5E9',
  light: '#F0F9FF',
  name: 'sky'
};

// Mock lecture data
const lectures = [
  {
    id: 1,
    title: "Esophageal Surgery - Operative Techniques",
    instructor: "Dr. Rajesh Sharma",
    duration: "45:32",
    subject: "Surgery",
    textbook: "Shackelford Ch. 35",
    thumbnail: "/lecture-thumb.jpg",
    topics: ["Esophagectomy techniques", "Ivor Lewis procedure", "Transhiatal approach", "Complications"],
    videoUrl: "#",
  },
  {
    id: 2,
    title: "Portal Hypertension - Pathophysiology",
    instructor: "Dr. Priya Menon",
    duration: "38:15",
    subject: "Medicine",
    textbook: "Harrison's Ch. 337",
    thumbnail: "/lecture-thumb-2.jpg",
    topics: ["Portal pressure", "Varices", "TIPS procedure", "Child-Pugh score"],
    videoUrl: "#",
  },
  {
    id: 3,
    title: "Pancreatic Surgery - Whipple Procedure",
    instructor: "Dr. Arun Kumar",
    duration: "52:18",
    subject: "Surgery",
    textbook: "Maingot's Ch. 28",
    thumbnail: "/lecture-thumb-3.jpg",
    topics: ["Anatomy", "Resection margins", "Reconstruction", "Post-op care"],
    videoUrl: "#",
  },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const mockChatMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "I'm watching this lecture with you! Ask me anything about the current topic.",
  },
];

export default function ClassroomPage() {
  const [selectedLecture, setSelectedLecture] = useState(lectures[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const handleAskAboutMoment = () => {
    const newMessage: ChatMessage = {
      role: "user",
      content: `What's happening at ${currentTime} in the lecture?`,
    };
    setChatMessages([...chatMessages, newMessage]);
    
    // Simulate ATOM response
    setTimeout(() => {
      const response: ChatMessage = {
        role: "assistant",
        content: `At ${currentTime}, Dr. ${selectedLecture.instructor.split(" ")[1]} is explaining the key anatomical landmarks for the ${selectedLecture.topics[0].toLowerCase()}. This is a critical step in the procedure!`,
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage: ChatMessage = {
      role: "user",
      content: chatInput,
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    
    // Simulate ATOM response
    setTimeout(() => {
      const response: ChatMessage = {
        role: "assistant",
        content: `Based on ${selectedLecture.textbook}, here's what you need to know: The procedure involves careful dissection and identification of key structures. Would you like me to elaborate on any specific aspect?`,
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="page-transition min-h-screen bg-gradient-to-b from-[#F0F9FF]/30 to-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">🎓 Classroom</h1>
            <p className="text-sm text-[#64748B]">ATOM is watching with you</p>
          </div>
        </div>

        {/* Course Selector */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowCourseSelect(!showCourseSelect)}
            className="border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#1E293B]"
          >
            <span className="mr-2">📚</span>
            {selectedLecture.subject}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          
          {showCourseSelect && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-[#E2E8F0] shadow-lg z-10">
              {lectures.map((lecture) => (
                <button
                  key={lecture.id}
                  onClick={() => {
                    setSelectedLecture(lecture);
                    setShowCourseSelect(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#F8FAFC] first:rounded-t-xl last:rounded-b-xl transition-colors ${
                    selectedLecture.id === lecture.id ? "bg-[#F3E8FF]" : ""
                  }`}
                >
                  <p className="font-medium text-[#1E293B] text-sm">{lecture.title}</p>
                  <p className="text-xs text-[#64748B]">{lecture.instructor}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <Card className="overflow-hidden border-[#E2E8F0] shadow-lg">
            <div 
              ref={videoRef}
              className="relative aspect-video bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center group"
            >
              {/* Placeholder Video Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform cursor-pointer"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </div>
                  <p className="text-white/60 text-sm">Click to {isPlaying ? "pause" : "play"}</p>
                </div>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white text-xs font-mono">{currentTime}</span>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percent = x / rect.width;
                      const minutes = Math.floor(percent * 45);
                      const seconds = Math.floor((percent * 45 * 60) % 60);
                      setCurrentTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                    }}
                  >
                    <div className="h-full w-1/3 bg-[#7C3AED] rounded-full" />
                  </div>
                  <span className="text-white text-xs font-mono">{selectedLecture.duration}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Lecture Badge */}
              <Badge className="absolute top-4 left-4 bg-[#7C3AED] text-white border-none">
                <Clock className="w-3 h-3 mr-1" />
                {selectedLecture.duration}
              </Badge>
            </div>
          </Card>

          {/* Lecture Info */}
          <Card className="border-[#E2E8F0] shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1E293B] mb-1">
                    📚 {selectedLecture.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedLecture.instructor}
                    </span>
                    <span>•</span>
                    <span>{selectedLecture.subject}</span>
                    <span>•</span>
                    <Badge variant="outline" className="border-[#E2E8F0] text-[#64748B]">
                      {selectedLecture.textbook}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#1E293B] mb-2">Topics covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLecture.topics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="bg-[#F3E8FF] text-[#7C3AED] border-none">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B]">
                  <FileText className="w-4 h-4 mr-2" />
                  Take Notes
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-[#E2E8F0] hover:bg-[#F8FAFC] ${isBookmarked ? "text-[#7C3AED] bg-[#F3E8FF]" : "text-[#1E293B]"}`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" className="border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B]">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Generate Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ATOM Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-[#E2E8F0] shadow-lg h-[calc(100vh-12rem)] flex flex-col sticky top-6">
            <CardHeader className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#F3E8FF] to-[#E0F2FE] rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-md">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#1E293B]">ATOM Assistant</CardTitle>
                  <p className="text-xs text-[#64748B]">Watching with you</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Ask About This Moment Button */}
              <div className="p-4 border-b border-[#E2E8F0]">
                <Button 
                  onClick={handleAskAboutMoment}
                  className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white shadow-md"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask about this moment
                </Button>
                <p className="text-[10px] text-[#94A3B8] text-center mt-2">
                  Currently at {currentTime}
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`w-7 h-7 shrink-0 ${
                      msg.role === "assistant" 
                        ? "bg-gradient-to-br from-[#7C3AED] to-[#06B6D4]" 
                        : "bg-[#7C3AED]"
                    }`}>
                      <AvatarFallback className="bg-transparent text-white text-xs">
                        {msg.role === "assistant" ? <Zap className="w-3 h-3" /> : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-[#7C3AED] text-white rounded-br-sm"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about the lecture..."
                    className="flex-1 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="icon" 
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
