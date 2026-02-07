"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  MessageSquare,
  Search,
  Plus,
  Send,
  ThumbsUp,
  CheckCircle,
  Clock,
  BookOpen,
  Stethoscope,
  Brain,
  Heart,
  Bone,
  Baby,
  Eye,
  Pill,
  Bug,
  Scale,
  ChevronRight,
  Crown,
  Flame,
  Star,
  TreePine,
  GraduationCap,
  Trophy,
  Target,
  Sparkles,
  Atom,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Community room color - Amber
const roomColor = {
  primary: '#B45309',
  light: '#FFFBEB',
  name: 'amber'
};

// Study Groups Data - Real Indian Medical Student Groups
const myGroups = [
  {
    id: 1,
    name: "NEET-PG Warriors 2026",
    members: 1847,
    avatar: "🎯",
    unread: 12,
    lastActive: "Just now",
    description: "Daily MCQ discussions, doubt clearing, motivation",
    challenge: { name: "Complete 100 MCQs Daily", progress: 72, total: 100, participants: 234 },
  },
  {
    id: 2,
    name: "Surgery Enthusiasts",
    members: 456,
    avatar: "⚕️",
    unread: 5,
    lastActive: "5 mins ago",
    description: "For those passionate about surgical sciences",
    challenge: { name: "Finish Bailey & Love", progress: 45, total: 100, participants: 89 },
  },
  {
    id: 3,
    name: "CMC Vellore Batch 2021",
    members: 124,
    avatar: "🏥",
    unread: 3,
    lastActive: "1 hr ago",
    description: "Official batch group",
    challenge: null,
  },
  {
    id: 4,
    name: "Andhra Medicos United",
    members: 892,
    avatar: "🌟",
    unread: 0,
    lastActive: "2 hrs ago",
    description: "Telugu-speaking medical aspirants",
    challenge: { name: "State PG Mock Test", progress: 60, total: 100, participants: 156 },
  },
];

const suggestedGroups = [
  { id: 5, name: "Cardiology Deep Dive", members: 234, avatar: "❤️", category: "Medicine", description: "ECG, Echo, interventions" },
  { id: 6, name: "AIIMS Aspirants 2026", members: 2341, avatar: "🏛️", category: "Exam Prep", description: "INICET focused preparation" },
  { id: 7, name: "Pharma Made Simple", members: 567, avatar: "💊", category: "Pharmacology", description: "Drug mnemonics & mechanisms" },
  { id: 8, name: "Path Revision Circle", members: 789, avatar: "🔬", category: "Pathology", description: "Robbins discussion group" },
];

// Real chat messages - Indian medical student context
const chatMessages = [
  { 
    id: 1, 
    user: "Priya Sharma", 
    avatar: "PS", 
    college: "AIIMS Delhi",
    message: "Guys, that Hepatobiliary surgery question in today's NEET mock was brutal! 😅", 
    time: "10:30 AM", 
    isOwn: false,
    reactions: { "😅": 12, "💯": 5 }
  },
  { 
    id: 2, 
    user: "Rahul Menon", 
    avatar: "RM", 
    college: "CMC Vellore",
    message: "Which one? The Whipple procedure complications one? I got confused between pancreatic fistula and delayed gastric emptying.", 
    time: "10:32 AM", 
    isOwn: false,
    reactions: { "🤔": 8 }
  },
  { 
    id: 3, 
    user: "You", 
    avatar: "SC", 
    college: "GMC Kadapa",
    message: "Same here! I went with pancreatic fistula since it's the most common early complication. The explanation said DGE is more late onset.", 
    time: "10:35 AM", 
    isOwn: true,
    reactions: { "👍": 15, "💡": 7 }
  },
  { 
    id: 4, 
    user: "Sneha Patel", 
    avatar: "SP", 
    college: "KMC Manipal",
    message: "Pro tip: Remember 'FADED' for Whipple complications - Fistula, Abscess, DGE, Enteric leak, Diabetes. Helped me a lot!", 
    time: "10:38 AM", 
    isOwn: false,
    reactions: { "🙏": 23, "📝": 11, "❤️": 8 }
  },
  { 
    id: 5, 
    user: "Dr. Amit Kumar", 
    avatar: "AK", 
    college: "JIPMER",
    badge: "Mentor",
    message: "Great mnemonic Sneha! Also remember, the mortality rate for Whipple has come down to <5% in high-volume centers. This is often tested.", 
    time: "10:42 AM", 
    isOwn: false,
    reactions: { "🎓": 34, "👍": 18 }
  },
];

