"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  CircleCheck,
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
import {
  LearningMethodRail,
  type LearningMethodStageDetails,
} from "@/components/library/LearningMethodRail";
import { addPocketNote, getNotesForTopic } from "@/lib/pocket/store";
import { addBackstageEvent, normalizeSubject } from "@/lib/backstage/store";
import { hydrateTopicLearningState } from "@/lib/learning/hydration";
import { scoreShootRubric, scoreSkinRubric } from "@/lib/learning/rubrics";
import {
  deriveLearningMethodProgress,
  type LearningMethodStageId,
} from "@/lib/learning/method-progress";
import {
  getPreStudy,
  initPreStudy,
  markPreStudyCompleted,
  upsertPreStudy,
} from "@/lib/prestudy/store";
import type { PreStudy } from "@/lib/prestudy/types";
import { getAim, initAim, markAimCompleted, upsertAim } from "@/lib/aim/store";
import type { Aim } from "@/lib/aim/types";
import { getShoot, initShoot, markShootCompleted, upsertShoot } from "@/lib/shoot/store";
import type { Shoot } from "@/lib/shoot/types";
import { getSkin, initSkin, markSkinCompleted, upsertSkin } from "@/lib/skin/store";
import type { Skin } from "@/lib/skin/types";
import {
  addEdge,
  finalizeMindMap,
  generateMindMapDraft,
  getMindMap,
  renameNode,
} from "@/lib/mindmap/store";
import type { MindMap } from "@/lib/mindmap/types";
import {
  createLearningCheckpoint,
  fetchLearningTopicByTopicId,
  fetchLearningTopicReadModelByTopicId,
  patchLearningTopic,
  type CheckpointHistoryByStage,
  type LatestCheckpointByStage,
  type LearningTopicRow,
} from "@/lib/learning/topic-lifecycle";

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
    <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
      <CardContent className="p-6">
        <div className="mb-4">
          <Badge className="bg-[rgba(236,72,153,0.15)] text-[#EC4899] border-[rgba(236,72,153,0.3)]">
            <Brain className="w-3 h-3 mr-1" />
            Retrieval Practice
          </Badge>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#E8E0D5] mb-2">Question</h3>
          <p className="text-[#A0B0BC]">{card.question}</p>
        </div>

        {!showAnswer ? (
          <Button
            onClick={handleReveal}
            className="w-full bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]"
          >
            Reveal Answer
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#2D3E50] rounded-lg border border-[rgba(91,179,179,0.2)]">
              <h4 className="text-sm font-medium text-[#5BB3B3] mb-2">Answer</h4>
              <p className="text-[#E8E0D5]">{card.answer}</p>
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
                  <CircleCheck className="w-4 h-4 mr-2" />
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
                  className="bg-[#5BB3B3] hover:bg-[#4A9E9E] text-[#2D3E50]"
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

const ACHALASIA_DEMO_ROUTE = "/library/surgery/esophagus/achalasia?demo=run&mode=explorer";

const ACHALASIA_DEMO_TEMPLATE = {
  skimNotes:
    "Template demo: start with symptom pattern (solids + liquids), confirm LES relaxation failure, classify subtype, then decide POEM vs LHM + fundoplication.",
  chunkTitles: [
    "Pathophysiology and subtype logic",
    "Diagnosis workflow and manometry",
    "Procedure strategy and follow-up",
  ],
  keywords: [
    "Dysphagia for solids and liquids",
    "LES fails to relax",
    "Aperistalsis of distal esophagus",
    "Bird-beak sign on barium swallow",
    "High-resolution manometry gold standard",
    "Chicago classification type I II III",
    "Pseudoachalasia malignancy red flags",
    "Laparoscopic Heller myotomy with fundoplication",
    "POEM selection in type III achalasia",
    "Post-procedure reflux surveillance",
  ],
  aimPlans: [
    {
      whyImportant:
        "Without mechanism-first framing, achalasia gets confused with GERD/stricture and treatment timing is delayed.",
      questions: [
        "Why does inhibitory neuron loss create simultaneous solids + liquids dysphagia?",
        "How does type III achalasia alter procedural planning compared with type II?",
        "What red flags make you suspect pseudoachalasia instead of primary achalasia?",
        "Which symptom progression most strongly supports motility failure over mechanical obstruction?",
        "Viva: explain why LES pressure alone is not enough without integrated relaxation metrics.",
        "Viva: contrast achalasia pathophysiology with diffuse esophageal spasm in 30 seconds.",
      ],
    },
    {
      whyImportant:
        "Diagnostic sequence errors are common; manometry should confirm subtype after structural exclusion.",
      questions: [
        "Why is endoscopy necessary before definitive achalasia intervention?",
        "How do barium findings guide but not confirm diagnosis?",
        "What manometry findings define type I, II, and III disease?",
        "Which test result should trigger concern for GE-junction malignancy mimic?",
        "Viva: state the gold-standard test and what exact physiology it confirms.",
        "Viva: provide a stepwise diagnostic algorithm from clinic visit to subtype label.",
      ],
    },
    {
      whyImportant:
        "Correct therapy selection improves symptom control and reduces retreatment burden.",
      questions: [
        "Why might POEM be favored in spastic/type III patterns?",
        "How do you choose between pneumatic dilatation and Heller myotomy?",
        "What role does fundoplication play after surgical myotomy?",
        "How should post-procedure reflux risk be monitored and managed?",
        "Viva: list two perioperative pitfalls and your mitigation plan.",
        "Viva: summarize long-term follow-up checkpoints in one minute.",
      ],
    },
  ],
  shootArtifacts: [
    {
      logic:
        "1. Symptom cluster suggests motility disorder, not isolated structural narrowing.\n2. LES non-relaxation + aperistalsis explains retained food and nocturnal regurgitation.",
      concepts:
        "Auerbach plexus inhibitory neuron loss\nIntegrated relaxation pressure elevation\nSubtype-dependent contractile pattern",
      importantDetails:
        "Type II has best response rates\nPseudoachalasia must be excluded with endoscopy/biopsy when suspicious\nLong-standing disease can lead to megaesophagus",
      arbitraryDetails: "Memory cue: BIRD -> Bird-beak, IRP high, Regurgitation, Dysphagia both solids/liquids",
      teachBack: "Teach achalasia pathophysiology from neuron loss to symptoms in 45 seconds.",
      gap: "Differentiate pseudoachalasia red flags more sharply.",
    },
    {
      logic:
        "1. Endoscopy excludes mucosal/obstructive mimics.\n2. Barium supports suspicion.\n3. HRM confirms and subtypes disease for treatment planning.",
      concepts:
        "Sequential testing hierarchy\nChicago v4 subtype mapping\nRule-out before intervention",
      importantDetails:
        "HRM is confirmatory gold standard\nBird-beak is supportive not definitive\nRapid weight loss or short history should trigger malignancy workup",
      arbitraryDetails: "Checklist: E-B-M -> Endoscopy, Barium, Manometry",
      teachBack: "Teach diagnostic workflow as an OSCE station handoff.",
      gap: "Explain why CT/EUS is added when pseudoachalasia concern persists.",
    },
    {
      logic:
        "1. Match intervention to subtype and local expertise.\n2. Balance symptom control, reflux risk, and durability.",
      concepts:
        "POEM technical reach in spastic disease\nLHM + fundoplication reflux protection\nNeed for post-procedure surveillance",
      importantDetails:
        "Type III often benefits from POEM\nFundoplication lowers reflux after surgical myotomy\nCounsel on recurrence and reflux monitoring",
      arbitraryDetails: "Decision frame: subtype + expertise + reflux profile",
      teachBack: "Teach treatment-selection matrix to a junior resident.",
      gap: "Clarify rescue strategy after failed first-line intervention.",
    },
  ],
  skinTeachBackGaps: [
    "During viva, pause less and structure the mechanism story before investigations.",
    "Add one explicit pseudoachalasia exclusion statement in every answer.",
    "State follow-up plan with reflux surveillance and symptom score trend.",
  ],
} as const;

const ICAN_GUIDELINES: Record<LearningMethodStageId, string[]> = {
  prestudy: [
    "Preview over review: start with big-picture ideas before details.",
    "Use non-linear chunk maps instead of long linear notes.",
    "Limit word count and force concept compression.",
    "Prioritize relationships between concepts before memorization.",
  ],
  aim: [
    "Ask why-important and how-related questions for each chunk.",
    "Convert passive reading into problem-solving prompts.",
    "Use deeper interconnected questions, not isolated trivia.",
    "Judge relevance explicitly: what changes diagnosis or management?",
  ],
  shoot: [
    "Collect then process: simplify and regroup information actively.",
    "Build layered outputs (logic, concepts, high-yield details).",
    "Teach-back to expose weak links and uncertain transitions.",
    "Use VPReFRE checks to keep explanations clear and efficient.",
  ],
  skin: [
    "Refine with deliberate retrieval and spacing cadence.",
    "Apply 1-day, 1-week, 1-month reinforcement loops.",
    "Use GRINDE to improve grouping, direction, and emphasis.",
    "Convert mistakes into targeted micro-gaps for next cycle.",
  ],
  mindmap: [
    "Represent knowledge as a connected, non-linear chunk map.",
    "Prioritize high-value nodes and causal/differential edges.",
    "Keep map editable until relationships become stable.",
    "Finalize only after iterative edits and simplification.",
  ],
};

function uniqueLines(lines: string[], limit: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const normalized = line.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
    if (out.length >= limit) break;
  }
  return out;
}

function stripMarkdownBullet(line: string) {
  return line.replace(/^[-*]\s+/, "").trim();
}

function extractMarkdownBullets(markdown: string | undefined, limit: number) {
  if (!markdown) return [];
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map(stripMarkdownBullet)
    .filter((line) => line.length > 2);
  return uniqueLines(lines, limit);
}

function extractHeadings(markdown: string | undefined, level: number, limit: number) {
  if (!markdown) return [];
  const matcher = new RegExp(`^#{${level}}\\s+(.+)$`);
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .map((line) => {
      const match = line.match(matcher);
      return match?.[1]?.trim() || "";
    })
    .filter((line) => line.length > 0);
  return uniqueLines(lines, limit);
}

function chunkCountById(assignments: Array<{ chunkId: string }>) {
  return assignments.reduce<Record<string, number>>((acc, assignment) => {
    acc[assignment.chunkId] = (acc[assignment.chunkId] || 0) + 1;
    return acc;
  }, {});
}

export default function TopicClient({ subject, subspecialty, topic, allTopics }: TopicClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get('mode') as ViewMode) || 'explorer';
  const demoParam = (searchParams.get("demo") || "").trim().toLowerCase();
  const isAchalasiaDemoTopic =
    subject.slug === "surgery" && subspecialty.slug === "esophagus" && topic.slug === "achalasia";
  const shouldAutoRunDemo =
    isAchalasiaDemoTopic &&
    (demoParam === "run" || demoParam === "1" || demoParam === "true" || demoParam === "achalasia");

  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Optional reading aid: Bionic Reader (persisted per-device)
  const [bionicReader, setBionicReader] = useState(() => {
    try {
      return localStorage.getItem('nx_bionic_reader') === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('nx_bionic_reader', bionicReader ? '1' : '0');
    } catch {
      // ignore
    }
  }, [bionicReader]);

  const topicId = `${subject.slug}/${subspecialty.slug}/${topic.slug}`;
  const [methodProgress, setMethodProgress] = useState(() =>
    deriveLearningMethodProgress(topicId)
  );
  const [lifecycleTopic, setLifecycleTopic] = useState<LearningTopicRow | null>(null);
  const [latestCheckpoints, setLatestCheckpoints] = useState<LatestCheckpointByStage>({});
  const [checkpointHistory, setCheckpointHistory] = useState<CheckpointHistoryByStage>({});
  const [preStudySnapshot, setPreStudySnapshot] = useState<PreStudy | null>(null);
  const [aimSnapshot, setAimSnapshot] = useState<Aim | null>(null);
  const [shootSnapshot, setShootSnapshot] = useState<Shoot | null>(null);
  const [skinSnapshot, setSkinSnapshot] = useState<Skin | null>(null);
  const [mindMapSnapshot, setMindMapSnapshot] = useState<MindMap | null>(null);
  const [stageActionLoading, setStageActionLoading] = useState<LearningMethodStageId | null>(null);
  const [stageActionError, setStageActionError] = useState<string | null>(null);
  const [mockRunLoading, setMockRunLoading] = useState(false);
  const [mockRunStatus, setMockRunStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const autoRunTriggeredRef = useRef(false);

  const ensureLifecycleTopicRow = useCallback(async (): Promise<LearningTopicRow | null> => {
    const existing = await fetchLearningTopicByTopicId(topicId);
    if (existing) {
      return existing;
    }

    const createdResponse = await fetch("/api/learning/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: subject.slug,
        subspecialty: subspecialty.slug,
        topic_slug: topic.slug,
        topic_title: topic.name,
        stage: "prestudy",
        status: "active",
      }),
    });

    if (!createdResponse.ok) {
      return null;
    }

    return (await createdResponse.json()) as LearningTopicRow;
  }, [subject.slug, subspecialty.slug, topic.slug, topic.name, topicId]);

  const refreshMethodData = useCallback(async () => {
    const localProgress = deriveLearningMethodProgress(topicId);
    setMethodProgress(localProgress);
    setPreStudySnapshot(getPreStudy(topicId));
    setAimSnapshot(getAim(topicId));
    setShootSnapshot(getShoot(topicId));
    setSkinSnapshot(getSkin(topicId));
    setMindMapSnapshot(getMindMap(topicId));

    let readModel = await fetchLearningTopicReadModelByTopicId(topicId, 5);
    if (!readModel) {
      const ensured = await ensureLifecycleTopicRow();
      if (ensured) {
        readModel = await fetchLearningTopicReadModelByTopicId(topicId, 5);
      }
    }

    if (!readModel) {
      setLifecycleTopic(null);
      setLatestCheckpoints({});
      setCheckpointHistory({});
      return;
    }

    setLifecycleTopic(readModel.topic);
    setLatestCheckpoints(readModel.stageState.latestCheckpointsByStage);
    setCheckpointHistory(readModel.stageState.checkpointHistoryByStage);
  }, [ensureLifecycleTopicRow, topicId]);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (!active) return;
      void refreshMethodData();
    };

    refresh();
    void hydrateTopicLearningState(topicId).finally(() => {
      refresh();
    });

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [topicId, refreshMethodData]);

  const openLearningStage = (stageId: LearningMethodStageId) => {
    if (stageId === "mindmap") {
      router.push("/classroom/mindmap");
      return;
    }

    const modeByStage: Record<Exclude<LearningMethodStageId, "mindmap">, ViewMode> = {
      prestudy: "explorer",
      aim: "textbook",
      shoot: "cases",
      skin: "quiz",
    };

    setViewMode(modeByStage[stageId]);
  };

  const handleStageAction = async (
    stageId: LearningMethodStageId,
    action: "start" | "pause" | "complete"
  ) => {
    if (stageId === "mindmap") return;

    const stageName: Record<Exclude<LearningMethodStageId, "mindmap">, string> = {
      prestudy: "Prestudy",
      aim: "Aim",
      shoot: "Shoot",
      skin: "Skin",
    };

    if (action === "complete") {
      const confirmed = window.confirm(
        `Complete ${stageName[stageId]} stage?\n\nThis advances the lifecycle and writes a checkpoint.`
      );
      if (!confirmed) return;
    }

    const now = new Date().toISOString();
    let activeTopic = lifecycleTopic ?? (await ensureLifecycleTopicRow());
    if (!activeTopic) {
      setStageActionError("Unable to initialize lifecycle for this topic. Please refresh and try again.");
      return;
    }

    const previousTopicState = {
      stage: activeTopic.stage,
      status: activeTopic.status,
      completed_at: activeTopic.completed_at,
    };
    let transitioned = false;
    const rubricResult =
      action === "complete" && stageId === "shoot"
        ? (() => {
            const shoot = getShoot(topicId);
            return shoot ? scoreShootRubric(shoot) : null;
          })()
        : action === "complete" && stageId === "skin"
          ? (() => {
              const skin = getSkin(topicId);
              return skin ? scoreSkinRubric(skin) : null;
            })()
          : null;

    setStageActionError(null);
    setStageActionLoading(stageId);
    try {
      if (action === "start") {
        const updated = await patchLearningTopic(activeTopic.id, {
          stage: stageId,
          status: "active",
          ...(stageId === "skin" ? {} : { completed_at: null }),
        });
        if (!updated) throw new Error("Unable to mark stage as active.");
        activeTopic = updated;
      } else if (action === "pause") {
        const updated = await patchLearningTopic(activeTopic.id, {
          stage: stageId,
          status: "paused",
        });
        if (!updated) throw new Error("Unable to pause stage.");
        activeTopic = updated;
      } else {
        if ((stageId === "shoot" || stageId === "skin") && !rubricResult) {
          throw new Error(
            `No ${stageName[stageId]} rubric data found. Complete the stage worksheet before submitting.`
          );
        }

        if (rubricResult && !rubricResult.passed) {
          await createLearningCheckpoint({
            learning_topic_id: activeTopic.id,
            stage: stageId,
            checkpoint_code: rubricResult.rubricCode,
            passed: false,
            score: rubricResult.score,
            details: {
              source: "learning_method_rail",
              action: "complete_validation",
              triggeredAt: now,
              rubric: rubricResult,
            },
          });
          throw new Error(
            `${stageName[stageId]} rubric score ${rubricResult.score}% is below threshold ${rubricResult.threshold}%.`
          );
        }

        if (rubricResult) {
          const rubricCheckpoint = await createLearningCheckpoint({
            learning_topic_id: activeTopic.id,
            stage: stageId,
            checkpoint_code: rubricResult.rubricCode,
            passed: true,
            score: rubricResult.score,
            details: {
              source: "learning_method_rail",
              action: "complete_validation",
              triggeredAt: now,
              rubric: rubricResult,
            },
          });
          if (!rubricCheckpoint) {
            throw new Error("Unable to write rubric checkpoint.");
          }
        }

        if (stageId === "skin") {
          const updated = await patchLearningTopic(activeTopic.id, {
            stage: "skin",
            status: "completed",
            completed_at: now,
          });
          if (!updated) throw new Error("Unable to complete final stage.");
          activeTopic = updated;
          transitioned = true;
        } else {
          const nextStage: Exclude<LearningMethodStageId, "prestudy" | "mindmap"> =
            stageId === "aim" ? "shoot" : stageId === "shoot" ? "skin" : "aim";
          const updated = await patchLearningTopic(activeTopic.id, {
            stage: nextStage,
            status: "active",
          });
          if (!updated) throw new Error("Unable to advance to next stage.");
          activeTopic = updated;
          transitioned = true;
        }

        const checkpoint = await createLearningCheckpoint({
          learning_topic_id: activeTopic.id,
          stage: stageId,
          checkpoint_code: `${stageId}_manual_transition`,
          passed: true,
          ...(rubricResult ? { score: rubricResult.score } : {}),
          details: {
            source: "learning_method_rail",
            action: "complete",
            triggeredAt: now,
            ...(rubricResult
              ? {
                  rubric: {
                    code: rubricResult.rubricCode,
                    score: rubricResult.score,
                    threshold: rubricResult.threshold,
                    summary: rubricResult.summary,
                  },
                }
              : {}),
          },
        });
        if (!checkpoint) {
          throw new Error("Unable to write completion checkpoint.");
        }
      }
    } catch (error) {
      let rollbackFailed = false;
      if (action === "complete" && transitioned) {
        const rollback = await patchLearningTopic(activeTopic.id, previousTopicState);
        if (!rollback) rollbackFailed = true;
      }

      const reason = error instanceof Error ? error.message : "Unknown error.";
      if (action === "complete" && transitioned) {
        setStageActionError(
          rollbackFailed
            ? `Failed to complete ${stageName[stageId]}. Checkpoint write failed and rollback failed. ${reason}`
            : `Failed to complete ${stageName[stageId]}. Transition was reverted because checkpoint write failed. ${reason}`
        );
      } else {
        setStageActionError(`Failed to ${action} ${stageName[stageId]}. ${reason}`);
      }
    } finally {
      setStageActionLoading(null);
      await refreshMethodData();
    }
  };

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
              <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.keyPoints?.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#A0B0BC]">
                        <span className="text-[#5BB3B3] mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
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
              <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">Exam Prep Coming Soon</h3>
              <p className="text-[#A0B0BC]">High-yield content for this topic is being prepared.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {topic.content.examPrep?.summary && (
              <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#F59E0B]" />
                    Quick Summary
                  </h3>
                  <MedicalMarkdown content={topic.content.examPrep.summary} bionic={bionicReader} />
                </CardContent>
              </Card>
            )}

            {(topic.content.examPrep?.mnemonics?.length ?? 0) > 0 && (
              <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#EC4899]" />
                    Mnemonics
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.examPrep?.mnemonics?.map((m, i) => (
                      <li key={i} className="p-3 bg-[#2D3E50] rounded-lg text-[#E8E0D5] border border-[rgba(236,72,153,0.2)]">
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
                      <li key={i} className="flex items-start gap-2 text-[#E8E0D5]">
                        <span className="text-[#F59E0B] mt-1">★</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {(topic.content.examPrep?.commonMCQs?.length ?? 0) > 0 && (
              <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#E8E0D5] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#5BB3B3]" />
                    Common MCQ Topics
                  </h3>
                  <ul className="space-y-2">
                    {topic.content.examPrep?.commonMCQs?.map((mcq, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#A0B0BC]">
                        <span className="text-[#5BB3B3]">{i + 1}.</span>
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
              <Loader2 className="w-8 h-8 animate-spin text-[#5BB3B3]" />
              <span className="ml-3 text-[#A0B0BC]">Loading comprehensive content...</span>
            </div>
          );
        }

        if (richContent) {
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-[rgba(91,179,179,0.15)] text-[#5BB3B3] border-[rgba(91,179,179,0.3)]">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Comprehensive Notes
                </Badge>
                <span className="text-xs text-[#6B7280]">For UG, PG & SS Residents</span>
              </div>
              <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-6">
                  <MedicalMarkdown content={richContent} bionic={bionicReader} />
                </CardContent>
              </Card>
            </div>
          );
        }

        if (richContentError) {
          return (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">Unable to load full content</h3>
              <p className="text-[#A0B0BC]">{richContentError}</p>
            </div>
          );
        }

        if ((topic.content.textbookRefs?.length ?? 0) === 0) {
          return (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">No Textbook References</h3>
              <p className="text-[#A0B0BC]">Textbook references for this topic are being added.</p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#E8E0D5]">Textbook References</h3>
            {topic.content.textbookRefs?.map((ref, i) => (
              <Card key={i} className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <BookOpen className="w-8 h-8 text-[#5BB3B3] shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#E8E0D5]">{ref.textbook}</h4>
                      {ref.edition && <p className="text-sm text-[#A0B0BC]">{ref.edition} Edition</p>}
                      <p className="text-[#5BB3B3] mt-1">{ref.chapter}</p>
                      {ref.chapterTitle && <p className="text-sm text-[#A0B0BC]">{ref.chapterTitle}</p>}
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
              <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">No Quiz Cards Yet</h3>
              <p className="text-[#A0B0BC]">Retrieval cards for this topic are being created.</p>
            </div>
          );
        }
        const currentCard = topic.content.retrievalCards![currentCardIndex];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#E8E0D5]">Quiz Mode</h3>
              <Badge className="bg-[#2D3E50] text-[#A0B0BC]">
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
                className="text-[#A0B0BC] border-[rgba(91,179,179,0.2)]"
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
              <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">No Cases Yet</h3>
              <p className="text-[#A0B0BC]">Clinical cases for this topic are being prepared.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            {topic.content.cases?.map((caseItem, i) => (
              <Card key={i} className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-5 h-5 text-[#5BB3B3]" />
                    <h3 className="font-semibold text-[#E8E0D5]">{caseItem.title}</h3>
                  </div>

                  <div className="p-4 bg-[#2D3E50] rounded-lg mb-4">
                    <p className="text-[#A0B0BC]">{caseItem.presentation}</p>
                  </div>

                  <div className="space-y-4">
                    {caseItem.questions?.map((q, qi) => {
                      const isString = typeof q === 'string';
                      return (
                        <details key={qi} className="group">
                          <summary className="cursor-pointer text-[#5BB3B3] hover:text-[#4A9E9E] font-medium">
                            Q{qi + 1}: {isString ? q : q.question}
                          </summary>
                          {!isString && q.answer && (
                            <div className="mt-2 pl-4 border-l-2 border-[rgba(91,179,179,0.3)] text-[#E8E0D5]">
                              {q.answer}
                            </div>
                          )}
                        </details>
                      );
                    })}
                    {caseItem.analysis && (
                      <div className="p-3 bg-[#2D3E50] rounded-lg">
                        <h5 className="text-sm font-medium text-[#5BB3B3] mb-1">Analysis</h5>
                        <p className="text-[#E8E0D5]">{caseItem.analysis}</p>
                      </div>
                    )}
                    {caseItem.clinicalPearl && (
                      <div className="p-3 bg-[rgba(245,158,11,0.1)] rounded-lg border border-[rgba(245,158,11,0.2)]">
                        <h5 className="text-sm font-medium text-[#F59E0B] mb-1">💡 Clinical Pearl</h5>
                        <p className="text-[#E8E0D5]">{caseItem.clinicalPearl}</p>
                      </div>
                    )}
                  </div>

                  {(caseItem.keyLearning?.length ?? 0) > 0 && (
                    <div className="mt-4 pt-4 border-t border-[rgba(91,179,179,0.1)]">
                      <h4 className="text-sm font-medium text-[#F59E0B] mb-2">Key Learning Points</h4>
                      <ul className="space-y-1">
                        {caseItem.keyLearning?.map((point, pi) => (
                          <li key={pi} className="text-sm text-[#A0B0BC] flex items-start gap-2">
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
            roadmaps={topic.content.roadmapJson}
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

  const runFullLifecycleMock = useCallback(async () => {
    const now = new Date().toISOString();
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    setMockRunStatus(null);
    setMockRunLoading(true);
    setStageActionError(null);

    try {
      // 1) PreStudy seed
      const pre = initPreStudy(topicId);
      const chunkTitlesFromTopic = (topic.content.keyPoints || [])
        .slice(0, 3)
        .map((line, index) => {
          const compact = line.split(/[.:]/)[0]?.trim();
          return compact && compact.length > 2 ? compact : `Core Chunk ${index + 1}`;
        });
      const chunkTitles = isAchalasiaDemoTopic
        ? [...ACHALASIA_DEMO_TEMPLATE.chunkTitles]
        : [
            chunkTitlesFromTopic[0] || "Clinical trigger pattern",
            chunkTitlesFromTopic[1] || "Diagnosis framework",
            chunkTitlesFromTopic[2] || "Management priorities",
          ];
      const seededChunks = pre.chunks.slice(0, 3).map((chunk, index) => ({
        ...chunk,
        title: chunkTitles[index],
        order: index + 1,
      }));

      const fallbackKeywords = [
        topic.name,
        `${topic.name} red flags`,
        `${topic.name} diagnosis`,
        `${topic.name} treatment`,
        "History pattern",
        "Examination focus",
        "Core investigations",
        "Differential diagnosis",
        "Immediate management",
        "Complication watchpoints",
      ];
      const seedKeywords = Array.from(
        new Set([
          ...(isAchalasiaDemoTopic ? ACHALASIA_DEMO_TEMPLATE.keywords : []),
          ...(topic.content.keyPoints || []),
          ...(topic.content.examPrep?.highYield || []),
          ...fallbackKeywords,
        ])
      )
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 2)
        .slice(0, 10);

      const seededPreStudy = {
        ...pre,
        updatedAt: now,
        skimNotes: isAchalasiaDemoTopic
          ? ACHALASIA_DEMO_TEMPLATE.skimNotes
          : `Mock run: structured skim for ${topic.name} with chunk-based revision map.`,
        chunks: seededChunks,
        keywords: seedKeywords.map((text, index) => ({
          id: `mock-kw-${index + 1}`,
          text,
          importance: (index < 3 ? "A" : index < 7 ? "B" : "C") as "A" | "B" | "C",
        })),
        assignments: seedKeywords.map((_, index) => ({
          keywordId: `mock-kw-${index + 1}`,
          chunkId: seededChunks[index % seededChunks.length].id,
        })),
        aimQuestions: seededChunks.map((chunk, index) => ({
          id: `mock-aim-seed-${index + 1}`,
          chunkId: chunk.id,
          text: `Why does ${chunk.title.toLowerCase()} matter in ${topic.name}?`,
        })),
      };
      upsertPreStudy(seededPreStudy);
      markPreStudyCompleted(seededPreStudy);

      const chunkIds = seededChunks.map((chunk) => chunk.id);

      // 2) Aim seed
      const questionTypes = [
        "why_important",
        "how_related",
        "management_change",
        "common_confusion",
        "viva_mcq",
        "viva_mcq",
      ] as const;
      const aim = initAim(topicId, chunkIds);
      const seededAim = {
        ...aim,
        updatedAt: now,
        chunkPlans: chunkIds.map((chunkId, chunkIndex) => ({
          chunkId,
          whyImportant: isAchalasiaDemoTopic
            ? ACHALASIA_DEMO_TEMPLATE.aimPlans[chunkIndex]?.whyImportant ||
              `This chunk anchors decision quality for ${topic.name}, especially under exam pressure.`
            : `This chunk anchors decision quality for ${topic.name}, especially under exam pressure.`,
          questions: questionTypes.map((type, questionIndex) => ({
            id: `mock-aim-${chunkIndex + 1}-${questionIndex + 1}`,
            chunkId,
            type,
            text: isAchalasiaDemoTopic
              ? ACHALASIA_DEMO_TEMPLATE.aimPlans[chunkIndex]?.questions[questionIndex] ||
                `Mock ${type.replace(/_/g, " ")} question ${questionIndex + 1} for chunk ${chunkIndex + 1}`
              : `Mock ${type.replace(/_/g, " ")} question ${questionIndex + 1} for chunk ${chunkIndex + 1}`,
          })),
        })),
      };
      upsertAim(seededAim);
      markAimCompleted(seededAim);

      // 3) Shoot seed (passes VPReFRE)
      const shoot = initShoot(topicId, chunkIds);
      const seededShoot = {
        ...shoot,
        updatedAt: now,
        artifacts: chunkIds.map((chunkId, chunkIndex) => ({
          chunkId,
          layered: {
            logic: isAchalasiaDemoTopic
              ? ACHALASIA_DEMO_TEMPLATE.shootArtifacts[chunkIndex]?.logic ||
                `Step 1: Build baseline reasoning for chunk ${chunkIndex + 1}\nStep 2: Link symptoms to mechanisms.`
              : `Step 1: Build baseline reasoning for chunk ${chunkIndex + 1}\nStep 2: Link symptoms to mechanisms.`,
            concepts: isAchalasiaDemoTopic
              ? ACHALASIA_DEMO_TEMPLATE.shootArtifacts[chunkIndex]?.concepts ||
                "Primary concept\nSecondary concept\nClinical implication"
              : "Primary concept\nSecondary concept\nClinical implication",
            importantDetails: isAchalasiaDemoTopic
              ? ACHALASIA_DEMO_TEMPLATE.shootArtifacts[chunkIndex]?.importantDetails ||
                "High-yield detail 1\nHigh-yield detail 2\nHigh-yield detail 3"
              : "High-yield detail 1\nHigh-yield detail 2\nHigh-yield detail 3",
            arbitraryDetails: isAchalasiaDemoTopic
              ? ACHALASIA_DEMO_TEMPLATE.shootArtifacts[chunkIndex]?.arbitraryDetails ||
                "Optional memory cue"
              : "Optional memory cue",
          },
          vprefre: {
            visual: true,
            processed: true,
            relational: true,
            freehand: true,
            reflective: true,
            efficient: true,
          },
          teachBackPrompts: isAchalasiaDemoTopic
            ? ACHALASIA_DEMO_TEMPLATE.shootArtifacts[chunkIndex]?.teachBack ||
              `Teach back chunk ${chunkIndex + 1} in under 60 seconds.`
            : `Teach back chunk ${chunkIndex + 1} in under 60 seconds.`,
          gapList: isAchalasiaDemoTopic
            ? ACHALASIA_DEMO_TEMPLATE.shootArtifacts[chunkIndex]?.gap ||
              "Minor gap: refine differential ordering."
            : "Minor gap: refine differential ordering.",
          completedAt: now,
        })),
      };
      upsertShoot(seededShoot);
      markShootCompleted(seededShoot);

      // 4) Skin seed (passes GRINDE)
      const skin = initSkin(topicId, chunkIds);
      const seededSkin = {
        ...skin,
        updatedAt: now,
        chunks: chunkIds.map((chunkId, chunkIndex) => ({
          chunkId,
          appliedTwoFourRule: true,
          grinde: {
            grouped: true,
            reflective: true,
            interconnected: true,
            nonVerbal: true,
            directional: true,
            emphasised: true,
          },
          teachBackGaps: isAchalasiaDemoTopic
            ? ACHALASIA_DEMO_TEMPLATE.skinTeachBackGaps[chunkIndex] ||
              `Review communication clarity for chunk ${chunkIndex + 1}.`
            : `Review communication clarity for chunk ${chunkIndex + 1}.`,
          completedAt: now,
        })),
      };
      upsertSkin(seededSkin);
      markSkinCompleted(seededSkin);

      // 5) Mindmap seed + finalize
      let mindMap = generateMindMapDraft(topicId, seededPreStudy);
      if (mindMap.nodes.length > 0) {
        mindMap = renameNode(mindMap, mindMap.nodes[0].id, `${mindMap.nodes[0].label} (core)`);
      }
      if (mindMap.nodes.length > 1) {
        mindMap = addEdge(
          mindMap,
          mindMap.nodes[0].id,
          mindMap.nodes[1].id,
          "leads_to",
          "core progression"
        );
      }
      if (mindMap.nodes.length > 2) {
        mindMap = addEdge(
          mindMap,
          mindMap.nodes[1].id,
          mindMap.nodes[2].id,
          "requires",
          "dependent concept"
        );
      }
      finalizeMindMap(mindMap);

      // Ensure lifecycle row/checkpoints are visible immediately in read model
      const learningTopic = await ensureLifecycleTopicRow();
      if (learningTopic) {
        await patchLearningTopic(learningTopic.id, {
          stage: "skin",
          status: "completed",
          completed_at: now,
        });
      }

      if (learningTopic?.id) {
        await Promise.all([
          createLearningCheckpoint({
            learning_topic_id: learningTopic.id,
            stage: "prestudy",
            checkpoint_code: "prestudy_mock_completion",
            passed: true,
            score: 95,
            details: {
              source: "mock_run",
              note: isAchalasiaDemoTopic ? "Prestudy achalasia template seeded" : "Prestudy mock seeded",
              chunk_titles: chunkTitles,
              keyword_focus: seedKeywords.slice(0, 4),
            },
          }),
          createLearningCheckpoint({
            learning_topic_id: learningTopic.id,
            stage: "aim",
            checkpoint_code: "aim_mock_completion",
            passed: true,
            score: 94,
            details: {
              source: "mock_run",
              note: isAchalasiaDemoTopic ? "Aim achalasia template seeded" : "Aim mock seeded",
              decision_focus: isAchalasiaDemoTopic
                ? "Subtype-aware procedure selection and pseudoachalasia exclusion"
                : "Chunk intent scaffolding",
            },
          }),
          createLearningCheckpoint({
            learning_topic_id: learningTopic.id,
            stage: "shoot",
            checkpoint_code: "shoot_vprefre_rubric_v1",
            passed: true,
            score: 92,
            details: {
              source: "mock_run",
              note: isAchalasiaDemoTopic ? "Shoot achalasia artifact template seeded" : "Shoot rubric pass mock",
              rubric_mode: "vprefre",
            },
          }),
          createLearningCheckpoint({
            learning_topic_id: learningTopic.id,
            stage: "skin",
            checkpoint_code: "skin_grinde_rubric_v1",
            passed: true,
            score: 93,
            details: {
              source: "mock_run",
              note: isAchalasiaDemoTopic ? "Skin achalasia reinforcement template seeded" : "Skin rubric pass mock",
              rubric_mode: "grinde",
            },
          }),
        ]);
      }

      // Allow debounced sync writes to flush before read-model refresh.
      await wait(1500);
      await refreshMethodData();
      await wait(1300);
      await refreshMethodData();

      setMockRunStatus({
        ok: true,
        message: isAchalasiaDemoTopic
          ? "Achalasia template run generated: all lifecycle stages are prefilled (PreStudy → Aim → Shoot → Skin → Mindmap)."
          : "Full mock lifecycle run generated: PreStudy → Aim → Shoot → Skin → Mindmap.",
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      setMockRunStatus({
        ok: false,
        message: `Mock run failed: ${reason}`,
      });
    } finally {
      setMockRunLoading(false);
    }
  }, [
    ensureLifecycleTopicRow,
    isAchalasiaDemoTopic,
    refreshMethodData,
    topic.content.examPrep?.highYield,
    topic.content.keyPoints,
    topic.name,
    topicId,
  ]);

  useEffect(() => {
    if (!shouldAutoRunDemo) return;
    if (autoRunTriggeredRef.current) return;
    autoRunTriggeredRef.current = true;
    void runFullLifecycleMock();
  }, [runFullLifecycleMock, shouldAutoRunDemo]);

  const stageDetails = useMemo<LearningMethodStageDetails>(() => {
    const headingLines = extractHeadings(topic.content.concept, 3, 8);
    const bulletLines = extractMarkdownBullets(topic.content.concept, 24);
    const keySignals = uniqueLines(
      [
        ...(topic.content.keyPoints || []),
        ...(topic.content.examPrep?.highYield || []),
        ...bulletLines,
      ],
      16
    );
    const headingFocus = headingLines.length > 0
      ? headingLines
      : uniqueLines([
          "Definition and core pathophysiology",
          "Diagnostic algorithm",
          "Subtype and treatment selection",
          "Complications and follow-up",
        ], 4);

    const linkFromSlug = (slug: string) => ({
      label: slug.replace(/-/g, " "),
      href: `/library/${subject.slug}/${subspecialty.slug}/${slug}`,
    });

    const prereqLinks = uniqueLines(topic.prerequisites || [], 4).map(linkFromSlug);
    const relatedLinks = uniqueLines(topic.relatedTopics || [], 6).map(linkFromSlug);

    const preAssignments = preStudySnapshot ? chunkCountById(preStudySnapshot.assignments) : {};
    const preKeywords = preStudySnapshot?.keywords || [];
    const preChunks = preStudySnapshot?.chunks || [];
    const preAKeywords = preKeywords.filter((keyword) => keyword.importance === "A").length;

    const aimChunkPlans = aimSnapshot?.chunkPlans || [];
    const aimWhyStatements = uniqueLines(
      aimChunkPlans.map((chunk) => chunk.whyImportant).filter((line) => line.trim().length > 0),
      3
    );
    const aimQuestions = uniqueLines(
      aimChunkPlans.flatMap((chunk) => chunk.questions.map((question) => question.text)),
      8
    );

    const shootArtifacts = shootSnapshot?.artifacts || [];
    const shootTeachBack = uniqueLines(
      shootArtifacts.map((artifact) => artifact.teachBackPrompts).filter((line) => line.trim().length > 0),
      4
    );
    const shootGaps = uniqueLines(
      shootArtifacts.map((artifact) => artifact.gapList).filter((line) => line.trim().length > 0),
      3
    );

    const skinChunks = skinSnapshot?.chunks || [];
    const skinGapLines = uniqueLines(
      skinChunks.map((chunk) => chunk.teachBackGaps).filter((line) => line.trim().length > 0),
      4
    );
    const skinTwoFourCount = skinChunks.filter((chunk) => chunk.appliedTwoFourRule).length;
    const skinGroupedCount = skinChunks.filter((chunk) => chunk.grinde.grouped).length;

    const mindMapNodes = mindMapSnapshot?.nodes || [];
    const mindMapEdges = mindMapSnapshot?.edges || [];
    const mindMapTopNodes = uniqueLines(mindMapNodes.map((node) => node.label), 6);

    const defaultAimQuestions = ACHALASIA_DEMO_TEMPLATE.aimPlans
      .flatMap((plan) => plan.questions)
      .slice(0, 8);

    const defaultShootLines = ACHALASIA_DEMO_TEMPLATE.shootArtifacts
      .map((artifact) => artifact.logic.split("\n")[0])
      .slice(0, 3);

    const preBlueprint = uniqueLines(
      [
        ...headingFocus.slice(0, 4).map((heading, index) => `Anchor ${index + 1}: ${heading}`),
        ...keySignals.slice(0, 6),
      ],
      10
    );

    return {
      prestudy: {
        focusLabel: "Preview + Chunking",
        principles: ICAN_GUIDELINES.prestudy,
        blueprint: preBlueprint,
        execution: uniqueLines(
          [
            "Create 3-4 chunks and keep each chunk title concept-level (not detail-heavy).",
            "Tag at least 3 A-priority keywords (exam-defining signals).",
            "Attach every keyword to a chunk so no orphan facts remain.",
            "Write one orienting skim note explaining the whole-topic story in < 60 words.",
          ],
          6
        ),
        metrics: [
          { label: "Keywords", value: `${preKeywords.length}/10` },
          { label: "A-priority", value: `${preAKeywords}/3` },
          { label: "Chunks", value: `${preChunks.length}/4` },
          {
            label: "Assignments",
            value: preChunks.length
              ? `${Object.values(preAssignments).filter((count) => count >= 3).length}/${preChunks.length} chunk-ready`
              : "0/0",
          },
        ],
        links: prereqLinks.length ? prereqLinks : relatedLinks.slice(0, 4),
      },
      aim: {
        focusLabel: "Why-Questions + Intent",
        principles: ICAN_GUIDELINES.aim,
        blueprint: uniqueLines(
          aimQuestions.length > 0 ? aimQuestions : defaultAimQuestions,
          10
        ),
        execution: uniqueLines(
          [
            ...(aimWhyStatements.length
              ? aimWhyStatements.map((line, index) => `Chunk rationale ${index + 1}: ${line}`)
              : [
                  "Chunk rationale 1: identify mechanism that changes differential diagnosis.",
                  "Chunk rationale 2: identify test interpretation that changes management pathway.",
                  "Chunk rationale 3: identify intervention trade-off and follow-up impact.",
                ]),
            "Ensure each chunk has at least one why-important statement plus 6 prompt questions.",
            "Mark one confusion question per chunk to force contrastive reasoning.",
          ],
          8
        ),
        metrics: [
          { label: "Chunk Plans", value: `${aimChunkPlans.length}` },
          {
            label: "Why Statements",
            value: `${aimChunkPlans.filter((chunk) => chunk.whyImportant.trim().length > 0).length}/${Math.max(aimChunkPlans.length, 1)}`,
          },
          {
            label: "Question Sets",
            value: `${aimChunkPlans.filter((chunk) => chunk.questions.length >= 6).length}/${Math.max(aimChunkPlans.length, 1)}`,
          },
        ],
        links: relatedLinks.slice(0, 4),
      },
      shoot: {
        focusLabel: "Layered Processing",
        principles: ICAN_GUIDELINES.shoot,
        blueprint: uniqueLines(
          shootArtifacts.length
            ? shootArtifacts.flatMap((artifact) => [
                artifact.layered.logic.split("\n")[0] || artifact.layered.logic,
                artifact.layered.concepts.split("\n")[0] || artifact.layered.concepts,
                artifact.layered.importantDetails.split("\n")[0] || artifact.layered.importantDetails,
              ])
            : defaultShootLines,
          10
        ),
        execution: uniqueLines(
          [
            ...(shootTeachBack.length
              ? shootTeachBack.map((line, index) => `Teach-back ${index + 1}: ${line}`)
              : ["Teach-back: explain subtype to intervention logic in under 60 seconds."]),
            ...(shootGaps.length
              ? shootGaps.map((line, index) => `Gap ${index + 1}: ${line}`)
              : ["Gap focus: pseudoachalasia exclusion criteria under time pressure."]),
            "VPReFRE checklist should be fully true before stage completion.",
          ],
          10
        ),
        metrics: [
          { label: "Artifacts", value: `${shootArtifacts.length}` },
          {
            label: "Teach-back",
            value: `${shootArtifacts.filter((artifact) => artifact.teachBackPrompts.trim().length > 0).length}/${Math.max(shootArtifacts.length, 1)}`,
          },
          {
            label: "Gap Notes",
            value: `${shootArtifacts.filter((artifact) => artifact.gapList.trim().length > 0).length}/${Math.max(shootArtifacts.length, 1)}`,
          },
        ],
        links: relatedLinks.slice(0, 5),
      },
      skin: {
        focusLabel: "Retrieval + Refinement",
        principles: ICAN_GUIDELINES.skin,
        blueprint: uniqueLines(
          [
            "Spacing cadence: 1 day -> 1 week -> 1 month.",
            "Interleave viva, MCQ stems, and case prompts in the same review block.",
            ...(skinGapLines.length
              ? skinGapLines
              : ACHALASIA_DEMO_TEMPLATE.skinTeachBackGaps),
          ],
          10
        ),
        execution: uniqueLines(
          [
            "Use GRINDE pass to tighten grouping and directional logic before finalization.",
            "Record one micro-gap after each retrieval cycle; fix it in the next cycle.",
            "Run a two-minute oral handoff: diagnosis path, subtype, intervention, follow-up.",
            "Escalate weak points into targeted quiz/case mode rounds.",
          ],
          8
        ),
        metrics: [
          { label: "Skin Chunks", value: `${skinChunks.length}` },
          { label: "2-4 Rule", value: `${skinTwoFourCount}/${Math.max(skinChunks.length, 1)}` },
          { label: "GRINDE Grouped", value: `${skinGroupedCount}/${Math.max(skinChunks.length, 1)}` },
        ],
        links: relatedLinks.slice(1, 6),
      },
      mindmap: {
        focusLabel: "Synthesis Graph",
        principles: ICAN_GUIDELINES.mindmap,
        blueprint: uniqueLines(
          [
            ...(mindMapTopNodes.length > 0
              ? mindMapTopNodes
              : [
                  "Neuron loss -> LES non-relaxation -> dysphagia + regurgitation",
                  "Endoscopy + barium + HRM -> subtype classification",
                  "Subtype + patient profile -> PD vs LHM+fundoplication vs POEM",
                  "Post-procedure reflux risk -> long-term surveillance",
                ]),
          ],
          10
        ),
        execution: uniqueLines(
          [
            "Add at least one causal edge and one differential edge per core node cluster.",
            "Compress repeated nodes into one shared concept node.",
            "Finalize map only after minimum edit threshold and retrieval validation.",
            "Use linked topics to expand edge cases and decision boundaries.",
          ],
          8
        ),
        metrics: [
          { label: "Nodes", value: `${mindMapNodes.length}` },
          { label: "Edges", value: `${mindMapEdges.length}` },
          { label: "Status", value: mindMapSnapshot?.status || "not_started" },
        ],
        links: relatedLinks.slice(0, 6),
      },
    };
  }, [
    aimSnapshot,
    mindMapSnapshot,
    preStudySnapshot,
    shootSnapshot,
    skinSnapshot,
    subject.slug,
    subspecialty.slug,
    topic.content.concept,
    topic.content.examPrep?.highYield,
    topic.content.keyPoints,
    topic.prerequisites,
    topic.relatedTopics,
  ]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Link href="/library" className="text-[#A0B0BC] hover:text-[#5BB3B3]">Library</Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <Link href={`/library/${subject.slug}`} className="text-[#A0B0BC] hover:text-[#5BB3B3]">
          {subject.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <Link href={`/library/${subject.slug}/${subspecialty.slug}`} className="text-[#A0B0BC] hover:text-[#5BB3B3]">
          {subspecialty.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        <span className="text-[#E8E0D5]">{topic.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={`/library/${subject.slug}/${subspecialty.slug}?mode=${viewMode}`}
            className="p-2 rounded-lg bg-[#364A5E] hover:bg-[rgba(91,179,179,0.1)] transition-colors mt-1"
          >
            <ArrowLeft className="w-5 h-5 text-[#A0B0BC]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E8E0D5]">{topic.name}</h1>
            {topic.description && (
              <p className="text-[#A0B0BC] mt-1">{topic.description}</p>
            )}
            {topic.nmcCodes && topic.nmcCodes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] mr-1">NMC</span>
                {topic.nmcCodes.map((nmc) => {
                  const domainColors: Record<string, string> = {
                    K: 'bg-[rgba(232,224,213,0.12)] text-[#A0B0BC] border-[rgba(232,224,213,0.25)]',
                    KH: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
                    SH: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
                    P: 'bg-[#C9A86C]/15 text-[#C9A86C] border-[#C9A86C]/25',
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

      <Card className="bg-[#3A4D61]/55 border-[rgba(201,168,108,0.35)] shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#C9A86C]/18 text-[#E4C590] border-[#C9A86C]/40">
                  Lifecycle Demo Template
                </Badge>
                {isAchalasiaDemoTopic && (
                  <Badge className="bg-[#5BB3B3]/18 text-[#9FC3BC] border-[#5BB3B3]/35">Achalasia</Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-[#E8E0D5]">
                {isAchalasiaDemoTopic
                  ? "Run one-click prefilled lifecycle data for a full Achalasia walkthrough: PreStudy, Aim, Shoot, Skin, and Mindmap."
                  : "Open the Achalasia demo topic for a complete prefilled lifecycle walkthrough."}
              </p>
              <p className="text-xs text-[#A0B0BC] mt-1">
                Prefilled artifacts include chunk map, intent questions, VPReFRE/GRINDE rubric-ready entries, and checkpoint trail.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isAchalasiaDemoTopic ? (
                <Button
                  onClick={() => {
                    void runFullLifecycleMock();
                  }}
                  disabled={mockRunLoading}
                  className="bg-[#C9A86C]/22 text-[#E8E0D5] border border-[#C9A86C]/45 hover:bg-[#C9A86C]/34"
                >
                  {mockRunLoading ? "Generating Achalasia Demo..." : "Run Achalasia Demo Lifecycle"}
                </Button>
              ) : (
                <Button asChild className="bg-[#C9A86C]/22 text-[#E8E0D5] border border-[#C9A86C]/45 hover:bg-[#C9A86C]/34">
                  <Link href={ACHALASIA_DEMO_ROUTE}>Open Achalasia Demo Topic</Link>
                </Button>
              )}
            </div>
          </div>
          {isAchalasiaDemoTopic && (
            <div className="mt-3 grid gap-2 text-xs text-[#A0B0BC] sm:grid-cols-3">
              <div className="rounded-md border border-[rgba(201,168,108,0.22)] bg-[#22364B]/60 px-3 py-2">
                PreStudy: symptom-pattern keyword map + chunk assignment
              </div>
              <div className="rounded-md border border-[rgba(201,168,108,0.22)] bg-[#22364B]/60 px-3 py-2">
                Aim + Shoot: subtype logic, procedure matrix, and teach-back artifacts
              </div>
              <div className="rounded-md border border-[rgba(201,168,108,0.22)] bg-[#22364B]/60 px-3 py-2">
                Skin + Mindmap: reinforced recall gaps + finalized concept graph
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <LearningMethodRail
        progress={methodProgress}
        onOpenStage={openLearningStage}
        onRefresh={() => void refreshMethodData()}
        onRunMockLifecycle={() => {
          void runFullLifecycleMock();
        }}
        mockRunLoading={mockRunLoading}
        mockRunStatus={mockRunStatus}
        currentStage={lifecycleTopic?.stage ?? null}
        topicStatus={lifecycleTopic?.status ?? null}
        stageDetails={stageDetails}
        checkpoints={latestCheckpoints}
        checkpointHistory={checkpointHistory}
        actionLoadingStage={stageActionLoading}
        stageActionError={stageActionError}
        onStageAction={handleStageAction}
      />

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
                    ? "bg-[#5BB3B3] text-[#2D3E50]"
                    : "bg-[#364A5E] text-[#A0B0BC] hover:text-[#E8E0D5] hover:bg-[rgba(91,179,179,0.1)]"
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
            "shrink-0 border-[rgba(91,179,179,0.2)]",
            bionicReader
              ? "bg-[rgba(91,179,179,0.12)] text-[#E8E0D5]"
              : "text-[#A0B0BC]"
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
      <Card className="bg-[#364A5E] border-[rgba(91,179,179,0.1)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-[#E8E0D5] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C9A86C]" /> Your Notes
              <Badge className="bg-[#2D3E50] text-[#A0B0BC]">{topicId}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotes(getNotesForTopic(topicId, 20))}
              className="text-[#A0B0BC] border-[rgba(91,179,179,0.2)]"
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
              className="bg-[#2D3E50] border-[rgba(91,179,179,0.2)] text-[#E8E0D5]"
            />
            <Textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Write your note for this topic… (this becomes part of your pocket of knowledge)"
              className="min-h-[120px] bg-[#2D3E50] border-[rgba(91,179,179,0.2)] text-[#E8E0D5]"
            />
            <div className="flex justify-end">
              <Button onClick={saveNote} className="bg-[#C9A86C] hover:bg-[#B89252] text-[#2D3E50]">
                Save note
              </Button>
            </div>
          </div>

          {notes.length ? (
            <div className="space-y-2 pt-2">
              <div className="text-sm text-[#A0B0BC]">Recent notes</div>
              {notes.map((n) => (
                <div key={n.id} className="rounded-lg border border-[rgba(91,179,179,0.12)] bg-[#2D3E50] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[#E8E0D5]">{n.title}</div>
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
