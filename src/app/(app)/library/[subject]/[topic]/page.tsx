"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  Target,
  BookMarked,
  Play,
  CheckCircle2,
  Circle,
  Lightbulb,
  Brain,
  Stethoscope,
  FileText,
  ExternalLink,
  Bookmark,
  Share2,
  BarChart3,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getSubjectBySlug } from "@/lib/data/subjects";
import { SURGERY_GI_TOPICS, getMCQsByTopic, getFlashcardsByTopic } from "@/lib/data/topics-surgery-gi";
import { cn } from "@/lib/utils";
import type { Depth } from "@/lib/types";

// Mock content for a topic
const MOCK_CONTENT = {
  'acute-appendicitis': {
    keyPoints: [
      "Most common surgical emergency worldwide",
      "Peak incidence: 10-30 years age group",
      "Lifetime risk: 7-8%",
      "Male:Female ratio = 1.4:1",
      "Perforation risk increases after 24-36 hours of symptoms",
    ],
    mnemonics: [
      {
        title: "MANTRELS Score (Alvarado)",
        content: "**M**igration of pain (1)\n**A**norexia (1)\n**N**ausea/Vomiting (1)\n**T**enderness RIF (2)\n**R**ebound (1)\n**E**levated temp (1)\n**L**eukocytosis (2)\n**S**hift to left (1)",
      },
    ],
    clinicalPearls: [
      "Pain before vomiting → Surgical abdomen (vs Gastroenteritis: vomiting before pain)",
      "Elderly may present atypically with minimal tenderness",
      "Pregnancy: Appendix displaced upward; RUQ pain in 3rd trimester",
      "CT scan: Sensitivity 94%, Specificity 95%",
    ],
    concepts: [
      {
        id: 'c1',
        title: 'Anatomy & Embryology',
        depth: 'mbbs' as Depth,
        content: `The appendix is a blind-ended tube connected to the cecum. It develops from the midgut and shares blood supply with the cecum via the **appendicular artery** (branch of ileocolic artery).

**Position variations:**
- Retrocecal (65%) - most common
- Pelvic (31%)
- Subcecal (2%)
- Pre-ileal (1%)
- Post-ileal (0.5%)

**McBurney's Point:** Junction of lateral 1/3 and medial 2/3 of line from ASIS to umbilicus.`,
        completed: true,
      },
      {
        id: 'c2',
        title: 'Pathophysiology',
        depth: 'mbbs' as Depth,
        content: `**Etiology:** Luminal obstruction → Mucus accumulation → Distension → Venous congestion → Bacterial invasion → Inflammation → Necrosis → Perforation

**Causes of obstruction:**
1. **Fecalith** (35%) - most common
2. **Lymphoid hyperplasia** (60% in children)
3. Parasites (Enterobius)
4. Foreign bodies
5. Tumors (carcinoid)

**Bacteriology:**
- E. coli (most common)
- Bacteroides fragilis
- Pseudomonas
- Streptococcus`,
        completed: true,
      },
      {
        id: 'c3',
        title: 'Clinical Features',
        depth: 'mbbs' as Depth,
        content: `**Classic presentation:**
1. **Periumbilical pain** → migrates to **RIF** (visceral → somatic)
2. **Anorexia** (nearly always present)
3. **Nausea/Vomiting** (after pain onset)
4. **Low-grade fever** (37.5-38.5°C)

**Signs:**
- **Tenderness at McBurney's point**
- **Rebound tenderness** (Blumberg's sign)
- **Rovsing's sign**: Pain in RIF on pressing LIF
- **Psoas sign**: Pain on hip extension (retrocecal)
- **Obturator sign**: Pain on internal rotation of flexed hip (pelvic)

**Dunphy's sign:** Increased pain on coughing`,
        completed: false,
      },
      {
        id: 'c4',
        title: 'Diagnosis & Scoring',
        depth: 'mbbs' as Depth,
        content: `**Alvarado Score (MANTRELS):** Total 10 points
- ≤4: Appendicitis unlikely
- 5-6: Possible, observe
- 7-8: Probable
- ≥9: Very probable

**Investigations:**
1. **CBC**: Leukocytosis (10,000-18,000)
2. **Urine**: Rule out UTI
3. **Pregnancy test**: In females of childbearing age

**Imaging:**
- **USG**: Aperistaltic, non-compressible tube >6mm
- **CT**: Gold standard. Sensitivity 94%, Specificity 95%
  - Dilated appendix >6mm
  - Periappendiceal fat stranding
  - Appendicolith`,
        completed: false,
      },
      {
        id: 'c5',
        title: 'Management',
        depth: 'mbbs' as Depth,
        content: `**Definitive treatment:** Appendectomy

**Approaches:**
1. **Laparoscopic** (preferred)
   - Less pain, faster recovery
   - Better cosmesis
   - Diagnostic advantage

2. **Open (McBurney/Lanz incision)**
   - When laparoscopy unavailable
   - Complicated cases

**Preoperative:**
- NPO, IV fluids
- Antibiotics (Ceftriaxone + Metronidazole)
- Analgesics

**Complicated Appendicitis:**
- **Appendicular mass**: Conservative (Ochsner-Sherren regimen) → Interval appendectomy at 6 weeks
- **Appendicular abscess**: CT-guided drainage → Interval appendectomy
- **Perforation**: Emergency surgery`,
        completed: false,
      },
      {
        id: 'c6',
        title: 'Complications',
        depth: 'pg' as Depth,
        content: `**Pre-operative:**
- Perforation (20-30%)
- Appendicular mass
- Appendicular abscess
- Pylephlebitis (portal pyemia)

**Post-operative:**
- Wound infection (most common)
- Intra-abdominal abscess
- Fecal fistula
- Adhesive intestinal obstruction

**Long-term:**
- Incisional hernia
- Stump appendicitis (incomplete removal)`,
        completed: false,
      },
      {
        id: 'c7',
        title: 'Special Situations',
        depth: 'pg' as Depth,
        content: `**Pregnancy:**
- 1 in 1500 pregnancies
- Appendix displaced upward
- Perforation risk higher (delayed diagnosis)
- Safe in all trimesters
- Laparoscopic preferred in 1st/2nd trimester

**Elderly:**
- Atypical presentation
- Higher perforation rate (50-70%)
- Higher mortality

**Pediatric:**
- Rapid progression
- Higher perforation rate
- USG preferred over CT

**Appendiceal tumors:**
- Carcinoid (most common): <1cm usually benign
- Adenocarcinoma: Right hemicolectomy
- Mucinous tumors: Risk of pseudomyxoma peritonei`,
        completed: false,
      },
    ],
  },
};

