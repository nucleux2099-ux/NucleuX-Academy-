"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Play, Pause, Volume2, Maximize2, ChevronDown, FileText, Bookmark, 
  HelpCircle, Send, Zap, Clock, BookOpen, User, MessageCircle,
} from "lucide-react";

// Classroom room color - Sky Blue
const roomColor = '#6BA8C9';

const lectures = [
  { id: 1, title: "Esophageal Surgery - Operative Techniques", instructor: "Dr. Rajesh Sharma", duration: "45:32", subject: "Surgery", textbook: "Shackelford Ch. 35", topics: ["Esophagectomy techniques", "Ivor Lewis procedure", "Transhiatal approach"] },
  { id: 2, title: "Portal Hypertension - Pathophysiology", instructor: "Dr. Priya Menon", duration: "38:15", subject: "Medicine", textbook: "Harrison's Ch. 337", topics: ["Portal pressure", "Varices", "TIPS procedure"] },
  { id: 3, title: "Pancreatic Surgery - Whipple Procedure", instructor: "Dr. Arun Kumar", duration: "52:18", subject: "Surgery", textbook: "Maingot's Ch. 28", topics: ["Anatomy", "Resection margins", "Reconstruction"] },
];

interface ChatMessage { role: "user" | "assistant"; content: string; }

const mockChatMessages: ChatMessage[] = [
  { role: "assistant", content: "I'm watching this lecture with you! Ask me anything about the current topic." },
];

