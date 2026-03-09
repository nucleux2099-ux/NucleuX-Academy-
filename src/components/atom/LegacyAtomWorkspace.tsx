"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ATOM_SOURCE_CATALOG,
  ATOM_SOURCE_LEVELS,
  ATOM_PRESET_LABELS,
  type AtomSourceCatalogItem,
  type AtomSourcePreset,
} from "@/lib/atom/source-catalog";
import type { AtomTaskStatus, AtomEventType } from "@/lib/atom/types";
import { extractCodeBlocks } from "@/components/chat/CanvasPanel";
import { MedicalMarkdown } from "@/components/MedicalMarkdown";
import { QUICK_START_LEVELS, type QuickStartLevel } from "@/lib/atom/quick-start-schema";
import { isAtomV3GddEnabled, isFeatureEnabled } from "@/lib/features/flags";
import { appendDedupedUserEvent } from "@/components/atom/chatEventDedup";

import {
  ATOM_ROOM_PROFILES,
  applyRoomDefaults,
  resolveAtomRoomProfile,
  type AtomRoomId,
  type AtomWorkspaceMode,
} from "@/lib/atom/room-profiles";
import {
  BookOpen,
  CircleStop,
  Play,
  GitBranch,
  RotateCcw,
  FlaskConical,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Activity,
  Lock,
  Paperclip,
  SendHorizontal,
} from "lucide-react";

type TimelineItem = {
  id: string;
  type: AtomEventType | "mode.launch" | "gdd.session" | "gdd.advance";
  ts: string;
  label: string;
  detail?: string;
};

type ArtifactItem = {
  id: string;
  title: string;
  kind: string;
  content?: string;
  createdAt: string;
};

const MODE_LABELS: Record<AtomWorkspaceMode, string> = {
  chat: "Chat",
  mcq: "MCQ",
  flashcards: "Flashcards",
  ppt: "PPT",
  "nucleux-original": "NucleuX Original",
  "guided-deep-dive": "Guided Deep Dive",
};

const STATUS_STYLES: Record<AtomTaskStatus, string> = {
  queued: "bg-slate-500/20 text-slate-200 border-slate-400/40",
  running: "bg-cyan-500/20 text-cyan-200 border-cyan-400/40",
  needs_input: "bg-amber-500/20 text-amber-100 border-amber-300/40",
  completed: "bg-emerald-500/20 text-emerald-100 border-emerald-300/40",
  failed: "bg-rose-500/20 text-rose-100 border-rose-300/40",
  cancelled: "bg-zinc-500/20 text-zinc-200 border-zinc-300/40",
};

const WORKFLOW_PRESETS: Array<{ label: string; mode: AtomWorkspaceMode; prompt: string }> = [
  {
    label: "Generate MCQs",
    mode: "mcq",
    prompt: "Generate high-yield MCQs with explanations and common traps for this topic.",
  },
  {
    label: "Build PPT",
    mode: "ppt",
    prompt: "Create a concise teaching deck outline with slide-wise key points and clinical pearls.",
  },
  {
    label: "NucleuX Original Deep Research",
    mode: "nucleux-original",
    prompt: "Perform deep synthesis from selected sources and provide a structured expert brief.",
  },
  {
    label: "Guided Deep Dive",
    mode: "guided-deep-dive",
    prompt: "Start a guided deep dive session for this topic using progressive questioning.",
  },
  {
    label: "Analyze attached table/file",
    mode: "chat",
    prompt: "Analyze the attached file/table and extract clinically relevant insights, patterns, and next actions.",
  },
  {
    label: "Convert to flashcards",
    mode: "flashcards",
    prompt: "Convert this topic into high-retention flashcards with crisp Q/A phrasing and memory cues.",
  },
];

function safeString(val: unknown): string | undefined {
  return typeof val === "string" && val.trim() ? val : undefined;
}

function formatEvent(type: AtomEventType, payload: Record<string, unknown>): Pick<TimelineItem, "label" | "detail"> {
  if (type === "phase.started") return { label: `Started ${safeString(payload.phase) ?? "phase"}` };
  if (type === "phase.completed") return { label: `Completed ${safeString(payload.phase) ?? "phase"}`, detail: safeString(payload.summary) };
  if (type === "tool.started") return { label: `Tool started: ${safeString(payload.tool) ?? "tool"}` };
  if (type === "tool.output") return { label: `Tool output: ${safeString(payload.tool) ?? "tool"}`, detail: safeString(payload.preview) ?? safeString(payload.output) };
  if (type === "tool.completed") return { label: `Tool finished: ${safeString(payload.tool) ?? "tool"}` };
  if (type === "tool.failed") return { label: `Tool failed: ${safeString(payload.tool) ?? "tool"}`, detail: safeString(payload.error_message) ?? "No details" };
  if (type === "assistant.delta") return { label: "Assistant update", detail: safeString(payload.text) };
  if (type === "task.failed") return { label: "Task failed", detail: safeString(payload.error_message) ?? "Unexpected failure" };
  if (type === "task.completed") return { label: "Task completed", detail: safeString(payload.message) };
  if (type === "task.needs_input") return { label: "Task needs input", detail: safeString(payload.message) };
  if (type === "task.cancelled") return { label: "Task stopped", detail: safeString(payload.reason) };
  return { label: type, detail: safeString(payload.message) };
}