// Forum Categories with real counts
const forumCategories = [
  { id: "surgery", name: "Surgery", icon: Scale, threads: 1892, color: "#DC2626", hot: true },
  { id: "medicine", name: "Medicine", icon: Stethoscope, threads: 2456, color: "#7C3AED", hot: true },
  { id: "pathology", name: "Pathology", icon: Bug, threads: 1234, color: "#059669" },
  { id: "pharmacology", name: "Pharmacology", icon: Pill, threads: 987, color: "#D97706" },
  { id: "anatomy", name: "Anatomy", icon: Bone, threads: 756, color: "#0891B2" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, threads: 543, color: "#DB2777" },
  { id: "obg", name: "OBG", icon: Heart, threads: 678, color: "#7C3AED" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, threads: 321, color: "#0D9488" },
];

// Real discussion threads
const recentThreads = [
  {
    id: 1,
    title: "How to approach Hepatobiliary surgery questions in NEET-PG?",
    category: "Surgery",
    author: "DrAspirant2026",
    authorCollege: "MAMC Delhi",
    replies: 67,
    views: 1234,
    time: "2 hours ago",
    hot: true,
    lastReply: { user: "SurgeryGuru", message: "Focus on Tokyo Guidelines and Child-Pugh score..." }
  },
  {
    id: 2,
    title: "Best resources for Pharmacology - KDT vs Rang & Dale?",
    category: "Pharmacology",
    author: "MedStudent_Priya",
    authorCollege: "GMC Mumbai",
    replies: 89,
    views: 2341,
    time: "4 hours ago",
    hot: true,
    lastReply: { user: "PharmaMaster", message: "For NEET, KDT is sufficient. But for concepts..." }
  },
  {
    id: 3,
    title: "Surgical anatomy of inguinal region - Can someone explain Hesselbach's triangle?",
    category: "Anatomy",
    author: "AnatomyNewbie",
    authorCollege: "KGMU Lucknow",
    replies: 34,
    views: 567,
    time: "6 hours ago",
    hot: false,
    lastReply: { user: "DrAnatomist", message: "Boundaries: Inguinal ligament, inferior epigastric..." }
  },
  {
    id: 4,
    title: "NEET-PG 2026 - Final 3 months strategy discussion",
    category: "Exam Strategy",
    author: "NEET_Warrior",
    authorCollege: "AIIMS Jodhpur",
    replies: 156,
    views: 4567,
    time: "1 day ago",
    hot: true,
    lastReply: { user: "Rank500", message: "In my experience, last 3 months should be pure revision..." }
  },
  {
    id: 5,
    title: "Differentiating Crohn's vs UC - Clinical pearls needed",
    category: "Medicine",
    author: "GI_Enthusiast",
    authorCollege: "Stanley MC Chennai",
    replies: 45,
    views: 890,
    time: "8 hours ago",
    hot: false,
    lastReply: { user: "MedicineExpert", message: "Key points: Skip lesions, cobblestone appearance..." }
  },
];

// Peer Q&A Data - Real medical doubts
const questions = [
  {
    id: 1,
    title: "Why is INR used for warfarin monitoring but not for heparin?",
    body: "I understand both affect coagulation, but why different tests? APTT for heparin and INR for warfarin - what's the logic?",
    author: "PharmaCurious_Raj",
    authorCollege: "JIPMER",
    authorAvatar: "PR",
    votes: 45,
    answers: 3,
    time: "2 hours ago",
    tags: ["Pharmacology", "Anticoagulants", "Hematology"],
    accepted: true,
    bestAnswer: "Because warfarin affects Vitamin K-dependent factors (II, VII, IX, X) which are in extrinsic pathway..."
  },
  {
    id: 2,
    title: "Clinical approach to a patient with obstructive jaundice - Step by step?",
    body: "I always get confused with the workup. USG first or CT? When to do MRCP vs ERCP? Need a clear algorithm.",
    author: "SurgeryAspirant_Kavitha",
    authorCollege: "CMC Vellore",
    authorAvatar: "KS",
    votes: 67,
    answers: 5,
    time: "4 hours ago",
    tags: ["Surgery", "Hepatobiliary", "Clinical Medicine"],
    accepted: true,
  },
  {
    id: 3,
    title: "Difference between Cushing's syndrome and Cushing's disease?",
    body: "I know one is a syndrome and one is specifically pituitary, but I keep mixing them up in MCQs. Can someone give a clear differentiation?",
    author: "EndoConfused_Arjun",
    authorCollege: "AIIMS Delhi",
    authorAvatar: "AC",
    votes: 34,
    answers: 2,
    time: "6 hours ago",
    tags: ["Medicine", "Endocrinology"],
    accepted: false,
  },
  {
    id: 4,
    title: "McBurney's vs Lanz incision for appendectomy - When to use which?",
    body: "Both are used for open appendectomy. Is there any specific indication for choosing one over the other? Or is it surgeon preference?",
    author: "SurgeryNewbie_Vikram",
    authorCollege: "Grant MC Mumbai",
    authorAvatar: "VK",
    votes: 28,
    answers: 4,
    time: "8 hours ago",
    tags: ["Surgery", "Appendix", "Operative"],
    accepted: true,
  },
  {
    id: 5,
    title: "Calculating creatinine clearance - Cockcroft-Gault vs MDRD?",
    body: "When should I use which formula? And what about CKD-EPI? Getting confused with so many equations!",
    author: "NephroLearner_Deepa",
    authorCollege: "MMC Chennai",
    authorAvatar: "DN",
    votes: 52,
    answers: 0,
    time: "1 hour ago",
    tags: ["Medicine", "Nephrology", "Clinical"],
    accepted: false,
  },
];