export default function ClassroomPage() {
  const [selectedLecture, setSelectedLecture] = useState(lectures[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleAskAboutMoment = () => {
    const newMessage: ChatMessage = { role: "user", content: `What's happening at ${currentTime} in the lecture?` };
    setChatMessages([...chatMessages, newMessage]);
    setTimeout(() => {
      const response: ChatMessage = { role: "assistant", content: `At ${currentTime}, Dr. ${selectedLecture.instructor.split(" ")[1]} is explaining the key anatomical landmarks. This is critical!` };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    setTimeout(() => {
      const response: ChatMessage = { role: "assistant", content: `Based on ${selectedLecture.textbook}, here's what you need to know. Would you like me to elaborate?` };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.15)] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#6BA8C9]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#E8E0D5]">🎓 Classroom</h1>
            <p className="text-sm text-[#A0B0BC]">ATOM is watching with you</p>
          </div>
        </div>

        {/* Course Selector */}
        <div className="relative">
          <Button variant="outline" onClick={() => setShowCourseSelect(!showCourseSelect)} className="border-[rgba(91,179,179,0.15)] bg-[#364A5E] hover:bg-[#3A4D5F] text-[#E8E0D5]">
            <span className="mr-2">📚</span>
            {selectedLecture.subject}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          
          {showCourseSelect && (
            <div className="absolute right-0 mt-2 w-64 bg-[#364A5E] rounded-xl border border-[rgba(91,179,179,0.15)] shadow-lg z-10">
              {lectures.map((lecture) => (
                <button
                  key={lecture.id}
                  onClick={() => { setSelectedLecture(lecture); setShowCourseSelect(false); }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#3A4D5F] first:rounded-t-xl last:rounded-b-xl transition-colors ${selectedLecture.id === lecture.id ? "bg-[rgba(14,165,233,0.1)]" : ""}`}
                >
                  <p className="font-medium text-[#E8E0D5] text-sm">{lecture.title}</p>
                  <p className="text-xs text-[#A0B0BC]">{lecture.instructor}</p>
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
          <Card className="overflow-hidden border-[rgba(91,179,179,0.15)] bg-[#364A5E]">
            <div className="relative aspect-video bg-gradient-to-br from-[#3A4D5F] to-[#2D3E50] flex items-center justify-center group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#364A5E]/10 backdrop-blur flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                  </div>
                  <p className="text-white/60 text-sm">Click to {isPlaying ? "pause" : "play"}</p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white text-xs font-mono">{currentTime}</span>
                  <div className="flex-1 h-1.5 bg-[#364A5E]/20 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const minutes = Math.floor(percent * 45);
                    const seconds = Math.floor((percent * 45 * 60) % 60);
                    setCurrentTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                  }}>
                    <div className="h-full w-1/3 bg-[#6BA8C9] rounded-full" />
                  </div>
                  <span className="text-white text-xs font-mono">{selectedLecture.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-[#364A5E]/20" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-[#364A5E]/20"><Volume2 className="w-5 h-5" /></Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#364A5E]/20"><Maximize2 className="w-5 h-5" /></Button>
                </div>
              </div>
              <Badge className="absolute top-4 left-4 bg-[#6BA8C9] text-[#2D3E50] border-none"><Clock className="w-3 h-3 mr-1" />{selectedLecture.duration}</Badge>
            </div>
          </Card>

          {/* Lecture Info */}
          <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E] border-l-4" style={{ borderLeftColor: roomColor }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#E8E0D5] mb-1">📚 {selectedLecture.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-[#A0B0BC]">
                    <span className="flex items-center gap-1"><User className="w-4 h-4" />{selectedLecture.instructor}</span>
                    <span>•</span>
                    <span>{selectedLecture.subject}</span>
                    <span>•</span>
                    <Badge variant="outline" className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC]">{selectedLecture.textbook}</Badge>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#E8E0D5] mb-2">Topics covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLecture.topics.map((topic, i) => (
                    <Badge key={i} className="bg-[rgba(14,165,233,0.15)] text-[#6BA8C9] border-none">{topic}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-[rgba(91,179,179,0.15)] hover:bg-[#3A4D5F] text-[#A0B0BC]"><FileText className="w-4 h-4 mr-2" />Take Notes</Button>
                <Button variant="outline" className={`border-[rgba(91,179,179,0.15)] hover:bg-[#3A4D5F] ${isBookmarked ? "text-[#6BA8C9] bg-[rgba(14,165,233,0.1)]" : "text-[#A0B0BC]"}`} onClick={() => setIsBookmarked(!isBookmarked)}>
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />{isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" className="border-[rgba(91,179,179,0.15)] hover:bg-[#3A4D5F] text-[#A0B0BC]"><HelpCircle className="w-4 h-4 mr-2" />Generate Quiz</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ATOM Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-[rgba(91,179,179,0.15)] bg-[#364A5E] h-[calc(100vh-12rem)] flex flex-col sticky top-6">
            <CardHeader className="border-b border-[rgba(91,179,179,0.1)] bg-gradient-to-r from-[rgba(14,165,233,0.15)] to-[rgba(91,179,179,0.1)] rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6BA8C9] to-[#5BB3B3] flex items-center justify-center shadow-md">
                    <Zap className="w-5 h-5 text-[#2D3E50]" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#7BA69E] rounded-full border-2 border-[#364A5E]" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#E8E0D5]">ATOM Assistant</CardTitle>
                  <p className="text-xs text-[#A0B0BC]">Watching with you</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="p-4 border-b border-[rgba(91,179,179,0.1)]">
                <Button onClick={handleAskAboutMoment} className="w-full bg-[#6BA8C9] hover:bg-[#0284C7] text-[#2D3E50] shadow-md">
                  <MessageCircle className="w-4 h-4 mr-2" />Ask about this moment
                </Button>
                <p className="text-[10px] text-[#6B7280] text-center mt-2">Currently at {currentTime}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={`w-7 h-7 shrink-0 ${msg.role === "assistant" ? "bg-gradient-to-br from-[#6BA8C9] to-[#5BB3B3]" : "bg-[#6BA8C9]"}`}>
                      <AvatarFallback className="bg-transparent text-[#2D3E50] text-xs">{msg.role === "assistant" ? <Zap className="w-3 h-3" /> : "S"}</AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-[#6BA8C9] text-[#2D3E50] rounded-br-sm" : "bg-[#3A4D5F] border border-[rgba(91,179,179,0.1)] text-[#A0B0BC] rounded-bl-sm"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[rgba(91,179,179,0.1)] bg-[#364A5E]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about the lecture..."
                    className="flex-1 px-3 py-2 bg-[#3A4D5F] border border-[rgba(91,179,179,0.15)] rounded-lg text-sm text-[#E8E0D5] placeholder:text-[#A0B0BC] focus:outline-none focus:border-[#6BA8C9]"
                  />
                  <Button onClick={handleSendMessage} size="icon" className="bg-[#6BA8C9] hover:bg-[#0284C7] text-[#2D3E50] shrink-0">
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
