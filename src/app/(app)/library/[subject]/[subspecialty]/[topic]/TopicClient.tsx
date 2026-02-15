"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Clock,
  Target,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  FileText,
  Brain,
  Stethoscope,
  Loader2,
  GraduationCap,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode, LibraryTopic, RetrievalCard } from "@/lib/types/library";
import { VIEW_MODE_CONFIG } from "@/lib/types/library";
import { MedicalMarkdown } from "@/components/MedicalMarkdown";
import { AutoExamPrep } from "@/components/AutoExamPrep";
import { AtomLibrarian } from "@/components/AtomLibrarian";
import { RoadmapView } from "@/components/library/RoadmapView";
import { addPocketNote, getNotesForTopic } from "@/lib/pocket/store";
import { addBackstageEvent, normalizeSubject } from "@/lib/backstage/store";

// Quiz Card Component
function QuizCard({ card, onNext }: { card: RetrievalCard; onNext: () => void }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState<'correct' | 'incorrect' | null>(null);

  const handleReveal = () => setShowAnswer(true);
  
  const handleAnswer = (correct: boolean) => {
    setAnswered(correct ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setShowAnswer(false);
    setAnswered(null);
    onNext();
  };

  return (
    <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
      <CardContent className="p-6">
        <div className="mb-4">
          <Badge className="bg-[rgba(236,72,153,0.15)] text-[#EC4899] border-[rgba(236,72,153,0.3)]">
            <Brain className="w-3 h-3 mr-1" />
            Retrieval Practice
          </Badge>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#E5E7EB] mb-2">Question</h3>
          <p className="text-[#9CA3AF]">{card.question}</p>
        </div>

        {!showAnswer ? (
          <Button
            onClick={handleReveal}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
          >
            Reveal Answer
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#0D1B2A] rounded-lg border border-[rgba(6,182,212,0.2)]">
              <h4 className="text-sm font-medium text-[#06B6D4] mb-2">Answer</h4>
              <p className="text-[#E5E7EB]">{card.answer}</p>
            </div>

            {answered === null ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Got it Wrong
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Got it Right
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Badge className={cn(
                  "text-sm py-1 px-3",
                  answered === 'correct' 
                    ? "bg-[#10B981]/20 text-[#10B981]" 
                    : "bg-[#EF4444]/20 text-[#EF4444]"
                )}>
                  {answered === 'correct' ? '✓ Correct!' : '✗ Review this one'}
                </Badge>
                <Button
                  onClick={handleNext}
                  className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
                >
                  Next Card
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TopicClientProps {
  subject: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  subspecialty: {
    id: string;
    name: string;
    slug: string;
  };
  topic: LibraryTopic;
  allTopics: LibraryTopic[];
}

export default function TopicClient({ subject, subspecialty, topic, allTopics }: TopicClientProps) {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get('mode') as ViewMode) || 'explorer';
  
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Optional reading aid: Bionic Reader (persisted per-device)
  const [bionicReader, setBionicReader] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem('nx_bionic_reader');
      if (v === '1') setBionicReader(true);
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('nx_bionic_reader', bionicReader ? '1' : '0');
    } catch {
      // ignore
    }
  }, [bionicReader]);

  const topicId = `${subject.slug}/${subspecialty.slug}/${topic.slug}`;

  // Pocket notes (topic-anchored)
  const [notes, setNotes] = useState(() => getNotesForTopic(topicId, 20));
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  // Rich content state
  const [richContent, setRichContent] = useState<string | null>(null);
  const [richContentLoading, setRichContentLoading] = useState(false);
  const [richContentError, setRichContentError] = useState<string | null>(null);

  // Fetch rich content when textbook mode is selected
  useEffect(() => {
    if ((viewMode === 'textbook' || viewMode === 'examPrep') && !richContent && !richContentLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRichContentLoading(true);
      setRichContentError(null);
      
      fetch(`/api/library/content?subject=${subject.slug}&subspecialty=${subspecialty.slug}&topic=${topic.slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.content) {
            setRichContent(data.content);
          } else {
            setRichContentError(data.error || 'Content not available');
          }
        })
        .catch(err => {
          console.error('Failed to load rich content:', err);
          setRichContentError('Failed to load content');
        })
        .finally(() => {
          setRichContentLoading(false);
        });
    }
  }, [viewMode, richContent, richContentLoading, subject.slug, subspecialty.slug, topic.slug]);

  const viewModes: ViewMode[] = ['explorer', 'examPrep', 'textbook', 'quiz', 'cases', 'roadmap'];

  const renderContent = () => {
    switch (viewMode) {
      case 'explorer':
        return (
          <div className="space-y-6">
            {/* Key Points */}
            {(topic.content.keyPoints?.length ?? 0) > 0 && (
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.keyPoints?.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#9CA3AF]">
                        <span className="text-[#06B6D4] mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
              <CardContent className="p-5">
                <MedicalMarkdown content={topic.content.concept} bionic={bionicReader} />
              </CardContent>
            </Card>
          </div>
        );

      case 'examPrep':
        if (!topic.content.examPrep) {
          const sourceContent = richContent || topic.content.concept;
          if (sourceContent && sourceContent.length > 50) {
            return (
              <AutoExamPrep 
                conceptContent={sourceContent} 
                topicName={topic.name}
                bionic={bionicReader}
              />
            );
          }
          return (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Exam Prep Coming Soon</h3>
              <p className="text-[#9CA3AF]">High-yield content for this topic is being prepared.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {topic.content.examPrep?.summary && (
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#F59E0B]" />
                    Quick Summary
                  </h3>
                  <MedicalMarkdown content={topic.content.examPrep.summary} bionic={bionicReader} />
                </CardContent>
              </Card>
            )}

            {(topic.content.examPrep?.mnemonics?.length ?? 0) > 0 && (
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#EC4899]" />
                    Mnemonics
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.examPrep?.mnemonics?.map((m, i) => (
                      <li key={i} className="p-3 bg-[#0D1B2A] rounded-lg text-[#E5E7EB] border border-[rgba(236,72,153,0.2)]">
                        {m}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {(topic.content.examPrep?.highYield?.length ?? 0) > 0 && (
              <Card className="bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#F59E0B] mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    High Yield for Exams
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.examPrep?.highYield?.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#E5E7EB]">
                        <span className="text-[#F59E0B] mt-1">★</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {(topic.content.examPrep?.commonMCQs?.length ?? 0) > 0 && (
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E5E7EB] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#06B6D4]" />
                    Common MCQ Topics
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.examPrep?.commonMCQs?.map((mcq, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#9CA3AF]">
                        <span className="text-[#06B6D4]">{i + 1}.</span>
                        <span>{mcq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'textbook':
        if (richContentLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
              <span className="ml-3 text-[#9CA3AF]">Loading comprehensive content...</span>
            </div>
          );
        }
        
        if (richContent) {
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-[rgba(99,102,241,0.15)] text-[#6366F1] border-[rgba(99,102,241,0.3)]">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Comprehensive Notes
                </Badge>
                <span className="text-xs text-[#6B7280]">For UG, PG & SS Residents</span>
              </div>
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-6">
                  <MedicalMarkdown content={richContent} bionic={bionicReader} />
                </CardContent>
              </Card>
            </div>
          );
        }
        
        if ((topic.content.textbookRefs?.length ?? 0) === 0) {
          return (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">No Textbook References</h3>
              <p className="text-[#9CA3AF]">Textbook references for this topic are being added.</p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#E5E7EB]">Textbook References</h3>
            {topic.content.textbookRefs?.map((ref, i) => (
              <Card key={i} className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <BookOpen className="w-8 h-8 text-[#6366F1] shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#E5E7EB]">{ref.textbook}</h4>
                      {ref.edition && <p className="text-sm text-[#9CA3AF]">{ref.edition} Edition</p>}
                      <p className="text-[#06B6D4] mt-1">{ref.chapter}</p>
                      {ref.chapterTitle && <p className="text-sm text-[#9CA3AF]">{ref.chapterTitle}</p>}
                      {ref.pages && <p className="text-xs text-[#6B7280] mt-1">Pages: {ref.pages}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'quiz':
        if ((topic.content.retrievalCards?.length ?? 0) === 0) {
          return (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">No Quiz Cards Yet</h3>
              <p className="text-[#9CA3AF]">Retrieval cards for this topic are being created.</p>
            </div>
          );
        }
        const currentCard = topic.content.retrievalCards![currentCardIndex];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#E5E7EB]">Quiz Mode</h3>
              <Badge className="bg-[#0D1B2A] text-[#9CA3AF]">
                Card {currentCardIndex + 1} of {topic.content.retrievalCards!.length}
              </Badge>
            </div>
            <QuizCard 
              card={currentCard}
              onNext={() => setCurrentCardIndex((prev) => 
                (prev + 1) % topic.content.retrievalCards!.length
              )}
            />
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setCurrentCardIndex(0)}
                className="text-[#9CA3AF] border-[rgba(6,182,212,0.2)]"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Quiz
              </Button>
            </div>
          </div>
        );

      case 'cases':
        if ((topic.content.cases?.length ?? 0) === 0) {
          return (
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">No Cases Yet</h3>
              <p className="text-[#9CA3AF]">Clinical cases for this topic are being prepared.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {topic.content.cases?.map((caseItem, i) => (
              <Card key={i} className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-5 h-5 text-[#06B6D4]" />
                    <h3 className="font-semibold text-[#E5E7EB]">{caseItem.title}</h3>
                  </div>
                  
                  <div className="p-4 bg-[#0D1B2A] rounded-lg mb-4">
                    <p className="text-[#9CA3AF]">{caseItem.presentation}</p>
                  </div>

                  <div className="space-y-4">
                    {caseItem.questions?.map((q, qi) => {
                      const isString = typeof q === 'string';
                      return (
                        <details key={qi} className="group">
                          <summary className="cursor-pointer text-[#06B6D4] hover:text-[#0891B2] font-medium">
                            Q{qi + 1}: {isString ? q : q.question}
                          </summary>
                          {!isString && q.answer && (
                            <div className="mt-2 pl-4 border-l-2 border-[rgba(6,182,212,0.3)] text-[#E5E7EB]">
                              {q.answer}
                            </div>
                          )}
                        </details>
                      );
                    })}
                    {caseItem.analysis && (
                      <div className="p-3 bg-[#0D1B2A] rounded-lg">
                        <h5 className="text-sm font-medium text-[#06B6D4] mb-1">Analysis</h5>
                        <p className="text-[#E5E7EB]">{caseItem.analysis}</p>
                      </div>
                    )}
                    {caseItem.clinicalPearl && (
                      <div className="p-3 bg-[rgba(245,158,11,0.1)] rounded-lg border border-[rgba(245,158,11,0.2)]">
                        <h5 className="text-sm font-medium text-[#F59E0B] mb-1">💡 Clinical Pearl</h5>
                        <p className="text-[#E5E7EB]">{caseItem.clinicalPearl}</p>
                      </div>
                    )}
                  </div>

                  {(caseItem.keyLearning?.length ?? 0) > 0 && (
                    <div className="mt-4 pt-4 border-t border-[rgba(6,182,212,0.1)]">
                      <h4 className="text-sm font-medium text-[#F59E0B] mb-2">Key Learning Points</h4>
                      <ul className="space-y-1">
                        {caseItem.keyLearning?.map((point, pi) => (
                          <li key={pi} className="text-sm text-[#9CA3AF] flex items-start gap-2">
                            <span className="text-[#F59E0B]">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'roadmap':
        return (
          <RoadmapView
            topic={topic}
            subjectSlug={subject.slug}
            subspecialtySlug={subspecialty.slug}
          />
        );

      default:
        return null;
    }
  };

  const saveNote = () => {
    if (!noteBody.trim()) return;
    const title = noteTitle.trim() || `${topic.name} — ${new Date().toLocaleString()}`;

    addPocketNote({
      topicId,
      title,
      body: noteBody.trim(),
    });

    addBackstageEvent({
      type: "note",
      subject: normalizeSubject(subject.slug),
      topicId,
      topic: topic.name,
      bloom: "understand",
      note: title,
    });

    setNoteTitle("");
    setNoteBody("");
    setNotes(getNotesForTopic(topicId, 20));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Link href="/library" className="text-[#9CA3AF] hover:text-[#06B6D4]">Library</Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <Link href={`/library/${subject.slug}`} className="text-[#9CA3AF] hover:text-[#06B6D4]">
          {subject.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <Link href={`/library/${subject.slug}/${subspecialty.slug}`} className="text-[#9CA3AF] hover:text-[#06B6D4]">
          {subspecialty.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <span className="text-[#E5E7EB]">{topic.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link 
            href={`/library/${subject.slug}/${subspecialty.slug}?mode=${viewMode}`}
            className="p-2 rounded-lg bg-[#142538] hover:bg-[rgba(6,182,212,0.1)] transition-colors mt-1"
          >
            <ArrowLeft className="w-5 h-5 text-[#9CA3AF]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E5E7EB]">{topic.name}</h1>
            {topic.description && (
              <p className="text-[#9CA3AF] mt-1">{topic.description}</p>
            )}
            {topic.nmcCodes && topic.nmcCodes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] mr-1">NMC</span>
                {topic.nmcCodes.map((nmc) => {
                  const domainColors: Record<string, string> = {
                    K: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
                    KH: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
                    SH: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
                    P: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
                  };
                  return (
                    <span
                      key={nmc.code}
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] border ${domainColors[nmc.domain] || domainColors.K}`}
                    >
                      {nmc.code} ({nmc.domain}{nmc.core ? ', Core' : ''})
                    </span>
                  );
                })}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{topic.estimatedMinutes ?? 15} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Difficulty {topic.difficulty ?? 3}/5</span>
              </div>
              {topic.highYield && (
                <Badge className="bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]">
                  High Yield
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {viewModes.map((mode) => {
            const config = VIEW_MODE_CONFIG[mode];
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#06B6D4] text-[#0D1B2A]"
                    : "bg-[#142538] text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[rgba(6,182,212,0.1)]"
                )}
              >
                <span>{config.icon}</span>
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setBionicReader((v) => !v)}
          className={cn(
            "shrink-0 border-[rgba(6,182,212,0.2)]",
            bionicReader
              ? "bg-[rgba(6,182,212,0.12)] text-[#E5E7EB]"
              : "text-[#9CA3AF]"
          )}
          title="Bionic Reader (bolds the first part of words)"
        >
          <Zap className="w-4 h-4 mr-2" />
          Bionic
        </Button>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Your Notes (Pocket of Knowledge) */}
      <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-[#E5E7EB] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C9A86C]" /> Your Notes
              <Badge className="bg-[#0D1B2A] text-[#9CA3AF]">{topicId}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotes(getNotesForTopic(topicId, 20))}
              className="text-[#9CA3AF] border-[rgba(6,182,212,0.2)]"
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Title (optional)"
              className="bg-[#0D1B2A] border-[rgba(6,182,212,0.2)] text-[#E5E7EB]"
            />
            <Textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Write your note for this topic… (this becomes part of your pocket of knowledge)"
              className="min-h-[120px] bg-[#0D1B2A] border-[rgba(6,182,212,0.2)] text-[#E5E7EB]"
            />
            <div className="flex justify-end">
              <Button onClick={saveNote} className="bg-[#C9A86C] hover:bg-[#B89252] text-[#0D1B2A]">
                Save note
              </Button>
            </div>
          </div>

          {notes.length ? (
            <div className="space-y-2 pt-2">
              <div className="text-sm text-[#9CA3AF]">Recent notes</div>
              {notes.map((n) => (
                <div key={n.id} className="rounded-lg border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[#E5E7EB]">{n.title}</div>
                      <div className="mt-1 text-xs text-[#6B7280]">
                        {new Date(n.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <Badge className="bg-[rgba(201,168,108,0.15)] text-[#C9A86C] border-[rgba(201,168,108,0.3)]">note</Badge>
                  </div>
                  <div className="mt-2 text-sm text-[#A0B0BC] whitespace-pre-wrap line-clamp-4">{n.body}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[#6B7280]">No notes for this topic yet.</div>
          )}
        </CardContent>
      </Card>

      {/* ATOM Librarian with topic context */}
      <AtomLibrarian 
        currentTopic={topic}
        allTopics={allTopics}
      />
    </div>
  );
}
