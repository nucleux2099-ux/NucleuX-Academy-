"use client";

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrackEvent } from '@/lib/api/hooks';
import { QUICK_START_LEVELS, QUICK_START_MODES, type QuickStartMode } from '@/lib/atom/quick-start-schema';
import { ChevronDown, Loader2, Sparkles, Stethoscope } from 'lucide-react';

type IntentModeConfig = {
  id: QuickStartMode;
  title: string;
  summary: string;
};

const INTENT_MODES: IntentModeConfig[] = [
  { id: 'ppt', title: 'PPT', summary: 'Turn a topic into a rapid slide-ready teaching outline.' },
  { id: 'nucleux-original', title: 'NucleuX Original', summary: 'Native long-form teaching flow with clinical reasoning.' },
  { id: 'mcq', title: 'MCQ', summary: 'Exam-style questions with focused explanation.' },
  { id: 'flashcards', title: 'Flashcards', summary: 'Fast recall deck for active retrieval practice.' },
  { id: 'excel-analysis', title: 'Excel Analysis', summary: 'Analyze workbook data into clear decisions.' },
  { id: 'guided-deep-dive', title: 'Guided Deep Dive', summary: 'Stepwise concept mastery for difficult topics.' },
];

const DEFAULTS = {
  mode: 'mcq' as QuickStartMode,
  topic: 'General Surgery high-yield revision',
  level: 'resident',
  timeAvailable: '25',
  goal: 'Build exam-ready recall with concise, practical output',
};

export default function AtomV3Experience({ advancedVisible }: { advancedVisible: boolean }) {
  const router = useRouter();
  const { trackEvent } = useTrackEvent();

  const [mode, setMode] = useState<QuickStartMode>(DEFAULTS.mode);
  const [topic, setTopic] = useState(DEFAULTS.topic);
  const [level, setLevel] = useState(DEFAULTS.level);
  const [timeAvailable, setTimeAvailable] = useState(DEFAULTS.timeAvailable);
  const [goal, setGoal] = useState(DEFAULTS.goal);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [preferredFormat, setPreferredFormat] = useState('bullet');
  const [includeReferences, setIncludeReferences] = useState(false);
  const [clinicalContext, setClinicalContext] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [taskMeta, setTaskMeta] = useState<{ taskId?: string; eventsUrl?: string } | null>(null);

  const selectedMode = useMemo(() => INTENT_MODES.find((m) => m.id === mode), [mode]);

  const selectMode = (nextMode: QuickStartMode) => {
    setMode(nextMode);
    setSuccess(null);
    setError(null);
    void trackEvent('intent_selected', { mode: nextMode, source: 'atom_v3_intent_card' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setNextPath(null);
    setTaskMeta(null);

    const payload = {
      mode,
      topic,
      level,
      timeAvailable,
      goal,
      advanced: advancedVisible
        ? {
            preferredFormat,
            includeReferences,
            clinicalContext,
          }
        : undefined,
    };

    void trackEvent('quickstart_submitted', {
      mode,
      level,
      time_available: Number(timeAvailable),
      has_advanced: advancedVisible && advancedOpen,
      source: 'atom_v3_quickstart',
    });

    try {
      const res = await fetch('/api/atom-v3/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        error?: string;
        launchPath?: string;
        message?: string;
        workflow?: string;
        taskId?: string;
        eventsUrl?: string;
      };
      if (!res.ok || !data.launchPath) {
        throw new Error(data.error ?? 'Unable to launch workflow right now');
      }

      setSuccess(data.message ?? 'Mode launched successfully.');
      setNextPath(data.launchPath);
      setTaskMeta({ taskId: data.taskId, eventsUrl: data.eventsUrl });
      void trackEvent('mode_launched', {
        mode,
        workflow: data.workflow,
        launch_path: data.launchPath,
        task_id: data.taskId,
        events_url: data.eventsUrl,
        source: 'atom_v3_quickstart',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Launch failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto w-full max-w-5xl space-y-4 md:space-y-5">
        <Card className="border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-xs text-cyan-200"><Stethoscope className="h-3.5 w-3.5" /> Doctor-first workflow</p>
              <h1 className="mt-1 text-lg font-semibold text-slate-50 md:text-xl">ATOM v3 Intent Card</h1>
              <p className="mt-1 text-xs text-slate-300 md:text-sm">Pick a mode, set a compact brief, launch in under 30 seconds.</p>
            </div>
            <Badge className="border-cyan-500/40 bg-cyan-500/10 text-cyan-200">v3</Badge>
          </div>
        </Card>

        <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {INTENT_MODES.map((item) => {
            const active = item.id === mode;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => selectMode(item.id)}
                className={`rounded-xl border p-3 text-left transition ${active ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}`}
              >
                <p className={`text-sm font-medium ${active ? 'text-cyan-200' : 'text-slate-100'}`}>{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{item.summary}</p>
              </button>
            );
          })}
        </section>

        <Card className="border-slate-800 bg-slate-900/70 p-4 md:p-5">
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs text-slate-300">Mode</span>
                <select value={mode} onChange={(e) => selectMode(e.target.value as QuickStartMode)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100">
                  {QUICK_START_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-slate-300">Level</span>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100">
                  {QUICK_START_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>
            </div>

            <label className="space-y-1 block">
              <span className="text-xs text-slate-300">Topic</span>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Portal hypertension" className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100" />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr]">
              <label className="space-y-1">
                <span className="text-xs text-slate-300">Time available (min)</span>
                <input value={timeAvailable} onChange={(e) => setTimeAvailable(e.target.value)} inputMode="numeric" className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-slate-300">Goal</span>
                <input value={goal} onChange={(e) => setGoal(e.target.value)} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100" />
              </label>
            </div>

            {advancedVisible && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/60">
                <button type="button" className="flex w-full items-center justify-between px-3 py-2 text-xs text-slate-300" onClick={() => setAdvancedOpen((v) => !v)}>
                  Advanced controls
                  <ChevronDown className={`h-4 w-4 transition ${advancedOpen ? 'rotate-180' : ''}`} />
                </button>
                {advancedOpen && (
                  <div className="space-y-2 border-t border-slate-800 px-3 py-3">
                    <label className="space-y-1 block">
                      <span className="text-xs text-slate-300">Preferred format</span>
                      <input value={preferredFormat} onChange={(e) => setPreferredFormat(e.target.value)} className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100" />
                    </label>
                    <label className="space-y-1 block">
                      <span className="text-xs text-slate-300">Clinical context</span>
                      <input value={clinicalContext} onChange={(e) => setClinicalContext(e.target.value)} className="h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100" />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300">
                      <input type="checkbox" checked={includeReferences} onChange={(e) => setIncludeReferences(e.target.checked)} /> Include references
                    </label>
                  </div>
                )}
              </div>
            )}

            {selectedMode && <p className="text-xs text-slate-400">Selected: <span className="text-slate-200">{selectedMode.title}</span> · {selectedMode.summary}</p>}

            {error && <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</p>}
            {success && <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">{success}</p>}
            {taskMeta?.taskId && (
              <p className="text-[11px] text-slate-400">Task: {taskMeta.taskId} {taskMeta.eventsUrl ? `· Events: ${taskMeta.eventsUrl}` : ''}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 text-white hover:bg-cyan-500">
                {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />} Launch {selectedMode?.title ?? 'mode'}
              </Button>
              {nextPath && (
                <Button type="button" variant="outline" className="border-slate-700 text-slate-100" onClick={() => router.push(nextPath)}>
                  Open workflow
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
