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
  ChevronLeft,
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
import { AtomLibrarian } from "@/components/AtomLibrarian";
import { addPocketNote, getNotesForTopic } from "@/lib/pocket/store";
import { addBackstageEvent, normalizeSubject } from "@/lib/backstage/store";
import {
  getPreStudy,
  initPreStudy,
  upsertPreStudy,
  addKeyword,
  setKeywordImportance,
  setKeywordChunk,
  setChunkTitle,
  addChunk,
  setAimQuestionsText,
  validatePreStudy,
  markPreStudyCompleted,
} from "@/lib/prestudy/store";
import type { PreStudy } from "@/lib/prestudy/types";
import { getAim, initAim, setWhyImportant, setQuestionsFromText, validateAim, markAimCompleted } from "@/lib/aim/store";
import type { Aim } from "@/lib/aim/types";

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

  // Learning OS: Pre-Study
  const [preStudyOpen, setPreStudyOpen] = useState(false);
  const [preStudy, setPreStudy] = useState<PreStudy | null>(() => getPreStudy(topicId));
  const [newKeyword, setNewKeyword] = useState("");
  const [aimDraftByChunk, setAimDraftByChunk] = useState<Record<string, string>>({});

  // Learning OS: AIM
  const [aimOpen, setAimOpen] = useState(false);
  const [aim, setAim] = useState<Aim | null>(() => getAim(topicId));
  const [aimQuestionsDraft, setAimQuestionsDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    // keep in sync when navigating topics
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreStudy(getPreStudy(topicId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreStudyOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewKeyword("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAimDraftByChunk({});

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAim(getAim(topicId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAimOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAimQuestionsDraft({});
  }, [topicId]);
  
  // Rich content state
  const [richContent, setRichContent] = useState<string | null>(null);
  const [richContentLoading, setRichContentLoading] = useState(false);
  const [richContentError, setRichContentError] = useState<string | null>(null);

  // Fetch rich content when textbook mode is selected
  useEffect(() => {
    if (viewMode === 'textbook' && !richContent && !richContentLoading) {
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
            {/* Learning OS: Pre-Study */}
            <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#E5E7EB] flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#06B6D4]" />
                      Learning OS — Pre‑Study
                    </h3>
                    <p className="text-sm text-[#9CA3AF] mt-1">
                      Skim → keywords → importance (A/B/C) → 3–4 chunks → Aim questions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {preStudy?.completedAt ? (
                      <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                        ✓ Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                        Not done
                      </Badge>
                    )}
                    <Button
                      onClick={() => {
                        if (!preStudy) {
                          const ps = initPreStudy(topicId);
                          setPreStudy(ps);
                          addBackstageEvent({
                            type: "prestudy",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: "prestudy_started",
                          });
                        }
                        setPreStudyOpen((v) => !v);
                      }}
                      variant="outline"
                      className="border-[rgba(6,182,212,0.35)] text-[#06B6D4] hover:bg-[#06B6D4]/10"
                    >
                      {preStudyOpen ? "Close" : preStudy ? "Edit" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {preStudyOpen && preStudy && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[#9CA3AF]">Skim notes (optional)</label>
                        <Textarea
                          value={preStudy.skimNotes || ""}
                          onChange={(e) => {
                            const next = { ...preStudy, skimNotes: e.target.value };
                            upsertPreStudy(next);
                            setPreStudy(next);
                          }}
                          placeholder="What is this topic about (1–2 lines)?"
                          className="mt-2 bg-[#0D1B2A] border-[rgba(6,182,212,0.15)] text-[#E5E7EB]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#9CA3AF]">Keyword harvest</label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Add a core keyword (noun/verb)…"
                            className="bg-[#0D1B2A] border-[rgba(6,182,212,0.15)] text-[#E5E7EB]"
                          />
                          <Button
                            onClick={() => {
                              const t = newKeyword.trim();
                              if (!t) return;
                              const next = addKeyword(preStudy, t, "B");
                              setPreStudy(next);
                              setNewKeyword("");
                              addBackstageEvent({
                                type: "prestudy",
                                subject: normalizeSubject(subject.slug),
                                topicId,
                                topic: topic.name,
                                note: "prestudy_keywords_saved",
                              });
                            }}
                            className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
                          >
                            Add
                          </Button>
                        </div>

                        <div className="mt-3 space-y-2">
                          {preStudy.keywords.slice(0, 20).map((k) => {
                            const assigned = preStudy.assignments.find((a) => a.keywordId === k.id);
                            return (
                              <div
                                key={k.id}
                                className="flex items-center justify-between gap-3 p-2 rounded border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A]"
                              >
                                <div className="min-w-0">
                                  <div className="text-sm text-[#E5E7EB] truncate">{k.text}</div>
                                  <div className="text-xs text-[#6B7280]">
                                    Importance: {k.importance} • Chunk: {assigned ? preStudy.chunks.find((c) => c.id === assigned.chunkId)?.title : "—"}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {(["A", "B", "C"] as const).map((imp) => (
                                    <Button
                                      key={imp}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const next = setKeywordImportance(preStudy, k.id, imp);
                                        setPreStudy(next);
                                      }}
                                      className={cn(
                                        "h-8 px-2 border-[rgba(229,231,235,0.12)]",
                                        k.importance === imp
                                          ? imp === "A"
                                            ? "bg-[#10B981]/20 text-[#10B981]"
                                            : imp === "B"
                                              ? "bg-[#06B6D4]/15 text-[#06B6D4]"
                                              : "bg-[#F59E0B]/15 text-[#F59E0B]"
                                          : "text-[#9CA3AF]"
                                      )}
                                    >
                                      {imp}
                                    </Button>
                                  ))}

                                  <div className="flex gap-1">
                                    {preStudy.chunks.map((c) => (
                                      <Button
                                        key={c.id}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const next = setKeywordChunk(preStudy, k.id, c.id);
                                          setPreStudy(next);
                                        }}
                                        className={cn(
                                          "h-8 px-2 border-[rgba(6,182,212,0.2)] text-[#9CA3AF]",
                                          assigned?.chunkId === c.id ? "bg-[#06B6D4]/15 text-[#06B6D4]" : ""
                                        )}
                                      >
                                        {c.order}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-xs text-[#6B7280]">
                          Tip: add at least 10 keywords. Tag ≥3 as A (Must know). Assign each keyword to a chunk.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs text-[#9CA3AF]">Chunks (3–4)</label>
                          <p className="text-xs text-[#6B7280] mt-1">Each chunk should have ≥3 keywords.</p>
                        </div>
                        <Button
                          onClick={() => {
                            const next = addChunk(preStudy);
                            setPreStudy(next);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-[rgba(6,182,212,0.35)] text-[#06B6D4] hover:bg-[#06B6D4]/10"
                          disabled={preStudy.chunks.length >= 4}
                        >
                          Add chunk
                        </Button>
                      </div>

                      {preStudy.chunks.map((c) => {
                        const currentAimText =
                          aimDraftByChunk[c.id] ??
                          preStudy.aimQuestions
                            .filter((q) => q.chunkId === c.id)
                            .map((q) => q.text)
                            .join("\n");

                        return (
                          <div key={c.id} className="p-3 rounded border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A]">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/25">
                                Chunk {c.order}
                              </Badge>
                              <Input
                                value={c.title}
                                onChange={(e) => {
                                  const next = setChunkTitle(preStudy, c.id, e.target.value);
                                  setPreStudy(next);
                                }}
                                className="bg-[#0D1B2A] border-[rgba(6,182,212,0.15)] text-[#E5E7EB]"
                              />
                            </div>

                            <div className="mt-3">
                              <label className="text-xs text-[#9CA3AF]">Aim questions (one per line)</label>
                              <Textarea
                                value={currentAimText}
                                onChange={(e) => {
                                  const t = e.target.value;
                                  setAimDraftByChunk((m) => ({ ...m, [c.id]: t }));
                                }}
                                onBlur={() => {
                                  const t = (aimDraftByChunk[c.id] ?? currentAimText) || "";
                                  const next = setAimQuestionsText(preStudy, c.id, t);
                                  setPreStudy(next);
                                }}
                                placeholder="Why important? How related? Common confusion?"
                                className="mt-2 bg-[#142538] border-[rgba(6,182,212,0.15)] text-[#E5E7EB]"
                                rows={4}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between gap-3">
                        {(() => {
                          const v = validatePreStudy(preStudy);
                          return (
                            <div className="text-xs text-[#9CA3AF]">
                              <div>
                                Keywords: <span className={v.keywordCount >= 10 ? "text-[#10B981]" : "text-[#F59E0B]"}>{v.keywordCount}</span>
                                {" "}• A: <span className={v.aCount >= 3 ? "text-[#10B981]" : "text-[#F59E0B]"}>{v.aCount}</span>
                                {" "}• Chunks: <span className="text-[#E5E7EB]">{v.chunkCount}</span>
                              </div>
                              <div>
                                Chunk ≥3 keywords: <span className={v.chunkMinOk ? "text-[#10B981]" : "text-[#F59E0B]"}>{v.chunkMinOk ? "OK" : "Fix"}</span>
                                {" "}• Aim questions: <span className={v.aimMinOk ? "text-[#10B981]" : "text-[#F59E0B]"}>{v.aimMinOk ? "OK" : "Fix"}</span>
                              </div>
                            </div>
                          );
                        })()}

                        <Button
                          onClick={() => {
                            const v = validatePreStudy(preStudy);
                            if (!v.ok) return;
                            const next = markPreStudyCompleted(preStudy);
                            setPreStudy(next);
                            addBackstageEvent({
                              type: "prestudy",
                              subject: normalizeSubject(subject.slug),
                              topicId,
                              topic: topic.name,
                              note: `prestudy_completed kw=${v.keywordCount} a=${v.aCount} chunks=${v.chunkCount}`,
                            });
                          }}
                          className="bg-[#10B981] hover:bg-[#059669] text-white"
                        >
                          Mark Pre‑Study Complete
                        </Button>
                      </div>

                      <p className="text-xs text-[#6B7280]">
                        This is the exact workflow we designed: skim → keywords → importance → 3–4 chunks → questions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Learning OS: AIM */}
            <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#E5E7EB] flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#EC4899]" />
                      Learning OS — AIM
                    </h3>
                    <p className="text-sm text-[#9CA3AF] mt-1">
                      Turn chunks into a question-driven scaffold (Why important + ≥6 questions per chunk).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {aim?.completedAt ? (
                      <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                        ✓ Complete
                      </Badge>
                    ) : (
                      <Badge className={cn(
                        "border",
                        preStudy?.completedAt
                          ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#6B7280]/20 text-[#9CA3AF] border-[#6B7280]/30"
                      )}>
                        {preStudy?.completedAt ? "Not done" : "Do Pre‑Study first"}
                      </Badge>
                    )}
                    <Button
                      onClick={() => {
                        if (!preStudy?.completedAt) return;
                        if (!aim) {
                          const a = initAim(topicId, preStudy.chunks.map((c) => c.id));
                          setAim(a);
                          addBackstageEvent({
                            type: "aim",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: "aim_started",
                          });
                        }
                        setAimOpen((v) => !v);
                      }}
                      variant="outline"
                      className={cn(
                        "border-[rgba(236,72,153,0.35)] text-[#EC4899] hover:bg-[#EC4899]/10",
                        !preStudy?.completedAt ? "opacity-50 pointer-events-none" : ""
                      )}
                    >
                      {aimOpen ? "Close" : aim ? "Edit" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {aimOpen && aim && preStudy && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {preStudy.chunks.map((c) => {
                      const plan = aim.chunkPlans.find((p) => p.chunkId === c.id);
                      const qText =
                        aimQuestionsDraft[c.id] ??
                        (plan?.questions || []).map((q) => q.text).join("\n");

                      return (
                        <div key={c.id} className="p-3 rounded border border-[rgba(236,72,153,0.15)] bg-[#0D1B2A]">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/25">
                              Chunk {c.order}
                            </Badge>
                            <div className="text-sm text-[#E5E7EB]">{c.title}</div>
                          </div>

                          <div className="mt-3">
                            <label className="text-xs text-[#9CA3AF]">Why important? (one sentence)</label>
                            <Input
                              value={plan?.whyImportant || ""}
                              onChange={(e) => {
                                const next = setWhyImportant(aim, c.id, e.target.value);
                                setAim(next);
                              }}
                              placeholder="This chunk matters because it changes _____."
                              className="mt-2 bg-[#142538] border-[rgba(236,72,153,0.15)] text-[#E5E7EB]"
                            />
                          </div>

                          <div className="mt-3">
                            <label className="text-xs text-[#9CA3AF]">Aim questions (≥6; one per line)</label>
                            <Textarea
                              value={qText}
                              onChange={(e) => {
                                setAimQuestionsDraft((m) => ({ ...m, [c.id]: e.target.value }));
                              }}
                              onBlur={() => {
                                const t = (aimQuestionsDraft[c.id] ?? qText) || "";
                                const next = setQuestionsFromText(aim, c.id, "viva_mcq", t);
                                setAim(next);
                              }}
                              placeholder="Why important? How related? Common confusion? What changes management?"
                              className="mt-2 bg-[#142538] border-[rgba(236,72,153,0.15)] text-[#E5E7EB]"
                              rows={5}
                            />
                            <p className="mt-2 text-xs text-[#6B7280]">Tip: mix question types (why / how-related / trap / management-change).</p>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between gap-3">
                      {(() => {
                        const v = validateAim(aim);
                        const good = v.perChunk.filter((c) => c.ok).length;
                        return (
                          <div className="text-xs text-[#9CA3AF]">
                            Chunks complete: <span className={good === v.perChunk.length ? "text-[#10B981]" : "text-[#F59E0B]"}>{good}/{v.perChunk.length}</span>
                            {" "}• Each needs “why important” + ≥6 questions.
                          </div>
                        );
                      })()}

                      <Button
                        onClick={() => {
                          const v = validateAim(aim);
                          if (!v.ok) return;
                          const next = markAimCompleted(aim);
                          setAim(next);
                          addBackstageEvent({
                            type: "aim",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: "aim_completed",
                          });
                        }}
                        className="bg-[#10B981] hover:bg-[#059669] text-white"
                      >
                        Mark AIM Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

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
            {/* Summary */}
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

            {/* Mnemonics */}
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

            {/* High Yield Points */}
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

            {/* Common MCQs */}
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
        
        // Fallback to textbook references if no rich content
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
          <div className="space-y-6">
            {/* Prerequisites */}
            {(topic.prerequisites?.length ?? 0) > 0 && (
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E5E7EB] mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {topic.prerequisites?.map((prereq) => {
                      const prereqTopic = allTopics.find(t => t.id === prereq);
                      return (
                        <Link
                          key={prereq}
                          href={`/library/${subject.slug}/${subspecialty.slug}/${prereqTopic?.slug || prereq}?mode=explorer`}
                        >
                          <Badge className="bg-[#0D1B2A] hover:bg-[rgba(6,182,212,0.1)] text-[#9CA3AF] border-[rgba(6,182,212,0.2)] cursor-pointer">
                            <ChevronLeft className="w-3 h-3 mr-1" />
                            {prereqTopic?.name || prereq}
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Topic */}
            <Card className="bg-[rgba(6,182,212,0.1)] border-[#06B6D4]">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#06B6D4] mb-2">Current Topic</h3>
                <p className="text-xl font-bold text-[#E5E7EB]">{topic.name}</p>
                {topic.description && (
                  <p className="text-[#9CA3AF] mt-1">{topic.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Related Topics */}
            {(topic.relatedTopics?.length ?? 0) > 0 && (
              <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E5E7EB] mb-3">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {topic.relatedTopics?.map((related) => {
                      const relatedTopic = allTopics.find(t => t.id === related);
                      return (
                        <Link
                          key={related}
                          href={`/library/${subject.slug}/${subspecialty.slug}/${relatedTopic?.slug || related}?mode=explorer`}
                        >
                          <Badge className="bg-[#0D1B2A] hover:bg-[rgba(6,182,212,0.1)] text-[#9CA3AF] border-[rgba(6,182,212,0.2)] cursor-pointer">
                            {relatedTopic?.name || related}
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Badge>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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

    // Emit a Backstage note event (metacognitive trace)
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

        {/* Optional reading aid */}
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
