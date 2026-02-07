"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/Skeleton";
import { EmptySearch, EmptyLibrary } from "@/components/EmptyState";
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
} from "lucide-react";

const categories = [
  "All",
  "Surgery",
  "Medicine",
  "Anatomy",
  "Physiology",
  "Pathology",
  "Pharmacology",
];

const materials = [
  {
    id: 1,
    title: "Gastric Cancer: Comprehensive Review",
    category: "Surgery",
    type: "Note",
    duration: "25 min read",
    rating: 4.9,
    progress: 100,
    starred: true,
    icon: FileText,
    content: "A comprehensive review of gastric cancer including epidemiology, staging, surgical management, and adjuvant therapies.",
  },
  {
    id: 2,
    title: "Hepatobiliary Anatomy Atlas",
    category: "Anatomy",
    type: "Visual",
    duration: "45 min read",
    rating: 4.8,
    progress: 65,
    starred: true,
    icon: BookOpen,
    content: "Detailed anatomical illustrations of the liver, biliary tree, and portal system with clinical correlations.",
  },
  {
    id: 3,
    title: "Pancreatic Disorders: Pathophysiology",
    category: "Pathology",
    type: "Note",
    duration: "30 min read",
    rating: 4.7,
    progress: 40,
    starred: false,
    icon: FileText,
    content: "Understanding acute and chronic pancreatitis, pancreatic cancer, and cystic lesions of the pancreas.",
  },
  {
    id: 4,
    title: "Laparoscopic Cholecystectomy Technique",
    category: "Surgery",
    type: "Video",
    duration: "18 min watch",
    rating: 4.9,
    progress: 0,
    starred: false,
    icon: Video,
    content: "Step-by-step video guide for laparoscopic cholecystectomy with tips for difficult cases.",
  },
  {
    id: 5,
    title: "GI Pharmacology: PPIs and H2 Blockers",
    category: "Pharmacology",
    type: "Note",
    duration: "20 min read",
    rating: 4.6,
    progress: 80,
    starred: false,
    icon: FileText,
    content: "Mechanisms, indications, and clinical applications of acid-suppressing medications.",
  },
  {
    id: 6,
    title: "Small Bowel Obstruction Management",
    category: "Surgery",
    type: "Note",
    duration: "15 min read",
    rating: 4.8,
    progress: 100,
    starred: true,
    icon: FileText,
    content: "Diagnosis and management of small bowel obstruction including conservative and surgical approaches.",
  },
  {
    id: 7,
    title: "Portal Hypertension: Clinical Approach",
    category: "Medicine",
    type: "Note",
    duration: "35 min read",
    rating: 4.7,
    progress: 20,
    starred: false,
    icon: FileText,
    content: "Pathophysiology and clinical management of portal hypertension and its complications.",
  },
  {
    id: 8,
    title: "Colorectal Cancer Staging & Treatment",
    category: "Surgery",
    type: "Note",
    duration: "40 min read",
    rating: 4.9,
    progress: 0,
    starred: false,
    icon: FileText,
    content: "TNM staging, surgical principles, and multimodal treatment of colorectal malignancies.",
  },
  {
    id: 9,
    title: "Appendicitis: Diagnosis & Management",
    category: "Surgery",
    type: "Video",
    duration: "12 min watch",
    rating: 4.8,
    progress: 100,
    starred: true,
    icon: Video,
    content: "Clinical diagnosis, imaging findings, and surgical management of acute appendicitis.",
  },
];

export default function LibraryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleMaterialClick = (id: number) => {
    router.push(`/library/${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Library</h1>
          <p className="text-[#94A3B8] mt-1">
            Browse and search through your study materials
          </p>
        </div>
        <Button
          onClick={() => setShowNoteModal(true)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple sm:w-auto w-full"
        >
          <StickyNote className="w-4 h-4 mr-2" />
          Add My Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1E293B] border-[#334155] focus:border-[#7C3AED]"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg flex items-center gap-2 hover:border-[#7C3AED] transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <div className="flex bg-[#1E293B] border border-[#334155] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#7C3AED]" : "hover:bg-[#334155]"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#7C3AED]" : "hover:bg-[#334155]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-[#7C3AED] text-white glow-purple"
                : "bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155] hover:border-[#7C3AED]/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
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

      {/* Materials Grid */}
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
              className="bg-[#1E293B] border-[#334155] card-hover cursor-pointer group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg transition-transform group-hover:scale-110 ${
                      material.type === "Video"
                        ? "bg-[#F59E0B]/20"
                        : material.type === "Visual"
                        ? "bg-[#06B6D4]/20"
                        : "bg-[#7C3AED]/20"
                    }`}
                  >
                    <material.icon
                      className="w-5 h-5"
                      style={{
                        color:
                          material.type === "Video"
                            ? "#F59E0B"
                            : material.type === "Visual"
                            ? "#06B6D4"
                            : "#7C3AED",
                      }}
                    />
                  </div>
                  <button 
                    className="p-1 hover:bg-[#334155] rounded transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        material.starred ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#94A3B8] hover:text-[#F59E0B]"
                      }`}
                    />
                  </button>
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                  {material.title}
                </h3>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-[#0F172A] text-[#94A3B8] border-[#334155] cursor-pointer hover:border-[#7C3AED] hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(material.category);
                    }}
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
                    <span className="text-[#94A3B8]">Progress</span>
                    <span
                      className={
                        material.progress === 100 ? "text-[#10B981]" : "text-white"
                      }
                    >
                      {material.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        material.progress === 100 ? "bg-[#10B981]" : "bg-[#7C3AED]"
                      }`}
                      style={{ width: `${material.progress}%` }}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-4 text-sm">
                  <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="font-medium">{material.rating}</span>
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
      
      {!isLoading && filteredMaterials.length === 0 && !searchQuery && materials.length === 0 && (
        <EmptyLibrary />
      )}

      {!isLoading && filteredMaterials.length === 0 && !searchQuery && materials.length > 0 && (
        <div className="text-center py-12 animate-fade-in">
          <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
          <p className="text-[#94A3B8]">No materials in this category</p>
          <Button
            variant="link"
            onClick={() => setSelectedCategory("All")}
            className="text-[#7C3AED] mt-2"
          >
            View all materials
          </Button>
        </div>
      )}

      {/* Add Note Modal (Simple UI placeholder) */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNoteModal(false)}>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 max-w-md w-full animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Add Personal Note</h3>
            <Input
              placeholder="Note title..."
              className="mb-4 bg-[#0F172A] border-[#334155]"
            />
            <textarea
              placeholder="Write your note here..."
              className="w-full h-32 p-3 bg-[#0F172A] border border-[#334155] rounded-lg resize-none focus:border-[#7C3AED] focus:outline-none"
            />
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowNoteModal(false)} className="flex-1 border-[#334155]">
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
