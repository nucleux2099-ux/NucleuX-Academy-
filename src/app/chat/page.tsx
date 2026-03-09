'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, ChevronDown, ChevronRight, Copy, Download, Filter,
  Loader2, Lock, MessageSquare, PanelLeft, PanelLeftClose,
  PanelRight, Paperclip, SendHorizontal, Settings, Sparkles,
  ThumbsUp, Wrench, X, Zap, Activity, CheckCircle2,
  Clock, FileText, Lightbulb, Target, GraduationCap,
  FlaskConical, Stethoscope, Brain, BarChart3,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ATOM_SOURCE_CATALOG,
  ATOM_SOURCE_LEVELS,
  type AtomSourceCatalogItem,
} from '@/lib/atom/source-catalog';
import type { AtomTaskStatus, AtomEventType } from '@/lib/atom/types';
import { MedicalMarkdown } from '@/components/MedicalMarkdown';
import { isFeatureEnabled } from '@/lib/features/flags';
import { appendDedupedUserEvent } from '@/components/atom/chatEventDedup';
import {
  ATOM_ROOM_PROFILES,
  applyRoomDefaults,
  resolveAtomRoomProfile,
  type AtomRoomId,
  type AtomWorkspaceMode,
} from '@/lib/atom/room-profiles';
import { QUICK_START_LEVELS, type QuickStartLevel } from '@/lib/atom/quick-start-schema';
import { SourceSidebar } from '@/components/atom/SourceSidebar';
import { StarterCards } from '@/components/atom/StarterCards';
import { MessageBubble } from '@/components/atom/MessageBubble';
import { OutputsPanel } from '@/components/atom/OutputsPanel';

/* ════════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════════ */

type TimelineItem = {
  id: string;
  type: AtomEventType | 'mode.launch' | 'gdd.session' | 'gdd.advance';
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

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  feedback?: 'helpful' | 'needs_fix' | null;
  feedbackText?: string;
};

type FeedbackState = {
  [messageId: string]: {
    type: 'helpful' | 'needs_fix' | null;
    text: string;
    resolved: boolean;
    showInput: boolean;
  };
};

/* ════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ════════════════════════════════════════════════════════════ */

const RESPONSE_STYLES = [
  { value: 'concise', label: 'Concise', icon: Zap },
  { value: 'detailed', label: 'Detailed', icon: BookOpen },
  { value: 'narrative', label: 'Narrative', icon: MessageSquare },
] as const;

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const FORMAT_OPTIONS = [
  { value: 'bullets', label: 'Bullets' },
  { value: 'prose', label: 'Prose' },
  { value: 'table', label: 'Table' },
  { value: 'mixed', label: 'Mixed' },
] as const;

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  connected: { color: '#34D399', bg: '#34D399/15', border: '#34D399/40', label: 'Connected' },
  connecting: { color: '#FBBF24', bg: '#FBBF24/15', border: '#FBBF24/40', label: 'Connecting...' },
  thinking: { color: '#60A5FA', bg: '#60A5FA/15', border: '#60A5FA/40', label: 'Thinking...' },
  error: { color: '#F87171', bg: '#F87171/15', border: '#F87171/40', label: 'Error' },
  idle: { color: '#64748B', bg: '#64748B/15', border: '#64748B/40', label: 'Idle' },
};

function safeString(val: unknown): string | undefined {
  return typeof val === 'string' && val.trim() ? val : undefined;
}

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */

export default function AtomWorkspacePage() {
  // ─── Layout state ───
  const [leftPaneOpen, setLeftPaneOpen] = useState(true);
  const [rightPaneOpen, setRightPaneOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'context' | 'consult' | 'outputs'>('consult');

  // ─── Context cockpit state ───
  const [sourceCatalog, setSourceCatalog] = useState<AtomSourceCatalogItem[]>(ATOM_SOURCE_CATALOG);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>(ATOM_SOURCE_CATALOG.slice(0, 3).map((b) => b.id));
  const [showPendingSources, setShowPendingSources] = useState(false);
  const [responseStyle, setResponseStyle] = useState<string>('concise');

  // ─── Center pane state ───
  const [selectedRoomId, setSelectedRoomId] = useState<AtomRoomId>('atom');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composerText, setComposerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // ─── Right pane state ───
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);

  // ─── Error state ───
  const [errorCard, setErrorCard] = useState<string | null>(null);

  // ─── Refs ───
  const chatEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const threadSessionMapRef = useRef<Record<string, string>>({});

  const hasSourcesSelected = selectedBookIds.length > 0;

  // ─── Source loading ───
  useEffect(() => {
    let active = true;
    const loadSources = async () => {
      setSourcesLoading(true);
      try {
        const res = await fetch(`/api/atom/sources?include_pending=${showPendingSources ? 'true' : 'false'}`);
        if (!res.ok) throw new Error('Source loading failed');
        const payload = (await res.json()) as {
          sources?: Array<{
            id: string; title: string; short_title: string; domain: string;
            level_tags: string[]; priority: number; enabled: boolean; sort_order: number;
            availability_status?: 'indexed_ready' | 'md_ready_not_ingested' | 'pdf_only' | 'missing' | null;
          }>;
        };
        if (!active) return;
        const normalized = (payload.sources ?? []).map((s) => ({
          id: s.id, title: s.title, shortTitle: s.short_title, domain: s.domain,
          levelTags: (s.level_tags ?? []).filter((t): t is (typeof ATOM_SOURCE_LEVELS)[number] =>
            ATOM_SOURCE_LEVELS.includes(t as (typeof ATOM_SOURCE_LEVELS)[number])),
          priority: s.priority, enabled: s.enabled, sortOrder: s.sort_order,
          availabilityStatus: s.availability_status ?? undefined,
          availabilityDisabledReason: null, chapterCount: null, chunkCount: null,
          lastSyncedAt: null, metadata: {},
        }));
        if (normalized.length > 0) {
          setSourceCatalog(normalized);
          const selectable = normalized.filter((s) => !s.availabilityStatus || s.availabilityStatus === 'indexed_ready');
          setSelectedBookIds((prev) => {
            const next = prev.filter((id) => selectable.some((s) => s.id === id));
            return next.length > 0 ? next : selectable.slice(0, 3).map((s) => s.id);
          });
        }
      } catch {
        if (active) setSourceCatalog(ATOM_SOURCE_CATALOG);
      } finally {
        if (active) setSourcesLoading(false);
      }
    };
    void loadSources();
    return () => { active = false; };
  }, [showPendingSources]);

  // ─── Auto-scroll chat ───
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Send message ───
  const sendMessage = useCallback(async () => {
    if (!composerText.trim() || isSubmitting || !hasSourcesSelected) return;
    setIsSubmitting(true);
    setErrorCard(null);
    setConnectionStatus('connecting');

    const userText = composerText.trim();
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'user', content: userText, timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setComposerText('');

    try {
      const threadKey = 'default-thread';
      let sid = threadSessionMapRef.current[threadKey];

      if (!sid) {
        const startRes = await fetch('/api/atom/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ threadId: threadKey, roomId: selectedRoomId, selectedBookIds }),
        });
        const startJson = (await startRes.json()) as { sessionId?: string; error?: string };
        if (!startRes.ok || !startJson.sessionId) throw new Error(startJson.error ?? 'Unable to start session');
        sid = startJson.sessionId;
        threadSessionMapRef.current[threadKey] = sid;
        setSessionId(sid);
      }

      setConnectionStatus('thinking');

      const continueLike = /^(continue|go on|carry on|next|more|proceed)\b/i.test(userText);
      const endpoint = continueLike ? `/api/atom/session/${sid}/continue` : `/api/atom/session/${sid}/message`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'surgery', // defaulting to surgery for now to simplify
          message: userText,
        }),
      });

      const json = (await response.json()) as { assistant?: string; error?: string };
      if (!response.ok || !json.assistant) throw new Error(json.error ?? 'Chat request failed');

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(), role: 'assistant', content: json.assistant ?? '',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Add timeline event
      setTimeline((prev) => [...prev, {
        id: crypto.randomUUID(), type: 'task.completed' as AtomEventType,
        ts: new Date().toISOString(), label: 'Response generated',
        detail: userText.slice(0, 60) + (userText.length > 60 ? '...' : ''),
      }]);

      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      setErrorCard(error instanceof Error ? error.message : 'Failed to send message');
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: 'system',
        content: error instanceof Error ? error.message : 'Something went wrong.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsSubmitting(false);
    }
  }, [composerText, hasSourcesSelected, isSubmitting, selectedBookIds, selectedRoomId]);

  // ─── Toggle book ───
  const toggleBook = (bookId: string) => {
    setSelectedBookIds((prev) => prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]);
  };

  const handleSelectAll = () => {
    const selectable = sourceCatalog.filter(s => !s.availabilityStatus || s.availabilityStatus === 'indexed_ready');
    setSelectedBookIds(selectable.map(s => s.id));
  };

  // ─── Apply template ───
  const applyTemplate = (prompt: string) => {
    setComposerText(prompt);
    setShowTemplates(false);
    composerRef.current?.focus();
  };

  // ─── Copy artifact ───
  const copyArtifact = (content: string) => {
    navigator.clipboard.writeText(content).catch(() => { });
  };

  /* ════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════ */

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
      {/* ─── MOBILE TAB BAR ─── */}
      <div className="md:hidden flex border-b border-border">
        {(['context', 'consult', 'outputs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${mobileTab === tab
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted-foreground'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0 relative">
        {/* ═══════════════════════════════════════════════════════
           LEFT PANE — CONTEXT COCKPIT (ANIMATED)
           ═══════════════════════════════════════════════════════ */}
        <AnimatePresence initial={false}>
          {leftPaneOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0, x: -50 }}
              animate={{ width: 280, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -50 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className={`
                shrink-0 overflow-hidden
                border-r border-border backdrop-blur-xl bg-card/60
                hidden md:flex flex-col z-10
                ${mobileTab === 'context' ? '!flex !w-full md:!w-[280px]' : ''}
              `}
            >
              <div className="w-[280px] h-full flex flex-col">
                <SourceSidebar
                  sources={sourceCatalog}
                  selectedIds={selectedBookIds}
                  onToggle={toggleBook}
                  onSelectAll={handleSelectAll}
                  onClearAll={() => setSelectedBookIds([])}
                  loading={sourcesLoading}
                  responseStyle={responseStyle}
                  onStyleChange={setResponseStyle}
                  onClose={() => setLeftPaneOpen(false)}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════
           CENTER PANE — CLINICAL CONSULT
           ═══════════════════════════════════════════════════════ */}
        <motion.main
          layout
          className={`flex-1 min-w-0 flex flex-col ${mobileTab !== 'consult' ? 'hidden md:flex' : 'flex'
            }`}
        >
          {/* Session Header */}
          <div className="h-14 border-b border-border px-4 flex items-center justify-between backdrop-blur-xl bg-background/80 shrink-0 z-10 w-full relative pt-env-top">
            <div className="flex items-center gap-3 min-w-0">
              <AnimatePresence>
                {!leftPaneOpen && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setLeftPaneOpen(true)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hidden md:flex transition-colors"
                    title="Open Settings"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 group px-2 py-1.5 rounded-md hover:bg-muted font-medium text-muted-foreground transition-all"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm hidden sm:inline-block">My Desk</span>
              </Link>

              <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

              <div className="flex items-center gap-2 bg-primary/10 pl-1.5 pr-2.5 py-1 rounded-full border border-primary/20">
                <Brain className="w-3.5 h-3.5 text-primary shrink-0" />
                <h1 className="text-xs font-semibold truncate text-primary">ATOM Studio</h1>
              </div>

              {/* Room badge */}
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value as AtomRoomId)}
                className="hidden sm:block h-6 rounded-md bg-card border border-border text-[10px] px-1.5 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                title="Select Room Profile"
              >
                {(Object.keys(ATOM_ROOM_PROFILES) as AtomRoomId[]).map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>

              {/* Status badge */}
              <span
                className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full border transition-colors duration-300"
                style={{
                  color: STATUS_CONFIG[connectionStatus]?.color ?? 'var(--color-muted-foreground)',
                  borderColor: `${STATUS_CONFIG[connectionStatus]?.color ?? 'var(--color-muted-foreground)'}40`,
                  background: `${STATUS_CONFIG[connectionStatus]?.color ?? 'var(--color-muted-foreground)'}10`,
                }}
              >
                {STATUS_CONFIG[connectionStatus]?.label ?? 'Idle'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AnimatePresence>
                {!rightPaneOpen && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setRightPaneOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-foreground hover:bg-muted transition-colors mr-2 shadow-sm"
                  >
                    <span className="hidden sm:inline">Outputs</span>
                    <PanelRight className="w-3.5 h-3.5" />
                    {artifacts.length > 0 && (
                      <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary/20 text-[9px] text-primary font-bold">
                        {artifacts.length}
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                {/* Animated nucleus icon */}
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center shadow-teal-subtle">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-foreground mb-2">ATOM Studio</h2>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mx-auto">
                    {hasSourcesSelected
                      ? 'Source-grounded clinical intelligence. Ask anything about your selected sources.'
                      : 'Open the Context Cockpit to select sources and configure your session.'}
                  </p>
                </div>

                {/* Starter Cards */}
                <StarterCards onSelect={applyTemplate} disabled={!hasSourcesSelected} />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isSubmitting && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Brain className="w-3.5 h-3.5 text-primary animate-pulse" />
                    </div>
                    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-teal-subtle" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-teal-subtle" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-teal-subtle" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">ATOM is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Error card */}
          <AnimatePresence>
            {errorCard && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mx-4 mb-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 flex items-center justify-between"
              >
                <p className="text-xs text-destructive">{errorCard}</p>
                <button onClick={() => setErrorCard(null)} className="text-destructive/70 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Composer */}
          <div className="shrink-0 px-4 pb-4 pt-2">
            <div className="max-w-3xl mx-auto">
              <div className="matte-card p-3 shadow-matte-lg border-teal-subtle">
                {/* No sources warning */}
                <AnimatePresence>
                  {!hasSourcesSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <Lock className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] text-orange-400 font-medium">Select at least one source to send a message</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-end gap-2">
                  <textarea
                    ref={composerRef}
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={hasSourcesSelected ? 'Ask ATOM anything...' : 'Select sources to start'}
                    disabled={!hasSourcesSelected}
                    className="flex-1 min-h-[48px] max-h-36 bg-transparent py-1.5 text-sm leading-6 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none disabled:opacity-40"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!composerText.trim() || isSubmitting || !hasSourcesSelected}
                    className="h-9 w-9 mb-1 rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-teal-subtle"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded border border-border bg-card text-muted-foreground">
                      Claude 3.5 Sonnet
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                      {selectedBookIds.length} sources · <span className="capitalize">{responseStyle}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground shrink-0 hidden sm:block">Shift+Enter for newline</p>
                </div>
              </div>
            </div>
          </div>
        </motion.main>

        {/* ═══════════════════════════════════════════════════════
           RIGHT PANE — OUTPUTS RAIL (ANIMATED)
           ═══════════════════════════════════════════════════════ */}
        <AnimatePresence initial={false}>
          {rightPaneOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0, x: 50 }}
              animate={{ width: 320, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 50 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className={`
                shrink-0 overflow-hidden
                border-l border-border backdrop-blur-xl bg-card/60
                hidden md:flex flex-col z-10
                ${mobileTab === 'outputs' ? '!flex !w-full md:!w-[320px]' : ''}
              `}
            >
              <div className="w-[320px] h-full flex flex-col">
                <OutputsPanel
                  artifacts={artifacts}
                  timeline={timeline}
                  onClose={() => setRightPaneOpen(false)}
                  fullChatMarkdown={messages.map(m => `### ${m.role === 'user' ? 'User' : 'ATOM'}\n${m.content}`).join('\n\n')}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
