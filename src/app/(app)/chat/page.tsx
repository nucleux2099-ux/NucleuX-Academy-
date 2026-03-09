'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, ChevronDown, ChevronRight, Copy, Download, Filter,
  Loader2, Lock, MessageSquare, PanelLeft, PanelLeftClose,
  PanelRight, Paperclip, SendHorizontal, Settings, Sparkles,
  ThumbsUp, Wrench, X, Zap, Activity, CheckCircle2,
  Clock, FileText, Lightbulb, Target, GraduationCap,
  FlaskConical, Stethoscope, Brain, BarChart3,
} from 'lucide-react';
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

const COMPOSER_TEMPLATES = [
  { icon: Stethoscope, label: 'Clinical Consult', prompt: 'Given the clinical scenario, provide a structured approach covering differential diagnosis, key investigations, and evidence-based management plan.' },
  { icon: GraduationCap, label: 'Exam Revision', prompt: 'Create a high-yield revision summary for this topic with key facts, common MCQ traps, and clinical pearls for exam preparation.' },
  { icon: Target, label: 'Teaching Prep', prompt: 'Generate a structured teaching explanation for this topic, suitable for presenting to medical students with clinical examples.' },
  { icon: FlaskConical, label: 'Research Synthesis', prompt: 'Synthesize the current evidence on this topic from selected sources, highlighting key studies and clinical implications.' },
  { icon: Wrench, label: 'Correction', prompt: 'I think the information about this concept might be incorrect. Please verify against the selected sources and provide the accurate explanation.' },
];

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
  const [levelFilter, setLevelFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [showPendingSources, setShowPendingSources] = useState(false);
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [responseStyle, setResponseStyle] = useState<string>('concise');
  const [difficulty, setDifficulty] = useState<string>('intermediate');
  const [format, setFormat] = useState<string>('mixed');

  // ─── Center pane state ───
  const [selectedRoomId, setSelectedRoomId] = useState<AtomRoomId>('atom');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composerText, setComposerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
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

  // ─── Derived state ───
  const domains = useMemo(
    () => ['all', ...Array.from(new Set(sourceCatalog.map((b) => b.domain)))],
    [sourceCatalog],
  );

  const filteredBooks = useMemo(
    () =>
      sourceCatalog.filter((book) => {
        if (levelFilter !== 'all' && !book.levelTags.includes(levelFilter as (typeof ATOM_SOURCE_LEVELS)[number])) return false;
        if (domainFilter !== 'all' && book.domain !== domainFilter) return false;
        if (!showPendingSources && book.availabilityStatus && book.availabilityStatus !== 'indexed_ready') return false;
        return true;
      }),
    [domainFilter, levelFilter, showPendingSources, sourceCatalog],
  );

  const groupedBooks = useMemo(() => {
    return ATOM_SOURCE_LEVELS.map((lv) => ({
      level: lv,
      items: filteredBooks.filter((b) => b.levelTags.includes(lv)),
    })).filter((g) => g.items.length > 0);
  }, [filteredBooks]);

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
          context: domainFilter === 'all' ? 'surgery' : domainFilter,
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
  }, [composerText, domainFilter, hasSourcesSelected, isSubmitting, selectedBookIds, selectedRoomId]);

  // ─── Feedback handler ───
  const handleFeedback = useCallback((messageId: string, type: 'helpful' | 'needs_fix') => {
    setFeedbackState((prev) => ({
      ...prev,
      [messageId]: {
        type: prev[messageId]?.type === type ? null : type,
        text: prev[messageId]?.text ?? '',
        resolved: prev[messageId]?.resolved ?? false,
        showInput: type === 'needs_fix',
      },
    }));
  }, []);

  // ─── Toggle book ───
  const toggleBook = (bookId: string) => {
    setSelectedBookIds((prev) => prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]);
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
    <div className="h-full flex flex-col bg-[linear-gradient(140deg,#060C17,#0F1F30_35%,#080F1A)] text-white">
      {/* ─── MOBILE TAB BAR ─── */}
      <div className="md:hidden flex border-b border-[#1E3A5F]">
        {(['context', 'consult', 'outputs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${mobileTab === tab
              ? 'text-[#7DD3FC] border-b-2 border-[#5BB3B3] bg-[#5BB3B3]/5'
              : 'text-[#64748B]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0">
        {/* ═══════════════════════════════════════════════════════
           LEFT PANE — CONTEXT COCKPIT
           ═══════════════════════════════════════════════════════ */}
        <aside
          className={`
            ${leftPaneOpen ? 'w-[300px]' : 'w-0'}
            transition-all duration-200 shrink-0 overflow-hidden
             border-r border-[#1E3A5F]/50 bg-[#0a1525]/80 backdrop-blur-xl
             hidden md:flex flex-col
            ${mobileTab === 'context' ? '!flex !w-full md:!w-[300px]' : ''}
          `}
        >
          {/* Header */}
          <div className="h-12 px-3 border-b border-[#1E3A5F] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={() => setLeftPaneOpen((v) => !v)} className="p-1.5 rounded-md hover:bg-[#1E3A5F]/50 text-[#9FB0C2] hidden md:flex">
                {leftPaneOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
              </button>
              <span className="text-xs font-semibold text-[#D7E3EF]">Context Cockpit</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5BB3B3]/10 border border-[#5BB3B3]/30 text-[#7DD3FC]">
              {selectedBookIds.length} sources
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-5">
            {/* ── Source Catalog ── */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Source Catalog
              </p>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="h-7 rounded-lg bg-[#162535] border border-[#1E3A5F] text-[11px] px-2 text-[#BFDBFE] focus:outline-none focus:border-[#5BB3B3]/50"
                >
                  <option value="all">All levels</option>
                  {ATOM_SOURCE_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                </select>
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="h-7 rounded-lg bg-[#162535] border border-[#1E3A5F] text-[11px] px-2 text-[#BFDBFE] focus:outline-none focus:border-[#5BB3B3]/50"
                >
                  {domains.map((d) => <option key={d} value={d}>{d === 'all' ? 'All domains' : d}</option>)}
                </select>
              </div>

              {sourcesLoading ? (
                <div className="flex items-center gap-2 py-4 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-[#5BB3B3]" />
                  <span className="text-xs text-[#64748B]">Loading sources...</span>
                </div>
              ) : groupedBooks.length === 0 ? (
                <p className="text-xs text-[#64748B] text-center py-4">No sources match filters</p>
              ) : (
                <div className="space-y-3">
                  {groupedBooks.map((group) => (
                    <div key={group.level}>
                      <p className="text-[10px] uppercase tracking-wider text-[#5BB3B3]/70 mb-1.5">{group.level}</p>
                      <div className="space-y-1">
                        {group.items.map((book) => {
                          const selected = selectedBookIds.includes(book.id);
                          const disabled = !!book.availabilityStatus && book.availabilityStatus !== 'indexed_ready';
                          return (
                            <button
                              key={book.id}
                              disabled={disabled}
                              onClick={() => toggleBook(book.id)}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${selected
                                ? 'bg-[#5BB3B3]/10 border border-[#5BB3B3]/40'
                                : 'border border-[#1E3A5F] hover:bg-[#1E3A5F]/40'
                                } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              <span className="text-[11px] text-[#D7E3EF] truncate">{book.shortTitle}</span>
                              {disabled ? (
                                <Lock className="w-3 h-3 text-[#64748B] shrink-0" />
                              ) : (
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 transition-colors ${selected ? 'text-[#5BB3B3]' : 'text-[#1E3A5F]'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Topic & Goal ── */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                <Target className="w-3 h-3" /> Topic & Goal
              </p>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Current topic..."
                className="w-full h-8 rounded-lg bg-[#162535] border border-[#1E3A5F] text-xs px-3 text-[#BFDBFE] placeholder:text-[#4A6378] focus:outline-none focus:border-[#5BB3B3]/50 mb-1.5"
              />
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Learning objective..."
                className="w-full h-8 rounded-lg bg-[#162535] border border-[#1E3A5F] text-xs px-3 text-[#BFDBFE] placeholder:text-[#4A6378] focus:outline-none focus:border-[#5BB3B3]/50"
              />
            </div>

            {/* ── Profile Preferences ── */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                <Settings className="w-3 h-3" /> Preferences
              </p>

              {/* Response Style */}
              <p className="text-[10px] text-[#64748B] mb-1">Response Style</p>
              <div className="flex gap-1 mb-2.5">
                {RESPONSE_STYLES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setResponseStyle(value)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] transition-all ${responseStyle === value
                      ? 'bg-[#5BB3B3]/15 border border-[#5BB3B3]/40 text-[#7DD3FC]'
                      : 'border border-[#1E3A5F] text-[#64748B] hover:bg-[#1E3A5F]/30'
                      }`}
                  >
                    <Icon className="w-3 h-3" /> {label}
                  </button>
                ))}
              </div>

              {/* Difficulty */}
              <p className="text-[10px] text-[#64748B] mb-1">Difficulty</p>
              <div className="flex gap-1 mb-2.5">
                {DIFFICULTY_LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] transition-all ${difficulty === value
                      ? 'bg-[#A78BFA]/15 border border-[#A78BFA]/40 text-[#C4B5FD]'
                      : 'border border-[#1E3A5F] text-[#64748B] hover:bg-[#1E3A5F]/30'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Format */}
              <p className="text-[10px] text-[#64748B] mb-1">Format</p>
              <div className="grid grid-cols-4 gap-1">
                {FORMAT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFormat(value)}
                    className={`py-1.5 rounded-lg text-[10px] transition-all ${format === value
                      ? 'bg-[#60A5FA]/15 border border-[#60A5FA]/40 text-[#93C5FD]'
                      : 'border border-[#1E3A5F] text-[#64748B] hover:bg-[#1E3A5F]/30'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Quality Ops ── */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Quality Ops
              </p>
              <div className="space-y-1.5">
                <div className="rounded-lg border border-[#1E3A5F] bg-[#162535]/50 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#34D399]" />
                    <span className="text-[11px] text-[#BFDBFE]">Calibration</span>
                  </div>
                  <span className="text-[10px] text-[#34D399]">Good</span>
                </div>
                <div className="rounded-lg border border-[#1E3A5F] bg-[#162535]/50 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span className="text-[11px] text-[#BFDBFE]">Alerts</span>
                  </div>
                  <span className="text-[10px] text-[#64748B]">None</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════
           CENTER PANE — CLINICAL CONSULT
           ═══════════════════════════════════════════════════════ */}
        <main
          className={`flex-1 min-w-0 flex flex-col ${mobileTab !== 'consult' ? 'hidden md:flex' : 'flex'
            }`}
        >
          {/* Session Header */}
          <div className="h-12 border-b border-[#1E3A5F]/50 px-4 flex items-center justify-between bg-[#0a1525]/80 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setLeftPaneOpen((v) => !v)}
                className="p-1.5 rounded-md hover:bg-[#1E3A5F]/50 text-[#9FB0C2] hidden md:flex"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              <Brain className="w-4 h-4 text-[#5BB3B3] shrink-0" />
              <h1 className="text-sm font-semibold truncate text-[#E5EEF8]">ATOM Studio</h1>

              {/* Room badge */}
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value as AtomRoomId)}
                className="h-6 rounded-md bg-[#162535] border border-[#1E3A5F] text-[10px] px-1.5 text-[#7DD3FC] focus:outline-none"
              >
                {(Object.keys(ATOM_ROOM_PROFILES) as AtomRoomId[]).map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>

              {/* Status badge */}
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border"
                style={{
                  color: STATUS_CONFIG[connectionStatus]?.color ?? '#64748B',
                  borderColor: `${STATUS_CONFIG[connectionStatus]?.color ?? '#64748B'}40`,
                  background: `${STATUS_CONFIG[connectionStatus]?.color ?? '#64748B'}10`,
                }}
              >
                {STATUS_CONFIG[connectionStatus]?.label ?? 'Idle'}
              </span>

              {sessionId && (
                <span className="text-[10px] text-[#4A6378] hidden lg:inline">
                  Session: {sessionId.slice(0, 8)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRightPaneOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E3A5F] text-xs text-[#BFDBFE] hover:bg-[#1E3A5F]/30 transition-colors"
              >
                <PanelRight className="w-3.5 h-3.5" /> Outputs
                {artifacts.length > 0 && (
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#5BB3B3]/20 text-[9px] text-[#7DD3FC]">
                    {artifacts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                {/* Animated nucleus icon */}
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-[#5BB3B3]/5 blur-2xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5BB3B3]/15 to-[#A78BFA]/5 border border-[#5BB3B3]/20 flex items-center justify-center shadow-[0_0_40px_rgba(91,179,179,0.1)]">
                    <Brain className="w-10 h-10 text-[#5BB3B3]" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-[#E5EEF8] mb-2">ATOM Studio</h2>
                  <p className="text-sm text-[#5A7A8F] max-w-sm leading-relaxed">
                    {hasSourcesSelected
                      ? 'Source-grounded clinical intelligence. Ask anything about your selected sources.'
                      : 'Open the Context Cockpit to select sources and configure your session.'}
                  </p>
                </div>

                {/* Template pills */}
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {COMPOSER_TEMPLATES.map(({ icon: Icon, label, prompt }) => (
                    <button
                      key={label}
                      onClick={() => applyTemplate(prompt)}
                      disabled={!hasSourcesSelected}
                      className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-[#1E3A5F]/60 bg-[#0B1726]/40 text-xs text-[#7A9BB5] hover:border-[#5BB3B3]/40 hover:bg-[#5BB3B3]/5 hover:text-[#7DD3FC] transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#5BB3B3]/60 group-hover:text-[#5BB3B3]" /> {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((msg) => {
                  const fb = feedbackState[msg.id];
                  return (
                    <div key={msg.id}>
                      {/* Message bubble */}
                      <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                        {/* ATOM Avatar for assistant */}
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5BB3B3]/20 to-[#A78BFA]/10 border border-[#5BB3B3]/25 flex items-center justify-center shrink-0 mt-1">
                            <Brain className="w-3.5 h-3.5 text-[#5BB3B3]" />
                          </div>
                        )}
                        <div
                          className={`max-w-[82%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-[#5BB3B3]/12 to-[#5BB3B3]/6 border border-[#5BB3B3]/25'
                            : msg.role === 'system'
                              ? 'bg-[#F87171]/8 border border-[#F87171]/25'
                              : 'border border-[#1E3A5F]/40 bg-[#0F1F30]/60 backdrop-blur-sm'
                            }`}
                        >
                          {msg.role === 'assistant' ? (
                            <MedicalMarkdown
                              content={msg.content}
                              className="text-[13px] leading-6 [&_strong]:text-[#7DD3FC] [&_em]:text-[#A5F3FC] [&_h1]:text-[#E5EEF8] [&_h2]:text-[#D2E6FF] [&_h3]:text-[#BFDBFE]"
                            />
                          ) : (
                            <p className={`text-[13px] ${msg.role === 'system' ? 'text-[#FCA5A5]' : 'text-[#E7F8F8]'} whitespace-pre-wrap`}>
                              {msg.content}
                            </p>
                          )}
                          <p className="text-[10px] text-[#4A6378] mt-1.5">{formatTimestamp(msg.timestamp)}</p>
                        </div>
                      </div>

                      {/* Feedback controls (assistant messages only) */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-1.5 ml-1">
                          <button
                            onClick={() => handleFeedback(msg.id, 'helpful')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${fb?.type === 'helpful'
                              ? 'bg-[#34D399]/15 border border-[#34D399]/40 text-[#34D399]'
                              : 'text-[#4A6378] hover:text-[#8FB6D9] hover:bg-[#1E3A5F]/30'
                              }`}
                          >
                            <ThumbsUp className="w-3 h-3" /> Helpful
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'needs_fix')}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${fb?.type === 'needs_fix'
                              ? 'bg-[#FB923C]/15 border border-[#FB923C]/40 text-[#FB923C]'
                              : 'text-[#4A6378] hover:text-[#8FB6D9] hover:bg-[#1E3A5F]/30'
                              }`}
                          >
                            <Wrench className="w-3 h-3" /> Needs Fix
                          </button>

                          {fb?.showInput && (
                            <input
                              value={fb.text}
                              onChange={(e) =>
                                setFeedbackState((prev) => ({
                                  ...prev,
                                  [msg.id]: { ...prev[msg.id], text: e.target.value },
                                }))
                              }
                              placeholder="What needs fixing?"
                              className="flex-1 h-6 rounded-md bg-[#162535] border border-[#1E3A5F] text-[10px] px-2 text-[#BFDBFE] placeholder:text-[#4A6378] focus:outline-none focus:border-[#FB923C]/50"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {isSubmitting && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5BB3B3]/20 to-[#A78BFA]/10 border border-[#5BB3B3]/25 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="w-3.5 h-3.5 text-[#5BB3B3] animate-pulse" />
                    </div>
                    <div className="rounded-2xl border border-[#1E3A5F]/40 bg-[#0F1F30]/60 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#5BB3B3] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#5BB3B3] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#5BB3B3] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-[#5A7A8F]">ATOM is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Error card */}
          {errorCard && (
            <div className="mx-4 mb-2 rounded-xl border border-[#F87171]/30 bg-[#F87171]/10 px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs text-[#FCA5A5]">{errorCard}</p>
              <button onClick={() => setErrorCard(null)} className="text-[#F87171] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Composer */}
          <div className="shrink-0 px-4 pb-4 pt-2">
            <div className="max-w-3xl mx-auto">
              {/* Templates */}
              {showTemplates && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {COMPOSER_TEMPLATES.map(({ icon: Icon, label, prompt }) => (
                    <button
                      key={label}
                      onClick={() => applyTemplate(prompt)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#1E3A5F] text-[10px] text-[#8FB6D9] hover:border-[#5BB3B3]/40 hover:bg-[#5BB3B3]/5 transition-all"
                    >
                      <Icon className="w-3 h-3" /> {label}
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-2xl border border-[#1E3A5F]/50 bg-[#0a1525]/90 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(91,179,179,0.05)] p-3">
                {/* No sources warning */}
                {!hasSourcesSelected && (
                  <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/30">
                    <Lock className="w-3 h-3 text-[#FBBF24]" />
                    <span className="text-[10px] text-[#FBBF24]">Select at least one source to send a message</span>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setShowTemplates((v) => !v)}
                      className="p-1.5 rounded-md hover:bg-[#1E3A5F]/50 text-[#64748B] hover:text-[#8FB6D9] transition-colors"
                      title="Templates"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-[#1E3A5F]/50 text-[#64748B] hover:text-[#8FB6D9] transition-colors" title="Attach file">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
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
                    className="flex-1 min-h-[48px] max-h-36 bg-transparent text-sm leading-6 text-[#E5EEF8] placeholder:text-[#4A6378] resize-none focus:outline-none disabled:opacity-40"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!composerText.trim() || isSubmitting || !hasSourcesSelected}
                    className="h-9 w-9 rounded-xl bg-[#5BB3B3] hover:bg-[#45a1a1] text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-1">
                  <p className="text-[10px] text-[#4A6378]">
                    {selectedBookIds.length} sources · {responseStyle} · {difficulty}
                  </p>
                  <p className="text-[10px] text-[#4A6378]">Shift+Enter for newline</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════
           RIGHT PANE — OUTPUTS RAIL
           ═══════════════════════════════════════════════════════ */}
        <aside
          className={`
            ${rightPaneOpen ? 'w-[320px]' : 'w-0'}
            transition-all duration-200 shrink-0 overflow-hidden
            border-l border-[#1E3A5F] bg-[#0a1525]/90
            hidden md:flex flex-col
            ${mobileTab === 'outputs' ? '!flex !w-full md:!w-[320px]' : ''}
          `}
        >
          {/* Header */}
          <div className="h-12 px-3 border-b border-[#1E3A5F] flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-[#D7E3EF]">Outputs</span>
            <button
              onClick={() => setRightPaneOpen(false)}
              className="text-xs text-[#64748B] hover:text-[#BFDBFE] hidden md:inline"
            >
              Hide
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            {/* Timeline */}
            <div className="border-b border-[#1E3A5F] p-3 overflow-y-auto max-h-[40%]">
              <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Timeline
              </p>
              {timeline.length === 0 ? (
                <p className="text-xs text-[#4A6378]">No events yet</p>
              ) : (
                <div className="space-y-1.5">
                  {timeline.map((item) => (
                    <div key={item.id} className="rounded-lg border border-[#1E3A5F] bg-[#162535]/50 p-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-[#BFDBFE]">{item.label}</p>
                        <span className="text-[9px] text-[#4A6378]">{formatTimestamp(item.ts)}</span>
                      </div>
                      {item.detail && (
                        <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{item.detail}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Artifacts */}
            <div className="flex-1 p-3 overflow-y-auto">
              <p className="text-[10px] uppercase tracking-wider text-[#7DD3FC] mb-2 flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Artifacts
              </p>
              {artifacts.length === 0 ? (
                <p className="text-xs text-[#4A6378]">No artifacts yet</p>
              ) : (
                <div className="space-y-2">
                  {artifacts.map((artifact) => (
                    <div key={artifact.id} className="rounded-xl border border-[#1E3A5F] bg-[#162535]/50 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-[#BFDBFE]">{artifact.title}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#5BB3B3]/10 border border-[#5BB3B3]/30 text-[#7DD3FC]">
                          {artifact.kind}
                        </span>
                      </div>
                      {artifact.content && (
                        <pre className="text-[10px] text-[#8FB6D9] whitespace-pre-wrap max-h-24 overflow-hidden mb-2">
                          {artifact.content.slice(0, 200)}
                          {artifact.content.length > 200 && '...'}
                        </pre>
                      )}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyArtifact(artifact.content ?? '')}
                          className="flex items-center gap-1 px-2 py-1 rounded-md border border-[#1E3A5F] text-[10px] text-[#64748B] hover:text-[#BFDBFE] hover:bg-[#1E3A5F]/30 transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 rounded-md border border-[#1E3A5F] text-[10px] text-[#64748B] hover:text-[#BFDBFE] hover:bg-[#1E3A5F]/30 transition-colors">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                      <p className="text-[9px] text-[#4A6378] mt-1.5">{formatTimestamp(artifact.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