export default function AtomWorkspacePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOutputsOpen, setIsOutputsOpen] = useState(false);
  const [mode, setMode] = useState<AtomWorkspaceMode>("chat");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [selectedWorkflowPreset, setSelectedWorkflowPreset] = useState("");
  const [composerAttachment, setComposerAttachment] = useState<{ name: string } | null>(null);
  const [topic, setTopic] = useState("General Surgery high-yield revision");
  const [level, setLevel] = useState<QuickStartLevel>("resident");
  const [timeAvailable, setTimeAvailable] = useState("25");
  const [goal, setGoal] = useState("Build exam-ready recall with concise, practical output");
  const [selectedRoomId, setSelectedRoomId] = useState<AtomRoomId>("atom");
  const [manualOverrides, setManualOverrides] = useState<Partial<Record<"topic" | "level" | "timeAvailable" | "goal", boolean>>>({});

  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<AtomTaskStatus>("queued");
  const [assistantText, setAssistantText] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [errorCard, setErrorCard] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHydratingSession, setIsHydratingSession] = useState(false);

  const [gddSessionId, setGddSessionId] = useState<string | null>(null);
  const [gddLoadId, setGddLoadId] = useState("");
  const [gddAccuracyPct, setGddAccuracyPct] = useState("70");
  const [gddHintCount, setGddHintCount] = useState("1");
  const [gddAvgResponseSec, setGddAvgResponseSec] = useState("35");
  const [gddConfidenceSelf, setGddConfidenceSelf] = useState("65");
  const [gddWeakConcepts, setGddWeakConcepts] = useState("");

  const [sourceCatalog, setSourceCatalog] = useState<AtomSourceCatalogItem[]>(ATOM_SOURCE_CATALOG);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(ATOM_SOURCE_CATALOG.slice(0, 3).map((book) => book.id));
  const [selectedPreset, setSelectedPreset] = useState<AtomSourcePreset | null>("clinical-deep-dive");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [showPendingSources, setShowPendingSources] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const gddEnabled = isAtomV3GddEnabled();
  const trackAEnabled = isFeatureEnabled("trackADeepResearchScaffold");
  const ux2ComposerEnabled = isFeatureEnabled("atomUx2ComposerRevamp");
  const activeRoomProfile = useMemo(() => resolveAtomRoomProfile(selectedRoomId), [selectedRoomId]);

  const sharedContext = useMemo(() => ({
    roomId: selectedRoomId,
    roomProfile: activeRoomProfile,
    topic,
    level,
    timeAvailable,
    goal,
    sourceSelection: {
      preset: selectedPreset,
      bookIds: selectedBookIds,
      levelFilter,
      domainFilter,
      showPendingSources,
      taskId,
      sessionId: gddSessionId,
    },
    taskId,
    sessionId: gddSessionId,
  }), [
    activeRoomProfile,
    domainFilter,
    gddSessionId,
    goal,
    level,
    levelFilter,
    selectedBookIds,
    selectedPreset,
    selectedRoomId,
    showPendingSources,
    taskId,
    timeAvailable,
    topic,
  ]);

  const domains = useMemo(() => ["all", ...Array.from(new Set(sourceCatalog.map((book) => book.domain)))], [sourceCatalog]);

  const filteredBooks = useMemo(
    () =>
      sourceCatalog.filter((book) => {
        if (levelFilter !== "all" && !book.levelTags.includes(levelFilter as (typeof ATOM_SOURCE_LEVELS)[number])) return false;
        if (domainFilter !== "all" && book.domain !== domainFilter) return false;
        if (!showPendingSources && book.availabilityStatus && book.availabilityStatus !== "indexed_ready") return false;
        return true;
      }),
    [domainFilter, levelFilter, showPendingSources, sourceCatalog],
  );

  const groupedBooks = useMemo(() => {
    return ATOM_SOURCE_LEVELS.map((levelTag) => ({
      level: levelTag,
      items: filteredBooks.filter((book) => book.levelTags.includes(levelTag)),
    })).filter((group) => group.items.length > 0);
  }, [filteredBooks]);

  const parsedArtifactsFromAssistant = useMemo(() => {
    const assistantMessages = chatHistory
      .map((message, index) => ({ message, index }))
      .filter(({ message }) => message.role === 'assistant' && message.content.trim().length > 0)
      .map(({ message, index }) => ({ id: `assistant-${index}`, role: 'assistant' as const, content: message.content, timestamp: new Date() }));

    return extractCodeBlocks(assistantMessages).map((block) => ({
      id: `code-${block.id}`,
      title: `${block.language.toUpperCase()} snippet`,
      kind: block.language,
      content: block.code,
      createdAt: new Date().toISOString(),
    } satisfies ArtifactItem));
  }, [chatHistory]);

  const mergedArtifacts = useMemo(() => {
    const map = new Map<string, ArtifactItem>();
    for (const artifact of [...artifacts, ...parsedArtifactsFromAssistant]) {
      map.set(artifact.id, artifact);
    }
    return Array.from(map.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [artifacts, parsedArtifactsFromAssistant]);

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const pushTimeline = useCallback((type: TimelineItem["type"], label: string, detail?: string) => {
    setTimeline((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        ts: new Date().toISOString(),
        label,
        detail,
      },
    ]);
  }, []);

  const pushArtifact = useCallback((title: string, kind: string, content?: string) => {
    setArtifacts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        kind,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => () => closeEventStream(), []);

  useEffect(() => {
    let active = true;

    const loadSources = async () => {
      setSourcesLoading(true);
      setSourcesError(null);
      try {
        const response = await fetch(`/api/atom/sources?include_pending=${showPendingSources ? 'true' : 'false'}`);
        if (!response.ok) {
          throw new Error('Could not load source library');
        }

        const payload = (await response.json()) as {
          sources?: Array<{
            id: string;
            title: string;
            short_title: string;
            domain: string;
            level_tags: string[];
            priority: number;
            enabled: boolean;
            sort_order: number;
            availability_status?: "indexed_ready" | "md_ready_not_ingested" | "pdf_only" | "missing" | null;
            availability_disabled_reason?: string | null;
            chapter_count?: number | null;
            chunk_count?: number | null;
            last_synced_at?: string | null;
            metadata?: Record<string, unknown>;
          }>;
        };

        if (!active) return;
        const normalized = (payload.sources ?? []).map((source) => ({
          id: source.id,
          title: source.title,
          shortTitle: source.short_title,
          domain: source.domain,
          levelTags: (source.level_tags ?? []).filter((tag): tag is (typeof ATOM_SOURCE_LEVELS)[number] =>
            ATOM_SOURCE_LEVELS.includes(tag as (typeof ATOM_SOURCE_LEVELS)[number]),
          ),
          priority: source.priority,
          enabled: source.enabled,
          sortOrder: source.sort_order,
          availabilityStatus: source.availability_status ?? undefined,
          availabilityDisabledReason: source.availability_disabled_reason ?? null,
          chapterCount: source.chapter_count ?? null,
          chunkCount: source.chunk_count ?? null,
          lastSyncedAt: source.last_synced_at ?? null,
          metadata: source.metadata ?? {},
        }));

        if (normalized.length > 0) {
          setSourceCatalog(normalized);
          const selectable = normalized.filter((s) => !s.availabilityStatus || s.availabilityStatus === "indexed_ready");
          setSelectedBookIds((prev) => {
            const nextFromPrev = prev.filter((id) => selectable.some((s) => s.id === id));
            return nextFromPrev.length > 0 ? nextFromPrev : selectable.slice(0, 3).map((s) => s.id);
          });
        }
      } catch {
        if (!active) return;
        setSourceCatalog(ATOM_SOURCE_CATALOG);
        setSourcesError('Using fallback source list (catalog API unavailable).');
      } finally {
        if (active) setSourcesLoading(false);
      }
    };

    void loadSources();

    return () => {
      active = false;
    };
  }, [showPendingSources]);

  const connectEvents = useCallback((id: string, eventsUrl: string) => {
    closeEventStream();
    const es = new EventSource(eventsUrl);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const envelope = JSON.parse(event.data) as {
          eventId: number;
          type: AtomEventType;
          ts: string;
          payload: Record<string, unknown>;
        };

        const formatted = formatEvent(envelope.type, envelope.payload);
        setTimeline((prev) => [
          ...prev,
          {
            id: `${envelope.eventId}`,
            type: envelope.type,
            ts: envelope.ts,
            label: formatted.label,
            detail: formatted.detail,
          },
        ]);

        if (envelope.type === "assistant.delta") {
          const delta = safeString(envelope.payload.text);
          if (delta) setAssistantText((prev) => `${prev}${delta}`);
        }

        if (envelope.type === "artifact.created" || envelope.type === "artifact.updated") {
          const artifactId = safeString(envelope.payload.artifact_id) ?? crypto.randomUUID();
          setArtifacts((prev) => {
            const next = prev.filter((a) => a.id !== artifactId);
            next.push({
              id: artifactId,
              title: safeString(envelope.payload.title) ?? "Artifact",
              kind: safeString(envelope.payload.kind) ?? "output",
              content: safeString(envelope.payload.content),
              createdAt: envelope.ts,
            });
            return next;
          });
        }

        if (envelope.type === "task.started") setStatus("running");
        if (envelope.type === "task.needs_input") setStatus("needs_input");
        if (envelope.type === "task.completed") {
          setStatus("completed");
          closeEventStream();
        }
        if (envelope.type === "task.cancelled") {
          setStatus("cancelled");
          closeEventStream();
        }
        if (envelope.type === "task.failed") {
          setStatus("failed");
          setErrorCard(formatted.detail ?? "Task failed unexpectedly.");
          closeEventStream();
        }
      } catch {
        setErrorCard("Could not parse one of the live updates. Please retry task.");
      }
    };

    es.onerror = async () => {
      if (["completed", "failed", "cancelled"].includes(status)) return;
      try {
        const response = await fetch(`/api/atom/tasks/${id}`);
        if (response.ok) {
          const snapshot = (await response.json()) as {
            task?: { status?: AtomTaskStatus; error_message?: string | null };
            latestAssistantText?: string | null;
          };
          if (snapshot.task?.status) setStatus(snapshot.task.status);
          if (snapshot.latestAssistantText) setAssistantText(snapshot.latestAssistantText);
          if (snapshot.task?.status === "failed") {
            setErrorCard(snapshot.task.error_message ?? "Task failed unexpectedly.");
          }
          if (["completed", "failed", "cancelled"].includes(snapshot.task?.status ?? "")) {
            closeEventStream();
          }
        }
      } catch {
        setErrorCard("Live connection dropped. Use retry/continue to resume.");
      }
    };
  }, [status]);

  const handleRoomChange = useCallback((nextRoomId: AtomRoomId) => {
    const room = resolveAtomRoomProfile(nextRoomId);
    const nextContext = applyRoomDefaults(
      { topic, level, timeAvailable, goal, mode },
      room,
      manualOverrides,
    );

    setSelectedRoomId(nextRoomId);
    setTopic(nextContext.topic);
    setLevel(nextContext.level);
    setTimeAvailable(nextContext.timeAvailable);
    setGoal(nextContext.goal);
    setMode(nextContext.mode);

    if (!manualOverrides.topic && !manualOverrides.goal && !manualOverrides.level && !manualOverrides.timeAvailable) {
      setSelectedPreset(room.sourcePreset);
    }
  }, [goal, level, manualOverrides, mode, timeAvailable, topic]);

  const startTask = useCallback(async () => {
    if (!taskPrompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setErrorCard(null);
    setStatus("running");

    const userText = taskPrompt.trim();
    const userEvent = {
      id: crypto.randomUUID(),
      type: 'assistant.delta' as const,
      ts: new Date().toISOString(),
      label: 'You',
      detail: userText,
    };
    setTaskPrompt('');
    setTimeline((prev) => appendDedupedUserEvent(prev, userEvent));
    setChatHistory((prev) => [...prev, { role: 'user', content: userText }]);

    try {
      let sessionId = activeSessionId;

      if (!sessionId) {
        const startRes = await fetch('/api/atom/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: selectedRoomId,
            selectedBookIds,
            channel: 'web',
          }),
        });
        const startJson = (await startRes.json()) as { sessionId?: string; error?: string };
        if (!startRes.ok || !startJson.sessionId) {
          throw new Error(startJson.error ?? 'Unable to start session');
        }
        sessionId = startJson.sessionId;
      }

      setActiveSessionId(sessionId);

      const continueLike = /^(continue|go on|carry on|next|more|proceed)\b/i.test(userText);
      const hasPriorAssistant = chatHistory.some((item) => item.role === 'assistant' && item.content.trim().length > 0);
      const endpoint = continueLike && hasPriorAssistant
        ? `/api/atom/session/${sessionId}/continue`
        : `/api/atom/session/${sessionId}/message`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: domainFilter === 'all' ? 'surgery' : domainFilter,
          message: userText,
        }),
      });

      const json = (await response.json()) as { assistant?: string; error?: string; artifacts?: ArtifactItem[] };
      if (!response.ok || !json.assistant) {
        throw new Error(json.error ?? 'Chat request failed');
      }

      setAssistantText(json.assistant);
      setChatHistory((prev) => [...prev, { role: 'assistant', content: json.assistant ?? '' }]);
      const artifactsFromResponse = Array.isArray(json.artifacts) ? json.artifacts : [];
      if (artifactsFromResponse.length > 0) {
        setArtifacts((prev) => {
          const map = new Map(prev.map((artifact) => [artifact.id, artifact]));
          for (const artifact of artifactsFromResponse) {
            map.set(artifact.id, { ...artifact, createdAt: artifact.createdAt ?? new Date().toISOString() });
          }
          return Array.from(map.values());
        });
      }
      setStatus('completed');
    } catch (error) {
      setStatus('failed');
      setErrorCard(error instanceof Error ? error.message : 'Failed to send chat');
    } finally {
      setIsSubmitting(false);
    }
  }, [activeSessionId, chatHistory, domainFilter, isSubmitting, selectedBookIds, selectedRoomId, taskPrompt]);

  const launchMode = useCallback(async (launchMode: AtomWorkspaceMode) => {
    if (launchMode === "chat") {
      await startTask();
      return;
    }

    if (launchMode === "guided-deep-dive") {
      return;
    }

    setIsSubmitting(true);
    setErrorCard(null);
    setAssistantText("");
    setTimeline([]);
    setArtifacts([]);

    try {
      const response = await fetch("/api/atom-v3/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: launchMode,
          topic: sharedContext.topic,
          level: sharedContext.level,
          timeAvailable: Number(sharedContext.timeAvailable) || 25,
          goal: sharedContext.goal,
          roomId: sharedContext.roomId,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        workflow?: string;
        launchPath?: string;
        taskId?: string;
        eventsUrl?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to launch mode");
      }

      pushTimeline("mode.launch", `${MODE_LABELS[launchMode]} launched`, data.message ?? undefined);
      pushArtifact(`${MODE_LABELS[launchMode]} output`, data.workflow ?? launchMode, [
        data.message,
        data.launchPath ? `Launch path: ${data.launchPath}` : undefined,
      ].filter(Boolean).join("\n"));

      if (data.taskId && data.eventsUrl) {
        setTaskId(data.taskId);
        setStatus("running");
        connectEvents(data.taskId, data.eventsUrl);
      } else {
        setStatus("completed");
      }
    } catch (error) {
      setStatus("failed");
      setErrorCard(error instanceof Error ? error.message : "Mode launch failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [connectEvents, pushArtifact, pushTimeline, sharedContext, startTask]);

  const startGuidedDeepDive = useCallback(async () => {
    setIsSubmitting(true);
    setErrorCard(null);
    setAssistantText("");
    setTimeline([]);
    setArtifacts([]);

    try {
      const response = await fetch("/api/atom-v3/gdd/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: sharedContext.topic, level: sharedContext.level, goal: sharedContext.goal }),
      });

      const data = (await response.json()) as {
        error?: string;
        session?: { sessionId: string; status: string; currentStep: string; weakConcepts?: string[] };
      };

      if (!response.ok || !data.session) {
        throw new Error(data.error ?? "Failed to start guided deep dive");
      }

      setGddSessionId(data.session.sessionId);
      setGddLoadId(data.session.sessionId);
      setStatus("running");
      pushTimeline("gdd.session", "Guided Deep Dive session started", `Session ${data.session.sessionId.slice(0, 8)} · Step: ${data.session.currentStep}`);
      pushArtifact("GDD Session", "guided-deep-dive", JSON.stringify(data.session, null, 2));
    } catch (error) {
      setStatus("failed");
      setErrorCard(error instanceof Error ? error.message : "Failed to start GDD session");
    } finally {
      setIsSubmitting(false);
    }
  }, [pushArtifact, pushTimeline, sharedContext.goal, sharedContext.level, sharedContext.topic]);

  const loadGuidedDeepDive = useCallback(async () => {
    if (!gddLoadId.trim()) return;

    setIsSubmitting(true);
    setErrorCard(null);
    try {
      const response = await fetch(`/api/atom-v3/gdd/${gddLoadId.trim()}`);
      const data = (await response.json()) as {
        error?: string;
        session?: { sessionId: string; status: string; currentStep: string; weakConcepts?: string[] };
      };

      if (!response.ok || !data.session) {
        throw new Error(data.error ?? "Failed to load session");
      }

      setGddSessionId(data.session.sessionId);
      setStatus("running");
      pushTimeline("gdd.session", "Guided Deep Dive session loaded", `Session ${data.session.sessionId.slice(0, 8)} · Step: ${data.session.currentStep}`);
      pushArtifact("GDD Session Loaded", "guided-deep-dive", JSON.stringify(data.session, null, 2));
    } catch (error) {
      setErrorCard(error instanceof Error ? error.message : "Failed to load GDD session");
    } finally {
      setIsSubmitting(false);
    }
  }, [gddLoadId, pushArtifact, pushTimeline]);

  const advanceGuidedDeepDive = useCallback(async () => {
    if (!gddSessionId) return;
    setIsSubmitting(true);
    setErrorCard(null);

    try {
      const response = await fetch(`/api/atom-v3/gdd/${gddSessionId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accuracyPct: Number(gddAccuracyPct) || 0,
          hintCount: Number(gddHintCount) || 0,
          avgResponseSec: Number(gddAvgResponseSec) || 0,
          confidenceSelf: Number(gddConfidenceSelf) || 0,
          weakConcepts: gddWeakConcepts
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        session?: { sessionId: string; status: string; currentStep: string; weakConcepts?: string[] };
      };

      if (!response.ok || !data.session) {
        throw new Error(data.error ?? "Failed to advance session");
      }

      setStatus(data.session.status === "completed" ? "completed" : "running");
      pushTimeline("gdd.advance", "Guided Deep Dive advanced", `Step: ${data.session.currentStep} · Status: ${data.session.status}`);
      pushArtifact("GDD Step Update", "guided-deep-dive", JSON.stringify(data.session, null, 2));
    } catch (error) {
      setErrorCard(error instanceof Error ? error.message : "Failed to advance GDD");
    } finally {
      setIsSubmitting(false);
    }
  }, [gddAccuracyPct, gddAvgResponseSec, gddConfidenceSelf, gddHintCount, gddSessionId, gddWeakConcepts, pushArtifact, pushTimeline]);

  const controlTask = useCallback(async (action: "stop" | "retry" | "continue" | "branch") => {
    if (!taskId) return;
    setErrorCard(null);
    if (action === "retry" || action === "continue") {
      setAssistantText("");
      setTimeline([]);
      setArtifacts([]);
    }

    try {
      const response = await fetch(`/api/atom/tasks/${taskId}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json()) as { error?: string; status?: AtomTaskStatus; note?: string };
      if (!response.ok) throw new Error(data.error ?? `Failed to ${action}`);

      if (data.status) setStatus(data.status);
      if (action === "branch") {
        setErrorCard(data.note ? `${data.note} (branching is scaffold-only in this phase)` : "Branching is scaffold-only in this phase.");
      }
      if (action === "retry" || action === "continue") {
        connectEvents(taskId, `/api/atom/tasks/${taskId}/events`);
      }
    } catch (error) {
      setErrorCard(error instanceof Error ? error.message : `Failed to ${action}`);
    }
  }, [connectEvents, taskId]);

  const toggleBook = (bookId: string) => {
    setSelectedBookIds((prev) => (prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]));
  };

  const applyWorkflowPreset = (presetLabel: string) => {
    setSelectedWorkflowPreset(presetLabel);
    const selected = WORKFLOW_PRESETS.find((preset) => preset.label === presetLabel);
    if (!selected) return;
    setMode(selected.mode);
    setTaskPrompt(selected.prompt);
  };

  const downloadArtifact = useCallback((artifact: ArtifactItem) => {
    if (typeof window === 'undefined' || !artifact.content) return;
    const lowerKind = artifact.kind.toLowerCase();
    const extension = lowerKind.includes('json')
      ? 'json'
      : lowerKind.includes('markdown') || lowerKind === 'md'
        ? 'md'
        : 'txt';

    const blob = new Blob([artifact.content], { type: extension === 'json' ? 'application/json' : 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const normalizedTitle = artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'artifact';
    anchor.href = url;
    anchor.download = `${normalizedTitle}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    let active = true;

    const loadCanonicalSession = async () => {
      try {
        const response = await fetch('/api/atom/session/threads');
        if (!response.ok) return;
        const payload = (await response.json()) as {
          threads?: Array<{ sessionId: string }>;
        };

        if (!active || !Array.isArray(payload.threads) || !payload.threads[0]?.sessionId) return;
        setActiveSessionId(payload.threads[0].sessionId);
      } catch {
        // no existing session for this scope yet
      }
    };

    void loadCanonicalSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeSessionId) return;

    let active = true;
    const hydrateSession = async () => {
      setIsHydratingSession(true);
      try {
        const response = await fetch(`/api/atom/session/${activeSessionId}`);
        if (!response.ok) return;
        const payload = (await response.json()) as {
          session?: { status?: AtomTaskStatus };
          messages?: Array<{ role: 'user' | 'assistant'; content_md: string }>;
          artifacts?: ArtifactItem[];
        };

        if (!active) return;

        const history = (payload.messages ?? [])
          .filter((item) => item.role === 'user' || item.role === 'assistant')
          .map((item) => ({ role: item.role, content: item.content_md }));

        setChatHistory(history);
        setAssistantText(history.filter((message) => message.role === 'assistant').slice(-1)[0]?.content ?? '');
        setArtifacts(payload.artifacts ?? []);
        setTimeline([]);
        setStatus(payload.session?.status ?? 'completed');
      } catch {
        // ignore hydration errors and keep current pane state
      } finally {
        if (active) setIsHydratingSession(false);
      }
    };

    void hydrateSession();

    return () => {
      active = false;
    };
  }, [activeSessionId]);

  return (
    <div className="h-full flex bg-[linear-gradient(140deg,#0F172A,#162535_35%,#0B1324)] text-white">
      <Card className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-[320px]'} transition-all duration-200 shrink-0 border-y-0 border-l-0 border-r border-[#1E3A5F] rounded-none bg-[#0f2133]/80 flex flex-col`}>
        <div className="h-12 px-3 border-b border-[#1E3A5F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#9FB0C2]" onClick={() => setIsSidebarCollapsed((v) => !v)}>
              {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
            {!isSidebarCollapsed && <p className="text-xs font-semibold text-[#D7E3EF]">Cockpit</p>}
          </div>
          {!isSidebarCollapsed && <Badge className="text-[10px] bg-[#5BB3B3]/15 border-[#5BB3B3]/40 text-[#A5F3FC]">UX-1</Badge>}
        </div>

        <div className="flex-1 min-h-0 p-3">
            {!isSidebarCollapsed && <p className="text-[11px] uppercase tracking-wide text-[#7DD3FC] mb-2">Resources</p>}
            <div className="h-full overflow-y-auto space-y-2">
              {!isSidebarCollapsed && (
                <>
                  <div className="flex items-center justify-between">
                    <Badge className="text-[10px] bg-[#5BB3B3]/15 border-[#5BB3B3]/40 text-[#A5F3FC]">{selectedBookIds.length}/{sourceCatalog.length} selected</Badge>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] text-[#9FB0C2]" onClick={() => setShowPendingSources((prev) => !prev)}>
                      Pending: {showPendingSources ? 'ON' : 'OFF'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="h-7 rounded-md bg-[#162535] border border-[#1E3A5F] text-[11px] px-2 text-[#BFDBFE]">
                      <option value="all">All levels</option>
                      {ATOM_SOURCE_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                    </select>
                    <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="h-7 rounded-md bg-[#162535] border border-[#1E3A5F] text-[11px] px-2 text-[#BFDBFE]">
                      {domains.map((domain) => <option key={domain} value={domain}>{domain === 'all' ? 'All domains' : domain}</option>)}
                    </select>
                  </div>

                  {sourcesLoading ? (
                    <p className="text-[11px] text-[#64748B]">Loading sources…</p>
                  ) : groupedBooks.length === 0 ? (
                    <p className="text-[11px] text-[#64748B]">No sources match filters.</p>
                  ) : (
                    groupedBooks.map((group) => (
                      <div key={group.level} className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wide text-[#7DD3FC]">{group.level}</p>
                        {group.items.slice(0, 4).map((book) => {
                          const selected = selectedBookIds.includes(book.id);
                          const disabled = book.availabilityStatus && book.availabilityStatus !== 'indexed_ready';
                          return (
                            <button
                              key={book.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => toggleBook(book.id)}
                              className={`w-full rounded-md border px-2 py-1.5 text-left ${selected ? 'border-[#5BB3B3]/50 bg-[#5BB3B3]/10' : 'border-[#1E3A5F] hover:bg-[#1E3A5F]/40'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] text-[#D7E3EF] truncate">{book.shortTitle}</p>
                                {disabled ? <Lock className="w-3 h-3 text-[#64748B]" /> : <CheckCircle2 className={`w-3 h-3 ${selected ? 'text-[#5BB3B3]' : 'text-transparent'}`} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
      </Card>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="h-12 border-b border-[#1E3A5F] px-4 flex items-center justify-between bg-[#101C2B]/80">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-semibold truncate">ATOM Workspace</h1>
            <Badge className={`text-[10px] border ${STATUS_STYLES[status]}`}>{status}</Badge>
            {mode === 'nucleux-original' && !trackAEnabled && <span className="text-[10px] text-amber-200">Track A disabled</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsOutputsOpen((v) => !v)} className="border-[#1E3A5F] text-[#BFDBFE] bg-transparent">
              <PanelRight className="w-4 h-4 mr-1" /> Outputs
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 px-4 pt-4 pb-3 flex flex-col gap-3">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            <select value={selectedRoomId} onChange={(e) => handleRoomChange(e.target.value as AtomRoomId)} className="h-9 rounded-md bg-[#162535] border border-[#1E3A5F] text-xs px-2">
              {(Object.keys(ATOM_ROOM_PROFILES) as AtomRoomId[]).map((roomId) => (<option key={roomId} value={roomId}>{roomId}</option>))}
            </select>
            <input value={topic} onChange={(e) => { setTopic(e.target.value); setManualOverrides((prev) => ({ ...prev, topic: true })); }} className="h-9 rounded-md bg-[#162535] border border-[#1E3A5F] text-xs px-2" placeholder="Topic" />
            <input value={goal} onChange={(e) => { setGoal(e.target.value); setManualOverrides((prev) => ({ ...prev, goal: true })); }} className="h-9 rounded-md bg-[#162535] border border-[#1E3A5F] text-xs px-2" placeholder="Goal" />
            <div className="h-9 rounded-md bg-[#162535] border border-[#1E3A5F] px-2 flex items-center justify-between text-xs text-[#9FB0C2]">
              <span>{selectedBookIds.length} sources selected</span>
              <span>{taskId ? `Task ${taskId.slice(0, 8)}` : "No task"}</span>
            </div>
          </div>

          {errorCard && <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">{errorCard}</div>}

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full rounded-3xl border border-[#22354D] bg-[#0f2133]/85 p-4 flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.14em] text-[#8FB6D9]">Conversation</h3>
                <p className="text-[11px] text-[#68829A]">{timeline.length} events</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isHydratingSession ? (
                  <div className="h-full flex items-center justify-center text-sm text-[#64748B]">Loading session…</div>
                ) : chatHistory.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-[#64748B]">Start a chat to see responses here.</p>
                  </div>
                ) : (
                  chatHistory.map((message, idx) => (
                    <div key={`${message.role}-${idx}`} className={message.role === 'user' ? 'ml-auto max-w-[78%] rounded-2xl bg-[#5BB3B3]/20 border border-[#5BB3B3]/40 px-3 py-2' : 'mr-auto max-w-[82%] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3'}>
                      {message.role === 'assistant' ? (
                        <MedicalMarkdown
                          content={message.content}
                          className="text-[13px] leading-6 [&_strong]:text-[#7DD3FC] [&_em]:text-[#A5F3FC] [&_h1]:text-[#E5EEF8] [&_h2]:text-[#D2E6FF] [&_h3]:text-[#BFDBFE]"
                        />
                      ) : (
                        <p className="text-[13px] text-[#E7F8F8] whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full max-w-4xl mx-auto">
            <div className="rounded-3xl border border-[#2B4560] bg-[#0d1c2e]/95 shadow-[0_16px_48px_rgba(0,0,0,0.35)] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-[#93A9BF]">Simple Chat</p>
                <p className="text-[11px] text-[#68829A]">{selectedBookIds.length} sources selected</p>
              </div>
              <div className="rounded-2xl border border-[#29435D] bg-[#101f31] px-3 py-2 flex items-end gap-2">
                <textarea
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder="Ask ATOM anything about your selected sources..."
                  className="flex-1 min-h-[72px] max-h-40 bg-transparent text-sm leading-6 text-[#E5EEF8] placeholder:text-[#68829A] resize-none focus:outline-none"
                />
                <Button onClick={startTask} disabled={!taskPrompt.trim() || isSubmitting || selectedBookIds.length === 0} className="h-9 rounded-xl bg-[#5BB3B3] hover:bg-[#45a1a1] text-white">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOutputsOpen && (
        <Card className="w-[360px] shrink-0 border-y-0 border-r-0 border-l border-[#1E3A5F] rounded-none bg-[#0f2133]/80 flex flex-col">
          <div className="h-12 px-3 border-b border-[#1E3A5F] flex items-center justify-between">
            <h2 className="text-sm font-semibold">Outputs</h2>
            <Button size="sm" variant="ghost" className="text-[#9FB0C2]" onClick={() => setIsOutputsOpen(false)}>Hide</Button>
          </div>
          <div className="flex-1 min-h-0 grid grid-rows-2">
            <div className="min-h-0 border-b border-[#1E3A5F] flex flex-col">
              <div className="shrink-0 p-3 pb-2">
                <h3 className="text-xs uppercase tracking-wide text-[#7DD3FC]">Timeline</h3>
              </div>
              <div className="flex-1 min-h-0 px-3 pb-3 overflow-y-auto">
                <div className="space-y-2">
                  {timeline.length === 0 ? <p className="text-xs text-[#64748B]">No events yet.</p> : timeline.map((item) => (
                    <div key={item.id} className="rounded-md border border-[#1E3A5F] bg-[#162535] p-2">
                      <p className="text-xs text-white">{item.label}</p>
                      {item.detail && <p className="text-[11px] text-[#9FB0C2] mt-1 whitespace-pre-wrap">{item.detail}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="min-h-0 flex flex-col">
              <div className="shrink-0 p-3 pb-2">
                <h3 className="text-xs uppercase tracking-wide text-[#7DD3FC]">Artifacts</h3>
              </div>
              <div className="flex-1 min-h-0 px-3 pb-3 overflow-y-auto">
                <div className="space-y-2">
                  {mergedArtifacts.length === 0 ? <p className="text-xs text-[#64748B]">No artifacts yet.</p> : mergedArtifacts.map((artifact) => (
                    <div key={artifact.id} className="rounded-md border border-[#1E3A5F] bg-[#162535] p-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-white truncate">{artifact.title}</p>
                        {artifact.content && (
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-[#9FB0C2]" onClick={() => downloadArtifact(artifact)}>
                            Download
                          </Button>
                        )}
                      </div>
                      {artifact.content && <pre className="text-[11px] text-[#BFD0E0] whitespace-pre-wrap mt-1">{artifact.content}</pre>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
