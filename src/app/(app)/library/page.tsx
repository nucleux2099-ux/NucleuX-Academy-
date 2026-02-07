"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/Skeleton";
import { EmptySearch } from "@/components/EmptyState";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Filter, BookOpen, FileText, Video, Clock, Star, Grid, List, 
  StickyNote, BookMarked, Library, Bookmark, History, ChevronRight, 
  GraduationCap, Stethoscope, Pill, Bug, Bone,
  Scale, Sparkles, Route, ArrowRight, Play, CheckCircle, Target,
} from "lucide-react";

// Library room color - Green
const roomColor = '#059669';

// Subject categories
const subjects = [
  { id: "all", name: "All", count: 8456, icon: Library, color: "#059669" },
  { id: "surgery", name: "Surgery", count: 1892, icon: Scale, color: "#DC2626" },
  { id: "medicine", name: "Medicine", count: 2456, icon: Stethoscope, color: "#7C3AED" },
  { id: "pathology", name: "Pathology", count: 1234, icon: Bug, color: "#059669" },
  { id: "pharmacology", name: "Pharmacology", count: 987, icon: Pill, color: "#D97706" },
  { id: "anatomy", name: "Anatomy", count: 756, icon: Bone, color: "#0891B2" },
];

// Textbooks
const textbooks = [
  { id: "harrison", title: "Harrison's Principles of Internal Medicine", edition: "22nd Edition", chapters: 505, pages: 4273, icon: "📘", category: "Medicine", progress: 23, color: "#7C3AED" },
  { id: "bailey", title: "Bailey & Love's Short Practice of Surgery", edition: "28th Edition", chapters: 92, pages: 1624, icon: "📕", category: "Surgery", progress: 45, color: "#DC2626" },
  { id: "robbins", title: "Robbins & Cotran Pathologic Basis of Disease", edition: "10th Edition", chapters: 29, pages: 1392, icon: "📗", category: "Pathology", progress: 67, color: "#059669" },
  { id: "kdt", title: "KD Tripathi Essentials of Pharmacology", edition: "8th Edition", chapters: 68, pages: 1056, icon: "📙", category: "Pharmacology", progress: 34, color: "#D97706" },
  { id: "grays", title: "Gray's Anatomy for Students", edition: "4th Edition", chapters: 12, pages: 1180, icon: "📘", category: "Anatomy", progress: 56, color: "#0891B2" },
];

// Study materials
const materials = [
  { id: 1, title: "Acute Pancreatitis - Harrison's Ch. 340", category: "Medicine", source: "Harrison's Principles", type: "Note", duration: "35 min read", rating: 4.9, progress: 100, starred: true, icon: FileText, topics: ["Ranson's Criteria", "CT Severity Index"], lastRead: "2 hours ago" },
  { id: 2, title: "Portal Hypertension - Pathophysiology & Management", category: "Surgery", source: "Blumgart's Ch. 23", type: "Note", duration: "45 min read", rating: 4.8, progress: 65, starred: true, icon: FileText, topics: ["Child-Pugh Score", "TIPS"], lastRead: "Yesterday" },
  { id: 3, title: "Thyroid Carcinoma - Classification & Staging", category: "Surgery", source: "Bailey & Love Ch. 51", type: "Note", duration: "30 min read", rating: 4.7, progress: 40, starred: false, icon: FileText, topics: ["TNM Staging", "Papillary vs Follicular"], lastRead: "3 days ago" },
  { id: 4, title: "Laparoscopic Cholecystectomy - Step-by-Step", category: "Surgery", source: "SAGES Manual", type: "Video", duration: "18 min watch", rating: 4.9, progress: 100, starred: true, icon: Video, topics: ["Critical View of Safety"], lastRead: "1 week ago" },
  { id: 5, title: "Heart Failure - Pathophysiology & Treatment", category: "Medicine", source: "Harrison's Ch. 256", type: "Note", duration: "40 min read", rating: 4.6, progress: 80, starred: false, icon: FileText, topics: ["HFrEF vs HFpEF", "ACE Inhibitors"], lastRead: "4 days ago" },
  { id: 6, title: "Inguinal Hernia - Anatomy & Repair", category: "Surgery", source: "Bailey & Love Ch. 57", type: "Note", duration: "35 min read", rating: 4.9, progress: 100, starred: false, icon: FileText, topics: ["Hesselbach's Triangle"], lastRead: "Today" },
];

