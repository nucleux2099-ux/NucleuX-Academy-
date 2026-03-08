"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ATOM_SOURCE_CATALOG,
  ATOM_SOURCE_LEVELS,
  ATOM_PRESET_LABELS,
  type AtomSourcePreset,
} from "@/lib/atom/source-catalog";
import type { AtomTaskStatus, AtomEventType } from "@/lib/atom/types";
import { extractCodeBlocks } from "@/components/chat/CanvasPanel";
import {
  BookOpen,
  CircleStop,
  Play,
  GitBranch,
  RotateCcw,
  FlaskConical,
  FileCode2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Activity,
} from "lucide-react";

type TimelineItem = {
  id: string;
  type: AtomEventType;
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

type MobileTab = "sources" | "process" | "workspace";

const STATUS_STYLES: Record<AtomTaskStatus, string> = {
  queued: "bg-slate-500/20 text-slate-200 border-slate-400/40",
  running: "bg-cyan-500/20 text-cyan-200 border-cyan-400/40",
  needs_input: "bg-amber-500/20 text-amber-100 border-amber-300/40",
  completed: "bg-emerald-500/20 text-emerald-100 border-emerald-300/40",
  failed: "bg-rose-500/20 text-rose-100 border-rose-300/40",
  cancelled: "bg-zinc-500/20 text-zinc-200 border-zinc-300/40",
};

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
  const [mobileTab, setMobileTab] = useState<MobileTab>("process");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<AtomTaskStatus>("queued");
  const [assistantText, setAssistantText] = useState("");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [errorCard, setErrorCard] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(ATOM_SOURCE_CATALOG.slice(0, 3).map((book) => book.id));
  const [selectedPreset, setSelectedPreset] = useState<AtomSourcePreset | null>("clinical-deep-dive");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const eventSourceRef = useRef<EventSource | null>(null);

  const domains = useMemo(() => ["all", ...Array.from(new Set(ATOM_SOURCE_CATALOG.map((book) => book.domain)))], []);

  const filteredBooks = useMemo(
    () =>
      ATOM_SOURCE_CATALOG.filter((book) => {
        if (levelFilter !== "all" && book.level !== levelFilter) return false;
        if (domainFilter !== "all" && book.domain !== domainFilter) return false;
        return true;
      }),
    [levelFilter, domainFilter],
  );

  const groupedBooks = useMemo(() => {
    return ATOM_SOURCE_LEVELS.map((level) => ({
      level,
      items: filteredBooks.filter((book) => book.level === level),
    })).filter((group) => group.items.length > 0);
  }, [filteredBooks]);

  const parsedArtifactsFromAssistant = useMemo(() => {
    if (!assistantText.trim()) return [];
    return extractCodeBlocks([{ id: "assistant-latest", role: "assistant", content: assistantText, timestamp: new Date() }]).map((block) => ({
      id: `code-${block.id}`,
      title: `${block.language.toUpperCase()} snippet`,
      kind: "code",
      content: block.code,
      createdAt: new Date().toISOString(),
    } satisfies ArtifactItem));
  }, [assistantText]);

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

  useEffect(() => () => closeEventStream(), []);

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

  const startTask = useCallback(async () => {
    if (!taskPrompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setErrorCard(null);
    setAssistantText("");
    setTimeline([]);
    setArtifacts([]);
    setStatus("queued");

    try {
      const response = await fetch("/api/atom/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: taskPrompt.trim(),
          mode: "task",
          sourceSelection: {
            preset: selectedPreset,
            bookIds: selectedBookIds,
            level: levelFilter === "all" ? undefined : levelFilter,
            domain: domainFilter === "all" ? undefined : domainFilter,
          },
          room: "atom",
        }),
      });

      const data = (await response.json()) as { error?: string; taskId?: string; eventsUrl?: string; status?: AtomTaskStatus };
      if (!response.ok || !data.taskId || !data.eventsUrl) {
        throw new Error(data.error ?? "Unable to create task");
      }

      setTaskId(data.taskId);
      setStatus(data.status ?? "queued");
      connectEvents(data.taskId, data.eventsUrl);
      setMobileTab("process");
    } catch (error) {
      setStatus("failed");
      setErrorCard(error instanceof Error ? error.message : "Failed to start task");
    } finally {
      setIsSubmitting(false);
    }
  }, [connectEvents, domainFilter, isSubmitting, levelFilter, selectedBookIds, selectedPreset, taskPrompt]);

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

  return (
    <div className="h-full flex flex-col bg-[radial-gradient(circle_at_top,_rgba(91,179,179,0.18),_transparent_35%),linear-gradient(140deg,#0F172A,#162535_35%,#0B1324)]">
      <div className="border-b border-white/10 px-4 py-3 backdrop-blur-sm bg-white/[0.03] md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: "sources", label: "Sources", icon: BookOpen },
            { key: "process", label: "Process", icon: Activity },
            { key: "workspace", label: "Workspace", icon: FileCode2 },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`rounded-lg px-2 py-2 text-xs font-medium border flex items-center justify-center gap-1.5 ${
                mobileTab === tab.key ? "text-white bg-[#5BB3B3]/20 border-[#5BB3B3]/50" : "text-[#94A3B8] border-white/10"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden md:p-3 md:gap-3">
        <Card className={`w-[320px] shrink-0 border-[#1E3A5F] md:rounded-2xl rounded-none md:border border-r-0 md:border-r overflow-hidden backdrop-blur-xl bg-white/[0.03] ${mobileTab !== "sources" ? "hidden md:flex" : "flex"} flex-col`}>
          <div className="p-4 border-b border-[#1E3A5F]">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5BB3B3]" /> 26-Book Source Library
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">Select what ATOM should use for this task.</p>
            <Badge className="mt-2 bg-[#5BB3B3]/15 text-[#A5F3FC] border-[#5BB3B3]/30 text-[10px]">{selectedBookIds.length}/26 selected</Badge>
          </div>

          <div className="p-3 border-b border-[#1E3A5F] space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {ATOM_SOURCE_LEVELS.map((level) => (
                <Button key={level} size="sm" variant="outline" onClick={() => setLevelFilter((prev) => (prev === level ? "all" : level))} className={`h-7 text-[10px] border ${levelFilter === level ? "border-[#5BB3B3] bg-[#5BB3B3]/20 text-white" : "border-[#1E3A5F] text-[#94A3B8]"}`}>
                  {level}
                </Button>
              ))}
            </div>
            <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="w-full h-8 rounded-md bg-[#162535] border border-[#1E3A5F] text-xs text-white px-2">
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain === "all" ? "All domains" : domain}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(ATOM_PRESET_LABELS) as AtomSourcePreset[]).map((preset) => (
                <button key={preset} onClick={() => setSelectedPreset((prev) => (prev === preset ? null : preset))} className={`text-[10px] px-2 py-1 rounded-full border transition ${selectedPreset === preset ? "text-white border-[#5BB3B3] bg-[#5BB3B3]/20" : "text-[#94A3B8] border-[#1E3A5F] hover:border-[#5BB3B3]/50"}`}>
                  {ATOM_PRESET_LABELS[preset]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {groupedBooks.map((group) => (
              <div key={group.level}>
                <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-1.5">{group.level}</p>
                <div className="space-y-1.5">
                  {group.items.map((book) => {
                    const selected = selectedBookIds.includes(book.id);
                    return (
                      <button key={book.id} onClick={() => toggleBook(book.id)} className={`w-full text-left px-2.5 py-2 rounded-lg border ${selected ? "border-[#5BB3B3]/60 bg-[#5BB3B3]/10" : "border-[#1E3A5F] hover:bg-[#1E3A5F]/40"}`}>
                        <div className="flex justify-between gap-2">
                          <p className={`text-xs ${selected ? "text-white" : "text-[#CBD5E1]"}`}>{book.title}</p>
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-[#5EEAD4] shrink-0 mt-0.5" />}
                        </div>
                        <p className="text-[10px] text-[#64748B] mt-1">{book.domain}{book.edition ? ` · ${book.edition}` : ""}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={`flex-1 border-[#1E3A5F] md:rounded-2xl rounded-none md:border border-x-0 md:border-x overflow-hidden bg-[#101C2B]/90 ${mobileTab !== "process" ? "hidden md:flex" : "flex"} flex-col`}>
          <div className="p-4 border-b border-[#1E3A5F] bg-gradient-to-r from-[#0f2235] to-[#14293f]">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-white text-sm font-semibold">ATOM Task Mode</h1>
              <Badge className={`text-[10px] border ${STATUS_STYLES[status]}`}>{status}</Badge>
              {taskId && <span className="text-[10px] text-[#94A3B8]">Task: {taskId.slice(0, 8)}</span>}
            </div>
            <p className="text-xs text-[#9FB0C2] mt-1">Visible process flow for longer clinical workflows.</p>
          </div>

          {errorCard && (
            <div className="mx-4 mt-3 rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorCard}</span>
            </div>
          )}

          <div className="p-4 border-b border-[#1E3A5F]">
            <textarea
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              placeholder="Describe the clinical task ATOM should execute..."
              className="w-full min-h-[84px] max-h-[180px] rounded-xl bg-[#162535] border border-[#1E3A5F] text-white text-sm p-3 focus:outline-none focus:border-[#5BB3B3]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <Button onClick={startTask} disabled={!taskPrompt.trim() || isSubmitting || selectedBookIds.length === 0} className="bg-[#5BB3B3] hover:bg-[#45a1a1] text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5" />}Start Task
              </Button>
              <Button variant="outline" onClick={() => controlTask("stop")} disabled={!taskId || status !== "running"} className="border-[#1E3A5F] text-[#FCA5A5] bg-transparent">
                <CircleStop className="w-4 h-4 mr-1.5" />Stop
              </Button>
              <Button variant="outline" onClick={() => controlTask("retry")} disabled={!taskId} className="border-[#1E3A5F] text-[#BFDBFE] bg-transparent">
                <RotateCcw className="w-4 h-4 mr-1.5" />Retry
              </Button>
              <Button variant="outline" onClick={() => controlTask("continue")} disabled={!taskId || status !== "needs_input"} className="border-[#1E3A5F] text-[#A7F3D0] bg-transparent">
                <Play className="w-4 h-4 mr-1.5" />Continue
              </Button>
              <Button variant="outline" onClick={() => controlTask("branch")} disabled={!taskId} className="border-[#1E3A5F] text-[#E9D5FF] bg-transparent">
                <GitBranch className="w-4 h-4 mr-1.5" />Branch (stub)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 xl:gap-3 flex-1 min-h-0">
            <div className="border-b xl:border-b-0 xl:border-r border-[#1E3A5F] p-4 min-h-0 flex flex-col">
              <h3 className="text-xs uppercase tracking-wide text-[#7DD3FC] mb-2">Timeline</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {timeline.length === 0 ? (
                  <p className="text-xs text-[#64748B]">No events yet. Start a task to see phase-by-phase updates.</p>
                ) : (
                  timeline.map((item) => (
                    <div key={item.id} className="rounded-lg border border-[#1E3A5F] bg-[#0f2133] p-2.5">
                      <div className="flex justify-between gap-2">
                        <p className="text-xs text-white">{item.label}</p>
                        <span className="text-[10px] text-[#64748B]">{new Date(item.ts).toLocaleTimeString()}</span>
                      </div>
                      {item.detail && <p className="text-[11px] text-[#9FB0C2] mt-1 whitespace-pre-wrap">{item.detail}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 min-h-0 flex flex-col">
              <h3 className="text-xs uppercase tracking-wide text-[#7DD3FC] mb-2">Assistant Output</h3>
              <div className="flex-1 overflow-y-auto rounded-xl border border-[#1E3A5F] bg-[#0f2133] p-3">
                {assistantText ? (
                  <pre className="whitespace-pre-wrap text-sm text-[#D7E3EF] font-sans">{assistantText}</pre>
                ) : (
                  <p className="text-xs text-[#64748B]">Assistant deltas will stream here in real-time.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className={`w-[360px] shrink-0 border-[#1E3A5F] md:rounded-2xl rounded-none md:border border-l-0 md:border-l overflow-hidden backdrop-blur-xl bg-white/[0.03] ${mobileTab !== "workspace" ? "hidden lg:flex" : "flex"} flex-col`}>
          <Tabs defaultValue="artifacts" className="flex flex-col h-full">
            <div className="p-3 border-b border-[#1E3A5F]">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2"><FlaskConical className="w-4 h-4 text-[#5EEAD4]" /> Workspace</h2>
              <TabsList className="grid w-full mt-2 grid-cols-2 bg-[#162535] border border-[#1E3A5F]">
                <TabsTrigger value="artifacts" className="text-xs data-[state=active]:bg-[#5BB3B3]/20">Artifacts</TabsTrigger>
                <TabsTrigger value="canvas" className="text-xs data-[state=active]:bg-[#5BB3B3]/20">Canvas</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="artifacts" className="mt-0 flex-1 overflow-y-auto p-3 space-y-2">
              {mergedArtifacts.length === 0 ? (
                <p className="text-xs text-[#64748B]">Artifacts from tool/output events will appear here.</p>
              ) : (
                mergedArtifacts.map((artifact) => (
                  <div key={artifact.id} className="rounded-lg border border-[#1E3A5F] bg-[#162535] p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-white flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#5EEAD4]" />{artifact.title}</p>
                      <Badge className="text-[9px] border border-[#1E3A5F] bg-[#0f2133] text-[#94A3B8]">{artifact.kind}</Badge>
                    </div>
                    {artifact.content && <pre className="mt-2 text-[11px] text-[#BFD0E0] whitespace-pre-wrap">{artifact.content}</pre>}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="canvas" className="mt-0 flex-1 overflow-y-auto p-3">
              {parsedArtifactsFromAssistant.length === 0 ? (
                <p className="text-xs text-[#64748B]">Code/output fenced blocks from assistant responses show here.</p>
              ) : (
                <div className="space-y-2">
                  {parsedArtifactsFromAssistant.map((artifact) => (
                    <div key={artifact.id} className="rounded-lg border border-[#1E3A5F] bg-[#101C2B] p-2.5">
                      <p className="text-xs text-[#A5F3FC] mb-1">{artifact.title}</p>
                      <pre className="text-[11px] text-[#D7E3EF] whitespace-pre-wrap">{artifact.content}</pre>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
