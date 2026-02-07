"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sourceId?: number;
  sourceTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Gastric Cancer Staging Summary",
    content: "TNM 8th Edition key points:\n- T1a: Lamina propria\n- T1b: Submucosa\n- T2: Muscularis propria\n- T3: Subserosa\n- T4a: Serosa\n- T4b: Adjacent structures\n\nD2 lymphadenectomy recommended for all T2+ tumors.",
    tags: ["Surgery", "Oncology", "Staging"],
    sourceId: 1,
    sourceTitle: "Gastric Cancer: Comprehensive Review",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    color: "#7C3AED",
  },
  {
    id: "2",
    title: "Calot's Triangle - Critical View",
    content: "Boundaries:\n1. Inferior surface of liver (Segment V)\n2. Cystic duct\n3. Common hepatic duct\n\nContents:\n- Cystic artery\n- Cystic lymph node (of Lund)\n\nMust achieve critical view before clipping!",
    tags: ["Anatomy", "Hepatobiliary"],
    sourceId: 2,
    sourceTitle: "Hepatobiliary Anatomy Atlas",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-14"),
    color: "#06B6D4",
  },
  {
    id: "3",
    title: "Charcot's Triad vs Reynolds' Pentad",
    content: "Charcot's Triad (Cholangitis):\n1. Fever with rigors\n2. Jaundice\n3. RUQ pain\n\nReynolds' Pentad (Severe):\n+ Hypotension\n+ Altered mental status\n\nReynolds' pentad = ICU + ERCP urgently!",
    tags: ["Hepatobiliary", "Emergency"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    color: "#F59E0B",
  },
  {
    id: "4",
    title: "SBO vs LBO Differentiation",
    content: "Small Bowel Obstruction:\n- Central abdominal pain\n- Early vomiting\n- Colicky pain\n- Multiple air-fluid levels\n\nLarge Bowel Obstruction:\n- Peripheral pain\n- Late vomiting (feculent)\n- Distension prominent\n- Single or few air-fluid levels",
    tags: ["Surgery", "Emergency"],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    color: "#10B981",
  },
  {
    id: "5",
    title: "ATOM: Portal HTN Management",
    content: "From ATOM chat session:\n\n1. Primary prophylaxis: Non-selective beta-blockers (propranolol/nadolol)\n2. Acute bleeding: Octreotide + PPI + Endoscopic band ligation\n3. Secondary prophylaxis: Band ligation + beta-blockers\n4. Refractory: TIPS or shunt surgery",
    tags: ["Medicine", "ATOM"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    color: "#7C3AED",
  },
];

const allTags = ["Surgery", "Anatomy", "Hepatobiliary", "Oncology", "Emergency", "Medicine", "ATOM", "Staging"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewNote, setShowNewNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => note.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSaveNote = () => {
    if (!newNote.title.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      color: ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981"][Math.floor(Math.random() * 4)],
    };

    setNotes((prev) => [note, ...prev]);
    setNewNote({ title: "", content: "", tags: "" });
    setShowNewNote(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <StickyNote className="w-8 h-8 text-[#F59E0B]" />
            My Notes
          </h1>
          <p className="text-[#94A3B8] mt-1">
            {notes.length} notes • Personal study notes and ATOM insights
          </p>
        </div>
        <Button
          onClick={() => setShowNewNote(true)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1E293B] border-[#334155] focus:border-[#7C3AED]"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#334155]">
                <Filter className="w-4 h-4 mr-2" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge className="ml-2 bg-[#7C3AED] text-white">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1E293B] border-[#334155] w-48">
              {allTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={selectedTags.includes(tag) ? "bg-[#7C3AED]/20" : ""}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex bg-[#1E293B] border border-[#334155] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid" ? "bg-[#7C3AED]" : "hover:bg-[#334155]"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list" ? "bg-[#7C3AED]" : "hover:bg-[#334155]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Tag Filters */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#94A3B8]">Filtered by:</span>
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 cursor-pointer hover:bg-[#7C3AED]/30"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTags([])}
            className="text-[#94A3B8] hover:text-white"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Notes Grid/List */}
      {!isLoading && filteredNotes.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {filteredNotes.map((note, index) => (
            <Card
              key={note.id}
              className="bg-[#1E293B] border-[#334155] card-hover group overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Color bar */}
              <div className="h-1" style={{ backgroundColor: note.color }} />
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white group-hover:text-[#7C3AED] transition-colors line-clamp-1 flex-1">
                    {note.title}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1E293B] border-[#334155]">
                      <DropdownMenuItem onClick={() => setEditingNote(note)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(note.id)}
                        className="text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-[#94A3B8] line-clamp-4 mb-4 whitespace-pre-line">
                  {note.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#0F172A] text-[#94A3B8] border-[#334155] text-xs cursor-pointer hover:border-[#7C3AED]"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Source Link */}
                {note.sourceTitle && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0F172A] border border-[#334155] mb-3">
                    <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs text-[#94A3B8] truncate flex-1">
                      {note.sourceTitle}
                    </span>
                    <Link2 className="w-3 h-3 text-[#64748B]" />
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-[#64748B]">
                  <Clock className="w-3 h-3" />
                  {note.updatedAt.toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredNotes.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mx-auto mb-6">
            <StickyNote className="w-10 h-10 text-[#F59E0B]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No notes found</h3>
          <p className="text-[#94A3B8] max-w-md mx-auto mb-6">
            {searchQuery || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Start creating notes to capture your learning insights"}
          </p>
          <Button
            onClick={() => setShowNewNote(true)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create your first note
          </Button>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNote && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewNote(false)}
        >
          <Card
            className="bg-[#1E293B] border-[#334155] w-full max-w-lg animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#7C3AED]" />
                New Note
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1 block">
                    Title
                  </label>
                  <Input
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="bg-[#0F172A] border-[#334155]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1 block">
                    Content
                  </label>
                  <textarea
                    placeholder="Write your note..."
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote((prev) => ({ ...prev, content: e.target.value }))
                    }
                    rows={6}
                    className="w-full p-3 bg-[#0F172A] border border-[#334155] rounded-lg resize-none focus:border-[#7C3AED] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1 block">
                    Tags (comma separated)
                  </label>
                  <Input
                    placeholder="Surgery, Anatomy, ..."
                    value={newNote.tags}
                    onChange={(e) =>
                      setNewNote((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    className="bg-[#0F172A] border-[#334155]"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewNote(false)}
                  className="flex-1 border-[#334155]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNote}
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9]"
                >
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