// Pathways data
const pathways = [
  { id: 1, title: "Surgical GI Mastery", description: "Complete pathway for GI surgery preparation", topics: 24, hours: 48, progress: 65, status: "active", color: "#DC2626", icon: "🔪", difficulty: "Advanced" },
  { id: 2, title: "Internal Medicine Foundations", description: "Core concepts for NEET-PG Medicine", topics: 36, hours: 72, progress: 45, status: "active", color: "#7C3AED", icon: "🩺", difficulty: "Intermediate" },
  { id: 3, title: "Pathology Quick Review", description: "High-yield pathology for exams", topics: 18, hours: 24, progress: 100, status: "completed", color: "#059669", icon: "🔬", difficulty: "Beginner" },
  { id: 4, title: "Pharmacology Essentials", description: "Drug classifications and mechanisms", topics: 28, hours: 36, progress: 20, status: "active", color: "#D97706", icon: "💊", difficulty: "Intermediate" },
  { id: 5, title: "Anatomy Atlas Journey", description: "Visual anatomy learning path", topics: 12, hours: 18, progress: 0, status: "not-started", color: "#0891B2", icon: "🦴", difficulty: "Beginner" },
];

// Bookmarks & Recent
const bookmarks = [
  { title: "Portal Hypertension - Child-Pugh Score", source: "Blumgart's", category: "Surgery" },
  { title: "Thyroid Carcinoma - TNM Staging", source: "Bailey & Love", category: "Surgery" },
  { title: "DKA - Anion Gap Calculation", source: "Harrison's", category: "Medicine" },
];

const recentlyRead = [
  { title: "Acute Pancreatitis - Harrison's Ch. 340", time: "2 hours ago", progress: 100 },
  { title: "Portal Hypertension - Blumgart's Ch. 23", time: "Yesterday", progress: 65 },
  { title: "Inguinal Hernia - Bailey & Love Ch. 57", time: "Today", progress: 100 },
];

