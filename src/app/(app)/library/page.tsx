"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/Skeleton";
import { EmptySearch, EmptyLibrary } from "@/components/EmptyState";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  BookOpen,
  FileText,
  Video,
  Clock,
  Star,
  Grid,
  List,
  Plus,
  StickyNote,
  BookMarked,
  Library,
  Bookmark,
  History,
  TrendingUp,
  ChevronRight,
  GraduationCap,
  Stethoscope,
  Pill,
  Bug,
  Heart,
  Brain,
  Bone,
  Baby,
  Scale,
  Eye,
  Sparkles,
  Atom,
} from "lucide-react";

// Library room color - Green
const roomColor = {
  primary: '#059669',
  light: '#ECFDF5',
  name: 'green'
};

// Subject categories with real counts
const subjects = [
  { id: "all", name: "All", count: 8456, icon: Library, color: "#7C3AED" },
  { id: "surgery", name: "Surgery", count: 1892, icon: Scale, color: "#DC2626" },
  { id: "medicine", name: "Medicine", count: 2456, icon: Stethoscope, color: "#7C3AED" },
  { id: "pathology", name: "Pathology", count: 1234, icon: Bug, color: "#059669" },
  { id: "pharmacology", name: "Pharmacology", count: 987, icon: Pill, color: "#D97706" },
  { id: "anatomy", name: "Anatomy", count: 756, icon: Bone, color: "#0891B2" },
  { id: "obg", name: "OBG", count: 543, icon: Heart, color: "#DB2777" },
  { id: "pediatrics", name: "Pediatrics", count: 432, icon: Baby, color: "#EC4899" },
  { id: "ophthalmology", name: "Ophthalmology", count: 234, icon: Eye, color: "#0D9488" },
];

// Standard medical textbooks
const textbooks = [
  {
    id: "harrison",
    title: "Harrison's Principles of Internal Medicine",
    edition: "22nd Edition",
    chapters: 505,
    pages: 4273,
    icon: "📘",
    category: "Medicine",
    progress: 23,
    color: "#7C3AED",
  },
  {
    id: "bailey",
    title: "Bailey & Love's Short Practice of Surgery",
    edition: "28th Edition",
    chapters: 92,
    pages: 1624,
    icon: "📕",
    category: "Surgery",
    progress: 45,
    color: "#DC2626",
  },
  {
    id: "robbins",
    title: "Robbins & Cotran Pathologic Basis of Disease",
    edition: "10th Edition",
    chapters: 29,
    pages: 1392,
    icon: "📗",
    category: "Pathology",
    progress: 67,
    color: "#059669",
  },
  {
    id: "kdt",
    title: "KD Tripathi Essentials of Pharmacology",
    edition: "8th Edition",
    chapters: 68,
    pages: 1056,
    icon: "📙",
    category: "Pharmacology",
    progress: 34,
    color: "#D97706",
  },
  {
    id: "grays",
    title: "Gray's Anatomy for Students",
    edition: "4th Edition",
    chapters: 12,
    pages: 1180,
    icon: "📘",
    category: "Anatomy",
    progress: 56,
    color: "#0891B2",
  },
  {
    id: "blumgart",
    title: "Blumgart's Surgery of Liver, Biliary Tract & Pancreas",
    edition: "7th Edition",
    chapters: 157,
    pages: 1856,
    icon: "📕",
    category: "Surgery",
    progress: 12,
    color: "#DC2626",
  },
];

