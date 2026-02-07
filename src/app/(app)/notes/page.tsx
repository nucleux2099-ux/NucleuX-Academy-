"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  FileText,
  Star,
  Clock,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
  tags: string[];
  createdAt: Date;
  linkedAtom?: string;
  isFavorite: boolean;
}

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Portal Hypertension Key Points",
    content: "HVPG > 10 mmHg = clinically significant. Major complications: varices, ascites, SBP, HE, HRS...",
    topic: "Hepatology",
    tags: ["high-yield", "liver"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    linkedAtom: "Portal Hypertension",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Variceal Bleeding Protocol",
    content: "1. Resuscitation (restrictive transfusion Hb 7-8) 2. Octreotide 50μg bolus → 50μg/hr 3. Ceftriaxone 1g IV...",
    topic: "Hepatology",
    tags: ["protocol", "emergency"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    linkedAtom: "Variceal Bleeding",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Child-Pugh Score Mnemonic",
    content: "ABCDE: Albumin, Bilirubin, Clotting (PT/INR), Distension (ascites), Encephalopathy",
    topic: "Hepatology",
    tags: ["mnemonic"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isFavorite: false,
  },
  {
    id: "4",
    title: "Surgical Approaches to Esophagus",
    content: "Upper third: Left neck approach. Middle third: Right thoracotomy. Lower third: Left thoracoabdominal...",
    topic: "Surgical GI",
    tags: ["anatomy", "surgery"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    linkedAtom: "Esophageal Anatomy",
    isFavorite: false,
  },
  {
    id: "5",
    title: "GERD Alarm Symptoms",
    content: "DANGER: Dysphagia, Anemia, Nausea/vomiting persistent, GI bleeding, Early satiety, Rapid weight loss",
    topic: "Medical GI",
    tags: ["mnemonic", "red-flags"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    isFavorite: false,
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "favorites") {
      return matchesSearch && note.isFavorite;
    }
    return matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setNotes(notes.map((note) =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Notes</h1>
          <p className="text-gray-400">Your personal atoms and study notes</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-gray-800/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Notes", value: notes.length, icon: FileText, color: "text-purple-400" },
          { label: "Favorites", value: notes.filter((n) => n.isFavorite).length, icon: Star, color: "text-yellow-400" },
          { label: "This Week", value: 3, icon: Clock, color: "text-cyan-400" },
          { label: "Linked Atoms", value: notes.filter((n) => n.linkedAtom).length, icon: BookOpen, color: "text-green-400" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-gray-800/30 border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-700/50 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            className="bg-gray-800/30 border-gray-700 p-4 hover:border-purple-500/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-yellow-400"
                  onClick={() => toggleFavorite(note.id)}
                >
                  <Star className={`w-4 h-4 ${note.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-white">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-medium text-white mb-2 line-clamp-1">{note.title}</h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{note.content}</p>

            {note.linkedAtom && (
              <div className="flex items-center gap-2 mb-3 text-sm">
                <BookOpen className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400">{note.linkedAtom}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                {note.topic}
              </Badge>
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-purple-500/30 text-purple-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No notes found</h3>
          <p className="text-gray-400 mb-4">
            {searchQuery ? "Try a different search term" : "Create your first note to get started"}
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </div>
      )}
    </div>
  );
}
