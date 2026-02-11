"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Using native textarea (shadcn Textarea not installed)
import { Input } from "@/components/ui/input";
import { LinkPreview } from "@/components/LinkPreview";
import { Backlinks } from "@/components/Backlinks";
import {
  ArrowLeft,
  FileText,
  Clock,
  Calendar,
  Tag,
  Link2,
  Edit3,
  Save,
  X,
  Trash2,
  BookOpen,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  Atom,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Room color for Notes (using amber as it's personal content)
const roomColor = "#C9A86C";

// Mock data - in real app, fetched from Supabase
const notesData: Record<string, {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  linkedTopics: { id: string; title: string; type: "topic" | "note"; excerpt: string }[];
  backlinks: { id: string; title: string; type: "topic" | "note" | "discussion"; excerpt: string; mentionContext?: string }[];
  source?: { title: string; chapter?: string; page?: string };
}> = {
  "note-123": {
    id: "note-123",
    title: "Surgery Rotation Notes - Week 12",
    content: `# Week 12 Surgery Notes

## Key Learnings

### Gastric Cancer Staging
Today Dr. Kumar explained the importance of proper [[TNM Staging]] for gastric cancer. Key points:
- Always examine ≥15 lymph nodes for accurate N staging
- [[Lauren Classification]] affects prognosis significantly
- Diffuse type has worse outcomes than intestinal type

### Surgical Approach
For [[Gastric Cancer]], the choice between subtotal and total gastrectomy depends on:
1. Tumor location (proximal vs distal)
2. Lauren type (diffuse needs wider margins)
3. Achieving R0 resection

## Questions to Review
- [ ] What's the difference between D1 and D2 lymphadenectomy?
- [ ] When is neoadjuvant chemo preferred over adjuvant?
- [x] FLOT regimen components - reviewed ✓

## Clinical Pearls
> "If you can't get 5cm proximal margin with subtotal, do total gastrectomy" - Dr. Kumar

The [[FLOT Regimen]] is now preferred over older protocols based on FLOT4 trial.

## Links
- [[Portal Hypertension]] - Need to review this weak area
- [[Hepatobiliary Surgery]] - Next week's topic`,
    createdAt: "2026-02-05T10:30:00",
    updatedAt: "2026-02-07T15:45:00",
    tags: ["surgery", "gastric-cancer", "rotation-notes", "week-12"],
    linkedTopics: [
      { id: "1", title: "Gastric Cancer", type: "topic", excerpt: "Comprehensive review of gastric cancer including staging and management" },
      { id: "staging", title: "TNM Staging", type: "topic", excerpt: "TNM classification system for cancer staging" },
      { id: "lauren", title: "Lauren Classification", type: "topic", excerpt: "Classification of gastric cancer into intestinal and diffuse types" },
      { id: "flot", title: "FLOT Regimen", type: "topic", excerpt: "Perioperative chemotherapy protocol for gastric cancer" },
      { id: "portal", title: "Portal Hypertension", type: "topic", excerpt: "Pathophysiology and management of portal hypertension" },
    ],
    backlinks: [
      { id: "1", title: "Gastric Cancer: Comprehensive Review", type: "topic", excerpt: "Full coverage of gastric cancer", mentionContext: "My Surgery Notes - Week 12 covers staging details" },
    ],
    source: { title: "Bailey & Love's Short Practice of Surgery", chapter: "Ch. 62", page: "1142-1158" },
  },
};

// Parse wiki-style links [[Topic Name]]
function parseWikiLinks(content: string, linkedTopics: typeof notesData["note-123"]["linkedTopics"]) {
  const linkRegex = /\[\[(.*?)\]\]/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkedTopic = linkedTopics.find(t => 
      t.title.toLowerCase() === linkText.toLowerCase()
    );

    if (linkedTopic) {
      parts.push(
        <LinkPreview
          key={match.index}
          href={linkedTopic.type === "note" ? `/notes/${linkedTopic.id}` : `/library/${linkedTopic.id}`}
          title={linkedTopic.title}
          excerpt={linkedTopic.excerpt}
          type="topic"
        >
          <span className="text-[#A78BFA] hover:text-[#C4B5FD] border-b border-dotted border-[#A78BFA]/50 cursor-pointer">
            {linkText}
          </span>
        </LinkPreview>
      );
    } else {
      // Unlinked reference - show as potential link
      parts.push(
        <span key={match.index} className="text-[#6B7280] border-b border-dashed border-[#6B7280]/50 cursor-help" title="Topic not found">
          {linkText}
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

// Render markdown-like content with wiki links
function renderContent(content: string, linkedTopics: typeof notesData["note-123"]["linkedTopics"]) {
  const lines = content.split("\n");
  
  return lines.map((line, i) => {
    // Headers
    if (line.startsWith("# ")) {
      return <h1 key={i} className="text-2xl font-bold text-[#E8E0D5] mt-6 mb-4">{parseWikiLinks(line.slice(2), linkedTopics)}</h1>;
    }
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-xl font-bold text-[#E8E0D5] mt-5 mb-3">{parseWikiLinks(line.slice(3), linkedTopics)}</h2>;
    }
    if (line.startsWith("### ")) {
      return <h3 key={i} className="text-lg font-semibold text-[#E8E0D5] mt-4 mb-2">{parseWikiLinks(line.slice(4), linkedTopics)}</h3>;
    }
    
    // Blockquotes
    if (line.startsWith("> ")) {
      return (
        <blockquote key={i} className="border-l-4 border-[#C9A86C]/50 pl-4 py-2 my-3 text-[#A0B0BC] italic bg-[#C9A86C]/5 rounded-r-lg">
          {parseWikiLinks(line.slice(2), linkedTopics)}
        </blockquote>
      );
    }
    
    // Checkboxes
    if (line.startsWith("- [ ] ")) {
      return (
        <div key={i} className="flex items-start gap-2 my-1">
          <input type="checkbox" className="mt-1 rounded border-[#6B7280]" disabled />
          <span className="text-[#A0B0BC]">{parseWikiLinks(line.slice(6), linkedTopics)}</span>
        </div>
      );
    }
    if (line.startsWith("- [x] ")) {
      return (
        <div key={i} className="flex items-start gap-2 my-1">
          <input type="checkbox" checked className="mt-1 rounded border-[#7BA69E] text-[#7BA69E]" disabled />
          <span className="text-[#6B7280] line-through">{parseWikiLinks(line.slice(6), linkedTopics)}</span>
        </div>
      );
    }
    
    // List items
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-4 my-1 text-[#A0B0BC] list-disc">
          {parseWikiLinks(line.slice(2), linkedTopics)}
        </li>
      );
    }
    if (/^\d+\. /.test(line)) {
      return (
        <li key={i} className="ml-4 my-1 text-[#A0B0BC] list-decimal">
          {parseWikiLinks(line.replace(/^\d+\. /, ""), linkedTopics)}
        </li>
      );
    }
    
    // Empty lines
    if (line.trim() === "") {
      return <div key={i} className="h-4" />;
    }
    
    // Regular paragraphs with bold/italic
    const processedLine = line;
    // Handle bold
    const boldParts = processedLine.split(/\*\*(.*?)\*\*/g);
    const rendered = boldParts.map((part, j) => 
      j % 2 === 1 ? <strong key={j} className="text-[#E8E0D5] font-semibold">{part}</strong> : parseWikiLinks(part, linkedTopics)
    );
    
    return <p key={i} className="text-[#A0B0BC] my-2 leading-relaxed">{rendered}</p>;
  });
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  
  const noteId = params.id as string;
  const note = notesData[noteId];

  useEffect(() => {
    if (note) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags);
    }
  }, [note]);

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <FileText className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#E8E0D5] mb-2">Note not found</h1>
        <p className="text-[#A0B0BC] mb-6">This note doesn&apos;t exist or has been deleted.</p>
        <Button onClick={() => router.push("/notes")} variant="outline" className="border-[rgba(91,179,179,0.3)]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    // In real app: Save to Supabase
    console.log("Saving:", { title: editTitle, content: editContent, tags: editTags });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim().toLowerCase())) {
      setEditTags([...editTags, newTag.trim().toLowerCase()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter(t => t !== tag));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ATOM Floating Button */}
      <Link
        href={`/chat?context=note&id=${noteId}`}
        className="fixed bottom-24 lg:bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#0E7490] rounded-full shadow-lg shadow-[#5BB3B3]/30 transition-all hover:scale-105 group"
      >
        <Atom className="w-5 h-5 group-hover:animate-pulse" />
        <span className="hidden sm:inline font-medium">Ask ATOM</span>
      </Link>

      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Notes
      </button>

      {/* Main Note Card */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] border-l-4 mb-6" style={{ borderLeftColor: roomColor }}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-bold bg-[#2D3E50] border-[rgba(91,179,179,0.3)] text-[#E8E0D5] mb-2"
                  placeholder="Note title..."
                />
              ) : (
                <h1 className="text-2xl font-bold text-[#E8E0D5] mb-2">{note.title}</h1>
              )}
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(note.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Updated {formatDate(note.updatedAt)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-[#7BA69E] hover:bg-[#047857] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-[rgba(91,179,179,0.3)] text-[#A0B0BC]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-[rgba(91,179,179,0.3)] text-[#A0B0BC] hover:text-[#C9A86C] hover:border-[#C9A86C]/50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[rgba(91,179,179,0.3)] text-[#A0B0BC]"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[rgba(91,179,179,0.3)] text-[#A0B0BC] hover:text-red-400 hover:border-red-400/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Tag className="w-4 h-4 text-[#6B7280]" />
            {(isEditing ? editTags : note.tags).map((tag) => (
              <Badge
                key={tag}
                className="bg-[#C9A86C]/10 text-[#C9A86C] border-[#C9A86C]/30 text-xs"
              >
                #{tag}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
            {isEditing && (
              <div className="flex items-center gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag..."
                  className="h-6 w-24 text-xs bg-[#2D3E50] border-[rgba(91,179,179,0.2)]"
                />
                <Button size="sm" variant="ghost" onClick={handleAddTag} className="h-6 px-2">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Source reference */}
          {note.source && (
            <div className="mb-6 p-3 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.1)] flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#5BB3B3] shrink-0" />
              <div>
                <p className="text-sm text-[#E8E0D5] font-medium">{note.source.title}</p>
                <p className="text-xs text-[#6B7280]">
                  {note.source.chapter && `${note.source.chapter}`}
                  {note.source.chapter && note.source.page && " • "}
                  {note.source.page && `p. ${note.source.page}`}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto text-[#5BB3B3] hover:text-[#22D3EE]">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Note Content */}
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[400px] p-4 bg-[#2D3E50] border border-[rgba(91,179,179,0.3)] rounded-lg text-[#E8E0D5] font-mono text-sm leading-relaxed resize-y focus:border-[#C9A86C] focus:outline-none focus:ring-1 focus:ring-[#C9A86C]/50 placeholder-[#6B7280]"
              placeholder="Write your notes here... Use [[Topic Name]] to create links."
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              {renderContent(note.content, note.linkedTopics)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Linked Topics */}
      {note.linkedTopics.length > 0 && (
        <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
              <Link2 className="w-5 h-5 text-[#5BB3B3]" />
              Linked Topics
              <span className="text-sm font-normal text-[#6B7280] ml-auto">
                {note.linkedTopics.length} links
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {note.linkedTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.type === "note" ? `/notes/${topic.id}` : `/library/${topic.id}`}
                  className="p-3 rounded-lg bg-[#2D3E50] border border-[rgba(91,179,179,0.1)] hover:border-[#5BB3B3]/50 transition-all group flex items-center gap-3"
                >
                  {topic.type === "note" ? (
                    <FileText className="w-4 h-4 text-[#C9A86C] shrink-0" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-[#5BB3B3] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#E8E0D5] group-hover:text-[#5BB3B3] transition-colors text-sm">
                      {topic.title}
                    </p>
                    <p className="text-xs text-[#6B7280] line-clamp-1">{topic.excerpt}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#5BB3B3] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backlinks */}
      {note.backlinks.length > 0 && (
        <Backlinks
          backlinks={note.backlinks}
          currentTopicTitle={note.title}
          className="mb-6"
        />
      )}

      {/* Ask ATOM about this note */}
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5BB3B3] to-[#4A9E9E] flex items-center justify-center shadow-lg shadow-[#5BB3B3]/25">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#E8E0D5]">Need help understanding these notes?</h3>
              <p className="text-sm text-[#A0B0BC]">ATOM can explain concepts, quiz you, or help expand on any topic.</p>
            </div>
            <Button
              onClick={() => router.push(`/chat?context=note&id=${noteId}`)}
              className="bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#0E7490] text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask ATOM
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
