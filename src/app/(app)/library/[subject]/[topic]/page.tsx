"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MedicalMarkdown } from "@/components/MedicalMarkdown";
import { 
  ChevronRight,
  Clock,
  BookOpen,
  Target,
  Play,
  CheckCircle2,
  Circle,
  Lightbulb,
  Brain,
  Stethoscope,
  FileText,
  Bookmark,
  BarChart3,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap
} from "lucide-react";
import { getSubjectBySlug } from "@/lib/data/subjects";
import { SURGERY_GI_TOPICS, getMCQsByTopic, getFlashcardsByTopic } from "@/lib/data/topics-surgery-gi";
import { APPENDICITIS_CONTENT } from "@/lib/content/appendicitis";
import { cn } from "@/lib/utils";
import type { Depth } from "@/lib/types";

// Icon mapping for concept sections
const conceptIcons: Record<string, any> = {
  '🫀': '🫀',
  '🔬': '🔬',
  '🩺': '🩺',
  '🔍': '🔍',
  '💊': '💊',
  '⚠️': '⚠️',
  '🎓': '🎓',
};

export default function TopicPage() {
  const params = useParams();
  const subjectSlug = params.subject as string;
  const topicSlug = params.topic as string;
  
  const [selectedDepth, setSelectedDepth] = useState<Depth>('mbbs');
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set(['anatomy']));
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedConcepts, setCompletedConcepts] = useState<Set<string>>(new Set());

  // Get data
  const subject = getSubjectBySlug(subjectSlug);
  const topic = SURGERY_GI_TOPICS.find(t => t.slug === topicSlug);
  const mcqs = topic ? getMCQsByTopic(topic.id) : [];
  const flashcards = topic ? getFlashcardsByTopic(topic.id) : [];
  
  // Get rich content (for now, only appendicitis has full content)
  const content = topicSlug === 'acute-appendicitis' ? APPENDICITIS_CONTENT : null;

  const toggleConcept = (id: string) => {
    const newExpanded = new Set(expandedConcepts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedConcepts(newExpanded);
  };

  const toggleCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = new Set(completedConcepts);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedConcepts(newCompleted);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#9CA3AF]">Content depth:</span>
              <span className="text-xs text-[#6B7280]">
                ({visibleConcepts.length} of {content?.concepts.length || 0} sections visible)
              </span>
            </div>
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
                const icons = {
                  mbbs: GraduationCap,
                  pg: Target,
                  superSpecialty: Sparkles,
                };
                const Icon = icons[depth];
                return (
                  <button
                    key={depth}
                    onClick={() => setSelectedDepth(depth)}
                    disabled={!topic.depth[depth]}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "text-[#0D1B2A]"
                        : "bg-[#142538] text-[#9CA3AF] hover:text-[#E5E7EB]",
                      !topic.depth[depth] && "opacity-50 cursor-not-allowed"
                    )}
                    style={isActive ? { backgroundColor: colors[depth] } : undefined}
                  >
                    <Icon className="w-4 h-4" />
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#E5E7EB] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#06B6D4]" />
              Concepts
            </h2>
            <span className="text-sm text-[#9CA3AF]">
              {completedConcepts.size}/{visibleConcepts.length} completed
            </span>
          </div>

          {visibleConcepts.map((concept) => {
            const isExpanded = expandedConcepts.has(concept.id);
            const isCompleted = completedConcepts.has(concept.id);
            
            return (
              <Card key={concept.id} className="bg-[#0F2233] border-[rgba(255,255,255,0.06)] overflow-hidden">
                <button
                  onClick={() => toggleConcept(concept.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[rgba(6,182,212,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleCompleted(concept.id, e)}
                      className="transition-transform hover:scale-110"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#9CA3AF] hover:text-[#06B6D4]" />
                      )}
                    </button>
                    <span className="text-xl">{concept.icon}</span>
                    <span className="font-medium text-[#E5E7EB]">{concept.title}</span>
                    <Badge 
                      className={cn(
                        "text-[10px]",
                        concept.depth === 'mbbs' && "bg-[rgba(16,185,129,0.2)] text-[#10B981]",
                        concept.depth === 'pg' && "bg-[rgba(124,58,237,0.2)] text-[#7C3AED]",
                        concept.depth === 'superSpecialty' && "bg-[rgba(245,158,11,0.2)] text-[#F59E0B]"
                      )}
                    >
                      {concept.depth === 'superSpecialty' ? 'SS' : concept.depth.toUpperCase()}
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </button>
                
                {isExpanded && (
                  <CardContent className="pt-0 pb-6 px-6 border-t border-[rgba(255,255,255,0.06)]">
                    <MedicalMarkdown content={concept.content} className="mt-4" />
                  </CardContent>
                )}
              </Card>
            );
          })}

          {!content && (
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#142538] flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-lg font-medium text-[#E5E7EB]">Content coming soon</h3>
                <p className="text-[#9CA3AF] mt-1">
                  Rich content for this topic is being prepared
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Quick Reference */}
        <div className="space-y-4">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 border-[rgba(124,58,237,0.3)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#E5E7EB]">Your Progress</span>
                <span className="text-2xl font-bold text-[#7C3AED]">
                  {Math.round((completedConcepts.size / (visibleConcepts.length || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#142538] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-full transition-all duration-500"
                  style={{ width: `${(completedConcepts.size / (visibleConcepts.length || 1)) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

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
              <CardContent className="space-y-3">
                {content.mnemonics.map((mnemonic, i) => (
                  <div key={i} className="bg-[rgba(124,58,237,0.1)] rounded-lg p-3 border border-[rgba(124,58,237,0.2)]">
                    <h4 className="font-medium text-[#A78BFA] text-sm mb-2 flex items-center gap-2">
                      <span>🧠</span> {mnemonic.title}
                    </h4>
                    <MedicalMarkdown 
                      content={mnemonic.content} 
                      className="text-sm"
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
                      <span className="text-[#10B981] shrink-0">💎</span>
                      {pearl}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Exam Tips */}
          {content?.examTips && (
            <Card className="bg-[#0F2233] border-[rgba(255,255,255,0.06)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-[#E5E7EB]">
                  <Zap className="w-4 h-4 text-[#EF4444]" />
                  Exam Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.examTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#D1D5DB]">
                      <span className="text-[#EF4444] shrink-0">🎯</span>
                      {tip}
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