// Active Challenges
const activeChallenges = [
  {
    id: 1,
    title: "Surgery Week Marathon",
    description: "Complete 500 Surgery MCQs this week",
    progress: 234,
    total: 500,
    participants: 1234,
    endsIn: "3 days",
    prize: "🏆 Top 10 get Premium Week",
  },
  {
    id: 2,
    title: "Perfect Score Challenge",
    description: "Score 100% in any 20-question test",
    progress: 0,
    total: 1,
    participants: 567,
    endsIn: "5 days",
    prize: "🎖️ Exclusive Badge",
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("groups");
  const [selectedGroup, setSelectedGroup] = useState(myGroups[0]);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#059669]/10 flex items-center justify-center">
              <TreePine className="w-6 h-6 text-[#059669]" />
            </div>
            Common Room
          </h1>
          <p className="text-[#64748B] mt-1 ml-15">
            Connect with fellow aspirants, discuss doubts, and learn together
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#059669]/10 text-[#059669] border-[#059669]/20 px-3 py-1.5 font-medium">
            <Users className="w-4 h-4 mr-1.5" />
            12,456 Students Online
          </Badge>
        </div>
      </div>

      {/* Active Challenges Banner */}
      <Card className="bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#F5F3FF] border-[#FDE68A]/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 shrink-0">
              <Trophy className="w-5 h-5 text-[#D97706]" />
              <span className="font-semibold text-[#1E293B]">Active Challenges:</span>
            </div>
            {activeChallenges.map((challenge) => (
              <div key={challenge.id} className="shrink-0 bg-white rounded-xl p-3 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer min-w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-[#1E293B]">{challenge.title}</span>
                  <Badge className="bg-[#FEE2E2] text-[#DC2626] border-none text-xs">{challenge.endsIn}</Badge>
                </div>
                <Progress value={(challenge.progress / challenge.total) * 100} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>{challenge.progress}/{challenge.total}</span>
                  <span>{challenge.participants} participating</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-[#E2E8F0] p-1.5 rounded-xl shadow-sm">
          <TabsTrigger 
            value="groups" 
            className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <Users className="w-4 h-4 mr-2" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger 
            value="forums"
            className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Forums
          </TabsTrigger>
          <TabsTrigger 
            value="qna"
            className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <Brain className="w-4 h-4 mr-2" />
            Doubt Clearing
          </TabsTrigger>
        </TabsList>

        {/* Study Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Groups List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1E293B]">My Groups</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]">
                    <Search className="w-4 h-4 mr-1" />
                    Find
                  </Button>
                  <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20">
                    <Plus className="w-4 h-4 mr-1" />
                    Create
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {myGroups.map((group) => (
                  <Card
                    key={group.id}
                    className={`bg-white border-[#E2E8F0] cursor-pointer transition-all hover:shadow-lg hover:border-[#7C3AED]/30 ${
                      selectedGroup.id === group.id ? "border-[#7C3AED] shadow-lg shadow-[#7C3AED]/10 ring-1 ring-[#7C3AED]/20" : "shadow-sm"
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#0891B2]/10 flex items-center justify-center text-2xl shadow-sm">
                          {group.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#1E293B] truncate">{group.name}</h3>
                            {group.unread > 0 && (
                              <Badge className="bg-[#DC2626] text-white text-xs px-1.5 py-0 shadow-sm">
                                {group.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#94A3B8] truncate">{group.description}</p>
                          <p className="text-sm text-[#64748B] mt-1">
                            {group.members.toLocaleString()} members • {group.lastActive}
                          </p>
                          {group.challenge && (
                            <div className="mt-2 p-2 bg-[#FFFBEB] rounded-lg border border-[#FDE68A]/50">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-[#D97706] font-medium flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {group.challenge.name}
                                </span>
                                <span className="text-[#64748B]">{group.challenge.progress}%</span>
                              </div>
                              <Progress value={group.challenge.progress} className="h-1.5" />
                              <p className="text-[10px] text-[#94A3B8] mt-1">{group.challenge.participants} participating</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Suggested Groups */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-semibold text-[#64748B] mb-3">Recommended for You</h3>
                <div className="space-y-2">
                  {suggestedGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:bg-white transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{group.avatar}</span>
                        <div>
                          <p className="font-medium text-sm text-[#1E293B]">{group.name}</p>
                          <p className="text-xs text-[#64748B]">{group.members.toLocaleString()} members • {group.category}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10">
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <Card className="lg:col-span-2 bg-white border-[#E2E8F0] shadow-lg flex flex-col h-[650px]">
              <CardHeader className="border-b border-[#E2E8F0] pb-4 bg-[#F8FAFC] rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#0891B2]/10 flex items-center justify-center text-xl shadow-sm">
                      {selectedGroup.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#1E293B]">{selectedGroup.name}</CardTitle>
                      <p className="text-sm text-[#64748B]">{selectedGroup.members.toLocaleString()} members • {selectedGroup.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-[#059669]/10 text-[#059689] border-none">
                      <span className="w-2 h-2 bg-[#059669] rounded-full mr-1.5 animate-pulse" />
                      234 online
                    </Badge>
                    <Button size="sm" variant="outline" className="border-[#E2E8F0] hover:bg-white">
                      <Users className="w-4 h-4 text-[#64748B]" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4 bg-[#FAFBFC]">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-9 h-9 shadow-sm shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-[#7C3AED]/20 to-[#0891B2]/20 text-[#7C3AED] text-sm font-medium">
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[75%] ${msg.isOwn ? "items-end" : ""}`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                          {!msg.isOwn && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-[#1E293B]">{msg.user}</span>
                              {msg.badge && (
                                <Badge className="bg-[#7C3AED] text-white text-[10px] px-1.5 py-0">{msg.badge}</Badge>
                              )}
                              <span className="text-[10px] text-[#94A3B8]">• {msg.college}</span>
                            </div>
                          )}
                          <span className="text-xs text-[#94A3B8]">{msg.time}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${
                            msg.isOwn
                              ? "bg-[#7C3AED] text-white rounded-br-md"
                              : "bg-white border border-[#E2E8F0] text-[#1E293B] rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        {msg.reactions && (
                          <div className={`flex gap-1 mt-1 ${msg.isOwn ? "justify-end" : ""}`}>
                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                              <span key={emoji} className="text-xs bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded-full shadow-sm cursor-pointer hover:bg-[#F8FAFC]">
                                {emoji} {count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-[#E2E8F0] bg-white rounded-b-xl">
                <div className="flex gap-3">
                  <Input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#7C3AED] focus:ring-[#7C3AED]/20"
                  />
                  <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] px-4 shadow-md shadow-[#7C3AED]/20">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Forums Tab */}
        <TabsContent value="forums" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1E293B]">Categories</h2>
              </div>
              <div className="space-y-2">
                {forumCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                      </div>
                      <div>
                        <span className="font-medium text-[#1E293B] flex items-center gap-1">
                          {cat.name}
                          {cat.hot && <Flame className="w-3 h-3 text-[#DC2626]" />}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-full">{cat.threads.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Threads List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-[#E2E8F0] focus:border-[#7C3AED]"
                  />
                </div>
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] shadow-md shadow-[#7C3AED]/20">
                  <Plus className="w-4 h-4 mr-2" />
                  New Thread
                </Button>
              </div>

              <div className="space-y-3">
                {recentThreads.map((thread) => (
                  <Card
                    key={thread.id}
                    className="bg-white border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-lg cursor-pointer transition-all shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 min-w-[60px] p-2 bg-[#F8FAFC] rounded-xl">
                          <span className="text-2xl font-bold text-[#7C3AED]">{thread.replies}</span>
                          <span className="text-xs text-[#64748B]">replies</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="font-semibold text-[#1E293B] hover:text-[#7C3AED] transition-colors">
                              {thread.title}
                            </h3>
                            {thread.hot && (
                              <Badge className="bg-[#FEE2E2] text-[#DC2626] border-none text-xs font-medium">
                                <Flame className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[#64748B] flex-wrap">
                            <span className="flex items-center gap-1 bg-[#F8FAFC] px-2 py-0.5 rounded-full">
                              <BookOpen className="w-3 h-3" />
                              {thread.category}
                            </span>
                            <span>by {thread.author}</span>
                            <span className="text-[#94A3B8]">• {thread.authorCollege}</span>
                            <span>{thread.views.toLocaleString()} views</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {thread.time}
                            </span>
                          </div>
                          {thread.lastReply && (
                            <div className="mt-2 p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                              <p className="text-xs text-[#64748B] truncate">
                                <span className="font-medium text-[#1E293B]">{thread.lastReply.user}:</span> {thread.lastReply.message}
                              </p>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button variant="outline" className="border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]">
                  Load More Discussions
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Peer Q&A Tab */}
        <TabsContent value="qna" className="space-y-6">
          {/* Ask Question Banner */}
          <Card className="bg-gradient-to-r from-[#7C3AED]/5 via-[#0891B2]/5 to-[#059669]/5 border-[#7C3AED]/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-[#7C3AED]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1E293B]">Stuck on a concept?</h2>
                    <p className="text-[#64748B] mt-0.5">
                      Get answers from seniors, mentors, and fellow aspirants within hours
                    </p>
                  </div>
                </div>
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] px-6 shadow-lg shadow-[#7C3AED]/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask a Doubt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#7C3AED] text-white cursor-pointer px-4 py-1.5 shadow-md">All Questions</Badge>
            <Badge className="bg-white hover:bg-[#F8FAFC] cursor-pointer px-4 py-1.5 border border-[#E2E8F0] text-[#64748B]">
              Unanswered ({questions.filter(q => q.answers === 0).length})
            </Badge>
            <Badge className="bg-white hover:bg-[#F8FAFC] cursor-pointer px-4 py-1.5 border border-[#E2E8F0] text-[#64748B]">
              My Questions
            </Badge>
            <Badge className="bg-white hover:bg-[#F8FAFC] cursor-pointer px-4 py-1.5 border border-[#E2E8F0] text-[#64748B]">
              Most Voted
            </Badge>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((q) => (
              <Card
                key={q.id}
                className="bg-white border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-lg cursor-pointer transition-all shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 min-w-[70px]">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-10 h-10 p-0 border-[#E2E8F0] hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/5"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-lg text-[#1E293B]">{q.votes}</span>
                      <div className={`text-center px-3 py-1 rounded-lg ${q.accepted ? "bg-[#DCFCE7] text-[#059669]" : q.answers === 0 ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#F8FAFC] text-[#64748B]"}`}>
                        {q.accepted ? (
                          <CheckCircle className="w-5 h-5 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium">{q.answers}</span>
                        )}
                        <span className="text-xs block">{q.accepted ? "solved" : q.answers === 0 ? "waiting" : "answers"}</span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1E293B] hover:text-[#7C3AED] transition-colors">
                        {q.title}
                      </h3>
                      <p className="text-[#64748B] text-sm mt-2 line-clamp-2">{q.body}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {q.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-xs hover:bg-[#7C3AED]/5 hover:text-[#7C3AED] hover:border-[#7C3AED]/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-[#64748B]">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gradient-to-br from-[#7C3AED]/20 to-[#0891B2]/20 text-[#7C3AED] text-xs font-medium">
                              {q.authorAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-[#1E293B]">{q.author}</span>
                          <span className="text-[#94A3B8]">• {q.authorCollege}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {q.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Contributors */}
          <Card className="bg-white border-[#E2E8F0] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-b border-[#FDE68A]/30 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-[#1E293B]">
                <Star className="w-5 h-5 text-[#D97706]" />
                Top Helpers This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { rank: 1, name: "Dr. Sharma", college: "AIIMS Delhi", answers: 45, helpful: 156, badge: "🥇" },
                  { rank: 2, name: "Priya Menon", college: "CMC Vellore", answers: 38, helpful: 128, badge: "🥈" },
                  { rank: 3, name: "Rahul Verma", college: "MAMC Delhi", answers: 31, helpful: 98, badge: "🥉" },
                  { rank: 4, name: "Dr. Kavitha", college: "JIPMER", answers: 27, helpful: 87, badge: "⭐" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-md transition-all"
                  >
                    <span className="text-2xl">{user.badge}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1E293B] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#94A3B8] truncate">{user.college}</p>
                      <p className="text-xs text-[#64748B]">
                        {user.answers} answers • {user.helpful} helpful
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
