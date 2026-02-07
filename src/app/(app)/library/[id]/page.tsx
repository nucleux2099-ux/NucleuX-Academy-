"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/Skeleton";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Clock,
  Star,
  Share2,
  Bookmark,
  CheckCircle,
  Play,
  StickyNote,
  MessageCircle,
  List,
  X,
  ChevronRight,
  Highlighter,
  Quote,
} from "lucide-react";

// Mock data - in real app, this would be fetched
const materialsData: Record<number, {
  id: number;
  title: string;
  category: string;
  type: string;
  duration: string;
  rating: number;
  progress: number;
  starred: boolean;
  icon: typeof FileText;
  content: string;
  sections: { id: string; title: string; content: string }[];
  objectives: string[];
  relatedTopics: { title: string; id: number }[];
  citations: { text: string; source: string; page: string }[];
}> = {
  1: {
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
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: `Gastric cancer remains one of the most common malignancies worldwide, with significant geographic variation in incidence. Understanding the surgical principles and multimodal treatment approach is essential for optimal patient outcomes.

The incidence is highest in East Asia, Eastern Europe, and South America. Risk factors include H. pylori infection, dietary factors (high salt, smoked foods), smoking, family history, and previous gastric surgery.`,
      },
      {
        id: "classification",
        title: "Classification",
        content: `## Lauren Classification

The Lauren classification is clinically relevant for prognosis and treatment planning:

**1. Intestinal type** (better prognosis)
- Well-differentiated glandular pattern
- Associated with H. pylori and intestinal metaplasia
- More common in endemic areas
- Better response to chemotherapy

**2. Diffuse type** (poorer prognosis)
- Poorly differentiated
- "Signet ring" cells on histology
- Linitis plastica variant (leather bottle stomach)
- Higher rate of peritoneal dissemination`,
      },
      {
        id: "staging",
        title: "TNM Staging",
        content: `## Staging (TNM 8th Edition)

Accurate staging is crucial for treatment planning and prognosis.

### T Stage (Tumor Depth)
- **T1a:** Lamina propria/muscularis mucosae
- **T1b:** Submucosa
- **T2:** Muscularis propria
- **T3:** Subserosa (penetrates serosa without invasion)
- **T4a:** Serosa (visceral peritoneum)
- **T4b:** Adjacent structures

### N Stage (Lymph Nodes)
- **N0:** No regional lymph node metastasis
- **N1:** 1-2 regional nodes
- **N2:** 3-6 regional nodes
- **N3a:** 7-15 regional nodes
- **N3b:** >15 regional nodes

The number of lymph nodes examined should be ≥15 for adequate staging.`,
      },
      {
        id: "surgery",
        title: "Surgical Management",
        content: `## Surgical Principles

### Goals of Surgery
1. Achieve R0 (margin-negative) resection
2. Adequate lymphadenectomy
3. Maintain quality of life

### Extent of Gastrectomy

**Subtotal/Distal Gastrectomy**
- For antral/distal tumors
- Preserves proximal stomach and cardia
- Better nutritional outcomes
- 5cm proximal margin recommended

**Total Gastrectomy**
- For proximal tumors
- Diffuse type cancers (need 6cm margin)
- When subtotal won't achieve adequate margins

**Proximal Gastrectomy**
- Selected cases of GEJ tumors
- Higher rates of reflux

### Lymphadenectomy
- **D1:** Perigastric nodes only
- **D2:** D1 + nodes along celiac axis branches
- D2 is the standard of care for curative intent`,
      },
      {
        id: "adjuvant",
        title: "Adjuvant Therapy",
        content: `## Multimodal Treatment

### Perioperative Chemotherapy
The FLOT regimen (5-FU, leucovorin, oxaliplatin, docetaxel) is now preferred over ECF/ECX based on the FLOT4 trial showing improved survival.

### Adjuvant Chemoradiation
The Macdonald protocol (INT-0116) showed benefit with adjuvant 5-FU and radiation, particularly for patients who did not receive neoadjuvant therapy or had inadequate lymphadenectomy.

### Adjuvant Chemotherapy Alone
S-1 based regimens showed benefit in Asian studies but results may not be generalizable to Western populations.`,
      },
      {
        id: "prognosis",
        title: "Prognosis",
        content: `## Survival by Stage

5-year survival varies significantly by stage:

| Stage | 5-Year Survival |
|-------|-----------------|
| IA | >90% |
| IB-IIA | 70-85% |
| IIB-IIIA | 50-65% |
| IIIB-IIIC | 20-40% |
| IV | <5% |

### Prognostic Factors
- TNM stage (most important)
- Lauren classification
- Surgical margin status
- Lymphovascular invasion
- HER2 status (for targeted therapy)`,
      },
    ],
    objectives: [
      "Understand gastric cancer epidemiology and risk factors",
      "Learn the Lauren classification and its clinical implications",
      "Master TNM staging for gastric cancer",
      "Understand surgical principles and types of gastrectomy",
      "Know indications for adjuvant therapy",
    ],
    relatedTopics: [
      { title: "Esophageal Cancer", id: 10 },
      { title: "GI Anatomy", id: 2 },
      { title: "Surgical Oncology Principles", id: 11 },
      { title: "Chemotherapy Protocols", id: 12 },
    ],
    citations: [
      { text: "D2 lymphadenectomy is the standard", source: "Maingot's Abdominal Operations, 12th Ed", page: "Ch22, p.521" },
      { text: "FLOT regimen is now preferred", source: "FLOT4 Trial, Lancet 2019", page: "393:1948-57" },
      { text: "Lauren classification", source: "Sleisenger & Fordtran's GI Disease, 11th Ed", page: "Ch54, p.892" },
    ],
  },
};

