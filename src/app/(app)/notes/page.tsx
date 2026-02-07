"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/Skeleton";
import {
  Plus,
  Search,
  StickyNote,
  MoreVertical,
  Edit,
  Trash2,
  Link2,
  Clock,
  Tag,
  Grid,
  List,
  Filter,
  X,
  BookOpen,
  FileText,
  Calendar,
  ChevronRight,
  Atom,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Room color for Notes
const roomColor = "#F59E0B";

interface Note {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  linkedTopics: number;
  source?: { title: string; chapter?: string };
  createdAt: string;
  updatedAt: string;
}

const sampleNotes: Note[] = [
  {
    id: "note-123",
    title: "Surgery Rotation Notes - Week 12",
    excerpt: "Key learnings from GI surgery rotation including gastric cancer staging, surgical approaches, and clinical pearls from Dr. Kumar...",
    tags: ["surgery", "gastric-cancer", "rotation-notes"],
    linkedTopics: 5,
    source: { title: "Bailey & Love", chapter: "Ch. 62" },
    createdAt: "2026-02-05T10:30:00",
    updatedAt: "2026-02-07T15:45:00",
  },
  {
    id: "note-124",
    title: "Portal Hypertension - Quick Review",
    excerpt: "Summary of portal hypertension pathophysiology, Child-Pugh classification, and TIPS procedure indications...",
    tags: ["hepatology", "portal-htn", "quick-review"],
    linkedTopics: 3,
    source: { title: "Blumgart's Surgery", chapter: "Ch. 12" },
    createdAt: "2026-02-03T14:20:00",
    updatedAt: "2026-02-06T09:15:00",
  },
  {
    id: "note-125",
    title: "FLOT Regimen Notes",
    excerpt: "Perioperative chemotherapy protocol: 5-FU, leucovorin, oxaliplatin, docetaxel. FLOT4 trial key findings...",
    tags: ["oncology", "chemotherapy", "gastric-cancer"],
    linkedTopics: 2,
    createdAt: "2026-02-01T16:00:00",
    updatedAt: "2026-02-01T16:00:00",
  },
  {
    id: "note-126",
    title: "Hernia Classification Cheat Sheet",
    excerpt: "Quick reference for inguinal, femoral, umbilical, and incisional hernias. Key anatomical landmarks and repair techniques...",
    tags: ["surgery", "hernia", "cheat-sheet"],
    linkedTopics: 4,
    source: { title: "Maingot's", chapter: "Ch. 22" },
    createdAt: "2026-01-28T11:30:00",
    updatedAt: "2026-02-04T18:20:00",
  },
  {
    id: "note-127",
    title: "MCQ Mistakes - January 2026",
    excerpt: "Compilation of commonly missed MCQ topics and explanations for review. Focus areas: Hepatobiliary, Thyroid, Hernia...",
    tags: ["mcq", "mistakes", "review"],
    linkedTopics: 8,
    createdAt: "2026-01-31T20:00:00",
    updatedAt: "2026-02-02T10:45:00",
  },
];

const allTags = ["surgery", "gastric-cancer", "rotation-notes", "hepatology", "portal-htn", "quick-review", "oncology", "chemotherapy", "hernia", "cheat-sheet", "mcq", "mistakes", "review"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotes(sampleNotes);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#F59E0B]" />
            My Notes
          </h1>
          <p className="text-[#9CA3AF] mt-1">
            {notes.length} personal atoms • Your knowledge, connected
          </p>
        </div>
        <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-[#0D1B2A] font-medium shadow-lg shadow-[#F59E0B]/20">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0D1B2A] border-[rgba(6,182,212,0.2)] text-[#E5E7EB] placeholder-[#6B7280] focus:border-[#F59E0B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#9CA3AF]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Toggle & Filter */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-[rgba(6,182,212,0.3)] ${showFilters ? "text-[#F59E0B] bg-[#F59E0B]/10" : "text-[#9CA3AF]"}`}
              >
                <Filter className="w-4 h-4" />
              </Button>
              <div className="flex border border-[rgba(6,182,212,0.2)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "text-[#6B7280] hover:text-[#9CA3AF]"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "text-[#6B7280] hover:text-[#9CA3AF]"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tag Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm text-[#9CA3AF]">Filter by tags</span>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-[#F59E0B] hover:text-[#FBBF24] ml-auto"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`cursor-pointer transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50"
                        : "bg-[#142538] text-[#9CA3AF] border-[rgba(6,182,212,0.15)] hover:border-[#F59E0B]/30"
                    }`}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Grid/List */}
      {isLoading ? (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
          <CardContent className="py-16 text-center">
            <StickyNote className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#E5E7EB] mb-2">No notes found</h3>
            <p className="text-[#9CA3AF] mb-6">
              {searchQuery || selectedTags.length > 0
                ? "Try adjusting your search or filters"
                : "Start creating notes to build your personal knowledge base"}
            </p>
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-[#0D1B2A]">
              <Plus className="w-4 h-4 mr-2" />
              Create your first note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredNotes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)] hover:border-[#F59E0B]/50 transition-all cursor-pointer group h-full">
                <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}>
                  {viewMode === "list" && (
                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[#E5E7EB] group-hover:text-[#F59E0B] transition-colors line-clamp-2">
                        {note.title}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280] hover:text-[#9CA3AF] shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0F2233] border-[rgba(6,182,212,0.2)]">
                          <DropdownMenuItem className="text-[#E5E7EB] focus:bg-[#142538]">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-[#9CA3AF] line-clamp-2 mb-3">
                      {note.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-[#142538] text-[#9CA3AF] border-[rgba(6,182,212,0.1)] text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge className="bg-[#142538] text-[#6B7280] border-[rgba(6,182,212,0.1)] text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          {note.linkedTopics} links
                        </span>
                        {note.source && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {note.source.title}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {viewMode === "grid" && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* ATOM Suggestion */}
      <Card className="bg-[#0F2233] border-[rgba(6,182,212,0.15)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center shadow-lg shadow-[#06B6D4]/25">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#E5E7EB]">ATOM can help you take better notes</h3>
              <p className="text-sm text-[#9CA3AF]">Ask ATOM to summarize topics, create flashcards, or quiz you on your notes.</p>
            </div>
            <Button className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#0891B2] hover:to-[#0E7490] text-white">
              Ask ATOM
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