// Real study materials
const materials = [
  {
    id: 1,
    title: "Acute Pancreatitis - Harrison's Ch. 340",
    category: "Medicine",
    source: "Harrison's Principles",
    type: "Note",
    duration: "35 min read",
    rating: 4.9,
    progress: 100,
    starred: true,
    icon: FileText,
    topics: ["Ranson's Criteria", "CT Severity Index", "BISAP Score"],
    lastRead: "2 hours ago",
  },
  {
    id: 2,
    title: "Portal Hypertension - Pathophysiology & Management",
    category: "Surgery",
    source: "Blumgart's Ch. 23",
    type: "Note",
    duration: "45 min read",
    rating: 4.8,
    progress: 65,
    starred: true,
    icon: FileText,
    topics: ["Child-Pugh Score", "TIPS", "Variceal Bleeding"],
    lastRead: "Yesterday",
  },
  {
    id: 3,
    title: "Thyroid Carcinoma - Classification & Staging",
    category: "Surgery",
    source: "Bailey & Love Ch. 51",
    type: "Note",
    duration: "30 min read",
    rating: 4.7,
    progress: 40,
    starred: false,
    icon: FileText,
    topics: ["TNM Staging", "Papillary vs Follicular", "RAI Therapy"],
    lastRead: "3 days ago",
  },
  {
    id: 4,
    title: "Laparoscopic Cholecystectomy - Step-by-Step",
    category: "Surgery",
    source: "SAGES Manual",
    type: "Video",
    duration: "18 min watch",
    rating: 4.9,
    progress: 100,
    starred: true,
    icon: Video,
    topics: ["Critical View of Safety", "Calot's Triangle"],
    lastRead: "1 week ago",
  },
  {
    id: 5,
    title: "Heart Failure - Pathophysiology & Treatment",
    category: "Medicine",
    source: "Harrison's Ch. 256",
    type: "Note",
    duration: "40 min read",
    rating: 4.6,
    progress: 80,
    starred: false,
    icon: FileText,
    topics: ["HFrEF vs HFpEF", "ACE Inhibitors", "BNP"],
    lastRead: "4 days ago",
  },
  {
    id: 6,
    title: "Inflammatory Bowel Disease - Crohn's vs UC",
    category: "Medicine",
    source: "Harrison's Ch. 326",
    type: "Note",
    duration: "25 min read",
    rating: 4.8,
    progress: 100,
    starred: true,
    icon: FileText,
    topics: ["Skip Lesions", "Cobblestone", "5-ASA Drugs"],
    lastRead: "2 days ago",
  },
  {
    id: 7,
    title: "Inguinal Hernia - Anatomy & Repair",
    category: "Surgery",
    source: "Bailey & Love Ch. 57",
    type: "Note",
    duration: "35 min read",
    rating: 4.9,
    progress: 100,
    starred: false,
    icon: FileText,
    topics: ["Hesselbach's Triangle", "Lichtenstein Repair"],
    lastRead: "Today",
  },
  {
    id: 8,
    title: "Colorectal Cancer - Surgical Management",
    category: "Surgery",
    source: "Maingot's Ch. 28",
    type: "Note",
    duration: "50 min read",
    rating: 4.9,
    progress: 20,
    starred: false,
    icon: FileText,
    topics: ["Duke's Staging", "TME", "Neoadjuvant Therapy"],
    lastRead: "Never",
  },
  {
    id: 9,
    title: "Diabetic Ketoacidosis - Emergency Management",
    category: "Medicine",
    source: "Harrison's Ch. 398",
    type: "Note",
    duration: "20 min read",
    rating: 4.8,
    progress: 100,
    starred: true,
    icon: FileText,
    topics: ["Anion Gap", "Fluid Resuscitation", "Insulin Protocol"],
    lastRead: "Yesterday",
  },
];

// Recently read
const recentlyRead = [
  { title: "Acute Pancreatitis - Harrison's Ch. 340", time: "2 hours ago", progress: 100 },
  { title: "Portal Hypertension - Blumgart's Ch. 23", time: "Yesterday", progress: 65 },
  { title: "Inguinal Hernia - Bailey & Love Ch. 57", time: "Today", progress: 100 },
  { title: "Heart Failure - Harrison's Ch. 256", time: "4 days ago", progress: 80 },
];

// Bookmarks
const bookmarks = [
  { title: "Portal Hypertension - Child-Pugh Score", source: "Blumgart's", category: "Surgery" },
  { title: "Thyroid Carcinoma - TNM Staging", source: "Bailey & Love", category: "Surgery" },
  { title: "Heart Failure - Treatment Algorithm", source: "Harrison's", category: "Medicine" },
  { title: "DKA - Anion Gap Calculation", source: "Harrison's", category: "Medicine" },
  { title: "Ranson's Criteria - Acute Pancreatitis", source: "Harrison's", category: "Medicine" },
];

