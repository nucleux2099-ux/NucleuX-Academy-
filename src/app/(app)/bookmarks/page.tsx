"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bookmark, BookOpen, FileText, Video, Brain, Search,
  Folder, Star, Clock, Trash2, ExternalLink, MoreVertical,
  StickyNote, MessageSquare, Filter, Grid, List
} from "lucide-react";
import Link from "next/link";

interface BookmarkedItem {
  id: string;
  type: "note" | "topic" | "video" | "mcq" | "discussion" | "atom";
  title: string;
  description?: string;
  source?: string;
  folder?: string;
  savedAt: string;
  tags: string[];
}

const bookmarks: BookmarkedItem[] = [
  {
    id: "1",
    type: "note",
    title: "Portal Hypertension - Complete Notes",
    description: "Pathophysiology, classification, and management of portal HTN",
    source: "Blumgart's Ch. 23",
    folder: "Surgery",
    savedAt: "2 hours ago",
    tags: ["Hepatobiliary", "High Yield"]
  },
  {
    id: "2",
    type: "topic",
    title: "Acute Pancreatitis - Harrison's Ch. 340",
    description: "Etiology, diagnosis, Ranson's criteria, management",
    source: "Harrison's Principles",
    folder: "Medicine",
    savedAt: "Yesterday",
    tags: ["GI", "Emergency"]
  },
  {
    id: "3",
    type: "video",
    title: "Esophageal Surgery - Operative Techniques",
    description: "Ivor Lewis, Transhiatal approach, complications",
    source: "Dr. Rajesh Sharma",
    folder: "Surgery",
    savedAt: "2 days ago",
    tags: ["Surgery", "Operative"]
  },
  {
    id: "4",
    type: "mcq",
    title: "Thyroid Carcinoma - 15 High Yield MCQs",
    description: "TNM staging, papillary vs follicular, treatment",
    source: "NEET-PG 2024",
    folder: "Surgery",
    savedAt: "3 days ago",
    tags: ["Endocrine", "MCQ Bank"]
  },
  {
    id: "5",
    type: "discussion",
    title: "Child-Pugh vs MELD - when to use which?",
    description: "Great discussion with textbook references",
    source: "Dr. Arun's post",
    folder: "Medicine",
    savedAt: "1 week ago",
    tags: ["Hepatology", "Scoring"]
  },
  {
    id: "6",
    type: "atom",
    title: "ATOM Explanation: Gastric Conduit Technique",
    description: "Step-by-step breakdown with diagrams",
    source: "ATOM Chat",
    folder: "Surgery",
    savedAt: "1 week ago",
    tags: ["Surgery", "ATOM"]
  },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  note: { icon: StickyNote, color: "#C9A86C", bg: "rgba(245,158,11,0.15)", label: "Note" },
  topic: { icon: BookOpen, color: "#7BA69E", bg: "rgba(5,150,105,0.15)", label: "Topic" },
  video: { icon: Video, color: "#E57373", bg: "rgba(239,68,68,0.15)", label: "Video" },
  mcq: { icon: FileText, color: "#6BA8C9", bg: "rgba(14,165,233,0.15)", label: "MCQ Set" },
  discussion: { icon: MessageSquare, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", label: "Discussion" },
  atom: { icon: Brain, color: "#5BB3B3", bg: "rgba(91,179,179,0.15)", label: "ATOM" },
};

const folders = ["All", "Surgery", "Medicine", "Pathology", "Pharmacology"];

export default function BookmarksPage() {
  const [items, setItems] = useState(bookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === "All" || item.folder === selectedFolder;
    const matchesType = !selectedType || item.type === selectedType;
    return matchesSearch && matchesFolder && matchesType;
  });

  const removeBookmark = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#E8E0D5] flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-[#C9A86C]" />
            Bookmarks
          </h1>
          <p className="text-[#A0B0BC] mt-1">{items.length} saved items</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#364A5E] rounded-lg p-1 border border-[rgba(91,179,179,0.15)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-[#3A4D5F] text-[#E8E0D5]" : "text-[#6B7280]"}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-[#3A4D5F] text-[#E8E0D5]" : "text-[#6B7280]"}
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#364A5E] border-[rgba(91,179,179,0.15)] text-[#E8E0D5] placeholder:text-[#6B7280]"
          />
        </div>
        
        {/* Folder Filter */}
        <div className="flex gap-2 flex-wrap">
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
              className={selectedFolder === folder 
                ? "bg-[#5BB3B3] text-[#2D3E50]" 
                : "border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:bg-[#3A4D5F]"
              }
            >
              <Folder className="w-3 h-3 mr-1" />
              {folder}
            </Button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(typeConfig).map(([type, config]) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={`border-[rgba(91,179,179,0.15)] ${
              selectedType === type 
                ? 'text-[#E8E0D5] bg-[#3A4D5F]' 
                : 'text-[#6B7280] hover:bg-[#3A4D5F]'
            }`}
            style={selectedType === type ? { borderColor: config.color } : {}}
          >
            <config.icon className="w-3 h-3 mr-1" style={{ color: config.color }} />
            {config.label}
          </Button>
        ))}
      </div>

      {/* Bookmarks List/Grid */}
      {filteredItems.length === 0 ? (
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
            <p className="text-[#A0B0BC]">No bookmarks found</p>
            <p className="text-sm text-[#6B7280] mt-1">Start saving content to access it quickly</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-3"
        }>
          {filteredItems.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            
            return (
              <Card 
                key={item.id}
                className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] hover:border-[rgba(91,179,179,0.3)] transition-all group"
              >
                <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}>
                  {/* Icon */}
                  <div 
                    className={`${viewMode === "grid" ? "w-10 h-10 mb-3" : "w-12 h-12 shrink-0"} rounded-lg flex items-center justify-center`}
                    style={{ backgroundColor: config.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className="text-[10px]"
                            style={{ borderColor: `${config.color}50`, color: config.color }}
                          >
                            {config.label}
                          </Badge>
                          {item.folder && (
                            <Badge variant="outline" className="text-[10px] border-[rgba(91,179,179,0.2)] text-[#6B7280]">
                              {item.folder}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-[#E8E0D5] truncate">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#6B7280] hover:text-[#E8E0D5]">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-[#6B7280] hover:text-[#E57373]"
                          onClick={() => removeBookmark(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-3 text-xs text-[#6B7280]">
                      {item.source && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {item.source}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.savedAt}
                      </span>
                    </div>

                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {item.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-[10px] bg-[#3A4D5F] border-[rgba(91,179,179,0.1)] text-[#A0B0BC]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
