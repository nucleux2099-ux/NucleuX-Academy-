"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  List,
  Settings,
  Minus,
  Plus,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  StickyNote,
  Brain,
  Target,
  Highlighter,
  MessageCircle,
  Quote,
  Share2,
  MoreVertical,
  Eye,
  Sparkles,
  FileText,
  Atom,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

// Sample content for demonstration
const topicData = {
  id: "gastric-cancer",
  title: "Gastric Cancer: Surgical Management",
  subtitle: "A comprehensive guide to diagnosis, staging, and treatment",
  source: {
    book: "Maingot's Abdominal Operations",
    edition: "12th Edition",
    chapter: "Chapter 22",
    pages: "521-548",
  },
  category: "Surgery",
  readTime: 25,
  rating: 4.9,
  totalRatings: 128,
  lastUpdated: "2026-02-01",
  progress: 65,
  isBookmarked: true,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: `Gastric cancer remains one of the leading causes of cancer-related mortality worldwide. Despite declining incidence in Western countries, it continues to pose significant challenges in diagnosis and management.

**Epidemiology**

Gastric cancer shows marked geographic variation:
• **High incidence areas:** Japan, Korea, Eastern Europe, South America
• **Low incidence areas:** North America, Western Europe, Africa

The intestinal type is more common in high-incidence areas and is associated with environmental factors, while the diffuse type shows more uniform distribution globally.

**Risk Factors**

Understanding risk factors is crucial for prevention and early detection:

| Factor | Relative Risk |
|--------|---------------|
| H. pylori infection | 3-6x |
| Family history | 2-3x |
| Previous gastric surgery | 2-4x |
| Pernicious anemia | 2-3x |
| Blood type A | 1.2x |

The declining incidence in Western countries correlates with improved food preservation (refrigeration), decreased smoking, and successful H. pylori treatment.`,
    },
    {
      id: "classification",
      title: "Classification & Staging",
      content: `## Lauren Classification

The Lauren classification remains clinically relevant for treatment planning:

**Intestinal Type (50-60%)**
• Well-differentiated glandular structures
• Often preceded by intestinal metaplasia
• Better prognosis
• More common in elderly males
• Responds better to chemotherapy

**Diffuse Type (30-40%)**
• Poorly cohesive cells infiltrating the gastric wall
• "Signet ring" cells characteristic
• Linitis plastica (leather bottle stomach) variant
• Worse prognosis
• Earlier age of onset
• Requires wider surgical margins (6cm vs 5cm)

**Mixed Type (10%)**
• Features of both types
• Prognosis intermediate

---

## TNM Staging (8th Edition)

Accurate staging is fundamental to treatment planning.

### T Stage (Primary Tumor)

| Stage | Definition |
|-------|------------|
| Tis | Carcinoma in situ |
| T1a | Lamina propria or muscularis mucosae |
| T1b | Submucosa |
| T2 | Muscularis propria |
| T3 | Subserosa |
| T4a | Serosa (visceral peritoneum) |
| T4b | Adjacent structures |

### N Stage (Regional Nodes)

**Critical Point:** Minimum 15 lymph nodes required for accurate staging.

| Stage | Nodes Involved |
|-------|----------------|
| N0 | No metastasis |
| N1 | 1-2 nodes |
| N2 | 3-6 nodes |
| N3a | 7-15 nodes |
| N3b | >15 nodes |

### M Stage
• **M0:** No distant metastasis
• **M1:** Distant metastasis present`,
    },
    {
      id: "surgical-principles",
      title: "Surgical Principles",
      content: `## Goals of Curative Surgery

1. **Complete (R0) resection** — No residual tumor
2. **Adequate lymphadenectomy** — D2 dissection standard
3. **Safe anastomosis** — Minimize leaks
4. **Functional preservation** — When oncologically safe

## Extent of Gastrectomy

### Distal/Subtotal Gastrectomy

**Indications:**
• Antral and distal body tumors
• Intestinal type histology
• Ability to achieve 5cm proximal margin

**Advantages:**
• Preserves gastric reservoir function
• Better nutritional outcomes
• Lower morbidity
• Quality of life benefits

**Reconstruction Options:**
• Billroth I (gastroduodenostomy) — limited use
• Billroth II (gastrojejunostomy)
• Roux-en-Y gastrojejunostomy — preferred

---

### Total Gastrectomy

**Indications:**
• Proximal tumors
• Diffuse type (need 6cm margin)
• Linitis plastica
• Multifocal disease
• Hereditary diffuse gastric cancer (HDGC)

**Technical Points:**
• Complete removal of stomach with 2-5cm esophageal margin
• Splenectomy only for direct invasion (not routine)
• Roux-en-Y esophagojejunostomy reconstruction
• Consider jejunal pouch for improved quality of life

> "If you cannot achieve a 5cm proximal margin with subtotal gastrectomy, proceed to total gastrectomy. Never compromise margins."
> — **Dr. Keiichi Maruyama**, National Cancer Center Japan

---

## Lymphadenectomy

### D1 Dissection
Perigastric nodes along lesser and greater curvatures (stations 1-6)

### D2 Dissection (Standard of Care)
D1 + nodes along:
• Left gastric artery (station 7)
• Common hepatic artery (station 8)
• Celiac axis (station 9)
• Splenic hilum (station 10)
• Splenic artery (station 11)

**Evidence:** DUTCH trial showed D2 with experienced surgeons had similar mortality to D1 but better locoregional control.`,
    },
    {
      id: "multimodal-therapy",
      title: "Multimodal Therapy",
      content: `## Perioperative Chemotherapy

### FLOT Regimen (Current Standard)

Based on FLOT4 trial showing superiority over ECF/ECX:

| Agent | Dose | Schedule |
|-------|------|----------|
| 5-Fluorouracil | 2600 mg/m² | 24h infusion |
| Leucovorin | 200 mg/m² | Day 1 |
| Oxaliplatin | 85 mg/m² | Day 1 |
| Docetaxel | 50 mg/m² | Day 1 |

**Schedule:** 4 cycles preop + 4 cycles postop (q2 weeks)

**FLOT4 Results:**
• Overall survival: 50 months (FLOT) vs 35 months (ECF)
• Pathologic complete response: 16% vs 6%
• R0 resection rate: 85% vs 78%

---

## Adjuvant Options

### Chemoradiation (Macdonald Protocol)
• 5-FU/leucovorin + 45Gy radiation
• For patients who did not receive neoadjuvant therapy
• Particularly if <D2 lymphadenectomy

### Adjuvant Chemotherapy
• S-1 monotherapy (Asian data)
• XELOX (Western option)
• Duration: 6-12 months

---

## Targeted Therapy

### HER2+ Disease (~15-20%)
• **Trastuzumab** added to chemotherapy
• ToGA trial: improved survival in metastatic setting
• Testing recommended for all advanced cases

### Immunotherapy
• **Nivolumab** (anti-PD-1) showing promise
• CheckMate 649: first-line in combination with chemo
• PD-L1 CPS score guides selection`,
    },
    {
      id: "prognosis",
      title: "Prognosis & Follow-up",
      content: `## Stage-Specific Survival

| Stage | 5-Year Survival | Notes |
|-------|-----------------|-------|
| IA | 94% | T1N0 — Consider endoscopic resection |
| IB | 88% | T1N1 or T2N0 |
| IIA | 82% | T1N2 or T2N1 or T3N0 |
| IIB | 69% | T1N3a or T2N2 or T3N1 or T4aN0 |
| IIIA | 54% | Various T3-4, N1-2 combinations |
| IIIB | 36% | T3N3a or T4aN3a or T4bN1-2 |
| IIIC | 18% | T4aN3b or T4bN3 |
| IV | <5% | Any T, any N, M1 |

## Prognostic Factors

**Favorable:**
• Intestinal type histology
• Distal tumor location
• <4 positive nodes
• Complete (R0) resection
• Response to neoadjuvant therapy

**Unfavorable:**
• Diffuse/signet ring histology
• Linitis plastica
• Positive margins (R1/R2)
• Peritoneal involvement
• Poor differentiation

---

## Surveillance Protocol

| Timeframe | Investigations |
|-----------|----------------|
| Every 3-6 months (Years 1-2) | H&P, CBC, CMP, CEA |
| Every 6-12 months (Years 3-5) | H&P, CBC, CMP, CEA |
| Annually (After Year 5) | H&P, B12 levels |

**Imaging:** CT chest/abdomen/pelvis every 6-12 months for 3 years if high-risk features.

**Endoscopy:** Annual upper GI endoscopy for subtotal gastrectomy patients (stump cancer risk 1-2%).`,
    },
  ],
  keyPoints: [
    "D2 lymphadenectomy is the standard of care for curative intent",
    "FLOT is the preferred perioperative chemotherapy regimen",
    "Minimum 15 lymph nodes required for accurate staging",
    "Lauren classification guides surgical margin requirements",
    "HER2 testing recommended for all advanced cases",
  ],
  citations: [
    { id: 1, text: "D2 lymphadenectomy standard", source: "Maingot's Abdominal Operations, 12th Ed", page: "528" },
    { id: 2, text: "FLOT4 trial results", source: "Al-Batran et al., Lancet 2019;393:1948-57", page: "" },
    { id: 3, text: "TNM 8th Edition staging", source: "AJCC Cancer Staging Manual, 8th Ed", page: "203-220" },
  ],
};

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // UI State
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState(topicData.sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(topicData.readTime);
  
  // Reading preferences
  const [fontSize, setFontSize] = useState(16);
  const [focusMode, setFocusMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(topicData.isBookmarked);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Feature panels
  const [showNotes, setShowNotes] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [noteText, setNoteText] = useState("");
  
  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
      
      // Update reading time estimate
      const remaining = Math.round(topicData.readTime * (1 - progress / 100));
      setReadingTime(Math.max(1, remaining));
      
      // Update active section
      for (let i = topicData.sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(topicData.sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(topicData.sections[i].id);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  
  const navigateSection = (direction: "prev" | "next") => {
    const currentIndex = topicData.sections.findIndex(s => s.id === activeSection);
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < topicData.sections.length) {
      scrollToSection(topicData.sections[newIndex].id);
    }
  };
  
  // Render content with markdown-like formatting
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-[#E8E0D5] mt-8 mb-4 pb-2 border-b border-[rgba(91,179,179,0.1)]">{line.slice(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-semibold text-[#E8E0D5] mt-6 mb-3">{line.slice(4)}</h3>;
      }
      
      // Blockquotes
      if (line.startsWith("> ")) {
        const isAttribution = line.includes("—");
        return (
          <blockquote key={i} className={`border-l-4 border-[#C9A86C]/50 pl-4 py-3 my-4 ${isAttribution ? 'bg-[#C9A86C]/5' : 'bg-[rgba(91,179,179,0.05)]'} rounded-r-lg italic`}>
            <span className="text-[#A0B0BC]">{line.slice(2)}</span>
          </blockquote>
        );
      }
      
      // Horizontal rule
      if (line.trim() === "---") {
        return <hr key={i} className="my-8 border-[rgba(91,179,179,0.15)]" />;
      }
      
      // Tables
      if (line.startsWith("|") && line.includes("|")) {
        // Skip separator rows
        if (line.includes("---")) return null;
        
        const cells = line.split("|").filter(c => c.trim());
        const isHeader = i === 0 || (content.split("\n")[i - 1]?.trim() === "" || content.split("\n")[i + 1]?.includes("---"));
        
        return (
          <tr key={i} className={isHeader ? "bg-[#3A4D5F]" : "border-t border-[rgba(91,179,179,0.1)]"}>
            {cells.map((cell, ci) => {
              const Tag = isHeader ? "th" : "td";
              return (
                <Tag key={ci} className={`px-4 py-2.5 text-left ${isHeader ? 'font-semibold text-[#E8E0D5] text-sm' : 'text-[#A0B0BC]'}`}>
                  {renderInline(cell.trim())}
                </Tag>
              );
            })}
          </tr>
        );
      }
      
      // List items
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={i} className="flex items-start gap-2 my-1.5 text-[#A0B0BC]">
            <span className="text-[#5BB3B3] mt-1.5">•</span>
            <span>{renderInline(line.slice(2))}</span>
          </li>
        );
      }
      if (/^\d+\. /.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        return (
          <li key={i} className="flex items-start gap-3 my-1.5 text-[#A0B0BC]">
            <span className="text-[#5BB3B3] font-semibold min-w-[20px]">{num}.</span>
            <span>{renderInline(line.replace(/^\d+\. /, ""))}</span>
          </li>
        );
      }
      
      // Empty lines
      if (line.trim() === "") return <div key={i} className="h-4" />;
      
      // Regular paragraphs
      return <p key={i} className="text-[#A0B0BC] my-3 leading-relaxed">{renderInline(line)}</p>;
    });
  };
  
  // Render inline formatting (bold, etc)
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-[#E8E0D5] font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };
  
  // Wrap tables
  const wrapTables = (content: string) => {
    const lines = content.split("\n");
    const result: React.ReactNode[] = [];
    let tableRows: React.ReactNode[] = [];
    let inTable = false;
    
    lines.forEach((line, i) => {
      if (line.startsWith("|") && !line.includes("---")) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        const cells = line.split("|").filter(c => c.trim());
        const isHeader = !inTable || tableRows.length === 0;
        tableRows.push(
          <tr key={i} className={isHeader ? "bg-[#3A4D5F]" : "border-t border-[rgba(91,179,179,0.1)] hover:bg-[#3A4D5F]/50"}>
            {cells.map((cell, ci) => {
              const Tag = isHeader ? "th" : "td";
              return (
                <Tag key={ci} className={`px-4 py-2.5 text-left ${isHeader ? 'font-semibold text-[#E8E0D5] text-sm' : 'text-[#A0B0BC]'}`}>
                  {renderInline(cell.trim())}
                </Tag>
              );
            })}
          </tr>
        );
      } else if (line.includes("---") && inTable) {
        // Skip separator
      } else {
        if (inTable && tableRows.length > 0) {
          result.push(
            <div key={`table-${i}`} className="overflow-x-auto my-6">
              <table className="min-w-full border border-[rgba(91,179,179,0.15)] rounded-lg overflow-hidden">
                <tbody>{tableRows}</tbody>
              </table>
            </div>
          );
          tableRows = [];
          inTable = false;
        }
        result.push(renderContent(line)[0]);
      }
    });
    
    // Handle remaining table
    if (tableRows.length > 0) {
      result.push(
        <div key="table-end" className="overflow-x-auto my-6">
          <table className="min-w-full border border-[rgba(91,179,179,0.15)] rounded-lg overflow-hidden">
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      );
    }
    
    return result;
  };

  return (
    <div className={focusMode ? "min-h-screen bg-[#0a1628]" : "ui-shell"}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#2D3E50]">
        <div 
          className="h-full bg-gradient-to-r from-[#7BA69E] to-[#5BB3B3] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Floating Controls */}
      <div className={`fixed top-20 right-6 z-40 flex flex-col gap-2 transition-opacity ${focusMode ? 'opacity-30 hover:opacity-100' : ''}`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5] w-10 h-10"
        >
          {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFontSize(Math.max(12, fontSize - 2))}
          className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5] w-10 h-10"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFontSize(Math.min(24, fontSize + 2))}
          className="bg-[#364A5E] border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5] w-10 h-10"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFocusMode(!focusMode)}
          className={`bg-[#364A5E] border-[rgba(91,179,179,0.15)] w-10 h-10 ${focusMode ? 'text-[#5BB3B3] border-[#5BB3B3]/50' : 'text-[#A0B0BC] hover:text-[#E8E0D5]'}`}
        >
          {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setHighlightMode(!highlightMode)}
          className={`bg-[#364A5E] border-[rgba(91,179,179,0.15)] w-10 h-10 ${highlightMode ? 'text-[#C9A86C] border-[#C9A86C]/50' : 'text-[#A0B0BC] hover:text-[#E8E0D5]'}`}
        >
          <Highlighter className="w-4 h-4" />
        </Button>
      </div>
      
      {/* ATOM Button */}
      <Link
        href={`/chat?topic=${params.id}`}
        className="fixed bottom-24 lg:bottom-8 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5BB3B3] to-[#4A9E9E] hover:from-[#4A9E9E] hover:to-[#0E7490] rounded-full shadow-lg shadow-[#5BB3B3]/30 transition-all hover:scale-105"
      >
        <Atom className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Ask ATOM</span>
      </Link>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        {showSidebar && !focusMode && (
          <aside className="hidden lg:block w-72 shrink-0 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Source Info */}
            <div className="mb-6 p-4 bg-[#364A5E] rounded-xl border border-[rgba(91,179,179,0.15)]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#7BA69E]/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-[#7BA69E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#E8E0D5]">{topicData.source.book}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{topicData.source.chapter} • p. {topicData.source.pages}</p>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#A0B0BC]">Reading Progress</span>
                <span className="text-[#E8E0D5] font-medium">{Math.round(scrollProgress)}%</span>
              </div>
              <Progress value={scrollProgress} className="h-2" />
              <p className="text-xs text-[#6B7280] mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{readingTime} min remaining
              </p>
            </div>
            
            {/* Table of Contents */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
                <List className="w-4 h-4 text-[#5BB3B3]" />
                Contents
              </h3>
              <nav className="space-y-1">
                {topicData.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? "bg-[#7BA69E]/20 text-[#7BA69E] border-l-2 border-[#7BA69E] font-medium"
                        : "text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[#3A4D5F]"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Key Points */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C9A86C]" />
                Key Points
              </h3>
              <ul className="space-y-2">
                {topicData.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#A0B0BC]">
                    <CheckCircle className="w-3 h-3 text-[#7BA69E] mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => setIsBookmarked(!isBookmarked)}
                variant="outline"
                className={`w-full justify-start border-[rgba(91,179,179,0.15)] ${isBookmarked ? 'text-[#C9A86C] bg-[#C9A86C]/10' : 'text-[#A0B0BC]'}`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button
                onClick={() => setShowNotes(!showNotes)}
                variant="outline"
                className={`w-full justify-start border-[rgba(91,179,179,0.15)] ${showNotes ? 'text-[#C9A86C] bg-[#C9A86C]/10' : 'text-[#A0B0BC]'}`}
              >
                <StickyNote className="w-4 h-4 mr-2" />
                Take Notes
              </Button>
              <Button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`w-full justify-start ${isCompleted ? 'bg-[#7BA69E] hover:bg-[#047857] text-white' : 'bg-[#3A4D5F] hover:bg-[#1a3048] text-[#A0B0BC]'}`}
              >
                {isCompleted ? <Sparkles className="w-4 h-4 mr-2" /> : <Target className="w-4 h-4 mr-2" />}
                {isCompleted ? "Completed!" : "Mark Complete"}
              </Button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 min-w-0 ${focusMode ? 'max-w-3xl mx-auto' : ''}`}>
          <div className="p-6" ref={contentRef}>
            {/* Back Navigation */}
            {!focusMode && (
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#A0B0BC] hover:text-[#E8E0D5] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Library
              </button>
            )}

            {/* Header */}
            <div className={`mb-8 ${focusMode ? 'text-center' : ''}`}>
              <div className="flex items-center gap-2 mb-3 flex-wrap justify-center lg:justify-start">
                <Badge className="bg-[#7BA69E]/20 text-[#7BA69E] border-none">
                  {topicData.category}
                </Badge>
                <Badge variant="outline" className="border-[rgba(91,179,179,0.2)] text-[#6B7280]">
                  {topicData.readTime} min read
                </Badge>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-[#C9A86C] fill-[#C9A86C]" />
                  <span className="text-[#E8E0D5] font-medium">{topicData.rating}</span>
                  <span className="text-[#6B7280]">({topicData.totalRatings})</span>
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E8E0D5] mb-3" style={{ fontSize: `${fontSize + 14}px` }}>
                {topicData.title}
              </h1>
              <p className="text-lg text-[#A0B0BC]" style={{ fontSize: `${fontSize + 2}px` }}>
                {topicData.subtitle}
              </p>
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <Card className="mb-6 bg-[#364A5E] border-[#C9A86C]/30 border-l-4 border-l-[#C9A86C]">
                <CardContent className="p-4">
                  <textarea
                    placeholder="Add your notes here... Use [[Topic Name]] to link to other topics."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full h-24 p-3 bg-[#2D3E50] border border-[rgba(91,179,179,0.15)] rounded-lg resize-none text-sm text-[#E8E0D5] placeholder-[#6B7280] focus:border-[#C9A86C] focus:outline-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" className="bg-[#C9A86C] hover:bg-[#5BB3B3] text-white">
                      Save Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Sections */}
            <div className="space-y-8" style={{ fontSize: `${fontSize}px` }}>
              {topicData.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold text-[#E8E0D5] mb-6 pb-3 border-b border-[rgba(91,179,179,0.1)]" style={{ fontSize: `${fontSize + 8}px` }}>
                    {section.title}
                  </h2>
                  <div className="prose prose-invert max-w-none leading-relaxed">
                    {wrapTables(section.content)}
                  </div>
                </section>
              ))}
            </div>

            {/* Citations */}
            <Card className="mt-12 bg-[#364A5E] border-[rgba(91,179,179,0.15)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-[#E8E0D5]">
                  <Quote className="w-5 h-5 text-[#5BB3B3]" />
                  References
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topicData.citations.map((cite) => (
                  <div key={cite.id} className="flex items-start gap-3 text-sm">
                    <span className="text-[#5BB3B3] font-medium">[{cite.id}]</span>
                    <div>
                      <span className="text-[#A0B0BC]">{cite.text}</span>
                      <span className="text-[#6B7280]"> — {cite.source}</span>
                      {cite.page && <span className="text-[#6B7280]">, p. {cite.page}</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(91,179,179,0.1)]">
              <Button
                variant="outline"
                onClick={() => navigateSection("prev")}
                disabled={activeSection === topicData.sections[0].id}
                className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5]"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateSection("next")}
                disabled={activeSection === topicData.sections[topicData.sections.length - 1].id}
                className="border-[rgba(91,179,179,0.15)] text-[#A0B0BC] hover:text-[#E8E0D5]"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