export default function LibraryPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = selectedSubject === "all" || m.category.toLowerCase() === selectedSubject;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleMaterialClick = (id: number) => {
    router.push(`/library/${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B] flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#059669]/10 to-[#0891B2]/10 flex items-center justify-center">
              <Library className="w-6 h-6 text-[#059669]" />
            </div>
            Medical Library
          </h1>
          <p className="text-[#64748B] mt-1">
            24 textbooks • 8,456 notes • Standard references cited
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[#059669]/30 text-[#059669] hover:bg-[#059669]/5"
            onClick={() => router.push('/chat?context=library')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ask ATOM
          </Button>
          <Button
            onClick={() => setShowNoteModal(true)}
            className="bg-[#059669] hover:bg-[#047857] shadow-lg shadow-[#059669]/20 sm:w-auto"
          >
            <StickyNote className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-[#E2E8F0] p-1.5 rounded-xl shadow-sm">
          <TabsTrigger 
            value="browse" 
            className="data-[state=active]:bg-[#059669] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse
          </TabsTrigger>
          <TabsTrigger 
            value="textbooks"
            className="data-[state=active]:bg-[#059669] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Textbooks
          </TabsTrigger>
          <TabsTrigger 
            value="bookmarks"
            className="data-[state=active]:bg-[#059669] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved ({bookmarks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="recent"
            className="data-[state=active]:bg-[#059669] data-[state=active]:text-white data-[state=active]:shadow-md px-6 rounded-lg text-[#64748B]"
          >
            <History className="w-4 h-4 mr-2" />
            Recent
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                placeholder="Search notes, topics, chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#E2E8F0] focus:border-[#7C3AED] shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg flex items-center gap-2 hover:border-[#7C3AED] hover:shadow-md transition-all text-[#64748B]">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <div className="flex bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#7C3AED] text-white" : "hover:bg-[#F8FAFC] text-[#64748B]"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#7C3AED] text-white" : "hover:bg-[#F8FAFC] text-[#64748B]"}`}
                >
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  selectedSubject === subject.id
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/20"
                    : "bg-white text-[#64748B] hover:text-[#1E293B] border border-[#E2E8F0] hover:border-[#7C3AED]/50 hover:shadow-md"
                }`}
              >
                <subject.icon className="w-4 h-4" />
                {subject.name}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedSubject === subject.id ? "bg-white/20 text-white" : "bg-[#F8FAFC] text-[#94A3B8]"
                }`}>
                  {subject.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          {isLoading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!isLoading && filteredMaterials.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredMaterials.map((material, index) => (
                <Card
                  key={material.id}
                  onClick={() => handleMaterialClick(material.id)}
                  className="bg-white border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-xl cursor-pointer group transition-all shadow-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`p-3 rounded-lg transition-transform group-hover:scale-110 shadow-sm ${
                          material.type === "Video"
                            ? "bg-[#FFFBEB]"
                            : "bg-[#F5F3FF]"
                        }`}
                      >
                        <material.icon
                          className="w-5 h-5"
                          style={{
                            color: material.type === "Video" ? "#F59E0B" : "#7C3AED",
                          }}
                        />
                      </div>
                      <button 
                        className="p-1 hover:bg-[#F8FAFC] rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Star
                          className={`w-4 h-4 transition-colors ${
                            material.starred ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#94A3B8] hover:text-[#F59E0B]"
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-semibold mb-1 text-[#1E293B] group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                      {material.title}
                    </h3>
                    
                    <p className="text-xs text-[#94A3B8] mb-3">
                      📚 {material.source}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {material.topics.length > 2 && (
                        <Badge className="bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] text-xs">
                          +{material.topics.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]"
                      >
                        {material.category}
                      </Badge>
                      <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {material.duration}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Progress</span>
                        <span className={material.progress === 100 ? "text-[#10B981] font-medium" : "text-[#1E293B]"}>
                          {material.progress}%
                        </span>
                      </div>
                      <Progress value={material.progress} className="h-1.5" />
                    </div>

                    {/* Rating & Last Read */}
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="font-medium text-[#1E293B]">{material.rating}</span>
                      </div>
                      <span className="text-xs text-[#94A3B8]">{material.lastRead}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty States */}
          {!isLoading && filteredMaterials.length === 0 && searchQuery && (
            <EmptySearch query={searchQuery} />
          )}
        </TabsContent>

        {/* Textbooks Tab */}
        <TabsContent value="textbooks" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {textbooks.map((book) => (
              <Card key={book.id} className="bg-white border-[#E2E8F0] hover:shadow-xl transition-all cursor-pointer group shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{book.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1E293B] group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[#64748B] mt-1">{book.edition}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#94A3B8]">
                        <span>{book.chapters} chapters</span>
                        <span>•</span>
                        <span>{book.pages.toLocaleString()} pages</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <Badge style={{ backgroundColor: `${book.color}15`, color: book.color, border: 'none' }}>
                        {book.category}
                      </Badge>
                      <span className="text-[#64748B]">{book.progress}% read</span>
                    </div>
                    <Progress value={book.progress} className="h-2" />
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] group-hover:border-[#7C3AED] group-hover:text-[#7C3AED]">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Reading
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks" className="space-y-4">
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1E293B]">
                <Bookmark className="w-5 h-5 text-[#7C3AED]" />
                Saved Notes & Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookmarks.map((bookmark, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                    <BookMarked className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E293B] truncate">{bookmark.title}</p>
                    <p className="text-sm text-[#64748B]">📚 {bookmark.source}</p>
                  </div>
                  <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]">
                    {bookmark.category}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-white border-[#E2E8F0] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1E293B]">
                <History className="w-5 h-5 text-[#7C3AED]" />
                Recently Read
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentlyRead.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C3AED]/10 to-[#0891B2]/10 flex items-center justify-center shadow-sm">
                    <FileText className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E293B] truncate">{item.title}</p>
                    <p className="text-sm text-[#64748B]">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className={`text-sm font-medium ${item.progress === 100 ? "text-[#10B981]" : "text-[#64748B]"}`}>
                      {item.progress}%
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="border-[#E2E8F0] hover:bg-white text-[#64748B]">
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNoteModal(false)}>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-md w-full animate-slide-in-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#1E293B] mb-4">Add Personal Note</h3>
            <Input
              placeholder="Note title (e.g., Portal Hypertension Summary)"
              className="mb-4 bg-[#F8FAFC] border-[#E2E8F0]"
            />
            <select className="w-full p-2 mb-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#64748B]">
              <option>Select Subject</option>
              <option>Surgery</option>
              <option>Medicine</option>
              <option>Pathology</option>
              <option>Pharmacology</option>
            </select>
            <textarea
              placeholder="Write your note here... You can include mnemonics, key points, diagrams description, etc."
              className="w-full h-40 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg resize-none focus:border-[#7C3AED] focus:outline-none text-[#1E293B]"
            />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowNoteModal(false)} className="flex-1 border-[#E2E8F0]">
                Cancel
              </Button>
              <Button onClick={() => setShowNoteModal(false)} className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9]">
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