export default function LibraryPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = selectedSubject === "all" || m.category.toLowerCase() === selectedSubject;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(5,150,105,0.15)] flex items-center justify-center">
              <Library className="w-6 h-6 text-[#059669]" />
            </div>
            Medical Library
          </h1>
          <p className="text-[#9CA3AF] mt-1">24 textbooks • 8,456 notes • Standard references cited</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[rgba(5,150,105,0.3)] text-[#059669] hover:bg-[rgba(5,150,105,0.1)]" onClick={() => router.push('/chat?context=library')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Ask ATOM
          </Button>
          <Button onClick={() => setShowNoteModal(true)} className="bg-[#059669] hover:bg-[#047857] text-white shadow-lg shadow-[#059669]/20">
            <StickyNote className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#0F2233] border border-[rgba(6,182,212,0.15)] p-1.5 rounded-xl">
          <TabsTrigger value="browse" className="data-[state=active]:bg-[#059669] data-[state=active]:text-white px-6 rounded-lg text-[#9CA3AF]">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="pathways" className="data-[state=active]:bg-[#059669] data-[state=active]:text-white px-6 rounded-lg text-[#9CA3AF]">
            <Route className="w-4 h-4 mr-2" />
            Pathways
          </TabsTrigger>
          <TabsTrigger value="textbooks" className="data-[state=active]:bg-[#059669] data-[state=active]:text-white px-6 rounded-lg text-[#9CA3AF]">
            <GraduationCap className="w-4 h-4 mr-2" />
            Textbooks
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-[#059669] data-[state=active]:text-white px-6 rounded-lg text-[#9CA3AF]">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="recent" className="data-[state=active]:bg-[#059669] data-[state=active]:text-white px-6 rounded-lg text-[#9CA3AF]">
            <History className="w-4 h-4 mr-2" />
            Recent
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search notes, topics, chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#142538] border-[rgba(6,182,212,0.15)] text-[#E5E7EB] placeholder:text-[#9CA3AF] focus:border-[#059669]"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#0F2233] border border-[rgba(6,182,212,0.15)] rounded-lg flex items-center gap-2 hover:border-[#059669] transition-all text-[#9CA3AF]">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <div className="flex bg-[#0F2233] border border-[rgba(6,182,212,0.15)] rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#059669] text-white" : "hover:bg-[#142538] text-[#9CA3AF]"}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#059669] text-white" : "hover:bg-[#142538] text-[#9CA3AF]"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Subject Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedSubject === subject.id
                    ? "bg-[#059669] text-white shadow-lg shadow-[#059669]/20"
                    : "bg-[#0F2233] text-[#9CA3AF] hover:text-[#E5E7EB] border border-[rgba(6,182,212,0.15)] hover:border-[#059669]"
                }`}
              >
                <subject.icon className="w-4 h-4" />
                {subject.name}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedSubject === subject.id ? "bg-[#0F2233]/20" : "bg-[#142538]"}`}>
                  {subject.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          {isLoading ? (
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredMaterials.map((material) => (
                <Card
                  key={material.id}
                  onClick={() => router.push(`/library/${material.id}`)}
                  className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] border-l-4 hover:border-[rgba(5,150,105,0.3)] cursor-pointer group transition-all room-transition"
                  style={{ borderLeftColor: roomColor }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg transition-transform group-hover:scale-110 ${material.type === "Video" ? "bg-[rgba(245,158,11,0.15)]" : "bg-[rgba(5,150,105,0.15)]"}`}>
                        <material.icon className="w-5 h-5" style={{ color: material.type === "Video" ? "#F59E0B" : roomColor }} />
                      </div>
                      <button className="p-1 hover:bg-[#142538] rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Star className={`w-4 h-4 transition-colors ${material.starred ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#9CA3AF] hover:text-[#F59E0B]"}`} />
                      </button>
                    </div>
                    <h3 className="font-semibold mb-1 text-[#E5E7EB] group-hover:text-[#059669] transition-colors line-clamp-2">{material.title}</h3>
                    <p className="text-xs text-[#6B7280] mb-3">📚 {material.source}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} className="bg-[#142538] text-[#9CA3AF] border-[rgba(6,182,212,0.1)] text-xs">{topic}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-[#142538] text-[#9CA3AF] border-[rgba(6,182,212,0.1)]">{material.category}</Badge>
                      <span className="text-xs text-[#6B7280] flex items-center gap-1">
                        <Clock className="w-3 h-3" />{material.duration}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#9CA3AF]">Progress</span>
                        <span className={material.progress === 100 ? "text-[#059669] font-medium" : "text-[#E5E7EB]"}>{material.progress}%</span>
                      </div>
                      <Progress value={material.progress} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="font-medium text-[#E5E7EB]">{material.rating}</span>
                      </div>
                      <span className="text-xs text-[#6B7280]">{material.lastRead}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && filteredMaterials.length === 0 && searchQuery && <EmptySearch query={searchQuery} />}
        </TabsContent>

        {/* Pathways Tab */}
        <TabsContent value="pathways" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#E5E7EB]">Learning Pathways</h2>
              <p className="text-[#9CA3AF] text-sm">Structured learning paths curated by ATOM</p>
            </div>
            <Button className="bg-[#059669] hover:bg-[#047857] text-white">
              <Route className="w-4 h-4 mr-2" />
              Create Custom Path
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathways.map((pathway) => (
              <Card 
                key={pathway.id} 
                className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] border-l-4 hover:border-[rgba(6,182,212,0.3)] cursor-pointer group transition-all room-transition"
                style={{ borderLeftColor: pathway.color }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{pathway.icon}</div>
                    <Badge className={`border-none text-xs ${
                      pathway.status === 'completed' ? 'bg-[rgba(5,150,105,0.2)] text-[#059669]' :
                      pathway.status === 'active' ? 'bg-[rgba(14,165,233,0.2)] text-[#0EA5E9]' :
                      'bg-[#142538] text-[#9CA3AF]'
                    }`}>
                      {pathway.status === 'completed' ? 'Completed' : pathway.status === 'active' ? 'In Progress' : 'Not Started'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#059669] transition-colors mb-1">{pathway.title}</h3>
                  <p className="text-sm text-[#6B7280] mb-3">{pathway.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-3">
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" />{pathway.topics} topics</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pathway.hours}h</span>
                    <Badge className="bg-[#142538] border-[rgba(6,182,212,0.1)] text-[#9CA3AF]">{pathway.difficulty}</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#9CA3AF]">Progress</span>
                      <span className={pathway.progress === 100 ? "text-[#059669] font-medium" : "text-[#E5E7EB]"}>{pathway.progress}%</span>
                    </div>
                    <Progress value={pathway.progress} className="h-2" />
                  </div>
                  <Button 
                    className="w-full" 
                    style={{ backgroundColor: pathway.status === 'completed' ? '#142538' : pathway.color, color: pathway.status === 'completed' ? '#9CA3AF' : '#0D1B2A' }}
                  >
                    {pathway.status === 'completed' ? (
                      <><CheckCircle className="w-4 h-4 mr-2" />Review</>
                    ) : pathway.status === 'active' ? (
                      <><Play className="w-4 h-4 mr-2" />Continue</>
                    ) : (
                      <><ArrowRight className="w-4 h-4 mr-2" />Start</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Textbooks Tab */}
        <TabsContent value="textbooks" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {textbooks.map((book) => (
              <Card key={book.id} className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] hover:border-[rgba(6,182,212,0.3)] transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{book.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#059669] transition-colors line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-[#9CA3AF] mt-1">{book.edition}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#6B7280]">
                        <span>{book.chapters} chapters</span>
                        <span>•</span>
                        <span>{book.pages.toLocaleString()} pages</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <Badge style={{ backgroundColor: `${book.color}20`, color: book.color, border: 'none' }}>{book.category}</Badge>
                      <span className="text-[#9CA3AF]">{book.progress}% read</span>
                    </div>
                    <Progress value={book.progress} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-[rgba(6,182,212,0.15)] text-[#9CA3AF] hover:bg-[#142538] hover:text-[#E5E7EB]">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Reading
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Saved Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <Bookmark className="w-5 h-5 text-[#059669]" />
                Saved Notes & Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookmarks.map((bookmark, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[#142538] border border-[rgba(6,182,212,0.1)] hover:border-[rgba(5,150,105,0.3)] transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#0F2233] border border-[rgba(6,182,212,0.15)] flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#E5E7EB] truncate">{bookmark.title}</p>
                    <p className="text-sm text-[#6B7280]">📚 {bookmark.source}</p>
                  </div>
                  <Badge className="bg-[#142538] text-[#9CA3AF] border-[rgba(6,182,212,0.1)]">{bookmark.category}</Badge>
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#E5E7EB]">
                <History className="w-5 h-5 text-[#059669]" />
                Recently Read
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentlyRead.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[#142538] border border-[rgba(6,182,212,0.1)] hover:border-[rgba(5,150,105,0.3)] transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(5,150,105,0.1)] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#E5E7EB] truncate">{item.title}</p>
                    <p className="text-sm text-[#6B7280]">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className={`text-sm font-medium ${item.progress === 100 ? "text-[#059669]" : "text-[#9CA3AF]"}`}>{item.progress}%</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-[rgba(6,182,212,0.15)] text-[#9CA3AF] hover:bg-[#0F2233]">
                    {item.progress === 100 ? "Review" : "Continue"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNoteModal(false)}>
          <div className="bg-[#0F2233] border border-[rgba(6,182,212,0.15)] rounded-xl p-6 max-w-md w-full animate-slide-in-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Add Personal Note</h3>
            <Input placeholder="Note title" className="mb-4 bg-[#142538] border-[rgba(6,182,212,0.15)] text-[#E5E7EB]" />
            <select className="w-full p-2 mb-4 bg-[#142538] border border-[rgba(6,182,212,0.15)] rounded-lg text-[#9CA3AF]">
              <option>Select Subject</option>
              <option>Surgery</option>
              <option>Medicine</option>
              <option>Pathology</option>
            </select>
            <textarea placeholder="Write your note here..." className="w-full h-40 p-3 bg-[#142538] border border-[rgba(6,182,212,0.15)] rounded-lg resize-none focus:border-[#059669] focus:outline-none text-[#E5E7EB] placeholder:text-[#9CA3AF]" />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowNoteModal(false)} className="flex-1 border-[rgba(6,182,212,0.15)] text-[#9CA3AF]">Cancel</Button>
              <Button onClick={() => setShowNoteModal(false)} className="flex-1 bg-[#059669] hover:bg-[#047857] text-white">Save Note</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