export default function TopicPage() {
  const params = useParams();
  const subjectSlug = params.subject as string;
  const topicSlug = params.topic as string;
  
  const [selectedDepth, setSelectedDepth] = useState<Depth>('mbbs');
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set(['c1', 'c2']));
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get data
  const subject = getSubjectBySlug(subjectSlug);
  const topic = SURGERY_GI_TOPICS.find(t => t.slug === topicSlug);
  const mcqs = topic ? getMCQsByTopic(topic.id) : [];
  const flashcards = topic ? getFlashcardsByTopic(topic.id) : [];
  const content = MOCK_CONTENT[topicSlug as keyof typeof MOCK_CONTENT];

  const toggleConcept = (id: string) => {
    const newExpanded = new Set(expandedConcepts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedConcepts(newExpanded);
  };

  // Filter concepts by depth
  const visibleConcepts = content?.concepts.filter(c => {
    if (selectedDepth === 'mbbs') return c.depth === 'mbbs';
    if (selectedDepth === 'pg') return c.depth === 'mbbs' || c.depth === 'pg';
    return true; // superSpecialty sees all
  }) || [];

  if (!subject || !topic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#E5E7EB]">Topic not found</h2>
          <Link href="/library">
            <Button variant="link" className="text-[#06B6D4] mt-2">
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Link href="/library" className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors">
          Library
        </Link>
        <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        <Link href={`/library/${subjectSlug}`} className="text-[#9CA3AF] hover:text-[#06B6D4] transition-colors">
          {subject.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        <span className="text-[#E5E7EB] font-medium">{topic.name}</span>
      </div>

      {/* Topic Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">{topic.name}</h1>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isBookmarked 
                  ? "bg-[rgba(245,158,11,0.2)] text-[#F59E0B]"
                  : "bg-[#142538] text-[#9CA3AF] hover:text-[#E5E7EB]"
              )}
            >
              <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-current")} />
            </button>
          </div>
          
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
              <Clock className="w-4 h-4" />
              {topic.estimatedMinutes} min read
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
              <BarChart3 className="w-4 h-4" />
              Level {topic.difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
              <Target className="w-4 h-4" />
              {mcqs.length} MCQs
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
              <Brain className="w-4 h-4" />
              {flashcards.length} Flashcards
            </span>
          </div>

          {/* Depth badges */}
          <div className="flex gap-2 mt-3">
            {topic.depth.mbbs && (
              <Badge className="bg-[rgba(16,185,129,0.2)] text-[#10B981] border-[rgba(16,185,129,0.3)]">
                <GraduationCap className="w-3 h-3 mr-1" /> MBBS
              </Badge>
            )}
            {topic.depth.pg && (
              <Badge className="bg-[rgba(124,58,237,0.2)] text-[#7C3AED] border-[rgba(124,58,237,0.3)]">
                <Target className="w-3 h-3 mr-1" /> PG
              </Badge>
            )}
            {topic.depth.superSpecialty && (
              <Badge className="bg-[rgba(245,158,11,0.2)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]">
                <Sparkles className="w-3 h-3 mr-1" /> Super Specialty
              </Badge>
            )}
          </div>

          {/* Sources */}
          {topic.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {topic.sources.map((source, i) => (
                <span key={i} className="text-xs text-[#9CA3AF] bg-[#142538] px-2 py-1 rounded">
                  📖 {source.textbook} {source.edition && `(${source.edition})`}
                  {source.chapter && ` - ${source.chapter}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/mcqs?topic=${topic.id}`}>
            <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
              <Play className="w-4 h-4 mr-2" />
              Practice MCQs
            </Button>
          </Link>
          <Button variant="outline" className="border-[rgba(6,182,212,0.3)] text-[#06B6D4] hover:bg-[rgba(6,182,212,0.1)]">
            <Brain className="w-4 h-4 mr-2" />
            Flashcards
          </Button>
        </div>
      </div>

      {/* Depth Selector */}
      <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#9CA3AF]">Content depth:</span>
            <div className="flex gap-2">
              {(['mbbs', 'pg', 'superSpecialty'] as Depth[]).map((depth) => {
                const isActive = selectedDepth === depth;
                const colors = {
                  mbbs: '#10B981',
                  pg: '#7C3AED',
                  superSpecialty: '#F59E0B',
                };
                const labels = {
                  mbbs: 'MBBS',
                  pg: 'PG',
                  superSpecialty: 'Super Specialty',
                };
                return (
                  <button
                    key={depth}
                    onClick={() => setSelectedDepth(depth)}
                    disabled={!topic.depth[depth]}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "text-[#0D1B2A]"
                        : "bg-[#142538] text-[#9CA3AF] hover:text-[#E5E7EB]",
                      !topic.depth[depth] && "opacity-50 cursor-not-allowed"
                    )}
                    style={isActive ? { backgroundColor: colors[depth] } : undefined}
                  >
                    {labels[depth]}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Concepts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[#E5E7EB] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#06B6D4]" />
            Concepts
          </h2>

          {visibleConcepts.map((concept) => {
            const isExpanded = expandedConcepts.has(concept.id);
            return (
              <Card key={concept.id} className="bg-[#0F2233] border-[rgba(255,255,255,0.06)] overflow-hidden">
                <button
                  onClick={() => toggleConcept(concept.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[rgba(6,182,212,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {concept.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#9CA3AF] shrink-0" />
                    )}
                    <span className="font-medium text-[#E5E7EB]">{concept.title}</span>
                    <Badge 
                      className={cn(
                        "text-[10px]",
                        concept.depth === 'mbbs' && "bg-[rgba(16,185,129,0.2)] text-[#10B981]",
                        concept.depth === 'pg' && "bg-[rgba(124,58,237,0.2)] text-[#7C3AED]",
                        concept.depth === 'superSpecialty' && "bg-[rgba(245,158,11,0.2)] text-[#F59E0B]"
                      )}
                    >
                      {concept.depth.toUpperCase()}
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </button>
                
                {isExpanded && (
                  <CardContent className="pt-0 pb-4 px-4 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="pl-8 prose prose-invert prose-sm max-w-none">
                      <div 
                        className="text-[#D1D5DB] leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ 
                          __html: concept.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E5E7EB]">$1</strong>')
                            .replace(/\n/g, '<br/>')
                        }}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right Column - Quick Reference */}
        <div className="space-y-4">
          {/* Key Points */}
          {content?.keyPoints && (
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-[#E5E7EB]">
                  <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#D1D5DB]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-2 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Mnemonics */}
          {content?.mnemonics && content.mnemonics.length > 0 && (
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-[#E5E7EB]">
                  <Brain className="w-4 h-4 text-[#7C3AED]" />
                  Mnemonics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {content.mnemonics.map((mnemonic, i) => (
                  <div key={i} className="bg-[rgba(124,58,237,0.1)] rounded-lg p-3">
                    <h4 className="font-medium text-[#7C3AED] text-sm mb-2">{mnemonic.title}</h4>
                    <div 
                      className="text-sm text-[#D1D5DB] whitespace-pre-line"
                      dangerouslySetInnerHTML={{ 
                        __html: mnemonic.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E5E7EB]">$1</strong>')
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Clinical Pearls */}
          {content?.clinicalPearls && (
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-[#E5E7EB]">
                  <Stethoscope className="w-4 h-4 text-[#10B981]" />
                  Clinical Pearls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.clinicalPearls.map((pearl, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#D1D5DB]">
                      <span className="text-[#10B981]">💎</span>
                      {pearl}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
            <CardContent className="p-4 space-y-3">
              <Link href={`/mcqs?topic=${topic.id}`} className="block">
                <Button className="w-full bg-[#142538] hover:bg-[rgba(124,58,237,0.2)] text-[#E5E7EB] justify-start">
                  <Target className="w-4 h-4 mr-2 text-[#7C3AED]" />
                  Practice {mcqs.length} MCQs
                </Button>
              </Link>
              <Button className="w-full bg-[#142538] hover:bg-[rgba(6,182,212,0.2)] text-[#E5E7EB] justify-start">
                <Brain className="w-4 h-4 mr-2 text-[#06B6D4]" />
                Review {flashcards.length} Flashcards
              </Button>
              <Button className="w-full bg-[#142538] hover:bg-[rgba(16,185,129,0.2)] text-[#E5E7EB] justify-start">
                <FileText className="w-4 h-4 mr-2 text-[#10B981]" />
                Generate Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
