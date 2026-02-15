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
import { AutoExamPrep } from "@/components/AutoExamPrep";
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
import { getShoot, initShoot, setLayered, setVprefre, updateChunk as updateShootChunk, validateShoot, validateShootChunk, markChunkCompleted as markShootChunkCompleted, markShootCompleted } from "@/lib/shoot/store";
import type { Shoot } from "@/lib/shoot/types";
import { getSkin, initSkin, setTwoFourRule, setGrinde, setTeachBackGaps, validateSkin, markSkinCompleted } from "@/lib/skin/store";
import type { Skin } from "@/lib/skin/types";
import { getMindMap, generateMindMapDraft, renameNode, addEdge, canFinalize, finalizeMindMap } from "@/lib/mindmap/store";
import type { MindMap } from "@/lib/mindmap/types";

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

  // Learning OS: SHOOT
  const [shootOpen, setShootOpen] = useState(false);
  const [shoot, setShoot] = useState<Shoot | null>(() => getShoot(topicId));

  // Learning OS: SKIN
  const [skinOpen, setSkinOpen] = useState(false);
  const [skin, setSkin] = useState<Skin | null>(() => getSkin(topicId));

  // Learning OS: Mind Map
  const [mindMapOpen, setMindMapOpen] = useState(false);
  const [mindMap, setMindMap] = useState<MindMap | null>(() => getMindMap(topicId));
  const [edgeFrom, setEdgeFrom] = useState<string>("");
  const [edgeTo, setEdgeTo] = useState<string>("");
  const [edgeRelation, setEdgeRelation] = useState<"therefore"|"causes"|"leads_to"|"differentiates"|"requires"|"part_of"|"example_of">("therefore");

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShoot(getShoot(topicId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShootOpen(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkin(getSkin(topicId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkinOpen(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMindMap(getMindMap(topicId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMindMapOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEdgeFrom("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEdgeTo("");
  }, [topicId]);
  
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
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-2 rounded border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A]"
                              >
                                <div className="min-w-0">
                                  <div className="text-sm text-[#E5E7EB] truncate">{k.text}</div>
                                  <div className="text-xs text-[#6B7280]">
                                    Importance: {k.importance} • Chunk: {assigned ? preStudy.chunks.find((c) => c.id === assigned.chunkId)?.title : "—"}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
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

            {/* Learning OS: SHOOT */}
            <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#E5E7EB] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#A78BFA]" />
                      Learning OS — SHOOT
                    </h3>
                    <p className="text-sm text-[#9CA3AF] mt-1">
                      Encode each chunk (Logic → Concepts → Important details) + VPReFRE.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {shoot?.completedAt ? (
                      <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">✓ Complete</Badge>
                    ) : (
                      <Badge className={cn(
                        "border",
                        aim?.completedAt
                          ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#6B7280]/20 text-[#9CA3AF] border-[#6B7280]/30"
                      )}>
                        {aim?.completedAt ? "Not done" : "Do AIM first"}
                      </Badge>
                    )}
                    <Button
                      onClick={() => {
                        if (!aim?.completedAt || !preStudy) return;
                        if (!shoot) {
                          const s = initShoot(topicId, preStudy.chunks.map((c) => c.id));
                          setShoot(s);
                          addBackstageEvent({
                            type: "shoot",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: "shoot_started",
                          });
                        }
                        setShootOpen((v) => !v);
                      }}
                      variant="outline"
                      className={cn(
                        "border-[rgba(167,139,250,0.45)] text-[#A78BFA] hover:bg-[#A78BFA]/10",
                        !aim?.completedAt ? "opacity-50 pointer-events-none" : ""
                      )}
                    >
                      {shootOpen ? "Close" : shoot ? "Edit" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {shootOpen && shoot && preStudy && (
                <CardContent className="pt-0 space-y-4">
                  {preStudy.chunks.map((c) => {
                    const art = shoot.artifacts.find((a) => a.chunkId === c.id);
                    if (!art) return null;
                    const v = validateShootChunk(art);

                    return (
                      <div key={c.id} className="p-3 rounded border border-[rgba(167,139,250,0.15)] bg-[#0D1B2A]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/25">Chunk {c.order}</Badge>
                            <div className="text-sm text-[#E5E7EB]">{c.title}</div>
                          </div>
                          {art.completedAt ? (
                            <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">✓ Done</Badge>
                          ) : (
                            <Badge className={cn("border", v.ok ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20")}
                            >
                              {v.ok ? "Ready" : "Incomplete"}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="text-xs text-[#9CA3AF]">Logic / Backbone (≥2 bullets)</label>
                            <Textarea
                              value={art.layered.logic}
                              onChange={(e) => setShoot(setLayered(shoot, c.id, "logic", e.target.value))}
                              className="mt-2 bg-[#142538] border-[rgba(167,139,250,0.15)] text-[#E5E7EB]"
                              rows={4}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#9CA3AF]">Concepts / Relationships (≥3 bullets)</label>
                            <Textarea
                              value={art.layered.concepts}
                              onChange={(e) => setShoot(setLayered(shoot, c.id, "concepts", e.target.value))}
                              className="mt-2 bg-[#142538] border-[rgba(167,139,250,0.15)] text-[#E5E7EB]"
                              rows={4}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#9CA3AF]">Important details (≥3 bullets)</label>
                            <Textarea
                              value={art.layered.importantDetails}
                              onChange={(e) => setShoot(setLayered(shoot, c.id, "importantDetails", e.target.value))}
                              className="mt-2 bg-[#142538] border-[rgba(167,139,250,0.15)] text-[#E5E7EB]"
                              rows={4}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#9CA3AF]">Teach-back prompts (≥1)</label>
                            <Textarea
                              value={art.teachBackPrompts}
                              onChange={(e) => setShoot(updateShootChunk(shoot, c.id, { teachBackPrompts: e.target.value }))}
                              className="mt-2 bg-[#142538] border-[rgba(167,139,250,0.15)] text-[#E5E7EB]"
                              rows={4}
                              placeholder="Explain in 60s: …"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="text-xs text-[#9CA3AF]">VPReFRE (quick self-check)</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {(
                              [
                                ["visual", "Visual"],
                                ["processed", "Processed"],
                                ["relational", "Relational"],
                                ["freehand", "Freehand"],
                                ["reflective", "Reflective"],
                                ["efficient", "Efficient"],
                              ] as const
                            ).map(([k, label]) => (
                              <Button
                                key={k}
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const nextVal = !art.vprefre[k];
                                  setShoot(setVprefre(shoot, c.id, k, nextVal));
                                }}
                                className={cn(
                                  "justify-start border-[rgba(167,139,250,0.2)]",
                                  art.vprefre[k] ? "bg-[#A78BFA]/15 text-[#A78BFA]" : "text-[#9CA3AF]"
                                )}
                              >
                                {art.vprefre[k] ? "✓" : "○"} {label}
                              </Button>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-[#6B7280]">Minimum to pass: Processed + Efficient must be ✓.</p>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                          <Button
                            onClick={() => {
                              const vv = validateShootChunk(art);
                              if (!vv.ok) return;
                              const next = markShootChunkCompleted(shoot, c.id);
                              setShoot(next);
                              addBackstageEvent({
                                type: "shoot",
                                subject: normalizeSubject(subject.slug),
                                topicId,
                                topic: topic.name,
                                note: `shoot_chunk_completed chunk=${c.order}`,
                              });
                            }}
                            className="bg-[#10B981] hover:bg-[#059669] text-white"
                          >
                            Mark Chunk Complete
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between gap-3">
                    {(() => {
                      const v = validateShoot(shoot);
                      const good = v.perChunk.filter((c) => c.ok).length;
                      return (
                        <div className="text-xs text-[#9CA3AF]">
                          Chunks ready: <span className={good === v.perChunk.length ? "text-[#10B981]" : "text-[#F59E0B]"}>{good}/{v.perChunk.length}</span>
                        </div>
                      );
                    })()}

                    <Button
                      onClick={() => {
                        const v = validateShoot(shoot);
                        if (!v.ok) return;
                        const next = markShootCompleted(shoot);
                        setShoot(next);
                        addBackstageEvent({
                          type: "shoot",
                          subject: normalizeSubject(subject.slug),
                          topicId,
                          topic: topic.name,
                          note: "shoot_completed",
                        });
                      }}
                      className="bg-[#10B981] hover:bg-[#059669] text-white"
                    >
                      Mark SHOOT Complete
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Learning OS: SKIN */}
            <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#E5E7EB] flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-[#F59E0B]" />
                      Learning OS — SKIN
                    </h3>
                    <p className="text-sm text-[#9CA3AF] mt-1">
                      Refine structure (2–4 rule + GRINDE) and capture teach-back gaps.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {skin?.completedAt ? (
                      <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">✓ Complete</Badge>
                    ) : (
                      <Badge className={cn(
                        "border",
                        shoot?.completedAt
                          ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#6B7280]/20 text-[#9CA3AF] border-[#6B7280]/30"
                      )}>
                        {shoot?.completedAt ? "Not done" : "Do SHOOT first"}
                      </Badge>
                    )}
                    <Button
                      onClick={() => {
                        if (!shoot?.completedAt || !preStudy) return;
                        if (!skin) {
                          const s = initSkin(topicId, preStudy.chunks.map((c) => c.id));
                          setSkin(s);
                          addBackstageEvent({
                            type: "skin",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: "skin_started",
                          });
                        }
                        setSkinOpen((v) => !v);
                      }}
                      variant="outline"
                      className={cn(
                        "border-[rgba(245,158,11,0.45)] text-[#F59E0B] hover:bg-[#F59E0B]/10",
                        !shoot?.completedAt ? "opacity-50 pointer-events-none" : ""
                      )}
                    >
                      {skinOpen ? "Close" : skin ? "Edit" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {skinOpen && skin && preStudy && (
                <CardContent className="pt-0 space-y-4">
                  {preStudy.chunks.map((c) => {
                    const sc = skin.chunks.find((x) => x.chunkId === c.id);
                    if (!sc) return null;
                    return (
                      <div key={c.id} className="p-3 rounded border border-[rgba(245,158,11,0.15)] bg-[#0D1B2A]">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25">Chunk {c.order}</Badge>
                          <div className="text-sm text-[#E5E7EB]">{c.title}</div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSkin(setTwoFourRule(skin, c.id, !sc.appliedTwoFourRule))}
                            className={cn(
                              "border-[rgba(245,158,11,0.25)]",
                              sc.appliedTwoFourRule ? "bg-[#F59E0B]/15 text-[#F59E0B]" : "text-[#9CA3AF]"
                            )}
                          >
                            {sc.appliedTwoFourRule ? "✓" : "○"} Applied 2–4 Rule
                          </Button>
                        </div>

                        <div className="mt-3">
                          <label className="text-xs text-[#9CA3AF]">GRINDE (quick self-check)</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {(
                              [
                                ["grouped", "Grouped"],
                                ["reflective", "Reflective"],
                                ["interconnected", "Interconnected"],
                                ["nonVerbal", "Non‑verbal"],
                                ["directional", "Directional"],
                                ["emphasised", "Emphasised"],
                              ] as const
                            ).map(([k, label]) => (
                              <Button
                                key={k}
                                type="button"
                                variant="outline"
                                onClick={() => setSkin(setGrinde(skin, c.id, k, !sc.grinde[k]))}
                                className={cn(
                                  "justify-start border-[rgba(245,158,11,0.25)]",
                                  sc.grinde[k] ? "bg-[#F59E0B]/15 text-[#F59E0B]" : "text-[#9CA3AF]"
                                )}
                              >
                                {sc.grinde[k] ? "✓" : "○"} {label}
                              </Button>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-[#6B7280]">Minimum to pass: Grouped + Directional must be ✓.</p>
                        </div>

                        <div className="mt-3">
                          <label className="text-xs text-[#9CA3AF]">Teach-back gaps (what you blanked on)</label>
                          <Textarea
                            value={sc.teachBackGaps}
                            onChange={(e) => setSkin(setTeachBackGaps(skin, c.id, e.target.value))}
                            className="mt-2 bg-[#142538] border-[rgba(245,158,11,0.15)] text-[#E5E7EB]"
                            rows={3}
                            placeholder="List gaps (one per line)…"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between gap-3">
                    {(() => {
                      const v = validateSkin(skin);
                      const good = v.perChunk.filter((c) => c.ok).length;
                      return (
                        <div className="text-xs text-[#9CA3AF]">
                          Chunks passing: <span className={good === v.perChunk.length ? "text-[#10B981]" : "text-[#F59E0B]"}>{good}/{v.perChunk.length}</span>
                          {" "}• Need 2–4 rule + Grouped+Directional.
                        </div>
                      );
                    })()}

                    <Button
                      onClick={() => {
                        const v = validateSkin(skin);
                        if (!v.ok) return;
                        const next = markSkinCompleted(skin);
                        setSkin(next);
                        addBackstageEvent({
                          type: "skin",
                          subject: normalizeSubject(subject.slug),
                          topicId,
                          topic: topic.name,
                          note: "skin_completed",
                        });
                      }}
                      className="bg-[#10B981] hover:bg-[#059669] text-white"
                    >
                      Mark SKIN Complete
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Learning OS: Mind Map */}
            <Card className="bg-[#142538] border-[rgba(6,182,212,0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#E5E7EB] flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#06B6D4]" />
                      Learning OS — Mind Map
                    </h3>
                    <p className="text-sm text-[#9CA3AF] mt-1">
                      Generate a draft from your Pre‑Study, then make 3 edits to finalize.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {mindMap?.status === "final" ? (
                      <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">✓ Final</Badge>
                    ) : mindMap ? (
                      <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">Draft</Badge>
                    ) : (
                      <Badge className={cn(
                        "border",
                        skin?.completedAt
                          ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#6B7280]/20 text-[#9CA3AF] border-[#6B7280]/30"
                      )}>
                        {skin?.completedAt ? "Not generated" : "Do SKIN first"}
                      </Badge>
                    )}
                    <Button
                      onClick={() => {
                        if (!skin?.completedAt) return;
                        if (!mindMap) {
                          const mm = generateMindMapDraft(topicId, preStudy);
                          setMindMap(mm);
                          addBackstageEvent({
                            type: "mindmap",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: `mindmap_generated nodes=${mm.nodes.length} edges=${mm.edges.length}`,
                          });
                        }
                        setMindMapOpen((v) => !v);
                      }}
                      variant="outline"
                      className={cn(
                        "border-[rgba(6,182,212,0.35)] text-[#06B6D4] hover:bg-[#06B6D4]/10",
                        !skin?.completedAt ? "opacity-50 pointer-events-none" : ""
                      )}
                    >
                      {mindMapOpen ? "Close" : mindMap ? "View" : "Generate"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {mindMapOpen && mindMap && preStudy && (
                <CardContent className="pt-0 space-y-4">
                  <div className="text-xs text-[#9CA3AF]">
                    Edits: <span className={canFinalize(mindMap) ? "text-[#10B981]" : "text-[#F59E0B]"}>{mindMap.userEditsCount}/{mindMap.requiredEdits}</span>
                    {" "}• Rename nodes or add edges to finalize.
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {preStudy.chunks.map((c) => {
                        const nodes = mindMap.nodes.filter((n) => n.chunkId === c.id);
                        return (
                          <div key={c.id} className="p-3 rounded border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A]">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/25">Chunk {c.order}</Badge>
                              <div className="text-sm text-[#E5E7EB]">{c.title}</div>
                            </div>
                            <div className="mt-2 space-y-2">
                              {nodes.slice(0, 12).map((n) => (
                                <Input
                                  key={n.id}
                                  value={n.label}
                                  onChange={(e) => {
                                    const next = renameNode(mindMap, n.id, e.target.value);
                                    setMindMap(next);
                                    addBackstageEvent({
                                      type: "mindmap",
                                      subject: normalizeSubject(subject.slug),
                                      topicId,
                                      topic: topic.name,
                                      note: "mindmap_user_edit(rename_node)",
                                    });
                                  }}
                                  className={cn(
                                    "bg-[#142538] border-[rgba(6,182,212,0.12)] text-[#E5E7EB]",
                                    n.importance === "A" ? "border-[#10B981]/30" : ""
                                  )}
                                />
                              ))}
                              {nodes.length > 12 && (
                                <div className="text-xs text-[#6B7280]">+{nodes.length - 12} more nodes…</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A]">
                        <div className="text-sm text-[#E5E7EB] font-medium">Add an edge</div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <select
                            value={edgeFrom}
                            onChange={(e) => setEdgeFrom(e.target.value)}
                            className="h-9 rounded bg-[#142538] border border-[rgba(6,182,212,0.12)] text-[#E5E7EB] px-2"
                          >
                            <option value="">From node…</option>
                            {mindMap.nodes.map((n) => (
                              <option key={n.id} value={n.id}>{n.label}</option>
                            ))}
                          </select>
                          <select
                            value={edgeRelation}
                            onChange={(e) => setEdgeRelation(e.target.value as any)}
                            className="h-9 rounded bg-[#142538] border border-[rgba(6,182,212,0.12)] text-[#E5E7EB] px-2"
                          >
                            <option value="therefore">therefore</option>
                            <option value="causes">causes</option>
                            <option value="leads_to">leads_to</option>
                            <option value="differentiates">differentiates</option>
                            <option value="requires">requires</option>
                            <option value="part_of">part_of</option>
                            <option value="example_of">example_of</option>
                          </select>
                          <select
                            value={edgeTo}
                            onChange={(e) => setEdgeTo(e.target.value)}
                            className="h-9 rounded bg-[#142538] border border-[rgba(6,182,212,0.12)] text-[#E5E7EB] px-2"
                          >
                            <option value="">To node…</option>
                            {mindMap.nodes.map((n) => (
                              <option key={n.id} value={n.id}>{n.label}</option>
                            ))}
                          </select>

                          <Button
                            onClick={() => {
                              if (!edgeFrom || !edgeTo) return;
                              const next = addEdge(mindMap, edgeFrom, edgeTo, edgeRelation);
                              setMindMap(next);
                              setEdgeFrom("");
                              setEdgeTo("");
                              addBackstageEvent({
                                type: "mindmap",
                                subject: normalizeSubject(subject.slug),
                                topicId,
                                topic: topic.name,
                                note: "mindmap_user_edit(add_edge)",
                              });
                            }}
                            className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D1B2A]"
                          >
                            Add edge
                          </Button>
                        </div>
                      </div>

                      <div className="p-3 rounded border border-[rgba(6,182,212,0.12)] bg-[#0D1B2A]">
                        <div className="text-sm text-[#E5E7EB] font-medium">Edges ({mindMap.edges.length})</div>
                        <div className="mt-2 space-y-1 max-h-[240px] overflow-auto">
                          {mindMap.edges.slice(0, 30).map((e) => {
                            const from = mindMap.nodes.find((n) => n.id === e.from)?.label || "?";
                            const to = mindMap.nodes.find((n) => n.id === e.to)?.label || "?";
                            return (
                              <div key={e.id} className="text-xs text-[#9CA3AF]">
                                {from} <span className="text-[#06B6D4]">{e.relation}</span> {to}
                              </div>
                            );
                          })}
                          {mindMap.edges.length > 30 && (
                            <div className="text-xs text-[#6B7280]">+{mindMap.edges.length - 30} more…</div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          if (!canFinalize(mindMap)) return;
                          const next = finalizeMindMap(mindMap);
                          setMindMap(next);
                          addBackstageEvent({
                            type: "mindmap",
                            subject: normalizeSubject(subject.slug),
                            topicId,
                            topic: topic.name,
                            note: "mindmap_finalized",
                          });
                        }}
                        className={cn(
                          "w-full",
                          canFinalize(mindMap)
                            ? "bg-[#10B981] hover:bg-[#059669] text-white"
                            : "bg-[#374151] text-[#9CA3AF] cursor-not-allowed"
                        )}
                      >
                        Finalize Mind Map (requires 3 edits)
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
          // Auto-generate exam prep from concept content or rich textbook content
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