// Default fallback
const defaultMaterial = {
  title: "Study Material",
  category: "General",
  type: "Note",
  duration: "15 min read",
  rating: 4.5,
  progress: 0,
  starred: false,
  icon: FileText,
  content: "Content not available.",
  sections: [{ id: "content", title: "Content", content: "Detailed content coming soon..." }],
  objectives: ["Learn key concepts", "Understand clinical applications"],
  relatedTopics: [{ title: "Related Topic 1", id: 1 }],
  citations: [],
};

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [showToc, setShowToc] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [highlightMode, setHighlightMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const materialId = Number(params.id);
  const material = materialsData[materialId] || { id: materialId, ...defaultMaterial };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(progress, 100));

        // Update active section
        const sections = material.sections;
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i].id);
          if (element && element.getBoundingClientRect().top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [material.sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#1E293B]">
        <div
          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ask ATOM Floating Button */}
      <Link
        href="/chat"
        className="fixed bottom-24 lg:bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full shadow-lg glow-purple transition-all hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Ask ATOM</span>
      </Link>

      <div className="flex gap-6">
        {/* Table of Contents Sidebar */}
        <aside
          className={`hidden lg:block w-64 shrink-0 ${
            showToc ? "" : "lg:hidden"
          }`}
        >
          <div className="sticky top-20">
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Contents
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {Math.round(scrollProgress)}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <nav className="space-y-1">
                  {material.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? "bg-[#7C3AED]/20 text-[#7C3AED] border-l-2 border-[#7C3AED]"
                          : "text-[#94A3B8] hover:text-white hover:bg-[#334155]/50"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Reading Stats */}
            <Card className="bg-[#1E293B] border-[#334155] mt-4">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">Reading Progress</span>
                  <span className="font-medium">{Math.round(scrollProgress)}%</span>
                </div>
                <Progress value={scrollProgress} className="h-2" />
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Clock className="w-3 h-3" />
                  ~{Math.max(1, Math.round((100 - scrollProgress) / 10))} min left
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6" ref={contentRef}>
          {/* Back Navigation */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>

          {/* Header Card */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon */}
                <div
                  className={`p-4 rounded-xl shrink-0 ${
                    material.type === "Video"
                      ? "bg-[#F59E0B]/20"
                      : material.type === "Visual"
                      ? "bg-[#06B6D4]/20"
                      : "bg-[#7C3AED]/20"
                  }`}
                >
                  <material.icon
                    className="w-8 h-8"
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

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">
                      {material.category}
                    </Badge>
                    <Badge variant="outline" className="border-[#334155]">
                      {material.type}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-3">{material.title}</h1>
                  <p className="text-[#94A3B8] mb-4">{material.content}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-[#94A3B8]">
                      <Clock className="w-4 h-4" />
                      {material.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="font-medium">{material.rating}</span>
                    </span>
                    {material.progress === 100 && (
                      <span className="flex items-center gap-1 text-[#10B981]">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`border-[#334155] ${isBookmarked ? "text-[#7C3AED]" : ""}`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#7C3AED]" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="border-[#334155]">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setHighlightMode(!highlightMode)}
                    className={`border-[#334155] ${highlightMode ? "text-[#F59E0B] bg-[#F59E0B]/10" : ""}`}
                  >
                    <Highlighter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNotePanel(!showNotePanel)}
                    className={`border-[#334155] ${showNotePanel ? "text-[#7C3AED]" : ""}`}
                  >
                    <StickyNote className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlight Mode Banner */}
          {highlightMode && (
            <div className="p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center gap-3 animate-fade-in">
              <Highlighter className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-sm text-[#F59E0B]">
                Highlight mode active - Select text to highlight
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHighlightMode(false)}
                className="ml-auto text-[#F59E0B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Note Panel */}
          {showNotePanel && (
            <Card className="bg-[#1E293B] border-[#7C3AED]/30 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-[#7C3AED]" />
                  My Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Add your personal notes here..."
                  className="w-full h-32 p-3 bg-[#0F172A] border border-[#334155] rounded-lg resize-none focus:border-[#7C3AED] focus:outline-none text-sm"
                />
                <div className="flex justify-end mt-3">
                  <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Objectives */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg">Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {material.objectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-[#94A3B8]">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Content Sections */}
          {material.sections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className="bg-[#1E293B] border-[#334155] scroll-mt-20"
            >
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-[#94A3B8] space-y-4 leading-relaxed whitespace-pre-line">
                    {section.content.split("\n\n").map((paragraph, i) => {
                      // Handle headers
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h2
                            key={i}
                            className="text-xl font-bold text-white mt-6 mb-3"
                          >
                            {paragraph.replace("## ", "")}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith("### ")) {
                        return (
                          <h3
                            key={i}
                            className="text-lg font-semibold text-white mt-4 mb-2"
                          >
                            {paragraph.replace("### ", "")}
                          </h3>
                        );
                      }
                      // Handle bold text and list items
                      const formatted = paragraph
                        .split("\n")
                        .map((line, j) => {
                          if (line.startsWith("- **") || line.startsWith("**")) {
                            return (
                              <div key={j} className="my-1">
                                {line.split(/\*\*(.*?)\*\*/g).map((part, k) =>
                                  k % 2 === 1 ? (
                                    <strong key={k} className="text-white">
                                      {part}
                                    </strong>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>
                            );
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <li key={j} className="ml-4 my-1">
                                {line.replace("- ", "")}
                              </li>
                            );
                          }
                          if (/^\d+\. /.test(line)) {
                            return (
                              <li key={j} className="ml-4 my-1 list-decimal">
                                {line.replace(/^\d+\. /, "")}
                              </li>
                            );
                          }
                          return line ? <p key={j}>{line}</p> : null;
                        });
                      return <div key={i}>{formatted}</div>;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Citations */}
          {material.citations.length > 0 && (
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Quote className="w-5 h-5 text-[#06B6D4]" />
                  References & Citations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {material.citations.map((citation, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#0F172A] border border-[#334155] group hover:border-[#06B6D4]/50 transition-colors"
                  >
                    <p className="text-sm text-white mb-1">"{citation.text}"</p>
                    <p className="text-xs text-[#06B6D4]">
                      📚 {citation.source} • {citation.page}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Related Topics */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg">Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {material.relatedTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/library/${topic.id}`}
                    className="p-4 rounded-lg bg-[#0F172A] border border-[#334155] hover:border-[#7C3AED]/50 transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-[#7C3AED]" />
                      <span className="font-medium group-hover:text-[#7C3AED] transition-colors">
                        {topic.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#7C3AED] transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
