"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  fullContent: string;
  objectives: string[];
  relatedTopics: string[];
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
    fullContent: `
## Overview
Gastric cancer remains one of the most common malignancies worldwide, with significant geographic variation in incidence. Understanding the surgical principles and multimodal treatment approach is essential for optimal patient outcomes.

## Epidemiology
- 5th most common cancer globally
- Higher incidence in East Asia, Eastern Europe, and South America
- Male predominance (2:1)
- Peak incidence: 6th-7th decade

## Risk Factors
- H. pylori infection (strongest modifiable risk factor)
- Dietary factors: high salt, smoked foods, low fruits/vegetables
- Smoking
- Family history
- Pernicious anemia
- Previous gastric surgery

## Classification
### Lauren Classification
1. **Intestinal type** (better prognosis)
   - Well-differentiated
   - Associated with H. pylori and intestinal metaplasia
   
2. **Diffuse type** (poorer prognosis)
   - Poorly differentiated
   - "Signet ring" cells
   - Linitis plastica variant

## Staging (TNM 8th Edition)
Accurate staging is crucial for treatment planning and prognosis.

### T Stage
- T1a: Lamina propria/muscularis mucosae
- T1b: Submucosa
- T2: Muscularis propria
- T3: Subserosa
- T4a: Serosa (visceral peritoneum)
- T4b: Adjacent structures

### N Stage
- N1: 1-2 regional nodes
- N2: 3-6 regional nodes
- N3a: 7-15 regional nodes
- N3b: >15 regional nodes

## Surgical Management
### Principles
- Achieve R0 resection
- Adequate lymphadenectomy (D2 recommended)
- Safe margins (5cm for intestinal, 6cm for diffuse)

### Types of Gastrectomy
1. **Subtotal/Distal Gastrectomy**
   - For antral tumors
   - Preserves proximal stomach
   
2. **Total Gastrectomy**
   - For proximal tumors
   - Diffuse type cancers
   
3. **Proximal Gastrectomy**
   - Selected cases of GEJ tumors

## Adjuvant Therapy
- Perioperative chemotherapy (FLOT regimen preferred)
- Adjuvant chemoradiation (Macdonald protocol)
- Adjuvant chemotherapy alone (S-1 based in Asian studies)

## Prognosis
5-year survival varies significantly by stage:
- Stage IA: >90%
- Stage IB-IIA: 70-85%
- Stage IIB-IIIA: 50-65%
- Stage IIIB-IIIC: 20-40%
- Stage IV: <5%
    `,
    objectives: [
      "Understand gastric cancer epidemiology and risk factors",
      "Learn the Lauren classification and its clinical implications",
      "Master TNM staging for gastric cancer",
      "Understand surgical principles and types of gastrectomy",
      "Know indications for adjuvant therapy",
    ],
    relatedTopics: ["Esophageal Cancer", "GI Anatomy", "Surgical Oncology", "Chemotherapy Protocols"],
  },
  2: {
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
    fullContent: `
## Liver Anatomy

### Segmental Anatomy (Couinaud Classification)
The liver is divided into 8 functionally independent segments, each with its own portal pedicle and hepatic vein drainage.

**Right Liver (Segments V-VIII)**
- Segment V: Anterior inferior
- Segment VI: Posterior inferior
- Segment VII: Posterior superior
- Segment VIII: Anterior superior

**Left Liver (Segments II-IV)**
- Segment II: Left lateral superior
- Segment III: Left lateral inferior
- Segment IV: Medial (IVa superior, IVb inferior)

**Segment I (Caudate Lobe)**
- Unique blood supply from both portal branches
- Drains directly into IVC

### Portal Triad
Contains:
1. Hepatic artery (proper)
2. Portal vein
3. Common bile duct

**Relationship:** CBD lateral, hepatic artery medial, portal vein posterior

## Biliary Anatomy

### Extrahepatic Biliary Tree
- Common hepatic duct (CHD)
- Cystic duct
- Common bile duct (CBD)

### Calot's Triangle
**Boundaries:**
- Superior: Inferior surface of liver
- Lateral: Cystic duct
- Medial: Common hepatic duct

**Contents:**
- Cystic artery (usually)
- Cystic lymph node (of Lund)

### Anatomical Variations
- Aberrant right hepatic duct (20%)
- Short cystic duct
- Aberrant hepatic arteries (25-30%)

## Portal Venous System

### Formation
Superior mesenteric vein + Splenic vein → Portal vein

### Tributaries
- Coronary (left gastric) vein
- Right gastric vein
- Cystic veins

### Clinical Significance
Understanding portal anatomy is crucial for:
- Liver resection planning
- TIPS procedures
- Portal hypertension management
    `,
    objectives: [
      "Master Couinaud segmental anatomy",
      "Understand the portal triad relationships",
      "Know Calot's triangle boundaries and significance",
      "Recognize common anatomical variations",
    ],
    relatedTopics: ["Liver Resection", "Cholecystectomy", "Portal Hypertension", "Biliary Surgery"],
  },
};

// Default fallback for other IDs
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
  fullContent: "Detailed content coming soon...",
  objectives: ["Learn key concepts", "Understand clinical applications"],
  relatedTopics: ["Related Topic 1", "Related Topic 2"],
};

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(false);
  
  const materialId = Number(params.id);
  const material = materialsData[materialId] || { id: materialId, ...defaultMaterial };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              <div className="flex items-center gap-2 mb-2">
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
                onClick={() => setShowNotePanel(!showNotePanel)}
                className={`border-[#334155] ${showNotePanel ? "text-[#7C3AED]" : ""}`}
              >
                <StickyNote className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          {material.progress < 100 && (
            <div className="mt-6 pt-6 border-t border-[#334155]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#94A3B8]">Your Progress</span>
                <span className="text-sm font-medium">{material.progress}%</span>
              </div>
              <Progress value={material.progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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

          {/* Full Content */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <div 
                  className="text-[#94A3B8] space-y-4 [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-white [&_li]:ml-4"
                  dangerouslySetInnerHTML={{ 
                    __html: material.fullContent
                      .replace(/^## /gm, '<h2>')
                      .replace(/^### /gm, '<h3>')
                      .replace(/\n(?=<h)/g, '</p>\n')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/- (.*)/g, '<li>$1</li>')
                      .replace(/\n\n/g, '</p><p>')
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardContent className="p-4 space-y-3">
              {material.type === "Video" ? (
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                </Button>
              ) : (
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] glow-purple">
                  {material.progress > 0 ? "Continue Reading" : "Start Reading"}
                </Button>
              )}
              <Button variant="outline" className="w-full border-[#334155]">
                Practice MCQs
              </Button>
            </CardContent>
          </Card>

          {/* Related Topics */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg">Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {material.relatedTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="bg-[#0F172A] text-[#94A3B8] border-[#334155] cursor-pointer hover:border-[#7C3AED] hover:text-white transition-colors"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
